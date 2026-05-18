# MEA Assistant verified seed knowledge

Last reviewed: 2026-05-18.

This file intentionally contains only public, sourceable information. When details change, update this
file or add another markdown file in this folder. The chatbot loads all `*.md` files from this folder.

## Core behavior

- The assistant helps Mechanical Engineering students at IIT Bombay with MEA resources, academic
  navigation, course/timetable questions, and slot-clash reasoning.
- It should not claim access to private ASC, ResoBin, Google Drive, or institute login data.
- It should not invent live instructor assignments, course capacities, roll-number-specific eligibility,
  or registration outcomes.
- For current registration, final eligibility, exact instructors, and current slot data, students should
  verify on ASC and official Academic Office/department pages.

## Key public sources

- MEA website: https://mea.netlify.app/
- MEA source website repository: https://github.com/AaravG42/mea-website
- IIT Bombay Mechanical Engineering undergraduate academics:
  https://www.me.iitb.ac.in/undergraduate-academics
- IIT Bombay Academic Office calendar and timetable:
  https://acad.iitb.ac.in/academics/calendar-and-timetable
- IIT Bombay ASC public course information:
  https://portal.iitb.ac.in/asc/Courses
- IIT Bombay Mechanical Engineering faculty directory:
  https://www.me.iitb.ac.in/full-time-faculty
- ResoBin login page:
  https://resobin.gymkhana.iitb.ac.in/login

## MEA and department

- MEA stands for Mechanical Engineering Association, IIT Bombay.
- The MEA website is a central hub for mechanical engineering students, faculty, and alumni to connect,
  share resources, view events, access documentation, and find departmental information.
- The public department council page says MEA has a department general secretary, MEA general secretary,
  PG members, UG members, and class representatives. It describes the council as a 3-tier council with
  30+ members.
- The Department of Mechanical Engineering is at IIT Bombay, Powai, Mumbai 400076, Maharashtra, India.
- The department public page says it is one of the largest departments in the institute, with 62 full-time
  faculty members and over 50 full-time administrative and technical support staff.
- Department contact from the official page: phone (+91) 22-2576 7501/02/03, fax (+91) 22-2572 6875,
  email office.me[at]iitb.ac.in.

## Undergraduate academics and curriculum

Source: https://www.me.iitb.ac.in/undergraduate-academics

- The four-year B.Tech. program prepares students in fundamental aspects of Mechanical Engineering with
  compulsory theory courses, laboratory courses, and electives.
- The primary objective of the B.Tech. program is to train students for industry opportunities requiring
  a basic Mechanical Engineering background and to prepare students for higher academic programs at
  master's and doctoral levels.
- The official Mechanical Engineering undergraduate academics page links curriculum documents for:
  - UG curriculum for BTech/DD 2022 batch.
  - UG curriculum for BTech/DD 2023 batch.
  - UG curriculum for BTech/DD 2024 batch onwards:
    https://www.me.iitb.ac.in/sites/default/files/UG-Curriculum-Mechanical-2024Batch-Onwards-Aug-2025.pdf
  - Complete B.Tech. curriculum.
  - Complete Dual Degree curriculum.
- The five-year B.Tech. + M.Tech. Dual Degree program provides additional advanced courses, electives,
  and a fourteen-month Dual Degree Project.
- Official Dual Degree specializations listed by the department:
  - Thermal and Fluids Engineering.
  - Computer Aided Design and Automation.
  - Computer Integrated Manufacturing.

## Academic calendar, timetable, and ASC

Sources:
- https://acad.iitb.ac.in/academics/calendar-and-timetable
- https://portal.iitb.ac.in/asc/Courses

- The Academic Office calendar and timetable page links official academic calendars and timetable files.
- As of review, the page links the Academic Calendar for 2026-27, Academic Calendar for 2025-26, and
  past academic calendars.
- As of review, the page links Spring semester timetable information for UG and PG common courses and
  the general slot pattern for other UG/PG courses.
- The ASC public course information page lists departments and includes Mechanical Engineering.
- ASC/login-only pages are authoritative for current semester course offerings, instructors, slots,
  capacities, and registration status.

## Slot-clash reasoning

- A slot clash means two academic activities overlap in day and time.
- To check a clash manually:
  1. Put both courses/activities in the same time format.
  2. Compare only entries on the same day first.
  3. Convert start/end times to minutes from midnight if needed.
  4. Two intervals clash when start A is before end B and start B is before end A.
  5. If there is any overlap, ask ASC/Academic Office or the course instructor whether registration is
     allowed. The chatbot must not promise that a clash will be accepted.
