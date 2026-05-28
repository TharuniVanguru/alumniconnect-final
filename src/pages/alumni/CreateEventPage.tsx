import {
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

  CalendarDays,
  Clock,
  MapPin,
  Loader2,
  Video,
  ImagePlus,

} from "lucide-react";

import { useToast }
  from "@/hooks/use-toast";

import {
  useNavigate,
} from "react-router-dom";


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


        await axios.post(

          "http://localhost:5000/events",

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
            "Event Created",

          description:
            "Your event has been created successfully",

        });


        // ====================================
        // RESET FORM
        // ====================================
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


        // ====================================
        // REDIRECT
        // ====================================
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

            Create Event

          </h1>

          <p className="text-muted-foreground">

            Organize workshops, webinars, hackathons and alumni events

          </p>

        </div>


        {/* ================================= */}
        {/* FORM CARD */}
        {/* ================================= */}

        <Card className="max-w-3xl mx-auto shadow-soft">

          <CardHeader>

            <CardTitle>

              Event Details

            </CardTitle>

            <CardDescription>

              Fill in the details to publish your event

            </CardDescription>

          </CardHeader>


          <CardContent>

            <div className="grid gap-5">

              {/* TITLE */}

              <div>

                <label className="text-sm font-medium mb-2 block">

                  Event Title *

                </label>

                <Input

                  placeholder="Enter event title"

                  value={title}

                  onChange={(e) =>

                    setTitle(
                      e.target.value
                    )

                  }

                />

              </div>


              {/* EVENT TYPE */}

              <div>

                <label className="text-sm font-medium mb-2 block">

                  Event Type

                </label>

                <Select
                  value={eventType}
                  onValueChange={
                    setEventType
                  }
                >

                  <SelectTrigger>

                    <SelectValue />

                  </SelectTrigger>

                  <SelectContent>

                    <SelectItem value="Workshop">

                      Workshop

                    </SelectItem>

                    <SelectItem value="Webinar">

                      Webinar

                    </SelectItem>

                    <SelectItem value="Hackathon">

                      Hackathon

                    </SelectItem>

                    <SelectItem value="Networking">

                      Networking

                    </SelectItem>

                    <SelectItem value="Seminar">

                      Seminar

                    </SelectItem>

                  </SelectContent>

                </Select>

              </div>


              {/* DATE & TIME */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>

                  <label className="text-sm font-medium mb-2 flex items-center gap-2">

                    <CalendarDays className="h-4 w-4" />

                    Date *

                  </label>

                  <Input

                    type="date"

                    value={date}

                    onChange={(e) =>

                      setDate(
                        e.target.value
                      )

                    }

                  />

                </div>


                <div>

                  <label className="text-sm font-medium mb-2 flex items-center gap-2">

                    <Clock className="h-4 w-4" />

                    Time *

                  </label>

                  <Input

                    type="time"

                    value={time}

                    onChange={(e) =>

                      setTime(
                        e.target.value
                      )

                    }

                  />

                </div>

              </div>


              {/* MODE */}

              <div>

                <label className="text-sm font-medium mb-2 block">

                  Event Mode

                </label>

                <Select
                  value={mode}
                  onValueChange={
                    setMode
                  }
                >

                  <SelectTrigger>

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

                  <label className="text-sm font-medium mb-2 flex items-center gap-2">

                    <MapPin className="h-4 w-4" />

                    Location *

                  </label>

                  <Input

                    placeholder="Enter event location"

                    value={location}

                    onChange={(e) =>

                      setLocation(
                        e.target.value
                      )

                    }

                  />

                </div>

              )}


              {/* MEETING LINK */}

              {(mode ===
                "Online" ||

                mode ===
                  "Hybrid") && (

                <div>

                  <label className="text-sm font-medium mb-2 flex items-center gap-2">

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

                  />

                </div>

              )}


              {/* DESCRIPTION */}

              <div>

                <label className="text-sm font-medium mb-2 block">

                  Event Description *

                </label>

                <Textarea

                  placeholder="Describe your event..."

                  rows={6}

                  value={description}

                  onChange={(e) =>

                    setDescription(
                      e.target.value
                    )

                  }

                />

              </div>


              {/* BANNER IMAGE */}

              <div>

                <label className="text-sm font-medium mb-2 flex items-center gap-2">

                  <ImagePlus className="h-4 w-4" />

                  Event Banner

                </label>

                <Input

                  type="file"

                  accept="image/*"

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

              </div>


              {/* BUTTON */}

              <div className="flex justify-end pt-4">

                <Button

                  onClick={
                    submitEvent
                  }

                  disabled={loading}

                  className="min-w-[180px]"

                >

                  {loading ? (

                    <>

                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                      Creating...

                    </>

                  ) : (

                    "Create Event"

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