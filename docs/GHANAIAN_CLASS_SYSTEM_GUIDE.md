# Ghanaian Education System - Quick Reference Guide

## Overview

This school management system now uses the official Ghanaian education structure with three main levels:
- **Early Childhood Education** (Creche, KG)
- **Basic School** (Basic 1-6)
- **Junior High School** (JHS 1-3)

## Class Levels Reference

### Early Childhood Education
| Class | Code | Age | Description |
|-------|------|-----|-------------|
| Creche | `creche` | 2-3 years | Pre-kindergarten care and early learning |
| KG (Kindergarten) | `kg` | 4-5 years | Kindergarten - preparation for basic school |

**Graduation:** KG graduates to Basic 1

### Basic School (Primary Level)
| Class | Code | Age | Description |
|-------|------|-----|-------------|
| Basic 1 | `basic-1` | 6 years | First year of primary education |
| Basic 2 | `basic-2` | 7 years | Second year of primary education |
| Basic 3 | `basic-3` | 8 years | Third year of primary education |
| Basic 4 | `basic-4` | 9 years | Fourth year of primary education |
| Basic 5 | `basic-5` | 10 years | Fifth year of primary education |
| Basic 6 | `basic-6` | 11 years | Final year of primary education |

**Graduation:** Basic 6 graduates to JHS 1

### Junior High School
| Class | Code | Age | Description |
|-------|------|-----|-------------|
| JHS 1 | `jhs-1` | 12 years | First year of junior high |
| JHS 2 | `jhs-2` | 13 years | Second year of junior high |
| JHS 3 | `jhs-3` | 14 years | Final year - BECE examination |

**Graduation:** JHS 3 completes basic education (eligible for SHS)

## Curriculum by Level

### Early Childhood (Creche & KG)
**Focus:** Play-based learning and basic skills development

**Subjects:**
- Language and Literacy
- Mathematics (Numeracy)
- Environmental Studies
- Creative Arts
- Physical Education
- Moral Education

**Assessment:** Descriptive (Excellent, Very Good, Good, Satisfactory, Needs Improvement)

### Basic School (Basic 1-6)
**Focus:** Basic literacy, numeracy, and foundational knowledge

**Subjects:**
- English Language
- Mathematics
- Science
- Social Studies
- Ghanaian Language
- Religious and Moral Education
- Creative Arts
- Physical Education
- Information and Communication Technology (ICT)

**Assessment:** 
- Type: School-Based Assessment (SBA)
- Grading: Percentage-based
  - A: 80-100%
  - B: 70-79%
  - C: 60-69%
  - D: 50-59%
  - E: 40-49%
  - F: Below 40%

### Junior High School (JHS 1-3)
**Focus:** Continuation of basic education with technical/vocational introduction

**Subjects:**
- English Language
- Mathematics
- Integrated Science
- Social Studies
- Ghanaian Language
- Religious and Moral Education
- Creative Arts
- Physical Education
- Information and Communication Technology (ICT)
- Pre-Technical Skills
- French (Optional)

**Assessment:**
- Type: SBA + BECE (Basic Education Certificate Examination)
- Grading: Grade System
  - 1: Excellent
  - 2: Very Good
  - 3: Good
  - 4: Credit
  - 5: Pass
  - 6: Fail
- **National Exam:** BECE at end of JHS 3

## Using the System

### For Administrators

#### Creating a New Class
1. Go to **Admin Dashboard** → **Classes** → **Add Class**
2. Select the appropriate **Class Level** from dropdown:
   - Early Childhood: Creche, KG
   - Basic School: Basic 1-6
   - Junior High: JHS 1-3
3. Fill in other details (section, teacher, capacity)
4. Save

#### Registering a Student
1. Go to **Admin Dashboard** → **Students** → **Add Student**
2. Select the appropriate **Class** based on student's age and level
3. Use the age reference:
   - 2-3 years → Creche
   - 4-5 years → KG
   - 6 years → Basic 1
   - 7 years → Basic 2
   - (and so on...)

#### Student Promotion
1. Go to **Admin Dashboard** → **Student Promotion**
2. Select students from current class
3. System automatically suggests next class:
   - KG → Basic 1
   - Basic 1 → Basic 2
   - Basic 6 → JHS 1
   - JHS 2 → JHS 3
4. Confirm promotion

### For Teachers

#### Creating Homework
1. Go to **Teacher Dashboard** → **Homework** → **Create**
2. Select **Class** from your assigned classes
3. Select appropriate **Subject** based on class level
4. Set due date and description

#### Recording Grades
1. Go to **Teacher Dashboard** → **Grades**
2. Select **Class** and **Subject**
3. Enter marks according to assessment system:
   - Basic School: Use percentage (0-100)
   - JHS: Use grade system (1-6) or percentage

