# 🔄 Restart Dev Server - Fix Database Connection

## The Problem
The dev server is locked or has a stale database connection, causing the API to return empty results even though the user exists in the database.

## Quick Fix (3 Steps)

### Step 1: Kill Old Server
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Step 2: Remove Lock File
```powershell
Remove-Item ".next\dev\lock" -Force -ErrorAction SilentlyContinue
```

### Step 3: Clear Cache (Optional but Recommended)
```powershell
Remove-Item ".next" -Recurse -Force -ErrorAction SilentlyContinue
```

### Step 4: Restart Server
```bash
npm run dev
```

## After Restart

### Test 1: Check API
Visit: http://localhost:3000/api/admin/pending-users

Should show:
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

### Test 2: Check Pending Page
1. Login as admin
2. Go to: Pending Registrations
3. You should now see: **CAMOR UBUNTU**

## Why This Happens

- **Lock File:** Another instance was running
- **Stale Connection:** Database connection pool was cached
- **Environment:** `.env` wasn't reloaded properly

Restarting with a clean cache fixes all of these!

## Alternative: Use the Script

```powershell
.\scripts\kill-next-and-restart.ps1
```

Then:
```bash
npm run dev
```

---

**After restart, the pending user should appear!** 🎉
