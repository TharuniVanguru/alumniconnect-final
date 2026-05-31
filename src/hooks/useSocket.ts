import {
  useEffect,
  useRef,
  useState,
} from "react";

import {

  connectSocket,

  disconnectSocket,

  getSocket,

  listenEvent,

  removeEvent,

} from "@/socket";

import {
  useAuth,
} from "@/contexts/AuthContext";


// ==========================================
// SOCKET HOOK
// ==========================================
const useSocket = () => {

  // ========================================
  // AUTH
  // ========================================
  const {

    user,

    token,

    isAuthenticated,

  } = useAuth();


  // ========================================
  // STATES
  // ========================================
  const [

    onlineUsers,

    setOnlineUsers,

  ] = useState<string[]>([]);


  const [

    typingUsers,

    setTypingUsers,

  ] = useState<any[]>([]);


  const [

    latestMessage,

    setLatestMessage,

  ] = useState<any>(null);


  const [

    latestNotification,

    setLatestNotification,

  ] = useState<any>(null);


  const [

    socketConnected,

    setSocketConnected,

  ] = useState<boolean>(false);


  // ========================================
  // SOCKET REF
  // ========================================
  const initialized =
    useRef(false);


  // ========================================
  // SOCKET CONNECTION
  // ========================================
  useEffect(() => {

    // ======================================
    // VALIDATION
    // ======================================
    if (

      !isAuthenticated ||

      !user ||

      !user._id ||

      !token

    ) {

      return;

    }


    // ======================================
    // AVOID DUPLICATE INIT
    // ======================================
    if (initialized.current) {

      return;

    }

    initialized.current = true;


    // ======================================
    // CONNECT SOCKET
    // ======================================
    const socket =
      connectSocket(
        user._id
      );


    // ======================================
    // SOCKET CONNECT
    // ======================================
    socket.on(

      "connect",

      () => {

        console.log(
          "🟢 SOCKET ACTIVE"
        );

        setSocketConnected(
          true
        );

      }

    );


    // ======================================
    // SOCKET DISCONNECT
    // ======================================
    socket.on(

      "disconnect",

      () => {

        console.log(
          "🔴 SOCKET DISCONNECTED"
        );

        setSocketConnected(
          false
        );

      }

    );


    // ======================================
    // ONLINE USERS
    // ======================================
    listenEvent(

      "onlineUsers",

      (users: string[]) => {

        console.log(
          "🟢 ONLINE USERS:",
          users
        );

        setOnlineUsers(
          users
        );

      }

    );


    // ======================================
    // RECEIVE MESSAGE
    // ======================================
    listenEvent(

      "receiveMessage",

      (message) => {

        console.log(
          "📩 NEW MESSAGE:",
          message
        );

        setLatestMessage(
          message
        );

      }

    );


    // ======================================
    // RECEIVE NOTIFICATION
    // ======================================
    listenEvent(

      "receiveNotification",

      (notification) => {

        console.log(
          "🔔 NEW NOTIFICATION:",
          notification
        );

        setLatestNotification(
          notification
        );

      }

    );


    // ======================================
    // USER TYPING
    // ======================================
    listenEvent(

      "userTyping",

      (data) => {

        console.log(
          "⌨️ USER TYPING:",
          data
        );

        setTypingUsers(
          (prev) => {

            const exists =
              prev.find(
                (u) =>
                  u.userId ===
                  data.userId
              );

            if (exists)
              return prev;

            return [
              ...prev,
              data,
            ];

          }

        );

      }

    );


    // ======================================
    // USER STOP TYPING
    // ======================================
    listenEvent(

      "userStopTyping",

      (data) => {

        console.log(
          "🛑 USER STOPPED TYPING:",
          data
        );

        setTypingUsers(
          (prev) =>

            prev.filter(
              (u) =>

                u.userId !==
                data.userId
            )

        );

      }

    );


    // ======================================
    // MESSAGE DELIVERED
    // ======================================
    listenEvent(

      "messageDelivered",

      (data) => {

        console.log(
          "✅ MESSAGE DELIVERED:",
          data
        );

      }

    );


    // ======================================
    // MESSAGE SEEN
    // ======================================
    listenEvent(

      "messageSeen",

      (data) => {

        console.log(
          "👀 MESSAGE SEEN:",
          data
        );

      }

    );


    // ======================================
    // CLEANUP
    // ======================================
    return () => {

      removeEvent(
        "onlineUsers"
      );

      removeEvent(
        "receiveMessage"
      );

      removeEvent(
        "receiveNotification"
      );

      removeEvent(
        "userTyping"
      );

      removeEvent(
        "userStopTyping"
      );

      removeEvent(
        "messageDelivered"
      );

      removeEvent(
        "messageSeen"
      );

      disconnectSocket();

      initialized.current =
        false;

    };

  }, [

    isAuthenticated,

    user?._id,

    token,

  ]);


  // ========================================
  // RETURN
  // ========================================
  return {

    socket:
      getSocket(),

    socketConnected,

    onlineUsers,

    typingUsers,

    latestMessage,

    latestNotification,

  };

};


// ==========================================
// EXPORT
// ==========================================
export default useSocket;