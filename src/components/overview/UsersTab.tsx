import { Users, Trophy, Award, BarChart3 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockAnalyticsData } from "./data";
import CenteredStat from "./CenteredStat";
import TierRow from "./TierRow";

const ENGAGEMENT_ROWS = [
  {
    label: "Collection Bags Distributed",
    value: "4,200",
    progress: 85,
    caption: "85% collection success rate",
  },
  {
    label: "Average Waste per User",
    value: `${mockAnalyticsData.userStatistics.averageWastePerUser} kg/month`,
    progress: 62,
    caption: "Above target of 1.0 kg/month",
  },
  {
    label: "Monthly Active Users",
    value: `${mockAnalyticsData.userStatistics.activeUsers.toLocaleString()} / ${mockAnalyticsData.userStatistics.totalUsers.toLocaleString()}`,
    progress: mockAnalyticsData.userStatistics.engagementRate,
    caption: `${mockAnalyticsData.userStatistics.engagementRate}% monthly engagement rate`,
  },
  {
    label: "New Users This Month",
    value: `${mockAnalyticsData.userStatistics.newUsersThisMonth}`,
    progress: 75,
    caption: `${mockAnalyticsData.userStatistics.retentionRate}% user retention rate`,
  },
];

const USER_TIERS = [
  {
    icon: Trophy,
    iconBgClassName: "bg-yellow-500",
    containerClassName: "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200",
    title: "Platinum Tier",
    titleClassName: "text-yellow-800",
    description: "200+ kg recycled",
    descriptionClassName: "text-yellow-700",
    count: mockAnalyticsData.userStatistics.userTiers.platinum,
    countClassName: "text-yellow-800",
    countLabelClassName: "text-yellow-600",
  },
  {
    icon: Award,
    iconBgClassName: "bg-amber-500",
    containerClassName: "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200",
    title: "Gold Tier",
    titleClassName: "text-amber-800",
    description: "150-199 kg recycled",
    descriptionClassName: "text-amber-700",
    count: mockAnalyticsData.userStatistics.userTiers.gold,
    countClassName: "text-amber-800",
    countLabelClassName: "text-amber-600",
  },
  {
    icon: "S",
    iconBgClassName: "bg-gray-500",
    containerClassName: "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200",
    title: "Silver Tier",
    titleClassName: "text-gray-800",
    description: "100-149 kg recycled",
    descriptionClassName: "text-gray-700",
    count: mockAnalyticsData.userStatistics.userTiers.silver,
    countClassName: "text-gray-800",
    countLabelClassName: "text-gray-600",
  },
  {
    icon: "B",
    iconBgClassName: "bg-orange-500",
    containerClassName: "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200",
    title: "Bronze Tier",
    titleClassName: "text-orange-800",
    description: "50-99 kg recycled",
    descriptionClassName: "text-orange-700",
    count: mockAnalyticsData.userStatistics.userTiers.bronze,
    countClassName: "text-orange-800",
    countLabelClassName: "text-orange-600",
  },
  {
    icon: "ST",
    iconBgClassName: "bg-blue-500",
    containerClassName: "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200",
    title: "Starter",
    titleClassName: "text-blue-800",
    description: "0-49 kg recycled",
    descriptionClassName: "text-blue-700",
    count: mockAnalyticsData.userStatistics.userTiers.starter,
    countClassName: "text-blue-800",
    countLabelClassName: "text-blue-600",
  },
];

const UsersTab = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* User Engagement Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-indigo-600" />
            <span>User Engagement</span>
          </CardTitle>
          <CardDescription>
            Collection and participation rates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {ENGAGEMENT_ROWS.map((row) => (
            <div key={row.label} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{row.label}</span>
                <span>{row.value}</span>
              </div>
              <Progress value={row.progress} className="h-2" />
              <p className="text-xs text-muted-foreground">{row.caption}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* User Performance Tiers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <span>User Performance Tiers</span>
          </CardTitle>
          <CardDescription>
            Distribution of users by recycling performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {USER_TIERS.map((tier) => (
              <TierRow key={tier.title} {...tier} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Insights */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            <span>User Community Insights</span>
          </CardTitle>
          <CardDescription>
            Key metrics and trends from your user base
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CenteredStat
              containerClassName="bg-gradient-to-br from-green-50 to-emerald-50"
              valueClassName="text-green-600"
              value={mockAnalyticsData.userStatistics.averagePointsPerUser.toLocaleString()}
              label="Avg Points per User"
              labelClassName="text-green-700"
              caption="15% above last month"
            />

            <CenteredStat
              containerClassName="bg-gradient-to-br from-blue-50 to-cyan-50"
              valueClassName="text-blue-600"
              value={`${mockAnalyticsData.userStatistics.topPerformerWaste} kg`}
              label="Top User Performance"
              labelClassName="text-blue-700"
              caption="Monthly record"
            />

            <CenteredStat
              containerClassName="bg-gradient-to-br from-purple-50 to-pink-50"
              valueClassName="text-purple-600"
              value={`${(
                (mockAnalyticsData.userStatistics.userTiers.platinum +
                  mockAnalyticsData.userStatistics.userTiers.gold) /
                mockAnalyticsData.userStatistics.totalUsers *
                100
              ).toFixed(1)}%`}
              label="High Performers"
              labelClassName="text-purple-700"
              caption="Gold & Platinum users"
            />
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
            <h4 className="font-semibold text-indigo-700 mb-2">Community Growth Insights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-indigo-600">• <strong>User Engagement:</strong> {mockAnalyticsData.userStatistics.engagementRate}% monthly active rate</p>
                <p className="text-indigo-600">• <strong>Growth Rate:</strong> {mockAnalyticsData.userStatistics.newUsersThisMonth} new users this month</p>
              </div>
              <div>
                <p className="text-indigo-600">• <strong>Retention:</strong> {mockAnalyticsData.userStatistics.retentionRate}% user retention rate</p>
                <p className="text-indigo-600">• <strong>Performance:</strong> Avg {mockAnalyticsData.userStatistics.averageWastePerUser} kg per user</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersTab;
