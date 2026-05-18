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
  Brain,
  MapPin,
  Briefcase,
  Star,
  MessageSquare,
  Sparkles,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";


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

}


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
      loading,
      setLoading,
    ] = useState(false);

    const [
      error,
      setError,
    ] = useState("");


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

        }

        catch (error) {

          console.log(error);

          setError(
            "Failed to load recommendations"
          );

        }

        finally {

          setLoading(false);

        }

      };


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

          {/* HEADER */}

          <div className="mb-8">

            <div className="flex items-center gap-3 mb-3">

              <div className="h-14 w-14 rounded-2xl bg-gradient-primary flex items-center justify-center">

                <Brain className="h-7 w-7 text-white" />

              </div>

              <div>

                <h1 className="text-4xl font-bold">

                  AI Alumni Recommendations

                </h1>

                <p className="text-muted-foreground text-lg">

                  Smart mentor matching based on skills,
                  interests, domain & trust score

                </p>

              </div>

            </div>

          </div>


          {/* ERROR */}

          {error && (

            <div className="bg-red-100 text-red-600 p-4 rounded-xl mb-6">

              {error}

            </div>

          )}


          {/* LOADING */}

          {loading ? (

            <div className="text-center py-20">

              <Sparkles className="h-10 w-10 mx-auto animate-pulse text-primary mb-4" />

              <h2 className="text-2xl font-bold mb-2">

                AI Matching Alumni...

              </h2>

              <p className="text-muted-foreground">

                Finding best mentors for you

              </p>

            </div>

          ) : alumni.length === 0 ? (

            <div className="text-center py-20">

              <h2 className="text-2xl font-bold mb-2">

                No Recommendations Found

              </h2>

              <p className="text-muted-foreground">

                Try updating your profile skills & interests

              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

              {alumni.map(
                (mentor) => (

                  <Card
                    key={mentor._id}
                    className="shadow-xl rounded-3xl border-0 overflow-hidden hover:scale-[1.02] transition-all duration-300"
                  >

                    {/* TOP */}

                    <div className="bg-gradient-to-r from-primary to-purple-600 p-6 text-white">

                      <div className="flex items-center justify-between">

                        <div>

                          <h2 className="text-2xl font-bold">

                            {mentor.name}

                          </h2>

                          <p className="text-white/90">

                            {mentor.domain || "Alumni Mentor"}

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

                      <p className="text-muted-foreground mb-5 line-clamp-3">

                        {mentor.bio || "Experienced alumni mentor helping students grow in career and technology."}

                      </p>


                      {/* DETAILS */}

                      <div className="space-y-3 mb-5">

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


                        <div className="flex items-center gap-2 text-sm">

                          <MapPin className="h-4 w-4 text-primary" />

                          <span>

                            {mentor.branch || "Branch Not Added"}

                          </span>

                        </div>


                        <div className="flex items-center gap-2 text-sm">

                          <Star className="h-4 w-4 text-yellow-500" />

                          <span>

                            Trust Score:
                            {" "}

                            <span className="font-bold">

                              {mentor.trustScore}

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

                      <div className="flex gap-3">

                        <Button
                          className="flex-1"
                          onClick={() =>
                            navigate(
                              `/student/guidance/${mentor._id}`
                            )
                          }
                        >

                          Request Guidance

                        </Button>


                        <Button
                          variant="outline"
                          className="flex-1"
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

          )}

        </div>

      </div>

    );

  };


export default RecommendationsPage;