# Requirements Document

## Introduction

This feature enables public self-registration for Parents, Students, and Teachers with an admin approval workflow. Users can sign up through a public registration form, but their accounts remain in "PENDING" status until approved by an administrator.

## Glossary

- **Registration System**: The public-facing interface where users can create accounts
- **Approval Workflow**: The admin interface for reviewing and approving/rejecting pending registrations
- **Account Status**: The state of a user account (PENDING, ACTIVE, REJECTED)
- **User Role**: The type of user (PARENT, STUDENT, TEACHER)

## Requirements

### Requirement 1

**User Story:** As a parent, I want to register myself on the school portal, so that I can access my children's information once approved by the admin

#### Acceptance Criteria

1. WHEN a parent visits the registration page, THE Registration System SHALL display a form with fields for first name, last name, email, phone, password, and occupation
2. WHEN a parent submits valid registration data, THE Registration System SHALL create a user account with status "PENDING"
3. WHEN a parent with pending status attempts to login, THE Registration System SHALL display a message indicating their account is awaiting approval
4. WHEN an admin approves a parent account, THE Registration System SHALL update the account status to "ACTIVE"
5. WHERE a parent account is approved, THE Registration System SHALL allow the parent to login and access the system

### Requirement 2

**User Story:** As a student, I want to register myself on the school portal, so that I can access my academic information once approved by the admin

#### Acceptance Criteria

1. WHEN a student visits the registration page, THE Registration System SHALL display a form with fields for first name, last name, email, phone, password, date of birth, gender, and class selection
2. WHEN a student submits valid registration data, THE Registration System SHALL create a user account with status "PENDING"
3. WHEN a student with pending status attempts to login, THE Registration System SHALL display a message indicating their account is awaiting approval
4. WHEN an admin approves a student account, THE Registration System SHALL update the account status to "ACTIVE" and generate a roll number
5. WHERE a student account is approved, THE Registration System SHALL allow the student to login and access the system

### Requirement 3

**User Story:** As a teacher, I want to register myself on the school portal, so that I can access teaching tools once approved by the admin

#### Acceptance Criteria

1. WHEN a teacher visits the registration page, THE Registration System SHALL display a form with fields for first name, last name, email, phone, password, and subjects taught
2. WHEN a teacher submits valid registration data, THE Registration System SHALL create a user account with status "PENDING"
3. WHEN a teacher with pending status attempts to login, THE Registration System SHALL display a message indicating their account is awaiting approval
4. WHEN an admin approves a teacher account, THE Registration System SHALL update the account status to "ACTIVE" and generate an employee ID
5. WHERE a teacher account is approved, THE Registration System SHALL allow the teacher to login and access the system

### Requirement 4

**User Story:** As an admin, I want to review pending registrations, so that I can approve or reject user accounts

#### Acceptance Criteria

1. WHEN an admin accesses the pending registrations page, THE Approval Workflow SHALL display all accounts with "PENDING" status
2. WHEN an admin views a pending registration, THE Approval Workflow SHALL display all submitted information for review
3. WHEN an admin approves a registration, THE Approval Workflow SHALL update the account status to "ACTIVE"
4. WHEN an admin rejects a registration, THE Approval Workflow SHALL update the account status to "REJECTED" with optional reason
5. WHERE a registration is approved or rejected, THE Approval Workflow SHALL send a notification to the user

### Requirement 5

**User Story:** As an admin, I want to see pending registration counts on my dashboard, so that I can quickly identify when new registrations need review

#### Acceptance Criteria

1. WHEN an admin views the dashboard, THE Registration System SHALL display the count of pending registrations
2. WHEN an admin clicks on the pending count, THE Registration System SHALL navigate to the pending registrations page
3. WHERE there are pending registrations, THE Registration System SHALL display a notification badge
4. WHEN a new registration is submitted, THE Registration System SHALL increment the pending count in real-time
5. WHEN an admin approves or rejects a registration, THE Registration System SHALL decrement the pending count

### Requirement 6

**User Story:** As a user with a rejected account, I want to know why my registration was rejected, so that I can correct issues and reapply

#### Acceptance Criteria

1. WHEN a user with rejected status attempts to login, THE Registration System SHALL display the rejection reason
2. WHEN an admin rejects a registration, THE Approval Workflow SHALL require a rejection reason
3. WHERE a rejection reason is provided, THE Registration System SHALL store and display it to the user
4. WHEN a rejected user views their status, THE Registration System SHALL provide guidance on how to reapply
5. WHERE a user reapplies after rejection, THE Registration System SHALL create a new pending registration
