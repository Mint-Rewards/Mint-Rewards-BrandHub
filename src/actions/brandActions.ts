import { Brand, BrandStatus, Campaign, Deal } from "@/types";
import { adminAuth } from "@/lib/adminAuth";
import { brandAuth, type OrgBrand } from "@/lib/brandAuth";

export interface AnalyticsDateRange {
  from: Date;
  to: Date;
}

export interface BrandAnalytics {
  // Echoes the campaign period the backend scoped to, or null for all-time.
  period?: { from: string | null; to: string | null } | null;
  summary: {
    totalCampaigns: number;
    activeCampaigns: number;
    totalRedemptions: number;
    uniqueUsers: number;
  };
  campaigns: {
    byStatus: Record<string, number>;
    active: CampaignSummary[];
    list: CampaignSummary[];
  };
  dealStats: {
    total: number;
    active: number;
    inactive: number;
    expired: number;
  };
  // Omitted by the backend for brands with no impact data at all.
  environmental?: {
    totalWasteKg: number;
    co2AvoidedKg: number;
    materialBreakdown: { material: string; weightKg: number }[];
    // False for brands still on the legacy cumulative snapshot, which cannot
    // be filtered — the UI must label those all-time rather than implying they
    // followed the statistics period.
    periodScoped?: boolean;
    // The span the returned figures actually cover. Buckets are counted whole,
    // never pro-rated, so this can be wider than the requested window — it is
    // the honest answer to "which days is this number for?". Null when no
    // bucket matched, or on the legacy path.
    coverage?: { from: string; to: string } | null;
  };
}

export interface CampaignSummary {
  id: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  redemptions: number;
  campaignType: string | null;
  badge: string | null;
  subtitle: string | null;
  backgroundColor: string | null;
}

export interface RegisterBrandPayload {
  companyName: string;
  brandName: string;
  category: string;
  website: string;
  appLink: string;
  address: string;
  description: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  registrationNumber: string;
  logo: File | null;
  themeColor: string;
  domain: string;
}

interface RegisterBrandResponse {
  brandId?: string;
  brand_id?: string;
  message?: string;
  [key: string]: unknown;
}

export interface RegisterOrgPayload {
  orgName: string;
  email: string;
  password: string;
  brandName: string;
  category?: string;
  logo: File | null;
  contactName?: string;
  phone?: string;
  website?: string;
  appLink?: string;
  address?: string;
  description?: string;
}

export interface RegisterOrgResponse {
  token?: string;
  orgId?: string;
  userId?: string;
  brands?: OrgBrand[];
  defaultBrandId?: string | null;
  subscribedModules?: string[];
  error?: string;
}

// Org signup against /brandhub/auth/register. Sent as multipart so the
// optional logo file rides along; the backend accepts JSON or form-data.
export const registerOrg = async (
  payload: RegisterOrgPayload,
): Promise<RegisterOrgResponse> => {
  const formData = new FormData();
  formData.append("orgName", payload.orgName);
  formData.append("email", payload.email);
  formData.append("password", payload.password);
  if (payload.brandName) formData.append("brandName", payload.brandName);
  if (payload.category) formData.append("category", payload.category);
  if (payload.logo) formData.append("logo", payload.logo);
  if (payload.contactName) formData.append("contactName", payload.contactName);
  if (payload.phone) formData.append("phone", payload.phone);
  if (payload.appLink) formData.append("appLink", payload.appLink);
  if (payload.address) formData.append("address", payload.address);
  if (payload.description) formData.append("description", payload.description);
  // Sent under both keys: the admin view reads `website`, the brand-settings
  // PATCH endpoint reads `webLink` — same value, two field names in use
  // across the API surface.
  if (payload.website) {
    formData.append("website", payload.website);
    formData.append("webLink", payload.website);
  }

  const response = await fetch(`${getApiBaseUrl()}/brandhub/auth/register`, {
    method: "POST",
    body: formData,
  });

  const data = await readJson<RegisterOrgResponse>(response);

  if (!response.ok) {
    throw new Error(data.error ?? "Registration failed");
  }

  return data;
};

