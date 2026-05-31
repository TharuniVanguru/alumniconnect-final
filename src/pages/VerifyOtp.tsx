import { useState } from "react";

import {
  useLocation,
  useNavigate,
  Link,
} from "react-router-dom";

import { motion }
  from "framer-motion";

import { Button }
  from "@/components/ui/button";

import { Input }
  from "@/components/ui/input";

import { Label }
  from "@/components/ui/label";

import {

  Card,
  CardContent,
  CardDescription,
  CardTitle,

} from "@/components/ui/card";

import { apiPost } from "@/utils/api";

import { useToast }
  from "@/hooks/use-toast";

import {

  ShieldCheck,
  KeyRound,
  Sparkles,
  Mail,
  Loader2,
  ArrowRight,
  CheckCircle2,
  Shield,

} from "lucide-react";


// =====================================
// COMPONENT
// =====================================
const VerifyOtp = () => {

  const loc =
    useLocation();

  const state =
    (loc.state || {}) as any;

  const navigate =
    useNavigate();

  const { toast } =
    useToast();


  // =====================================
  // STATES
  // =====================================
  const [
    identifier,
    setIdentifier,
  ] = useState(
    state.identifier || ""
  );

  const [
    otp,
    setOtp,
  ] = useState("");

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);


  // =====================================
  // VERIFY OTP
  // =====================================
  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        setIsLoading(true);


        const data =
          await apiPost(

            "/auth/verify-otp",

            {

              identifier,
              otp,

            }

          );


        // apiPost will throw on invalid OTP or other failure cases


        // SUCCESS
        toast({

          title:
            "OTP Verified ✅",

          description:
            "Proceed to reset your password",

        });


        navigate(

          "/reset-password",

          {

            state: {

              identifier,
              otp,

            },

          }

        );

      }

      catch (err) {

        console.error(err);

        toast({

          title:
            "Server Error",

          description:
            "Could not connect to backend",

          variant:
            "destructive",

        });

      }

      finally {

        setIsLoading(false);

      }

    };


  return (

    <div className="min-h-screen relative overflow-hidden bg-background flex items-center justify-center px-4 py-10">


      {/* ===================================== */}
      {/* BACKGROUND EFFECTS */}
      {/* ===================================== */}

      <div className="absolute inset-0 overflow-hidden">


        <div className="absolute -top-24 -left-24 h-96 w-96 bg-violet-500/20 rounded-full blur-3xl" />


        <div className="absolute bottom-0 right-0 h-[450px] w-[450px] bg-indigo-500/20 rounded-full blur-3xl" />


        <div className="absolute top-1/2 left-1/2 h-[350px] w-[350px] bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      </div>


      {/* ===================================== */}
      {/* CARD */}
      {/* ===================================== */}

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
          duration: 0.5,
        }}

        className="relative z-10 w-full max-w-md"

      >

        <Card className="overflow-hidden rounded-[32px] border-0 shadow-2xl bg-background/90 backdrop-blur-xl">


          {/* ===================================== */}
          {/* TOP SECTION */}
          {/* ===================================== */}

          <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white p-10">


            <div className="absolute inset-0 bg-black/10" />


            <div className="relative text-center">


              <div className="flex justify-center mb-6">

                <div className="h-20 w-20 rounded-3xl bg-white/20 border border-white/20 flex items-center justify-center shadow-2xl">

                  <ShieldCheck className="h-10 w-10 text-yellow-300" />

                </div>

              </div>


              <CardTitle className="text-4xl font-bold mb-3">

                Verify OTP

              </CardTitle>


              <CardDescription className="text-white/90 text-base leading-7">

                Enter the OTP sent to your
                registered email address
                to continue password recovery.

              </CardDescription>

            </div>

          </div>


          {/* ===================================== */}
          {/* CONTENT */}
          {/* ===================================== */}

          <CardContent className="p-8">


            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >


              {/* IDENTIFIER */}

              <div className="space-y-2">

                <Label>

                  Identifier

                </Label>


                <div className="relative">

                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />


                  <Input

                    value={identifier}

                    onChange={(e) =>
                      setIdentifier(
                        e.target.value
                      )
                    }

                    placeholder="Student ID / Alumni ID"

                    className="pl-11 h-12 rounded-2xl"

                    required

                  />

                </div>

              </div>


              {/* OTP */}

              <div className="space-y-2">

                <Label>

                  OTP Code

                </Label>


                <div className="relative">

                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />


                  <Input

                    value={otp}

                    onChange={(e) =>
                      setOtp(
                        e.target.value
                      )
                    }

                    placeholder="Enter OTP"

                    className="pl-11 h-12 rounded-2xl tracking-[0.3em] text-center text-lg font-semibold"

                    required

                  />

                </div>

              </div>


              {/* SECURITY INFO */}

              <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4 flex gap-3">

                <Shield className="h-5 w-5 text-primary mt-0.5" />


                <div>

                  <h4 className="font-semibold text-sm">

                    Secure Verification

                  </h4>


                  <p className="text-xs text-muted-foreground leading-6">

                    Your OTP is encrypted and valid
                    only for a limited time.

                  </p>

                </div>

              </div>


              {/* OTP READY */}

              {

                otp.length >= 4 && (

                  <div className="flex items-center gap-2 text-green-600 text-sm">

                    <CheckCircle2 className="h-4 w-4" />

                    OTP looks good

                  </div>

                )

              }


              {/* BUTTON */}

              <Button

                type="submit"

                disabled={isLoading}

                className="w-full h-12 rounded-2xl text-base font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 shadow-lg"

              >

                {

                  isLoading ? (

                    <>

                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                      Verifying OTP...

                    </>

                  ) : (

                    <>

                      Verify OTP

                      <ArrowRight className="ml-2 h-4 w-4" />

                    </>

                  )

                }

              </Button>

            </form>


            {/* RESEND */}

            <div className="mt-8 text-center text-sm text-muted-foreground">

              Didn’t receive OTP?

              <Link

                to="/forgot-password"

                className="ml-1 font-semibold text-primary hover:underline"

              >

                Resend OTP

              </Link>

            </div>


            {/* FOOTER */}

            <div className="mt-8 text-center text-xs text-muted-foreground">

              © 2025 AlumniConnect • Developed by Tharuni

            </div>

          </CardContent>

        </Card>

      </motion.div>

    </div>

  );

};

export default VerifyOtp;