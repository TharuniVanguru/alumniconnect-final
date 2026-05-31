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
  User,
} from "@/types/user";

import {
  useNavigate,
  Link,
  useLocation,
} from "react-router-dom";

import {
  GraduationCap,
  Shield,
  Loader2,
  User as UserIcon,
  Eye,
  EyeOff,
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

  const [submitting, setSubmitting] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);


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
  } = useAuth();


  // ========================================
  // REDIRECT PATH
  // ========================================
  const from =
    (
      location.state as any
    )?.from;


  // ========================================
  // HANDLE LOGIN
  // ========================================
  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (submitting) return;

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


    if (password.length < 6) {

      setFormError(
        "Password must be at least 6 characters"
      );

      return;

    }


    try {

      setSubmitting(true);


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

        const errorMessage =

          result.message ||
          "Invalid credentials";

        setFormError(
          errorMessage
        );

        toast({

          title:
            "Login Failed",

          description:
            errorMessage,

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


      // ====================================
      // SAFE PARSE
      // ====================================
      let user: User;

      try {

        user =
          JSON.parse(
            storedUser
          );

      }

      catch {

        setFormError(
          "Invalid user data"
        );

        return;

      }


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
      if (
        from &&
        from !== "/login"
      ) {

        navigate(
          from,
          {
            replace: true,
          }
        );

        return;

      }


      // ====================================
      // ROLE REDIRECT
      // ====================================
      switch (user.role) {

        case "student":

          navigate(
            "/student/dashboard",
            {
              replace: true,
            }
          );

          break;

        case "alumni":

          navigate(
            "/alumni/dashboard",
            {
              replace: true,
            }
          );

          break;

        case "admin":

          navigate(
            "/admin/dashboard",
            {
              replace: true,
            }
          );

          break;

        default:

          navigate(
            "/",
            {
              replace: true,
            }
          );

      }

    }

    catch (error: any) {

      console.log(
        "LOGIN ERROR:",
        error
      );

      const errorMessage =

        error?.response?.data
          ?.message ||

        "Server connection failed";

      setFormError(
        errorMessage
      );

      toast({

        title:
          "Server Error",

        description:
          errorMessage,

        variant:
          "destructive",

      });

    }

    finally {

      setSubmitting(false);

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
      "Password123"
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
      <UserIcon className="h-4 w-4" />,

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

                    disabled={submitting}

                    required

                  />

                </div>


                {/* PASSWORD */}
                <div className="space-y-2">

                  <Label htmlFor="password">

                    Password

                  </Label>

                  <div className="relative">

                    <Input

                      id="password"

                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }

                      placeholder="Enter password"

                      autoComplete="current-password"

                      value={password}

                      onChange={(e) =>

                        setPassword(
                          e.target.value
                        )

                      }

                      disabled={submitting}

                      required

                    />


                    <button

                      type="button"

                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"

                      onClick={() =>

                        setShowPassword(
                          !showPassword
                        )

                      }

                    >

                      {showPassword ? (

                        <EyeOff className="h-4 w-4" />

                      ) : (

                        <Eye className="h-4 w-4" />

                      )}

                    </button>

                  </div>

                </div>


                {/* LOGIN BUTTON */}
                <Button

                  type="submit"

                  className="w-full"

                  disabled={submitting}

                  variant="hero"

                >

                  {submitting ? (

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


export default LoginForm;