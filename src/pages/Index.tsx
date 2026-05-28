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

  Award,
  Users,
  Briefcase,
  TrendingUp,
  Star,
  Trophy,
  ArrowRight,
  GraduationCap,
  Building,
  MessageSquare,
  Brain,
  Zap,
  Sparkles,
  CheckCircle,

} from 'lucide-react';

import { Link } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';


const Index = () => {

  const { user } = useAuth();


  // =====================================
  // REDIRECT IF LOGGED IN
  // =====================================
  if (user) {

    window.location.href =
      `/${user.role}/dashboard`;

    return null;

  }


  // =====================================
  // FEATURES
  // =====================================
  const features = [

    {

      icon: Users,

      title:
        "Alumni Networking",

      description:
        "Connect students with experienced alumni mentors for career guidance, networking, and collaboration."

    },

    {

      icon: Briefcase,

      title:
        "Jobs & Internships",

      description:
        "Alumni can post exclusive job openings, internships, and startup opportunities for students."

    },

    {

      icon: MessageSquare,

      title:
        "Mentorship & Guidance",

      description:
        "Students can request mentorship, interview preparation, resume reviews, and career roadmaps."

    },

    {

      icon: Brain,

      title:
        "AI Recommendation System",

      description:
        "Smart AI recommendation engine matches students with suitable alumni mentors based on skills and interests."

    },

    {

      icon: Zap,

      title:
        "AI Chatbot Assistant",

      description:
        "AI-powered chatbot provides instant career guidance, resume help, and technical support."

    },

    {

      icon: Trophy,

      title:
        "Contribution & Trust Score",

      description:
        "Gamification system rewards active alumni and students with contribution points and trust scores."

    }

  ];


  // =====================================
  // STATS
  // =====================================
  const stats = [

    {

      value: "1200+",

      label:
        "Alumni Connected",

      icon:
        GraduationCap

    },

    {

      value: "3500+",

      label:
        "Students Supported",

      icon:
        Users

    },

    {

      value: "250+",

      label:
        "Jobs & Internships",

      icon:
        Briefcase

    },

    {

      value: "9500+",

      label:
        "Mentorship Sessions",

      icon:
        Trophy

    }

  ];


  // =====================================
  // TOP CONTRIBUTORS
  // =====================================
  const contributors = [

    {

      name:
        'Tharuni',

      role:
        'Frontend & AI Integration',

      points:
        1580,

    },

    {

      name:
        'AlumniProject',

      role:
        'Backend Development',

      points:
        1320,

    },

    {

      name:
        'MVSREC',

      role:
        'Innovation & Research',

      points:
        1180,

    }

  ];


  // =====================================
  // BADGES
  // =====================================
  const badges = [

    {

      icon:
        Trophy,

      name:
        'Gold Contributor',

      color:
        'from-yellow-400 to-yellow-600'

    },

    {

      icon:
        Star,

      name:
        'Silver Contributor',

      color:
        'from-gray-300 to-gray-500'

    },

    {

      icon:
        Award,

      name:
        'Bronze Contributor',

      color:
        'from-amber-600 to-amber-800'

    }

  ];


  return (

    <div className="min-h-screen bg-background">


      {/* =====================================
          HEADER
      ===================================== */}

      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">

        <div className="container mx-auto px-4 h-16 flex items-center justify-between">

          {/* LOGO */}

          <div className="flex items-center gap-3">

            <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center shadow-lg">

              <Award className="h-5 w-5 text-white" />

            </div>

            <span className="font-bold text-2xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">

              AlumniConnect

            </span>

          </div>


          {/* NAV */}

          <div className="flex items-center gap-4">

            <Button variant="ghost" asChild>

              <Link to="/about">

                About

              </Link>

            </Button>


            <Button variant="outline" asChild>

              <Link to="/login">

                Login

              </Link>

            </Button>

          </div>

        </div>

      </header>


      {/* =====================================
          HERO SECTION
      ===================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-purple-100">

        <div className="container mx-auto px-4 py-24 lg:py-32">

          <div className="text-center max-w-5xl mx-auto">

            <Badge className="mb-6 bg-gradient-to-r from-primary to-purple-600 text-white px-5 py-2 text-sm">

              🚀 Smart Alumni-Student Networking Platform

            </Badge>


            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-8">

              Connecting

              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">

                {" "}Alumni & Students{" "}

              </span>

              for Future Growth

            </h1>


            <p className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">

              AlumniConnect is an intelligent alumni-student ecosystem that enables mentorship,
              networking, job opportunities, AI-powered recommendations, guidance requests,
              real-time chat, and career support.

            </p>


            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              <Button
                size="lg"
                className="text-lg px-8 py-6"
                asChild
              >

                <Link to="/login">

                  Get Started

                  <ArrowRight className="ml-2 h-5 w-5" />

                </Link>

              </Button>


              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6"
                asChild
              >

                <Link
                  to="/about"
                >

                  Learn More

                </Link>

              </Button>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          STATS SECTION
      ===================================== */}

      <section className="py-16 bg-muted/30">

        <div className="container mx-auto px-4">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

            {stats.map((stat, index) => (

              <div
                key={index}
                className="text-center"
              >

                <div className="flex items-center justify-center mb-4">

                  <div className="p-4 rounded-xl bg-gradient-to-r from-primary to-purple-600 shadow-lg">

                    <stat.icon className="h-7 w-7 text-white" />

                  </div>

                </div>


                <div className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">

                  {stat.value}

                </div>


                <div className="text-muted-foreground">

                  {stat.label}

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================
          FEATURES SECTION
      ===================================== */}

      <section className="py-24">

        <div className="container mx-auto px-4">

          <div className="text-center mb-16">

            <h2 className="text-4xl font-bold mb-4">

              Powerful Features

            </h2>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">

              Everything needed to build a strong alumni-student ecosystem.

            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {features.map((feature, index) => (

              <Card
                key={index}
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >

                <CardHeader>

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center mb-5">

                    <feature.icon className="h-7 w-7 text-white" />

                  </div>


                  <CardTitle className="text-2xl">

                    {feature.title}

                  </CardTitle>

                </CardHeader>


                <CardContent>

                  <CardDescription className="text-base leading-7">

                    {feature.description}

                  </CardDescription>

                </CardContent>

              </Card>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================
          CONTRIBUTORS
      ===================================== */}

      <section className="py-20 bg-muted/30">

        <div className="container mx-auto px-4">

          <div className="text-center mb-12">

            <h2 className="text-4xl font-bold mb-4">

              Top Contributors

            </h2>

            <p className="text-muted-foreground text-lg">

              People contributing to the AlumniConnect ecosystem

            </p>

          </div>


          <div className="max-w-4xl mx-auto space-y-5">

            {contributors.map((contributor, index) => (

              <Card
                key={index}
                className="shadow-lg border-0"
              >

                <CardContent className="p-6">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-5">

                      <div className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xl">

                        {index + 1}

                      </div>


                      <div>

                        <h3 className="font-bold text-xl">

                          {contributor.name}

                        </h3>

                        <p className="text-muted-foreground">

                          {contributor.role}

                        </p>

                      </div>

                    </div>


                    <div className="text-right">

                      <div className="flex items-center gap-2">

                        <Trophy className="h-5 w-5 text-yellow-500" />

                        <span className="font-bold text-2xl text-primary">

                          {contributor.points}

                        </span>

                      </div>

                      <span className="text-sm text-muted-foreground">

                        points

                      </span>

                    </div>

                  </div>

                </CardContent>

              </Card>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================
          BADGES
      ===================================== */}

      <section className="py-20">

        <div className="container mx-auto px-4 text-center">

          <h2 className="text-4xl font-bold mb-5">

            Contribution Badges

          </h2>

          <p className="text-muted-foreground mb-12 text-lg">

            Earn rewards and recognition through contributions

          </p>


          <div className="flex flex-wrap justify-center gap-10">

            {badges.map((badge, index) => (

              <div
                key={index}
                className="flex flex-col items-center gap-3"
              >

                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-2xl`}>

                  <badge.icon className="h-12 w-12 text-white" />

                </div>


                <span className="font-semibold text-lg">

                  {badge.name}

                </span>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================
          CTA SECTION
      ===================================== */}

      <section className="py-24 bg-gradient-to-r from-primary via-purple-600 to-primary">

        <div className="container mx-auto px-4 text-center">

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">

            Start Building Your Network Today

          </h2>


          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-10">

            Connect with alumni mentors, explore opportunities,
            gain career guidance, and grow professionally.

          </p>


          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-10 py-6"
            asChild
          >

            <Link to="/login">

              Join AlumniConnect

              <ArrowRight className="ml-2 h-5 w-5" />

            </Link>

          </Button>

        </div>

      </section>


      {/* =====================================
          FOOTER
      ===================================== */}

      <footer className="border-t bg-muted/30 py-10">

        <div className="container mx-auto px-4">

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">

                <Award className="h-4 w-4 text-white" />

              </div>


              <span className="font-bold text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">

                AlumniConnect

              </span>

            </div>


            <div className="text-sm text-muted-foreground text-center">

              © 2025 AlumniConnect.
              Designed & Developed by
              {" "}
              <span className="font-semibold text-primary">

                Tharuni

              </span>

            </div>

          </div>

        </div>

      </footer>

    </div>

  );

};

export default Index;