import { BarChart3, Leaf, Recycle, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockAnalyticsData } from "./data";
import StatCard from "./StatCard";
import PeriodHeader from "./PeriodHeader";
import ImpactTab from "./ImpactTab";
import RewardsTab from "./RewardsTab";
import UsersTab from "./UsersTab";
import BrandsTab from "./BrandsTab";
import SectorTab from "./SectorTab";
import ProjectionsTab from "./ProjectionsTab";

const AnalyticsDashboard = () => {
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
      <PeriodHeader />

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={Recycle}
          label="Total Wastage Collected"
          value={`${(mockAnalyticsData.kpis.totalWastageCollected / 1000).toFixed(1)}K kg`}
          iconWrapperClassName="bg-green-500/10 text-green-600 dark:text-green-400"
        />

        <StatCard
          icon={Leaf}
          label="CO₂ Emissions Saved"
          value={`${mockAnalyticsData.kpis.co2EmissionsSaved} tons`}
          iconWrapperClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />

        <StatCard
          icon={Target}
          label="Waste Recycled"
          value={`${(mockAnalyticsData.kpis.totalWasteRecycled / 1000).toFixed(1)}K kg`}
          iconWrapperClassName="bg-purple-500/10 text-purple-600 dark:text-purple-400"
        />

        {/* <StatCard
          icon={Users}
          label="Users Registered"
          value={`${(mockAnalyticsData.kpis.usersRegistered / 1000).toFixed(1)}K`}
          cardClassName="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200"
          iconWrapperClassName="bg-orange-500"
          labelClassName="text-orange-700 dark:text-orange-300"
          valueClassName="text-orange-800 dark:text-orange-100"
        />

        <StatCard
          icon={TrendingUp}
          label="Active Users"
          value={`${(mockAnalyticsData.kpis.activeUsers / 1000).toFixed(1)}K`}
          cardClassName="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200"
          iconWrapperClassName="bg-emerald-500"
          labelClassName="text-emerald-700 dark:text-emerald-300"
          valueClassName="text-emerald-800 dark:text-emerald-100"
        /> */}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="impact" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="impact">Impact</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          {/* <TabsTrigger value="users">Users</TabsTrigger> */}
          <TabsTrigger value="brands">Brands</TabsTrigger>
          {/* <TabsTrigger value="sector">Sector</TabsTrigger> */}
          {/* <TabsTrigger value="projections">Projections</TabsTrigger> */}
        </TabsList>

        {/* Impact Tab */}
        <TabsContent value="impact" className="space-y-4">
          <ImpactTab />
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-4">
          <RewardsTab />
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <UsersTab />
        </TabsContent>

        {/* Brands Tab */}
        <TabsContent value="brands" className="space-y-4">
          <BrandsTab />
        </TabsContent>

        {/* Sector Performance Tab */}
        <TabsContent value="sector" className="space-y-4">
          <SectorTab />
        </TabsContent>

        {/* Projections Tab */}
        <TabsContent value="projections" className="space-y-4">
          <ProjectionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
