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
  Shield
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

  const roleIcons = {
    student: <User className="h-4 w-4" />,
    alumni: <GraduationCap className="h-4 w-4" />,
    admin: <Shield className="h-4 w-4" />,
  };

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
            "Content-Type": "application/json",
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

      const data = await response.json();

      if (!response.ok) {

        toast({
          title: "Registration Failed",
          description:
            data.message || "Something went wrong",
          variant: "destructive",
        });

        return;
      }

      localStorage.setItem(
        "userInfo",
        JSON.stringify(data)
      );

      toast({
        title: "Registration Successful",
        description:
          `Welcome ${data.name}!`,
      });

      navigate(`/${data.role}/dashboard`);

    }

    catch (error) {

      toast({
        title: "Server Error",
        description:
          "Backend connection failed",
        variant: "destructive",
      });

    }

    finally {

      setIsLoading(false);

    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/10 p-4">

      <Card className="w-full max-w-md shadow-strong">

        <CardHeader className="text-center">

          <CardTitle className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">

            Create Account

          </CardTitle>

          <CardDescription>

            Join AlumniConnect today

          </CardDescription>

        </CardHeader>

        <CardContent>

          <Tabs
            value={role}
            onValueChange={(value) =>
              setRole(value as UserRole)
            }
            className="w-full"
          >

            <TabsList className="grid w-full grid-cols-3">

              <TabsTrigger value="student">
                {roleIcons.student}
              </TabsTrigger>

              <TabsTrigger value="alumni">
                {roleIcons.alumni}
              </TabsTrigger>

              <TabsTrigger value="admin">
                {roleIcons.admin}
              </TabsTrigger>

            </TabsList>

          </Tabs>

          <form
            onSubmit={handleRegister}
            className="space-y-4 mt-6"
          >

            <div className="space-y-2">

              <Label>Name</Label>

              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />

            </div>

            <div className="space-y-2">

              <Label>Email</Label>

              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>

            <div className="space-y-2">

              <Label>Identifier</Label>

              <Input
                type="text"
                placeholder="Student ID / Alumni ID"
                value={identifier}
                onChange={(e) =>
                  setIdentifier(e.target.value)
                }
                required
              />

            </div>

            <div className="space-y-2">

              <Label>Password</Label>

              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >

              {isLoading
                ? "Creating Account..."
                : "Register"}

            </Button>

          </form>

          <p className="text-center text-sm mt-4">

            Already have an account?

            <Link
              to="/login"
              className="text-primary ml-1 hover:underline"
            >

              Login

            </Link>

          </p>

        </CardContent>

      </Card>

    </div>
  );
};

export default Register;