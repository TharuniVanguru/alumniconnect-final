import {
  io,
  Socket,
} from "socket.io-client";


// ==========================================
// SOCKET URL
// ==========================================
const SOCKET_URL =

  import.meta.env.VITE_SOCKET_URL ||

  "http://localhost:5000";


// ==========================================
// SOCKET INSTANCE
// ==========================================
let socket: Socket | null =
  null;


// ==========================================
// CONNECT SOCKET
// ==========================================
export const connectSocket = (
  userId?: string
): Socket => {

  // ========================================
  // TOKEN
  // ========================================
  const token =
    localStorage.getItem(
      "token"
    );


  // ========================================
  // TOKEN CHECK
  // ========================================
  if (!token) {

    throw new Error(
      "Socket token missing"
    );

  }


  // ========================================
  // RETURN EXISTING SOCKET
  // ========================================
  if (socket) {

    socket.auth = {
      token,
    };

    if (!socket.connected) {

      socket.connect();

    }

    return socket;

  }


  // ========================================
  // CREATE SOCKET
  // ========================================
  socket = io(

    SOCKET_URL,

    {

      transports: [
        "websocket",
      ],

      autoConnect: true,

      reconnection: true,

      reconnectionAttempts: Infinity,

      reconnectionDelay: 1000,

      reconnectionDelayMax: 5000,

      timeout: 20000,

      forceNew: false,

      withCredentials: true,

      auth: {
        token,
      },

    }

  );


  // ========================================
  // CONNECT
  // ========================================
  socket.on(

    "connect",

    () => {

      console.log(
        "🟢 SOCKET CONNECTED:",
        socket?.id
      );

      // ====================================
      // JOIN USER ROOM
      // ====================================
      if (userId) {

        socket?.emit(
          "joinRoom",
          userId
        );

      }


      // ====================================
      // USER ONLINE
      // ====================================
      socket?.emit(
        "userOnline",
        userId
      );

    }

  );


  // ========================================
  // DISCONNECT
  // ========================================
  socket.on(

    "disconnect",

    (reason) => {

      console.log(
        "🔴 SOCKET DISCONNECTED:",
        reason
      );

    }

  );


  // ========================================
  // CONNECTION ERROR
  // ========================================
  socket.on(

    "connect_error",

    (error) => {

      console.log(
        "❌ SOCKET CONNECTION ERROR:",
        error.message
      );

    }

  );


  // ========================================
  // RECONNECT
  // ========================================
  socket.on(

    "reconnect",

    (attempt) => {

      console.log(
        `♻️ RECONNECTED AFTER ${attempt} ATTEMPTS`
      );

      if (userId) {

        socket?.emit(
          "joinRoom",
          userId
        );

      }

    }

  );


  // ========================================
  // RECONNECT ATTEMPT
  // ========================================
  socket.on(

    "reconnect_attempt",

    (attempt) => {

      console.log(
        `🔄 RECONNECT ATTEMPT ${attempt}`
      );

    }

  );


  // ========================================
  // RECONNECT FAILED
  // ========================================
  socket.on(

    "reconnect_failed",

    () => {

      console.log(
        "❌ SOCKET RECONNECT FAILED"
      );

    }

  );


  // ========================================
  // GLOBAL ERROR
  // ========================================
  socket.on(

    "error",

    (error) => {

      console.log(
        "❌ SOCKET ERROR:",
        error
      );

    }

  );


  return socket;

};


// ==========================================
// GET SOCKET
// ==========================================
export const getSocket =
  (): Socket | null => {

    return socket;

  };


// ==========================================
// SOCKET CONNECTED
// ==========================================
export const isSocketConnected =
  (): boolean => {

    return !!socket?.connected;

  };


// ==========================================
// EMIT EVENT
// ==========================================
export const emitEvent = (

  event: string,

  data?: any

): void => {

  if (
    socket &&
    socket.connected
  ) {

    socket.emit(
      event,
      data
    );

  }

};


// ==========================================
// LISTEN EVENT
// ==========================================
export const listenEvent = (

  event: string,

  callback: (...args: any[]) => void

): void => {

  if (socket) {

    socket.on(
      event,
      callback
    );

  }

};


// ==========================================
// REMOVE LISTENER
// ==========================================
export const removeEvent = (
  event: string
): void => {

  if (socket) {

    socket.off(event);

  }

};


// ==========================================
// DISCONNECT SOCKET
// ==========================================
export const disconnectSocket =
  (): void => {

    if (socket) {

      socket.removeAllListeners();

      socket.disconnect();

      socket = null;

      console.log(
        "🛑 SOCKET DISCONNECTED"
      );

    }

  };


// ==========================================
// EXPORT
// ==========================================
export {
  socket,
};