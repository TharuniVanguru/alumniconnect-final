// ==========================================
// USER ROLE
// ==========================================
export type UserRole =
  | "admin"
  | "alumni"
  | "student"
  | "faculty";


// ==========================================
// COMMON STATUS TYPES
// ==========================================
export type RequestStatus =
  | "Pending"
  | "Accepted"
  | "Rejected"
  | "Scheduled"
  | "Completed"
  | "Cancelled";

export type MessageStatus =
  | "sent"
  | "delivered"
  | "seen";

export type NotificationPriority =
  | "low"
  | "medium"
  | "high";


// ==========================================
// USER
// ==========================================
export interface User {

  _id: string;

  identifier: string;

  name: string;

  email: string;

  role: UserRole;

  phone?: string;

  profileImage?: string;

  token?: string;

  isActive?: boolean;

  isVerified?: boolean;

  isOnline?: boolean;

  isFirstLogin?: boolean;

  branch?: string;

  batch?: string;

  year?: string;

  collegeName?: string;

  domain?: string;

  company?: string;

  companyName?: string;

  jobRole?: string;

  bio?: string;

  skills?: string[];

  interests?: string[];

  linkedinUrl?: string;

  githubUrl?: string;

  portfolioUrl?: string;

  trustScore?: number;

  profileStrength?: string;

  mentorshipAvailable?: boolean;

  mentorshipCount?: number;

  averageRating?: number;

  aiScore?: number;

  experience?: string;

  profileCompleted?: boolean;

  resumePath?: string;

  resumeFileName?: string;

  resumeSummary?: string;

  lastResumeUpload?: string;

  createdAt?: string;

  updatedAt?: string;

}


// ==========================================
// PROJECT
// ==========================================
export interface Project {

  _id?: string;

  title: string;

  description: string;

  techStack: string[];

  githubUrl?: string;

  projectUrl?: string;

}


// ==========================================
// CERTIFICATE
// ==========================================
export interface Certificate {

  _id?: string;

  title: string;

  issuer: string;

  certificateUrl?: string;

}


// ==========================================
// PROFILE
// ==========================================
export interface Profile {

  _id?: string;

  user: string;

  name: string;

  email: string;

  role: UserRole;

  identifier?: string;

  phone?: string;

  profileImage?: string;

  branch?: string;

  year?: string;

  batch?: string;

  cgpa?: string;

  domain?: string;

  skills?: string[];

  interests?: string[];

  linkedinUrl?: string;

  githubUrl?: string;

  portfolioUrl?: string;

  bio?: string;

  resumeUrl?: string;

  projects?: Project[];

  certificates?: Certificate[];

  company?: string;

  companyName?: string;

  jobRole?: string;

  experience?: string;

  mentorshipAvailable?: boolean;

  mentorshipCount?: number;

  canPostJobs?: boolean;

  profileCompleted?: boolean;

  profileCompletion?: number;

  profileStrength?:
    | "Beginner"
    | "Intermediate"
    | "Strong"
    | "Excellent";

  trustScore?: number;

  averageRating?: number;

  totalRatings?: number;

  isVerified?: boolean;

  isOnline?: boolean;

  lastActive?: string;

  lastProfileUpdate?: string;

  createdAt?: string;

  updatedAt?: string;

}


// ==========================================
// JOB
// ==========================================
export interface Job {

  _id: string;

  title: string;

  company: string;

  location: string;

  type:
    | "Internship"
    | "Full-time"
    | "Part-time"
    | "Remote";

  description: string;

  skillsRequired: string[];

  salary?: string;

  deadline?: string;

  postedBy: string;

  applications?: JobApplication[];

  isActive?: boolean;

  createdAt?: string;

  updatedAt?: string;

}


// ==========================================
// JOB APPLICATION
// ==========================================
export interface JobApplication {

  _id?: string;

  student: string;

  resumeUrl?: string;

  status?:
    | "Applied"
    | "Shortlisted"
    | "Rejected"
    | "Selected";