- If a student provides two course timings, the assistant can calculate whether those timings overlap.
- If a student asks whether ASC will permit a clash, the assistant should say to verify on ASC or with
  the Academic Office because the bot cannot access live registration rules or exceptions.

## Timetable currently shown on the MEA website

Source: MEA website code under Resources -> Timetable. This may be a student resource and should be
verified with ASC/Academic Office for live registration.

First year:
- Monday: MA105 08:30-09:25 LA201; MS101 Lecture 10:35-11:30 LA201; ME103 11:35-12:30 LA201;
  CH117 (P3) 14:00-16:55.
- Tuesday: ME103 08:30-09:25 LA201; MA105 09:30-10:25 LA201; MS101 Lab (P3) 14:00-16:55.
- Wednesday: BB101 11:05-12:30 LH302.
- Thursday: BB101 Tutorial 08:30-09:25; ME103 09:30-10:25 LA201; MA105 10:35-11:30 LA201.
- Friday: BB101 11:05-12:30 LH302; MS101 Lab (P3) 14:00-16:55.

Second year:
- Monday: ME221 08:30-09:25; ME223 10:30-11:25; ME225 11:30-12:25; EC101 15:30-16:55.
- Tuesday: ME225 08:30-09:25; ME221 09:30-10:25; ME223 11:30-12:25.
- Wednesday: ME209 11:05-12:30.
- Thursday: ME223 08:30-09:25; ME225 09:30-10:25; ME221 10:30-11:25; EC101 15:30-16:55.
- Friday: ME209 11:05-12:30.

Third year:
- Monday: ME323 08:30-09:25; ME319 09:30-10:25; ME346 10:35-11:30; ME306 11:35-12:30;
  ME224 S1 14:00-15:25.
- Tuesday: ME306 08:30-09:25; ME323 09:30-10:25; ME319 10:35-11:30; ME346 11:35-12:30;
  ME374 S1 14:00-15:25.
- Thursday: ME346 08:30-09:25; ME306 09:30-10:25; ME323 10:35-11:30; ME319 11:35-12:30;
  ME224 S2 14:00-15:25.
- Friday: ME374 S2 14:00-15:25.

## Faculty and instructors

Source: https://www.me.iitb.ac.in/full-time-faculty

- The official Mechanical Engineering faculty directory is the best public source for faculty names,
  designations, office locations, phone numbers, and research interests.
- The page lists Prof. Atul Sharma as Rahul Bajaj Chair Professor and Head of the Department.
- The page lists faculty members including Saurav Agarwal, Priyanshu Agarwal, Amit Agrawal, Alankar
  Alankar, Milind Atrey, Dipanshu Bansal, Tanmay K. Bhandakkar, Rajneesh Bhardwaj, Abhilash J. Chandy,
  Shivasubramanian Gopalakrishnan, Anirban Guha, Abhishek Gupta, Krishna N. Jonnalagadda,
  K. P. Karunakaran, Deepak Marla, Sushil Mishra, Sripriya Ramamoorthy, Ramesh Singh, Asim Tewari,
  Nitesh P. Yelve, and others.
- The chatbot should not infer that a faculty member is the current instructor for a course unless that
  mapping is explicitly present in verified added notes.

## MEA website resources

Source: MEA website code and public pages.

- Resources page includes academic timetables, lab information, and useful documents.
- Useful documents currently include:
  - UG curriculum 2024 onwards.
  - Academic Calendar.
  - Mech Sophomore Resume Repository.
  - Previous Exam Papers.
- Docs page includes department constitution, UG rulebook, Masters rulebook, PhD rulebook, internship
  documents, resume repository references, retagging norms placeholder, and student application form.
- DAMP stands for Department Academic Mentorship Program. It is a student-run mentorship program in the
  Mechanical Engineering Department aimed at helping juniors navigate academics, course selection, study
  strategies, and academic life.

## ResoBin

Source: https://resobin.gymkhana.iitb.ac.in/login

- ResoBin is available at the IIT Bombay Gymkhana ResoBin login page.
- The bot cannot access login-only ResoBin content. If a student asks for ResoBin-specific private
  materials, tell them to log in to ResoBin and add verified notes/files to the chatbot knowledge base
  if they want the bot to answer from that content later.
