import { useState, useEffect } from "react";
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
  Clock,
  AlertCircle,
  Eye,
  Bell,
  Mail,
  Phone,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchBrandById,
  fetchCampaignsForBrand,
  fetchDealsForBrand,
  fetchBrandAnalytics,
  type BrandAnalytics,
} from "@/actions/brandActions";

import { useToast } from "@/hooks/use-toast";

import OverviewTab from "@/components/OverviewTab";
import CampaignsTab from "@/components/CampaignsTab";
import { Brand, Campaign, Deal } from "@/types";
import DealsTab from "@/components/DealsTab";
import SettingsTab from "@/components/SettingsTab";

const BrandDashboard = () => {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [brandData, setBrandData] = useState<Brand>();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [analytics, setAnalytics] = useState<BrandAnalytics | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    const fetchBrandData = async () => {
      if (!brandId) {
        navigate("/");
        return;
      }

      try {
        const brand = await fetchBrandById(brandId);
        setBrandData(brand);
      } catch (error) {
        console.error("Unexpected error:", error);
        toast({
          title: "Error loading brand data",
          description: "Please try again later.",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    const fetchCampaigns = async () => {
      if (!brandId) return;
      try {
        const data = await fetchCampaignsForBrand(brandId);
        setCampaigns(data);
      } catch {
        // silently ignore
      }
    };

    const fetchDeals = async () => {
      if (!brandId) return;
      const data = await fetchDealsForBrand(brandId);
      setDeals(data);
    };

    const fetchAnalytics = async () => {
      if (!brandId) return;
      const data = await fetchBrandAnalytics(brandId);
      setAnalytics(data);
    };

    fetchBrandData();
    fetchCampaigns();
    fetchDeals();
    fetchAnalytics();
  }, [brandId, navigate, toast]);

  const refreshCampaigns = async () => {
    if (!brandId) return;
    try {
      const data = await fetchCampaignsForBrand(brandId);
      setCampaigns(data);
    } catch {
      // silently ignore
    }
  };

  const refreshDeals = async () => {
    if (!brandId) return;
    const data = await fetchDealsForBrand(brandId);
    setDeals(data);
  };

  const refreshBrand = async () => {
    if (!brandId) return;
    try {
      const brand = await fetchBrandById(brandId);
      setBrandData(brand);
    } catch {
      // silently ignore
    }
  };

  // Function to handle campaign creation success
  const handleCampaignCreated = async () => {
    await refreshCampaigns();
    setActiveTab("campaigns"); // Switch to campaigns tab after creation
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50 sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-32 rounded-md" />
            </div>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8 space-y-6">
          <div className="grid grid-cols-4 gap-2">
            <Skeleton className="h-10 rounded-md" />
            <Skeleton className="h-10 rounded-md" />
            <Skeleton className="h-10 rounded-md" />
            <Skeleton className="h-10 rounded-md" />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6 space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32" />
              </Card>
            ))}
          </div>
          <Card className="p-6 space-y-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-64 w-full rounded-md" />
          </Card>
        </main>
      </div>
    );
  }

  if (!brandData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-lg font-semibold mb-2">Brand Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The requested brand could not be found.
          </p>
          <Button onClick={() => navigate("/")}>Return Home</Button>
        </Card>
      </div>
    );
  }

  const isApproved = brandData.status?.toLowerCase() === "approved";
  const formattedData = {
    name: brandData.brandName,
    companyName: brandData.companyName,
    category: brandData.category,
    status: brandData.status,
    submissionDate: new Date(brandData.createdAt ?? "").toLocaleDateString(),
    estimatedApproval: "2-3 business days",
    referenceNumber: `REF-${(brandData.id ?? brandData._id ?? "").substring(0, 8).toUpperCase()}`,
    contactEmail: brandData.email || "N/A",
    contactPhone: brandData.phone || "N/A",
    website: brandData.website,
    description: brandData.description,
    logoUrl: brandData.logo,
    themeColor: brandData.themeColor || "#3B82F6",
  };

  const PendingApprovalView = () => (
    <div className="space-y-6">
      {/* Status Header */}
      <Card className="border-warning/20 bg-warning/5">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-warning/20 flex items-center justify-center">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <CardTitle className="text-xl text-amber-700">
                Pending Approval
              </CardTitle>
              <CardDescription>
                Your brand registration is currently being reviewed by our team
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Reference Number
                </p>
                <p className="text-lg font-mono">
                  {formattedData.referenceNumber}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Submitted
                </p>
                <p className="text-lg">{formattedData.submissionDate}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Estimated Approval
                </p>
                <p className="text-lg">{formattedData.estimatedApproval}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Current Status
                </p>
                <Badge
                  variant="secondary"
                  className="bg-warning/10 text-amber-700"
                >
                  Under Review
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What's Next */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            What's Next?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
              <div>
                <p className="font-medium">Marketing Team Review</p>
                <p className="text-sm text-muted-foreground">
                  Our marketing team is reviewing your brand information and
                  assets
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 rounded-full bg-muted-foreground mt-2"></div>
              <div>
                <p className="font-medium text-muted-foreground">
                  Approval Decision
                </p>
                <p className="text-sm text-muted-foreground">
                  You'll receive an email notification with the approval
                  decision
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 rounded-full bg-muted-foreground mt-2"></div>
              <div>
                <p className="font-medium text-muted-foreground">
                  Dashboard Activation
                </p>
                <p className="text-sm text-muted-foreground">
                  Once approved, all dashboard features will be unlocked
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>
            Contact us if you have any questions about your registration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">support@mintrewards.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Monday - Friday, 9 AM - 6 PM EST</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Button */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <div className="text-center space-y-3">
            <h3 className="font-semibold">Want to see what's coming?</h3>
            <p className="text-sm text-muted-foreground">
              Get a preview of your dashboard once it's approved
            </p>
            <Button
              variant="outline"
              onClick={() => setIsPreviewMode(true)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ApprovedDashboardView = () => (
    <div className="space-y-6">
      {/* {isPreviewMode && !isApproved && (
        <div className="flex items-center justify-between rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-amber-700">
          <span className="font-medium">Preview mode — this is how your dashboard will look once approved.</span>
          <Button variant="ghost" size="sm" className="text-amber-700 hover:text-amber-800 hover:bg-warning/20 h-auto py-1" onClick={() => setIsPreviewMode(false)}>
            Exit Preview
          </Button>
        </div>
      )} */}
      {/* <Card className="border-success/20 bg-success/5">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <CardTitle className="text-xl text-success">
                Welcome to MintRewards Brand Management!
              </CardTitle>
              <CardDescription>
                Your brand has been approved and your dashboard is now active
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card> */}

      {/* Dashboard Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab
            campaigns={analytics?.summary.activeCampaigns ?? campaigns.length}
            analytics={analytics}
          />
        </TabsContent>

        <TabsContent value="campaigns">
          <CampaignsTab
            campaigns={campaigns}
            logoUrl={formattedData.logoUrl}
            onCampaignCreated={handleCampaignCreated}
          />
        </TabsContent>

        <TabsContent value="deals">
          <DealsTab deals={deals} onDealCreated={refreshDeals} />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab
            brandId={brandData.id ?? brandData._id ?? ""}
            name={formattedData.name}
            companyName={brandData.companyName}
            category={formattedData.category}
            contactEmail={formattedData.contactEmail}
            contactPhone={formattedData.contactPhone}
            webLink={brandData.webLink ?? brandData.website}
            appLink={brandData.appLink}
            description={brandData.description}
            address={brandData.address}
            themeColor={brandData.themeColor}
            onSettingsUpdated={refreshBrand}
          />
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{formattedData.name}</h1>
                <p className="text-xs text-muted-foreground">{formattedData.category || "Brand Dashboard"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant={isApproved ? "default" : "secondary"}>
                {brandData.status?.toLowerCase() === "approved" ? "Active" : "Pending"}
              </Badge>
              <Button variant="ghost" size="sm" aria-label="Notifications">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => navigate("/")}>
                Exit Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {isApproved || isPreviewMode ? <ApprovedDashboardView /> : <PendingApprovalView />}
      </main>
    </div>
  );
};

export default BrandDashboard;
