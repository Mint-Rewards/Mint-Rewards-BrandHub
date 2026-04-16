import {
  Award,
  BarChart3,
  Building2,
  Calendar,
  Leaf,
  Recycle,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
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

const AnalyticsDashboard = () => {
  // Get current month and year for period display
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center space-x-2">
        <BarChart3 className="h-6 w-6 text-green-600" />
        <h2 className="text-2xl font-bold text-foreground">
          Sustainability Analytics Dashboard
        </h2>
      </div>

      {/* Period Information */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-lg p-4 border border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Statistics Period
              </h3>
              <p className="text-sm text-muted-foreground">
                The following metrics represent data for{" "}
                <span className="font-medium text-primary">
                  {currentMonth} {currentYear}
                </span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{currentMonth}</p>
            <p className="text-sm text-muted-foreground">{currentYear}</p>
          </div>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Recycle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Total Wastage Collected
                </p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-100">
                  {(
                    mockAnalyticsData.kpis.totalWastageCollected / 1000
                  ).toFixed(1)}
                  K kg
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  CO₂ Emissions Saved
                </p>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-100">
                  {mockAnalyticsData.kpis.co2EmissionsSaved} tons
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Waste Recycled
                </p>
                <p className="text-2xl font-bold text-purple-800 dark:text-purple-100">
                  {(mockAnalyticsData.kpis.totalWasteRecycled / 1000).toFixed(
                    1
                  )}
                  K kg
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Users Registered
                </p>
                <p className="text-2xl font-bold text-orange-800 dark:text-orange-100">
                  {(mockAnalyticsData.kpis.usersRegistered / 1000).toFixed(1)}K
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  Active Users
                </p>
                <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-100">
                  {(mockAnalyticsData.kpis.activeUsers / 1000).toFixed(1)}K
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="impact" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="impact">Impact</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="brands">Brands</TabsTrigger>
          <TabsTrigger value="sector">Sector</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
        </TabsList>

        {/* Impact Tab */}
        <TabsContent value="impact" className="space-y-4">
          {/* Sub-tabs for Company and User Impact */}
          <Tabs defaultValue="company" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="company">Impact Company</TabsTrigger>
              <TabsTrigger value="users">Impact Users</TabsTrigger>
            </TabsList>

            {/* Company Impact Tab */}
            <TabsContent value="company" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Company Waste Collection Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <span>Company Waste Collection</span>
                    </CardTitle>
                    <CardDescription>
                      Direct waste collection from company operations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <p className="text-3xl font-bold text-blue-600">
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
                      <Leaf className="h-5 w-5 text-green-600" />
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
                                <p className="text-sm font-semibold text-green-600">
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
                          <span className="text-lg font-bold text-green-600">
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
                      <BarChart3 className="h-5 w-5 text-purple-600" />
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
                            value: { label: "Weight (kg)", color: "#8B5CF6" },
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
                                fill="#8B5CF6"
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
                      <Users className="h-5 w-5 text-emerald-600" />
                      <span>User Collections</span>
                    </CardTitle>
                    <CardDescription>
                      Estimated impact from user waste collections
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <p className="text-3xl font-bold text-emerald-600">
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
                                <p className="text-sm font-semibold text-green-600">
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
                      <Target className="h-5 w-5 text-blue-600" />
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
                            <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                              <div className="p-2 bg-green-500 rounded-lg">
                                <span className="text-white text-lg">🌳</span>
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

                            <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <div className="p-2 bg-blue-500 rounded-lg">
                                <span className="text-white text-lg">🚗</span>
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

                            <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                              <div className="p-2 bg-yellow-500 rounded-lg">
                                <span className="text-white text-lg">💡</span>
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
                      <Leaf className="h-5 w-5 text-green-600" />
                      <span>User Community Impact Summary</span>
                    </CardTitle>
                    <CardDescription>
                      Combined environmental impact of all user collections
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                        <div className="text-3xl font-bold text-green-600 mb-2">
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

                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {mockAnalyticsData.kpis.activeUsers.toLocaleString()}
                        </div>
                        <p className="text-sm font-medium">
                          Active Contributors
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Participating users
                        </p>
                      </div>

                      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
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
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
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
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
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
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
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
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
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
                  <Users className="h-5 w-5 text-indigo-600" />
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
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    85% collection success rate
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Waste per User</span>
                    <span>{mockAnalyticsData.userStatistics.averageWastePerUser} kg/month</span>
                  </div>
                  <Progress value={62} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Above target of 1.0 kg/month
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Active Users</span>
                    <span>{mockAnalyticsData.userStatistics.activeUsers.toLocaleString()} / {mockAnalyticsData.userStatistics.totalUsers.toLocaleString()}</span>
                  </div>
                  <Progress value={mockAnalyticsData.userStatistics.engagementRate} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {mockAnalyticsData.userStatistics.engagementRate}% monthly engagement rate
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>New Users This Month</span>
                    <span>{mockAnalyticsData.userStatistics.newUsersThisMonth}</span>
                  </div>
                  <Progress value={75} className="h-2" />
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
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <span>User Performance Tiers</span>
                </CardTitle>
                <CardDescription>
                  Distribution of users by recycling performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                        <Trophy className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-yellow-800">Platinum Tier</p>
                        <p className="text-sm text-yellow-700">200+ kg recycled</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-yellow-800">{mockAnalyticsData.userStatistics.userTiers.platinum}</p>
                      <p className="text-xs text-yellow-600">users</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                        <Award className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-amber-800">Gold Tier</p>
                        <p className="text-sm text-amber-700">150-199 kg recycled</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-amber-800">{mockAnalyticsData.userStatistics.userTiers.gold}</p>
                      <p className="text-xs text-amber-600">users</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">S</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Silver Tier</p>
                        <p className="text-sm text-gray-700">100-149 kg recycled</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-800">{mockAnalyticsData.userStatistics.userTiers.silver}</p>
                      <p className="text-xs text-gray-600">users</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">B</span>
                      </div>
                      <div>
                        <p className="font-medium text-orange-800">Bronze Tier</p>
                        <p className="text-sm text-orange-700">50-99 kg recycled</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-800">{mockAnalyticsData.userStatistics.userTiers.bronze}</p>
                      <p className="text-xs text-orange-600">users</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">ST</span>
                      </div>
                      <div>
                        <p className="font-medium text-blue-800">Starter</p>
                        <p className="text-sm text-blue-700">0-49 kg recycled</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-800">{mockAnalyticsData.userStatistics.userTiers.starter}</p>
                      <p className="text-xs text-blue-600">users</p>
                    </div>
                  </div>
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
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {mockAnalyticsData.userStatistics.averagePointsPerUser.toLocaleString()}
                    </div>
                    <p className="text-sm font-medium text-green-700">Avg Points per User</p>
                    <p className="text-xs text-muted-foreground mt-1">15% above last month</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {mockAnalyticsData.userStatistics.topPerformerWaste} kg
                    </div>
                    <p className="text-sm font-medium text-blue-700">Top User Performance</p>
                    <p className="text-xs text-muted-foreground mt-1">Monthly record</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {((mockAnalyticsData.userStatistics.userTiers.platinum + mockAnalyticsData.userStatistics.userTiers.gold) / mockAnalyticsData.userStatistics.totalUsers * 100).toFixed(1)}%
                    </div>
                    <p className="text-sm font-medium text-purple-700">High Performers</p>
                    <p className="text-xs text-muted-foreground mt-1">Gold & Platinum users</p>
                  </div>
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
        </TabsContent>

        {/* Brands Tab */}
        <TabsContent value="brands" className="space-y-4">
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
                  <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-700">12</p>
                        <p className="text-sm text-green-600">
                          Active Campaigns
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-700">78%</p>
                        <p className="text-sm text-blue-600">
                          Coupon Usage Rate
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-700">
                          2,630
                        </p>
                        <p className="text-sm text-purple-600">
                          Total Redemptions
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-700">
                          4.6
                        </p>
                        <p className="text-sm text-orange-600">
                          Customer Rating
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Campaign Performance</h4>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Summer Eco Sale</p>
                        <p className="text-sm text-muted-foreground">
                          850 redemptions this month
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">89%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: "89%" }}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Success Rate
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Green Friday Deals</p>
                        <p className="text-sm text-muted-foreground">
                          680 redemptions this month
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">76%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: "76%" }}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Success Rate
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Sustainability Rewards</p>
                        <p className="text-sm text-muted-foreground">
                          1,100 redemptions this month
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">82%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: "82%" }}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Success Rate
                      </p>
                    </div>
                  </div>
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
                  <Trophy className="h-5 w-5 text-amber-600" />
                  <span>Sector Performance Overview</span>
                </CardTitle>
                <CardDescription>
                  Your brand vs {mockAnalyticsData.sectorPerformance.category}{" "}
                  category average
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {mockAnalyticsData.sectorPerformance.performanceMetrics.map(
                    (metric, index) => (
                      <Card
                        key={index}
                        className={`${
                          metric.performance === "above"
                            ? "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200"
                            : metric.performance === "below"
                            ? "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200"
                            : "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border-gray-200"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="text-center space-y-2">
                            <div
                              className={`text-2xl font-bold ${
                                metric.performance === "above"
                                  ? "text-green-700"
                                  : metric.performance === "below"
                                  ? "text-red-700"
                                  : "text-gray-700"
                              }`}
                            >
                              {metric.yourBrand} {metric.unit}
                            </div>
                            <p className="text-sm font-medium">
                              {metric.metric}
                            </p>
                            <div className="flex items-center justify-center space-x-1">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  metric.performance === "above"
                                    ? "bg-green-100 text-green-700"
                                    : metric.performance === "below"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {metric.performance === "above"
                                  ? "↑"
                                  : metric.performance === "below"
                                  ? "↓"
                                  : "="}{" "}
                                {metric.percentageDiff}%
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Category avg: {metric.categoryAvg} {metric.unit}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
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
                    <BarChart3 className="h-5 w-5 text-blue-600" />
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
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              metric.performance === 'above' 
                                ? 'bg-green-100 text-green-700' 
                                : metric.performance === 'below'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {metric.performance === 'above' ? '↑' : metric.performance === 'below' ? '↓' : '='} {metric.percentageDiff}%
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-primary font-semibold">Your Brand: {metric.yourBrand} {metric.unit}</span>
                            <span className="text-muted-foreground">Category Avg: {metric.categoryAvg} {metric.unit}</span>
                          </div>
                          <div className="relative">
                            <div className="w-full bg-gray-200 rounded-full h-3">
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
                      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {mockAnalyticsData.sectorPerformance.brandPerformance.wasteCollected.toLocaleString()}
                        </div>
                        <p className="text-sm font-medium text-green-700">kg Waste Collected</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {((mockAnalyticsData.sectorPerformance.brandPerformance.wasteCollected / mockAnalyticsData.sectorPerformance.categoryAverage.wasteCollected - 1) * 100).toFixed(0)}% above average
                        </p>
                      </div>
                      
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {mockAnalyticsData.sectorPerformance.brandPerformance.co2Saved}
                        </div>
                        <p className="text-sm font-medium text-blue-700">tons CO₂ Saved</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {((mockAnalyticsData.sectorPerformance.brandPerformance.co2Saved / mockAnalyticsData.sectorPerformance.categoryAverage.co2Saved - 1) * 100).toFixed(0)}% above average
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                          {mockAnalyticsData.sectorPerformance.brandPerformance.userEngagement.toLocaleString()}
                        </div>
                        <p className="text-sm font-medium text-purple-700">Active Users</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {((mockAnalyticsData.sectorPerformance.brandPerformance.userEngagement / mockAnalyticsData.sectorPerformance.categoryAverage.userEngagement - 1) * 100).toFixed(0)}% above average
                        </p>
                      </div>
                      
                      <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600 mb-1">
                          {mockAnalyticsData.sectorPerformance.brandPerformance.recyclingRate}%
                        </div>
                        <p className="text-sm font-medium text-orange-700">Recycling Rate</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(mockAnalyticsData.sectorPerformance.brandPerformance.recyclingRate - mockAnalyticsData.sectorPerformance.categoryAverage.recyclingRate).toFixed(0)} points above average
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200">
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
                      {mockAnalyticsData.sectorPerformance.performanceMetrics
                        .filter((metric) => metric.performance === "above")
                        .map((metric, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg"
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
                      <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <p className="text-sm">
                          <span className="font-medium">User Education:</span>{" "}
                          Implement programs to increase recycling awareness
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <p className="text-sm">
                          <span className="font-medium">
                            Partnership Growth:
                          </span>{" "}
                          Expand collaborations with local waste management
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
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

                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <Trophy className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-green-700">
                      Category Performance
                    </h4>
                  </div>
                  <p className="text-sm text-green-600 mb-2">
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
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span>3-Month Forecast</span>
                  </CardTitle>
                  <CardDescription>
                    December 2025 projections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {mockAnalyticsData.projections.threeMonthForecast.co2Savings} tons
                      </div>
                      <p className="text-sm text-green-700">CO₂ Savings</p>
                      <p className="text-xs text-muted-foreground">+{mockAnalyticsData.projections.trendAnalysis.co2SavingsGrowth}% growth</p>
                    </div>
                    
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {(mockAnalyticsData.projections.threeMonthForecast.wasteCollection / 1000).toFixed(1)}K kg
                      </div>
                      <p className="text-sm text-blue-700">Waste Collection</p>
                      <p className="text-xs text-muted-foreground">+{mockAnalyticsData.projections.trendAnalysis.wasteCollectionGrowth}% monthly</p>
                    </div>
                    
                    <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {(mockAnalyticsData.projections.threeMonthForecast.newUsers / 1000).toFixed(1)}K
                      </div>
                      <p className="text-sm text-purple-700">New Users</p>
                      <p className="text-xs text-muted-foreground">+{mockAnalyticsData.projections.trendAnalysis.userAcquisitionGrowth}% quarterly</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-amber-600" />
                    <span>6-Month Forecast</span>
                  </CardTitle>
                  <CardDescription>
                    March 2026 projections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {mockAnalyticsData.projections.sixMonthForecast.co2Savings} tons
                      </div>
                      <p className="text-sm text-green-700">CO₂ Savings</p>
                      <p className="text-xs text-muted-foreground">Cumulative impact</p>
                    </div>
                    
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {(mockAnalyticsData.projections.sixMonthForecast.wasteCollection / 1000).toFixed(1)}K kg
                      </div>
                      <p className="text-sm text-blue-700">Waste Collection</p>
                      <p className="text-xs text-muted-foreground">6-month total</p>
                    </div>
                    
                    <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600 mb-1">
                        {(mockAnalyticsData.projections.sixMonthForecast.totalUsers / 1000).toFixed(1)}K
                      </div>
                      <p className="text-sm text-orange-700">Total Users</p>
                      <p className="text-xs text-muted-foreground">Community size</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-green-600" />
                    <span>Year-End Forecast</span>
                  </CardTitle>
                  <CardDescription>
                    September 2026 projections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {mockAnalyticsData.projections.yearlyForecast.co2Savings} tons
                      </div>
                      <p className="text-sm text-green-700">CO₂ Savings</p>
                      <p className="text-xs text-muted-foreground">Annual target</p>
                    </div>
                    
                    <div className="text-center p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600 mb-1">
                        {(mockAnalyticsData.projections.yearlyForecast.wasteCollection / 1000).toFixed(0)}K kg
                      </div>
                      <p className="text-sm text-indigo-700">Waste Collection</p>
                      <p className="text-xs text-muted-foreground">Annual goal</p>
                    </div>
                    
                    <div className="text-center p-3 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg">
                      <div className="text-2xl font-bold text-teal-600 mb-1">
                        {(mockAnalyticsData.projections.yearlyForecast.totalUsers / 1000).toFixed(0)}K
                      </div>
                      <p className="text-sm text-teal-700">Total Users</p>
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
                  <BarChart3 className="h-5 w-5 text-purple-600" />
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
                      season.factor > 1.1 ? 'bg-green-50 border-green-200' : 
                      season.factor < 0.95 ? 'bg-orange-50 border-orange-200' : 
                      'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="text-center mb-2">
                        <div className={`text-2xl font-bold ${
                          season.factor > 1.1 ? 'text-green-600' : 
                          season.factor < 0.95 ? 'text-orange-600' : 
                          'text-blue-600'
                        }`}>
                          {(season.factor * 100).toFixed(0)}%
                        </div>
                        <p className="text-sm font-medium">{season.season}</p>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">{season.reason}</p>
                      <div className="mt-2 text-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          season.factor > 1.1 ? 'bg-green-100 text-green-700' : 
                          season.factor < 0.95 ? 'bg-orange-100 text-orange-700' : 
                          'bg-blue-100 text-blue-700'
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
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    <span>Growth Opportunities</span>
                  </CardTitle>
                  <CardDescription>
                    Strategic initiatives to accelerate growth
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-lg">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-emerald-800">Corporate Partnership Expansion</p>
                        <p className="text-sm text-emerald-700">Target 25% increase in B2B waste collection</p>
                        <p className="text-xs text-muted-foreground">Est. impact: +3.2 tons CO₂ savings/month</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-blue-800">Mobile App Enhancement</p>
                        <p className="text-sm text-blue-700">Gamification features to boost engagement</p>
                        <p className="text-xs text-muted-foreground">Est. impact: +15% user retention</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-purple-800">Educational Campaigns</p>
                        <p className="text-sm text-purple-700">Increase recycling knowledge and participation</p>
                        <p className="text-xs text-muted-foreground">Est. impact: +0.3 kg per user/month</p>
                      </div>
                    </div>
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
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <div>
                        <p className="font-medium text-green-800">Avg Waste per User</p>
                        <p className="text-sm text-green-700">Current: 1.23 kg/month</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          {mockAnalyticsData.projections.yearlyForecast.averageWastePerUser} kg
                        </p>
                        <p className="text-xs text-green-500">+34% improvement</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-800">Monthly Engagement</p>
                        <p className="text-sm text-blue-700">Current: 25% rate</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">33%</p>
                        <p className="text-xs text-blue-500">+{mockAnalyticsData.projections.trendAnalysis.engagementImprovement}% monthly</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <div>
                        <p className="font-medium text-purple-800">Total Points Earned</p>
                        <p className="text-sm text-purple-700">Current: 95.7K points</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-purple-600">
                          {(mockAnalyticsData.projections.yearlyForecast.pointsEarned / 1000).toFixed(0)}K
                        </p>
                        <p className="text-xs text-purple-500">8x growth potential</p>
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
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    Active Campaigns
                  </span>
                </div>
                <p className="text-2xl font-bold mt-2 text-green-800 dark:text-green-100">
                  {campaigns}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  +1 from last month
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Eco Users Reached
                  </span>
                </div>
                <p className="text-2xl font-bold mt-2 text-blue-800 dark:text-blue-100">
                  3.2K
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  +15% from last month
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Recycle className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    Reward Redemptions
                  </span>
                </div>
                <p className="text-2xl font-bold mt-2 text-purple-800 dark:text-purple-100">
                  2,630
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  +28% from last month
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />

                  <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                    Growth Rate
                  </span>
                </div>
                <p className="text-2xl font-bold mt-2 text-orange-800 dark:text-orange-100">
                  +24%
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  +4% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Dashboard Section */}
          <AnalyticsDashboard />
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewTab;
