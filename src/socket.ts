import {
  io,
  Socket,
} from "socket.io-client";


// ==========================================
// SOCKET URL
// ==========================================
const SOCKET_URL =
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
  userId: string
): Socket => {

  // ========================================
  // RETURN EXISTING SOCKET
  // ========================================
  if (socket) {

    // ======================================
    // RECONNECT IF DISCONNECTED
    // ======================================
    if (!socket.connected) {

      socket.connect();

    }

    return socket;

  }


  // ========================================
  // CREATE NEW SOCKET
  // ========================================
  socket = io(

    SOCKET_URL,

    {

      transports: [
        "websocket",
      ],

      autoConnect: true,

      reconnection: true,

      reconnectionAttempts: 5,

      reconnectionDelay: 1000,

      withCredentials: true,

    }

  );


  // ========================================
  // CONNECT EVENT
  // ========================================
  socket.on(

    "connect",

    () => {

      console.log(
        "🟢 Socket Connected:",
        socket?.id
      );


      // ====================================
      // JOIN ROOM
      // ====================================
      socket?.emit(
        "joinRoom",
        userId
      );

    }

  );


  // ========================================
  // DISCONNECT EVENT
  // ========================================
  socket.on(

    "disconnect",

    (reason) => {

      console.log(
        "🔴 Socket Disconnected:",
        reason
      );

    }

  );


  // ========================================
  // CONNECT ERROR
  // ========================================
  socket.on(

    "connect_error",

    (error) => {

      console.log(
        "❌ SOCKET ERROR:",
        error.message
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
// DISCONNECT SOCKET
// ==========================================
export const disconnectSocket =
  (): void => {

    if (socket) {

      socket.removeAllListeners();

      socket.disconnect();

      socket = null;

      console.log(
        "🛑 Socket Fully Disconnected"
      );

    }

  };


// ==========================================
// EXPORT SOCKET
// ==========================================
export {

  socket,

};