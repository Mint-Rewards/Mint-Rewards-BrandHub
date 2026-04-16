import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Truck,
  Package,
  MapPin,
  Weight,
  Loader2,
  Recycle,
  ArrowLeft,
} from "lucide-react";
import { Brand, Collection } from "@/types";

const AddCollection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);

  // Form data
  const [formData, setFormData] = useState({
    brand_id: "",
    total_weight: "",
    pickup_location: "",
    notes: "",
  });

  useEffect(() => {
    // Fetch brands
    const fetchBrands = async () => {
      try {
        // Mock data - replace with actual API call
        setBrands([
          {
            id: "1",
            brand_name: "EcoStore",
            company_name: "EcoStore Inc.",
            category: "Retail",
            status: "approved",
            created_at: new Date().toISOString(),
            website: "https://ecostore.com",
            description: "Sustainable retail store",
            logo_url: "",
            theme_color: "#10B981",
            contact_email: "contact@ecostore.com",
            contact_phone: "+1234567890",
            address: "123 Green St",
            app_link: "",
            custom_emails: "",
            domain: "ecostore.com",
          },
          {
            id: "2",
            brand_name: "GreenCafe",
            company_name: "GreenCafe LLC",
            category: "Food & Beverage",
            status: "approved",
            created_at: new Date().toISOString(),
            website: "https://greencafe.com",
            description: "Eco-friendly cafe",
            logo_url: "",
            theme_color: "#059669",
            contact_email: "info@greencafe.com",
            contact_phone: "+1234567891",
            address: "456 Eco Ave",
            app_link: "",
            custom_emails: "",
            domain: "greencafe.com",
          },
          {
            id: "3",
            brand_name: "TechCycle",
            company_name: "TechCycle Corp",
            category: "Technology",
            status: "approved",
            created_at: new Date().toISOString(),
            website: "https://techcycle.com",
            description: "E-waste recycling",
            logo_url: "",
            theme_color: "#3B82F6",
            contact_email: "support@techcycle.com",
            contact_phone: "+1234567892",
            address: "789 Tech Blvd",
            app_link: "",
            custom_emails: "",
            domain: "techcycle.com",
          },
        ]);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  const handleSubmit = async () => {
    if (!formData.brand_id || !formData.total_weight) {
      toast({
        title: "Missing Information",
        description: "Please select a brand and enter total weight",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      // Create collection and mark as transit
      // Mock API call - replace with actual implementation
      const selectedBrand = brands.find((b) => b.id === formData.brand_id);
      const newCollection: Collection = {
        id: Date.now().toString(),
        brand_id: formData.brand_id,
        brand_name: selectedBrand?.brand_name,
        status: "transit",
        total_weight: parseFloat(formData.total_weight),
        collection_date: new Date().toISOString(),
        pickup_location: formData.pickup_location,
        notes: formData.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Mock API call - replace with actual implementation
      console.log("Creating collection:", newCollection);

      toast({
        title: "Collection Created",
        description: "Collection has been marked as in transit",
      });

      // Redirect to transit collections page
      navigate("/transit-collections");
    } catch (error) {
      console.error("Error creating collection:", error);
      toast({
        title: "Error",
        description: "Failed to create collection",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Recycle className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Add Collection</h1>
                <p className="text-xs text-muted-foreground">
                  Create new collection and mark as in transit
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/dashboard/collections")}
              disabled={loading}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              New Collection Details
            </CardTitle>
            <CardDescription>
              Select the brand and enter collection information to mark it as in
              transit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Select
                value={formData.brand_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, brand_id: value })
                }
                disabled={loading}
              >
                <SelectTrigger id="brand">
                  <SelectValue placeholder="Select a brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: brand.theme_color }}
                        />
                        {brand.brand_name} - {brand.category}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">
                  <Weight className="h-4 w-4 inline mr-1" />
                  Total Weight (kg) *
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="0.0"
                  value={formData.total_weight}
                  onChange={(e) =>
                    setFormData({ ...formData, total_weight: e.target.value })
                  }
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Pickup Location
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., Downtown Branch"
                  value={formData.pickup_location}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pickup_location: e.target.value,
                    })
                  }
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional information about this collection..."
                rows={3}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                disabled={loading}
              />
            </div>

            <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
              <Truck className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-blue-900 dark:text-blue-100">
                This collection will be marked as <strong>In Transit</strong>{" "}
                and you'll be redirected to the transit collections page
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() =>
                  navigate("/admin/dashboard/transit-collections/")
                }
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Truck className="h-4 w-4 mr-2" />
                    Mark as In Transit
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AddCollection;
