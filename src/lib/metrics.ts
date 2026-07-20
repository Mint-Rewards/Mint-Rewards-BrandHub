import type { Campaign } from "@/types";

// Parse an ISO date to epoch ms, falling back for missing/invalid values.
export const toMs = (value: string | null | undefined, fallback: number): number => {
  if (!value) return fallback;
  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? fallback : ms;
};

/** True for a bare "YYYY-MM-DD" string with no time component. */
const isDateOnly = (value: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(value.trim());

// A bare "YYYY-MM-DD" end date is inclusive through the end of that day in
// LOCAL time. Mirrors the backend's lib/campaignDates.ts exactly: plain
// `new Date("2026-07-20")` parses as UTC midnight, which — in any timezone
// ahead of UTC — has already passed by local morning, making a campaign or
// deal read as "ended" for most of its actual last day. Only end dates get
// this treatment; start dates match the backend's own (accepted) plain
// parsing via toMs.
const endBoundaryMs = (value: string | null | undefined, fallback: number): number => {
  if (!value) return fallback;
  if (isDateOnly(value)) {
    const [y, m, d] = value.trim().split("-").map(Number);
    return new Date(y, m - 1, d, 23, 59, 59, 999).getTime();
  }
  return toMs(value, fallback);
};

// An "active" campaign is APPROVED and live in its own date window today.
// Mirrors the backend's isActive()/isCampaignActive() (lib/campaignDates.ts)
// exactly, so this and the backend's own analytics aggregate never disagree
// — and so Overview and ESG report the same number for the same label.
export const isCampaignLiveNow = (campaign: Campaign): boolean => {
  if (String(campaign.status ?? "").toUpperCase() !== "APPROVED") return false;
  const now = Date.now();
  return (
    now >= toMs(campaign.startDate, -Infinity) &&
    now <= endBoundaryMs(campaign.endDate, Infinity)
  );
};

// Anything with a moderation status and a date window — campaigns and deals
// both satisfy this, which is why the bucketing below is shared.
export interface DatedRecord {
  status?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

// Statuses that a closed date window is allowed to override. A rejected,
// pending or draft record keeps its own status forever: "never approved" and
// "ran its course" are different facts, and collapsing them would hide a
// moderation backlog behind a muted Expired chip.
const EXPIRABLE_STATUSES = new Set(["approved", "active", "inactive"]);

// True for a record whose end date has passed while its stored status still
// claims otherwise. The backend flips these itself eventually; until it does,
// the UI must not show a green Active badge on a deal that ended last week.
export const hasExpired = (record: DatedRecord): boolean =>
  EXPIRABLE_STATUSES.has(String(record.status ?? "").toLowerCase()) &&
  endBoundaryMs(record.endDate, Infinity) < Date.now();

// The status a record should be *presented* as. Campaign statuses are
// UPPERCASE across the API and deal statuses lowercase, and every call site
// already compares in its own casing — hence one rule, two wrappers.
export const effectiveCampaignStatus = (record: DatedRecord): string =>
  hasExpired(record) ? "EXPIRED" : String(record.status ?? "").toUpperCase();

export const effectiveDealStatus = (record: DatedRecord): string =>
  hasExpired(record) ? "expired" : String(record.status ?? "").toLowerCase();

export type LifecycleBucket =
  | "awaiting"
  | "draft"
  | "paused"
  | "scheduled"
  | "live"
  | "ended"
  | "rejected";

// Every record lands in exactly ONE bucket, so the parts always sum back to the
// total. Order is load-bearing: an explicit status always outranks the date
// window, because a rejected, draft or deactivated record is not "live" just
// because today happens to sit inside its dates.
//
// Campaign statuses (CampaignStatus): pending | approved | rejected | draft.
// Deal statuses (DealStatus): pending | active | rejected | inactive | expired.
// Both are case-inconsistent across the API, hence the lowercase compare.
export const lifecycleOf = (record: DatedRecord): LifecycleBucket => {
  const status = String(record.status ?? "").toLowerCase();
  if (status === "rejected") return "rejected";
  if (status === "pending") return "awaiting";
  if (status === "draft") return "draft";
  if (status === "inactive") return "paused";
  if (status === "expired") return "ended";

  const now = Date.now();
  if (endBoundaryMs(record.endDate, Infinity) < now) return "ended";
  if (toMs(record.startDate, -Infinity) > now) return "scheduled";
  return "live";
};

// A flag applied to records already bucketed as `live` — deliberately not its
// own bucket, which would double-count against `live`.
export const endsWithinDays = (record: DatedRecord, days: number): boolean => {
  const end = endBoundaryMs(record.endDate, Infinity);
  if (!Number.isFinite(end)) return false;
  const now = Date.now();
  return end >= now && end <= now + days * 24 * 60 * 60 * 1000;
};
