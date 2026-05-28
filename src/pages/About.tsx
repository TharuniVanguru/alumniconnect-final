import { Header } from "@/components/layout/Header";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

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
} from "lucide-react";


const About: React.FC = () => {

  const features = [

    {
      title: "Alumni Networking",
      description:
        "Connect students with experienced alumni mentors and industry professionals.",
      icon: Users,
      color: "bg-primary/10 text-primary",
    },

    {
      title: "Job Opportunities",
      description:
        "Explore internships, placements, and career opportunities shared by alumni.",
      icon: Briefcase,
      color: "bg-green-100 text-green-600",
    },

    {
      title: "Mentorship & Guidance",
      description:
        "Raise guidance requests and receive career mentorship from alumni experts.",
      icon: GraduationCap,
      color: "bg-purple-100 text-purple-600",
    },

    {
      title: "Events & Workshops",
      description:
        "Participate in networking sessions, technical workshops, and alumni events.",
      icon: Calendar,
      color: "bg-orange-100 text-orange-600",
    },

    {
      title: "AI Assistant",
      description:
        "Get instant career support, interview tips, and roadmap suggestions with AI.",
      icon: Brain,
      color: "bg-violet-100 text-violet-600",
    },

    {
      title: "Real-Time Chat",
      description:
        "Chat directly with mentors, alumni, and fellow students in real time.",
      icon: MessageSquare,
      color: "bg-blue-100 text-blue-600",
    },

  ];


  return (

    <div className="min-h-screen bg-background">

      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">


        {/* HERO SECTION */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-purple-600 to-indigo-700 text-white shadow-2xl mb-12">

          <div className="absolute inset-0 bg-black/10" />

          <div className="relative p-8 md:p-12">

            <div className="max-w-4xl">

              <div className="flex items-center gap-3 mb-5">

                <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">

                  <Sparkles className="h-7 w-7 text-yellow-300" />

                </div>

                <h1 className="text-4xl md:text-5xl font-bold">

                  About AlumniConnect

                </h1>

              </div>

              <p className="text-lg md:text-xl text-white/90 leading-8">

                AlumniConnect is an AI-powered alumni-student engagement platform
                designed to bridge the gap between students and alumni through
                mentorship, networking, jobs, events, and career guidance.

              </p>

            </div>

          </div>

        </div>


        {/* MISSION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

          <Card className="shadow-xl rounded-3xl border-0">

            <CardContent className="p-8">

              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">

                <Target className="h-8 w-8 text-primary" />

              </div>

              <h2 className="text-3xl font-bold mb-4">

                Our Mission

              </h2>

              <p className="text-muted-foreground leading-8 text-lg">

                To empower students by creating meaningful connections with alumni,
                enabling mentorship, career growth, networking opportunities,
                and industry exposure through a modern digital ecosystem.

              </p>

            </CardContent>

          </Card>


          <Card className="shadow-xl rounded-3xl border-0">

            <CardContent className="p-8">

              <div className="h-16 w-16 rounded-2xl bg-green-100 flex items-center justify-center mb-6">

                <ShieldCheck className="h-8 w-8 text-green-600" />

              </div>

              <h2 className="text-3xl font-bold mb-4">

                Platform Vision

              </h2>

              <p className="text-muted-foreground leading-8 text-lg">

                We aim to build a trusted alumni ecosystem where students receive
                guidance, alumni contribute back to the institution, and everyone
                grows together through collaboration and innovation.

              </p>

            </CardContent>

          </Card>

        </div>


        {/* FEATURES */}
        <div className="mb-12">

          <div className="mb-8">

            <h2 className="text-4xl font-bold mb-3">

              Platform Features

            </h2>

            <p className="text-muted-foreground text-lg">

              Everything students and alumni need in one connected ecosystem.

            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

            {features.map((feature, index) => (

              <Card
                key={index}
                className="shadow-xl rounded-3xl border-0 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >

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

            ))}

          </div>

        </div>


        {/* FOOTER CARD */}
        <Card className="shadow-2xl rounded-3xl border-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white overflow-hidden">

          <CardContent className="p-10 text-center">

            <div className="flex justify-center mb-6">

              <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center">

                <GraduationCap className="h-10 w-10 text-yellow-300" />

              </div>

            </div>

            <h2 className="text-4xl font-bold mb-4">

              Built for Students & Alumni

            </h2>

            <p className="text-white/80 text-lg max-w-3xl mx-auto leading-8">

              AlumniConnect combines AI, mentorship, networking, job opportunities,
              real-time communication, and community engagement into one unified platform
              to strengthen alumni-student relationships.

            </p>

          </CardContent>

        </Card>

      </main>

    </div>

  );

};


export default About;