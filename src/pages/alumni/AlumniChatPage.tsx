import {
  useEffect,
  useState,
  useRef,
} from "react";

import api, { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/utils/api";
import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  socket,
  connectSocket,
} from "@/socket";

import { motion }
  from "framer-motion";

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
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  Badge,
} from "@/components/ui/badge";

import {

  Loader2,
  Send,
  Phone,
  Video,
  ArrowLeft,
  Check,
  CheckCheck,
  Paperclip,
  Smile,
  Circle,

} from "lucide-react";

import {
  useToast,
} from "@/hooks/use-toast";


// ==========================================
// TYPES
// ==========================================
interface Message {

  _id?: string;

  senderId?: string;

  receiverId?: string;

  senderName: string;

  receiverName: string;

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
  const [

    messages,
    setMessages,

  ] = useState<Message[]>([]);


  const [

    newMessage,
    setNewMessage,

  ] = useState("");


  const [

    onlineUsers,
    setOnlineUsers,

  ] = useState<string[]>([]);


  const [

    isTyping,
    setIsTyping,

  ] = useState(false);


  const [

    sending,
    setSending,

  ] = useState(false);


  const [

    loading,
    setLoading,

  ] = useState(true);


  const [

    error,
    setError,

  ] = useState("");


  const [

    chatUser,
    setChatUser,

  ] = useState<ChatUser | null>(
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
          await api.get(

            `/profile/${userId}`,

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
          await api.get(

            `/messages/${userId}`,

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
        await api.put(

          `/messages/read/${userId}`,

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

        setMessages((prev) => {

          const exists =
            prev.some(
              (msg) =>
                msg._id ===
                message._id
            );

          if (exists)
            return prev;

          return [
            ...prev,
            message,
          ];

        });


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

          senderId:
            userInfo._id,

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
        const response =
          await api.post(

            "/messages",

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


        const savedMessage =
          response.data;


        // SOCKET EMIT
        socket?.emit(

          "sendMessage",

          savedMessage

        );


        // UI UPDATE
        setMessages((prev) => [

          ...prev,

          savedMessage,

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
  // STATUS ICON
  // ========================================
  const renderMessageStatus =
    (
      status?: string
    ) => {

      if (
        status === "seen"
      ) {

        return (
          <CheckCheck className="h-4 w-4 text-blue-400" />
        );

      }

      if (
        status === "delivered"
      ) {

        return (
          <CheckCheck className="h-4 w-4 text-gray-300" />
        );

      }

      return (
        <Check className="h-4 w-4 text-gray-300" />
      );

    };


  // ========================================
  // UI
  // ========================================
  return (

    <div className="min-h-screen bg-background">

      <Header />

      <div className="max-w-6xl mx-auto p-4">

        <Card className="h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border-0">


          {/* HEADER */}
          <div className="border-b bg-background p-5 flex items-center justify-between">

            <div className="flex items-center gap-4">

              <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                  navigate(-1)
                }
              >

                <ArrowLeft className="h-5 w-5" />

              </Button>


              <div className="relative">

                <Avatar className="h-14 w-14">

                  <AvatarImage
                    src={
                      chatUser?.profileImage
                    }
                  />

                  <AvatarFallback className="text-lg font-bold">

                    {chatUser?.name?.charAt(0)}

                  </AvatarFallback>

                </Avatar>


                {isOnline && (

                  <Circle className="absolute bottom-0 right-0 h-4 w-4 fill-green-500 text-green-500 border-2 border-white rounded-full" />

                )}

              </div>


              <div>

                <h2 className="text-xl font-bold">

                  {chatUser?.name}

                </h2>

                <div className="flex items-center gap-2">

                  <Badge variant="secondary">

                    {chatUser?.role}

                  </Badge>

                  <p className="text-sm text-muted-foreground">

                    {isOnline
                      ? "Online"
                      : "Offline"}

                  </p>

                </div>

              </div>

            </div>


            {/* ACTIONS */}
            <div className="flex items-center gap-2">

              <Button
                size="icon"
                variant="ghost"
              >

                <Phone className="h-5 w-5" />

              </Button>

              <Button
                size="icon"
                variant="ghost"
              >

                <Video className="h-5 w-5" />

              </Button>

            </div>

          </div>


          {/* ERROR */}
          {error && (

            <div className="bg-red-100 text-red-600 p-3 text-sm">

              {error}

            </div>

          )}


          {/* CHAT AREA */}
          <CardContent className="flex-1 overflow-y-auto p-6 bg-muted/20 space-y-4">

            {loading ? (

              <div className="h-full flex items-center justify-center">

                <Loader2 className="h-10 w-10 animate-spin text-primary" />

              </div>

            ) : messages.length === 0 ? (

              <div className="h-full flex items-center justify-center">

                <div className="text-center">

                  <h2 className="text-2xl font-bold mb-2">

                    No messages yet 🚀

                  </h2>

                  <p className="text-muted-foreground">

                    Start your conversation now

                  </p>

                </div>

              </div>

            ) : (

              messages.map(
                (msg, index) => {

                  const isMine =
                    msg.senderName ===
                    userInfo.name;

                  return (

                    <div
                      key={
                        msg._id ||
                        index
                      }
                      className={`flex ${
                        isMine
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >

                      <motion.div

                        initial={{
                          opacity: 0,
                          y: 10,
                        }}

                        animate={{
                          opacity: 1,
                          y: 0,
                        }}

                        className={`max-w-[75%] rounded-3xl px-5 py-4 shadow-md ${
                          isMine

                            ? "bg-primary text-white rounded-br-md"

                            : "bg-white rounded-bl-md"
                        }`}
                      >

                        <p className="break-words leading-7">

                          {msg.message}

                        </p>


                        <div className="flex items-center justify-end gap-2 mt-3 text-xs opacity-80">

                          <span>

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

                          </span>

                          {isMine &&
                            renderMessageStatus(
                              msg.status
                            )}

                        </div>

                      </motion.div>

                    </div>

                  );

                }
              )

            )}


            {/* TYPING */}
            {isTyping && (

              <div className="flex justify-start">

                <div className="bg-white px-5 py-3 rounded-2xl shadow text-sm animate-pulse">

                  Typing...

                </div>

              </div>

            )}


            <div ref={bottomRef} />

          </CardContent>


          {/* INPUT */}
          <div className="border-t bg-background p-4">

            <div className="flex items-center gap-3">

              <Button
                size="icon"
                variant="ghost"
              >

                <Paperclip className="h-5 w-5" />

              </Button>


              <Input

                ref={inputRef}

                value={newMessage}

                onChange={
                  handleTyping
                }

                placeholder="Type your message..."

                className="rounded-2xl h-12"

                onKeyDown={(e) => {

                  if (
                    e.key === "Enter"
                  ) {

                    sendMessage();

                  }

                }}
              />


              <Button
                size="icon"
                variant="ghost"
              >

                <Smile className="h-5 w-5" />

              </Button>


              <Button

                onClick={
                  sendMessage
                }

                disabled={
                  sending ||
                  !newMessage.trim()
                }

                className="h-12 w-12 rounded-2xl"
              >

                {sending ? (

                  <Loader2 className="h-5 w-5 animate-spin" />

                ) : (

                  <Send className="h-5 w-5" />

                )}

              </Button>

            </div>

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