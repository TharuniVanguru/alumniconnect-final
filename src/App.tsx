import { Toaster }
  from "@/components/ui/toaster";

import { Toaster as Sonner }
  from "@/components/ui/sonner";

import { TooltipProvider }
  from "@/components/ui/tooltip";

import {

  QueryClient,

  QueryClientProvider,

} from "@tanstack/react-query";

import {

  BrowserRouter,

  Routes,

  Route,

} from "react-router-dom";


// ==========================================
// AUTH
// ==========================================
import { AuthProvider }
  from "@/contexts/AuthContext";

import { ProtectedRoute }
  from "@/components/layout/ProtectedRoute";

import { PublicRoute }
  from "@/components/auth/PublicRoute";


// ==========================================
// SOCKET
// ==========================================
import useSocket
  from "@/hooks/useSocket";


// ==========================================
// PUBLIC PAGES
// ==========================================
import Index
  from "./pages/Index";

import NotFound
  from "./pages/NotFound";

import Register
  from "./pages/Register";

import { LoginForm }
  from "@/components/auth/LoginForm";

import ForgotPassword
  from "@/pages/ForgotPassword";

import VerifyOtp
  from "@/pages/VerifyOtp";

import ResetPassword
  from "@/pages/ResetPassword";

import ChangePassword
  from "@/pages/ChangePassword";

import About
  from "@/pages/About";

import { PremiumUpgrade }
  from "@/pages/PremiumUpgrade";


// ==========================================
// STUDENT PAGES
// ==========================================
import {

  StudentDashboard,

} from "@/pages/student/StudentDashboard";

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

import {

  AlumniDirectory,

} from "@/pages/student/AlumniDirectory";

import SearchUsersPage
  from "@/pages/student/SearchUsersPage";

import GuidanceRequestPage
  from "@/pages/student/GuidanceRequestPage";

import RecommendationsPage
  from "@/pages/student/RecommendationsPage";


// ==========================================
// ALUMNI PAGES
// ==========================================
import {

  AlumniDashboard,

} from "@/pages/alumni/AlumniDashboard";

import AlumniChatPage
  from "@/pages/alumni/AlumniChatPage";

import {

  FundraisingHub,

} from "@/pages/alumni/FundraisingHub";

import {

  StudentsDirectory,

} from "@/pages/alumni/StudentsDirectory";

import GuidanceRequestsPage
  from "@/pages/alumni/GuidanceRequestsPage";

import PostJobPage
  from "@/pages/alumni/PostJobPage";

import CreateEventPage
  from "@/pages/alumni/CreateEventPage";

import AlumniMentorshipPage
  from "@/pages/alumni/AlumniMentorshipPage";

import ApplicationsPage
  from "@/pages/alumni/ApplicationsPage";


// ==========================================
// ADMIN PAGES
// ==========================================
import {

  AdminDashboard,

} from "@/pages/admin/AdminDashboard";

import {

  StudentsDirectory as AdminStudentsDirectory,

} from "@/pages/admin/StudentsDirectory";

import {

  AnalyticsPage,

} from "@/pages/admin/AnalyticsPage";

import AdminApprovals
  from "@/pages/admin/AdminApprovals";

import LeaderboardPage
  from "@/pages/admin/LeaderboardPage";


// ==========================================
// COMMON PAGES
// ==========================================
import {

  ProfileEdit,

} from "@/pages/ProfileEdit";

import NotificationsPage
  from "@/pages/NotificationsPage";


// ==========================================
// QUERY CLIENT
// ==========================================
const queryClient =
  new QueryClient();


