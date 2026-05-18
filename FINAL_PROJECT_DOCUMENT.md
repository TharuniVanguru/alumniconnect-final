# AlumniConnect: Intelligent Alumni–Student Engagement Ecosystem for Mentorship, Peer Collaboration, Networking & Career Support

## 1) Project Overview
AlumniConnect is a college-only platform that connects:
- Students (current)
- Alumni (passed out)
- Faculty (moderator/admin)

### Purpose
- Help students get career guidance and mentorship
- Make alumni engagement structured
- Allow peer interaction based on domain/skills
- Prevent fake profiles using dataset-based login
- Provide intelligent features like domain-based recommendations and chatbot support
- Remind users every 3 months to update skills/interests

## 2) Objectives
- Centralize student, alumni, and faculty information into one platform
- Enable alumni-student mentorship
- Enable peer-to-peer connections
- Implement strong search and filter functionality
- Provide domain-based recommendations
- Provide chatbot support
- Prevent fake profiles using dataset verification and trust score
- Provide secure password reset with masked email/phone OTP
- Ensure profile freshness via quarterly reminders

## 3) Roles & Permissions (RBAC)

### Student
- Login
- Update profile (skills + interest domain)
- Search and filter people
- Connect with peers
- Send mentorship requests
- Raise doubts/guidance requests
- Use chatbot

### Alumni
- Login
- Update profile (company/job role/domain)
- Accept/reject mentorship requests
- View suggested students in their domain
- Respond to doubts
- Use chatbot

### Faculty
- Login
- View profiles
- Moderate posts
- Verify/block profiles (optional)
- Manage events/webinars (optional)

### Admin (optional — can be faculty account)
- Upload Excel dataset
- Create accounts
- Block suspicious accounts
- Delete reported content
- View analytics dashboard

## 4) Key Concept: Dataset-Based Access
No open signup.

Admin uploads an Excel dataset containing:
- identifier (rollNo/alumniId/facultyId)
- name
- email
- phone
- branch
- year/batch
- defaultPassword
- role

Accounts get created automatically.

## 5) Features & Modules (Complete)

### MODULE A: Authentication System
#### Login
- Identifier + Password
- Backend verifies hash
- Generates JWT token

#### First Login Password Change
- `isFirstLogin=true`
- Force password change
- Update DB hash
- Set `isFirstLogin=false`

#### Forgot Password (Masked Email/Phone + OTP)
Workflow:
1. Enter rollNo/ID
2. Display masked email/phone
   - Email: `bjdjn********@gmail.com`
   - Phone: `98******10`
3. Send OTP (email/SMS)
4. Verify OTP → reset password

If dataset email/phone missing:
- Show admin contact email/support form

### MODULE B: Profile Management
User must complete profile after login.

#### Student profile
- name
- rollNo
- branch
- year
- interested domain
- skills tags
- interests tags
- LinkedIn URL
- GitHub URL (optional)
- projects list
- bio/about

#### Alumni profile
- name
- passout year
- branch
- company
- job role
- domain expertise
- skills tags
- mentorship availability (Available/Busy)
- LinkedIn URL
- experience summary
- upload LinkedIn PDF/resume (optional)

### MODULE C: Search & Profile View
Global search:
- name search
- rollNo search
- skill keyword search

Search results show:
- profile card
- domain + branch + year/batch
- LinkedIn button

Click profile → full details.

### MODULE D: Filter System
Filter dropdowns:
- Domain
- Branch
- Student year
- Alumni batch
- Skills
- Company (optional)

### MODULE E: Connections & Mentorship
- Student → Alumni mentorship request
- Student → Student peer connect request
- Alumni/Peer can accept or reject

### MODULE F: Guidance Requests (Raise Doubts)
#### Student
- Raise doubt (domain/topic/description/urgency)

#### Alumni
- See domain-related doubts
- Can accept/ignore
- Once accepted → student and alumni interaction starts

### MODULE G: Recommendation System (Domain-based)
Student chooses domain → recommended list:
- Top alumni mentors
- Top student peers

Scoring logic
- domain match: +50
- skill overlap: +10 each
- verified profile: +10
- profile completeness: +10
- alumni experience/company: +10

Sort by score → show top profiles.

### MODULE H: Chatbot
Chatbot supports:
- Website guidance ("how to reset password?")
- Platform doubts ("how to request mentorship?")
- Career roadmap guidance

Implementation:
- OpenAI / Gemini API

### MODULE I: Fake Profile Prevention
Main:
- dataset-based login

Extra:
- trust score (0–100)
- spam detection
- admin block

Trust score sample:
- dataset verified: +40
- profile completion: +30
- LinkedIn URL: +20
- spam behavior: -20

### MODULE J: Quarterly Profile Update Reminder
Store:
- `lastProfileUpdate`

