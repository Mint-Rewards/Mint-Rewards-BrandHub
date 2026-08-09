import type { Deal } from "@/types";

/**
 * How many redemptions a deal can serve, for display.
 *
 * Mirrors the backend's lib/dealCapacity.ts. The server sends `capacity` and
 * `remaining` and those are authoritative — this module only covers responses
 * that predate those fields, and it deliberately never falls back to `maxUses`
 * for an inventory deal: a stale maxUses above the code count is what made this
 * UI advertise "1/100 uses" on a deal the app was showing as Sold Out.
 */

export function dealCodeCount(deal: Deal): number {
  return deal.codeCount ?? deal.codes?.length ?? 0;
}

/** `null` means uncapped (an uncapped shared deal), not unknown. */
export function dealCapacity(deal: Deal): number | null {
  if (deal.capacity !== undefined) return deal.capacity;

  // Pre-capacity response. A shared deal's ceiling is maxUses; an inventory
  // deal's is its code count, whatever maxUses says.
  if (deal.codeMode === "shared") return deal.maxUses ?? null;
  return dealCodeCount(deal);
}

export function dealRemaining(deal: Deal): number | null {
  if (deal.remaining !== undefined) return deal.remaining;

  const capacity = dealCapacity(deal);
  if (capacity === null) return null;
  return Math.max(0, capacity - (deal.currentUses ?? 0));
}

/**
 * "12/100 uses", or "12 uses" when the deal is uncapped. Returns null when
 * there is nothing meaningful to show (no codes yet).
 */
export function formatDealUses(deal: Deal): string | null {
  const used = deal.currentUses ?? 0;
  const capacity = dealCapacity(deal);

  if (capacity === null) {
    return deal.codeMode === "shared" ? `${used} uses` : null;
  }
  if (capacity <= 0) return null;
  return `${used}/${capacity} uses`;
}

/** True when the deal can serve no further redemptions. */
export function isDealExhausted(deal: Deal): boolean {
  const remaining = dealRemaining(deal);
  return remaining !== null && remaining <= 0;
}
