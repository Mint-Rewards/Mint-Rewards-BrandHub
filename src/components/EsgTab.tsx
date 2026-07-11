import type { BrandAnalytics } from "@/actions/brandActions";
import { Download, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// ESG summary drawn ONLY from figures the backend actually returns. The CSV
// export contains exactly the numbers shown on screen — nothing else.
const EsgTab: React.FC<{
  analytics?: BrandAnalytics | null;
  loading?: boolean;
  error?: string | null;
  brandColor?: string;
}> = ({ analytics, loading, error, brandColor = "#008081" }) => {
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

  const figures: { label: string; value: number; unit?: string }[] = [
    { label: "Active Campaigns", value: analytics.summary.activeCampaigns },
    { label: "Total Redemptions", value: analytics.summary.totalRedemptions },
    { label: "Unique Users", value: analytics.summary.uniqueUsers },
    ...(analytics.environmental
      ? [
          {
            label: "Total Waste Collected",
            value: analytics.environmental.totalWasteKg,
            unit: "kg",
          },
          {
            label: "CO₂ Avoided",
            value: analytics.environmental.co2AvoidedKg,
            unit: "kg",
          },
          ...analytics.environmental.materialBreakdown.map((item) => ({
            label: `${item.material} Collected`,
            value: item.weightKg,
            unit: "kg",
          })),
        ]
      : []),
  ];

  const exportCsv = () => {
    const rows = [
      ["Metric", "Value", "Unit"],
      ...figures.map((f) => [f.label, String(f.value), f.unit ?? ""]),
      [],
      ["Generated", new Date().toISOString().slice(0, 10), ""],
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6" style={{ color: brandColor }} aria-hidden="true" />
          <div>
            <h2 className="text-lg font-semibold text-foreground">ESG Reporting</h2>
            <p className="text-sm text-muted-foreground">
              Environmental and engagement figures from your brand's activity
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={exportCsv}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {figures.map((figure) => (
          <Card key={figure.label}>
            <CardHeader className="pb-2">
              <CardDescription>{figure.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {figure.value.toLocaleString()}
                {figure.unit && (
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    {figure.unit}
                  </span>
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">About this report</CardTitle>
          <CardDescription>
            These figures are drawn live from your brand analytics. The CSV export contains
            exactly the metrics displayed above, with a generation date.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default EsgTab;
