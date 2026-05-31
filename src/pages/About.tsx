import { Header } from "@/components/layout/Header";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Button,
} from "@/components/ui/button";

import {
  Users,
  Briefcase,
  Calendar,
  GraduationCap,
  Brain,
  MessageSquare,
  Sparkles,
  Target,
  ShieldCheck,
  ArrowRight,
  Trophy,
  Globe,
  HeartHandshake,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import {
  Link,
} from "react-router-dom";


// ==========================================
// COMPONENT
// ==========================================
const About: React.FC = () => {

  // ========================================
  // FEATURES
  // ========================================
  const features = [

    {

      title:
        "Alumni Networking",

      description:
        "Connect students with experienced alumni mentors and industry professionals.",

      icon:
        Users,

      color:
        "bg-primary/10 text-primary",

    },

    {

      title:
        "Job Opportunities",

      description:
        "Explore internships, placements, and career opportunities shared by alumni.",

      icon:
        Briefcase,

      color:
        "bg-green-100 text-green-600",

    },

    {

      title:
        "Mentorship & Guidance",

      description:
        "Raise guidance requests and receive career mentorship from alumni experts.",

      icon:
        GraduationCap,

      color:
        "bg-purple-100 text-purple-600",

    },

    {

      title:
        "Events & Workshops",

      description:
        "Participate in networking sessions, technical workshops, and alumni events.",

      icon:
        Calendar,

      color:
        "bg-orange-100 text-orange-600",

    },

    {

      title:
        "AI Assistant",

      description:
        "Get instant career support, interview tips, and roadmap suggestions with AI.",

      icon:
        Brain,

      color:
        "bg-violet-100 text-violet-600",

    },

    {

      title:
        "Real-Time Chat",

      description:
        "Chat directly with mentors, alumni, and fellow students in real time.",

      icon:
        MessageSquare,

      color:
        "bg-blue-100 text-blue-600",

    },

  ];


  // ========================================
  // STATS
  // ========================================
  const stats = [

    {

      title:
        "4K+",

      subtitle:
        "Students Connected",

      icon:
        Users,

    },

    {

      title:
        "500+",

      subtitle:
        "Active Alumni",

      icon:
        GraduationCap,

    },

    {

      title:
        "300+",

      subtitle:
        "Career Opportunities",

      icon:
        Briefcase,

    },

    {

      title:
        "100+",

      subtitle:
        "Events Conducted",

      icon:
        Trophy,

    },

  ];


  // ========================================
  // VALUES
  // ========================================
  const values = [

    {

      title:
        "Innovation",

      description:
        "Building modern AI-powered solutions for alumni engagement.",

      icon:
        Sparkles,

    },

    {

      title:
        "Collaboration",

      description:
        "Strengthening the connection between students and alumni communities.",

      icon:
        HeartHandshake,

    },

    {

      title:
        "Global Reach",

      description:
        "Connecting institutions, alumni, and students worldwide.",

      icon:
        Globe,

    },

  ];


  // ========================================
  // UI
  // ========================================
  return (

    <div className="min-h-screen bg-background">

      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">


        {/* ================================= */}
        {/* HERO SECTION */}
        {/* ================================= */}

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

          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-purple-600 to-indigo-700 text-white shadow-2xl mb-12"

        >

          <div className="absolute inset-0 bg-black/10" />

          <div className="relative p-8 md:p-14">

            <div className="max-w-4xl">

              <div className="flex items-center gap-4 mb-6">

                <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">

                  <Sparkles className="h-8 w-8 text-yellow-300" />

                </div>

                <h1 className="text-4xl md:text-6xl font-bold">

                  About AlumniConnect

                </h1>

              </div>


              <p className="text-lg md:text-xl text-white/90 leading-8 mb-8">

                AlumniConnect is an AI-powered alumni-student engagement ecosystem
                designed to bridge the gap between students and alumni through
                mentorship, networking, placements, real-time communication,
                and intelligent career guidance.

              </p>


              <div className="flex flex-col sm:flex-row gap-4">

                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90"
                  asChild
                >

                  <Link to="/register">

                    Join Platform

                    <ArrowRight className="ml-2 h-4 w-4" />

                  </Link>

                </Button>


                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  asChild
                >

                  <Link to="/student/alumni-directory">

                    Explore Alumni

                  </Link>

                </Button>

              </div>

            </div>

          </div>

        </motion.div>


        {/* ================================= */}
        {/* STATS */}
        {/* ================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">

          {stats.map((item, index) => (

            <Card
              key={index}
              className="rounded-3xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
            >

              <CardContent className="p-8 text-center">

                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">

                  <item.icon className="h-8 w-8 text-primary" />

                </div>

                <h2 className="text-4xl font-bold mb-2">

                  {item.title}

                </h2>

                <p className="text-muted-foreground">

                  {item.subtitle}

                </p>

              </CardContent>

            </Card>

          ))}

        </div>


        {/* ================================= */}
        {/* MISSION & VISION */}
        {/* ================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">

          <Card className="shadow-2xl rounded-3xl border-0 overflow-hidden">

            <CardContent className="p-10">

              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">

                <Target className="h-8 w-8 text-primary" />

              </div>

              <h2 className="text-3xl font-bold mb-4">

                Our Mission

              </h2>

              <p className="text-muted-foreground leading-8 text-lg">

                To empower students by creating meaningful relationships with alumni,
                enabling mentorship, career growth, networking opportunities,
                and industry exposure through a modern AI-powered platform.

              </p>

            </CardContent>

          </Card>


          <Card className="shadow-2xl rounded-3xl border-0 overflow-hidden">

            <CardContent className="p-10">

              <div className="h-16 w-16 rounded-2xl bg-green-100 flex items-center justify-center mb-6">

                <ShieldCheck className="h-8 w-8 text-green-600" />

              </div>

              <h2 className="text-3xl font-bold mb-4">

                Our Vision

              </h2>

              <p className="text-muted-foreground leading-8 text-lg">

                To build a trusted digital ecosystem where alumni contribute back
                to their institution while students receive guidance, opportunities,
                and support to achieve their career goals.

              </p>

            </CardContent>

          </Card>

        </div>


        {/* ================================= */}
        {/* FEATURES */}
        {/* ================================= */}

        <div className="mb-14">

          <div className="mb-10">

            <h2 className="text-4xl font-bold mb-3">

              Platform Features

            </h2>

            <p className="text-muted-foreground text-lg">

              Everything students and alumni need in one connected ecosystem.

            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

            {features.map((feature, index) => (

              <motion.div

                key={index}

                initial={{
                  opacity: 0,
                  y: 20,
                }}

                whileInView={{
                  opacity: 1,
                  y: 0,
                }}

                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                }}

                viewport={{
                  once: true,
                }}

              >

                <Card className="shadow-xl rounded-3xl border-0 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full">

                  <CardContent className="p-8">

                    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-6 ${feature.color}`}>

                      <feature.icon className="h-8 w-8" />

                    </div>

                    <h3 className="text-2xl font-bold mb-3">

                      {feature.title}

                    </h3>

                    <p className="text-muted-foreground leading-7">

                      {feature.description}

                    </p>

                  </CardContent>

                </Card>

              </motion.div>

            ))}

          </div>

        </div>


        {/* ================================= */}
        {/* VALUES */}
        {/* ================================= */}

        <div className="mb-14">

          <div className="mb-10">

            <h2 className="text-4xl font-bold mb-3">

              Core Values

            </h2>

            <p className="text-muted-foreground text-lg">

              Principles driving AlumniConnect forward.

            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {values.map((value, index) => (

              <Card
                key={index}
                className="rounded-3xl border-0 shadow-xl"
              >

                <CardContent className="p-8 text-center">

                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">

                    <value.icon className="h-8 w-8 text-primary" />

                  </div>

                  <h3 className="text-2xl font-bold mb-3">

                    {value.title}

                  </h3>

                  <p className="text-muted-foreground leading-7">

                    {value.description}

                  </p>

                </CardContent>

              </Card>

            ))}

          </div>

        </div>


        {/* ================================= */}
        {/* FOOTER CTA */}
        {/* ================================= */}

        <Card className="shadow-2xl rounded-3xl border-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white overflow-hidden">

          <CardContent className="p-10 md:p-14 text-center">

            <div className="flex justify-center mb-6">

              <div className="h-24 w-24 rounded-full bg-white/10 flex items-center justify-center">

                <GraduationCap className="h-12 w-12 text-yellow-300" />

              </div>

            </div>


            <h2 className="text-4xl md:text-5xl font-bold mb-5">

              Built for Students & Alumni

            </h2>


            <p className="text-white/80 text-lg max-w-3xl mx-auto leading-8 mb-8">

              AlumniConnect combines AI, mentorship, networking,
              job opportunities, real-time communication, and
              community engagement into one unified platform to
              strengthen alumni-student relationships.

            </p>


            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              asChild
            >

              <Link to="/register">

                Get Started Today

                <ArrowRight className="ml-2 h-4 w-4" />

              </Link>

            </Button>

          </CardContent>

        </Card>

      </main>

    </div>

  );

};


// ==========================================
// EXPORT
// ==========================================
export default About;