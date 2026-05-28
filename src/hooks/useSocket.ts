import {
  useEffect,
} from "react";

import {

  connectSocket,

  disconnectSocket,

  getSocket,

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

    isAuthenticated,

  } = useAuth();


  // ========================================
  // SOCKET CONNECTION
  // ========================================
  useEffect(() => {

    // ======================================
    // NOT LOGGED IN
    // ======================================
    if (

      !isAuthenticated ||

      !user ||

      !user._id

    ) {

      return;

    }


    // ======================================
    // CONNECT SOCKET
    // ======================================
    const socket =
      connectSocket(
        user._id
      );


    // ======================================
    // USER ONLINE
    // ======================================
    socket.emit(

      "userOnline",

      user._id

    );


    // ======================================
    // CLEANUP
    // ======================================
    return () => {

      const activeSocket =
        getSocket();

      if (activeSocket) {

        activeSocket.emit(

          "userOffline",

          user._id

        );

      }

      disconnectSocket();

    };

  }, [

    isAuthenticated,

    user?._id,

  ]);


  // ========================================
  // RETURN SOCKET
  // ========================================
  return getSocket();

};


// ==========================================
// EXPORT
// ==========================================
export default useSocket;