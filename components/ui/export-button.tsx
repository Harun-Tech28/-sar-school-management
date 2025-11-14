"use client"

import { Download, FileText, FileSpreadsheet, Printer } from "lucide-react"
import { useState } from "react"

interface ExportButtonProps {
  data: any[]
  filename: string
  onExportPDF?: () => void
  onExportExcel?: () => void
  onExportCSV?: () => void
  onPrint?: () => void
}

export function ExportButton({ 
  data, 
  filename, 
  onExportPDF, 
  onExportExcel, 
  onExportCSV,
  onPrint 
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-[#E31E24] text-white rounded-lg hover:bg-[#c91a1f] transition-colors shadow-md"
      >
        <Download size={18} />
        <span className="font-medium">Export</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
            {onExportPDF && (
              <button
                onClick={() => {
                  onExportPDF()
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <FileText size={18} className="text-red-600" />
                <div>
                  <p className="font-medium text-gray-900">Export as PDF</p>
                  <p className="text-xs text-gray-500">Professional document</p>
                </div>
              </button>
            )}
            
            {onExportExcel && (
              <button
                onClick={() => {
                  onExportExcel()
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-t border-gray-100"
              >
                <FileSpreadsheet size={18} className="text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Export as Excel</p>
                  <p className="text-xs text-gray-500">Spreadsheet format</p>
                </div>
              </button>
            )}
            
            {onExportCSV && (
              <button
                onClick={() => {
                  onExportCSV()
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-t border-gray-100"
              >
                <FileText size={18} className="text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Export as CSV</p>
                  <p className="text-xs text-gray-500">Comma-separated values</p>
                </div>
              </button>
            )}
            
            {onPrint && (
              <button
                onClick={() => {
                  onPrint()
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-t border-gray-100"
              >
                <Printer size={18} className="text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">Print</p>
                  <p className="text-xs text-gray-500">Send to printer</p>
                </div>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
