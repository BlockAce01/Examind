# Examind Application - Comprehensive Test Plan

## Application Overview

Examind is a full-stack online learning and community platform designed for A/L students and teachers in Sri Lanka. The application provides a comprehensive educational ecosystem with the following key features:

### Core Features
- **User Management**: Multi-role authentication system (Student, Teacher, Admin) with secure JWT-based authentication
- **Quiz System**: Interactive quiz creation, taking, and grading with multiple-choice questions
- **Discussion Forums**: Community-driven forums for subject-specific discussions with commenting and upvoting
- **Resource Library**: Centralized repository for educational materials (past papers, notes, study guides)
- **Gamification**: Points-based reward system with badges and leaderboards
- **Subject Management**: Support for 28+ A/L subjects including Biology, Physics, Chemistry, Mathematics, ICT, and more
- **Role-Based Access**: Different interfaces and permissions for Students, Teachers, and Admins
- **AI Chatbot**: Intelligent assistance for quiz results and explanations

### Technical Stack
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, PostgreSQL
- **Authentication**: JWT with bcrypt password hashing
- **Database**: PostgreSQL with comprehensive relational schema

### User Roles
1. **Student**: Can take quizzes, access resources, participate in discussions, earn badges
2. **Teacher**: Can create/manage quizzes and resources, moderate discussions
3. **Admin**: Full system access including user management and system statistics

---

## Test Scenarios

### 1. User Authentication and Registration

**Seed:** `tests/seed.spec.ts`

#### 1.1 Student Registration - Valid Data
**Steps:**
1. Navigate to http://localhost:3000
2. Application should redirect to login page
3. Click "Register here" link
4. Fill in "Full Name" field with "John Doe"
5. Fill in "Email Address" field with "john.doe@example.com"
6. Fill in "Password" field with "SecurePass123!"
7. Fill in "Confirm Password" field with "SecurePass123!"
8. Select "Student" from "Register As" dropdown
9. Select "Combined Mathematics" from "Subject 1" dropdown
10. Select "Physics" from "Subject 2" dropdown
11. Select "Chemistry" from "Subject 3" dropdown
12. Click "Register" button

**Expected Results:**
- Success message "Registration successful! You can now log in." appears
- Form fields are cleared
- User data is stored in database with hashed password
- Three subject associations are created in StudentSubject table
- User is assigned "student" role
- Initial points set to 0