### For Parents

#### Viewing Child's Progress
1. Go to **Parent Dashboard**
2. View child's class level and subjects
3. Check grades based on assessment type:
   - Early Childhood: Descriptive feedback
   - Basic School: Percentage grades
   - JHS: Grade system (1-6)

## Code Examples

### Getting Class Information

```typescript
import { 
  CLASS_LEVELS, 
  getClassesByCategory,
  isGraduationClass,
  getAgeRange 
} from '@/lib/config/class-levels'

// Get all available classes
const allClasses = CLASS_LEVELS

// Get classes for a specific level
const basicSchoolClasses = getClassesByCategory('basic-school')
// Returns: Basic 1, Basic 2, Basic 3, Basic 4, Basic 5, Basic 6

// Check if a class is a graduation class
const isGraduating = isGraduationClass('basic-6') // true
const isNotGraduating = isGraduationClass('basic-5') // false

// Get appropriate age for a class
const age = getAgeRange('jhs-1') // "12 years"
```

### Getting Subject Information

```typescript
import { 
  SUBJECTS_BY_LEVEL,
  GHANA_EDUCATION_LEVELS 
} from '@/lib/config/ghana-education'

// Get subjects for Basic School
const basicSchoolSubjects = SUBJECTS_BY_LEVEL['basic-school']
// Returns: ['English Language', 'Mathematics', 'Science', ...]

// Get subjects for JHS
const jhsSubjects = SUBJECTS_BY_LEVEL['junior-high']
// Returns: ['English Language', 'Mathematics', 'Integrated Science', ...]

// Get education level details
const basicSchoolInfo = GHANA_EDUCATION_LEVELS.find(
  level => level.level === 'basic-school'
)
// Returns: { level, name, duration, ageRange, classes, description }
```

## Academic Calendar

### Typical School Year Structure

**Term 1:** September - December
- Duration: ~14 weeks
- Ends with Term 1 examinations

**Term 2:** January - April
- Duration: ~14 weeks
- Ends with Term 2 examinations

**Term 3:** May - July
- Duration: ~11 weeks
- Ends with Term 3 examinations
- JHS 3 students take BECE

**Vacation Periods:**
- Christmas Break: 2-3 weeks
- Easter Break: 2 weeks
- Long Vacation: August - early September

## Progression Rules

### Automatic Promotion
Students typically progress to the next class level each academic year if they:
- Maintain satisfactory attendance (minimum 75%)
- Achieve passing grades in core subjects
- Complete all required assessments

### Graduation Requirements

**KG Graduation:**
- Complete KG curriculum
- Demonstrate school readiness
- Age-appropriate development

**Basic 6 Graduation:**
- Complete Basic 1-6 curriculum
- Pass all core subjects
- Ready for JHS level work

**JHS 3 Graduation:**
- Complete JHS 1-3 curriculum
- Pass BECE examination
- Eligible for Senior High School admission

## Reporting

### Report Cards

**Early Childhood:**
- Descriptive assessment
- Developmental milestones
- Teacher comments

**Basic School:**
- Subject-wise percentage grades
- Class position/ranking
- Teacher remarks
- Attendance record

**Junior High School:**
- Grade system (1-6) per subject
- Class position/ranking
- Teacher remarks
- Attendance record
- BECE results (for JHS 3)

## Support & Resources

### Configuration Files
- Class levels: `lib/config/class-levels.ts`
- Education system: `lib/config/ghana-education.ts`

### Migration
- Migration script: `scripts/migrate-class-levels.js`
- Run migration: `node scripts/migrate-class-levels.js`

### Documentation
- Full migration report: `CLASS_LEVELS_MIGRATION_COMPLETE.md`
- This guide: `docs/GHANAIAN_CLASS_SYSTEM_GUIDE.md`

## Frequently Asked Questions

**Q: Can I add SHS (Senior High School) levels?**  
A: Yes! Edit `lib/config/class-levels.ts` and add SHS 1-3 with category 'senior-high'.

**Q: How do I change subjects for a level?**  
A: Edit `lib/config/ghana-education.ts` and update the `SUBJECTS_BY_LEVEL` object.

**Q: What if I need to use different class names?**  
A: The system is flexible. You can use "Primary 1" or "Basic 1" - both work. The `level` field in the database stores the class level.

**Q: How do I handle students who repeat a class?**  
A: During promotion, simply don't promote them. They'll remain in their current class for another year.

**Q: Can I customize the grading system?**  
A: Yes! Edit the `ASSESSMENT_SYSTEM` in `lib/config/ghana-education.ts`.

---

**Last Updated:** November 17, 2025  
**System Version:** 1.0  
**Compliant With:** Ghana Education Service Standards
