// CO2 savings per kg for different materials (in kg CO2 saved per kg of material)
export const CO2_SAVINGS_PER_KG = {
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
export const EQUIVALENT_CONVERSIONS = {
  treesPlanted: 0.025, // 1 kg CO2 saved = ~0.025 trees planted (40kg CO2 per tree per year)
  kmDriving: 4.6, // 1 kg CO2 saved = ~4.6 km of driving (average car emits 0.21 kg CO2/km)
  lightBulbHours: 100, // 1 kg CO2 saved = ~100 hours of LED light bulb usage
};

// Maps a waste breakdown item name to its CO2_SAVINGS_PER_KG key
export const getMaterialKey = (name: string): keyof typeof CO2_SAVINGS_PER_KG => {
  const key = name.toLowerCase();
  return key in CO2_SAVINGS_PER_KG ? (key as keyof typeof CO2_SAVINGS_PER_KG) : "paper";
};

// Sample data for the analytics dashboard
export const mockAnalyticsData = {
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
