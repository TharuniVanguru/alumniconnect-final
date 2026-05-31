import {
  useEffect,
  useMemo,
  useState,
} from "react";

import api, { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/utils/api";
import {
  useNavigate,
} from "react-router-dom";

import { Header }
  from "@/components/layout/Header";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Badge,
} from "@/components/ui/badge";

import { Button }
  from "@/components/ui/button";

import {
  Textarea,
} from "@/components/ui/textarea";

import {
  Input,
} from "@/components/ui/input";

import {
  useToast,
} from "@/hooks/use-toast";

import {

  Loader2,
  MessageCircle,
  Clock3,
  CheckCircle2,
  XCircle,
  Star,
  Calendar,
  Video,
  Search,
  Sparkles,
  Filter,
  Brain,
  ArrowRight,
  User,
  BookOpen,

} from "lucide-react";


// =====================================
// INTERFACE
// =====================================
interface GuidanceRequest {

  _id: string;

  alumniId: string;

  alumniName: string;

  domain: string;

  topic: string;

  description: string;

  urgency: string;

  status: string;

  meetingLink?: string;

  scheduledDate?: string;

  feedback?: string;

  rating?: number;

  createdAt: string;

}


// =====================================
// COMPONENT
// =====================================
const MyGuidanceRequestsPage =
  () => {

    // =====================================
    // NAVIGATION
    // =====================================
    const navigate =
      useNavigate();

    const { toast } =
      useToast();


    // =====================================
    // STATES
    // =====================================
    const [

      requests,
      setRequests,

    ] = useState<
      GuidanceRequest[]
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


    const [

      statusFilter,
      setStatusFilter,

    ] = useState("All");


    const [

      feedbacks,
      setFeedbacks,

    ] = useState<
      Record<string, string>
    >({});


    const [

      ratings,
      setRatings,

    ] = useState<
      Record<string, number>
    >({});


    // =====================================
    // USER INFO
    // =====================================
    const userInfo =
      JSON.parse(

        localStorage.getItem(
          "userInfo"
        ) || "{}"

      );


    // =====================================
    // FETCH REQUESTS
    // =====================================
    const fetchRequests =
      async () => {

        try {

          setLoading(true);

          const response =
            await api.get(

              "/guidance/student",

              {

                headers: {

                  Authorization:
                    `Bearer ${userInfo.token}`,

                },

              }

            );

          setRequests(
            response.data || []
          );

        }

        catch (error) {

          console.log(error);

          setError(
            "Failed to load guidance requests"
          );

        }

        finally {

          setLoading(false);

        }

      };


    // =====================================
    // FILTERED REQUESTS
    // =====================================
    const filteredRequests =
      useMemo(() => {

        return requests.filter(

          (req) => {

            const matchesSearch =

              req.topic
                .toLowerCase()
                .includes(
                  search.toLowerCase()
                ) ||

              req.alumniName
                .toLowerCase()
                .includes(
                  search.toLowerCase()
                ) ||

              req.domain
                .toLowerCase()
                .includes(
                  search.toLowerCase()
                );


            const matchesStatus =

              statusFilter ===
                "All" ||

              req.status ===
                statusFilter;


            return (
              matchesSearch &&
              matchesStatus
            );

          }

        );

      }, [

        requests,
        search,
        statusFilter,

      ]);


    // =====================================
    // FETCH ON LOAD
    // =====================================
    useEffect(() => {

      fetchRequests();

    }, []);


    // =====================================
    // SUBMIT FEEDBACK
    // =====================================
    const submitFeedback =
      async (
        requestId: string
      ) => {

        try {

          await api.put(

            `/guidance/${requestId}`,

            {

              status:
                "Completed",

              feedback:
                feedbacks[
                  requestId
                ],

              rating:
                ratings[
                  requestId
                ] || 5,

            },

            {

              headers: {

                Authorization:
                  `Bearer ${userInfo.token}`,

              },

            }

          );


          setRequests(

            (prev) =>

              prev.map(
                (req) =>

                  req._id ===
                  requestId

                    ? {

                        ...req,

                        status:
                          "Completed",

                        feedback:
                          feedbacks[
                            requestId
                          ],

                        rating:
                          ratings[
                            requestId
                          ],

                      }

                    : req
              )

          );


          toast({

            title:
              "Feedback Submitted ⭐",

            description:
              "Thank you for sharing your experience",

          });

        }

        catch (error) {

          console.log(error);

          toast({

            title:
              "Failed",

            description:
              "Unable to submit feedback",

            variant:
              "destructive",

          });

        }

      };


    // =====================================
    // STATUS BADGE
    // =====================================
    const renderStatusBadge =
      (
        status: string
      ) => {

        switch (status) {

          case "Accepted":

            return (

              <Badge className="bg-green-600 hover:bg-green-600 text-white">

                <CheckCircle2 className="h-3 w-3 mr-1" />

                Accepted

              </Badge>

            );

          case "Rejected":

            return (

              <Badge variant="destructive">

                <XCircle className="h-3 w-3 mr-1" />

                Rejected

              </Badge>

            );

          case "Completed":

            return (

              <Badge className="bg-blue-600 hover:bg-blue-600 text-white">

                Completed

              </Badge>

            );

          default:

            return (

              <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">

                <Clock3 className="h-3 w-3 mr-1" />

                Pending

              </Badge>

            );

        }

      };


    // =====================================
    // STATS
    // =====================================
    const pendingCount =
      requests.filter(
        (r) =>
          r.status ===
          "Pending"
      ).length;


    const acceptedCount =
      requests.filter(
        (r) =>
          r.status ===
          "Accepted"
      ).length;


    const completedCount =
      requests.filter(
        (r) =>
          r.status ===
          "Completed"
      ).length;


    // =====================================
    // UI
    // =====================================
    return (

      <div className="min-h-screen bg-background">

        <Header />

        <main className="max-w-7xl mx-auto px-4 py-6">

          {/* ================================= */}
          {/* HERO */}
          {/* ================================= */}
          <div className="mb-8">

            <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-primary via-purple-600 to-pink-500 text-white shadow-2xl">

              <div className="p-8 md:p-10">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                  <div>

                    <div className="flex items-center gap-4 mb-5">

                      <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center">

                        <Brain className="h-8 w-8" />

                      </div>

                      <div>

                        <h1 className="text-4xl font-bold">

                          My Guidance Requests

                        </h1>

                        <p className="text-white/90 mt-2">

                          Track mentorship sessions, meetings, and alumni responses

                        </p>

                      </div>

                    </div>

                  </div>


                  {/* STATS */}
                  <div className="grid grid-cols-3 gap-4">

                    <div className="bg-white/10 rounded-2xl p-5 text-center backdrop-blur-md">

                      <h2 className="text-3xl font-bold">

                        {pendingCount}

                      </h2>

                      <p className="text-sm text-white/80">

                        Pending

                      </p>

                    </div>


                    <div className="bg-white/10 rounded-2xl p-5 text-center backdrop-blur-md">

                      <h2 className="text-3xl font-bold">

                        {acceptedCount}

                      </h2>

                      <p className="text-sm text-white/80">

                        Accepted

                      </p>

                    </div>


                    <div className="bg-white/10 rounded-2xl p-5 text-center backdrop-blur-md">

                      <h2 className="text-3xl font-bold">

                        {completedCount}

                      </h2>

                      <p className="text-sm text-white/80">

                        Completed

                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* ================================= */}
          {/* SEARCH + FILTER */}
          {/* ================================= */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

            <div className="md:col-span-3 relative">

              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

              <Input

                placeholder="Search by mentor, topic, or domain..."

                value={search}

                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }

                className="pl-12 h-12 rounded-2xl"

              />

            </div>


            <div className="relative">

              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

              <select

                value={statusFilter}

                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }

                className="w-full border border-input rounded-2xl bg-background h-12 pl-11 pr-4"

              >

                <option>
                  All
                </option>

                <option>
                  Pending
                </option>

                <option>
                  Accepted
                </option>

                <option>
                  Rejected
                </option>

                <option>
                  Completed
                </option>

              </select>

            </div>

          </div>


          {/* ================================= */}
          {/* ERROR */}
          {/* ================================= */}
          {error && (

            <div className="bg-red-100 text-red-700 px-5 py-4 rounded-2xl mb-6">

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

                Loading Requests...

              </h2>

            </div>

          ) : filteredRequests.length === 0 ? (

            <Card className="rounded-3xl shadow-2xl border-0">

              <CardContent className="py-24 text-center">

                <Sparkles className="h-20 w-20 mx-auto text-primary mb-5" />

                <h2 className="text-3xl font-bold mb-3">

                  No Requests Found

                </h2>

                <p className="text-muted-foreground">

                  Your mentorship requests will appear here

                </p>

              </CardContent>

            </Card>

          ) : (

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {filteredRequests.map(
                (request) => (

                  <Card

                    key={request._id}

                    className="rounded-3xl shadow-2xl border-0 overflow-hidden hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-300"

                  >

                    {/* HEADER */}
                    <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-6">

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <h2 className="text-2xl font-bold">

                            {request.topic}

                          </h2>

                          <p className="text-white/90 mt-2 flex items-center gap-2">

                            <User className="h-4 w-4" />

                            {request.alumniName}

                          </p>

                        </div>

                        {renderStatusBadge(
                          request.status
                        )}
                      </div>

                    </div>


                    {/* CONTENT */}
                    <CardContent className="p-6 space-y-5">

                      {/* DOMAIN */}
                      <div>

                        <p className="font-semibold mb-2">

                          Domain

                        </p>

                        <Badge variant="outline">

                          <BookOpen className="h-3 w-3 mr-1" />

                          {request.domain}

                        </Badge>

                      </div>


                      {/* DESCRIPTION */}
                      <div>

                        <p className="font-semibold mb-2">

                          Description

                        </p>

                        <p className="text-muted-foreground leading-7">

                          {request.description}

                        </p>

                      </div>


                      {/* META */}
                      <div className="flex flex-wrap gap-3">

                        <Badge variant="secondary">

                          {request.urgency} Priority

                        </Badge>

                        <Badge variant="outline">

                          {new Date(
                            request.createdAt
                          ).toLocaleDateString()}

                        </Badge>

                      </div>


                      {/* MEETING */}
                      {request.meetingLink && (

                        <div className="p-4 rounded-2xl bg-muted/30 border">

                          <p className="font-semibold flex items-center gap-2 mb-2">

                            <Video className="h-4 w-4" />

                            Meeting Link

                          </p>

                          <a

                            href={request.meetingLink}

                            target="_blank"

                            rel="noreferrer"

                            className="text-primary underline"

                          >

                            Join Meeting

                          </a>

                        </div>

                      )}


                      {/* SCHEDULE */}
                      {request.scheduledDate && (

                        <div className="p-4 rounded-2xl bg-muted/30 border">

                          <p className="font-semibold flex items-center gap-2 mb-2">

                            <Calendar className="h-4 w-4" />

                            Scheduled Date

                          </p>

                          <p className="text-muted-foreground">

                            {

                              new Date(
                                request.scheduledDate
                              ).toLocaleString()

                            }

                          </p>

                        </div>

                      )}


                      {/* FEEDBACK */}
                      {request.feedback && (

                        <div className="p-4 rounded-2xl bg-muted/30 border">

                          <p className="font-semibold mb-2">

                            Your Feedback

                          </p>

                          <p className="text-muted-foreground">

                            {request.feedback}

                          </p>

                        </div>

                      )}


                      {/* RATING */}
                      {request.rating && (

                        <div className="flex items-center gap-2">

                          <span className="font-semibold">

                            Rating:

                          </span>

                          <div className="flex gap-1">

                            {

                              [...Array(request.rating)].map(
                                (_, i) => (

                                  <Star

                                    key={i}

                                    className="h-4 w-4 fill-yellow-400 text-yellow-400"

                                  />

                                )
                              )

                            }

                          </div>

                        </div>

                      )}


                      {/* ACTIONS */}
                      {request.status ===
                        "Accepted" && (

                        <div className="pt-4 border-t">

                          <div className="flex flex-wrap gap-3 mb-5">

                            <Button

                              variant="outline"

                              onClick={() =>

                                navigate(
                                  `/student/chat/${request.alumniId}`
                                )

                              }

                            >

                              <MessageCircle className="h-4 w-4 mr-2" />

                              Open Chat

                            </Button>


                            <Button>

                              <ArrowRight className="h-4 w-4 mr-2" />

                              Continue Session

                            </Button>

                          </div>


                          {/* FEEDBACK FORM */}
                          {!request.feedback && (

                            <div className="space-y-4">

                              <Textarea

                                placeholder="Write your feedback..."

                                value={
                                  feedbacks[
                                    request._id
                                  ] || ""
                                }

                                onChange={(e) =>

                                  setFeedbacks({

                                    ...feedbacks,

                                    [request._id]:
                                      e.target.value,

                                  })

                                }

                                className="rounded-2xl"

                              />


                              <select

                                value={
                                  ratings[
                                    request._id
                                  ] || 5
                                }

                                onChange={(e) =>

                                  setRatings({

                                    ...ratings,

                                    [request._id]:
                                      Number(
                                        e.target.value
                                      ),

                                  })

                                }

                                className="w-full border border-input rounded-2xl bg-background h-12 px-4"

                              >

                                <option value={5}>
                                  ⭐⭐⭐⭐⭐
                                </option>

                                <option value={4}>
                                  ⭐⭐⭐⭐
                                </option>

                                <option value={3}>
                                  ⭐⭐⭐
                                </option>

                                <option value={2}>
                                  ⭐⭐
                                </option>

                                <option value={1}>
                                  ⭐
                                </option>

                              </select>


                              <Button

                                onClick={() =>
                                  submitFeedback(
                                    request._id
                                  )
                                }

                                className="w-full rounded-2xl h-12"

                              >

                                Submit Feedback

                              </Button>

                            </div>

                          )}

                        </div>

                      )}

                    </CardContent>

                  </Card>

                )
              )}

            </div>

          )}

        </main>

      </div>

    );

  };


export default MyGuidanceRequestsPage;