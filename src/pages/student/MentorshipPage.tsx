import {
  useEffect,
  useMemo,
  useState,
} from "react";

import api, { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/utils/api";
import { motion }
  from "framer-motion";

import { Header }
  from "@/components/layout/Header";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button }
  from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Textarea }
  from "@/components/ui/textarea";

import { Input }
  from "@/components/ui/input";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Progress,
} from "@/components/ui/progress";

import {
  useToast,
} from "@/hooks/use-toast";

import {

  Brain,
  Mail,
  Briefcase,
  Sparkles,
  Send,
  Search,
  ShieldCheck,
  Loader2,
  MessageCircle,
  Star,
  Users,
  Award,
  TrendingUp,
  Clock3,
  ArrowRight,
  GraduationCap,
  CheckCircle2,

} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";


// =====================================
// INTERFACE
// =====================================
interface Alumni {

  _id: string;

  name: string;

  domain: string;

  email: string;

  bio?: string;

  company?: string;

  experience?: string;

  skills?: string[];

  trustScore?: number;

  availability?: string;

}


// =====================================
// COMPONENT
// =====================================
const MentorshipPage = () => {

  const navigate =
    useNavigate();

  const { toast } =
    useToast();


  // =====================================
  // STATES
  // =====================================
  const [

    alumni,
    setAlumni,

  ] = useState<Alumni[]>([]);


  const [

    search,
    setSearch,

  ] = useState("");


  const [

    selectedDomain,
    setSelectedDomain,

  ] = useState("All");


  const [

    selectedMentor,
    setSelectedMentor,

  ] = useState<Alumni | null>(
    null
  );


  const [

    message,
    setMessage,

  ] = useState("");


  const [

    domain,
    setDomain,

  ] = useState("");


  const [

    loading,
    setLoading,

  ] = useState(false);


  const [

    sending,
    setSending,

  ] = useState(false);


  const [

    error,
    setError,

  ] = useState("");


  // =====================================
  // FETCH ALUMNI
  // =====================================
  const fetchAlumni =
    async () => {

      try {

        setLoading(true);

        const response =
          await api.get(
            "/profile/alumni"
          );


        // SORT BY TRUST SCORE
        const sorted =
          response.data.sort(

            (
              a: Alumni,
              b: Alumni
            ) =>

              (b.trustScore || 0) -
              (a.trustScore || 0)

          );

        setAlumni(
          sorted
        );

      }

      catch (error) {

        console.log(error);

        setError(
          "Failed to load mentors"
        );

      }

      finally {

        setLoading(false);

      }

    };


  // =====================================
  // FILTERED ALUMNI
  // =====================================
  const filteredAlumni =
    useMemo(() => {

      return alumni.filter(

        (mentor) => {

          const matchesSearch =

            mentor.name
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||

            mentor.domain
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||

            mentor.skills?.some(

              (skill) =>

                skill
                  .toLowerCase()
                  .includes(
                    search.toLowerCase()
                  )

            );


          const matchesDomain =

            selectedDomain ===
              "All" ||

            mentor.domain ===
              selectedDomain;


          return (
            matchesSearch &&
            matchesDomain
          );

        }

      );

    }, [

      alumni,
      search,
      selectedDomain,

    ]);


  // =====================================
  // UNIQUE DOMAINS
  // =====================================
  const domains =
    [

      "All",

      ...new Set(
        alumni.map(
          (a) =>
            a.domain
        )
      ),

    ];


  // =====================================
  // SEND REQUEST
  // =====================================
  const sendRequest =
    async () => {

      if (
        !selectedMentor
      ) return;

      try {

        setSending(true);

        const userInfo =
          JSON.parse(

            localStorage.getItem(
              "userInfo"
            ) || "{}"

          );

        await api.post(

          "/mentorship/request",

          {

            alumniId:
              selectedMentor._id,

            alumniName:
              selectedMentor.name,

            message,

            domain,

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
            "Mentorship Request Sent 🚀",

          description:
            `Request successfully sent to ${selectedMentor.name}`,

        });


        setMessage("");

        setDomain("");

        setSelectedMentor(
          null
        );

      }

      catch (error: any) {

        console.log(error);

        toast({

          title:
            "Request Failed",

          description:

            error.response?.data?.message ||

            "Something went wrong",

          variant:
            "destructive",

        });

      }

      finally {

        setSending(false);

      }

    };


  // =====================================
  // LOAD
  // =====================================
  useEffect(() => {

    fetchAlumni();

  }, []);


  // =====================================
  // UI
  // =====================================
  return (

    <div className="min-h-screen bg-background">

      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">


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

          className="mb-10"

        >

          <div className="rounded-[32px] overflow-hidden bg-gradient-to-r from-primary via-violet-600 to-pink-500 text-white shadow-2xl relative">

            <div className="absolute inset-0 bg-black/10" />

            <div className="relative p-8 md:p-12">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

                {/* LEFT */}
                <div className="max-w-3xl">

                  <div className="flex items-center gap-5 mb-6">

                    <div className="h-20 w-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center">

                      <Brain className="h-10 w-10" />

                    </div>


                    <div>

                      <h1 className="text-4xl md:text-5xl font-bold">

                        Alumni Mentorship

                      </h1>

                      <p className="text-white/90 text-lg mt-2">

                        Connect with expert alumni mentors and accelerate your career growth

                      </p>

                    </div>

                  </div>


                  <p className="text-white/90 text-lg leading-8">

                    Get personalized mentorship for placements,
                    interviews, resume building, projects,
                    startups, higher studies, and career guidance.

                  </p>


                  {/* BADGES */}
                  <div className="flex flex-wrap gap-3 mt-8">

                    <Badge className="bg-white/20 border-0 text-white px-4 py-2">

                      <Users className="h-4 w-4 mr-2" />

                      Expert Mentors

                    </Badge>


                    <Badge className="bg-white/20 border-0 text-white px-4 py-2">

                      <GraduationCap className="h-4 w-4 mr-2" />

                      Alumni Network

                    </Badge>


                    <Badge className="bg-white/20 border-0 text-white px-4 py-2">

                      <ShieldCheck className="h-4 w-4 mr-2" />

                      Verified Profiles

                    </Badge>

                  </div>

                </div>


                {/* RIGHT */}
                <div className="grid grid-cols-2 gap-4">

                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 text-center">

                    <h2 className="text-3xl font-bold">

                      {alumni.length}

                    </h2>

                    <p className="text-white/80 text-sm mt-1">

                      Mentors

                    </p>

                  </div>


                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 text-center">

                    <h2 className="text-3xl font-bold">

                      24h

                    </h2>

                    <p className="text-white/80 text-sm mt-1">

                      Avg Response

                    </p>

                  </div>


                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 text-center">

                    <h2 className="text-3xl font-bold">

                      10k+

                    </h2>

                    <p className="text-white/80 text-sm mt-1">

                      Students Guided

                    </p>

                  </div>


                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 text-center">

                    <h2 className="text-3xl font-bold">

                      98%

                    </h2>

                    <p className="text-white/80 text-sm mt-1">

                      Success Rate

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </motion.div>


        {/* ================================= */}
        {/* SEARCH + FILTER */}
        {/* ================================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">

          {/* SEARCH */}
          <div className="md:col-span-3 relative">

            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

            <Input

              placeholder="Search mentors by name, domain, or skills..."

              className="pl-12 h-14 rounded-2xl"

              value={search}

              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }

            />

          </div>


          {/* FILTER */}
          <select

            className="border border-input rounded-2xl h-14 px-4 bg-background"

            value={selectedDomain}

            onChange={(e) =>
              setSelectedDomain(
                e.target.value
              )
            }

          >

            {domains.map(
              (item) => (

                <option
                  key={item}
                >

                  {item}

                </option>

              )
            )}

          </select>

        </div>


        {/* ================================= */}
        {/* ERROR */}
        {/* ================================= */}
        {error && (

          <div className="bg-red-100 text-red-600 p-4 rounded-2xl mb-6">

            {error}

          </div>

        )}


        {/* ================================= */}
        {/* LOADING */}
        {/* ================================= */}
        {loading ? (

          <div className="flex flex-col items-center justify-center py-24">

            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />

            <h2 className="text-2xl font-bold">

              Loading Mentors...

            </h2>

          </div>

        ) : filteredAlumni.length === 0 ? (

          <div className="text-center py-24">

            <Sparkles className="h-16 w-16 mx-auto text-primary mb-5" />

            <h2 className="text-3xl font-bold mb-3">

              No Mentors Found

            </h2>

            <p className="text-muted-foreground">

              Try changing filters or search query

            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

            {filteredAlumni.map(
              (
                mentor,
                index
              ) => (

                <motion.div

                  key={mentor._id}

                  initial={{
                    opacity: 0,
                    y: 20,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                  }}

                >

                  <Card className="rounded-[32px] shadow-2xl border-0 overflow-hidden hover:-translate-y-1 transition-all duration-300">

                    {/* TOP */}
                    <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-7">

                      <div className="flex items-start justify-between">

                        <div>

                          <h2 className="text-2xl font-bold">

                            {mentor.name}

                          </h2>

                          <p className="text-white/90 mt-1">

                            {mentor.company ||

                              mentor.domain ||

                              "Mentor"}

                          </p>

                        </div>


                        <div className="h-16 w-16 rounded-3xl bg-white/20 flex items-center justify-center">

                          <Briefcase className="h-8 w-8" />

                        </div>

                      </div>

                    </div>


                    {/* CONTENT */}
                    <CardContent className="p-7">

                      {/* BIO */}
                      <p className="text-muted-foreground mb-6 leading-7 line-clamp-4">

                        {mentor.bio ||

                          "Experienced alumni mentor helping students achieve career success."}

                      </p>


                      {/* STATS */}
                      <div className="grid grid-cols-2 gap-4 mb-6">

                        <div className="rounded-2xl bg-primary/5 p-4">

                          <div className="flex items-center gap-2 mb-2">

                            <ShieldCheck className="h-4 w-4 text-green-600" />

                            <span className="text-sm">

                              Trust Score

                            </span>

                          </div>

                          <p className="text-2xl font-bold text-green-600">

                            {mentor.trustScore || 80}

                          </p>

                        </div>


                        <div className="rounded-2xl bg-primary/5 p-4">

                          <div className="flex items-center gap-2 mb-2">

                            <TrendingUp className="h-4 w-4 text-primary" />

                            <span className="text-sm">

                              Experience

                            </span>

                          </div>

                          <p className="font-bold">

                            {mentor.experience || "5+ Years"}

                          </p>

                        </div>

                      </div>


                      {/* EMAIL */}
                      <div className="flex items-center gap-2 text-sm mb-4">

                        <Mail className="h-4 w-4 text-primary" />

                        <span>

                          {mentor.email}

                        </span>

                      </div>


                      {/* DOMAIN */}
                      <div className="flex items-center gap-2 text-sm mb-6">

                        <Award className="h-4 w-4 text-primary" />

                        <span>

                          Domain:
                          {" "}

                          <span className="font-semibold">

                            {mentor.domain || "General"}

                          </span>

                        </span>

                      </div>


                      {/* SKILLS */}
                      <div className="flex flex-wrap gap-2 mb-7">

                        {mentor.skills?.slice(0, 5).map(

                          (skill) => (

                            <Badge
                              key={skill}
                              variant="secondary"
                            >

                              {skill}

                            </Badge>

                          )

                        )}

                      </div>


                      {/* PROGRESS */}
                      <div className="mb-7">

                        <div className="flex items-center justify-between mb-2">

                          <span className="text-sm">

                            Mentor Rating

                          </span>

                          <span className="text-sm font-semibold">

                            {mentor.trustScore || 80}%

                          </span>

                        </div>

                        <Progress
                          value={mentor.trustScore || 80}
                          className="h-2"
                        />

                      </div>


                      {/* BUTTONS */}
                      <div className="grid grid-cols-2 gap-3">

                        <Button

                          variant="outline"

                          className="rounded-2xl h-12"

                          onClick={() =>

                            navigate(
                              `/student/chat/${mentor._id}`
                            )

                          }

                        >

                          <MessageCircle className="h-4 w-4 mr-2" />

                          Chat

                        </Button>


                        <Dialog>

                          <DialogTrigger asChild>

                            <Button

                              className="rounded-2xl h-12"

                              onClick={() =>
                                setSelectedMentor(
                                  mentor
                                )
                              }

                            >

                              Request

                              <ArrowRight className="h-4 w-4 ml-2" />

                            </Button>

                          </DialogTrigger>


                          <DialogContent className="rounded-[32px]">

                            <DialogHeader>

                              <DialogTitle className="text-2xl">

                                Send Mentorship Request

                              </DialogTitle>

                            </DialogHeader>


                            <div className="space-y-5">

                              {/* MENTOR */}
                              <div className="rounded-2xl bg-primary/5 p-4">

                                <div className="flex items-center gap-3">

                                  <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center">

                                    <Star className="h-5 w-5" />

                                  </div>

                                  <div>

                                    <h3 className="font-bold">

                                      {mentor.name}

                                    </h3>

                                    <p className="text-sm text-muted-foreground">

                                      {mentor.domain}

                                    </p>

                                  </div>

                                </div>

                              </div>


                              {/* DOMAIN */}
                              <Input

                                placeholder="Your interested domain"

                                value={domain}

                                onChange={(e) =>
                                  setDomain(
                                    e.target.value
                                  )
                                }

                                className="h-12 rounded-2xl"

                              />


                              {/* MESSAGE */}
                              <Textarea

                                placeholder="Write your mentorship request..."

                                value={message}

                                onChange={(e) =>
                                  setMessage(
                                    e.target.value
                                  )
                                }

                                className="min-h-[180px] rounded-2xl"

                              />


                              {/* INFO */}
                              <div className="rounded-2xl bg-muted/40 p-4 border">

                                <div className="flex items-start gap-3">

                                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />

                                  <div>

                                    <h3 className="font-semibold mb-1">

                                      Tips

                                    </h3>

                                    <p className="text-sm text-muted-foreground leading-6">

                                      Clearly explain your goals, current skills,
                                      and what type of mentorship you need.

                                    </p>

                                  </div>

                                </div>

                              </div>


                              {/* BUTTON */}
                              <Button

                                className="w-full h-12 rounded-2xl"

                                disabled={sending}

                                onClick={sendRequest}

                              >

                                {sending ? (

                                  <>

                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />

                                    Sending...

                                  </>

                                ) : (

                                  <>

                                    <Send className="h-4 w-4 mr-2" />

                                    Send Request

                                  </>

                                )}

                              </Button>

                            </div>

                          </DialogContent>

                        </Dialog>

                      </div>

                    </CardContent>

                  </Card>

                </motion.div>

              )
            )}

          </div>

        )}

      </div>

    </div>

  );

};


export default MentorshipPage;