If > 90 days:
- popup reminder
- notification bell alert

### MODULE K: Notifications
Notification bell:
- mentorship request received
- mentorship accepted
- doubt accepted/answered
- quarterly reminder
- admin messages

### MODULE L (Optional): LinkedIn PDF Upload + Summary
Since LinkedIn scraping is not allowed:
- Alumni uploads LinkedIn PDF/resume
- System extracts text
- Generates domain summary
- Store in profile
- Show students “what they did in this domain”

## 6) Tools & Technologies Used

### Frontend (Website UI)
- Languages: HTML, CSS, JavaScript
- Framework: React.js
- Styling: Tailwind CSS
- Tools: Axios (API calls), React Router DOM (routing/navigation)

### Backend (Server + APIs)
- Language: Node.js (JavaScript)
- Framework: Express.js
- Security: JWT (session token), bcrypt (password hashing)
- Uploads: Multer (LinkedIn PDF / resume uploads)
- OTP: Nodemailer (email OTP)
- Database: MongoDB Atlas, MongoDB Compass
- AI: OpenAI API / Gemini API (chatbot)
- Domain recommendation logic (scoring)

### Optional advanced
- Python + FastAPI
- sentence-transformers embeddings

### Development Tools
- VS Code
- Postman
- Git & GitHub
- Figma (optional UI wireframe tool)

### Deployment
- Vercel (frontend)
- Render/Railway (backend)
- MongoDB Atlas (DB)

## 7) Database Schema (Collections)

### users
- `_id`
- identifier
- role
- passwordHash
- email
- phone
- isFirstLogin
- isActive
- createdAt

### profiles
- userId
- name
- branch
- year/batch
- domain
- skills[]
- interests[]
- linkedinUrl
- githubUrl
- company/jobRole
- projects[]
- bio
- profileCompleted
- lastProfileUpdate
- trustScore
- isVerified

### mentorshipRequests
- studentId
- alumniId
- status
- createdAt

### connections
- fromUserId
- toUserId
- status
- createdAt

### guidanceRequests
- studentId
- domain
- topic
- description
- urgency
- status
- assignedAlumniId
- createdAt

### notifications
- userId
- title
- message
- type
- isRead
- createdAt

### otpRequests
- identifier
- otp
- expiresAt
- attempts

## 8) API Endpoints (Complete)

### Auth
- POST `/auth/login`
- POST `/auth/change-password`
- POST `/auth/forgot-password`
- POST `/auth/verify-otp`
- POST `/auth/reset-password`

### Admin
- POST `/admin/upload-excel`
- GET `/admin/users`
- POST `/admin/block-user`

### Profile
- GET `/profile/me`
- PUT `/profile/update`
- GET `/profile/:id`

### Search/Filter
- GET `/users/search?q=`
- GET `/users/filter?domain=&branch=&year=&batch=&skill=`

### Mentorship
- POST `/mentorship/request`
- POST `/mentorship/respond`

### Guidance (Doubts)
- POST `/guidance/create`
- POST `/guidance/respond`

### AI
- POST `/ai/recommend`
- POST `/ai/chat`

## 9) UI Pages (Final List)
- Login
- Forgot password
- OTP verify
- Reset password
- Dashboard (Student/Alumni/Faculty)
- Profile view/edit
- Search users
- Filter page
- Recommendations page
- Raise doubt page
- Alumni suggestion dashboard
- Mentorship requests page
- Notifications page
- Admin dataset upload page
- Chatbot widget

## 10) Folder Structure

### Root
- `alumniconnect/`
  - `frontend/`
  - `backend/`
  - `ai-service/` (optional)
  - `docs/`

### Frontend
- `frontend/src/`
  - `pages/`
  - `components/`
  - `api/`

### Backend
- `backend/src/`
  - `routes/`
  - `controllers/`
  - `models/`
  - `middleware/`
  - `utils/`

## 11) Team Work Division (3 Members)
- Member 1: Frontend
  - UI screens, dashboards, chatbot widget
- Member 2: Backend
  - DB models, APIs, auth, excel upload, OTP
- Member 3: AI
  - recommendation logic, chatbot integration, trust score, reminders

## 12) Development Timeline (20 Days)
- Day 1–3: UI + DB schema
- Day 4–6: Excel import + login/JWT
- Day 7–9: profile completion + search/filter
- Day 10–12: mentorship + peer connect
- Day 13–15: guidance requests + notifications
- Day 16–18: chatbot + recommendation
- Day 19–20: testing + PPT + report

## 13) Final Demo Flow (Best)
1. Admin uploads dataset
2. Student login first time → change password
3. Profile update
4. Search alumni by name
5. Filter by domain
6. Recommendations show top mentors
7. Student raises doubt
8. Alumni accepts and guides
9. Forgot password → masked email + OTP
10. Quarterly update reminder popup
