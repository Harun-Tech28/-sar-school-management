import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { PDFGenerator } from './pdf-generator'

// Export data to Excel
export const exportToExcel = (data: any[], filename: string, sheetName: string = 'Sheet1') => {
  // Create workbook
  const wb = XLSX.utils.book_new()
  
  // Convert data to worksheet
  const ws = XLSX.utils.json_to_sheet(data)
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  
  // Generate Excel file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  
  // Download file
  saveAs(blob, `${filename}.xlsx`)
}

// Export data to CSV
export const exportToCSV = (data: any[], filename: string) => {
  // Create workbook
  const wb = XLSX.utils.book_new()
  
  // Convert data to worksheet
  const ws = XLSX.utils.json_to_sheet(data)
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Data')
  
  // Generate CSV file
  const csvData = XLSX.utils.sheet_to_csv(ws)
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
  
  // Download file
  saveAs(blob, `${filename}.csv`)
}

// Print current page
export const printPage = () => {
  window.print()
}

// Export student list to Excel
export const exportStudentList = (students: any[]) => {
  const data = students.map((student, index) => ({
    '#': index + 1,
    'Student ID': student.studentId || student.id,
    'Full Name': student.fullName || student.name,
    'Class': student.class || 'N/A',
    'Gender': student.gender || 'N/A',
    'Date of Birth': student.dateOfBirth || 'N/A',
    'Parent/Guardian': student.parentName || 'N/A',
    'Contact': student.phone || student.contact || 'N/A',
  }))
  
  exportToExcel(data, `Student_List_${new Date().toISOString().split('T')[0]}`, 'Students')
}

// Export attendance to Excel
export const exportAttendanceReport = (records: any[]) => {
  const data = records.map((record) => ({
    'Date': record.date,
    'Student Name': record.studentName,
    'Student ID': record.studentId,
    'Class': record.class,
    'Status': record.status,
    'Marked By': record.markedBy,
    'Time': record.time || 'N/A',
  }))
  
  exportToExcel(data, `Attendance_Report_${new Date().toISOString().split('T')[0]}`, 'Attendance')
}

// Export grades to Excel
export const exportGradesReport = (grades: any[]) => {
  const data = grades.map((grade) => ({
    'Student Name': grade.studentName,
    'Student ID': grade.studentId,
    'Subject': grade.subject,
    'Score': grade.score,
    'Max Score': grade.maxScore,
    'Percentage': `${((grade.score / grade.maxScore) * 100).toFixed(1)}%`,
    'Grade': grade.grade,
    'Term': grade.term,
    'Academic Year': grade.academicYear,
  }))
  
  exportToExcel(data, `Grades_Report_${new Date().toISOString().split('T')[0]}`, 'Grades')
}

// Export financial report to Excel
export const exportFinancialReport = (data: any[]) => {
  const excelData = data.map((item) => ({
    'Class': item.class,
    'Total Students': item.totalStudents,
    'Expected Amount (GH₵)': item.expected,
    'Collected Amount (GH₵)': item.collected,
    'Outstanding (GH₵)': item.outstanding,
    'Collection Rate': `${item.collectionRate}%`,
    'Students Paid': item.studentsPaid,
    'Students Pending': item.studentsPending,
  }))
  
  exportToExcel(excelData, `Financial_Report_${new Date().toISOString().split('T')[0]}`, 'Financial')
}

// Export teacher list to Excel
export const exportTeacherList = (teachers: any[]) => {
  const data = teachers.map((teacher, index) => ({
    '#': index + 1,
    'Employee ID': teacher.employeeId || teacher.id,
    'Full Name': teacher.fullName || teacher.name,
    'Subject': teacher.subject,
    'Classes': teacher.classes || 'N/A',
    'Email': teacher.email,
    'Phone': teacher.phone,
    'Hire Date': teacher.hireDate || 'N/A',
  }))
  
  exportToExcel(data, `Teacher_List_${new Date().toISOString().split('T')[0]}`, 'Teachers')
}

// Export class list to Excel
export const exportClassList = (classes: any[]) => {
  const data = classes.map((cls, index) => ({
    '#': index + 1,
    'Class Name': cls.name,
    'Form': cls.form,
    'Room': cls.room,
    'Capacity': cls.capacity,
    'Current Students': cls.studentCount || 0,
    'Teacher': cls.teacherName || 'N/A',
    'Academic Year': cls.academicYear || '2024/2025',
  }))
  
  exportToExcel(data, `Class_List_${new Date().toISOString().split('T')[0]}`, 'Classes')
}

// Export homework assignments to Excel
export const exportHomeworkList = (homework: any[]) => {
  const data = homework.map((hw) => ({
    'Title': hw.title,
    'Subject': hw.subject,
    'Class': hw.class,
    'Assigned Date': hw.assignedDate,
    'Due Date': hw.dueDate,
    'Status': hw.status,
    'Submissions': hw.submissions || 0,
    'Teacher': hw.teacherName,
  }))
  
  exportToExcel(data, `Homework_List_${new Date().toISOString().split('T')[0]}`, 'Homework')
}

// Export exam results to Excel
export const exportExamResults = (results: any[]) => {
  const data = results.map((result, index) => ({
    'Position': index + 1,
    'Student Name': result.studentName,
    'Student ID': result.studentId,
    'Class': result.class,
    'Total Score': result.totalScore,
    'Average': `${result.average}%`,
    'Grade': result.grade,
    'Remarks': result.remarks || 'N/A',
  }))
  
  exportToExcel(data, `Exam_Results_${new Date().toISOString().split('T')[0]}`, 'Results')
}

// Generate and download report card PDF
export const downloadReportCard = (studentData: any) => {
  const generator = new PDFGenerator()
  generator.generateReportCard(studentData)
  generator.save(`Report_Card_${studentData.studentId}_${new Date().toISOString().split('T')[0]}.pdf`)
}

// Generate and download attendance PDF
export const downloadAttendancePDF = (data: any) => {
  const generator = new PDFGenerator()
  generator.generateAttendanceReport(data)
  generator.save(`Attendance_Report_${new Date().toISOString().split('T')[0]}.pdf`)
}

// Generate and download class list PDF
export const downloadClassListPDF = (data: any) => {
  const generator = new PDFGenerator()
  generator.generateClassList(data)
  generator.save(`Class_List_${data.className}_${new Date().toISOString().split('T')[0]}.pdf`)
}

// Generate and download financial report PDF
export const downloadFinancialPDF = (data: any) => {
  const generator = new PDFGenerator()
  generator.generateFinancialReport(data)
  generator.save(`Financial_Report_${new Date().toISOString().split('T')[0]}.pdf`)
}

// Generate and download exam results PDF
export const downloadExamResultsPDF = (data: any) => {
  const generator = new PDFGenerator()
  generator.generateExamResults(data)
  generator.save(`Exam_Results_${new Date().toISOString().split('T')[0]}.pdf`)
}

// Export multiple formats
export const exportData = (data: any[], filename: string, format: 'excel' | 'csv' | 'pdf') => {
  switch (format) {
    case 'excel':
      exportToExcel(data, filename)
      break
    case 'csv':
      exportToCSV(data, filename)
      break
    case 'pdf':
      // For PDF, you'll need to specify the type
      console.log('PDF export requires specific document type')
      break
    default:
      console.error('Unknown export format')
  }
}
