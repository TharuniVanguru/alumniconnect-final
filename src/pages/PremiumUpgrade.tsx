import { Header } from '@/components/layout/Header';

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
  Star,
  Sparkles,
  Rocket,
  ShieldCheck,

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


    return (

      <div className="min-h-screen bg-background">

        <Header />

        <main className="container mx-auto px-4 py-10">


          {/* ===================================== */}
          {/* HEADER */}
          {/* ===================================== */}

          <div className="text-center mb-16">

            <Badge className="mb-5 bg-gradient-to-r from-primary to-purple-600 text-white px-5 py-2 text-sm rounded-full">

              <Sparkles className="h-4 w-4 mr-2" />

              Unlock Premium AlumniConnect Experience

            </Badge>


            <h1 className="text-5xl font-bold mb-5">

              Upgrade Your
              {" "}

              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">

                AlumniConnect

              </span>

            </h1>


            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">

              Supercharge your networking, mentorship,
              career growth, and alumni engagement with
              powerful premium features designed for
              students, alumni, and institutions.

            </p>

          </div>


          {/* ===================================== */}
          {/* PRICING CARDS */}
          {/* ===================================== */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">


            {/* ===================================== */}
            {/* FREE PLAN */}
            {/* ===================================== */}

            <Card className="rounded-3xl shadow-xl border-0">

              <CardHeader>

                <div className="flex items-center justify-between">

                  <CardTitle className="text-2xl">

                    Free Plan

                  </CardTitle>

                  <Badge variant="secondary">

                    Active

                  </Badge>

                </div>


                <CardDescription>

                  Best for beginners exploring AlumniConnect

                </CardDescription>


                <div className="mt-6">

                  <span className="text-5xl font-bold">

                    ₹0

                  </span>

                  <span className="text-muted-foreground">

                    /month

                  </span>

                </div>

              </CardHeader>


              <CardContent className="space-y-5">

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
                  className="w-full"
                  variant="outline"
                  disabled
                >

                  Current Plan

                </Button>

              </CardContent>

            </Card>


            {/* ===================================== */}
            {/* PREMIUM PLAN */}
            {/* ===================================== */}

            <Card className="rounded-3xl shadow-2xl border-2 border-primary relative overflow-hidden">


              {/* POPULAR TAG */}
              <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-purple-600 text-white px-5 py-2 rounded-bl-2xl text-sm font-semibold">

                Most Popular

              </div>


              <CardHeader className="pt-10">

                <div className="flex items-center gap-3 mb-2">

                  <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">

                    <Zap className="h-6 w-6 text-white" />

                  </div>

                  <CardTitle className="text-3xl">

                    Premium

                  </CardTitle>

                </div>


                <CardDescription>

                  Perfect for active students & alumni mentors

                </CardDescription>


                <div className="mt-6">

                  <span className="text-5xl font-bold text-primary">

                    ₹499

                  </span>

                  <span className="text-muted-foreground">

                    /month

                  </span>

                </div>

              </CardHeader>


              <CardContent className="space-y-5">

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

                  className="w-full h-12 text-lg rounded-xl"

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


            {/* ===================================== */}
            {/* ENTERPRISE PLAN */}
            {/* ===================================== */}

            <Card className="rounded-3xl shadow-xl border-0 bg-gradient-to-br from-slate-900 to-slate-800 text-white">

              <CardHeader>

                <div className="flex items-center gap-3 mb-2">

                  <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">

                    <Crown className="h-6 w-6 text-yellow-400" />

                  </div>

                  <CardTitle className="text-3xl">

                    Enterprise

                  </CardTitle>

                </div>


                <CardDescription className="text-slate-300">

                  Built for colleges & organizations

                </CardDescription>


                <div className="mt-6">

                  <span className="text-5xl font-bold">

                    Custom

                  </span>

                </div>

              </CardHeader>


              <CardContent className="space-y-5">

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

                  className="w-full h-12 rounded-xl bg-white text-black hover:bg-slate-200"

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
          {/* WHY UPGRADE */}
          {/* ===================================== */}

          <div className="mt-24">

            <div className="text-center mb-12">

              <h2 className="text-4xl font-bold mb-4">

                Why Upgrade?

              </h2>

              <p className="text-muted-foreground text-lg">

                Experience the full power of AlumniConnect

              </p>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">


              {/* CARD 1 */}
              <Card className="rounded-3xl shadow-lg border-0">

                <CardHeader>

                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center mb-4">

                    <TrendingUp className="h-7 w-7 text-white" />

                  </div>


                  <CardTitle>

                    Career Growth

                  </CardTitle>

                </CardHeader>


                <CardContent>

                  <p className="text-muted-foreground">

                    Get exclusive job opportunities,
                    mentorship sessions, startup projects,
                    and premium networking support.

                  </p>

                </CardContent>

              </Card>


              {/* CARD 2 */}
              <Card className="rounded-3xl shadow-lg border-0">

                <CardHeader>

                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center mb-4">

                    <Users className="h-7 w-7 text-white" />

                  </div>


                  <CardTitle>

                    Better Networking

                  </CardTitle>

                </CardHeader>


                <CardContent>

                  <p className="text-muted-foreground">

                    Connect directly with top alumni,
                    industry experts, recruiters,
                    founders, and mentors.

                  </p>

                </CardContent>

              </Card>


              {/* CARD 3 */}
              <Card className="rounded-3xl shadow-lg border-0">

                <CardHeader>

                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center mb-4">

                    <BarChart3 className="h-7 w-7 text-white" />

                  </div>


                  <CardTitle>

                    Smart Insights

                  </CardTitle>

                </CardHeader>


                <CardContent>

                  <p className="text-muted-foreground">

                    Track applications, mentorship progress,
                    AI recommendation scores, engagement,
                    and growth analytics.

                  </p>

                </CardContent>

              </Card>

            </div>

          </div>


          {/* ===================================== */}
          {/* FINAL CTA */}
          {/* ===================================== */}

          <div className="mt-24 text-center bg-gradient-to-r from-primary to-purple-600 rounded-3xl p-14 text-white shadow-2xl">

            <h2 className="text-4xl font-bold mb-4">

              Ready to Unlock Premium?

            </h2>


            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">

              Join AlumniConnect Premium today and
              accelerate your career, mentorship,
              and networking journey like never before.

            </p>


            <Button

              size="lg"

              className="bg-white text-primary hover:bg-slate-100 text-lg px-10 py-6 rounded-2xl"

              onClick={() =>
                handleUpgrade(
                  "Premium"
                )
              }

            >

              <Sparkles className="h-5 w-5 mr-2" />

              Get Premium Access

            </Button>

          </div>

        </main>

      </div>

    );

  };