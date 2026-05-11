import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {

  // GET USER FROM LOCAL STORAGE
  const userInfo =
    localStorage.getItem("userInfo");

  // IF USER NOT LOGGED IN
  if (!userInfo) {

    return <Navigate to="/login" replace />;

  }

  const user = JSON.parse(userInfo);

  // CHECK ROLE ACCESS
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {

    return (
      <Navigate
        to={`/${user.role}/dashboard`}
        replace
      />
    );

  }

  // ALLOW ACCESS
  return <>{children}</>;
};