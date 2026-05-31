import {
  useEffect,
  useState,
} from "react";

import api from "@/utils/api";

import { Header }
  from "@/components/layout/Header";

import { StatsCard }
  from "@/components/common/StatsCard";

import { ContributionBadge }
  from "@/components/common/ContributionBadge";

import { Button }
  from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  useToast,
} from "@/hooks/use-toast";

import {
  getSocket,
} from "@/socket";

import {

  Users,
  Briefcase,
  Calendar,
  Trophy,
  MessageSquare,
  Star,
  Plus,
  GraduationCap,
  Bell,
  Loader2,
  RefreshCcw,
  Brain,
  ShieldCheck,
  TrendingUp,
  Activity,
  Sparkles,
  ArrowRight,
  Target,
  Clock,

} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";


// ==========================================
// TYPES
// ==========================================
interface GuidanceRequest {

  _id: string;

  studentName: string;

  topic: string;

  domain: string;

  urgency: string;

}


interface Student {

  _id: string;

  name: string;

  role: string;

  branch?: string;

  skills?: string[];

  email?: string;

  profileImage?: string;

}


// ==========================================
// COMPONENT
// ==========================================
const AlumniDashboard =
  () => {

    // ========================================
    // HOOKS
    // ========================================
    const navigate =
      useNavigate();

    const { toast } =
      useToast();

    const socket =
      getSocket();


    // ========================================
    // USER
    // ========================================
    const userInfo =
      localStorage.getItem(
        "userInfo"
      );

    const user =
      userInfo
        ? JSON.parse(userInfo)
        : null;


    // ========================================
    // STATES
    // ========================================
    const [loading, setLoading] =
      useState(false);

    const [refreshing, setRefreshing] =
      useState(false);

    const [

      recentGuidanceRequests,

      setRecentGuidanceRequests,

    ] = useState<GuidanceRequest[]>(
      []
    );

    const [

      students,

      setStudents,

    ] = useState<Student[]>(
      []
    );

    const [

      alumniStats,

      setAlumniStats,

    ] = useState({

      studentsHelped: 0,

      jobsPosted: 0,

      eventsOrganized: 0,

      mentorshipSessions: 0,

      contributionScore: 0,

    });


    // ========================================
    // CONTRIBUTION LEVEL
    // ========================================
    const contributionLevel =

      alumniStats.contributionScore > 1000
        ? "Platinum"

        : alumniStats.contributionScore > 700
        ? "Gold"

        : "Silver";


    // ========================================
    // FETCH DASHBOARD DATA
    // ========================================
    const fetchDashboardData =
      async () => {

        try {

          setLoading(true);

          const usersResponse =
            await api.get(
              "/users"
            );

          const allUsers =
            usersResponse.data || [];


          const studentUsers =
            allUsers.filter(
              (u: Student) =>

                u.role ===
                "student"
            );


          setStudents(
            studentUsers.slice(0, 6)
          );


          let jobsCount = 0;

          let eventsCount = 0;

          let mentorshipCount = 0;


          try {

            const jobsResponse =
              await api.get(
                "/jobs"
              );

            jobsCount =
              jobsResponse.data?.length || 0;

          }

          catch (error) {

            console.log(error);

          }


          try {

            const eventsResponse =
              await api.get(
                "/events"
              );

            eventsCount =
              eventsResponse.data?.length || 0;

          }

          catch (error) {

            console.log(error);

          }


          try {

            const mentorshipResponse =
              await api.get(
                "/mentorship"
              );

            mentorshipCount =
              mentorshipResponse.data?.length || 0;

          }

          catch (error) {

            console.log(error);

          }


          try {

            const guidanceResponse =
              await api.get(
                "/guidance"
              );

            setRecentGuidanceRequests(

              guidanceResponse.data
                ?.slice(0, 5) || []

            );

          }

          catch (error) {

            console.log(error);

          }


          setAlumniStats({

            studentsHelped:
              studentUsers.length,

            jobsPosted:
              jobsCount,

            eventsOrganized:
              eventsCount,

            mentorshipSessions:
              mentorshipCount,

            contributionScore:
              user?.trustScore ||
              850,

          });

        }

        catch (error) {

          console.log(error);

          toast({

            title:
              "Dashboard Error",

            description:
              "Unable to load dashboard data",

            variant:
              "destructive",

          });

        }

        finally {

          setLoading(false);

        }

      };


    // ========================================
    // REFRESH
    // ========================================
    const refreshDashboard =
      async () => {

        setRefreshing(true);

        await fetchDashboardData();

        setRefreshing(false);

      };


    // ========================================
    // INITIAL LOAD
    // ========================================
    useEffect(() => {

      fetchDashboardData();

    }, []);


    // ========================================
    // SOCKET
    // ========================================
    useEffect(() => {

      if (!socket)
        return;

      socket.on(

        "newGuidanceRequest",

        () => {

          fetchDashboardData();

        }

      );

      return () => {

        socket.off(
          "newGuidanceRequest"
        );

      };

    }, [socket]);


    // ========================================
    // LOADING
    // ========================================
    if (loading) {

      return (

        <div className="min-h-screen bg-background">

          <Header />

          <div className="h-[80vh] flex items-center justify-center">

            <div className="text-center">

              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />

              <h2 className="text-3xl font-bold">

                Loading Dashboard...

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

        <main className="max-w-7xl mx-auto px-4 py-8">


          {/* HERO */}
          <div className="mb-10">

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-purple-600 to-indigo-700 text-white shadow-2xl">

              <div className="absolute inset-0 bg-black/10" />

              <div className="relative p-8 md:p-10">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                  <div>

                    <div className="flex items-center gap-4 mb-5">

                      <div className="h-20 w-20 rounded-3xl bg-white/20 flex items-center justify-center">

                        <Sparkles className="h-10 w-10" />

                      </div>

                      <div>

                        <h1 className="text-4xl md:text-5xl font-bold">

                          Welcome,
                          {" "}
                          {user?.name}

                        </h1>

                        <p className="text-white/90 mt-2 text-lg">

                          Empowering students through mentorship and opportunities

                        </p>

                      </div>

                    </div>


                    <div className="flex flex-wrap gap-3">

                      <Badge className="bg-white/20 border-0 text-white px-4 py-2">

                        {contributionLevel} Mentor

                      </Badge>

                      <Badge className="bg-white/20 border-0 text-white px-4 py-2">

                        <ShieldCheck className="h-3 w-3 mr-1" />

                        Trusted Alumni

                      </Badge>

                      <Badge className="bg-white/20 border-0 text-white px-4 py-2">

                        <TrendingUp className="h-3 w-3 mr-1" />

                        Active Contributor

                      </Badge>

                    </div>

                  </div>


                  <div className="flex flex-col items-center gap-4">

                    <ContributionBadge
                      points={
                        alumniStats.contributionScore
                      }
                      size="lg"
                    />

                    <Button
                      variant="secondary"
                      onClick={
                        refreshDashboard
                      }
                      className="rounded-2xl"
                    >

                      {refreshing ? (

                        <Loader2 className="h-4 w-4 animate-spin mr-2" />

                      ) : (

                        <RefreshCcw className="h-4 w-4 mr-2" />

                      )}

                      Refresh Dashboard

                    </Button>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">

            <StatsCard
              title="Students Helped"
              value={alumniStats.studentsHelped}
              description="Mentorship & guidance"
              icon={Users}
            />

            <StatsCard
              title="Jobs Posted"
              value={alumniStats.jobsPosted}
              description="Career opportunities"
              icon={Briefcase}
            />

            <StatsCard
              title="Events"
              value={alumniStats.eventsOrganized}
              description="Sessions organized"
              icon={Calendar}
            />

            <StatsCard
              title="Mentorship"
              value={alumniStats.mentorshipSessions}
              description="Sessions completed"
              icon={MessageSquare}
            />

            <StatsCard
              title="Contribution"
              value={alumniStats.contributionScore}
              description={`${contributionLevel} contributor`}
              icon={Trophy}
              gradient
            />

          </div>


          {/* QUICK ACTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6 mb-10">


            <Link to="/alumni/students-directory">

              <Card className="rounded-3xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">

                <CardContent className="p-6 text-center">

                  <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-4">

                    <GraduationCap className="h-8 w-8 text-primary" />

                  </div>

                  <h2 className="font-bold text-lg">

                    Students

                  </h2>

                </CardContent>

              </Card>

            </Link>


            <Link to="/alumni/guidance-requests">

              <Card className="rounded-3xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">

                <CardContent className="p-6 text-center">

                  <div className="h-16 w-16 rounded-3xl bg-purple-100 flex items-center justify-center mx-auto mb-4">

                    <Bell className="h-8 w-8 text-purple-600" />

                  </div>

                  <h2 className="font-bold text-lg">

                    Guidance

                  </h2>

                </CardContent>

              </Card>

            </Link>


            <Link to="/alumni/post-job">

              <Card className="rounded-3xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">

                <CardContent className="p-6 text-center">

                  <div className="h-16 w-16 rounded-3xl bg-green-100 flex items-center justify-center mx-auto mb-4">

                    <Briefcase className="h-8 w-8 text-green-600" />

                  </div>

                  <h2 className="font-bold text-lg">

                    Post Job

                  </h2>

                </CardContent>

              </Card>

            </Link>


            <Link to="/alumni/create-event">

              <Card className="rounded-3xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">

                <CardContent className="p-6 text-center">

                  <div className="h-16 w-16 rounded-3xl bg-blue-100 flex items-center justify-center mx-auto mb-4">

                    <Calendar className="h-8 w-8 text-blue-600" />

                  </div>

                  <h2 className="font-bold text-lg">

                    Events

                  </h2>

                </CardContent>

              </Card>

            </Link>


            <Link to="/alumni/chat">

              <Card className="rounded-3xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">

                <CardContent className="p-6 text-center">

                  <div className="h-16 w-16 rounded-3xl bg-orange-100 flex items-center justify-center mx-auto mb-4">

                    <MessageSquare className="h-8 w-8 text-orange-600" />

                  </div>

                  <h2 className="font-bold text-lg">

                    Chats

                  </h2>

                </CardContent>

              </Card>

            </Link>


            <Link to="/premium">

              <Card className="rounded-3xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">

                <CardContent className="p-6 text-center">

                  <div className="h-16 w-16 rounded-3xl bg-white/20 flex items-center justify-center mx-auto mb-4">

                    <Star className="h-8 w-8" />

                  </div>

                  <h2 className="font-bold text-lg">

                    Premium

                  </h2>

                </CardContent>

              </Card>

            </Link>

          </div>


          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">


              {/* GUIDANCE */}
              <Card className="rounded-3xl shadow-xl border-0">

                <CardHeader>

                  <div className="flex items-center justify-between">

                    <div>

                      <CardTitle>

                        Recent Guidance Requests

                      </CardTitle>

                      <CardDescription>

                        Students seeking mentorship

                      </CardDescription>

                    </div>

                    <Button
                      variant="outline"
                      className="rounded-xl"
                      asChild
                    >

                      <Link to="/alumni/guidance-requests">

                        View All

                        <ArrowRight className="h-4 w-4 ml-2" />

                      </Link>

                    </Button>

                  </div>

                </CardHeader>

                <CardContent className="space-y-4">

                  {recentGuidanceRequests.map((request) => (

                    <div
                      key={request._id}
                      className="p-5 border rounded-3xl flex items-center justify-between hover:bg-muted/40 transition-all"
                    >

                      <div>

                        <h3 className="font-bold text-lg">

                          {request.studentName}

                        </h3>

                        <p className="text-muted-foreground">

                          {request.topic}

                        </p>

                        <div className="flex gap-2 mt-3">

                          <Badge variant="outline">

                            {request.domain}

                          </Badge>

                          <Badge>

                            {request.urgency}

                          </Badge>

                        </div>

                      </div>

                      <Button
                        className="rounded-xl"
                        asChild
                      >

                        <Link to="/alumni/guidance-requests">

                          Open

                        </Link>

                      </Button>

                    </div>

                  ))}

                </CardContent>

              </Card>


              {/* STUDENTS */}
              <Card className="rounded-3xl shadow-xl border-0">

                <CardHeader>

                  <div className="flex items-center justify-between">

                    <div>

                      <CardTitle>

                        Top Students

                      </CardTitle>

                      <CardDescription>

                        Connect with active students

                      </CardDescription>

                    </div>

                    <Button
                      variant="outline"
                      className="rounded-xl"
                      asChild
                    >

                      <Link to="/alumni/students-directory">

                        Explore

                        <ArrowRight className="h-4 w-4 ml-2" />

                      </Link>

                    </Button>

                  </div>

                </CardHeader>

                <CardContent className="space-y-4">

                  {students.map((student) => (

                    <div
                      key={student._id}
                      className="p-5 border rounded-3xl flex items-center justify-between hover:bg-muted/40 transition-all"
                    >

                      <div className="flex items-center gap-4">

                        <Avatar className="h-14 w-14">

                          <AvatarImage
                            src={
                              student.profileImage
                            }
                          />

                          <AvatarFallback>

                            {student.name
                              ?.charAt(0)}

                          </AvatarFallback>

                        </Avatar>

                        <div>

                          <h3 className="font-bold text-lg">

                            {student.name}

                          </h3>

                          <p className="text-muted-foreground">

                            {student.branch || "Student"}

                          </p>

                          <div className="flex flex-wrap gap-2 mt-3">

                            {student.skills
                              ?.slice(0, 4)
                              .map((skill) => (

                                <Badge
                                  key={skill}
                                  variant="outline"
                                >

                                  {skill}

                                </Badge>

                              ))}

                          </div>

                        </div>

                      </div>

                      <div className="flex flex-col gap-2">

                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl"
                          onClick={() =>

                            navigate(
                              `/profile/${student._id}`
                            )

                          }
                        >

                          View

                        </Button>

                        <Button
                          size="sm"
                          className="rounded-xl"
                          onClick={() =>

                            navigate(
                              `/alumni/chat/${student._id}`
                            )

                          }
                        >

                          Chat

                        </Button>

                      </div>

                    </div>

                  ))}

                </CardContent>

              </Card>

            </div>


            {/* RIGHT */}
            <div className="space-y-6">


              {/* AI INSIGHTS */}
              <Card className="rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-2xl border-0">

                <CardContent className="p-6">

                  <div className="h-16 w-16 rounded-3xl bg-white/20 flex items-center justify-center mb-5">

                    <Brain className="h-8 w-8" />

                  </div>

                  <h2 className="text-2xl font-bold mb-3">

                    AI Insights

                  </h2>

                  <p className="text-white/90 leading-7">

                    AI/ML and Full Stack students are the most active this week.
                    Mentorship engagement has increased by 32%.

                  </p>

                </CardContent>

              </Card>


              {/* COMMUNITY */}
              <Card className="rounded-3xl shadow-xl border-0">

                <CardHeader>

                  <CardTitle>

                    Community Activity

                  </CardTitle>

                </CardHeader>

                <CardContent className="space-y-5">

                  <div className="flex items-center gap-4">

                    <div className="h-12 w-12 rounded-2xl bg-green-100 flex items-center justify-center">

                      <Activity className="h-5 w-5 text-green-600" />

                    </div>

                    <div>

                      <p className="font-semibold">

                        12 New Students Joined

                      </p>

                      <p className="text-sm text-muted-foreground">

                        Today

                      </p>

                    </div>

                  </div>


                  <div className="flex items-center gap-4">

                    <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center">

                      <Briefcase className="h-5 w-5 text-blue-600" />

                    </div>

                    <div>

                      <p className="font-semibold">

                        5 New Jobs Posted

                      </p>

                      <p className="text-sm text-muted-foreground">

                        This Week

                      </p>

                    </div>

                  </div>


                  <div className="flex items-center gap-4">

                    <div className="h-12 w-12 rounded-2xl bg-purple-100 flex items-center justify-center">

                      <Calendar className="h-5 w-5 text-purple-600" />

                    </div>

                    <div>

                      <p className="font-semibold">

                        3 Upcoming Events

                      </p>

                      <p className="text-sm text-muted-foreground">

                        Alumni Community

                      </p>

                    </div>

                  </div>

                </CardContent>

              </Card>


              {/* QUICK ACTIONS */}
              <Card className="rounded-3xl shadow-xl border-0">

                <CardHeader>

                  <CardTitle>

                    Quick Actions

                  </CardTitle>

                </CardHeader>

                <CardContent className="space-y-3">

                  <Button
                    className="w-full justify-start rounded-2xl"
                    asChild
                  >

                    <Link to="/alumni/post-job">

                      <Plus className="mr-2 h-4 w-4" />

                      Post New Job

                    </Link>

                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start rounded-2xl"
                    asChild
                  >

                    <Link to="/alumni/create-event">

                      <Calendar className="mr-2 h-4 w-4" />

                      Organize Event

                    </Link>

                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start rounded-2xl"
                    asChild
                  >

                    <Link to="/alumni/chat">

                      <MessageSquare className="mr-2 h-4 w-4" />

                      Open Chats

                    </Link>

                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start rounded-2xl"
                    asChild
                  >

                    <Link to="/alumni/guidance-requests">

                      <Target className="mr-2 h-4 w-4" />

                      Mentorship Requests

                    </Link>

                  </Button>

                </CardContent>

              </Card>


              {/* ACTIVITY STATUS */}
              <Card className="rounded-3xl shadow-xl border-0">

                <CardHeader>

                  <CardTitle>

                    Activity Status

                  </CardTitle>

                </CardHeader>

                <CardContent className="space-y-4">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <Clock className="h-5 w-5 text-primary" />

                      <span>

                        Last Active

                      </span>

                    </div>

                    <Badge>

                      Today

                    </Badge>

                  </div>

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <Trophy className="h-5 w-5 text-yellow-500" />

                      <span>

                        Mentor Rank

                      </span>

                    </div>

                    <Badge variant="secondary">

                      {contributionLevel}

                    </Badge>

                  </div>

                </CardContent>

              </Card>

            </div>

          </div>

        </main>

      </div>

    );

  };


export default AlumniDashboard;