// ==========================================
// APP CONTENT
// ==========================================
const AppContent = () => {

  // ========================================
  // SOCKET INITIALIZATION
  // ========================================
  useSocket();

  return (

    <Routes>

      {/* ====================================== */}
      {/* PUBLIC ROUTES */}
      {/* ====================================== */}

      <Route
        path="/"
        element={<Index />}
      />


      {/* LOGIN */}
      <Route

        path="/login"

        element={

          <PublicRoute>

            <LoginForm />

          </PublicRoute>

        }

      />


      {/* REGISTER */}
      <Route

        path="/register"

        element={

          <PublicRoute>

            <Register />

          </PublicRoute>

        }

      />


      {/* FORGOT PASSWORD */}
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


      {/* CHANGE PASSWORD */}
      <Route

        path="/change-password"

        element={

          <ProtectedRoute

            allowedRoles={[

              "student",

              "alumni",

              "admin",

            ]}

          >

            <ChangePassword />

          </ProtectedRoute>

        }

      />


      {/* ====================================== */}
      {/* STUDENT ROUTES */}
      {/* ====================================== */}

      <Route

        path="/student/dashboard"

        element={

          <ProtectedRoute
            allowedRoles={["student"]}
          >

            <StudentDashboard />

          </ProtectedRoute>

        }

      />


      <Route

        path="/student/alumni-directory"

        element={

          <ProtectedRoute
            allowedRoles={["student"]}
          >

            <AlumniDirectory />

          </ProtectedRoute>

        }

      />


      <Route

        path="/student/search"

        element={

          <ProtectedRoute
            allowedRoles={["student"]}
          >

            <SearchUsersPage />

          </ProtectedRoute>

        }

      />


      <Route

        path="/student/guidance/:alumniId"

        element={

          <ProtectedRoute
            allowedRoles={["student"]}
          >

            <GuidanceRequestPage />

          </ProtectedRoute>

        }

      />


      <Route

        path="/student/recommendations"

        element={

          <ProtectedRoute
            allowedRoles={["student"]}
          >

            <RecommendationsPage />

          </ProtectedRoute>

        }

      />


      <Route

        path="/student/ai-chat"

        element={

          <ProtectedRoute
            allowedRoles={["student"]}
          >

            <AIChatPage />

          </ProtectedRoute>

        }

      />


      <Route

        path="/student/jobs"

        element={

          <ProtectedRoute
            allowedRoles={["student"]}
          >

            <JobsPage />

          </ProtectedRoute>

        }

      />


      <Route

        path="/student/mentorship"

        element={

          <ProtectedRoute
            allowedRoles={["student"]}
          >

            <MentorshipPage />

          </ProtectedRoute>

        }

      />


      <Route

        path="/student/chat"

        element={

          <ProtectedRoute
            allowedRoles={["student"]}
          >

            <ChatPage />

          </ProtectedRoute>

        }

      />


      <Route

        path="/student/chat/:userId"

        element={

          <ProtectedRoute
            allowedRoles={["student"]}
          >

            <ChatPage />

          </ProtectedRoute>

        }

      />


      <Route

        path="/student/events"

        element={

          <ProtectedRoute
            allowedRoles={["student"]}
          >

            <EventsPage />

          </ProtectedRoute>

        }

      />


      {/* ====================================== */}
      {/* ALUMNI ROUTES */}
      {/* ====================================== */}

      <Route

        path="/alumni/dashboard"

        element={

          <ProtectedRoute
            allowedRoles={["alumni"]}
          >

            <AlumniDashboard />

          </ProtectedRoute>

        }

      />


      <Route

        path="/alumni/fundraising"

        element={

          <ProtectedRoute
            allowedRoles={["alumni"]}
          >

            <FundraisingHub />

          </ProtectedRoute>

        }

      />


      <Route

        path="/alumni/students-directory"

        element={

          <ProtectedRoute
            allowedRoles={["alumni"]}
          >

            <StudentsDirectory />

          </ProtectedRoute>

        }

      />


      <Route

        path="/alumni/post-job"

        element={

          <ProtectedRoute
            allowedRoles={["alumni"]}
          >

            <PostJobPage />

          </ProtectedRoute>

        }

      />


      <Route

        path="/alumni/create-event"

        element={

          <ProtectedRoute
            allowedRoles={["alumni"]}
          >

            <CreateEventPage />

          </ProtectedRoute>

        }

      />


      <Route

        path="/alumni/mentorship"

        element={

          <ProtectedRoute
            allowedRoles={["alumni"]}
          >

            <AlumniMentorshipPage />

          </ProtectedRoute>

        }

      />


      <Route

        path="/alumni/guidance-requests"

        element={

          <ProtectedRoute
            allowedRoles={["alumni"]}
          >

            <GuidanceRequestsPage />

          </ProtectedRoute>

        }

      />


      <Route

        path="/alumni/applications"

        element={

          <ProtectedRoute
            allowedRoles={["alumni"]}
          >

            <ApplicationsPage />

          </ProtectedRoute>

        }

      />


      <Route

        path="/alumni/chat"

        element={

          <ProtectedRoute
            allowedRoles={["alumni"]}
          >

            <AlumniChatPage />

          </ProtectedRoute>

        }

      />


      <Route

        path="/alumni/chat/:userId"

        element={

          <ProtectedRoute
            allowedRoles={["alumni"]}
          >

            <AlumniChatPage />

          </ProtectedRoute>

        }

      />


      {/* ====================================== */}
      {/* ADMIN ROUTES */}
      {/* ====================================== */}

      <Route

        path="/admin/dashboard"

        element={

          <ProtectedRoute
            allowedRoles={["admin"]}
          >

            <AdminDashboard />

          </ProtectedRoute>

        }

      />


      <Route

        path="/admin/users"

        element={

          <ProtectedRoute
            allowedRoles={["admin"]}
          >

            <AdminStudentsDirectory />

          </ProtectedRoute>

        }

      />


      <Route

        path="/admin/approvals"

        element={

          <ProtectedRoute
            allowedRoles={["admin"]}
          >

            <AdminApprovals />

          </ProtectedRoute>

        }

      />


      <Route

        path="/admin/analytics"

        element={

          <ProtectedRoute
            allowedRoles={["admin"]}
          >

            <AnalyticsPage />

          </ProtectedRoute>

        }

      />


      <Route

        path="/admin/notifications"

        element={

          <ProtectedRoute
            allowedRoles={["admin"]}
          >

            <NotificationsPage />

          </ProtectedRoute>

        }

      />


      <Route

        path="/admin/leaderboard"

        element={

          <ProtectedRoute
            allowedRoles={["admin"]}
          >

            <LeaderboardPage />

          </ProtectedRoute>

        }

      />


      {/* ====================================== */}
      {/* COMMON ROUTES */}
      {/* ====================================== */}

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


      {/* ====================================== */}
      {/* OTHER ROUTES */}
      {/* ====================================== */}

      <Route
        path="/premium"
        element={<PremiumUpgrade />}
      />

      <Route
        path="/about"
        element={<About />}
      />


      {/* ====================================== */}
      {/* 404 */}
      {/* ====================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>

  );

};


// ==========================================
// MAIN APP
// ==========================================
const App = () => (

  <QueryClientProvider client={queryClient}>

    <AuthProvider>

      <TooltipProvider>

        <Toaster />

        <Sonner />

        <BrowserRouter>

          <AppContent />

        </BrowserRouter>

      </TooltipProvider>

    </AuthProvider>

  </QueryClientProvider>

);


// ==========================================
// EXPORT
// ==========================================
export default App;