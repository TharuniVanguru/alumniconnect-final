import {
  useState,
} from "react";

import api, { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/utils/api";
import { Header }
  from "@/components/layout/Header";

import {

  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,

} from "@/components/ui/card";

import { Input }
  from "@/components/ui/input";

import { Textarea }
  from "@/components/ui/textarea";

import { Button }
  from "@/components/ui/button";

import {

  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,

} from "@/components/ui/select";

import {
  Badge,
} from "@/components/ui/badge";

import {
  useToast,
} from "@/hooks/use-toast";

import {
  useNavigate,
} from "react-router-dom";

import {

  CalendarDays,
  Clock,
  MapPin,
  Loader2,
  Video,
  ImagePlus,
  Sparkles,
  Users,
  Globe,
  Rocket,
  Calendar,
  CheckCircle2,

} from "lucide-react";


// ==========================================
// COMPONENT
// ==========================================
const CreateEventPage:
React.FC = () => {

  // ========================================
  // STATES
  // ========================================
  const [title, setTitle] =
    useState("");

  const [

    description,

    setDescription,

  ] = useState("");

  const [date, setDate] =
    useState("");

  const [time, setTime] =
    useState("");

  const [

    location,

    setLocation,

  ] = useState("");

  const [mode, setMode] =
    useState("Online");

  const [

    eventType,

    setEventType,

  ] = useState("Workshop");

  const [

    meetingLink,

    setMeetingLink,

  ] = useState("");

  const [

    loading,

    setLoading,

  ] = useState(false);

  const [

    bannerImage,

    setBannerImage,

  ] = useState<File | null>(
    null
  );


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
  // VALIDATION
  // ========================================
  const validateForm =
    () => {

      if (

        !title.trim() ||

        !description.trim() ||

        !date ||

        !time

      ) {

        toast({

          title:
            "Validation Error",

          description:
            "Please fill all required fields",

          variant:
            "destructive",

        });

        return false;

      }


      if (

        mode !== "Online" &&

        !location.trim()

      ) {

        toast({

          title:
            "Location Required",

          description:
            "Please enter event location",

          variant:
            "destructive",

        });

        return false;

      }


      if (

        mode === "Online" &&

        !meetingLink.trim()

      ) {

        toast({

          title:
            "Meeting Link Required",

          description:
            "Please enter online meeting link",

          variant:
            "destructive",

        });

        return false;

      }

      return true;

    };


  // ========================================
  // SUBMIT EVENT
  // ========================================
  const submitEvent =
    async () => {

      if (!validateForm())
        return;

      try {

        setLoading(true);

        const formData =
          new FormData();

        formData.append(
          "title",
          title
        );

        formData.append(
          "description",
          description
        );

        formData.append(
          "date",
          date
        );

        formData.append(
          "time",
          time
        );

        formData.append(
          "location",
          location
        );

        formData.append(
          "mode",
          mode
        );

        formData.append(
          "type",
          eventType
        );

        formData.append(
          "meetingLink",
          meetingLink
        );

        if (bannerImage) {

          formData.append(
            "bannerImage",
            bannerImage
          );

        }


        await api.post(

          "/events",

          formData,

          {

            headers: {

              Authorization:
                `Bearer ${userInfo.token}`,

              "Content-Type":
                "multipart/form-data",

            },

          }

        );


        toast({

          title:
            "Event Created 🎉",

          description:
            "Your event has been published successfully",

        });


        // RESET
        setTitle("");

        setDescription("");

        setDate("");

        setTime("");

        setLocation("");

        setMeetingLink("");

        setMode("Online");

        setEventType(
          "Workshop"
        );

        setBannerImage(
          null
        );


        // REDIRECT
        navigate(
          "/alumni/dashboard"
        );

      }

      catch (error: any) {

        console.log(error);

        toast({

          title:
            "Failed to create event",

          description:

            error?.response?.data
              ?.message ||

            "Server error occurred",

          variant:
            "destructive",

        });

      }

      finally {

        setLoading(false);

      }

    };


  // ========================================
  // EVENT TYPES
  // ========================================
  const eventTypes = [

    "Workshop",
    "Webinar",
    "Hackathon",
    "Networking",
    "Seminar",
    "Bootcamp",

  ];


  // ========================================
  // UI
  // ========================================
  return (

    <div className="min-h-screen bg-background">

      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">


        {/* HERO */}

        <div className="mb-10">

          <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-primary via-purple-600 to-indigo-700 text-white shadow-2xl">

            <div className="p-8 md:p-10">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                <div>

                  <div className="flex items-center gap-4 mb-5">

                    <div className="h-20 w-20 rounded-3xl bg-white/20 flex items-center justify-center">

                      <Rocket className="h-10 w-10" />

                    </div>


                    <div>

                      <h1 className="text-4xl md:text-5xl font-bold">

                        Create Event

                      </h1>

                      <p className="text-white/90 mt-2 text-lg">

                        Organize impactful alumni events and inspire students

                      </p>

                    </div>

                  </div>


                  <div className="flex flex-wrap gap-3">

                    <Badge className="bg-white/20 border-0 text-white">

                      <Users className="h-3 w-3 mr-1" />

                      Alumni Network

                    </Badge>

                    <Badge className="bg-white/20 border-0 text-white">

                      <Globe className="h-3 w-3 mr-1" />

                      Global Reach

                    </Badge>

                    <Badge className="bg-white/20 border-0 text-white">

                      <Sparkles className="h-3 w-3 mr-1" />

                      Premium Experience

                    </Badge>

                  </div>

                </div>


                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 w-full lg:w-[320px]">

                  <h3 className="font-bold text-xl mb-4">

                    Event Tips

                  </h3>

                  <div className="space-y-3 text-sm text-white/90">

                    <div className="flex items-start gap-2">

                      <CheckCircle2 className="h-4 w-4 mt-0.5" />

                      Add clear event title

                    </div>

                    <div className="flex items-start gap-2">

                      <CheckCircle2 className="h-4 w-4 mt-0.5" />

                      Mention agenda & benefits

                    </div>

                    <div className="flex items-start gap-2">

                      <CheckCircle2 className="h-4 w-4 mt-0.5" />

                      Share valid meeting links

                    </div>

                    <div className="flex items-start gap-2">

                      <CheckCircle2 className="h-4 w-4 mt-0.5" />

                      Upload attractive banner

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* FORM */}

        <Card className="rounded-3xl shadow-2xl border-0">

          <CardHeader>

            <CardTitle className="text-3xl">

              Event Details

            </CardTitle>

            <CardDescription>

              Fill all required details to publish your event

            </CardDescription>

          </CardHeader>


          <CardContent>

            <div className="grid gap-6">


              {/* TITLE */}

              <div>

                <label className="text-sm font-semibold mb-3 block">

                  Event Title *

                </label>

                <Input

                  placeholder="Ex: AI Workshop 2026"

                  value={title}

                  onChange={(e) =>

                    setTitle(
                      e.target.value
                    )

                  }

                  className="h-14 rounded-2xl"

                />

              </div>


              {/* EVENT TYPE */}

              <div>

                <label className="text-sm font-semibold mb-3 block">

                  Event Type

                </label>

                <Select
                  value={eventType}
                  onValueChange={
                    setEventType
                  }
                >

                  <SelectTrigger className="h-14 rounded-2xl">

                    <SelectValue />

                  </SelectTrigger>

                  <SelectContent>

                    {eventTypes.map(
                      (type) => (

                        <SelectItem
                          key={type}
                          value={type}
                        >

                          {type}

                        </SelectItem>

                      )
                    )}

                  </SelectContent>

                </Select>

              </div>


              {/* DATE + TIME */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>

                  <label className="text-sm font-semibold mb-3 flex items-center gap-2">

                    <CalendarDays className="h-4 w-4" />

                    Event Date *

                  </label>

                  <Input

                    type="date"

                    value={date}

                    onChange={(e) =>

                      setDate(
                        e.target.value
                      )

                    }

                    className="h-14 rounded-2xl"

                  />

                </div>


                <div>

                  <label className="text-sm font-semibold mb-3 flex items-center gap-2">

                    <Clock className="h-4 w-4" />

                    Event Time *

                  </label>

                  <Input

                    type="time"

                    value={time}

                    onChange={(e) =>

                      setTime(
                        e.target.value
                      )

                    }

                    className="h-14 rounded-2xl"

                  />

                </div>

              </div>


              {/* MODE */}

              <div>

                <label className="text-sm font-semibold mb-3 block">

                  Event Mode

                </label>

                <Select
                  value={mode}
                  onValueChange={
                    setMode
                  }
                >

                  <SelectTrigger className="h-14 rounded-2xl">

                    <SelectValue />

                  </SelectTrigger>

                  <SelectContent>

                    <SelectItem value="Online">

                      Online

                    </SelectItem>

                    <SelectItem value="Offline">

                      Offline

                    </SelectItem>

                    <SelectItem value="Hybrid">

                      Hybrid

                    </SelectItem>

                  </SelectContent>

                </Select>

              </div>


              {/* LOCATION */}

              {(mode ===
                "Offline" ||

                mode ===
                  "Hybrid") && (

                <div>

                  <label className="text-sm font-semibold mb-3 flex items-center gap-2">

                    <MapPin className="h-4 w-4" />

                    Event Location *

                  </label>

                  <Input

                    placeholder="Ex: Hyderabad Campus Auditorium"

                    value={location}

                    onChange={(e) =>

                      setLocation(
                        e.target.value
                      )

                    }

                    className="h-14 rounded-2xl"

                  />

                </div>

              )}


              {/* MEETING LINK */}

              {(mode ===
                "Online" ||

                mode ===
                  "Hybrid") && (

                <div>

                  <label className="text-sm font-semibold mb-3 flex items-center gap-2">

                    <Video className="h-4 w-4" />

                    Meeting Link *

                  </label>

                  <Input

                    placeholder="https://meet.google.com/..."

                    value={meetingLink}

                    onChange={(e) =>

                      setMeetingLink(
                        e.target.value
                      )

                    }

                    className="h-14 rounded-2xl"

                  />

                </div>

              )}


              {/* DESCRIPTION */}

              <div>

                <label className="text-sm font-semibold mb-3 block">

                  Event Description *

                </label>

                <Textarea

                  placeholder="Explain event agenda, speakers, benefits, learning outcomes..."

                  rows={8}

                  value={description}

                  onChange={(e) =>

                    setDescription(
                      e.target.value
                    )

                  }

                  className="rounded-2xl resize-none"

                />

              </div>


              {/* BANNER */}

              <div>

                <label className="text-sm font-semibold mb-3 flex items-center gap-2">

                  <ImagePlus className="h-4 w-4" />

                  Event Banner

                </label>

                <Input

                  type="file"

                  accept="image/*"

                  className="rounded-2xl h-14"

                  onChange={(e) => {

                    if (
                      e.target.files &&
                      e.target.files[0]
                    ) {

                      setBannerImage(
                        e.target.files[0]
                      );

                    }

                  }}

                />


                {bannerImage && (

                  <p className="text-sm text-muted-foreground mt-3">

                    Selected:
                    {" "}
                    {bannerImage.name}

                  </p>

                )}

              </div>


              {/* SUMMARY */}

              <div className="rounded-3xl bg-muted/40 p-6 border">

                <div className="flex items-center gap-3 mb-4">

                  <Calendar className="h-5 w-5 text-primary" />

                  <h3 className="font-bold text-lg">

                    Event Preview

                  </h3>

                </div>


                <div className="space-y-2 text-sm">

                  <p>

                    <span className="font-semibold">

                      Title:
                    </span>
                    {" "}
                    {title || "Not added"}

                  </p>

                  <p>

                    <span className="font-semibold">

                      Type:
                    </span>
                    {" "}
                    {eventType}

                  </p>

                  <p>

                    <span className="font-semibold">

                      Mode:
                    </span>
                    {" "}
                    {mode}

                  </p>

                  <p>

                    <span className="font-semibold">

                      Date:
                    </span>
                    {" "}
                    {date || "Not selected"}

                  </p>

                </div>

              </div>


              {/* BUTTON */}

              <div className="flex justify-end pt-2">

                <Button

                  onClick={
                    submitEvent
                  }

                  disabled={loading}

                  className="h-14 px-10 rounded-2xl text-lg font-semibold"

                >

                  {loading ? (

                    <>

                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />

                      Creating Event...

                    </>

                  ) : (

                    <>

                      <Rocket className="mr-2 h-5 w-5" />

                      Create Event

                    </>

                  )}

                </Button>

              </div>

            </div>

          </CardContent>

        </Card>

      </main>

    </div>

  );

};


// ==========================================
// EXPORT
// ==========================================
export default CreateEventPage;