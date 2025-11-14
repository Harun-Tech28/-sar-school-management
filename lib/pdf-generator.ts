import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { getSchoolBranding, getLogoForPDF, createFallbackLogo, type SchoolBranding } from './school-branding'

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable
  }
}

export class PDFGenerator {
  private doc: jsPDF
  private schoolInfo: SchoolBranding
  private logoBase64?: string

  constructor(schoolInfo?: SchoolBranding) {
    this.doc = new jsPDF()
    this.schoolInfo = schoolInfo || {
      name: 'SAR Educational Complex',
      address: 'Box 130, Sepe Sote, Hospital Junction, Kumasi',
      phone: '+233 24 000 0000',
      email: 'info@sar.edu',
    }
  }

  // Initialize with logo
  async initialize() {
    try {
      this.logoBase64 = await getLogoForPDF()
      if (!this.logoBase64) {
        // Use fallback logo
        this.logoBase64 = createFallbackLogo('SAR')
      }
    } catch (error) {
      console.error('Failed to load logo:', error)
      this.logoBase64 = createFallbackLogo('SAR')
    }
  }

  // Add school header to PDF with transparent logo
  private addHeader(title: string) {
    const pageWidth = this.doc.internal.pageSize.getWidth()
    let yPos = 10
    
    // Add school logo if available (centered at top, transparent)
    if (this.logoBase64) {
      try {
        // Logo dimensions (transparent)
        const logoWidth = 35
        const logoHeight = 35
        const logoX = (pageWidth - logoWidth) / 2
        
        this.doc.addImage(
          this.logoBase64,
          'PNG',
          logoX,
          yPos,
          logoWidth,
          logoHeight,
          undefined,
          'FAST'
        )
        
        yPos += logoHeight + 3
      } catch (error) {
        console.error('Error adding logo to PDF:', error)
        yPos += 5
      }
    }
    
    // School name
    this.doc.setFontSize(20)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(227, 30, 36) // SAR red color
    this.doc.text(this.schoolInfo.name, pageWidth / 2, yPos, { align: 'center' })
    this.doc.setTextColor(0, 0, 0) // Reset to black
    
    yPos += 7
    
    // School address
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(this.schoolInfo.address, pageWidth / 2, yPos, { align: 'center' })
    
    yPos += 5
    this.doc.text(`Tel: ${this.schoolInfo.phone} | Email: ${this.schoolInfo.email}`, pageWidth / 2, yPos, { align: 'center' })
    
    if (this.schoolInfo.website) {
      yPos += 5
      this.doc.setTextColor(0, 0, 255)
      this.doc.text(this.schoolInfo.website, pageWidth / 2, yPos, { align: 'center' })
      this.doc.setTextColor(0, 0, 0)
    }
    
    yPos += 3
    
    // Line separator
    this.doc.setLineWidth(0.5)
    this.doc.setDrawColor(227, 30, 36) // SAR red color
    this.doc.line(15, yPos, pageWidth - 15, yPos)
    this.doc.setDrawColor(0, 0, 0) // Reset to black
    
    yPos += 10
    
    // Document title
    this.doc.setFontSize(16)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(title, pageWidth / 2, yPos, { align: 'center' })
    
    return yPos + 10 // Return the Y position after header
  }

