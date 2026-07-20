import type { BrandAnalytics } from "@/actions/brandActions";
import type { Campaign, Deal } from "@/types";
import { AlertCircle, BarChart3, Recycle, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { isCampaignLiveNow } from "@/lib/metrics";
import OverviewLifecycle from "./OverviewLifecycle";
import OverviewPortfolioMix from "./OverviewPortfolioMix";
import OverviewAttention from "./OverviewAttention";

const formatKg = (kg: number) =>
  kg >= 1000 ? `${(kg / 1000).toFixed(1)}K kg` : `${kg.toLocaleString()} kg`;

// Same equivalence factor the ESG tab uses for its trees comparison, so the two
// surfaces never quote different equivalents for the same CO₂ figure.
const TREES_PER_KG_CO2 = 0.025;

const plural = (count: number, singular: string, pluralForm: string) =>
  `${count.toLocaleString()} ${count === 1 ? singular : pluralForm}`;

const OverviewSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-3 w-40" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px border border-border rounded-lg overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 space-y-2 bg-card">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton className="h-3 w-40" />
      <div className="grid grid-cols-2 gap-px border border-border rounded-lg overflow-hidden">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="p-4 space-y-2 bg-card">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
    </div>
    <Card className="p-6 space-y-4">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-2.5 w-full rounded-full" />
      <Skeleton className="h-2.5 w-full rounded-full" />
    </Card>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(2)].map((_, i) => (
        <Card key={i} className="p-6 space-y-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-24 w-full rounded-md" />
        </Card>
      ))}
    </div>
  </div>
);

// A figure tile: never a bare number — each carries a comparator drawn from
// data already on this page (PRODUCT.md principle 1).
const Figure: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
  context?: string;
}> = ({ icon: Icon, label, value, context }) => (
  <div className="p-4">
    <div className="flex items-center gap-2 mb-1">
      <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
    </div>
    <dd>
      <p className="text-2xl font-bold text-foreground tabular-nums">{value}</p>
      {context && <p className="mt-0.5 text-xs text-muted-foreground">{context}</p>}
    </dd>
  </div>
);

