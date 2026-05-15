import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';

import { UserRole } from '@/types/user';

import {
  useNavigate,
  Link
} from 'react-router-dom';

import {
  User,
  GraduationCap,
  Shield
} from 'lucide-react';

import { useToast } from '@/hooks/use-toast';

export const LoginForm = () => {

  const [identifier, setIdentifier] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [activeRole, setActiveRole] =
    useState<UserRole>('student');

  const [isLoading, setIsLoading] =
    useState(false);

  const navigate = useNavigate();

  const { toast } = useToast();


  // CLEAR INPUTS WHEN PAGE LOADS
  useEffect(() => {

    setIdentifier('');

    setPassword('');

  }, []);


  // LOGIN FUNCTION
  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      setIsLoading(true);

      const response = await fetch(
        'http://localhost:5000/auth/login',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            identifier,
            password,
          }),
        }
      );

      const data = await response.json();

      // LOGIN FAILED
      if (!response.ok) {

        toast({
          title: 'Login failed',
          description:
            data.message ||
            'Invalid credentials',
          variant: 'destructive',
        });

        return;
      }

      // SAVE USER
      localStorage.setItem(
        'userInfo',
        JSON.stringify(data)
      );

      // SUCCESS
      toast({
        title: 'Welcome back!',
        description:
          `Successfully logged in as ${data.role}`,
      });

      // CLEAR INPUTS
      setIdentifier('');

      setPassword('');

      // REDIRECT
      navigate(`/${data.role}/dashboard`);

    }

    catch (error) {

      toast({
        title: 'Server Error',
        description:
          'Backend connection failed',
        variant: 'destructive',
      });

    }

    finally {

      setIsLoading(false);

    }
  };


  // ROLE ICONS
  const roleIcons = {
    student: <User className="h-4 w-4" />,
    alumni: <GraduationCap className="h-4 w-4" />,
    admin: <Shield className="h-4 w-4" />,
  };


  // QUICK LOGIN
  const quickLogin = (
    role: UserRole,
    demoIdentifier: string
  ) => {

    setIdentifier(demoIdentifier);

    setPassword('123456');

    setActiveRole(role);
  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/10 p-4">

      <Card className="w-full max-w-md shadow-strong">

        <CardHeader className="text-center">

          <CardTitle className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">

            Welcome to AlumniConnect

          </CardTitle>

          <CardDescription>

            Connect, collaborate, and grow with your alumni network

          </CardDescription>

        </CardHeader>


        <CardContent>

          <Tabs
            value={activeRole}
            onValueChange={(value) =>
              setActiveRole(value as UserRole)
            }
            className="w-full"
          >

            <TabsList className="grid w-full grid-cols-3">

              <TabsTrigger
                value="student"
                className="flex items-center space-x-1"
              >

                {roleIcons.student}

                <span className="hidden sm:inline">

                  Student

                </span>

              </TabsTrigger>


              <TabsTrigger
                value="alumni"
                className="flex items-center space-x-1"
              >

                {roleIcons.alumni}

                <span className="hidden sm:inline">

                  Alumni

                </span>

              </TabsTrigger>


              <TabsTrigger
                value="admin"
                className="flex items-center space-x-1"
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
                autoComplete="off"
              >

                {/* IDENTIFIER */}
                <div className="space-y-2">

                  <Label htmlFor="identifier">

                    Identifier

                  </Label>

                  <Input
                    id="identifier"
                    type="text"
                    autoComplete="off"
                    placeholder="Enter your identifier"
                    value={identifier}
                    onChange={(e) =>
                      setIdentifier(e.target.value)
                    }
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
                    autoComplete="new-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
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

                  {isLoading
                    ? 'Signing in...'
                    : 'Sign In'}

                </Button>

              </form>


              {/* QUICK LOGIN */}
              <div className="mt-4 p-3 bg-muted rounded-lg">

                <p className="text-sm text-muted-foreground mb-2">

                  Quick demo login:

                </p>

                <div className="flex flex-col space-y-1">

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      quickLogin(
                        'student',
                        '22A91A05A1'
                      )
                    }
                    className="justify-start"
                  >

                    {roleIcons.student}

                    Student Demo

                  </Button>


                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      quickLogin(
                        'alumni',
                        'ALU001'
                      )
                    }
                    className="justify-start"
                  >

                    {roleIcons.alumni}

                    Alumni Demo

                  </Button>


                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      quickLogin(
                        'admin',
                        'ADMIN001'
                      )
                    }
                    className="justify-start"
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
              className="text-primary hover:underline ml-1"
            >

              Sign up

            </Link>

          </p>

        </CardFooter>

      </Card>

    </div>
  );
};