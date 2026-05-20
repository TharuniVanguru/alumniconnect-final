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
  CardHeader,
  CardTitle,
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

} from "lucide-react";


// =====================================
// INTERFACE
// =====================================
interface Alumni {

  _id: string;

  name: string;

  domain: string;

  email: string;

  bio?: string;

  skills?: string[];

  trustScore?: number;

}


// =====================================
// COMPONENT
// =====================================
const MentorshipPage = () => {

  const [alumni, setAlumni] =
    useState<Alumni[]>([]);

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

        setAlumni(
          response.data
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
  // SEND REQUEST
  // =====================================
  const sendRequest =
    async (
      alumniId: string,
      alumniName: string
    ) => {

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

            alumniId,
            alumniName,
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
            "Mentorship Request Sent",

          description:
            "Your request was successfully sent to alumni",

        });


        // CLEAR INPUTS
        setMessage("");

        setDomain("");

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

        {/* HEADER */}
        <div className="mb-10">

          <div className="flex items-center gap-4">

            <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg">

              <Brain className="h-8 w-8 text-white" />

            </div>

            <div>

              <h1 className="text-4xl font-bold">

                Alumni Mentorship

              </h1>

              <p className="text-muted-foreground text-lg">

                Connect with experienced alumni mentors and grow your career

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

            <Sparkles className="h-10 w-10 animate-pulse mx-auto mb-4 text-primary" />

            <h2 className="text-2xl font-bold mb-2">

              Loading Alumni...

            </h2>

            <p className="text-muted-foreground">

              Please wait while we fetch mentors

            </p>

          </div>

        ) : alumni.length === 0 ? (

          <div className="text-center py-20">

            <h2 className="text-2xl font-bold mb-2">

              No Alumni Found

            </h2>

            <p className="text-muted-foreground">

              Alumni mentors will appear here

            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {alumni.map((mentor) => (

              <Card
                key={mentor._id}
                className="rounded-3xl shadow-xl border-0 overflow-hidden hover:scale-[1.02] transition-all duration-300"
              >

                {/* TOP */}
                <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-6">

                  <div className="flex items-center justify-between">

                    <div>

                      <h2 className="text-2xl font-bold">

                        {mentor.name}

                      </h2>

                      <p className="text-white/90">

                        {mentor.domain || "Mentor"}

                      </p>

                    </div>

                    <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center">

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


                  {/* REQUEST BUTTON */}
                  <Dialog>

                    <DialogTrigger asChild>

                      <Button className="w-full">

                        Request Mentorship

                      </Button>

                    </DialogTrigger>


                    <DialogContent>

                      <DialogHeader>

                        <DialogTitle>

                          Send Mentorship Request

                        </DialogTitle>

                      </DialogHeader>


                      <div className="space-y-4">

                        <Input

                          placeholder="Enter your domain"

                          value={domain}

                          onChange={(e) =>
                            setDomain(
                              e.target.value
                            )
                          }

                        />


                        <Textarea

                          placeholder="Write your mentorship request message"

                          value={message}

                          onChange={(e) =>
                            setMessage(
                              e.target.value
                            )
                          }

                        />


                        <Button

                          className="w-full"

                          disabled={sending}

                          onClick={() =>
                            sendRequest(
                              mentor._id,
                              mentor.name
                            )
                          }

                        >

                          <Send className="h-4 w-4 mr-2" />

                          {sending
                            ? "Sending..."
                            : "Send Request"}

                        </Button>

                      </div>

                    </DialogContent>

                  </Dialog>

                </CardContent>

              </Card>

            ))}

          </div>

        )}

      </div>

    </div>

  );

};


export default MentorshipPage;