interface FetchBrandsResponse {
  success?: boolean;
  brands?: Brand[];
  message?: string;
}

// Exported because every caller must go through it. Reading
// import.meta.env.VITE_API_URL directly skips the fallback, so with no .env
// present that call builds "undefined/..." while the rest of the app works
// against the hosted API — which reads as a backend fault rather than missing
// configuration (issue #43).
//
// Truthiness, not `??`: an empty-string VITE_API_URL is missing configuration
// too, and `??` would let it win over the fallback.
export const getApiBaseUrl = () =>
  import.meta.env.VITE_API_URL ||
  "https://mint-rewards-mern-next-js.vercel.app/api";

/**
 * Read a JSON body without letting a non-JSON one mask the real failure.
 *
 * Every error path here used to parse before checking `response.ok`, so a 405,
 * a 502 HTML error page or a proxy error threw a SyntaxError from the parse
 * before the code that would have produced a useful message ever ran — the
 * user saw "Unexpected end of JSON input" or "Unexpected token '<'" in a toast
 * (issue #41). Degrading to {} lets the generic message through instead.
 */
const readJson = async <T>(response: Response): Promise<T> =>
  (await response.json().catch(() => ({}))) as T;

// The list endpoint's raw records aren't guaranteed to be camelCase (seen
// in the wild as snake_case `created_at`); normalize the same way
// fetchBrandById does for a single record.
const normalizeBrandDates = (brand: Brand): Brand => ({
  ...brand,
  createdAt: brand.createdAt ?? (brand as Record<string, unknown>).created_at as string | undefined,
});

