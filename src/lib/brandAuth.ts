// Distinct storage key from adminAuth's 'admin_token' so brand and admin
// sessions can coexist in one browser.
const BRAND_TOKEN_KEY = "brand_token";
const BRANDS_KEY = "brand_org_brands";

export const brandAuth = {
  getToken: (): string | null =>
    localStorage.getItem(BRAND_TOKEN_KEY),

  setToken: (token: string): void =>
    localStorage.setItem(BRAND_TOKEN_KEY, token),

  // Also drops the cached brand list so a logged-out browser holds no
  // org data.
  clearToken: (): void => {
    localStorage.removeItem(BRAND_TOKEN_KEY);
    localStorage.removeItem(BRANDS_KEY);
  },

  isLoggedIn: (): boolean =>
    !!localStorage.getItem(BRAND_TOKEN_KEY),

  authHeaders: (): Record<string, string> => {
    const token = localStorage.getItem(BRAND_TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

export interface OrgBrand {
  id: string;
  brandName: string;
  companyName: string;
  logo: string | null;
}

// Brands are cached from the login response for instant navigation/picker
// rendering. This cache is a UX convenience, NOT a source of truth — the
// server enforces brand scoping per request (404 outside the caller's org),
// and stale entries simply 404 on click. Refresh via fetchOrgBrands().
export const brandSession = {
  setBrands(brands: OrgBrand[]): void {
    localStorage.setItem(BRANDS_KEY, JSON.stringify(brands));
  },
  getBrands(): OrgBrand[] {
    try {
      return JSON.parse(localStorage.getItem(BRANDS_KEY) ?? "[]") as OrgBrand[];
    } catch {
      return [];
    }
  },
  clear(): void {
    localStorage.removeItem(BRANDS_KEY);
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
