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


// STUDENT
import { StudentDashboard }
  from "@/pages/student/StudentDashboard";

import JobsPage
  from "@/pages/student/JobsPage";

import MentorshipPage
  from "@/pages/student/MentorshipPage";

import ChatPage
  from "@/pages/student/ChatPage";

import { AlumniDirectory }
  from "@/pages/student/AlumniDirectory";


// ALUMNI
import { AlumniDashboard }
  from "@/pages/alumni/AlumniDashboard";

import AlumniChatPage
  from "@/pages/alumni/AlumniChatPage";

import { FundraisingHub }
  from "@/pages/alumni/FundraisingHub";

import { StudentsDirectory }
  from "@/pages/alumni/StudentsDirectory";


// ADMIN
import { AdminDashboard }
  from "@/pages/admin/AdminDashboard";

import { StudentsDirectory as AdminStudentsDirectory }
  from "@/pages/admin/StudentsDirectory";

import { AnalyticsPage }
  from "@/pages/admin/AnalyticsPage";


// COMMON
import { PremiumUpgrade }
  from "@/pages/PremiumUpgrade";

import { ComingSoon }
  from "@/pages/ComingSoon";

import { ProfileEdit }
  from "@/pages/ProfileEdit";


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

            <Route
              path="/student/events"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "student"
                  ]}
                >
                  <ComingSoon
                    pageName="Events"
                  />
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
                  <ComingSoon
                    pageName="Post Job"
                  />
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
                  <ComingSoon
                    pageName="Create Event"
                  />
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
                  <ComingSoon
                    pageName="Mentorship"
                  />
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
                  <ComingSoon
                    pageName="Applications"
                  />
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
                  <ComingSoon
                    pageName="Approvals"
                  />
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
                  <ComingSoon
                    pageName="Notifications"
                  />
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
                  <ComingSoon
                    pageName="Leaderboard"
                  />
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
                <ComingSoon
                  pageName="About Us"
                />
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