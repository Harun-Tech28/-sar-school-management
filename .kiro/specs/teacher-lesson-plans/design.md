# Design Document - Teacher Lesson Plans

## Overview

The Teacher Lesson Plans feature provides a comprehensive interface for teachers to create, manage, and organize their teaching materials. The system uses a clean, intuitive UI with forms for data entry and tables for data display. The implementation follows the existing SAR School Management System patterns and integrates with the current database schema.

## Architecture

### Frontend Architecture
- **Framework**: Next.js 14 with App Router
- **UI Components**: Existing component library (Card, Button, etc.)
- **State Management**: React hooks (useState, useEffect)
- **Data Fetching**: Fetch API with async/await
- **Notifications**: react-hot-toast for user feedback

### Backend Architecture
- **API Routes**: Next.js API routes in `/app/api/lesson-plans/`
- **Database**: PostgreSQL via Prisma ORM
- **Authentication**: Session-based auth from existing middleware
- **Authorization**: Teacher role verification

## Components and Interfaces

### 1. Main Lesson Plans Page (`/app/dashboard/teacher/lesson-plans/page.tsx`)

**Purpose**: Display list of lesson plans with filtering and actions

**Key Features**:
- Table view of all lesson plans
- Filter by subject, class, status
- Search by topic/keywords
- Create new lesson plan button
- Edit/Delete actions per row
- Pagination

**State Management**:
```typescript
const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([])
const [classes, setClasses] = useState<Class[]>([])
const [selectedClass, setSelectedClass] = useState<string>("")
const [selectedStatus, setSelectedStatus] = useState<string>("")
const [searchQuery, setSearchQuery] = useState<string>("")
const [isLoading, setIsLoading] = useState(false)
const [showCreateModal, setShowCreateModal] = useState(false)
const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null)
```

### 2. Create/Edit Lesson Plan Form Component

**Purpose**: Modal form for creating or editing lesson plans

**Form Fields**:
- Class (dropdown - required)
- Subject (text input - required)
- Date (date picker - required)
- Topic (text input - required)
- Learning Objectives (textarea - required)
- Teaching Activities (textarea - required)
- Resources Needed (textarea - optional)
- Assessment Methods (textarea - optional)
- Additional Notes (textarea - optional)
- Status (dropdown - PLANNED, IN_PROGRESS, COMPLETED)

**Validation**:
- All required fields must be filled
- Date must be valid
- Topic must be at least 3 characters

### 3. Lesson Plan Detail View Component

**Purpose**: Display full details of a single lesson plan

**Features**:
- Read-only view of all fields
- Edit button
- Delete button
- Back to list button
- Timestamps (created, updated)

## Data Models

### LessonPlan Interface
```typescript
interface LessonPlan {
  id: string
  teacherId: string
  classId: string
  subject: string
  date: Date
  topic: string
  objectives: string
  activities: string
  resources?: string
  assessment?: string
  notes?: string
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED'
  createdAt: Date
  updatedAt: Date
  class?: {
    id: string
    name: string
    level: string
  }
}
```

### Database Schema Addition

Add to Prisma schema:
```prisma
model LessonPlan {
  id          String   @id @default(cuid())
  teacherId   String
  teacher     Teacher  @relation(fields: [teacherId], references: [id], onDelete: Cascade)
  classId     String
  class       Class    @relation(fields: [classId], references: [id], onDelete: Cascade)
  subject     String
  date        DateTime
  topic       String
  objectives  String   @db.Text
  activities  String   @db.Text
  resources   String?  @db.Text
  assessment  String?  @db.Text
  notes       String?  @db.Text
  status      LessonPlanStatus @default(PLANNED)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([teacherId])
  @@index([classId])
  @@index([date])
}

enum LessonPlanStatus {
  PLANNED
  IN_PROGRESS
  COMPLETED
}
```

## API Endpoints

### GET `/api/lesson-plans`
**Purpose**: Fetch lesson plans for the authenticated teacher