const OverviewTab: React.FC<{
  analytics?: BrandAnalytics | null;
  loading?: boolean;
  error?: string | null;
  brandColor?: string;
  // The real campaign/deal lists (source of truth for point-in-time counts).
  campaigns?: Campaign[];
  deals?: Deal[];
  campaignsUnavailable?: boolean;
  dealsUnavailable?: boolean;
  // Whether the campaigns/deals fetch has actually completed — `campaigns`/
  // `deals` start as `[]` (truthy) before that, so this is the only reliable
  // "the count below is real, not just not-yet-loaded" signal.
  campaignsLoaded?: boolean;
  dealsLoaded?: boolean;
  // Lets the attention digest and empty state hand the user off to the tab
  // that actually owns the work.
  onNavigate?: (tab: string) => void;
}> = ({
  analytics,
  loading,
  error,
  brandColor = "#008081",
  campaigns,
  deals,
  campaignsUnavailable = false,
  dealsUnavailable = false,
  campaignsLoaded = false,
  dealsLoaded = false,
  onNavigate,
}) => {
  if (loading) return <OverviewSkeleton />;

  if (error || !analytics) {
    return (
      <Card>
        <CardContent className="p-10 text-center space-y-3">
          <AlertCircle className="h-8 w-8 mx-auto text-destructive" aria-hidden="true" />
          <h3 className="font-semibold">Couldn't load analytics</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {error ?? "Analytics data is unavailable right now. Please try again later."}
          </p>
        </CardContent>
      </Card>
    );
  }

  const { summary } = analytics;
  // The backend omits `environmental` for brands with no environmentalStats;
  // default to zeros so a fresh brand renders instead of crashing.
  const environmental = analytics.environmental ?? {
    totalWasteKg: 0,
    co2AvoidedKg: 0,
    materialBreakdown: [],
  };

  // Point-in-time counts (active/total campaigns, deal total) are derived
  // from the real campaign/deal lists — the same source the Promotions tab
  // manages — falling back to the backend's all-time aggregate only when a
  // list failed to load. `campaignsLoaded`/`dealsLoaded` (not just array
  // truthiness) gate this: the arrays start as `[]` before the fetch
  // resolves, which would otherwise read as "confirmed zero".
  const campaignsReady = campaignsLoaded && Boolean(campaigns) && !campaignsUnavailable;
  const dealsReady = dealsLoaded && Boolean(deals) && !dealsUnavailable;

  const activeCampaigns = campaignsReady
    ? campaigns!.filter(isCampaignLiveNow).length
    : summary.activeCampaigns;
  const totalCampaigns = campaignsReady ? campaigns!.length : summary.totalCampaigns;

  const activeDeals = dealsReady ? deals!.filter((d) => d.status === "active").length : 0;
  const totalDeals = dealsReady ? deals!.length : analytics.dealStats.total;

  const redemptionsPerUser =
    summary.uniqueUsers > 0 ? summary.totalRedemptions / summary.uniqueUsers : 0;
  const treesEquivalent = Math.round(environmental.co2AvoidedKg * TREES_PER_KG_CO2);
  const materialCount = environmental.materialBreakdown.length;

  // A brand with nothing set up gets a first-run panel instead of a page of
  // zeroed bars. Environmental activity alone still counts as "started".
  const hasAnyData =
    totalCampaigns > 0 || totalDeals > 0 || environmental.totalWasteKg > 0;

  if (!hasAnyData) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground" style={{ textWrap: "balance" }}>
            Brand overview
          </h2>
          <p className="text-sm text-muted-foreground">
            Performance, portfolio and anything waiting on you
          </p>
        </div>
        <Card>
          <CardContent className="p-10 text-center space-y-3">
            <BarChart3 className="h-8 w-8 mx-auto text-muted-foreground" aria-hidden="true" />
            <h3 className="font-semibold">Nothing to report yet</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Once you launch a campaign or publish a deal, this page shows how
              they're performing, what stage each one is in, who they reach, and
              anything waiting on your approval.
            </p>
            {onNavigate && (
              <Button variant="outline" onClick={() => onNavigate("promotions")}>
                Create your first campaign
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground" style={{ textWrap: "balance" }}>
          Brand overview
        </h2>
        <p className="text-sm text-muted-foreground">
          Performance, portfolio and anything waiting on you
        </p>
      </div>

      {/* Engagement figures — backend aggregates, contextualised against the
          counts derived from the real lists. */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Campaign performance <span className="text-muted-foreground/70">· all-time</span>
        </p>
        <dl className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border border border-border rounded-lg overflow-hidden">
          <Figure
            icon={TrendingUp}
            label="Active Campaigns"
            value={activeCampaigns.toLocaleString()}
            context={`of ${plural(totalCampaigns, "campaign", "campaigns")} total`}
          />
          <Figure
            icon={Users}
            label="Unique Users"
            value={summary.uniqueUsers.toLocaleString()}
            context={
              summary.uniqueUsers > 0
                ? `${redemptionsPerUser.toFixed(1)} redemptions each`
                : undefined
            }
          />
          <Figure
            icon={Recycle}
            label="Total Redemptions"
            value={summary.totalRedemptions.toLocaleString()}
            context={`across ${plural(totalCampaigns, "campaign", "campaigns")}`}
          />
          <Figure
            icon={TrendingUp}
            label="Active Deals"
            value={activeDeals.toLocaleString()}
            context={`of ${plural(totalDeals, "deal", "deals")} total`}
          />
        </dl>
      </div>

      {/* Environmental KPIs — real backend figures, always all-time */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Environmental impact <span className="text-muted-foreground/70">· all-time</span>
        </p>
        <dl className="grid grid-cols-2 divide-x divide-border border border-border rounded-lg overflow-hidden">
          <Figure
            icon={Recycle}
            label="Waste Collected"
            value={formatKg(environmental.totalWasteKg)}
            context={
              materialCount > 0
                ? `across ${plural(materialCount, "material type", "material types")}`
                : undefined
            }
          />
          <Figure
            icon={BarChart3}
            label="CO₂ Avoided"
            value={formatKg(environmental.co2AvoidedKg)}
            context={
              environmental.co2AvoidedKg > 0
                ? `≈ ${plural(treesEquivalent, "tree", "trees")} planted`
                : undefined
            }
          />
        </dl>
      </div>

      <OverviewLifecycle
        campaigns={campaigns}
        deals={deals}
        campaignsUnavailable={campaignsUnavailable}
        dealsUnavailable={dealsUnavailable}
        brandColor={brandColor}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
        <OverviewPortfolioMix
          campaigns={campaigns}
          campaignsUnavailable={campaignsUnavailable}
          brandColor={brandColor}
        />
        <OverviewAttention
          campaigns={campaigns}
          deals={deals}
          campaignsUnavailable={campaignsUnavailable}
          dealsUnavailable={dealsUnavailable}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
};

export default OverviewTab;
