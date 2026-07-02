import { Navigate } from "react-router-dom";
import { decodeBrandToken } from "@/lib/brandAuth";

// UX-level guard only — the backend enforces auth for real on every API call.
// NOTE: no org-scoping check here. The JWT carries orgId (an Organization
// document id) while the /dashboard/:brandId param is a Brand document id —
// two different collections with no mapping available on the client. Until
// the backend exposes brandId in the login response or JWT, we can only
// guard on authentication.
export function BrandProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!decodeBrandToken()) {
    return <Navigate to="/brand/login" replace />;
  }
  return <>{children}</>;
}