export const fetchBrands = async (): Promise<Brand[]> => {
  const response = await fetch(`${getApiBaseUrl()}/brands`, {
    headers: adminAuth.authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch brands");
  }

  const data = await readJson<Brand[] | FetchBrandsResponse>(response);

  if (Array.isArray(data)) {
    return data.map(normalizeBrandDates);
  }

  if (data.success === false) {
    throw new Error(data.message ?? "Failed to fetch brands");
  }

  if (Array.isArray(data.brands)) {
    return data.brands.map(normalizeBrandDates);
  }

  return [];
};

// Thrown on a 404 from the org-scoped brand endpoint: foreign, orphan, and
// nonexistent brand ids all look the same to the caller by design.
export class BrandNotFoundError extends Error {
  constructor() {
    super("Brand not found");
    this.name = "BrandNotFoundError";
  }
}

// 402 — the org isn't subscribed to the module (upsell framing).
export class ModuleNotSubscribedError extends Error {
  constructor() {
    super("This feature is not part of your organisation's plan.");
    this.name = "ModuleNotSubscribedError";
  }
}

// 403 — subscribed, but this user's role/permission is insufficient.
// Deliberately distinct from 402: locked = buy it; forbidden = ask your owner.
export class InsufficientPermissionError extends Error {
  constructor() {
    super(
      "You don't have permission to do this. Ask your organisation's owner or admin.",
    );
    this.name = "InsufficientPermissionError";
  }
}

// Central mapping for the scoped /api/brandhub/* endpoints' error semantics.
// Returns normally on 2xx and on statuses the caller wants to inspect itself.
const throwForBrandApiStatus = (response: Response): void => {
  if (response.ok) return;
  switch (response.status) {
    case 401:
      // Missing/invalid/expired token — drop the session and start over.
      brandAuth.clearToken();
      window.location.assign("/brand/login");
      throw new Error("Your session has expired. Please sign in again.");
    case 402:
      throw new ModuleNotSubscribedError();
    case 403:
      throw new InsufficientPermissionError();
    case 404:
      throw new BrandNotFoundError();
    default:
      // Everything else — 500, 502, 429, 400 — used to fall through here, and
      // the list actions then turned it into an empty array. A server failure
      // rendered as "No deals yet", indistinguishable from a genuine empty
      // state and sometimes shown right after the brand created a deal
      // (issue #42). Throwing lets the dashboard's error banner engage.
      throw new Error(
        `Request failed (${response.status}). Please try again.`,
      );
  }
};

// Refreshes the org's brand list from the server; brandSession holds the
// cached copy from login.
export const fetchOrgBrands = async (): Promise<OrgBrand[]> => {
  const response = await fetch(`${getApiBaseUrl()}/brandhub/brands`, {
    headers: { ...brandAuth.authHeaders() },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch brands");
  }
  const data = await readJson<{ brands?: OrgBrand[] }>(response);
  return data.brands ?? [];
};

// Owner/admin only — members get a 403 from the backend. The backend
// backfills required legacy fields (email, registration number, etc.) with
// placeholders; collecting real values here is a known follow-up.
export const createOrgBrand = async (payload: {
  brandName: string;
  companyName: string;
}): Promise<OrgBrand> => {
  const response = await fetch(`${getApiBaseUrl()}/brandhub/brands`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...brandAuth.authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  const data = await readJson<{
    brand?: OrgBrand;
    error?: string;
  }>(response);
  if (!response.ok || !data.brand) {
    throw new Error(data.error ?? "Failed to create brand");
  }
  return data.brand;
};

export const fetchBrandById = async (id: string): Promise<Brand> => {
  const response = await fetch(`${getApiBaseUrl()}/brandhub/brands/${id}`, {
    headers: { ...brandAuth.authHeaders() },
  });

  if (response.status === 404) {
    throw new BrandNotFoundError();
  }

  const data = await readJson<{
    brand?: Record<string, unknown>;
    error?: string;
    message?: string;
  }>(response);

  if (!response.ok || !data.brand) {
    throw new Error(data.error ?? data.message ?? "Brand not found");
  }

  const raw = data.brand;
  const docId = String(raw._id ?? raw.id ?? "");
  const status = String(raw.status ?? "pending").toLowerCase() as BrandStatus;

  return {
    id: docId,
    _id: docId,
    brandName: raw.brandName as string,
    companyName: raw.companyName as string,
    email: raw.email as string,
    logo: raw.logo as string,
    themeColor: raw.themeColor as string,
    phone: raw.phone as string,
    website: ((raw.webLink ?? raw.website) as string) ?? "",
    webLink: ((raw.webLink ?? raw.website) as string) ?? "",
    appLink: (raw.appLink as string) ?? "",
    category: raw.category as string,
    contactName: (raw.contactName as string) ?? "",
    description: raw.description as string,
    address: raw.address as string,
    domain: raw.domain as string,
    registrationNumber: raw.registrationNumber as string,
    status,
    createdAt: ((raw.createdAt ?? raw.created_at) as string) ?? new Date().toISOString(),
  };
};

export const fetchCampaignsForBrand = async (
  brandId: string,
): Promise<Campaign[]> => {
  const response = await fetch(
    `${getApiBaseUrl()}/brandhub/brands/${brandId}/campaigns`,
    { headers: { ...brandAuth.authHeaders() } },
  );

  throwForBrandApiStatus(response);

  const data = await readJson<{
    success?: boolean;
    campaigns?: Record<string, unknown>[];
  }>(response);

  return (data.campaigns ?? []).map((c) => {
    const docId = String(c._id ?? c.id ?? "");
    return { ...(c as unknown as Campaign), id: docId, _id: docId };
  });
};

export const createCampaign = async (
  brandId: string,
  payload: {
    name: string;
    startDate: string | null;
    endDate: string | null;
    description?: string;
    campaignType?: string;
    targetAudience?: string;
    budget?: number | null;
    backgroundColor?: string;
    badge?: string;
    subtitle?: string;
    banner?: File | null;
    // Required by the backend: a campaign with no codes cannot be redeemed in
    // the app. `isSingleCode` shares one code with every user; otherwise each
    // redeemer is handed a distinct code from the pool.
    discountCodes: string[];
    isSingleCode: boolean;
    discountPercentage?: string;
  },
): Promise<Campaign> => {
  let body: BodyInit;
  let headers: Record<string, string> | undefined;

  if (payload.banner instanceof File) {
    const fd = new FormData();
    fd.append("name", payload.name);
    // FormData flattens values to strings; the backend parses this JSON array
    // and the "true"/"false" literal back out.
    fd.append("discountCodes", JSON.stringify(payload.discountCodes));
    fd.append("isSingleCode", String(payload.isSingleCode));
    if (payload.discountPercentage) {
      fd.append("discountPercentage", payload.discountPercentage);
    }
    if (payload.startDate) fd.append("startDate", payload.startDate);
    if (payload.endDate) fd.append("endDate", payload.endDate);
    if (payload.description) fd.append("description", payload.description);
    if (payload.campaignType) fd.append("campaignType", payload.campaignType);
    if (payload.targetAudience) fd.append("targetAudience", payload.targetAudience);
    if (payload.budget != null) fd.append("budget", String(payload.budget));
    if (payload.backgroundColor) fd.append("backgroundColor", payload.backgroundColor);
    if (payload.badge) fd.append("badge", payload.badge);
    if (payload.subtitle) fd.append("subtitle", payload.subtitle);
    fd.append("banner", payload.banner);
    body = fd;
    headers = { ...brandAuth.authHeaders() };
  } else {
    const { banner: _b, ...rest } = payload;
    const clean = Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== null && v !== undefined),
    );
    body = JSON.stringify(clean);
    headers = {
      "Content-Type": "application/json",
      ...brandAuth.authHeaders(),
    };
  }

  const response = await fetch(
    `${getApiBaseUrl()}/brandhub/brands/${brandId}/campaigns`,
    { method: "POST", headers, body },
  );

  throwForBrandApiStatus(response);
  const data = await readJson<{
    success?: boolean;
    campaign?: Campaign;
    message?: string;
  }>(response);

  if (!response.ok || !data.campaign) {
    throw new Error(data.message ?? "Failed to create campaign");
  }

  return data.campaign;
};

export const fetchDealsForBrand = async (brandId: string): Promise<Deal[]> => {
  const response = await fetch(
    `${getApiBaseUrl()}/brandhub/brands/${brandId}/deals`,
    { headers: { ...brandAuth.authHeaders() } },
  );
  throwForBrandApiStatus(response);
  const data = await readJson<{
    success?: boolean;
    deals?: Record<string, unknown>[];
  }>(response);
  return (data.deals ?? []).map((d) => {
    const docId = String(d._id ?? d.id ?? "");
    return { ...(d as unknown as Deal), id: docId, _id: docId };
  });
};

// No `status` in the payload, same as createCampaign — the backend is
// expected to default new deals to "pending" so they go through admin
// review instead of going live immediately.
export const createDeal = async (
  brandId: string,
  payload: {
    title: string;
    description?: string;
    discountPercentage?: number | null;
    discountAmount?: number | null;
    codes?: string[];
    generateCodes?: { count: number; prefix?: string };
    startDate?: string | null;
    endDate?: string | null;
    maxUses?: number | null;
    minimumPurchase?: number | null;
  },
): Promise<Deal> => {
  const response = await fetch(
    `${getApiBaseUrl()}/brandhub/brands/${brandId}/deals`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...brandAuth.authHeaders(),
      },
      body: JSON.stringify(payload),
    },
  );

  throwForBrandApiStatus(response);
  const data = await readJson<{
    success?: boolean;
    deal?: Deal;
    message?: string;
  }>(response);

  if (!response.ok || !data.deal) {
    throw new Error(data.message ?? "Failed to create deal");
  }

  return data.deal;
};

