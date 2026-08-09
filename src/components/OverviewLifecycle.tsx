import { useState } from "react";
import type { Campaign, Deal } from "@/types";
import {
  ENDING_SOON_DAYS,
  endsWithinDays,
  lifecycleOf,
  type DatedRecord,
  type LifecycleBucket,
} from "@/lib/metrics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Display order runs from most to least current, so the eye lands on what's
// running before what's finished.
const BUCKET_ORDER: LifecycleBucket[] = [
  "live",
  "scheduled",
  "awaiting",
  "draft",
  "paused",
  "ended",
  "rejected",
];

// Labels match the status vocabulary the Campaigns and Deals tabs use in their
// badges and filters — a stage named here is a word the user can go and filter
// by. `live` is the one exception: it merges the campaign "Approved" and deal
// "Active" statuses, so it needs a neutral word that is true of both.
const BUCKET_LABELS: Record<LifecycleBucket, string> = {
  live: "Live",
  scheduled: "Scheduled",
  awaiting: "Pending",
  draft: "Draft",
  paused: "Inactive",
  ended: "Expired",
  rejected: "Rejected",
};

type Tone =
  // `fallbackClassName` matches the alpha as closely as a token can, for when
  // the brand color can't be used (see `normalizeHex`).
  | { kind: "brand"; alpha: string; fallbackClassName: string }
  | { kind: "class"; className: string };

// Live and Scheduled carry the brand's own color (they're the brand's active
// surface area); moderation and end states use the shared status vocabulary.
const BUCKET_TONES: Record<LifecycleBucket, Tone> = {
  live: { kind: "brand", alpha: "", fallbackClassName: "bg-primary" },
  scheduled: { kind: "brand", alpha: "59", fallbackClassName: "bg-primary/35" },
  awaiting: { kind: "class", className: "bg-warning" },
  draft: { kind: "class", className: "bg-muted-foreground/20" },
  paused: { kind: "class", className: "bg-muted-foreground/50" },
  ended: { kind: "class", className: "bg-muted-foreground/30" },
  rejected: { kind: "class", className: "bg-destructive/50" },
};

const HEX_COLOR = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

// `themeColor` reaches us straight off the brand record with no validation, so
// it can be a 3-digit hex, a hex with no `#`, or not hex at all (`rgb(...)`, a
// CSS keyword, an empty string). Appending an alpha suffix to any of those
// yields an invalid color, and browsers drop invalid colors silently — the
// segment would paint transparent and the bar would quietly under-report a
// total it promises adds up. Anything we can't normalize returns null and the
// caller falls back to a theme token.
const normalizeHex = (color: string | null | undefined): string | null => {
  const match = HEX_COLOR.exec(String(color ?? "").trim());
  if (!match) return null;
  const hex = match[1].toLowerCase();
  return hex.length === 3
    ? `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
    : `#${hex}`;
};

const toneStyle = (bucket: LifecycleBucket, brandHex: string | null) => {
  // Falls back to neutral rather than crashing if a new bucket ever lands here
  // without a tone entry.
  const tone = BUCKET_TONES[bucket] ?? {
    kind: "class" as const,
    className: "bg-muted-foreground/30",
  };
  if (tone.kind !== "brand") {
    return { style: undefined, className: tone.className };
  }
  return brandHex
    ? { style: { backgroundColor: brandHex + tone.alpha }, className: "" }
    : { style: undefined, className: tone.fallbackClassName };
};

// The lists are typed but never validated at the boundary, so a malformed
// response can hand us a non-array, or an array with null holes that would
// throw inside `lifecycleOf`. A bad payload for one list must not blank the
// whole Overview tab. Holes are dropped from the total too, not just from the
// buckets — a record we can't place in a stage must not inflate a total the
// stages are supposed to add up to.
const usableRecords = (records: unknown): DatedRecord[] | null =>
  Array.isArray(records)
    ? records.filter(
        (record): record is DatedRecord =>
          typeof record === "object" && record !== null,
      )
    : null;

// Seeded from BUCKET_ORDER rather than an object literal: this project builds
// with `strict: false`, so a literal missing a bucket would not be a type error
// — it would silently produce `undefined + 1 = NaN`, and a whole bucket would
// vanish from a card that promises its parts add up.
const countBuckets = (
  records: DatedRecord[],
): Record<LifecycleBucket, number> => {
  const counts = Object.fromEntries(
    BUCKET_ORDER.map((bucket) => [bucket, 0]),
  ) as Record<LifecycleBucket, number>;
  for (const record of records) {
    const bucket = lifecycleOf(record);
    counts[bucket] = (counts[bucket] ?? 0) + 1;
  }
  return counts;
};

// Ordered by BUCKET_ORDER, but sourced from the counts themselves so a bucket
// that exists in the data can never be dropped from the display — anything
// unranked sorts to the end rather than disappearing.
const visibleBuckets = (
  counts: Record<LifecycleBucket, number>,
): LifecycleBucket[] =>
  (Object.keys(counts) as LifecycleBucket[])
    .filter((bucket) => counts[bucket] > 0)
    .sort((a, b) => {
      const ai = BUCKET_ORDER.indexOf(a);
      const bi = BUCKET_ORDER.indexOf(b);
      return (
        (ai === -1 ? Number.MAX_SAFE_INTEGER : ai) -
        (bi === -1 ? Number.MAX_SAFE_INTEGER : bi)
      );
    });

interface TrackProps {
  title: string;
  // Optional, and re-checked at runtime: an absent list is an unloaded list.
  records: DatedRecord[] | undefined;
  unavailable: boolean;
  brandHex: string | null;
  // Both forms are passed in rather than built with `noun + "s"`, so the copy
  // stays whole sentences a translator can work with.
  noun: string;
  nounPlural: string;
}