#### 1.2 Student Registration - Missing Required Fields
**Steps:**
1. Navigate to registration page (http://localhost:3000/register)
2. Fill in only "Full Name" with "Jane Smith"
3. Fill in only "Email Address" with "jane@example.com"
4. Leave Password fields empty
5. Click "Register" button

**Expected Results:**
- Form validation prevents submission
- Error messages appear for required fields
- No database entry is created
- User remains on registration page

#### 1.3 Student Registration - Password Mismatch
**Steps:**
1. Navigate to registration page
2. Fill in "Full Name" with "Test User"
3. Fill in "Email Address" with "test@example.com"
4. Fill in "Password" with "Password123!"
5. Fill in "Confirm Password" with "DifferentPass123!"
6. Select "Student" from role dropdown
7. Click "Register" button

**Expected Results:**
- Validation error appears: "Passwords do not match"
- Form is not submitted
- No database entry created

#### 1.4 Student Registration - Duplicate Email
**Steps:**
1. Register a user with email "duplicate@example.com"
2. Logout and return to registration page
3. Attempt to register another user with the same email "duplicate@example.com"
4. Fill in all other required fields
5. Click "Register" button

**Expected Results:**
- Error message appears: "Email already exists" or similar
- Registration fails
- No new user record created in database

#### 1.5 Teacher Registration - With Subject Selection
**Steps:**
1. Navigate to registration page
2. Fill in "Full Name" with "Professor Smith"
3. Fill in "Email Address" with "prof.smith@example.com"
4. Fill in "Password" with "TeacherPass123!"
5. Fill in "Confirm Password" with "TeacherPass123!"
6. Select "Teacher" from "Register As" dropdown
7. Select "Physics" from "Subject" dropdown (only one subject selection allowed)
8. Click "Register" button

**Expected Results:**
- Registration succeeds
- User role is set to "teacher"
- Subject association created in TeacherSubject table (only one record)
- Success message appears
- User can login with teacher credentials

#### 1.6 Valid Login - Student Account
**Steps:**
1. Navigate to http://localhost:3000/login
2. Fill in "Email Address" with registered student email
3. Fill in "Password" with correct password
4. Click "Login" button

**Expected Results:**
- Login successful
- JWT token generated and stored in localStorage
- User redirected to /dashboard
- Navigation bar shows student-specific links: Dashboard, Quizzes, Resources, Discussions, Challenges, Leaderboard
- User profile link displays student name
- Dashboard shows welcome message with student name
- Stats cards display: Total Points (0), Badges Earned (0), Quizzes Taken (0)

#### 1.7 Invalid Login - Wrong Password
**Steps:**
1. Navigate to login page
2. Fill in valid email address
3. Fill in incorrect password
4. Click "Login" button

**Expected Results:**
- Login fails
- Error message appears: "Invalid credentials" or similar
- User remains on login page
- No token stored
- No redirect occurs

#### 1.8 Invalid Login - Unregistered Email
**Steps:**
1. Navigate to login page
2. Fill in "Email Address" with "nonexistent@example.com"
3. Fill in "Password" with any password
4. Click "Login" button

**Expected Results:**
- Login fails
- Error message appears
- User remains on login page
- No authentication token created

#### 1.9 Login Session Persistence
**Steps:**
1. Login with valid credentials
2. Navigate to /dashboard
3. Refresh the browser page
4. Check user session state

**Expected Results:**
- User remains logged in after refresh
- Token persists in localStorage
- User data remains in context
- Dashboard loads without requiring re-login

#### 1.10 Logout Functionality
**Steps:**
1. Login with valid credentials
2. Navigate to any authenticated page
3. Click "Logout" button in navigation bar
4. Observe behavior

**Expected Results:**
- User is logged out immediately
- JWT token removed from localStorage
- User data cleared from context
- Redirect to /login page
- Attempting to access protected routes redirects to login

---

### 2. Dashboard and User Profile

**Seed:** `tests/seed.spec.ts`

#### 2.1 Student Dashboard - Initial View
**Steps:**
1. Login as a new student with no activity
2. Navigate to /dashboard (automatic redirect after login)
3. Observe dashboard content

**Expected Results:**
- Welcome message: "Welcome back, [Student Name]!"
- Stats section displays:
  - Total Points: 0
  - Badges Earned: 0
  - Quizzes Taken: 0
- "Explore Examind" section shows 6 quick link cards:
  - Take a Quiz
  - Browse Resources
  - Join Discussions
  - View Challenges
  - Check Leaderboard
  - My Profile
- Recent Activity section shows placeholder: "Your recent quiz attempts and forum interactions will appear here..."
- Leaderboard Snapshot shows placeholder: "Top 5 students will be shown here..."

#### 2.2 Dashboard - After Taking Quiz
**Steps:**
1. Login as student
2. Take and complete a quiz
3. Return to dashboard
4. Check updated statistics

**Expected Results:**
- "Quizzes Taken" count increments
- Total Points updated based on quiz performance
- Recent Activity shows the completed quiz
- If points earned, user position may appear in leaderboard snapshot

#### 2.3 Student Profile View
**Steps:**
1. Login as student
2. Click on student name in navigation bar OR
3. Click "My Profile" quick link from dashboard
4. View profile page at /profile

**Expected Results:**
- Page title: "My Profile"
- Profile section displays:
  - User avatar/icon
  - Full name
  - Email address
  - Role badge ("student")
  - "Edit Profile" button
- Achievements section shows:
  - Points count
  - Badges count
  - Quizzes Done count
- "My Badges" section (empty if no badges earned)
- Settings section with buttons:
  - Account Preferences
  - Change Password

#### 2.4 Profile - Edit Profile Button
**Steps:**
1. Navigate to /profile
2. Click "Edit Profile" button
3. Observe behavior

**Expected Results:**
- Modal or form appears for editing profile
- User can update name and other editable fields
- Email may be read-only or require verification
- Changes save to database on submission

#### 2.5 Leaderboard View - Global Ranking
**Steps:**
1. Login as student
2. Navigate to /leaderboard
3. View leaderboard content

**Expected Results:**
- Page title: "Leaderboard"
- List displays all students ranked by points (descending)
- Each entry shows:
  - Rank number (1, 2, 3, ...)
  - Student name
  - Total points
- Current logged-in user is highlighted if visible in list
- Rankings update after quiz completions

---

### 3. Quiz Management and Taking

**Seed:** `tests/seed.spec.ts`

#### 3.1 Browse Available Quizzes
**Steps:**
1. Login as student
2. Navigate to /quizzes
3. Observe quiz listing

**Expected Results:**
- Page title: "Available Quizzes"
- Filter options displayed:
  - Subject filter dropdown (All Subjects, Combined Mathematics, Chemistry, Physics, etc.)
  - Difficulty filter dropdown (All Difficulties, Easy, Medium, Hard)
  - "Clear Filters" button (disabled when no filters applied)
- Each quiz card displays:
  - Quiz title
  - Difficulty badge (Easy/Medium/Hard with color coding)
  - Subject name with icon
  - Number of questions
  - Time limit in minutes
  - "Start Quiz" button

#### 3.2 Filter Quizzes by Subject
**Steps:**
1. Navigate to /quizzes
2. Select "Physics" from subject filter dropdown
3. Observe filtered results

**Expected Results:**
- Only Physics quizzes are displayed
- Other subject quizzes are hidden
- "Clear Filters" button becomes enabled
- Filter selection persists during page session

#### 3.3 Filter Quizzes by Difficulty
**Steps:**
1. Navigate to /quizzes
2. Select "Hard" from difficulty filter
3. Observe results

**Expected Results:**
- Only "Hard" difficulty quizzes shown
- Easy and Medium quizzes hidden
- "Clear Filters" button enabled
- Can combine with subject filter for compound filtering

#### 3.4 Clear Quiz Filters
**Steps:**
1. Apply subject filter "Chemistry"
2. Apply difficulty filter "Medium"
3. Click "Clear Filters" button

**Expected Results:**
- All quizzes displayed again
- Subject dropdown resets to "All Subjects"
- Difficulty dropdown resets to "All Difficulties"
- "Clear Filters" button becomes disabled

#### 3.5 Start Taking a Quiz
**Steps:**
1. Navigate to /quizzes
2. Locate "Physics MCQ past papers" quiz
3. Click "Start Quiz" button
4. Observe quiz interface

**Expected Results:**
- Redirect to /quizzes/[quizId]/take
- Quiz title displayed at top
- Timer starts counting down from specified time limit (e.g., "Time Left: 05:00")
- Question counter shows current question: "Question 1 of 3"
- Question text displayed clearly
- Answer options shown as selectable buttons
- Navigation buttons:
  - "Previous" button (disabled on first question)
  - "Next" button (enabled)

#### 3.6 Answer Quiz Questions - Navigate Between Questions
**Steps:**
1. Start a quiz with multiple questions
2. On Question 1, select an answer option
3. Click "Next" button
4. Observe Question 2 appears
5. Click "Previous" button
6. Verify return to Question 1

**Expected Results:**
- Selected answer is highlighted/indicated
- "Next" button advances to next question
- "Previous" button returns to previous question
- "Previous" button disabled on Question 1
- Selected answers persist when navigating back
- Question counter updates correctly (e.g., "Question 2 of 3")

#### 3.7 Quiz Timer Countdown
**Steps:**
1. Start a quiz with 5-minute time limit
2. Answer questions slowly
3. Observe timer countdown
4. Wait for timer to approach zero (or modify timer for testing)

**Expected Results:**
- Timer displays in MM:SS format
- Timer counts down every second
- Timer changes color when running low (e.g., red below 1 minute)
- When timer reaches 00:00:
  - Quiz auto-submits
  - User redirected to results page
  - Current answers saved as final submission

#### 3.8 Submit Quiz Before Time Expires
**Steps:**
1. Start a quiz
2. Answer all questions
3. Navigate to last question
4. Click "Next" or "Submit" button on final question
5. Confirm submission if prompted

**Expected Results:**
- Quiz submission confirmation appears
- User redirected to results page (/quizzes/[quizId]/results)
- Answers saved to database (UserAnswers table)
- Score calculated and stored (Takes table)
- Timer stops
- Points awarded based on performance

#### 3.9 View Quiz Results
**Steps:**
1. Complete and submit a quiz
2. Observe results page
3. Review result details

**Expected Results:**
- Results page displays:
  - Score: X out of Y (e.g., "2 out of 3")
  - Percentage score
  - Points earned
  - Time taken
- Question-by-question review showing:
  - Question text
  - User's selected answer
  - Correct answer
  - Indication if answer was correct/incorrect
- "Back to Quizzes" button
- Option to view AI chatbot explanation

#### 3.10 Retake Quiz
**Steps:**
1. View quiz results
2. Navigate back to /quizzes
3. Find the same quiz
4. Click "Start Quiz" again

**Expected Results:**
- Quiz can be taken again
- Previous answers not pre-filled (fresh attempt)
- New submission creates separate entry in Takes table
- New score may update user's total points
- Both attempts stored in history

#### 3.11 Quiz Results - AI Chat Assistance
**Steps:**
1. Complete a quiz
2. On results page, look for AI chatbot option
3. Click to interact with AI chat
4. Ask for explanation of incorrect answers

**Expected Results:**
- AI chat interface appears
- Chatbot provides explanations for quiz questions
- Can ask follow-up questions
- Explanations help with learning

---

### 4. Resource Management

**Seed:** `tests/seed.spec.ts`

#### 4.1 Browse All Resources - Student View
**Steps:**
1. Login as student
2. Navigate to /resources
3. Observe resource listing

**Expected Results:**
- Page title: "Learning Resources"
- Search bar at top with placeholder: "Search by title or description..."
- Filter dropdowns:
  - Subject filter (All Subjects, Physics, ICT, Chemistry, etc.)
  - Type filter (All Types, Past Paper, Notes, Other)
  - "Clear All" button (disabled initially)
- Resource cards display:
  - Resource thumbnail/icon
  - Title (clickable link)
  - Description (if available)
  - Type badge (Past Paper, Notes, Other)
  - Subject tag
  - Year of publication
  - Date added to platform
- Clicking title opens/downloads resource

#### 4.2 Search Resources by Title
**Steps:**
1. Navigate to /resources
2. Type "past paper" in search box
3. Observe filtered results

**Expected Results:**
- Only resources with "past paper" in title or description shown
- Search is case-insensitive
- Results update as user types (debounced)
- Other resources hidden

#### 4.3 Filter Resources by Subject
**Steps:**
1. Navigate to /resources
2. Select "Physics" from subject filter
3. Observe results

**Expected Results:**
- Only Physics resources displayed
- Other subjects hidden
- Can combine with type filter
- "Clear All" button becomes enabled

#### 4.4 Filter Resources by Type
**Steps:**
1. Navigate to /resources
2. Select "Notes" from type filter
3. View results

**Expected Results:**
- Only "Notes" type resources shown
- Past Papers and Other types hidden
- Type filter works independently or combined with subject filter

#### 4.5 Clear Resource Filters
**Steps:**
1. Apply subject filter "ICT"
2. Apply type filter "Past Paper"
3. Type "teacher" in search
4. Click "Clear All" button

**Expected Results:**
- All filters reset
- Search box cleared
- All resources displayed
- Filter dropdowns return to "All" options

#### 4.6 Download/Access Resource
**Steps:**
1. Navigate to /resources
2. Find a resource (e.g., "past paper")
3. Click on resource title link
4. Observe download/access behavior

**Expected Results:**
- Resource opens in new tab if viewable (PDF)
- Resource downloads if file type requires download
- Access is logged in Access table with UserID, ResourceID, and timestamp
- User can view resource content

#### 4.7 Teacher - Upload New Resource
**Steps:**
1. Login as teacher account
2. Navigate to /teacher/resources or /resources
3. Look for "Upload Resource" or "Create Resource" button
4. Click to open upload form
5. Fill in:
   - Title: "Chemistry Notes Chapter 5"
   - Type: "Notes"
   - Subject: "Chemistry"
   - File: Upload a PDF file
   - Description: "Detailed notes on organic chemistry"
   - Year: 2024
6. Submit form

**Expected Results:**
- Upload form validation passes
- File uploads successfully
- Resource entry created in database with:
  - UploaderUserID set to teacher's ID
  - FileURL pointing to uploaded file
  - UploadedDate set to current timestamp
- Success message appears
- New resource appears in resources list
- Students can now access the resource

#### 4.8 Teacher - Edit Existing Resource
**Steps:**
1. Login as teacher
2. Navigate to resources created by this teacher
3. Click "Edit" button on a resource
4. Modify title to "Updated Chemistry Notes"
5. Change description
6. Save changes

**Expected Results:**
- Edit form pre-populated with current data
- Changes save successfully to database
- Updated resource reflects new information
- Other fields (file, subject) can also be updated

#### 4.9 Teacher - Delete Resource
**Steps:**
1. Login as teacher
2. Find resource created by this teacher
3. Click "Delete" button
4. Confirm deletion in prompt

**Expected Results:**
- Confirmation dialog appears
- After confirmation, resource deleted from database
- Resource no longer appears in listing
- Related Access records may be preserved or cascade deleted
- Success message confirms deletion

#### 4.10 Admin - Manage All Resources
**Steps:**
1. Login as admin
2. Navigate to /admin or admin resources view
3. View all resources from all uploaders
4. Edit or delete any resource

**Expected Results:**
- Admin can see all resources regardless of uploader
- Can edit any resource
- Can delete any resource
- Has full control over resource management

---

### 5. Discussion Forums

**Seed:** `tests/seed.spec.ts`

#### 5.1 View All Discussion Forums
**Steps:**
1. Login as student
2. Navigate to /discussions
3. Observe forum listing

**Expected Results:**
- Page title: "Discussion Forums"
- "+ Create New Topic" button visible in top right
- Forum list displays each discussion with:
  - Forum title (clickable)
  - Creator name
  - Description/excerpt
  - Subject tag
  - Post count
  - Last activity timestamp
- Forums sorted by last activity (most recent first)

#### 5.2 Create New Discussion Topic
**Steps:**
1. Navigate to /discussions
2. Click "+ Create New Topic" button
3. Fill in form:
   - Topic: "How to solve quadratic equations?"
   - Subject: "Combined Mathematics"
   - Description: "I'm having trouble understanding the concept of complex roots."
4. Submit form

**Expected Results:**
- Discussion creation form appears
- Form validates required fields
- On submission:
  - New DiscussionForum record created in database
  - CreatorUserID set to current user
  - SubjectID linked to selected subject
  - PostCount initialized to 0
  - LastActivity set to current timestamp
- User redirected to new discussion page (/discussions/[forumId])
- Topic appears in forum listing

#### 5.3 View Discussion Thread
**Steps:**
1. Navigate to /discussions
2. Click on an existing discussion topic (e.g., "help me with this question")
3. View discussion detail page

**Expected Results:**
- Redirect to /discussions/[forumId]
- "Back to All Forums" link at top
- Discussion title displayed prominently
- Original description/question shown
- Subject tag visible
- Comment section below with:
  - "Add your contribution:" text area
  - "Post Reply" button (disabled until text entered)
  - "Comments" heading
  - List of all comments with:
    - Commenter avatar
    - Commenter name
    - Comment text
    - Timestamp (e.g., "3 months ago")
    - Upvote button with count

#### 5.4 Post Comment in Discussion
**Steps:**
1. Navigate to discussion detail page
2. Click in "Add your contribution:" text area
3. Type comment: "The maximum height is calculated using h = (v² sin²θ) / (2g)"
4. Click "Post Reply" button

**Expected Results:**
- "Post Reply" button enables when text is entered
- On submission:
  - Comment created in Comment table
  - ForumID links to current forum
  - UserID set to current user
  - Content contains comment text
  - Date set to current timestamp
  - Upvotes initialized to 0
- Comment appears immediately in comment list
- Text area cleared for next comment
- Forum's PostCount incremented
- Forum's LastActivity updated

#### 5.5 Upvote Comment
**Steps:**
1. View discussion with existing comments
2. Click upvote button (👍 icon) on a comment
3. Observe count update

**Expected Results:**
- Upvote button changes state (filled/highlighted)
- Upvote count increments by 1
- CommentUpvotes record created with:
  - CommentID
  - UserID of voter
  - UpvoteDate timestamp
- User can only upvote once per comment
- Clicking again removes upvote (toggle behavior)

#### 5.6 Upvote Own Comment - Validation
**Steps:**
1. Post a comment
2. Attempt to upvote own comment

**Expected Results:**
- Either:
  - Upvote button disabled on own comments, OR
  - Upvote button shows but does nothing, OR
  - System allows self-upvoting (depends on business logic)

#### 5.7 Admin - Edit Discussion Topic
**Steps:**
1. Login as admin
2. Navigate to /admin/discussions or admin panel
3. Find discussion to edit
4. Click "Edit" option
5. Modify topic or description
6. Save changes

**Expected Results:**
- Edit form appears with current data
- Admin can edit any forum details
- Changes save to database
- Updated forum reflects modifications

#### 5.8 Admin/Teacher - Delete Discussion
**Steps:**
1. Login as admin or teacher
2. Navigate to discussions list or specific forum
3. Click "Delete" button
4. Confirm deletion

**Expected Results:**
- Confirmation prompt appears
- On confirmation:
  - DiscussionForum record deleted
  - Related comments cascade deleted (due to foreign key)
  - Forum removed from listing
- Success message displayed

#### 5.9 Discussion - Search/Filter by Subject
**Steps:**
1. Navigate to /discussions
2. Look for subject filter (if available)
3. Select "Physics"

**Expected Results:**
- Only Physics discussions shown
- Other subject discussions hidden
- Filter persists during session

#### 5.10 Discussion - Empty State
**Steps:**
1. Navigate to /discussions when no forums exist OR
2. Apply filters that return no results

**Expected Results:**
- Message displayed: "No discussions found" or similar
- Prompt to create new topic
- Instructions for getting started

---

### 6. Gamification - Points and Badges

**Seed:** `tests/seed.spec.ts`

#### 6.1 Earn Points from Quiz Completion
**Steps:**
1. Login as student with 0 points
2. Navigate to /quizzes
3. Take and complete a quiz with correct answers
4. View results and return to dashboard

**Expected Results:**
- Points awarded based on quiz performance
- Points calculation: (number correct / total questions) × points possible
- User's Points field in User table incremented
- Dashboard displays updated Total Points
- Profile page reflects new points
- Leaderboard position may change

#### 6.2 Points Display Consistency
**Steps:**
1. Login as student
2. Check points on:
   - Dashboard stat card
   - Profile page achievements section
   - Leaderboard entry
3. Verify all locations show same value

**Expected Results:**
- Points value consistent across all views
- Real-time or near-real-time updates after point changes
- No discrepancies in displayed values

#### 6.3 Badge Award - First Quiz
**Steps:**
1. Create new student account (0 badges)
2. Complete first quiz
3. Navigate to profile page
4. Check "My Badges" section

**Expected Results:**
- If "First Quiz" badge exists, it should be awarded
- Badge appears in profile badges section
- Badge entry in UserBadge table created
- EarnedDate set to current timestamp
- Badge icon displayed
- Badges Earned count increments to 1

#### 6.4 Badge Award - Point Milestones
**Steps:**
1. Take multiple quizzes to accumulate points
2. Reach point milestones (e.g., 100, 500, 1000 points)
3. Check profile after each milestone

**Expected Results:**
- Milestone badges awarded automatically
- Badge notification appears (if implemented)
- Profile shows all earned badges
- Badge tier indicators visible (Bronze, Silver, Gold, etc.)

#### 6.5 Badge Check API Endpoint
**Steps:**
1. Complete action that should trigger badge (quiz, discussion post, etc.)
2. Backend should call `/api/v1/badges/check/:userId`
3. Check UserBadge table for new entries

**Expected Results:**
- Badge check runs automatically after point-earning actions
- Multiple badge conditions evaluated
- Eligible badges awarded immediately
- Only newly earned badges added (no duplicates)

#### 6.6 Leaderboard Ranking Updates
**Steps:**
1. Note current leaderboard position
2. Complete quiz and earn points
3. Refresh leaderboard page
4. Verify position update

**Expected Results:**
- Leaderboard recalculates rankings based on updated points
- User's position moves up if points increased
- Rankings displayed in descending order by points
- Ties handled gracefully (same rank or alphabetical sub-sort)

#### 6.7 View Other User's Badges
**Steps:**
1. Navigate to leaderboard
2. Click on another user's profile (if clickable)
3. View their badges and achievements

**Expected Results:**
- Other users' public profiles viewable
- Badges and points displayed
- Cannot edit other users' data
- Achievements inspire competition

#### 6.8 Badge Collection Progress
**Steps:**
1. Login as student
2. Navigate to profile page
3. View badges section
4. Check for progress indicators

**Expected Results:**
- Earned badges displayed with icons
- Unearned badges shown as locked/grayed out (optional)
- Progress bars for cumulative badges (e.g., "Take 10 quizzes")
- Tooltips explain how to earn each badge

---

### 7. Teacher Dashboard and Content Management

**Seed:** `tests/seed.spec.ts`

#### 7.1 Teacher Login and Dashboard Access
**Steps:**
1. Register/Login as teacher account
2. Observe redirect destination after login

**Expected Results:**
- Teacher redirected to /teacher or /teacher/page
- Teacher dashboard displays:
  - Welcome message
  - Teacher-specific navigation options
  - Links to: My Quizzes, My Resources, Discussions, Profile
- Different UI than student dashboard
- Access to teacher-only features

#### 7.2 Teacher - View My Quizzes
**Steps:**
1. Login as teacher
2. Navigate to /teacher/quizzes
3. View quiz management interface

**Expected Results:**
- List of quizzes created by this teacher
- Each quiz shows:
  - Title
  - Subject
  - Difficulty
  - Number of questions
  - Created date
  - Edit and Delete buttons
- "+ Create New Quiz" button at top
- Can filter/search own quizzes

#### 7.3 Teacher - Create New Quiz
**Steps:**
1. Navigate to /teacher/quizzes
2. Click "+ Create New Quiz" button
3. Fill in quiz details:
   - Title: "Calculus Basics Quiz"
   - Subject: "Combined Mathematics"
   - Difficulty: "Medium"
   - Time Limit: 15 minutes
4. Click "Save" or "Next" to add questions

**Expected Results:**
- Quiz creation form validates required fields
- On submission:
  - Quiz record created in Quiz table
  - QuizID generated
  - Teacher proceeds to question addition step
- Success message displayed

#### 7.4 Teacher - Add Questions to Quiz
**Steps:**
1. After creating quiz, or editing existing quiz
2. Click "Add Question" button
3. Fill in question form:
   - Question text: "What is the derivative of x²?"
   - Option 1: "x"
   - Option 2: "2x" (mark as correct)
   - Option 3: "2"
   - Option 4: "x²"
   - Correct answer: Select option 2
4. Save question
5. Repeat for multiple questions

**Expected Results:**
- Question form validates:
  - Question text required
  - At least 2 options required
  - One option marked as correct
- On save:
  - Question record created in Question table
  - QuizID links to current quiz
  - Options stored as array
  - CorrectAnswerIndex saved (0-based or 1-based)
- Can add multiple questions
- Question list updates with each addition

#### 7.5 Teacher - Edit Quiz Question
**Steps:**
1. Navigate to quiz management
2. Select a quiz with existing questions
3. Click "Edit" on a question
4. Modify question text or options
5. Change correct answer
6. Save changes

**Expected Results:**
- Edit form pre-populated with current data
- Changes save to Question table
- Updated question reflects modifications
- Quiz remains functional with updated question

#### 7.6 Teacher - Delete Quiz Question
**Steps:**
1. Open quiz in edit mode
2. Click "Delete" on a question
3. Confirm deletion

**Expected Results:**
- Confirmation dialog appears
- Question deleted from Question table
- Question count decrements
- Quiz remains valid with remaining questions
- Cannot delete if quiz has only one question (validation)

#### 7.7 Teacher - Publish/Unpublish Quiz
**Steps:**
1. Create quiz with questions
2. Look for "Publish" or "Active" toggle
3. Publish quiz

**Expected Results:**
- Published quizzes appear in student quiz listing
- Unpublished quizzes hidden from students
- Teacher can edit unpublished quizzes
- Status indicator shows published/draft state

#### 7.8 Teacher - Delete Entire Quiz
**Steps:**
1. Navigate to teacher quiz list
2. Click "Delete" on a quiz
3. Confirm deletion

**Expected Results:**
- Confirmation warning appears
- On confirmation:
  - Quiz deleted from Quiz table
  - Related questions cascade deleted
  - Any student attempts preserved or deleted (business logic dependent)
- Quiz removed from teacher's list
- Students can no longer access quiz

#### 7.9 Teacher - View Quiz Results/Analytics
**Steps:**
1. Navigate to teacher dashboard
2. Select a quiz that students have taken
3. Click "View Results" or "Analytics"

**Expected Results:**
- Results page shows:
  - Number of students who took quiz
  - Average score
  - Score distribution (histogram/chart)
  - Per-question statistics (% correct)
  - Individual student results
- Teacher can identify difficult questions
- Can export results (optional)

#### 7.10 Teacher - Manage Resources
**Steps:**
1. Navigate to /teacher/resources
2. View uploaded resources
3. Upload new resource
4. Edit or delete existing resource

**Expected Results:**
- Same resource management as described in Section 4.7-4.9
- Teacher can manage own resources
- Cannot delete other teachers' resources (unless admin)

---

### 8. Admin Dashboard and User Management

**Seed:** `tests/seed.spec.ts`

#### 8.1 Admin Login and Dashboard Access
**Steps:**
1. Login with admin credentials
2. Observe redirect and available options

**Expected Results:**
- Admin redirected to /admin or /admin/page
- Admin dashboard displays:
  - Overview statistics (total users, quizzes, discussions, resources)
  - Quick action buttons
  - Navigation to: Users, Quizzes, Discussions, Resources
- Graphs/charts showing platform activity (optional)
- Admin-only features visible

#### 8.2 Admin - View All Users
**Steps:**
1. Navigate to /admin/users
2. View user management interface

**Expected Results:**
- Table/list of all users showing:
  - UserID
  - Name
  - Email
  - Role (Student, Teacher, Admin)
  - Registration date
  - Points
  - Subscription status
  - Action buttons (Edit, Delete, View)
- Search/filter options
- Pagination for large user lists

#### 8.3 Admin - Edit User Details
**Steps:**
1. Navigate to user management
2. Click "Edit" on a user
3. Modify user information:
   - Name
   - Email
   - Role
   - Points
4. Save changes

**Expected Results:**
- Edit form pre-populated
- Changes save to User table
- Can change role (Student ↔ Teacher)
- Cannot directly change password (security)
- Success message confirms update

#### 8.4 Admin - Delete User Account
**Steps:**
1. Navigate to user management
2. Select a user
3. Click "Delete" button
4. Confirm deletion

**Expected Results:**
- Confirmation warning with cascade impact info
- On confirmation:
  - User deleted from User table
  - Related data handled per foreign key constraints:
    - Quizzes: may be preserved or deleted
    - Discussion posts: may be preserved or deleted
    - Resources: may be preserved or deleted
    - Takes, UserAnswers: deleted (cascade)
    - UserBadge: deleted (cascade)
- User cannot login anymore

#### 8.5 Admin - View Platform Statistics
**Steps:**
1. Navigate to /admin/stats or admin dashboard
2. View statistics overview

**Expected Results:**
- Total users count (by role)
- Total quizzes available
- Total resources
- Total discussion topics
- Active users (logged in recently)
- Quiz completion rate
- Popular subjects
- Charts/graphs for visual representation

#### 8.6 Admin - Manage All Quizzes
**Steps:**
1. Navigate to /admin/quizzes
2. View all quizzes from all teachers
3. Edit or delete any quiz

**Expected Results:**
- Admin can see all quizzes regardless of creator
- Can edit quiz details and questions
- Can delete any quiz
- Can publish/unpublish quizzes
- Has full control over quiz management

#### 8.7 Admin - Moderate Discussions
**Steps:**
1. Navigate to /admin/discussions
2. View all discussions
3. Edit or delete inappropriate content

**Expected Results:**
- Admin can see all forums
- Can edit or delete any forum
- Can delete individual comments
- Can manage user reports (if feature exists)
- Can lock/unlock discussions

#### 8.8 Admin - Manage Resources
**Steps:**
1. Navigate to /admin/resources
2. View all uploaded resources
3. Edit or delete any resource

**Expected Results:**
- Admin can see all resources from all users
- Can edit resource metadata
- Can delete inappropriate resources
- Can approve pending resources (if approval workflow exists)

#### 8.9 Admin - Assign/Remove Badges Manually
**Steps:**
1. Navigate to user management
2. Select a user
3. Click "Manage Badges"
4. Assign special badge or remove badge
5. Save changes

**Expected Results:**
- Badge management interface appears
- Can add new UserBadge entry
- Can remove existing badges
- Useful for special achievements or error correction

#### 8.10 Admin - Export Platform Data
**Steps:**
1. Navigate to admin dashboard
2. Click "Export Data" option
3. Select data type (users, quizzes, activity logs)
4. Click "Download"

**Expected Results:**
- Data exported as CSV, Excel, or JSON
- File downloads successfully
- Contains requested data set
- Useful for analytics and reporting

---

### 9. Subject Management

**Seed:** `tests/seed.spec.ts`

#### 9.1 Student - Subject Selection During Registration
**Steps:**
1. Register as student
2. Select 3 subjects from available options
3. Complete registration

**Expected Results:**
- 28+ subjects available in dropdowns
- Student selects exactly 3 subjects
- Subjects include:
  - Science stream: Biology, Physics, Chemistry, Combined Mathematics
  - Technology: ICT, Engineering Technology, Bio Systems Technology
  - Commerce: Economics, Business Studies, Accounting, Business Statistics
  - Arts: History, Geography, Logic, Political Science, Art, Media, Music
  - Languages: English, French, German, Japanese
  - Others: Agriculture, Christianity, Buddhism Civilization
- StudentSubject records created for each selection

#### 9.2 Student - View Subject-Specific Content
**Steps:**
1. Login as student
2. Filter quizzes by one of student's subjects
3. Filter resources by student's subjects
4. Check discussions by subject

**Expected Results:**
- Content filtered relevant to student's subjects
- Personalized content recommendations
- Subject-specific dashboard sections (optional)

#### 9.3 Teacher - Subject Selection During Registration
**Steps:**
1. Register as teacher
2. Select one subject from available options
3. Complete registration

**Expected Results:**
- Teacher can select exactly one subject
- Subject options include all available subjects (same as student subjects)
- TeacherSubject record created for the selected subject
- Teacher can create content only for this assigned subject (business rule)

#### 9.4 Teacher - Create Content for Assigned Subject
**Steps:**
1. Login as teacher with Physics subject
2. Create quiz
3. Subject dropdown should show only Physics (pre-selected)

**Expected Results:**
- Teacher can create content only for their assigned subject
- Subject field is pre-filled with teacher's subject
- Subject dropdown may be disabled or show only the assigned subject
- Validation prevents creating content for other subjects

#### 9.5 Subject Filter - Quiz Listing
**Steps:**
1. Navigate to /quizzes
2. Subject filter dropdown displays all subjects with available quizzes
3. Select "Chemistry"

**Expected Results:**
- Only subjects with quizzes appear in filter (OR all subjects appear)
- Selecting subject filters quiz list
- Subject options dynamically populated from database

#### 9.6 Subject Filter - Resource Listing
**Steps:**
1. Navigate to /resources
2. Subject filter shows subjects with resources
3. Select "ICT"

**Expected Results:**
- Only ICT resources displayed
- Subject filter works same as quiz filter
- Consistent filtering behavior across platform

#### 9.7 Subject Tag Display
**Steps:**
1. View quizzes, resources, and discussions
2. Observe subject tags on each item

**Expected Results:**
- Subject displayed as badge/tag
- Color-coded subjects (optional)
- Consistent subject naming across platform
- Subject names match database Subject table

#### 9.8 Admin - Add New Subject
**Steps:**
1. Login as admin
2. Navigate to subject management (if exists)
3. Add new subject: "Law"
4. Save changes

**Expected Results:**
- New subject added to Subject table
- Subject appears in all relevant dropdowns
- Teachers can now select this subject
- Quizzes/resources can use new subject

#### 9.9 Student - Update Subject Preferences
**Steps:**
1. Login as student
2. Navigate to profile settings
3. Change subject selections
4. Save changes

**Expected Results:**
- Student can update subjects (within constraints)
- StudentSubject records updated
- Content recommendations adjust
- May have limit on frequency of changes

---

### 10. Edge Cases and Error Handling

**Seed:** `tests/seed.spec.ts`

#### 10.1 Expired JWT Token
**Steps:**
1. Login successfully
2. Wait for token to expire (or manually expire token)
3. Attempt to access protected route
4. Observe behavior

**Expected Results:**
- Token validation fails
- User redirected to login page
- Error message: "Session expired. Please login again."
- User must re-authenticate

#### 10.2 Backend Server Down
**Steps:**
1. Stop backend server (docker-compose stop backend)
2. Attempt to login from frontend
3. Observe error handling

**Expected Results:**
- Frontend displays error message
- User-friendly message: "Unable to connect to server. Please try again."
- No application crash
- Retry mechanism or manual retry option

#### 10.3 Database Connection Failure
**Steps:**
1. Stop PostgreSQL database
2. Attempt operations that require database
3. Check backend error logs

**Expected Results:**
- Backend logs database connection error
- API returns 500 or 503 status
- Frontend displays generic error message
- Application doesn't crash
- Connection retry logic attempts reconnection

#### 10.4 Invalid Quiz ID in URL
**Steps:**
1. Navigate to /quizzes/99999/take (non-existent quiz ID)
2. Observe behavior

**Expected Results:**
- 404 error or "Quiz not found" message
- User redirected to /quizzes listing
- No application crash
- Error logged

#### 10.5 Concurrent Quiz Submission
**Steps:**
1. Open same quiz in two browser tabs
2. Submit quiz in both tabs simultaneously
3. Check database for duplicate entries

**Expected Results:**
- Database constraints prevent duplicate submissions
- One submission succeeds, other returns error
- User notified of already submitted quiz
- Takes table has unique constraint or handles duplicates

#### 10.6 File Upload - Invalid File Type
**Steps:**
1. Login as teacher
2. Attempt to upload resource with .exe file
3. Submit form

**Expected Results:**
- File type validation rejects invalid files
- Error message: "Only PDF, DOC, DOCX files allowed"
- Upload doesn't proceed
- No malicious file stored on server

#### 10.7 File Upload - Oversized File
**Steps:**
1. Attempt to upload file larger than size limit (e.g., 50MB)
2. Submit form

**Expected Results:**
- File size validation catches oversized file
- Error message: "File size exceeds maximum limit of 50MB"
- Upload cancelled before transfer
- Server doesn't receive oversized file

#### 10.8 SQL Injection Attempt
**Steps:**
1. In login form, enter email: `admin' OR '1'='1`
2. Enter any password
3. Submit login

**Expected Results:**
- Parameterized queries prevent SQL injection
- Login fails as expected
- No unauthorized access granted
- Security log captures attempt (optional)

#### 10.9 XSS Attempt in Discussion
**Steps:**
1. Create discussion or comment
2. Include script tag: `<script>alert('XSS')</script>`
3. Submit and view discussion

**Expected Results:**
- Input sanitization removes or escapes script tags
- Script doesn't execute
- Text displayed as plain text or sanitized HTML
- No XSS vulnerability

#### 10.10 Rapid API Requests (Rate Limiting)
**Steps:**
1. Write script to send 100 requests per second to login endpoint
2. Execute script
3. Observe server response

**Expected Results:**
- Rate limiting middleware throttles excessive requests
- Returns 429 Too Many Requests status after threshold
- Legitimate requests not affected
- Protection against DDoS and brute force attacks

#### 10.11 Missing Environment Variables
**Steps:**
1. Remove JWT_SECRET from backend .env
2. Restart backend server
3. Attempt operations requiring JWT

**Expected Results:**
- Backend logs error about missing JWT_SECRET
- Application fails to start OR critical operations fail
- Clear error message in logs
- Prevents security vulnerability from missing secret

#### 10.12 Pagination - Empty Results
**Steps:**
1. Navigate to /quizzes
2. Apply filters that return no results
3. Observe UI

**Expected Results:**
- Empty state message displayed
- "No quizzes found matching your criteria"
- Suggestion to clear filters
- No error or blank screen

#### 10.13 Network Timeout
**Steps:**
1. Simulate slow network (browser dev tools)
2. Submit quiz or form
3. Wait for timeout

**Expected Results:**
- Loading indicator shows during request
- After timeout (e.g., 30 seconds):
  - Error message: "Request timeout. Please try again."
  - User can retry operation
- No data corruption
- User data preserved if possible

#### 10.14 Browser Back Button During Quiz
**Steps:**
1. Start taking a quiz
2. Answer first question
3. Click browser back button
4. Observe behavior

**Expected Results:**
- User navigated away from quiz
- Quiz progress may be lost OR
- Warning message: "Quiz in progress. Are you sure you want to leave?"
- Can return to quiz and resume (depending on implementation)

#### 10.15 Multiple Login Sessions
**Steps:**
1. Login on Browser A
2. Login with same account on Browser B
3. Perform actions in both browsers
4. Observe token and session handling

**Expected Results:**
- Both sessions work simultaneously OR
- Second login invalidates first session (single session policy)
- Clear business logic for session management
- No data corruption from concurrent sessions

---

## Test Execution Guidelines

### Prerequisites for Testing
1. Backend server running on http://localhost:8080
2. Frontend server running on http://localhost:3000
3. PostgreSQL database running with examindDB schema loaded
4. Test data populated (users, quizzes, resources, discussions)

### Test Data Requirements
- **Users**: 
  - At least 3 students with different activity levels
  - At least 2 teachers with content
  - 1 admin account
- **Quizzes**: 
  - Minimum 5 quizzes across different subjects and difficulties
  - Each quiz should have 3-5 questions
- **Resources**: 
  - Minimum 5 resources of different types
- **Discussions**: 
  - At least 2 active discussions with comments
- **Subjects**: 
  - All 28+ subjects in database

### Test Environment Setup
1. Clean database state for each major test suite
2. Use seed scripts to populate test data
3. Clear localStorage between authentication tests
4. Use test accounts (don't test on production)

### Success Criteria
- All critical paths (auth, quiz taking, content creation) work correctly
- No security vulnerabilities found
- UI responsive and user-friendly
- Error messages clear and helpful
- Performance acceptable (page load < 3s)
- Data integrity maintained across operations

### Regression Testing
- Re-run full test suite after each major code change
- Automate tests using Playwright where possible
- Track test coverage metrics
- Document any bugs found with reproducible steps

---

## API Endpoint Testing (Backend)

### Authentication Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login

### User Endpoints
- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (Admin only)

### Quiz Endpoints
- `GET /api/v1/quizzes` - Get all quizzes
- `GET /api/v1/quizzes/:id` - Get quiz with questions
- `POST /api/v1/quizzes` - Create quiz (Teacher/Admin)
- `PUT /api/v1/quizzes/:id` - Update quiz (Teacher/Admin)
- `DELETE /api/v1/quizzes/:id` - Delete quiz (Teacher/Admin)
- `POST /api/v1/quizzes/:quizId/questions` - Add question (Teacher/Admin)
- `PUT /api/v1/quizzes/:quizId/questions/:questionId` - Update question
- `DELETE /api/v1/quizzes/:quizId/questions/:questionId` - Delete question
- `POST /api/v1/quizzes/:quizId/submit` - Submit quiz answers
- `GET /api/v1/quizzes/:quizId/result` - Get quiz result

### Resource Endpoints
- `GET /api/v1/resources` - Get all resources
- `GET /api/v1/resources/:id` - Get resource by ID
- `POST /api/v1/resources` - Create resource (Teacher/Admin)
- `PUT /api/v1/resources/:id` - Update resource (Teacher/Admin)
- `DELETE /api/v1/resources/:id` - Delete resource (Teacher/Admin)

### Discussion Endpoints
- `GET /api/v1/discussions` - Get all forums
- `GET /api/v1/discussions/:forumId` - Get forum by ID
- `POST /api/v1/discussions` - Create forum
- `PUT /api/v1/discussions/:forumId` - Update forum (Teacher/Admin)
- `DELETE /api/v1/discussions/:forumId` - Delete forum (Teacher/Admin)
- `GET /api/v1/discussions/:forumId/comments` - Get forum comments
- `POST /api/v1/discussions/:forumId/comments` - Create comment
- `POST /api/v1/discussions/:commentId/upvote` - Upvote comment

### Badge Endpoints
- `POST /api/v1/badges/check/:userId` - Check and award badges

### Stats Endpoints
- `GET /api/v1/stats` - Get platform statistics (Admin only)

---

## Notes for QA Team

1. **Browser Compatibility**: Test on Chrome, Firefox, Safari, Edge
2. **Responsive Design**: Test on desktop, tablet, mobile viewports
3. **Accessibility**: Verify keyboard navigation, screen reader compatibility
4. **Performance**: Monitor API response times, page load speeds
5. **Security**: Verify authentication, authorization, input validation
6. **Data Integrity**: Ensure database transactions maintain consistency
7. **Concurrent Users**: Test with multiple users simultaneously
8. **Error Recovery**: Test how system handles and recovers from errors

---

## Bug Reporting Template

**Bug ID**: [Auto-generated]
**Title**: [Brief description]
**Severity**: Critical / High / Medium / Low
**Component**: Frontend / Backend / Database / API
**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Result**: [What should happen]
**Actual Result**: [What actually happens]
**Screenshots**: [Attach if applicable]
**Environment**: [Browser, OS, URLs]
**Console Errors**: [Browser console or server logs]
**Additional Notes**: [Any other relevant information]

---

**Test Plan Version**: 1.0
**Last Updated**: October 22, 2025
**Created By**: QA Test Planning Agent
**Platform**: Examind Learning Management System
