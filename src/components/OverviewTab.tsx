import type { BrandAnalytics } from "@/actions/brandActions";
import {
  AlertCircle,
  Award,
  BarChart3,
  Building2,
  Recycle,
  Tag,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";

// Append two-digit hex alpha to a hex color string for opacity variants
const hex = (color: string, alpha: string) => color + alpha;

// CO₂ savings per kg recycled, by material. These are client-side equivalence
// factors applied to the REAL weights from analytics.environmental — the
// headline CO₂ figure itself comes straight from the backend.
const CO2_SAVINGS_PER_KG: Record<string, number> = {
  paper: 3.3, // Paper recycling saves ~3.3 kg CO2 per kg
  cardboard: 3.3, // Similar to paper
  plastic: 2.0, // Plastic recycling saves ~2 kg CO2 per kg
  glass: 0.5, // Glass recycling saves ~0.5 kg CO2 per kg
  aluminum: 9.0, // Aluminum recycling saves ~9 kg CO2 per kg (highest impact)
  steel: 1.5, // Steel recycling saves ~1.5 kg CO2 per kg
  electronic: 4.0, // E-waste recycling saves ~4 kg CO2 per kg
  organic: 0.3, // Composting organic waste saves ~0.3 kg CO2 per kg
};

// Real-world equivalences computed FROM the backend's co2AvoidedKg figure.
const EQUIVALENT_CONVERSIONS = {
  treesPlanted: 0.025, // 1 kg CO2 saved = ~0.025 trees planted (40kg CO2 per tree per year)
  kmDriving: 4.6, // 1 kg CO2 saved = ~4.6 km of driving (average car emits 0.21 kg CO2/km)
  lightBulbHours: 100, // 1 kg CO2 saved = ~100 hours of LED light bulb usage
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
  PENDING: { label: "Pending", className: "bg-warning/10 text-warning" },
  APPROVED: { label: "Approved", className: "bg-success/10 text-success" },
  REJECTED: { label: "Rejected", className: "bg-destructive/10 text-destructive" },
  EXPIRED: { label: "Expired", className: "bg-muted text-muted-foreground" },
};

const formatKg = (kg: number) =>
  kg >= 1000 ? `${(kg / 1000).toFixed(1)}K kg` : `${kg.toLocaleString()} kg`;

const OverviewSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px border border-border rounded-lg overflow-hidden">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-4 space-y-2 bg-card">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="p-6 space-y-4">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-40 w-full rounded-md" />
        </Card>
      ))}
    </div>
  </div>
);

