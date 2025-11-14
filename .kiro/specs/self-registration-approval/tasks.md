# Implementation Plan

- [x] 1. Update database schema with account status


  - Add `accountStatus` enum field to User model (PENDING, ACTIVE, REJECTED)
  - Add `rejectionReason`, `approvedBy`, `approvedAt` fields to User model
  - Create `RegistrationRequest` model for tracking approval workflow
  - Run Prisma migration to update database
  - _Requirements: 1.2, 2.2, 3.2, 4.3, 4.4_


- [ ] 2. Create public registration API endpoint
  - [ ] 2.1 Implement POST `/api/auth/register` route
    - Validate registration data (email format, password strength, required fields)
    - Check for duplicate email addresses
    - Hash password using bcrypt
    - Create User record with accountStatus = "PENDING"
    - Create RegistrationRequest record
    - Return success response with userId
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.1, 3.2_




- [ ] 3. Build public registration form
  - [ ] 3.1 Create registration page at `/app/auth/register/page.tsx`
    - Implement role selection dropdown (Parent, Student, Teacher)
    - Create dynamic form that shows role-specific fields
    - Add form validation (client-side)
    - Implement password strength indicator
    - Add confirm password field with matching validation
    - Show success message after submission
    - _Requirements: 1.1, 2.1, 3.1_
  


  - [ ] 3.2 Add link to registration page from login page
    - Update login page to include "Don't have an account? Register here" link
    - _Requirements: 1.1, 2.1, 3.1_

- [ ] 4. Update authentication logic for account status
  - [ ] 4.1 Modify login API to check account status
    - After password verification, check user.accountStatus
    - If PENDING, return error: "Account pending admin approval"
    - If REJECTED, return error with rejection reason
    - If ACTIVE, proceed with normal login flow
    - _Requirements: 1.3, 2.3, 3.3_
  
  - [ ] 4.2 Update authentication middleware
    - Add account status check in middleware
    - Block PENDING and REJECTED users from accessing protected routes
    - Allow only ACTIVE users
    - _Requirements: 1.3, 2.3, 3.3_

- [ ] 5. Create admin registrations management API
  - [ ] 5.1 Implement GET `/api/admin/registrations` route
    - Fetch all registration requests with filters (status, role)
    - Support search by name or email
    - Return registration list with user details
    - Include counts (total, pending, approved, rejected)
    - _Requirements: 4.1, 4.2_
  
  - [ ] 5.2 Implement POST `/api/admin/registrations/[id]/approve` route
    - Update user accountStatus to "ACTIVE"
    - Set approvedBy and approvedAt fields
    - Generate role-specific IDs (rollNumber for students, employeeId for teachers)
    - Update RegistrationRequest status
    - _Requirements: 1.4, 2.4, 3.4, 4.3_
  
  - [ ] 5.3 Implement POST `/api/admin/registrations/[id]/reject` route
    - Update user accountStatus to "REJECTED"
    - Store rejection reason
    - Update RegistrationRequest status
    - _Requirements: 4.4, 6.1, 6.2, 6.3_

- [ ] 6. Build admin pending registrations list page
  - [ ] 6.1 Create registrations list at `/app/dashboard/admin/registrations/page.tsx`
    - Display table of pending registrations
    - Show applicant name, role, email, phone, submission date
    - Add tabs for filtering (All, Pending, Approved, Rejected)
    - Implement search functionality
    - Add quick approve/reject buttons
    - Show loading states
    - _Requirements: 4.1, 4.2, 5.1, 5.2_

- [ ] 7. Build registration detail and approval page
  - [ ] 7.1 Create detail page at `/app/dashboard/admin/registrations/[id]/page.tsx`
    - Display full applicant information
    - Show role-specific details (occupation, subjects, class preference)
    - Add "Approve" button with confirmation dialog
    - Add "Reject" button with reason input modal
    - Show registration status and timeline
    - _Requirements: 4.2, 4.3, 4.4_

- [ ] 8. Add pending registrations to admin dashboard
  - [ ] 8.1 Create dashboard widget for pending registrations
    - Show count of pending registrations
    - Display as clickable card that links to registrations page
    - Add notification badge if count > 0
    - Show recent 3 pending registrations preview
    - _Requirements: 5.1, 5.2, 5.3_

- [ ] 9. Create registration status check page
  - [ ] 9.1 Build status page at `/app/auth/registration-status/page.tsx`
    - Allow users to check status by email
    - Display current status (Pending, Approved, Rejected)
    - Show rejection reason if rejected
    - Provide estimated approval timeline
    - Show support contact information
    - _Requirements: 6.1, 6.3, 6.4_

- [ ] 10. Add sidebar menu item for admin registrations
  - Update admin sidebar to include "Registrations" menu item
  - Add badge showing pending count
  - _Requirements: 5.1, 5.2_

- [ ] 11. Update existing user creation flows
  - [ ] 11.1 Update admin-created users to have ACTIVE status
    - Modify `/api/students/route.ts` POST to set accountStatus = "ACTIVE"
    - Modify `/api/teachers/route.ts` POST to set accountStatus = "ACTIVE"
    - Modify `/api/parents/route.ts` POST to set accountStatus = "ACTIVE"
    - _Requirements: 1.4, 2.4, 3.4_

- [ ] 12. Add registration confirmation page
  - [ ] 12.1 Create success page at `/app/auth/register/success/page.tsx`
    - Show success message
    - Explain approval process
    - Provide estimated timeline
    - Show link to status check page
    - _Requirements: 1.2, 2.2, 3.2_
