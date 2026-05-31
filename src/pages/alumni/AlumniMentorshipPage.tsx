import {
  useEffect,
  useState,
} from "react";

import api, { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/utils/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button }
  from "@/components/ui/button";

import { Badge }
  from "@/components/ui/badge";

import { Header }
  from "@/components/layout/Header";

import { useToast }
  from "@/hooks/use-toast";

import {
  useNavigate,
} from "react-router-dom";

import {

  CheckCircle,
  XCircle,
  Clock,
  GraduationCap,
  Loader2,
  MessageSquare,
  Sparkles,
  Brain,
  Calendar,
  User,
  BookOpen,
  ArrowRight,
  Search,

} from "lucide-react";

import { Input }
  from "@/components/ui/input";


// ==========================================
// TYPES
// ==========================================
interface Mentorship {

  _id: string;

  studentName: string;

  studentId?: string;

  domain: string;

  message: string;

  status: string;

  createdAt?: string;

}


// ==========================================
// COMPONENT
// ==========================================
const AlumniMentorshipPage:
React.FC = () => {

  // ========================================
  // STATES
  // ========================================
  const [

    requests,

    setRequests,

  ] = useState<Mentorship[]>([]);


  const [

    filteredRequests,

    setFilteredRequests,

  ] = useState<Mentorship[]>([]);


  const [

    search,

    setSearch,

  ] = useState("");


  const [

    loading,

    setLoading,

  ] = useState(false);


  const [

    updatingId,

    setUpdatingId,

  ] = useState<string | null>(
    null
  );


  const [

    error,

    setError,

  ] = useState("");


  // ========================================
  // HOOKS
  // ========================================
  const { toast } =
    useToast();

  const navigate =
    useNavigate();


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
  // FETCH REQUESTS
  // ========================================
  const fetchRequests =
    async () => {

      try {

        setLoading(true);

        setError("");


        const response =
          await api.get(

            "/mentorship",

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
          "Failed to load mentorship requests"
        );

        toast({

          title:
            "Failed to load mentorship requests",

          variant:
            "destructive",

        });

      }

      finally {

        setLoading(false);

      }

    };


  // ========================================
  // UPDATE STATUS
  // ========================================
  const updateStatus =
    async (

      id: string,

      status: string

    ) => {

      try {

        setUpdatingId(id);

        await api.put(

          `/mentorship/${id}/status`,

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


        toast({

          title:
            `Request ${status}`,

          description:
            `Mentorship request marked as ${status}`,

        });


        setRequests((prev) =>

          prev.map((req) =>

            req._id === id

              ? {

                  ...req,

                  status,

                }

              : req

          )

        );


        setFilteredRequests((prev) =>

          prev.map((req) =>

            req._id === id

              ? {

                  ...req,

                  status,

                }

              : req

          )

        );

      }

      catch (error: any) {

        console.log(error);

        toast({

          title:
            "Update failed",

          description:

            error?.response?.data
              ?.message ||

            "Something went wrong",

          variant:
            "destructive",

        });

      }

      finally {

        setUpdatingId(null);

      }

    };


  // ========================================
  // FILTER SEARCH
  // ========================================
  useEffect(() => {

    const filtered =
      requests.filter(

        (request) =>

          request.studentName
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          request.domain
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          request.message
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )

      );

    setFilteredRequests(
      filtered
    );

  }, [

    search,
    requests,

  ]);


  // ========================================
  // STATUS BADGE
  // ========================================
  const getStatusBadge =
    (status: string) => {

      switch (status) {

        case "Accepted":

          return (

            <Badge className="bg-green-500 text-white rounded-xl">

              <CheckCircle className="h-3 w-3 mr-1" />

              Accepted

            </Badge>

          );

        case "Rejected":

          return (

            <Badge
              variant="destructive"
              className="rounded-xl"
            >

              <XCircle className="h-3 w-3 mr-1" />

              Rejected

            </Badge>

          );

        default:

          return (

            <Badge
              variant="secondary"
              className="rounded-xl"
            >

              <Clock className="h-3 w-3 mr-1" />

              Pending

            </Badge>

          );

      }

    };


  // ========================================
  // INITIAL LOAD
  // ========================================
  useEffect(() => {

    fetchRequests();

  }, []);


  // ========================================
  // STATS
  // ========================================
  const acceptedCount =
    requests.filter(
      (req) =>
        req.status ===
        "Accepted"
    ).length;


  const pendingCount =
    requests.filter(
      (req) =>
        req.status ===
        "Pending"
    ).length;


  const rejectedCount =
    requests.filter(
      (req) =>
        req.status ===
        "Rejected"
    ).length;


  // ========================================
  // UI
  // ========================================
  return (

    <div className="min-h-screen bg-background">

      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">


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

                    Mentorship Requests

                  </h1>

                  <p className="text-white/90 mt-3 text-lg">

                    Manage mentorship requests from students and guide future professionals.

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* SEARCH */}
        <div className="mb-8">

          <div className="relative max-w-xl">

            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

            <Input

              placeholder="Search by student, domain, or message..."

              value={search}

              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }

              className="pl-12 h-14 rounded-2xl"

            />

          </div>

        </div>


        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <Card className="rounded-3xl shadow-xl border-0">

            <CardContent className="p-6 flex items-center gap-4">

              <div className="h-14 w-14 rounded-2xl bg-yellow-100 flex items-center justify-center">

                <Clock className="h-7 w-7 text-yellow-600" />

              </div>

              <div>

                <p className="text-muted-foreground text-sm">

                  Pending Requests

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

                <CheckCircle className="h-7 w-7 text-green-600" />

              </div>

              <div>

                <p className="text-muted-foreground text-sm">

                  Accepted Requests

                </p>

                <h2 className="text-3xl font-bold">

                  {acceptedCount}

                </h2>

              </div>

            </CardContent>

          </Card>


          <Card className="rounded-3xl shadow-xl border-0">

            <CardContent className="p-6 flex items-center gap-4">

              <div className="h-14 w-14 rounded-2xl bg-red-100 flex items-center justify-center">

                <XCircle className="h-7 w-7 text-red-600" />

              </div>

              <div>

                <p className="text-muted-foreground text-sm">

                  Rejected Requests

                </p>

                <h2 className="text-3xl font-bold">

                  {rejectedCount}

                </h2>

              </div>

            </CardContent>

          </Card>

        </div>


        {/* ERROR */}
        {error && (

          <div className="bg-red-100 text-red-600 p-4 rounded-2xl mb-6">

            {error}

          </div>

        )}


        {/* LOADING */}
        {loading ? (

          <div className="flex justify-center items-center py-24">

            <Loader2 className="h-12 w-12 animate-spin text-primary" />

          </div>

        ) : filteredRequests.length === 0 ? (

          /* EMPTY */

          <Card className="shadow-2xl rounded-3xl border-0">

            <CardContent className="py-20 text-center">

              <GraduationCap className="h-16 w-16 mx-auto text-muted-foreground mb-5" />

              <h2 className="text-3xl font-bold mb-3">

                No Mentorship Requests

              </h2>

              <p className="text-muted-foreground">

                Student mentorship requests will appear here

              </p>

            </CardContent>

          </Card>

        ) : (

          /* REQUESTS */

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

            {filteredRequests.map((request) => (

              <Card
                key={request._id}
                className="shadow-2xl rounded-3xl border-0 overflow-hidden hover:scale-[1.01] transition-all duration-300"
              >


                {/* TOP */}
                <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-6">

                  <div className="flex items-center justify-between gap-4">

                    <div>

                      <h2 className="text-2xl font-bold flex items-center gap-2">

                        <User className="h-5 w-5" />

                        {request.studentName}

                      </h2>

                      <p className="text-white/90 mt-2">

                        Domain:
                        {" "}
                        {request.domain}

                      </p>

                    </div>


                    {getStatusBadge(
                      request.status
                    )}

                  </div>

                </div>


                {/* BODY */}
                <CardContent className="p-6 space-y-5">


                  {/* MESSAGE */}
                  <div className="rounded-2xl bg-muted/40 p-5 border">

                    <div className="flex items-center gap-2 mb-3">

                      <MessageSquare className="h-5 w-5 text-primary" />

                      <h3 className="font-semibold">

                        Student Message

                      </h3>

                    </div>

                    <p className="leading-7 text-muted-foreground">

                      {request.message}

                    </p>

                  </div>


                  {/* DATE */}
                  {request.createdAt && (

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">

                      <Calendar className="h-4 w-4" />

                      Requested on
                      {" "}

                      {new Date(
                        request.createdAt
                      ).toLocaleDateString()}

                    </div>

                  )}


                  {/* DOMAIN */}
                  <div className="flex items-center gap-2">

                    <BookOpen className="h-4 w-4 text-primary" />

                    <Badge
                      variant="outline"
                      className="rounded-xl"
                    >

                      {request.domain}

                    </Badge>

                  </div>


                  {/* ACTIONS */}
                  {request.status ===
                    "Pending" && (

                    <div className="flex flex-wrap gap-3 pt-2">

                      <Button

                        onClick={() =>

                          updateStatus(

                            request._id,

                            "Accepted"

                          )

                        }

                        disabled={
                          updatingId ===
                          request._id
                        }

                        className="bg-green-600 hover:bg-green-700 rounded-2xl"

                      >

                        {updatingId ===
                        request._id ? (

                          <Loader2 className="h-4 w-4 animate-spin mr-2" />

                        ) : (

                          <CheckCircle className="h-4 w-4 mr-2" />

                        )}

                        Accept Request

                      </Button>


                      <Button

                        variant="destructive"

                        onClick={() =>

                          updateStatus(

                            request._id,

                            "Rejected"

                          )

                        }

                        disabled={
                          updatingId ===
                          request._id
                        }

                        className="rounded-2xl"

                      >

                        <XCircle className="h-4 w-4 mr-2" />

                        Reject

                      </Button>


                      {request.studentId && (

                        <Button

                          variant="outline"

                          className="rounded-2xl"

                          onClick={() =>

                            navigate(
                              `/alumni/chat/${request.studentId}`
                            )

                          }

                        >

                          <MessageSquare className="h-4 w-4 mr-2" />

                          Chat

                        </Button>

                      )}

                    </div>

                  )}


                  {/* ACCEPTED CHAT */}
                  {request.status ===
                    "Accepted" &&

                    request.studentId && (

                    <Button

                      className="w-full rounded-2xl"

                      onClick={() =>

                        navigate(
                          `/alumni/chat/${request.studentId}`
                        )

                      }

                    >

                      Open Chat

                      <ArrowRight className="h-4 w-4 ml-2" />

                    </Button>

                  )}

                </CardContent>

              </Card>

            ))}

          </div>

        )}

      </main>

    </div>

  );

};


// ==========================================
// EXPORT
// ==========================================
export default AlumniMentorshipPage;