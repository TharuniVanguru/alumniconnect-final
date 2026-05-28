import React from "react";

import {

  Navigate,

  useLocation,

} from "react-router-dom";

import {

  Loader2,

  ShieldAlert,

} from "lucide-react";

import {

  useAuth,

} from "@/contexts/AuthContext";


// ==========================================
// TYPES
// ==========================================
interface ProtectedRouteProps {

  children: React.ReactNode;

  allowedRoles?: string[];

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

            Authenticating

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
// ACCESS DENIED
// ==========================================
const AccessDenied = () => {

  return (

    <div className="min-h-screen flex items-center justify-center p-4">

      <div className="max-w-md text-center">

        <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />

        <h1 className="text-2xl font-bold mb-2">

          Access Denied

        </h1>

        <p className="text-muted-foreground">

          You do not have permission to access this page.

        </p>

      </div>

    </div>

  );

};


// ==========================================
// PROTECTED ROUTE
// ==========================================
export const ProtectedRoute = ({

  children,

  allowedRoles = [],

}: ProtectedRouteProps) => {

  // ========================================
  // AUTH CONTEXT
  // ========================================
  const {

    user,

    token,

    isLoading,

    isAuthenticated,

  } = useAuth();


  // ========================================
  // CURRENT LOCATION
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
  // NO USER / TOKEN
  // ========================================
  if (

    !isAuthenticated ||

    !user ||

    !token

  ) {

    return (

      <Navigate

        to="/login"

        replace

        state={{

          from: location,

        }}

      />

    );

  }


  // ========================================
  // USER INACTIVE
  // ========================================
  if (

    user.isActive === false

  ) {

    localStorage.removeItem(
      "userInfo"
    );

    localStorage.removeItem(
      "token"
    );

    return (

      <Navigate

        to="/login"

        replace

      />

    );

  }


  // ========================================
  // ROLE VALIDATION
  // ========================================
  if (

    allowedRoles.length > 0 &&

    !allowedRoles.includes(
      user.role
    )

  ) {

    // ======================================
    // REDIRECT USER TO OWN DASHBOARD
    // ======================================
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

        return <AccessDenied />;

    }

  }


  // ========================================
  // FIRST LOGIN CHECK
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
  // ALLOW ACCESS
  // ========================================
  return <>{children}</>;

};


// ==========================================
// EXPORT
// ==========================================
export default ProtectedRoute;