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

  Navigate,

} from "react-router-dom";

import {
  Suspense,
  lazy,
} from "react";


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
// LOADER
// ==========================================
import {
  Loader2,
} from "lucide-react";


// ==========================================
// PUBLIC PAGES
// ==========================================
const Index =
  lazy(() =>
    import("./pages/Index")
  );

const NotFound =
  lazy(() =>
    import("./pages/NotFound")
  );

const Register =
  lazy(() =>
    import("./pages/Register")
  );

const ForgotPassword =
  lazy(() =>
    import("./pages/ForgotPassword")
  );

const VerifyOtp =
  lazy(() =>
    import("./pages/VerifyOtp")
  );

const ResetPassword =
  lazy(() =>
    import("./pages/ResetPassword")
  );

const ChangePassword =
  lazy(() =>
    import("./pages/ChangePassword")
  );

const About =
  lazy(() =>
    import("./pages/About")
  );

const PremiumUpgrade =
  lazy(() =>
    import("./pages/PremiumUpgrade")
  );

import {
  LoginForm,
} from "@/components/auth/LoginForm";


// ==========================================
// STUDENT PAGES
// ==========================================
const StudentDashboard =
  lazy(() =>
    import("@/pages/student/StudentDashboard")
  );

const JobsPage =
  lazy(() =>
    import("@/pages/student/JobsPage")
  );

const MentorshipPage =
  lazy(() =>
    import("@/pages/student/MentorshipPage")
  );

const AIChatPage =
  lazy(() =>
    import("./pages/student/AIChatPage")
  );

const ChatPage =
  lazy(() =>
    import("@/pages/student/ChatPage")
  );

const EventsPage =
  lazy(() =>
    import("@/pages/student/EventsPage")
  );

const AlumniDirectory =
  lazy(() =>
    import("@/pages/student/AlumniDirectory")
  );

const SearchUsersPage =
  lazy(() =>
    import("@/pages/student/SearchUsersPage")
  );

const GuidanceRequestPage =
  lazy(() =>
    import("@/pages/student/GuidanceRequestPage")
  );

const RecommendationsPage =
  lazy(() =>
    import("@/pages/student/RecommendationsPage")
  );

const MyGuidanceRequestsPage =
  lazy(() =>
    import("@/pages/student/MyGuidanceRequestsPage")
  );

const RaiseDoubtPage =
  lazy(() =>
    import("@/pages/student/RaiseDoubtPage")
  );


// ==========================================
// ALUMNI PAGES
// ==========================================
const AlumniDashboard =
  lazy(() =>
    import("@/pages/alumni/AlumniDashboard")
  );

const AlumniChatPage =
  lazy(() =>
    import("@/pages/alumni/AlumniChatPage")
  );

const FundraisingHub =
  lazy(() =>
    import("@/pages/alumni/FundraisingHub")
  );

const StudentsDirectory =
  lazy(() =>
    import("@/pages/alumni/StudentsDirectory")
  );

const GuidanceRequestsPage =
  lazy(() =>
    import("@/pages/alumni/GuidanceRequestsPage")
  );

const PostJobPage =
  lazy(() =>
    import("@/pages/alumni/PostJobPage")
  );

const CreateEventPage =
  lazy(() =>
    import("@/pages/alumni/CreateEventPage")
  );

const AlumniMentorshipPage =
  lazy(() =>
    import("@/pages/alumni/AlumniMentorshipPage")
  );

const ApplicationsPage =
  lazy(() =>
    import("@/pages/alumni/ApplicationsPage")
  );


// ==========================================
// ADMIN PAGES
// ==========================================
const AdminDashboard =
  lazy(() =>
    import("@/pages/admin/AdminDashboard")
  );

const AdminStudentsDirectory =
  lazy(() =>
    import("@/pages/admin/StudentsDirectory")
  );

const AnalyticsPage =
  lazy(() =>
    import("@/pages/admin/AnalyticsPage")
  );

const AdminApprovals =
  lazy(() =>
    import("@/pages/admin/AdminApprovals")
  );

const LeaderboardPage =
  lazy(() =>
    import("@/pages/admin/LeaderboardPage")
  );

const UploadDatasetPage =
  lazy(() =>
    import("@/pages/admin/UploadDatasetPage")
  );


// ==========================================
// COMMON PAGES
// ==========================================
const ProfileEdit =
  lazy(() =>
    import("@/pages/ProfileEdit")
  );

const NotificationsPage =
  lazy(() =>
    import("@/pages/NotificationsPage")
  );


// ==========================================
// QUERY CLIENT
// ==========================================
const queryClient =
  new QueryClient({

    defaultOptions: {

      queries: {

        retry: 1,

        refetchOnWindowFocus:
          false,

      },

    },

  });


