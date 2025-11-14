# Design Document

## Overview

This design document outlines the architecture and implementation approach for the exam management and terminal report card system. The solution leverages the existing Grade model in the database and builds comprehensive UI and API layers to enable exam creation, grade entry, and automated report card generation.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                           │
├─────────────────────────────────────────────────────────────┤
│  Admin Exam Management  │  Teacher Grade Entry              │
│  Report Card Viewer     │  Bulk Grade Entry                 │
│  Analytics Dashboard    │  PDF Generator                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                               │
├─────────────────────────────────────────────────────────────┤
│  /api/exams            │  /api/grades                       │
│  /api/report-cards     │  /api/grades/bulk                  │
│  /api/grades/analytics │  /api/report-cards/download        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Database Layer (Prisma)                    │
├─────────────────────────────────────────────────────────────┤
│  Exam Model (New)      │  Grade Model (Existing)            │
│  Student Model         │  Class Model                       │
│  Teacher Model         │  Attendance Model                  │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Database Schema Extensions

**New Exam Model:**
```prisma
model Exam {
  id           String   @id @default(cuid())
  name         String   // e.g., "End of Term 1 Examination"
  examType     String   // e.g., "Mid-Term", "End of Term", "Mock"
  term         String   // "Term 1", "Term 2", "Term 3"
  academicYear String   // "2025"
  startDate    DateTime
  endDate      DateTime
  subjects     String[] // Array of subjects included
  classes      String[] // Array of class IDs
  status       String   @default("SCHEDULED") // SCHEDULED, ONGOING, COMPLETED
  createdBy    String   // Admin user ID
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  @@index([term, academicYear])
  @@index([status])
}
```

**Enhanced Grade Model (already exists, no changes needed):**
- The existing Grade model already supports all required fields
- Fields: studentId, teacherId, subject, examType, marks, totalMarks, term, academicYear, remarks

### 2. API Endpoints

#### Exam Management APIs

**POST /api/exams**
- Create a new exam
- Request: `{ name, examType, term, academicYear, startDate, endDate, subjects, classes }`
- Response: `{ success: true, data: exam }`

**GET /api/exams**
- List all exams with optional filters
- Query params: `term`, `academicYear`, `status`, `classId`
- Response: `{ success: true, data: exams[] }`

**GET /api/exams/[id]**
- Get exam details
- Response: `{ success: true, data: exam }`

**PUT /api/exams/[id]**
- Update exam details
- Request: `{ name, startDate, endDate, status, ... }`
- Response: `{ success: true, data: exam }`

**DELETE /api/exams/[id]**
- Delete an exam
- Response: `{ success: true }`

#### Grade Management APIs

**POST /api/grades**
- Create a single grade entry
- Request: `{ studentId, subject, examType, marks, totalMarks, term, academicYear, remarks }`
- Response: `{ success: true, data: grade }`

**POST /api/grades/bulk**
- Create multiple grade entries at once
- Request: `{ grades: [{ studentId, subject, marks, ... }] }`
- Response: `{ success: true, data: { created: count, failed: [] } }`

**GET /api/grades**
- List grades with filters
- Query params: `studentId`, `classId`, `term`, `academicYear`, `subject`
- Response: `{ success: true, data: grades[] }`

**PUT /api/grades/[id]**
- Update a grade entry
- Request: `{ marks, totalMarks, remarks }`
- Response: `{ success: true, data: grade }`

**GET /api/grades/analytics**
- Get grade analytics and statistics
- Query params: `classId`, `term`, `academicYear`, `subject`
- Response: `{ success: true, data: { average, highest, lowest, distribution, ... } }`

#### Report Card APIs

**GET /api/report-cards/[studentId]**
- Get report card data for a student
- Query params: `term`, `academicYear`
- Response: `{ success: true, data: { student, grades, average, rank, attendance, ... } }`

