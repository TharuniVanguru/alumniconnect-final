import React from "react";

import {

  Navigate,

  useLocation,

} from "react-router-dom";

import {

  Loader2,

} from "lucide-react";

import {

  useAuth,

} from "@/contexts/AuthContext";


// ==========================================
// TYPES
// ==========================================
interface PublicRouteProps {

  children: React.ReactNode;

}


// ==========================================
// LOADING SCREEN
// ==========================================
const LoadingScreen = () => {

  return (

    <div className="min-h-screen flex items-center justify-center bg-background">

      <div className="flex flex-col items-center gap-4">

        <Loader2 className="h-10 w-10 animate-spin text-primary" />

        <div className="text-center">

          <h2 className="text-lg font-semibold">

            Loading

          </h2>

          <p className="text-sm text-muted-foreground">

            Please wait...

          </p>

        </div>

      </div>

    </div>

  );

};


// ==========================================
// PUBLIC ROUTE
// ==========================================
export const PublicRoute = ({

  children,

}: PublicRouteProps) => {

  // ========================================
  // AUTH CONTEXT
  // ========================================
  const {

    user,

    token,

    isAuthenticated,

    isLoading,

  } = useAuth();


  // ========================================
  // LOCATION
  // ========================================
  const location =
    useLocation();


  // ========================================
  // AUTH LOADING
  // ========================================
  if (isLoading) {

    return <LoadingScreen />;

  }


  // ========================================
  // NOT LOGGED IN
  // ========================================
  if (

    !isAuthenticated ||

    !user ||

    !token

  ) {

    return <>{children}</>;

  }


  // ========================================
  // FIRST LOGIN
  // ========================================
  if (

    user.isFirstLogin &&

    location.pathname !==
    "/change-password"

  ) {

    return (

      <Navigate

        to="/change-password"

        replace

      />

    );

  }


  // ========================================
  // ROLE BASED REDIRECT
  // ========================================
  switch (user.role) {

    case "student":

      return (

        <Navigate

          to="/student/dashboard"

          replace

        />

      );

    case "alumni":

      return (

        <Navigate

          to="/alumni/dashboard"

          replace

        />

      );

    case "admin":

      return (

        <Navigate

          to="/admin/dashboard"

          replace

        />

      );

    default:

      // ====================================
      // INVALID ROLE
      // ====================================
      localStorage.removeItem(
        "userInfo"
      );

      localStorage.removeItem(
        "token"
      );

      return <>{children}</>;

  }

};


// ==========================================
// EXPORT
// ==========================================
export default PublicRoute;