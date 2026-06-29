import { useState } from "react";
import { DateRange } from "react-day-picker";
import type { BrandAnalytics } from "@/actions/brandActions";
import { format } from "date-fns";
import {
  Award,
  BarChart3,
  Building2,
  Calendar as CalendarIcon,
  Recycle,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Cell,
  Line,
  Pie,
  ResponsiveContainer,
  XAxis,
  YAxis,
  LineChart,
  PieChart,
  Bar,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Progress } from "@/components/ui/progress";

// CO2 savings per kg for different materials (in kg CO2 saved per kg of material)
const CO2_SAVINGS_PER_KG = {
  paper: 3.3, // Paper recycling saves ~3.3 kg CO2 per kg
  cardboard: 3.3, // Similar to paper
  plastic: 2.0, // Plastic recycling saves ~2 kg CO2 per kg
  glass: 0.5, // Glass recycling saves ~0.5 kg CO2 per kg
  aluminum: 9.0, // Aluminum recycling saves ~9 kg CO2 per kg (highest impact)
  steel: 1.5, // Steel recycling saves ~1.5 kg CO2 per kg
  electronic: 4.0, // E-waste recycling saves ~4 kg CO2 per kg
  organic: 0.3, // Composting organic waste saves ~0.3 kg CO2 per kg
};

// Equivalent conversions for visualization
const EQUIVALENT_CONVERSIONS = {
  treesPlanted: 0.025, // 1 kg CO2 saved = ~0.025 trees planted (40kg CO2 per tree per year)
  kmDriving: 4.6, // 1 kg CO2 saved = ~4.6 km of driving (average car emits 0.21 kg CO2/km)
  lightBulbHours: 100, // 1 kg CO2 saved = ~100 hours of LED light bulb usage
};

// Sample data for the analytics dashboard
const mockAnalyticsData = {
  kpis: {
    totalWastageCollected: 15620,
    co2EmissionsSaved: 8.4,
    totalWasteRecycled: 14890,
    usersRegistered: 12750,
    activeUsers: 3240,
  },
  companyWaste: {
    totalCollected: 8450, // kg
    breakdown: [
      { name: "Paper", value: 2800, percentage: 33, color: "#10B981" },
      { name: "Cardboard", value: 2100, percentage: 25, color: "#059669" },
      { name: "Plastic", value: 1650, percentage: 20, color: "#8B5CF6" },
      { name: "Glass", value: 850, percentage: 10, color: "#3B82F6" },
      { name: "Aluminum", value: 600, percentage: 7, color: "#F59E0B" },
      { name: "Electronic", value: 450, percentage: 5, color: "#EF4444" },
    ],
  },
  userImpact: {
    totalUserWaste: 7170, // kg (estimated based on user collections)
    estimatedBreakdown: [
      { name: "Mixed Recyclables", weight: 4500, co2Saved: 2.2 }, // Average CO2 savings
      { name: "Organic Waste", weight: 2670, co2Saved: 0.3 },
    ],
  },
  wasteTypes: [
    { name: "Plastic", value: 35, color: "#8B5CF6" },
    { name: "Paper", value: 28, color: "#10B981" },
    { name: "Metal", value: 18, color: "#F59E0B" },
    { name: "Glass", value: 12, color: "#3B82F6" },
    { name: "Organic", value: 7, color: "#EF4444" },
  ],
  wasteCollectionTrend: [
    { month: "Jan", collected: 980, co2Saved: 0.52 },
    { month: "Feb", collected: 1240, co2Saved: 0.66 },
    { month: "Mar", collected: 1450, co2Saved: 0.77 },
    { month: "Apr", collected: 1680, co2Saved: 0.89 },
    { month: "May", collected: 1920, co2Saved: 1.02 },
    { month: "Jun", collected: 2100, co2Saved: 1.12 },
  ],
  pointsData: [
    { category: "Points Earned", value: 95680 },
    { category: "Points Redeemed", value: 68420 },
  ],
  topBrands: [
    { name: "EcoStore", redemptions: 1240, rate: 89 },
    { name: "GreenCafe", redemptions: 980, rate: 76 },
    { name: "SustainShop", redemptions: 750, rate: 82 },
    { name: "EarthMarket", redemptions: 620, rate: 71 },
  ],
  topContributors: [
    { name: "Top Performer", waste: 245, points: 2450, tier: "Platinum" },
    { name: "Second Place", waste: 198, points: 1980, tier: "Gold" },
    { name: "Third Place", waste: 176, points: 1760, tier: "Gold" },
    { name: "Fourth Place", waste: 158, points: 1580, tier: "Silver" },
    { name: "Fifth Place", waste: 142, points: 1420, tier: "Silver" },
  ],
  userStatistics: {
    totalUsers: 12750,
    activeUsers: 3240,
    newUsersThisMonth: 480,
    retentionRate: 78, // percentage
    averageWastePerUser: 1.23, // kg/month
    topPerformerWaste: 245, // kg
    averagePointsPerUser: 1875,
    engagementRate: 25, // percentage
    userTiers: {
      platinum: 45, // users with 200+ kg
      gold: 187, // users with 150-199 kg
      silver: 523, // users with 100-149 kg
      bronze: 1285, // users with 50-99 kg
      starter: 1200, // users with <50 kg
    },
  },
  sectorPerformance: {
    category: "Technology", // Current brand's category
    brandPerformance: {
      wasteCollected: 15620, // kg
      co2Saved: 8.4, // tons
      userEngagement: 3240, // active users
      recyclingRate: 92, // percentage
      pointsPerUser: 29.5, // average points per user
    },
    categoryAverage: {
      wasteCollected: 12800, // kg
      co2Saved: 6.8, // tons
      userEngagement: 2850, // active users
      recyclingRate: 87, // percentage
      pointsPerUser: 24.2, // average points per user
    },
    performanceMetrics: [
      {
        metric: "Waste Collection",
        yourBrand: 15620,
        categoryAvg: 12800,
        unit: "kg",
        performance: "above", // above/below/average
        percentageDiff: 22, // percentage above/below average
      },
      {
        metric: "CO₂ Savings",
        yourBrand: 8.4,
        categoryAvg: 6.8,
        unit: "tons",
        performance: "above",
        percentageDiff: 24,
      },
      {
        metric: "User Engagement",
        yourBrand: 3240,
        categoryAvg: 2850,
        unit: "users",
        performance: "above",
        percentageDiff: 14,
      },
      {
        metric: "Recycling Rate",
        yourBrand: 92,
        categoryAvg: 87,
        unit: "%",
        performance: "above",
        percentageDiff: 6,
      },
    ],
  },
  projections: {
    threeMonthForecast: {
      co2Savings: 12.6, // tons
      wasteCollection: 23400, // kg
      newUsers: 18500,
      totalUsers: 31250,
      averageWastePerUser: 1.35, // kg/month (improvement)
      pointsEarned: 142000,
    },
    sixMonthForecast: {
      co2Savings: 28.4, // tons
      wasteCollection: 52800, // kg
      newUsers: 42000,
      totalUsers: 54750,
      averageWastePerUser: 1.48, // kg/month
      pointsEarned: 335000,
    },
    yearlyForecast: {
      co2Savings: 64.2, // tons
      wasteCollection: 120000, // kg
      newUsers: 95000,
      totalUsers: 107750,
      averageWastePerUser: 1.65, // kg/month
      pointsEarned: 780000,
    },
    trendAnalysis: {
      wasteCollectionGrowth: 15, // percentage monthly
      userAcquisitionGrowth: 45, // percentage quarterly
      engagementImprovement: 8, // percentage monthly
      co2SavingsGrowth: 18, // percentage monthly
    },
    seasonalFactors: [
      { season: "Q4 2025", factor: 1.2, reason: "Holiday awareness campaigns" },
      { season: "Q1 2026", factor: 0.9, reason: "Post-holiday slowdown" },
      { season: "Q2 2026", factor: 1.1, reason: "Earth Day initiatives" },
      { season: "Q3 2026", factor: 1.3, reason: "Summer programs peak" },
    ],
  },
};

