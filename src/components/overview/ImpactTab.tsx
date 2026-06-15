import {
  Building2,
  Leaf,
  BarChart3,
  Users,
  Target,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Cell,
  Pie,
  ResponsiveContainer,
  XAxis,
  YAxis,
  PieChart,
  Bar,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CO2_SAVINGS_PER_KG, EQUIVALENT_CONVERSIONS, getMaterialKey, mockAnalyticsData } from "./data";
import CenteredStat from "./CenteredStat";

const ImpactTab = () => {
  return (
    <Tabs defaultValue="company" className="space-y-4">
      {/* <TabsList className="grid w-full grid-cols-2"> */}
        {/* <TabsTrigger value="company">Impact Company</TabsTrigger> */}
        {/* <TabsTrigger value="users">Impact Users</TabsTrigger> */}
      {/* </TabsList> */}

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
                    const co2Saved = (
                      item.value * CO2_SAVINGS_PER_KG[getMaterialKey(item.name)]
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
                <Separator />
                <div className="pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">
                      Total CO₂ Savings:
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      {mockAnalyticsData.companyWaste.breakdown
                        .reduce(
                          (total, item) =>
                            total +
                            item.value * CO2_SAVINGS_PER_KG[getMaterialKey(item.name)],
                          0
                        )
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
                <CenteredStat
                  containerClassName="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
                  valueClassName="text-3xl font-bold mb-2 text-green-600"
                  value={mockAnalyticsData.userImpact.estimatedBreakdown
                    .reduce(
                      (total, item) =>
                        total + item.weight * item.co2Saved,
                      0
                    )
                    .toFixed(1)}
                  label="kg CO₂ Saved"
                  caption="This month"
                />

                <CenteredStat
                  containerClassName="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
                  valueClassName="text-3xl font-bold mb-2 text-blue-600"
                  value={mockAnalyticsData.kpis.activeUsers.toLocaleString()}
                  label="Active Contributors"
                  caption="Participating users"
                />

                <CenteredStat
                  containerClassName="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
                  valueClassName="text-3xl font-bold mb-2 text-purple-600"
                  value={(
                    (mockAnalyticsData.userImpact.totalUserWaste /
                      mockAnalyticsData.kpis.activeUsers) *
                    1000
                  ).toFixed(0)}
                  label="g per User"
                  caption="Average contribution"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ImpactTab;
