import { Navigate, Outlet, useLocation } from "react-router-dom";
import { auth } from "@/services/api";

export const ProtectedRoute = () => {
  const location = useLocation();

  if (!auth.isLoggedIn()) {
    // Redirect them to the /login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
