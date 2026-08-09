// Distinct storage key from adminAuth's 'admin_token' so brand and admin
// sessions can coexist in one browser.
const BRAND_TOKEN_KEY = "brand_token";
const BRANDS_KEY = "brand_org_brands";
const MODULES_KEY = "brand_subscribed_modules";

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
    localStorage.removeItem(MODULES_KEY);
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
    localStorage.removeItem(MODULES_KEY);
  },

  // Subscriptions are NOT in the JWT — they arrive in the login/register
  // response body, derived fresh from the org's active/trial subscriptions.
  // Same caching contract as the brand list: UX convenience, server enforces.
  setSubscribedModules(modules: string[]): void {
    localStorage.setItem(MODULES_KEY, JSON.stringify(modules));
  },
  getSubscribedModules(): string[] {
    try {
      return JSON.parse(localStorage.getItem(MODULES_KEY) ?? "[]") as string[];
    } catch {
      return [];
    }
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

export type ModulePermission = "read" | "write" | "manage";

const PERMISSION_RANK: Record<ModulePermission, number> = {
  read: 1,
  write: 2,
  manage: 3,
};

// The token claim types `permissions` as string[]; the backend contract
// describes a single hierarchical rank. Accept either and use the highest
// rank present.
function highestRank(permissions: string[] | string): ModulePermission | null {
  const list = Array.isArray(permissions) ? permissions : [permissions];
  let best: ModulePermission | null = null;
  for (const p of list) {
    if (p in PERMISSION_RANK) {
      const perm = p as ModulePermission;
      if (!best || PERMISSION_RANK[perm] > PERMISSION_RANK[best]) best = perm;
    }
  }
  return best;
}

export function getOrgRole(): "owner" | "admin" | "member" | null {
  return decodeBrandToken()?.orgRole ?? null;
}

export function getSubscribedModules(): string[] {
  return brandSession.getSubscribedModules();
}

// Mirrors the backend's resolution order exactly:
// 1. org must be subscribed; 2. owner/admin → full access;
// 3. member → needs a moduleAccess entry.
export function hasModule(moduleId: string): boolean {
  return getModulePermission(moduleId) !== null;
}

export function getModulePermission(
  moduleId: string,
): ModulePermission | null {
  const payload = decodeBrandToken();
  if (!payload) return null;
  if (!getSubscribedModules().includes(moduleId)) return null;
  if (payload.orgRole === "owner" || payload.orgRole === "admin") {
    return "manage";
  }
  const entry = payload.moduleAccess?.find((e) => e.module === moduleId);
  return entry ? highestRank(entry.permissions) : null;
}

export function hasPermission(
  moduleId: string,
  required: ModulePermission,
): boolean {
  const granted = getModulePermission(moduleId);
  return (
    granted !== null && PERMISSION_RANK[granted] >= PERMISSION_RANK[required]
  );
}
