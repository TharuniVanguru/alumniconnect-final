import {
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { Header }
  from "@/components/layout/Header";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Input }
  from "@/components/ui/input";

import { Textarea }
  from "@/components/ui/textarea";

import { Button }
  from "@/components/ui/button";

import {
  AlertCircle,
  Send,
  Loader2,
  Sparkles,
} from "lucide-react";


const GuidanceRequestPage =
  () => {

    const navigate =
      useNavigate();

    const { alumniId } =
      useParams();


    const userInfo =
      JSON.parse(
        localStorage.getItem(
          "userInfo"
        ) || "{}"
      );


    const [domain, setDomain] =
      useState("");

    const [topic, setTopic] =
      useState("");

    const [
      description,
      setDescription,
    ] = useState("");

    const [
      urgency,
      setUrgency,
    ] = useState("Medium");

    const [
      loading,
      setLoading,
    ] = useState(false);

    const [
      error,
      setError,
    ] = useState("");


    // =====================
    // SEND REQUEST
    // =====================
    const sendRequest =
      async () => {

        try {

          setError("");

          // VALIDATION
          if (
            !domain ||
            !topic ||
            !description
          ) {

            setError(
              "Please fill all fields"
            );

            return;

          }

          setLoading(true);

          await axios.post(

            "http://localhost:5000/guidance",

            {

              alumniId,

              domain,

              topic,

              description,

              urgency,

            },

            {

              headers: {

                Authorization:
                  `Bearer ${userInfo.token}`,

              },

            }

          );

          alert(
            "Guidance Request Sent Successfully 🚀"
          );

          navigate(
            "/student/dashboard"
          );

        }

        catch (error) {

          console.log(error);

          setError(
            "Failed to send request"
          );

        }

        finally {

          setLoading(false);

        }

      };


    return (

      <div className="min-h-screen bg-background">

        <Header />

        <div className="max-w-3xl mx-auto p-6">

          <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden">

            {/* TOP BANNER */}

            <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-8">

              <div className="flex items-center gap-3 mb-3">

                <Sparkles className="h-8 w-8" />

                <h1 className="text-3xl font-bold">

                  Raise Guidance Request

                </h1>

              </div>

              <p className="text-white/90 text-lg">

                Ask career doubts, mentorship guidance,
                interview help, roadmap suggestions & more.

              </p>

            </div>


            <CardContent className="p-8 space-y-6">

              {/* ERROR */}

              {error && (

                <div className="flex items-center gap-2 bg-red-100 text-red-600 p-4 rounded-xl">

                  <AlertCircle className="h-5 w-5" />

                  <span>{error}</span>

                </div>

              )}


              {/* DOMAIN */}

              <div className="space-y-2">

                <label className="text-sm font-semibold">

                  Domain

                </label>

                <Input
                  placeholder="Web Development, AI, Data Science..."

                  value={domain}

                  onChange={(e) =>
                    setDomain(
                      e.target.value
                    )
                  }

                  className="h-12 rounded-xl"
                />

              </div>


              {/* TOPIC */}

              <div className="space-y-2">

                <label className="text-sm font-semibold">

                  Topic

                </label>

                <Input
                  placeholder="Career Guidance / Resume Review / Interview Prep"

                  value={topic}

                  onChange={(e) =>
                    setTopic(
                      e.target.value
                    )
                  }

                  className="h-12 rounded-xl"
                />

              </div>


              {/* DESCRIPTION */}

              <div className="space-y-2">

                <label className="text-sm font-semibold">

                  Description

                </label>

                <Textarea
                  placeholder="Explain your doubts in detail..."

                  className="min-h-[180px] rounded-xl"

                  value={description}

                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* URGENCY */}

              <div className="space-y-2">

                <label className="text-sm font-semibold">

                  Urgency Level

                </label>

                <select
                  className="w-full border rounded-xl p-3 h-12 bg-background"

                  value={urgency}

                  onChange={(e) =>
                    setUrgency(
                      e.target.value
                    )
                  }
                >

                  <option>
                    Low
                  </option>

                  <option>
                    Medium
                  </option>

                  <option>
                    High
                  </option>

                </select>

              </div>


              {/* BUTTON */}

              <Button
                className="w-full h-12 rounded-xl text-lg font-semibold"

                disabled={loading}

                onClick={sendRequest}
              >

                {loading ? (

                  <div className="flex items-center gap-2">

                    <Loader2 className="h-5 w-5 animate-spin" />

                    Sending Request...

                  </div>

                ) : (

                  <div className="flex items-center gap-2">

                    <Send className="h-5 w-5" />

                    Send Guidance Request

                  </div>

                )}

              </Button>

            </CardContent>

          </Card>

        </div>

      </div>

    );

  };


export default GuidanceRequestPage;