const OverviewTab: React.FC<{
  analytics?: BrandAnalytics | null;
  loading?: boolean;
  error?: string | null;
  brandColor?: string;
}> = ({ analytics, loading, error, brandColor = "#008081" }) => {
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

  const { summary, campaigns, dealStats } = analytics;
  // The backend omits `environmental` for brands with no environmentalStats;
  // default to zeros so a fresh brand renders instead of crashing.
  const environmental = analytics.environmental ?? {
    totalWasteKg: 0,
    co2AvoidedKg: 0,
    materialBreakdown: [],
  };

  const hasAnyData =
    summary.totalCampaigns > 0 ||
    dealStats.total > 0 ||
    (environmental?.totalWasteKg ?? 0) > 0;

  const breakdown = (environmental?.materialBreakdown ?? []).map((item, index) => ({
    name: item.material,
    value: item.weightKg,
    color: materialColor(item.material, index),
    percentage:
      environmental.totalWasteKg > 0
        ? Math.round((item.weightKg / environmental.totalWasteKg) * 100)
        : 0,
  }));

  const co2Avoided = environmental?.co2AvoidedKg ?? 0;
  const treesEquivalent = (co2Avoided * EQUIVALENT_CONVERSIONS.treesPlanted).toFixed(0);
  const drivingEquivalent = (co2Avoided * EQUIVALENT_CONVERSIONS.kmDriving).toFixed(0);
  const lightBulbEquivalent = (co2Avoided * EQUIVALENT_CONVERSIONS.lightBulbHours).toFixed(0);

  const statusOrder = ["PENDING", "APPROVED", "REJECTED", "EXPIRED"] as const;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground" style={{ textWrap: "balance" }}>
          Sustainability Metrics & Recent Activity
        </h2>
        <p className="text-sm text-muted-foreground">
          Your brand's environmental impact and campaign performance
        </p>
      </div>

      {!hasAnyData && (
        <Card>
          <CardContent className="p-10 text-center space-y-3">
            <BarChart3 className="h-8 w-8 mx-auto text-muted-foreground" aria-hidden="true" />
            <h3 className="font-semibold">No activity yet</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Once your campaigns and deals start running, your metrics will appear here.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Summary stats — always from analytics.summary, never derived client-side */}
      <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">
        Campaign performance{" "}
        <span className="text-muted-foreground/70">· selected period</span>
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border border border-border rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Active Campaigns</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{summary.activeCampaigns}</p>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Unique Users</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {summary.uniqueUsers >= 1000
              ? `${(summary.uniqueUsers / 1000).toFixed(1)}K`
              : summary.uniqueUsers}
          </p>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Recycle className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Total Redemptions</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {summary.totalRedemptions.toLocaleString()}
          </p>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Total Campaigns</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{summary.totalCampaigns}</p>
        </div>
      </div>
      </div>

      {/* Environmental KPIs — real backend figures, always all-time */}
      {environmental && (
        <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Environmental impact <span className="text-muted-foreground/70">· all-time</span>
        </p>
        <div className="grid grid-cols-2 divide-x divide-border border border-border rounded-lg overflow-hidden">
          <div className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Waste Collected</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {formatKg(environmental.totalWasteKg)}
            </p>
          </div>
          <div className="p-4">
            <p className="text-xs font-medium text-muted-foreground">CO₂ Avoided</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {formatKg(environmental.co2AvoidedKg)}
            </p>
          </div>
        </div>
        </div>
      )}

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
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-foreground">
                    {formatKg(environmental.totalWasteKg)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total collected</p>
                </div>
                {breakdown.length > 0 ? (
                  <div className="space-y-3">
                    {breakdown.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{item.value.toLocaleString()} kg</p>
                          <p className="text-xs text-muted-foreground">{item.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No material data yet.
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
                  Estimated CO₂ avoided per material, from recycling equivalence factors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {breakdown.map((item) => {
                    const factor = CO2_SAVINGS_PER_KG[item.name.toLowerCase()] ?? 1.0;
                    return (
                      <div
                        key={item.name}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold" style={{ color: brandColor }}>
                            {(item.value * factor).toFixed(1)} kg CO₂
                          </p>
                          <p className="text-xs text-muted-foreground">saved</p>
                        </div>
                      </div>
                    );
                  })}
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total CO₂ Avoided:</span>
                      <span className="text-lg font-bold" style={{ color: brandColor }}>
                        {environmental.co2AvoidedKg.toLocaleString()} kg CO₂
                      </span>
                    </div>
                  </div>
                </div>
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
                          <BarChart data={breakdown}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]} fill={brandColor} />
                          </BarChart>
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
                      <div className="grid grid-cols-2 gap-1 mt-2">
                        {breakdown.map((type) => (
                          <div key={type.name} className="flex items-center space-x-1">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: type.color }}
                            />
                            <span className="text-xs">
                              {type.name}: {type.percentage}%
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
                  <div className="flex items-center space-x-3 p-3 bg-success/5 rounded-lg">
                    <div className="p-2 bg-success/20 rounded-lg">
                      <span className="text-lg" aria-hidden="true">🌳</span>
                    </div>
                    <div>
                      <p className="font-medium">Trees Planted Equivalent</p>
                      <p className="text-sm text-muted-foreground">
                        {treesEquivalent} trees worth of CO₂ absorption
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-muted/40 rounded-lg">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: hex(brandColor, "33") }}>
                      <span className="text-lg" aria-hidden="true">🚗</span>
                    </div>
                    <div>
                      <p className="font-medium">Driving Distance Saved</p>
                      <p className="text-sm text-muted-foreground">
                        {drivingEquivalent} km of car emissions avoided
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-muted/40 rounded-lg">
                    <div className="p-2 bg-warning/20 rounded-lg">
                      <span className="text-lg" aria-hidden="true">💡</span>
                    </div>
                    <div>
                      <p className="font-medium">LED Bulb Hours</p>
                      <p className="text-sm text-muted-foreground">
                        {lightBulbEquivalent} hours of LED lighting powered
                      </p>
                    </div>
                  </div>
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
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border border border-border rounded-lg overflow-hidden mb-6">
                {statusOrder.map((status) => (
                  <div key={status} className="p-4 text-center">
                    <p
                      className={`text-2xl font-bold ${
                        status === "EXPIRED" ? "text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {campaigns.byStatus[status] ?? 0}
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
                {campaigns.list.length > 0 ? (
                  campaigns.list.slice(0, 5).map((campaign) => {
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
                            <p className="text-sm text-muted-foreground">
                              {campaign.redemptions.toLocaleString()} redemptions
                            </p>
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
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    No campaigns yet — create your first campaign to see performance data.
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
              <CardDescription>Status of your promotional deals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border border border-border rounded-lg overflow-hidden">
                <div className="p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">{dealStats.total}</p>
                  <p className="text-sm text-muted-foreground mt-1">Total Deals</p>
                </div>
                <div className="p-4 text-center">
                  <p className="text-2xl font-bold text-success">{dealStats.active}</p>
                  <p className="text-sm text-muted-foreground mt-1">Active</p>
                </div>
                <div className="p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">{dealStats.inactive}</p>
                  <p className="text-sm text-muted-foreground mt-1">Inactive</p>
                </div>
                <div className="p-4 text-center">
                  <p className="text-2xl font-bold text-muted-foreground">{dealStats.expired}</p>
                  <p className="text-sm text-muted-foreground mt-1">Expired</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OverviewTab;
