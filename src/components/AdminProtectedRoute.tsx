import { Navigate } from "react-router-dom";
import { adminAuth } from "@/lib/adminAuth";

export function AdminProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!adminAuth.isLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}
