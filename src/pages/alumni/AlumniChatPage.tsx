import {
  useEffect,
  useState,
  useRef,
} from "react";

import axios from "axios";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  socket,
  connectSocket,
} from "@/socket";

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

import {

  Loader2,
  Send,
  Phone,
  Video,
  ArrowLeft,

} from "lucide-react";

import { useToast }
  from "@/hooks/use-toast";


// ==========================================
// TYPES
// ==========================================
interface Message {

  _id?: string;

  senderName: string;

  receiverName: string;

  receiverId?: string;

  message: string;

  createdAt: string;

  status?:
    | "sent"
    | "delivered"
    | "seen";

}


interface ChatUser {

  _id: string;

  name: string;

  email: string;

  role: string;

  isOnline: boolean;

  profileImage?: string;

}


// ==========================================
// COMPONENT
// ==========================================
const AlumniChatPage = () => {

  // ========================================
  // STATES
  // ========================================
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


  // ========================================
  // HOOKS
  // ========================================
  const { userId } =
    useParams();

  const navigate =
    useNavigate();

  const { toast } =
    useToast();


  // ========================================
  // REFS
  // ========================================
  const bottomRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const inputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const typingTimeoutRef =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(null);


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
  // CONNECT SOCKET
  // ========================================
  useEffect(() => {

    if (userInfo?._id) {

      connectSocket(
        userInfo._id
      );

    }

  }, []);


  // ========================================
  // FETCH CHAT USER
  // ========================================
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


  // ========================================
  // FETCH MESSAGES
  // ========================================
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
          response.data || []
        );


        // MARK AS READ
        await axios.put(

          `http://localhost:5000/messages/read/${userId}`,

          {},

          {

            headers: {

              Authorization:
                `Bearer ${userInfo.token}`,

            },

          }

        );


        socket?.emit(
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


  // ========================================
  // AUTO SCROLL
  // ========================================
  useEffect(() => {

    bottomRef.current
      ?.scrollIntoView({

        behavior:
          "smooth",

      });

  }, [messages]);


  // ========================================
  // AUTO FOCUS
  // ========================================
  useEffect(() => {

    inputRef.current?.focus();

  }, []);


  // ========================================
  // SOCKET EVENTS
  // ========================================
  useEffect(() => {

    if (!socket || !userId)
      return;


    // JOIN ROOM
    socket.emit(

      "joinRoom",

      userInfo._id

    );


    // RECEIVE MESSAGE
    socket.on(

      "receiveMessage",

      (message: Message) => {

        setMessages((prev) => [

          ...prev,

          message,

        ]);


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

      (users: string[]) => {

        setOnlineUsers(
          users
        );

      }

    );


    // USER TYPING
    socket.on(

      "userTyping",

      () => {

        setIsTyping(true);

      }

    );


    // STOP TYPING
    socket.on(

      "userStopTyping",

      () => {

        setIsTyping(false);

      }

    );


    // DELIVERED
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


    // SEEN
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


  // ========================================
  // INITIAL LOAD
  // ========================================
  useEffect(() => {

    if (!userId)
      return;

    fetchMessages();

    fetchChatUser();

  }, [userId]);


  // ========================================
  // SEND MESSAGE
  // ========================================
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
            newMessage.trim(),

          createdAt:
            new Date().toISOString(),

          status:
            "sent" as const,

        };


        // SAVE MESSAGE
        await axios.post(

          "http://localhost:5000/messages",

          {

            receiverId:
              userId,

            receiverName:
              chatUser?.name,

            message:
              newMessage.trim(),

          },

          {

            headers: {

              Authorization:
                `Bearer ${userInfo.token}`,

            },

          }

        );


        // SOCKET EMIT
        socket?.emit(

          "sendMessage",

          messageData

        );


        // UI UPDATE
        setMessages((prev) => [

          ...prev,

          messageData,

        ]);


        // STOP TYPING
        socket?.emit(

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

        toast({

          title:
            "Failed to send message",

          variant:
            "destructive",

        });

      }

      finally {

        setSending(false);

      }

    };


  // ========================================
  // HANDLE TYPING
  // ========================================
  const handleTyping =
    (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {

      setNewMessage(
        e.target.value
      );


      socket?.emit(

        "typing",

        {

          receiverId:
            userId,

          senderId:
            userInfo._id,

        }

      );


      // CLEAR TIMER
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

          socket?.emit(

            "stopTyping",

            {

              receiverId:
                userId,

              senderId:
                userInfo._id,

            }

          );

        }, 1000);

    };


  // ========================================
  // ONLINE STATUS
  // ========================================
  const isOnline =
    onlineUsers.includes(
      userId || ""
    );


  // ========================================
  // UI
  // ========================================
  return (

    <div className="min-h-screen bg-background">

      <Header />

      <div className="p-3 md:p-6">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="flex items-center justify-between mb-6">

          <div className="flex items-center gap-4">

            <Button
              size="icon"
              variant="outline"
              onClick={() =>

                navigate(-1)

              }
            >

              <ArrowLeft className="h-4 w-4" />

            </Button>


            <div>

              <h1 className="text-2xl md:text-3xl font-bold">

                {chatUser?.name || "Chat"}

              </h1>


              <div className="flex items-center gap-2 mt-1">

                <div
                  className={`h-3 w-3 rounded-full animate-pulse ${
                    isOnline

                      ? "bg-green-500"

                      : "bg-gray-400"
                  }`}
                />


                <p className="text-sm text-muted-foreground">

                  {isOnline
                    ? "Online"
                    : "Offline"}

                </p>

              </div>

            </div>

          </div>


          {/* CALL BUTTONS */}
          <div className="flex items-center gap-2">

            <Button
              size="icon"
              variant="outline"
            >

              <Phone className="h-4 w-4" />

            </Button>


            <Button
              size="icon"
              variant="outline"
            >

              <Video className="h-4 w-4" />

            </Button>

          </div>

        </div>


        {/* ================================= */}
        {/* ERROR */}
        {/* ================================= */}

        {error && (

          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-600 text-sm">

            {error}

          </div>

        )}


        {/* ================================= */}
        {/* CHAT CARD */}
        {/* ================================= */}

        <Card className="h-[80vh] flex flex-col shadow-xl rounded-2xl">

          <CardContent className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-muted/20">

            {/* LOADING */}
            {loading ? (

              <div className="flex items-center justify-center h-full">

                <Loader2 className="h-6 w-6 animate-spin text-primary" />

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

                        {msg.senderName}

                      </p>


                      {/* MESSAGE */}
                      <p className="break-words">

                        {msg.message}

                      </p>


                      {/* FOOTER */}
                      <div className="flex items-center justify-between mt-2 gap-3">

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


          {/* ================================= */}
          {/* INPUT */}
          {/* ================================= */}

          <div className="flex gap-2 p-4 border-t bg-background">

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

              {sending ? (

                <Loader2 className="h-4 w-4 animate-spin" />

              ) : (

                <Send className="h-4 w-4" />

              )}

            </Button>

          </div>

        </Card>

      </div>

    </div>

  );

};


// ==========================================
// EXPORT
// ==========================================
export default AlumniChatPage;