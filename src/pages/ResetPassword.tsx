import { useState } from "react";

import {
  useLocation,
  useNavigate,
  Link,
} from "react-router-dom";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {

  Card,
  CardContent,
  CardDescription,
  CardTitle,

} from "@/components/ui/card";

import { apiPost } from "@/utils/api";

import { useToast } from "@/hooks/use-toast";

import {

  Lock,
  ShieldCheck,
  KeyRound,
  Sparkles,
  Loader2,
  ArrowRight,
  Shield,
  CheckCircle2,

} from "lucide-react";


// =====================================
// COMPONENT
// =====================================
const ResetPassword = () => {

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
  ] = useState(
    state.otp || ""
  );

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirm,
    setConfirm,
  ] = useState("");

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);


  // =====================================
  // RESET PASSWORD
  // =====================================
  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();


      // PASSWORD CHECK
      if (
        password !== confirm
      ) {

        toast({

          title:
            "Password Mismatch",

          description:
            "Passwords do not match",

          variant:
            "destructive",

        });

        return;

      }


      try {

        setIsLoading(true);


        const data =
          await apiPost(

            "/auth/reset-password",

            {

              identifier,
              otp,
              password,

            }

          );


        // apiPost will throw on reset failure or invalid credentials


        // SUCCESS
        toast({

          title:
            "Password Reset Successful 🎉",

          description:
            "Please login with your new password",

        });


        navigate("/login");

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

                Reset Password

              </CardTitle>


              <CardDescription className="text-white/90 text-base leading-7">

                Create a secure new password
                for your AlumniConnect account.

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

                  <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />


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

                    className="pl-11 h-12 rounded-2xl"

                    required

                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div className="space-y-2">

                <Label>

                  New Password

                </Label>


                <div className="relative">

                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />


                  <Input

                    type="password"

                    value={password}

                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }

                    placeholder="Enter new password"

                    className="pl-11 h-12 rounded-2xl"

                    required

                  />

                </div>

              </div>


              {/* CONFIRM PASSWORD */}

              <div className="space-y-2">

                <Label>

                  Confirm Password

                </Label>


                <div className="relative">

                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />


                  <Input

                    type="password"

                    value={confirm}

                    onChange={(e) =>
                      setConfirm(
                        e.target.value
                      )
                    }

                    placeholder="Confirm password"

                    className="pl-11 h-12 rounded-2xl"

                    required

                  />

                </div>

              </div>


              {/* SECURITY BOX */}

              <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4 flex gap-3">

                <Shield className="h-5 w-5 text-primary mt-0.5" />


                <div>

                  <h4 className="font-semibold text-sm">

                    Security Tips

                  </h4>


                  <p className="text-xs text-muted-foreground leading-6">

                    Use a strong password with uppercase,
                    lowercase, numbers, and symbols.

                  </p>

                </div>

              </div>


              {/* PASSWORD MATCH */}

              {

                confirm.length > 0 && (

                  <div className="flex items-center gap-2 text-sm text-green-600">

                    <CheckCircle2 className="h-4 w-4" />

                    Passwords match successfully

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

                      Resetting Password...

                    </>

                  ) : (

                    <>

                      Reset Password

                      <ArrowRight className="ml-2 h-4 w-4" />

                    </>

                  )

                }

              </Button>

            </form>


            {/* LOGIN */}

            <div className="mt-8 text-center text-sm text-muted-foreground">

              Remember your password?

              <Link

                to="/login"

                className="ml-1 font-semibold text-primary hover:underline"

              >

                Login

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

export default ResetPassword;