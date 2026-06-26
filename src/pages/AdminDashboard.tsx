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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  LogOut,
  Loader2,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Brand, Campaign, Deal } from "@/types";
import { adminAuth } from "@/lib/adminAuth";
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
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);

  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [rejectDialog, setRejectDialog] = useState<{ brandId: string; reason: string } | null>(null);

  useEffect(() => {
    if (!adminAuth.isLoggedIn()) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const resolveBrandName = (brandId?: string) => {
    if (!brandId) return "-";
    const match = brands.find((b) => (b._id ?? b.id) === brandId);
    return match?.brandName ?? match?.companyName ?? brandId;
  };

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
    fetchApplications();
    fetchCampaigns();
    fetchDeals();
  }, [fetchApplications, fetchCampaigns, fetchDeals]);

  const handleApproval = async (brandId: string, status: "APPROVED" | "REJECTED", reason?: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/brands/${brandId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...adminAuth.authHeaders(),
      },
      body: JSON.stringify({ status, reason }),
    });

    if (res.status === 401) {
      adminAuth.clearToken();
      navigate("/admin/login");
      return;
    }

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
      description: `Brand has been ${status === "APPROVED" ? "approved" : "rejected"} successfully.`,
    });
  };

  const handleRejectBrand = (brandId: string) => {
    setRejectDialog({ brandId, reason: "" });
  };

  const confirmRejectBrand = () => {
    if (!rejectDialog) return;
    handleApproval(rejectDialog.brandId, "REJECTED", rejectDialog.reason.trim() || undefined);
    setRejectDialog(null);
  };

  const handleCampaignApproval = async (
    campaign: Campaign,
    action: "approve" | "reject",
  ) => {
    const newStatus = action === "approve" ? "APPROVED" : "REJECTED";
    const brandId = String(campaign.brand ?? "");

    try {
      await updateCampaign(brandId, campaign.id, { status: newStatus });
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

  const isPending = (status?: string) =>
    (status ?? "").toLowerCase() === "pending";

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
    pending: brands.filter((b) => isPending(b.status)).length,
    approved: brands.filter((b) => getBrandStatus(b.status) === "approved").length,
    rejected: brands.filter((b) => getBrandStatus(b.status) === "rejected").length,
    totalCampaigns: campaigns.length,
    totalDeals: deals.length,
  };

  const handleLogout = () => {
    adminAuth.clearToken();
    navigate("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-lg">Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
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
          <div className="grid grid-cols-3 md:grid-cols-6 divide-x divide-border border border-border rounded-lg overflow-hidden bg-card">
            <div className="p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <Users className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                <span className="text-xs font-medium text-muted-foreground">Total Brands</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="h-3.5 w-3.5 text-warning" aria-hidden="true" />
                <span className="text-xs font-medium text-muted-foreground">Pending</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <CheckCircle className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                <span className="text-xs font-medium text-muted-foreground">Approved</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.approved}</p>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <XCircle className="h-3.5 w-3.5 text-destructive" aria-hidden="true" />
                <span className="text-xs font-medium text-muted-foreground">Rejected</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.rejected}</p>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <span className="text-xs font-medium text-muted-foreground">Campaigns</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.totalCampaigns}</p>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <BarChart3 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <span className="text-xs font-medium text-muted-foreground">Deals</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.totalDeals}</p>
            </div>
          </div>

          {/* Management Tabs */}
          <Tabs defaultValue="brands" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="brands">Brands</TabsTrigger>
              <TabsTrigger value="campaigns">Campaign Reviews</TabsTrigger>
              <TabsTrigger value="deals">Deals</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* ── Brands Tab ── */}
            <TabsContent value="brands" className="space-y-6">
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

                  <div className="divide-y divide-border">
                    {filteredApplications.map((app) => (
                      <div
                        key={app.id ?? app._id}
                        className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="text-base font-semibold">
                              {app.brandName}
                            </h3>
                            <Badge
                              variant={
                                getBrandStatus(app.status) === "approved"
                                  ? "default"
                                  : getBrandStatus(app.status) === "rejected"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {getBrandStatus(app.status)}
                            </Badge>
                          </div>
                          <div className="grid md:grid-cols-3 gap-x-6 gap-y-1 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium text-foreground">Company: </span>
                              {app.companyName}
                            </div>
                            <div>
                              <span className="font-medium text-foreground">Category: </span>
                              {app.category ?? "—"}
                            </div>
                            <div>
                              <span className="font-medium text-foreground">Submitted: </span>
                              {app.createdAt
                                ? new Date(app.createdAt).toLocaleDateString()
                                : "—"}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            <span className="font-medium text-foreground">Contact: </span>
                            {app.email}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBrand(app)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {isPending(app.status) && (
                            <>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() =>
                                  handleApproval((app.id ?? app._id) as string, "APPROVED")
                                }
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  handleRejectBrand((app.id ?? app._id) as string)
                                }
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}

                    {filteredApplications.length === 0 && (
                      <div className="text-center py-10">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                          <Users className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        </div>
                        <h3 className="text-sm font-semibold mb-1">No brands found</h3>
                        <p className="text-sm text-muted-foreground">
                          {searchTerm || filterStatus !== "all"
                            ? "Try adjusting your search or filter criteria."
                            : "No brands have registered yet."}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Campaigns Tab ── */}
            <TabsContent value="campaigns">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Reviews</CardTitle>
                  <CardDescription>Review and approve marketing campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                  {campaigns.length > 0 ? (
                    <div className="divide-y divide-border">
                      {campaigns.map((campaign) => (
                        <div
                          key={campaign.id}
                          className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="text-base font-semibold">{campaign.name}</h3>
                              <Badge
                                variant={
                                  campaign.status?.toUpperCase() === "APPROVED"
                                    ? "default"
                                    : campaign.status?.toUpperCase() === "REJECTED"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {campaign.status}
                              </Badge>
                            </div>
                            <div className="grid md:grid-cols-3 gap-x-6 gap-y-1 text-sm text-muted-foreground">
                              <div>
                                <span className="font-medium text-foreground">Brand: </span>
                                {resolveBrandName(String(campaign.brand ?? ""))}
                              </div>
                              <div>
                                <span className="font-medium text-foreground">Start: </span>
                                {campaign.startDate
                                  ? new Date(campaign.startDate).toLocaleDateString()
                                  : "—"}
                              </div>
                              <div>
                                <span className="font-medium text-foreground">End: </span>
                                {campaign.endDate
                                  ? new Date(campaign.endDate).toLocaleDateString()
                                  : "—"}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedCampaign(campaign)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            {campaign.status?.toUpperCase() === "PENDING" && (
                              <>
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => handleCampaignApproval(campaign, "approve")}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleCampaignApproval(campaign, "reject")}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                        <TrendingUp className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                      </div>
                      <h3 className="text-sm font-semibold mb-1">No campaigns pending</h3>
                      <p className="text-sm text-muted-foreground">All campaigns are currently up to date.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Deals Tab ── */}
            <TabsContent value="deals">
              <Card>
                <CardHeader>
                  <CardTitle>Deal Reviews</CardTitle>
                  <CardDescription>Review and approve marketing deals</CardDescription>
                </CardHeader>
                <CardContent>
                  {deals.length > 0 ? (
                    <div className="divide-y divide-border">
                      {deals.map((deal) => (
                        <div
                          key={deal.id}
                          className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="text-base font-semibold">{deal.title}</h3>
                              <Badge
                                variant={
                                  deal.status?.toLowerCase() === "active"
                                    ? "default"
                                    : deal.status?.toLowerCase() === "rejected"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {deal.status}
                              </Badge>
                            </div>
                            <div className="grid md:grid-cols-3 gap-x-6 gap-y-1 text-sm text-muted-foreground">
                              <div>
                                <span className="font-medium text-foreground">Brand: </span>
                                {resolveBrandName(deal.brandId)}
                              </div>
                              <div>
                                <span className="font-medium text-foreground">Discount: </span>
                                {deal.discountAmount != null
                                  ? `$${deal.discountAmount}`
                                  : deal.discountPercentage != null
                                    ? `${deal.discountPercentage}%`
                                    : "—"}
                              </div>
                              <div>
                                <span className="font-medium text-foreground">Created: </span>
                                {deal.createdAt
                                  ? new Date(deal.createdAt).toLocaleDateString()
                                  : "—"}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedDeal(deal)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            {(deal.status?.toLowerCase() === "inactive" ||
                              deal.status?.toUpperCase() === "PENDING") && (
                              <>
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => handleDealApproval(deal, "approve")}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Activate
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDealApproval(deal, "reject")}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Deactivate
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                        <Users className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                      </div>
                      <h3 className="text-sm font-semibold mb-1">No deals found</h3>
                      <p className="text-sm text-muted-foreground">All deals are currently up to date.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Analytics Tab ── */}
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                  <CardDescription>
                    Summary of platform activity across brands, campaigns, and deals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 divide-x divide-border border border-border rounded-lg overflow-hidden">
                    {/* Brands */}
                    <div className="p-5">
                      <h3 className="text-sm font-semibold flex items-center gap-2 mb-4 text-foreground">
                        <Building2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        Brands
                      </h3>
                      <dl className="space-y-2.5">
                        <div className="flex justify-between text-sm">
                          <dt className="text-muted-foreground">Total</dt>
                          <dd className="font-semibold text-foreground">{stats.total}</dd>
                        </div>
                        <div className="flex justify-between text-sm">
                          <dt className="text-muted-foreground">Approved</dt>
                          <dd className="font-semibold text-success">{stats.approved}</dd>
                        </div>
                        <div className="flex justify-between text-sm">
                          <dt className="text-muted-foreground">Pending</dt>
                          <dd className="font-semibold text-warning">{stats.pending}</dd>
                        </div>
                        <div className="flex justify-between text-sm">
                          <dt className="text-muted-foreground">Rejected</dt>
                          <dd className="font-semibold text-destructive">{stats.rejected}</dd>
                        </div>
                      </dl>
                    </div>

                    {/* Campaigns */}
                    <div className="p-5">
                      <h3 className="text-sm font-semibold flex items-center gap-2 mb-4 text-foreground">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        Campaigns
                      </h3>
                      <dl className="space-y-2.5">
                        <div className="flex justify-between text-sm">
                          <dt className="text-muted-foreground">Total</dt>
                          <dd className="font-semibold text-foreground">{campaigns.length}</dd>
                        </div>
                        <div className="flex justify-between text-sm">
                          <dt className="text-muted-foreground">Approved</dt>
                          <dd className="font-semibold text-success">
                            {campaigns.filter((c) => c.status?.toUpperCase() === "APPROVED").length}
                          </dd>
                        </div>
                        <div className="flex justify-between text-sm">
                          <dt className="text-muted-foreground">Pending</dt>
                          <dd className="font-semibold text-warning">
                            {campaigns.filter((c) => c.status?.toUpperCase() === "PENDING").length}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    {/* Deals */}
                    <div className="p-5">
                      <h3 className="text-sm font-semibold flex items-center gap-2 mb-4 text-foreground">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        Deals
                      </h3>
                      <dl className="space-y-2.5">
                        <div className="flex justify-between text-sm">
                          <dt className="text-muted-foreground">Total</dt>
                          <dd className="font-semibold text-foreground">{deals.length}</dd>
                        </div>
                        <div className="flex justify-between text-sm">
                          <dt className="text-muted-foreground">Active</dt>
                          <dd className="font-semibold text-success">
                            {deals.filter((d) => d.status?.toLowerCase() === "active").length}
                          </dd>
                        </div>
                        <div className="flex justify-between text-sm">
                          <dt className="text-muted-foreground">Inactive</dt>
                          <dd className="font-semibold text-destructive">
                            {deals.filter((d) => d.status?.toLowerCase() === "inactive").length}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* ── Brand Details Dialog ── */}
      <Dialog open={!!selectedBrand} onOpenChange={() => setSelectedBrand(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Brand Details</DialogTitle>
          </DialogHeader>
          {selectedBrand && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Company Name", selectedBrand.companyName],
                ["Brand Name", selectedBrand.brandName],
                ["Category", selectedBrand.category],
                ["Email", selectedBrand.email],
                ["Phone", selectedBrand.phone],
                ["Website", selectedBrand.website],
                ["App Link", selectedBrand.appLink],
                ["Address", selectedBrand.address],
                ["Registration No.", selectedBrand.registrationNumber],
                [
                  "Submitted",
                  selectedBrand.createdAt
                    ? new Date(selectedBrand.createdAt).toLocaleDateString()
                    : undefined,
                ],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <p className="font-medium text-foreground">{label}</p>
                  <p className="text-muted-foreground">{value || "-"}</p>
                </div>
              ))}
              <div className="col-span-2">
                <p className="font-medium text-foreground">Description</p>
                <p className="text-muted-foreground">{selectedBrand.description || "-"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Campaign Details Dialog ── */}
      <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Campaign Details</DialogTitle>
          </DialogHeader>
          {selectedCampaign && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Name", selectedCampaign.name],
                ["Status", selectedCampaign.status],
                [
                  "Start Date",
                  selectedCampaign.startDate
                    ? new Date(selectedCampaign.startDate).toLocaleDateString()
                    : undefined,
                ],
                [
                  "End Date",
                  selectedCampaign.endDate
                    ? new Date(selectedCampaign.endDate).toLocaleDateString()
                    : undefined,
                ],
                ["Campaign Type", selectedCampaign.campaignType],
                ["Budget", selectedCampaign.budget != null ? `$${selectedCampaign.budget}` : undefined],
                ["Target Audience", selectedCampaign.targetAudience],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <p className="font-medium text-foreground">{label}</p>
                  <p className="text-muted-foreground">{(value as string) || "-"}</p>
                </div>
              ))}
              <div className="col-span-2">
                <p className="font-medium text-foreground">Description</p>
                <p className="text-muted-foreground">{selectedCampaign.description || "-"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Reject Brand Dialog ── */}
      <Dialog open={!!rejectDialog} onOpenChange={(open) => !open && setRejectDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Brand Application</DialogTitle>
            <DialogDescription>
              A specific reason helps the brand reapply correctly. Optional, but strongly recommended.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5 py-1">
            <Label htmlFor="reject-reason">Rejection reason</Label>
            <Textarea
              id="reject-reason"
              placeholder="e.g. Logo resolution too low; website URL returned 404"
              value={rejectDialog?.reason ?? ""}
              onChange={(e) =>
                setRejectDialog((prev) =>
                  prev ? { ...prev, reason: e.target.value } : prev,
                )
              }
              className="resize-none"
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              This message will be visible to the brand partner.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRejectBrand}>
              <XCircle className="h-4 w-4 mr-2" aria-hidden="true" />
              Reject Brand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Deal Details Dialog ── */}
      <Dialog open={!!selectedDeal} onOpenChange={() => setSelectedDeal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Deal Details</DialogTitle>
          </DialogHeader>
          {selectedDeal && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Title", selectedDeal.title],
                ["Promo Code", selectedDeal.promoCode],
                [
                  "Discount Amount",
                  selectedDeal.discountAmount != null ? `$${selectedDeal.discountAmount}` : undefined,
                ],
                [
                  "Discount %",
                  selectedDeal.discountPercentage != null
                    ? `${selectedDeal.discountPercentage}%`
                    : undefined,
                ],
                [
                  "Start Date",
                  selectedDeal.startDate
                    ? new Date(selectedDeal.startDate).toLocaleDateString()
                    : undefined,
                ],
                [
                  "End Date",
                  selectedDeal.endDate
                    ? new Date(selectedDeal.endDate).toLocaleDateString()
                    : undefined,
                ],
                ["Max Uses", selectedDeal.maxUses?.toString()],
                ["Current Uses", selectedDeal.currentUses?.toString()],
                [
                  "Minimum Purchase",
                  selectedDeal.minimumPurchase != null
                    ? `$${selectedDeal.minimumPurchase}`
                    : undefined,
                ],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <p className="font-medium text-foreground">{label}</p>
                  <p className="text-muted-foreground">{(value as string) || "-"}</p>
                </div>
              ))}
              <div className="col-span-2">
                <p className="font-medium text-foreground">Description</p>
                <p className="text-muted-foreground">{selectedDeal.description || "-"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
