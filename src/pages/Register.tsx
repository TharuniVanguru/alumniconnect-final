import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

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

import {

  Tabs,
  TabsList,
  TabsTrigger,

} from "@/components/ui/tabs";

import {

  User,
  GraduationCap,
  Shield,
  Sparkles,
  Mail,
  Lock,
  IdCard,
  Loader2,
  ArrowRight,
  ShieldCheck,

} from "lucide-react";

import { apiPost } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

import { UserRole } from "@/types/user";


// =====================================
// COMPONENT
// =====================================
const Register = () => {

  const navigate =
    useNavigate();

  const { toast } =
    useToast();


  // =====================================
  // STATES
  // =====================================
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [identifier, setIdentifier] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState<UserRole>("student");

  const [isLoading, setIsLoading] =
    useState(false);


  // =====================================
  // ROLE ICONS
  // =====================================
  const roleIcons = {

    student:
      <User className="h-4 w-4" />,

    alumni:
      <GraduationCap className="h-4 w-4" />,

    admin:
      <Shield className="h-4 w-4" />,

  };


  // =====================================
  // REGISTER
  // =====================================
  const handleRegister =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        setIsLoading(true);


        // =================================
        // API CALL
        // =================================
        const response =
          await apiPost(

            "/auth/register",

            {

              name:
                name.trim(),

              email:
                email.trim(),

              identifier:
                identifier.trim(),

              password:
                password.trim(),

              role,

            }

          );


        // =================================
        // RESPONSE DATA
        // =================================
        const data =
          response;


        // =================================
        // ERROR
        // =================================
        if (!data) {

          toast({

            title:
              "Registration Failed",

            description:
              "Something went wrong",

            variant:
              "destructive",

          });

          return;

        }


        // =================================
        // STORE TOKEN
        // =================================
        if (data.token) {

          localStorage.setItem(

            "token",

            data.token

          );

        }


        // =================================
        // STORE USER
        // =================================
        localStorage.setItem(

          "userInfo",

          JSON.stringify(

            data.user || data

          )

        );


        // =================================
        // SUCCESS TOAST
        // =================================
        toast({

          title:
            "Registration Successful 🎉",

          description:
            `Welcome ${data.user?.name || name} to AlumniConnect`,

        });


        // =================================
        // NAVIGATE
        // =================================
        navigate(

          `/${data.user?.role || role}/dashboard`

        );

      }

      catch (error) {

        console.log(
          "REGISTER ERROR:",
          error
        );

        toast({

          title:
            "Server Error",

          description:
            "Backend connection failed",

          variant:
            "destructive",

        });

      }

      finally {

        setIsLoading(false);

      }

    };


  // =====================================
  // UI
  // =====================================
  return (

    <div className="min-h-screen relative overflow-hidden bg-background flex items-center justify-center px-4 py-10">


      {/* ===================================== */}
      {/* BACKGROUND */}
      {/* ===================================== */}

      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute -top-20 -left-20 h-96 w-96 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] bg-blue-500/20 rounded-full blur-3xl" />

        <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

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
          {/* TOP */}
          {/* ===================================== */}

          <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white p-10">

            <div className="absolute inset-0 bg-black/10" />


            <div className="relative text-center">

              <div className="flex justify-center mb-6">

                <div className="h-20 w-20 rounded-3xl bg-white/20 border border-white/20 flex items-center justify-center shadow-2xl">

                  <Sparkles className="h-10 w-10 text-yellow-300" />

                </div>

              </div>


              <CardTitle className="text-4xl font-bold mb-3">

                AlumniConnect

              </CardTitle>


              <CardDescription className="text-white/90 text-base leading-7">

                Build connections with alumni,
                mentors, recruiters, and students.

              </CardDescription>

            </div>

          </div>


          {/* ===================================== */}
          {/* FORM */}
          {/* ===================================== */}

          <CardContent className="p-8">


            {/* ROLE */}

            <div className="mb-8">

              <Label className="mb-3 block">

                Select Role

              </Label>


              <Tabs

                value={role}

                onValueChange={(value) =>

                  setRole(
                    value as UserRole
                  )

                }

                className="w-full"

              >

                <TabsList className="grid w-full grid-cols-3 h-14 rounded-2xl p-1 bg-muted/60">


                  <TabsTrigger
                    value="student"
                    className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >

                    <div className="flex flex-col items-center gap-1">

                      {roleIcons.student}

                      <span className="text-xs">

                        Student

                      </span>

                    </div>

                  </TabsTrigger>


                  <TabsTrigger
                    value="alumni"
                    className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >

                    <div className="flex flex-col items-center gap-1">

                      {roleIcons.alumni}

                      <span className="text-xs">

                        Alumni

                      </span>

                    </div>

                  </TabsTrigger>


                  <TabsTrigger
                    value="admin"
                    className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >

                    <div className="flex flex-col items-center gap-1">

                      {roleIcons.admin}

                      <span className="text-xs">

                        Admin

                      </span>

                    </div>

                  </TabsTrigger>

                </TabsList>

              </Tabs>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleRegister}
              className="space-y-5"
            >


              {/* NAME */}

              <div className="space-y-2">

                <Label>

                  Full Name

                </Label>

                <div className="relative">

                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                  <Input

                    type="text"

                    placeholder="Enter your full name"

                    value={name}

                    onChange={(e) =>
                      setName(
                        e.target.value
                      )
                    }

                    className="pl-11 h-12 rounded-2xl"

                    required

                  />

                </div>

              </div>


              {/* EMAIL */}

              <div className="space-y-2">

                <Label>

                  Email Address

                </Label>

                <div className="relative">

                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                  <Input

                    type="email"

                    placeholder="Enter your email"

                    value={email}

                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }

                    className="pl-11 h-12 rounded-2xl"

                    required

                  />

                </div>

              </div>


              {/* IDENTIFIER */}

              <div className="space-y-2">

                <Label>

                  Identifier

                </Label>

                <div className="relative">

                  <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                  <Input

                    type="text"

                    placeholder="Student ID / Alumni ID"

                    value={identifier}

                    onChange={(e) =>

                      setIdentifier(
                        e.target.value
                      )

                    }

                    className="pl-11 h-12 rounded-2xl"

                    required

                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div className="space-y-2">

                <Label>

                  Password

                </Label>

                <div className="relative">

                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                  <Input

                    type="password"

                    placeholder="Enter password"

                    value={password}

                    onChange={(e) =>

                      setPassword(
                        e.target.value
                      )

                    }

                    className="pl-11 h-12 rounded-2xl"

                    required

                  />

                </div>

              </div>


              {/* INFO */}

              <div className="rounded-2xl bg-primary/5 border border-primary/10 p-4 flex gap-3">

                <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />

                <div>

                  <h4 className="font-semibold text-sm">

                    Secure Registration

                  </h4>

                  <p className="text-xs text-muted-foreground leading-6">

                    Your data is encrypted and securely stored
                    within AlumniConnect.

                  </p>

                </div>

              </div>


              {/* BUTTON */}

              <Button

                type="submit"

                className="w-full h-12 rounded-2xl text-base font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 shadow-lg"

                disabled={isLoading}

              >

                {

                  isLoading ? (

                    <>

                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                      Creating Account...

                    </>

                  ) : (

                    <>

                      Create Account

                      <ArrowRight className="ml-2 h-4 w-4" />

                    </>

                  )

                }

              </Button>

            </form>


            {/* LOGIN */}

            <div className="mt-8 text-center text-sm text-muted-foreground">

              Already have an account?

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

export default Register;