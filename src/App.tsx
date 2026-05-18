import { Toaster }
  from "@/components/ui/toaster";

import { Toaster as Sonner }
  from "@/components/ui/sonner";

import { TooltipProvider }
  from "@/components/ui/tooltip";

import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import { AuthProvider }
  from "@/contexts/AuthContext";

import { ProtectedRoute }
  from "@/components/layout/ProtectedRoute";


// PAGES
import Index
  from "./pages/Index";

import NotFound
  from "./pages/NotFound";

import Register
  from "./pages/Register";

import { LoginForm }
  from "@/components/auth/LoginForm";

import ForgotPassword from "@/pages/ForgotPassword";
import VerifyOtp from "@/pages/VerifyOtp";
import ResetPassword from "@/pages/ResetPassword";


// STUDENT
import { StudentDashboard }
  from "@/pages/student/StudentDashboard";

import JobsPage
  from "@/pages/student/JobsPage";

import MentorshipPage
  from "@/pages/student/MentorshipPage";
import AIChatPage
  from "./pages/student/AIChatPage";
import ChatPage
  from "@/pages/student/ChatPage";

import EventsPage
  from "@/pages/student/EventsPage";

import { AlumniDirectory }
  from "@/pages/student/AlumniDirectory";

import SearchUsersPage
  from "@/pages/student/SearchUsersPage";

import GuidanceRequestPage
  from "@/pages/student/GuidanceRequestPage";

// NEW
import RecommendationsPage
  from "@/pages/student/RecommendationsPage";


// ALUMNI
import { AlumniDashboard }
  from "@/pages/alumni/AlumniDashboard";

import AlumniChatPage
  from "@/pages/alumni/AlumniChatPage";

import { FundraisingHub }
  from "@/pages/alumni/FundraisingHub";

import { StudentsDirectory }
  from "@/pages/alumni/StudentsDirectory";

import GuidanceRequestsPage
  from "@/pages/alumni/GuidanceRequestsPage";
import PostJobPage from "@/pages/alumni/PostJobPage";
import CreateEventPage from "@/pages/alumni/CreateEventPage";
import AlumniMentorshipPage from "@/pages/alumni/AlumniMentorshipPage";
import ApplicationsPage from "@/pages/alumni/ApplicationsPage";


// ADMIN
import { AdminDashboard }
  from "@/pages/admin/AdminDashboard";

import { StudentsDirectory as AdminStudentsDirectory }
  from "@/pages/admin/StudentsDirectory";

import { AnalyticsPage }
  from "@/pages/admin/AnalyticsPage";
import AdminApprovals from "@/pages/admin/AdminApprovals";
import LeaderboardPage from "@/pages/admin/LeaderboardPage";

import ChangePassword from "@/pages/ChangePassword";


// COMMON
import { PremiumUpgrade }
  from "@/pages/PremiumUpgrade";

import { ComingSoon }
  from "@/pages/ComingSoon";
import About from "@/pages/About";

import { ProfileEdit }
  from "@/pages/ProfileEdit";

import NotificationsPage
  from "@/pages/NotificationsPage";


// QUERY CLIENT
const queryClient =
  new QueryClient();


