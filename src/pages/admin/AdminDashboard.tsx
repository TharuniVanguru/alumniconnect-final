import { Header } from "@/components/layout/Header";

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

} from "lucide-react";

import { Link }
  from "react-router-dom";


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
  // MOCK STATS
  // ========================================
  const platformStats = {

    totalAlumni: 1248,

    totalStudents: 3420,

    activeJobs: 156,

    upcomingEvents: 24,

    totalContributions: 8650,

    monthlyGrowth: 12.5,

  };


  // ========================================
  // RECENT ACTIVITY
  // ========================================
  const recentActivity = [

    {

      id: "1",

      type: "user_registration",

      description:
        "New alumni registration: Dr. Sarah Johnson",

      timestamp:
        "2 hours ago",

      status:
        "pending",

    },

    {

      id: "2",

      type: "job_posted",

      description:
        "New job posted: Senior Developer at TechCorp",

      timestamp:
        "5 hours ago",

      status:
        "approved",

    },

    {

      id: "3",

      type: "event_created",

      description:
        "Event created: AI Workshop by Prof. Williams",

      timestamp:
        "1 day ago",

      status:
        "approved",

    },

  ];


  // ========================================
  // TOP CONTRIBUTORS
  // ========================================
  const topContributors = [

    {

      id: "1",

      name:
        "Dr. Michael Chen",

      role:
        "alumni",

      score:
        1250,

      activity:
        "Posted 5 jobs, organized 3 events",

    },

    {

      id: "2",

      name:
        "Sarah Williams",

      role:
        "alumni",

      score:
        980,

      activity:
        "Mentored 15 students",

    },

    {

      id: "3",

      name:
        "Alex Kumar",

      role:
        "student",

      score:
        320,

      activity:
        "Active in events",

    },

  ];


  // ========================================
  // PENDING APPROVALS
  // ========================================
  const pendingApprovals = [

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

  ];


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

          <Badge variant="default">

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

          <Badge variant="secondary">

            Unknown

          </Badge>

        );

    }

  };


  // ========================================
  // UI
  // ========================================
  return (

    <div className="min-h-screen bg-background">

      <Header />

      <main className="container mx-auto px-4 py-6">

        {/* ================================= */}
        {/* WELCOME */}
        {/* ================================= */}

        <div className="mb-8">

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-3xl font-bold text-foreground mb-2">

                Welcome back,
                {" "}
                {user?.name || "Admin"}!

              </h1>

              <p className="text-muted-foreground">

                Your personalized admin dashboard powered by AlumniConnect

              </p>

            </div>

            <div className="flex items-center space-x-2">

              <Badge className="bg-gradient-primary text-white px-3 py-1">

                <Shield className="h-3 w-3 mr-1" />

                Administrator

              </Badge>

            </div>

          </div>

        </div>


        {/* ================================= */}
        {/* STATS */}
        {/* ================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">

          <StatsCard
            title="Total Alumni"
            value={platformStats.totalAlumni.toLocaleString()}
            description="Registered alumni"
            icon={GraduationCap}
            trend={{
              value: 8,
              label: "this month",
              isPositive: true,
            }}
          />

          <StatsCard
            title="Total Students"
            value={platformStats.totalStudents.toLocaleString()}
            description="Active students"
            icon={Users}
            trend={{
              value: 15,
              label: "this month",
              isPositive: true,
            }}
          />

          <StatsCard
            title="Active Jobs"
            value={platformStats.activeJobs}
            description="Open positions"
            icon={Briefcase}
          />

          <StatsCard
            title="Upcoming Events"
            value={platformStats.upcomingEvents}
            description="Scheduled events"
            icon={Calendar}
          />

          <StatsCard
            title="Contributions"
            value={platformStats.totalContributions.toLocaleString()}
            description="Platform points"
            icon={Trophy}
            gradient
          />

          <StatsCard
            title="Monthly Growth"
            value={`${platformStats.monthlyGrowth}%`}
            description="User growth"
            icon={TrendingUp}
          />

        </div>


        {/* ================================= */}
        {/* QUICK LINKS */}
        {/* ================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <Link to="/admin/users">

            <Card className="shadow-soft hover:shadow-medium transition-all cursor-pointer h-full bg-gradient-card">

              <CardContent className="pt-6 text-center">

                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">

                  <Users className="h-6 w-6 text-primary" />

                </div>

                <h3 className="font-semibold mb-2">

                  Manage Users

                </h3>

                <p className="text-sm text-muted-foreground">

                  Control all platform users

                </p>

              </CardContent>

            </Card>

          </Link>


          <Link to="/admin/analytics">

            <Card className="shadow-soft hover:shadow-medium transition-all cursor-pointer h-full bg-gradient-card">

              <CardContent className="pt-6 text-center">

                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">

                  <BarChart3 className="h-6 w-6 text-accent" />

                </div>

                <h3 className="font-semibold mb-2">

                  Analytics

                </h3>

                <p className="text-sm text-muted-foreground">

                  View reports & stats

                </p>

              </CardContent>

            </Card>

          </Link>


          <Link to="/admin/leaderboard">

            <Card className="shadow-soft hover:shadow-medium transition-all cursor-pointer h-full bg-gradient-card">

              <CardContent className="pt-6 text-center">

                <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">

                  <Trophy className="h-6 w-6 text-success" />

                </div>

                <h3 className="font-semibold mb-2">

                  Leaderboard

                </h3>

                <p className="text-sm text-muted-foreground">

                  Top contributors

                </p>

              </CardContent>

            </Card>

          </Link>


          <Link to="/admin/notifications">

            <Card className="shadow-soft hover:shadow-medium transition-all cursor-pointer h-full bg-gradient-card">

              <CardContent className="pt-6 text-center">

                <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">

                  <AlertCircle className="h-6 w-6 text-warning" />

                </div>

                <h3 className="font-semibold mb-2">

                  Notifications

                </h3>

                <p className="text-sm text-muted-foreground">

                  Send announcements

                </p>

              </CardContent>

            </Card>

          </Link>

        </div>

      </main>

    </div>

  );

};


// ==========================================
// EXPORT
// ==========================================
export default AdminDashboard;