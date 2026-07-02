// Distinct storage key from adminAuth's 'admin_token' so brand and admin
// sessions can coexist in one browser.
const BRAND_TOKEN_KEY = "brand_token";

export const brandAuth = {
  getToken: (): string | null =>
    localStorage.getItem(BRAND_TOKEN_KEY),

  setToken: (token: string): void =>
    localStorage.setItem(BRAND_TOKEN_KEY, token),

  clearToken: (): void =>
    localStorage.removeItem(BRAND_TOKEN_KEY),

  isLoggedIn: (): boolean =>
    !!localStorage.getItem(BRAND_TOKEN_KEY),

  authHeaders: (): Record<string, string> => {
    const token = localStorage.getItem(BRAND_TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

export interface BrandTokenPayload {
  sub: string;
  orgId: string;
  orgRole: "owner" | "admin" | "member";
  moduleAccess: { module: string; permissions: string[] }[];
  exp?: number;
}

// Client-side decoding is a UX convenience (redirects, hiding UI the user
// can't use) — it is NOT security. The backend's requireModuleAccess chain is
// the enforcement layer; a tampered localStorage token will pass this check
// and then be rejected by every API call.
export function decodeBrandToken(): BrandTokenPayload | null {
  const token = brandAuth.getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as BrandTokenPayload;
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      brandAuth.clearToken();
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