  // Add footer with page numbers
  private addFooter() {
    const pageCount = this.doc.getNumberOfPages()
    const pageWidth = this.doc.internal.pageSize.getWidth()
    const pageHeight = this.doc.internal.pageSize.getHeight()
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i)
      this.doc.setFontSize(8)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      )
      this.doc.text(
        `Generated on ${new Date().toLocaleDateString()}`,
        pageWidth - 15,
        pageHeight - 10,
        { align: 'right' }
      )
    }
  }

  // Generate Student Report Card
  generateReportCard(studentData: any) {
    let yPos = this.addHeader('STUDENT REPORT CARD')
    
    // Student Information
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Student Information', 15, yPos)
    
    yPos += 7
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(`Name: ${studentData.name}`, 15, yPos)
    this.doc.text(`Student ID: ${studentData.studentId}`, 120, yPos)
    
    yPos += 6
    this.doc.text(`Class: ${studentData.class}`, 15, yPos)
    this.doc.text(`Academic Year: ${studentData.academicYear}`, 120, yPos)
    
    yPos += 10
    
    // Grades Table
    autoTable(this.doc, {
      startY: yPos,
      head: [['Subject', 'Score', 'Grade', 'Remarks']],
      body: studentData.grades || [],
      theme: 'grid',
      headStyles: { fillColor: [227, 30, 36] },
    })
    
    yPos = (this.doc as any).lastAutoTable.finalY + 10
    
    // Summary
    this.doc.setFontSize(11)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(`Total Score: ${studentData.totalScore || 0}`, 15, yPos)
    this.doc.text(`Average: ${studentData.average || 0}%`, 15, yPos + 7)
    this.doc.text(`Position: ${studentData.position || 'N/A'}`, 15, yPos + 14)
    
    this.addFooter()
    return this.doc
  }

  // Generate Attendance Report
  generateAttendanceReport(data: any) {
    let yPos = this.addHeader('ATTENDANCE REPORT')
    
    // Report Period
    this.doc.setFontSize(11)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(`Period: ${data.period}`, 15, yPos)
    this.doc.text(`Class: ${data.class || 'All Classes'}`, 120, yPos)
    
    yPos += 10
    
    // Attendance Table
    autoTable(this.doc, {
      startY: yPos,
      head: [['Student Name', 'Student ID', 'Present', 'Absent', 'Late', 'Attendance %']],
      body: data.records || [],
      theme: 'striped',
      headStyles: { fillColor: [227, 30, 36] },
    })
    
    yPos = (this.doc as any).lastAutoTable.finalY + 10
    
    // Summary
    this.doc.setFontSize(11)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Summary:', 15, yPos)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(`Total Students: ${data.totalStudents || 0}`, 15, yPos + 7)
    this.doc.text(`Average Attendance: ${data.averageAttendance || 0}%`, 15, yPos + 14)
    
    this.addFooter()
    return this.doc
  }

  // Generate Class List
  generateClassList(data: any) {
    let yPos = this.addHeader('CLASS LIST')
    
    // Class Information
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(`Class: ${data.className}`, 15, yPos)
    this.doc.text(`Teacher: ${data.teacher}`, 120, yPos)
    
    yPos += 7
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(`Total Students: ${data.totalStudents}`, 15, yPos)
    this.doc.text(`Academic Year: ${data.academicYear}`, 120, yPos)
    
    yPos += 10
    
    // Students Table
    autoTable(this.doc, {
      startY: yPos,
      head: [['#', 'Student ID', 'Full Name', 'Gender', 'Date of Birth', 'Contact']],
      body: data.students || [],
      theme: 'grid',
      headStyles: { fillColor: [227, 30, 36] },
    })
    
    this.addFooter()
    return this.doc
  }

  // Generate Financial Report
  generateFinancialReport(data: any) {
    let yPos = this.addHeader('FINANCIAL REPORT')
    
    // Report Period
    this.doc.setFontSize(11)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(`Period: ${data.period}`, 15, yPos)
    
    yPos += 10
    
    // Summary Cards
    this.doc.setFillColor(240, 240, 240)
    this.doc.rect(15, yPos, 85, 25, 'F')
    this.doc.rect(110, yPos, 85, 25, 'F')
    
    this.doc.setFontSize(10)
    this.doc.text('Total Expected', 20, yPos + 8)
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(`GH₵ ${data.totalExpected?.toLocaleString() || 0}`, 20, yPos + 18)
    
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text('Total Collected', 115, yPos + 8)
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(34, 197, 94)
    this.doc.text(`GH₵ ${data.totalCollected?.toLocaleString() || 0}`, 115, yPos + 18)
    this.doc.setTextColor(0, 0, 0)
    
    yPos += 35
    
    // Payment Details Table
    autoTable(this.doc, {
      startY: yPos,
      head: [['Class', 'Expected', 'Collected', 'Outstanding', 'Collection %']],
      body: data.details || [],
      theme: 'striped',
      headStyles: { fillColor: [227, 30, 36] },
    })
    
    this.addFooter()
    return this.doc
  }

  // Generate Exam Results
  generateExamResults(data: any) {
    let yPos = this.addHeader('EXAMINATION RESULTS')
    
    // Exam Information
    this.doc.setFontSize(11)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(`Exam: ${data.examName}`, 15, yPos)
    this.doc.text(`Class: ${data.className}`, 120, yPos)
    
    yPos += 7
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(`Date: ${data.examDate}`, 15, yPos)
    this.doc.text(`Total Students: ${data.totalStudents}`, 120, yPos)
    
    yPos += 10
    
    // Results Table
    autoTable(this.doc, {
      startY: yPos,
      head: [['Position', 'Student Name', 'Student ID', 'Total Score', 'Average %', 'Grade']],
      body: data.results || [],
      theme: 'grid',
      headStyles: { fillColor: [227, 30, 36] },
    })
    
    yPos = (this.doc as any).lastAutoTable.finalY + 10
    
    // Statistics
    this.doc.setFontSize(11)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Statistics:', 15, yPos)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(`Highest Score: ${data.highestScore || 0}%`, 15, yPos + 7)
    this.doc.text(`Lowest Score: ${data.lowestScore || 0}%`, 15, yPos + 14)
    this.doc.text(`Class Average: ${data.classAverage || 0}%`, 15, yPos + 21)
    this.doc.text(`Pass Rate: ${data.passRate || 0}%`, 15, yPos + 28)
    
    this.addFooter()
    return this.doc
  }

  // Save PDF
  save(filename: string) {
    this.doc.save(filename)
  }

  // Get PDF as blob (for preview)
  getBlob() {
    return this.doc.output('blob')
  }

  // Open PDF in new tab
  preview() {
    window.open(this.doc.output('bloburl'), '_blank')
  }
}

// Export helper functions
export const generateAndDownloadPDF = async (type: string, data: any, filename: string) => {
  const generator = new PDFGenerator()
  
  // Initialize with logo
  await generator.initialize()
  
  switch (type) {
    case 'reportCard':
      generator.generateReportCard(data)
      break
    case 'attendance':
      generator.generateAttendanceReport(data)
      break
    case 'classList':
      generator.generateClassList(data)
      break
    case 'financial':
      generator.generateFinancialReport(data)
      break
    case 'examResults':
      generator.generateExamResults(data)
      break
    default:
      throw new Error(`Unknown PDF type: ${type}`)
  }
  
  generator.save(filename)
}

// Create PDF generator with logo
export const createPDFGenerator = async (): Promise<PDFGenerator> => {
  const generator = new PDFGenerator()
  await generator.initialize()
  return generator
}
