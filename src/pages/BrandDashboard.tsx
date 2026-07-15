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
  CalendarIcon,
  Eye,
  Mail,
  Lock,
  LayoutGrid,
  LogOut,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { useParams, useNavigate } from "react-router-dom";
import {
  BrandNotFoundError,
  fetchBrandById,
  fetchCampaignsForBrand,
  fetchDealsForBrand,
  fetchBrandAnalytics,
  type BrandAnalytics,
} from "@/actions/brandActions";

import { useToast } from "@/hooks/use-toast";
import {
  brandAuth,
  getOrgRole,
  getSubscribedModules,
  hasModule,
} from "@/lib/brandAuth";

import OverviewTab from "@/components/OverviewTab";
import PromotionsTab from "@/components/PromotionsTab";
import EsgTab from "@/components/EsgTab";
import MintTraceTab from "@/components/MintTraceTab";
import { Brand, Campaign, Deal } from "@/types";
import SettingsTab from "@/components/SettingsTab";

const BrandDashboard = () => {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [brandData, setBrandData] = useState<Brand>();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  // All-time analytics — the stable figures the ESG/board-report tab reads.
  // Never scoped to a period, so those numbers don't shift under the reader.
  const [analytics, setAnalytics] = useState<BrandAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  // Period-scoped analytics — drives the Overview tab, which owns the picker.
  const [overviewAnalytics, setOverviewAnalytics] =
    useState<BrandAnalytics | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState<string | null>(null);
  // Campaign analytics period. Defaults to month-to-date (first of the current
  // month → today), the common reporting window for brand managers.
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const now = new Date();
    return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now };
  });
  // Tabs are state-driven (no sub-routes), so "route-level" module gating
  // happens here: deep links to /dashboard/:brandId always land on a tab the
  // user is allowed to see, and tab switches are validated.
  const [activeTab, setActiveTab] = useState(() =>
    hasModule("consumer-reporting") ? "overview" : "settings",
  );
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
        // 404 covers stale cached brand links and foreign/orphan ids alike —
        // fall through to the not-found view instead of bouncing away.
        if (!(error instanceof BrandNotFoundError)) {
          console.error("Unexpected error:", error);
          toast({
            title: "Error loading brand data",
            description: "Please try again later.",
            variant: "destructive",
          });
        }
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

    fetchBrandData();
    fetchCampaigns();
    fetchDeals();
  }, [brandId, navigate, toast]);

  // All-time analytics — loaded once per brand, independent of the picker.
  useEffect(() => {
    if (!brandId) return;
    let cancelled = false;
    const run = async () => {
      setAnalyticsLoading(true);
      setAnalyticsError(null);
      try {
        const data = await fetchBrandAnalytics(brandId);
        if (!cancelled) setAnalytics(data);
      } catch (error) {
        // Typed 402/403 messages from throwForBrandApiStatus read well as-is.
        if (!cancelled) {
          setAnalyticsError(
            error instanceof Error ? error.message : "Failed to load analytics.",
          );
        }
      } finally {
        if (!cancelled) setAnalyticsLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [brandId]);

  // Period-scoped analytics for the Overview tab — re-queries the backend
  // whenever the reporting period changes, rather than relabelling stale data.
  const rangeFrom = dateRange?.from ? dateRange.from.getTime() : null;
  const rangeTo = dateRange?.to ? dateRange.to.getTime() : null;
  useEffect(() => {
    if (!brandId) return;
    let cancelled = false;
    const run = async () => {
      setOverviewLoading(true);
      setOverviewError(null);
      try {
        const range =
          rangeFrom !== null && rangeTo !== null
            ? { from: new Date(rangeFrom), to: new Date(rangeTo) }
            : undefined;
        const data = await fetchBrandAnalytics(brandId, range);
        if (!cancelled) setOverviewAnalytics(data);
      } catch (error) {
        if (!cancelled) {
          setOverviewError(
            error instanceof Error ? error.message : "Failed to load analytics.",
          );
        }
      } finally {
        if (!cancelled) setOverviewLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [brandId, rangeFrom, rangeTo]);

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

  const applyUpdatedBrand = (brand: Brand) => {
    // The PATCH response contains writable fields (including `phone`) that the
    // current scoped GET projection omits. Apply it directly so a successful
    // save is not immediately replaced by an incomplete refetch.
    setBrandData((current) => ({
      ...current,
      ...brand,
      id: brand.id ?? brand._id ?? current?.id,
      _id: brand._id ?? brand.id ?? current?._id,
    } as Brand));
  };

  // Function to handle campaign creation success
  const handleCampaignCreated = async () => {
    await refreshCampaigns();
    setActiveTab("promotions"); // Switch to promotions tab after creation
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
          <Button onClick={() => navigate("/brands")}>Back to Your Brands</Button>
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
            <AlertCircle className="h-5 w-5" style={{ color: brandColor }} />
            What's Next?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 rounded-full mt-2" style={{ backgroundColor: brandColor }}></div>
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
              <a
                href="mailto:engineering@mymintrewards.com"
                className="text-sm text-primary underline-offset-4 hover:underline"
              >
                engineering@mymintrewards.com
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Monday - Friday, 9 AM - 6 PM EST</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Button */}
      <Card style={{ backgroundColor: brandColor + "0d" }}>
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

  // Module gating — UX mirror of the backend's resolution order (see
  // brandAuth.ts). Subscribed-missing modules render locked (upsell, the 402
  // story); role-missing modules are hidden entirely (not the user's job).
  const subscribedModules = getSubscribedModules();
  const orgRole = getOrgRole();
  const canManageSettings = orgRole === "owner" || orgRole === "admin";
  const showReporting = hasModule("consumer-reporting");
  const esgSubscribed = subscribedModules.includes("esg");
  const showEsg = hasModule("esg");
  const showLockedEsg = !esgSubscribed;
  const mintTraceSubscribed = subscribedModules.includes("minttrace");
  const showMintTrace = hasModule("minttrace");
  const showLockedMintTrace = !mintTraceSubscribed;
  const hasAnyModule = subscribedModules.length > 0;

  const visibleTabCount =
    (showReporting ? 2 : 0) +
    (showEsg || showLockedEsg ? 1 : 0) +
    (showMintTrace || showLockedMintTrace ? 1 : 0) +
    1; // + Settings

  const allowedTabs = new Set([
    ...(showReporting ? ["overview", "promotions"] : []),
    ...(showEsg ? ["esg"] : []),
    ...(showMintTrace ? ["minttrace"] : []),
    "settings",
  ]);

  const handleTabChange = (value: string) => {
    if (!allowedTabs.has(value)) {
      toast({
        title: "You don't have access to that section",
        description: "Ask your organisation's owner or admin for access.",
      });
      return;
    }
    setActiveTab(value);
  };

  const handleLockedModuleClick = (moduleName: string) => {
    toast({
      title: `${moduleName} is not part of your plan`,
      description:
        "Your organisation isn't subscribed to this module. Contact MintRewards to add it.",
    });
  };

  const ApprovedDashboardView = () => (
    <div className="space-y-6">
      {!hasAnyModule && (
        <Card>
          <CardContent className="p-10 text-center space-y-3">
            <LayoutGrid className="h-8 w-8 mx-auto text-muted-foreground" aria-hidden="true" />
            <h3 className="font-semibold">No active modules</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Your organisation has no active module subscriptions yet. Once a
              module is added to your plan, its tools will appear here.
              Settings remain available below.
            </p>
          </CardContent>
        </Card>
      )}
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
        value={allowedTabs.has(activeTab) ? activeTab : "settings"}
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        <TabsList
          className="grid w-full"
          style={{
            gridTemplateColumns: `repeat(${visibleTabCount}, minmax(0, 1fr))`,
          }}
        >
          {showReporting && (
            <>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="promotions">Promotions</TabsTrigger>
            </>
          )}
          {showEsg && <TabsTrigger value="esg">ESG</TabsTrigger>}
          {showLockedEsg && (
            <button
              type="button"
              onClick={() => handleLockedModuleClick("ESG")}
              className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium text-muted-foreground/60 cursor-pointer"
              aria-label="ESG — not included in your plan"
            >
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              ESG
            </button>
          )}
          {showMintTrace && <TabsTrigger value="minttrace">MintTrace</TabsTrigger>}
          {showLockedMintTrace && (
            <button
              type="button"
              onClick={() => handleLockedModuleClick("MintTrace")}
              className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium text-muted-foreground/60 cursor-pointer"
              aria-label="MintTrace — not included in your plan"
            >
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              MintTrace
            </button>
          )}
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {showReporting && (
          <>
            <TabsContent value="overview" className="space-y-6">
              <div
                className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                style={{
                  borderColor: brandColor + "33",
                  backgroundColor: brandColor + "0a",
                }}
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Statistics Period
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Campaign and deal metrics reflect this range.
                    Environmental totals are all-time.
                  </p>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start gap-2 font-normal"
                    >
                      <CalendarIcon
                        className="h-4 w-4"
                        style={{ color: brandColor }}
                      />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "MMM d, yyyy")} –{" "}
                            {format(dateRange.to, "MMM d, yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "MMM d, yyyy")
                        )
                      ) : (
                        "Select dates"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <OverviewTab
                analytics={overviewAnalytics}
                loading={overviewLoading}
                error={overviewError}
                brandColor={brandColor}
              />
            </TabsContent>

            <TabsContent value="promotions">
              <PromotionsTab
                campaigns={campaigns}
                deals={deals}
                logoUrl={formattedData.logoUrl}
                brandColor={brandColor}
                onCampaignCreated={handleCampaignCreated}
                onCampaignUpdated={(updated) => {
                  // PATCH responses carry the raw document (_id); campaign
                  // state uses normalized ids — match on either.
                  const updatedId = updated.id ?? updated._id;
                  setCampaigns((current) =>
                    current.map((c) =>
                      c.id === updatedId ? { ...c, ...updated, id: c.id } : c,
                    ),
                  );
                }}
                onDealCreated={refreshDeals}
              />
            </TabsContent>
          </>
        )}

        {showEsg && (
          <TabsContent value="esg">
            <EsgTab
              analytics={analytics}
              loading={analyticsLoading}
              error={analyticsError}
              brandColor={brandColor}
            />
          </TabsContent>
        )}

        {showMintTrace && (
          <TabsContent value="minttrace">
            <MintTraceTab brandColor={brandColor} />
          </TabsContent>
        )}

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
            brandColor={brandColor}
            onSettingsUpdated={applyUpdatedBrand}
            readOnly={!canManageSettings}
          />
        </TabsContent>
      </Tabs>
    </div>
  );

  const brandColor = formattedData.themeColor;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        {/* Brand color accent line */}
        <div className="h-0.5 w-full" style={{ backgroundColor: brandColor }} />
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {formattedData.logoUrl ? (
                <img
                  src={formattedData.logoUrl}
                  alt={`${formattedData.name} logo`}
                  className="h-10 w-10 rounded-lg object-cover border"
                />
              ) : (
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: brandColor }}
                >
                  <Building2 className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold">{formattedData.name}</h1>
                <p className="text-xs text-muted-foreground">{formattedData.category || "Brand Dashboard"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge
                variant="outline"
                style={{
                  backgroundColor: brandColor + "1a",
                  color: brandColor,
                  borderColor: brandColor + "33",
                }}
              >
                {brandData.status?.toLowerCase() === "approved" ? "Active" : "Pending"}
              </Badge>
              <Button variant="outline" onClick={() => navigate("/")}>
                Exit Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  brandAuth.clearToken();
                  navigate("/brand/login");
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
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
