# Design Document: User Profile Settings

## Overview

This design document outlines the implementation of a user profile settings feature that allows all users (Admin, Teacher, Student, Parent) to manage their account credentials (email and password) from within their dashboard. The feature will integrate with the existing settings page structure and provide secure, validated updates to user credentials.

## Architecture

### System Components

1. **Frontend Components**
   - Settings page with Profile/Security tabs (already exists at `/dashboard/admin/settings`)
   - Reusable settings pages for all user roles
   - Form components for email and password updates
   - Validation and error handling UI

2. **Backend API Routes**
   - `PUT /api/user/profile` - Update user email
   - `PUT /api/user/password` - Update user password
   - `GET /api/user/profile` - Get current user profile data

3. **Database Layer**
   - User model (already exists in Prisma schema)
   - Email uniqueness validation
   - Password hashing with bcrypt

4. **Session Management**
   - Session validation for authenticated requests
   - Session update after email change

## Components and Interfaces

### Frontend Components

#### 1. Universal Settings Page Structure
```typescript
// app/dashboard/[role]/settings/page.tsx
// Shared across all roles: admin, teacher, student, parent

interface SettingsPageProps {
  role: 'admin' | 'teacher' | 'student' | 'parent'
}
```

#### 2. Profile Settings Section
```typescript
interface ProfileFormData {
  email: string
  currentPassword: string // Required for email change
}

interface ProfileSectionProps {
  currentEmail: string
  onUpdate: (data: ProfileFormData) => Promise<void>
}
```

#### 3. Password Settings Section
```typescript
interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface PasswordSectionProps {
  onUpdate: (data: PasswordFormData) => Promise<void>
}
```

### API Interfaces

#### Update Email Endpoint
```typescript
// PUT /api/user/profile
interface UpdateEmailRequest {
  email: string
  currentPassword: string
}

interface UpdateEmailResponse {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    fullName: string
    role: string
  }
}
```

#### Update Password Endpoint
```typescript
// PUT /api/user/password
interface UpdatePasswordRequest {
  currentPassword: string
  newPassword: string
}

interface UpdatePasswordResponse {
  success: boolean
  message: string
}
```

#### Get Profile Endpoint
```typescript
// GET /api/user/profile
interface GetProfileResponse {
  id: string
  email: string
  fullName: string
  firstName: string
  lastName: string
  phone?: string
  role: string
  createdAt: string
}
```

## Data Models

### Existing User Model (Prisma)
```prisma
model User {
  id                  String              @id @default(cuid())
  email               String              @unique
  password            String              // Hashed with bcrypt
  firstName           String              @default("")
  middleName          String?
  lastName            String              @default("")
  fullName            String
  phone               String?
  role                Role
  accountStatus       AccountStatus       @default(ACTIVE)
  // ... other fields
}
```

No database schema changes required - we'll use existing User model.

## Error Handling

### Validation Errors

1. **Email Validation**
   - Invalid email format
   - Email already exists
   - Empty email field

2. **Password Validation**
   - Current password incorrect
   - New password too short (< 8 characters)
   - Passwords don't match
   - New password same as current password

3. **Authentication Errors**
   - Session expired
   - Unauthorized access
   - Invalid user ID

### Error Response Format
```typescript
interface ErrorResponse {
  success: false
  error: string
  field?: string // Which field caused the error
}
```

### Frontend Error Display
- Toast notifications for success/error messages
- Inline field validation errors
- Loading states during API calls
- Clear error messages with actionable guidance

## Security Considerations

### Password Security
1. **Current Password Verification**
   - Always require current password for email or password changes
   - Use bcrypt.compare() for verification
   - Rate limiting on failed attempts (future enhancement)

2. **Password Hashing**
   - Use bcrypt with salt rounds = 10
   - Never store plain text passwords
   - Hash new passwords before database update

3. **Password Requirements**
   - Minimum 8 characters
   - Should include mix of characters (enforced by existing validation)

### Email Security
1. **Uniqueness Validation**
   - Check email doesn't exist before update
   - Case-insensitive email comparison
   - Proper database constraints

2. **Email Verification** (Future Enhancement)
   - Send verification email to new address
   - Confirm before finalizing change
   - Keep old email until verified

### Session Security
1. **Authentication Required**
   - All endpoints require valid session
   - Verify user can only update their own profile
   - Session token validation

2. **Session Updates**
   - Update session data after email change
   - Maintain session continuity
   - No forced logout after changes

## Testing Strategy

### Unit Tests
1. **API Route Tests**
   - Test email update with valid data
   - Test email update with duplicate email
   - Test email update with wrong password
   - Test password update with valid data
   - Test password update with wrong current password
   - Test password update with mismatched passwords
   - Test password update with weak password

2. **Validation Tests**
   - Email format validation
   - Password strength validation
   - Required field validation

### Integration Tests
1. **End-to-End Flows**
   - User logs in → navigates to settings → updates email → success
   - User logs in → navigates to settings → updates password → success
   - User attempts update with wrong password → error displayed
   - User attempts duplicate email → error displayed

2. **Session Management**
   - Session persists after email update
   - Session data reflects new email
   - User can continue using system after updates

