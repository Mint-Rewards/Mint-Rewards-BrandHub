import { Trophy, BarChart3, Target } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { mockAnalyticsData } from "./data";
import CenteredStat from "./CenteredStat";
import TrendBadge from "./TrendBadge";
import ComparisonBar from "./ComparisonBar";

const PERFORMANCE_CARD_CLASSES: Record<string, string> = {
  above: "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900",
  below: "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900",
  average: "bg-muted/40 border-border/60",
};

const PERFORMANCE_TEXT_CLASSES: Record<string, string> = {
  above: "text-green-700",
  below: "text-red-700",
  average: "text-gray-700",
};

const { performanceMetrics, brandPerformance, categoryAverage, category } =
  mockAnalyticsData.sectorPerformance;

const SectorTab = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-amber-600" />
            <span>Sector Performance Overview</span>
          </CardTitle>
          <CardDescription>
            Your brand vs {category} category average
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceMetrics.map((metric, index) => (
              <Card key={index} className={PERFORMANCE_CARD_CLASSES[metric.performance]}>
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <div className={cn("text-2xl font-bold", PERFORMANCE_TEXT_CLASSES[metric.performance])}>
                      {metric.yourBrand} {metric.unit}
                    </div>
                    <p className="text-sm font-medium">{metric.metric}</p>
                    <div className="flex items-center justify-center space-x-1">
                      <TrendBadge performance={metric.performance as "above" | "below" | "average"} percentageDiff={metric.percentageDiff} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Category avg: {metric.categoryAvg} {metric.unit}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Company vs Category Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>Your Performance vs Category</span>
            </CardTitle>
            <CardDescription>
              Direct comparison with {category} sector average
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{metric.metric}</span>
                    <TrendBadge performance={metric.performance as "above" | "below" | "average"} percentageDiff={metric.percentageDiff} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-primary font-semibold">Your Brand: {metric.yourBrand} {metric.unit}</span>
                      <span className="text-muted-foreground">Category Avg: {metric.categoryAvg} {metric.unit}</span>
                    </div>
                    <ComparisonBar yourBrand={metric.yourBrand} categoryAvg={metric.categoryAvg} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Your Performance</span>
                      <span>Category Average</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600" />
              <span>Performance Highlights</span>
            </CardTitle>
            <CardDescription>
              Key achievements and areas of excellence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <CenteredStat
                  valueClassName="text-green-600"
                  value={brandPerformance.wasteCollected.toLocaleString()}
                  label="kg Waste Collected"
                  labelClassName="text-green-700"
                  caption={`${((brandPerformance.wasteCollected / categoryAverage.wasteCollected - 1) * 100).toFixed(0)}% above average`}
                />

                <CenteredStat
                  valueClassName="text-blue-600"
                  value={brandPerformance.co2Saved}
                  label="tons CO₂ Saved"
                  labelClassName="text-blue-700"
                  caption={`${((brandPerformance.co2Saved / categoryAverage.co2Saved - 1) * 100).toFixed(0)}% above average`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <CenteredStat
                  valueClassName="text-purple-600"
                  value={brandPerformance.userEngagement.toLocaleString()}
                  label="Active Users"
                  labelClassName="text-purple-700"
                  caption={`${((brandPerformance.userEngagement / categoryAverage.userEngagement - 1) * 100).toFixed(0)}% above average`}
                />

                <CenteredStat
                  valueClassName="text-orange-600"
                  value={`${brandPerformance.recyclingRate}%`}
                  label="Recycling Rate"
                  labelClassName="text-orange-700"
                  caption={`${(brandPerformance.recyclingRate - categoryAverage.recyclingRate).toFixed(0)} points above average`}
                />
              </div>

              <div className="mt-4 p-4 bg-muted/40 rounded-lg border border-border/60">
                <div className="flex items-center space-x-2 mb-2">
                  <Trophy className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">Outstanding Performance</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your brand is performing above category average in all key sustainability metrics,
                  demonstrating strong commitment to environmental responsibility.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-purple-600" />
            <span>Performance Summary</span>
          </CardTitle>
          <CardDescription>
            Key insights and recommendations for your brand
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-green-600">Strengths</h4>
              <div className="space-y-2">
                {performanceMetrics
                  .filter((metric) => metric.performance === "above")
                  .map((metric, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-sm">
                        <span className="font-medium">
                          {metric.metric}
                        </span>{" "}
                        is {metric.percentageDiff}% above category average
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-blue-600">
                Opportunities
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-sm">
                    <span className="font-medium">User Education:</span>{" "}
                    Implement programs to increase recycling awareness
                  </p>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-sm">
                    <span className="font-medium">
                      Partnership Growth:
                    </span>{" "}
                    Expand collaborations with local waste management
                  </p>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-sm">
                    <span className="font-medium">
                      Technology Integration:
                    </span>{" "}
                    Leverage IoT for better waste tracking
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/40 rounded-lg border border-border/60">
            <div className="flex items-center space-x-3 mb-2">
              <Trophy className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold text-green-700">
                Category Performance
              </h4>
            </div>
            <p className="text-sm text-green-600 mb-2">
              Your brand is performing <span className="font-bold">above average</span> in
              the {category} category
            </p>
            <p className="text-xs text-muted-foreground">
              Consistently exceeding category benchmarks across all key sustainability metrics
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SectorTab;
