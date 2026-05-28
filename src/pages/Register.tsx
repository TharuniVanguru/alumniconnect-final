import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

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

} from "lucide-react";

import { useToast } from "@/hooks/use-toast";

import { UserRole } from "@/types/user";

const Register = () => {

  const navigate = useNavigate();

  const { toast } = useToast();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [identifier, setIdentifier] = useState("");

  const [password, setPassword] = useState("");

  const [role, setRole] =
    useState<UserRole>("student");

  const [isLoading, setIsLoading] =
    useState(false);


  // ROLE ICONS
  const roleIcons = {

    student:
      <User className="h-4 w-4" />,

    alumni:
      <GraduationCap className="h-4 w-4" />,

    admin:
      <Shield className="h-4 w-4" />,

  };


  // =========================
  // REGISTER
  // =========================
  const handleRegister = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      setIsLoading(true);

      const response = await fetch(

        "http://localhost:5000/auth/register",

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

          },

          body: JSON.stringify({

            name,
            email,
            identifier,
            password,
            role,

          }),

        }

      );

      const data =
        await response.json();


      // ERROR
      if (!response.ok) {

        toast({

          title:
            "Registration Failed",

          description:

            data.message ||

            "Something went wrong",

          variant:
            "destructive",

        });

        return;

      }


      // STORE USER
      localStorage.setItem(

        "userInfo",

        JSON.stringify(data)

      );


      // SUCCESS
      toast({

        title:
          "Registration Successful 🎉",

        description:
          `Welcome ${data.name} to AlumniConnect`,

      });


      // NAVIGATE
      navigate(
        `/${data.role}/dashboard`
      );

    }

    catch (error) {

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


  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 via-background to-blue-100 p-4">

      {/* BACKGROUND BLUR */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute top-10 left-10 h-72 w-72 bg-purple-400/20 rounded-full blur-3xl" />

        <div className="absolute bottom-10 right-10 h-72 w-72 bg-blue-400/20 rounded-full blur-3xl" />

      </div>


      <Card className="relative w-full max-w-md border-0 shadow-2xl rounded-3xl overflow-hidden bg-background/90 backdrop-blur">

        {/* TOP HEADER */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-8 text-center">

          <div className="flex justify-center mb-4">

            <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center">

              <Sparkles className="h-8 w-8" />

            </div>

          </div>

          <CardTitle className="text-3xl font-bold">

            AlumniConnect

          </CardTitle>

          <CardDescription className="text-white/90 text-base mt-2">

            Create your account and start building connections

          </CardDescription>

        </div>


        <CardContent className="p-8">

          {/* ROLE SELECT */}
          <Tabs

            value={role}

            onValueChange={(value) =>
              setRole(value as UserRole)
            }

            className="w-full"

          >

            <TabsList className="grid w-full grid-cols-3 rounded-2xl h-12">

              <TabsTrigger
                value="student"
                className="rounded-xl"
              >

                <div className="flex items-center gap-2">

                  {roleIcons.student}

                  <span>

                    Student

                  </span>

                </div>

              </TabsTrigger>


              <TabsTrigger
                value="alumni"
                className="rounded-xl"
              >

                <div className="flex items-center gap-2">

                  {roleIcons.alumni}

                  <span>

                    Alumni

                  </span>

                </div>

              </TabsTrigger>


              <TabsTrigger
                value="admin"
                className="rounded-xl"
              >

                <div className="flex items-center gap-2">

                  {roleIcons.admin}

                  <span>

                    Admin

                  </span>

                </div>

              </TabsTrigger>

            </TabsList>

          </Tabs>


          {/* FORM */}
          <form
            onSubmit={handleRegister}
            className="space-y-5 mt-8"
          >

            {/* NAME */}
            <div className="space-y-2">

              <Label>

                Full Name

              </Label>

              <div className="relative">

                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <Input

                  type="text"

                  placeholder="Enter your name"

                  value={name}

                  onChange={(e) =>
                    setName(e.target.value)
                  }

                  className="pl-10 h-12 rounded-xl"

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

                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <Input

                  type="email"

                  placeholder="Enter your email"

                  value={email}

                  onChange={(e) =>
                    setEmail(e.target.value)
                  }

                  className="pl-10 h-12 rounded-xl"

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

                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <Input

                  type="text"

                  placeholder="Student ID / Alumni ID"

                  value={identifier}

                  onChange={(e) =>
                    setIdentifier(
                      e.target.value
                    )
                  }

                  className="pl-10 h-12 rounded-xl"

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

                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <Input

                  type="password"

                  placeholder="Enter password"

                  value={password}

                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }

                  className="pl-10 h-12 rounded-xl"

                  required

                />

              </div>

            </div>


            {/* BUTTON */}
            <Button

              type="submit"

              className="w-full h-12 rounded-xl text-lg font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90"

              disabled={isLoading}

            >

              {isLoading

                ? "Creating Account..."

                : "Create Account"}

            </Button>

          </form>


          {/* LOGIN */}
          <p className="text-center text-sm text-muted-foreground mt-6">

            Already have an account?

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

export default Register;