# Complete Testing Setup Guide

## Quick Start - Get System Ready for Testing

This guide will help you set up test data and verify all features are working.

## Step 1: Database Setup (If Starting Fresh)

### Option A: Use Seed Script
```bash
npx prisma db push
npx prisma db seed
```

This creates:
- 1 Admin user
- 5 Teachers
- 50 Students across 11 classes
- 5 Parents with linked children
- Sample grades, attendance, and homework

### Option B: Manual Setup via Admin Dashboard

1. **Login as Admin**
   - Email: `admin@school.com`
   - Password: `admin123`

2. **Create Classes** (if not exist)
   - Go to Admin → Classes → Add Class
   - Create: Class 1, Class 2, Class 3, etc.

3. **Create Teachers**
   - Go to Admin → Teachers → Add Teacher
   - Fill in details and assign subjects

4. **Create Students**
   - Go to Admin → Students → Add Student
   - Assign to classes

5. **Create Parents**
   - Go to Admin → Parents → Add Parent
   - Link children to parents

## Step 2: Test Each Role

### Admin Testing Checklist

**Dashboard**
- [ ] Real counts display (students, teachers, classes)
- [ ] Recent activities show actual data
- [ ] Category filters work
- [ ] Charts display correctly

**User Management**
- [ ] Can view all students
- [ ] Can view all teachers
- [ ] Can view all parents
- [ ] Can add new users
- [ ] Can edit existing users
- [ ] Can link children to parents

**Academic Management**
- [ ] Can create/edit classes
- [ ] Can create timetable entries
- [ ] Can view all homework
- [ ] Can generate report cards
- [ ] Can view attendance records

**Approvals**
- [ ] Pending registrations page works
- [ ] Can approve/reject users
- [ ] Status updates correctly

### Teacher Testing Checklist

**Dashboard**
- [ ] Shows teacher's classes
- [ ] Recent activities relevant to teacher
- [ ] Quick stats display

**Teaching Features**
- [ ] Can view "My Classes"
- [ ] Can view "My Students"
- [ ] Can create homework for all classes
- [ ] Can mark attendance
- [ ] Can enter grades
- [ ] Can view timetable

**Homework System**
- [ ] Create homework button works
- [ ] All 11 classes appear in dropdown
- [ ] Can set due dates
- [ ] Can add attachments (URLs)
- [ ] Homework appears in list
- [ ] Can grade submissions

### Parent Testing Checklist

**Dashboard**
- [ ] Shows children information
- [ ] Recent activities relevant to children

**My Children Page**
- [ ] Lists all linked children
- [ ] Shows child details (name, class, roll number)
- [ ] Term/year filters work
- [ ] "View Report" button works
- [ ] "Download PDF" button works
- [ ] PDF downloads correctly

**Progress Tracking**
- [ ] Can view child's grades
- [ ] Can view child's attendance
- [ ] Can view child's homework

### Student Testing Checklist

**Dashboard**
- [ ] Shows student's stats
- [ ] Recent activities relevant to student

**Learning Features**
- [ ] Can view homework assignments
- [ ] Can submit homework
- [ ] Can view grades
- [ ] Can view attendance
- [ ] Can view timetable

## Step 3: Test Critical Workflows

### Workflow 1: Complete Homework Cycle

1. **Teacher Creates Homework**
   - Login as teacher
   - Go to Homework
   - Click "Create Assignment"
   - Select class, set title, description, due date
   - Add attachment URL (optional)
   - Submit

2. **Student Sees Homework**
   - Login as student
   - Go to Homework
   - See new assignment
   - Click "Submit"
   - Enter content and submit

3. **Teacher Grades Homework**
   - Login as teacher
   - Go to Homework
   - See submission
   - Enter grade and feedback
   - Submit

4. **Student Sees Grade**
   - Login as student
   - Go to Homework
   - See graded assignment

### Workflow 2: Report Card Generation

1. **Teacher Enters Grades**
   - Login as teacher
   - Go to Grades
   - Select class and term
   - Enter grades for all subjects
   - Save

2. **Admin Generates Report**
   - Login as admin
   - Go to Report Cards
   - Select class and term
   - Download individual or bulk reports

