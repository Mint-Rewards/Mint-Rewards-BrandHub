export const isValidEmail = (email: string): string | null =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? null
    : "Enter a valid email address";

export const isValidUrl = (url: string): string | null =>
  url.trim().length > 0
    ? null
    : "Enter a valid URL";

export const isValidPhone = (phone: string): string | null => {
  const digits = phone.replace(/\D/g, "");
  return /^\+/.test(phone) && digits.length >= 7 && digits.length <= 15
    ? null
    : "Enter a valid international phone number (7–15 digits)";
};

export const isValidDomain = (domain: string): string | null =>
  /^[a-z0-9-]+\.[a-z]{2,}$/i.test(domain)
    ? null
    : "Enter a valid domain (e.g., company.com)";

export const isValidHex = (hex: string): string | null =>
  /^#[0-9A-Fa-f]{6}$/.test(hex)
    ? null
    : "Enter a valid hex color (e.g., #3B82F6)";

export const minLength = (value: string, min: number, label: string): string | null =>
  value.trim().length >= min
    ? null
    : `${label} must be at least ${min} characters`;
