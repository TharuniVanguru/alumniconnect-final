import {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

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
  useToast,
} from "@/hooks/use-toast";

import {

  Brain,
  Mail,
  Briefcase,
  Sparkles,
  Send,
  Search,
  Star,
  ShieldCheck,
  Loader2,
  MessageCircle,

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

  const [alumni, setAlumni] =
    useState<Alumni[]>([]);

  const [search, setSearch] =
    useState("");

  const [selectedDomain, setSelectedDomain] =
    useState("All");

  const [selectedMentor, setSelectedMentor] =
    useState<Alumni | null>(null);

  const [message, setMessage] =
    useState("");

  const [domain, setDomain] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState("");

  const { toast } =
    useToast();


  // =====================================
  // FETCH ALUMNI
  // =====================================
  const fetchAlumni =
    async () => {

      try {

        setLoading(true);

        const response =
          await axios.get(
            "http://localhost:5000/profile/alumni"
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
          "Failed to load alumni"
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

        await axios.post(

          "http://localhost:5000/mentorship/request",

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

      <div className="max-w-7xl mx-auto p-6">

        {/* ================================= */}
        {/* HERO */}
        {/* ================================= */}
        <div className="mb-10">

          <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-primary via-purple-600 to-pink-500 text-white shadow-2xl">

            <div className="p-8 md:p-10">

              <div className="flex items-center gap-5">

                <div className="h-20 w-20 rounded-3xl bg-white/20 flex items-center justify-center">

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

            </div>

          </div>

        </div>


        {/* ================================= */}
        {/* SEARCH + FILTER */}
        {/* ================================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

          {/* SEARCH */}
          <div className="md:col-span-3 relative">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

            <Input

              placeholder="Search mentors by name, domain, or skills..."

              className="pl-10 h-12 rounded-2xl"

              value={search}

              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }

            />

          </div>


          {/* DOMAIN FILTER */}
          <select

            className="border border-input rounded-2xl h-12 px-4 bg-background"

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

          <div className="bg-red-100 text-red-600 p-4 rounded-xl mb-6">

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

          <div className="text-center py-20">

            <Sparkles className="h-16 w-16 mx-auto text-primary mb-4" />

            <h2 className="text-3xl font-bold mb-2">

              No Mentors Found

            </h2>

            <p className="text-muted-foreground">

              Try changing filters or search query

            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {filteredAlumni.map(
              (mentor) => (

                <Card

                  key={mentor._id}

                  className="rounded-3xl shadow-xl border-0 overflow-hidden hover:scale-[1.02] transition-all duration-300"

                >

                  {/* TOP */}
                  <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-6">

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


                      <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">

                        <Briefcase className="h-7 w-7" />

                      </div>

                    </div>

                  </div>


                  {/* CONTENT */}
                  <CardContent className="p-6">

                    {/* BIO */}
                    <p className="text-muted-foreground mb-5 line-clamp-3">

                      {mentor.bio ||

                        "Experienced alumni mentor helping students build successful careers."}

                    </p>


                    {/* DETAILS */}
                    <div className="space-y-3 mb-5">

                      <div className="flex items-center gap-2 text-sm">

                        <Mail className="h-4 w-4 text-primary" />

                        <span>

                          {mentor.email}

                        </span>

                      </div>


                      <div className="flex items-center gap-2 text-sm">

                        <Briefcase className="h-4 w-4 text-primary" />

                        <span>

                          Domain:
                          {" "}

                          <span className="font-semibold">

                            {mentor.domain || "General"}

                          </span>

                        </span>

                      </div>


                      {/* TRUST SCORE */}
                      <div className="flex items-center gap-2 text-sm">

                        <ShieldCheck className="h-4 w-4 text-green-600" />

                        <span>

                          Trust Score:
                          {" "}

                          <span className="font-semibold text-green-600">

                            {mentor.trustScore || 80}

                          </span>

                        </span>

                      </div>

                    </div>


                    {/* SKILLS */}
                    <div className="flex flex-wrap gap-2 mb-6">

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


                    {/* BUTTONS */}
                    <div className="grid grid-cols-2 gap-3">

                      <Button

                        variant="outline"

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
                            onClick={() =>
                              setSelectedMentor(
                                mentor
                              )
                            }
                          >

                            Request

                          </Button>

                        </DialogTrigger>


                        <DialogContent className="rounded-3xl">

                          <DialogHeader>

                            <DialogTitle className="text-2xl">

                              Send Mentorship Request

                            </DialogTitle>

                          </DialogHeader>


                          <div className="space-y-4">

                            <Input

                              placeholder="Your interested domain"

                              value={domain}

                              onChange={(e) =>
                                setDomain(
                                  e.target.value
                                )
                              }

                            />


                            <Textarea

                              placeholder="Write your mentorship request..."

                              value={message}

                              onChange={(e) =>
                                setMessage(
                                  e.target.value
                                )
                              }

                              className="min-h-[140px]"

                            />


                            <Button

                              className="w-full"

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

              )
            )}

          </div>

        )}

      </div>

    </div>

  );

};


export default MentorshipPage;