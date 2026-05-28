import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

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

import { Input }
  from "@/components/ui/input";

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
} from "lucide-react";

import {
  useToast,
} from "@/hooks/use-toast";


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

    const navigate =
      useNavigate();

    const { toast } =
      useToast();

    const [
      requests,
      setRequests,
    ] = useState<
      GuidanceRequest[]
    >([]);

    const [
      filteredRequests,
      setFilteredRequests,
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

    const [
      search,
      setSearch,
    ] = useState("");

    const [
      statusFilter,
      setStatusFilter,
    ] = useState("All");


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
            await axios.get(

              "http://localhost:5000/guidance/student",

              {

                headers: {

                  Authorization:
                    `Bearer ${userInfo.token}`,

                },

              }

            );

          setRequests(
            response.data
          );

          setFilteredRequests(
            response.data
          );

        }

        catch (error) {

          console.log(error);

          setError(
            "Failed to load requests"
          );

        }

        finally {

          setLoading(false);

        }

      };


    // =====================================
    // FILTER REQUESTS
    // =====================================
    useEffect(() => {

      let filtered =
        requests.filter(

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

      setFilteredRequests(
        filtered
      );

    }, [

      search,
      statusFilter,
      requests,

    ]);


    // =====================================
    // SUBMIT FEEDBACK
    // =====================================
    const submitFeedback =
      async (
        requestId: string
      ) => {

        try {

          await axios.put(

            `http://localhost:5000/guidance/${requestId}`,

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

            (
              prev
            ) =>

              prev.map(
                (
                  req
                ) =>

                  req._id ===
                  requestId

                    ? {

                        ...req,

                        feedback:
                          feedbacks[
                            requestId
                          ],

                        rating:
                          ratings[
                            requestId
                          ],

                        status:
                          "Completed",

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
              "Submission Failed",

            description:
              "Unable to submit feedback",

            variant:
              "destructive",

          });

        }

      };


    // =====================================
    // INITIAL LOAD
    // =====================================
    useEffect(() => {

      fetchRequests();

    }, []);


    // =====================================
    // STATUS BADGE
    // =====================================
    const renderStatusBadge =
      (status: string) => {

        switch (status) {

          case "Accepted":

            return (

              <Badge className="bg-green-600 hover:bg-green-600">

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

              <Badge className="bg-blue-600 hover:bg-blue-600">

                Completed

              </Badge>

            );

          default:

            return (

              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
              >

                <Clock3 className="h-3 w-3 mr-1" />

                Pending

              </Badge>

            );

        }

      };


    // =====================================
    // UI
    // =====================================
    return (

      <div className="min-h-screen bg-background">

        <Header />

        <div className="max-w-7xl mx-auto p-6">

          {/* HERO */}
          <div className="rounded-3xl bg-gradient-to-r from-primary to-purple-600 text-white p-8 shadow-2xl mb-8">

            <div className="flex items-center gap-4">

              <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center">

                <Sparkles className="h-8 w-8" />

              </div>

              <div>

                <h1 className="text-4xl font-bold">

                  My Guidance Requests

                </h1>

                <p className="text-white/90 mt-2">

                  Track mentorship requests, meetings, chats, and feedback

                </p>

              </div>

            </div>

          </div>


          {/* SEARCH + FILTER */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

            <div className="md:col-span-3 relative">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

              <Input

                placeholder="Search by topic, alumni, or domain"

                className="pl-10 h-12 rounded-2xl"

                value={search}

                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }

              />

            </div>


            <select

              className="h-12 rounded-2xl border px-4 bg-background"

              value={statusFilter}

              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }

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


          {/* ERROR */}
          {error && (

            <div className="bg-red-100 text-red-600 p-4 rounded-xl mb-5">

              {error}

            </div>

          )}


          {/* LOADING */}
          {loading ? (

            <div className="flex items-center justify-center py-24">

              <Loader2 className="h-12 w-12 animate-spin text-primary" />

            </div>

          ) : filteredRequests.length === 0 ? (

            <Card className="shadow-xl rounded-3xl">

              <CardContent className="py-24 text-center">

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
                    className="shadow-2xl rounded-3xl border-0 overflow-hidden hover:scale-[1.01] transition-all duration-300"
                  >

                    {/* TOP */}
                    <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-6">

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <h2 className="text-2xl font-bold">

                            {request.topic}

                          </h2>

                          <p className="text-white/90 mt-1">

                            Mentor:
                            {" "}
                            {request.alumniName}

                          </p>

                        </div>

                        {renderStatusBadge(
                          request.status
                        )}

                      </div>

                    </div>


                    {/* BODY */}
                    <CardContent className="p-6 space-y-5">

                      {/* DOMAIN */}
                      <div>

                        <p className="font-semibold">

                          Domain

                        </p>

                        <p className="text-muted-foreground mt-1">

                          {request.domain}

                        </p>

                      </div>


                      {/* DESCRIPTION */}
                      <div>

                        <p className="font-semibold">

                          Description

                        </p>

                        <p className="text-muted-foreground mt-1 leading-7">

                          {request.description}

                        </p>

                      </div>


                      {/* URGENCY */}
                      <div className="flex items-center gap-2">

                        <Badge variant="outline">

                          {request.urgency} Priority

                        </Badge>

                      </div>


                      {/* MEETING */}
                      {request.meetingLink && (

                        <div>

                          <p className="font-semibold flex items-center gap-2 mb-2">

                            <Video className="h-4 w-4" />

                            Meeting Link

                          </p>

                          <a

                            href={request.meetingLink}

                            target="_blank"

                            rel="noreferrer"

                            className="text-blue-600 underline"

                          >

                            Join Meeting

                          </a>

                        </div>

                      )}


                      {/* DATE */}
                      {request.scheduledDate && (

                        <div>

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

                        <div>

                          <p className="font-semibold">

                            Your Feedback

                          </p>

                          <p className="text-muted-foreground mt-1">

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

                          <div className="flex">

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
                      <div className="pt-4 flex flex-wrap gap-3">

                        {request.status ===
                          "Accepted" && (

                          <>

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


                            {/* FEEDBACK FORM */}
                            {!request.feedback && (

                              <div className="w-full mt-5 space-y-3">

                                <Textarea

                                  placeholder="Write your feedback"

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

                                  className="border rounded-xl p-3 w-full bg-background"

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

                                >

                                  Submit Feedback

                                </Button>

                              </div>

                            )}

                          </>

                        )}

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


export default MyGuidanceRequestsPage;