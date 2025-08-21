import { useAuth } from "../auth/AuthContext";
import { Navigate } from "react-router";

export default function ProtectedRoute({ children }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
