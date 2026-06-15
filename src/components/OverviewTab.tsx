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
  },
  {
    icon: Users,
    label: "Eco Users Reached",
    value: "3.2K",
    caption: "+15% from last month",
  },
  {
    icon: Recycle,
    label: "Reward Redemptions",
    value: "2,630",
    caption: "+28% from last month",
  },
  {
    icon: TrendingUp,
    label: "Growth Rate",
    value: "+24%",
    caption: "+4% from last month",
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
