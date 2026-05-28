import {
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { Header }
  from "@/components/layout/Header";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Input }
  from "@/components/ui/input";

import { Textarea }
  from "@/components/ui/textarea";

import { Button }
  from "@/components/ui/button";

import { Badge }
  from "@/components/ui/badge";

import {

  AlertCircle,
  Send,
  Loader2,
  Sparkles,
  BookOpen,
  Brain,
  Briefcase,
  Code,
  Rocket,
  CheckCircle2,

} from "lucide-react";

import {
  useToast,
} from "@/hooks/use-toast";


// ==========================================
// COMPONENT
// ==========================================
const GuidanceRequestPage =
  () => {

    // ======================================
    // NAVIGATION
    // ======================================
    const navigate =
      useNavigate();

    const { alumniId } =
      useParams();


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
    // TOAST
    // ======================================
    const { toast } =
      useToast();


    // ======================================
    // STATES
    // ======================================
    const [

      domain,
      setDomain,

    ] = useState("");


    const [

      topic,
      setTopic,

    ] = useState("");


    const [

      description,
      setDescription,

    ] = useState("");


    const [

      urgency,
      setUrgency,

    ] = useState("Medium");


    const [

      loading,
      setLoading,

    ] = useState(false);


    const [

      error,
      setError,

    ] = useState("");


    // ======================================
    // SEND REQUEST
    // ======================================
    const sendRequest =
      async () => {

        try {

          setError("");


          // VALIDATION
          if (

            !domain.trim() ||
            !topic.trim() ||
            !description.trim()

          ) {

            setError(
              "Please fill all fields before submitting."
            );

            return;

          }


          setLoading(true);


          await axios.post(

            "http://localhost:5000/guidance",

            {

              alumniId,

              domain,

              topic,

              description,

              urgency,

            },

            {

              headers: {

                Authorization:
                  `Bearer ${userInfo.token}`,

              },

            }

          );


          toast({

            title:
              "Guidance Request Sent 🚀",

            description:
              "Your mentorship request has been submitted successfully.",

          });


          navigate(
            "/student/dashboard"
          );

        }

        catch (error: any) {

          console.log(error);

          setError(

            error.response?.data
              ?.message ||

            "Failed to send request"

          );

        }

        finally {

          setLoading(false);

        }

      };


    // ======================================
    // QUICK TOPICS
    // ======================================
    const quickTopics = [

      {
        icon:
          <Briefcase className="h-4 w-4" />,

        title:
          "Career Guidance",
      },

      {
        icon:
          <Code className="h-4 w-4" />,

        title:
          "Project Help",
      },

      {
        icon:
          <Brain className="h-4 w-4" />,

        title:
          "Interview Prep",
      },

      {
        icon:
          <BookOpen className="h-4 w-4" />,

        title:
          "Resume Review",
      },

      {
        icon:
          <Rocket className="h-4 w-4" />,

        title:
          "Startup Mentorship",
      },

    ];


    // ======================================
    // UI
    // ======================================
    return (

      <div className="min-h-screen bg-background">

        <Header />

        <div className="max-w-4xl mx-auto px-4 py-8">

          {/* ================================= */}
          {/* HERO */}
          {/* ================================= */}
          <div className="mb-8">

            <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-primary via-purple-600 to-pink-500 text-white shadow-2xl">

              <div className="p-8 md:p-10">

                <div className="flex items-center gap-3 mb-4">

                  <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">

                    <Sparkles className="h-7 w-7" />

                  </div>


                  <div>

                    <h1 className="text-4xl font-bold">

                      Guidance Request

                    </h1>

                    <p className="text-white/90 mt-1">

                      Connect with experienced alumni mentors

                    </p>

                  </div>

                </div>


                <p className="text-white/90 leading-7 max-w-3xl">

                  Ask doubts about career paths, interview preparation, projects, resume reviews,
                  internships, startups, higher studies, roadmap guidance, and more.

                </p>

              </div>

            </div>

          </div>


          {/* ================================= */}
          {/* MAIN CARD */}
          {/* ================================= */}
          <Card className="shadow-2xl rounded-3xl border-0">

            <CardContent className="p-8 space-y-8">

              {/* ERROR */}
              {error && (

                <div className="flex items-center gap-3 bg-red-100 text-red-700 px-5 py-4 rounded-2xl">

                  <AlertCircle className="h-5 w-5 flex-shrink-0" />

                  <p className="text-sm font-medium">

                    {error}

                  </p>

                </div>

              )}


              {/* QUICK TOPICS */}
              <div>

                <h2 className="text-lg font-semibold mb-4">

                  Popular Guidance Categories

                </h2>


                <div className="flex flex-wrap gap-3">

                  {quickTopics.map(
                    (
                      item,
                      index
                    ) => (

                      <Badge

                        key={index}

                        variant="outline"

                        className="px-4 py-2 rounded-xl cursor-pointer hover:bg-primary hover:text-white transition-all"

                        onClick={() =>
                          setTopic(
                            item.title
                          )
                        }

                      >

                        {item.icon}

                        <span className="ml-2">

                          {item.title}

                        </span>

                      </Badge>

                    )
                  )}

                </div>

              </div>


              {/* DOMAIN */}
              <div className="space-y-3">

                <label className="text-sm font-semibold">

                  Domain

                </label>


                <Input

                  placeholder="Ex: Web Development, AI, Data Science, Cyber Security..."

                  value={domain}

                  onChange={(e) =>
                    setDomain(
                      e.target.value
                    )
                  }

                  className="h-12 rounded-2xl"

                />

              </div>


              {/* TOPIC */}
              <div className="space-y-3">

                <label className="text-sm font-semibold">

                  Guidance Topic

                </label>


                <Input

                  placeholder="Ex: Resume Review, Career Roadmap, Interview Prep..."

                  value={topic}

                  onChange={(e) =>
                    setTopic(
                      e.target.value
                    )
                  }

                  className="h-12 rounded-2xl"

                />

              </div>


              {/* DESCRIPTION */}
              <div className="space-y-3">

                <label className="text-sm font-semibold">

                  Detailed Description

                </label>


                <Textarea

                  placeholder="Explain your doubts, goals, or problems clearly so the mentor can help effectively..."

                  value={description}

                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }

                  className="min-h-[220px] rounded-2xl resize-none"

                />

              </div>


              {/* URGENCY */}
              <div className="space-y-3">

                <label className="text-sm font-semibold">

                  Urgency Level

                </label>


                <select

                  value={urgency}

                  onChange={(e) =>
                    setUrgency(
                      e.target.value
                    )
                  }

                  className="w-full border border-input rounded-2xl bg-background px-4 h-12"

                >

                  <option>

                    Low

                  </option>

                  <option>

                    Medium

                  </option>

                  <option>

                    High

                  </option>

                </select>

              </div>


              {/* INFO BOX */}
              <div className="rounded-2xl bg-muted/40 p-5 border">

                <div className="flex items-start gap-3">

                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />


                  <div>

                    <h3 className="font-semibold mb-1">

                      Tips for Better Guidance

                    </h3>


                    <ul className="text-sm text-muted-foreground space-y-1">

                      <li>

                        • Clearly explain your current skill level

                      </li>

                      <li>

                        • Mention your career goals

                      </li>

                      <li>

                        • Ask specific questions

                      </li>

                      <li>

                        • Share deadlines if any

                      </li>

                    </ul>

                  </div>

                </div>

              </div>


              {/* BUTTON */}
              <Button

                onClick={sendRequest}

                disabled={loading}

                className="w-full h-14 rounded-2xl text-lg font-semibold shadow-lg"

              >

                {loading ? (

                  <div className="flex items-center gap-3">

                    <Loader2 className="h-5 w-5 animate-spin" />

                    Sending Request...

                  </div>

                ) : (

                  <div className="flex items-center gap-3">

                    <Send className="h-5 w-5" />

                    Send Guidance Request

                  </div>

                )}

              </Button>

            </CardContent>

          </Card>

        </div>

      </div>

    );

  };


export default GuidanceRequestPage;