**GET /api/report-cards/download/[studentId]**
- Download PDF report card
- Query params: `term`, `academicYear`
- Response: PDF file stream

**POST /api/report-cards/bulk-download**
- Generate ZIP file with multiple report cards
- Request: `{ classId, term, academicYear }`
- Response: ZIP file stream

### 3. Frontend Pages and Components

#### Admin Pages

**`/dashboard/admin/exams`**
- Main exam management page
- Features:
  - List of all exams with filters
  - Create new exam button
  - Edit/delete exam actions
  - View exam details and grade status

**`/dashboard/admin/exams/create`**
- Exam creation form
- Fields: name, type, term, academic year, dates, subjects, classes
- Validation and error handling

**`/dashboard/admin/exams/[id]`**
- Exam details page
- Shows: exam info, associated classes, grade entry progress
- Actions: edit exam, view grades, generate reports

**`/dashboard/admin/report-cards`**
- Report card management page
- Features:
  - Filter by class, term, year
  - View grade completion status
  - Bulk download report cards
  - Individual student report card access

#### Teacher Pages

**`/dashboard/teacher/grades`**
- Grade entry page for teachers
- Features:
  - Select exam, class, and subject
  - Student list with grade entry fields
  - Bulk save functionality
  - Grade history view

**`/dashboard/teacher/grades/bulk-entry`**
- Bulk grade entry interface
- Features:
  - Spreadsheet-like table
  - Real-time validation
  - Auto-save drafts
  - Submit all grades at once

#### Student/Parent Pages

**`/dashboard/student/report-cards`**
- Student report card viewer
- Features:
  - Select term and year
  - View grades by subject
  - Overall average and rank
  - Download PDF button

**`/dashboard/parent/report-cards`**
- Parent report card viewer (updated from existing page)
- Features:
  - Select child (if multiple)
  - Select term and year
  - View comprehensive report card
  - Download PDF button
  - Performance trends

### 4. Reusable Components

**`<GradeEntryForm>`**
- Single grade entry form component
- Props: `studentId`, `subject`, `examType`, `onSave`
- Features: validation, error display, loading states

**`<GradeTable>`**
- Bulk grade entry table component
- Props: `students`, `subject`, `examType`, `onBulkSave`
- Features: inline editing, validation, keyboard navigation

**`<ReportCardViewer>`**
- Report card display component
- Props: `studentId`, `term`, `academicYear`
- Features: formatted display, print-friendly, download button

**`<ExamCard>`**
- Exam summary card component
- Props: `exam`, `onEdit`, `onDelete`
- Features: status badge, action buttons, quick stats

**`<GradeAnalytics>`**
- Analytics visualization component
- Props: `classId`, `term`, `subject`
- Features: charts, statistics, performance insights

## Data Models

### Report Card Data Structure

```typescript
interface ReportCardData {
  student: {
    id: string
    name: string
    rollNumber: string
    class: string
    dateOfBirth: string
  }
  term: string
  academicYear: string
  grades: Array<{
    subject: string
    marks: number
    totalMarks: number
    percentage: number
    grade: string // A, B, C, D, F
    remarks?: string
  }>
  summary: {
    totalMarks: number
    marksObtained: number
    percentage: number
    overallGrade: string
    classRank: number
    totalStudents: number
  }
  attendance: {
    totalDays: number
    present: number
    absent: number
    percentage: number
  }
  teacherComments?: string
  principalComments?: string
  generatedAt: string
}
```

### Grade Analytics Structure

```typescript
interface GradeAnalytics {
  subject: string
  class: string
  term: string
  statistics: {
    average: number
    highest: number
    lowest: number
    median: number
    standardDeviation: number
  }
  distribution: {
    A: number // count
    B: number
    C: number
    D: number
    F: number
  }
  trends: {
    improvingStudents: number
    decliningStudents: number
    stableStudents: number
  }
  topPerformers: Array<{
    studentId: string
    name: string
    marks: number
  }>
  needsSupport: Array<{
    studentId: string
    name: string
    marks: number
  }>
}
```

