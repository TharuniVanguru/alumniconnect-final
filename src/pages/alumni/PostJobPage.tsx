import {
  useState,
} from "react";

import api, { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/utils/api";
import { Header }
  from "@/components/layout/Header";

import {

  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,

} from "@/components/ui/card";

import { Input }
  from "@/components/ui/input";

import { Textarea }
  from "@/components/ui/textarea";

import { Button }
  from "@/components/ui/button";

import { Label }
  from "@/components/ui/label";

import {
  Badge,
} from "@/components/ui/badge";

import {
  useToast,
} from "@/hooks/use-toast";

import {

  Briefcase,
  Building2,
  MapPin,
  IndianRupee,
  FileText,
  Clock3,
  Loader2,
  CheckCircle2,
  Sparkles,
  CalendarDays,
  Users,
  ShieldCheck,
  Rocket,
  GraduationCap,
  Code2,

} from "lucide-react";


// ==========================================
// COMPONENT
// ==========================================
const PostJobPage:
  React.FC = () => {

    // ======================================
    // STATES
    // ======================================
    const [

      title,
      setTitle,

    ] = useState("");


    const [

      company,
      setCompany,

    ] = useState("");


    const [

      location,
      setLocation,

    ] = useState("");


    const [

      type,
      setType,

    ] = useState(
      "Internship"
    );


    const [

      description,
      setDescription,

    ] = useState("");


    const [

      salary,
      setSalary,

    ] = useState("");


    const [

      experience,
      setExperience,

    ] = useState("");


    const [

      skills,
      setSkills,

    ] = useState("");


    const [

      deadline,
      setDeadline,

    ] = useState("");


    const [

      loading,
      setLoading,

    ] = useState(false);


    // ======================================
    // TOAST
    // ======================================
    const { toast } =
      useToast();


    // ======================================
    // USER INFO
    // ======================================
    const userInfo =
      JSON.parse(

        localStorage.getItem(
          "userInfo"
        ) || "{}"

      );


    // ======================================
    // SUBMIT JOB
    // ======================================
    const submit =
      async () => {

        // VALIDATION
        if (

          !title ||
          !company ||
          !location ||
          !description

        ) {

          toast({

            title:
              "Missing Fields",

            description:
              "Please fill all required fields",

            variant:
              "destructive",

          });

          return;

        }


        try {

          setLoading(true);

          await api.post(

            "/jobs",

            {

              title,

              company,

              location,

              type,

              description,

              salary,

              experience,

              deadline,

              skills:
                skills

                  .split(",")

                  .map(
                    (skill) =>
                      skill.trim()
                  )

                  .filter(Boolean),

            },

            {

              headers: {

                Authorization:
                  `Bearer ${userInfo.token}`,

              },

            }

          );


          // SUCCESS
          toast({

            title:
              "Job Posted Successfully 🚀",

            description:
              "Your job posting is now live.",

          });


          // RESET FORM
          setTitle("");

          setCompany("");

          setLocation("");

          setType(
            "Internship"
          );

          setDescription("");

          setSalary("");

          setExperience("");

          setSkills("");

          setDeadline("");

        }

        catch (err: any) {

          console.error(err);

          toast({

            title:
              "Failed to Post Job",

            description:

              err.response?.data
                ?.message ||

              "Server Error",

            variant:
              "destructive",

          });

        }

        finally {

          setLoading(false);

        }

      };


    // ======================================
    // SKILL ARRAY
    // ======================================
    const skillArray =
      skills

        .split(",")

        .map(
          (skill) =>
            skill.trim()
        )

        .filter(Boolean);


    // ======================================
    // UI
    // ======================================
    return (

      <div className="min-h-screen bg-background">

        <Header />

        <main className="max-w-6xl mx-auto px-4 py-8">


          {/* HERO SECTION */}

          <div className="mb-10">

            <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white shadow-2xl">

              <div className="p-8 md:p-10">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                  <div>

                    <div className="flex items-center gap-4 mb-5">

                      <div className="h-20 w-20 rounded-3xl bg-white/20 flex items-center justify-center">

                        <Briefcase className="h-10 w-10" />

                      </div>


                      <div>

                        <h1 className="text-4xl md:text-5xl font-bold">

                          Post a Job

                        </h1>

                        <p className="text-white/90 mt-2 text-lg">

                          Create career opportunities for students and alumni

                        </p>

                      </div>

                    </div>


                    <div className="flex flex-wrap gap-3">

                      <Badge className="bg-white/20 border-0 text-white">

                        <GraduationCap className="h-3 w-3 mr-1" />

                        Student Hiring

                      </Badge>

                      <Badge className="bg-white/20 border-0 text-white">

                        <ShieldCheck className="h-3 w-3 mr-1" />

                        Verified Alumni

                      </Badge>

                      <Badge className="bg-white/20 border-0 text-white">

                        <Rocket className="h-3 w-3 mr-1" />

                        Career Growth

                      </Badge>

                    </div>

                  </div>


                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 w-full lg:w-[320px]">

                    <h3 className="font-bold text-2xl mb-5">

                      Hiring Benefits

                    </h3>


                    <div className="space-y-4">

                      <div className="flex items-center gap-3">

                        <Users className="h-5 w-5" />

                        <span>

                          Connect with talented students

                        </span>

                      </div>


                      <div className="flex items-center gap-3">

                        <Sparkles className="h-5 w-5" />

                        <span>

                          Reach skilled developers quickly

                        </span>

                      </div>


                      <div className="flex items-center gap-3">

                        <CheckCircle2 className="h-5 w-5" />

                        <span>

                          Verified platform applicants

                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* MAIN CARD */}

          <Card className="shadow-2xl rounded-3xl border-0">

            <CardHeader className="pb-2">

              <CardTitle className="text-3xl">

                Job Details

              </CardTitle>

              <CardDescription className="text-base">

                Fill in the information below to publish your job opening.

              </CardDescription>

            </CardHeader>


            <CardContent className="space-y-8">


              {/* ROW 1 */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                {/* TITLE */}

                <div className="space-y-3">

                  <Label>

                    Job Title

                  </Label>

                  <div className="relative">

                    <Briefcase className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />

                    <Input

                      placeholder="Frontend Developer"

                      value={title}

                      onChange={(e) =>
                        setTitle(
                          e.target.value
                        )
                      }

                      className="pl-12 h-14 rounded-2xl"

                    />

                  </div>

                </div>


                {/* COMPANY */}

                <div className="space-y-3">

                  <Label>

                    Company Name

                  </Label>

                  <div className="relative">

                    <Building2 className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />

                    <Input

                      placeholder="Google"

                      value={company}

                      onChange={(e) =>
                        setCompany(
                          e.target.value
                        )
                      }

                      className="pl-12 h-14 rounded-2xl"

                    />

                  </div>

                </div>

              </div>


              {/* ROW 2 */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                {/* LOCATION */}

                <div className="space-y-3">

                  <Label>

                    Location

                  </Label>

                  <div className="relative">

                    <MapPin className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />

                    <Input

                      placeholder="Hyderabad"

                      value={location}

                      onChange={(e) =>
                        setLocation(
                          e.target.value
                        )
                      }

                      className="pl-12 h-14 rounded-2xl"

                    />

                  </div>

                </div>


                {/* SALARY */}

                <div className="space-y-3">

                  <Label>

                    Salary / Stipend

                  </Label>

                  <div className="relative">

                    <IndianRupee className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />

                    <Input

                      placeholder="8 LPA"

                      value={salary}

                      onChange={(e) =>
                        setSalary(
                          e.target.value
                        )
                      }

                      className="pl-12 h-14 rounded-2xl"

                    />

                  </div>

                </div>

              </div>


              {/* ROW 3 */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


                {/* TYPE */}

                <div className="space-y-3">

                  <Label>

                    Job Type

                  </Label>

                  <select

                    value={type}

                    onChange={(e) =>
                      setType(
                        e.target.value
                      )
                    }

                    className="w-full h-14 px-4 rounded-2xl border border-input bg-background"

                  >

                    <option>

                      Internship

                    </option>

                    <option>

                      Full Time

                    </option>

                    <option>

                      Part Time

                    </option>

                    <option>

                      Remote

                    </option>

                  </select>

                </div>


                {/* EXPERIENCE */}

                <div className="space-y-3">

                  <Label>

                    Experience

                  </Label>

                  <Input

                    placeholder="0-2 Years"

                    value={experience}

                    onChange={(e) =>
                      setExperience(
                        e.target.value
                      )
                    }

                    className="h-14 rounded-2xl"

                  />

                </div>


                {/* DEADLINE */}

                <div className="space-y-3">

                  <Label>

                    Application Deadline

                  </Label>

                  <div className="relative">

                    <CalendarDays className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />

                    <Input

                      type="date"

                      value={deadline}

                      onChange={(e) =>
                        setDeadline(
                          e.target.value
                        )
                      }

                      className="pl-12 h-14 rounded-2xl"

                    />

                  </div>

                </div>

              </div>


              {/* SKILLS */}

              <div className="space-y-3">

                <Label>

                  Required Skills

                </Label>

                <div className="relative">

                  <Code2 className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />

                  <Input

                    placeholder="React, Node.js, MongoDB"

                    value={skills}

                    onChange={(e) =>
                      setSkills(
                        e.target.value
                      )
                    }

                    className="pl-12 h-14 rounded-2xl"

                  />

                </div>


                {/* SKILL BADGES */}

                <div className="flex flex-wrap gap-2 pt-2">

                  {skillArray.map(
                    (
                      skill,
                      index
                    ) => (

                      <Badge
                        key={index}
                        className="rounded-xl px-3 py-1"

                      >

                        {
                          skill
                        }

                      </Badge>

                    )
                  )}

                </div>

              </div>


              {/* DESCRIPTION */}

              <div className="space-y-3">

                <Label>

                  Job Description

                </Label>

                <div className="relative">

                  <FileText className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />

                  <Textarea

                    placeholder="Describe the role, responsibilities, requirements, and benefits..."

                    value={description}

                    onChange={(e) =>
                      setDescription(
                        e.target.value
                      )
                    }

                    rows={8}

                    className="pl-12 rounded-2xl resize-none"

                  />

                </div>

              </div>


              {/* INFO CARD */}

              <div className="rounded-3xl bg-primary/5 border border-primary/10 p-6">

                <div className="flex items-start gap-4">

                  <Clock3 className="h-6 w-6 text-primary mt-1" />

                  <div>

                    <h3 className="font-semibold text-lg mb-2">

                      Job Approval Process

                    </h3>

                    <p className="text-muted-foreground leading-7">

                      Your job posting may be reviewed by administrators before becoming publicly visible on the platform.

                    </p>

                  </div>

                </div>

              </div>


              {/* BUTTON */}

              <div className="flex justify-end">

                <Button

                  onClick={submit}

                  disabled={loading}

                  className="min-w-[220px] h-14 rounded-2xl text-lg font-semibold"

                >

                  {loading ? (

                    <>

                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />

                      Posting...

                    </>

                  ) : (

                    <>

                      <CheckCircle2 className="h-5 w-5 mr-2" />

                      Post Job

                    </>

                  )}

                </Button>

              </div>

            </CardContent>

          </Card>

        </main>

      </div>

    );

  };


export default PostJobPage;