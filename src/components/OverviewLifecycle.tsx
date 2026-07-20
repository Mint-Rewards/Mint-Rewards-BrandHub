import type { Campaign, Deal } from "@/types";
import {
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

// How far ahead "ending soon" looks. Two weeks is roughly the window in which a
// brand manager can still act on a campaign before it closes.
const ENDING_SOON_DAYS = 14;

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

const BUCKET_LABELS: Record<LifecycleBucket, string> = {
  live: "Live now",
  scheduled: "Scheduled",
  awaiting: "Awaiting approval",
  draft: "Draft",
  paused: "Inactive",
  ended: "Ended",
  rejected: "Rejected",
};

type Tone =
  | { kind: "brand"; alpha: string }
  | { kind: "class"; className: string };

// Live and Scheduled carry the brand's own color (they're the brand's active
// surface area); moderation and end states use the shared status vocabulary.
const BUCKET_TONES: Record<LifecycleBucket, Tone> = {
  live: { kind: "brand", alpha: "" },
  scheduled: { kind: "brand", alpha: "59" },
  awaiting: { kind: "class", className: "bg-warning" },
  draft: { kind: "class", className: "bg-muted-foreground/20" },
  paused: { kind: "class", className: "bg-muted-foreground/50" },
  ended: { kind: "class", className: "bg-muted-foreground/30" },
  rejected: { kind: "class", className: "bg-destructive/50" },
};

const toneStyle = (bucket: LifecycleBucket, brandColor: string) => {
  // Falls back to neutral rather than crashing if a new bucket ever lands here
  // without a tone entry.
  const tone = BUCKET_TONES[bucket] ?? {
    kind: "class" as const,
    className: "bg-muted-foreground/30",
  };
  return tone.kind === "brand"
    ? { style: { backgroundColor: brandColor + tone.alpha }, className: "" }
    : { style: undefined, className: tone.className };
};

// Seeded from BUCKET_ORDER rather than an object literal: this project builds
// with `strict: false`, so a literal missing a bucket would not be a type error
// — it would silently produce `undefined + 1 = NaN`, and a whole bucket would
// vanish from a card that promises its parts add up.
const countBuckets = (records: DatedRecord[]): Record<LifecycleBucket, number> => {
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
const visibleBuckets = (counts: Record<LifecycleBucket, number>): LifecycleBucket[] =>
  (Object.keys(counts) as LifecycleBucket[])
    .filter((bucket) => counts[bucket] > 0)
    .sort((a, b) => {
      const ai = BUCKET_ORDER.indexOf(a);
      const bi = BUCKET_ORDER.indexOf(b);
      return (ai === -1 ? Number.MAX_SAFE_INTEGER : ai) - (bi === -1 ? Number.MAX_SAFE_INTEGER : bi);
    });

interface TrackProps {
  title: string;
  records: DatedRecord[];
  unavailable: boolean;
  brandColor: string;
  noun: string;
}

const LifecycleTrack: React.FC<TrackProps> = ({
  title,
  records,
  unavailable,
  brandColor,
  noun,
}) => {
  if (unavailable) {
    return (
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The {noun} list didn't load, so its breakdown is unavailable.
        </p>
      </div>
    );
  }

  const total = records.length;

  if (total === 0) {
    return (
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          No {noun}s yet. Once you create one it will appear here with its stage.
        </p>
      </div>
    );
  }

  const counts = countBuckets(records);
  const visible = visibleBuckets(counts);
  const endingSoon = records.filter(
    (record) => lifecycleOf(record) === "live" && endsWithinDays(record, ENDING_SOON_DAYS),
  ).length;

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
        {visible.map((bucket) => {
          const tone = toneStyle(bucket, brandColor);
          return (
            <div
              key={bucket}
              className={`h-full transition-[width] duration-200 ease-out motion-reduce:transition-none ${tone.className}`}
              style={{ width: `${(counts[bucket] / total) * 100}%`, ...tone.style }}
            />
          );
        })}
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
        {visible.map((bucket) => {
          const tone = toneStyle(bucket, brandColor);
          return (
            <div key={bucket} className="flex items-center gap-2 min-w-0">
              <dt className="flex items-center gap-2 min-w-0 text-xs text-muted-foreground">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${tone.className}`}
                  style={tone.style}
                  aria-hidden="true"
                />
                <span className="truncate">{BUCKET_LABELS[bucket] ?? bucket}</span>
              </dt>
              <dd className="text-xs font-semibold tabular-nums ml-auto">
                {counts[bucket].toLocaleString()}
              </dd>
            </div>
          );
        })}
      </dl>

      {endingSoon > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          {endingSoon.toLocaleString()} of {counts.live.toLocaleString()} live{" "}
          {counts.live === 1 ? noun : `${noun}s`} end within {ENDING_SOON_DAYS} days.
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
  brandColor: string;
}> = ({
  campaigns,
  deals,
  campaignsUnavailable = false,
  dealsUnavailable = false,
  brandColor,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Where things stand</CardTitle>
      <CardDescription>
        Every campaign and deal sits in exactly one stage, so the parts add up to
        the total.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <LifecycleTrack
        title="Campaigns"
        noun="campaign"
        records={campaigns ?? []}
        unavailable={campaignsUnavailable || !campaigns}
        brandColor={brandColor}
      />
      <LifecycleTrack
        title="Deals"
        noun="deal"
        records={deals ?? []}
        unavailable={dealsUnavailable || !deals}
        brandColor={brandColor}
      />
    </CardContent>
  </Card>
);

export default OverviewLifecycle;
