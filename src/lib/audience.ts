// Common audience segments for a rewards/sustainability campaign. Anything the
// brand needs beyond these is added through the "Others" chip.
export const PREDEFINED_AUDIENCES = [
  "Women",
  "Men",
  "Aged 18-24",
  "Aged 25-34",
  "Aged 35-44",
  "Aged 45-54",
  "Aged 55+",
  "Students",
  "Young Professionals",
  "Families",
  "Frequent Shoppers",
  "New Customers",
];

// The field is persisted as a single comma-joined string, so it round-trips
// through the existing string API without any backend change. Shared by the
// editor chips and the Overview portfolio breakdown, so both read the value
// exactly the way the form writes it.
export const parseAudiences = (value: string | null | undefined): string[] =>
  (value ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

export const isPredefinedAudience = (value: string) =>
  PREDEFINED_AUDIENCES.some((p) => p.toLowerCase() === value.toLowerCase());
