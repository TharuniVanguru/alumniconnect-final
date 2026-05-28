import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

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

import {
  useToast,
} from "@/hooks/use-toast";

import {
  Mail,
  Loader2,
  ShieldCheck,
  KeyRound,
} from "lucide-react";

import {
  Header,
} from "@/components/layout/Header";


const ForgotPassword = () => {

  const [
    identifier,
    setIdentifier,
  ] = useState("");


  const [
    isLoading,
    setIsLoading,
  ] = useState(false);


  const navigate =
    useNavigate();

  const { toast } =
    useToast();


  // =========================
  // SUBMIT
  // =========================
  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        // VALIDATION
        if (!identifier) {

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


        // API CALL
        const response =
          await fetch(

            "http://localhost:5000/auth/forgot-password",

            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

              },

              body: JSON.stringify({

                identifier,

              }),

            }

          );


        const data =
          await response.json();


        // ERROR
        if (!response.ok) {

          toast({

            title:
              "Request Failed",

            description:
              data.message ||
              "Unable to send OTP",

            variant:
              "destructive",

          });

          return;

        }


        // SUCCESS
        toast({

          title:
            "OTP Sent Successfully",

          description:
            `OTP sent to ${data.email || "your registered email"}`,

        });


        // NAVIGATE
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


  return (

    <div className="min-h-screen bg-background">

      <Header />

      <div className="flex items-center justify-center px-4 py-10">

        <Card className="w-full max-w-lg shadow-2xl rounded-3xl border-0 overflow-hidden">


          {/* TOP BANNER */}
          <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-8">

            <div className="flex items-center gap-4 mb-4">

              <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center">

                <ShieldCheck className="h-8 w-8" />

              </div>


              <div>

                <h1 className="text-3xl font-bold">

                  Forgot Password

                </h1>

                <p className="text-white/90">

                  Reset your password securely

                </p>

              </div>

            </div>

          </div>


          {/* CONTENT */}
          <CardHeader>

            <CardTitle className="flex items-center gap-2">

              <KeyRound className="h-5 w-5 text-primary" />

              Password Recovery

            </CardTitle>


            <CardDescription className="leading-7">

              Enter your registered email or username.
              We’ll send an OTP to verify your identity.

            </CardDescription>

          </CardHeader>


          <CardContent>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* IDENTIFIER */}
              <div className="space-y-2">

                <Label htmlFor="identifier">

                  Email or Username

                </Label>


                <div className="relative">

                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

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
                    className="pl-10 h-12 rounded-xl"
                  />

                </div>

              </div>


              {/* BUTTON */}
              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-lg font-semibold"
                disabled={isLoading}
              >

                {isLoading ? (

                  <div className="flex items-center gap-2">

                    <Loader2 className="h-5 w-5 animate-spin" />

                    Sending OTP...

                  </div>

                ) : (

                  "Send OTP"

                )}

              </Button>

            </form>

          </CardContent>

        </Card>

      </div>

    </div>

  );

};


export default ForgotPassword;