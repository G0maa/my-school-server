# [WRITE TO THINK.](https://youtu.be/TMamxmcurAQ)

- What do we want to make? School Management System (SMS).
- What does School Management System mean (in the business world)?

  - Because this should put some kind of "boundry" on the features & expectations.
    - => That we don't know.

- What do **I** want to make? Backend for "that" SMS using my tech stack.
- Tech Stack: Nodejs - Experessjs - PostgreSQL - ...

# More details & MVP (Graduation Project Version 0.5.0)

- What does the **System** do?
  - Automatically send ?notification? of: Grades, attendence to parent.

# Admin

## What does an **Admin** do?

- Has profile.
- Creates accounts of Students, Teachers, Managers.
- Resets passwords.
- Ability to print reports.
- **Creates subjects**
- Can create classes,
- set their sechedule, according to available subjects
- set their teacher,
- set their students,

## About **has Profile**:

- This is the root user that should come with the software just after deployment.
- Deployed? `000000 & 000000` is the default username & password.
- After logging in you should be provided with a way to change your email & password.
- Profile should have name, email, phonenumber, sex, profile picture & show that he's admin.
- Can reset his password (as for the other types of accounts) through his email, also has to verify his email.

## Creating accounts:

- When creating accounts can specify to create account with its details.
  - ~~Maybe~~ more simple for now is to Create account -> Edit details.
- For Teachers
  - I'd say the ID will be something like `account type - serial number` e.g. 400001, for example.
  - Create many accounts in one go e.g. 50 teacher accounts i.e. will have 400001 to 400050 as usernames. also generate radnom string for passwords. maybe six random number e.g. `368791`
  - Can print all teacher accounts & their passwords. (report)
  - Briefly: Teacher first time login: Change password & set email for easy login. after this he can only login using his email.
- For students, similar to teachers but change account type e.g. 100000.
- For Managers, .... e.g. 200000.

## Resetting passwords:

- generate new random six digit password, and delete old password. user has to re-enter his email & new password after logging in now.

## Creating subjects:

- **Subject can have 1+ teacher.**
  - ?Should be? inside realtion.
- a tab in the dashboard
- Set Name, Code, Year, speciality (math, chemisty, physcis, Physical education, ...)

## Create classes:

- classes tab, click on `new class`
- Set Year, and number (or auto-increment).

## setting classes:

- Fields: Name, Code, Details.
- classes tab, pick class & edit.
- set class schedule.
  - set subjects in scheudle, day, how many periods for each subject.
  - This needs "heavy" UI, i.e. search for subject + drag & drop subject, change how many periods, etc...
- assign students to classes.

## setting teachers:

- subjects tab, can search for specific subject,
- click on subject & assign it a teacher (should be provided ability to search by ID or name or Email)

## Reports:

- Reports of every teacher, student, manager, account that isn't set (i.e. changed email and password).
- Print their subjects & teachers.
- Print classes & their students.
- Print class scheduels.
- Print unassigned teachers & students.

# Teacher

- Fields: First name, Last name, Gender, Phone number, Password, **Username**, Department (Multiple-choice), Title, Address, Email, Date of Birth, Education, Upload Profile Picture to AWS S3, Date of joining.

- What does a **Teacher** do?
  - Has profile.
  - Set material & homework for subjects he teaches.
  - Make students attendence.
  - Set student grades.
  - See HIS subject/class schedule.
  - See profiles of Sudents, parents in his classes.
  - Ability to print reports.

## Has profile

- Similar to the rest, but adds: subjects he teaches.

## Set material & homework for subjects

- In subjects tab, choose a subject he teaches,
- can set material & homework.
- Text or PDFs.

## Set attendence & Grades

- In subjects tab, choose a subject, then choose a class that has this subject in its schedule
- can set attendence & grades accordingly.

## See his scheduele

- Query all classes for a subject that this teacher teaches... not looking good as a query.
- a schedule (or report) of his subjects & timing of them throughout the week.

## see porifles of students parents

- Same tab of `Attendence & Grades`, it shows a list of students assigned to that class which has a subject he teaches.
- From there he can visit student profile, from student profile he can visit parent profile.

## Reports

- print his schedule (i.e. table of his subjects & classes of these subjects)
- print attednece of each subject (each class in a separate paper)
- print grades of each subject (each class in a separate paper)

# Student

- Fields: First name, Last name, Gender, Phone number, Password, **Username**, Class (Multiple-choice first year, second year, ...), Address, Email, Date of Birth, Parent name, parent phone number, Upload Profile Picture to AWS S3, Date of joining.
- What does a **Student** do?
  - Has profile.
  - See grades, attendance.
  - Can see profiles of Parent, Teacher(s).
  - Can see class & profiles of students in the class.
  - Can see class schedule.
  - Can see material & homework.
  - Ability to print reports of grades, attendence.

## Profile

