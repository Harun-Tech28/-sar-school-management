import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/finance/budgets/analysis - Budget vs actual analysis
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const academicYear = searchParams.get('academicYear');
    const term = searchParams.get('term');

    if (!academicYear) {
      return NextResponse.json(
        { error: 'Academic year is required' },
        { status: 400 }
      );
    }

    const where: any = { academicYear };
    if (term) {
      where.term = term;
    }

    // Get all budgets for the period
    const budgets = await prisma.budget.findMany({
      where,
      orderBy: { category: 'asc' },
    });

    // Calculate category-wise analysis
    const categoryAnalysis = budgets.reduce((acc: any, budget) => {
      const key = budget.category;
      if (!acc[key]) {
        acc[key] = {
          category: key,
          allocated: 0,
          spent: 0,
          remaining: 0,
          utilizationRate: 0,
          subcategories: [],
        };
      }

      acc[key].allocated += budget.amount;
      acc[key].spent += budget.spent;
      acc[key].remaining += (budget.amount - budget.spent);

      if (budget.subcategory) {
        acc[key].subcategories.push({
          name: budget.subcategory,
          allocated: budget.amount,
          spent: budget.spent,
          remaining: budget.amount - budget.spent,
          utilizationRate: budget.amount > 0 
            ? Math.round((budget.spent / budget.amount) * 10000) / 100 
            : 0,
        });
      }

      return acc;
    }, {});

    // Calculate utilization rates
    Object.values(categoryAnalysis).forEach((cat: any) => {
      cat.utilizationRate = cat.allocated > 0 
        ? Math.round((cat.spent / cat.allocated) * 10000) / 100 
        : 0;
    });

    // Overall summary
    const totalAllocated = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const totalRemaining = totalAllocated - totalSpent;
    const overallUtilization = totalAllocated > 0 
      ? Math.round((totalSpent / totalAllocated) * 10000) / 100 
      : 0;

    // Identify budgets needing attention
    const overBudget = budgets.filter(b => b.spent > b.amount);
    const nearLimit = budgets.filter(b => {
      const utilization = b.amount > 0 ? (b.spent / b.amount) * 100 : 0;
      return utilization >= 80 && utilization <= 100;
    });
    const underUtilized = budgets.filter(b => {
      const utilization = b.amount > 0 ? (b.spent / b.amount) * 100 : 0;
      return utilization < 50;
    });

    return NextResponse.json({
      summary: {
        totalAllocated,
        totalSpent,
        totalRemaining,
        overallUtilization,
        budgetCount: budgets.length,
      },
      categoryAnalysis: Object.values(categoryAnalysis),
      alerts: {
        overBudget: overBudget.map(b => ({
          id: b.id,
          category: b.category,
          subcategory: b.subcategory,
          allocated: b.amount,
          spent: b.spent,
          overspent: b.spent - b.amount,
        })),
        nearLimit: nearLimit.map(b => ({
          id: b.id,
          category: b.category,
          subcategory: b.subcategory,
          allocated: b.amount,
          spent: b.spent,
          remaining: b.amount - b.spent,
          utilizationRate: Math.round((b.spent / b.amount) * 10000) / 100,
        })),
        underUtilized: underUtilized.map(b => ({
          id: b.id,
          category: b.category,
          subcategory: b.subcategory,
          allocated: b.amount,
          spent: b.spent,
          utilizationRate: Math.round((b.spent / b.amount) * 10000) / 100,
        })),
      },
    });
  } catch (error) {
    console.error('Error generating budget analysis:', error);
    return NextResponse.json(
      { error: 'Failed to generate budget analysis' },
      { status: 500 }
    );
  }
}
