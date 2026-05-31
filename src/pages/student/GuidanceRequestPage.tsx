import {
  useState,
} from "react";

import api, { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/utils/api";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { motion }
  from "framer-motion";

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
  GraduationCap,
  Target,
  Clock3,
  Star,
  Users,

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


          await api.post(

            "/guidance",

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

      {
        icon:
          <GraduationCap className="h-4 w-4" />,

        title:
          "Higher Studies",
      },

    ];


    // ======================================
    // STATS
    // ======================================
    const stats = [

      {

        icon:
          <Users className="h-7 w-7 text-primary" />,

        title:
          "Expert Alumni",

        value:
          "1:1 Mentorship",

      },

      {

        icon:
          <Target className="h-7 w-7 text-green-600" />,

        title:
          "Career Growth",

        value:
          "Industry Guidance",

      },

      {

        icon:
          <Star className="h-7 w-7 text-yellow-500" />,

        title:
          "Trusted Support",

        value:
          "Verified Mentors",

      },

    ];


    // ======================================
    // UI
    // ======================================
    return (

      <div className="min-h-screen bg-background">

        <Header />

        <div className="max-w-5xl mx-auto px-4 py-8">

          {/* ================================= */}
          {/* HERO */}
          {/* ================================= */}
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
              duration: 0.5,
            }}

            className="mb-8"

          >

            <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-primary via-purple-600 to-pink-500 text-white shadow-2xl relative">

              <div className="absolute inset-0 bg-black/10" />

              <div className="relative p-8 md:p-10">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                  <div>

                    <div className="flex items-center gap-4 mb-5">

                      <div className="h-16 w-16 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center">

                        <Sparkles className="h-8 w-8" />

                      </div>

                      <div>

                        <h1 className="text-4xl md:text-5xl font-bold">

                          Guidance Request

                        </h1>

                        <p className="text-white/90 mt-2 text-lg">

                          Connect with experienced alumni mentors

                        </p>

                      </div>

                    </div>


                    <p className="text-white/90 leading-8 max-w-3xl text-base">

                      Ask doubts about career paths, interview preparation,
                      projects, resume reviews, internships, startups,
                      higher studies, roadmap guidance, and more.

                    </p>

                  </div>


                  <div className="hidden lg:flex">

                    <div className="h-40 w-40 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">

                      <Brain className="h-20 w-20 text-white" />

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </motion.div>


          {/* ================================= */}
          {/* STATS */}
          {/* ================================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            {stats.map(
              (
                item,
                index
              ) => (

                <motion.div

                  key={index}

                  initial={{
                    opacity: 0,
                    y: 20,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  transition={{
                    delay:
                      index * 0.1,
                  }}

                >

                  <Card className="rounded-3xl shadow-xl border-0">

                    <CardContent className="p-6 flex items-center gap-4">

                      <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">

                        {item.icon}

                      </div>

                      <div>

                        <p className="text-muted-foreground text-sm">

                          {item.title}

                        </p>

                        <h2 className="text-xl font-bold">

                          {item.value}

                        </h2>

                      </div>

                    </CardContent>

                  </Card>

                </motion.div>

              )
            )}

          </div>


          {/* ================================= */}
          {/* MAIN CARD */}
          {/* ================================= */}
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
              delay: 0.2,
            }}

          >

            <Card className="shadow-2xl rounded-3xl border-0 overflow-hidden">

              <CardContent className="p-8 space-y-8">


                {/* ERROR */}
                {error && (

                  <div className="flex items-center gap-3 bg-red-100 text-red-700 px-5 py-4 rounded-2xl border border-red-200">

                    <AlertCircle className="h-5 w-5 flex-shrink-0" />

                    <p className="text-sm font-medium">

                      {error}

                    </p>

                  </div>

                )}


                {/* QUICK TOPICS */}
                <div>

                  <div className="flex items-center gap-3 mb-5">

                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">

                      <Rocket className="h-6 w-6 text-primary" />

                    </div>

                    <div>

                      <h2 className="text-xl font-bold">

                        Popular Guidance Categories

                      </h2>

                      <p className="text-muted-foreground text-sm">

                        Choose a mentorship category quickly

                      </p>

                    </div>

                  </div>


                  <div className="flex flex-wrap gap-3">

                    {quickTopics.map(
                      (
                        item,
                        index
                      ) => (

                        <Badge

                          key={index}

                          variant="outline"

                          className="px-5 py-3 rounded-2xl cursor-pointer hover:bg-primary hover:text-white transition-all duration-300 text-sm"

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

                  <label className="text-sm font-semibold flex items-center gap-2">

                    <Code className="h-4 w-4 text-primary" />

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

                    className="h-14 rounded-2xl"

                  />

                </div>


                {/* TOPIC */}
                <div className="space-y-3">

                  <label className="text-sm font-semibold flex items-center gap-2">

                    <BookOpen className="h-4 w-4 text-primary" />

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

                    className="h-14 rounded-2xl"

                  />

                </div>


                {/* DESCRIPTION */}
                <div className="space-y-3">

                  <label className="text-sm font-semibold flex items-center gap-2">

                    <Brain className="h-4 w-4 text-primary" />

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

                  <label className="text-sm font-semibold flex items-center gap-2">

                    <Clock3 className="h-4 w-4 text-primary" />

                    Urgency Level

                  </label>


                  <select

                    value={urgency}

                    onChange={(e) =>
                      setUrgency(
                        e.target.value
                      )
                    }

                    className="w-full border border-input rounded-2xl bg-background px-4 h-14"

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
                <div className="rounded-3xl bg-muted/40 p-6 border">

                  <div className="flex items-start gap-4">

                    <div className="h-12 w-12 rounded-2xl bg-green-100 flex items-center justify-center">

                      <CheckCircle2 className="h-6 w-6 text-green-600" />

                    </div>


                    <div>

                      <h3 className="font-bold text-lg mb-3">

                        Tips for Better Guidance

                      </h3>


                      <ul className="text-sm text-muted-foreground space-y-2 leading-7">

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

                        <li>
                          • Include project details if relevant
                        </li>

                      </ul>

                    </div>

                  </div>

                </div>


                {/* BUTTON */}
                <Button

                  onClick={sendRequest}

                  disabled={loading}

                  className="w-full h-16 rounded-2xl text-lg font-semibold shadow-lg"

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

          </motion.div>

        </div>

      </div>

    );

  };


// ==========================================
// EXPORT
// ==========================================
export default GuidanceRequestPage;