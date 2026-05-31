import {
  useEffect,
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

import { Button }
  from "@/components/ui/button";

import {
  Badge,
} from "@/components/ui/badge";

import { Input }
  from "@/components/ui/input";

import {
  useToast,
} from "@/hooks/use-toast";

import {

  Loader2,
  MessageCircle,
  CheckCircle2,
  XCircle,
  Clock3,
  Calendar,
  Video,
  RefreshCw,
  Brain,
  Sparkles,
  User,
  BookOpen,
  AlertCircle,
  CheckCheck,

} from "lucide-react";


// ======================================
// INTERFACE
// ======================================
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

  meetingLink?: string;

  scheduledDate?: string;

}


// ======================================
// COMPONENT
// ======================================
const GuidanceRequestsPage =
  () => {

    // ====================================
    // NAVIGATION
    // ====================================
    const navigate =
      useNavigate();

    const { toast } =
      useToast();


    // ====================================
    // STATES
    // ====================================
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

      search,
      setSearch,

    ] = useState("");


    const [

      loading,
      setLoading,

    ] = useState(false);


    const [

      actionLoading,
      setActionLoading,

    ] = useState(false);


    const [

      error,
      setError,

    ] = useState("");


    const [

      selectedStatus,
      setSelectedStatus,

    ] = useState("All");


    // ====================================
    // FORM STATE
    // ====================================
    const [

      formData,
      setFormData,

    ] = useState<

      Record<
        string,
        {
          meetingLink: string;
          scheduledDate: string;
        }

      >

    >({});


    // ====================================
    // USER INFO
    // ====================================
    const userInfo =
      JSON.parse(

        localStorage.getItem(
          "userInfo"
        ) || "{}"

      );


    // ====================================
    // FETCH REQUESTS
    // ====================================
    const fetchRequests =
      async () => {

        try {

          setLoading(true);

          setError("");


          const response =
            await api.get(

              "/guidance/alumni",

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

          setFilteredRequests(
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


    // ====================================
    // FILTER REQUESTS
    // ====================================
    useEffect(() => {

      let filtered =
        requests.filter(

          (request) =>

            request.studentName
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||

            request.topic
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||

            request.domain
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              )

        );


      if (
        selectedStatus !==
        "All"
      ) {

        filtered =
          filtered.filter(

            (request) =>

              request.status ===
              selectedStatus

          );

      }


      setFilteredRequests(
        filtered
      );

    }, [

      search,
      requests,
      selectedStatus,

    ]);


    // ====================================
    // UPDATE FORM
    // ====================================
    const updateFormData =
      (
        requestId: string,
        field:
          | "meetingLink"
          | "scheduledDate",
        value: string
      ) => {

        setFormData(
          (prev) => ({

            ...prev,

            [requestId]: {

              ...prev[
                requestId
              ],

              [field]:
                value,

            },

          })

        );

      };


    // ====================================
    // UPDATE STATUS
    // ====================================
    const updateStatus =
      async (
        requestId: string,
        status: string
      ) => {

        try {

          setActionLoading(
            true
          );

          const currentForm =
            formData[
              requestId
            ] || {

              meetingLink: "",

              scheduledDate: "",

            };


          await api.put(

            `/guidance/${requestId}/status`,

            {

              status,

              meetingLink:
                currentForm.meetingLink,

              scheduledDate:
                currentForm.scheduledDate,

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

            (prev) =>

              prev.map(
                (
                  request
                ) =>

                  request._id ===
                  requestId

                    ? {

                        ...request,

                        status,

                        meetingLink:
                          currentForm.meetingLink,

                        scheduledDate:
                          currentForm.scheduledDate,

                      }

                    : request

              )

          );


          toast({

            title:
              `Request ${status}`,

            description:
              `Guidance request has been ${status.toLowerCase()}.`,

          });

        }

        catch (error: any) {

          console.log(error);

          toast({

            title:
              "Update Failed",

            description:

              error?.response?.data
                ?.message ||

              "Server Error",

            variant:
              "destructive",

          });

        }

        finally {

          setActionLoading(
            false
          );

        }

      };


    // ====================================
    // INITIAL LOAD
    // ====================================
    useEffect(() => {

      fetchRequests();

    }, []);


    // ====================================
    // STATUS BADGE
    // ====================================
    const renderStatusBadge =
      (
        status: string
      ) => {

        switch (status) {

          case "Accepted":

            return (

              <Badge className="bg-green-600 text-white rounded-xl">

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

              <Badge className="bg-blue-600 text-white rounded-xl">

                <CheckCheck className="h-3 w-3 mr-1" />

                Completed

              </Badge>

            );

          default:

            return (

              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-700 rounded-xl"
              >

                <Clock3 className="h-3 w-3 mr-1" />

                Pending

              </Badge>

            );

        }

      };


    // ====================================
    // STATS
    // ====================================
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


    // ====================================
    // UI
    // ====================================
    return (

      <div className="min-h-screen bg-background">

        <Header />

        <div className="max-w-7xl mx-auto p-6">


          {/* HERO */}

          <div className="mb-10">

            <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-primary via-purple-600 to-indigo-700 text-white shadow-2xl">

              <div className="p-8 md:p-10">

                <div className="flex items-center gap-5">

                  <div className="h-20 w-20 rounded-3xl bg-white/20 flex items-center justify-center">

                    <Brain className="h-10 w-10" />

                  </div>


                  <div>

                    <h1 className="text-4xl md:text-5xl font-bold">

                      Guidance Requests

                    </h1>

                    <p className="text-white/90 mt-3 text-lg">

                      Mentor students, schedule meetings, and help them grow professionally.

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* STATS */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            <Card className="rounded-3xl shadow-xl border-0">

              <CardContent className="p-6 flex items-center gap-4">

                <div className="h-14 w-14 rounded-2xl bg-yellow-100 flex items-center justify-center">

                  <Clock3 className="h-7 w-7 text-yellow-600" />

                </div>

                <div>

                  <p className="text-muted-foreground text-sm">

                    Pending

                  </p>

                  <h2 className="text-3xl font-bold">

                    {pendingCount}

                  </h2>

                </div>

              </CardContent>

            </Card>


            <Card className="rounded-3xl shadow-xl border-0">

              <CardContent className="p-6 flex items-center gap-4">

                <div className="h-14 w-14 rounded-2xl bg-green-100 flex items-center justify-center">

                  <CheckCircle2 className="h-7 w-7 text-green-600" />

                </div>

                <div>

                  <p className="text-muted-foreground text-sm">

                    Accepted

                  </p>

                  <h2 className="text-3xl font-bold">

                    {acceptedCount}

                  </h2>

                </div>

              </CardContent>

            </Card>


            <Card className="rounded-3xl shadow-xl border-0">

              <CardContent className="p-6 flex items-center gap-4">

                <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center">

                  <CheckCheck className="h-7 w-7 text-blue-600" />

                </div>

                <div>

                  <p className="text-muted-foreground text-sm">

                    Completed

                  </p>

                  <h2 className="text-3xl font-bold">

                    {completedCount}

                  </h2>

                </div>

              </CardContent>

            </Card>

          </div>


          {/* SEARCH + FILTER */}

          <div className="flex flex-col lg:flex-row gap-4 mb-8">

            <Input

              placeholder="Search by topic, student, or domain..."

              value={search}

              onChange={(e) =>

                setSearch(
                  e.target.value
                )

              }

              className="h-14 rounded-2xl"

            />


            <select

              value={selectedStatus}

              onChange={(e) =>

                setSelectedStatus(
                  e.target.value
                )

              }

              className="h-14 px-5 rounded-2xl border bg-background"

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


            <Button
              variant="outline"
              className="h-14 rounded-2xl"
              onClick={
                fetchRequests
              }
            >

              <RefreshCw className="h-4 w-4 mr-2" />

              Refresh

            </Button>

          </div>


          {/* ERROR */}

          {error && (

            <div className="bg-red-100 text-red-600 p-4 rounded-2xl mb-5">

              {error}

            </div>

          )}


          {/* LOADING */}

          {loading ? (

            <div className="flex items-center justify-center py-20">

              <Loader2 className="h-12 w-12 animate-spin text-primary" />

            </div>

          ) : filteredRequests.length ===
            0 ? (

            <Card className="rounded-3xl shadow-2xl border-0">

              <CardContent className="py-24 text-center">

                <Sparkles className="h-16 w-16 mx-auto text-muted-foreground mb-5" />

                <h2 className="text-3xl font-bold mb-3">

                  No Requests Found

                </h2>

                <p className="text-muted-foreground">

                  Students haven’t requested mentorship yet.

                </p>

              </CardContent>

            </Card>

          ) : (

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

              {filteredRequests.map(
                (
                  request
                ) => (

                  <Card
                    key={
                      request._id
                    }

                    className="shadow-2xl rounded-3xl border-0 overflow-hidden"

                  >

                    {/* TOP */}

                    <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-6">

                      <div className="flex items-center justify-between gap-4">

                        <div>

                          <h2 className="text-2xl font-bold">

                            {
                              request.topic
                            }

                          </h2>

                          <p className="text-white/90 mt-1">

                            by {
                              request.studentName
                            }

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

                      <div className="flex items-center gap-2">

                        <BookOpen className="h-4 w-4 text-primary" />

                        <Badge
                          variant="outline"
                          className="rounded-xl"
                        >

                          {
                            request.domain
                          }

                        </Badge>

                      </div>


                      {/* URGENCY */}

                      <div>

                        <span className="font-semibold">

                          Urgency:

                        </span>

                        <p className="mt-1">

                          {
                            request.urgency
                          }

                        </p>

                      </div>


                      {/* DESCRIPTION */}

                      <div className="rounded-2xl bg-muted/40 border p-5">

                        <div className="flex items-center gap-2 mb-3">

                          <User className="h-5 w-5 text-primary" />

                          <h3 className="font-semibold">

                            Student Description

                          </h3>

                        </div>

                        <p className="leading-7 text-muted-foreground">

                          {
                            request.description
                          }

                        </p>

                      </div>


                      {/* DATE */}

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">

                        <Calendar className="h-4 w-4" />

                        {new Date(

                          request.createdAt

                        ).toLocaleDateString()}

                      </div>


                      {/* MEETING LINK */}

                      {request.meetingLink && (

                        <div>

                          <span className="font-semibold flex items-center gap-2 mb-2">

                            <Video className="h-4 w-4" />

                            Meeting Link

                          </span>

                          <a

                            href={
                              request.meetingLink
                            }

                            target="_blank"

                            rel="noreferrer"

                            className="text-blue-600 underline break-all"

                          >

                            Join Meeting

                          </a>

                        </div>

                      )}


                      {/* SCHEDULE */}

                      {request.scheduledDate && (

                        <div>

                          <span className="font-semibold">

                            Scheduled Date:

                          </span>

                          <p className="mt-1">

                            {new Date(

                              request.scheduledDate

                            ).toLocaleString()}

                          </p>

                        </div>

                      )}


                      {/* ACTIONS */}

                      <div className="pt-3 space-y-3">

                        {request.status ===
                          "Pending" && (

                          <>

                            <Input

                              placeholder="Google Meet / Zoom Link"

                              value={

                                formData[
                                  request._id
                                ]
                                  ?.meetingLink ||

                                ""

                              }

                              onChange={(e) =>

                                updateFormData(

                                  request._id,

                                  "meetingLink",

                                  e.target
                                    .value

                                )

                              }

                              className="rounded-2xl h-12"

                            />


                            <Input

                              type="datetime-local"

                              value={

                                formData[
                                  request._id
                                ]
                                  ?.scheduledDate ||

                                ""

                              }

                              onChange={(e) =>

                                updateFormData(

                                  request._id,

                                  "scheduledDate",

                                  e.target
                                    .value

                                )

                              }

                              className="rounded-2xl h-12"

                            />


                            <div className="flex flex-wrap gap-3">

                              <Button

                                disabled={
                                  actionLoading
                                }

                                className="rounded-2xl"

                                onClick={() =>

                                  updateStatus(

                                    request._id,

                                    "Accepted"

                                  )

                                }

                              >

                                {actionLoading ? (

                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />

                                ) : (

                                  <CheckCircle2 className="h-4 w-4 mr-2" />

                                )}

                                Accept

                              </Button>


                              <Button

                                variant="destructive"

                                className="rounded-2xl"

                                disabled={
                                  actionLoading
                                }

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

                            </div>

                          </>

                        )}


                        {/* ACCEPTED */}

                        {request.status ===
                          "Accepted" && (

                          <div className="flex flex-wrap gap-3">

                            <Button

                              variant="outline"

                              className="rounded-2xl"

                              onClick={() =>

                                navigate(

                                  `/alumni/chat/${request.studentId}`

                                )

                              }

                            >

                              <MessageCircle className="h-4 w-4 mr-2" />

                              Open Chat

                            </Button>


                            <Button

                              className="rounded-2xl"

                              disabled={
                                actionLoading
                              }

                              onClick={() =>

                                updateStatus(

                                  request._id,

                                  "Completed"

                                )

                              }

                            >

                              Mark Completed

                            </Button>

                          </div>

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