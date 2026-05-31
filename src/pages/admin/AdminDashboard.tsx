import { Header } from "@/components/layout/Header";

import {
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";

import { StatsCard }
  from "@/components/common/StatsCard";

import { Button }
  from "@/components/ui/button";

import {

  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,

} from "@/components/ui/card";

import { Badge }
  from "@/components/ui/badge";

import {

  Users,
  Briefcase,
  Calendar,
  Trophy,
  Shield,
  TrendingUp,
  AlertCircle,
  Clock,
  UserCheck,
  GraduationCap,
  BarChart3,
  Loader2,
  RefreshCw,
  Brain,
  Sparkles,
  ArrowRight,
  Activity,
  Bell,
  Database,
  FileText,

} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import api from "@/utils/api";


// ==========================================
// TYPES
// ==========================================
interface DashboardStats {

  totalAlumni: number;

  totalStudents: number;

  activeJobs: number;

  upcomingEvents: number;

  totalContributions: number;

  monthlyGrowth: number;

}


interface ActivityItem {

  id: string;

  type: string;

  description: string;

  timestamp: string;

  status: string;

}


// ==========================================
// COMPONENT
// ==========================================
export const AdminDashboard = () => {

  // ========================================
  // SAFE USER PARSE
  // ========================================
  let user = null;

  try {

    const userInfo =
      localStorage.getItem(
        "userInfo"
      );

    user =
      userInfo
        ? JSON.parse(userInfo)
        : null;

  }

  catch (error) {

    console.log(
      "USER PARSE ERROR:",
      error
    );

  }


  // ========================================
  // STATES
  // ========================================
  const [

    loading,
    setLoading,

  ] = useState(true);


  const [

    platformStats,
    setPlatformStats,

  ] = useState<DashboardStats>({

    totalAlumni: 0,

    totalStudents: 0,

    activeJobs: 0,

    upcomingEvents: 0,

    totalContributions: 0,

    monthlyGrowth: 0,

  });


  const [

    recentActivity,
    setRecentActivity,

  ] = useState<ActivityItem[]>([]);


  const [

    pendingApprovals,
    setPendingApprovals,

  ] = useState<any[]>([]);


  const [

    topContributors,
    setTopContributors,

  ] = useState<any[]>([]);


  // ========================================
  // FETCH DASHBOARD DATA
  // ========================================
  const fetchDashboard =
    async () => {

      try {

        setLoading(true);


        const [

          usersRes,
          jobsRes,
          eventsRes,

        ] = await Promise.all([

          api.get("/users"),

          api.get("/jobs"),

          api.get("/events"),

        ]);


        const users =
          usersRes.data || [];


        const jobs =
          jobsRes.data || [];


        const events =
          eventsRes.data || [];


        // ====================================
        // USERS
        // ====================================
        const alumni =
          users.filter(
            (u: any) =>
              u.role === "alumni"
          );


        const students =
          users.filter(
            (u: any) =>
              u.role === "student"
          );


        // ====================================
        // STATS
        // ====================================
        setPlatformStats({

          totalAlumni:
            alumni.length,

          totalStudents:
            students.length,

          activeJobs:
            jobs.length,

          upcomingEvents:
            events.length,

          totalContributions:
            8650,

          monthlyGrowth:
            12.5,

        });


        // ====================================
        // RECENT ACTIVITY
        // ====================================
        setRecentActivity([

          {

            id: "1",

            type:
              "user_registration",

            description:
              "New alumni registered on platform",

            timestamp:
              "2 hours ago",

            status:
              "pending",

          },

          {

            id: "2",

            type:
              "job_posted",

            description:
              "New software job posted",

            timestamp:
              "5 hours ago",

            status:
              "approved",

          },

          {

            id: "3",

            type:
              "event_created",

            description:
              "New AI workshop created",

            timestamp:
              "1 day ago",

            status:
              "approved",

          },

        ]);


        // ====================================
        // APPROVALS
        // ====================================
        setPendingApprovals([

          {

            id: "1",

            type:
              "job",

            title:
              "Frontend Developer Position",

            submittedBy:
              "TechStart Inc.",

          },

          {

            id: "2",

            type:
              "event",

            title:
              "Blockchain Workshop",

            submittedBy:
              "Dr. Priya Patel",

          },

        ]);


        // ====================================
        // TOP CONTRIBUTORS
        // ====================================
        setTopContributors([

          {

            id: "1",

            name:
              "Dr. Michael Chen",

            role:
              "alumni",

            score:
              1250,

          },

          {

            id: "2",

            name:
              "Sarah Williams",

            role:
              "alumni",

            score:
              980,

          },

          {

            id: "3",

            name:
              "Alex Kumar",

            role:
              "student",

            score:
              320,

          },

        ]);

      }

      catch (error) {

        console.log(
          "ADMIN DASHBOARD ERROR:",
          error
        );

      }

      finally {

        setLoading(false);

      }

    };


  // ========================================
  // INITIAL LOAD
  // ========================================
  useEffect(() => {

    fetchDashboard();

  }, []);


  // ========================================
  // ACTIVITY ICON
  // ========================================
  const getActivityIcon = (
    type: string
  ) => {

    switch (type) {

      case "user_registration":

        return (
          <UserCheck className="h-4 w-4" />
        );

      case "job_posted":

        return (
          <Briefcase className="h-4 w-4" />
        );

      case "event_created":

        return (
          <Calendar className="h-4 w-4" />
        );

      default:

        return (
          <AlertCircle className="h-4 w-4" />
        );

    }

  };


  // ========================================
  // STATUS BADGE
  // ========================================
  const getStatusBadge = (
    status: string
  ) => {

    switch (status) {

      case "approved":

        return (

          <Badge className="bg-green-600">

            Approved

          </Badge>

        );

      case "pending":

        return (

          <Badge variant="secondary">

            Pending

          </Badge>

        );

      default:

        return (

          <Badge variant="outline">

            Unknown

          </Badge>

        );

    }

  };


  // ========================================
  // LOADING
  // ========================================
  if (loading) {

    return (

      <div className="min-h-screen bg-background">

        <Header />

        <div className="flex items-center justify-center h-[80vh]">

          <div className="text-center">

            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />

            <h2 className="text-2xl font-bold">

              Loading Admin Dashboard...

            </h2>

          </div>

        </div>

      </div>

    );

  }


  // ========================================
  // UI
  // ========================================
  return (

    <div className="min-h-screen bg-background">

      <Header />

      <main className="container mx-auto px-4 py-6">


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

          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-purple-600 to-indigo-700 text-white shadow-2xl mb-10"
        >

          <div className="absolute inset-0 bg-black/10" />

          <div className="relative p-8 md:p-10">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

              {/* LEFT */}
              <div>

                <div className="flex items-center gap-3 mb-4">

                  <Sparkles className="h-8 w-8 text-yellow-300" />

                  <Badge className="bg-white/20 border-0 text-white">

                    Admin Dashboard

                  </Badge>

                </div>


                <h1 className="text-4xl md:text-5xl font-bold leading-tight">

                  Welcome back,
                  {" "}
                  {user?.name || "Admin"} 👋

                </h1>


                <p className="text-white/90 mt-4 text-lg max-w-2xl">

                  Monitor platform growth, manage approvals, analytics, and platform engagement.

                </p>


                <div className="flex flex-wrap gap-4 mt-6">

                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90"
                    asChild
                  >

                    <Link to="/admin/analytics">

                      View Analytics

                      <ArrowRight className="h-4 w-4 ml-2" />

                    </Link>

                  </Button>


                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                    onClick={fetchDashboard}
                  >

                    <RefreshCw className="h-4 w-4 mr-2" />

                    Refresh

                  </Button>

                </div>

              </div>


              {/* RIGHT */}
              <div className="flex justify-center">

                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-center">

                  <Shield className="h-16 w-16 mx-auto mb-4 text-yellow-300" />

                  <p className="text-2xl font-bold">

                    Administrator

                  </p>

                  <p className="text-white/80 mt-2">

                    Full Platform Access

                  </p>

                </div>

              </div>

            </div>

          </div>

        </motion.div>


        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-10">

          <StatsCard
            title="Total Alumni"
            value={platformStats.totalAlumni}
            description="Registered alumni"
            icon={GraduationCap}
          />

          <StatsCard
            title="Students"
            value={platformStats.totalStudents}
            description="Active students"
            icon={Users}
          />

          <StatsCard
            title="Jobs"
            value={platformStats.activeJobs}
            description="Open positions"
            icon={Briefcase}
          />

          <StatsCard
            title="Events"
            value={platformStats.upcomingEvents}
            description="Upcoming events"
            icon={Calendar}
          />

          <StatsCard
            title="Contributions"
            value={platformStats.totalContributions}
            description="Platform points"
            icon={Trophy}
            gradient
          />

          <StatsCard
            title="Growth"
            value={`${platformStats.monthlyGrowth}%`}
            description="Monthly growth"
            icon={TrendingUp}
          />

        </div>


        {/* QUICK LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          <Link to="/admin/users">

            <Card className="rounded-3xl shadow-xl border-0 hover:shadow-2xl transition-all hover:-translate-y-1">

              <CardContent className="pt-6 text-center">

                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">

                  <Users className="h-7 w-7 text-primary" />

                </div>

                <h3 className="font-bold text-lg mb-2">

                  Manage Users

                </h3>

                <p className="text-muted-foreground">

                  Control all platform users

                </p>

              </CardContent>

            </Card>

          </Link>


          <Link to="/admin/analytics">

            <Card className="rounded-3xl shadow-xl border-0 hover:shadow-2xl transition-all hover:-translate-y-1">

              <CardContent className="pt-6 text-center">

                <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">

                  <BarChart3 className="h-7 w-7 text-blue-600" />

                </div>

                <h3 className="font-bold text-lg mb-2">

                  Analytics

                </h3>

                <p className="text-muted-foreground">

                  Reports and insights

                </p>

              </CardContent>

            </Card>

          </Link>


          <Link to="/admin/upload-dataset">

            <Card className="rounded-3xl shadow-xl border-0 hover:shadow-2xl transition-all hover:-translate-y-1">

              <CardContent className="pt-6 text-center">

                <div className="h-14 w-14 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-4">

                  <Database className="h-7 w-7 text-violet-600" />

                </div>

                <h3 className="font-bold text-lg mb-2">

                  AI Datasets

                </h3>

                <p className="text-muted-foreground">

                  Upload training datasets

                </p>

              </CardContent>

            </Card>

          </Link>


          <Link to="/admin/approvals">

            <Card className="rounded-3xl shadow-xl border-0 hover:shadow-2xl transition-all hover:-translate-y-1">

              <CardContent className="pt-6 text-center">

                <div className="h-14 w-14 rounded-2xl bg-yellow-100 flex items-center justify-center mx-auto mb-4">

                  <FileText className="h-7 w-7 text-yellow-600" />

                </div>

                <h3 className="font-bold text-lg mb-2">

                  Approvals

                </h3>

                <p className="text-muted-foreground">

                  Review pending requests

                </p>

              </CardContent>

            </Card>

          </Link>

        </div>


        {/* BOTTOM */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


          {/* RECENT ACTIVITY */}
          <Card className="lg:col-span-2 rounded-3xl shadow-xl border-0">

            <CardHeader>

              <CardTitle className="flex items-center gap-2">

                <Activity className="h-5 w-5 text-primary" />

                Recent Activity

              </CardTitle>

              <CardDescription>

                Latest platform activities

              </CardDescription>

            </CardHeader>


            <CardContent className="space-y-4">

              {recentActivity.map(
                (activity) => (

                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-muted/40"
                  >

                    <div className="flex items-center gap-3">

                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">

                        {getActivityIcon(
                          activity.type
                        )}

                      </div>

                      <div>

                        <p className="font-medium">

                          {activity.description}

                        </p>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">

                          <Clock className="h-3 w-3" />

                          {activity.timestamp}

                        </div>

                      </div>

                    </div>

                    {getStatusBadge(
                      activity.status
                    )}

                  </div>

                )
              )}

            </CardContent>

          </Card>


          {/* TOP CONTRIBUTORS */}
          <Card className="rounded-3xl shadow-xl border-0">

            <CardHeader>

              <CardTitle className="flex items-center gap-2">

                <Trophy className="h-5 w-5 text-yellow-500" />

                Top Contributors

              </CardTitle>

            </CardHeader>


            <CardContent className="space-y-4">

              {topContributors.map(
                (
                  contributor,
                  index
                ) => (

                  <div
                    key={contributor.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-muted/30"
                  >

                    <div>

                      <p className="font-semibold">

                        #{index + 1}
                        {" "}
                        {contributor.name}

                      </p>

                      <p className="text-sm text-muted-foreground">

                        {contributor.role}

                      </p>

                    </div>

                    <Badge>

                      {contributor.score} pts

                    </Badge>

                  </div>

                )
              )}

            </CardContent>

          </Card>

        </div>


        {/* PENDING APPROVALS */}
        <Card className="rounded-3xl shadow-xl border-0 mt-8">

          <CardHeader>

            <CardTitle className="flex items-center gap-2">

              <Bell className="h-5 w-5 text-primary" />

              Pending Approvals

            </CardTitle>

            <CardDescription>

              Review and approve pending submissions

            </CardDescription>

          </CardHeader>


          <CardContent className="space-y-4">

            {pendingApprovals.map(
              (item) => (

                <div
                  key={item.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 rounded-2xl bg-muted/40"
                >

                  <div>

                    <h3 className="font-semibold">

                      {item.title}

                    </h3>

                    <p className="text-sm text-muted-foreground">

                      Submitted by
                      {" "}
                      {item.submittedBy}

                    </p>

                  </div>


                  <div className="flex gap-2">

                    <Button
                      size="sm"
                    >

                      Approve

                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                    >

                      Reject

                    </Button>

                  </div>

                </div>

              )
            )}

          </CardContent>

        </Card>

      </main>

    </div>

  );

};


// ==========================================
// EXPORT
// ==========================================
export default AdminDashboard;