import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  ArrowRight,
  TrendingUp,
  Users,
  Tag,
  BarChart3,
  ArrowLeft,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DEMO_BRAND = {
  brandName: "Acme Coffee Co.",
  companyName: "Acme Beverages Ltd.",
  category: "Food & Beverage",
  email: "hello@acmecoffee.com",
  website: "https://acmecoffee.com",
  themeColor: "#3B82F6",
  status: "APPROVED",
  description:
    "Premium single-origin coffee sourced directly from sustainable farms around the world.",
};

const DEMO_CAMPAIGNS = [
  {
    id: "c1",
    name: "Summer Brew Fest",
    status: "APPROVED",
    startDate: "2026-06-01",
    endDate: "2026-08-31",
    campaignType: "Seasonal",
    budget: 5000,
    description: "A summer-long campaign celebrating our seasonal cold brew lineup.",
  },
  {
    id: "c2",
    name: "Loyalty Launch",
    status: "PENDING",
    startDate: "2026-07-15",
    endDate: "2026-09-15",
    campaignType: "Retention",
    budget: 2500,
    description: "Rewarding returning customers with exclusive discounts and early access.",
  },
  {
    id: "c3",
    name: "New Blend Reveal",
    status: "APPROVED",
    startDate: "2026-05-01",
    endDate: "2026-05-31",
    campaignType: "Product Launch",
    budget: 3200,
    description: "Introducing our latest single-origin Ethiopian blend to the market.",
  },
];

const DEMO_DEALS = [
  {
    id: "d1",
    title: "10% Off Your First Order",
    status: "active",
    discountPercentage: 10,
    promoCode: "ACME10",
    startDate: "2026-06-01",
    endDate: "2026-12-31",
    maxUses: 500,
    currentUses: 142,
  },
  {
    id: "d2",
    title: "Free Shipping on $30+",
    status: "active",
    discountAmount: 0,
    promoCode: "SHIPFREE",
    startDate: "2026-06-15",
    endDate: "2026-08-15",
    maxUses: 1000,
    currentUses: 389,
  },
  {
    id: "d3",
    title: "Buy 2 Get 1 Free Beans",
    status: "inactive",
    discountPercentage: 33,
    promoCode: "B2G1BEANS",
    startDate: "2026-09-01",
    endDate: "2026-10-31",
    maxUses: 200,
    currentUses: 0,
  },
];

const statusVariant = (status: string) => {
  const s = status.toUpperCase();
  if (s === "APPROVED" || s === "ACTIVE") return "default";
  if (s === "REJECTED" || s === "INACTIVE") return "destructive";
  return "secondary";
};

const DemoPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const approvedCampaigns = DEMO_CAMPAIGNS.filter(
    (c) => c.status.toUpperCase() === "APPROVED",
  ).length;
  const pendingCampaigns = DEMO_CAMPAIGNS.filter(
    (c) => c.status.toUpperCase() === "PENDING",
  ).length;
  const activeDeals = DEMO_DEALS.filter(
    (d) => d.status.toLowerCase() === "active",
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: DEMO_BRAND.themeColor }}
                >
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">{DEMO_BRAND.brandName}</h1>
                  <p className="text-xs text-muted-foreground">
                    {DEMO_BRAND.category}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="text-xs">
                Demo Mode
              </Badge>
              <Button variant="gradient" onClick={() => navigate("/register")}>
                Register Your Brand
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Banner */}
      <div className="bg-primary/10 border-b border-primary/20 text-center py-2 px-4 text-sm text-primary font-medium">
        You're viewing a read-only demo. Register to create your own brand dashboard.
      </div>

      <main className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Stats Row */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Campaigns</span>
                </div>
                <p className="text-2xl font-bold">{DEMO_CAMPAIGNS.length}</p>
                <p className="text-xs text-muted-foreground">
                  {approvedCampaigns} approved · {pendingCampaigns} pending
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Deals</span>
                </div>
                <p className="text-2xl font-bold">{DEMO_DEALS.length}</p>
                <p className="text-xs text-muted-foreground">
                  {activeDeals} active
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Promo Redemptions</span>
                </div>
                <p className="text-2xl font-bold">
                  {DEMO_DEALS.reduce((acc, d) => acc + d.currentUses, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Across all deals</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Total Budget</span>
                </div>
                <p className="text-2xl font-bold">
                  ${DEMO_CAMPAIGNS.reduce((acc, c) => acc + c.budget, 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Across all campaigns</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="deals">Deals</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Brand Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {[
                      ["Company", DEMO_BRAND.companyName],
                      ["Brand", DEMO_BRAND.brandName],
                      ["Category", DEMO_BRAND.category],
                      ["Website", DEMO_BRAND.website],
                      ["Email", DEMO_BRAND.email],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium text-right max-w-[60%] truncate">
                          {value}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="default">Approved</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {DEMO_BRAND.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <div
                        className="h-6 w-6 rounded border"
                        style={{ backgroundColor: DEMO_BRAND.themeColor }}
                      />
                      <span className="text-sm text-muted-foreground">
                        Theme: {DEMO_BRAND.themeColor}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">Recent Campaigns</CardTitle>
                    <CardDescription>Latest campaign activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {DEMO_CAMPAIGNS.map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center justify-between py-2 border-b last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            {c.status.toUpperCase() === "APPROVED" ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-500" />
                            )}
                            <span className="text-sm font-medium">{c.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground">
                              {new Date(c.startDate).toLocaleDateString()} –{" "}
                              {new Date(c.endDate).toLocaleDateString()}
                            </span>
                            <Badge variant={statusVariant(c.status)}>
                              {c.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Campaigns */}
            <TabsContent value="campaigns" className="space-y-4">
              {DEMO_CAMPAIGNS.map((campaign) => (
                <Card key={campaign.id} className="hover:bg-muted/40 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <TrendingUp className="h-5 w-5 text-muted-foreground" />
                          <h3 className="text-lg font-semibold">{campaign.name}</h3>
                          <Badge variant={statusVariant(campaign.status)}>
                            {campaign.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {campaign.description}
                        </p>
                        <div className="grid md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-foreground">Type</p>
                            <p className="text-muted-foreground">{campaign.campaignType}</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Budget</p>
                            <p className="text-muted-foreground">${campaign.budget.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Start</p>
                            <p className="text-muted-foreground">
                              {new Date(campaign.startDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">End</p>
                            <p className="text-muted-foreground">
                              {new Date(campaign.endDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Deals */}
            <TabsContent value="deals" className="space-y-4">
              {DEMO_DEALS.map((deal) => (
                <Card key={deal.id} className="hover:bg-muted/40 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Tag className="h-5 w-5 text-muted-foreground" />
                          <h3 className="text-lg font-semibold">{deal.title}</h3>
                          <Badge variant={statusVariant(deal.status)}>
                            {deal.status}
                          </Badge>
                        </div>
                        <div className="grid md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-foreground">Promo Code</p>
                            <p className="text-muted-foreground font-mono">{deal.promoCode}</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Discount</p>
                            <p className="text-muted-foreground">
                              {"discountPercentage" in deal && deal.discountPercentage
                                ? `${deal.discountPercentage}% off`
                                : "Free shipping"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Uses</p>
                            <p className="text-muted-foreground">
                              {deal.currentUses} / {deal.maxUses}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Expires</p>
                            <p className="text-muted-foreground">
                              {new Date(deal.endDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          {/* CTA */}
          <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Ready to manage your brand?</h2>
              <p className="text-muted-foreground mb-6">
                Register today and get your own dashboard — campaigns, deals, analytics, and more.
              </p>
              <Button size="lg" variant="gradient" onClick={() => navigate("/register")}>
                Register Your Brand
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DemoPage;
