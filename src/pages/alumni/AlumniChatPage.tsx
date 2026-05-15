import {
  useEffect,
  useState,
  useRef,
} from "react";

import axios from "axios";

import {
  useParams,
} from "react-router-dom";

import { socket }
  from "@/socket";

import { Button }
  from "@/components/ui/button";

import { Input }
  from "@/components/ui/input";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Header }
  from "@/components/layout/Header";


interface Message {

  _id?: string;

  senderName: string;

  receiverName: string;

  message: string;

  createdAt: string;

  status?: "sent" |
    "delivered" |
    "seen";

}


interface ChatUser {

  _id: string;

  name: string;

  email: string;

  role: string;

  isOnline: boolean;

}


const AlumniChatPage = () => {

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [newMessage, setNewMessage] =
    useState("");

  const [onlineUsers, setOnlineUsers] =
    useState<string[]>([]);

  const [isTyping, setIsTyping] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [chatUser, setChatUser] =
    useState<ChatUser | null>(
      null
    );


  // URL PARAM
  const { userId } =
    useParams();


  // AUTO SCROLL REF
  const bottomRef =
    useRef<HTMLDivElement | null>(
      null
    );

  // INPUT REF
  const inputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  // TYPING TIMER REF
  const typingTimeoutRef =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(null);


  // USER INFO
  const userInfo =
    JSON.parse(
      localStorage.getItem(
        "userInfo"
      ) || "{}"
    );


  // FETCH CHAT USER
  const fetchChatUser =
    async () => {

      try {

        const response =
          await axios.get(
            `http://localhost:5000/profile/${userId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${userInfo.token}`,
              },
            }
          );

        setChatUser(
          response.data
        );

      }

      catch (error) {

        console.log(error);

      }

    };


  // FETCH MESSAGES
  const fetchMessages =
    async () => {

      try {

        setLoading(true);

        const response =
          await axios.get(
            `http://localhost:5000/messages/${userId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${userInfo.token}`,
              },
            }
          );

        setMessages(
          response.data
        );


        // MESSAGE SEEN
        socket.emit(
          "messageSeen",
          {
            senderId:
              userId,
          }
        );

      }

      catch (error) {

        console.log(error);

        setError(
          "Failed to load messages"
        );

      }

      finally {

        setLoading(false);

      }

    };


  // AUTO SCROLL
  useEffect(() => {

    bottomRef.current
      ?.scrollIntoView({
        behavior:
          "smooth",
      });

  }, [messages]);


  // AUTO FOCUS
  useEffect(() => {

    inputRef.current?.focus();

  }, []);


  // SOCKET CONNECTION
  useEffect(() => {

    if (!userId) return;

    // JOIN ROOM
    socket.emit(
      "joinRoom",
      userInfo._id
    );


    // RECEIVE MESSAGE
    socket.on(
      "receiveMessage",
      (message) => {

        setMessages((prev) => [

          ...prev,

          message,

        ]);


        // MESSAGE DELIVERED
        socket.emit(
          "messageDelivered",
          {
            senderId:
              userId,
          }
        );

      }
    );


    // ONLINE USERS
    socket.on(
      "onlineUsers",
      (users) => {

        setOnlineUsers(users);

      }
    );


    // USER TYPING
    socket.on(
      "userTyping",
      () => {

        setIsTyping(true);

      }
    );


    // USER STOP TYPING
    socket.on(
      "userStopTyping",
      () => {

        setIsTyping(false);

      }
    );


    // MESSAGE DELIVERED
    socket.on(
      "messageDelivered",
      () => {

        setMessages((prev) =>
          prev.map((msg) => ({

            ...msg,

            status:
              msg.senderName ===
              userInfo.name
                ? "delivered"
                : msg.status,

          }))
        );

      }
    );


    // MESSAGE SEEN
    socket.on(
      "messageSeen",
      () => {

        setMessages((prev) =>
          prev.map((msg) => ({

            ...msg,

            status:
              msg.senderName ===
              userInfo.name
                ? "seen"
                : msg.status,

          }))
        );

      }
    );


    // CLEANUP
    return () => {

      socket.off(
        "receiveMessage"
      );

      socket.off(
        "onlineUsers"
      );

      socket.off(
        "userTyping"
      );

      socket.off(
        "userStopTyping"
      );

      socket.off(
        "messageDelivered"
      );

      socket.off(
        "messageSeen"
      );

    };

  }, [userId]);


  // INITIAL LOAD
  useEffect(() => {

    if (!userId) return;

    fetchMessages();

    fetchChatUser();

  }, [userId]);


  // SEND MESSAGE
  const sendMessage =
    async () => {

      if (
        !newMessage.trim() ||
        !userId
      ) return;

      try {

        setSending(true);

        const messageData = {

          senderName:
            userInfo.name,

          receiverName:
            chatUser?.name || "",

          receiverId:
            userId,

          message:
            newMessage,

          createdAt:
            new Date().toISOString(),

          status:
            "sent" as const,

        };


        // SAVE TO DATABASE
        await axios.post(
          "http://localhost:5000/messages",

          {

            receiverId:
              userId,

            receiverName:
              chatUser?.name,

            message:
              newMessage,

          },

          {
            headers: {
              Authorization:
                `Bearer ${userInfo.token}`,
            },
          }
        );


        // SOCKET EMIT
        socket.emit(
          "sendMessage",
          messageData
        );


        // UPDATE UI
        setMessages((prev) => [

          ...prev,

          messageData,

        ]);


        // STOP TYPING
        socket.emit(
          "stopTyping",
          {
            receiverId:
              userId,
          }
        );


        setNewMessage("");

        setIsTyping(false);

      }

      catch (error) {

        console.log(error);

        setError(
          "Failed to send message"
        );

      }

      finally {

        setSending(false);

      }

    };


  // HANDLE TYPING
  const handleTyping =
    (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {

      setNewMessage(
        e.target.value
      );


      // TYPING EVENT
      socket.emit(
        "typing",
        {
          receiverId:
            userId,
        }
      );


      // CLEAR OLD TIMER
      if (
        typingTimeoutRef.current
      ) {

        clearTimeout(
          typingTimeoutRef.current
        );

      }


      // STOP TYPING
      typingTimeoutRef.current =
        setTimeout(() => {

          socket.emit(
            "stopTyping",
            {
              receiverId:
                userId,
            }
          );

        }, 1000);

    };


  return (

    <div className="min-h-screen bg-background">

      <Header />

      <div className="p-3 md:p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">

          <div>

            <h1 className="text-2xl md:text-3xl font-bold">

              {chatUser?.name || "Chat"}

            </h1>

            <p className="text-muted-foreground text-sm">

              Real-time Socket.IO Chat

            </p>

          </div>


          {/* ONLINE STATUS */}
          <div className="flex items-center gap-2">

            <div
              className={`h-3 w-3 rounded-full animate-pulse ${
                onlineUsers.includes(
                  userId || ""
                )
                  ? "bg-green-500"
                  : "bg-gray-400"
              }`}
            />

            <span className="text-sm font-medium">

              {onlineUsers.includes(
                userId || ""
              )
                ? "Online"
                : "Offline"}

            </span>

          </div>

        </div>


        {/* ERROR */}
        {error && (

          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-600 text-sm">

            {error}

          </div>

        )}


        {/* CHAT CARD */}
        <Card className="h-[80vh] flex flex-col shadow-xl rounded-2xl">

          <CardContent className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-muted/20">

            {loading ? (

              <div className="flex items-center justify-center h-full">

                <p className="text-muted-foreground">

                  Loading messages...

                </p>

              </div>

            ) : messages.length === 0 ? (

              <div className="flex items-center justify-center h-full">

                <div className="text-center">

                  <p className="text-xl font-semibold mb-2">

                    No messages yet 🚀

                  </p>

                  <p className="text-muted-foreground">

                    Start chatting now

                  </p>

                </div>

              </div>

            ) : (

              messages.map(
                (
                  msg,
                  index
                ) => (

                  <div
                    key={index}
                    className={`max-w-[85%] md:max-w-[70%] ${
                      msg.senderName ===
                      userInfo.name
                        ? "ml-auto"
                        : "mr-auto"
                    }`}
                  >

                    <div
                      className={`p-4 rounded-2xl shadow-sm ${
                        msg.senderName ===
                        userInfo.name
                          ? "bg-primary text-white rounded-br-sm"
                          : "bg-background border rounded-bl-sm"
                      }`}
                    >

                      {/* NAME */}
                      <p className="font-semibold text-sm mb-1">

                        {
                          msg.senderName
                        }

                      </p>


                      {/* MESSAGE */}
                      <p className="break-words">

                        {msg.message}

                      </p>


                      {/* FOOTER */}
                      <div className="flex items-center justify-between mt-2">

                        {/* TIME */}
                        <p className="text-xs opacity-70">

                          {new Date(
                            msg.createdAt
                          ).toLocaleTimeString(
                            [],
                            {
                              hour:
                                "2-digit",

                              minute:
                                "2-digit",
                            }
                          )}

                        </p>


                        {/* STATUS */}
                        {msg.senderName ===
                          userInfo.name && (

                          <p className="text-xs opacity-70">

                            {msg.status ===
                              "sent" &&
                              "✓ Sent"}

                            {msg.status ===
                              "delivered" &&
                              "✓✓ Delivered"}

                            {msg.status ===
                              "seen" &&
                              "✓✓ Seen"}

                          </p>

                        )}

                      </div>

                    </div>

                  </div>

                )
              )

            )}


            {/* TYPING */}
            {isTyping && (

              <p className="text-sm text-muted-foreground animate-pulse">

                Typing...

              </p>

            )}


            {/* AUTO SCROLL */}
            <div ref={bottomRef} />

          </CardContent>


          {/* INPUT */}
          <div className="flex gap-2 p-4 border-t">

            <Input
              ref={inputRef}

              placeholder="Type message..."

              value={newMessage}

              onChange={
                handleTyping
              }

              onKeyDown={(e) => {

                if (
                  e.key === "Enter"
                ) {

                  sendMessage();

                }

              }}

              className="h-12 rounded-xl"
            />

            <Button
              onClick={
                sendMessage
              }

              disabled={sending}

              className="h-12 px-6 rounded-xl"
            >

              {sending
                ? "Sending..."
                : "Send"}

            </Button>

          </div>

        </Card>

      </div>

    </div>

  );

};


export default AlumniChatPage;