3. **Parent Downloads Report**
   - Login as parent
   - Go to "My Children"
   - Select term and year
   - Click "Download" for child
   - PDF downloads

### Workflow 3: Attendance Tracking

1. **Teacher Marks Attendance**
   - Login as teacher
   - Go to Attendance
   - Select class and date
   - Mark students present/absent
   - Save

2. **Admin Views Analytics**
   - Login as admin
   - Go to Attendance
   - View attendance statistics
   - See trends and patterns

3. **Parent Checks Attendance**
   - Login as parent
   - Go to Child's Progress → Attendance
   - View attendance records

## Step 4: Verify Data Integrity

### Check Database Relationships

Run this script to verify data:

```bash
node scripts/verify-data.js
```

Or manually check:

1. **Students have classes assigned**
   - Admin → Students → Check each student has a class

2. **Parents have children linked**
   - Admin → Parents → Check "Children" column

3. **Teachers have classes assigned**
   - Admin → Teachers → Check assigned classes

4. **Grades have proper term/year**
   - Check grades have valid term (Term 1, 2, 3)
   - Check academic year is set

## Step 5: Test Edge Cases

### Empty States
- [ ] Dashboard with no data shows empty state
- [ ] Homework page with no assignments
- [ ] Grades page with no grades
- [ ] Parent with no children linked

### Error Handling
- [ ] Invalid login shows error
- [ ] Missing required fields show validation
- [ ] Network errors handled gracefully
- [ ] Permission errors show appropriate message

### Performance
- [ ] Pages load within 2 seconds
- [ ] Large lists paginate correctly
- [ ] Search/filter works smoothly
- [ ] No console errors

## Common Issues and Fixes

### Issue: "No children linked" for parent
**Fix:** 
1. Go to Admin → Parents
2. Find the parent
3. Click "Link Children"
4. Select students and save

### Issue: "No grades available" when downloading report
**Fix:**
1. Ensure teacher has entered grades
2. Check term and academic year match
3. Verify student is in a class

### Issue: Homework dropdown shows no classes
**Fix:**
1. Check teacher is assigned to classes
2. Verify classes exist in database
3. Check API endpoint `/api/teachers/me/classes`

### Issue: Recent activities not showing
**Fix:**
1. Ensure there's actual data (homework, grades, etc.)
2. Check browser console for errors
3. Verify API endpoint `/api/activities` works

### Issue: Report card download fails
**Fix:**
1. Check grades are entered for the term
2. Verify student has a class assigned
3. Check academic year and term are correct

## Test User Accounts

After seeding, you'll have these accounts:

**Admin**
- Email: `admin@school.com`
- Password: `admin123`

**Teacher**
- Email: `teacher1@school.com`
- Password: `teacher123`

**Student**
- Email: `student1@school.com`
- Password: `student123`

**Parent**
- Email: `parent1@school.com`
- Password: `parent123`

## Deployment Testing

Before deploying to production:

1. **Test on Local**
   - Run through all checklists above
   - Fix any issues found

2. **Test on Render (Staging)**
   - Deploy to Render
   - Run database migrations
   - Test critical workflows
   - Verify performance

3. **Production Deployment**
   - Backup database
   - Deploy to production
   - Run migrations
   - Test immediately after deployment
   - Monitor for errors

## Monitoring After Deployment

1. **Check Logs**
   - Render dashboard → Logs
   - Look for errors or warnings

2. **Test Critical Features**
   - Login as each role
   - Create homework
   - Download report card
   - Mark attendance

3. **User Feedback**
   - Ask teachers to test
   - Ask parents to test
   - Collect feedback
   - Fix issues promptly

## Support Contacts

If you encounter issues:
1. Check this guide first
2. Check browser console for errors
3. Check Render logs
4. Document the issue with screenshots
5. Contact support with details

## Success Criteria

System is ready for production when:
- [ ] All role dashboards load correctly
- [ ] All CRUD operations work
- [ ] Report cards generate and download
- [ ] Homework system fully functional
- [ ] Parent can access children's data
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] All test workflows complete successfully

---

**Last Updated:** November 19, 2024
**System Version:** 1.0
**Status:** Ready for Testing
