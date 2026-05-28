import { useState } from "react";

import {
  useLocation,
  useNavigate,
  Link,
} from "react-router-dom";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {

  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,

} from "@/components/ui/card";

import { useToast }
  from "@/hooks/use-toast";

import {

  ShieldCheck,
  KeyRound,
  Sparkles,
  Mail,

} from "lucide-react";


const VerifyOtp = () => {

  const loc =
    useLocation();

  const state =
    (loc.state || {}) as any;

  const navigate =
    useNavigate();

  const { toast } =
    useToast();


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


  // =========================
  // VERIFY OTP
  // =========================
  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        setIsLoading(true);

        const res =
          await fetch(

            "http://localhost:5000/auth/verify-otp",

            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

              },

              body: JSON.stringify({

                identifier,
                otp,

              }),

            }

          );

        const data =
          await res.json();


        // ERROR
        if (!res.ok) {

          toast({

            title:
              "Invalid OTP",

            description:

              data.message ||

              "OTP verification failed",

            variant:
              "destructive",

          });

          return;

        }


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

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 via-background to-blue-100 p-4 overflow-hidden relative">

      {/* BACKGROUND BLUR */}
      <div className="absolute inset-0">

        <div className="absolute top-10 left-10 h-72 w-72 bg-purple-400/20 rounded-full blur-3xl" />

        <div className="absolute bottom-10 right-10 h-72 w-72 bg-blue-400/20 rounded-full blur-3xl" />

      </div>


      {/* CARD */}
      <Card className="relative w-full max-w-md border-0 shadow-2xl rounded-3xl overflow-hidden bg-background/90 backdrop-blur">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-8 text-center">

          <div className="flex justify-center mb-4">

            <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center">

              <ShieldCheck className="h-8 w-8" />

            </div>

          </div>

          <CardTitle className="text-3xl font-bold">

            Verify OTP

          </CardTitle>

          <CardDescription className="text-white/90 text-base mt-2">

            Enter the OTP sent to your registered email

          </CardDescription>

        </div>


        {/* CONTENT */}
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

                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <Input

                  value={identifier}

                  onChange={(e) =>
                    setIdentifier(
                      e.target.value
                    )
                  }

                  placeholder="Student ID / Alumni ID"

                  className="pl-10 h-12 rounded-xl"

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

                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <Input

                  value={otp}

                  onChange={(e) =>
                    setOtp(
                      e.target.value
                    )
                  }

                  placeholder="Enter OTP"

                  className="pl-10 h-12 rounded-xl tracking-widest"

                  required

                />

              </div>

            </div>


            {/* BUTTON */}
            <Button

              type="submit"

              disabled={isLoading}

              className="w-full h-12 rounded-xl text-lg font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90"

            >

              {isLoading

                ? "Verifying OTP..."

                : "Verify OTP"}

            </Button>

          </form>


          {/* FOOTER */}
          <div className="mt-6 text-center text-sm text-muted-foreground">

            Didn’t receive OTP?

            <Link

              to="/forgot-password"

              className="ml-1 font-semibold text-primary hover:underline"

            >

              Resend OTP

            </Link>

          </div>


          {/* COPYRIGHT */}
          <div className="mt-8 text-center text-xs text-muted-foreground">

            © 2025 AlumniConnect • Developed by Tharuni

          </div>

        </CardContent>

      </Card>

    </div>

  );

};

export default VerifyOtp;