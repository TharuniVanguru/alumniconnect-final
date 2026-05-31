import {
  Button,
} from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import {
  Badge,
} from '@/components/ui/badge';

import {

  Award,
  Users,
  Briefcase,
  Trophy,
  Star,
  ArrowRight,
  GraduationCap,
  MessageSquare,
  Brain,
  Zap,
  Sparkles,
  CheckCircle,
  ShieldCheck,
  TrendingUp,
  Globe,
  Rocket,
  Building2,

} from 'lucide-react';

import {
  Link,
  Navigate,
} from 'react-router-dom';

import {
  motion,
} from 'framer-motion';

import {
  useAuth,
} from '@/contexts/AuthContext';


// ==========================================
// COMPONENT
// ==========================================
const Index = () => {

  // ========================================
  // AUTH
  // ========================================
  const {
    user,
  } = useAuth();


  // ========================================
  // REDIRECT
  // ========================================
  if (user) {

    return (

      <Navigate
        to={`/${user.role}/dashboard`}
        replace
      />

    );

  }


  // ========================================
  // FEATURES
  // ========================================
  const features = [

    {

      icon: Users,

      title:
        "Alumni Networking",

      description:
        "Build meaningful connections between students and successful alumni professionals.",

      gradient:
        "from-blue-500 to-cyan-500",

    },

    {

      icon: Briefcase,

      title:
        "Jobs & Internships",

      description:
        "Discover internships, placements, and startup opportunities shared by alumni.",

      gradient:
        "from-green-500 to-emerald-500",

    },

    {

      icon: MessageSquare,

      title:
        "Mentorship Support",

      description:
        "Get resume reviews, interview prep, and career guidance from experts.",

      gradient:
        "from-purple-500 to-pink-500",

    },

    {

      icon: Brain,

      title:
        "AI Recommendation",

      description:
        "Smart AI engine connects students with the best mentors based on skills.",

      gradient:
        "from-violet-500 to-indigo-500",

    },

    {

      icon: Zap,

      title:
        "AI Chat Assistant",

      description:
        "Get instant career support, technical help, and roadmap suggestions.",

      gradient:
        "from-yellow-500 to-orange-500",

    },

    {

      icon: Trophy,

      title:
        "Contribution System",

      description:
        "Earn trust scores, badges, and contribution rewards through activity.",

      gradient:
        "from-amber-500 to-red-500",

    },

  ];


  // ========================================
  // STATS
  // ========================================
  const stats = [

    {

      value: "1200+",

      label:
        "Alumni Connected",

      icon:
        GraduationCap,

    },

    {

      value: "3500+",

      label:
        "Students Supported",

      icon:
        Users,

    },

    {

      value: "250+",

      label:
        "Jobs Posted",

      icon:
        Briefcase,

    },

    {

      value: "9500+",

      label:
        "Mentorship Sessions",

      icon:
        Trophy,

    },

  ];


  // ========================================
  // CONTRIBUTORS
  // ========================================
  const contributors = [

    {

      name:
        "Tharuni",

      role:
        "Frontend & AI Integration",

      points:
        1580,

    },

    {

      name:
        "AlumniProject",

      role:
        "Backend Development",

      points:
        1320,

    },

    {

      name:
        "MVSREC",

      role:
        "Innovation & Research",

      points:
        1180,

    },

  ];


  // ========================================
  // BADGES
  // ========================================
  const badges = [

    {

      icon:
        Trophy,

      name:
        "Gold Contributor",

      color:
        "from-yellow-400 to-yellow-600",

    },

    {

      icon:
        Star,

      name:
        "Silver Contributor",

      color:
        "from-gray-300 to-gray-500",

    },

    {

      icon:
        Award,

      name:
        "Bronze Contributor",

      color:
        "from-amber-600 to-orange-800",

    },

  ];


  // ========================================
  // UI
  // ========================================
  return (

    <div className="min-h-screen bg-background overflow-hidden">


      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">

        <div className="container mx-auto px-4 h-20 flex items-center justify-between">


          {/* LOGO */}
          <div className="flex items-center gap-3">

            <motion.div

              whileHover={{
                rotate: 10,
                scale: 1.05,
              }}

              className="h-12 w-12 rounded-2xl bg-gradient-to-r from-primary via-purple-600 to-indigo-600 flex items-center justify-center shadow-xl"

            >

              <Award className="h-6 w-6 text-white" />

            </motion.div>


            <div>

              <h1 className="font-extrabold text-2xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">

                AlumniConnect

              </h1>

              <p className="text-xs text-muted-foreground">

                AI Powered Alumni Platform

              </p>

            </div>

          </div>


          {/* NAVIGATION */}
          <div className="flex items-center gap-4">

            <Button
              variant="ghost"
              asChild
            >

              <Link to="/about">

                About

              </Link>

            </Button>


            <Button
              variant="outline"
              asChild
            >

              <Link to="/login">

                Login

              </Link>

            </Button>

          </div>

        </div>

      </header>


      {/* ================================= */}
      {/* HERO SECTION */}
      {/* ================================= */}

      <section className="relative overflow-hidden py-28 lg:py-36">


        {/* BACKGROUND */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-purple-100 dark:to-purple-950" />

        <div className="absolute top-0 left-0 h-72 w-72 bg-primary/10 rounded-full blur-3xl" />

        <div className="absolute bottom-0 right-0 h-96 w-96 bg-purple-500/10 rounded-full blur-3xl" />


        <div className="container relative z-10 mx-auto px-4">

          <motion.div

            initial={{
              opacity: 0,
              y: 40,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              duration: 0.7,
            }}

            className="max-w-6xl mx-auto text-center"

          >

            <Badge className="mb-8 px-6 py-2 text-sm bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg">

              🚀 Smart Alumni-Student Networking Platform

            </Badge>


            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-8">

              Connecting

              <span className="bg-gradient-to-r from-primary via-purple-600 to-indigo-600 bg-clip-text text-transparent">

                {" "}Students & Alumni{" "}

              </span>

              for Future Success

            </h1>


            <p className="text-lg md:text-xl text-muted-foreground leading-9 max-w-4xl mx-auto mb-12">

              AlumniConnect is an AI-powered ecosystem for mentorship,
              networking, jobs, internships, career guidance,
              real-time chat, contribution tracking, and alumni engagement.

            </p>


            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">

              <Button
                size="lg"
                className="h-14 px-10 text-lg rounded-2xl shadow-xl"
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
                className="h-14 px-10 text-lg rounded-2xl"
                asChild
              >

                <Link to="/about">

                  Learn More

                </Link>

              </Button>

            </div>


            {/* HIGHLIGHTS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">

              {[

                "AI Mentor Matching",

                "Real-Time Alumni Networking",

                "Career Growth Platform",

              ].map((item, index) => (

                <div
                  key={index}
                  className="flex items-center justify-center gap-3 rounded-2xl bg-background/70 backdrop-blur-xl border p-5 shadow-lg"
                >

                  <CheckCircle className="h-5 w-5 text-green-500" />

                  <span className="font-medium">

                    {item}

                  </span>

                </div>

              ))}

            </div>

          </motion.div>

        </div>

      </section>


      {/* ================================= */}
      {/* STATS */}
      {/* ================================= */}

      <section className="py-20 bg-muted/30">

        <div className="container mx-auto px-4">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

            {stats.map((stat, index) => (

              <motion.div

                key={index}

                whileHover={{
                  y: -8,
                }}

                className="text-center"

              >

                <div className="flex justify-center mb-5">

                  <div className="h-20 w-20 rounded-3xl bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center shadow-2xl">

                    <stat.icon className="h-9 w-9 text-white" />

                  </div>

                </div>


                <h2 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">

                  {stat.value}

                </h2>


                <p className="text-muted-foreground text-lg">

                  {stat.label}

                </p>

              </motion.div>

            ))}

          </div>

        </div>

      </section>


      {/* ================================= */}
      {/* FEATURES */}
      {/* ================================= */}

      <section className="py-24">

        <div className="container mx-auto px-4">

          <div className="text-center mb-16">

            <Badge className="mb-4 bg-primary/10 text-primary">

              FEATURES

            </Badge>


            <h2 className="text-5xl font-bold mb-5">

              Powerful Platform Features

            </h2>


            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">

              Everything needed to build a strong alumni-student
              collaboration ecosystem powered by AI.

            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {features.map((feature, index) => (

              <motion.div

                key={index}

                whileHover={{
                  y: -10,
                }}

              >

                <Card className="border-0 rounded-3xl shadow-xl hover:shadow-2xl transition-all h-full overflow-hidden">

                  <CardHeader>

                    <div className={`h-16 w-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>

                      <feature.icon className="h-8 w-8 text-white" />

                    </div>


                    <CardTitle className="text-2xl">

                      {feature.title}

                    </CardTitle>

                  </CardHeader>


                  <CardContent>

                    <CardDescription className="text-base leading-8">

                      {feature.description}

                    </CardDescription>

                  </CardContent>

                </Card>

              </motion.div>

            ))}

          </div>

        </div>

      </section>


      {/* ================================= */}
      {/* CONTRIBUTORS */}
      {/* ================================= */}

      <section className="py-24 bg-muted/30">

        <div className="container mx-auto px-4">

          <div className="text-center mb-14">

            <h2 className="text-5xl font-bold mb-4">

              Top Contributors

            </h2>

            <p className="text-muted-foreground text-lg">

              Leading contributors driving AlumniConnect forward

            </p>

          </div>


          <div className="max-w-5xl mx-auto space-y-6">

            {contributors.map((contributor, index) => (

              <Card
                key={index}
                className="rounded-3xl border-0 shadow-xl"
              >

                <CardContent className="p-7">

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">


                    {/* LEFT */}
                    <div className="flex items-center gap-5">

                      <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white flex items-center justify-center text-2xl font-bold shadow-xl">

                        {index + 1}

                      </div>


                      <div>

                        <h3 className="text-2xl font-bold">

                          {contributor.name}

                        </h3>

                        <p className="text-muted-foreground">

                          {contributor.role}

                        </p>

                      </div>

                    </div>


                    {/* RIGHT */}
                    <div className="text-right">

                      <div className="flex items-center gap-2 justify-end">

                        <Trophy className="h-6 w-6 text-yellow-500" />

                        <span className="text-3xl font-bold text-primary">

                          {contributor.points}

                        </span>

                      </div>

                      <p className="text-muted-foreground text-sm">

                        Contribution Points

                      </p>

                    </div>

                  </div>

                </CardContent>

              </Card>

            ))}

          </div>

        </div>

      </section>


      {/* ================================= */}
      {/* BADGES */}
      {/* ================================= */}

      <section className="py-24">

        <div className="container mx-auto px-4 text-center">

          <Badge className="mb-5 bg-primary/10 text-primary">

            ACHIEVEMENTS

          </Badge>


          <h2 className="text-5xl font-bold mb-5">

            Contribution Badges

          </h2>


          <p className="text-muted-foreground text-lg mb-14">

            Earn recognition and rewards by helping the community.

          </p>


          <div className="flex flex-wrap justify-center gap-10">

            {badges.map((badge, index) => (

              <motion.div

                key={index}

                whileHover={{
                  scale: 1.08,
                }}

                className="flex flex-col items-center gap-5"

              >

                <div className={`h-28 w-28 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-2xl`}>

                  <badge.icon className="h-14 w-14 text-white" />

                </div>


                <span className="font-bold text-xl">

                  {badge.name}

                </span>

              </motion.div>

            ))}

          </div>

        </div>

      </section>


      {/* ================================= */}
      {/* CTA */}
      {/* ================================= */}

      <section className="py-28 bg-gradient-to-r from-primary via-purple-600 to-indigo-600 relative overflow-hidden">

        <div className="absolute inset-0 bg-black/10" />

        <div className="container relative z-10 mx-auto px-4 text-center">

          <motion.div

            initial={{
              opacity: 0,
              y: 30,
            }}

            whileInView={{
              opacity: 1,
              y: 0,
            }}

            viewport={{
              once: true,
            }}

            transition={{
              duration: 0.6,
            }}

          >

            <h2 className="text-5xl font-bold text-white mb-6">

              Start Building Your Network Today

            </h2>


            <p className="text-white/90 text-xl max-w-3xl mx-auto mb-10 leading-9">

              Connect with alumni mentors, discover opportunities,
              gain career support, and become part of a powerful community.

            </p>


            <Button
              size="lg"
              variant="secondary"
              className="h-14 px-10 text-lg rounded-2xl shadow-xl"
              asChild
            >

              <Link to="/login">

                Join AlumniConnect

                <ArrowRight className="ml-2 h-5 w-5" />

              </Link>

            </Button>

          </motion.div>

        </div>

      </section>


      {/* ================================= */}
      {/* FOOTER */}
      {/* ================================= */}

      <footer className="border-t bg-muted/30 py-10">

        <div className="container mx-auto px-4">

          <div className="flex flex-col md:flex-row items-center justify-between gap-5">


            {/* LEFT */}
            <div className="flex items-center gap-3">

              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center shadow-lg">

                <Award className="h-5 w-5 text-white" />

              </div>


              <div>

                <h2 className="font-bold text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">

                  AlumniConnect

                </h2>

                <p className="text-xs text-muted-foreground">

                  Smart Alumni Ecosystem

                </p>

              </div>

            </div>


            {/* RIGHT */}
            <div className="text-center md:text-right">

              <p className="text-sm text-muted-foreground">

                © 2025 AlumniConnect. All rights reserved.

              </p>

              <p className="text-sm text-muted-foreground">

                Designed & Developed by

                <span className="font-semibold text-primary">

                  {" "}Tharuni

                </span>

              </p>

            </div>

          </div>

        </div>

      </footer>

    </div>

  );

};


// ==========================================
// EXPORT
// ==========================================
export default Index;