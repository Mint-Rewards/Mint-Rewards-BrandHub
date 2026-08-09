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
    valueClassName: "text-green-600",
    labelClassName: "text-muted-foreground",
  },
  {
    value: "78%",
    label: "Coupon Usage Rate",
    valueClassName: "text-blue-600",
    labelClassName: "text-muted-foreground",
  },
  {
    value: "2,630",
    label: "Total Redemptions",
    valueClassName: "text-purple-600",
    labelClassName: "text-muted-foreground",
  },
  {
    value: "4.6",
    label: "Customer Rating",
    valueClassName: "text-orange-600",
    labelClassName: "text-muted-foreground",
  },
];

const CAMPAIGNS = [
  {
    name: "Summer Eco Sale",
    redemptions: "850 redemptions this month",
    iconClassName: "bg-green-500/10 text-green-600 dark:text-green-400",
    successRate: 89,
  },
  {
    name: "Green Friday Deals",
    redemptions: "680 redemptions this month",
    iconClassName: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    successRate: 76,
  },
  {
    name: "Sustainability Rewards",
    redemptions: "1,100 redemptions this month",
    iconClassName: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
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
              <Card key={stat.label} className="border-border/60">
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
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                      campaign.iconClassName
                    )}
                  >
                    <Award className="h-6 w-6" />
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
                      className="w-16 h-2"
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
