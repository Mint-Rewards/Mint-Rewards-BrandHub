import { useState, useEffect, useCallback } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Shield,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Eye,
  Building2,
  TrendingUp,
  AlertTriangle,
  LogOut,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Brand, Campaign, Deal, User } from "@/types";
import {
  fetchBrands,
  fetchAllCampaigns,
  fetchAllDeals,
  updateCampaign,
  updateDeal,
} from "@/actions/brandActions";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);

  const checkAuth = async () => {};

  const fetchApplications = useCallback(async () => {
    try {
      const brands = await fetchBrands();
      setBrands(brands);
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast({
        title: "Error",
        description: "Failed to load brands",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchCampaigns = useCallback(async () => {
    try {
      const data = await fetchAllCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  }, []);

  const fetchDeals = useCallback(async () => {
    try {
      const data = await fetchAllDeals();
      setDeals(data);
    } catch (error) {
      console.error("Error fetching deals:", error);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    fetchApplications();
    fetchCampaigns();
    fetchDeals();
  }, [fetchApplications, fetchCampaigns, fetchDeals]);

  const handleApproval = async (brandId: string, status: "APPROVED" | "REJECTED", reason?: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/brands/${brandId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_ADMIN_SECRET}`,
      },
      body: JSON.stringify({ status, reason }),
    });

    if (!res.ok) {
      toast({
        title: "Error",
        description: "Failed to update brand status",
        variant: "destructive",
      });
      return;
    }

    const { brand } = await res.json();
    setBrands(prev => prev.map(b => b._id === brandId ? brand : b));
    toast({
      title: `Brand ${status === "APPROVED" ? "Approved" : "Rejected"}`, 
      description: `Brand has been ${status === "APPROVED" ? "approved" : "rejected"} successfully.` 
    });
  };

  const handleCampaignApproval = async (
    campaign: Campaign,
    action: "approve" | "reject",
  ) => {
    const newStatus = action === "approve" ? "APPROVED" : "REJECTED";
    const brandId = String(campaign.brand ?? "");

    try {
      await updateCampaign(
        brandId,
        campaign.id,
        { status: newStatus },
        import.meta.env.VITE_ADMIN_SECRET,
      );
      setCampaigns((prev) =>
        prev.map((c) => (c.id === campaign.id ? { ...c, status: newStatus } : c)),
      );
      toast({
        title: `Campaign ${action === "approve" ? "approved" : "rejected"}`,
        description: `"${campaign.name}" has been ${action === "approve" ? "approved" : "rejected"}.`,
        variant: action === "approve" ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error updating campaign:", error);
      toast({
        title: "Error",
        description: "Failed to update campaign status",
        variant: "destructive",
      });
    }
  };

  const handleDealApproval = async (
    deal: Deal,
    action: "approve" | "reject",
  ) => {
    const newStatus = action === "approve" ? "active" : "inactive";

    try {
      await updateDeal(deal.brandId ?? "", deal.id, { status: newStatus as "active" | "inactive" });
      setDeals((prev) =>
        prev.map((d) => (d.id === deal.id ? { ...d, status: newStatus } : d)),
      );
      toast({
        title: `Deal ${action === "approve" ? "activated" : "deactivated"}`,
        description: `"${deal.title}" has been ${action === "approve" ? "set to active" : "deactivated"}.`,
        variant: action === "approve" ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error updating deal:", error);
      toast({
        title: "Error",
        description: "Failed to update deal status",
        variant: "destructive",
      });
    }
  };

  const getBrandStatus = (status?: string) =>
    (status ?? "pending").toLowerCase();

  const filteredApplications = brands.filter((brand) => {
    const normalizedSearchTerm = searchTerm.toLowerCase();
    const brandName = brand.brandName ?? "";
    const companyName = brand.companyName ?? "";
    const contactEmail = brand.email ?? "";
    const matchesSearch =
      brandName.toLowerCase().includes(normalizedSearchTerm) ||
      companyName.toLowerCase().includes(normalizedSearchTerm) ||
      contactEmail.toLowerCase().includes(normalizedSearchTerm);
    const matchesFilter =
      filterStatus === "all" || getBrandStatus(brand.status) === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: brands.length,
    pending: brands.filter(
      (brand) => getBrandStatus(brand.status) === "pending",
    ).length,
    approved: brands.filter(
      (brand) => getBrandStatus(brand.status) === "approved",
    ).length,
    rejected: brands.filter(
      (brand) => getBrandStatus(brand.status) === "rejected",
    ).length,
  };

  const handleLogout = async () => {
    try {
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate("/admin/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-lg">Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-xs text-muted-foreground">
                  MintRewards Management Portal
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary">Admin</Badge>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Total Brands</span>
                </div>
                <p className="text-2xl font-bold mt-2">{stats.total}</p>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium">Pending Review</span>
                </div>
                <p className="text-2xl font-bold mt-2">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">
                  Awaiting approval
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Approved</span>
                </div>
                <p className="text-2xl font-bold mt-2">{stats.approved}</p>
                <p className="text-xs text-muted-foreground">Active brands</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium">Rejected</span>
                </div>
                <p className="text-2xl font-bold mt-2">{stats.rejected}</p>
                <p className="text-xs text-muted-foreground">Declined</p>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs defaultValue="brands" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="brands">Brands</TabsTrigger>
              <TabsTrigger value="campaigns">Campaign Reviews</TabsTrigger>
              <TabsTrigger value="deals">Deals</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="brands" className="space-y-6">
              {/* Search and Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Brands</CardTitle>
                  <CardDescription>
                    Review and manage brand statuses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search brands..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-border rounded-md bg-background"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  {/* Brands List */}
                  <div className="space-y-4">
                    {filteredApplications.map((app) => (
                      <Card
                        key={app.id ?? app._id}
                        className="hover:bg-muted/40 transition-colors"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">
                                  {app.brandName}
                                </h3>
                                <Badge
                                  variant={
                                    getBrandStatus(app.status) === "approved"
                                      ? "default"
                                      : getBrandStatus(app.status) ===
                                          "rejected"
                                        ? "destructive"
                                        : "secondary"
                                  }
                                >
                                  {getBrandStatus(app.status)}
                                </Badge>
                              </div>
                              <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                                <div>
                                  <p className="font-medium text-foreground">
                                    Company
                                  </p>
                                  <p>{app.companyName}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">
                                    Category
                                  </p>
                                  <p>{app.category ?? "-"}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">
                                    Submitted
                                  </p>
                                  <p>
                                    {app.createdAt
                                      ? new Date(
                                          app.createdAt ?? "",
                                        ).toLocaleDateString()
                                      : "-"}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-medium text-foreground">
                                    Contact:
                                  </span>{" "}
                                  {app.email}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                              {getBrandStatus(app.status) === "pending" && (
                                <>
                                  <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() =>
                                      handleApproval(
                                        (app.id ?? app._id) as string,
                                        "APPROVED",
                                      )
                                    }
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      handleApproval(
                                        (app.id ?? app._id) as string,
                                        "REJECTED",
                                      )
                                    }
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {filteredApplications.length === 0 && (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          No brands found
                        </h3>
                        <p className="text-muted-foreground">
                          {searchTerm || filterStatus !== "all"
                            ? "Try adjusting your search or filter criteria"
                            : "No brands found in the system yet"}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="campaigns">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Reviews</CardTitle>
                  <CardDescription>
                    Review and approve marketing campaigns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {campaigns.length > 0 ? (
                    campaigns.map((campaign) => (
                      <Card
                        key={campaign.id}
                        className="hover:bg-muted/40 transition-colors mb-4"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">
                                  {campaign.name}
                                </h3>
                                <Badge
                                  variant={
                                    campaign.status === "approved"
                                      ? "default"
                                      : campaign.status === "rejected"
                                        ? "destructive"
                                        : "secondary"
                                  }
                                >
                                  {campaign.status}
                                </Badge>
                              </div>
                              <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                                <div>
                                  <p className="font-medium text-foreground">
                                    Brand
                                  </p>
                                  <p>{campaign.id}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">
                                    Start Date
                                  </p>
                                  <p>
                                    {new Date(
                                      campaign.startDate,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">
                                    End Date
                                  </p>
                                  <p>
                                    {new Date(
                                      campaign.endDate,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-medium text-foreground">
                                    Contact:
                                  </span>{" "}
                                  {campaign.id}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                              {campaign.status === "PENDING" && (
                                <>
                                  <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() =>
                                      handleCampaignApproval(campaign, "approve")
                                    }
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      handleCampaignApproval(campaign, "reject")
                                    }
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No campaigns pending
                      </h3>
                      <p className="text-muted-foreground">
                        All campaigns are currently up to date
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="deals">
              <Card>
                <CardHeader>
                  <CardTitle>Deal Reviews</CardTitle>
                  <CardDescription>
                    Review and approve marketing deals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {deals.length > 0 ? (
                    deals.map((deal) => (
                      <Card
                        key={deal.id}
                        className="hover:bg-muted/40 transition-colors mb-4"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">
                                  {deal.brandId}
                                </h3>
                                <Badge
                                  variant={
                                    deal.status === "approved"
                                      ? "default"
                                      : deal.status === "rejected"
                                        ? "destructive"
                                        : "secondary"
                                  }
                                >
                                  {deal.status}
                                </Badge>
                              </div>
                              <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                                <div>
                                  <p className="font-medium text-foreground">
                                    Deal Name
                                  </p>
                                  <p>{deal.title}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">
                                    Discount Amount
                                  </p>
                                  <p>${deal.discountAmount} %</p>
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">
                                    Created At
                                  </p>
                                  <p>
                                    {new Date(
                                      deal.createdAt,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-medium text-foreground">
                                    Contact:
                                  </span>{" "}
                                  {deal.brandId}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                              {deal.status === "inactive" && (
                                <>
                                  <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() =>
                                      handleDealApproval(deal, "approve")
                                    }
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Activate
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      handleDealApproval(deal, "reject")
                                    }
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No deals found
                      </h3>
                      <p className="text-muted-foreground">
                        All deals are currently up to date
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                  <CardDescription>
                    Monitor platform performance and usage statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Analytics Dashboard
                    </h3>
                    <p className="text-muted-foreground">
                      Detailed analytics and reporting features coming soon
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
