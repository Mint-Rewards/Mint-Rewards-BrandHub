import { Brand } from "@/types";

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
  "https://mint-rewards-backend.vercel.app/api";

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