export const updateBrandSettings = async (
  brandId: string,
  payload: Partial<{
    brandName: string;
    companyName: string;
    category: string;
    email: string;
    description: string;
    webLink: string;
    appLink: string;
    phone: string;
    address: string;
    domain: string;
    themeColor: string;
    contactName: string;
    logo: File | null;
  }>,
): Promise<Brand> => {
  let body: BodyInit;
  let headers: Record<string, string>;

  if (payload.logo instanceof File) {
    const fd = new FormData();
    for (const [key, value] of Object.entries(payload)) {
      if (key === "logo" || value === null || value === undefined) continue;
      fd.append(key, String(value));
    }
    fd.append("logo", payload.logo);
    body = fd;
    headers = { ...brandAuth.authHeaders() };
  } else {
    const { logo: _logo, ...rest } = payload;
    const clean = Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== null && v !== undefined),
    );
    body = JSON.stringify(clean);
    headers = {
      "Content-Type": "application/json",
      ...brandAuth.authHeaders(),
    };
  }

  // Settings live on the brand resource itself; owner/admin role required
  // (members get a 403) — no module gate.
  const response = await fetch(`${getApiBaseUrl()}/brandhub/brands/${brandId}`, {
    method: "PATCH",
    headers,
    body,
  });

  throwForBrandApiStatus(response);
  const data = await readJson<{
    success?: boolean;
    brand?: Record<string, unknown>;
    message?: string;
  }>(response);

  if (!response.ok || !data.brand) {
    throw new Error(data.message ?? "Failed to update settings");
  }

  return data.brand as unknown as Brand;
};

