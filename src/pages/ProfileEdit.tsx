import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

import { useAuth } from '@/contexts/AuthContext';

import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building,
  GraduationCap,
  Save,
  X,
  Plus,
  Github,
  Linkedin,
  Globe,
} from 'lucide-react';

import {
  useState,
  useEffect,
} from 'react';

import axios from 'axios';

import { useToast } from '@/hooks/use-toast';


export const ProfileEdit = () => {

  const { user } =
    useAuth();

  const { toast } =
    useToast();


  const [profile, setProfile] =
    useState<any>({

      name: '',
      email: '',
      branch: '',
      year: '',
      batch: '',
      domain: '',

      skills: [],

      interests: [],

      linkedinUrl: '',
      githubUrl: '',
      portfolioUrl: '',

      bio: '',

      company: '',
      jobRole: '',
      experience: '',

    });


  const [newSkill, setNewSkill] =
    useState('');

  const [
    newInterest,
    setNewInterest,
  ] = useState('');

  const [loading, setLoading] =
    useState(false);


  const userInfo =
    JSON.parse(
      localStorage.getItem(
        'userInfo'
      ) || '{}'
    );


  // =========================
  // ADD SKILL
  // =========================
  const handleAddSkill = () => {

    if (
      newSkill.trim() &&
      !profile.skills.includes(
        newSkill.trim()
      )
    ) {

      setProfile({

        ...profile,

        skills: [
          ...profile.skills,
          newSkill.trim(),
        ],

      });

      setNewSkill('');

    }

  };


  // =========================
  // REMOVE SKILL
  // =========================
  const handleRemoveSkill =
    (
      skillToRemove: string
    ) => {

      setProfile({

        ...profile,

        skills:
          profile.skills.filter(
            (
              skill: string
            ) =>
              skill !==
              skillToRemove
          ),

      });

    };


  // =========================
  // ADD INTEREST
  // =========================
  const handleAddInterest =
    () => {

      if (
        newInterest.trim() &&
        !profile.interests.includes(
          newInterest.trim()
        )
      ) {

        setProfile({

          ...profile,

          interests: [
            ...profile.interests,
            newInterest.trim(),
          ],

        });

        setNewInterest('');

      }

    };


  // =========================
  // REMOVE INTEREST
  // =========================
  const handleRemoveInterest =
    (
      interestToRemove: string
    ) => {

      setProfile({

        ...profile,

        interests:
          profile.interests.filter(
            (
              interest: string
            ) =>
              interest !==
              interestToRemove
          ),

      });

    };


  // =========================
  // FETCH PROFILE
  // =========================
  const fetchProfile =
    async () => {

      try {

        const response =
          await axios.get(

            'http://localhost:5000/profile/me',

            {

              headers: {

                Authorization:
                  `Bearer ${userInfo.token}`,

              },

            }

          );

        setProfile(
          response.data
        );

      }

      catch (error) {

        console.error(error);

        toast({

          title:
            'Unable to load profile',

          variant:
            'destructive',

        });

      }

    };


  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {

    fetchProfile();

  }, []);


  // =========================
  // SAVE PROFILE
  // =========================
  const handleSaveProfile =
    async () => {

      try {

        setLoading(true);

        const response =
          await axios.put(

            'http://localhost:5000/profile/update',

            profile,

            {

              headers: {

                Authorization:
                  `Bearer ${userInfo.token}`,

              },

            }

          );

        setProfile(
          response.data
        );

        toast({

          title:
            'Profile Updated',

          description:
            'Your profile has been successfully updated.',

        });

      }

      catch (error) {

        console.error(error);

        toast({

          title:
            'Unable to save profile',

          variant:
            'destructive',

        });

      }

      finally {

        setLoading(false);

      }

    };


  return (

    <div className="min-h-screen bg-background">

      <Header />

      <main className="container mx-auto px-4 py-6 max-w-4xl">

        {/* TITLE */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-foreground mb-2">

            Edit Profile

          </h1>

          <p className="text-muted-foreground">

            Update your personal information and preferences

          </p>

        </div>


        {/* PROFILE PICTURE */}
        <Card className="shadow-soft mb-6">

          <CardHeader>

            <CardTitle>

              Profile Picture

            </CardTitle>

            <CardDescription>

              Update your profile picture

            </CardDescription>

          </CardHeader>

          <CardContent>

            <div className="flex items-center gap-6">

              <div className="h-24 w-24 rounded-full bg-gradient-primary flex items-center justify-center">

                <User className="h-12 w-12 text-white" />

              </div>

              <div className="space-y-2">

                <Button variant="outline">

                  Upload Photo

                </Button>

                <p className="text-xs text-muted-foreground">

                  JPG, PNG or GIF. Max size 2MB.

                </p>

              </div>

            </div>

          </CardContent>

        </Card>


        {/* BASIC INFO */}
        <Card className="shadow-soft mb-6">

          <CardHeader>

            <CardTitle>

              Basic Information

            </CardTitle>

            <CardDescription>

              Update your personal details

            </CardDescription>

          </CardHeader>

          <CardContent className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="space-y-2">

                <Label htmlFor="name">

                  Full Name

                </Label>

                <div className="relative">

                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="pl-10"

                    value={
                      profile.name || ''
                    }

                    onChange={(e) =>
                      setProfile({

                        ...profile,

                        name:
                          e.target.value,

                      })
                    }
                  />

                </div>

              </div>


              <div className="space-y-2">

                <Label htmlFor="email">

                  Email

                </Label>

                <div className="relative">

                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="pl-10"

                    value={
                      profile.email || ''
                    }

                    onChange={(e) =>
                      setProfile({

                        ...profile,

                        email:
                          e.target.value,

                      })
                    }
                  />

                </div>

              </div>

            </div>


            <div className="space-y-2">

              <Label htmlFor="bio">

                Bio

              </Label>

              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                className="min-h-[100px]"

                value={
                  profile.bio || ''
                }

                onChange={(e) =>
                  setProfile({

                    ...profile,

                    bio:
                      e.target.value,

                  })
                }
              />

            </div>

          </CardContent>

        </Card>


        {/* SKILLS */}
        <Card className="shadow-soft mb-6">

          <CardHeader>

            <CardTitle>

              Skills & Interests

            </CardTitle>

            <CardDescription>

              Add your technical and professional strengths

            </CardDescription>

          </CardHeader>

          <CardContent className="space-y-4">

            {/* SKILLS */}
            <div className="flex flex-wrap gap-2">

              {profile.skills?.map(
                (
                  skill: string
                ) => (

                  <Badge
                    key={skill}
                    variant="secondary"
                    className="px-3 py-1"
                  >

                    {skill}

                    <button
                      onClick={() =>
                        handleRemoveSkill(
                          skill
                        )
                      }

                      className="ml-2 hover:text-destructive"
                    >

                      <X className="h-3 w-3" />

                    </button>

                  </Badge>

                )
              )}

            </div>


            <div className="flex gap-2">

              <Input
                placeholder="Add a skill"

                value={newSkill}

                onChange={(e) =>
                  setNewSkill(
                    e.target.value
                  )
                }

                onKeyDown={(e) => {

                  if (
                    e.key ===
                    'Enter'
                  ) {

                    e.preventDefault();

                    handleAddSkill();

                  }

                }}
              />

              <Button
                onClick={
                  handleAddSkill
                }

                variant="outline"
              >

                <Plus className="h-4 w-4" />

              </Button>

            </div>


            {/* INTERESTS */}
            <div className="flex flex-wrap gap-2">

              {profile.interests?.map(
                (
                  interest: string
                ) => (

                  <Badge
                    key={interest}
                    variant="outline"
                    className="px-3 py-1"
                  >

                    {interest}

                    <button
                      onClick={() =>
                        handleRemoveInterest(
                          interest
                        )
                      }

                      className="ml-2 hover:text-destructive"
                    >

                      <X className="h-3 w-3" />

                    </button>

                  </Badge>

                )
              )}

            </div>


            <div className="flex gap-2">

              <Input
                placeholder="Add an interest"

                value={
                  newInterest
                }

                onChange={(e) =>
                  setNewInterest(
                    e.target.value
                  )
                }

                onKeyDown={(e) => {

                  if (
                    e.key ===
                    'Enter'
                  ) {

                    e.preventDefault();

                    handleAddInterest();

                  }

                }}
              />

              <Button
                onClick={
                  handleAddInterest
                }

                variant="outline"
              >

                Add Interest

              </Button>

            </div>

          </CardContent>

        </Card>


        {/* ACTION BUTTONS */}
        <div className="flex gap-4 justify-end">

          <Button
            variant="outline"

            onClick={
              fetchProfile
            }
          >

            Cancel

          </Button>


          <Button
            onClick={
              handleSaveProfile
            }

            disabled={loading}
          >

            <Save className="mr-2 h-4 w-4" />

            {loading
              ? 'Saving...'
              : 'Save Changes'}

          </Button>

        </div>

      </main>

    </div>

  );

};