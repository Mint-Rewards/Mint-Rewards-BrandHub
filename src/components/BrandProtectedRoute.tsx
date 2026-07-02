import { Navigate } from "react-router-dom";
import { decodeBrandToken } from "@/lib/brandAuth";

// UX-level guard only — the backend enforces auth for real on every API call.
// Deliberately NO client-side check of the route's :brandId against token
// claims: brand scoping is server-enforced. GET /api/brandhub/brands/:brandId
// returns 404 for foreign, orphan, and nonexistent ids alike, and the
// dashboard renders that as a not-found state. Do not reintroduce a client
// comparison — it would duplicate the server's rules and drift from them.
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
