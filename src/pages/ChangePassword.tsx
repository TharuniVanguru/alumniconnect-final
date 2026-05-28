import { useState } from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Header,
} from "@/components/layout/Header";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  useToast,
} from "@/hooks/use-toast";

import {
  Lock,
  ShieldCheck,
  Loader2,
  KeyRound,
} from "lucide-react";


const ChangePassword = () => {

  const navigate =
    useNavigate();

  const { toast } =
    useToast();


  // =========================
  // STATES
  // =========================
  const [
    oldPassword,
    setOldPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);


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
        if (
          !oldPassword ||
          !newPassword ||
          !confirmPassword
        ) {

          toast({

            title:
              "Missing Fields",

            description:
              "Please fill all fields",

            variant:
              "destructive",

          });

          return;

        }


        if (
          newPassword.length < 6
        ) {

          toast({

            title:
              "Weak Password",

            description:
              "Password must contain at least 6 characters",

            variant:
              "destructive",

          });

          return;

        }


        if (
          newPassword !==
          confirmPassword
        ) {

          toast({

            title:
              "Passwords Do Not Match",

            description:
              "Confirm password should match new password",

            variant:
              "destructive",

          });

          return;

        }


        setIsLoading(true);


        // USER TOKEN
        const userInfo =
          JSON.parse(

            localStorage.getItem(
              "userInfo"
            ) || "{}"

          );


        if (!userInfo?.token) {

          toast({

            title:
              "Unauthorized",

            description:
              "Please login again",

            variant:
              "destructive",

          });

          navigate("/login");

          return;

        }


        // API CALL
        const response =
          await fetch(

            "http://localhost:5000/auth/change-password",

            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${userInfo.token}`,

              },

              body: JSON.stringify({

                oldPassword,
                newPassword,

              }),

            }

          );


        const data =
          await response.json();


        // ERROR
        if (!response.ok) {

          toast({

            title:
              "Password Change Failed",

            description:
              data.message ||
              "Something went wrong",

            variant:
              "destructive",

          });

          return;

        }


        // SUCCESS
        toast({

          title:
            "Password Updated Successfully",

          description:
            "Please login with your new password",

        });


        // CLEAR STORAGE
        localStorage.removeItem(
          "userInfo"
        );


        // REDIRECT
        navigate("/login");

      }

      catch (error) {

        console.log(error);

        toast({

          title:
            "Server Error",

          description:
            "Unable to connect to server",

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


          {/* TOP SECTION */}
          <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-8">

            <div className="flex items-center gap-4 mb-4">

              <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center">

                <ShieldCheck className="h-8 w-8" />

              </div>

              <div>

                <h1 className="text-3xl font-bold">

                  Change Password

                </h1>

                <p className="text-white/90">

                  Keep your account secure

                </p>

              </div>

            </div>

          </div>


          {/* FORM */}
          <CardHeader>

            <CardTitle className="flex items-center gap-2">

              <KeyRound className="h-5 w-5 text-primary" />

              Update Your Password

            </CardTitle>

            <CardDescription>

              Enter your current password and choose a new secure password.

            </CardDescription>

          </CardHeader>


          <CardContent>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* OLD PASSWORD */}
              <div className="space-y-2">

                <Label htmlFor="oldPassword">

                  Current Password

                </Label>

                <div className="relative">

                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                  <Input
                    id="oldPassword"
                    type="password"
                    placeholder="Enter current password"
                    value={oldPassword}
                    onChange={(e) =>
                      setOldPassword(
                        e.target.value
                      )
                    }
                    className="pl-10 h-12 rounded-xl"
                  />

                </div>

              </div>


              {/* NEW PASSWORD */}
              <div className="space-y-2">

                <Label htmlFor="newPassword">

                  New Password

                </Label>

                <div className="relative">

                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(
                        e.target.value
                      )
                    }
                    className="pl-10 h-12 rounded-xl"
                  />

                </div>

              </div>


              {/* CONFIRM PASSWORD */}
              <div className="space-y-2">

                <Label htmlFor="confirmPassword">

                  Confirm Password

                </Label>

                <div className="relative">

                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
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

                    Updating Password...

                  </div>

                ) : (

                  "Update Password"

                )}

              </Button>

            </form>

          </CardContent>

        </Card>

      </div>

    </div>

  );

};


export default ChangePassword;