  appliedAt?: string;

}


// ==========================================
// EVENT
// ==========================================
export interface Event {

  _id: string;

  title: string;

  description: string;

  type:
    | "Workshop"
    | "Webinar"
    | "Networking"
    | "Hackathon"
    | "Mentorship"
    | "Seminar"
    | "Placement Drive";

  status?:
    | "Upcoming"
    | "Ongoing"
    | "Completed"
    | "Cancelled";

  date: string;

  time?: string;

  location?: string;

  mode?:
    | "Online"
    | "Offline"
    | "Hybrid";

  meetingLink?: string;

  bannerImage?: string;

  organizer?: string;

  attendees?: string[];

  tags?: string[];

  totalRegistrations?: number;

  createdAt?: string;

  updatedAt?: string;

}


// ==========================================
// MESSAGE
// ==========================================
export interface Message {

  _id?: string;

  sender?: User | string;

  receiver?: User | string;

  senderId?: string;

  receiverId?: string;

  senderName?: string;

  receiverName?: string;

  message: string;

  status?: MessageStatus;

  messageType?:
    | "text"
    | "image"
    | "file"
    | "audio"
    | "video";

  attachment?: string;

  isRead?: boolean;

  delivered?: boolean;

  seenAt?: string;

  createdAt?: string;

  updatedAt?: string;

}


// ==========================================
// CHAT USER
// ==========================================
export interface ChatUser {

  _id: string;

  name: string;

  email: string;

  role: UserRole;

  profileImage?: string;

  isOnline?: boolean;

}


// ==========================================
// MENTORSHIP REQUEST
// ==========================================
export interface MentorshipRequest {

  _id?: string;

  studentId?: string;

  student?: string;

  alumniId?: string;

  alumni?: string;

  alumniName?: string;

  studentName?: string;

  domain?: string;

  message?: string;

  mentorshipType?: string;

  status?: RequestStatus;

  meetingLink?: string;

  scheduledDate?: string;

  duration?: number;

  mentorNotes?: string;

  studentNotes?: string;

  feedback?: string;

  rating?: number;

  cancellationReason?: string;

  createdAt?: string;

  updatedAt?: string;

}


// ==========================================
// GUIDANCE REQUEST
// ==========================================
export interface GuidanceRequest {

  _id?: string;

  studentId?: string;

  alumniId?: string;

  alumniName?: string;

  studentName?: string;

  domain: string;

  topic: string;

  description: string;

  urgency:
    | "Low"
    | "Medium"
    | "High";

  category?: string;

  status?: RequestStatus;

  meetingLink?: string;

  scheduledDate?: string;

  feedback?: string;

  mentorNotes?: string;

  sessionNotes?: string;

  rating?: number;

  completedAt?: string;

  createdAt?: string;

  updatedAt?: string;

}


// ==========================================
// NOTIFICATION
// ==========================================
export interface Notification {

  _id: string;

  recipient: string;

  sender?: string;

  title: string;

  message: string;

  type:
    | "message"
    | "guidance"
    | "mentorship"
    | "job"
    | "event"
    | "system"
    | "warning"
    | "reminder";

  priority?: NotificationPriority;

  isRead?: boolean;

  relatedId?: string;

  createdAt?: string;

  updatedAt?: string;

}


// ==========================================
// AI CHAT MESSAGE
// ==========================================
export interface AIChatMessage {

  role:
    | "user"
    | "assistant";

  content: string;

}


// ==========================================
// RECOMMENDATION
// ==========================================
export interface Recommendation {

  _id?: string;

  name?: string;

  email?: string;

  domain?: string;

  company?: string;

  jobRole?: string;

  bio?: string;

  linkedinUrl?: string;

  githubUrl?: string;

  profileStrength?: string;

  trustScore?: number;

  mentorshipAvailable?: boolean;

  matchedSkills?: string[];

  aiScore: number;

  mentorLevel?: string;

  profileCompletion?: number;

  reasons?: string[];

  smartTags?: string[];

}