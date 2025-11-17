# Class Edit "Not Found" Error - Debugging Guide

## Issue
When trying to edit a class, you get "Class not found" error.

## What I've Done

### 1. Fixed the Edit Page
- ✅ Connected to real API instead of demo data
- ✅ Added detailed console logging
- ✅ Added better error messages

### 2. Added Debug Logging
The edit page now logs to browser console:
```
[Edit Class] Fetching class with ID: xxx
[Edit Class] Response status: 200
[Edit Class] Response data: {...}
```

## How to Debug

### Step 1: Check Browser Console
1. Open the Classes page
2. Click "Edit" on any class
3. Open browser DevTools (F12)
4. Go to Console tab
5. Look for `[Edit Class]` messages

### Step 2: Check What's Being Logged
You should see:
- The class ID being fetched
- The API response status
- The response data

### Step 3: Common Issues

**Issue 1: Class ID is undefined**
- Check if the URL is correct: `/dashboard/admin/classes/[some-id]`
- The ID should be a valid database ID

**Issue 2: API returns 404**
- The class doesn't exist in database
- Run the script to check: `node scripts/check-classes.js`

**Issue 3: API returns 500**
- Database connection error
- Check server logs

## Quick Test

### Test 1: Check Classes in Database
```bash
node scripts/check-classes.js
```

This will show all classes with their IDs.

### Test 2: Test API Directly
```bash
# Start your dev server first
npm run dev

# In another terminal:
node scripts/test-class-api.js
```

This will test the API endpoints.

### Test 3: Check Browser Network Tab
1. Open DevTools → Network tab
2. Click Edit on a class
3. Look for the API request to `/api/classes/[id]`
4. Check the response

## Expected Behavior

When you click "Edit" on a class:
1. Browser navigates to `/dashboard/admin/classes/[id]`
2. Page fetches data from `/api/classes/[id]`
3. API returns class data
4. Form is populated with class information
5. You can edit and save

## If Still Not Working

### Check These:
1. **Is the dev server running?**
   - Run `npm run dev`
   - Check http://localhost:3000

2. **Are there classes in the database?**
   - Run `node scripts/check-classes.js`
   - Should show at least the Ghanaian classes

3. **Is the database connected?**
   - Check the console when server starts
   - Should see "✅ Prisma connected to database"

4. **Check the URL**
   - Should be: `/dashboard/admin/classes/[actual-id]`
   - Not: `/dashboard/admin/classes/edit` or `/dashboard/admin/classes/undefined`

## Next Steps

1. **Try editing a class and check the console**
   - Open browser console (F12)
   - Click Edit on any class
   - Share the console logs

2. **Check what classes exist**
   ```bash
   node scripts/check-classes.js
   ```

3. **Test the API**
   ```bash
   # Make sure server is running first
   node scripts/test-class-api.js
   ```

## What to Share for Help

If still not working, share:
1. Browser console logs (the `[Edit Class]` messages)
2. Network tab screenshot showing the API request
3. Output from `node scripts/check-classes.js`
4. The URL you're trying to access

---

**Status:** Debugging tools added, waiting for console logs to identify the issue.
