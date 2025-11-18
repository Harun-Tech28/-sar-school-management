# Design Document - Homework Management System

## Overview

The Homework Management System provides a complete workflow for teachers to create and manage homework assignments, students to submit their work, and parents to monitor progress. The system integrates with the existing database schema and follows SAR School Management System patterns.

## Architecture

### Frontend Architecture
- **Framework**: Next.js 14 with App Router
- **UI Components**: Existing component library
- **State Management**: React hooks (useState, useEffect)
- **Data Fetching**: Fetch API with async/await
- **Notifications**: react-hot-toast for user feedback
- **File Handling**: Note - File uploads require cloud storage setup (see HOMEWORK_FILE_UPLOAD_GUIDE.md)

### Backend Architecture
- **API Routes**: Next.js API routes in `/app/api/homework/`
- **Database**: PostgreSQL via Prisma ORM (models already exist)
- **Authentication**: Session-based auth from existing middleware
- **Authorization**: Role-based access control

## Components and Interfaces

### 1. Teacher Homework Page (`/app/dashboard/teacher/homework/page.tsx`)

**Purpose**: Main interface for teachers to manage homework

**Key Features**:
- Statistics cards (total assignments, submissions, pending)
- Create assignment button
- Table of all assignments with submission stats
- Filter by class/subject
- Search by title
- View/Edit/Delete actions

**State Management**:
```typescript
const [assignments, setAssignments] = useState<Homework[]>([])
const [classes, setClasses] = useState<Class[]>([])
const [selectedClass, setSelectedClass] = useState<string>("")
const [searchQuery, setSearchQuery] = useState<string>("")
const [showCreateModal, setShowCreateModal] = useState(false)
const [editingAssignment, setEditingAssignment] = useState<Homework | null>(null)
const [isLoading, setIsLoading] = useState(false)
```

### 2. Assignment Detail/Submissions Page (`/app/dashboard/teacher/homework/[id]/page.tsx`)

**Purpose**: View all student submissions for a specific assignment

**Features**:
- Assignment details header
- Submission statistics
- Table of all students with submission status
- Grade submission interface
- Download submissions
- Filter by status (all, submitted, pending, late)

### 3. Student Homework Page (`/app/dashboard/student/homework/page.tsx`)

**Purpose**: View and submit homework assignments

**Features**:
- List of all assignments
- Status badges (pending, submitted, graded, overdue)
- Due date highlighting
- Submit homework button
- View grades and feedback
- Filter by subject/status

### 4. Parent Homework Page (`/app/dashboard/parent/homework/page.tsx`)

**Purpose**: Monitor children's homework

**Features**:
- Child selector (if multiple children)
- List of assignments for selected child
- Status and grade display
- Due date tracking
- Overdue highlighting

### 5. Create/Edit Assignment Modal Component

**Form Fields**:
- Title (text input - required)
- Subject (text input - required)
- Class (dropdown - required)
- Due Date (date picker - required)
- Description/Instructions (textarea - required)
- Total Marks (number input - optional, default 100)
- Attachments (file upload - optional, requires cloud storage)

### 6. Submit Homework Modal Component

**Form Fields**:
- Submission Text (textarea - required)
- Attachments (file upload - optional)
- Submit button

### 7. Grade Submission Modal Component

**Form Fields**:
- Score (number input - required, max = totalMarks)
- Feedback (textarea - optional)
- Save button

## Data Models

### Homework Interface (Already exists in DB)
```typescript
interface Homework {
  id: string
  title: string
  description: string
  subject: string
  classId: string
  teacherId: string
  dueDate: Date
  totalMarks: number | null
  createdAt: Date
  updatedAt: Date
  class?: {
    id: string
    name: string
    level: string
  }
  teacher?: {
    user: {
      fullName: string
    }
  }
  submissions?: HomeworkSubmission[]
  _count?: {
    submissions: number
  }
}
```

### HomeworkSubmission Interface (Already exists in DB)
```typescript
interface HomeworkSubmission {
  id: string
  homeworkId: string
  studentId: string
  submittedAt: Date | null
  grade: number | null
  feedback: string | null
  status: 'PENDING' | 'SUBMITTED' | 'GRADED' | 'LATE'
  createdAt: Date
  updatedAt: Date
  student?: {
    user: {
      fullName: string
    }
    admissionNumber: string
  }
  homework?: Homework
}
```

