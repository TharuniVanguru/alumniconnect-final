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

import { useToast } from "@/hooks/use-toast";

import {

  Lock,
  ShieldCheck,
  KeyRound,
  Sparkles,

} from "lucide-react";


const ResetPassword = () => {

  const loc = useLocation();

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

  const [otp, setOtp] =
    useState(
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


  // =========================
  // RESET PASSWORD
  // =========================
  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      // PASSWORD MATCH CHECK
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

        const res =
          await fetch(

            "http://localhost:5000/auth/reset-password",

            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

              },

              body: JSON.stringify({

                identifier,
                otp,
                password,

              }),

            }

          );

        const data =
          await res.json();


        // ERROR
        if (!res.ok) {

          toast({

            title:
              "Reset Failed",

            description:

              data.message ||

              "Unable to reset password",

            variant:
              "destructive",

          });

          return;

        }


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

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 via-background to-blue-100 p-4 overflow-hidden relative">

      {/* BACKGROUND BLUR */}
      <div className="absolute inset-0">

        <div className="absolute top-10 left-10 h-72 w-72 bg-purple-400/20 rounded-full blur-3xl" />

        <div className="absolute bottom-10 right-10 h-72 w-72 bg-blue-400/20 rounded-full blur-3xl" />

      </div>


      <Card className="relative w-full max-w-md border-0 shadow-2xl rounded-3xl overflow-hidden bg-background/90 backdrop-blur">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-8 text-center">

          <div className="flex justify-center mb-4">

            <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center">

              <ShieldCheck className="h-8 w-8" />

            </div>

          </div>

          <CardTitle className="text-3xl font-bold">

            Reset Password

          </CardTitle>

          <CardDescription className="text-white/90 text-base mt-2">

            Secure your AlumniConnect account

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

                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

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

                  className="pl-10 h-12 rounded-xl"

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

                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <Input

                  type="password"

                  value={password}

                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }

                  placeholder="Enter new password"

                  className="pl-10 h-12 rounded-xl"

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

                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <Input

                  type="password"

                  value={confirm}

                  onChange={(e) =>
                    setConfirm(
                      e.target.value
                    )
                  }

                  placeholder="Confirm password"

                  className="pl-10 h-12 rounded-xl"

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

                ? "Resetting Password..."

                : "Reset Password"}

            </Button>

          </form>


          {/* LOGIN LINK */}
          <p className="text-center text-sm text-muted-foreground mt-6">

            Remember your password?

            <Link

              to="/login"

              className="ml-1 font-semibold text-primary hover:underline"

            >

              Login

            </Link>

          </p>


          {/* FOOTER */}
          <div className="mt-8 text-center text-xs text-muted-foreground">

            © 2025 AlumniConnect • Developed by Tharuni

          </div>

        </CardContent>

      </Card>

    </div>

  );

};

export default ResetPassword;