const LifecycleTrack: React.FC<TrackProps> = ({
  title,
  records,
  unavailable,
  brandHex,
  noun,
  nounPlural,
}) => {
  // Hovering or focusing a legend row highlights its own bar segment (and
  // vice versa) so the two halves of the chart read as one object, not two.
  const [hoveredBucket, setHoveredBucket] = useState<LifecycleBucket | null>(
    null,
  );

  const usable = usableRecords(records);

  // A list that isn't a list didn't load, whatever the flag says — reporting it
  // as "none yet" would be a lie about the brand's own data.
  if (unavailable || usable === null) {
    return (
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The {noun} list didn't load, so this breakdown is unavailable.
        </p>
      </div>
    );
  }

  const total = usable.length;

  if (total === 0) {
    return (
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          No {nounPlural} yet. Once you create one, its stage shows up here.
        </p>
      </div>
    );
  }

  const counts = countBuckets(usable);
  const visible = visibleBuckets(counts);
  const endingSoon = usable.filter(
    (record) =>
      lifecycleOf(record) === "live" &&
      endsWithinDays(record, ENDING_SOON_DAYS),
  ).length;

  // Computed once and shared by the bar and the legend below, so the two
  // never derive slightly different numbers for the same bucket.
  const segments = visible.map((bucket) => ({
    bucket,
    tone: toneStyle(bucket, brandHex),
    widthPct: (counts[bucket] / total) * 100,
    displayPct: Math.round((counts[bucket] / total) * 100),
  }));

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground tabular-nums">
          {total.toLocaleString()} total
        </p>
      </div>

      <div
        className="mt-2 flex h-2.5 w-full overflow-hidden rounded-full bg-muted"
        aria-hidden="true"
      >
        {segments.map(({ bucket, tone, widthPct }) => {
          const isDimmed = hoveredBucket !== null && hoveredBucket !== bucket;
          const isEmphasized = hoveredBucket === bucket;
          return (
            <div
              key={bucket}
              onMouseEnter={() => setHoveredBucket(bucket)}
              onMouseLeave={() => setHoveredBucket(null)}
              className={cn(
                "h-full transition-[width,filter,opacity] duration-200 ease-out motion-reduce:transition-none",
                isEmphasized && "brightness-110",
                isDimmed && "opacity-40",
                tone.className,
              )}
              style={{
                // minWidth keeps a bucket of 1-in-10,000 visible instead of
                // rounding away to nothing; the flex row absorbs the overshoot.
                width: `${widthPct}%`,
                minWidth: "2px",
                ...tone.style,
              }}
            />
          );
        })}
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
        {segments.map(({ bucket, tone, displayPct }) => (
          <div
            key={bucket}
            tabIndex={0}
            onMouseEnter={() => setHoveredBucket(bucket)}
            onMouseLeave={() => setHoveredBucket(null)}
            onFocus={() => setHoveredBucket(bucket)}
            onBlur={() => setHoveredBucket(null)}
            aria-label={`${BUCKET_LABELS[bucket] ?? bucket}: ${counts[bucket].toLocaleString()} of ${total.toLocaleString()} (${displayPct}%)`}
            className="flex items-center gap-2 min-w-0 -mx-1.5 rounded-md px-1.5 py-0.5 transition-colors duration-150 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <dt className="flex items-center gap-2 min-w-0 text-xs text-muted-foreground">
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${tone.className}`}
                style={tone.style}
                aria-hidden="true"
              />
              <span className="truncate">
                {BUCKET_LABELS[bucket] ?? bucket}
              </span>
            </dt>
            {/* shrink-0 so a six-figure count squeezes the label (which
                truncates) rather than wrapping itself. Percentage is
                aria-hidden — the row's own aria-label already states it. */}
            <dd className="flex items-baseline gap-1 text-xs font-semibold tabular-nums shrink-0">
              {counts[bucket].toLocaleString()}
              <span
                aria-hidden="true"
                className={cn(
                  "font-normal text-muted-foreground transition-opacity duration-150",
                  hoveredBucket === bucket ? "opacity-100" : "opacity-0",
                )}
              >
                {displayPct}%
              </span>
            </dd>
          </div>
        ))}
      </dl>

      {endingSoon > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          {endingSoon.toLocaleString()} of {counts.live.toLocaleString()} live{" "}
          {counts.live === 1 ? noun : nounPlural}{" "}
          {endingSoon === 1 ? "ends" : "end"} in the next {ENDING_SOON_DAYS} days.
        </p>
      )}
    </div>
  );
};

const OverviewLifecycle: React.FC<{
  campaigns?: Campaign[];
  deals?: Deal[];
  campaignsUnavailable?: boolean;
  dealsUnavailable?: boolean;
  brandColor?: string;
}> = ({
  campaigns,
  deals,
  campaignsUnavailable = false,
  dealsUnavailable = false,
  brandColor,
}) => {
  const brandHex = normalizeHex(brandColor);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Campaign and deal stages</CardTitle>
        <CardDescription>
          Each campaign and deal counts in exactly one stage, so the stages add
          up to the total.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <LifecycleTrack
          title="Campaigns"
          noun="campaign"
          nounPlural="campaigns"
          records={campaigns}
          unavailable={campaignsUnavailable}
          brandHex={brandHex}
        />
        <LifecycleTrack
          title="Deals"
          noun="deal"
          nounPlural="deals"
          records={deals}
          unavailable={dealsUnavailable}
          brandHex={brandHex}
        />
      </CardContent>
    </Card>
  );
};

export default OverviewLifecycle;
