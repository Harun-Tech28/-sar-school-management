"use client"

import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { Button } from "@/components/ui/button"
import { Printer, X } from "lucide-react"
import { DEFAULT_SCHOOL_BRANDING } from "@/lib/school-branding"

interface FeeReceiptProps {
  payment: {
    id: string
    receiptNumber: string
    amount: number
    paymentMethod: string
    term: string
    academicYear: string
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
  onClose?: () => void
}

export function FeeReceipt({ payment, onClose }: FeeReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Receipt_${payment.receiptNumber}`,
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
        {/* Header Actions */}
        <div className="flex items-center justify-between p-4 border-b print:hidden">
          <h2 className="text-xl font-bold">Fee Receipt</h2>
          <div className="flex gap-2">
            <Button onClick={handlePrint} className="gap-2">
              <Printer size={18} />
              Print Receipt
            </Button>
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                <X size={18} />
              </Button>
            )}
          </div>
        </div>

        {/* Receipt Content */}
        <div ref={receiptRef} className="p-8 relative">
          {/* Watermark Logo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <img
              src={DEFAULT_SCHOOL_BRANDING.logo || "/school-logo.png"}
              alt="School Logo"
              className="w-96 h-96 object-contain"
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* School Header */}
            <div className="text-center mb-8 border-b-2 border-gray-800 pb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <img
                  src={DEFAULT_SCHOOL_BRANDING.logo || "/school-logo.png"}
                  alt="School Logo"
                  className="w-20 h-20 object-contain"
                />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {DEFAULT_SCHOOL_BRANDING.name}
                  </h1>
                  <p className="text-sm text-gray-600">{DEFAULT_SCHOOL_BRANDING.address}</p>
                  <p className="text-sm text-gray-600">
                    Tel: {DEFAULT_SCHOOL_BRANDING.phone} | Email: {DEFAULT_SCHOOL_BRANDING.email}
                  </p>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">FEE PAYMENT RECEIPT</h2>
            </div>

            {/* Receipt Details */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-sm text-gray-600">Receipt Number</p>
                <p className="text-lg font-bold text-gray-900">{payment.receiptNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(payment.paymentDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Student Information */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Student Name</p>
                  <p className="text-base font-semibold text-gray-900">
                    {payment.student.user.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Roll Number</p>
                  <p className="text-base font-semibold text-gray-900">
                    {payment.student.rollNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Class</p>
                  <p className="text-base font-semibold text-gray-900">
                    {payment.student.class?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Academic Year</p>
                  <p className="text-base font-semibold text-gray-900">{payment.academicYear}</p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="border-2 border-gray-800 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Term</span>
                  <span className="font-semibold text-gray-900">{payment.term}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-semibold text-gray-900">{payment.paymentMethod}</span>
                </div>
                <div className="border-t-2 border-gray-300 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Amount Paid</span>
                    <span className="text-2xl font-bold text-green-600">
                      GH₵ {payment.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-12 mt-12 pt-8 border-t border-gray-300">
              <div>
                <div className="border-t-2 border-gray-800 pt-2">
                  <p className="text-sm text-gray-600 text-center">Received By</p>
                  <p className="text-xs text-gray-500 text-center mt-1">
                    (Accountant/Bursar Signature)
                  </p>
                </div>
              </div>
              <div>
                <div className="border-t-2 border-gray-800 pt-2">
                  <p className="text-sm text-gray-600 text-center">Verified By</p>
                  <p className="text-xs text-gray-500 text-center mt-1">
                    (Head Teacher/Principal Signature)
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-300 text-center">
              <p className="text-xs text-gray-500">
                This is an official receipt. Please keep for your records.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                For any queries, contact: {DEFAULT_SCHOOL_BRANDING.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
