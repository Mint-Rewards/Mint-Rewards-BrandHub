import { Building2, Award } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const BRAND_STATS = [
  {
    value: "12",
    label: "Active Campaigns",
    cardClassName: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
    valueClassName: "text-green-700",
    labelClassName: "text-green-600",
  },
  {
    value: "78%",
    label: "Coupon Usage Rate",
    cardClassName: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
    valueClassName: "text-blue-700",
    labelClassName: "text-blue-600",
  },
  {
    value: "2,630",
    label: "Total Redemptions",
    cardClassName: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
    valueClassName: "text-purple-700",
    labelClassName: "text-purple-600",
  },
  {
    value: "4.6",
    label: "Customer Rating",
    cardClassName: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
    valueClassName: "text-orange-700",
    labelClassName: "text-orange-600",
  },
];

const CAMPAIGNS = [
  {
    name: "Summer Eco Sale",
    redemptions: "850 redemptions this month",
    iconGradientClassName: "from-green-500 to-emerald-500",
    successRate: 89,
  },
  {
    name: "Green Friday Deals",
    redemptions: "680 redemptions this month",
    iconGradientClassName: "from-blue-500 to-cyan-500",
    successRate: 76,
  },
  {
    name: "Sustainability Rewards",
    redemptions: "1,100 redemptions this month",
    iconGradientClassName: "from-purple-500 to-pink-500",
    successRate: 82,
  },
];

const BrandsTab = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <span>Your Brand Performance</span>
          </CardTitle>
          <CardDescription>
            Your brand's engagement with the sustainability platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {BRAND_STATS.map((stat) => (
              <Card key={stat.label} className={stat.cardClassName}>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className={cn("text-2xl font-bold", stat.valueClassName)}>
                      {stat.value}
                    </p>
                    <p className={cn("text-sm", stat.labelClassName)}>
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Campaign Performance</h4>
            {CAMPAIGNS.map((campaign) => (
              <div
                key={campaign.name}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={cn(
                      "w-12 h-12 bg-gradient-to-r rounded-lg flex items-center justify-center",
                      campaign.iconGradientClassName
                    )}
                  >
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{campaign.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {campaign.redemptions}
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{campaign.successRate}%</span>
                    <Progress
                      value={campaign.successRate}
                      className="w-16 h-2 bg-gray-200"
                      indicatorClassName="bg-green-500"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Success Rate
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

export default BrandsTab;