### Manual Testing Checklist
- [ ] Admin can update email and password
- [ ] Teacher can update email and password
- [ ] Student can update email and password
- [ ] Parent can update email and password
- [ ] Error messages display correctly
- [ ] Success messages display correctly
- [ ] Form validation works
- [ ] Loading states work
- [ ] Session updates correctly
- [ ] Cannot use duplicate email
- [ ] Cannot update without current password
- [ ] Password requirements enforced

## Implementation Plan

### Phase 1: Backend API Routes
1. Create `/api/user/profile` GET endpoint
2. Create `/api/user/profile` PUT endpoint (email update)
3. Create `/api/user/password` PUT endpoint
4. Add validation and error handling
5. Test API endpoints

### Phase 2: Frontend Components
1. Update existing settings page to use real API
2. Add email update form with validation
3. Add password update form with validation
4. Implement error handling and user feedback
5. Add loading states

### Phase 3: Multi-Role Support & Navigation
1. Create settings pages for teacher role
2. Create settings pages for student role
3. Create settings pages for parent role
4. Update header profile icon navigation for all roles
5. Ensure consistent UI across all roles

### Phase 4: Testing & Polish
1. Test all user roles
2. Test error scenarios
3. Test session management
4. Test profile icon navigation
5. Polish UI/UX
6. Add success animations

## Navigation

### Profile Icon Access
Users access their settings by clicking the **profile icon** in the top-right corner of the header:
- Icon is already present in the header component
- **Admin**: Already navigates to `/dashboard/admin/settings` (no changes needed)
- **Teacher/Student/Parent**: Currently navigates to `/dashboard/{role}/profile` 
- We'll create settings pages at `/dashboard/{role}/settings` for teacher, student, and parent
- Update header navigation to use `/dashboard/{role}/settings` for non-admin roles

### Header Profile Icon Behavior
```
┌─────────────────────────────────────────┐
│  Header                    [🔍] [🔔] [👤]│ ← Profile Icon
└─────────────────────────────────────────┘
                                    ↓
                Admin: /dashboard/admin/settings (existing)
                Teacher: /dashboard/teacher/settings (new)
                Student: /dashboard/student/settings (new)
                Parent: /dashboard/parent/settings (new)
```

## UI/UX Design

### Settings Page Layout
```
┌─────────────────────────────────────────┐
│  Settings                                │
│  Manage your account settings            │
├─────────────┬───────────────────────────┤
│  Sidebar    │  Content Area             │
│             │                           │
│  Profile    │  Profile Settings         │
│  Security ← │  ┌─────────────────────┐ │
│  Notif...   │  │ Email               │ │
│  Prefer...  │  │ [current@email.com] │ │
│  Privacy    │  │                     │ │
│  System     │  │ Current Password    │ │
│             │  │ [**********]        │ │
│             │  │                     │ │
│             │  │ [Update Email]      │ │
│             │  └─────────────────────┘ │
│             │                           │
│             │  Password Settings        │
│             │  ┌─────────────────────┐ │
│             │  │ Current Password    │ │
│             │  │ [**********]        │ │
│             │  │                     │ │
│             │  │ New Password        │ │
│             │  │ [**********]        │ │
│             │  │                     │ │
│             │  │ Confirm Password    │ │
│             │  │ [**********]        │ │
│             │  │                     │ │
│             │  │ [Update Password]   │ │
│             │  └─────────────────────┘ │
└─────────────┴───────────────────────────┘
```

### Visual Feedback
- **Loading**: Spinner on button with "Updating..." text
- **Success**: Green toast notification with checkmark
- **Error**: Red toast notification with error icon
- **Validation**: Inline red text under invalid fields

### Color Scheme
- Primary: #E31E24 (SAR Red)
- Success: Green (#10B981)
- Error: Red (#EF4444)
- Warning: Amber (#F59E0B)

## Dependencies

### Existing Dependencies (No New Installs Required)
- `bcrypt` - Password hashing
- `prisma` - Database ORM
- `react-hot-toast` - Toast notifications
- `lucide-react` - Icons

### Existing Code to Leverage
- Session management (`lib/session.ts`)
- Password validation (`lib/password-validation.ts`)
- Database client (`lib/prisma.ts`)
- Existing settings page structure

## Future Enhancements

1. **Email Verification**
   - Send verification email before finalizing change
   - Temporary email change pending verification

2. **Two-Factor Authentication**
   - Add 2FA setup in security settings
   - SMS or authenticator app support

3. **Password Strength Meter**
   - Visual indicator of password strength
   - Real-time feedback as user types

4. **Activity Log**
   - Show recent account changes
   - Login history
   - Security alerts

5. **Profile Picture**
   - Upload and manage profile photo
   - Avatar customization

6. **Account Deletion**
   - Self-service account deletion
   - Data export before deletion

## Rollout Strategy

1. **Development**: Implement and test in development environment
2. **Staging**: Deploy to staging for internal testing
3. **Beta**: Enable for admin users first
4. **Production**: Roll out to all user roles
5. **Monitor**: Track usage and errors
6. **Iterate**: Gather feedback and improve

## Success Metrics

- Users successfully update email without errors
- Users successfully update password without errors
- Error rate < 5% for valid update attempts
- Session continuity maintained after updates
- No security vulnerabilities reported
- Positive user feedback on ease of use