**Query Parameters**:
- `classId` (optional): Filter by class
- `status` (optional): Filter by status
- `search` (optional): Search in topic/objectives
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "subject": "Mathematics",
      "topic": "Quadratic Equations",
      "date": "2024-01-15",
      "status": "PLANNED",
      "class": {
        "name": "Form 3A",
        "level": "JHS3"
      }
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10
  }
}
```

### POST `/api/lesson-plans`
**Purpose**: Create a new lesson plan

**Request Body**:
```json
{
  "classId": "...",
  "subject": "Mathematics",
  "date": "2024-01-15",
  "topic": "Quadratic Equations",
  "objectives": "Students will...",
  "activities": "1. Introduction...",
  "resources": "Textbook, worksheets",
  "assessment": "Quiz at end of lesson",
  "notes": "Additional notes",
  "status": "PLANNED"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Lesson plan created successfully",
  "data": { /* created lesson plan */ }
}
```

### PUT `/api/lesson-plans/[id]`
**Purpose**: Update an existing lesson plan

**Request Body**: Same as POST

**Response**: Same as POST with "updated" message

### DELETE `/api/lesson-plans/[id]`
**Purpose**: Delete a lesson plan

**Response**:
```json
{
  "success": true,
  "message": "Lesson plan deleted successfully"
}
```

### GET `/api/lesson-plans/[id]`
**Purpose**: Get details of a single lesson plan

**Response**:
```json
{
  "success": true,
  "data": { /* full lesson plan details */ }
}
```

## Error Handling

### Frontend Error Handling
- Display toast notifications for all errors
- Show loading states during API calls
- Validate form inputs before submission
- Handle network errors gracefully

### Backend Error Handling
- Return appropriate HTTP status codes
- Validate teacher ownership of lesson plans
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
- Success: Green for completed status
- Warning: Yellow for in-progress status
- Info: Blue for planned status

### Status Badges
- **PLANNED**: Blue badge
- **IN_PROGRESS**: Yellow badge
- **COMPLETED**: Green badge

### Layout
- Header with page title and create button
- Filters section (class, status, search)
- Table with lesson plans
- Pagination controls at bottom
- Modal for create/edit forms

### Responsive Behavior
- Desktop: Full table with all columns
- Tablet: Condensed table, some columns hidden
- Mobile: Card-based layout instead of table

## Testing Strategy

### Manual Testing
1. Create lesson plan with all fields
2. Create lesson plan with only required fields
3. Edit existing lesson plan
4. Delete lesson plan
5. Filter by class
6. Filter by status
7. Search by topic
8. Test pagination
9. Test on mobile device
10. Test error scenarios (invalid data, network errors)

### Test Scenarios
- Teacher can only see their own lesson plans
- Required field validation works
- Date validation works
- Status updates correctly
- Filters work correctly
- Search works correctly
- Pagination works correctly
- Delete confirmation works
- Success/error messages display correctly

## Security Considerations

1. **Authentication**: Verify user is logged in
2. **Authorization**: Verify user has TEACHER role
3. **Ownership**: Teachers can only access their own lesson plans
4. **Input Validation**: Sanitize all user inputs
5. **SQL Injection**: Use Prisma parameterized queries
6. **XSS Prevention**: Escape user-generated content

## Performance Considerations

1. **Pagination**: Limit results to 10-20 per page
2. **Indexing**: Database indexes on teacherId, classId, date
3. **Lazy Loading**: Load lesson plan details only when needed
4. **Caching**: Consider caching class list
5. **Optimistic Updates**: Update UI before API response for better UX

## Integration Points

### Existing Systems
- **Authentication**: Use existing session management
- **Teacher Data**: Fetch from existing teacher API
- **Class Data**: Use existing `/api/classes` endpoint
- **UI Components**: Use existing component library
- **Styling**: Follow existing design system

### Future Enhancements
- Attach files/documents to lesson plans
- Share lesson plans with other teachers
- Template library for common lesson structures
- Print/export lesson plans to PDF
- Calendar view of lesson plans
- Link lesson plans to curriculum standards
