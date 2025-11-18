# Implementation Plan - Teacher Lesson Plans

- [ ] 1. Update database schema and run migration
  - Add LessonPlan model to Prisma schema with all required fields
  - Add LessonPlanStatus enum (PLANNED, IN_PROGRESS, COMPLETED)
  - Add relations to Teacher and Class models
  - Generate and run Prisma migration
  - _Requirements: 1.1, 2.1, 7.1_

- [ ] 2. Create API endpoints for lesson plan management
- [ ] 2.1 Implement GET /api/lesson-plans endpoint
  - Create route handler to fetch lesson plans for authenticated teacher
  - Implement filtering by classId and status
  - Implement search functionality for topic/objectives
  - Implement pagination with page and limit parameters
  - Include class information in response
  - _Requirements: 1.1, 1.3, 1.4, 6.3, 6.4, 7.5_

- [ ] 2.2 Implement POST /api/lesson-plans endpoint
  - Create route handler to create new lesson plan
  - Validate required fields (classId, subject, date, topic, objectives, activities)
  - Verify teacher authentication and get teacherId from session
  - Save lesson plan to database with all fields
  - Return created lesson plan with success message
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10_

- [ ] 2.3 Implement PUT /api/lesson-plans/[id] endpoint
  - Create route handler to update existing lesson plan
  - Verify teacher owns the lesson plan being updated
  - Validate updated fields
  - Update lesson plan in database
  - Return updated lesson plan with success message
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 2.4 Implement DELETE /api/lesson-plans/[id] endpoint
  - Create route handler to delete lesson plan
  - Verify teacher owns the lesson plan being deleted
  - Delete lesson plan from database
  - Return success message
  - _Requirements: 4.2, 4.3_

- [ ] 2.5 Implement GET /api/lesson-plans/[id] endpoint
  - Create route handler to fetch single lesson plan details
  - Verify teacher owns the lesson plan
  - Include all fields and related class information
  - Return lesson plan details
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 3. Build main lesson plans page UI
- [ ] 3.1 Create page component structure
  - Set up page component with "use client" directive
  - Implement authentication check and redirect if not logged in
  - Create state variables for lesson plans, filters, and UI state
  - Fetch teacher's classes on component mount
  - _Requirements: 1.1, 8.1_

- [ ] 3.2 Implement lesson plans table display
  - Create table with columns: Date, Subject, Topic, Class, Status, Actions
  - Display lesson plans data in table rows
  - Add status badges with color coding (blue/yellow/green)
  - Add Edit and Delete action buttons for each row
  - Show loading state while fetching data
  - Show empty state when no lesson plans exist
  - _Requirements: 1.2, 7.3_

- [ ] 3.3 Implement filtering and search functionality
  - Add class filter dropdown
  - Add status filter dropdown
  - Add search input for topic/keywords
  - Update API call when filters change
  - Display filter counts (e.g., "Showing 5 of 20 lesson plans")
  - _Requirements: 1.3, 1.4, 6.3, 6.4, 6.5, 7.5_

- [ ] 3.4 Implement pagination controls
  - Add pagination component at bottom of table
  - Display current page and total pages
  - Add Previous/Next buttons
  - Update API call when page changes
  - _Requirements: 1.5_

- [ ] 4. Build create/edit lesson plan form
- [ ] 4.1 Create form modal component
  - Create modal component that opens for create/edit
  - Add form fields: class, subject, date, topic, objectives, activities, resources, assessment, notes, status
  - Implement form state management
  - Pre-populate form when editing existing lesson plan
  - _Requirements: 2.1, 2.2, 3.1, 3.2_

- [ ] 4.2 Implement form validation
  - Validate required fields before submission
  - Validate date format
  - Validate topic minimum length (3 characters)
  - Display validation error messages
  - Disable submit button while submitting
  - _Requirements: 2.8_

- [ ] 4.3 Implement form submission
  - Handle create lesson plan submission (POST request)
  - Handle edit lesson plan submission (PUT request)
  - Show loading state during submission
  - Display success toast on successful save
  - Display error toast on failure
  - Close modal and refresh list on success
  - _Requirements: 2.9, 2.10, 3.5, 3.6_

- [ ] 5. Implement delete functionality
  - Add delete button click handler
  - Show confirmation dialog before deleting
  - Make DELETE API request on confirmation
  - Display success toast on successful deletion
  - Display error toast on failure
  - Refresh lesson plans list after deletion
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 6. Implement lesson plan detail view
  - Create detail view component or modal
  - Display all lesson plan fields in read-only format
  - Show creation and update timestamps
  - Add Edit and Delete buttons
  - Add Back/Close button
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 7. Implement status management
  - Add status dropdown in create/edit form
  - Allow status update from table view (quick edit)
  - Update status via API
  - Refresh UI after status change
  - _Requirements: 7.1, 7.2, 7.4_

- [ ] 8. Add responsive design
  - Test layout on desktop (1920px, 1440px, 1024px)
  - Test layout on tablet (768px)
  - Test layout on mobile (375px, 414px)
  - Switch to card layout on mobile instead of table
  - Ensure all buttons and inputs are touch-friendly
  - Test form modal on all screen sizes
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 9. Polish UI and add final touches
  - Add page header with title and description
  - Add Create Lesson Plan button in header
  - Style status badges with appropriate colors
  - Add icons to buttons (Plus, Edit, Trash, etc.)
  - Ensure consistent spacing and alignment
  - Add hover effects to interactive elements
  - Test all toast notifications
  - _Requirements: 1.1, 2.1, 4.1_

- [ ] 10. Integration and final testing
  - Test complete create flow
  - Test complete edit flow
  - Test complete delete flow
  - Test all filters and search
  - Test pagination
  - Test on different browsers (Chrome, Firefox, Safari)
  - Test error scenarios (network errors, validation errors)
  - Verify teacher can only see their own lesson plans
  - Test responsive behavior on actual devices
  - _Requirements: All_
