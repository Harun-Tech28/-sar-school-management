# Comprehensive Financial Management System - Design

## Overview

This document outlines the design for a complete financial management system that tracks all school financial activities including income, expenses, salaries, budgets, assets, and provides comprehensive reporting and analytics.

## Architecture

### System Components

1. **Income Management Module**
   - Record all types of income
   - Generate receipts
   - Link to student records where applicable

2. **Expense Management Module**
   - Record all types of expenses
   - Approval workflows
   - Vendor management

3. **Payroll Module**
   - Salary management
   - Payslip generation
   - Deduction tracking

4. **Budget Module**
   - Budget creation and tracking
   - Budget vs actual analysis
   - Alerts and notifications

5. **Reporting Module**
   - Financial statements
   - Custom reports
   - Export functionality

6. **Analytics Dashboard**
   - Real-time financial metrics
   - Trend analysis
   - Visual charts and graphs

## Database Models

### Income Model
```prisma
model Income {
  id              String   @id @default(cuid())
  category        String   // FEES, DONATIONS, GRANTS, EVENTS, SALES, FUNDRAISING, INTEREST, OTHER
  subcategory     String?  
  amount          Float
  date            DateTime
  paymentMethod   String   // CASH, BANK_TRANSFER, MOBILE_MONEY, CHEQUE, CARD
  source          String   // Payer name
  sourceId        String?  // Student ID if applicable
  receiptNumber   String   @unique
  description     String?
  academicYear    String
  term            String?
  bankAccount     String?
  referenceNumber String?
  status          String   @default("COMPLETED") // PENDING, COMPLETED, CANCELLED
  recordedBy      String   // Admin user ID
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### Expense Model
```prisma
model Expense {
  id              String   @id @default(cuid())
  category        String   // SALARIES, UTILITIES, SUPPLIES, MAINTENANCE, TRANSPORT, FOOD, EVENTS, EQUIPMENT, OTHER
  subcategory     String?
  amount          Float
  date            DateTime
  paymentMethod   String
  vendor          String?
  vendorId        String?
  purpose         String
  voucherNumber   String   @unique
  invoiceNumber   String?
  academicYear    String
  term            String?
  bankAccount     String?
  approvedBy      String?
  approvalDate    DateTime?
  status          String   @default("PENDING") // PENDING, APPROVED, PAID, REJECTED
  attachments     String[] // URLs to receipts/invoices
  recordedBy      String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### Salary Model
```prisma
model Salary {
  id              String   @id @default(cuid())
  employeeId      String   // Teacher or Staff ID
  employeeType    String   // TEACHER, STAFF
  month           String   // YYYY-MM
  basicSalary     Float
  allowances      Float    @default(0)
  bonuses         Float    @default(0)
  grossSalary     Float
  deductions      Float    @default(0)
  netSalary       Float
  paymentDate     DateTime?
  paymentMethod   String?
  status          String   @default("PENDING") // PENDING, PAID, OVERDUE
  remarks         String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### Budget Model
```prisma
model Budget {
  id              String   @id @default(cuid())
  academicYear    String
  category        String
  subcategory     String?
  allocatedAmount Float
  spentAmount     Float    @default(0)
  remainingAmount Float
  status          String   @default("ACTIVE") // ACTIVE, REVISED, CLOSED
  notes           String?
  createdBy       String
  approvedBy      String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### Vendor Model
```prisma
model Vendor {
  id              String   @id @default(cuid())
  name            String
  contactPerson   String?
  phone           String
  email           String?
  address         String?
  category        String   // SUPPLIER, CONTRACTOR, SERVICE_PROVIDER, OTHER
  paymentTerms    String?  // NET_30, NET_60, IMMEDIATE, etc.
  bankDetails     String?
  taxId           String?
  status          String   @default("ACTIVE") // ACTIVE, INACTIVE
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### Asset Model
```prisma
model Asset {
  id              String   @id @default(cuid())
  name            String
  category        String   // FURNITURE, EQUIPMENT, VEHICLE, BUILDING, LAND, OTHER
  purchaseDate    DateTime
  purchasePrice   Float
  currentValue    Float
  depreciationRate Float   @default(0)
  location        String?
  condition       String   @default("GOOD") // EXCELLENT, GOOD, FAIR, POOR
  serialNumber    String?
  warranty        String?
  maintenanceSchedule String?
  lastMaintenance DateTime?
  status          String   @default("ACTIVE") // ACTIVE, DISPOSED, LOST, DAMAGED
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### BankAccount Model
```prisma
model BankAccount {
  id              String   @id @default(cuid())
  bankName        String
  accountName     String
  accountNumber   String   @unique
  accountType     String   // SAVINGS, CURRENT, FIXED_DEPOSIT
  branch          String?
  balance         Float    @default(0)
  currency        String   @default("GHS")
  status          String   @default("ACTIVE") // ACTIVE, CLOSED
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### PettyCash Model
```prisma
model PettyCash {
  id              String   @id @default(cuid())
  date            DateTime
  type            String   // DISBURSEMENT, REPLENISHMENT
  amount          Float
  purpose         String?
  receivedBy      String?
  approvedBy      String?
  voucherNumber   String?
  balance         Float
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

## API Endpoints

### Income Endpoints
- `POST /api/finance/income` - Record new income
- `GET /api/finance/income` - List all income (with filters)
- `GET /api/finance/income/:id` - Get income details
- `PUT /api/finance/income/:id` - Update income
- `DELETE /api/finance/income/:id` - Delete income
- `GET /api/finance/income/summary` - Get income summary

### Expense Endpoints
- `POST /api/finance/expenses` - Record new expense
- `GET /api/finance/expenses` - List all expenses (with filters)
- `GET /api/finance/expenses/:id` - Get expense details
- `PUT /api/finance/expenses/:id` - Update expense
- `PUT /api/finance/expenses/:id/approve` - Approve expense
- `DELETE /api/finance/expenses/:id` - Delete expense
- `GET /api/finance/expenses/summary` - Get expense summary

### Salary Endpoints
- `POST /api/finance/salaries` - Create salary record
- `GET /api/finance/salaries` - List all salaries
- `GET /api/finance/salaries/:id` - Get salary details
- `PUT /api/finance/salaries/:id` - Update salary
- `PUT /api/finance/salaries/:id/pay` - Mark as paid
- `GET /api/finance/salaries/payslip/:id` - Generate payslip

### Budget Endpoints
- `POST /api/finance/budgets` - Create budget
- `GET /api/finance/budgets` - List all budgets
- `GET /api/finance/budgets/:id` - Get budget details
- `PUT /api/finance/budgets/:id` - Update budget
- `GET /api/finance/budgets/analysis` - Budget vs actual analysis

### Reporting Endpoints
- `GET /api/finance/reports/income-statement` - Income statement
- `GET /api/finance/reports/cash-flow` - Cash flow statement
- `GET /api/finance/reports/balance-sheet` - Balance sheet
- `GET /api/finance/reports/budget-analysis` - Budget analysis
- `GET /api/finance/reports/vendor-payments` - Vendor payment report

### Dashboard Endpoints
- `GET /api/finance/dashboard/summary` - Financial summary
- `GET /api/finance/dashboard/trends` - Income/expense trends
- `GET /api/finance/dashboard/analytics` - Financial analytics

## User Interface

### Main Finance Dashboard
- Total income, expenses, and net balance cards
- Income vs expense chart (monthly/yearly)
- Category-wise breakdown pie charts
- Recent transactions list
- Quick action buttons
- Financial health indicators

### Income Management Page
- Income list with filters (date, category, source)
- Add income button
- Search and sort functionality
- Export to Excel/PDF
- Receipt generation

### Expense Management Page
- Expense list with filters
- Add expense button
- Approval workflow indicators
- Vendor quick links
- Voucher generation

### Salary Management Page
- Employee salary list
- Monthly payroll processing
- Payslip generation
- Payment status tracking
- Salary history

### Budget Management Page
- Budget overview by category
- Budget vs actual comparison
- Visual progress bars
- Budget alerts
- Revision history

### Reports Page
- Report type selector
- Date range picker
- Filter options
- Preview and export buttons
- Saved reports list

## Security and Permissions

### Role-Based Access
- **Admin**: Full access to all financial features
- **Accountant**: Can record and view all transactions, generate reports
- **Principal**: View-only access to reports and summaries
- **Teacher**: View own salary information only

### Audit Trail
- Log all financial transactions
- Track who created/modified records
- Timestamp all changes
- Maintain deletion history

## Integration Points

1. **Student Fee Management**: Link income records to student fee payments
2. **Teacher Records**: Link salary records to teacher profiles
3. **Notification System**: Send alerts for approvals, overdue payments
4. **Export System**: Generate PDF receipts, vouchers, and reports

## Error Handling

- Validate all financial amounts (positive numbers)
- Prevent duplicate receipt/voucher numbers
- Handle failed payment processing
- Validate budget constraints
- Handle concurrent transaction conflicts

## Testing Strategy

- Unit tests for calculation logic (salary, depreciation, budget)
- Integration tests for API endpoints
- End-to-end tests for complete workflows
- Test data validation and error handling
- Test report generation accuracy
