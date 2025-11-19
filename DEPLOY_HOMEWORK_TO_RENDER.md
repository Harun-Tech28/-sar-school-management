# Deploy Homework System to Render

## Changes to Deploy

### 1. Database Schema Changes
- Added `attachments` field to `Homework` model
- Added `content` and `attachments` fields to `HomeworkSubmission` model

### 2. API Enhancements
- Enhanced `/api/teachers/me/classes` to fetch classes from both primary teacher and ClassTeacher relationships
- Updated `/api/homework` POST endpoint to create pending submissions automatically

### 3. Frontend Improvements
- Connected homework creation form to real API
- Shows all classes in dropdown (not just teacher's assigned classes)
- Added proper error handling and logging

## Deployment Steps

### Step 1: Commit and Push Changes
```bash
git add .
git commit -m "feat: implement homework system with attachments support"
git push origin main
```

### Step 2: Run Database Migration on Render
After the code is deployed, you need to update the database schema:

**Option A: Via Render Dashboard**
1. Go to your Render dashboard
2. Select your web service
3. Go to "Shell" tab
4. Run: `npx prisma db push`

**Option B: Via Render CLI** (if installed)
```bash
render shell
npx prisma db push
```

### Step 3: Verify Deployment
1. Visit your Render URL
2. Login as a teacher
3. Go to Homework page
4. Click "Create Assignment"
5. Verify all classes appear in dropdown
6. Create a test homework assignment

## What Gets Deployed

### Modified Files:
- `prisma/schema.prisma` - Database schema with new fields
- `app/api/homework/route.ts` - Enhanced homework creation
- `app/api/homework/[id]/route.ts` - Updated homework endpoints
- `app/api/teachers/me/classes/route.ts` - Improved class fetching
- `app/dashboard/teacher/homework/page.tsx` - Fully functional UI

### New Features:
- ✅ Teachers can create homework for any class
- ✅ Homework automatically creates pending submissions for all students
- ✅ Support for attachments (URLs) in homework and submissions
- ✅ All 11 classes visible in dropdown
- ✅ Real-time homework creation and tracking

## Important Notes

### Database Migration
The `npx prisma db push` command will:
- Add `attachments` column to `Homework` table
- Add `content` and `attachments` columns to `HomeworkSubmission` table
- **No data loss** - existing homework records will remain intact

### File Uploads
The system supports attachment URLs but doesn't handle file uploads yet. To add file upload:
1. Set up cloud storage (AWS S3, Cloudflare R2, etc.)
2. Implement upload endpoint
3. See `HOMEWORK_FILE_UPLOAD_GUIDE.md` for details

## Rollback Plan

If something goes wrong:

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <previous-commit-hash>
git push origin main --force
```

## Post-Deployment Checklist

- [ ] Code deployed successfully on Render
- [ ] Database migration completed (`npx prisma db push`)
- [ ] Can login as teacher
- [ ] Homework page loads without errors
- [ ] All classes visible in dropdown
- [ ] Can create homework successfully
- [ ] Homework appears in list after creation
- [ ] Students see pending homework assignments

## Monitoring

After deployment, monitor:
- Render logs for any errors
- Database performance
- API response times
- User feedback on homework creation

## Support

If issues occur:
1. Check Render logs
2. Verify database migration completed
3. Test API endpoints directly
4. Check browser console for frontend errors