- Adding to the rest: his class, and parent.

## See grades, attendence

- Tab for subjects
- Show grades of each subject he's assigned to.
- show attendence of each subject he's assigned to.

## see profiles of parent, teacher

- Show subjects => can have link to teacher profile.
- his parent profile will be in his own profile (link)

## Can see class & profiles of students

- Tab of his class, where he can see profiles of students & links to them.

## class secheudule

- in the same tab^ he can see class scheudle.
- or some other tab.

## class material & homework

- can see subjects & see material & homework for them.

## reports

- Print attendence, grades, scheudle.

# Staff

- Fields: Identical to Teacher.
- Admin has ability to add, edit & delete.
- Has no functions except for public ones e.g. Holidays.

# Attendence

- Will be updated.

# Holidays tab

- Admin has ability to add & edit & remove,
- rest of users has ability to read.

# Fees tab

- Admin has ability to add & edit & remove,
  - Should verify that student exists
- **student** of users has ability to read.

# Somethings that are shared:

- Parts of the profile.
- First login screen.
- ?Dashboard?
- Resetting password (in-case he/she remembers his/her email)
- Holidays

# Next step(s)?

- I think logically it is Backup & Restore, i.e. start a new academic year.
- Adding Parent user

# Concerns:

- PostgreSQL database design.
- There's what I think is caled `3rd Normal Form` in `Teachers & Classes` and `Students & Subjects`. i.e. "distant" relationship.
- Now I thought of the MVP, should I think of the other versions/other possible features at the same time?
  - i.e. to allow for a design that may suit "possible" features? Talking in a "near-future" perspective.
- ID should be random & unpredictable & cryptographically safe.
- I thought of this as backend only, it might have _horrible_ UX.

# Angular To-Dos:

- Sending requests to cross-origin server with cookies.
- Accepting cross-origin cookies from cross-origin server.
- Displaying response from server.

# This branch To-Dos:

- Do Session-based authentication.
- Think about your middlewares
- error checking
- are routes actually secure?

# Above was "summary of this, every thought I had ~2 Hours:

- Stakeholders: Parent - Student - Teacher - Manager - Admin
- What does the Parent do?
  - a parent can have many students ?attached? to him.
  - Looking mainly like the R in CRUD.
  - Has profile.
  - See grades of student(s).
  - See attendence of student(s).
    - Should be somehow notified if online.
  - See (profiles?) teachers of student(s).
  - See schedule of student(s).
  - Notification of... everything?
  - Can contact managers... ?somehow?
  - Pay Fees, subscribe to bus service.
  - See student|class homework.
  - See student|class material.
  - See messages/warnings to student/parent BY Manager/Teacher.
    - And have the ability to reply.
  - Sent message to Manager/Teacher.
  - Has history of messages & replies.
  - Ability to print reports of ^.
  - ...
- What does a Student do?
  - Has profile.
  - See grades, attendance.
  - Can see profiles of Parent, Teacher(s).
  - Can see class & profiles of students in the class.
  - Can see subject schedule.
  - Can see material & homework.
  - Can see managers & teachers profiles.
    - Can turn in homework.
  - Can see fees.
  - See messages/warning by teacher/manager.
  - can reply to some messages.
  - Has history of messages & replies.
  - Ability to print reports of ^.
- What does a Teacher do?
  - Has profile.
  - Set class & homework for classes he teaches.
  - Make students attendence.
  - Set student grades.
  - See HIS subject/class schedule.
  - Accept or reject hurned-in homework.
  - See profiles of Sudents, parents in his classes.
  - Can send messages/notifications to Students/Parents.
  - Ability to print reports of ^.
- What does a manager do?
  - Can edit student attendance.
- What does admin do?
  - can edit student attendnece.
  - can edit homework & class matertial.
  - can edit grades.
  - can edit classes,
  - can edit schedules.
  - Save past year, enter new year (Delete & Backup).
  - Restore past subjects.

# Parent

- What does the **Parent** do?
  - Has profile.
  - a parent can have many students ?attached? to him.
  - See grades of student(s).
  - See attendence of student(s).
  - See profiles teachers of student(s).
  - See schedule of student(s).
  - See class material & homework.
  - Ability to print reports of grades, attendence.

# LATER

## Profile

- Similar to others, except has link to each of his kids.

## Grades, attendence

- `My kids` tab -> for each students see grades attencence.
- This means attendence & grades for all of this students subjects
- i.e.
  1. Query class of student & return this class' subjects
  2. ???, I don't know. #Design, similarly in Teacher setting grades, where does the grades go?

## teachers, schedule

- `My Kids` tab, select one of his kids.
- See his scheudle, click to see details of subject for that student.
  - "See his schedule" #Design #HERE
- details: material & homework, ?grades, attednece,? link to profile of teacher.

## Reports:

- Grades, Attendence.
- Student Schedule.
- Student teachers.

# End
