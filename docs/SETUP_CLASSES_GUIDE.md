# Setup Ghanaian Classes Guide

This guide explains how to add all Ghanaian class levels (Creche to JHS 3) to your database.

## Classes That Will Be Added

### Early Childhood
- Creche
- Nursery 1
- Nursery 2

### Kindergarten
- KG 1
- KG 2

### Primary School (Basic)
- Basic 1
- Basic 2
- Basic 3
- Basic 4
- Basic 5
- Basic 6

### Junior High School
- JHS 1
- JHS 2
- JHS 3

## Method 1: Using the Script (Local Development)

If you're running the application locally:

```bash
node scripts/add-all-ghanaian-classes.js
```

This will add all classes to your local database.

## Method 2: Using the API Endpoint (Production on Render)

For production deployment on Render:

### Step 1: Set Environment Variable on Render

1. Go to your Render dashboard
2. Select your web service
3. Go to "Environment" tab
4. Add a new environment variable:
   - Key: `SETUP_SECRET_KEY`
   - Value: Generate a secure random string (e.g., `sar-setup-2024-xyz123abc`)
5. Save changes (this will redeploy your app)

### Step 2: Call the Setup Endpoint

Once your app is redeployed, use curl or Postman to call:

```bash
curl -X POST https://your-app-name.onrender.com/api/admin/setup-classes \
  -H "Authorization: Bearer your-setup-secret-key" \
  -H "Content-Type: application/json"
```

Replace:
- `your-app-name.onrender.com` with your actual Render URL
- `your-setup-secret-key` with the value you set in Step 1

### Step 3: Verify the Response

You should get a response like:

```json
{
  "success": true,
  "message": "Ghanaian classes setup completed",
  "results": {
    "created": ["Creche", "Nursery 1", "KG 1", ...],
    "existing": [],
    "errors": []
  },
  "totalClasses": 18,
  "allClasses": ["Basic 1", "Basic 2", ...]
}
```

## Security Notes

- The API endpoint is protected and requires the `SETUP_SECRET_KEY`
- In production, it will only work with the correct authorization header
- Keep your setup secret key secure and don't share it publicly
- You can remove the `SETUP_SECRET_KEY` environment variable after setup is complete

## Verification

After running the setup, verify that all classes appear in:
- Admin Dashboard → Classes
- Admin Dashboard → Attendance (class dropdown)
- Admin Dashboard → Students → Add Student (class dropdown)

## Troubleshooting

### Classes Not Showing Up

1. Check that the script/API call completed successfully
2. Verify your database connection
3. Try refreshing your browser cache
4. Check the browser console for any errors

### Duplicate Classes

The script/API is safe to run multiple times. It will:
- Skip classes that already exist
- Only create new classes that don't exist
- Report which classes were created vs. already existing

### Need to Remove Classes

If you need to remove classes, use the admin interface:
1. Go to Admin Dashboard → Classes
2. Find the class you want to remove
3. Delete it (only if it has no students enrolled)
