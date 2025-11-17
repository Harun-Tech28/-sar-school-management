# 🧪 Test Approval Workflow - Step by Step

## ✅ Current Status
- **Pending User:** camor@gmail.com (CAMOR UBUNTU - PARENT)
- **Admin Accounts Available:** 4 active admins
- **System:** Ready for testing

## 📋 Testing Steps

### Step 1: Start Development Server
```bash
npm run dev
```
Wait for: `Ready on http://localhost:3000`

### Step 2: Login as Admin
1. Open browser: http://localhost:3000/auth/login
2. Use one of these admin accounts:
   - **admin@sar.edu** (default admin)
   - **harunadramani5@gmail.com**
   - **osmanabdullah010@gmail.com**
   - **samuel@gmail.com**
3. Enter password and login

### Step 3: Navigate to Pending Registrations
**Option A - Via Sidebar:**
- Look for "User Management" section in sidebar
- Click "Pending Registrations"

**Option B - Direct URL:**
- Go to: http://localhost:3000/dashboard/admin/pending-registrations

**Option C - Via Dashboard Widget:**
- From admin dashboard, look for orange "Pending Registrations" widget
- Click on it

### Step 4: Verify Pending User Appears
You should see:
```
┌─────────────────────────────────────────────────────┐
│ CAMOR UBUNTU                            [PARENT]    │
│ 📧 camor@gmail.com                                  │
│ 🕐 Registered 11/17/2025                            │
│                                                      │
│                        [Approve ✓]  [Reject ✗]     │
└─────────────────────────────────────────────────────┘
```

### Step 5: Test Approval
1. Click the **[Approve]** button
2. Confirm the action
3. Watch for success message
4. User should disappear from pending list

### Step 6: Verify Approval Success
Run this script to check:
```bash
node scripts/verify-approval.js
```

Or check manually:
- User status should be ACTIVE (not PENDING)
- Parent record should be created
- User can now login

### Step 7: Test Login with Approved User
1. Logout from admin account
2. Go to: http://localhost:3000/auth/login
3. Login with:
   - Email: camor@gmail.com
   - Password: [the password you used during registration]
4. Should successfully access parent dashboard

## 🎯 Expected Results

### Before Approval:
- ❌ User cannot login (blocked by PENDING status)
- ✅ User appears in pending registrations list
- ✅ Status check shows "pending approval"

### After Approval:
- ✅ User can login successfully
- ✅ User removed from pending list
- ✅ Parent record created in database
- ✅ Status changed to ACTIVE

## 🔍 Verification Commands

### Check pending users:
```bash
node scripts/quick-check-pending.js
```

### Check specific user status:
```bash
node scripts/check-user-status.js camor@gmail.com
```

### View all recent users:
```bash
npx prisma studio
```

## 🐛 Troubleshooting

### Issue: Can't see pending user in list
**Solutions:**
1. Hard refresh page (Ctrl+Shift+R)
2. Check browser console for errors (F12)
3. Verify API is working: http://localhost:3000/api/admin/pending-users
4. Check server logs in terminal

### Issue: Approval button doesn't work
**Solutions:**
1. Check browser console for errors
2. Verify you're logged in as admin
3. Check server logs for API errors
4. Verify database connection

### Issue: User still can't login after approval
**Solutions:**
1. Verify status changed to ACTIVE:
   ```bash
   node scripts/quick-check-pending.js
   ```
2. Check if Parent record was created
3. Clear browser cache and try again
4. Verify password is correct

## 📊 Success Metrics

✅ Pending user visible in admin panel
✅ Approval process completes without errors
✅ User status changes from PENDING to ACTIVE
✅ Role-specific record created (Parent table)
✅ User can login after approval
✅ User has access to appropriate dashboard

## 🎉 Next Steps After Testing

Once the approval workflow is verified:

1. **Test Rejection Flow:**
   - Register another test user
   - Click "Reject" instead of "Approve"
   - Verify user is marked as REJECTED

2. **Test Dashboard Widget:**
   - Check if pending count shows on admin dashboard
   - Verify widget updates after approval

3. **Test Status Check Page:**
   - Go to: http://localhost:3000/auth/registration-status
   - Enter pending user email
   - Verify status message

4. **Production Deployment:**
   - System is ready for production use
   - All approval workflows are functional
   - Admin can manage registrations effectively

---

**Ready to test? Start with Step 1! 🚀**
