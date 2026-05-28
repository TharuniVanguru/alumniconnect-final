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
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { Header }
  from "@/components/layout/Header";


interface ComingSoonProps {

  pageName?: string;

  description?: string;

}


export const ComingSoon:
React.FC<ComingSoonProps> = ({

  pageName = "This Page",

  description =
    "This feature is currently under development and will be available soon. Stay tuned for exciting updates!",

}) => {

  const navigate =
    useNavigate();


  return (

    <div className="min-h-screen bg-background">

      <Header />

      <div className="flex items-center justify-center px-4 py-12">

        <Card className="w-full max-w-2xl shadow-2xl rounded-3xl border-0 overflow-hidden">


          {/* TOP BANNER */}
          <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-10 text-center">

            <div className="mx-auto h-24 w-24 rounded-full bg-white/20 flex items-center justify-center mb-6 shadow-lg">

              <Construction className="h-12 w-12" />

            </div>


            <h1 className="text-4xl font-bold mb-3">

              {pageName}

            </h1>


            <p className="text-white/90 text-lg leading-7">

              This feature is coming soon 🚀

            </p>

          </div>


          {/* CONTENT */}
          <CardHeader className="text-center">

            <CardTitle className="flex items-center justify-center gap-2 text-2xl">

              <Sparkles className="h-6 w-6 text-primary" />

              Under Development

            </CardTitle>


            <CardDescription className="text-base mt-2 leading-7">

              {description}

            </CardDescription>

          </CardHeader>


          <CardContent className="space-y-6 text-center">


            {/* FEATURE BOX */}
            <div className="bg-muted/40 rounded-2xl p-6 border">

              <div className="flex items-center justify-center gap-2 mb-3">

                <Rocket className="h-5 w-5 text-primary" />

                <h2 className="font-semibold text-lg">

                  What's Coming?

                </h2>

              </div>


              <p className="text-muted-foreground leading-7">

                We’re building powerful new features to make AlumniConnect smarter,
                faster, and more interactive for students and alumni.

              </p>

            </div>


            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              <Button
                variant="outline"
                size="lg"
                className="rounded-xl"
                onClick={() =>
                  navigate(-1)
                }
              >

                <ArrowLeft className="mr-2 h-4 w-4" />

                Go Back

              </Button>


              <Button
                size="lg"
                className="rounded-xl"
                asChild
              >

                <Link to="/">

                  Back to Home

                </Link>

              </Button>

            </div>

          </CardContent>

        </Card>

      </div>

    </div>

  );

};