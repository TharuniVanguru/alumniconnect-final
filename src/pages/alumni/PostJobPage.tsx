import {
  useState,
} from "react";

import axios from "axios";

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

          await axios.post(

            "http://localhost:5000/jobs",

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
              "Job Posted Successfully",

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
    // UI
    // ======================================
    return (

      <div className="min-h-screen bg-background">

        <Header />

        <main className="max-w-5xl mx-auto p-6">

          {/* HEADER */}

          <div className="mb-8">

            <div className="flex items-center gap-3 mb-2">

              <Briefcase className="h-8 w-8 text-primary" />

              <h1 className="text-4xl font-bold">

                Post a Job

              </h1>

            </div>

            <p className="text-muted-foreground">

              Create job opportunities for students and alumni

            </p>

          </div>


          {/* CARD */}

          <Card className="shadow-2xl rounded-3xl border-0">

            <CardHeader>

              <CardTitle className="text-2xl">

                Job Details

              </CardTitle>

              <CardDescription>

                Fill in the information below to publish a job opening.

              </CardDescription>

            </CardHeader>


            <CardContent className="space-y-6">

              {/* ROW 1 */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* TITLE */}

                <div className="space-y-2">

                  <Label>

                    Job Title

                  </Label>

                  <div className="relative">

                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                    <Input

                      placeholder="Frontend Developer"

                      value={title}

                      onChange={(e) =>
                        setTitle(
                          e.target.value
                        )
                      }

                      className="pl-10"

                    />

                  </div>

                </div>


                {/* COMPANY */}

                <div className="space-y-2">

                  <Label>

                    Company Name

                  </Label>

                  <div className="relative">

                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                    <Input

                      placeholder="Google"

                      value={company}

                      onChange={(e) =>
                        setCompany(
                          e.target.value
                        )
                      }

                      className="pl-10"

                    />

                  </div>

                </div>

              </div>


              {/* ROW 2 */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* LOCATION */}

                <div className="space-y-2">

                  <Label>

                    Location

                  </Label>

                  <div className="relative">

                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                    <Input

                      placeholder="Hyderabad"

                      value={location}

                      onChange={(e) =>
                        setLocation(
                          e.target.value
                        )
                      }

                      className="pl-10"

                    />

                  </div>

                </div>


                {/* SALARY */}

                <div className="space-y-2">

                  <Label>

                    Salary / Stipend

                  </Label>

                  <div className="relative">

                    <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                    <Input

                      placeholder="8 LPA"

                      value={salary}

                      onChange={(e) =>
                        setSalary(
                          e.target.value
                        )
                      }

                      className="pl-10"

                    />

                  </div>

                </div>

              </div>


              {/* ROW 3 */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* TYPE */}

                <div className="space-y-2">

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

                    className="w-full h-10 px-3 rounded-md border border-input bg-background"

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

                <div className="space-y-2">

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

                  />

                </div>


                {/* DEADLINE */}

                <div className="space-y-2">

                  <Label>

                    Application Deadline

                  </Label>

                  <Input

                    type="date"

                    value={deadline}

                    onChange={(e) =>
                      setDeadline(
                        e.target.value
                      )
                    }

                  />

                </div>

              </div>


              {/* SKILLS */}

              <div className="space-y-2">

                <Label>

                  Required Skills

                </Label>

                <Input

                  placeholder="React, Node.js, MongoDB"

                  value={skills}

                  onChange={(e) =>
                    setSkills(
                      e.target.value
                    )
                  }

                />


                {/* SKILL BADGES */}

                <div className="flex flex-wrap gap-2 pt-2">

                  {skills
                    .split(",")

                    .filter(
                      Boolean
                    )

                    .map(
                      (
                        skill,
                        index
                      ) => (

                        <Badge
                          key={index}
                          variant="secondary"
                        >

                          {
                            skill.trim()
                          }

                        </Badge>

                      )
                    )}

                </div>

              </div>


              {/* DESCRIPTION */}

              <div className="space-y-2">

                <Label>

                  Job Description

                </Label>

                <div className="relative">

                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                  <Textarea

                    placeholder="Describe the role, responsibilities, requirements, and benefits..."

                    value={description}

                    onChange={(e) =>
                      setDescription(
                        e.target.value
                      )
                    }

                    rows={8}

                    className="pl-10"

                  />

                </div>

              </div>


              {/* INFO CARD */}

              <div className="rounded-2xl bg-primary/5 border border-primary/10 p-5">

                <div className="flex items-start gap-3">

                  <Clock3 className="h-5 w-5 text-primary mt-1" />

                  <div>

                    <h3 className="font-semibold mb-1">

                      Job Approval Process

                    </h3>

                    <p className="text-sm text-muted-foreground">

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

                  className="min-w-[180px] h-12 rounded-xl"

                >

                  {loading ? (

                    <>

                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />

                      Posting...

                    </>

                  ) : (

                    <>

                      <CheckCircle2 className="h-4 w-4 mr-2" />

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