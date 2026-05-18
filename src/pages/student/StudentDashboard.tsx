import { Header } from '@/components/layout/Header';
import { useEffect, useState } from 'react';
import { StatsCard } from '@/components/common/StatsCard';
import { ContributionBadge } from '@/components/common/ContributionBadge';

import { Button } from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

import {
  Users,
  Briefcase,
  Calendar,
  Trophy,
  MessageSquare,
  User,
  MapPin,
  TrendingUp,
  Zap,
  Bell,
  Search,
  ClipboardList
} from 'lucide-react';

import { Link } from 'react-router-dom';


export const StudentDashboard = () => {

  // GET LOGGED IN USER
  const userInfo = localStorage.getItem("userInfo");
  const user = userInfo ? JSON.parse(userInfo) : null;

  // REAL DATA (fetched)
  const [applicationsSent, setApplicationsSent] = useState<number>(0);
  const [eventAttendances, setEventAttendances] = useState<number>(0);
  const [mentorshipSessions, setMentorshipSessions] = useState<number>(0);
  const [achievementPoints, setAchievementPoints] = useState<number>(0);

  // fetch counts from backend
  const fetchStats = async () => {
    try {
      const token = user?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Jobs -> count applications by this student
      const jobsRes = await fetch("http://localhost:5000/jobs", { headers });
      const jobs = await jobsRes.json();
      let appsCount = 0;
      if (Array.isArray(jobs)) {
        for (const job of jobs) {
          if (Array.isArray(job.applications)) {
            appsCount += job.applications.filter((a: any) => {
              const sid = typeof a.student === 'string' ? a.student : a.student?._id;
              return sid === user?._id;
            }).length;
          }
        }
      }
      setApplicationsSent(appsCount);

      // Events -> count attendee entries
      const eventsRes = await fetch("http://localhost:5000/events", { headers });
      const events = await eventsRes.json();
      let attended = 0;
      if (Array.isArray(events)) {
        for (const ev of events) {
          if (Array.isArray(ev.attendees)) {
            attended += ev.attendees.filter((at: any) => {
              const sid = typeof at.student === 'string' ? at.student : at.student?._id;
              return sid === user?._id;
            }).length;
          }
        }
      }
      setEventAttendances(attended);

      // Mentorships -> fetch mentorships for student
      const mentorshipRes = await fetch("http://localhost:5000/mentorship", { headers });
      const mentorships = await mentorshipRes.json();
      const mentorCount = Array.isArray(mentorships)
        ? mentorships.filter((m: any) => {
            const sid = typeof m.student === 'string' ? m.student : m.student?._id;
            return sid === user?._id && m.status === 'Accepted';
          }).length
        : 0;
      setMentorshipSessions(mentorCount);

      // Compute achievement points (simple formula)
      const points = appsCount * 5 + attended * 3 + mentorCount * 10 + (user?.trustScore || 0);
      setAchievementPoints(points);
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);


  const mockAlumni = [
    {
      id: '1',
      name: 'Sarah Chen',
      position: 'Senior Software Engineer',
      company: 'Google',
      contributionScore: 850,
      expertise: ['React', 'Node.js', 'AI/ML'],
      location: 'San Francisco, CA',
      isStartupFounder: false,
      helpedStudents: 25,
    },

    {
      id: '2',
      name: 'Michael Rodriguez',
      position: 'Founder & CEO',
      company: 'TechStart Inc.',
      contributionScore: 1200,
      expertise: [
        'Entrepreneurship',
        'Product Management',
        'Marketing'
      ],
      location: 'Austin, TX',
      isStartupFounder: true,
      helpedStudents: 40,
    },

    {
      id: '3',
      name: 'Dr. Priya Patel',
      position: 'Principal Data Scientist',
      company: 'Microsoft',
      contributionScore: 650,
      expertise: [
        'Data Science',
        'Machine Learning',
        'Python'
      ],
      location: 'Seattle, WA',
      isStartupFounder: false,
      helpedStudents: 18,
    },
  ];


  const recentJobs = [
    {
      id: '1',
      title: 'Frontend Developer Intern',
      company: 'Stripe',
      location: 'Remote',
      type: 'Internship',
    },

    {
      id: '2',
      title: 'Full Stack Developer',
      company: 'TechStart Inc.',
      location: 'Austin, TX',
      type: 'Full-time',
    },
  ];


  const upcomingEvents = [
    {
      id: '1',
      title: 'AI/ML Career Workshop',
      organizer: 'Dr. Priya Patel',
      attendees: 45,
    },

    {
      id: '2',
      title: 'Startup Networking Mixer',
      organizer: 'Michael Rodriguez',
      attendees: 28,
    },
  ];


  return (

    <div className="min-h-screen bg-background">

      <Header />

      <main className="container mx-auto px-4 py-6">

        {/* WELCOME SECTION */}

        <div className="mb-8">

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-3xl font-bold text-foreground mb-2">

                Welcome back,
                {" "}
                {user?.name || "Student"}!

              </h1>

              <p className="text-muted-foreground">

                Your personalized student dashboard powered by AlumniConnect

              </p>

            </div>

            <div className="flex items-center space-x-2">

              <ContributionBadge
                points={achievementPoints}
                size="lg"
              />

            </div>

          </div>

        </div>


        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <StatsCard
            title="Applications Sent"
            value={applicationsSent}
            description="Job & internship applications"
            icon={Briefcase}
            trend={{
              value: applicationsSent > 0 ? Math.round((applicationsSent / Math.max(1, applicationsSent)) * 25) : 0,
              label: 'this month',
              isPositive: true
            }}
          />

          <StatsCard
            title="Events Attended"
            value={eventAttendances}
            description="Workshops & networking events"
            icon={Calendar}
            trend={{
              value: eventAttendances > 0 ? 12 : 0,
              label: 'this month',
              isPositive: true
            }}
          />

          <StatsCard
            title="Mentorship Sessions"
            value={mentorshipSessions}
            description="One-on-one guidance sessions"
            icon={MessageSquare}
            trend={{
              value: mentorshipSessions > 0 ? 50 : 0,
              label: 'this month',
              isPositive: true
            }}
          />

          <StatsCard
            title="Achievement Points"
            value={achievementPoints}
            description="Bronze level contributor"
            icon={Trophy}
            gradient
          />

        </div>


        {/* QUICK LINKS */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-6 mb-8">

          {/* Alumni Directory */}

          <Link to="/student/alumni-directory">

            <Card className="shadow-soft hover:shadow-medium transition-all cursor-pointer h-full bg-gradient-card">

              <CardContent className="pt-6 text-center">

                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">

                  <Users className="h-6 w-6 text-primary" />

                </div>

                <h3 className="font-semibold mb-2">

                  Alumni Directory

                </h3>

                <p className="text-sm text-muted-foreground">

                  Browse and connect with alumni

                </p>

              </CardContent>

            </Card>

          </Link>


          {/* Job Board */}

          <Link to="/student/jobs">

            <Card className="shadow-soft hover:shadow-medium transition-all cursor-pointer h-full bg-gradient-card">

              <CardContent className="pt-6 text-center">

                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">

                  <Briefcase className="h-6 w-6 text-accent" />

                </div>

                <h3 className="font-semibold mb-2">

                  Job Board

                </h3>

                <p className="text-sm text-muted-foreground">

                  Explore job opportunities

                </p>

              </CardContent>

            </Card>

          </Link>


          {/* Events */}

          <Link to="/student/events">

            <Card className="shadow-soft hover:shadow-medium transition-all cursor-pointer h-full bg-gradient-card">

              <CardContent className="pt-6 text-center">

                <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">

                  <Calendar className="h-6 w-6 text-success" />

                </div>

                <h3 className="font-semibold mb-2">

                  Events

                </h3>

                <p className="text-sm text-muted-foreground">

                  Join workshops and networking

                </p>

              </CardContent>

            </Card>

          </Link>


          {/* Mentorship */}

          <Link to="/student/mentorship">

            <Card className="shadow-soft hover:shadow-medium transition-all cursor-pointer h-full bg-gradient-card">

              <CardContent className="pt-6 text-center">

                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">

                  <MessageSquare className="h-6 w-6 text-purple-600" />

                </div>

                <h3 className="font-semibold mb-2">

                  Mentorship

                </h3>

                <p className="text-sm text-muted-foreground">

                  Connect with alumni mentors

                </p>

              </CardContent>

            </Card>

          </Link>


          {/* SEARCH USERS */}

          <Link to="/student/search">

            <Card className="shadow-soft hover:shadow-medium transition-all cursor-pointer h-full bg-gradient-card">

              <CardContent className="pt-6 text-center">

                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">

                  <Search className="h-6 w-6 text-orange-600" />

                </div>

                <h3 className="font-semibold mb-2">

                  Search

                </h3>

                <p className="text-sm text-muted-foreground">

                  Find alumni and students

                </p>

              </CardContent>

            </Card>

          </Link>


          {/* NOTIFICATIONS */}

          <Link to="/notifications">

            <Card className="shadow-soft hover:shadow-medium transition-all cursor-pointer h-full bg-gradient-card">

              <CardContent className="pt-6 text-center">

                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">

                  <Bell className="h-6 w-6 text-red-600" />

                </div>

                <h3 className="font-semibold mb-2">

                  Notifications

                </h3>

                <p className="text-sm text-muted-foreground">

                  View updates instantly

                </p>

              </CardContent>

            </Card>

          </Link>


          {/* GUIDANCE */}

          <Link to="/student/mentorship">

            <Card className="shadow-soft hover:shadow-medium transition-all cursor-pointer h-full bg-gradient-card">

              <CardContent className="pt-6 text-center">

                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">

                  <ClipboardList className="h-6 w-6 text-green-600" />

                </div>

                <h3 className="font-semibold mb-2">

                  Guidance

                </h3>

                <p className="text-sm text-muted-foreground">

                  Request mentorship help

                </p>

              </CardContent>

            </Card>

          </Link>


          {/* Chat */}

          <Link to="/student/chat">

            <Card className="shadow-soft hover:shadow-medium transition-all cursor-pointer h-full bg-gradient-card">

              <CardContent className="pt-6 text-center">

                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">

                  <MessageSquare className="h-6 w-6 text-blue-600" />

                </div>

                <h3 className="font-semibold mb-2">

                  Chat

                </h3>

                <p className="text-sm text-muted-foreground">

                  Chat with alumni mentors

                </p>

              </CardContent>

            </Card>

          </Link>

          {/* AI Chatbot */}

          <Link to="/student/ai-chat">

            <Card className="shadow-soft hover:shadow-medium transition-all cursor-pointer h-full bg-gradient-card">

              <CardContent className="pt-6 text-center">

                <div className="h-12 w-12 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-4">

                  <Zap className="h-6 w-6 text-violet-600" />

                </div>

                <h3 className="font-semibold mb-2">

                  AI Chatbot

                </h3>

                <p className="text-sm text-muted-foreground">

                  Ask the AI assistant for guidance

                </p>

              </CardContent>

            </Card>

          </Link>

        </div>

      </main>

    </div>
  );
};