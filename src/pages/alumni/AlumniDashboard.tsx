import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

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

import { Badge }
  from "@/components/ui/badge";

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

} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useToast }
  from "@/hooks/use-toast";


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

}


// ==========================================
// COMPONENT
// ==========================================
export const AlumniDashboard = () => {

  // ========================================
  // HOOKS
  // ========================================
  const navigate =
    useNavigate();

  const { toast } =
    useToast();


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

    contributionScore: 0,

  });


  // ========================================
  // FETCH DASHBOARD DATA
  // ========================================
  const fetchDashboardData =
    async () => {

      try {

        setLoading(true);

        const token =
          user?.token;

        // ====================================
        // FETCH USERS
        // ====================================
        const usersResponse =
          await axios.get(

            "http://localhost:5000/users",

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }

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
          studentUsers.slice(0, 5)
        );


        // ====================================
        // FETCH JOBS
        // ====================================
        let jobsCount = 0;

        try {

          const jobsResponse =
            await axios.get(

              "http://localhost:5000/jobs",

              {

                headers: {

                  Authorization:
                    `Bearer ${token}`,

                },

              }

            );

          jobsCount =
            jobsResponse.data
              ?.length || 0;

        }

        catch (error) {

          console.log(
            "Jobs fetch error:",
            error
          );

        }


        // ====================================
        // FETCH EVENTS
        // ====================================
        let eventsCount = 0;

        try {

          const eventsResponse =
            await axios.get(

              "http://localhost:5000/events",

              {

                headers: {

                  Authorization:
                    `Bearer ${token}`,

                },

              }

            );

          eventsCount =
            eventsResponse.data
              ?.length || 0;

        }

        catch (error) {

          console.log(
            "Events fetch error:",
            error
          );

        }


        // ====================================
        // FETCH GUIDANCE REQUESTS
        // ====================================
        try {

          const guidanceResponse =
            await axios.get(

              "http://localhost:5000/guidance",

              {

                headers: {

                  Authorization:
                    `Bearer ${token}`,

                },

              }

            );

          setRecentGuidanceRequests(

            guidanceResponse.data
              ?.slice(0, 5) || []

          );

        }

        catch (error) {

          console.log(
            "Guidance fetch error:",
            error
          );

        }


        // ====================================
        // SET STATS
        // ====================================
        setAlumniStats({

          studentsHelped:
            studentUsers.length,

          jobsPosted:
            jobsCount,

          eventsOrganized:
            eventsCount,

          contributionScore:
            user?.trustScore ||
            850,

        });

      }

      catch (error) {

        console.log(error);

        toast({

          title:
            "Failed to load dashboard",

          variant:
            "destructive",

        });

      }

      finally {

        setLoading(false);

      }

    };


  // ========================================
  // INITIAL LOAD
  // ========================================
  useEffect(() => {

    fetchDashboardData();

  }, []);


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

          <div className="flex items-center justify-between flex-wrap gap-4">

            <div>

              <h1 className="text-3xl font-bold text-foreground mb-2">

                Welcome back,
                {" "}
                {user?.name || "Alumni"}!

              </h1>

              <p className="text-muted-foreground">

                Your personalized alumni dashboard powered by AlumniConnect

              </p>

            </div>


            <ContributionBadge
              points={alumniStats.contributionScore}
              size="lg"
            />

          </div>

        </div>


        {/* ================================= */}
        {/* LOADING */}
        {/* ================================= */}

        {loading && (

          <div className="flex items-center justify-center py-10">

            <Loader2 className="h-8 w-8 animate-spin text-primary" />

          </div>

        )}


        {/* ================================= */}
        {/* STATS */}
        {/* ================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <StatsCard
            title="Students Helped"
            value={alumniStats.studentsHelped}
            description="Direct mentorship & guidance"
            icon={Users}
            trend={{

              value: 15,

              label: "this month",

              isPositive: true,

            }}
          />


          <StatsCard
            title="Jobs Posted"
            value={alumniStats.jobsPosted}
            description="Opportunities created"
            icon={Briefcase}
            trend={{

              value: 33,

              label: "this month",

              isPositive: true,

            }}
          />


          <StatsCard
            title="Events Organized"
            value={alumniStats.eventsOrganized}
            description="Knowledge sharing sessions"
            icon={Calendar}
            trend={{

              value: 100,

              label: "this month",

              isPositive: true,

            }}
          />


          <StatsCard
            title="Contribution Score"
            value={alumniStats.contributionScore}
            description="Gold level contributor"
            icon={Trophy}
            gradient
          />

        </div>


        {/* ================================= */}
        {/* QUICK LINKS */}
        {/* ================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">

          {/* STUDENTS DIRECTORY */}
          <Link to="/alumni/students-directory">

            <Card className="shadow-soft hover:shadow-medium transition-all cursor-pointer h-full bg-gradient-card">

              <CardContent className="pt-6 text-center">

                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">

                  <GraduationCap className="h-6 w-6 text-primary" />

                </div>

                <h3 className="font-semibold mb-2">

                  Students Directory

                </h3>

                <p className="text-sm text-muted-foreground">

                  Browse talented students

                </p>

              </CardContent>

            </Card>

          </Link>


          {/* GUIDANCE */}
          <Link to="/alumni/guidance-requests">

            <Card className="shadow-soft hover:shadow-medium transition-all cursor-pointer h-full bg-gradient-card border-primary/20">

              <CardContent className="pt-6 text-center">

                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">

                  <Bell className="h-6 w-6 text-purple-600" />

                </div>

                <h3 className="font-semibold mb-2">

                  Guidance Requests

                </h3>

                <p className="text-sm text-muted-foreground">

                  Manage student requests

                </p>

              </CardContent>

            </Card>

          </Link>


          {/* JOB */}
          <Link to="/alumni/post-job">

            <Card className="shadow-soft hover:shadow-medium transition-all cursor-pointer h-full bg-gradient-card">

              <CardContent className="pt-6 text-center">

                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">

                  <Briefcase className="h-6 w-6 text-accent" />

                </div>

                <h3 className="font-semibold mb-2">

                  Post Job

                </h3>

                <p className="text-sm text-muted-foreground">

                  Create job openings

                </p>

              </CardContent>

            </Card>

          </Link>


          {/* EVENT */}
          <Link to="/alumni/create-event">

            <Card className="shadow-soft hover:shadow-medium transition-all cursor-pointer h-full bg-gradient-card">

              <CardContent className="pt-6 text-center">

                <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">

                  <Calendar className="h-6 w-6 text-success" />

                </div>

                <h3 className="font-semibold mb-2">

                  Create Event

                </h3>

                <p className="text-sm text-muted-foreground">

                  Organize workshops

                </p>

              </CardContent>

            </Card>

          </Link>


          {/* CHAT */}
          <Link to="/alumni/chat">

            <Card className="shadow-soft hover:shadow-medium transition-all cursor-pointer h-full bg-gradient-card">

              <CardContent className="pt-6 text-center">

                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">

                  <MessageSquare className="h-6 w-6 text-blue-600" />

                </div>

                <h3 className="font-semibold mb-2">

                  Student Chats

                </h3>

                <p className="text-sm text-muted-foreground">

                  Chat with students directly

                </p>

              </CardContent>

            </Card>

          </Link>


          {/* PREMIUM */}
          <Link to="/premium">

            <Card className="shadow-soft hover:shadow-medium transition-all cursor-pointer h-full bg-gradient-primary text-white">

              <CardContent className="pt-6 text-center">

                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">

                  <Star className="h-6 w-6 text-white" />

                </div>

                <h3 className="font-semibold mb-2">

                  Go Premium

                </h3>

                <p className="text-sm opacity-90">

                  Unlock features

                </p>

              </CardContent>

            </Card>

          </Link>

        </div>


        {/* ================================= */}
        {/* MAIN SECTION */}
        {/* ================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* GUIDANCE REQUESTS */}
            <Card className="shadow-soft border-primary/20">

              <CardHeader>

                <CardTitle className="flex items-center space-x-2">

                  <Bell className="h-5 w-5 text-primary" />

                  <span>

                    Recent Guidance Requests

                  </span>

                </CardTitle>

                <CardDescription>

                  Students requesting mentorship and guidance

                </CardDescription>

              </CardHeader>


              <CardContent className="space-y-4">

                {recentGuidanceRequests.length === 0 ? (

                  <p className="text-muted-foreground text-sm">

                    No guidance requests found

                  </p>

                ) : (

                  recentGuidanceRequests.map((request) => (

                    <div
                      key={request._id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-gradient-card"
                    >

                      <div>

                        <h3 className="font-semibold">

                          {request.studentName}

                        </h3>

                        <p className="text-sm text-muted-foreground">

                          {request.topic}

                        </p>

                        <div className="flex items-center gap-2 mt-2">

                          <Badge variant="outline">

                            {request.domain}

                          </Badge>

                          <Badge>

                            {request.urgency}

                          </Badge>

                        </div>

                      </div>


                      <Button
                        size="sm"
                        asChild
                      >

                        <Link to="/alumni/guidance-requests">

                          View

                        </Link>

                      </Button>

                    </div>

                  ))

                )}

              </CardContent>

            </Card>


            {/* STUDENTS */}
            <Card className="shadow-soft">

              <CardHeader>

                <CardTitle className="flex items-center space-x-2">

                  <GraduationCap className="h-5 w-5" />

                  <span>

                    Talented Students Looking for Opportunities

                  </span>

                </CardTitle>

                <CardDescription>

                  Browse students by skills and connect with potential candidates

                </CardDescription>

              </CardHeader>


              <CardContent className="space-y-4">

                {students.length === 0 ? (

                  <p className="text-muted-foreground text-sm">

                    No students found

                  </p>

                ) : (

                  students.map((student) => (

                    <div
                      key={student._id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-gradient-card"
                    >

                      <div>

                        <h3 className="font-semibold">

                          {student.name}

                        </h3>

                        <p className="text-sm text-muted-foreground">

                          {student.branch || "Student"}

                        </p>

                        <div className="flex flex-wrap gap-1 mt-2">

                          {student.skills
                            ?.slice(0, 4)
                            .map((skill) => (

                              <Badge
                                key={skill}
                                variant="outline"
                                className="text-xs"
                              >

                                {skill}

                              </Badge>

                            ))}

                        </div>

                      </div>


                      <div className="flex flex-col gap-2">

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>

                            navigate(

                              `/profile/${student._id}`

                            )

                          }
                        >

                          View Profile

                        </Button>


                        <Button
                          size="sm"
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

                  ))

                )}

              </CardContent>

            </Card>

          </div>


          {/* RIGHT */}
          <div className="space-y-6">

            {/* QUICK ACTIONS */}
            <Card className="shadow-soft">

              <CardHeader>

                <CardTitle>

                  Quick Actions

                </CardTitle>

              </CardHeader>


              <CardContent className="space-y-3">

                <Button
                  className="w-full justify-start"
                  asChild
                >

                  <Link to="/alumni/post-job">

                    <Plus className="mr-2 h-4 w-4" />

                    Post New Job

                  </Link>

                </Button>


                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >

                  <Link to="/alumni/create-event">

                    <Calendar className="mr-2 h-4 w-4" />

                    Organize Event

                  </Link>

                </Button>


                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >

                  <Link to="/alumni/guidance-requests">

                    <Bell className="mr-2 h-4 w-4" />

                    View Guidance Requests

                  </Link>

                </Button>


                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >

                  <Link to="/alumni/chat">

                    <MessageSquare className="mr-2 h-4 w-4" />

                    Open Chats

                  </Link>

                </Button>

              </CardContent>

            </Card>

          </div>

        </div>

      </main>

    </div>

  );

};