// APP
const App = () => (

  <QueryClientProvider client={queryClient}>

    <AuthProvider>

      <TooltipProvider>

        <Toaster />

        <Sonner />

        <BrowserRouter>

          <Routes>

            {/* ========================= */}
            {/* PUBLIC ROUTES */}
            {/* ========================= */}

            <Route
              path="/"
              element={<Index />}
            />

            <Route
              path="/login"
              element={<LoginForm />}
            />

            <Route
              path="/register"
              element={<Register />}
            />
            <Route
              path="/forgot-password"
              element={<ForgotPassword />}
            />

            <Route
              path="/verify-otp"
              element={<VerifyOtp />}
            />

            <Route
              path="/reset-password"
              element={<ResetPassword />}
            />

            <Route
              path="/change-password"
              element={<ChangePassword />}
            />

            {/* ========================= */}
            {/* STUDENT ROUTES */}
            {/* ========================= */}

            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "student"
                  ]}
                >
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/alumni-directory"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "student"
                  ]}
                >
                  <AlumniDirectory />
                </ProtectedRoute>
              }
            />

            {/* SEARCH USERS */}
            <Route
              path="/student/search"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "student"
                  ]}
                >
                  <SearchUsersPage />
                </ProtectedRoute>
              }
            />

            {/* GUIDANCE REQUEST */}
            <Route
              path="/student/guidance/:alumniId"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "student"
                  ]}
                >
                  <GuidanceRequestPage />
                </ProtectedRoute>
              }
            />

            {/* AI RECOMMENDATIONS */}
            <Route
              path="/student/recommendations"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "student"
                  ]}
                >
                  <RecommendationsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/ai-chat"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "student"
                  ]}
                >
                  <AIChatPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/jobs"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "student"
                  ]}
                >
                  <JobsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/mentorship"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "student"
                  ]}
                >
                  <MentorshipPage />
                </ProtectedRoute>
              }
            />

            {/* DYNAMIC CHAT ROUTE */}
            <Route
              path="/student/chat/:userId"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "student"
                  ]}
                >
                  <ChatPage />
                </ProtectedRoute>
              }
            />

            {/* CHAT HOME */}
            <Route
              path="/student/chat"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "student"
                  ]}
                >
                  <ChatPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/events"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "student"
                  ]}
                >
                  <EventsPage />
                </ProtectedRoute>
              }
            />


            {/* ========================= */}
            {/* ALUMNI ROUTES */}
            {/* ========================= */}

            <Route
              path="/alumni/dashboard"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "alumni"
                  ]}
                >
                  <AlumniDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/alumni/fundraising"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "alumni"
                  ]}
                >
                  <FundraisingHub />
                </ProtectedRoute>
              }
            />

            <Route
              path="/alumni/students-directory"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "alumni"
                  ]}
                >
                  <StudentsDirectory />
                </ProtectedRoute>
              }
            />

            <Route
              path="/alumni/post-job"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "alumni"
                  ]}
                >
                  <PostJobPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/alumni/create-event"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "alumni"
                  ]}
                >
                  <CreateEventPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/alumni/mentorship"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "alumni"
                  ]}
                >
                  <AlumniMentorshipPage />
                </ProtectedRoute>
              }
            />

            {/* GUIDANCE REQUESTS */}
            <Route
              path="/alumni/guidance-requests"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "alumni"
                  ]}
                >
                  <GuidanceRequestsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/alumni/applications"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "alumni"
                  ]}
                >
                  <ApplicationsPage />
                </ProtectedRoute>
              }
            />

            {/* DYNAMIC CHAT ROUTE */}
            <Route
              path="/alumni/chat/:userId"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "alumni"
                  ]}
                >
                  <AlumniChatPage />
                </ProtectedRoute>
              }
            />

            {/* CHAT HOME */}
            <Route
              path="/alumni/chat"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "alumni"
                  ]}
                >
                  <AlumniChatPage />
                </ProtectedRoute>
              }
            />


            {/* ========================= */}
            {/* ADMIN ROUTES */}
            {/* ========================= */}

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "admin"
                  ]}
                >
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "admin"
                  ]}
                >
                  <AdminStudentsDirectory />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/approvals"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "admin"
                  ]}
                >
                  <AdminApprovals />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "admin"
                  ]}
                >
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/notifications"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "admin"
                  ]}
                >
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/leaderboard"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "admin"
                  ]}
                >
                  <LeaderboardPage />
                </ProtectedRoute>
              }
            />


            {/* ========================= */}
            {/* NOTIFICATIONS */}
            {/* ========================= */}

            <Route
              path="/notifications"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "student",
                    "alumni",
                    "admin",
                  ]}
                >
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />


            {/* ========================= */}
            {/* PROFILE */}
            {/* ========================= */}

            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "student",
                    "alumni",
                    "admin",
                  ]}
                >
                  <ProfileEdit />
                </ProtectedRoute>
              }
            />


            {/* ========================= */}
            {/* OTHER ROUTES */}
            {/* ========================= */}

            <Route
              path="/premium"
              element={
                <PremiumUpgrade />
              }
            />

            <Route
              path="/about"
              element={
                <About />
              }
            />


            {/* ========================= */}
            {/* 404 */}
            {/* ========================= */}

            <Route
              path="*"
              element={<NotFound />}
            />

          </Routes>

        </BrowserRouter>

      </TooltipProvider>

    </AuthProvider>

  </QueryClientProvider>

);

export default App;