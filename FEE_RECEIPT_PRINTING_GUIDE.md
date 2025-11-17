# Fee Receipt Printing Feature - Implementation Guide

## Overview

This guide explains how to add a receipt printing feature to the fee management system with school logo watermark.

## Requirements

1. View student payment records
2. Print receipt button for each payment
3. Professional receipt layout with school logo
4. Logo displayed as watermark (transparent background)
5. Print-friendly format

## Implementation Steps

### Step 1: Add Print Button to Fee Management Page

Update `app/dashboard/admin/fee-management/page.tsx`:

```typescript
import { Printer } from "lucide-react"

// In the table row, add a print button:
<TableCell>
  <Button
    variant="outline"
    size="sm"
    onClick={() => printReceipt(payment)}
  >
    <Printer size={16} className="mr-2" />
    Print Receipt
  </Button>
</TableCell>
```

### Step 2: Create Receipt Component

Create `components/receipts/fee-receipt.tsx`:

```typescript
"use client"

import { useRef } from "react"
import { useReactToPrint } from "react-to-print"

interface FeeReceiptProps {
  payment: {
    id: string
    amount: number
    paymentMethod: string
    term: string
    academicYear: string
    receiptNumber: string
    paymentDate: string
    student: {
      rollNumber: string
      user: {
        fullName: string
      }
      class: {
        name: string
      } | null
    }
  }
  onClose: () => void
}

export function FeeReceipt({ payment, onClose }: FeeReceiptProps) {
  const componentRef = useRef(null)

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Receipt-${payment.receiptNumber}`,
    onAfterPrint: () => onClose(),
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Fee Receipt</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Print
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div ref={componentRef} className="print-content">
          <style jsx global>{`
            @media print {
              body * {
                visibility: hidden;
              }
              .print-content,
              .print-content * {
                visibility: visible;
              }
              .print-content {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
              }
              .watermark {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                opacity: 0.1;
                z-index: -1;
                width: 400px;
                height: 400px;
              }
            }
          `}</style>

          {/* Watermark Logo */}
          <div className="watermark">
            <img
              src="/logo.png"
              alt="School Logo"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Receipt Header */}
          <div className="text-center mb-6 border-b-2 border-gray-300 pb-4">
            <div className="flex justify-center mb-2">
              <img
                src="/logo.png"
                alt="School Logo"
                className="h-20 w-20 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold">SCHOOL NAME</h1>
            <p className="text-sm text-gray-600">School Address</p>
            <p className="text-sm text-gray-600">Phone: +233 XXX XXX XXX</p>
            <p className="text-sm text-gray-600">Email: info@school.com</p>
          </div>

          {/* Receipt Title */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold">FEE PAYMENT RECEIPT</h2>
            <p className="text-sm text-gray-600">Receipt No: {payment.receiptNumber}</p>
          </div>

          {/* Receipt Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Date:</p>
              <p className="font-semibold">
                {new Date(payment.paymentDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Academic Year:</p>
              <p className="font-semibold">{payment.academicYear}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Student Name:</p>
              <p className="font-semibold">{payment.student.user.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Roll Number:</p>
              <p className="font-semibold">{payment.student.rollNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Class:</p>
              <p className="font-semibold">
                {payment.student.class?.name || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Term:</p>
              <p className="font-semibold">{payment.term}</p>
            </div>
          </div>

          {/* Payment Details Table */}
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Description</th>
                <th className="border border-gray-300 p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">
                  School Fees - {payment.term} ({payment.academicYear})
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  GH₵ {payment.amount.toFixed(2)}
                </td>
              </tr>
              <tr className="font-bold">
                <td className="border border-gray-300 p-2">Total Amount Paid</td>
                <td className="border border-gray-300 p-2 text-right">
                  GH₵ {payment.amount.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Payment Method */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">Payment Method:</p>
            <p className="font-semibold">{payment.paymentMethod}</p>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-gray-300 pt-4 mt-8">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-600 mb-8">Received By:</p>
                <div className="border-t border-gray-400 pt-1">
                  <p className="text-sm">Signature & Stamp</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-8">Verified By:</p>
                <div className="border-t border-gray-400 pt-1">
                  <p className="text-sm">Signature & Stamp</p>
                </div>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>This is an official receipt. Please keep for your records.</p>
            <p>For any queries, contact the school office.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Step 3: Install Required Package

```bash
npm install react-to-print
```

### Step 4: Add Logo to Public Folder

1. Place your school logo in `public/logo.png`
2. Ensure the logo has a transparent background (PNG format)
3. Recommended size: 512x512px or similar square dimensions

### Step 5: Update Fee Management Page

Add state and function to handle receipt printing:

```typescript
const [selectedPayment, setSelectedPayment] = useState<FeePayment | null>(null)

const printReceipt = (payment: FeePayment) => {
  setSelectedPayment(payment)
}

const closeReceipt = () => {
  setSelectedPayment(null)
}

// In the return statement, add:
{selectedPayment && (
  <FeeReceipt payment={selectedPayment} onClose={closeReceipt} />
)}
```

### Step 6: Add Print Button to Table

In the table body, add a new column:

```typescript
<TableRow key={payment.id}>
  {/* Existing cells */}
  <TableCell>
    <Button
      variant="outline"
      size="sm"
      onClick={() => printReceipt(payment)}
    >
      <Printer size={16} className="mr-2" />
      Print
    </Button>
  </TableCell>
</TableRow>
```

## Features Included

### 1. Professional Receipt Layout
- School header with logo
- Receipt number and date
- Student information
- Payment details table
- Signature sections
- Official footer

### 2. Logo Watermark
- Large transparent logo in background
- Visible when printed
- Doesn't interfere with text
- Professional appearance

### 3. Print Optimization
- Print-specific CSS
- Hides unnecessary UI elements
- Optimized page layout
- Clean, professional output

### 4. Receipt Information
- Student details (name, roll number, class)
- Payment details (amount, method, date)
- Academic year and term
- Receipt number for tracking
- Signature sections for verification

## Customization Options

### Change School Information

Update the header section in the receipt component:

```typescript
<h1 className="text-2xl font-bold">YOUR SCHOOL NAME</h1>
<p className="text-sm text-gray-600">Your School Address</p>
<p className="text-sm text-gray-600">Phone: +233 XXX XXX XXX</p>
<p className="text-sm text-gray-600">Email: info@yourschool.com</p>
```

### Adjust Watermark Opacity

In the print CSS:

```css
.watermark {
  opacity: 0.1; /* Change this value (0.05 - 0.2) */
}
```

### Change Currency

Replace `GH₵` with your currency symbol throughout the receipt.

### Add More Payment Details

Add additional rows to the payment details table:

```typescript
<tr>
  <td className="border border-gray-300 p-2">Additional Fee</td>
  <td className="border border-gray-300 p-2 text-right">
    GH₵ XX.XX
  </td>
</tr>
```

## Usage

1. Navigate to Fee Management page
2. Find the student's payment record
3. Click "Print Receipt" button
4. Review the receipt in the modal
5. Click "Print" to print or save as PDF
6. The receipt will include the school logo as a watermark

## Browser Print Settings

For best results, advise users to:
1. Use "Print to PDF" to save digital copies
2. Enable "Background graphics" in print settings
3. Use portrait orientation
4. Set margins to default or minimum

## Testing Checklist

- [ ] Logo displays correctly in header
- [ ] Watermark appears when printing
- [ ] All student information shows correctly
- [ ] Payment details are accurate
- [ ] Receipt number is unique
- [ ] Print layout is clean and professional
- [ ] Signature sections are visible
- [ ] Footer information is correct

## Security Considerations

1. Only authorized users (admin/finance) can print receipts
2. Receipt numbers are unique and traceable
3. Payment records are immutable
4. Audit trail maintained for all receipts

## Future Enhancements

1. Email receipt to parent/student
2. Bulk receipt printing
3. Receipt templates for different fee types
4. QR code for verification
5. Digital signature integration
6. Receipt history tracking

---

**Status:** Ready to Implement  
**Complexity:** Medium  
**Estimated Time:** 2-3 hours  
**Dependencies:** react-to-print package, school logo image

This feature will provide professional, official receipts for all fee payments with your school logo prominently displayed! 🎓
