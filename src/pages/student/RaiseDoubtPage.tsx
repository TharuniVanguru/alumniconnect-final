import {
  useState,
} from "react";

import api, { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/utils/api";
import { Header }
  from "@/components/layout/Header";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button }
  from "@/components/ui/button";

import { Input }
  from "@/components/ui/input";

import { Textarea }
  from "@/components/ui/textarea";

import {
  Badge,
} from "@/components/ui/badge";

import {
  useToast,
} from "@/hooks/use-toast";

import {

  AlertCircle,
  Brain,
  BookOpen,
  Code,
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  HelpCircle,
  Rocket,
  Cpu,

} from "lucide-react";


// ==========================================
// COMPONENT
// ==========================================
const RaiseDoubtPage = () => {

  // ========================================
  // TOAST
  // ========================================
  const { toast } =
    useToast();


  // ========================================
  // USER INFO
  // ========================================
  const userInfo =
    JSON.parse(

      localStorage.getItem(
        "userInfo"
      ) || "{}"

    );


  // ========================================
  // STATES
  // ========================================
  const [

    title,
    setTitle,

  ] = useState("");


  const [

    category,
    setCategory,

  ] = useState("Programming");


  const [

    description,
    setDescription,

  ] = useState("");


  const [

    loading,
    setLoading,

  ] = useState(false);


  const [

    error,
    setError,

  ] = useState("");


  // ========================================
  // SUBMIT DOUBT
  // ========================================
  const submitDoubt =
    async () => {

      try {

        setError("");


        // VALIDATION
        if (

          !title.trim() ||

          !description.trim()

        ) {

          setError(
            "Please fill all fields."
          );

          return;

        }


        setLoading(true);


        await api.post(

          "/doubts",

          {

            title,

            category,

            description,

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
            "Doubt Submitted 🚀",

          description:
            "Your doubt has been posted successfully.",

        });


        // RESET
        setTitle("");

        setDescription("");

        setCategory(
          "Programming"
        );

      }

      catch (error: any) {

        console.log(error);

        setError(

          error.response?.data
            ?.message ||

          "Failed to submit doubt"

        );

      }

      finally {

        setLoading(false);

      }

    };


  // ========================================
  // QUICK CATEGORIES
  // ========================================
  const categories = [

    {
      icon:
        <Code className="h-4 w-4" />,

      title:
        "Programming",
    },

    {
      icon:
        <Brain className="h-4 w-4" />,

      title:
        "AI / ML",
    },

    {
      icon:
        <BookOpen className="h-4 w-4" />,

      title:
        "Career",
    },

    {
      icon:
        <Rocket className="h-4 w-4" />,

      title:
        "Projects",
    },

    {
      icon:
        <Cpu className="h-4 w-4" />,

      title:
        "System Design",
    },

  ];


  // ========================================
  // UI
  // ========================================
  return (

    <div className="min-h-screen bg-background">

      <Header />

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* ================================= */}
        {/* HERO */}
        {/* ================================= */}
        <div className="mb-8">

          <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-primary via-purple-600 to-pink-500 text-white shadow-2xl">

            <div className="p-8 md:p-10">

              <div className="flex items-center gap-4 mb-5">

                <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center">

                  <HelpCircle className="h-8 w-8" />

                </div>


                <div>

                  <h1 className="text-4xl font-bold">

                    Raise a Doubt

                  </h1>

                  <p className="text-white/90 mt-2">

                    Ask doubts and get guidance from alumni mentors

                  </p>

                </div>

              </div>


              <p className="text-white/90 leading-7 max-w-3xl">

                Ask questions related to coding,
                projects, placements, internships,
                career guidance, AI/ML, system design,
                resume building, and more.

              </p>

            </div>

          </div>

        </div>


        {/* ================================= */}
        {/* MAIN CARD */}
        {/* ================================= */}
        <Card className="rounded-3xl shadow-2xl border-0">

          <CardContent className="p-8 space-y-8">

            {/* ERROR */}
            {error && (

              <div className="flex items-center gap-3 bg-red-100 text-red-700 px-5 py-4 rounded-2xl">

                <AlertCircle className="h-5 w-5" />

                <p className="font-medium text-sm">

                  {error}

                </p>

              </div>

            )}


            {/* QUICK CATEGORIES */}
            <div>

              <h2 className="text-lg font-semibold mb-4">

                Select Category

              </h2>


              <div className="flex flex-wrap gap-3">

                {categories.map(
                  (
                    item,
                    index
                  ) => (

                    <Badge

                      key={index}

                      variant={
                        category ===
                        item.title

                          ? "default"

                          : "outline"
                      }

                      className={`px-4 py-2 rounded-xl cursor-pointer transition-all ${
                        category ===
                        item.title

                          ? "bg-primary text-white"

                          : "hover:bg-primary hover:text-white"
                      }`}

                      onClick={() =>
                        setCategory(
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


            {/* TITLE */}
            <div className="space-y-3">

              <label className="text-sm font-semibold">

                Doubt Title

              </label>


              <Input

                placeholder="Ex: How to crack MERN interviews?"

                value={title}

                onChange={(e) =>
                  setTitle(
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

                placeholder="Explain your doubt clearly so mentors can guide you effectively..."

                value={description}

                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }

                className="min-h-[220px] rounded-2xl resize-none"

              />

            </div>


            {/* INFO BOX */}
            <div className="rounded-2xl bg-muted/40 border p-5">

              <div className="flex items-start gap-3">

                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />


                <div>

                  <h3 className="font-semibold mb-2">

                    Tips for Better Answers

                  </h3>


                  <ul className="space-y-1 text-sm text-muted-foreground">

                    <li>
                      • Explain your current level
                    </li>

                    <li>
                      • Share error messages if any
                    </li>

                    <li>
                      • Mention deadlines or goals
                    </li>

                    <li>
                      • Ask specific questions
                    </li>

                  </ul>

                </div>

              </div>

            </div>


            {/* BUTTON */}
            <Button

              onClick={submitDoubt}

              disabled={loading}

              className="w-full h-14 rounded-2xl text-lg font-semibold shadow-lg"

            >

              {loading ? (

                <div className="flex items-center gap-3">

                  <Loader2 className="h-5 w-5 animate-spin" />

                  Submitting...

                </div>

              ) : (

                <div className="flex items-center gap-3">

                  <Send className="h-5 w-5" />

                  Submit Doubt

                </div>

              )}

            </Button>

          </CardContent>

        </Card>

      </div>

    </div>

  );

};


export default RaiseDoubtPage;