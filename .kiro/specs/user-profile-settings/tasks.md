# Implementation Plan

- [x] 1. Create backend API routes for profile management



  - Create GET endpoint to fetch current user profile data
  - Create PUT endpoint for email updates with password verification
  - Create PUT endpoint for password updates with current password verification
  - Add proper error handling and validation for all endpoints
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 5.1, 5.2, 5.3, 5.4, 5.5_



- [ ] 1.1 Create GET /api/user/profile endpoint
  - Implement route handler to fetch authenticated user's profile data
  - Return user email, name, phone, and role information
  - Add session validation and error handling


  - _Requirements: 1.3, 1.4, 5.1, 5.2_

- [ ] 1.2 Create PUT /api/user/profile endpoint for email updates
  - Implement route handler to update user email
  - Validate email format and uniqueness
  - Require current password verification before update
  - Hash and verify password using bcrypt
  - Update user record in database


  - Update session data with new email
  - Return success response with updated user data
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 5.1, 5.2, 5.3, 5.4_

- [ ] 1.3 Create PUT /api/user/password endpoint
  - Implement route handler to update user password
  - Validate current password is correct
  - Validate new password meets requirements (min 8 characters)

  - Validate new password matches confirmation
  - Hash new password with bcrypt
  - Update user record in database
  - Return success response
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 5.1, 5.2, 5.4_

- [ ] 1.4 Write API route tests
  - Test email update with valid data

  - Test email update with duplicate email
  - Test email update with incorrect password
  - Test password update with valid data
  - Test password update with incorrect current password
  - Test password update with mismatched passwords
  - Test password update with weak password
  - Test unauthorized access attempts
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 5.1, 5.2, 5.3, 5.4, 5.5_


- [ ] 2. Update admin settings page with real API integration
  - Replace localStorage mock with real API calls
  - Implement email update form with validation
  - Implement password update form with validation
  - Add proper error handling and user feedback
  - Add loading states during API calls
  - Update session after successful email change
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.1, 4.2, 4.3, 4.4, 4.5_


- [ ] 2.1 Update Profile section in admin settings
  - Fetch current user data from API on page load
  - Implement email update form with current password field
  - Add email format validation
  - Call PUT /api/user/profile endpoint on form submit
  - Display success/error toast notifications
  - Update local session data after successful email change
  - Clear password field after submission
  - _Requirements: 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 4.1, 4.2, 4.3, 4.5_



- [ ] 2.2 Update Security section in admin settings
  - Implement password change form with three fields
  - Add password strength validation (min 8 characters)
  - Add password match validation
  - Call PUT /api/user/password endpoint on form submit
  - Display success/error toast notifications


  - Clear all password fields after successful update
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.1, 4.2, 4.3, 4.4_

- [ ] 3. Create settings page for teacher role
  - Create /app/dashboard/teacher/settings/page.tsx
  - Implement same profile and security sections as admin


  - Use shared components for consistency
  - Add teacher-specific navigation
  - Test email and password updates for teacher users
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 5.1, 5.2, 5.3_

- [x] 4. Create settings page for student role


  - Create /app/dashboard/student/settings/page.tsx
  - Implement same profile and security sections
  - Use shared components for consistency
  - Add student-specific navigation


  - Test email and password updates for student users
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 5.1, 5.2, 5.3_

- [ ] 5. Create settings page for parent role
  - Create /app/dashboard/parent/settings/page.tsx
  - Implement same profile and security sections
  - Use shared components for consistency
  - Add parent-specific navigation
  - Test email and password updates for parent users
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 5.1, 5.2, 5.3_

- [ ] 6. Update header profile icon navigation for non-admin roles
  - Update header component to navigate to /dashboard/{role}/settings for teacher, student, and parent
  - Keep admin navigation to /dashboard/admin/settings (already working)
  - Change teacher navigation from /dashboard/teacher/profile to /dashboard/teacher/settings
  - Change student navigation from /dashboard/student/profile to /dashboard/student/settings
  - Change parent navigation from /dashboard/parent/profile to /dashboard/parent/settings
  - Test navigation from profile icon for each role
  - _Requirements: 1.1, 1.2_

- [ ] 7. End-to-end testing and validation
  - Test complete email update flow for all roles
  - Test complete password update flow for all roles
  - Test error scenarios (wrong password, duplicate email, weak password)
  - Test session persistence after updates
  - Test form validation and error messages
  - Test loading states and user feedback
  - Verify security requirements are met
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 5.5_
