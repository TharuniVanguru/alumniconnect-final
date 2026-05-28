import {
  useEffect,
  useMemo,
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

import { Badge }
  from "@/components/ui/badge";

import { Input }
  from "@/components/ui/input";

import {
  useToast,
} from "@/hooks/use-toast";

import {

  Calendar,
  Clock,
  MapPin,
  Search,
  Users,
  Video,
  Loader2,
  CheckCircle2,

} from "lucide-react";


// ==========================================
// TYPES
// ==========================================
interface EventItem {

  _id: string;

  title: string;

  description: string;

  date: string;

  time?: string;

  location?: string;

  type?: string;

  organizerName?: string;

  mode?: string;

  attendees?: number;

}


// ==========================================
// COMPONENT
// ==========================================
const EventsPage:
React.FC = () => {

  // ========================================
  // STATES
  // ========================================
  const [

    events,
    setEvents,

  ] = useState<EventItem[]>(
    []
  );


  const [

    loading,
    setLoading,

  ] = useState(false);


  const [

    registeringId,
    setRegisteringId,

  ] = useState("");


  const [

    searchQuery,
    setSearchQuery,

  ] = useState("");


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
  // FETCH EVENTS
  // ========================================
  const fetchEvents =
    async () => {

      try {

        setLoading(true);

        const response =
          await axios.get(

            "http://localhost:5000/events",

            {

              headers: {

                Authorization:
                  `Bearer ${userInfo.token}`,

              },

            }

          );

        setEvents(
          response.data || []
        );

      }

      catch (error: any) {

        console.log(error);

        toast({

          title:
            "Failed to load events",

          description:
            error.response?.data
              ?.message,

          variant:
            "destructive",

        });

      }

      finally {

        setLoading(false);

      }

    };


  // ========================================
  // REGISTER EVENT
  // ========================================
  const registerEvent =
    async (
      eventId: string
    ) => {

      try {

        setRegisteringId(
          eventId
        );

        await axios.post(

          `http://localhost:5000/events/${eventId}/register`,

          {},

          {

            headers: {

              Authorization:
                `Bearer ${userInfo.token}`,

            },

          }

        );


        toast({

          title:
            "Registered Successfully",

          description:
            "You have successfully registered for the event.",

        });


        // REMOVE REGISTERED EVENT
        setEvents((prev) =>

          prev.filter(
            (event) =>
              event._id !== eventId
          )

        );

      }

      catch (error: any) {

        console.log(error);

        toast({

          title:
            "Registration Failed",

          description:
            error.response?.data
              ?.message ||

            "Something went wrong",

          variant:
            "destructive",

        });

      }

      finally {

        setRegisteringId("");

      }

    };


  // ========================================
  // FILTER EVENTS
  // ========================================
  const filteredEvents =
    useMemo(() => {

      return events.filter(
        (event) =>

          event.title
            ?.toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            ) ||

          event.description
            ?.toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            ) ||

          event.location
            ?.toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            ) ||

          event.type
            ?.toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            )

      );

    }, [
      events,
      searchQuery,
    ]);


  // ========================================
  // INITIAL LOAD
  // ========================================
  useEffect(() => {

    fetchEvents();

  }, []);


  // ========================================
  // UI
  // ========================================
  return (

    <div className="min-h-screen bg-background">

      <Header />

      <main className="container mx-auto px-4 py-6">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}
        <div className="mb-8">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>

              <h1 className="text-4xl font-bold text-foreground mb-2">

                Events Hub

              </h1>

              <p className="text-muted-foreground">

                Explore workshops, mentorship sessions, webinars, networking events, and alumni meetups.

              </p>

            </div>


            <Badge className="bg-gradient-primary text-white px-4 py-2 text-sm">

              {filteredEvents.length}
              {" "}
              Upcoming Events

            </Badge>

          </div>

        </div>


        {/* ================================= */}
        {/* SEARCH */}
        {/* ================================= */}
        <div className="mb-8">

          <div className="relative max-w-xl">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

            <Input

              type="text"

              placeholder="Search events by title, location, or type..."

              className="pl-10 h-12 rounded-xl"

              value={searchQuery}

              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }

            />

          </div>

        </div>


        {/* ================================= */}
        {/* LOADING */}
        {/* ================================= */}
        {loading ? (

          <div className="flex items-center justify-center py-20">

            <Loader2 className="h-10 w-10 animate-spin text-primary" />

          </div>

        ) : filteredEvents.length === 0 ? (

          // ================================
          // EMPTY
          // ================================
          <Card className="shadow-soft">

            <CardContent className="py-20 text-center">

              <h2 className="text-2xl font-bold mb-2">

                No Events Found

              </h2>

              <p className="text-muted-foreground">

                There are currently no upcoming events available.

              </p>

            </CardContent>

          </Card>

        ) : (

          // ================================
          // EVENTS GRID
          // ================================
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {filteredEvents.map(
              (event) => (

                <Card

                  key={event._id}

                  className="shadow-soft hover:shadow-xl transition-all duration-300 border-0"

                >

                  {/* HEADER */}
                  <CardHeader>

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <CardTitle className="text-2xl">

                          {event.title}

                        </CardTitle>


                        <p className="text-muted-foreground mt-2">

                          Organized by
                          {" "}
                          {event.organizerName || "AlumniConnect"}

                        </p>

                      </div>


                      <Badge>

                        {event.type || "Event"}

                      </Badge>

                    </div>

                  </CardHeader>


                  {/* CONTENT */}
                  <CardContent className="space-y-5">

                    {/* DESCRIPTION */}
                    <p className="text-sm leading-7 text-muted-foreground">

                      {event.description}

                    </p>


                    {/* META */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      {/* DATE */}
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">

                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">

                          <Calendar className="h-5 w-5 text-primary" />

                        </div>


                        <div>

                          <p className="text-xs text-muted-foreground">

                            Event Date

                          </p>

                          <p className="font-medium">

                            {new Date(
                              event.date
                            ).toLocaleDateString()}

                          </p>

                        </div>

                      </div>


                      {/* TIME */}
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">

                        <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">

                          <Clock className="h-5 w-5 text-accent" />

                        </div>


                        <div>

                          <p className="text-xs text-muted-foreground">

                            Time

                          </p>

                          <p className="font-medium">

                            {event.time || "Not specified"}

                          </p>

                        </div>

                      </div>


                      {/* LOCATION */}
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">

                        <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">

                          <MapPin className="h-5 w-5 text-success" />

                        </div>


                        <div>

                          <p className="text-xs text-muted-foreground">

                            Location

                          </p>

                          <p className="font-medium">

                            {event.location || "Online"}

                          </p>

                        </div>

                      </div>


                      {/* MODE */}
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">

                        <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center">

                          <Video className="h-5 w-5 text-warning" />

                        </div>


                        <div>

                          <p className="text-xs text-muted-foreground">

                            Mode

                          </p>

                          <p className="font-medium">

                            {event.mode || "Online"}

                          </p>

                        </div>

                      </div>

                    </div>


                    {/* ATTENDEES */}
                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-2 text-muted-foreground">

                        <Users className="h-4 w-4" />

                        <span className="text-sm">

                          {event.attendees || 0}
                          {" "}
                          Registered

                        </span>

                      </div>


                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700"
                      >

                        <CheckCircle2 className="h-3 w-3 mr-1" />

                        Open Registration

                      </Badge>

                    </div>


                    {/* BUTTON */}
                    <Button

                      className="w-full h-11 rounded-xl"

                      onClick={() =>
                        registerEvent(
                          event._id
                        )
                      }

                      disabled={
                        registeringId ===
                        event._id
                      }

                    >

                      {registeringId ===
                      event._id ? (

                        <>

                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />

                          Registering...

                        </>

                      ) : (

                        "Register Now"

                      )}

                    </Button>

                  </CardContent>

                </Card>

              )
            )}

          </div>

        )}

      </main>

    </div>

  );

};


export default EventsPage;