// ==========================================
// PAGE LOADER
// ==========================================
const PageLoader =
  () => (

    <div className="min-h-screen flex items-center justify-center bg-background">

      <div className="text-center">

        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />

        <h2 className="text-2xl font-bold">

          Loading AlumniConnect...

        </h2>

        <p className="text-muted-foreground mt-2">

          Please wait

        </p>

      </div>

    </div>

  );


// ==========================================
// SOCKET INITIALIZER
// ==========================================
const SocketInitializer =
  () => {

    useSocket();

    return null;

  };


// ==========================================
// APP CONTENT
// ==========================================
const AppContent =
  () => {

    return (

      <Suspense
        fallback={<PageLoader />}
      >

        <Routes>

          {/* ====================================== */}
          {/* HOME */}
          {/* ====================================== */}

          <Route
            path="/"
            element={<Index />}
          />


          {/* ====================================== */}
          {/* PUBLIC ROUTES */}
          {/* ====================================== */}

          <Route

            path="/login"

            element={

              <PublicRoute>

                <LoginForm />

              </PublicRoute>

            }

          />


          <Route

            path="/register"

            element={

              <PublicRoute>

                <Register />

              </PublicRoute>

            }

          />


          <Route

            path="/forgot-password"

            element={

              <PublicRoute>

                <ForgotPassword />

              </PublicRoute>

            }

          />


          <Route

            path="/verify-otp"

            element={

              <PublicRoute>

                <VerifyOtp />

              </PublicRoute>

            }

          />


          <Route

            path="/reset-password"

            element={

              <PublicRoute>

                <ResetPassword />

              </PublicRoute>

            }

          />


          {/* ====================================== */}
          {/* COMMON PROTECTED */}
          {/* ====================================== */}

          <Route

            path="/change-password"

            element={

              <ProtectedRoute

                allowedRoles={[

                  "student",

                  "alumni",

                  "admin",

                  "faculty",

                ]}

              >

                <ChangePassword />

              </ProtectedRoute>

            }

          />


          <Route

            path="/notifications"

            element={

              <ProtectedRoute

                allowedRoles={[

                  "student",

                  "alumni",

                  "admin",

                  "faculty",

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

                  "faculty",

                ]}

              >

                <ProfileEdit />

              </ProtectedRoute>

            }

          />


          {/* ====================================== */}
          {/* STUDENT */}
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

            path="/student/guidance"

            element={

              <Navigate
                to="/student/search"
                replace
              />

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

            path="/student/my-guidance"

            element={

              <ProtectedRoute
                allowedRoles={["student"]}
              >

                <MyGuidanceRequestsPage />

              </ProtectedRoute>

            }

          />


          <Route

            path="/student/raise-doubt"

            element={

              <ProtectedRoute
                allowedRoles={["student"]}
              >

                <RaiseDoubtPage />

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
          {/* ALUMNI */}
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


          {/* ====================================== */}
          {/* ADMIN */}
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

            path="/admin/leaderboard"

            element={

              <ProtectedRoute
                allowedRoles={["admin"]}
              >

                <LeaderboardPage />

              </ProtectedRoute>

            }

          />


          <Route

            path="/admin/upload-dataset"

            element={

              <ProtectedRoute
                allowedRoles={["admin"]}
              >

                <UploadDatasetPage />

              </ProtectedRoute>

            }

          />


          {/* ====================================== */}
          {/* OTHER */}
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
          {/* REDIRECT */}
          {/* ====================================== */}

          <Route

            path="/dashboard"

            element={

              <Navigate
                to="/login"
                replace
              />

            }

          />

          <Route
            path="/jobs"
            element={
              <Navigate
                to="/student/jobs"
                replace
              />
            }
          />

          <Route
            path="/events"
            element={
              <Navigate
                to="/student/events"
                replace
              />
            }
          />

          <Route
            path="/mentorship"
            element={
              <Navigate
                to="/student/mentorship"
                replace
              />
            }
          />

          <Route
            path="/guidance"
            element={
              <Navigate
                to="/student/search"
                replace
              />
            }
          />

          <Route
            path="/raise-doubt"
            element={
              <Navigate
                to="/student/raise-doubt"
                replace
              />
            }
          />


          {/* ====================================== */}
          {/* 404 */}
          {/* ====================================== */}

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>

      </Suspense>

    );

  };


// ==========================================
// MAIN APP
// ==========================================
const App =
  () => (

    <QueryClientProvider
      client={queryClient}
    >

      <AuthProvider>

        <TooltipProvider>

          <BrowserRouter>

            <SocketInitializer />

            <Toaster />

            <Sonner />

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