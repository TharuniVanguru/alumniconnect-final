import { Header } from '@/components/layout/Header';

import { Button } from '@/components/ui/button';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

import { Textarea } from '@/components/ui/textarea';

import { Badge } from '@/components/ui/badge';

import {
  User,
  Save,
  X,
  Plus,
  Sparkles,
} from 'lucide-react';

import {
  useState,
  useEffect,
} from 'react';

import api from '@/utils/api';

import { useToast }
  from '@/hooks/use-toast';


// =====================================
// TYPES
// =====================================
interface ProfileType {

  name: string;
  email: string;
  branch: string;
  year: string;
  batch: string;
  domain: string;

  skills: string[];

  interests: string[];

  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;

  bio: string;

  company: string;
  jobRole: string;
  experience: string;

  profileImage: string;

}

interface AnalyticsType {

  profileCompletion?: number;
  trustScore?: number;
  profileStrength?: string;

}


// =====================================
// COMPONENT
// =====================================
const ProfileEdit = () => {

  const { toast } =
    useToast();


  // =====================================
  // STATE
  // =====================================
  const [profile, setProfile] =
    useState<ProfileType>({

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

      profileImage: '',

    });


  const [analytics, setAnalytics] =
    useState<AnalyticsType>({});

  const [newSkill, setNewSkill] =
    useState('');

  const [
    newInterest,
    setNewInterest,
  ] = useState('');

  const [loading, setLoading] =
    useState(false);


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
            (skill) =>

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
            (interest) =>

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
          await api.get(
            '/profile/me'
          );

        setProfile(
          response.data.profile
        );

        setAnalytics(
          response.data.analytics
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
          await api.put(

            '/profile/update',

            profile

          );

        setProfile(
          response.data.profile
        );

        setAnalytics(
          response.data.analytics
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


        {/* PAGE TITLE */}

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


        {/* ANALYTICS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          <Card className="rounded-2xl">

            <CardContent className="p-6">

              <h3 className="text-lg font-semibold mb-2">

                Profile Completion

              </h3>

              <p className="text-3xl font-bold text-primary">

                {analytics.profileCompletion || 0}%

              </p>

            </CardContent>

          </Card>


          <Card className="rounded-2xl">

            <CardContent className="p-6">

              <h3 className="text-lg font-semibold mb-2">

                Trust Score

              </h3>

              <p className="text-3xl font-bold text-green-600">

                {analytics.trustScore || 0}

              </p>

            </CardContent>

          </Card>


          <Card className="rounded-2xl">

            <CardContent className="p-6">

              <h3 className="text-lg font-semibold mb-2">

                Profile Strength

              </h3>

              <p className="text-2xl font-bold text-purple-600">

                {

                  analytics.profileStrength ||

                  'Beginner'

                }

              </p>

            </CardContent>

          </Card>

        </div>


        {/* PROFILE CARD */}

        <Card className="shadow-2xl rounded-3xl border-0 overflow-hidden mb-8">


          {/* TOP SECTION */}

          <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-8">

            <div className="flex items-center gap-6">

              {

                profile.profileImage ? (

                  <img

                    src={profile.profileImage}

                    alt="Profile"

                    className="h-28 w-28 rounded-full object-cover border-4 border-white"

                  />

                ) : (

                  <div className="h-28 w-28 rounded-full bg-white/20 flex items-center justify-center">

                    <User className="h-14 w-14" />

                  </div>

                )

              }


              <div>

                <h2 className="text-3xl font-bold">

                  {profile.name || 'Your Name'}

                </h2>

                <p className="text-white/90 mt-2">

                  {

                    profile.domain ||

                    'Student / Alumni'

                  }

                </p>

              </div>

            </div>

          </div>


          <CardContent className="p-8 space-y-8">


            {/* BASIC INFO */}

            <div>

              <h3 className="text-2xl font-bold mb-6">

                Basic Information

              </h3>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                <Input

                  placeholder="Full Name"

                  value={profile.name}

                  onChange={(e) =>

                    setProfile({

                      ...profile,

                      name:
                        e.target.value,

                    })

                  }

                />


                <Input

                  placeholder="Email"

                  value={profile.email}

                  onChange={(e) =>

                    setProfile({

                      ...profile,

                      email:
                        e.target.value,

                    })

                  }

                />


                <Input

                  placeholder="Branch"

                  value={profile.branch}

                  onChange={(e) =>

                    setProfile({

                      ...profile,

                      branch:
                        e.target.value,

                    })

                  }

                />


                <Input

                  placeholder="Domain"

                  value={profile.domain}

                  onChange={(e) =>

                    setProfile({

                      ...profile,

                      domain:
                        e.target.value,

                    })

                  }

                />


                <Input

                  placeholder="Company"

                  value={profile.company}

                  onChange={(e) =>

                    setProfile({

                      ...profile,

                      company:
                        e.target.value,

                    })

                  }

                />


                <Input

                  placeholder="Job Role"

                  value={profile.jobRole}

                  onChange={(e) =>

                    setProfile({

                      ...profile,

                      jobRole:
                        e.target.value,

                    })

                  }

                />

              </div>

            </div>


            {/* BIO */}

            <div>

              <Label className="mb-2 block">

                Bio

              </Label>

              <Textarea

                className="rounded-2xl min-h-[140px]"

                value={profile.bio}

                onChange={(e) =>

                  setProfile({

                    ...profile,

                    bio:
                      e.target.value,

                  })

                }

              />

            </div>


            {/* SKILLS */}

            <div>

              <h3 className="text-xl font-bold mb-4">

                Skills

              </h3>

              <div className="flex flex-wrap gap-3 mb-4">

                {profile.skills.map(
                  (skill) => (

                    <Badge
                      key={skill}
                    >

                      {skill}

                      <button

                        type="button"

                        onClick={() =>
                          handleRemoveSkill(skill)
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

                />

                <Button
                  type="button"
                  onClick={
                    handleAddSkill
                  }
                >

                  <Plus className="h-4 w-4" />

                </Button>

              </div>

            </div>


            {/* INTERESTS */}

            <div>

              <h3 className="text-xl font-bold mb-4">

                Interests

              </h3>

              <div className="flex flex-wrap gap-3 mb-4">

                {profile.interests.map(
                  (interest) => (

                    <Badge
                      key={interest}
                      variant="outline"
                    >

                      {interest}

                      <button

                        type="button"

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

                />

                <Button
                  type="button"
                  onClick={
                    handleAddInterest
                  }
                >

                  <Plus className="h-4 w-4" />

                </Button>

              </div>

            </div>


            {/* SOCIAL LINKS */}

            <div>

              <h3 className="text-xl font-bold mb-5">

                Social Links

              </h3>


              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


                <Input

                  placeholder="LinkedIn URL"

                  value={
                    profile.linkedinUrl
                  }

                  onChange={(e) =>

                    setProfile({

                      ...profile,

                      linkedinUrl:
                        e.target.value,

                    })

                  }

                />


                <Input

                  placeholder="GitHub URL"

                  value={
                    profile.githubUrl
                  }

                  onChange={(e) =>

                    setProfile({

                      ...profile,

                      githubUrl:
                        e.target.value,

                    })

                  }

                />


                <Input

                  placeholder="Portfolio URL"

                  value={
                    profile.portfolioUrl
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


            {/* SAVE BUTTON */}

            <div className="flex justify-end gap-4 pt-5">


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

                {

                  loading
                    ? 'Saving...'
                    : 'Save Changes'

                }

              </Button>

            </div>

          </CardContent>

        </Card>

      </main>

    </div>

  );

};

export default ProfileEdit;