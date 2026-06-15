import { Calendar as CalendarIcon, TrendingUp, Target, BarChart3, Award } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { mockAnalyticsData } from "./data";
import CenteredStat from "./CenteredStat";

const { threeMonthForecast, sixMonthForecast, yearlyForecast, trendAnalysis, seasonalFactors } =
  mockAnalyticsData.projections;

const FORECAST_CARDS = [
  {
    title: "3-Month Forecast",
    description: "December 2025 projections",
    icon: CalendarIcon,
    iconClassName: "text-blue-600",
    stats: [
      {
        value: `${threeMonthForecast.co2Savings} tons`,
        label: "CO₂ Savings",
        labelClassName: "text-green-700",
        caption: `+${trendAnalysis.co2SavingsGrowth}% growth`,
        containerClassName: "p-3",
        valueClassName: "text-green-600",
      },
      {
        value: `${(threeMonthForecast.wasteCollection / 1000).toFixed(1)}K kg`,
        label: "Waste Collection",
        labelClassName: "text-blue-700",
        caption: `+${trendAnalysis.wasteCollectionGrowth}% monthly`,
        containerClassName: "p-3",
        valueClassName: "text-blue-600",
      },
      {
        value: `${(threeMonthForecast.newUsers / 1000).toFixed(1)}K`,
        label: "New Users",
        labelClassName: "text-purple-700",
        caption: `+${trendAnalysis.userAcquisitionGrowth}% quarterly`,
        containerClassName: "p-3",
        valueClassName: "text-purple-600",
      },
    ],
  },
  {
    title: "6-Month Forecast",
    description: "March 2026 projections",
    icon: TrendingUp,
    iconClassName: "text-amber-600",
    stats: [
      {
        value: `${sixMonthForecast.co2Savings} tons`,
        label: "CO₂ Savings",
        labelClassName: "text-green-700",
        caption: "Cumulative impact",
        containerClassName: "p-3",
        valueClassName: "text-green-600",
      },
      {
        value: `${(sixMonthForecast.wasteCollection / 1000).toFixed(1)}K kg`,
        label: "Waste Collection",
        labelClassName: "text-blue-700",
        caption: "6-month total",
        containerClassName: "p-3",
        valueClassName: "text-blue-600",
      },
      {
        value: `${(sixMonthForecast.totalUsers / 1000).toFixed(1)}K`,
        label: "Total Users",
        labelClassName: "text-orange-700",
        caption: "Community size",
        containerClassName: "p-3",
        valueClassName: "text-orange-600",
      },
    ],
  },
  {
    title: "Year-End Forecast",
    description: "September 2026 projections",
    icon: Target,
    iconClassName: "text-green-600",
    stats: [
      {
        value: `${yearlyForecast.co2Savings} tons`,
        label: "CO₂ Savings",
        labelClassName: "text-green-700",
        caption: "Annual target",
        containerClassName: "p-3",
        valueClassName: "text-green-600",
      },
      {
        value: `${(yearlyForecast.wasteCollection / 1000).toFixed(0)}K kg`,
        label: "Waste Collection",
        labelClassName: "text-indigo-700",
        caption: "Annual goal",
        containerClassName: "p-3",
        valueClassName: "text-indigo-600",
      },
      {
        value: `${(yearlyForecast.totalUsers / 1000).toFixed(0)}K`,
        label: "Total Users",
        labelClassName: "text-teal-700",
        caption: "Growth target",
        containerClassName: "p-3",
        valueClassName: "text-teal-600",
      },
    ],
  },
];

const GROWTH_OPPORTUNITIES = [
  {
    title: "Corporate Partnership Expansion",
    description: "Target 25% increase in B2B waste collection",
    impact: "Est. impact: +3.2 tons CO₂ savings/month",
    containerClassName: "bg-emerald-50 dark:bg-emerald-950/20",
    dotClassName: "bg-emerald-500",
    titleClassName: "text-emerald-800",
    descriptionClassName: "text-emerald-700",
  },
  {
    title: "Mobile App Enhancement",
    description: "Gamification features to boost engagement",
    impact: "Est. impact: +15% user retention",
    containerClassName: "bg-blue-50 dark:bg-blue-950/20",
    dotClassName: "bg-blue-500",
    titleClassName: "text-blue-800",
    descriptionClassName: "text-blue-700",
  },
  {
    title: "Educational Campaigns",
    description: "Increase recycling knowledge and participation",
    impact: "Est. impact: +0.3 kg per user/month",
    containerClassName: "bg-purple-50 dark:bg-purple-950/20",
    dotClassName: "bg-purple-500",
    titleClassName: "text-purple-800",
    descriptionClassName: "text-purple-700",
  },
];

