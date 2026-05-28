import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

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

import {

  Bell,
  MessageCircle,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock3,
  Sparkles,
  Loader2,

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

    const navigate =
      useNavigate();

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


    // USER INFO
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
            await axios.get(

              "http://localhost:5000/notifications",

              {

                headers: {

                  Authorization:
                    `Bearer ${userInfo.token}`,

                },

              }

            );


          setNotifications(
            response.data
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

          await axios.put(

            `http://localhost:5000/notifications/${notificationId}/read`,

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


        // CHAT MESSAGE
        if (
          notification.type ===
          "message"
        ) {

          navigate(
            `/student/chat/${notification.sender}`
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

              <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center">

                <MessageCircle className="h-6 w-6 text-blue-600" />

              </div>

            );

          case "job":

            return (

              <div className="h-12 w-12 rounded-2xl bg-green-100 flex items-center justify-center">

                <Briefcase className="h-6 w-6 text-green-600" />

              </div>

            );

          case "event":

            return (

              <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center">

                <Calendar className="h-6 w-6 text-orange-600" />

              </div>

            );

          default:

            return (

              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">

                <Bell className="h-6 w-6 text-primary" />

              </div>

            );

        }

      };


    // =====================================
    // LOAD
    // =====================================
    useEffect(() => {

      fetchNotifications();

    }, []);


    return (

      <div className="min-h-screen bg-background">

        <Header />

        <div className="max-w-6xl mx-auto p-6">


          {/* HEADER */}
          <div className="mb-10">

            <div className="flex items-center gap-4">

              <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center shadow-xl">

                <Bell className="h-8 w-8 text-white" />

              </div>


              <div>

                <h1 className="text-4xl font-bold">

                  Notifications

                </h1>


                <p className="text-muted-foreground text-lg">

                  Stay updated with chats, mentorship requests,
                  jobs, events, and guidance updates.

                </p>

              </div>

            </div>

          </div>


          {/* ERROR */}
          {error && (

            <div className="bg-red-100 border border-red-300 text-red-600 p-4 rounded-2xl mb-6">

              {error}

            </div>

          )}


          {/* LOADING */}
          {loading ? (

            <div className="text-center py-20">

              <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />

              <h2 className="text-2xl font-bold mb-2">

                Loading Notifications...

              </h2>

              <p className="text-muted-foreground">

                Please wait while we fetch updates

              </p>

            </div>

          ) : notifications.length === 0 ? (

            <div className="text-center py-24">

              <Sparkles className="h-14 w-14 mx-auto text-primary mb-5" />

              <h2 className="text-3xl font-bold mb-3">

                No Notifications Yet

              </h2>

              <p className="text-muted-foreground text-lg">

                Notifications will appear here when you receive updates

              </p>

            </div>

          ) : (

            <div className="space-y-6">

              {notifications.map(
                (
                  notification
                ) => (

                  <Card
                    key={
                      notification._id
                    }
                    className={`border-0 rounded-3xl shadow-xl transition-all duration-300 hover:scale-[1.01] ${
                      notification.isRead

                        ? "opacity-80"

                        : "ring-2 ring-primary/20"
                    }`}
                  >

                    <CardContent className="p-6">


                      {/* TOP */}
                      <div className="flex items-start justify-between gap-4">


                        {/* LEFT */}
                        <div className="flex items-start gap-4 flex-1">

                          {renderIcon(
                            notification.type
                          )}


                          <div className="flex-1">

                            <div className="flex items-center gap-3 mb-2">

                              <h2 className="text-xl font-bold">

                                {
                                  notification.title
                                }

                              </h2>


                              {!notification.isRead && (

                                <Badge className="bg-primary">

                                  New

                                </Badge>

                              )}

                            </div>


                            <p className="text-muted-foreground leading-7">

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
                              className="gap-1"
                            >

                              <CheckCircle2 className="h-3 w-3" />

                              Read

                            </Badge>

                          ) : (

                            <Badge className="bg-yellow-500 gap-1">

                              <Clock3 className="h-3 w-3" />

                              Unread

                            </Badge>

                          )}

                        </div>

                      </div>


                      {/* FOOTER */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">


                        {/* INFO */}
                        <div>

                          <p className="text-sm text-muted-foreground">

                            Notification Type:
                            {" "}

                            <span className="font-semibold capitalize">

                              {
                                notification.type
                              }

                            </span>

                          </p>


                          <p className="text-xs text-muted-foreground mt-1">

                            {new Date(
                              notification.createdAt
                            ).toLocaleString()}

                          </p>

                        </div>


                        {/* BUTTON */}
                        <div>

                          {!notification.isRead ? (

                            <Button
                              className="rounded-xl"
                              onClick={() =>
                                handleNotification(
                                  notification
                                )
                              }
                            >

                              Open Notification

                            </Button>

                          ) : (

                            <Button
                              variant="outline"
                              className="rounded-xl"
                              onClick={() =>
                                handleNotification(
                                  notification
                                )
                              }
                            >

                              View Again

                            </Button>

                          )}

                        </div>

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


export default NotificationsPage;