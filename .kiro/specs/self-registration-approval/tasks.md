# Implementation Plan

- [x] 1. Update database schema with account status
  - Add `accountStatus` enum field to User model (PENDING, ACTIVE, REJECTED)
  - Add `rejectionReason`, `approvedBy`, `approvedAt` fields to User model
  - Create `RegistrationRequest` model for tracking approval workflow
  - Run Prisma migration to update database
  - _Requirements: 1.2, 2.2, 3.2, 4.3, 4.4_

- [x] 2. Create public registration API endpoint

  - [x] 2.1 Update POST `/api/auth/register` route to use PENDING status


    - ✅ Endpoint exists but creates users with ACTIVE status
    - ❌ Need to change default status to PENDING for self-registrations
    - ✅ Already validates email uniqueness and hashes passwords
    - ❌ Need to add password strength validation
    - ❌ Need to add email format validation
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

- [x] 4. Update authentication logic for account status
  - [x] 4.1 Modify login API to check account status
    - ✅ Login checks accountStatus after password verification
    - ✅ Returns proper error for PENDING status
    - ✅ Returns rejection reason for REJECTED status
    - ✅ Only allows ACTIVE users to login
    - _Requirements: 1.3, 2.3, 3.3_
  
  - [x] 4.2 Update authentication middleware
    - ✅ Middleware already blocks non-authenticated users
    - ✅ Login API handles status checks before issuing tokens
    - _Requirements: 1.3, 2.3, 3.3_

- [x] 5. Create admin registrations management API
  - [x] 5.1 Implement GET `/api/admin/pending-users` route
    - ✅ Fetches users with PENDING status
    - ✅ Returns user details (name, email, phone, role, createdAt)
    - ❌ Could add filters for role and search
    - _Requirements: 4.1, 4.2_


  
  - [x] 5.2 Implement POST `/api/admin/pending-users/[id]/approve` route
    - ✅ Updates accountStatus to "ACTIVE"
    - ✅ Sets approvedAt timestamp
    - ❌ Need to add role-specific record creation (Student, Teacher, Parent)
    - ❌ Need to set approvedBy field
    - _Requirements: 1.4, 2.4, 3.4, 4.3_
  
  - [x] 5.3 Implement POST `/api/admin/pending-users/[id]/reject` route
    - ✅ Updates accountStatus to "REJECTED"
    - ✅ Stores rejection reason
    - _Requirements: 4.4, 6.1, 6.2, 6.3_

- [x] 6. Build admin pending registrations list page
  - [x] 6.1 Create registrations list at `/app/dashboard/admin/pending-registrations/page.tsx`
    - ✅ Displays list of pending registrations
    - ✅ Shows name, role, email, phone, registration date
    - ✅ Has approve/reject buttons with confirmation
    - ✅ Shows loading states
    - ✅ Refresh functionality
    - ❌ Could add tabs for filtering (All, Pending, Approved, Rejected)
    - ❌ Could add search functionality
    - _Requirements: 4.1, 4.2, 5.1, 5.2_


- [ ] 7. Build registration detail and approval page
  - [x] 7.1 Create detail page at `/app/dashboard/admin/registrations/[id]/page.tsx`



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
  - ❌ Update admin sidebar to include "Pending Registrations" menu item
  - ❌ Add badge showing pending count (optional enhancement)
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
