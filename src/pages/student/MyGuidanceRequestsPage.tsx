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

import {
  Loader2,
  MessageCircle,
  Clock3,
  CheckCircle2,
  XCircle,
  Star,
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

    const navigate =
      useNavigate();

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
      feedback,
      setFeedback,
    ] = useState("");

    const [
      rating,
      setRating,
    ] = useState(5);


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

              feedback,

              rating,

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

                        feedback,

                        rating,

                        status:
                          "Completed",

                      }

                    : req
              )

          );


          setFeedback("");

          setRating(5);

          alert(
            "Feedback submitted successfully"
          );

        }

        catch (error) {

          console.log(error);

          alert(
            "Failed to submit feedback"
          );

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

          {/* TITLE */}

          <div className="mb-8">

            <h1 className="text-4xl font-bold">

              My Guidance Requests

            </h1>

            <p className="text-muted-foreground mt-2">

              Track mentorship and guidance requests

            </p>

          </div>


          {/* ERROR */}

          {error && (

            <div className="bg-red-100 text-red-600 p-4 rounded-xl mb-5">

              {error}

            </div>

          )}


          {/* LOADING */}

          {loading ? (

            <div className="flex items-center justify-center py-20">

              <Loader2 className="h-10 w-10 animate-spin text-primary" />

            </div>

          ) : requests.length === 0 ? (

            <Card className="shadow-xl rounded-2xl">

              <CardContent className="py-20 text-center">

                <h2 className="text-3xl font-bold mb-3">

                  No Requests Sent

                </h2>

              </CardContent>

            </Card>

          ) : (

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {requests.map(
                (request) => (

                  <Card
                    key={request._id}
                    className="shadow-xl rounded-3xl border-0"
                  >

                    <CardContent className="p-6">

                      {/* TOP */}

                      <div className="flex items-start justify-between gap-4 mb-5">

                        <div>

                          <h2 className="text-2xl font-bold">

                            {request.topic}

                          </h2>

                          <p className="text-muted-foreground">

                            Alumni:
                            {" "}
                            {request.alumniName}

                          </p>

                        </div>

                        {renderStatusBadge(
                          request.status
                        )}

                      </div>


                      {/* CONTENT */}

                      <div className="space-y-4">

                        <div>

                          <span className="font-semibold">

                            Domain:

                          </span>

                          <p className="text-muted-foreground mt-1">

                            {request.domain}

                          </p>

                        </div>


                        <div>

                          <span className="font-semibold">

                            Description:

                          </span>

                          <p className="text-muted-foreground mt-1">

                            {request.description}

                          </p>

                        </div>


                        {/* MEETING LINK */}

                        {request.meetingLink && (

                          <div>

                            <span className="font-semibold">

                              Meeting Link:

                            </span>

                            <a
                              href={request.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="block text-blue-600 underline mt-1"
                            >

                              Join Meeting

                            </a>

                          </div>

                        )}


                        {/* DATE */}

                        {request.scheduledDate && (

                          <div>

                            <span className="font-semibold">

                              Scheduled Date:

                            </span>

                            <p className="text-muted-foreground mt-1">

                              {

                                new Date(
                                  request.scheduledDate
                                ).toLocaleString()

                              }

                            </p>

                          </div>

                        )}


                        {/* FEEDBACK DISPLAY */}

                        {request.feedback && (

                          <div>

                            <span className="font-semibold">

                              Feedback:

                            </span>

                            <p className="text-muted-foreground mt-1">

                              {request.feedback}

                            </p>

                          </div>

                        )}


                        {/* RATING DISPLAY */}

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

                      </div>


                      {/* BUTTONS */}

                      <div className="mt-6 flex flex-wrap gap-3">

                        {request.status ===
                          "Accepted" && (

                          <>

                            <Button
                              variant="outline"

                              onClick={() => {

                                navigate(
                                  `/student/chat/${request.alumniId}`
                                );

                              }}
                            >

                              <MessageCircle className="h-4 w-4 mr-2" />

                              Open Chat

                            </Button>


                            {/* FEEDBACK SECTION */}

                            <div className="w-full mt-4 space-y-3">

                              <Textarea

                                placeholder="Write your feedback"

                                value={feedback}

                                onChange={(e) =>
                                  setFeedback(
                                    e.target.value
                                  )
                                }

                              />


                              <select

                                value={rating}

                                onChange={(e) =>
                                  setRating(
                                    Number(
                                      e.target.value
                                    )
                                  )
                                }

                                className="border rounded-lg p-2 w-full"
                              >

                                <option value={5}>
                                  5 Stars
                                </option>

                                <option value={4}>
                                  4 Stars
                                </option>

                                <option value={3}>
                                  3 Stars
                                </option>

                                <option value={2}>
                                  2 Stars
                                </option>

                                <option value={1}>
                                  1 Star
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