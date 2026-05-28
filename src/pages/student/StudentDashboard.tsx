import { Header } from '@/components/layout/Header';

import {
  useEffect,
  useState,
} from 'react';

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
  CardTitle
} from '@/components/ui/card';

import { Badge }
  from '@/components/ui/badge';

import {

  Users,
  Briefcase,
  Calendar,
  Trophy,
  MessageSquare,
  Bell,
  Search,
  ClipboardList,
  Zap,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Star,
  Brain,

} from 'lucide-react';

import {
  Link,
} from 'react-router-dom';


// =====================================
// COMPONENT
// =====================================
export const StudentDashboard =
  () => {

    // =====================================
    // USER INFO
    // =====================================
    const userInfo =
      localStorage.getItem(
        "userInfo"
      );

    const user =
      userInfo
        ? JSON.parse(userInfo)
        : null;


    // =====================================
    // STATES
    // =====================================
    const [
      applicationsSent,
      setApplicationsSent,
    ] = useState<number>(0);

    const [
      eventAttendances,
      setEventAttendances,
    ] = useState<number>(0);

    const [
      mentorshipSessions,
      setMentorshipSessions,
    ] = useState<number>(0);

    const [
      achievementPoints,
      setAchievementPoints,
    ] = useState<number>(0);


    // =====================================
    // FETCH DASHBOARD STATS
    // =====================================
    const fetchStats =
      async () => {

        try {

          const token =
            user?.token;

          const headers =
            token
              ? {
                  Authorization:
                    `Bearer ${token}`,
                }
              : {};


          // =====================
          // JOBS
          // =====================
          const jobsRes =
            await fetch(
              "http://localhost:5000/jobs",
              { headers }
            );

          const jobs =
            await jobsRes.json();

          let appsCount = 0;

          if (
            Array.isArray(jobs)
          ) {

            for (const job of jobs) {

              if (
                Array.isArray(
                  job.applications
                )
              ) {

                appsCount +=
                  job.applications.filter(
                    (a: any) => {

                      const sid =
                        typeof a.student ===
                        "string"

                          ? a.student

                          : a.student?._id;

                      return (
                        sid ===
                        user?._id
                      );

                    }
                  ).length;

              }

            }

          }

          setApplicationsSent(
            appsCount
          );


          // =====================
          // EVENTS
          // =====================
          const eventsRes =
            await fetch(
              "http://localhost:5000/events",
              { headers }
            );

          const events =
            await eventsRes.json();

          let attended = 0;

          if (
            Array.isArray(events)
          ) {

            for (const ev of events) {

              if (
                Array.isArray(
                  ev.attendees
                )
              ) {

                attended +=
                  ev.attendees.filter(
                    (at: any) => {

                      const sid =
                        typeof at.student ===
                        "string"

                          ? at.student

                          : at.student?._id;

                      return (
                        sid ===
                        user?._id
                      );

                    }
                  ).length;

              }

            }

          }

          setEventAttendances(
            attended
          );


          // =====================
          // MENTORSHIPS
          // =====================
          const mentorshipRes =
            await fetch(
              "http://localhost:5000/mentorship",
              { headers }
            );

          const mentorships =
            await mentorshipRes.json();

          const mentorCount =
            Array.isArray(
              mentorships
            )

              ? mentorships.filter(
                  (m: any) => {

                    const sid =
                      typeof m.student ===
                      "string"

                        ? m.student

                        : m.student?._id;

                    return (

                      sid ===
                        user?._id &&

                      m.status ===
                        "Accepted"

                    );

                  }
                ).length

              : 0;

          setMentorshipSessions(
            mentorCount
          );


          // =====================
          // ACHIEVEMENT SCORE
          // =====================
          const points =

            appsCount * 5 +

            attended * 3 +

            mentorCount * 10 +

            (user?.trustScore || 0);

          setAchievementPoints(
            points
          );

        }

        catch (err) {

          console.error(
            "Dashboard Error:",
            err
          );

        }

      };


    // =====================================
    // INITIAL LOAD
    // =====================================
    useEffect(() => {

      fetchStats();

    }, []);


    // =====================================
    // QUICK ACTIONS
    // =====================================
    const quickLinks = [

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
          "Get career guidance",

        icon:
          MessageSquare,

        color:
          "bg-purple-100 text-purple-600",

        link:
          "/student/mentorship",
      },

      {
        title:
          "Search",

        description:
          "Find users",

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
          "/student/my-guidance",
      },

      {
        title:
          "AI Chatbot",

        description:
          "AI career assistant",

        icon:
          Brain,

        color:
          "bg-violet-100 text-violet-600",

        link:
          "/student/ai-chat",
      },

    ];


    return (

      <div className="min-h-screen bg-background">

        <Header />

        <main className="max-w-7xl mx-auto px-4 py-6">


          {/* HERO SECTION */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-purple-600 to-indigo-600 text-white shadow-2xl mb-10">

            <div className="absolute inset-0 bg-black/10" />

            <div className="relative p-8 md:p-10">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                <div>

                  <div className="flex items-center gap-3 mb-4">

                    <Sparkles className="h-8 w-8 text-yellow-300" />

                    <Badge className="bg-white/20 text-white border-0">

                      Student Dashboard

                    </Badge>

                  </div>

                  <h1 className="text-4xl md:text-5xl font-bold leading-tight">

                    Welcome back,
                    {" "}
                    {user?.name || "Student"} 👋

                  </h1>

                  <p className="text-white/90 mt-4 text-lg max-w-2xl">

                    Track your mentorships, applications, events, and connect with alumni mentors using AlumniConnect AI ecosystem.

                  </p>

                  <div className="flex gap-4 mt-6">

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

                  </div>

                </div>


                {/* CONTRIBUTION */}
                <div className="flex justify-center">

                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center border border-white/20">

                    <ContributionBadge
                      points={achievementPoints}
                      size="lg"
                    />

                    <p className="mt-4 text-white/90">

                      Achievement Score

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

            <StatsCard
              title="Applications"
              value={applicationsSent}
              description="Jobs & internships applied"
              icon={Briefcase}
              trend={{
                value:
                  applicationsSent > 0
                    ? 20
                    : 0,

                label:
                  "this month",

                isPositive:
                  true,
              }}
            />


            <StatsCard
              title="Events Joined"
              value={eventAttendances}
              description="Workshops & networking"
              icon={Calendar}
              trend={{
                value:
                  eventAttendances > 0
                    ? 12
                    : 0,

                label:
                  "this month",

                isPositive:
                  true,
              }}
            />


            <StatsCard
              title="Mentorships"
              value={mentorshipSessions}
              description="Guidance sessions"
              icon={MessageSquare}
              trend={{
                value:
                  mentorshipSessions > 0
                    ? 30
                    : 0,

                label:
                  "growth",

                isPositive:
                  true,
              }}
            />


            <StatsCard
              title="Achievement Points"
              value={achievementPoints}
              description="Your engagement score"
              icon={Trophy}
              gradient
            />

          </div>


          {/* QUICK LINKS */}
          <div className="mb-10">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-3xl font-bold">

                  Quick Access

                </h2>

                <p className="text-muted-foreground mt-1">

                  Explore all student features instantly

                </p>

              </div>

            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">

              {quickLinks.map(
                (item, index) => (

                  <Link
                    key={index}
                    to={item.link}
                  >

                    <Card className="group shadow-xl rounded-3xl border-0 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">

                      <CardContent className="p-6">

                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-5 ${item.color}`}>

                          <item.icon className="h-7 w-7" />

                        </div>

                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">

                          {item.title}

                        </h3>

                        <p className="text-muted-foreground">

                          {item.description}

                        </p>

                      </CardContent>

                    </Card>

                  </Link>

                )
              )}

            </div>

          </div>


          {/* BOTTOM SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


            {/* ACTIVITY */}
            <Card className="lg:col-span-2 shadow-xl rounded-3xl border-0">

              <CardHeader>

                <CardTitle className="flex items-center gap-2 text-2xl">

                  <TrendingUp className="h-6 w-6 text-primary" />

                  Activity Overview

                </CardTitle>

                <CardDescription>

                  Your recent engagement and progress

                </CardDescription>

              </CardHeader>


              <CardContent className="space-y-5">

                <div className="flex items-center justify-between p-5 rounded-2xl bg-primary/5">

                  <div>

                    <h3 className="font-semibold text-lg">

                      Applications Submitted

                    </h3>

                    <p className="text-muted-foreground">

                      Keep applying to opportunities

                    </p>

                  </div>

                  <Badge className="text-lg px-4 py-2">

                    {applicationsSent}

                  </Badge>

                </div>


                <div className="flex items-center justify-between p-5 rounded-2xl bg-green-50">

                  <div>

                    <h3 className="font-semibold text-lg">

                      Events Participation

                    </h3>

                    <p className="text-muted-foreground">

                      Build your professional network

                    </p>

                  </div>

                  <Badge className="bg-green-600 text-lg px-4 py-2">

                    {eventAttendances}

                  </Badge>

                </div>


                <div className="flex items-center justify-between p-5 rounded-2xl bg-purple-50">

                  <div>

                    <h3 className="font-semibold text-lg">

                      Mentorship Sessions

                    </h3>

                    <p className="text-muted-foreground">

                      Learn directly from alumni mentors

                    </p>

                  </div>

                  <Badge className="bg-purple-600 text-lg px-4 py-2">

                    {mentorshipSessions}

                  </Badge>

                </div>

              </CardContent>

            </Card>


            {/* AI CARD */}
            <Card className="shadow-xl rounded-3xl border-0 bg-gradient-to-br from-violet-600 to-indigo-700 text-white overflow-hidden">

              <CardContent className="p-8">

                <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">

                  <Brain className="h-8 w-8" />

                </div>

                <h2 className="text-3xl font-bold mb-3">

                  AI Career Assistant

                </h2>

                <p className="text-white/90 leading-7 mb-6">

                  Get resume tips, interview preparation, career roadmaps, and mentorship guidance instantly using AI.

                </p>

                <Button
                  className="w-full bg-white text-primary hover:bg-white/90"
                  size="lg"
                  asChild
                >

                  <Link to="/student/ai-chat">

                    Open AI Assistant

                  </Link>

                </Button>

              </CardContent>

            </Card>

          </div>

        </main>

      </div>

    );

  };