export const isValidEmail = (email: string): string | null =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? null
    : "Enter a valid email address";

// Matches a plausible domain, optionally with a scheme/port/path — e.g.
// "example.com", "www.example.co.uk", "https://example.ae/path". Checks
// shape only (TLD is 2+ letters, no whitelist), not that it resolves.
const URL_SHAPE_PATTERN = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/\S*)?$/;

export const isValidUrl = (url: string): string | null =>
  URL_SHAPE_PATTERN.test(url.trim())
    ? null
    : "Enter a valid URL (e.g. example.com)";

// Because the scheme is optional above, stored links are routinely bare
// domains. A bare domain in an href is resolved RELATIVE to the current page,
// so "example.com" navigates within BrandHub instead of leaving it — hence
// this must be applied to every user-supplied link before rendering.
//
// Only http(s) passes through untouched: prefixing everything else means a
// hostile "javascript:..." value becomes an inert "https://javascript:..."
// rather than executing when clicked.
export const toExternalHref = (url: string | null | undefined): string | undefined => {
  const trimmed = url?.trim();
  if (!trimmed) return undefined;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

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

export const DATE_ORDER_MESSAGE = "End date must be after the start date";

const toDate = (value: Date | string | null | undefined): Date | null => {
  if (!value) return null;
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

// Calendar pickers deal in whole days, so range bounds must ignore the time
// component — otherwise "today" reads as already past.
export const startOfDay = (value: Date | string | null | undefined): Date | null => {
  const date = toDate(value);
  if (!date) return null;
  date.setHours(0, 0, 0, 0);
  return date;
};

export const today = (): Date => startOfDay(new Date())!;

// Bound for a native <input type="date">: the "yyyy-MM-dd" day `offset` days
// from `value`, or undefined when there is nothing to bound against.
export const isoDayOffset = (
  value: Date | string | null | undefined,
  offset: number,
): string | undefined => {
  const day = startOfDay(value);
  if (!day) return undefined;
  day.setDate(day.getDate() + offset);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${day.getFullYear()}-${pad(day.getMonth() + 1)}-${pad(day.getDate())}`;
};

// Only enforced when both ends are present — either date on its own is valid,
// and required-ness is each schema's own concern.
export const isValidDateRange = (
  start: Date | string | null | undefined,
  end: Date | string | null | undefined,
): string | null => {
  const from = toDate(start);
  const to = toDate(end);
  if (!from || !to) return null;
  return to.getTime() > from.getTime() ? null : DATE_ORDER_MESSAGE;
};

export const minLength = (value: string, min: number, label: string): string | null =>
  value.trim().length >= min
    ? null
    : `${label} must be at least ${min} characters`;
