import { Brand, BrandStatus, Campaign, Deal } from "@/types";
import { adminAuth } from "@/lib/adminAuth";

export interface BrandAnalytics {
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

interface FetchBrandsResponse {
  success?: boolean;
  brands?: Brand[];
  message?: string;
}

const getApiBaseUrl = () =>
  import.meta.env.VITE_API_URL ??
  "https://mint-rewards-mern-next-js.vercel.app/api";

export const fetchBrands = async (): Promise<Brand[]> => {
  const response = await fetch(`${getApiBaseUrl()}/brands`, {
    headers: adminAuth.authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch brands");
  }

  const data = (await response.json()) as Brand[] | FetchBrandsResponse;

  if (Array.isArray(data)) {
    return data;
  }

  if (data.success === false) {
    throw new Error(data.message ?? "Failed to fetch brands");
  }

  if (Array.isArray(data.brands)) {
    return data.brands;
  }

  return [];
};

export const fetchBrandById = async (id: string): Promise<Brand> => {
  const response = await fetch(`${getApiBaseUrl()}/brands/${id}`);

  const data = (await response.json()) as {
    success?: boolean;
    brand?: Record<string, unknown>;
    message?: string;
  };

  if (!response.ok || !data.brand) {
    throw new Error(data.message ?? "Brand not found");
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
    appLink: (raw.appLink as string) ?? "",
    category: raw.category as string,
    description: raw.description as string,
    address: raw.address as string,
    domain: raw.domain as string,
    status,
    createdAt: ((raw.createdAt ?? raw.created_at) as string) ?? new Date().toISOString(),
  };
};

export const fetchCampaignsForBrand = async (
  brandId: string,
): Promise<Campaign[]> => {
  const response = await fetch(
    `${getApiBaseUrl()}/brands/${brandId}/campaigns`,
  );

  if (!response.ok) return [];

  const data = (await response.json()) as {
    success?: boolean;
    campaigns?: Record<string, unknown>[];
  };

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
  },
): Promise<Campaign> => {
  let body: BodyInit;
  let headers: Record<string, string> | undefined;

  if (payload.banner instanceof File) {
    const fd = new FormData();
    fd.append("name", payload.name);
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
  } else {
    const { banner: _b, ...rest } = payload;
    const clean = Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== null && v !== undefined),
    );
    body = JSON.stringify(clean);
    headers = { "Content-Type": "application/json" };
  }

  const response = await fetch(
    `${getApiBaseUrl()}/brands/${brandId}/campaigns`,
    { method: "POST", headers, body },
  );

  const data = (await response.json()) as {
    success?: boolean;
    campaign?: Campaign;
    message?: string;
  };

  if (!response.ok || !data.campaign) {
    throw new Error(data.message ?? "Failed to create campaign");
  }

  return data.campaign;
};

export const fetchDealsForBrand = async (brandId: string): Promise<Deal[]> => {
  const response = await fetch(`${getApiBaseUrl()}/brands/${brandId}/deals`);
  if (!response.ok) return [];
  const data = (await response.json()) as {
    success?: boolean;
    deals?: Record<string, unknown>[];
  };
  return (data.deals ?? []).map((d) => {
    const docId = String(d._id ?? d.id ?? "");
    return { ...(d as unknown as Deal), id: docId, _id: docId };
  });
};

export const createDeal = async (
  brandId: string,
  payload: {
    title: string;
    description?: string;
    discountPercentage?: number | null;
    discountAmount?: number | null;
    promoCode?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    maxUses?: number | null;
    minimumPurchase?: number | null;
  },
): Promise<Deal> => {
  const response = await fetch(`${getApiBaseUrl()}/brands/${brandId}/deals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as {
    success?: boolean;
    deal?: Deal;
    message?: string;
  };

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
    description: string;
    webLink: string;
    appLink: string;
    phone: string;
    address: string;
    domain: string;
    themeColor: string;
    contactName: string;
  }>,
): Promise<Brand> => {
  const response = await fetch(
    `${getApiBaseUrl()}/brands/${brandId}/settings`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  const data = (await response.json()) as {
    success?: boolean;
    brand?: Record<string, unknown>;
    message?: string;
  };

  if (!response.ok || !data.brand) {
    throw new Error(data.message ?? "Failed to update settings");
  }

  return data.brand as unknown as Brand;
};

export const fetchBrandAnalytics = async (
  brandId: string,
): Promise<BrandAnalytics | null> => {
  try {
    const response = await fetch(
      `${getApiBaseUrl()}/brands/${brandId}/analytics`,
    );
    if (!response.ok) return null;
    const data = (await response.json()) as {
      success?: boolean;
      analytics?: BrandAnalytics;
    };
    return data.analytics ?? null;
  } catch {
    return null;
  }
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
  if (!response.ok) return [];
  const data = (await response.json()) as {
    success?: boolean;
    deals?: Record<string, unknown>[];
  };
  return (data.deals ?? []).map((d) => {
    const brand = d.brand;
    const brandId =
      typeof brand === "object" && brand !== null && "_id" in brand
        ? String((brand as { _id: string })._id)
        : String(brand ?? "");
    return { ...(d as unknown as Deal), brandId };
  });
};

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
    status: "active" | "inactive" | "expired";
  }>,
): Promise<Deal> => {
  const response = await fetch(
    `${getApiBaseUrl()}/brands/${brandId}/deals/${dealId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  const data = (await response.json()) as {
    success?: boolean;
    deal?: Deal;
    message?: string;
  };
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
    `${getApiBaseUrl()}/brands/${brandId}/deals/${dealId}`,
    { method: "DELETE" },
  );
  if (!response.ok) {
    const data = (await response.json()) as { message?: string };
    throw new Error(data.message ?? "Failed to delete deal");
  }
};

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
  const data = (await response.json()) as {
    success?: boolean;
    campaign?: Campaign;
    message?: string;
  };
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
    `${getApiBaseUrl()}/brands/${brandId}/campaigns/${campaignId}`,
    { method: "DELETE" },
  );
  if (!response.ok) {
    const data = (await response.json()) as { message?: string };
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
  if (!response.ok) return [];
  const data = (await response.json()) as {
    success?: boolean;
    campaigns?: Record<string, unknown>[];
  };
  return (data.campaigns ?? []).map((c) => {
    const brand = c.brand;
    const brandId =
      typeof brand === "object" && brand !== null && "_id" in brand
        ? String((brand as { _id: string })._id)
        : String(brand ?? "");
    return { ...(c as unknown as Campaign), brand: brandId };
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

  const data = (await response.json()) as RegisterBrandResponse;

  if (!response.ok) {
    throw new Error(data.message ?? "Registration failed");
  }

  return data;
};