// Format a Date as a local YYYY-MM-DD so the period sent to the backend
// matches the day the user picked, without a UTC-midnight shift.
const toDateParam = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const fetchBrandAnalytics = async (
  brandId: string,
  range?: AnalyticsDateRange,
): Promise<BrandAnalytics> => {
  const query = range
    ? `?from=${toDateParam(range.from)}&to=${toDateParam(range.to)}`
    : "";
  // Throws the typed 401/402/403/404 errors so Overview can render a real
  // error state instead of silently showing nothing.
  const response = await fetch(
    `${getApiBaseUrl()}/brandhub/brands/${brandId}/analytics${query}`,
    { headers: { ...brandAuth.authHeaders() } },
  );
  throwForBrandApiStatus(response);
  const data = await readJson<{
    success?: boolean;
    analytics?: BrandAnalytics;
    message?: string;
  }>(response);
  if (!response.ok || !data.analytics) {
    throw new Error(data.message ?? "Failed to load analytics");
  }
  return data.analytics;
};

export const fetchAllDeals = async (filters?: {
  status?: string;
  brandId?: string;
}): Promise<Deal[]> => {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  if (filters?.brandId) params.set("brandId", filters.brandId);
  const qs = params.toString();

  const response = await fetch(
    `${getApiBaseUrl()}/brands/deals${qs ? `?${qs}` : ""}`,
    { headers: adminAuth.authHeaders() },
  );
  // Not an empty list: a failure here must reach AdminDashboard's error
  // banner rather than read as "no deals"/"no campaigns" (issue #42).
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}). Please try again.`);
  }
  const data = await readJson<{
    success?: boolean;
    deals?: Record<string, unknown>[];
  }>(response);
  return (data.deals ?? []).map((d) => {
    const brand = d.brand;
    const brandId =
      typeof brand === "object" && brand !== null && "_id" in brand
        ? String((brand as { _id: string })._id)
        : String(brand ?? "");
    const docId = String(d._id ?? d.id ?? "");
    return { ...(d as unknown as Deal), id: docId, _id: docId, brandId };
  });
};

// Legacy endpoint retained for the ADMIN moderation flow only
// (AdminDashboard status changes). Brand UI uses updateBrandDeal below.
export const updateDeal = async (
  brandId: string,
  dealId: string,
  payload: Partial<{
    title: string;
    description: string;
    discountPercentage: number | null;
    discountAmount: number | null;
    promoCode: string | null;
    startDate: string | null;
    endDate: string | null;
    maxUses: number | null;
    minimumPurchase: number | null;
    status: "active" | "inactive" | "expired" | "rejected";
  }>,
): Promise<Deal> => {
  const response = await fetch(
    `${getApiBaseUrl()}/brands/${brandId}/deals/${dealId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...adminAuth.authHeaders(),
      },
      body: JSON.stringify(payload),
    },
  );
  const data = await readJson<{
    success?: boolean;
    deal?: Deal;
    message?: string;
  }>(response);
  if (!response.ok || !data.deal) {
    throw new Error(data.message ?? "Failed to update deal");
  }
  return data.deal;
};

