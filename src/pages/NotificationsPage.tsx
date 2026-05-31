import {
  useEffect,
  useState,
} from "react";

import api, { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/utils/api";
import {
  useNavigate,
} from "react-router-dom";

import {
  motion,
} from "framer-motion";

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

  Bell,
  MessageCircle,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock3,
  Sparkles,
  Loader2,
  ArrowRight,
  Brain,
  ShieldCheck,

} from "lucide-react";


// =====================================
// TYPES
// =====================================
interface Notification {

  _id: string;

  sender: string;

  title: string;

  message: string;

  type: string;

  isRead: boolean;

  createdAt: string;

}


// =====================================
// COMPONENT
// =====================================
const NotificationsPage =
  () => {

    // =====================================
    // HOOKS
    // =====================================
    const navigate =
      useNavigate();


    // =====================================
    // STATES
    // =====================================
    const [
      notifications,
      setNotifications,
    ] = useState<
      Notification[]
    >([]);


    const [
      loading,
      setLoading,
    ] = useState(false);


    const [
      error,
      setError,
    ] = useState("");


    // =====================================
    // USER INFO
    // =====================================
    const userInfo =
      JSON.parse(
        localStorage.getItem(
          "userInfo"
        ) || "{}"
      );


    // =====================================
    // FETCH NOTIFICATIONS
    // =====================================
    const fetchNotifications =
      async () => {

        try {

          setLoading(true);

          setError("");


          const response =
            await api.get(

              "/notifications",

              {

                headers: {

                  Authorization:
                    `Bearer ${userInfo.token}`,

                },

              }

            );


          setNotifications(
            response.data || []
          );

        }

        catch (error) {

          console.log(error);

          setError(
            "Failed to load notifications"
          );

        }

        finally {

          setLoading(false);

        }

      };


    // =====================================
    // MARK AS READ
    // =====================================
    const markAsRead =
      async (
        notificationId: string
      ) => {

        try {

          await api.put(

            `/notifications/${notificationId}/read`,

            {},

            {

              headers: {

                Authorization:
                  `Bearer ${userInfo.token}`,

              },

            }

          );


          setNotifications(

            (
              prev
            ) =>

              prev.map(
                (
                  notification
                ) =>

                  notification._id ===
                  notificationId

                    ? {

                        ...notification,

                        isRead: true,

                      }

                    : notification
              )

          );

        }

        catch (error) {

          console.log(error);

        }

      };


    // =====================================
    // HANDLE NOTIFICATION
    // =====================================
    const handleNotification =
      async (
        notification: Notification
      ) => {

        await markAsRead(
          notification._id
        );


        // =================================
        // MESSAGE
        // =================================
        if (
          notification.type ===
          "message"
        ) {

          navigate(
            `/student/chat/${notification.sender}`
          );

        }


        // =================================
        // JOBS
        // =================================
        else if (
          notification.type ===
          "job"
        ) {

          navigate(
            "/student/jobs"
          );

        }


        // =================================
        // EVENTS
        // =================================
        else if (
          notification.type ===
          "event"
        ) {

          navigate(
            "/student/events"
          );

        }

      };


    // =====================================
    // ICONS
    // =====================================
    const renderIcon =
      (type: string) => {

        switch (type) {

          case "message":

            return (

              <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center">

                <MessageCircle className="h-7 w-7 text-blue-600" />

              </div>

            );

          case "job":

            return (

              <div className="h-14 w-14 rounded-2xl bg-green-100 flex items-center justify-center">

                <Briefcase className="h-7 w-7 text-green-600" />

              </div>

            );

          case "event":

            return (

              <div className="h-14 w-14 rounded-2xl bg-orange-100 flex items-center justify-center">

                <Calendar className="h-7 w-7 text-orange-600" />

              </div>

            );

          default:

            return (

              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">

                <Bell className="h-7 w-7 text-primary" />

              </div>

            );

        }

      };


    // =====================================
    // INITIAL LOAD
    // =====================================
    useEffect(() => {

      fetchNotifications();

    }, []);


    // =====================================
    // UNREAD COUNT
    // =====================================
    const unreadCount =
      notifications.filter(
        (n) => !n.isRead
      ).length;


    // =====================================
    // UI
    // =====================================
    return (

      <div className="min-h-screen bg-background overflow-hidden">

        <Header />


        {/* BACKGROUND */}
        <div className="absolute top-0 left-0 h-72 w-72 bg-primary/10 rounded-full blur-3xl" />

        <div className="absolute bottom-0 right-0 h-96 w-96 bg-purple-500/10 rounded-full blur-3xl" />


        <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">


          {/* ================================= */}
          {/* HERO SECTION */}
          {/* ================================= */}

          <motion.div

            initial={{
              opacity: 0,
              y: 30,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              duration: 0.5,
            }}

            className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-primary via-purple-600 to-indigo-600 text-white shadow-2xl mb-10"

          >

            <div className="absolute inset-0 bg-black/10" />


            <div className="relative p-8 md:p-10">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">


                {/* LEFT */}
                <div>

                  <div className="flex items-center gap-3 mb-5">

                    <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">

                      <Bell className="h-8 w-8 text-white" />

                    </div>


                    <Badge className="bg-white/20 text-white border-0 px-4 py-2">

                      Notifications Center

                    </Badge>

                  </div>


                  <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">

                    Stay Updated 🔔

                  </h1>


                  <p className="text-white/90 text-lg max-w-2xl leading-8">

                    Receive instant updates for mentorships,
                    chats, job opportunities, events,
                    AI guidance, and platform activities.

                  </p>

                </div>


                {/* RIGHT */}
                <div className="flex justify-center">

                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-center min-w-[220px]">

                    <div className="flex justify-center mb-4">

                      <Brain className="h-12 w-12 text-yellow-300" />

                    </div>


                    <h2 className="text-5xl font-bold">

                      {unreadCount}

                    </h2>


                    <p className="text-white/90 mt-2">

                      Unread Notifications

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </motion.div>


          {/* ================================= */}
          {/* ERROR */}
          {/* ================================= */}

          {error && (

            <div className="bg-red-100 border border-red-300 text-red-600 p-5 rounded-2xl mb-6">

              {error}

            </div>

          )}


          {/* ================================= */}
          {/* LOADING */}
          {/* ================================= */}

          {loading ? (

            <div className="text-center py-24">

              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-5" />

              <h2 className="text-3xl font-bold mb-3">

                Loading Notifications...

              </h2>

              <p className="text-muted-foreground text-lg">

                Please wait while we fetch updates

              </p>

            </div>

          ) : notifications.length === 0 ? (

            <motion.div

              initial={{
                opacity: 0,
                scale: 0.9,
              }}

              animate={{
                opacity: 1,
                scale: 1,
              }}

              className="text-center py-28"

            >

              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">

                <Sparkles className="h-12 w-12 text-primary" />

              </div>


              <h2 className="text-4xl font-bold mb-4">

                No Notifications Yet

              </h2>


              <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-8">

                Notifications related to jobs,
                mentorships, AI support, chats,
                and alumni activities will appear here.

              </p>

            </motion.div>

          ) : (

            <div className="space-y-6">


              {notifications.map(
                (
                  notification,
                  index
                ) => (

                  <motion.div

                    key={
                      notification._id
                    }

                    initial={{
                      opacity: 0,
                      y: 20,
                    }}

                    animate={{
                      opacity: 1,
                      y: 0,
                    }}

                    transition={{
                      delay:
                        index * 0.05,
                    }}

                  >

                    <Card
                      className={`border-0 rounded-[28px] shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                        notification.isRead

                          ? "bg-background"

                          : "ring-2 ring-primary/20 bg-primary/5"
                      }`}
                    >

                      <CardContent className="p-7">


                        {/* TOP */}
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">


                          {/* LEFT */}
                          <div className="flex gap-5 flex-1">

                            {renderIcon(
                              notification.type
                            )}


                            <div className="flex-1">

                              <div className="flex flex-wrap items-center gap-3 mb-3">

                                <h2 className="text-2xl font-bold">

                                  {
                                    notification.title
                                  }

                                </h2>


                                {!notification.isRead && (

                                  <Badge className="bg-primary px-3 py-1">

                                    New

                                  </Badge>

                                )}

                              </div>


                              <p className="text-muted-foreground text-lg leading-8">

                                {
                                  notification.message
                                }

                              </p>

                            </div>

                          </div>


                          {/* STATUS */}
                          <div>

                            {notification.isRead ? (

                              <Badge
                                variant="secondary"
                                className="gap-2 px-4 py-2 text-sm"
                              >

                                <CheckCircle2 className="h-4 w-4" />

                                Read

                              </Badge>

                            ) : (

                              <Badge className="bg-yellow-500 gap-2 px-4 py-2 text-sm">

                                <Clock3 className="h-4 w-4" />

                                Unread

                              </Badge>

                            )}

                          </div>

                        </div>


                        {/* FOOTER */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mt-8 pt-6 border-t">


                          {/* INFO */}
                          <div>

                            <p className="text-sm text-muted-foreground">

                              Type:
                              {" "}

                              <span className="font-semibold capitalize text-foreground">

                                {
                                  notification.type
                                }

                              </span>

                            </p>


                            <p className="text-xs text-muted-foreground mt-2">

                              {new Date(
                                notification.createdAt
                              ).toLocaleString()}

                            </p>

                          </div>


                          {/* ACTION */}
                          <div className="flex items-center gap-3">

                            {notification.isRead && (

                              <div className="flex items-center gap-2 text-green-600 text-sm font-medium">

                                <ShieldCheck className="h-4 w-4" />

                                Viewed

                              </div>

                            )}


                            <Button
                              className="rounded-2xl h-12 px-6"
                              variant={
                                notification.isRead

                                  ? "outline"

                                  : "default"
                              }
                              onClick={() =>
                                handleNotification(
                                  notification
                                )
                              }
                            >

                              {notification.isRead

                                ? "View Again"

                                : "Open Notification"}

                              <ArrowRight className="ml-2 h-4 w-4" />

                            </Button>

                          </div>

                        </div>

                      </CardContent>

                    </Card>

                  </motion.div>

                )
              )}

            </div>

          )}

        </main>

      </div>

    );

  };


// =====================================
// EXPORT
// =====================================
export default NotificationsPage;