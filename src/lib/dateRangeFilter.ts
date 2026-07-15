import type { DateRange } from "react-day-picker";

interface DateRangeItem {
  startDate?: string | null;
  endDate?: string | null;
}

// An item matches the date filter if its [start, end] window overlaps the
// selected [from, to] window — mirrors the backend's overlap semantics so an
// item with no dates is never hidden by a period filter.
export function overlapsRange(item: DateRangeItem, range: DateRange | undefined): boolean {
  if (!range?.from && !range?.to) return true;
  const start = item.startDate ? new Date(item.startDate) : null;
  const end = item.endDate ? new Date(item.endDate) : null;
  if (range?.from && end && !Number.isNaN(end.getTime()) && end < range.from) return false;
  if (range?.to && start && !Number.isNaN(start.getTime()) && start > range.to) return false;
  return true;
}
