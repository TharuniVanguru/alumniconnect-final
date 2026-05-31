import {
  useEffect,
  useMemo,
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
} from "@/components/ui/card";

import { Button }
  from "@/components/ui/button";

import { Badge }
  from "@/components/ui/badge";

import { Input }
  from "@/components/ui/input";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

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
  Sparkles,
  TrendingUp,
  Bookmark,
  Share2,
  Flame,
  ArrowRight,

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

  maxAttendees?: number;

  banner?: string;

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


  const [

    savedEvents,
    setSavedEvents,

  ] = useState<string[]>([]);


  const [

    activeTab,
    setActiveTab,

  ] = useState("upcoming");


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
          await api.get(

            "/events",

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

        await api.post(

          `/events/${eventId}/register`,

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
            "Successfully Registered 🎉",

          description:
            "You are now registered for this event.",

        });


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
  // SAVE EVENT
  // ========================================
  const toggleSaveEvent =
    (
      eventId: string
    ) => {

      setSavedEvents((prev) => {

        if (
          prev.includes(eventId)
        ) {

          return prev.filter(
            (id) =>
              id !== eventId
          );

        }

        return [
          ...prev,
          eventId,
        ];

      });

    };


  // ========================================
  // SHARE EVENT
  // ========================================
  const shareEvent =
    async (
      event: EventItem
    ) => {

      try {

        await navigator.share({

          title:
            event.title,

          text:
            event.description,

          url:
            window.location.href,

        });

      }

      catch {

        toast({

          title:
            "Share not supported",

        });

      }

    };


  // ========================================
  // COUNTDOWN
  // ========================================
  const getRemainingDays =
    (
      date: string
    ) => {

      const diff =

        new Date(date)
          .getTime() -

        new Date()
          .getTime();

      const days =
        Math.ceil(

          diff /

          (
            1000 *
            60 *
            60 *
            24
          )

        );

      if (days <= 0)
        return "Today";

      return `${days} Days Left`;

    };


  // ========================================
  // FILTER EVENTS
  // ========================================
  const filteredEvents =
    useMemo(() => {

      let updated =
        [...events];


      // SEARCH
      updated =
        updated.filter(
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


      // TABS
      if (
        activeTab ===
        "upcoming"
      ) {

        updated =
          updated.filter(
            (event) =>

              new Date(
                event.date
              ) >= new Date()
          );

      }


      if (
        activeTab ===
        "past"
      ) {

        updated =
          updated.filter(
            (event) =>

              new Date(
                event.date
              ) < new Date()
          );

      }

      return updated;

    }, [

      events,
      searchQuery,
      activeTab,

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
        {/* HERO */}
        {/* ================================= */}
        <div className="mb-10">

          <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-primary via-violet-600 to-indigo-600 text-white shadow-2xl">

            <div className="p-8 md:p-10">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                <div>

                  <div className="flex items-center gap-3 mb-4">

                    <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center">

                      <Calendar className="h-8 w-8" />

                    </div>

                    <div>

                      <h1 className="text-4xl font-bold">

                        Events Hub

                      </h1>

                      <p className="text-white/90 mt-2">

                        Discover workshops, webinars, hackathons, networking sessions, and alumni meetups.

                      </p>

                    </div>

                  </div>


                  <div className="flex flex-wrap gap-3 mt-6">

                    <Badge className="bg-white/20 text-white border-0 px-4 py-2">

                      <Sparkles className="h-4 w-4 mr-2" />

                      Smart Networking

                    </Badge>

                    <Badge className="bg-white/20 text-white border-0 px-4 py-2">

                      <TrendingUp className="h-4 w-4 mr-2" />

                      Career Growth

                    </Badge>

                    <Badge className="bg-white/20 text-white border-0 px-4 py-2">

                      <Flame className="h-4 w-4 mr-2" />

                      Live Events

                    </Badge>

                  </div>

                </div>


                {/* STATS */}
                <div className="grid grid-cols-2 gap-4">

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 text-center">

                    <h2 className="text-3xl font-bold">

                      {events.length}

                    </h2>

                    <p className="text-white/80 text-sm">

                      Total Events

                    </p>

                  </div>


                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 text-center">

                    <h2 className="text-3xl font-bold">

                      {savedEvents.length}

                    </h2>

                    <p className="text-white/80 text-sm">

                      Saved Events

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ================================= */}
        {/* SEARCH */}
        {/* ================================= */}
        <div className="mb-8">

          <div className="relative max-w-2xl">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

            <Input

              type="text"

              placeholder="Search events by title, location, or category..."

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
        {/* TABS */}
        {/* ================================= */}
        <Tabs
          defaultValue="upcoming"
          onValueChange={
            setActiveTab
          }
        >

          <TabsList className="mb-8">

            <TabsTrigger value="upcoming">

              Upcoming

            </TabsTrigger>

            <TabsTrigger value="past">

              Past Events

            </TabsTrigger>

          </TabsList>


          <TabsContent value={activeTab}>


            {/* ============================= */}
            {/* LOADING */}
            {/* ============================= */}
            {loading ? (

              <div className="flex items-center justify-center py-20">

                <Loader2 className="h-10 w-10 animate-spin text-primary" />

              </div>

            ) : filteredEvents.length === 0 ? (

              <Card className="shadow-soft">

                <CardContent className="py-20 text-center">

                  <h2 className="text-2xl font-bold mb-2">

                    No Events Found

                  </h2>

                  <p className="text-muted-foreground">

                    Try changing your search or filters.

                  </p>

                </CardContent>

              </Card>

            ) : (

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {filteredEvents.map(
                  (event) => (

                    <Card

                      key={event._id}

                      className="shadow-soft hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden"

                    >

                      {/* BANNER */}
                      <div className="h-52 bg-gradient-to-r from-primary to-violet-600 flex items-center justify-center">

                        <Calendar className="h-16 w-16 text-white" />

                      </div>


                      {/* HEADER */}
                      <CardHeader>

                        <div className="flex items-start justify-between gap-3">

                          <div>

                            <CardTitle className="text-2xl">

                              {event.title}

                            </CardTitle>


                            <p className="text-muted-foreground mt-2">

                              Organized by{" "}

                              {event.organizerName ||
                                "AlumniConnect"}

                            </p>

                          </div>


                          <div className="flex gap-2">

                            <Badge>

                              {event.type ||
                                "Event"}

                            </Badge>


                            <button

                              onClick={() =>
                                toggleSaveEvent(
                                  event._id
                                )
                              }

                              className={`h-10 w-10 rounded-xl flex items-center justify-center transition ${
                                savedEvents.includes(
                                  event._id
                                )

                                  ? "bg-primary text-white"

                                  : "bg-muted"
                              }`}

                            >

                              <Bookmark className="h-4 w-4" />

                            </button>

                          </div>

                        </div>

                      </CardHeader>


                      {/* CONTENT */}
                      <CardContent className="space-y-5">


                        {/* DESCRIPTION */}
                        <p className="text-sm leading-7 text-muted-foreground">

                          {event.description}

                        </p>


                        {/* COUNTDOWN */}
                        <Badge className="bg-orange-100 text-orange-700">

                          {getRemainingDays(
                            event.date
                          )}

                        </Badge>


                        {/* META */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                          {/* DATE */}
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">

                            <Calendar className="h-5 w-5 text-primary" />

                            <div>

                              <p className="text-xs text-muted-foreground">

                                Date

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

                            <Clock className="h-5 w-5 text-accent" />

                            <div>

                              <p className="text-xs text-muted-foreground">

                                Time

                              </p>

                              <p className="font-medium">

                                {event.time ||
                                  "Not specified"}

                              </p>

                            </div>

                          </div>


                          {/* LOCATION */}
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">

                            <MapPin className="h-5 w-5 text-green-600" />

                            <div>

                              <p className="text-xs text-muted-foreground">

                                Location

                              </p>

                              <p className="font-medium">

                                {event.location ||
                                  "Online"}

                              </p>

                            </div>

                          </div>


                          {/* MODE */}
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">

                            <Video className="h-5 w-5 text-yellow-600" />

                            <div>

                              <p className="text-xs text-muted-foreground">

                                Mode

                              </p>

                              <p className="font-medium">

                                {event.mode ||
                                  "Online"}

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


                        {/* ACTIONS */}
                        <div className="flex gap-3">

                          <Button

                            className="flex-1 h-11 rounded-xl"

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

                              <>

                                Register Now

                                <ArrowRight className="h-4 w-4 ml-2" />

                              </>

                            )}

                          </Button>


                          <Button

                            variant="outline"

                            className="h-11 rounded-xl"

                            onClick={() =>
                              shareEvent(
                                event
                              )
                            }

                          >

                            <Share2 className="h-4 w-4" />

                          </Button>

                        </div>

                      </CardContent>

                    </Card>

                  )
                )}

              </div>

            )}

          </TabsContent>

        </Tabs>

      </main>

    </div>

  );

};


export default EventsPage;