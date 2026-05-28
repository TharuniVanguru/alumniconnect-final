import {
  useEffect,
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
  Badge
} from "@/components/ui/badge";

import {
  Input
} from "@/components/ui/input";

import {
  Brain,
  MapPin,
  Briefcase,
  Star,
  MessageSquare,
  Sparkles,
  Search,
  GraduationCap,
  Trophy,
  Users,
  Loader2,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";


// =========================
// TYPES
// =========================
interface Alumni {

  _id: string;

  name: string;

  email: string;

  domain: string;

  skills: string[];

  bio: string;

  branch: string;

  batch: string;

  trustScore: number;

  aiScore?: number;

}


// =========================
// COMPONENT
// =========================
const RecommendationsPage =
  () => {

    const navigate =
      useNavigate();

    const [
      alumni,
      setAlumni,
    ] = useState<
      Alumni[]
    >([]);

    const [
      filteredAlumni,
      setFilteredAlumni,
    ] = useState<
      Alumni[]
    >([]);

    const [
      loading,
      setLoading,
    ] = useState(false);

    const [
      error,
      setError,
    ] = useState("");

    const [
      search,
      setSearch,
    ] = useState("");


    // =========================
    // USER INFO
    // =========================
    const userInfo =
      JSON.parse(
        localStorage.getItem(
          "userInfo"
        ) || "{}"
      );


    // =========================
    // FETCH RECOMMENDATIONS
    // =========================
    const fetchRecommendations =
      async () => {

        try {

          setLoading(true);

          setError("");


          // TOKEN CHECK
          if (!userInfo?.token) {

            setError(
              "Please login again"
            );

            return;

          }


          const response =
            await axios.get(

              "http://localhost:5000/recommendations",

              {
                headers: {

                  Authorization:
                    `Bearer ${userInfo.token}`,

                },
              }

            );


          setAlumni(
            response.data
          );

          setFilteredAlumni(
            response.data
          );

        }

        catch (error: any) {

          console.log(
            "Recommendation Error:",
            error
          );

          setError(

            error?.response?.data?.message ||

            "Failed to load recommendations"

          );

        }

        finally {

          setLoading(false);

        }

      };


    // =========================
    // SEARCH FILTER
    // =========================
    useEffect(() => {

      const filtered =
        alumni.filter(

          (mentor) =>

            mentor.name
              .toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||

            mentor.domain
              .toLowerCase()
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

            )

        );

      setFilteredAlumni(
        filtered
      );

    }, [

      search,
      alumni,

    ]);


    // =========================
    // INITIAL LOAD
    // =========================
    useEffect(() => {

      fetchRecommendations();

    }, []);


    return (

      <div className="min-h-screen bg-background">

        <Header />

        <div className="max-w-7xl mx-auto p-6">


          {/* HERO */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-purple-600 to-indigo-600 text-white shadow-2xl mb-10">

            <div className="absolute inset-0 bg-black/10" />

            <div className="relative p-8 md:p-10">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                <div className="flex items-center gap-5">

                  <div className="h-20 w-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center">

                    <Brain className="h-10 w-10 text-white" />

                  </div>

                  <div>

                    <h1 className="text-4xl md:text-5xl font-bold">

                      AI Mentor Match

                    </h1>

                    <p className="text-white/90 mt-3 text-lg max-w-2xl">

                      Smart alumni recommendations powered by AI based on your skills, interests, career goals, and mentorship needs.

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* SEARCH BAR */}
          <div className="mb-8">

            <div className="relative max-w-2xl">

              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

              <Input

                placeholder="Search mentors by domain, skills, or name..."

                className="pl-12 h-14 rounded-2xl text-base shadow-sm"

                value={search}

                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }

              />

            </div>

          </div>


          {/* ERROR */}
          {error && (

            <div className="bg-red-100 border border-red-300 text-red-600 p-4 rounded-2xl mb-6">

              {error}

            </div>

          )}


          {/* LOADING */}
          {loading ? (

            <div className="text-center py-24">

              <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary mb-5" />

              <h2 className="text-3xl font-bold mb-2">

                AI Matching Alumni...

              </h2>

              <p className="text-muted-foreground">

                Finding the best mentors for your journey

              </p>

            </div>

          ) : filteredAlumni.length === 0 ? (

            <div className="text-center py-24">

              <Sparkles className="h-14 w-14 mx-auto text-primary mb-5" />

              <h2 className="text-3xl font-bold mb-2">

                No Recommendations Found

              </h2>

              <p className="text-muted-foreground">

                Try updating your profile skills and interests

              </p>

            </div>

          ) : (

            <>

              {/* STATS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                <Card className="rounded-3xl shadow-xl border-0">

                  <CardContent className="p-6 flex items-center gap-4">

                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">

                      <Users className="h-7 w-7 text-primary" />

                    </div>

                    <div>

                      <p className="text-muted-foreground text-sm">

                        Recommended Mentors

                      </p>

                      <h2 className="text-3xl font-bold">

                        {filteredAlumni.length}

                      </h2>

                    </div>

                  </CardContent>

                </Card>


                <Card className="rounded-3xl shadow-xl border-0">

                  <CardContent className="p-6 flex items-center gap-4">

                    <div className="h-14 w-14 rounded-2xl bg-yellow-100 flex items-center justify-center">

                      <Trophy className="h-7 w-7 text-yellow-600" />

                    </div>

                    <div>

                      <p className="text-muted-foreground text-sm">

                        Highest Trust Score

                      </p>

                      <h2 className="text-3xl font-bold">

                        {

                          Math.max(
                            ...filteredAlumni.map(
                              (m) =>
                                m.trustScore || 0
                            )
                          )

                        }

                      </h2>

                    </div>

                  </CardContent>

                </Card>


                <Card className="rounded-3xl shadow-xl border-0">

                  <CardContent className="p-6 flex items-center gap-4">

                    <div className="h-14 w-14 rounded-2xl bg-purple-100 flex items-center justify-center">

                      <Sparkles className="h-7 w-7 text-purple-600" />

                    </div>

                    <div>

                      <p className="text-muted-foreground text-sm">

                        Average AI Match

                      </p>

                      <h2 className="text-3xl font-bold">

                        {

                          Math.round(

                            filteredAlumni.reduce(
                              (
                                acc,
                                curr
                              ) =>

                                acc +
                                (curr.aiScore || 0),

                              0
                            ) /

                            filteredAlumni.length

                          )

                        }%

                      </h2>

                    </div>

                  </CardContent>

                </Card>

              </div>


              {/* CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                {filteredAlumni.map(
                  (mentor) => (

                    <Card
                      key={mentor._id}
                      className="shadow-2xl rounded-3xl border-0 overflow-hidden hover:scale-[1.02] transition-all duration-300"
                    >


                      {/* TOP */}
                      <div className="bg-gradient-to-r from-primary to-purple-600 p-6 text-white">

                        <div className="flex items-center justify-between">

                          <div>

                            <h2 className="text-2xl font-bold">

                              {mentor.name}

                            </h2>

                            <p className="text-white/90">

                              {mentor.domain ||
                                "Alumni Mentor"}

                            </p>

                          </div>

                          <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center">

                            <Star className="h-7 w-7 text-yellow-300" />

                          </div>

                        </div>

                      </div>


                      {/* CONTENT */}
                      <CardContent className="p-6">


                        {/* BIO */}
                        <p className="text-muted-foreground mb-5 line-clamp-3 leading-7">

                          {mentor.bio ||

                            "Experienced alumni mentor helping students grow in career and technology."

                          }

                        </p>


                        {/* DETAILS */}
                        <div className="space-y-4 mb-6">


                          {/* DOMAIN */}
                          <div className="flex items-center gap-3 text-sm">

                            <Briefcase className="h-4 w-4 text-primary" />

                            <span>

                              Domain:
                              {" "}

                              <span className="font-semibold">

                                {mentor.domain ||
                                  "General"}

                              </span>

                            </span>

                          </div>


                          {/* BRANCH */}
                          <div className="flex items-center gap-3 text-sm">

                            <GraduationCap className="h-4 w-4 text-primary" />

                            <span>

                              {mentor.branch ||
                                "Branch Not Added"}

                            </span>

                          </div>


                          {/* BATCH */}
                          <div className="flex items-center gap-3 text-sm">

                            <MapPin className="h-4 w-4 text-primary" />

                            <span>

                              Batch:
                              {" "}

                              {mentor.batch || "N/A"}

                            </span>

                          </div>


                          {/* TRUST SCORE */}
                          <div className="flex items-center gap-3 text-sm">

                            <Star className="h-4 w-4 text-yellow-500" />

                            <span>

                              Trust Score:
                              {" "}

                              <span className="font-bold">

                                {mentor.trustScore}

                              </span>

                            </span>

                          </div>


                          {/* AI SCORE */}
                          <div>

                            <div className="flex items-center justify-between mb-2 text-sm">

                              <div className="flex items-center gap-2">

                                <Sparkles className="h-4 w-4 text-purple-500" />

                                <span>

                                  AI Match Score

                                </span>

                              </div>

                              <span className="font-bold text-primary">

                                {mentor.aiScore || 0}%

                              </span>

                            </div>

                            <div className="w-full h-3 rounded-full bg-muted overflow-hidden">

                              <div

                                className="h-full bg-gradient-to-r from-primary to-purple-600 rounded-full"

                                style={{

                                  width:
                                    `${mentor.aiScore || 0}%`,

                                }}

                              />

                            </div>

                          </div>

                        </div>


                        {/* SKILLS */}
                        <div className="flex flex-wrap gap-2 mb-6">

                          {mentor.skills?.slice(0, 6).map(
                            (skill) => (

                              <Badge
                                key={skill}
                                variant="secondary"
                                className="rounded-xl"
                              >

                                {skill}

                              </Badge>

                            )
                          )}

                        </div>


                        {/* BUTTONS */}
                        <div className="flex gap-3">


                          {/* REQUEST GUIDANCE */}
                          <Button
                            className="flex-1 rounded-xl"
                            onClick={() =>
                              navigate(
                                `/student/guidance/${mentor._id}`
                              )
                            }
                          >

                            Request Guidance

                          </Button>


                          {/* CHAT */}
                          <Button
                            variant="outline"
                            className="flex-1 rounded-xl"
                            onClick={() =>
                              navigate(
                                `/student/chat/${mentor._id}`
                              )
                            }
                          >

                            <MessageSquare className="h-4 w-4 mr-2" />

                            Chat

                          </Button>

                        </div>

                      </CardContent>

                    </Card>

                  )
                )}

              </div>

            </>

          )}

        </div>

      </div>

    );

  };


// EXPORT
export default RecommendationsPage;