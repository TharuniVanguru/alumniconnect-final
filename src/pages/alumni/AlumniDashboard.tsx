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
  Star,
  Plus,
  GraduationCap
} from 'lucide-react';

import { Link } from 'react-router-dom';


export const AlumniDashboard = () => {

  // GET LOGGED IN USER
  const userInfo = localStorage.getItem("userInfo");

  const user = userInfo
    ? JSON.parse(userInfo)
    : null;


  // MOCK DATA
  const alumniStats = {
    studentsHelped: 25,
    jobsPosted: 8,
    eventsOrganized: 3,
    contributionScore: 850,
  };


  const mockStudents = [
    {
      id: '1',
      name: 'Alex Kumar',
      year: 'Final Year',
      department: 'Computer Science',
      skills: ['React', 'Node.js', 'Python'],
    },

    {
      id: '2',
      name: 'Maria Santos',
      year: 'Third Year',
      department: 'Information Technology',
      skills: ['Java', 'Spring Boot', 'AWS'],
    },

    {
      id: '3',
      name: 'David Lee',
      year: 'Second Year',
      department: 'Software Engineering',
      skills: ['MongoDB', 'Docker', 'Vue'],
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

                Welcome back, {user?.name || "Alumni"}!

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


        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <StatsCard
            title="Students Helped"
            value={alumniStats.studentsHelped}
            description="Direct mentorship & guidance"
            icon={Users}
            trend={{
              value: 15,
              label: 'this month',
              isPositive: true
            }}
          />

          <StatsCard
            title="Jobs Posted"
            value={alumniStats.jobsPosted}
            description="Opportunities created"
            icon={Briefcase}
            trend={{
              value: 33,
              label: 'this month',
              isPositive: true
            }}
          />

          <StatsCard
            title="Events Organized"
            value={alumniStats.eventsOrganized}
            description="Knowledge sharing sessions"
            icon={Calendar}
            trend={{
              value: 100,
              label: 'this month',
              isPositive: true
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


        {/* QUICK LINKS */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">


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


          {/* POST JOB */}

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


          {/* CREATE EVENT */}

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


        {/* MAIN SECTION */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


          {/* STUDENTS */}

          <div className="lg:col-span-2">

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

                {mockStudents.map((student) => (

                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-gradient-card"
                  >

                    <div>

                      <h3 className="font-semibold">

                        {student.name}

                      </h3>

                      <p className="text-sm text-muted-foreground">

                        {student.year} • {student.department}

                      </p>

                      <div className="flex flex-wrap gap-1 mt-2">

                        {student.skills.map((skill) => (

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
                      >

                        View Profile

                      </Button>


                      <Button
                        size="sm"
                        asChild
                      >

                        <Link to="/alumni/chat">

                          Chat

                        </Link>

                      </Button>

                    </div>

                  </div>

                ))}

              </CardContent>

            </Card>

          </div>


          {/* SIDE SECTION */}

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