import { useState } from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  motion,
} from "framer-motion";

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
  Progress,
} from "@/components/ui/progress";

import { apiPost } from "@/utils/api";

import {
  useToast,
} from "@/hooks/use-toast";

import {
  Lock,
  ShieldCheck,
  Loader2,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";


// =========================================
// COMPONENT
// =========================================
const ChangePassword = () => {

  // =======================================
  // HOOKS
  // =======================================
  const navigate =
    useNavigate();

  const { toast } =
    useToast();


  // =======================================
  // STATES
  // =======================================
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

  const [
    showOldPassword,
    setShowOldPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);


  // =======================================
  // PASSWORD STRENGTH
  // =======================================
  const getPasswordStrength =
    () => {

      let score = 0;

      if (newPassword.length >= 6)
        score += 25;

      if (/[A-Z]/.test(newPassword))
        score += 25;

      if (/[0-9]/.test(newPassword))
        score += 25;

      if (/[^A-Za-z0-9]/.test(newPassword))
        score += 25;

      return score;

    };


  const passwordStrength =
    getPasswordStrength();


  const getStrengthLabel =
    () => {

      if (passwordStrength <= 25)
        return "Weak";

      if (passwordStrength <= 50)
        return "Medium";

      if (passwordStrength <= 75)
        return "Strong";

      return "Very Strong";

    };


  // =======================================
  // SUBMIT
  // =======================================
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


        // ===================================
        // USER TOKEN
        // ===================================
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


        // ===================================
        // API CALL
        // ===================================
        const data =
          await apiPost(

            "/auth/change-password",

            {

              oldPassword,
              newPassword,

            }

          );


        // apiPost will throw on change password failure


        // ===================================
        // SUCCESS
        // ===================================
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


  // =======================================
  // UI
  // =======================================
  return (

    <div className="min-h-screen bg-background">

      <Header />

      <div className="flex items-center justify-center px-4 py-10">

        <motion.div

          initial={{
            opacity: 0,
            y: 20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 0.4,
          }}

          className="w-full max-w-xl"

        >

          <Card className="shadow-2xl rounded-3xl border-0 overflow-hidden">


            {/* ================================= */}
            {/* TOP SECTION */}
            {/* ================================= */}

            <div className="bg-gradient-to-r from-primary via-purple-600 to-indigo-600 text-white p-8">

              <div className="flex items-center gap-4">

                <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">

                  <ShieldCheck className="h-8 w-8" />

                </div>

                <div>

                  <h1 className="text-3xl font-bold">

                    Change Password

                  </h1>

                  <p className="text-white/90 mt-1">

                    Keep your account secure

                  </p>

                </div>

              </div>

            </div>


            {/* ================================= */}
            {/* FORM HEADER */}
            {/* ================================= */}

            <CardHeader>

              <CardTitle className="flex items-center gap-2">

                <KeyRound className="h-5 w-5 text-primary" />

                Update Your Password

              </CardTitle>

              <CardDescription>

                Enter your current password and choose a strong new password.

              </CardDescription>

            </CardHeader>


            {/* ================================= */}
            {/* FORM */}
            {/* ================================= */}

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
                      type={
                        showOldPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter current password"
                      value={oldPassword}
                      onChange={(e) =>
                        setOldPassword(
                          e.target.value
                        )
                      }
                      className="pl-10 pr-12 h-12 rounded-xl"
                    />

                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() =>
                        setShowOldPassword(
                          !showOldPassword
                        )
                      }
                    >

                      {showOldPassword ? (

                        <EyeOff className="h-4 w-4 text-muted-foreground" />

                      ) : (

                        <Eye className="h-4 w-4 text-muted-foreground" />

                      )}

                    </button>

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
                      type={
                        showNewPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(
                          e.target.value
                        )
                      }
                      className="pl-10 pr-12 h-12 rounded-xl"
                    />

                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() =>
                        setShowNewPassword(
                          !showNewPassword
                        )
                      }
                    >

                      {showNewPassword ? (

                        <EyeOff className="h-4 w-4 text-muted-foreground" />

                      ) : (

                        <Eye className="h-4 w-4 text-muted-foreground" />

                      )}

                    </button>

                  </div>


                  {/* PASSWORD STRENGTH */}
                  {newPassword && (

                    <div className="space-y-2 pt-2">

                      <div className="flex items-center justify-between">

                        <span className="text-sm text-muted-foreground">

                          Password Strength

                        </span>

                        <span className="text-sm font-medium">

                          {getStrengthLabel()}

                        </span>

                      </div>

                      <Progress
                        value={passwordStrength}
                        className="h-2"
                      />

                    </div>

                  )}

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
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      className="pl-10 pr-12 h-12 rounded-xl"
                    />

                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                    >

                      {showConfirmPassword ? (

                        <EyeOff className="h-4 w-4 text-muted-foreground" />

                      ) : (

                        <Eye className="h-4 w-4 text-muted-foreground" />

                      )}

                    </button>

                  </div>


                  {/* MATCH CHECK */}
                  {confirmPassword && (

                    <div className="flex items-center gap-2 text-sm mt-2">

                      {newPassword ===
                      confirmPassword ? (

                        <>

                          <CheckCircle2 className="h-4 w-4 text-green-600" />

                          <span className="text-green-600">

                            Passwords match

                          </span>

                        </>

                      ) : (

                        <>

                          <AlertTriangle className="h-4 w-4 text-red-500" />

                          <span className="text-red-500">

                            Passwords do not match

                          </span>

                        </>

                      )}

                    </div>

                  )}

                </div>


                {/* SECURITY TIPS */}
                <div className="rounded-2xl bg-primary/5 border border-primary/10 p-4">

                  <h3 className="font-semibold mb-2">

                    Password Tips

                  </h3>

                  <ul className="space-y-1 text-sm text-muted-foreground">

                    <li>
                      • Use at least 6 characters
                    </li>

                    <li>
                      • Include uppercase letters
                    </li>

                    <li>
                      • Add numbers and symbols
                    </li>

                    <li>
                      • Avoid using personal information
                    </li>

                  </ul>

                </div>


                {/* SUBMIT BUTTON */}
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

        </motion.div>

      </div>

    </div>

  );

};


export default ChangePassword;