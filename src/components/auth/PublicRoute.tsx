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

            Loading...

          </h2>

          <p className="text-sm text-muted-foreground">

            Please wait

          </p>

        </div>

      </div>

    </div>

  );

};


// ==========================================
// GET DASHBOARD
// ==========================================
const getDashboardRoute = (
  role?: string
) => {

  switch (role) {

    case "student":

      return "/student/dashboard";

    case "alumni":

      return "/alumni/dashboard";

    case "admin":

      return "/admin/dashboard";

    case "faculty":

      return "/faculty/dashboard";

    default:

      return "/login";

  }

};


// ==========================================
// PUBLIC ROUTE
// ==========================================
export const PublicRoute = ({

  children,

}: PublicRouteProps) => {

  // ========================================
  // AUTH
  // ========================================
  const {

    user,

    token,

    isAuthenticated,

    isLoading,

    logout,

  } = useAuth();


  // ========================================
  // LOCATION
  // ========================================
  const location =
    useLocation();


  // ========================================
  // LOADING
  // ========================================
  if (isLoading) {

    return <LoadingScreen />;

  }


  // ========================================
  // TOKEN CHECK
  // ========================================
  const storedToken =
    localStorage.getItem(
      "token"
    );


  // ========================================
  // NOT AUTHENTICATED
  // ========================================
  if (

    !isAuthenticated ||

    !user ||

    !token ||

    !storedToken

  ) {

    return <>{children}</>;

  }


  // ========================================
  // USER DISABLED
  // ========================================
  if (

    user.isActive === false

  ) {

    logout();

    return (

      <Navigate

        to="/login"

        replace

      />

    );

  }


  // ========================================
  // FORCE PASSWORD CHANGE
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
  // ALREADY LOGGED IN
  // ========================================
  return (

    <Navigate

      to={
        getDashboardRoute(
          user.role
        )
      }

      replace

    />

  );

};


// ==========================================
// EXPORT
// ==========================================
export default PublicRoute;