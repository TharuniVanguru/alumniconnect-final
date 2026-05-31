import { Header } from '@/components/layout/Header';

import {
  motion,
} from 'framer-motion';

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

  Crown,
  Check,
  Zap,
  TrendingUp,
  Users,
  Briefcase,
  BarChart3,
  Sparkles,
  Rocket,
  ShieldCheck,
  Star,
  Brain,
  Trophy,
  ArrowRight,

} from 'lucide-react';

import { toast }
  from '@/hooks/use-toast';


// =====================================
// COMPONENT
// =====================================
export const PremiumUpgrade =
  () => {

    // =====================================
    // HANDLE UPGRADE
    // =====================================
    const handleUpgrade =
      (plan: string) => {

        toast({

          title:
            "Upgrade Initiated 🚀",

          description:
            `Your ${plan} upgrade request has been submitted successfully.`,

        });

      };


    // =====================================
    // FREE PLAN FEATURES
    // =====================================
    const freePlanFeatures = [

      'Basic alumni directory access',

      'Attend limited events',

      'Apply for jobs & internships',

      'Basic mentorship support',

      'Community chat access',

      'AI recommendations',

    ];


    // =====================================
    // PREMIUM FEATURES
    // =====================================
    const premiumFeatures = [

      'Unlimited mentorship requests',

      'Advanced AI alumni matching',

      'Priority alumni responses',

      'Unlimited job applications',

      'Resume & interview guidance',

      'Premium networking access',

      'Exclusive startup opportunities',

      'Direct messaging with alumni',

      'Profile boost in searches',

      'Advanced analytics dashboard',

    ];


    // =====================================
    // ENTERPRISE FEATURES
    // =====================================
    const enterpriseFeatures = [

      'All Premium features',

      'Institute-level analytics',

      'Admin management dashboard',

      'Custom branding support',

      'API integrations',

      'Dedicated support team',

      'Bulk student onboarding',

      'Advanced reports & insights',

      'Custom event management',

      'Priority feature access',

    ];


    // =====================================
    // BENEFITS
    // =====================================
    const benefits = [

      {

        icon:
          TrendingUp,

        title:
          "Career Growth",

        description:
          "Get exclusive job opportunities, mentorship sessions, startup projects, and premium networking support.",

        gradient:
          "from-primary to-purple-600",

      },

      {

        icon:
          Users,

        title:
          "Better Networking",

        description:
          "Connect directly with top alumni, industry experts, recruiters, founders, and mentors.",

        gradient:
          "from-pink-500 to-purple-500",

      },

      {

        icon:
          BarChart3,

        title:
          "Smart Insights",

        description:
          "Track applications, mentorship progress, AI recommendation scores, engagement, and growth analytics.",

        gradient:
          "from-orange-500 to-yellow-500",

      },

    ];


    return (

      <div className="min-h-screen bg-background overflow-hidden">

        <Header />


        {/* BACKGROUND BLURS */}
        <div className="absolute top-0 left-0 h-72 w-72 bg-primary/10 rounded-full blur-3xl" />

        <div className="absolute bottom-0 right-0 h-96 w-96 bg-purple-500/10 rounded-full blur-3xl" />


        <main className="max-w-7xl mx-auto px-4 py-10 relative z-10">


          {/* ===================================== */}
          {/* HERO */}
          {/* ===================================== */}

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

            className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-primary via-purple-600 to-indigo-600 text-white shadow-2xl mb-20"

          >

            <div className="absolute inset-0 bg-black/10" />


            <div className="relative p-8 md:p-12">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">


                {/* LEFT */}
                <div className="max-w-3xl">

                  <Badge className="mb-6 bg-white/20 border-0 text-white px-5 py-2 rounded-full">

                    <Sparkles className="h-4 w-4 mr-2" />

                    Unlock Premium AlumniConnect Experience

                  </Badge>


                  <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">

                    Upgrade Your

                    <span className="block text-yellow-300">

                      AlumniConnect

                    </span>

                  </h1>


                  <p className="text-white/90 text-lg md:text-xl leading-8 max-w-2xl">

                    Supercharge your networking,
                    mentorship, career growth,
                    AI recommendations, and alumni engagement
                    with premium features designed for
                    students, alumni, and institutions.

                  </p>


                  <div className="flex flex-col sm:flex-row gap-4 mt-8">

                    <Button

                      size="lg"

                      className="bg-white text-primary hover:bg-slate-100 rounded-2xl px-8 py-6 text-lg"

                      onClick={() =>
                        handleUpgrade(
                          "Premium"
                        )
                      }

                    >

                      <Rocket className="h-5 w-5 mr-2" />

                      Upgrade Now

                    </Button>


                    <Button

                      size="lg"

                      variant="outline"

                      className="border-white text-white hover:bg-white/10 rounded-2xl px-8 py-6 text-lg"

                    >

                      Explore Features

                    </Button>

                  </div>

                </div>


                {/* RIGHT */}
                <div className="flex justify-center">

                  <div className="bg-white/10 backdrop-blur-md rounded-[32px] p-8 border border-white/20 min-w-[280px] text-center">

                    <div className="flex justify-center mb-5">

                      <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center">

                        <Crown className="h-12 w-12 text-yellow-300" />

                      </div>

                    </div>


                    <h2 className="text-5xl font-bold mb-2">

                      PRO

                    </h2>


                    <p className="text-white/90 text-lg">

                      Premium Experience

                    </p>


                    <div className="mt-6 flex justify-center gap-3">

                      <Badge className="bg-yellow-400 text-black">

                        AI Powered

                      </Badge>

                      <Badge className="bg-green-500">

                        Unlimited

                      </Badge>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </motion.div>


          {/* ===================================== */}
          {/* PRICING */}
          {/* ===================================== */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">


            {/* ===================================== */}
            {/* FREE */}
            {/* ===================================== */}

            <Card className="rounded-[32px] border-0 shadow-xl">

              <CardHeader>

                <div className="flex items-center justify-between">

                  <CardTitle className="text-3xl">

                    Free

                  </CardTitle>

                  <Badge variant="secondary">

                    Active

                  </Badge>

                </div>


                <CardDescription className="text-base">

                  Best for beginners exploring AlumniConnect

                </CardDescription>


                <div className="mt-8">

                  <span className="text-6xl font-bold">

                    ₹0

                  </span>


                  <span className="text-muted-foreground text-lg">

                    /month

                  </span>

                </div>

              </CardHeader>


              <CardContent className="space-y-6">

                <ul className="space-y-4">

                  {freePlanFeatures.map(
                    (feature, index) => (

                      <li
                        key={index}
                        className="flex items-start gap-3"
                      >

                        <Check className="h-5 w-5 text-green-600 mt-0.5" />

                        <span className="text-sm">

                          {feature}

                        </span>

                      </li>

                    )
                  )}

                </ul>


                <Button
                  className="w-full h-12 rounded-2xl"
                  variant="outline"
                  disabled
                >

                  Current Plan

                </Button>

              </CardContent>

            </Card>


            {/* ===================================== */}
            {/* PREMIUM */}
            {/* ===================================== */}

            <motion.div

              initial={{
                scale: 0.95,
              }}

              animate={{
                scale: 1,
              }}

              transition={{
                duration: 0.4,
              }}

            >

              <Card className="rounded-[32px] border-2 border-primary shadow-2xl relative overflow-hidden">


                {/* TAG */}
                <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-2 rounded-bl-3xl text-sm font-semibold">

                  Most Popular

                </div>


                <CardHeader className="pt-12">

                  <div className="flex items-center gap-4 mb-4">

                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">

                      <Zap className="h-7 w-7 text-white" />

                    </div>


                    <div>

                      <CardTitle className="text-4xl">

                        Premium

                      </CardTitle>


                      <CardDescription>

                        Perfect for active students & alumni

                      </CardDescription>

                    </div>

                  </div>


                  <div className="mt-6">

                    <span className="text-6xl font-bold text-primary">

                      ₹499

                    </span>


                    <span className="text-muted-foreground text-lg">

                      /month

                    </span>

                  </div>

                </CardHeader>


                <CardContent className="space-y-6">

                  <ul className="space-y-4">

                    {premiumFeatures.map(
                      (feature, index) => (

                        <li
                          key={index}
                          className="flex items-start gap-3"
                        >

                          <Check className="h-5 w-5 text-primary mt-0.5" />

                          <span className="text-sm font-medium">

                            {feature}

                          </span>

                        </li>

                      )
                    )}

                  </ul>


                  <Button

                    className="w-full h-14 rounded-2xl text-lg"

                    onClick={() =>
                      handleUpgrade(
                        "Premium"
                      )
                    }

                  >

                    <Rocket className="h-5 w-5 mr-2" />

                    Upgrade Now

                  </Button>

                </CardContent>

              </Card>

            </motion.div>


            {/* ===================================== */}
            {/* ENTERPRISE */}
            {/* ===================================== */}

            <Card className="rounded-[32px] border-0 shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white">

              <CardHeader>

                <div className="flex items-center gap-4 mb-4">

                  <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">

                    <Crown className="h-7 w-7 text-yellow-400" />

                  </div>


                  <div>

                    <CardTitle className="text-4xl">

                      Enterprise

                    </CardTitle>


                    <CardDescription className="text-slate-300">

                      Built for colleges & institutions

                    </CardDescription>

                  </div>

                </div>


                <div className="mt-6">

                  <span className="text-5xl font-bold">

                    Custom

                  </span>

                </div>

              </CardHeader>


              <CardContent className="space-y-6">

                <ul className="space-y-4">

                  {enterpriseFeatures.map(
                    (feature, index) => (

                      <li
                        key={index}
                        className="flex items-start gap-3"
                      >

                        <ShieldCheck className="h-5 w-5 text-green-400 mt-0.5" />

                        <span className="text-sm">

                          {feature}

                        </span>

                      </li>

                    )
                  )}

                </ul>


                <Button

                  className="w-full h-14 rounded-2xl bg-white text-black hover:bg-slate-200"

                  onClick={() =>
                    handleUpgrade(
                      "Enterprise"
                    )
                  }

                >

                  Contact Team

                </Button>

              </CardContent>

            </Card>

          </div>


          {/* ===================================== */}
          {/* BENEFITS */}
          {/* ===================================== */}

          <div className="mt-28">

            <div className="text-center mb-14">

              <h2 className="text-5xl font-bold mb-5">

                Why Upgrade?

              </h2>


              <p className="text-muted-foreground text-lg">

                Experience the full power of AlumniConnect

              </p>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {benefits.map(
                (
                  benefit,
                  index
                ) => (

                  <motion.div

                    key={index}

                    whileHover={{
                      y: -5,
                    }}

                  >

                    <Card className="rounded-[32px] border-0 shadow-xl h-full">

                      <CardHeader>

                        <div className={`h-16 w-16 rounded-2xl bg-gradient-to-r ${benefit.gradient} flex items-center justify-center mb-5`}>

                          <benefit.icon className="h-8 w-8 text-white" />

                        </div>


                        <CardTitle className="text-2xl">

                          {benefit.title}

                        </CardTitle>

                      </CardHeader>


                      <CardContent>

                        <p className="text-muted-foreground leading-8">

                          {benefit.description}

                        </p>

                      </CardContent>

                    </Card>

                  </motion.div>

                )
              )}

            </div>

          </div>


          {/* ===================================== */}
          {/* EXTRA FEATURES */}
          {/* ===================================== */}

          <div className="mt-28 grid grid-cols-1 md:grid-cols-4 gap-6">


            {[
              {
                icon: Brain,
                title: "AI Powered",
              },
              {
                icon: Users,
                title: "Smart Networking",
              },
              {
                icon: Trophy,
                title: "Career Growth",
              },
              {
                icon: Star,
                title: "Premium Support",
              },
            ].map((item, index) => (

              <Card
                key={index}
                className="rounded-3xl border-0 shadow-lg text-center"
              >

                <CardContent className="p-8">

                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">

                    <item.icon className="h-8 w-8 text-primary" />

                  </div>


                  <h3 className="font-bold text-xl">

                    {item.title}

                  </h3>

                </CardContent>

              </Card>

            ))}

          </div>


          {/* ===================================== */}
          {/* CTA */}
          {/* ===================================== */}

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

            className="mt-28 bg-gradient-to-r from-primary via-purple-600 to-indigo-600 rounded-[40px] p-14 text-white shadow-2xl text-center overflow-hidden relative"

          >

            <div className="absolute inset-0 bg-black/10" />


            <div className="relative z-10">

              <h2 className="text-5xl font-bold mb-5">

                Ready to Unlock Premium?

              </h2>


              <p className="text-white/90 text-lg max-w-2xl mx-auto leading-8 mb-10">

                Join AlumniConnect Premium today and
                accelerate your career, mentorship,
                networking, and alumni engagement journey
                like never before.

              </p>


              <Button

                size="lg"

                className="bg-white text-primary hover:bg-slate-100 text-lg px-10 py-7 rounded-2xl"

                onClick={() =>
                  handleUpgrade(
                    "Premium"
                  )
                }

              >

                <Sparkles className="h-5 w-5 mr-2" />

                Get Premium Access

                <ArrowRight className="h-5 w-5 ml-2" />

              </Button>

            </div>

          </motion.div>

        </main>

      </div>

    );

  };


// =====================================
// EXPORT
// =====================================
export default PremiumUpgrade;