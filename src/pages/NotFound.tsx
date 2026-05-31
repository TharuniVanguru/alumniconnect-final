import {
  useLocation,
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  Home,
  ArrowLeft,
  SearchX,
  Sparkles,
  ShieldAlert,
  Rocket,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";


// ==========================================
// COMPONENT
// ==========================================
const NotFound = () => {

  // ========================================
  // HOOKS
  // ========================================
  const location =
    useLocation();

  const navigate =
    useNavigate();


  // ========================================
  // LOG ERROR
  // ========================================
  useEffect(() => {

    console.error(

      "404 Error: User attempted to access non-existent route:",

      location.pathname

    );

  }, [location.pathname]);


  // ========================================
  // UI
  // ========================================
  return (

    <div className="min-h-screen bg-background overflow-hidden flex items-center justify-center px-4 py-10 relative">


      {/* ================================= */}
      {/* BACKGROUND EFFECTS */}
      {/* ================================= */}

      <div className="absolute top-0 left-0 h-72 w-72 bg-primary/10 rounded-full blur-3xl" />

      <div className="absolute bottom-0 right-0 h-96 w-96 bg-purple-500/10 rounded-full blur-3xl" />


      {/* ================================= */}
      {/* MAIN CARD */}
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

        className="w-full max-w-3xl relative z-10"

      >

        <Card className="overflow-hidden rounded-[32px] border-0 shadow-2xl bg-background/90 backdrop-blur-xl">


          {/* ================================= */}
          {/* TOP HERO */}
          {/* ================================= */}

          <div className="relative overflow-hidden bg-gradient-to-r from-primary via-purple-600 to-indigo-600 text-white p-10 md:p-14 text-center">


            {/* DECORATIONS */}
            <div className="absolute top-4 right-4 opacity-20">

              <Sparkles className="h-28 w-28" />

            </div>


            <div className="flex justify-center mb-8">

              <motion.div

                animate={{
                  y: [0, -8, 0],
                }}

                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}

                className="h-28 w-28 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl"

              >

                <SearchX className="h-14 w-14" />

              </motion.div>

            </div>


            <h1 className="text-8xl md:text-9xl font-extrabold leading-none mb-4">

              404

            </h1>


            <h2 className="text-3xl md:text-4xl font-bold mb-5">

              Page Not Found

            </h2>


            <p className="text-white/90 text-lg leading-8 max-w-2xl mx-auto">

              Oops! The page you are looking for
              doesn’t exist, may have been removed,
              or is temporarily unavailable.

            </p>

          </div>


          {/* ================================= */}
          {/* CONTENT */}
          {/* ================================= */}

          <CardContent className="p-8 md:p-10">


            {/* ROUTE */}
            <div className="mb-8">

              <div className="flex items-center justify-center gap-2 mb-4">

                <ShieldAlert className="h-5 w-5 text-destructive" />

                <p className="font-semibold text-lg">

                  Attempted Route

                </p>

              </div>


              <div className="bg-muted/50 border rounded-2xl px-5 py-4 text-sm md:text-base font-medium text-center break-all shadow-sm">

                {location.pathname}

              </div>

            </div>


            {/* MESSAGE BOX */}
            <div className="rounded-2xl bg-gradient-to-r from-primary/5 to-purple-500/5 border p-6 mb-8">

              <div className="flex items-center gap-3 mb-3">

                <Rocket className="h-5 w-5 text-primary" />

                <h3 className="font-bold text-lg">

                  What You Can Do

                </h3>

              </div>


              <ul className="space-y-2 text-muted-foreground leading-7">

                <li>
                  • Check if the URL is correct
                </li>

                <li>
                  • Return to the homepage
                </li>

                <li>
                  • Navigate back to the previous page
                </li>

                <li>
                  • Explore AlumniConnect features
                </li>

              </ul>

            </div>


            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">


              {/* HOME */}
              <Button
                asChild
                size="lg"
                className="rounded-2xl h-14 px-8 text-base shadow-lg"
              >

                <Link to="/">

                  <Home className="h-5 w-5 mr-2" />

                  Go To Home

                </Link>

              </Button>


              {/* BACK */}
              <Button
                size="lg"
                variant="outline"
                className="rounded-2xl h-14 px-8 text-base"
                onClick={() =>
                  navigate(-1)
                }
              >

                <ArrowLeft className="h-5 w-5 mr-2" />

                Go Back

              </Button>

            </div>


            {/* FOOTER */}
            <div className="mt-10 text-center">

              <p className="text-sm text-muted-foreground">

                AlumniConnect • Smart Alumni & Student Networking Platform

              </p>

            </div>

          </CardContent>

        </Card>

      </motion.div>

    </div>

  );

};


// ==========================================
// EXPORT
// ==========================================
export default NotFound;