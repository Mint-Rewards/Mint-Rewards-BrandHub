import { Brand, BrandStatus, Campaign } from "@/types";

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
  const response = await fetch(`${getApiBaseUrl()}/brands`);

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
    campaigns?: Campaign[];
  };

  return data.campaigns ?? [];
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
  },
): Promise<Campaign> => {
  const response = await fetch(
    `${getApiBaseUrl()}/brands/${brandId}/campaigns`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
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
