import {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  useParams,
} from "react-router-dom";

import { motion } from "framer-motion";

import api from "@/utils/api";

import {
  getSocket,
} from "@/socket";

import {
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Header,
} from "@/components/layout/Header";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  Badge,
} from "@/components/ui/badge";

import {

  Check,
  CheckCheck,
  Send,
  Loader2,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Paperclip,
  Circle,

} from "lucide-react";


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

  profileImage?: string;

  isOnline?: boolean;

  bio?: string;

}


// ==========================================
// COMPONENT
// ==========================================
const ChatPage = () => {

  // ========================================
  // SOCKET
  // ========================================
  const socket =
    getSocket();


  // ========================================
  // PARAMS
  // ========================================
  const { userId } =
    useParams();


  // ========================================
  // USER INFO
  // ========================================
  const storedUser =
    localStorage.getItem(
      "userInfo"
    );

  const userInfo =
    storedUser
      ? JSON.parse(storedUser)
      : null;


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
    useRef<any>(null);


  // ========================================
  // AUTO SCROLL
  // ========================================
  useEffect(() => {

    bottomRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });

  }, [messages]);


  // ========================================
  // AUTO FOCUS
  // ========================================
  useEffect(() => {

    inputRef.current?.focus();

  }, []);


  // ========================================
  // FETCH CHAT USER
  // ========================================
  const fetchChatUser =
    async () => {

      try {

        const response =
          await api.get(
            `/profile/${userId}`
          );

        setChatUser(
          response.data
        );

      }

      catch (error) {

        console.log(
          "USER ERROR:",
          error
        );

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
            `/messages/${userId}`
          );

        setMessages(
          response.data || []
        );

      }

      catch (error) {

        console.log(
          "MESSAGE ERROR:",
          error
        );

        setError(
          "Failed to load messages"
        );

      }

      finally {

        setLoading(false);

      }

    };


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
  // SOCKET EVENTS
  // ========================================
  useEffect(() => {

    if (

      !socket ||

      !userId ||

      !userInfo?._id

    ) {

      return;

    }


    socket.emit(
      "joinRoom",
      userInfo._id
    );


    const handleReceiveMessage =
      (message: Message) => {

        const isCurrentChat =

          message.senderId ===
            userId ||

          message.receiverId ===
            userId;

        if (!isCurrentChat)
          return;


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
          "messageSeen",
          {
            senderId:
              message.senderId,

            messageId:
              message._id,
          }
        );

      };


    const handleOnlineUsers =
      (users: string[]) => {

        setOnlineUsers(users);

      };


    const handleTyping =
      (data: any) => {

        if (
          data.senderId ===
          userId
        ) {

          setIsTyping(true);

        }

      };


    const handleStopTyping =
      (data: any) => {

        if (
          data.senderId ===
          userId
        ) {

          setIsTyping(false);

        }

      };


    const handleDelivered =
      (data: any) => {

        setMessages((prev) =>

          prev.map((msg) => {

            if (
              msg._id ===
              data.messageId
            ) {

              return {

                ...msg,

                status:
                  "delivered",

              };

            }

            return msg;

          })

        );

      };


    const handleSeen =
      (data: any) => {

        setMessages((prev) =>

          prev.map((msg) => {

            if (
              msg._id ===
              data.messageId
            ) {

              return {

                ...msg,

                status:
                  "seen",

              };

            }

            return msg;

          })

        );

      };


    socket.on(
      "receiveMessage",
      handleReceiveMessage
    );

    socket.on(
      "onlineUsers",
      handleOnlineUsers
    );

    socket.on(
      "userTyping",
      handleTyping
    );

    socket.on(
      "userStopTyping",
      handleStopTyping
    );

    socket.on(
      "messageDelivered",
      handleDelivered
    );

    socket.on(
      "messageSeen",
      handleSeen
    );


    return () => {

      socket.off(
        "receiveMessage",
        handleReceiveMessage
      );

      socket.off(
        "onlineUsers",
        handleOnlineUsers
      );

      socket.off(
        "userTyping",
        handleTyping
      );

      socket.off(
        "userStopTyping",
        handleStopTyping
      );

      socket.off(
        "messageDelivered",
        handleDelivered
      );

      socket.off(
        "messageSeen",
        handleSeen
      );

    };

  }, [

    socket,
    userId,
    userInfo?._id,

  ]);


  // ========================================
  // SEND MESSAGE
  // ========================================
  const sendMessage =
    async () => {

      if (

        !newMessage.trim() ||

        !socket ||

        !userId

      ) {

        return;

      }

      try {

        setSending(true);

        const response =
          await api.post(
            "/messages",
            {

              receiverId:
                userId,

              receiverName:
                chatUser?.name,

              message:
                newMessage,

            }
          );

        const savedMessage =
          response.data;


        socket.emit(
          "sendMessage",
          savedMessage
        );


        setMessages((prev) => [

          ...prev,
          savedMessage,

        ]);


        socket.emit(
          "stopTyping",
          {
            receiverId:
              userId,
          }
        );


        setNewMessage("");

      }

      catch (error) {

        console.log(
          "SEND ERROR:",
          error
        );

      }

      finally {

        setSending(false);

      }

    };


  // ========================================
  // HANDLE INPUT
  // ========================================
  const handleTypingInput =
    (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {

      setNewMessage(
        e.target.value
      );

      if (!socket)
        return;


      socket.emit(
        "typing",
        {
          receiverId:
            userId,
        }
      );


      if (
        typingTimeoutRef.current
      ) {

        clearTimeout(
          typingTimeoutRef.current
        );

      }


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


  // ========================================
  // ONLINE STATUS
  // ========================================
  const isUserOnline =
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
  // LOADING
  // ========================================
  if (loading) {

    return (

      <div className="min-h-screen bg-background">

        <Header />

        <div className="h-[80vh] flex items-center justify-center">

          <div className="text-center">

            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />

            <h2 className="text-2xl font-bold">

              Loading Chat...

            </h2>

          </div>

        </div>

      </div>

    );

  }


  // ========================================
  // UI
  // ========================================
  return (

    <div className="min-h-screen bg-background">

      <Header />

      <div className="max-w-6xl mx-auto p-4">

        <Card className="h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border-0 bg-background/80 backdrop-blur-xl">


          {/* HEADER */}
          <div className="border-b bg-background/80 backdrop-blur-xl p-5 flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="relative">

                <Avatar className="h-14 w-14 ring-2 ring-primary/20">

                  <AvatarImage
                    src={
                      chatUser?.profileImage
                    }
                  />

                  <AvatarFallback className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 text-white">

                    {chatUser?.name?.charAt(0)}

                  </AvatarFallback>

                </Avatar>


                {isUserOnline && (

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

                    {isUserOnline
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
                className="rounded-xl"
              >

                <Phone className="h-5 w-5" />

              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="rounded-xl"
              >

                <Video className="h-5 w-5" />

              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="rounded-xl"
              >

                <MoreVertical className="h-5 w-5" />

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
          <CardContent className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-muted/20 to-background space-y-4">

            {messages.length === 0 && (

              <div className="h-full flex flex-col items-center justify-center text-center py-20">

                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">

                  <Send className="h-10 w-10 text-primary" />

                </div>

                <h2 className="text-3xl font-bold mb-3">

                  Start Conversation

                </h2>

                <p className="text-muted-foreground max-w-md leading-7">

                  Send your first message and start building meaningful alumni connections.

                </p>

              </div>

            )}


            {messages.map(
              (msg, index) => {

                const isMine =
                  msg.senderId ===
                  userInfo?._id;

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
                        scale: 0.98,
                      }}

                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}

                      transition={{
                        duration: 0.25,
                      }}

                      className={`max-w-[75%] rounded-3xl px-5 py-4 shadow-xl backdrop-blur-sm border transition-all duration-300 ${
                        isMine

                          ? "bg-gradient-to-r from-primary to-purple-600 text-white rounded-br-md border-primary/30"

                          : "bg-background rounded-bl-md border-border/50"
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
            )}


            {/* TYPING */}
            {isTyping && (

              <div className="flex justify-start">

                <div className="bg-background border px-5 py-3 rounded-2xl shadow-xl text-sm animate-pulse">

                  Typing...

                </div>

              </div>

            )}


            <div ref={bottomRef} />

          </CardContent>


          {/* INPUT */}
          <div className="border-t bg-background/80 backdrop-blur-xl p-4">

            <div className="flex items-center gap-3">

              <Button
                size="icon"
                variant="ghost"
                className="rounded-xl"
              >

                <Paperclip className="h-5 w-5" />

              </Button>


              <Input

                ref={inputRef}

                value={newMessage}

                onChange={
                  handleTypingInput
                }

                placeholder="Type your message..."

                className="rounded-2xl h-12 shadow-sm border-primary/20 focus-visible:ring-primary"

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
                className="rounded-xl"
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

                className="h-12 w-12 rounded-2xl bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
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
export default ChatPage;