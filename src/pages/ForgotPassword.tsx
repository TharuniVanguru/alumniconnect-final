import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  motion,
} from "framer-motion";

import {
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { apiPost } from "@/utils/api";

import {
  useToast,
} from "@/hooks/use-toast";

import {
  Mail,
  Loader2,
  ShieldCheck,
  KeyRound,
  ArrowLeft,
  Sparkles,
  LockKeyhole,
} from "lucide-react";

import {
  Header,
} from "@/components/layout/Header";

import {
  Link,
} from "react-router-dom";


// ==========================================
// COMPONENT
// ==========================================
const ForgotPassword = () => {

  // ========================================
  // STATES
  // ========================================
  const [
    identifier,
    setIdentifier,
  ] = useState("");


  const [
    isLoading,
    setIsLoading,
  ] = useState(false);


  // ========================================
  // HOOKS
  // ========================================
  const navigate =
    useNavigate();

  const { toast } =
    useToast();


  // ========================================
  // SUBMIT
  // ========================================
  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        // VALIDATION
        if (!identifier.trim()) {

          toast({

            title:
              "Missing Field",

            description:
              "Please enter your email or username",

            variant:
              "destructive",

          });

          return;

        }


        setIsLoading(true);


        // ====================================
        // API CALL
        // ====================================
        const data =
          await apiPost(

            "/auth/forgot-password",

            {

              identifier,

            }

          );


        // apiPost will throw on non-success responses


        // ====================================
        // SUCCESS
        // ====================================
        toast({

          title:
            "OTP Sent Successfully",

          description:
            `OTP sent to ${data.email || "your registered email"}`,

        });


        // ====================================
        // NAVIGATE
        // ====================================
        navigate(

          "/verify-otp",

          {

            state: {

              identifier,

            },

          }

        );

      }

      catch (error) {

        console.log(error);

        toast({

          title:
            "Server Error",

          description:
            "Unable to connect to backend server",

          variant:
            "destructive",

        });

      }

      finally {

        setIsLoading(false);

      }

    };


  // ========================================
  // UI
  // ========================================
  return (

    <div className="min-h-screen bg-background overflow-hidden">

      <Header />


      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-10 left-10 h-40 w-40 bg-primary/10 rounded-full blur-3xl" />

      <div className="absolute bottom-10 right-10 h-52 w-52 bg-purple-500/10 rounded-full blur-3xl" />


      <div className="flex items-center justify-center px-4 py-10 relative z-10">

        <motion.div

          initial={{
            opacity: 0,
            y: 20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 0.5,
          }}

          className="w-full max-w-lg"

        >

          <Card className="shadow-2xl rounded-[32px] border-0 overflow-hidden bg-background/95 backdrop-blur-xl">


            {/* ================================= */}
            {/* TOP HERO */}
            {/* ================================= */}

            <div className="relative bg-gradient-to-r from-primary via-purple-600 to-indigo-600 text-white p-8 overflow-hidden">


              {/* DECORATIONS */}
              <div className="absolute top-4 right-4 opacity-20">

                <Sparkles className="h-20 w-20" />

              </div>


              <div className="flex items-center gap-5 relative z-10">

                <motion.div

                  animate={{
                    y: [0, -6, 0],
                  }}

                  transition={{
                    repeat: Infinity,
                    duration: 2,
                  }}

                  className="h-20 w-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg"

                >

                  <ShieldCheck className="h-10 w-10" />

                </motion.div>


                <div>

                  <h1 className="text-4xl font-bold">

                    Forgot Password

                  </h1>

                  <p className="text-white/90 mt-2 text-lg">

                    Recover your account securely

                  </p>

                </div>

              </div>

            </div>


            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <CardHeader className="pt-8">

              <CardTitle className="flex items-center gap-3 text-2xl">

                <LockKeyhole className="h-6 w-6 text-primary" />

                Password Recovery

              </CardTitle>


              <CardDescription className="leading-8 text-base pt-2">

                Enter your registered email or username.
                We’ll send a secure OTP verification code
                to reset your password safely.

              </CardDescription>

            </CardHeader>


            {/* ================================= */}
            {/* FORM */}
            {/* ================================= */}

            <CardContent>

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                {/* EMAIL / USERNAME */}
                <div className="space-y-3">

                  <Label
                    htmlFor="identifier"
                    className="text-sm font-semibold"
                  >

                    Email or Username

                  </Label>


                  <div className="relative">

                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

                    <Input
                      id="identifier"
                      type="text"
                      placeholder="Enter email or username"
                      value={identifier}
                      onChange={(e) =>
                        setIdentifier(
                          e.target.value
                        )
                      }
                      className="pl-12 h-14 rounded-2xl text-base"
                    />

                  </div>

                </div>


                {/* BUTTON */}
                <Button
                  type="submit"
                  className="w-full h-14 rounded-2xl text-lg font-semibold"
                  disabled={isLoading}
                >

                  {isLoading ? (

                    <div className="flex items-center gap-3">

                      <Loader2 className="h-5 w-5 animate-spin" />

                      Sending OTP...

                    </div>

                  ) : (

                    <div className="flex items-center gap-2">

                      <KeyRound className="h-5 w-5" />

                      Send OTP

                    </div>

                  )}

                </Button>


                {/* BACK */}
                <div className="text-center pt-2">

                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >

                    <ArrowLeft className="h-4 w-4" />

                    Back to Login

                  </Link>

                </div>

              </form>

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
export default ForgotPassword;