import { prisma } from "./prisma"

/**
 * Generate a unique receipt number in format: RCP-YYYY-XXXXX
 * Example: RCP-2025-00001
 */
export async function generateReceiptNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const prefix = `RCP-${year}-`

  // Get the last receipt number for this year
  const lastReceipt = await prisma.income.findFirst({
    where: {
      receiptNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      receiptNumber: "desc",
    },
    select: {
      receiptNumber: true,
    },
  })

  let nextNumber = 1

  if (lastReceipt) {
    // Extract the number part and increment
    const lastNumber = parseInt(lastReceipt.receiptNumber.split("-")[2])
    nextNumber = lastNumber + 1
  }

  // Pad with zeros to make it 5 digits
  const paddedNumber = nextNumber.toString().padStart(5, "0")

  return `${prefix}${paddedNumber}`
}

/**
 * Generate a unique voucher number in format: VCH-YYYY-XXXXX
 * Example: VCH-2025-00001
 */
export async function generateVoucherNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const prefix = `VCH-${year}-`

  // Get the last voucher number for this year
  const lastVoucher = await prisma.expense.findFirst({
    where: {
      invoiceNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      invoiceNumber: "desc",
    },
    select: {
      invoiceNumber: true,
    },
  })

  let nextNumber = 1

  if (lastVoucher && lastVoucher.invoiceNumber) {
    // Extract the number part and increment
    const lastNumber = parseInt(lastVoucher.invoiceNumber.split("-")[2])
    nextNumber = lastNumber + 1
  }

  // Pad with zeros to make it 5 digits
  const paddedNumber = nextNumber.toString().padStart(5, "0")

  return `${prefix}${paddedNumber}`
}

/**
 * Validate receipt number format
 */
export function isValidReceiptNumber(receiptNumber: string): boolean {
  const pattern = /^RCP-\d{4}-\d{5}$/
  return pattern.test(receiptNumber)
}

/**
 * Validate voucher number format
 */
export function isValidVoucherNumber(voucherNumber: string): boolean {
  const pattern = /^VCH-\d{4}-\d{5}$/
  return pattern.test(voucherNumber)
}
