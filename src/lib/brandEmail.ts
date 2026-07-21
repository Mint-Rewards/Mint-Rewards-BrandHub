import type { Brand } from "@/types";

// Brands created via the quick org-signup flow get a synthesized
// `brand-<id>@brandhub.local` placeholder for `email` (the schema
// requires a unique value at creation time), with the org owner's real
// email stashed in `contactName` instead. Brands from the full
// application form don't hit this path — their `email` is already
// correct and `contactName` holds an actual contact person's name.
export const isPlaceholderBrandEmail = (email?: string) =>
  !!email && /^brand-[^@]+@brandhub\.local$/i.test(email);

export const resolveBrandEmail = (brand: Pick<Brand, "email" | "contactName">) => {
  if (isPlaceholderBrandEmail(brand.email) && brand.contactName?.includes("@")) {
    return brand.contactName;
  }
  return brand.email;
};
