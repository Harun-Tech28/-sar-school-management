# Design Document

## Overview

The self-registration with admin approval system allows public users to create accounts that require administrator verification before activation. This ensures security while providing accessibility. The system includes a public registration interface, an admin approval dashboard, and status-based authentication logic.

## Architecture

### Database Schema Changes

Add `accountStatus` field to User model:
- PENDING: Initial status after registration
- ACTIVE: Approved by admin, can login
- REJECTED: Rejected by admin, cannot login

Add `RegistrationRequest` model to track approval workflow:
- Links to User record
- Stores submission timestamp
- Stores admin review details (approver, timestamp, reason)

### Component Structure

```
app/
├── auth/
│   ├── register/
│   │   └── page.tsx          # Public registration form
│   └── registration-status/
│       └── page.tsx           # Status check page
├── dashboard/
│   └── admin/
│       └── registrations/
│           ├── page.tsx       # Pending registrations list
│           └── [id]/
│               └── page.tsx   # Registration detail & approval
api/
├── auth/
│   └── register/
│       └── route.ts           # Registration endpoint
└── admin/
    └── registrations/
        ├── route.ts           # List pending registrations
        └── [id]/
            ├── approve/
            │   └── route.ts   # Approve registration
            └── reject/
                └── route.ts   # Reject registration
```

## Data Models

### Updated User Model

```prisma
model User {
  // ... existing fields
  accountStatus    AccountStatus @default(PENDING)
  rejectionReason  String?
  approvedBy       String?
  approvedAt       DateTime?
}

enum AccountStatus {
  PENDING
  ACTIVE
  REJECTED
}
```

### Registration Request Model

```prisma
model RegistrationRequest {
  id              String   @id @default(cuid())
  userId          String   @unique
  role            Role
  submittedAt     DateTime @default(now())
  reviewedAt      DateTime?
  reviewedBy      String?  // Admin user ID
  status          AccountStatus @default(PENDING)
  rejectionReason String?
  additionalInfo  Json?    // Role-specific data
  user            User     @relation(fields: [userId], references: [id])
  
  @@index([status])
  @@index([submittedAt])
}
```

## Components and Interfaces

### 1. Public Registration Form (`app/auth/register/page.tsx`)

**Features:**
- Role selection (Parent, Student, Teacher)
- Dynamic form fields based on role
- Password strength validation
- Email uniqueness check
- Success message with next steps

**Form Fields by Role:**

**Parent:**
- First Name, Last Name
- Email, Phone
- Password, Confirm Password
- Occupation (optional)

**Student:**
- First Name, Last Name
- Email, Phone
- Password, Confirm Password
- Date of Birth
- Gender
- Preferred Class/Form

**Teacher:**
- First Name, Last Name
- Email, Phone
- Password, Confirm Password
- Subjects (multi-select)
- Qualifications (optional)

### 2. Registration Status Page (`app/auth/registration-status/page.tsx`)

**Features:**
- Check registration status by email
- Display current status (Pending, Approved, Rejected)
- Show rejection reason if applicable
- Provide contact information for support

### 3. Admin Pending Registrations List (`app/dashboard/admin/registrations/page.tsx`)

**Features:**
- Tabbed interface (All, Pending, Approved, Rejected)
- Filter by role (Parent, Student, Teacher)
- Search by name or email
- Sort by submission date
- Quick approve/reject actions
- Bulk actions (approve/reject multiple)

**Display Information:**
- Applicant name
- Role
- Email & Phone
- Submission date
- Quick action buttons

### 4. Registration Detail & Approval (`app/dashboard/admin/registrations/[id]/page.tsx`)

**Features:**
- Full applicant information display
- Role-specific details
- Approve button with confirmation
- Reject button with reason input
- Activity log (submission, reviews, status changes)
- Contact applicant option

### 5. Dashboard Widget

Add pending registrations widget to admin dashboard:
- Count of pending registrations
- Quick link to registrations page
- Recent submissions preview

## API Endpoints

### POST `/api/auth/register`

