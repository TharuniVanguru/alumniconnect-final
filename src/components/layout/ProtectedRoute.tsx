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

import type {

  UserRole,

} from "@/types/user";


// ==========================================
// TYPES
// ==========================================
interface ProtectedRouteProps {

  children: React.ReactNode;

  allowedRoles?: UserRole[];

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

            Authenticating...

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
// ACCESS DENIED
// ==========================================
const AccessDenied = () => {

  return (

    <div className="min-h-screen flex items-center justify-center bg-background p-4">

      <div className="max-w-md w-full bg-card border rounded-3xl shadow-xl p-10 text-center">

        <div className="flex justify-center mb-6">

          <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">

            <ShieldAlert className="h-10 w-10 text-red-500" />

          </div>

        </div>

        <h1 className="text-3xl font-bold mb-3">

          Access Denied

        </h1>

        <p className="text-muted-foreground leading-7">

          You don't have permission to access this page.

        </p>

      </div>

    </div>

  );

};


// ==========================================
// ROLE DASHBOARD REDIRECT
// ==========================================
const getRoleDashboard = (
  role?: UserRole
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
// PROTECTED ROUTE
// ==========================================
export const ProtectedRoute = ({

  children,

  allowedRoles = [],

}: ProtectedRouteProps) => {

  // ========================================
  // AUTH
  // ========================================
  const {

    user,

    token,

    isLoading,

    isAuthenticated,

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
  // TOKEN VALIDATION
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

    return (

      <Navigate

        to="/login"

        replace

        state={{

          from: location.pathname,

        }}

      />

    );

  }


  // ========================================
  // INACTIVE USER
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
  // ROLE VALIDATION
  // ========================================
  if (

    allowedRoles.length > 0 &&

    !allowedRoles.includes(
      user.role
    )

  ) {

    return (

      <Navigate

        to={

          getRoleDashboard(
            user.role
          )

        }

        replace

      />

    );

  }


  // ========================================
  // ACCESS GRANTED
  // ========================================
  return <>{children}</>;

};


// ==========================================
// EXPORT
// ==========================================
export default ProtectedRoute;