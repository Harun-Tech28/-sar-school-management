# Requirements Document

## Introduction

This document outlines the requirements for implementing a comprehensive exam management system and terminal report card generation feature for the school management system. The system will enable administrators and teachers to create exams, record student grades, and automatically generate downloadable terminal report cards for students and parents.

## Glossary

- **System**: The school management web application
- **Exam**: A formal assessment conducted for students in specific subjects during a term
- **Grade**: A numerical score and letter grade assigned to a student for a subject in an exam
- **Terminal Report Card**: A comprehensive document showing a student's performance across all subjects for a specific term
- **Admin**: A user with administrative privileges who can create exams and manage the system
- **Teacher**: A user who can enter grades for subjects they teach
- **Parent**: A user who can view their child's report cards
- **Student**: A user who can view their own report cards
- **Term**: An academic period (Term 1, Term 2, or Term 3)
- **Academic Year**: The school year (e.g., "2025")
- **Class**: A group of students in the same form/grade level
- **Subject**: An academic course (e.g., Mathematics, English, Science)

## Requirements

### Requirement 1: Exam Creation and Management

**User Story:** As an Admin, I want to create and manage exams for different classes and terms, so that teachers can record student grades systematically.

#### Acceptance Criteria

1. WHEN an Admin accesses the exam management page, THE System SHALL display a list of all created exams with their details
2. WHEN an Admin creates a new exam, THE System SHALL require exam name, term, academic year, and exam type
3. WHEN an Admin saves an exam, THE System SHALL store the exam record in the Database with a unique identifier
4. WHEN an Admin views exam details, THE System SHALL display all associated subjects and classes
5. WHEN an Admin deletes an exam, THE System SHALL remove the exam record and prevent grade entry for that exam

### Requirement 2: Grade Entry by Teachers

**User Story:** As a Teacher, I want to enter student grades for exams in subjects I teach, so that student performance is recorded accurately.

#### Acceptance Criteria

1. WHEN a Teacher accesses the grade entry page, THE System SHALL display only exams for subjects and classes they teach
2. WHEN a Teacher selects an exam and class, THE System SHALL display a list of all students in that class
3. WHEN a Teacher enters marks for a student, THE System SHALL validate that marks do not exceed total marks
4. WHEN a Teacher saves grades, THE System SHALL store each grade record in the Database with student ID, subject, marks, and exam details
5. WHEN a Teacher updates an existing grade, THE System SHALL update the Database record and maintain an audit trail

### Requirement 3: Bulk Grade Entry

**User Story:** As a Teacher, I want to enter grades for multiple students at once, so that I can efficiently record exam results for an entire class.

#### Acceptance Criteria

1. WHEN a Teacher accesses bulk grade entry, THE System SHALL display a table with all students in the selected class
2. WHEN a Teacher enters marks in the table, THE System SHALL validate each entry in real-time
3. WHEN a Teacher submits the bulk entry form, THE System SHALL save all valid grades to the Database in a single transaction
4. IF any grade entry fails validation, THEN THE System SHALL display specific error messages and prevent submission
5. WHEN bulk entry is successful, THE System SHALL display a confirmation message with the count of grades saved

### Requirement 4: Automatic Grade Calculation

**User Story:** As a Student, I want my overall average and letter grades calculated automatically, so that I can see my performance accurately.

#### Acceptance Criteria

1. WHEN grades are entered for a student, THE System SHALL calculate the percentage score for each subject
2. WHEN all subject grades are recorded, THE System SHALL calculate the overall average across all subjects
3. WHEN calculating letter grades, THE System SHALL apply the grading scale (A: 80-100, B: 70-79, C: 60-69, D: 50-59, F: 0-49)
4. WHEN a grade is updated, THE System SHALL recalculate all dependent averages and rankings
5. WHEN calculating class rank, THE System SHALL order students by overall average in descending order

### Requirement 5: Terminal Report Card Generation

**User Story:** As a Parent, I want to view and download my child's terminal report card, so that I can track their academic progress.

#### Acceptance Criteria

1. WHEN a Parent accesses the report card page, THE System SHALL display report cards for all their children
2. WHEN a Parent selects a term and student, THE System SHALL fetch all grades for that student and term from the Database
3. WHEN displaying the report card, THE System SHALL show student info, subject grades, overall average, class rank, and attendance
4. WHEN a Parent clicks download, THE System SHALL generate a PDF report card with school branding and formatting
5. WHEN no grades exist for a term, THE System SHALL display a message indicating grades are not yet available

### Requirement 6: Student Report Card Access

**User Story:** As a Student, I want to view my own terminal report card, so that I can see my academic performance.

#### Acceptance Criteria

1. WHEN a Student accesses their dashboard, THE System SHALL display a link to view report cards
2. WHEN a Student selects a term, THE System SHALL fetch and display their grades for that term
3. WHEN displaying the report card, THE System SHALL show all subjects, grades, overall average, and class rank
4. WHEN a Student downloads their report card, THE System SHALL generate a PDF with their complete academic record
5. WHEN grades are not yet published, THE System SHALL display a message indicating results are pending

### Requirement 7: Admin Report Card Management

**User Story:** As an Admin, I want to generate and download report cards for all students, so that I can distribute them efficiently.

#### Acceptance Criteria

1. WHEN an Admin accesses report card management, THE System SHALL display options to filter by class, term, and academic year
2. WHEN an Admin selects a class and term, THE System SHALL display all students with their grade status
3. WHEN an Admin clicks bulk download, THE System SHALL generate PDF report cards for all students in the selected class
4. WHEN generating bulk reports, THE System SHALL create a ZIP file containing individual PDF files for each student
5. WHEN a student has incomplete grades, THE System SHALL indicate this in the report card list

### Requirement 8: Grade Analytics and Insights

**User Story:** As a Teacher, I want to see analytics on exam performance, so that I can identify areas where students need support.

#### Acceptance Criteria

1. WHEN a Teacher views exam analytics, THE System SHALL display average scores by subject and class
2. WHEN displaying analytics, THE System SHALL show the highest score, lowest score, and median for each subject
3. WHEN viewing class performance, THE System SHALL display a distribution chart of letter grades
4. WHEN comparing terms, THE System SHALL show performance trends over time
5. WHEN identifying struggling students, THE System SHALL highlight students scoring below 50%

### Requirement 9: Report Card Customization

**User Story:** As an Admin, I want to customize report card templates, so that they match our school's branding and requirements.

#### Acceptance Criteria

1. WHEN an Admin accesses report card settings, THE System SHALL display customization options for school name, logo, and colors
2. WHEN an Admin updates the template, THE System SHALL save the configuration to the Database
3. WHEN generating report cards, THE System SHALL apply the custom template settings
4. WHEN adding teacher comments, THE System SHALL include a section for class teacher remarks on the report card
5. WHEN printing report cards, THE System SHALL format them for standard A4 paper size

### Requirement 10: Grade Validation and Error Handling

**User Story:** As a Teacher, I want the system to validate my grade entries, so that I can avoid data entry errors.

#### Acceptance Criteria

1. WHEN a Teacher enters marks, THE System SHALL validate that the value is a positive number
2. WHEN marks exceed total marks, THE System SHALL display an error message and prevent submission
3. WHEN required fields are missing, THE System SHALL highlight the fields and display validation messages
4. WHEN duplicate grades are entered, THE System SHALL prevent submission and display a warning
5. WHEN network errors occur during submission, THE System SHALL display an error message and allow retry
