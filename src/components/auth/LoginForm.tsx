import {
  useState,
} from "react";

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

  CardFooter,

  CardHeader,

  CardTitle,

} from "@/components/ui/card";

import {

  Tabs,

  TabsContent,

  TabsList,

  TabsTrigger,

} from "@/components/ui/tabs";

import {
  UserRole,
} from "@/types/user";

import {

  useNavigate,

  Link,

  useLocation,

} from "react-router-dom";

import {

  User,

  GraduationCap,

  Shield,

  Loader2,

} from "lucide-react";

import {
  useToast,
} from "@/hooks/use-toast";

import {
  useAuth,
} from "@/contexts/AuthContext";


// ==========================================
// COMPONENT
// ==========================================
export const LoginForm = () => {

  // ========================================
  // STATES
  // ========================================
  const [identifier, setIdentifier] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [activeRole, setActiveRole] =
    useState<UserRole>("student");

  const [formError, setFormError] =
    useState("");


  // ========================================
  // HOOKS
  // ========================================
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const { toast } =
    useToast();

  const {

    login,

    isLoading,

  } = useAuth();


  // ========================================
  // REDIRECT PATH
  // ========================================
  const from =
    (
      location.state as any
    )?.from?.pathname;


  // ========================================
  // HANDLE LOGIN
  // ========================================
  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setFormError("");


    // ======================================
    // VALIDATION
    // ======================================
    if (

      !identifier.trim() ||

      !password.trim()

    ) {

      setFormError(
        "All fields are required"
      );

      toast({

        title:
          "Validation Error",

        description:
          "Please fill all fields",

        variant:
          "destructive",

      });

      return;

    }


    // ======================================
    // PASSWORD VALIDATION
    // ======================================
    if (password.length < 6) {

      setFormError(
        "Password too short"
      );

      return;

    }


    try {

      // ====================================
      // LOGIN API
      // ====================================
      const result =
        await login(

          identifier.trim(),

          password,

          activeRole

        );


      // ====================================
      // LOGIN FAILED
      // ====================================
      if (!result.success) {

        setFormError(

          result.message ||

          "Invalid credentials"

        );

        toast({

          title:
            "Login Failed",

          description:

            result.message ||

            "Invalid credentials",

          variant:
            "destructive",

        });

        return;

      }


      // ====================================
      // GET USER
      // ====================================
      const storedUser =
        localStorage.getItem(
          "userInfo"
        );

      if (!storedUser) {

        navigate("/");

        return;

      }

      const user =
        JSON.parse(
          storedUser
        );


      // ====================================
      // SUCCESS TOAST
      // ====================================
      toast({

        title:
          "Login Successful",

        description:
          `Welcome back ${user.name}`,

      });


      // ====================================
      // RESET FORM
      // ====================================
      setIdentifier("");

      setPassword("");

      setFormError("");


      // ====================================
      // FIRST LOGIN
      // ====================================
      if (
        user.isFirstLogin
      ) {

        navigate(
          "/change-password"
        );

        return;

      }


      // ====================================
      // REDIRECT TO PREVIOUS PAGE
      // ====================================
      if (from) {

        navigate(from);

        return;

      }


      // ====================================
      // ROLE BASED REDIRECT
      // ====================================
      switch (user.role) {

        case "student":

          navigate(
            "/student/dashboard"
          );

          break;

        case "alumni":

          navigate(
            "/alumni/dashboard"
          );

          break;

        case "admin":

          navigate(
            "/admin/dashboard"
          );

          break;

        default:

          navigate("/");

      }

    }

    catch (error) {

      console.log(
        "LOGIN ERROR:",
        error
      );

      setFormError(
        "Server connection failed"
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

  };


  // ========================================
  // QUICK LOGIN
  // ========================================
  const quickLogin = (

    role: UserRole,

    demoIdentifier: string

  ) => {

    setIdentifier(
      demoIdentifier
    );

    setPassword(
      "123456"
    );

    setActiveRole(
      role
    );

    setFormError("");

  };


  // ========================================
  // ROLE ICONS
  // ========================================
  const roleIcons = {

    student:
      <User className="h-4 w-4" />,

    alumni:
      <GraduationCap className="h-4 w-4" />,

    admin:
      <Shield className="h-4 w-4" />,

  };


  // ========================================
  // UI
  // ========================================
  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/10 p-4">

      <Card className="w-full max-w-md shadow-strong border-0">

        <CardHeader className="text-center">

          <CardTitle className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">

            AlumniConnect

          </CardTitle>

          <CardDescription>

            Connect with alumni and grow together

          </CardDescription>

        </CardHeader>


        <CardContent>

          <Tabs

            value={activeRole}

            onValueChange={(value) =>

              setActiveRole(
                value as UserRole
              )

            }

            className="w-full"

          >

            {/* ROLE TABS */}
            <TabsList className="grid w-full grid-cols-3">

              <TabsTrigger
                value="student"
                className="flex items-center gap-1"
              >

                {roleIcons.student}

                <span className="hidden sm:inline">

                  Student

                </span>

              </TabsTrigger>


              <TabsTrigger
                value="alumni"
                className="flex items-center gap-1"
              >

                {roleIcons.alumni}

                <span className="hidden sm:inline">

                  Alumni

                </span>

              </TabsTrigger>


              <TabsTrigger
                value="admin"
                className="flex items-center gap-1"
              >

                {roleIcons.admin}

                <span className="hidden sm:inline">

                  Admin

                </span>

              </TabsTrigger>

            </TabsList>


            <TabsContent
              value={activeRole}
              className="mt-6"
            >

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >

                {/* ERROR */}
                {formError && (

                  <div className="p-3 rounded-lg bg-red-100 text-red-600 text-sm">

                    {formError}

                  </div>

                )}


                {/* IDENTIFIER */}
                <div className="space-y-2">

                  <Label htmlFor="identifier">

                    Identifier

                  </Label>

                  <Input

                    id="identifier"

                    type="text"

                    placeholder="Enter identifier"

                    autoComplete="username"

                    value={identifier}

                    onChange={(e) =>

                      setIdentifier(
                        e.target.value
                      )

                    }

                    disabled={isLoading}

                    required

                  />

                </div>


                {/* PASSWORD */}
                <div className="space-y-2">

                  <Label htmlFor="password">

                    Password

                  </Label>

                  <Input

                    id="password"

                    type="password"

                    placeholder="Enter password"

                    autoComplete="current-password"

                    value={password}

                    onChange={(e) =>

                      setPassword(
                        e.target.value
                      )

                    }

                    disabled={isLoading}

                    required

                  />

                </div>


                {/* LOGIN BUTTON */}
                <Button

                  type="submit"

                  className="w-full"

                  disabled={isLoading}

                  variant="hero"

                >

                  {isLoading ? (

                    <div className="flex items-center gap-2">

                      <Loader2 className="h-4 w-4 animate-spin" />

                      Signing In...

                    </div>

                  ) : (

                    "Sign In"

                  )}

                </Button>

              </form>


              {/* FORGOT PASSWORD */}
              <div className="text-right mt-3">

                <Link

                  to="/forgot-password"

                  className="text-sm text-primary hover:underline"

                >

                  Forgot password?

                </Link>

              </div>


              {/* QUICK LOGIN */}
              <div className="mt-5 p-3 rounded-xl bg-muted">

                <p className="text-sm text-muted-foreground mb-2">

                  Quick demo login

                </p>

                <div className="flex flex-col gap-2">

                  <Button

                    type="button"

                    variant="ghost"

                    size="sm"

                    className="justify-start"

                    onClick={() =>

                      quickLogin(

                        "student",

                        "22A91A05A1"

                      )

                    }

                  >

                    {roleIcons.student}

                    Student Demo

                  </Button>


                  <Button

                    type="button"

                    variant="ghost"

                    size="sm"

                    className="justify-start"

                    onClick={() =>

                      quickLogin(

                        "alumni",

                        "ALU001"

                      )

                    }

                  >

                    {roleIcons.alumni}

                    Alumni Demo

                  </Button>


                  <Button

                    type="button"

                    variant="ghost"

                    size="sm"

                    className="justify-start"

                    onClick={() =>

                      quickLogin(

                        "admin",

                        "ADMIN001"

                      )

                    }

                  >

                    {roleIcons.admin}

                    Admin Demo

                  </Button>

                </div>

              </div>

            </TabsContent>

          </Tabs>

        </CardContent>


        <CardFooter>

          <p className="text-sm text-muted-foreground text-center w-full">

            Don&apos;t have an account?

            <Link

              to="/register"

              className="ml-1 text-primary hover:underline"

            >

              Sign up

            </Link>

          </p>

        </CardFooter>

      </Card>

    </div>

  );

};