// Brand-side deal update on the scoped endpoint. New deals and edits to a
// live deal go through admin approval (pending -> active/rejected), same as
// campaigns; `status` here is only for toggling an already-approved deal
// active/inactive, not for self-approving.
export const updateBrandDeal = async (
  brandId: string,
  dealId: string,
  payload: Partial<{
    title: string;
    description: string;
    discountPercentage: number | null;
    discountAmount: number | null;
    addCodes: string[] | { count: number; prefix?: string };
    startDate: string | null;
    endDate: string | null;
    maxUses: number | null;
    minimumPurchase: number | null;
    status: "active" | "inactive" | "expired";
  }>,
): Promise<Deal> => {
  const response = await fetch(
    `${getApiBaseUrl()}/brandhub/brands/${brandId}/deals/${dealId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...brandAuth.authHeaders(),
      },
      body: JSON.stringify(payload),
    },
  );
  throwForBrandApiStatus(response);
  const data = await readJson<{
    success?: boolean;
    deal?: Deal;
    message?: string;
  }>(response);
  if (!response.ok || !data.deal) {
    throw new Error(data.message ?? "Failed to update deal");
  }
  return data.deal;
};

export const deleteDeal = async (
  brandId: string,
  dealId: string,
): Promise<void> => {
  const response = await fetch(
    `${getApiBaseUrl()}/brandhub/brands/${brandId}/deals/${dealId}`,
    { method: "DELETE", headers: { ...brandAuth.authHeaders() } },
  );
  throwForBrandApiStatus(response);
  if (!response.ok) {
    const data = await readJson<{ message?: string }>(response);
    throw new Error(data.message ?? "Failed to delete deal");
  }
};

// Legacy endpoint retained for the ADMIN moderation flow only
// (AdminDashboard approve/reject via `status`). Brand UI uses
// updateBrandCampaign below.
export const updateCampaign = async (
  brandId: string,
  campaignId: string,
  payload: Partial<{
    status: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    campaignType: string;
    targetAudience: string;
    budget: number | null;
    backgroundColor: string;
    badge: string;
    subtitle: string;
    banner: File | null;
  }>,
): Promise<Campaign> => {
  let body: BodyInit;
  let headers: Record<string, string>;

  if (payload.banner instanceof File) {
    const fd = new FormData();
    const { banner, ...rest } = payload;
    for (const [k, v] of Object.entries(rest)) {
      if (v != null) fd.append(k, String(v));
    }
    fd.append("banner", banner);
    body = fd;
    headers = { ...adminAuth.authHeaders() } as Record<string, string>;
  } else {
    const { banner: _b, ...rest } = payload;
    const clean = Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== null && v !== undefined),
    );
    body = JSON.stringify(clean);
    headers = {
      "Content-Type": "application/json",
      ...adminAuth.authHeaders(),
    } as Record<string, string>;
  }

  const response = await fetch(
    `${getApiBaseUrl()}/brands/${brandId}/campaigns/${campaignId}`,
    { method: "PATCH", headers, body },
  );
  const data = await readJson<{
    success?: boolean;
    campaign?: Campaign;
    message?: string;
  }>(response);
  if (!response.ok || !data.campaign) {
    throw new Error(data.message ?? "Failed to update campaign");
  }
  return data.campaign;
};

// Brand-side campaign update on the scoped endpoint. `status` is deliberately
// NOT part of the payload type — it is admin moderation state, and the
// backend returns 400 for a status-only body.
export const updateBrandCampaign = async (
  brandId: string,
  campaignId: string,
  payload: Partial<{
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    campaignType: string;
    targetAudience: string;
    budget: number | null;
    backgroundColor: string;
    badge: string;
    subtitle: string;
    banner: File | null;
    // Editable after creation, unlike the code inventory itself.
    discountPercentage: string;
  }>,
): Promise<Campaign> => {
  let body: BodyInit;
  let headers: Record<string, string>;

  if (payload.banner instanceof File) {
    const fd = new FormData();
    const { banner, ...rest } = payload;
    for (const [k, v] of Object.entries(rest)) {
      if (v != null) fd.append(k, String(v));
    }
    fd.append("banner", banner);
    body = fd;
    headers = { ...brandAuth.authHeaders() };
  } else {
    const { banner: _b, ...rest } = payload;
    const clean = Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== null && v !== undefined),
    );
    body = JSON.stringify(clean);
    headers = {
      "Content-Type": "application/json",
      ...brandAuth.authHeaders(),
    };
  }

  const response = await fetch(
    `${getApiBaseUrl()}/brandhub/brands/${brandId}/campaigns/${campaignId}`,
    { method: "PATCH", headers, body },
  );
  throwForBrandApiStatus(response);
  const data = await readJson<{
    success?: boolean;
    campaign?: Campaign;
    message?: string;
  }>(response);
  if (!response.ok || !data.campaign) {
    throw new Error(data.message ?? "Failed to update campaign");
  }
  return data.campaign;
};

export const deleteCampaign = async (
  brandId: string,
  campaignId: string,
): Promise<void> => {
  const response = await fetch(
    `${getApiBaseUrl()}/brandhub/brands/${brandId}/campaigns/${campaignId}`,
    { method: "DELETE", headers: { ...brandAuth.authHeaders() } },
  );
  throwForBrandApiStatus(response);
  if (!response.ok) {
    const data = await readJson<{ message?: string }>(response);
    throw new Error(data.message ?? "Failed to delete campaign");
  }
};

export const fetchAllCampaigns = async (filters?: {
  status?: string;
  brandId?: string;
}): Promise<Campaign[]> => {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  if (filters?.brandId) params.set("brandId", filters.brandId);
  const qs = params.toString();

  const response = await fetch(
    `${getApiBaseUrl()}/brands/campaigns${qs ? `?${qs}` : ""}`,
    { headers: adminAuth.authHeaders() },
  );
  // Not an empty list: a failure here must reach AdminDashboard's error
  // banner rather than read as "no deals"/"no campaigns" (issue #42).
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}). Please try again.`);
  }
  const data = await readJson<{
    success?: boolean;
    campaigns?: Record<string, unknown>[];
  }>(response);
  return (data.campaigns ?? []).map((c) => {
    const brand = c.brand;
    const brandId =
      typeof brand === "object" && brand !== null && "_id" in brand
        ? String((brand as { _id: string })._id)
        : String(brand ?? "");
    const docId = String(c._id ?? c.id ?? "");
    return { ...(c as unknown as Campaign), id: docId, _id: docId, brand: brandId };
  });
};

export const registerBrand = async (
  payload: RegisterBrandPayload,
): Promise<RegisterBrandResponse> => {
  const formDataPayload = new FormData();
  formDataPayload.append("companyName", payload.companyName);
  formDataPayload.append("brandName", payload.brandName);
  formDataPayload.append("category", payload.category);
  formDataPayload.append("website", payload.website);
  formDataPayload.append("appLink", payload.appLink);
  formDataPayload.append("address", payload.address);
  formDataPayload.append("description", payload.description);
  formDataPayload.append("contactName", payload.contactName);
  formDataPayload.append("contactPhone", payload.contactPhone);
  formDataPayload.append("contactEmail", payload.contactEmail);
  formDataPayload.append("registrationNumber", payload.registrationNumber);
  formDataPayload.append("domain", payload.domain);
  formDataPayload.append("themeColor", payload.themeColor);
  if (payload.logo) {
    formDataPayload.append("logo", payload.logo);
  }

  const response = await fetch(`${getApiBaseUrl()}/brands/register`, {
    method: "POST",
    body: formDataPayload,
  });

  const data = await readJson<RegisterBrandResponse>(response);

  if (!response.ok) {
    throw new Error(data.message ?? "Registration failed");
  }

  return data;
};
