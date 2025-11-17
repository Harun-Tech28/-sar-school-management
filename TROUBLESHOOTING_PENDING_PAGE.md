# 🔧 Troubleshooting: Pending Page Not Showing Users

## Current Situation
- ✅ User exists in database (camor@gmail.com - PENDING)
- ✅ API logic is correct
- ❌ Frontend page not displaying the user

## Step-by-Step Debugging

### Step 1: Test the API Directly

**Option A - Browser:**
1. Start dev server: `npm run dev`
2. Login as admin
3. Visit: http://localhost:3000/dashboard/admin/test-pending-api
4. Click "Test API" button
5. Check the result

**Option B - Direct URL:**
1. Open browser
2. Go to: http://localhost:3000/api/admin/pending-users
3. You should see JSON with the pending user

**Expected Result:**
```json
{
  "success": true,
  "users": [
    {
      "id": "...",
      "email": "camor@gmail.com",
      "fullName": "CAMOR  UBUNTU",
      "role": "PARENT",
      "accountStatus": "PENDING",
      "createdAt": "2025-11-17T10:38:10.620Z"
    }
  ],
  "count": 1
}
```

### Step 2: Check Browser Console

1. Open pending registrations page
2. Press F12 to open Developer Tools
3. Go to "Console" tab
4. Look for logs starting with `[Pending Page]`

**What to look for:**
```
[Pending Page] Fetching pending users...
[Pending Page] Response status: 200
[Pending Page] Response ok: true
[Pending Page] Received data: {...}
[Pending Page] Users array: [...]
[Pending Page] Users count: 1
[Pending Page] Loading complete
```

### Step 3: Check Server Logs

Look at your terminal where `npm run dev` is running.

**What to look for:**
```
[pending-users API] Request received
[pending-users API] Found 1 pending users
[pending-users API] Users: [...]
[pending-users API] Sending response: {...}
```

### Step 4: Check Network Tab

1. Open Developer Tools (F12)
2. Go to "Network" tab
3. Refresh the pending registrations page
4. Look for request to `/api/admin/pending-users`
5. Click on it to see:
   - Request headers
   - Response data
   - Status code

## Common Issues & Solutions

### Issue 1: API Returns Empty Array
**Symptoms:** API works but returns `users: []`

**Solutions:**
1. Verify user is still PENDING:
   ```bash
   node scripts/quick-check-pending.js
   ```

2. Check database connection in `.env`

3. Restart dev server

### Issue 2: 401 Unauthorized
**Symptoms:** API returns 401 error

**Solutions:**
1. Make sure you're logged in as ADMIN
2. Check session/cookie in browser
3. Try logging out and back in

### Issue 3: 500 Server Error
**Symptoms:** API returns 500 error

**Solutions:**
1. Check server logs for error details
2. Verify database is running
3. Check Prisma connection

### Issue 4: Page Shows "Loading..." Forever
**Symptoms:** Page stuck on loading state

**Solutions:**
1. Check browser console for errors
2. Check if API request is being made (Network tab)
3. Hard refresh page (Ctrl+Shift+R)

### Issue 5: CORS or Network Error
**Symptoms:** Fetch fails with network error

**Solutions:**
1. Verify dev server is running
2. Check you're on correct URL (localhost:3000)
3. Clear browser cache

## Quick Diagnostic Commands

```bash
# Check if user is still pending
node scripts/quick-check-pending.js

# Verify approval status
node scripts/verify-approval.js

# Test API logic
node scripts/test-pending-api.js

# Find admin accounts
node scripts/find-admin.js
```

## Manual Testing Steps

### Test 1: Direct API Call
```bash
# While server is running, in another terminal:
curl http://localhost:3000/api/admin/pending-users
```

### Test 2: Check Page Source
1. Go to pending registrations page
2. Right-click → View Page Source
3. Look for any JavaScript errors

### Test 3: Disable Browser Extensions
1. Open incognito/private window
2. Login as admin
3. Try accessing pending page

## Debug Checklist

- [ ] Dev server is running (`npm run dev`)
- [ ] Logged in as ADMIN (not the pending user)
- [ ] User exists in database with PENDING status
- [ ] API endpoint returns data when accessed directly
- [ ] Browser console shows no errors
- [ ] Network tab shows successful API call
- [ ] Server logs show API request being processed
- [ ] No CORS or authentication errors

## Still Not Working?

If you've tried everything above and it's still not working:

1. **Capture Screenshots:**
   - Browser console
   - Network tab
   - Server logs
   - The pending page

2. **Check These Files:**
   - `app/api/admin/pending-users/route.ts`
   - `app/dashboard/admin/pending-registrations/page.tsx`
   - `middleware.ts` (for auth)

3. **Try Clean Restart:**
   ```bash
   # Stop server
   # Clear Next.js cache
   rm -rf .next
   # Restart
   npm run dev
   ```

4. **Verify Database:**
   ```bash
   npx prisma studio
   # Check User table for PENDING users
   ```

## Expected Behavior

When everything works correctly:

1. Visit: http://localhost:3000/dashboard/admin/pending-registrations
2. Page loads (shows "Loading..." briefly)
3. User card appears:
   ```
   CAMOR UBUNTU                    [PARENT]
   📧 camor@gmail.com
   🕐 Registered 11/17/2025
   
   [Approve ✓]  [Reject ✗]
   ```
4. Console shows successful fetch logs
5. Server shows API request logs

## Next Steps

Once you identify the issue:
- If API works but page doesn't → Frontend issue
- If API doesn't work → Backend/database issue
- If authentication fails → Session/middleware issue

---

**Start with Step 1 and work through each step systematically!**
