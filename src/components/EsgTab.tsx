import type { BrandAnalytics } from "@/actions/brandActions";
import type { Campaign, Deal } from "@/types";
import {
  Award,
  Building2,
  BarChart3,
  Car,
  Download,
  Lightbulb,
  Recycle,
  Tag,
  Target,
  TreeDeciduous,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bar,
  BarChart as RechartsBarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { isCampaignApproved, isCampaignLiveNow, toMs } from "@/lib/metrics";
import { dealStatusConfig } from "@/lib/dealStatus";

// Append two-digit hex alpha to a hex color string for opacity variants
const hex = (color: string, alpha: string) => color + alpha;

// CO₂ savings per kg recycled, by material. These are client-side equivalence
// factors applied to the REAL weights from analytics.environmental — the
// headline CO₂ figure itself comes straight from the backend.
const CO2_SAVINGS_PER_KG: Record<string, number> = {
  paper: 3.3,
  cardboard: 3.3,
  plastic: 2.0,
  glass: 0.5,
  aluminum: 9.0,
  steel: 1.5,
  electronic: 4.0,
  organic: 0.3,
};

// Real-world equivalences computed FROM the backend's co2AvoidedKg figure.
const EQUIVALENT_CONVERSIONS = {
  treesPlanted: 0.025,
  kmDriving: 4.6,
  lightBulbHours: 100,
};

const MATERIAL_COLORS: Record<string, string> = {
  paper: "#10B981",
  cardboard: "#059669",
  plastic: "#8B5CF6",
  glass: "#3B82F6",
  aluminum: "#F59E0B",
  steel: "#64748B",
  electronic: "#EF4444",
  organic: "#84CC16",
};

const materialColor = (material: string, index: number) =>
  MATERIAL_COLORS[material.toLowerCase()] ??
  ["#10B981", "#8B5CF6", "#3B82F6", "#F59E0B", "#EF4444", "#64748B"][index % 6];

// UPPERCASE four-value campaign moderation statuses — EXPIRED renders muted,
// never lumped into rejected or active.
const CAMPAIGN_STATUS_STYLES: Record<string, { label: string; className: string }> = {
  APPROVED: { label: "Active", className: "bg-success/10 text-success" },
  PENDING: { label: "Pending", className: "bg-warning/10 text-warning" },
  REJECTED: { label: "Rejected", className: "bg-destructive/10 text-destructive" },
  EXPIRED: { label: "Expired", className: "bg-muted text-muted-foreground" },
};

const statusOrder = ["APPROVED", "PENDING", "REJECTED", "EXPIRED"] as const;

const formatKg = (kg: number) =>
  kg >= 1000 ? `${(kg / 1000).toFixed(1)}K kg` : `${kg.toLocaleString()} kg`;

// A record belongs to the selected period when its [startDate, endDate] window
// overlaps [from, to]. Missing edges are treated as open-ended.
const overlapsPeriod = (
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  from: number | null,
  to: number | null,
): boolean =>
  toMs(startDate, -Infinity) <= (to ?? Infinity) &&
  toMs(endDate, Infinity) >= (from ?? -Infinity);

// ESG summary drawn ONLY from figures the backend actually returns. The CSV
// export contains exactly the numbers shown on screen — nothing else.
const EsgTab: React.FC<{
  analytics?: BrandAnalytics | null;
  loading?: boolean;
  error?: string | null;
  brandColor?: string;
  // The real campaign/deal lists — same source Overview and Promotions use.
  campaigns?: Campaign[];
  deals?: Deal[];
  campaignsUnavailable?: boolean;
  dealsUnavailable?: boolean;
  // Whether the campaigns/deals fetch has actually completed — `campaigns`/
  // `deals` start as `[]` (truthy) before that, so this is the only reliable
  // "the count below is real, not just not-yet-loaded" signal.
  campaignsLoaded?: boolean;
  dealsLoaded?: boolean;
  // Filters the Campaigns/Deals breakdowns below. Engagement and
  // environmental figures stay all-time regardless — this tab's headline
  // figures always come from `analytics`, never from the period-scoped fetch.
  // Unset/empty bounds mean "all time".
  period?: { from: Date | null; to: Date | null };
  // const periodFrom = period?.from ? period.from.getTime() : null;
  // const periodTo = period?.to ? period.to.getTime() : null;
  // Period-scoped analytics (same shape as `analytics`, re-fetched per
  // `period` — mirrors how Overview's own analytics prop is period-scoped).
  // Supplies the real per-campaign redemption counts and the byStatus/dealStats
  // fallbacks for the Campaigns/Deals tabs below; falls back to `analytics`
  // (all-time) while the period fetch is in flight or unset.
  periodAnalytics?: BrandAnalytics | null;
  periodLoading?: boolean;
  periodError?: string | null;
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
  period,
  periodAnalytics,
  periodLoading = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6 space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-20" />
          </Card>
        ))}
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <Card>
        <CardContent className="p-10 text-center space-y-2">
          <h3 className="font-semibold">Couldn't load ESG data</h3>
          <p className="text-sm text-muted-foreground">
            {error ?? "ESG data is unavailable right now. Please try again later."}
          </p>
        </CardContent>
      </Card>
    );
  }

  // `campaignsLoaded`/`dealsLoaded` (not just array truthiness) gate this:
  // the arrays start as `[]` before the fetch resolves, which would
  // otherwise read as "confirmed zero".
  const campaignsReady = campaignsLoaded && Boolean(campaigns) && !campaignsUnavailable;
  const dealsReady = dealsLoaded && Boolean(deals) && !dealsUnavailable;

  // Same definition Overview uses (see isCampaignLiveNow): derived from the
  // real campaign list, falling back to the backend aggregate only when that
  // list failed to load. Both tabs must report one number for one label.
  const activeCampaigns = campaignsReady
    ? campaigns!.filter(isCampaignLiveNow).length
    : analytics.summary.activeCampaigns;

  const totalCampaigns = campaignsReady
    ? campaigns!.length
    : analytics.summary.totalCampaigns;

  // Same rule Overview applies to its Total Redemptions figure: all-time
  // redemptions are measured against every campaign that was ever approved,
  // ended ones included. The backend has no equivalent aggregate, so without
  // the list we omit the context rather than quote a different denominator.
  const approvedCampaigns = campaignsReady
    ? campaigns!.filter(isCampaignApproved).length
    : null;

  // All-time deal counts, from the real deal list — the same source and
  // fallback rule Overview uses. The Deal Inventory tab below reports the
  // period-scoped totals instead, per this tab's headline/breakdown split.
  const totalDeals = dealsReady ? deals!.length : analytics.dealStats.total;
  const activeDeals = dealsReady
    ? deals!.filter((d) => (d.status ?? "").toLowerCase() === "active").length
    : analytics.dealStats.active;

  // The backend omits `environmental` for brands with no environmentalStats;
  // default to zeros so a fresh brand renders instead of crashing.
  const environmental = analytics.environmental ?? {
    totalWasteKg: 0,
    co2AvoidedKg: 0,
    materialBreakdown: [],
  };

  const breakdown = environmental.materialBreakdown.map((item, index) => ({
    name: item.material,
    value: item.weightKg,
    color: materialColor(item.material, index),
    percentage:
      environmental.totalWasteKg > 0
        ? Math.round((item.weightKg / environmental.totalWasteKg) * 100)
        : 0,
  }));

  // Sum of the per-material estimates below. Kept separate from the backend's
  // co2AvoidedKg (shown as its own KPI above) so the CO₂ card's rows always
  // add up to the total printed at its foot.
  const estimatedCo2Total = breakdown.reduce(
    (sum, item) => sum + item.value * (CO2_SAVINGS_PER_KG[item.name.toLowerCase()] ?? 1.0),
    0,
  );

  const co2Avoided = environmental.co2AvoidedKg;
  const treesEquivalent = Math.round(co2Avoided * EQUIVALENT_CONVERSIONS.treesPlanted);
  const drivingEquivalent = Math.round(co2Avoided * EQUIVALENT_CONVERSIONS.kmDriving);
  const lightBulbEquivalent = Math.round(co2Avoided * EQUIVALENT_CONVERSIONS.lightBulbHours);

  const equivalents = [
    {
      icon: TreeDeciduous,
      label: "Trees planted",
      detail: `${treesEquivalent.toLocaleString()} trees' worth of annual CO₂ absorption`,
    },
    {
      icon: Car,
      label: "Driving avoided",
      detail: `${drivingEquivalent.toLocaleString()} km of car emissions`,
    },
    {
      icon: Lightbulb,
      label: "LED lighting",
      detail: `${lightBulbEquivalent.toLocaleString()} hours powered`,
    },
  ];

  // Every figure carries a comparator or equivalent — a bare number proves
  // nothing (PRODUCT.md principle 1). All context is derived from figures
  // already on this page; nothing here is estimated beyond what's labelled.
  const plural = (count: number, singular: string, pluralForm: string) =>
    `${count.toLocaleString()} ${count === 1 ? singular : pluralForm}`;

  const figures: {
    label: string;
    value: number;
    unit?: string;
    context?: string;
  }[] = [
    {
      label: "Active Campaigns",
      value: activeCampaigns,
      context: `of ${plural(totalCampaigns, "campaign", "campaigns")} total`,
    },
    {
      label: "Active Deals",
      value: activeDeals,
      context: `of ${plural(totalDeals, "deal", "deals")} total`,
    },
    {
      label: "Total Redemptions",
      value: analytics.summary.totalRedemptions,
      context:
        approvedCampaigns !== null
          ? `across ${plural(activeDeals, "approved deal", "approved deals")}`
          : undefined,
    },
    ...(analytics.environmental
      ? [
          {
            label: "Total Waste Collected",
            value: analytics.environmental.totalWasteKg,
            unit: "kg",
            context:
              breakdown.length > 0
                ? `across ${plural(breakdown.length, "material type", "material types")}`
                : undefined,
          },
          {
            label: "CO₂ Avoided",
            value: analytics.environmental.co2AvoidedKg,
            unit: "kg",
            context: `≈ ${plural(treesEquivalent, "tree", "trees")} planted`,
          },
          ...analytics.environmental.materialBreakdown.map((item, index) => ({
            label: `${item.material} Collected`,
            value: item.weightKg,
            unit: "kg",
            context:
              environmental.totalWasteKg > 0
                ? `${breakdown[index]?.percentage ?? 0}% of total waste`
                : undefined,
          })),
        ]
      : []),
  ];

  const exportCsv = () => {
    const rows = [
      ["Metric", "Value", "Unit", "Context"],
      ...figures.map((f) => [f.label, String(f.value), f.unit ?? "", f.context ?? ""]),
      [],
      ["Generated", new Date().toISOString().slice(0, 10), "", ""],
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `esg-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Campaign/deal breakdowns are derived from the real lists — the same
  // source Overview uses — scoped to the selected period by date-window
  // overlap. The period-aggregated analytics summary measures activity
  // *within* the window, so its counts drift from what's actually in scope;
  // we fall back to it only when a list failed to load. Redemptions are
  // joined from the period-scoped fetch, exactly like Overview does, falling
  // back to all-time analytics while that fetch is in flight.
  const periodFrom = period?.from ? period.from.getTime() : null;
  const periodTo = period?.to ? period.to.getTime() : null;
  const scopedAnalytics = periodAnalytics ?? analytics;

  const campaignsInScope = campaignsReady
    ? campaigns!.filter((c) => overlapsPeriod(c.startDate, c.endDate, periodFrom, periodTo))
    : [];
  const dealsInScope = dealsReady
    ? deals!.filter((d) => overlapsPeriod(d.startDate, d.endDate, periodFrom, periodTo))
    : [];

  const campaignByStatus: Record<string, number> = campaignsReady
    ? campaignsInScope.reduce<Record<string, number>>((acc, c) => {
        const key = String(c.status ?? "").toUpperCase();
        if (key) acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      }, {})
    : scopedAnalytics.campaigns.byStatus;

  // Per-campaign redemptions are genuine period analytics; join them onto the
  // real campaign list by id so the performance list stays accurate.
  const redemptionsById = new Map(
    (scopedAnalytics.campaigns.list ?? []).map((c) => [c.id, c.redemptions]),
  );
  const campaignList: {
    id: string;
    name: string;
    status: string;
    // null = the analytics join found no entry for this campaign, which is not
    // the same claim as "zero redemptions"; rendered as an em dash.
    redemptions: number | null;
  }[] = campaignsReady
    ? campaignsInScope.map((c) => ({
        id: c.id,
        name: c.name ?? "Untitled campaign",
        status: String(c.status ?? "").toUpperCase(),
        redemptions: redemptionsById.get(c.id) ?? null,
      }))
    : (scopedAnalytics.campaigns.list ?? []).map((c) => ({
        id: c.id,
        name: c.name,
        status: c.status,
        redemptions: c.redemptions,
      }));

  // Deals also carry pending/rejected statuses, so the three named buckets
  // don't account for the total on their own — everything else lands in
  // `other` and Total always reconciles with the parts.
  const dealStatusOf = (deal: Deal) => (deal.status ?? "").toLowerCase();
  const dealCounts = dealsReady
    ? {
        total: dealsInScope.length,
        active: dealsInScope.filter((d) => dealStatusOf(d) === "active").length,
        inactive: dealsInScope.filter((d) => dealStatusOf(d) === "inactive").length,
        expired: dealsInScope.filter((d) => dealStatusOf(d) === "expired").length,
        other: dealsInScope.filter(
          (d) => !["active", "inactive", "expired"].includes(dealStatusOf(d)),
        ).length,
      }
    : {
        ...scopedAnalytics.dealStats,
        other: Math.max(
          0,
          scopedAnalytics.dealStats.total -
            scopedAnalytics.dealStats.active -
            scopedAnalytics.dealStats.inactive -
            scopedAnalytics.dealStats.expired,
        ),
      };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">ESG Reporting</h2>
          <p className="text-sm text-muted-foreground">
            Environmental and engagement figures from your brand's activity
          </p>
        </div>
        <Button variant="outline" onClick={exportCsv}>
          <Download className="h-4 w-4 mr-2" aria-hidden="true" />
          Export CSV
        </Button>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {figures.map((figure) => (
          <Card key={figure.label} className="p-4">
            <dt className="text-sm text-muted-foreground">{figure.label}</dt>
            <dd className="mt-1">
              <p className="text-2xl font-bold text-foreground tabular-nums">
                {figure.value.toLocaleString()}
                {figure.unit && (
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    {figure.unit}
                  </span>
                )}
              </p>
              {figure.context && (
                <p className="mt-0.5 text-xs text-muted-foreground">{figure.context}</p>
              )}
            </dd>
          </Card>
        ))}
      </dl>

      <Tabs defaultValue="impact" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="impact">Impact</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
        </TabsList>

        {/* Impact */}
        <TabsContent value="impact" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <span>Waste Collection</span>
                </CardTitle>
                <CardDescription>Collected materials linked to your brand</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 pb-4 border-b">
                  <p className="text-3xl font-bold text-foreground tabular-nums">
                    {formatKg(environmental.totalWasteKg)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total collected, all-time</p>
                </div>
                {breakdown.length > 0 ? (
                  <div className="space-y-3">
                    {breakdown.map((item) => (
                      <div key={item.name} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                            aria-hidden="true"
                          />
                          <span className="text-sm font-medium truncate">{item.name}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold tabular-nums">
                            {item.value.toLocaleString()} kg
                          </p>
                          <p className="text-xs text-muted-foreground tabular-nums">
                            {item.percentage}% of total
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-4">
                    No collections have been attributed to your brand yet. Material weights appear
                    here once recycling activity is linked to your campaigns.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Recycle className="h-5 w-5" style={{ color: brandColor }} />
                  <span>CO₂ Savings</span>
                </CardTitle>
                <CardDescription>
                  Estimated per material from standard recycling equivalence factors.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {breakdown.length > 0 ? (
                  <div className="space-y-3">
                    {breakdown.map((item) => {
                      const factor = CO2_SAVINGS_PER_KG[item.name.toLowerCase()] ?? 1.0;
                      return (
                        <div key={item.name} className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: item.color }}
                              aria-hidden="true"
                            />
                            <span className="text-sm font-medium truncate">{item.name}</span>
                          </div>
                          <p className="text-sm font-semibold tabular-nums shrink-0">
                            {(item.value * factor).toFixed(1)} kg CO₂
                          </p>
                        </div>
                      );
                    })}
                    <div className="flex items-center justify-between gap-3 border-t pt-3 mt-1">
                      <span className="text-sm font-semibold">Total estimated</span>
                      <span
                        className="text-lg font-bold tabular-nums"
                        style={{ color: brandColor }}
                      >
                        {estimatedCo2Total.toFixed(1)} kg CO₂
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-4">
                    No material weights yet, so there is nothing to estimate against.
                  </p>
                )}
              </CardContent>
            </Card>

            {breakdown.length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    <span>Waste Breakdown & Distribution</span>
                  </CardTitle>
                  <CardDescription>
                    Visual breakdown of collected waste by material type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Weight by Material (kg)</h4>
                      <ChartContainer
                        config={{ value: { label: "Weight (kg)", color: brandColor } }}
                        className="h-[250px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart data={breakdown} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
                            <XAxis
                              dataKey="name"
                              tickLine={false}
                              axisLine={false}
                              tick={{ fontSize: 12 }}
                            />
                            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]} fill={brandColor} />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Distribution by Percentage</h4>
                      <ChartContainer
                        config={Object.fromEntries(
                          breakdown.map((item) => [
                            item.name.toLowerCase(),
                            { label: item.name, color: item.color },
                          ]),
                        )}
                        className="h-[250px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={breakdown}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {breakdown.map((entry) => (
                                <Cell key={entry.name} fill={entry.color} />
                              ))}
                            </Pie>
                            <ChartTooltip content={<ChartTooltipContent />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-3">
                        {breakdown.map((type) => (
                          <div key={type.name} className="flex items-center gap-2 min-w-0">
                            <div
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: type.color }}
                              aria-hidden="true"
                            />
                            <span className="text-xs text-muted-foreground truncate">
                              {type.name} {type.percentage}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-foreground" />
                  <span>Environmental Equivalents</span>
                </CardTitle>
                <CardDescription>
                  Real-world impact of {environmental.co2AvoidedKg.toLocaleString()} kg CO₂ avoided
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {equivalents.map(({ icon: Icon, label, detail }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div
                        className="h-9 w-9 shrink-0 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: hex(brandColor, "1a") }}
                      >
                        <Icon
                          className="h-4 w-4"
                          style={{ color: brandColor }}
                          aria-hidden="true"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium">{label}</p>
                        <p className="text-sm text-muted-foreground">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Campaigns */}
        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <span>Campaign Performance</span>
              </CardTitle>
              <CardDescription>
                Moderation status and redemptions across your campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border border border-border rounded-lg overflow-hidden mb-6">
                {statusOrder.map((status) => (
                  <div key={status} className="p-4">
                    <p
                      className={`text-2xl font-bold tabular-nums ${
                        status === "EXPIRED" ? "text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {campaignByStatus[status] ?? 0}
                    </p>
                    <span
                      className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${CAMPAIGN_STATUS_STYLES[status].className}`}
                    >
                      {CAMPAIGN_STATUS_STYLES[status].label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {campaignList.length > 0 ? (
                  campaignList.slice(0, 5).map((campaign) => {
                    const style =
                      CAMPAIGN_STATUS_STYLES[campaign.status] ?? CAMPAIGN_STATUS_STYLES.EXPIRED;
                    return (
                      <div
                        key={campaign.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: hex(brandColor, "1a") }}
                          >
                            <Award className="h-5 w-5" style={{ color: brandColor }} />
                          </div>
                          <div>
                            <p className="font-medium">{campaign.name}</p>
                            {periodLoading ? (
                              <Skeleton className="h-3 w-24 mt-1" />
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                {campaign.redemptions == null
                                  ? "— redemptions"
                                  : `${campaign.redemptions.toLocaleString()} redemptions`}
                              </p>
                            )}
                          </div>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${style.className}`}
                        >
                          {style.label}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground py-6">
                    No campaigns in the selected period. Widen the statistics period above, or
                    create a campaign to start seeing performance data.
                  </p>
                )}
                {campaignList.length > 5 && (
                  <p className="text-xs text-muted-foreground pt-1">
                    Showing 5 of {campaignList.length.toLocaleString()} campaigns. The full list
                    lives in the Promotions tab.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deals */}
        <TabsContent value="deals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <span>Deal Inventory</span>
              </CardTitle>
              <CardDescription>
                Status of your promotional deals{" "}
                <span className="text-muted-foreground/70">· selected period</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border border border-border rounded-lg overflow-hidden">
                {[
                  { status: "active", value: dealCounts.active },
                  { status: "pending", value: dealCounts.other },
                  { status: "Rejected", value: dealCounts.inactive },
                  { status: "expired", value: dealCounts.expired },
                ].map(({ status, value }) => {
                  const config = dealStatusConfig(status);
                  return (
                    <div key={status} className="p-4">
                      <p
                        className={`text-2xl font-bold tabular-nums ${
                          status === "expired" ? "text-muted-foreground" : "text-foreground"
                        }`}
                      >
                        {value}
                      </p>
                      <span
                        className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${config.chipClassName}`}
                      >
                        {config.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Same row treatment as Campaign Performance above, so the two
                  breakdowns in this tab read as one list style. */}
              {dealsReady && (
                <div className="space-y-3 mt-6">
                  {dealsInScope.length > 0 ? (
                    dealsInScope.slice(0, 5).map((deal) => {
                      const config = dealStatusConfig(deal.status);
                      const codeCount = deal.codeCount ?? deal.codes?.length ?? 0;
                      const meta = [
                        deal.discountPercentage != null ? `${deal.discountPercentage}% off` : null,
                        deal.discountAmount != null ? `$${deal.discountAmount} off` : null,
                        codeCount > 0 ? `${codeCount} ${codeCount === 1 ? "code" : "codes"}` : null,
                        deal.maxUses != null ? `${deal.currentUses ?? 0}/${deal.maxUses} uses` : null,
                      ].filter(Boolean);
                      return (
                        <div
                          key={deal.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                              style={{ backgroundColor: hex(brandColor, "1a") }}
                            >
                              <Tag
                                className="h-5 w-5"
                                style={{ color: brandColor }}
                                aria-hidden="true"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate">{deal.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {meta.length > 0 ? meta.join(" · ") : "No discount details"}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${config.chipClassName}`}
                          >
                            {config.label}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground py-6">
                      No deals in the selected period. Widen the statistics period above to see
                      more.
                    </p>
                  )}
                  {dealsInScope.length > 5 && (
                    <p className="text-xs text-muted-foreground pt-1">
                      Showing 5 of {dealsInScope.length.toLocaleString()} deals. The full list
                      lives in the Promotions tab.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <p className="text-sm text-muted-foreground max-w-[70ch]">
        Figures are drawn live from your brand analytics. Headline metrics and environmental
        totals are all-time; the campaign and deal breakdowns follow the statistics period above.
        The CSV export contains exactly the metrics displayed here, with a generation date.
      </p>
    </div>
  );
};

export default EsgTab;