## Error Handling

### Validation Rules

1. **Grade Entry Validation:**
   - Marks must be >= 0
   - Marks must be <= totalMarks
   - Subject must be valid
   - Student must exist in the class
   - Duplicate grade entries prevented

2. **Exam Creation Validation:**
   - Name required (min 3 characters)
   - Start date must be before end date
   - At least one subject required
   - At least one class required
   - Term and academic year required

3. **Report Card Generation:**
   - Student must have at least one grade for the term
   - All required student data must be present
   - Attendance data must be available

### Error Messages

```typescript
const ERROR_MESSAGES = {
  GRADE_EXCEEDS_TOTAL: "Marks cannot exceed total marks",
  INVALID_MARKS: "Marks must be a positive number",
  DUPLICATE_GRADE: "Grade already exists for this student and subject",
  EXAM_NOT_FOUND: "Exam not found",
  NO_GRADES_FOUND: "No grades available for this term",
  INSUFFICIENT_DATA: "Insufficient data to generate report card",
  UNAUTHORIZED: "You don't have permission to perform this action",
  NETWORK_ERROR: "Network error. Please try again",
}
```

## Testing Strategy

### Unit Tests
- Grade calculation logic
- Validation functions
- PDF generation utilities
- Analytics calculations

### Integration Tests
- API endpoint testing
- Database operations
- Grade entry workflow
- Report card generation

### End-to-End Tests
- Complete exam creation flow
- Teacher grade entry process
- Student report card viewing
- Bulk operations

### Manual Testing Checklist
- [ ] Create exam as admin
- [ ] Enter grades as teacher
- [ ] Bulk grade entry
- [ ] View report card as student
- [ ] View report card as parent
- [ ] Download PDF report card
- [ ] Generate bulk report cards
- [ ] View analytics
- [ ] Edit and update grades
- [ ] Delete exam

## Performance Considerations

1. **Database Queries:**
   - Index on `term` and `academicYear` in Grade model
   - Use pagination for large grade lists
   - Eager loading for related data (student, class, teacher)

2. **PDF Generation:**
   - Generate PDFs asynchronously for bulk operations
   - Cache generated PDFs for 24 hours
   - Use streaming for large file downloads

3. **Analytics Calculations:**
   - Cache analytics data for 1 hour
   - Use database aggregation functions
   - Compute rankings in batches

4. **Frontend Optimization:**
   - Lazy load report card components
   - Debounce grade entry inputs
   - Use virtual scrolling for large student lists
   - Implement optimistic UI updates

## Security Considerations

1. **Authorization:**
   - Teachers can only enter grades for their subjects
   - Students can only view their own report cards
   - Parents can only view their children's report cards
   - Admins have full access

2. **Data Validation:**
   - Server-side validation for all inputs
   - Sanitize user inputs
   - Prevent SQL injection via Prisma ORM

3. **Audit Trail:**
   - Log all grade modifications
   - Track who created/updated grades
   - Maintain grade history

## Deployment Notes

1. **Database Migration:**
   - Run Prisma migration to add Exam model
   - No changes needed to existing Grade model
   - Backup database before migration

2. **Environment Variables:**
   - No new environment variables required
   - Uses existing DATABASE_URL

3. **Dependencies:**
   - jsPDF (already installed) for PDF generation
   - No new dependencies required

## Future Enhancements

1. **Grade Import/Export:**
   - Import grades from Excel/CSV
   - Export grades to Excel

2. **Mobile App:**
   - Native mobile app for report card viewing
   - Push notifications for grade updates

3. **Advanced Analytics:**
   - Predictive analytics for student performance
   - Comparative analysis across terms
   - Subject-wise performance trends

4. **Customizable Grading Scales:**
   - Support for different grading systems
   - Weighted grade calculations
   - GPA calculations
