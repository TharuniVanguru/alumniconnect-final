import React, {

  createContext,

  useContext,

  useState,

  useEffect,

  ReactNode,

} from "react";

import {

  User,

  UserRole,

} from "@/types/user";

import api
  from "@/utils/api";

import {

  connectSocket,

  disconnectSocket,

} from "@/socket";


// ==========================================
// AUTH CONTEXT TYPES
// ==========================================
interface AuthContextType {

  user: User | null;

  token: string | null;

  isLoading: boolean;

  isAuthenticated: boolean;

  login: (

    identifier: string,

    password: string,

    role: UserRole

  ) => Promise<{

    success: boolean;

    message?: string;

  }>;

  logout: () => Promise<void>;

  refreshUser: () => void;

}


// ==========================================
// CREATE CONTEXT
// ==========================================
const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );


// ==========================================
// CUSTOM HOOK
// ==========================================
export const useAuth = () => {

  const context =
    useContext(AuthContext);

  if (!context) {

    throw new Error(

      "useAuth must be used within AuthProvider"

    );

  }

  return context;

};


// ==========================================
// PROVIDER TYPES
// ==========================================
interface AuthProviderProps {

  children: ReactNode;

}


// ==========================================
// AUTH PROVIDER
// ==========================================
export const AuthProvider:
React.FC<AuthProviderProps> = ({

  children,

}) => {

  // ========================================
  // STATES
  // ========================================
  const [user, setUser] =
    useState<User | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);


  // ========================================
  // RESTORE AUTH
  // ========================================
  useEffect(() => {

    restoreAuth();

  }, []);


  // ========================================
  // RESTORE AUTH FUNCTION
  // ========================================
  const restoreAuth = () => {

    try {

      const storedUser =
        localStorage.getItem(
          "userInfo"
        );

      const storedToken =
        localStorage.getItem(
          "token"
        );


      // ====================================
      // RESTORE USER
      // ====================================
      if (

        storedUser &&

        storedToken

      ) {

        const parsedUser: User =
          JSON.parse(
            storedUser
          );

        setUser(
          parsedUser
        );

        setToken(
          storedToken
        );


        // ==================================
        // SOCKET CONNECT
        // ==================================
        if (parsedUser._id) {

          connectSocket(
            parsedUser._id
          );

        }

      }

    }

    catch (error) {

      console.log(

        "AUTH RESTORE ERROR:",

        error

      );

      clearAuth();

    }

    finally {

      setIsLoading(false);

    }

  };


  // ========================================
  // SAVE AUTH
  // ========================================
  const saveAuth = (

    userData: User,

    authToken: string

  ) => {

    // ======================================
    // UPDATE STATE
    // ======================================
    setUser(userData);

    setToken(authToken);


    // ======================================
    // SAVE STORAGE
    // ======================================
    localStorage.setItem(

      "userInfo",

      JSON.stringify(userData)

    );

    localStorage.setItem(

      "token",

      authToken

    );


    // ======================================
    // CONNECT SOCKET
    // ======================================
    if (userData._id) {

      connectSocket(
        userData._id
      );

    }

  };


  // ========================================
  // CLEAR AUTH
  // ========================================
  const clearAuth = () => {

    // ======================================
    // DISCONNECT SOCKET
    // ======================================
    disconnectSocket();


    // ======================================
    // CLEAR STATE
    // ======================================
    setUser(null);

    setToken(null);


    // ======================================
    // CLEAR STORAGE
    // ======================================
    localStorage.removeItem(
      "userInfo"
    );

    localStorage.removeItem(
      "token"
    );

  };


  // ========================================
  // LOGIN
  // ========================================
  const login = async (

    identifier: string,

    password: string,

    role: UserRole

  ) => {

    try {

      setIsLoading(true);


      // ====================================
      // LOGIN API
      // ====================================
      const response =
        await api.post(

          "/auth/login",

          {

            identifier,

            password,

            role,

          }

        );


      const data =
        response.data;


      // ====================================
      // VALIDATION
      // ====================================
      if (

        !data ||

        !data.success ||

        !data.user ||

        !data.token

      ) {

        return {

          success: false,

          message:
            "Invalid server response",

        };

      }


      // ====================================
      // SAVE AUTH
      // ====================================
      saveAuth(

        data.user,

        data.token

      );


      return {

        success: true,

      };

    }

    catch (error: any) {

      console.log(

        "LOGIN ERROR:",

        error

      );

      return {

        success: false,

        message:

          error?.response?.data
            ?.message ||

          error?.message ||

          "Login failed",

      };

    }

    finally {

      setIsLoading(false);

    }

  };


  // ========================================
  // LOGOUT
  // ========================================
  const logout = async () => {

    try {

      // ====================================
      // LOGOUT API
      // ====================================
      await api.post(
        "/auth/logout"
      );

    }

    catch (error) {

      console.log(

        "LOGOUT ERROR:",

        error

      );

    }

    finally {

      clearAuth();

    }

  };


  // ========================================
  // REFRESH USER
  // ========================================
  const refreshUser = () => {

    restoreAuth();

  };


  // ========================================
  // CONTEXT VALUE
  // ========================================
  const value: AuthContextType = {

    user,

    token,

    isLoading,

    isAuthenticated:
      !!user && !!token,

    login,

    logout,

    refreshUser,

  };


  // ========================================
  // PROVIDER
  // ========================================
  return (

    <AuthContext.Provider
      value={value}
    >

      {children}

    </AuthContext.Provider>

  );

};


// ==========================================
// EXPORT
// ==========================================
export default AuthContext;