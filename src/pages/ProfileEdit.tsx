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
  Save,
  X,
  Plus,
  Github,
  Linkedin,
  Globe,
  GraduationCap,
  Briefcase,
  Sparkles,

} from 'lucide-react';

import {

  useState,
  useEffect,

} from 'react';

import axios from 'axios';

import { useToast }
  from '@/hooks/use-toast';


// =====================================
// COMPONENT
// =====================================
export const ProfileEdit =
  () => {

    const { user } =
      useAuth();

    const { toast } =
      useToast();


    // =====================================
    // STATE
    // =====================================
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


    // =====================================
    // ADD SKILL
    // =====================================
    const handleAddSkill =
      () => {

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


    // =====================================
    // REMOVE SKILL
    // =====================================
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


    // =====================================
    // ADD INTEREST
    // =====================================
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


    // =====================================
    // REMOVE INTEREST
    // =====================================
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


    // =====================================
    // FETCH PROFILE
    // =====================================
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


    // =====================================
    // INITIAL LOAD
    // =====================================
    useEffect(() => {

      fetchProfile();

    }, []);


    // =====================================
    // SAVE PROFILE
    // =====================================
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
              'Profile Updated 🚀',

            description:
              'Your profile has been updated successfully.',

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


    // =====================================
    // UI
    // =====================================
    return (

      <div className="min-h-screen bg-background">

        <Header />

        <main className="container mx-auto px-4 py-8 max-w-5xl">


          {/* ===================================== */}
          {/* PAGE TITLE */}
          {/* ===================================== */}

          <div className="mb-10">

            <div className="flex items-center gap-4 mb-3">

              <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center shadow-lg">

                <Sparkles className="h-8 w-8 text-white" />

              </div>

              <div>

                <h1 className="text-4xl font-bold">

                  Edit Profile

                </h1>

                <p className="text-muted-foreground text-lg">

                  Personalize your AlumniConnect profile

                </p>

              </div>

            </div>

          </div>


          {/* ===================================== */}
          {/* PROFILE CARD */}
          {/* ===================================== */}

          <Card className="shadow-2xl rounded-3xl border-0 overflow-hidden mb-8">


            {/* TOP SECTION */}
            <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-8">

              <div className="flex items-center gap-6">

                <div className="h-28 w-28 rounded-full bg-white/20 flex items-center justify-center">

                  <User className="h-14 w-14" />

                </div>


                <div>

                  <h2 className="text-3xl font-bold">

                    {profile.name || 'Your Name'}

                  </h2>

                  <p className="text-white/90 mt-2">

                    {profile.domain || 'Student / Alumni'}

                  </p>

                </div>

              </div>

            </div>


            <CardContent className="p-8 space-y-8">


              {/* ===================================== */}
              {/* BASIC INFO */}
              {/* ===================================== */}

              <div>

                <h3 className="text-2xl font-bold mb-6">

                  Basic Information

                </h3>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                  {/* NAME */}
                  <div className="space-y-2">

                    <Label>

                      Full Name

                    </Label>

                    <div className="relative">

                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                      <Input

                        className="pl-10 h-12 rounded-xl"

                        value={profile.name || ''}

                        placeholder="Enter your name"

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


                  {/* EMAIL */}
                  <div className="space-y-2">

                    <Label>

                      Email

                    </Label>

                    <div className="relative">

                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                      <Input

                        type="email"

                        className="pl-10 h-12 rounded-xl"

                        value={profile.email || ''}

                        placeholder="Enter your email"

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


                  {/* BRANCH */}
                  <div className="space-y-2">

                    <Label>

                      Branch

                    </Label>

                    <div className="relative">

                      <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                      <Input

                        className="pl-10 h-12 rounded-xl"

                        value={profile.branch || ''}

                        placeholder="CSE / ECE / IT"

                        onChange={(e) =>
                          setProfile({

                            ...profile,

                            branch:
                              e.target.value,

                          })
                        }

                      />

                    </div>

                  </div>


                  {/* DOMAIN */}
                  <div className="space-y-2">

                    <Label>

                      Domain

                    </Label>

                    <div className="relative">

                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                      <Input

                        className="pl-10 h-12 rounded-xl"

                        value={profile.domain || ''}

                        placeholder="Web Development / AI"

                        onChange={(e) =>
                          setProfile({

                            ...profile,

                            domain:
                              e.target.value,

                          })
                        }

                      />

                    </div>

                  </div>

                </div>

              </div>


              {/* ===================================== */}
              {/* BIO */}
              {/* ===================================== */}

              <div>

                <Label className="mb-2 block">

                  Bio

                </Label>

                <Textarea

                  className="rounded-2xl min-h-[140px]"

                  placeholder="Tell us about yourself..."

                  value={profile.bio || ''}

                  onChange={(e) =>
                    setProfile({

                      ...profile,

                      bio:
                        e.target.value,

                    })
                  }

                />

              </div>


              {/* ===================================== */}
              {/* SKILLS */}
              {/* ===================================== */}

              <div>

                <h3 className="text-xl font-bold mb-4">

                  Skills

                </h3>


                <div className="flex flex-wrap gap-3 mb-4">

                  {profile.skills?.map(
                    (
                      skill: string
                    ) => (

                      <Badge

                        key={skill}

                        className="px-4 py-2 rounded-full bg-primary/10 text-primary"

                      >

                        {skill}

                        <button

                          onClick={() =>
                            handleRemoveSkill(
                              skill
                            )
                          }

                          className="ml-2"

                        >

                          <X className="h-3 w-3" />

                        </button>

                      </Badge>

                    )
                  )}

                </div>


                <div className="flex gap-3">

                  <Input

                    placeholder="Add skill"

                    value={newSkill}

                    onChange={(e) =>
                      setNewSkill(
                        e.target.value
                      )
                    }

                    className="h-12 rounded-xl"

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
                    variant="outline"
                    onClick={
                      handleAddSkill
                    }
                  >

                    <Plus className="h-4 w-4" />

                  </Button>

                </div>

              </div>


              {/* ===================================== */}
              {/* INTERESTS */}
              {/* ===================================== */}

              <div>

                <h3 className="text-xl font-bold mb-4">

                  Interests

                </h3>


                <div className="flex flex-wrap gap-3 mb-4">

                  {profile.interests?.map(
                    (
                      interest: string
                    ) => (

                      <Badge

                        key={interest}

                        variant="outline"

                        className="px-4 py-2 rounded-full"

                      >

                        {interest}

                        <button

                          onClick={() =>
                            handleRemoveInterest(
                              interest
                            )
                          }

                          className="ml-2"

                        >

                          <X className="h-3 w-3" />

                        </button>

                      </Badge>

                    )
                  )}

                </div>


                <div className="flex gap-3">

                  <Input

                    placeholder="Add interest"

                    value={newInterest}

                    onChange={(e) =>
                      setNewInterest(
                        e.target.value
                      )
                    }

                    className="h-12 rounded-xl"

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
                    variant="outline"
                    onClick={
                      handleAddInterest
                    }
                  >

                    <Plus className="h-4 w-4" />

                  </Button>

                </div>

              </div>


              {/* ===================================== */}
              {/* SOCIAL LINKS */}
              {/* ===================================== */}

              <div>

                <h3 className="text-xl font-bold mb-5">

                  Social Links

                </h3>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


                  {/* LINKEDIN */}
                  <div className="space-y-2">

                    <Label>

                      LinkedIn

                    </Label>

                    <div className="relative">

                      <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                      <Input

                        className="pl-10 h-12 rounded-xl"

                        placeholder="LinkedIn URL"

                        value={
                          profile.linkedinUrl || ''
                        }

                        onChange={(e) =>
                          setProfile({

                            ...profile,

                            linkedinUrl:
                              e.target.value,

                          })
                        }

                      />

                    </div>

                  </div>


                  {/* GITHUB */}
                  <div className="space-y-2">

                    <Label>

                      GitHub

                    </Label>

                    <div className="relative">

                      <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                      <Input

                        className="pl-10 h-12 rounded-xl"

                        placeholder="GitHub URL"

                        value={
                          profile.githubUrl || ''
                        }

                        onChange={(e) =>
                          setProfile({

                            ...profile,

                            githubUrl:
                              e.target.value,

                          })
                        }

                      />

                    </div>

                  </div>


                  {/* PORTFOLIO */}
                  <div className="space-y-2">

                    <Label>

                      Portfolio

                    </Label>

                    <div className="relative">

                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                      <Input

                        className="pl-10 h-12 rounded-xl"

                        placeholder="Portfolio URL"

                        value={
                          profile.portfolioUrl || ''
                        }

                        onChange={(e) =>
                          setProfile({

                            ...profile,

                            portfolioUrl:
                              e.target.value,

                          })
                        }

                      />

                    </div>

                  </div>

                </div>

              </div>


              {/* ===================================== */}
              {/* BUTTONS */}
              {/* ===================================== */}

              <div className="flex justify-end gap-4 pt-5">


                <Button

                  variant="outline"

                  onClick={
                    fetchProfile
                  }

                  className="rounded-xl"

                >

                  Cancel

                </Button>


                <Button

                  className="rounded-xl"

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

            </CardContent>

          </Card>

        </main>

      </div>

    );

  };