# Implementation Plan - Homework Management System

- [ ] 1. Update database schema
  - Add 'content' field to HomeworkSubmission model for submission text
  - Update SubmissionStatus enum to include GRADED and LATE statuses
  - Generate and run Prisma migration
  - _Requirements: 6.3, 7.1_

- [ ] 2. Create homework API endpoints
- [ ] 2.1 Implement GET /api/homework endpoint
  - Create route handler to fetch homework based on user role
  - For teachers: fetch homework they created with submission statistics
  - For students: fetch homework for their classes with their submission status
  - For parents: fetch homework for their linked children
  - Implement filtering by classId, subject, and search query
  - Include related data (class, teacher, submissions count)
  - Calculate submission statistics (total, submitted, pending, late, graded)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 5.1, 5.2, 8.1, 8.2_

- [ ] 2.2 Implement POST /api/homework endpoint
  - Create route handler to create new homework assignment
  - Verify user has TEACHER role
  - Validate required fields (title, description, subject, classId, dueDate)
  - Get teacherId from session
  - Save homework to database
  - Auto-create PENDING submissions for all students in the class
  - Send notifications to all students in the class
  - Return created homework with success message
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9_

- [ ] 2.3 Implement PUT /api/homework/[id] endpoint
  - Create route handler to update homework assignment
  - Verify user is the teacher who created the homework
  - Validate updated fields
  - Update homework in database
  - Send notifications to students about the update
  - Return updated homework with success message
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

- [ ] 2.4 Implement DELETE /api/homework/[id] endpoint
  - Create route handler to delete homework
  - Verify user is the teacher who created the homework
  - Check if any submissions exist and include in confirmation
  - Delete homework from database (cascade deletes submissions)
  - Return success message
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 2.5 Implement GET /api/homework/[id] endpoint
  - Create route handler to fetch single homework with all submissions
  - Verify user has permission to view (teacher who created it, or student/parent with access)
  - Include all submissions with student information
  - Include submission statistics
  - Return homework details
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 2.6 Implement POST /api/homework/[id]/submit endpoint
  - Create route handler for student homework submission
  - Verify user has STUDENT role
  - Verify student is enrolled in the homework's class
  - Validate submission content is not empty
  - Check if submission already exists (update) or create new
  - Determine if submission is late (after due date)
  - Set status to SUBMITTED or LATE based on due date
  - Record submission timestamp
  - Send notification to teacher
  - Return submission with success message
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9_

- [ ] 2.7 Implement PUT /api/homework/submissions/[id]/grade endpoint
  - Create route handler to grade a submission
  - Verify user is the teacher who created the homework
  - Validate grade does not exceed totalMarks
  - Update submission with grade and feedback
  - Set status to GRADED
  - Send notification to student
  - Return graded submission with success message
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [ ] 2.8 Implement GET /api/homework/submissions/[id] endpoint
  - Create route handler to fetch submission details
  - Verify user has permission (teacher, student who submitted, or parent)
  - Include homework details and student information
  - Return submission details
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 3. Build teacher homework page
- [ ] 3.1 Update page component structure
  - Update existing page with proper state management
  - Implement authentication check
  - Fetch teacher's classes on mount
  - Fetch homework assignments on mount
  - _Requirements: 2.1_

- [ ] 3.2 Implement statistics cards
  - Create cards showing total assignments, total submissions, pending submissions
  - Calculate statistics from homework data
  - Display with icons and colors
  - _Requirements: 2.2, 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 3.3 Implement homework table display
  - Create table with columns: Title, Class, Subject, Due Date, Submissions (X/Y), Actions
  - Display homework data in table rows
  - Show submission statistics (submitted/total)
  - Add Edit and Delete action buttons
  - Show loading state while fetching
  - Show empty state when no homework exists
  - _Requirements: 2.2, 2.3, 2.6_

- [ ] 3.4 Implement filtering and search
  - Add class filter dropdown
  - Add subject filter input
  - Add search input for title
  - Update API call when filters change
  - _Requirements: 2.4, 2.5_

- [ ] 3.5 Connect create homework form
  - Update existing form to call API
  - Implement form validation
  - Handle form submission
  - Display success/error messages
  - Close modal and refresh list on success
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9_

- [ ] 3.6 Implement edit homework functionality
  - Add edit button click handler
  - Pre-populate form with existing data
  - Call PUT API endpoint
  - Display success/error messages
  - Refresh list on success
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

