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

import api from "@/utils/api";

import {

  connectSocket,

  disconnectSocket,

} from "@/socket";


// ==========================================
// CONTEXT TYPES
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

  refreshUser: () => Promise<void>;

  updateUser: (userData: User) => void;

}


// ==========================================
// CONTEXT
// ==========================================
const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );


// ==========================================
// HOOK
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
// PROVIDER
// ==========================================
export const AuthProvider:
React.FC<AuthProviderProps> = ({

  children,

}) => {

  // ========================================
  // STATES
  // ========================================
  const [

    user,

    setUser,

  ] = useState<User | null>(
    null
  );


  const [

    token,

    setToken,

  ] = useState<string | null>(
    null
  );


  const [

    isLoading,

    setIsLoading,

  ] = useState(true);


  // ========================================
  // CLEAR AUTH
  // ========================================
  const clearAuth = () => {

    disconnectSocket();

    setUser(null);

    setToken(null);

    localStorage.removeItem(
      "userInfo"
    );

    localStorage.removeItem(
      "token"
    );

    delete api.defaults.headers.common[
      "Authorization"
    ];

  };


  // ========================================
  // SAVE AUTH
  // ========================================
  const saveAuth = (

    userData: User,

    authToken: string

  ) => {

    // ======================================
    // STATE
    // ======================================
    setUser(userData);

    setToken(authToken);


    // ======================================
    // STORAGE
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
    // AXIOS HEADER
    // ======================================
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${authToken}`;


    // ======================================
    // SOCKET CONNECT
    // ======================================
    if (userData?._id) {

      connectSocket(
        userData._id
      );

    }

  };


  // ========================================
  // UPDATE USER
  // ========================================
  const updateUser = (
    userData: User
  ) => {

    setUser(userData);

    localStorage.setItem(

      "userInfo",

      JSON.stringify(userData)

    );

  };


  // ========================================
  // REFRESH USER
  // ========================================
  const refreshUser =
    async () => {

      try {

        const storedToken =
          localStorage.getItem(
            "token"
          );


        // ====================================
        // NO TOKEN
        // ====================================
        if (!storedToken) {

          clearAuth();

          return;

        }


        // ====================================
        // SET TOKEN
        // ====================================
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${storedToken}`;


        // ====================================
        // API CALL
        // ====================================
        const response =
          await api.get(
            "/auth/me"
          );


        const data =
          response.data;


        // ====================================
        // SUCCESS
        // ====================================
        if (

          data?.success &&

          data?.user

        ) {

          setUser(
            data.user
          );

          setToken(
            storedToken
          );

          localStorage.setItem(

            "userInfo",

            JSON.stringify(
              data.user
            )

          );


          // ==================================
          // SOCKET
          // ==================================
          if (
            data.user?._id
          ) {

            connectSocket(
              data.user._id
            );

          }

        }

        else {

          clearAuth();

        }

      }

      catch (error) {

        console.log(

          "REFRESH USER ERROR:",

          error

        );

        clearAuth();

      }

    };


  // ========================================
  // RESTORE AUTH
  // ========================================
  useEffect(() => {

    const restoreAuth =
      async () => {

        try {

          const storedUser =
            localStorage.getItem(
              "userInfo"
            );

          const storedToken =
            localStorage.getItem(
              "token"
            );


          // ==================================
          // NO AUTH
          // ==================================
          if (

            !storedUser ||

            !storedToken

          ) {

            setIsLoading(false);

            return;

          }


          // ==================================
          // PARSE USER
          // ==================================
          const parsedUser =
            JSON.parse(
              storedUser
            );


          // ==================================
          // SET STATE
          // ==================================
          setUser(
            parsedUser
          );

          setToken(
            storedToken
          );


          // ==================================
          // AXIOS TOKEN
          // ==================================
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;


          // ==================================
          // VERIFY TOKEN
          // ==================================
          await refreshUser();

        }

        catch (error) {

          console.log(

            "RESTORE AUTH ERROR:",

            error

          );

          clearAuth();

        }

        finally {

          setIsLoading(false);

        }

      };


    restoreAuth();

  }, []);


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
      // API CALL
      // ====================================
      const response =
        await api.post(

          "/auth/login",

          {

            identifier:
              identifier.trim(),

            password:
              password.trim(),

            role,

          }

        );


      // ====================================
      // DATA
      // ====================================
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
  const logout =
    async () => {

      try {

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

        window.location.href =
          "/login";

      }

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

    updateUser,

  };


  // ========================================
  // LOADING SCREEN
  // ========================================
  if (isLoading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-background">

        <div className="text-center">

          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-lg font-semibold">

            Loading AlumniConnect...

          </p>

        </div>

      </div>

    );

  }


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