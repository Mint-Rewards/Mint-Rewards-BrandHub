import { Award } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, ResponsiveContainer, XAxis, YAxis, Bar } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { mockAnalyticsData } from "./data";

const REWARD_CATEGORIES = [
  {
    rank: 1,
    name: "Discount Coupons",
    redemptions: "1,240 redemptions",
    usageRate: "89%",
    badgeClassName: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
  {
    rank: 2,
    name: "Free Products",
    redemptions: "680 redemptions",
    usageRate: "76%",
    badgeClassName: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    rank: 3,
    name: "Exclusive Deals",
    redemptions: "420 redemptions",
    usageRate: "82%",
    badgeClassName: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  {
    rank: 4,
    name: "Gift Cards",
    redemptions: "290 redemptions",
    usageRate: "71%",
    badgeClassName: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
];

const RewardsTab = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Points Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-yellow-600" />
            <span>Points Earned vs Redeemed</span>
          </CardTitle>
          <CardDescription>
            Total points activity overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: { label: "Points", color: "#F59E0B" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockAnalyticsData.pointsData}>
                <XAxis dataKey="category" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="value"
                  fill="#F59E0B"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Redemption Rate:{" "}
              {Math.round(
                (mockAnalyticsData.pointsData[1].value /
                  mockAnalyticsData.pointsData[0].value) *
                  100
              )}
              %
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Your Reward Categories Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-purple-600" />
            <span>Your Reward Categories</span>
          </CardTitle>
          <CardDescription>
            Performance of your reward offerings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {REWARD_CATEGORIES.map((category) => (
              <div
                key={category.rank}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                      category.badgeClassName
                    )}
                  >
                    {category.rank}
                  </div>
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {category.redemptions}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{category.usageRate}</p>
                  <p className="text-xs text-muted-foreground">
                    usage rate
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardsTab;