- [ ] 3.7 Implement delete homework functionality
  - Add delete button click handler
  - Show confirmation dialog
  - Call DELETE API endpoint
  - Display success/error messages
  - Refresh list on success
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 4. Build homework detail/submissions page for teachers
- [ ] 4.1 Create submissions page component
  - Create new page at /app/dashboard/teacher/homework/[id]/page.tsx
  - Fetch homework details and submissions on mount
  - Display homework information header
  - _Requirements: 3.1_

- [ ] 4.2 Display submission statistics
  - Show total students, submitted, pending, late counts
  - Calculate and display submission rate percentage
  - Display with visual indicators
  - _Requirements: 3.2, 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 4.3 Implement submissions table
  - Create table with columns: Student Name, Admission Number, Status, Submitted At, Grade, Actions
  - Display all submissions (including pending)
  - Show status badges with colors
  - Highlight late submissions
  - Add Grade button for submitted assignments
  - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 4.4 Implement grading interface
  - Create grading modal component
  - Add form fields for score and feedback
  - Validate score does not exceed totalMarks
  - Call grading API endpoint
  - Display success/error messages
  - Refresh submissions on success
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [ ] 4.5 Add filter by submission status
  - Add filter dropdown (All, Submitted, Pending, Late, Graded)
  - Filter submissions based on selection
  - _Requirements: 3.5_

- [ ] 5. Build student homework page
- [ ] 5.1 Update student page component
  - Update existing page with proper state management
  - Fetch student's homework assignments on mount
  - Display assignments list
  - _Requirements: 5.1_

- [ ] 5.2 Implement homework list display
  - Create table or card layout for assignments
  - Display title, subject, due date, status, score (if graded)
  - Show status badges (pending, submitted, graded, overdue)
  - Highlight assignments due soon (within 3 days) in yellow
  - Show overdue assignments in red
  - Add Submit/View button for each assignment
  - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.7_

- [ ] 5.3 Implement filtering
  - Add subject filter dropdown
  - Add status filter dropdown
  - Update display based on filters
  - _Requirements: 5.6_

- [ ] 5.4 Implement homework detail and submission modal
  - Create modal to show homework details
  - Display assignment instructions and resources
  - Show submission form with textarea for content
  - Add submit button
  - Show existing submission if already submitted
  - Show grade and feedback if graded
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 5.5 Implement homework submission
  - Handle submission form
  - Validate content is not empty
  - Call submission API endpoint
  - Display success/error messages
  - Update assignment list on success
  - _Requirements: 6.5, 6.6, 6.7, 6.8, 6.9_

- [ ] 6. Build parent homework page
- [ ] 6.1 Update parent page component
  - Update existing page with proper state management
  - Fetch parent's linked children on mount
  - Fetch homework for selected child
  - _Requirements: 8.1_

- [ ] 6.2 Implement child selector
  - Add dropdown to select child (if multiple children)
  - Update homework display when child changes
  - _Requirements: 8.6_

- [ ] 6.3 Implement homework display for parents
  - Display assignments in table or card layout
  - Show title, subject, due date, status, score
  - Indicate pending, submitted, or graded status
  - Highlight overdue assignments in red
  - Make display read-only (no submission capability)
  - _Requirements: 8.2, 8.3, 8.4, 8.5_

- [ ] 7. Add responsive design
  - Test layout on desktop (1920px, 1440px, 1024px)
  - Test layout on tablet (768px)
  - Test layout on mobile (375px, 414px)
  - Switch to card layout on mobile for better usability
  - Ensure all modals work on mobile
  - Test forms on touch devices
  - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [ ] 8. Polish UI and add final touches
  - Add proper icons to all buttons
  - Style status badges with appropriate colors
  - Add loading skeletons
  - Add empty states with helpful messages
  - Ensure consistent spacing and alignment
  - Add hover effects to interactive elements
  - Test all toast notifications
  - Add confirmation dialogs where needed
  - _Requirements: All_

- [ ] 9. Integration and final testing
  - Test complete teacher workflow (create, view, grade, delete)
  - Test complete student workflow (view, submit, view feedback)
  - Test parent monitoring workflow
  - Test late submission detection
  - Test submission statistics accuracy
  - Test all filters and search
  - Test on different browsers (Chrome, Firefox, Safari)
  - Test error scenarios (network errors, validation errors)
  - Verify role-based access control
  - Test responsive behavior on actual devices
  - Verify notifications are sent correctly
  - _Requirements: All_
