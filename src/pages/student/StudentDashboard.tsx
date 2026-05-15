import { Header } from '@/components/layout/Header';
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
  Zap
} from 'lucide-react';

import { Link } from 'react-router-dom';


export const StudentDashboard = () => {

  // GET LOGGED IN USER
  const userInfo =
    localStorage.getItem("userInfo");

  const user =
    userInfo
      ? JSON.parse(userInfo)
      : null;


  // MOCK DATA
  const studentStats = {
    applicationsSent: 12,
    eventAttendances: 8,
    mentorshipSessions: 3,
    achievementPoints: 150,
  };


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
                points={studentStats.achievementPoints}
                size="lg"
              />

            </div>

          </div>

        </div>


        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <StatsCard
            title="Applications Sent"
            value={studentStats.applicationsSent}
            description="Job & internship applications"
            icon={Briefcase}
            trend={{
              value: 25,
              label: 'this month',
              isPositive: true
            }}
          />

          <StatsCard
            title="Events Attended"
            value={studentStats.eventAttendances}
            description="Workshops & networking events"
            icon={Calendar}
            trend={{
              value: 12,
              label: 'this month',
              isPositive: true
            }}
          />

          <StatsCard
            title="Mentorship Sessions"
            value={studentStats.mentorshipSessions}
            description="One-on-one guidance sessions"
            icon={MessageSquare}
            trend={{
              value: 50,
              label: 'this month',
              isPositive: true
            }}
          />

          <StatsCard
            title="Achievement Points"
            value={studentStats.achievementPoints}
            description="Bronze level contributor"
            icon={Trophy}
            gradient
          />

        </div>


        {/* QUICK LINKS */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">

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

        </div>


        {/* MAIN SECTION */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* TOP ALUMNI */}

          <div className="lg:col-span-2">

            <Card className="shadow-soft">

              <CardHeader className="flex flex-row items-center justify-between">

                <div>

                  <CardTitle className="flex items-center space-x-2">

                    <Users className="h-5 w-5" />

                    <span>

                      Top Contributing Alumni

                    </span>

                  </CardTitle>

                  <CardDescription>

                    Connect with alumni helping students

                  </CardDescription>

                </div>

              </CardHeader>

              <CardContent className="space-y-4">

                {mockAlumni.map((alumni) => (

                  <div
                    key={alumni.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-gradient-card"
                  >

                    <div className="flex items-center space-x-4">

                      <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center">

                        <User className="h-6 w-6 text-white" />

                      </div>

                      <div>

                        <div className="flex items-center space-x-2">

                          <h3 className="font-semibold">

                            {alumni.name}

                          </h3>

                          <ContributionBadge
                            points={alumni.contributionScore}
                            size="sm"
                          />

                          {alumni.isStartupFounder && (

                            <Badge variant="secondary">

                              <Zap className="h-3 w-3 mr-1" />

                              Founder

                            </Badge>

                          )}

                        </div>

                        <p className="text-sm text-muted-foreground">

                          {alumni.position}
                          {" "}at{" "}
                          {alumni.company}

                        </p>

                        <div className="flex items-center space-x-4 mt-1">

                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">

                            <MapPin className="h-3 w-3" />

                            <span>

                              {alumni.location}

                            </span>

                          </div>

                          <div className="flex items-center space-x-1 text-xs text-success">

                            <TrendingUp className="h-3 w-3" />

                            <span>

                              Helped {alumni.helpedStudents} students

                            </span>

                          </div>

                        </div>

                      </div>

                    </div>

                    <div className="flex flex-col space-y-2">

                      <Button size="sm" variant="outline">

                        View Profile

                      </Button>

                      <Button size="sm" variant="accent">

                        Connect

                      </Button>

                    </div>

                  </div>

                ))}

              </CardContent>

            </Card>

          </div>


          {/* SIDE SECTION */}

          <div className="space-y-6">

            {/* JOBS */}

            <Card className="shadow-soft">

              <CardHeader>

                <CardTitle className="flex items-center space-x-2">

                  <Briefcase className="h-5 w-5" />

                  <span>

                    Latest Opportunities

                  </span>

                </CardTitle>

              </CardHeader>

              <CardContent className="space-y-3">

                {recentJobs.map((job) => (

                  <div
                    key={job.id}
                    className="p-3 rounded-lg border bg-muted/30"
                  >

                    <h4 className="font-medium text-sm">

                      {job.title}

                    </h4>

                    <p className="text-xs text-muted-foreground">

                      {job.company}

                    </p>

                    <div className="flex items-center justify-between mt-2">

                      <Badge variant="outline">

                        {job.type}

                      </Badge>

                      <Button size="sm" variant="ghost">

                        Apply

                      </Button>

                    </div>

                  </div>

                ))}

              </CardContent>

            </Card>


            {/* EVENTS */}

            <Card className="shadow-soft">

              <CardHeader>

                <CardTitle className="flex items-center space-x-2">

                  <Calendar className="h-5 w-5" />

                  <span>

                    Upcoming Events

                  </span>

                </CardTitle>

              </CardHeader>

              <CardContent className="space-y-3">

                {upcomingEvents.map((event) => (

                  <div
                    key={event.id}
                    className="p-3 rounded-lg border bg-muted/30"
                  >

                    <h4 className="font-medium text-sm">

                      {event.title}

                    </h4>

                    <p className="text-xs text-muted-foreground">

                      by {event.organizer}

                    </p>

                    <div className="flex items-center justify-between mt-2">

                      <span className="text-xs text-muted-foreground">

                        {event.attendees} attending

                      </span>

                      <Button size="sm" variant="ghost">

                        Join

                      </Button>

                    </div>

                  </div>

                ))}

              </CardContent>

            </Card>

          </div>

        </div>

      </main>

    </div>
  );
};