**Request:**
```typescript
{
  role: "PARENT" | "STUDENT" | "TEACHER",
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  password: string,
  // Role-specific fields
  occupation?: string,        // Parent
  dateOfBirth?: string,       // Student
  gender?: string,            // Student
  classId?: string,           // Student
  subjects?: string[],        // Teacher
  qualifications?: string     // Teacher
}
```

**Response:**
```typescript
{
  success: true,
  message: "Registration submitted successfully. Please wait for admin approval.",
  userId: string
}
```

### GET `/api/admin/registrations`

**Query Parameters:**
- status: "PENDING" | "ACTIVE" | "REJECTED"
- role: "PARENT" | "STUDENT" | "TEACHER"
- search: string

**Response:**
```typescript
{
  registrations: [{
    id: string,
    user: {
      fullName: string,
      email: string,
      phone: string,
      role: string
    },
    submittedAt: string,
    status: string,
    additionalInfo: object
  }],
  total: number,
  pending: number
}
```

### POST `/api/admin/registrations/[id]/approve`

**Response:**
```typescript
{
  success: true,
  message: "Registration approved successfully",
  user: object
}
```

### POST `/api/admin/registrations/[id]/reject`

**Request:**
```typescript
{
  reason: string
}
```

**Response:**
```typescript
{
  success: true,
  message: "Registration rejected"
}
```

## Authentication Logic Updates

### Login Flow Changes

1. User submits login credentials
2. System verifies email and password
3. **NEW:** Check `accountStatus`
   - If PENDING: Show "Account pending approval" message
   - If REJECTED: Show "Account rejected: {reason}" message
   - If ACTIVE: Proceed with normal login

### Middleware Updates

Update authentication middleware to check account status:
- Block access for PENDING and REJECTED users
- Allow only ACTIVE users to access protected routes

## Error Handling

### Registration Errors

- Duplicate email: "An account with this email already exists"
- Invalid email format: "Please enter a valid email address"
- Weak password: "Password must be at least 8 characters with uppercase, lowercase, and numbers"
- Missing required fields: "Please fill in all required fields"
- Server error: "Registration failed. Please try again later"

### Approval Errors

- User not found: "Registration request not found"
- Already processed: "This registration has already been processed"
- Invalid status transition: "Cannot change status from {current} to {new}"

## Testing Strategy

### Unit Tests

- Registration form validation
- Password strength checker
- Email uniqueness validation
- Status transition logic

### Integration Tests

- Complete registration flow
- Admin approval workflow
- Admin rejection workflow
- Login with different account statuses
- Middleware access control

### E2E Tests

- User registers → Admin approves → User logs in
- User registers → Admin rejects → User sees rejection
- Multiple pending registrations management
- Bulk approval/rejection

## Security Considerations

1. **Password Security:**
   - Hash passwords before storage
   - Enforce strong password requirements
   - No password in API responses

2. **Email Verification:**
   - Optional: Add email verification step
   - Prevent spam registrations

3. **Rate Limiting:**
   - Limit registration attempts per IP
   - Prevent automated abuse

4. **Admin Authorization:**
   - Only admins can access approval endpoints
   - Log all approval/rejection actions

5. **Data Privacy:**
   - Don't expose pending user data publicly
   - Secure admin-only routes

## UI/UX Considerations

### Registration Form

- Clear role selection
- Progressive disclosure (show relevant fields)
- Real-time validation feedback
- Success confirmation with timeline
- Mobile-responsive design

### Admin Interface

- Clear visual status indicators
- Efficient bulk actions
- Quick filters and search
- Detailed applicant profiles
- One-click approval/rejection

### Status Communication

- Clear messaging for each status
- Helpful next steps
- Support contact information
- Estimated approval timeline

## Future Enhancements

1. Email notifications for status changes
2. SMS notifications option
3. Document upload (certificates, ID)
4. Interview scheduling for teachers
5. Parent-student linking during registration
6. Automated approval based on criteria
7. Registration analytics dashboard
