import { z } from "zod";
import { isValidPhone } from "@/lib/validators";

// Validation rules for a brand's editable profile. Shared by the brand-side
// SettingsTab and the admin-side AdminEditBrandDialog so both surfaces accept
// exactly the same values as the backend's field whitelists.
export const brandProfileSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),
  companyName: z.string().min(1, "Company name is required"),
  category: z.string().min(1, "Category is required"),
  contactName: z.string().optional(),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phone: z
    .string()
    .refine((value) => !value || isValidPhone(value) === null, "Enter a valid international phone number")
    .optional(),
  webLink: z.string().optional(),
  appLink: z.string().optional(),
  description: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  themeColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Use a valid hex colour")
    .optional()
    .or(z.literal("")),
});

export type BrandProfileFormData = z.infer<typeof brandProfileSchema>;

// Admins may additionally set the brand's email domain, which brands
// themselves don't manage from Settings.
export const adminBrandProfileSchema = brandProfileSchema.extend({
  domain: z.string().optional(),
});

export type AdminBrandProfileFormData = z.infer<typeof adminBrandProfileSchema>;