### Database Schema Updates Needed

Update SubmissionStatus enum:
```prisma
enum SubmissionStatus {
  PENDING
  SUBMITTED
  GRADED
  LATE
}
```

Add content field to HomeworkSubmission:
```prisma
model HomeworkSubmission {
  // ... existing fields
  content     String?  @db.Text  // Student's submission text
  // ... rest of fields
}
```

## API Endpoints

### GET `/api/homework`
**Purpose**: Fetch homework assignments

**Query Parameters**:
- `role`: teacher | student | parent
- `classId` (optional): Filter by class
- `subject` (optional): Filter by subject
- `search` (optional): Search in title
- `studentId` (optional, for parent): Get assignments for specific child

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "title": "Chapter 5 Exercises",
      "subject": "Mathematics",
      "dueDate": "2024-01-20",
      "totalMarks": 100,
      "class": {
        "name": "Form 3A"
      },
      "submissionStats": {
        "total": 30,
        "submitted": 25,
        "pending": 5,
        "late": 2
      },
      "mySubmission": { /* for students */ }
    }
  ]
}
```

### POST `/api/homework`
**Purpose**: Create new homework assignment (Teacher only)

**Request Body**:
```json
{
  "title": "Chapter 5 Exercises",
  "description": "Complete exercises 1-10",
  "subject": "Mathematics",
  "classId": "...",
  "dueDate": "2024-01-20",
  "totalMarks": 100
}
```

**Response**:
```json
{
  "success": true,
  "message": "Homework created successfully",
  "data": { /* created homework */ }
}
```

### PUT `/api/homework/[id]`
**Purpose**: Update homework assignment (Teacher only)

**Request Body**: Same as POST

**Response**: Same as POST with "updated" message

### DELETE `/api/homework/[id]`
**Purpose**: Delete homework assignment (Teacher only)

**Response**:
```json
{
  "success": true,
  "message": "Homework deleted successfully"
}
```

### GET `/api/homework/[id]`
**Purpose**: Get homework details with submissions

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "title": "...",
    "description": "...",
    "submissions": [
      {
        "id": "...",
        "student": {
          "user": { "fullName": "John Doe" },
          "admissionNumber": "2024001"
        },
        "status": "SUBMITTED",
        "submittedAt": "2024-01-18T10:30:00Z",
        "grade": null
      }
    ]
  }
}
```

### POST `/api/homework/[id]/submit`
**Purpose**: Submit homework (Student only)

**Request Body**:
```json
{
  "content": "My homework submission text..."
}
```

**Response**:
```json
{
  "success": true,
  "message": "Homework submitted successfully",
  "data": { /* submission */ }
}
```

### PUT `/api/homework/submissions/[id]/grade`
**Purpose**: Grade a submission (Teacher only)

**Request Body**:
```json
{
  "grade": 85,
  "feedback": "Good work! Review question 7."
}
```

**Response**:
```json
{
  "success": true,
  "message": "Submission graded successfully",
  "data": { /* graded submission */ }
}
```

### GET `/api/homework/submissions/[id]`
**Purpose**: Get submission details

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "content": "...",
    "grade": 85,
    "feedback": "...",
    "status": "GRADED",
    "submittedAt": "...",
    "homework": { /* homework details */ }
  }
}
```

## Business Logic

### Submission Status Logic
1. **PENDING**: Initial status when homework is assigned
2. **SUBMITTED**: When student submits before due date
3. **LATE**: When student submits after due date
4. **GRADED**: When teacher assigns a grade

### Auto-create Submissions
When a homework is created, automatically create PENDING submissions for all students in the class:
```typescript
// In POST /api/homework
const students = await prisma.student.findMany({
  where: { classId: homework.classId }
})