const KPI_PROJECTIONS = [
  {
    title: "Avg Waste per User",
    titleClassName: "text-green-800",
    current: "Current: 1.23 kg/month",
    currentClassName: "text-green-700",
    value: `${yearlyForecast.averageWastePerUser} kg`,
    valueClassName: "text-green-600",
    change: "+34% improvement",
    changeClassName: "text-green-500",
    containerClassName: "bg-green-50 dark:bg-green-950/20",
  },
  {
    title: "Monthly Engagement",
    titleClassName: "text-blue-800",
    current: "Current: 25% rate",
    currentClassName: "text-blue-700",
    value: "33%",
    valueClassName: "text-blue-600",
    change: `+${trendAnalysis.engagementImprovement}% monthly`,
    changeClassName: "text-blue-500",
    containerClassName: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    title: "Total Points Earned",
    titleClassName: "text-purple-800",
    current: "Current: 95.7K points",
    currentClassName: "text-purple-700",
    value: `${(yearlyForecast.pointsEarned / 1000).toFixed(0)}K`,
    valueClassName: "text-purple-600",
    change: "8x growth potential",
    changeClassName: "text-purple-500",
    containerClassName: "bg-purple-50 dark:bg-purple-950/20",
  },
];

const SEASONAL_STYLES = (factor: number) => {
  if (factor > 1.1) {
    return {
      container: "bg-green-50 border-green-200",
      value: "text-green-600",
      badge: "bg-green-100 text-green-700",
      label: "Peak",
    };
  }
  if (factor < 0.95) {
    return {
      container: "bg-orange-50 border-orange-200",
      value: "text-orange-600",
      badge: "bg-orange-100 text-orange-700",
      label: "Low",
    };
  }
  return {
    container: "bg-blue-50 border-blue-200",
    value: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
    label: "Normal",
  };
};

const ProjectionsTab = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Forecast Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {FORECAST_CARDS.map((forecast) => (
          <Card key={forecast.title}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <forecast.icon className={cn("h-5 w-5", forecast.iconClassName)} />
                <span>{forecast.title}</span>
              </CardTitle>
              <CardDescription>{forecast.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {forecast.stats.map((stat) => (
                  <CenteredStat
                    key={stat.label}
                    containerClassName={stat.containerClassName}
                    valueClassName={stat.valueClassName}
                    value={stat.value}
                    label={stat.label}
                    labelClassName={stat.labelClassName}
                    caption={stat.caption}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Seasonal Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            <span>Seasonal Impact Analysis</span>
          </CardTitle>
          <CardDescription>
            Quarterly performance factors and expected variations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {seasonalFactors.map((season, index) => {
              const styles = SEASONAL_STYLES(season.factor);
              return (
                <div key={index} className={cn("p-4 rounded-lg border", styles.container)}>
                  <div className="text-center mb-2">
                    <div className={cn("text-2xl font-bold", styles.value)}>
                      {(season.factor * 100).toFixed(0)}%
                    </div>
                    <p className="text-sm font-medium">{season.season}</p>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">{season.reason}</p>
                  <div className="mt-2 text-center">
                    <Badge variant="outline" className={cn("border-transparent", styles.badge)}>
                      {styles.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Growth Trends & Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <span>Growth Opportunities</span>
            </CardTitle>
            <CardDescription>
              Strategic initiatives to accelerate growth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {GROWTH_OPPORTUNITIES.map((opportunity) => (
                <div
                  key={opportunity.title}
                  className={cn("flex items-start space-x-3 p-3 rounded-lg", opportunity.containerClassName)}
                >
                  <div className={cn("w-2 h-2 rounded-full mt-2", opportunity.dotClassName)}></div>
                  <div>
                    <p className={cn("font-medium", opportunity.titleClassName)}>{opportunity.title}</p>
                    <p className={cn("text-sm", opportunity.descriptionClassName)}>{opportunity.description}</p>
                    <p className="text-xs text-muted-foreground">{opportunity.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-amber-600" />
              <span>Key Performance Indicators</span>
            </CardTitle>
            <CardDescription>
              Projected improvements in key metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {KPI_PROJECTIONS.map((kpi) => (
                <div
                  key={kpi.title}
                  className={cn("flex justify-between items-center p-3 rounded-lg", kpi.containerClassName)}
                >
                  <div>
                    <p className={cn("font-medium", kpi.titleClassName)}>{kpi.title}</p>
                    <p className={cn("text-sm", kpi.currentClassName)}>{kpi.current}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-lg font-bold", kpi.valueClassName)}>{kpi.value}</p>
                    <p className={cn("text-xs", kpi.changeClassName)}>{kpi.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectionsTab;
