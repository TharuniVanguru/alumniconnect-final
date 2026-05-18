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

import { Button }
  from "@/components/ui/button";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Loader2,
  MessageCircle,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";


interface GuidanceRequest {

  _id: string;

  studentId: string;

  studentName: string;

  domain: string;

  topic: string;

  description: string;

  urgency: string;

  status: string;

  createdAt: string;

}


const GuidanceRequestsPage =
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


    const userInfo =
      JSON.parse(
        localStorage.getItem(
          "userInfo"
        ) || "{}"
      );


    // =========================
    // FETCH REQUESTS
    // =========================
    const fetchRequests =
      async () => {

        try {

          setLoading(true);

          const response =
            await axios.get(

              "http://localhost:5000/guidance/my-requests",

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


    // =========================
    // UPDATE STATUS
    // =========================
    const updateStatus =
      async (
        requestId: string,
        status: string
      ) => {

        try {

          await axios.put(

            `http://localhost:5000/guidance/${requestId}/status`,

            {
              status,
            },

            {

              headers: {

                Authorization:
                  `Bearer ${userInfo.token}`,

              },

            }

          );

          // UPDATE UI
          setRequests(
            (
              prevRequests
            ) =>
              prevRequests.map(
                (
                  request
                ) =>

                  request._id ===
                  requestId

                    ? {
                        ...request,
                        status,
                      }

                    : request
              )
          );

        }

        catch (error) {

          console.log(error);

          alert(
            "Failed to update request"
          );

        }

      };


    // =========================
    // INITIAL LOAD
    // =========================
    useEffect(() => {

      fetchRequests();

    }, []);


    // =========================
    // STATUS BADGE
    // =========================
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


    return (

      <div className="min-h-screen bg-background">

        <Header />

        <div className="max-w-7xl mx-auto p-6">

          {/* TITLE */}

          <div className="mb-8">

            <h1 className="text-4xl font-bold">

              Guidance Requests

            </h1>

            <p className="text-muted-foreground mt-2">

              Manage mentorship and career guidance requests from students

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

                  No Requests Found

                </h2>

                <p className="text-muted-foreground">

                  Student mentorship requests will appear here

                </p>

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

                      {/* TOP SECTION */}

                      <div className="flex items-start justify-between gap-4 mb-5">

                        <div>

                          <h2 className="text-2xl font-bold">

                            {request.topic}

                          </h2>

                          <p className="text-muted-foreground">

                            by {request.studentName}

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

                            Urgency:
                          </span>

                          <p className="text-muted-foreground mt-1">

                            {request.urgency}

                          </p>

                        </div>


                        <div>

                          <span className="font-semibold">

                            Description:
                          </span>

                          <p className="text-muted-foreground mt-1 leading-7">

                            {request.description}

                          </p>

                        </div>


                        <div className="text-xs text-muted-foreground pt-2">

                          {new Date(
                            request.createdAt
                          ).toLocaleString()}

                        </div>

                      </div>


                      {/* BUTTONS */}

                      <div className="flex flex-wrap gap-3 mt-6">

                        {request.status ===
                          "Pending" && (

                          <>

                            <Button
                              onClick={() =>
                                updateStatus(
                                  request._id,
                                  "Accepted"
                                )
                              }
                            >

                              <CheckCircle2 className="h-4 w-4 mr-2" />

                              Accept

                            </Button>


                            <Button
                              variant="destructive"

                              onClick={() =>
                                updateStatus(
                                  request._id,
                                  "Rejected"
                                )
                              }
                            >

                              <XCircle className="h-4 w-4 mr-2" />

                              Reject

                            </Button>

                          </>

                        )}


                        {request.status ===
                          "Accepted" && (

                          <Button
                            variant="outline"

                            onClick={() => {

                              navigate(
                                `/alumni/chat/${request.studentId}`
                              );

                            }}
                          >

                            <MessageCircle className="h-4 w-4 mr-2" />

                            Open Chat

                          </Button>

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


export default GuidanceRequestsPage;