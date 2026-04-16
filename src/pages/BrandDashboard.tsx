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
  CheckCircle,
  AlertCircle,
  Eye,
  Bell,
  Mail,
  Phone,
  Loader2,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

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
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchBrandData = async () => {
      if (!brandId) {
        navigate("/");
        return;
      }

      try {
        // Fetch brand data
        //set dummy data
        setBrandData({
          id: "1",
          brand_name: "Dummy Brand",
          company_name: "Dummy Company",
          category: "Technology",
          status: "approved",
          created_at: new Date().toISOString(),
          website: "https://dummybrand.com",
          description: "This is a dummy brand.",
          logo_url: "https://dummybrand.com/logo.png",
          theme_color: "#3B82F6",
          contact_email: "contact@dummybrand.com",
          contact_phone: "+1234567890",
          address: "123 Dummy St, Dummy City",
          app_link: "https://dummybrand.com/app",
          custom_emails: "support@dummybrand.com",
          domain: "dummybrand.com",
        });
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
    };

    const fetchDeals = async () => {
      if (!brandId) return;
    };

    fetchBrandData();
    fetchCampaigns();
    fetchDeals();
  }, [brandId, navigate, toast]);

  // Function to refresh campaigns data
  const refreshCampaigns = async () => {
    if (!brandId) return;
  };

  // Function to handle campaign creation success
  const handleCampaignCreated = async () => {
    await refreshCampaigns();
    setActiveTab("campaigns"); // Switch to campaigns tab after creation
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <Card className="p-8">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading brand dashboard...</span>
          </div>
        </Card>
      </div>
    );
  }

  if (!brandData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
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

  const isApproved = brandData.status === "approved";
  const formattedData = {
    name: brandData.brand_name,
    companyName: brandData.company_name,
    category: brandData.category,
    status: brandData.status,
    submissionDate: new Date(brandData.created_at).toLocaleDateString(),
    estimatedApproval: "2-3 business days",
    referenceNumber: `REF-${brandData.id.substring(0, 8).toUpperCase()}`,
    contactEmail: brandData?.contact_email || "N/A",
    contactPhone: brandData?.contact_phone || "N/A",
    website: brandData.website,
    description: brandData.description,
    logoUrl: brandData?.logo_url,
    themeColor: brandData?.theme_color || "#3B82F6",
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
              <CardTitle className="text-xl text-warning">
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
                  className="bg-warning/10 text-warning"
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
              onClick={async () => {
                // Update brand status to approved in database
                // if () {
                //   setBrandData((prev) => ({ ...prev, status: "approved" }));
                //   toast({
                //     title: "Preview Mode",
                //     description: "Showing approved dashboard preview",
                //   });
                // }
              }}
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
      {/* Success Header */}
      <Card className="border-success/20 bg-success/5">
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
      </Card>

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
          {/* Recent Activity */}
          <OverviewTab campaigns={campaigns.length} />
        </TabsContent>

        <TabsContent value="campaigns">
          <CampaignsTab
            campaigns={campaigns}
            onCampaignCreated={handleCampaignCreated}
          />
        </TabsContent>

        <TabsContent value="deals">
          <DealsTab deals={deals} />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab
            name={formattedData.name}
            category={formattedData.category}
            contactEmail={formattedData.contactEmail}
            contactPhone={formattedData.contactPhone}
          />
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{formattedData.name}</h1>
                <p className="text-xs text-muted-foreground">Brand Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant={isApproved ? "default" : "secondary"}>
                {brandData.status === "approved" ? "Active" : "Pending"}
              </Badge>
              <Button variant="ghost" size="sm">
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
        {isApproved ? <ApprovedDashboardView /> : <PendingApprovalView />}
      </main>
    </div>
  );
};

export default BrandDashboard;
