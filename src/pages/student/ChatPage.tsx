import {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  useParams,
} from "react-router-dom";

import api from "@/utils/api";

import {
  socket,
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

  status?: "sent" |
    "delivered" |
    "seen";

}


interface ChatUser {

  _id: string;

  name: string;

  email: string;

  role: string;

  isOnline?: boolean;

}


// ==========================================
// COMPONENT
// ==========================================
const ChatPage = () => {

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
  // PARAMS
  // ========================================
  const { userId } =
    useParams();


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
  const storedUser =
    localStorage.getItem(
      "userInfo"
    );

  const userInfo =
    storedUser
      ? JSON.parse(storedUser)
      : null;


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
          "FETCH USER ERROR:",
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


        // MARK SEEN
        socket.emit(
          "messageSeen",
          {
            senderId: userId,
          }
        );

      }

      catch (error) {

        console.log(
          "FETCH MESSAGE ERROR:",
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
  // SOCKET CONNECTION
  // ========================================
  useEffect(() => {

    if (
      !userInfo?._id ||
      !userId
    ) {

      return;

    }


    // ======================================
    // JOIN ROOM
    // ======================================
    socket.emit(
      "joinRoom",
      userInfo._id
    );


    // ======================================
    // RECEIVE MESSAGE
    // ======================================
    const handleReceiveMessage =
      (message: Message) => {

        setMessages((prev) => [

          ...prev,
          message,

        ]);


        socket.emit(
          "messageDelivered",
          {
            senderId:
              message.senderId,
            messageId:
              message._id,
          }
        );

      };


    // ======================================
    // ONLINE USERS
    // ======================================
    const handleOnlineUsers =
      (users: string[]) => {

        setOnlineUsers(users);

      };


    // ======================================
    // USER TYPING
    // ======================================
    const handleTyping =
      () => {

        setIsTyping(true);

      };


    // ======================================
    // STOP TYPING
    // ======================================
    const handleStopTyping =
      () => {

        setIsTyping(false);

      };


    // ======================================
    // DELIVERED
    // ======================================
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


    // ======================================
    // SEEN
    // ======================================
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


    // ======================================
    // LISTENERS
    // ======================================
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


    // ======================================
    // CLEANUP
    // ======================================
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

  }, [userId]);


  // ========================================
  // SEND MESSAGE
  // ========================================
  const sendMessage =
    async () => {

      if (
        !newMessage.trim() ||
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


        // ====================================
        // SOCKET EMIT
        // ====================================
        socket.emit(
          "sendMessage",
          savedMessage
        );


        // ====================================
        // UPDATE UI
        // ====================================
        setMessages((prev) => [

          ...prev,
          savedMessage,

        ]);


        // ====================================
        // STOP TYPING
        // ====================================
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

        setError(
          "Failed to send message"
        );

      }

      finally {

        setSending(false);

      }

    };


  // ========================================
  // HANDLE TYPING
  // ========================================
  const handleInputTyping =
    (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {

      setNewMessage(
        e.target.value
      );


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
  // UI
  // ========================================
  return (

    <div className="min-h-screen bg-background">

      <Header />

      <div className="p-4 md:p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">

          <div>

            <h1 className="text-2xl font-bold">

              {chatUser?.name || "Chat"}

            </h1>

            <p className="text-sm text-muted-foreground">

              Real-time chat

            </p>

          </div>


          {/* ONLINE */}
          <div className="flex items-center gap-2">

            <div
              className={`h-3 w-3 rounded-full ${
                isUserOnline
                  ? "bg-green-500"
                  : "bg-gray-400"
              }`}
            />

            <span className="text-sm">

              {isUserOnline
                ? "Online"
                : "Offline"}

            </span>

          </div>

        </div>


        {/* ERROR */}
        {error && (

          <div className="mb-4 bg-red-100 text-red-600 p-3 rounded-lg">

            {error}

          </div>

        )}


        {/* CHAT CARD */}
        <Card className="h-[80vh] flex flex-col">

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">

            {loading ? (

              <div className="h-full flex items-center justify-center">

                Loading messages...

              </div>

            ) : (

              messages.map(
                (
                  msg,
                  index
                ) => (

                  <div
                    key={index}
                    className={`max-w-[75%] ${
                      msg.senderName ===
                      userInfo?.name
                        ? "ml-auto"
                        : "mr-auto"
                    }`}
                  >

                    <div
                      className={`p-4 rounded-2xl ${
                        msg.senderName ===
                        userInfo?.name
                          ? "bg-primary text-white"
                          : "bg-muted"
                      }`}
                    >

                      <p className="text-sm font-semibold mb-1">

                        {
                          msg.senderName
                        }

                      </p>

                      <p>

                        {msg.message}

                      </p>

                      <div className="flex justify-between mt-2 text-xs opacity-70">

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

                        {msg.senderName ===
                          userInfo?.name && (

                          <span>

                            {msg.status ===
                              "sent" &&
                              "✓"}

                            {msg.status ===
                              "delivered" &&
                              "✓✓"}

                            {msg.status ===
                              "seen" &&
                              "✓✓ Seen"}

                          </span>

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


            <div ref={bottomRef} />

          </CardContent>


          {/* INPUT */}
          <div className="border-t p-4 flex gap-2">

            <Input
              ref={inputRef}

              placeholder="Type message..."

              value={newMessage}

              onChange={
                handleInputTyping
              }

              onKeyDown={(e) => {

                if (
                  e.key === "Enter"
                ) {

                  sendMessage();

                }

              }}
            />

            <Button
              onClick={
                sendMessage
              }

              disabled={sending}
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


export default ChatPage;