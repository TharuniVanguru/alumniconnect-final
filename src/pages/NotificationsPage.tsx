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


interface Notification {

  _id: string;

  sender: string;

  title: string;

  message: string;

  type: string;

  isRead: boolean;

  createdAt: string;

}


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


    const userInfo =
      JSON.parse(
        localStorage.getItem(
          "userInfo"
        ) || "{}"
      );


    // =========================
    // FETCH NOTIFICATIONS
    // =========================
    const fetchNotifications =
      async () => {

        try {

          setLoading(true);

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


    // =========================
    // MARK AS READ
    // =========================
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
              prevNotifications
            ) =>
              prevNotifications.map(
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


    // =========================
    // HANDLE NOTIFICATION
    // =========================
    const handleNotification =
      async (
        notification: Notification
      ) => {

        // MARK AS READ
        await markAsRead(
          notification._id
        );

        // MESSAGE
        if (
          notification.type ===
          "message"
        ) {

          navigate(
            `/student/chat/${notification.sender}`
          );

        }

      };


    // =========================
    // INITIAL LOAD
    // =========================
    useEffect(() => {

      fetchNotifications();

    }, []);


    return (

      <div className="min-h-screen bg-background">

        <Header />

        <div className="p-6 max-w-5xl mx-auto">

          {/* TITLE */}
          <div className="mb-6">

            <h1 className="text-3xl font-bold">

              Notifications

            </h1>

            <p className="text-muted-foreground">

              Stay updated with guidance requests,
              mentorship updates, chats & more

            </p>

          </div>


          {/* ERROR */}
          {error && (

            <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-5">

              {error}

            </div>

          )}


          {/* LOADING */}
          {loading ? (

            <p className="text-muted-foreground">

              Loading notifications...

            </p>

          ) : notifications.length === 0 ? (

            <div className="text-center mt-20">

              <h2 className="text-2xl font-bold mb-2">

                No Notifications

              </h2>

              <p className="text-muted-foreground">

                Your notifications will appear here

              </p>

            </div>

          ) : (

            <div className="space-y-5">

              {notifications.map(
                (
                  notification
                ) => (

                  <Card
                    key={
                      notification._id
                    }
                    className={`shadow-lg rounded-2xl border-l-4 ${
                      notification.isRead

                        ? "border-gray-300 opacity-80"

                        : "border-primary"
                    }`}
                  >

                    <CardContent className="p-6">

                      {/* HEADER */}
                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <h2 className="text-xl font-bold mb-2">

                            {
                              notification.title
                            }

                          </h2>

                          <p className="text-muted-foreground">

                            {
                              notification.message
                            }

                          </p>

                        </div>


                        {!notification.isRead && (

                          <div className="h-3 w-3 rounded-full bg-primary mt-2" />

                        )}

                      </div>


                      {/* FOOTER */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-5">

                        <div>

                          <p className="text-sm text-muted-foreground">

                            Type:
                            {" "}

                            <span className="font-medium capitalize">

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


                        {!notification.isRead && (

                          <Button
                            onClick={() =>
                              handleNotification(
                                notification
                              )
                            }
                          >

                            Open

                          </Button>

                        )}

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