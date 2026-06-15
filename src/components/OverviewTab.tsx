import { Recycle, TrendingUp, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import AnalyticsDashboard from "./overview/AnalyticsDashboard";
import TrendStatCard from "./overview/TrendStatCard";

const STATS = (campaigns: number) => [
  {
    icon: TrendingUp,
    label: "Active Campaigns",
    value: campaigns,
    caption: "+1 from last month",
    cardClassName: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200",
    iconClassName: "text-green-600",
    labelClassName: "text-green-700 dark:text-green-300",
    valueClassName: "text-green-800 dark:text-green-100",
    captionClassName: "text-green-600 dark:text-green-400",
  },
  {
    icon: Users,
    label: "Eco Users Reached",
    value: "3.2K",
    caption: "+15% from last month",
    cardClassName: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200",
    iconClassName: "text-blue-600",
    labelClassName: "text-blue-700 dark:text-blue-300",
    valueClassName: "text-blue-800 dark:text-blue-100",
    captionClassName: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Recycle,
    label: "Reward Redemptions",
    value: "2,630",
    caption: "+28% from last month",
    cardClassName: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200",
    iconClassName: "text-purple-600",
    labelClassName: "text-purple-700 dark:text-purple-300",
    valueClassName: "text-purple-800 dark:text-purple-100",
    captionClassName: "text-purple-600 dark:text-purple-400",
  },
  {
    icon: TrendingUp,
    label: "Growth Rate",
    value: "+24%",
    caption: "+4% from last month",
    cardClassName: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200",
    iconClassName: "text-orange-600",
    labelClassName: "text-orange-700 dark:text-orange-300",
    valueClassName: "text-orange-800 dark:text-orange-100",
    captionClassName: "text-orange-600 dark:text-orange-400",
  },
];

const OverviewTab: React.FC<{ campaigns: number }> = ({ campaigns }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sustainability Metrics & Recent Activity</CardTitle>
        <CardDescription>
          Your brand's environmental impact and campaign performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Enhanced Stats Grid with Sustainability Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS(campaigns).map((stat) => (
              <TrendStatCard key={stat.label} {...stat} />
            ))}
          </div>

          {/* Analytics Dashboard Section */}
          <AnalyticsDashboard />
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewTab;
