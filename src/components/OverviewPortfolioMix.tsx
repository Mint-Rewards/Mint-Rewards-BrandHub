import type { Campaign } from "@/types";
import { parseAudiences } from "@/lib/audience";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mirrors the campaign type vocabulary in CreateCampaignForm. Values are stored
// camelCase; anything unrecognised falls through to "Unspecified" rather than
// being dropped, so the column always accounts for every campaign.
const CAMPAIGN_TYPE_LABELS: Record<string, string> = {
  general: "General",
  productLaunch: "Product Launch",
  brandAwareness: "Brand Awareness",
  seasonal: "Seasonal",
  influencer: "Influencer Marketing",
};

const UNSPECIFIED = "Unspecified";

interface Tally {
  label: string;
  count: number;
}

// Descending by count, then alphabetical so equal counts have a stable order.
// "Unspecified" always sinks to the bottom: it's an absence, not a category.
const rank = (tallies: Map<string, number>): Tally[] =>
  [...tallies.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => {
      if (a.label === UNSPECIFIED) return 1;
      if (b.label === UNSPECIFIED) return -1;
      return b.count - a.count || a.label.localeCompare(b.label);
    });

const tallyTypes = (campaigns: Campaign[]): Tally[] => {
  const counts = new Map<string, number>();
  for (const campaign of campaigns) {
    const raw = campaign.campaignType?.trim();
    const label = raw ? (CAMPAIGN_TYPE_LABELS[raw] ?? raw) : UNSPECIFIED;
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return rank(counts);
};

const tallyAudiences = (campaigns: Campaign[]): Tally[] => {
  const counts = new Map<string, number>();
  for (const campaign of campaigns) {
    const segments = parseAudiences(campaign.targetAudience);
    if (segments.length === 0) {
      counts.set(UNSPECIFIED, (counts.get(UNSPECIFIED) ?? 0) + 1);
      continue;
    }
    // De-dupe within one campaign so a repeated segment can't inflate its count.
    for (const segment of new Set(segments.map((s) => s.trim()))) {
      counts.set(segment, (counts.get(segment) ?? 0) + 1);
    }
  }
  return rank(counts);
};

interface ColumnProps {
  heading: string;
  note: string;
  tallies: Tally[];
  denominator: number;
  emptyMessage: string;
  brandColor: string;
  limit?: number;
}

const MixColumn: React.FC<ColumnProps> = ({
  heading,
  note,
  tallies,
  denominator,
  emptyMessage,
  brandColor,
  limit = 6,
}) => {
  const shown = tallies.slice(0, limit);
  const hidden = tallies.length - shown.length;

  return (
    <div className="min-w-0">
      <h4 className="text-sm font-medium">{heading}</h4>
      <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>

      {shown.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <dl className="mt-3 space-y-2.5">
          {shown.map(({ label, count }) => {
            const share = denominator > 0 ? (count / denominator) * 100 : 0;
            return (
              <div key={label}>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-sm truncate">{label}</dt>
                  <dd className="shrink-0 text-xs text-muted-foreground tabular-nums">
                    {count.toLocaleString()} · {Math.round(share)}%
                  </dd>
                </div>
                <div
                  className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted"
                  aria-hidden="true"
                >
                  <div
                    className={`h-full rounded-full transition-[width] duration-200 ease-out motion-reduce:transition-none ${
                      label === UNSPECIFIED ? "bg-muted-foreground/30" : ""
                    }`}
                    style={{
                      width: `${Math.max(share, 2)}%`,
                      // Unspecified is an absence, so it stays neutral rather
                      // than claiming brand color like a real segment.
                      backgroundColor: label === UNSPECIFIED ? undefined : brandColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </dl>
      )}

      {hidden > 0 && (
        <p className="mt-2.5 text-xs text-muted-foreground">
          + {hidden.toLocaleString()} more
        </p>
      )}
    </div>
  );
};

const OverviewPortfolioMix: React.FC<{
  campaigns?: Campaign[];
  campaignsUnavailable?: boolean;
  brandColor: string;
}> = ({ campaigns, campaignsUnavailable = false, brandColor }) => {
  const unavailable = campaignsUnavailable || !campaigns;
  const list = campaigns ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Portfolio mix</CardTitle>
        <CardDescription>
          What kinds of campaigns you run, and who they're aimed at.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {unavailable ? (
          <p className="text-sm text-muted-foreground">
            The campaign list didn't load, so the mix is unavailable.
          </p>
        ) : list.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No campaigns yet. Once you create one, its type and audience appear
            here.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
            <MixColumn
              heading="By type"
              note={`Share of ${list.length.toLocaleString()} ${
                list.length === 1 ? "campaign" : "campaigns"
              }`}
              tallies={tallyTypes(list)}
              denominator={list.length}
              emptyMessage="No campaign types recorded yet."
              brandColor={brandColor}
            />
            <MixColumn
              heading="By audience"
              note="Campaigns per segment — a campaign may target several"
              tallies={tallyAudiences(list)}
              denominator={list.length}
              emptyMessage="No audience segments recorded yet."
              brandColor={brandColor}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OverviewPortfolioMix;
