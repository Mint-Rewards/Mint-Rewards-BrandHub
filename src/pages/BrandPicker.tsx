import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Plus, Store } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  brandSession,
  decodeBrandToken,
  type OrgBrand,
} from "@/lib/brandAuth";
import { createOrgBrand, fetchOrgBrands } from "@/actions/brandActions";

const BrandPicker = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  // Stale-while-revalidate: render the cached list from login immediately,
  // refresh from the server in the background.
  const [brands, setBrands] = useState<OrgBrand[]>(brandSession.getBrands());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const orgRole = decodeBrandToken()?.orgRole;
  const canCreateBrand = orgRole === "owner" || orgRole === "admin";

  useEffect(() => {
    let cancelled = false;
    fetchOrgBrands()
      .then((fresh) => {
        if (cancelled) return;
        setBrands(fresh);
        brandSession.setBrands(fresh);
      })
      .catch(() => {
        // Keep rendering the cached list; stale entries 404 server-side.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const brand = await createOrgBrand({ brandName, companyName });
      brandSession.setBrands([...brands, brand]);
      navigate(`/dashboard/${brand.id}`);
    } catch (error) {
      toast({
        title: "Could not create brand",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
              <Store className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Your Brands</h1>
              <p className="text-sm text-muted-foreground">
                MintRewards Brand Hub
              </p>
            </div>
          </div>
        </div>

        <Card className="border-0 bg-card/60 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              {brands.length > 0 ? "Choose a brand" : "No brands yet"}
            </CardTitle>
            <CardDescription>
              {brands.length > 0
                ? "Select the brand you want to manage."
                : canCreateBrand
                  ? "Create your organization's first brand to get started."
                  : "Ask an organization owner or admin to add you to a brand."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                to={`/dashboard/${brand.id}`}
                className="flex items-center space-x-4 rounded-lg border p-4 transition-colors hover:bg-accent"
              >
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt=""
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-medium truncate">{brand.brandName}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {brand.companyName}
                  </p>
                </div>
              </Link>
            ))}

            {canCreateBrand && !showCreateForm && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create brand
              </Button>
            )}

            {canCreateBrand && showCreateForm && (
              // Minimal on purpose: the backend backfills required legacy
              // fields (email, registration number, etc.) with placeholders.
              // Collecting real values here is a known follow-up.
              <form onSubmit={handleCreateBrand} className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="brandName">Brand Name</Label>
                  <Input
                    id="brandName"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Your brand"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your company"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full"
                  disabled={isCreating}
                >
                  {isCreating ? "Creating…" : "Create Brand"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrandPicker;
