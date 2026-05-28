import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

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

import {

  CheckCircle,
  XCircle,
  Clock,
  GraduationCap,
  Loader2,
  MessageSquare,

} from "lucide-react";

import { Header }
  from "@/components/layout/Header";

import { useToast }
  from "@/hooks/use-toast";


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

  const [loading, setLoading] =
    useState(false);

  const [updatingId, setUpdatingId] =
    useState<string | null>(
      null
    );


  // ========================================
  // TOAST
  // ========================================
  const { toast } =
    useToast();


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

        const response =
          await axios.get(

            "http://localhost:5000/mentorship",

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

        await axios.put(

          `http://localhost:5000/mentorship/${id}/status`,

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


        fetchRequests();

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
  // STATUS BADGE
  // ========================================
  const getStatusBadge =
    (status: string) => {

      switch (status) {

        case "Accepted":

          return (

            <Badge className="bg-green-500 text-white">

              <CheckCircle className="h-3 w-3 mr-1" />

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

            <Badge variant="secondary">

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
  // UI
  // ========================================
  return (

    <div className="min-h-screen bg-background">

      <Header />

      <main className="container mx-auto px-4 py-6">

        {/* ================================= */}
        {/* PAGE HEADER */}
        {/* ================================= */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-foreground mb-2">

            Mentorship Requests

          </h1>

          <p className="text-muted-foreground">

            Review and manage mentorship requests from students

          </p>

        </div>


        {/* ================================= */}
        {/* LOADING */}
        {/* ================================= */}

        {loading ? (

          <div className="flex justify-center items-center py-20">

            <Loader2 className="h-10 w-10 animate-spin text-primary" />

          </div>

        ) : requests.length === 0 ? (

          /* =============================== */
          /* EMPTY STATE */
          /* =============================== */

          <Card className="shadow-soft">

            <CardContent className="py-16 text-center">

              <GraduationCap className="h-14 w-14 mx-auto text-muted-foreground mb-4" />

              <h2 className="text-xl font-semibold mb-2">

                No mentorship requests

              </h2>

              <p className="text-muted-foreground">

                Students mentorship requests will appear here

              </p>

            </CardContent>

          </Card>

        ) : (

          /* =============================== */
          /* REQUESTS */
          /* =============================== */

          <div className="grid gap-6">

            {requests.map((request) => (

              <Card
                key={request._id}
                className="shadow-soft hover:shadow-medium transition-all"
              >

                <CardHeader>

                  <div className="flex items-center justify-between flex-wrap gap-3">

                    <div>

                      <CardTitle className="flex items-center gap-2">

                        <GraduationCap className="h-5 w-5 text-primary" />

                        {request.studentName}

                      </CardTitle>

                      <CardDescription className="mt-1">

                        Domain:
                        {" "}
                        {request.domain}

                      </CardDescription>

                    </div>


                    {getStatusBadge(
                      request.status
                    )}

                  </div>

                </CardHeader>


                <CardContent>

                  {/* MESSAGE */}

                  <div className="bg-muted/30 rounded-lg p-4 mb-5">

                    <div className="flex items-center gap-2 mb-2">

                      <MessageSquare className="h-4 w-4 text-primary" />

                      <span className="font-medium">

                        Student Message

                      </span>

                    </div>

                    <p className="text-sm leading-relaxed">

                      {request.message}

                    </p>

                  </div>


                  {/* DATE */}

                  {request.createdAt && (

                    <p className="text-xs text-muted-foreground mb-4">

                      Requested on:
                      {" "}

                      {new Date(
                        request.createdAt
                      ).toLocaleDateString()}

                    </p>

                  )}


                  {/* ACTION BUTTONS */}

                  {request.status ===
                    "Pending" && (

                    <div className="flex flex-wrap gap-3">

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

                        className="bg-green-600 hover:bg-green-700"

                      >

                        {updatingId ===
                        request._id ? (

                          <Loader2 className="h-4 w-4 animate-spin mr-2" />

                        ) : (

                          <CheckCircle className="h-4 w-4 mr-2" />

                        )}

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

                        disabled={
                          updatingId ===
                          request._id
                        }

                      >

                        <XCircle className="h-4 w-4 mr-2" />

                        Reject

                      </Button>

                    </div>

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