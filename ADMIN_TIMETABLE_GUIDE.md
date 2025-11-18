# Admin Timetable Creation Guide

## How Admins Create Timetables for Teachers and Students

### Overview
The admin timetable management system allows administrators to create weekly schedules for each class. Once created, these timetables are automatically visible to:
- **Teachers** - See their teaching schedule
- **Students** - See their class schedule

---

## Step-by-Step Guide

### 1. Access Timetable Management
**Location:** Admin Dashboard → Timetable (in sidebar)
**URL:** `/dashboard/admin/timetable`

### 2. Select a Class
1. Click the **"Select a class..."** dropdown
2. Choose the class you want to create a timetable for
3. The system will load any existing timetable entries for that class

### 3. Add Timetable Entries
Click the **"Add Entry"** button to open the form

#### Required Information:
- **Day of Week:** Monday through Friday
- **Start Time:** Select from predefined time slots (07:30 - 16:00)
- **End Time:** Select from predefined time slots
- **Subject:** Enter the subject name (e.g., Mathematics, English, Science)
- **Teacher:** Select the teacher who will teach this class (optional)
- **Room:** Enter the room number (optional)
- **Is Break:** Check this box if it's a break period

#### Example Entry:
```
Day: MONDAY
Start Time: 08:00
End Time: 09:00
Subject: Mathematics
Teacher: Mr. John Doe
Room: Room 101
Is Break: No
```

### 4. Save the Entry
Click **"Add Entry"** to save the timetable slot

### 5. Repeat for All Periods
Continue adding entries for:
- All periods in the day
- All days of the week (Monday - Friday)
- Break times (mark as "Is Break")

---

## How It Works

### Database Structure
When you create a timetable entry, it's stored in the `Timetable` table with:
```
- classId: Links to the specific class
- teacherId: Links to the assigned teacher
- dayOfWeek: MONDAY, TUESDAY, etc.
- startTime: 08:00
- endTime: 09:00
- subject: Mathematics
- room: Room 101
- isBreak: false
```

### Automatic Distribution

#### For Teachers:
1. When a teacher is assigned to a timetable entry
2. The entry appears in their **"My Schedule"** page
3. Teachers see ALL classes they're assigned to teach
4. API Endpoint: `/api/timetable/teacher/[teacherId]`

#### For Students:
1. Students in the class automatically see the timetable
2. Appears in their **"Timetable"** page
3. Shows their weekly class schedule
4. API Endpoint: `/api/timetable?classId=[classId]`

---

## Features

### Visual Weekly Grid
- 5-column layout (Monday - Friday)
- Color-coded entries:
  - **Blue** = Regular classes
  - **Yellow** = Break periods
- Shows time, subject, teacher, and room

### Entry Management
- **Add** new entries with the form
- **Delete** entries with the trash icon
- **View** all entries in a weekly grid

### Time Slots
Pre-configured time slots from 07:30 to 16:00 in 30-minute intervals:
```
07:30, 08:00, 08:30, 09:00, 09:30, 10:00, 10:30,
11:00, 11:30, 12:00, 12:30, 13:00, 13:30, 14:00,
14:30, 15:00, 15:30, 16:00
```

---

## Best Practices

### 1. Plan Before Creating
- Have your weekly schedule ready
- Know which teachers teach which subjects
- Assign room numbers if available

### 2. Add Break Times
- Mark lunch breaks as "Is Break"
- Add short breaks between periods
- These show differently in the timetable

### 3. Assign Teachers
- Always assign a teacher to each subject
- This ensures teachers see their schedule
- Helps with teacher workload management

### 4. Use Consistent Naming
- Use standard subject names (Mathematics, not Math)
- Use consistent room numbering
- This helps with reporting and analytics

### 5. Complete All Days
- Fill in Monday through Friday
- Ensure no gaps in the schedule
- Students and teachers need complete schedules

---

## Example: Creating a Full Day Schedule

### Monday Schedule for Class 1A

| Time | Subject | Teacher | Room |
|------|---------|---------|------|
| 08:00 - 09:00 | Mathematics | Mr. John Doe | Room 101 |
| 09:00 - 10:00 | English | Mrs. Jane Smith | Room 102 |
| 10:00 - 10:30 | **BREAK** | - | - |
| 10:30 - 11:30 | Science | Dr. Bob Wilson | Lab 1 |
| 11:30 - 12:30 | History | Mr. Tom Brown | Room 103 |
| 12:30 - 13:30 | **LUNCH** | - | - |
| 13:30 - 14:30 | Physical Education | Coach Mike | Gym |
| 14:30 - 15:30 | Art | Ms. Sarah Lee | Art Room |

### Steps to Create:
1. Select "Class 1A" from dropdown
2. Click "Add Entry" 8 times (one for each period)
3. Fill in details for each period
4. Mark 10:00-10:30 and 12:30-13:30 as breaks
5. Save each entry

---

## Troubleshooting

### Issue: Teacher doesn't see their schedule
**Solution:** 
- Ensure the teacher is assigned to the timetable entry
- Check that the teacher's `teacherId` is correct
- Verify the teacher is logged in with the correct account

### Issue: Student doesn't see their timetable
**Solution:**
- Ensure the student is enrolled in the class
- Check that timetable entries exist for that class
- Verify the `classId` is correct

### Issue: Times overlap
**Solution:**
- Check start and end times don't overlap
- Ensure break times are properly marked
- Review the weekly grid for conflicts

### Issue: Can't delete an entry
**Solution:**
- Refresh the page and try again
- Check your admin permissions
- Verify the entry ID is valid

---

## API Endpoints Used

### Create Timetable Entry
```
POST /api/timetable
Body: {
  classId, dayOfWeek, startTime, endTime,
  subject, teacherId, room, isBreak
}
```

### Get Class Timetable
```
GET /api/timetable?classId=[classId]
```

### Get Teacher Timetable
```
GET /api/timetable/teacher/[teacherId]
```

### Delete Timetable Entry
```
DELETE /api/timetable/[id]
```

---

## Tips for Efficient Timetable Creation

1. **Start with one class** - Complete one class fully before moving to the next
2. **Use templates** - Create a standard schedule and replicate it
3. **Assign teachers early** - This helps teachers plan their week
4. **Review before finalizing** - Check for conflicts and gaps
5. **Update regularly** - Keep timetables current with any changes

---

## Future Enhancements (Planned)

- Bulk import from Excel/CSV
- Copy timetable from one class to another
- Conflict detection (teacher teaching two classes at once)
- Automatic break insertion
- Print/export timetable as PDF
- Timetable templates for different class levels

---

## Support

If you encounter issues:
1. Check this guide first
2. Verify all required fields are filled
3. Ensure teachers and classes exist in the system
4. Contact technical support if problems persist

---

**Remember:** Once you create a timetable for a class, it's immediately visible to all teachers assigned to those periods and all students in that class!
