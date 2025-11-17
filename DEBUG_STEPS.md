# 🐛 Quick Debug Steps

## The Problem
You can't see the pending user (camor@gmail.com) on the pending registrations page, even though it's in the database.

## Quick Fix Steps

### 1. Test API Directly (30 seconds)

**While your dev server is running:**

Open this URL in your browser:
```
http://localhost:3000/api/admin/pending-users
```

**What you should see:**
```json
{
  "success": true,
  "users": [
    {
      "email": "camor@gmail.com",
      "fullName": "CAMOR  UBUNTU",
      "role": "PARENT",
      "accountStatus": "PENDING"
    }
  ],
  "count": 1
}
```

**If you see this:** API is working! Problem is in the frontend.

**If you don't see this:** API has an issue.

### 2. Check Browser Console (1 minute)

1. Go to: http://localhost:3000/dashboard/admin/pending-registrations
2. Press **F12** (opens Developer Tools)
3. Click **Console** tab
4. Look for red errors or logs starting with `[Pending Page]`

**Take a screenshot and share it if you see errors!**

### 3. Check Server Logs (30 seconds)

Look at your terminal where `npm run dev` is running.

**Look for:**
- `[pending-users API] Request received`
- `[pending-users API] Found 1 pending users`

**If you don't see these:** The API isn't being called.

### 4. Try Test Page (1 minute)

Visit this diagnostic page:
```
http://localhost:3000/dashboard/admin/test-pending-api
```

Click "Test API" button and see the result.

## Most Likely Issues

### Issue #1: Not Logged In as Admin
**Solution:** Make sure you're logged in with an admin account, not the pending user!

### Issue #2: Page Cached
**Solution:** Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

### Issue #3: Server Not Running
**Solution:** Make sure `npm run dev` is running

### Issue #4: Wrong URL
**Solution:** Make sure you're at:
```
http://localhost:3000/dashboard/admin/pending-registrations
```

## Quick Commands

```bash
# Verify user is in database
node scripts/quick-check-pending.js

# Test API logic
node scripts/test-pending-api.js

# Check if you're using the right admin
node scripts/find-admin.js
```

## What to Share

If still not working, share:
1. Screenshot of browser console (F12 → Console tab)
2. Screenshot of the pending page
3. Copy of server logs from terminal
4. Result from: http://localhost:3000/api/admin/pending-users

---

**Start with Step 1 - test the API directly!**