const AnalyticsDashboard: React.FC<{ analytics?: BrandAnalytics | null }> = ({ analytics }) => {
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(today.getFullYear(), today.getMonth(), 1),
    to: today,
  });

  const forecastMonth = (months: number) =>
    new Date(today.getFullYear(), today.getMonth() + months).toLocaleDateString(
      "en-US",
      { month: "long", year: "numeric" }
    );
  const yearEndMonth = new Date(today.getFullYear(), 11).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" }
  );

  const rangeLabel = dateRange?.from
    ? dateRange.to
      ? `${format(dateRange.from, "MMM d, yyyy")} – ${format(dateRange.to, "MMM d, yyyy")}`
      : format(dateRange.from, "MMM d, yyyy")
    : "Select a period";

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center space-x-2">
        <BarChart3 className="h-6 w-6 text-primary" aria-hidden="true" />
        <h2 className="text-2xl font-bold text-foreground" style={{ textWrap: "balance" }}>
          Sustainability Analytics Dashboard
        </h2>
      </div>

      {/* Period Information */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-lg p-4 border border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <CalendarIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Statistics Period
              </h3>
              <p className="text-sm text-muted-foreground">
                Showing metrics for{" "}
                <span className="font-medium text-primary">{rangeLabel}</span>
              </p>
            </div>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                {rangeLabel}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* KPI Summary Row */}
      <div className="grid grid-cols-3 divide-x divide-border border border-border rounded-lg overflow-hidden">
        <div className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Waste Collected</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {(mockAnalyticsData.kpis.totalWastageCollected / 1000).toFixed(1)}K kg
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-success font-medium">+22%</span> vs Technology avg
          </p>
        </div>
        <div className="p-4">
          <p className="text-xs font-medium text-muted-foreground">CO₂ Saved</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {mockAnalyticsData.kpis.co2EmissionsSaved} tons
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-success font-medium">+24%</span> above category average
          </p>
        </div>
        <div className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Waste Recycled</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {(mockAnalyticsData.kpis.totalWasteRecycled / 1000).toFixed(1)}K kg
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-success font-medium">95%</span> recycling rate
          </p>
        </div>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="impact" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="impact">Impact</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="brands">Brands</TabsTrigger>
        </TabsList>

        {/* Impact Tab */}
        <TabsContent value="impact" className="space-y-4">
          {/* Sub-tabs for Company and User Impact */}
          <Tabs defaultValue="company" className="space-y-4">
            {/* <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="company">Impact Company</TabsTrigger>
              <TabsTrigger value="users">Impact Users</TabsTrigger>
            </TabsList> */}

            {/* Company Impact Tab */}
            <TabsContent value="company" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Company Waste Collection Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <span>Company Waste Collection</span>
                    </CardTitle>
                    <CardDescription>
                      Direct waste collection from company operations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <p className="text-3xl font-bold text-foreground">
                        {(
                          mockAnalyticsData.companyWaste.totalCollected / 1000
                        ).toFixed(1)}
                        K kg
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total collected this month
                      </p>
                    </div>
                    <div className="space-y-3">
                      {mockAnalyticsData.companyWaste.breakdown.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-sm font-medium">
                                {item.name}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold">
                                {item.value} kg
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.percentage}%
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Company CO2 Impact */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Recycle className="h-5 w-5 text-primary" />
                      <span>Company CO₂ Savings</span>
                    </CardTitle>
                    <CardDescription>
                      Environmental impact from company waste recycling
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockAnalyticsData.companyWaste.breakdown.map(
                        (item, index) => {
                          const materialKey =
                            item.name.toLowerCase() === "paper"
                              ? "paper"
                              : item.name.toLowerCase() === "cardboard"
                              ? "cardboard"
                              : item.name.toLowerCase() === "plastic"
                              ? "plastic"
                              : item.name.toLowerCase() === "glass"
                              ? "glass"
                              : item.name.toLowerCase() === "aluminum"
                              ? "aluminum"
                              : item.name.toLowerCase() === "electronic"
                              ? "electronic"
                              : "paper";

                          const co2Saved = (
                            item.value * CO2_SAVINGS_PER_KG[materialKey]
                          ).toFixed(1);

                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: item.color }}
                                />
                                <span className="text-sm font-medium">
                                  {item.name}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-primary">
                                  {co2Saved} kg CO₂
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  saved
                                </p>
                              </div>
                            </div>
                          );
                        }
                      )}
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">
                            Total CO₂ Savings:
                          </span>
                          <span className="text-lg font-bold text-primary">
                            {mockAnalyticsData.companyWaste.breakdown
                              .reduce((total, item) => {
                                const materialKey =
                                  item.name.toLowerCase() === "paper"
                                    ? "paper"
                                    : item.name.toLowerCase() === "cardboard"
                                    ? "cardboard"
                                    : item.name.toLowerCase() === "plastic"
                                    ? "plastic"
                                    : item.name.toLowerCase() === "glass"
                                    ? "glass"
                                    : item.name.toLowerCase() === "aluminum"
                                    ? "aluminum"
                                    : item.name.toLowerCase() === "electronic"
                                    ? "electronic"
                                    : "paper";
                                return (
                                  total +
                                  item.value * CO2_SAVINGS_PER_KG[materialKey]
                                );
                              }, 0)
                              .toFixed(1)}{" "}
                            kg CO₂
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Company Waste Types Chart and Pie Chart in one row */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-muted-foreground" />
                      <span>Company Waste Breakdown & Distribution</span>
                    </CardTitle>
                    <CardDescription>
                      Visual breakdown of collected waste by material type
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Bar Chart */}
                      <div>
                        <h4 className="text-sm font-semibold mb-3">
                          Weight by Material (kg)
                        </h4>
                        <ChartContainer
                          config={{
                            value: { label: "Weight (kg)", color: "hsl(var(--primary))" },
                          }}
                          className="h-[250px]"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={mockAnalyticsData.companyWaste.breakdown}
                            >
                              <XAxis dataKey="name" />
                              <YAxis />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Bar
                                dataKey="value"
                                radius={[4, 4, 0, 0]}
                                fill="hsl(var(--primary))"
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </div>

                      {/* Pie Chart */}
                      <div>
                        <h4 className="text-sm font-semibold mb-3">
                          Distribution by Percentage
                        </h4>
                        <ChartContainer
                          config={{
                            paper: { label: "Paper", color: "#10B981" },
                            cardboard: { label: "Cardboard", color: "#059669" },
                            plastic: { label: "Plastic", color: "#8B5CF6" },
                            glass: { label: "Glass", color: "#3B82F6" },
                            aluminum: { label: "Aluminum", color: "#F59E0B" },
                            electronic: {
                              label: "Electronic",
                              color: "#EF4444",
                            },
                          }}
                          className="h-[250px]"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={mockAnalyticsData.companyWaste.breakdown}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {mockAnalyticsData.companyWaste.breakdown.map(
                                  (entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={entry.color}
                                    />
                                  )
                                )}
                              </Pie>
                              <ChartTooltip content={<ChartTooltipContent />} />
                            </PieChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                        <div className="grid grid-cols-2 gap-1 mt-2">
                          {mockAnalyticsData.companyWaste.breakdown.map(
                            (type) => (
                              <div
                                key={type.name}
                                className="flex items-center space-x-1"
                              >
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: type.color }}
                                />
                                <span className="text-xs">
                                  {type.name}: {type.percentage}%
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Users Impact Tab */}
            <TabsContent value="users" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Collection Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-success" />
                      <span>User Collections</span>
                    </CardTitle>
                    <CardDescription>
                      Estimated impact from user waste collections
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <p className="text-3xl font-bold text-success">
                        {(
                          mockAnalyticsData.userImpact.totalUserWaste / 1000
                        ).toFixed(1)}
                        K kg
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total user collections
                      </p>
                    </div>
                    <div className="space-y-3">
                      {mockAnalyticsData.userImpact.estimatedBreakdown.map(
                        (item, index) => {
                          const totalCo2Saved = (
                            item.weight * item.co2Saved
                          ).toFixed(1);
                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                            >
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {item.weight} kg
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-success">
                                  {totalCo2Saved} kg CO₂
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  saved
                                </p>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Environmental Equivalents */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-foreground" />
                      <span>Environmental Equivalents</span>
                    </CardTitle>
                    <CardDescription>
                      Real-world impact visualization
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(() => {
                        const totalUserCo2Saved =
                          mockAnalyticsData.userImpact.estimatedBreakdown.reduce(
                            (total, item) =>
                              total + item.weight * item.co2Saved,
                            0
                          );

                        const treesEquivalent = (
                          totalUserCo2Saved *
                          EQUIVALENT_CONVERSIONS.treesPlanted
                        ).toFixed(0);
                        const drivingEquivalent = (
                          totalUserCo2Saved * EQUIVALENT_CONVERSIONS.kmDriving
                        ).toFixed(0);
                        const lightBulbEquivalent = (
                          totalUserCo2Saved *
                          EQUIVALENT_CONVERSIONS.lightBulbHours
                        ).toFixed(0);

                        return (
                          <>
                            <div className="flex items-center space-x-3 p-3 bg-success/5 rounded-lg">
                              <div className="p-2 bg-success/20 rounded-lg">
                                <span className="text-white text-lg" aria-hidden="true">🌳</span>
                              </div>
                              <div>
                                <p className="font-medium">
                                  Trees Planted Equivalent
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {treesEquivalent} trees worth of CO₂
                                  absorption
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 bg-muted/40 rounded-lg">
                              <div className="p-2 bg-primary/20 rounded-lg">
                                <span className="text-white text-lg" aria-hidden="true">🚗</span>
                              </div>
                              <div>
                                <p className="font-medium">
                                  Driving Distance Saved
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {drivingEquivalent} km of car emissions
                                  avoided
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 bg-muted/40 rounded-lg">
                              <div className="p-2 bg-warning/20 rounded-lg">
                                <span className="text-white text-lg" aria-hidden="true">💡</span>
                              </div>
                              <div>
                                <p className="font-medium">LED Bulb Hours</p>
                                <p className="text-sm text-muted-foreground">
                                  {lightBulbEquivalent} hours of LED lighting
                                  powered
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </CardContent>
                </Card>

                {/* User CO2 Impact Summary */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-success" />
                      <span>User Community Impact Summary</span>
                    </CardTitle>
                    <CardDescription>
                      Combined environmental impact of all user collections
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-success/5 rounded-lg">
                        <div className="text-3xl font-bold text-success mb-2">
                          {mockAnalyticsData.userImpact.estimatedBreakdown
                            .reduce(
                              (total, item) =>
                                total + item.weight * item.co2Saved,
                              0
                            )
                            .toFixed(1)}
                        </div>
                        <p className="text-sm font-medium">kg CO₂ Saved</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          This month
                        </p>
                      </div>

                      <div className="text-center p-4 bg-muted/40 rounded-lg">
                        <div className="text-3xl font-bold text-foreground mb-2">
                          {mockAnalyticsData.kpis.activeUsers.toLocaleString()}
                        </div>
                        <p className="text-sm font-medium">
                          Active Contributors
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Participating users
                        </p>
                      </div>

                      <div className="text-center p-4 bg-muted/40 rounded-lg">
                        <div className="text-3xl font-bold text-foreground mb-2">
                          {(
                            (mockAnalyticsData.userImpact.totalUserWaste /
                              mockAnalyticsData.kpis.activeUsers) *
                            1000
                          ).toFixed(0)}
                        </div>
                        <p className="text-sm font-medium">g per User</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Average contribution
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Points Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-warning" />
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
                        fill="hsl(var(--warning))"
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
                  <Award className="h-5 w-5 text-muted-foreground" />
                  <span>Your Reward Categories</span>
                </CardTitle>
                <CardDescription>
                  Performance of your reward offerings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Discount Coupons</p>
                        <p className="text-sm text-muted-foreground">
                          1,240 redemptions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">89%</p>
                      <p className="text-xs text-muted-foreground">
                        usage rate
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Free Products</p>
                        <p className="text-sm text-muted-foreground">
                          680 redemptions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">76%</p>
                      <p className="text-xs text-muted-foreground">
                        usage rate
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Exclusive Deals</p>
                        <p className="text-sm text-muted-foreground">
                          420 redemptions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">82%</p>
                      <p className="text-xs text-muted-foreground">
                        usage rate
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                        4
                      </div>
                      <div>
                        <p className="font-medium">Gift Cards</p>
                        <p className="text-sm text-muted-foreground">
                          290 redemptions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">71%</p>
                      <p className="text-xs text-muted-foreground">
                        usage rate
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Engagement Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-foreground" />
                  <span>User Engagement</span>
                </CardTitle>
                <CardDescription>
                  Collection and participation rates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Collection Bags Distributed</span>
                    <span>4,200</span>
                  </div>
                  <Progress value={85} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    85% collection success rate
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Waste per User</span>
                    <span>{mockAnalyticsData.userStatistics.averageWastePerUser} kg/month</span>
                  </div>
                  <Progress value={62} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    Above target of 1.0 kg/month
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Active Users</span>
                    <span>{mockAnalyticsData.userStatistics.activeUsers.toLocaleString()} / {mockAnalyticsData.userStatistics.totalUsers.toLocaleString()}</span>
                  </div>
                  <Progress value={mockAnalyticsData.userStatistics.engagementRate} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    {mockAnalyticsData.userStatistics.engagementRate}% monthly engagement rate
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>New Users This Month</span>
                    <span>{mockAnalyticsData.userStatistics.newUsersThisMonth}</span>
                  </div>
                  <Progress value={75} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    {mockAnalyticsData.userStatistics.retentionRate}% user retention rate
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* User Performance Tiers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-warning" />
                  <span>User Performance Tiers</span>
                </CardTitle>
                <CardDescription>
                  Distribution of users by recycling performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Trophy className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Platinum Tier</p>
                        <p className="text-sm text-muted-foreground">200+ kg recycled</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">{mockAnalyticsData.userStatistics.userTiers.platinum}</p>
                      <p className="text-xs text-warning">users</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Award className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Gold Tier</p>
                        <p className="text-sm text-warning">150-199 kg recycled</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">{mockAnalyticsData.userStatistics.userTiers.gold}</p>
                      <p className="text-xs text-warning">users</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-white font-bold text-sm">S</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Silver Tier</p>
                        <p className="text-sm text-muted-foreground">100-149 kg recycled</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">{mockAnalyticsData.userStatistics.userTiers.silver}</p>
                      <p className="text-xs text-muted-foreground">users</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-white font-bold text-sm">B</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Bronze Tier</p>
                        <p className="text-sm text-muted-foreground">50-99 kg recycled</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">{mockAnalyticsData.userStatistics.userTiers.bronze}</p>
                      <p className="text-xs text-foreground">users</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-white font-bold text-sm">ST</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Starter</p>
                        <p className="text-sm text-muted-foreground">0-49 kg recycled</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">{mockAnalyticsData.userStatistics.userTiers.starter}</p>
                      <p className="text-xs text-foreground">users</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Insights */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  <span>User Community Insights</span>
                </CardTitle>
                <CardDescription>
                  Key metrics and trends from your user base
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border border-border rounded-lg">
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {mockAnalyticsData.userStatistics.averagePointsPerUser.toLocaleString()}
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Points per User</p>
                    <p className="text-xs text-success mt-1">15% above last month</p>
                  </div>

                  <div className="text-center p-4 border border-border rounded-lg">
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {mockAnalyticsData.userStatistics.topPerformerWaste} kg
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Top User Performance</p>
                    <p className="text-xs text-muted-foreground mt-1">Monthly record</p>
                  </div>

                  <div className="text-center p-4 border border-border rounded-lg">
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {((mockAnalyticsData.userStatistics.userTiers.platinum + mockAnalyticsData.userStatistics.userTiers.gold) / mockAnalyticsData.userStatistics.totalUsers * 100).toFixed(1)}%
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">High Performers</p>
                    <p className="text-xs text-muted-foreground mt-1">Gold & Platinum users</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted/40 rounded-lg border border-border">
                  <h4 className="font-semibold text-foreground mb-2">Community Growth Insights</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-foreground">• <strong>User Engagement:</strong> {mockAnalyticsData.userStatistics.engagementRate}% monthly active rate</p>
                      <p className="text-foreground">• <strong>Growth Rate:</strong> {mockAnalyticsData.userStatistics.newUsersThisMonth} new users this month</p>
                    </div>
                    <div>
                      <p className="text-foreground">• <strong>Retention:</strong> {mockAnalyticsData.userStatistics.retentionRate}% user retention rate</p>
                      <p className="text-foreground">• <strong>Performance:</strong> Avg {mockAnalyticsData.userStatistics.averageWastePerUser} kg per user</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Brands Tab */}
        <TabsContent value="brands" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <span>Your Brand Performance</span>
                </CardTitle>
                <CardDescription>
                  Your brand's engagement with the sustainability platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border border border-border rounded-lg overflow-hidden mb-6">
                  <div className="p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {analytics?.summary.activeCampaigns ?? "—"}
                    </p>
                    <p className="text-sm text-muted-foreground">Active Campaigns</p>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {analytics?.summary.totalCampaigns
                        ? `${Math.round((analytics.summary.activeCampaigns / analytics.summary.totalCampaigns) * 100)}%`
                        : "—"}
                    </p>
                    <p className="text-sm text-muted-foreground">Active Rate</p>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {analytics?.summary.totalRedemptions.toLocaleString() ?? "—"}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Redemptions</p>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {analytics?.summary.uniqueUsers.toLocaleString() ?? "—"}
                    </p>
                    <p className="text-sm text-muted-foreground">Unique Users</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Campaign Performance</h4>
                  {analytics && analytics.campaigns.list.length > 0 ? (
                    analytics.campaigns.list.slice(0, 5).map((campaign) => (
                      <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Award className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{campaign.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {campaign.redemptions.toLocaleString()} redemptions
                            </p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          campaign.status === "APPROVED"
                            ? "bg-success/10 text-success"
                            : campaign.status === "PENDING"
                            ? "bg-warning/10 text-warning"
                            : campaign.status === "REJECTED"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {campaign.status.charAt(0) + campaign.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground py-6 text-center">
                      {analytics
                        ? "No campaigns yet — create your first campaign to see performance data."
                        : "Loading campaign data…"}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sector Performance Tab */}
        <TabsContent value="sector" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            {/* Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-warning" />
                  <span>Sector Performance Overview</span>
                </CardTitle>
                <CardDescription>
                  Your brand vs {mockAnalyticsData.sectorPerformance.category}{" "}
                  category average
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-border border border-border rounded-lg overflow-hidden">
                  {mockAnalyticsData.sectorPerformance.performanceMetrics.map(
                    (metric, index) => (
                      <div key={index} className="flex items-center justify-between px-4 py-3">
                        <span className="text-sm font-medium text-foreground">{metric.metric}</span>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-sm font-semibold text-foreground">{metric.yourBrand} {metric.unit}</p>
                            <p className="text-xs text-muted-foreground">your brand</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">{metric.categoryAvg} {metric.unit}</p>
                            <p className="text-xs text-muted-foreground">category avg</p>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full min-w-[96px] text-center font-medium ${
                              metric.performance === "above"
                                ? "bg-success/10 text-success"
                                : metric.performance === "below"
                                ? "bg-destructive/10 text-destructive"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {metric.performance === "above" ? "↑" : metric.performance === "below" ? "↓" : "="}{" "}
                            {metric.percentageDiff}%{" "}
                            {metric.performance === "above" ? "above" : metric.performance === "below" ? "below" : "avg"}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Company vs Category Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    <span>Your Performance vs Category</span>
                  </CardTitle>
                  <CardDescription>
                    Direct comparison with {mockAnalyticsData.sectorPerformance.category} sector average
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {mockAnalyticsData.sectorPerformance.performanceMetrics.map((metric, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{metric.metric}</span>
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              metric.performance === 'above'
                                ? 'bg-success/10 text-success'
                                : metric.performance === 'below'
                                ? 'bg-destructive/10 text-destructive'
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {metric.performance === 'above' ? '↑' : metric.performance === 'below' ? '↓' : '='} {metric.percentageDiff}% {metric.performance === 'above' ? 'above' : metric.performance === 'below' ? 'below' : 'avg'}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-primary font-semibold">Your Brand: {metric.yourBrand} {metric.unit}</span>
                            <span className="text-muted-foreground">Category Avg: {metric.categoryAvg} {metric.unit}</span>
                          </div>
                          <div className="relative">
                            <div className="w-full bg-muted rounded-full h-3">
                              <div 
                                className="bg-primary h-3 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min((metric.yourBrand / Math.max(metric.yourBrand, metric.categoryAvg)) * 100, 100)}%` 
                                }}
                              />
                            </div>
                            <div 
                              className="absolute top-0 h-3 w-1 bg-amber-500 rounded-full"
                              style={{ 
                                left: `${Math.min((metric.categoryAvg / Math.max(metric.yourBrand, metric.categoryAvg)) * 100, 100)}%` 
                              }}
                            />
                          </div>
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
                    <Target className="h-5 w-5 text-muted-foreground" />
                    <span>Performance Highlights</span>
                  </CardTitle>
                  <CardDescription>
                    Key achievements and areas of excellence
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 divide-x divide-border border border-border rounded-lg overflow-hidden">
                      <div className="text-center p-4">
                        <div className="text-2xl font-bold text-foreground mb-1">
                          {mockAnalyticsData.sectorPerformance.brandPerformance.wasteCollected.toLocaleString()}
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">kg Waste Collected</p>
                        <p className="text-xs text-success mt-1">
                          {((mockAnalyticsData.sectorPerformance.brandPerformance.wasteCollected / mockAnalyticsData.sectorPerformance.categoryAverage.wasteCollected - 1) * 100).toFixed(0)}% above average
                        </p>
                      </div>
                      <div className="text-center p-4">
                        <div className="text-2xl font-bold text-foreground mb-1">
                          {mockAnalyticsData.sectorPerformance.brandPerformance.co2Saved}
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">tons CO₂ Saved</p>
                        <p className="text-xs text-success mt-1">
                          {((mockAnalyticsData.sectorPerformance.brandPerformance.co2Saved / mockAnalyticsData.sectorPerformance.categoryAverage.co2Saved - 1) * 100).toFixed(0)}% above average
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 divide-x divide-border border border-border rounded-lg overflow-hidden">
                      <div className="text-center p-4">
                        <div className="text-2xl font-bold text-foreground mb-1">
                          {mockAnalyticsData.sectorPerformance.brandPerformance.userEngagement.toLocaleString()}
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                        <p className="text-xs text-success mt-1">
                          {((mockAnalyticsData.sectorPerformance.brandPerformance.userEngagement / mockAnalyticsData.sectorPerformance.categoryAverage.userEngagement - 1) * 100).toFixed(0)}% above average
                        </p>
                      </div>
                      <div className="text-center p-4">
                        <div className="text-2xl font-bold text-foreground mb-1">
                          {mockAnalyticsData.sectorPerformance.brandPerformance.recyclingRate}%
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">Recycling Rate</p>
                        <p className="text-xs text-success mt-1">
                          {(mockAnalyticsData.sectorPerformance.brandPerformance.recyclingRate - mockAnalyticsData.sectorPerformance.categoryAverage.recyclingRate).toFixed(0)} points above average
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-success/5 rounded-lg border border-success/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <Trophy className="h-4 w-4 text-success" />
                        <span className="text-sm font-semibold text-success">Outstanding Performance</span>
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
                  <Target className="h-5 w-5 text-muted-foreground" />
                  <span>Performance Summary</span>
                </CardTitle>
                <CardDescription>
                  Key insights and recommendations for your brand
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Strengths</h4>
                    <div className="space-y-2">
                      {mockAnalyticsData.sectorPerformance.performanceMetrics
                        .filter((metric) => metric.performance === "above")
                        .map((metric, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 p-3 bg-success/5 rounded-lg"
                          >
                            <div className="w-2 h-2 bg-success rounded-full flex-shrink-0"></div>
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
                    <h4 className="font-semibold text-foreground">
                      Opportunities
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full flex-shrink-0"></div>
                        <p className="text-sm">
                          <span className="font-medium">User Education:</span>{" "}
                          Implement programs to increase recycling awareness
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full flex-shrink-0"></div>
                        <p className="text-sm">
                          <span className="font-medium">
                            Partnership Growth:
                          </span>{" "}
                          Expand collaborations with local waste management
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full flex-shrink-0"></div>
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

                <div className="mt-6 p-4 bg-success/5 rounded-lg border border-success/20">
                  <div className="flex items-center space-x-3 mb-2">
                    <Trophy className="h-5 w-5 text-success" />
                    <h4 className="font-semibold text-foreground">
                      Category Performance
                    </h4>
                  </div>
                  <p className="text-sm text-foreground mb-2">
                    Your brand is performing <span className="font-bold">above average</span> in
                    the {mockAnalyticsData.sectorPerformance.category} category
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Consistently exceeding category benchmarks across all key sustainability metrics
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Projections Tab */}
        <TabsContent value="projections" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            {/* Forecast Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5 text-foreground" />
                    <span>3-Month Forecast</span>
                  </CardTitle>
                  <CardDescription>
                    {forecastMonth(3)} projections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-3 bg-success/5 rounded-lg">
                      <div className="text-2xl font-bold text-success mb-1">
                        {mockAnalyticsData.projections.threeMonthForecast.co2Savings} tons
                      </div>
                      <p className="text-sm text-muted-foreground">CO₂ Savings</p>
                      <p className="text-xs text-muted-foreground">+{mockAnalyticsData.projections.trendAnalysis.co2SavingsGrowth}% growth</p>
                    </div>
                    
                    <div className="text-center p-3 bg-muted/40 rounded-lg">
                      <div className="text-2xl font-bold text-foreground mb-1">
                        {(mockAnalyticsData.projections.threeMonthForecast.wasteCollection / 1000).toFixed(1)}K kg
                      </div>
                      <p className="text-sm text-muted-foreground">Waste Collection</p>
                      <p className="text-xs text-muted-foreground">+{mockAnalyticsData.projections.trendAnalysis.wasteCollectionGrowth}% monthly</p>
                    </div>
                    
                    <div className="text-center p-3 bg-muted/40 rounded-lg">
                      <div className="text-2xl font-bold text-foreground mb-1">
                        {(mockAnalyticsData.projections.threeMonthForecast.newUsers / 1000).toFixed(1)}K
                      </div>
                      <p className="text-sm text-muted-foreground">New Users</p>
                      <p className="text-xs text-muted-foreground">+{mockAnalyticsData.projections.trendAnalysis.userAcquisitionGrowth}% quarterly</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-warning" />
                    <span>6-Month Forecast</span>
                  </CardTitle>
                  <CardDescription>
                    {forecastMonth(6)} projections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-3 bg-success/5 rounded-lg">
                      <div className="text-2xl font-bold text-success mb-1">
                        {mockAnalyticsData.projections.sixMonthForecast.co2Savings} tons
                      </div>
                      <p className="text-sm text-muted-foreground">CO₂ Savings</p>
                      <p className="text-xs text-muted-foreground">Cumulative impact</p>
                    </div>
                    
                    <div className="text-center p-3 bg-muted/40 rounded-lg">
                      <div className="text-2xl font-bold text-foreground mb-1">
                        {(mockAnalyticsData.projections.sixMonthForecast.wasteCollection / 1000).toFixed(1)}K kg
                      </div>
                      <p className="text-sm text-muted-foreground">Waste Collection</p>
                      <p className="text-xs text-muted-foreground">6-month total</p>
                    </div>
                    
                    <div className="text-center p-3 bg-muted/40 rounded-lg">
                      <div className="text-2xl font-bold text-foreground mb-1">
                        {(mockAnalyticsData.projections.sixMonthForecast.totalUsers / 1000).toFixed(1)}K
                      </div>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                      <p className="text-xs text-muted-foreground">Community size</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-success" />
                    <span>Year-End Forecast</span>
                  </CardTitle>
                  <CardDescription>
                    {yearEndMonth} projections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-3 bg-success/5 rounded-lg">
                      <div className="text-2xl font-bold text-success mb-1">
                        {mockAnalyticsData.projections.yearlyForecast.co2Savings} tons
                      </div>
                      <p className="text-sm text-muted-foreground">CO₂ Savings</p>
                      <p className="text-xs text-muted-foreground">Annual target</p>
                    </div>
                    
                    <div className="text-center p-3 bg-muted/40 rounded-lg">
                      <div className="text-2xl font-bold text-foreground mb-1">
                        {(mockAnalyticsData.projections.yearlyForecast.wasteCollection / 1000).toFixed(0)}K kg
                      </div>
                      <p className="text-sm text-foreground">Waste Collection</p>
                      <p className="text-xs text-muted-foreground">Annual goal</p>
                    </div>
                    
                    <div className="text-center p-3 bg-muted/40 rounded-lg">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {(mockAnalyticsData.projections.yearlyForecast.totalUsers / 1000).toFixed(0)}K
                      </div>
                      <p className="text-sm text-primary">Total Users</p>
                      <p className="text-xs text-muted-foreground">Growth target</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Seasonal Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-foreground" />
                  <span>Seasonal Impact Analysis</span>
                </CardTitle>
                <CardDescription>
                  Quarterly performance factors and expected variations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {mockAnalyticsData.projections.seasonalFactors.map((season, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      season.factor > 1.1 ? 'bg-success/5 border-success/20' :
                      season.factor < 0.95 ? 'bg-warning/5 border-warning/20' :
                      'bg-muted/40 border-border'
                    }`}>
                      <div className="text-center mb-2">
                        <div className={`text-2xl font-bold ${
                          season.factor > 1.1 ? 'text-success' :
                          season.factor < 0.95 ? 'text-warning' :
                          'text-foreground'
                        }`}>
                          {(season.factor * 100).toFixed(0)}%
                        </div>
                        <p className="text-sm font-medium">{season.season}</p>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">{season.reason}</p>
                      <div className="mt-2 text-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          season.factor > 1.1 ? 'bg-success/10 text-success' :
                          season.factor < 0.95 ? 'bg-warning/10 text-warning' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {season.factor > 1.1 ? 'Peak' : season.factor < 0.95 ? 'Low' : 'Normal'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Growth Trends & Opportunities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-success" />
                    <span>Growth Opportunities</span>
                  </CardTitle>
                  <CardDescription>
                    Strategic initiatives to accelerate growth
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 bg-success/5 rounded-lg">
                      <div className="w-2 h-2 bg-success/50 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-foreground">Corporate Partnership Expansion</p>
                        <p className="text-sm text-muted-foreground">Target 25% increase in B2B waste collection</p>
                        <p className="text-xs text-muted-foreground">Est. impact: +3.2 tons CO₂ savings/month</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 bg-muted/40 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-foreground">Mobile App Enhancement</p>
                        <p className="text-sm text-muted-foreground">Gamification features to boost engagement</p>
                        <p className="text-xs text-muted-foreground">Est. impact: +15% user retention</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 bg-accent/10 rounded-lg">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-foreground">Educational Campaigns</p>
                        <p className="text-sm text-muted-foreground">Increase recycling knowledge and participation</p>
                        <p className="text-xs text-muted-foreground">Est. impact: +0.3 kg per user/month</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-warning" />
                    <span>Key Performance Indicators</span>
                  </CardTitle>
                  <CardDescription>
                    Projected improvements in key metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-success/5 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Avg Waste per User</p>
                        <p className="text-sm text-muted-foreground">Current: 1.23 kg/month</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-success">
                          {mockAnalyticsData.projections.yearlyForecast.averageWastePerUser} kg
                        </p>
                        <p className="text-xs text-success">+34% improvement</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-muted/40 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Monthly Engagement</p>
                        <p className="text-sm text-muted-foreground">Current: 25% rate</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">33%</p>
                        <p className="text-xs text-muted-foreground">+{mockAnalyticsData.projections.trendAnalysis.engagementImprovement}% monthly</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-muted/40 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Total Points Earned</p>
                        <p className="text-sm text-muted-foreground">Current: 95.7K points</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">
                          {(mockAnalyticsData.projections.yearlyForecast.pointsEarned / 1000).toFixed(0)}K
                        </p>
                        <p className="text-xs text-muted-foreground">8x growth potential</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

    </div>
  );
};

const OverviewTab: React.FC<{
  campaigns: number;
  analytics?: BrandAnalytics | null;
}> = ({ campaigns, analytics }) => {
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

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border border border-border rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Active Campaigns</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{campaigns}</p>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Unique Users</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {analytics
              ? analytics.summary.uniqueUsers >= 1000
                ? `${(analytics.summary.uniqueUsers / 1000).toFixed(1)}K`
                : analytics.summary.uniqueUsers
              : "—"}
          </p>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Recycle className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Total Redemptions</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {analytics?.summary.totalRedemptions.toLocaleString() ?? "—"}
          </p>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Total Campaigns</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {analytics?.summary.totalCampaigns ?? "—"}
          </p>
        </div>
      </div>

      {/* Analytics Dashboard Section */}
      <AnalyticsDashboard analytics={analytics} />
    </div>
  );
};

export default OverviewTab;