await prisma.homeworkSubmission.createMany({
  data: students.map(student => ({
    homeworkId: homework.id,
    studentId: student.id,
    status: 'PENDING'
  }))
})
```

### Late Submission Detection
```typescript
const isLate = new Date() > new Date(homework.dueDate)
const status = isLate ? 'LATE' : 'SUBMITTED'
```

### Submission Statistics Calculation
```typescript
const stats = {
  total: submissions.length,
  submitted: submissions.filter(s => s.status === 'SUBMITTED' || s.status === 'GRADED' || s.status === 'LATE').length,
  pending: submissions.filter(s => s.status === 'PENDING').length,
  late: submissions.filter(s => s.status === 'LATE').length,
  graded: submissions.filter(s => s.status === 'GRADED').length
}
```

## Error Handling

### Frontend Error Handling
- Display toast notifications for all errors
- Show loading states during API calls
- Validate form inputs before submission
- Handle network errors gracefully
- Show empty states when no data

### Backend Error Handling
- Return appropriate HTTP status codes
- Validate user permissions
- Check authentication and authorization
- Handle database errors
- Return descriptive error messages

**Error Response Format**:
```json
{
  "success": false,
  "error": "Error message here"
}
```

## UI/UX Design

### Color Scheme
- Primary: `#E31E24` (SAR red)
- Success/Submitted: Green
- Warning/Due Soon: Yellow
- Danger/Overdue: Red
- Info/Pending: Blue
- Graded: Purple

### Status Badges
- **PENDING**: Blue badge
- **SUBMITTED**: Green badge
- **LATE**: Orange badge
- **GRADED**: Purple badge with score
- **OVERDUE**: Red badge

### Due Date Highlighting
- Due today: Yellow background
- Due within 3 days: Yellow text
- Overdue: Red text and background

### Layout

**Teacher View**:
- Header with statistics cards
- Create button in top right
- Filters (class, subject, search)
- Table with columns: Title, Class, Subject, Due Date, Submissions (X/Y), Actions
- Click row to view submissions

**Student View**:
- Header with summary
- Filters (subject, status)
- Cards or table with: Title, Subject, Due Date, Status, Score (if graded)
- Click to view details and submit

**Parent View**:
- Child selector dropdown
- Similar to student view but read-only

### Responsive Behavior
- Desktop: Full table layout
- Tablet: Condensed table
- Mobile: Card-based layout

## Testing Strategy

### Manual Testing
1. Teacher creates homework
2. Verify students see new homework
3. Student submits homework
4. Verify teacher sees submission
5. Teacher grades submission
6. Verify student sees grade and feedback
7. Parent views child's homework
8. Test late submission
9. Test edit homework
10. Test delete homework
11. Test filters and search
12. Test on mobile device

### Test Scenarios
- Teacher can only see their own homework
- Student can only see homework for their classes
- Parent can only see their children's homework
- Late submissions are marked correctly
- Submission statistics are accurate
- Grades cannot exceed totalMarks
- Cannot submit after deletion
- Notifications are sent correctly

## Security Considerations

1. **Authentication**: Verify user is logged in
2. **Authorization**: 
   - Teachers can only manage their own homework
   - Students can only submit to their own assignments
   - Parents can only view their children's homework
3. **Input Validation**: Sanitize all user inputs
4. **SQL Injection**: Use Prisma parameterized queries
5. **XSS Prevention**: Escape user-generated content
6. **File Upload**: Validate file types and sizes (when implemented)

## Performance Considerations

1. **Pagination**: Limit results to 20 per page
2. **Indexing**: Database indexes on classId, teacherId, studentId, dueDate
3. **Eager Loading**: Include related data in queries to avoid N+1
4. **Caching**: Consider caching class lists
5. **Optimistic Updates**: Update UI before API response

## Integration Points

### Existing Systems
- **Authentication**: Use existing session management
- **Teacher Data**: Fetch from existing teacher API
- **Student Data**: Use existing student API
- **Class Data**: Use existing `/api/classes` endpoint
- **Notifications**: Integrate with existing notification system
- **UI Components**: Use existing component library

### Notifications
- Notify students when homework is assigned
- Notify teacher when student submits
- Notify student when homework is graded

## File Upload Considerations

File uploads are marked as optional in the initial implementation. To enable file uploads:

1. Set up cloud storage (AWS S3, Cloudinary, etc.)
2. Add file URL fields to database models
3. Implement file upload API endpoints
4. Update frontend to handle file uploads
5. See `HOMEWORK_FILE_UPLOAD_GUIDE.md` for details

## Future Enhancements

- Bulk grading interface
- Export grades to CSV
- Homework templates
- Plagiarism detection
- Peer review system
- Homework analytics dashboard
- Calendar view of due dates
- Reminder notifications
- Resubmission capability
- Group assignments
