import {
  Button,
} from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Construction,
  ArrowLeft,
  Rocket,
  Sparkles,
  Clock3,
  Zap,
  Star,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  motion,
} from "framer-motion";

import {
  Header,
} from "@/components/layout/Header";


// ==========================================
// TYPES
// ==========================================
interface ComingSoonProps {

  pageName?: string;

  description?: string;

}


// ==========================================
// COMPONENT
// ==========================================
export const ComingSoon:
React.FC<ComingSoonProps> = ({

  pageName = "This Page",

  description =
    "This feature is currently under development and will be available soon. Stay tuned for exciting updates!",

}) => {

  // ========================================
  // NAVIGATION
  // ========================================
  const navigate =
    useNavigate();


  // ========================================
  // UI
  // ========================================
  return (

    <div className="min-h-screen bg-background overflow-hidden">

      <Header />

      <div className="relative flex items-center justify-center px-4 py-12">


        {/* BACKGROUND EFFECTS */}
        <div className="absolute top-10 left-10 h-40 w-40 bg-primary/10 rounded-full blur-3xl" />

        <div className="absolute bottom-10 right-10 h-52 w-52 bg-purple-500/10 rounded-full blur-3xl" />


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

          className="w-full max-w-3xl"

        >

          <Card className="shadow-2xl rounded-[32px] border-0 overflow-hidden bg-background/95 backdrop-blur-xl">


            {/* ================================= */}
            {/* HERO SECTION */}
            {/* ================================= */}

            <div className="relative bg-gradient-to-r from-primary via-purple-600 to-indigo-600 text-white p-10 text-center overflow-hidden">


              {/* DECORATIONS */}
              <div className="absolute top-5 left-5 opacity-20">

                <Sparkles className="h-20 w-20" />

              </div>

              <div className="absolute bottom-5 right-5 opacity-20">

                <Rocket className="h-20 w-20" />

              </div>


              {/* ICON */}
              <motion.div

                animate={{
                  y: [0, -8, 0],
                }}

                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}

                className="mx-auto h-28 w-28 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 shadow-2xl"

              >

                <Construction className="h-14 w-14" />

              </motion.div>


              {/* TITLE */}
              <h1 className="text-4xl md:text-5xl font-bold mb-4">

                {pageName}

              </h1>


              {/* SUBTITLE */}
              <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-8">

                This feature is coming soon 🚀

              </p>

            </div>


            {/* ================================= */}
            {/* CONTENT */}
            {/* ================================= */}

            <CardHeader className="text-center pt-10">

              <CardTitle className="flex items-center justify-center gap-3 text-3xl">

                <Sparkles className="h-7 w-7 text-primary" />

                Under Development

              </CardTitle>


              <CardDescription className="text-base md:text-lg mt-4 leading-8 max-w-2xl mx-auto">

                {description}

              </CardDescription>

            </CardHeader>


            {/* ================================= */}
            {/* CONTENT BODY */}
            {/* ================================= */}

            <CardContent className="space-y-8 px-6 md:px-10 pb-10">


              {/* FEATURES BOX */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="rounded-2xl border bg-muted/40 p-6 text-center shadow-sm">

                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">

                    <Rocket className="h-7 w-7 text-primary" />

                  </div>

                  <h3 className="font-semibold text-lg mb-2">

                    Faster Experience

                  </h3>

                  <p className="text-sm text-muted-foreground leading-6">

                    Optimized and smoother workflows for users.

                  </p>

                </div>


                <div className="rounded-2xl border bg-muted/40 p-6 text-center shadow-sm">

                  <div className="h-14 w-14 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4">

                    <Zap className="h-7 w-7 text-purple-600" />

                  </div>

                  <h3 className="font-semibold text-lg mb-2">

                    Smart Features

                  </h3>

                  <p className="text-sm text-muted-foreground leading-6">

                    AI-powered tools and intelligent automation.

                  </p>

                </div>


                <div className="rounded-2xl border bg-muted/40 p-6 text-center shadow-sm">

                  <div className="h-14 w-14 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4">

                    <Star className="h-7 w-7 text-orange-600" />

                  </div>

                  <h3 className="font-semibold text-lg mb-2">

                    Better Engagement

                  </h3>

                  <p className="text-sm text-muted-foreground leading-6">

                    Improved interaction between students and alumni.

                  </p>

                </div>

              </div>


              {/* STATUS BOX */}
              <div className="rounded-3xl border bg-gradient-to-r from-primary/5 to-purple-500/5 p-8 text-center">

                <div className="flex items-center justify-center gap-2 mb-4">

                  <Clock3 className="h-6 w-6 text-primary" />

                  <h2 className="text-2xl font-bold">

                    Development in Progress

                  </h2>

                </div>


                <p className="text-muted-foreground leading-8 max-w-2xl mx-auto">

                  Our team is actively building this module to provide the best
                  possible experience for students, alumni, and administrators.
                  Stay connected for upcoming releases and exciting updates.

                </p>

              </div>


              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">

                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-2xl px-8 h-12"
                  onClick={() =>
                    navigate(-1)
                  }
                >

                  <ArrowLeft className="mr-2 h-4 w-4" />

                  Go Back

                </Button>


                <Button
                  size="lg"
                  className="rounded-2xl px-8 h-12"
                  asChild
                >

                  <Link to="/">

                    Back to Home

                  </Link>

                </Button>

              </div>

            </CardContent>

          </Card>

        </motion.div>

      </div>

    </div>

  );

};


// ==========================================
// EXPORT
// ==========================================
export default ComingSoon;