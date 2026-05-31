import { Header } from '@/components/layout/Header';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { motion } from 'framer-motion';

import { StatsCard }
  from '@/components/common/StatsCard';

import { ContributionBadge }
  from '@/components/common/ContributionBadge';

import { Button }
  from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Badge }
  from '@/components/ui/badge';

import { Progress }
  from '@/components/ui/progress';

import {

  Users,
  Briefcase,
  Calendar,
  Trophy,
  MessageSquare,
  Bell,
  Search,
  ClipboardList,
  Brain,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Activity,
  Flame,
  Star,
  Loader2,
  RefreshCw,
  MapPin,
  BookOpen,
  Clock3,

} from 'lucide-react';

import {
  Link,
} from 'react-router-dom';

import api from '@/utils/api';

import {
  useAuth,
} from '@/contexts/AuthContext';


// =====================================
// TYPES
// =====================================
interface DashboardStats {

  applicationsSent: number;

  eventAttendances: number;

  mentorshipSessions: number;

  achievementPoints: number;

  profileCompletion: number;

}


interface QuickLink {

  title: string;

  description: string;

  icon: any;

  color: string;

  link: string;

}


// =====================================
// COMPONENT
// =====================================
export const StudentDashboard = () => {

  // =====================================
  // AUTH
  // =====================================
  const {
    user,
  } = useAuth();


  // =====================================
  // STATES
  // =====================================
  const [

    loading,
    setLoading,

  ] = useState<boolean>(true);


  const [

    dashboardStats,
    setDashboardStats,

  ] = useState<DashboardStats>({

    applicationsSent: 0,

    eventAttendances: 0,

    mentorshipSessions: 0,

    achievementPoints: 0,

    profileCompletion: 0,

  });


  const [

    streakDays,

  ] = useState<number>(7);


  const [

    recentActivities,
    setRecentActivities,

  ] = useState<string[]>([]);


  const [

    recommendedJobs,
    setRecommendedJobs,

  ] = useState<any[]>([]);


  const [

    upcomingEvents,
    setUpcomingEvents,

  ] = useState<any[]>([]);


  // =====================================
  // FETCH DASHBOARD DATA
  // =====================================
  const fetchDashboardData =
    async () => {

      try {

        setLoading(true);


        // =================================
        // API CALLS
        // =================================
        const [

          jobsRes,
          eventsRes,
          mentorshipRes,

        ] = await Promise.all([

          api.get("/jobs"),

          api.get("/events"),

          api.get("/mentorship"),

        ]);


        // =================================
        // DATA EXTRACTION
        // =================================
        const jobs =
          jobsRes.data?.jobs ||
          jobsRes.data ||
          [];


        const events =
          eventsRes.data?.events ||
          eventsRes.data ||
          [];


        const mentorships =
          mentorshipRes.data?.mentorships ||
          mentorshipRes.data ||
          [];


        // =================================
        // RECOMMENDED JOBS
        // =================================
        setRecommendedJobs(
          jobs.slice(0, 3)
        );


        // =================================
        // UPCOMING EVENTS
        // =================================
        setUpcomingEvents(
          events.slice(0, 3)
        );


        // =================================
        // APPLICATIONS COUNT
        // =================================
        let applicationsCount = 0;


        jobs.forEach((job: any) => {

          if (

            Array.isArray(
              job.applications
            )

          ) {

            applicationsCount +=

              job.applications.filter(
                (app: any) => {

                  const studentId =

                    typeof app.student ===
                    "string"

                      ? app.student

                      : app.student?._id;

                  return (
                    studentId ===
                    user?._id
                  );

                }
              ).length;

          }

        });


        // =================================
        // EVENTS COUNT
        // =================================
        let attendedEvents = 0;


        events.forEach((event: any) => {

          if (

            Array.isArray(
              event.attendees
            )

          ) {

            attendedEvents +=

              event.attendees.filter(
                (attendee: any) => {

                  const attendeeId =

                    typeof attendee ===
                    "string"

                      ? attendee

                      : attendee?._id;

                  return (
                    attendeeId ===
                    user?._id
                  );

                }
              ).length;

          }

        });


        // =================================
        // MENTORSHIP COUNT
        // =================================
        const mentorshipCount =

          mentorships.filter(
            (mentor: any) => {

              const studentId =

                typeof mentor.student ===
                "string"

                  ? mentor.student

                  : mentor.student?._id;

              return (

                studentId ===
                  user?._id &&

                (

                  mentor.status ===
                    "Accepted" ||

                  mentor.status ===
                    "Completed"

                )

              );

            }
          ).length;


        // =================================
        // PROFILE COMPLETION
        // =================================
        let completion = 0;


        if (user?.name)
          completion += 10;

        if (user?.email)
          completion += 10;

        if (user?.profileImage)
          completion += 15;

        if (user?.bio)
          completion += 15;

        if (user?.skills?.length)
          completion += 15;

        if (user?.linkedinUrl)
          completion += 10;

        if (user?.githubUrl)
          completion += 10;

        if (user?.resumeUrl)
          completion += 15;


        // =================================
        // ACHIEVEMENT SCORE
        // =================================
        const totalPoints =

          applicationsCount * 5 +

          attendedEvents * 3 +

          mentorshipCount * 10 +

          (user?.trustScore || 0);


        // =================================
        // SET STATS
        // =================================
        setDashboardStats({

          applicationsSent:
            applicationsCount,

          eventAttendances:
            attendedEvents,

          mentorshipSessions:
            mentorshipCount,

          achievementPoints:
            totalPoints,

          profileCompletion:
            completion,

        });


        // =================================
        // ACTIVITIES
        // =================================
        const activities: string[] = [];


        if (applicationsCount > 0) {

          activities.push(

            `Applied to ${applicationsCount} opportunities`

          );

        }


        if (attendedEvents > 0) {

          activities.push(

            `Joined ${attendedEvents} events`

          );

        }


        if (mentorshipCount > 0) {

          activities.push(

            `Completed ${mentorshipCount} mentorship sessions`

          );

        }


        activities.push(
          "Updated profile recently"
        );


        setRecentActivities(
          activities
        );

      }

      catch (error) {

        console.error(
          "Dashboard Error:",
          error
        );

      }

      finally {

        setLoading(false);

      }

    };


  // =====================================
  // INITIAL LOAD
  // =====================================
  useEffect(() => {

    if (user?._id) {

      fetchDashboardData();

    }

  }, [user]);


  // =====================================
  // QUICK LINKS
  // =====================================
  const quickLinks:
    QuickLink[] = useMemo(
      () => [

        {

          title:
            "Alumni Directory",

          description:
            "Connect with alumni",

          icon:
            Users,

          color:
            "bg-primary/10 text-primary",

          link:
            "/student/alumni-directory",

        },

        {

          title:
            "Jobs",

          description:
            "Find opportunities",

          icon:
            Briefcase,

          color:
            "bg-green-100 text-green-600",

          link:
            "/student/jobs",

        },

        {

          title:
            "Events",

          description:
            "Join workshops",

          icon:
            Calendar,

          color:
            "bg-blue-100 text-blue-600",

          link:
            "/student/events",

        },

        {

          title:
            "Mentorship",

          description:
            "Career guidance",

          icon:
            MessageSquare,

          color:
            "bg-purple-100 text-purple-600",

          link:
            "/student/mentorship",

        },

        {

          title:
            "Search Users",

          description:
            "Find people",

          icon:
            Search,

          color:
            "bg-orange-100 text-orange-600",

          link:
            "/student/search",

        },

        {

          title:
            "Notifications",

          description:
            "View updates",

          icon:
            Bell,

          color:
            "bg-red-100 text-red-600",

          link:
            "/notifications",

        },

        {

          title:
            "Guidance",

          description:
            "Raise requests",

          icon:
            ClipboardList,

          color:
            "bg-yellow-100 text-yellow-600",

          link:
            "/student/search",

        },

        {

          title:
            "Raise Doubt",

          description:
            "Ask expert help",

          icon:
            Sparkles,

          color:
            "bg-fuchsia-100 text-fuchsia-600",

          link:
            "/student/raise-doubt",

        },

        {

          title:
            "AI Assistant",

          description:
            "Career chatbot",

          icon:
            Brain,

          color:
            "bg-violet-100 text-violet-600",

          link:
            "/student/ai-chat",

        },

      ],
      []
    );


  // =====================================
  // LOADING SCREEN
  // =====================================
  if (loading) {

    return (

      <div className="min-h-screen bg-background">

        <Header />

        <div className="flex items-center justify-center h-[80vh]">

          <div className="text-center">

            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />

            <h2 className="text-2xl font-bold">

              Loading Dashboard...

            </h2>

          </div>

        </div>

      </div>

    );

  }


  // =====================================
  // UI
  // =====================================
  return (

    <div className="min-h-screen bg-background">

      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6">


        {/* HERO */}
        <motion.div

          initial={{
            opacity: 0,
            y: 30,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 0.5,
          }}

          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-purple-600 to-indigo-600 text-white shadow-2xl mb-10"
        >

          <div className="absolute inset-0 bg-black/10" />

          <div className="relative p-8 md:p-10">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

              {/* LEFT */}
              <div>

                <div className="flex items-center gap-3 mb-4">

                  <Sparkles className="h-8 w-8 text-yellow-300" />

                  <Badge className="bg-white/20 border-0 text-white">

                    Student Dashboard

                  </Badge>

                </div>


                <h1 className="text-4xl md:text-5xl font-bold leading-tight">

                  Welcome back,
                  {" "}
                  {user?.name || "Student"} 👋

                </h1>


                <p className="text-white/90 mt-4 text-lg max-w-2xl">

                  Manage applications, mentorships, events, networking, and career growth in one place.

                </p>


                <div className="flex flex-col sm:flex-row gap-4 mt-6">

                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90"
                    asChild
                  >

                    <Link to="/student/mentorship">

                      Find Mentors

                      <ArrowRight className="h-4 w-4 ml-2" />

                    </Link>

                  </Button>


                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                    asChild
                  >

                    <Link to="/student/jobs">

                      Explore Jobs

                    </Link>

                  </Button>


                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                    onClick={fetchDashboardData}
                  >

                    <RefreshCw className="h-4 w-4 mr-2" />

                    Refresh

                  </Button>

                </div>

              </div>


              {/* RIGHT */}
              <div className="flex justify-center">

                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-center">

                  <ContributionBadge
                    points={dashboardStats.achievementPoints}
                    size="lg"
                  />

                  <p className="mt-4 text-white/90">

                    Achievement Score

                  </p>

                </div>

              </div>

            </div>

          </div>

        </motion.div>


        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

          <StatsCard
            title="Applications"
            value={dashboardStats.applicationsSent}
            description="Jobs applied"
            icon={Briefcase}
          />

          <StatsCard
            title="Events"
            value={dashboardStats.eventAttendances}
            description="Events attended"
            icon={Calendar}
          />

          <StatsCard
            title="Mentorships"
            value={dashboardStats.mentorshipSessions}
            description="Guidance sessions"
            icon={MessageSquare}
          />

          <StatsCard
            title="Achievement Score"
            value={dashboardStats.achievementPoints}
            description="Overall engagement"
            icon={Trophy}
            gradient
          />

        </div>


        {/* PROFILE */}
        <Card className="rounded-3xl shadow-xl border-0 mb-10">

          <CardHeader>

            <CardTitle className="flex items-center gap-2">

              <Star className="h-5 w-5 text-yellow-500" />

              Profile Completion

            </CardTitle>

            <CardDescription>

              Complete your profile for better opportunities

            </CardDescription>

          </CardHeader>


          <CardContent>

            <div className="space-y-4">

              <div className="flex justify-between">

                <span className="font-medium">

                  Completion Status

                </span>

                <span className="font-bold text-primary">

                  {dashboardStats.profileCompletion}%

                </span>

              </div>


              <Progress
                value={dashboardStats.profileCompletion}
                className="h-3"
              />

            </div>

          </CardContent>

        </Card>

      </main>

    </div>

  );

};


export default StudentDashboard;