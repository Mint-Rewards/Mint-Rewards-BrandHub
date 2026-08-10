/**
 * Helpers shared by the admin edit dialogs (brand, campaign, deal).
 *
 * All three send only the fields the admin actually touched: an untouched
 * field must never overwrite the stored value, since these dialogs prefill
 * from a resolved/derived view of the record rather than the raw document.
 */

// react-hook-form's dirtyFields is a deep partial of the form shape; for our
// flat forms a per-key boolean is all we need.
type DirtyMap<T> = Partial<Record<keyof T, unknown>>;

export const pickDirtyValues = <T extends Record<string, unknown>>(
  data: T,
  dirtyFields: DirtyMap<T>,
): Partial<T> => {
  const out: Partial<T> = {};
  for (const key of Object.keys(data) as (keyof T)[]) {
    if (dirtyFields[key]) out[key] = data[key];
  }
  return out;
};

/** ISO timestamp -> the `YYYY-MM-DD` an <input type="date"> expects. */
export const toDateInputValue = (value?: string | null): string => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

/** `YYYY-MM-DD` from a date input -> ISO string, or null when cleared. */
export const fromDateInputValue = (value: string): string | null => {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

/** Numeric text field -> number, or null when cleared. */
export const toNullableNumber = (value: string): number | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
};
