import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

type ProtectedRouteProps = {
  children: ReactNode;
  roles?: string[];
};

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { user, loading, role } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (roles && role && !roles.includes(role)) return <Navigate to="/unauthorized" />;

  return <>{children}</>;
};

export default ProtectedRoute;
