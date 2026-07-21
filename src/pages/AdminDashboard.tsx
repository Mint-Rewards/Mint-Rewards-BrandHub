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
import SiteHeader from "@/components/SiteHeader";
import { useToast } from "@/hooks/use-toast";
import { Brand, Campaign, Deal } from "@/types";
import { adminAuth } from "@/lib/adminAuth";
import { resolveBrandEmail } from "@/lib/brandEmail";
import { effectiveCampaignStatus, effectiveDealStatus } from "@/lib/metrics";
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
  const [campaignSearchTerm, setCampaignSearchTerm] = useState("");
  const [campaignFilterStatus, setCampaignFilterStatus] = useState("all");
  const [dealSearchTerm, setDealSearchTerm] = useState("");
  const [dealFilterStatus, setDealFilterStatus] = useState("all");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);

  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [rejectDialog, setRejectDialog] = useState<{ brandId: string; reason: string } | null>(null);
  const [campaignsDealsError, setCampaignsDealsError] = useState(false);
  // Tracks in-flight approve/reject calls per item so a rapid double-click
  // can't fire the same PATCH twice (or race two different outcomes).
  const [pendingActions, setPendingActions] = useState<Set<string>>(new Set());

  const withPending = async (key: string, action: () => Promise<void>) => {
    if (pendingActions.has(key)) return;
    setPendingActions((prev) => new Set(prev).add(key));
    try {
      await action();
    } finally {
      setPendingActions((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  };

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
      setCampaignsDealsError(false);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setCampaignsDealsError(true);
    }
  }, []);

  const fetchDeals = useCallback(async () => {
    try {
      const data = await fetchAllDeals();
      setDeals(data);
      setCampaignsDealsError(false);
    } catch (error) {
      console.error("Error fetching deals:", error);
      setCampaignsDealsError(true);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
    fetchCampaigns();
    fetchDeals();
  }, [fetchApplications, fetchCampaigns, fetchDeals]);

  const handleApproval = async (brandId: string, status: "APPROVED" | "REJECTED", reason?: string) => {
    let res: Response;
    try {
      res = await fetch(`${import.meta.env.VITE_API_URL}/brands/${brandId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...adminAuth.authHeaders(),
        },
        body: JSON.stringify({ status, reason }),
      });
    } catch (error) {
      console.error("Network error updating brand status:", error);
      toast({
        title: "Network error",
        description: "Couldn't reach the server. Check your connection and try again.",
        variant: "destructive",
      });
      return;
    }

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
    const { brandId, reason } = rejectDialog;
    setRejectDialog(null);
    withPending(`brand:${brandId}`, () =>
      handleApproval(brandId, "REJECTED", reason.trim() || undefined),
    );
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
        description: "Failed to update campaign status. Check your connection and try again.",
        variant: "destructive",
      });
    }
  };

  const handleDealApproval = async (
    deal: Deal,
    action: "approve" | "reject",
  ) => {
    const newStatus = action === "approve" ? "active" : "rejected";

    try {
      await updateDeal(deal.brandId ?? "", deal.id, { status: newStatus });
      setDeals((prev) =>
        prev.map((d) => (d.id === deal.id ? { ...d, status: newStatus } : d)),
      );
      toast({
        title: `Deal ${action === "approve" ? "approved" : "rejected"}`,
        description: `"${deal.title}" has been ${action === "approve" ? "approved" : "rejected"}.`,
        variant: action === "approve" ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error updating deal:", error);
      toast({
        title: "Error",
        description: "Failed to update deal status. Check your connection and try again.",
        variant: "destructive",
      });
    }
  };

  const getBrandStatus = (status?: string) =>
    (status ?? "pending").toLowerCase();

  const isPending = (status?: string) =>
    (status ?? "").toLowerCase() === "pending";

  // Approved items surface first, rejected items sink toward the bottom,
  // pending items stay in the middle (in their existing relative order).
  // Expired and inactive items — no longer actionable — sink lowest.
  const APPROVED_RANK = 1;
  const PENDING_RANK = 0;
  const REJECTED_RANK = 2;
  const EXPIRED_RANK = 3;
  const INACTIVE_RANK = 4;

  const brandStatusRank = (status?: string) => {
    const normalized = getBrandStatus(status);
    if (normalized === "approved") return APPROVED_RANK;
    if (normalized === "rejected") return REJECTED_RANK;
    return PENDING_RANK;
  };

  const campaignStatusRank = (campaign: Campaign) => {
    const normalized = effectiveCampaignStatus(campaign).toLowerCase();
    if (normalized === "approved") return APPROVED_RANK;
    if (normalized === "rejected") return REJECTED_RANK;
    if (normalized === "expired") return EXPIRED_RANK;
    if (normalized === "pending") return PENDING_RANK;
    return INACTIVE_RANK;
  };

  const dealStatusRank = (deal: Deal) => {
    const normalized = effectiveDealStatus(deal);
    if (normalized === "active") return APPROVED_RANK;
    if (normalized === "rejected") return REJECTED_RANK;
    if (normalized === "expired") return EXPIRED_RANK;
    if (normalized === "pending") return PENDING_RANK;
    return INACTIVE_RANK;
  };

  const filteredApplications = brands
    .filter((brand) => {
      const normalizedSearchTerm = searchTerm.toLowerCase();
      const brandName = brand.brandName ?? "";
      const companyName = brand.companyName ?? "";
      const contactEmail = resolveBrandEmail(brand) ?? "";
      const matchesSearch =
        brandName.toLowerCase().includes(normalizedSearchTerm) ||
        companyName.toLowerCase().includes(normalizedSearchTerm) ||
        contactEmail.toLowerCase().includes(normalizedSearchTerm);
      const matchesFilter =
        filterStatus === "all" || getBrandStatus(brand.status) === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const rankDiff = brandStatusRank(a.status) - brandStatusRank(b.status);
      if (rankDiff !== 0) return rankDiff;
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

  const filteredCampaigns = campaigns
    .filter((campaign) => {
      const normalizedSearchTerm = campaignSearchTerm.toLowerCase();
      const name = campaign.name ?? "";
      const brandName = resolveBrandName(String(campaign.brand ?? "")) ?? "";
      const matchesSearch =
        name.toLowerCase().includes(normalizedSearchTerm) ||
        brandName.toLowerCase().includes(normalizedSearchTerm);
      const status = effectiveCampaignStatus(campaign).toLowerCase();
      const matchesFilter = campaignFilterStatus === "all" || status === campaignFilterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => campaignStatusRank(a) - campaignStatusRank(b));

  const filteredDeals = deals
    .filter((deal) => {
      const normalizedSearchTerm = dealSearchTerm.toLowerCase();
      const title = deal.title ?? "";
      const brandName = resolveBrandName(deal.brandId) ?? "";
      const matchesSearch =
        title.toLowerCase().includes(normalizedSearchTerm) ||
        brandName.toLowerCase().includes(normalizedSearchTerm);
      const status = effectiveDealStatus(deal);
      const matchesFilter = dealFilterStatus === "all" || status === dealFilterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => dealStatusRank(a) - dealStatusRank(b));

  const stats = {
    total: brands.length,
    pending: brands.filter((b) => isPending(b.status)).length,
    approved: brands.filter((b) => getBrandStatus(b.status) === "approved").length,
    rejected: brands.filter((b) => getBrandStatus(b.status) === "rejected").length,
    // totalCampaigns: campaigns.length,
    approvedCampaigns: campaigns.filter((c) => c.status?.toUpperCase() === "APPROVED").length,
    // totalDeals: deals.length,
    activeDeals: deals.filter((d) => d.status?.toLowerCase() === "active").length,
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
      <SiteHeader
        icon={
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Shield className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
          </div>
        }
        title="Admin Dashboard"
        titleAs="h1"
        subtitle="MintRewards Management Portal"
        actions={
          <>
            <Badge variant="secondary">Admin</Badge>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </>
        }
      />

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
              <p className="text-2xl font-bold text-foreground">{stats.approvedCampaigns}</p>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <BarChart3 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <span className="text-xs font-medium text-muted-foreground">Deals</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.activeDeals}</p>
            </div>
          </div>

          {campaignsDealsError && (
            <div className="flex flex-col gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <span className="text-destructive">
                Failed to load campaigns and deals. Stats and tabs below may be incomplete.
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  fetchCampaigns();
                  fetchDeals();
                }}
              >
                Try again
              </Button>
            </div>
          )}

          {/* Management Tabs */}
          <Tabs defaultValue="brands" className="space-y-6">
            <TabsList className="flex w-full overflow-x-auto sm:grid sm:grid-cols-4">
              <TabsTrigger value="brands" className="shrink-0">Brands</TabsTrigger>
              <TabsTrigger value="campaigns" className="shrink-0">Campaign Reviews</TabsTrigger>
              <TabsTrigger value="deals" className="shrink-0">Deals</TabsTrigger>
              <TabsTrigger value="analytics" className="shrink-0">Analytics</TabsTrigger>
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
                      <Filter className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <select
                        aria-label="Filter brands by status"
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
                        className="flex flex-wrap items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
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
                            {resolveBrandEmail(app)}
                          </p>
                        </div>

                        <div className="flex items-center justify-end gap-2 shrink-0 md:min-w-[220px]">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBrand(app)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {isPending(app.status) && (() => {
                            const brandId = (app.id ?? app._id) as string;
                            const isBusy = pendingActions.has(`brand:${brandId}`);
                            return (
                              <>
                                <Button
                                  variant="success"
                                  size="sm"
                                  disabled={isBusy}
                                  onClick={() =>
                                    withPending(`brand:${brandId}`, () =>
                                      handleApproval(brandId, "APPROVED"),
                                    )
                                  }
                                >
                                  {isBusy ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                  )}
                                  Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  disabled={isBusy}
                                  onClick={() => handleRejectBrand(brandId)}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                              </>
                            );
                          })()}
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
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search campaigns..."
                        value={campaignSearchTerm}
                        onChange={(e) => setCampaignSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <select
                        aria-label="Filter campaigns by status"
                        value={campaignFilterStatus}
                        onChange={(e) => setCampaignFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-border rounded-md bg-background"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="expired">Expired</option>
                      </select>
                    </div>
                  </div>

                  <div className="divide-y divide-border">
                    {filteredCampaigns.map((campaign) => {
                      const campaignStatus = effectiveCampaignStatus(campaign);
                      return (
                      <div
                        key={campaign.id}
                        className="flex flex-wrap items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="text-base font-semibold">{campaign.name}</h3>
                            <Badge
                              variant={
                                campaignStatus === "APPROVED"
                                  ? "default"
                                  : campaignStatus === "REJECTED"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {campaignStatus}
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

                        <div className="flex items-center justify-end gap-2 shrink-0 md:min-w-[220px]">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCampaign(campaign)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {campaign.status?.toUpperCase() === "PENDING" && (() => {
                            const isBusy = pendingActions.has(`campaign:${campaign.id}`);
                            return (
                              <>
                                <Button
                                  variant="success"
                                  size="sm"
                                  disabled={isBusy}
                                  onClick={() =>
                                    withPending(`campaign:${campaign.id}`, () =>
                                      handleCampaignApproval(campaign, "approve"),
                                    )
                                  }
                                >
                                  {isBusy ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                  )}
                                  Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  disabled={isBusy}
                                  onClick={() =>
                                    withPending(`campaign:${campaign.id}`, () =>
                                      handleCampaignApproval(campaign, "reject"),
                                    )
                                  }
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      );
                    })}

                    {filteredCampaigns.length === 0 && (
                      <div className="text-center py-10">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                          <TrendingUp className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        </div>
                        <h3 className="text-sm font-semibold mb-1">No campaigns found</h3>
                        <p className="text-sm text-muted-foreground">
                          {campaignSearchTerm || campaignFilterStatus !== "all"
                            ? "Try adjusting your search or filter criteria."
                            : "No campaigns have been submitted yet."}
                        </p>
                      </div>
                    )}
                  </div>
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
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search deals..."
                        value={dealSearchTerm}
                        onChange={(e) => setDealSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <select
                        aria-label="Filter deals by status"
                        value={dealFilterStatus}
                        onChange={(e) => setDealFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-border rounded-md bg-background"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="rejected">Rejected</option>
                        <option value="expired">Expired</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="divide-y divide-border">
                    {filteredDeals.map((deal) => {
                      const dealStatus = effectiveDealStatus(deal);
                      return (
                      <div
                        key={deal.id}
                        className="flex flex-wrap items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="text-base font-semibold">{deal.title}</h3>
                            <Badge
                              variant={
                                dealStatus === "active"
                                  ? "default"
                                  : dealStatus === "rejected"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {dealStatus.charAt(0).toUpperCase() + dealStatus.slice(1)}
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
                        <div className="flex items-center justify-end gap-2 shrink-0 md:min-w-[220px]">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedDeal(deal)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {dealStatus === "pending" && (() => {
                            const isBusy = pendingActions.has(`deal:${deal.id}`);
                            return (
                              <>
                                <Button
                                  variant="success"
                                  size="sm"
                                  disabled={isBusy}
                                  onClick={() =>
                                    withPending(`deal:${deal.id}`, () =>
                                      handleDealApproval(deal, "approve"),
                                    )
                                  }
                                >
                                  {isBusy ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                  )}
                                  Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  disabled={isBusy}
                                  onClick={() =>
                                    withPending(`deal:${deal.id}`, () =>
                                      handleDealApproval(deal, "reject"),
                                    )
                                  }
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      );
                    })}

                    {filteredDeals.length === 0 && (
                      <div className="text-center py-10">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                          <Users className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        </div>
                        <h3 className="text-sm font-semibold mb-1">No deals found</h3>
                        <p className="text-sm text-muted-foreground">
                          {dealSearchTerm || dealFilterStatus !== "all"
                            ? "Try adjusting your search or filter criteria."
                            : "All deals are currently up to date."}
                        </p>
                      </div>
                    )}
                  </div>
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
                        <div className="flex justify-between text-sm">
                          <dt className="text-muted-foreground">Rejected</dt>
                          <dd className="font-semibold text-destructive">
                            {campaigns.filter((c) => c.status?.toUpperCase() === "REJECTED").length}
                          </dd>
                        </div>
                        <div className="flex justify-between text-sm">
                          <dt className="text-muted-foreground">Expired</dt>
                          <dd className="font-semibold text-muted-foreground">
                            {campaigns.filter((c) => c.status?.toUpperCase() === "EXPIRED").length}
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
                          <dt className="text-muted-foreground">Pending</dt>
                          <dd className="font-semibold text-warning">
                            {deals.filter((d) => (d.status?.toLowerCase() ?? "pending") === "pending").length}
                          </dd>
                        </div>
                        <div className="flex justify-between text-sm">
                          <dt className="text-muted-foreground">Rejected</dt>
                          <dd className="font-semibold text-destructive">
                            {deals.filter((d) => d.status?.toLowerCase() === "rejected").length}
                          </dd>
                        </div>
                        <div className="flex justify-between text-sm">
                          <dt className="text-muted-foreground">Expired</dt>
                          <dd className="font-semibold text-muted-foreground">
                            {deals.filter((d) => d.status?.toLowerCase() === "expired").length}
                          </dd>
                        </div>
                        <div className="flex justify-between text-sm">
                          <dt className="text-muted-foreground">Inactive</dt>
                          <dd className="font-semibold text-muted-foreground">
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
                ["Registration No.", selectedBrand.registrationNumber],
                ["Email", resolveBrandEmail(selectedBrand)],
                ["Category", selectedBrand.category],
                ["Phone", selectedBrand.phone],
                ["Address", selectedBrand.address],
                ["Website", selectedBrand.website ?? selectedBrand.webLink],
                ["App Link", selectedBrand.appLink],
                [
                  "Submitted",
                  selectedBrand.createdAt
                    ? new Date(selectedBrand.createdAt).toLocaleDateString()
                    : undefined,
                ],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <p className="font-medium text-foreground">{label}</p>
                  <p className="text-muted-foreground break-words">{value || "-"}</p>
                </div>
              ))}
              <div className="col-span-2">
                <p className="font-medium text-foreground">Description</p>
                <p className="text-muted-foreground break-words">{selectedBrand.description || "-"}</p>
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
                ["Budget", selectedCampaign.budget != null ? `PKR ${selectedCampaign.budget}` : undefined],
                ["Target Audience", selectedCampaign.targetAudience],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <p className="font-medium text-foreground">{label}</p>
                  <p className="text-muted-foreground break-words">{(value as string) || "-"}</p>
                </div>
              ))}
              <div className="col-span-2">
                <p className="font-medium text-foreground">Description</p>
                <p className="text-muted-foreground break-words">{selectedCampaign.description || "-"}</p>
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
            <Button
              variant="destructive"
              disabled={
                !!rejectDialog && pendingActions.has(`brand:${rejectDialog.brandId}`)
              }
              onClick={confirmRejectBrand}
            >
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
                ["Current Uses", selectedDeal.currentUses?.toString()],
                [
                  "Minimum Purchase",
                  selectedDeal.minimumPurchase != null
                    ? `PKR ${selectedDeal.minimumPurchase}`
                    : undefined,
                ],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <p className="font-medium text-foreground">{label}</p>
                  <p className="text-muted-foreground break-words">{(value as string) || "-"}</p>
                </div>
              ))}
              <div className="col-span-2">
                <p className="font-medium text-foreground">Description</p>
                <p className="text-muted-foreground break-words">{selectedDeal.description || "-"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
