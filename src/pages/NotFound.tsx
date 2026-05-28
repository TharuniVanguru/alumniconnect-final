import { useLocation } from "react-router-dom";

import { useEffect } from "react";

import {
  Home,
  ArrowLeft,
  SearchX,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Link } from "react-router-dom";


const NotFound = () => {

  const location =
    useLocation();


  // =====================================
  // LOG ERROR
  // =====================================
  useEffect(() => {

    console.error(

      "404 Error: User attempted to access non-existent route:",

      location.pathname

    );

  }, [location.pathname]);


  return (

    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-100 flex items-center justify-center p-6">


      <Card className="w-full max-w-2xl shadow-2xl border-0 rounded-3xl overflow-hidden">


        {/* TOP SECTION */}

        <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-10 text-center">

          <div className="flex justify-center mb-5">

            <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center">

              <SearchX className="h-12 w-12" />

            </div>

          </div>


          <h1 className="text-7xl font-extrabold mb-3">

            404

          </h1>


          <h2 className="text-3xl font-bold mb-3">

            Page Not Found

          </h2>


          <p className="text-white/90 text-lg max-w-lg mx-auto">

            Oops! The page you are looking for does not exist,
            may have been removed, or is temporarily unavailable.

          </p>

        </div>


        {/* CONTENT */}

        <CardContent className="p-10 text-center">


          {/* ROUTE */}

          <div className="mb-8">

            <p className="text-muted-foreground mb-2">

              Attempted Route

            </p>


            <div className="bg-muted rounded-xl px-4 py-3 text-sm font-medium break-all">

              {location.pathname}

            </div>

          </div>


          {/* BUTTONS */}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">


            {/* HOME BUTTON */}

            <Button
              asChild
              className="h-12 px-6 rounded-xl text-base"
            >

              <Link to="/">

                <Home className="h-5 w-5 mr-2" />

                Go To Home

              </Link>

            </Button>


            {/* BACK BUTTON */}

            <Button
              variant="outline"
              className="h-12 px-6 rounded-xl text-base"
              onClick={() =>
                window.history.back()
              }
            >

              <ArrowLeft className="h-5 w-5 mr-2" />

              Go Back

            </Button>

          </div>


          {/* FOOTER */}

          <div className="mt-10 text-sm text-muted-foreground">

            AlumniConnect • Smart Alumni & Student Networking Platform

          </div>

        </CardContent>

      </Card>

    </div>

  );

};


export default NotFound;