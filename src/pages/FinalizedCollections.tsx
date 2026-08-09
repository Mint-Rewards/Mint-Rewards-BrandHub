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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2,
  Loader2,
  Recycle,
  ArrowLeft,
  Calendar,
  Weight,
  MapPin,
  TrendingUp,
  Package,
  Building2,
  Search,
  Filter,
  FileText,
  Download,
} from "lucide-react";
import { Collection } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FinalizedCollections = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [finalizedCollections, setFinalizedCollections] = useState<
    Collection[]
  >([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBrand, setFilterBrand] = useState("all");
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);

  useEffect(() => {
    fetchFinalizedCollections();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...finalizedCollections];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.brandName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.pickupLocation
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          c.notes?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Brand filter
    if (filterBrand !== "all") {
      filtered = filtered.filter((c) => c.brandId === filterBrand);
    }

    setFilteredCollections(filtered);
  }, [searchQuery, filterBrand, finalizedCollections]);

  const fetchFinalizedCollections = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockCollections: Collection[] = [
        {
          id: "1",
          brandId: "1",
          brandName: "EcoStore",
          status: "finalized",
          totalWeight: 150.5,
          collectionDate: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          pickupLocation: "Downtown Location",
          notes: "Regular weekly pickup",
          paperWeight: 45.2,
          cardboardWeight: 38.5,
          plasticWeight: 28.3,
          glassWeight: 15.7,
          aluminumWeight: 8.5,
          steelWeight: 6.3,
          electronicWeight: 5.0,
          organicWeight: 3.0,
          co2Saved: 385.65,
          createdAt: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          updatedAt: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000
          ).toISOString(),
          finalizedAt: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        {
          id: "2",
          brandId: "2",
          brandName: "GreenCafe",
          status: "finalized",
          totalWeight: 89.3,
          collectionDate: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000
          ).toISOString(),
          pickupLocation: "Main Street Branch",
          notes: "Mostly organic waste",
          paperWeight: 12.5,
          cardboardWeight: 18.3,
          plasticWeight: 8.5,
          glassWeight: 5.0,
          aluminumWeight: 3.2,
          steelWeight: 1.8,
          electronicWeight: 0,
          organicWeight: 40.0,
          co2Saved: 168.45,
          createdAt: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000
          ).toISOString(),
          updatedAt: new Date(
            Date.now() - 3 * 24 * 60 * 60 * 1000
          ).toISOString(),
          finalizedAt: new Date(
            Date.now() - 3 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        {
          id: "3",
          brandId: "3",
          brandName: "TechCycle",
          status: "finalized",
          totalWeight: 245.7,
          collectionDate: new Date(
            Date.now() - 3 * 24 * 60 * 60 * 1000
          ).toISOString(),
          pickupLocation: "Tech Park Facility",
          notes: "Electronic waste collection",
          paperWeight: 8.5,
          cardboardWeight: 15.2,
          plasticWeight: 45.8,
          glassWeight: 12.3,
          aluminumWeight: 28.5,
          steelWeight: 35.4,
          electronicWeight: 95.0,
          organicWeight: 5.0,
          co2Saved: 892.15,
          createdAt: new Date(
            Date.now() - 3 * 24 * 60 * 60 * 1000
          ).toISOString(),
          updatedAt: new Date(
            Date.now() - 1 * 24 * 60 * 60 * 1000
          ).toISOString(),
          finalizedAt: new Date(
            Date.now() - 1 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        {
          id: "4",
          brandId: "1",
          brandName: "EcoStore",
          status: "finalized",
          totalWeight: 178.9,
          collectionDate: new Date(
            Date.now() - 14 * 24 * 60 * 60 * 1000
          ).toISOString(),
          pickupLocation: "Westside Store",
          notes: "Bi-weekly collection",
          paperWeight: 52.3,
          cardboardWeight: 48.5,
          plasticWeight: 32.1,
          glassWeight: 18.5,
          aluminumWeight: 12.0,
          steelWeight: 8.5,
          electronicWeight: 4.0,
          organicWeight: 3.0,
          co2Saved: 465.25,
          createdAt: new Date(
            Date.now() - 14 * 24 * 60 * 60 * 1000
          ).toISOString(),
          updatedAt: new Date(
            Date.now() - 12 * 24 * 60 * 60 * 1000
          ).toISOString(),
          finalizedAt: new Date(
            Date.now() - 12 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      ];
      setFinalizedCollections(mockCollections);
      setFilteredCollections(mockCollections);
    } catch (error) {
      console.error("Error fetching finalized collections:", error);
      toast({
        title: "Error",
        description: "Failed to load finalized collections",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uniqueBrands = Array.from(
    new Set(
      finalizedCollections.map((c) => ({ id: c.brandId, name: c.brandName }))
    )
  ).reduce((acc, curr) => {
    if (!acc.find((b) => b.id === curr.id)) {
      acc.push(curr);
    }
    return acc;
  }, [] as { id: string; name: string | undefined }[]);

  const totalStats = finalizedCollections.reduce(
    (acc, curr) => ({
      totalWeight: acc.totalWeight + curr.totalWeight,
      totalCO2: acc.totalCO2 + (curr.co2Saved || 0),
      count: acc.count + 1,
    }),
    { totalWeight: 0, totalCO2: 0, count: 0 }
  );

  const getMaterialBreakdown = (collection: Collection) => {
    const materials = [
      {
        name: "Paper",
        weight: collection.paperWeight || 0,
        color: "bg-green-500",
      },
      {
        name: "Cardboard",
        weight: collection.cardboardWeight || 0,
        color: "bg-emerald-600",
      },
      {
        name: "Plastic",
        weight: collection.plasticWeight || 0,
        color: "bg-purple-500",
      },
      {
        name: "Glass",
        weight: collection.glassWeight || 0,
        color: "bg-blue-500",
      },
      {
        name: "Aluminum",
        weight: collection.aluminumWeight || 0,
        color: "bg-amber-500",
      },
      {
        name: "Steel",
        weight: collection.steelWeight || 0,
        color: "bg-slate-500",
      },
      {
        name: "Electronic",
        weight: collection.electronicWeight || 0,
        color: "bg-red-500",
      },
      {
        name: "Organic",
        weight: collection.organicWeight || 0,
        color: "bg-lime-500",
      },
    ].filter((m) => m.weight > 0);

    return materials;
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
                <h1 className="text-xl font-bold">Finalized Collections</h1>
                <p className="text-xs text-muted-foreground">
                  View and analyze completed collections
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/dashboard/transit-collections")}
              >
                Transit Collections
              </Button>
              <Button variant="outline" onClick={() => navigate("/admin")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Collections</CardDescription>
              <CardTitle className="text-3xl">{totalStats.count}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" />
                <span>All processed</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Weight Processed</CardDescription>
              <CardTitle className="text-3xl">
                {totalStats.totalWeight.toFixed(1)}
                <span className="text-lg text-muted-foreground ml-1">kg</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Weight className="h-4 w-4" />
                <span>Across all brands</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total CO₂ Saved</CardDescription>
              <CardTitle className="text-3xl">
                {totalStats.totalCO2.toFixed(1)}
                <span className="text-lg text-muted-foreground ml-1">kg</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-success">
                <TrendingUp className="h-4 w-4" />
                <span>Environmental impact</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by brand, location, or notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-64">
                <Select value={filterBrand} onValueChange={setFilterBrand}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {uniqueBrands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  toast({
                    title: "Export Feature",
                    description: "Export functionality will be available soon",
                  });
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Collections List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredCollections.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No Collections Found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || filterBrand !== "all"
                  ? "Try adjusting your filters"
                  : "No finalized collections yet"}
              </p>
              {!searchQuery && filterBrand === "all" && (
                <Button onClick={() => navigate("/add-collection")}>
                  Add First Collection
                </Button>
              )}
            </div>
          ) : (
            filteredCollections.map((collection) => {
              const materials = getMaterialBreakdown(collection);
              return (
                <Card
                  key={collection.id}
                  className="cursor-pointer transition-all hover:shadow-lg"
                  onClick={() => setSelectedCollection(collection)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          {collection.brandName}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 text-xs">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(
                              collection.collectionDate
                            ).toLocaleDateString()}
                          </span>
                          {collection.pickupLocation && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {collection.pickupLocation}
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <Badge variant="default" className="bg-success">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Finalized
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Total Weight
                        </p>
                        <p className="text-2xl font-bold">
                          {collection.totalWeight}
                          <span className="text-sm text-muted-foreground ml-1">
                            kg
                          </span>
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          CO₂ Saved
                        </p>
                        <p className="text-2xl font-bold text-success">
                          {(collection.co2Saved || 0).toFixed(1)}
                          <span className="text-sm text-muted-foreground ml-1">
                            kg
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Material Breakdown */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Material Breakdown</p>
                      <div className="grid grid-cols-2 gap-2">
                        {materials.map((material) => (
                          <div
                            key={material.name}
                            className="flex items-center gap-2 text-sm"
                          >
                            <div
                              className={`h-3 w-3 rounded-full ${material.color}`}
                            />
                            <span className="text-muted-foreground">
                              {material.name}:
                            </span>
                            <span className="font-medium">
                              {material.weight} kg
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    {collection.notes && (
                      <div className="pt-3 border-t">
                        <p className="text-sm text-muted-foreground italic">
                          "{collection.notes}"
                        </p>
                      </div>
                    )}

                    {/* Finalized Date */}
                    <div className="pt-2 text-xs text-muted-foreground">
                      Finalized on{" "}
                      {collection.finalizedAt
                        ? new Date(collection.finalizedAt).toLocaleString()
                        : "N/A"}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Detail Modal (if needed) */}
        {selectedCollection && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCollection(null)}
          >
            <Card
              className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Building2 className="h-6 w-6" />
                      {selectedCollection.brandName}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Collection ID: {selectedCollection.id}
                    </CardDescription>
                  </div>
                  <Badge variant="default" className="bg-success">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Finalized
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Collection Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Collection Date
                    </p>
                    <p className="font-medium">
                      {new Date(
                        selectedCollection.collectionDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Pickup Location
                    </p>
                    <p className="font-medium">
                      {selectedCollection.pickupLocation || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Total Weight
                    </p>
                    <p className="text-2xl font-bold">
                      {selectedCollection.totalWeight} kg
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      CO₂ Saved
                    </p>
                    <p className="text-2xl font-bold text-success">
                      {(selectedCollection.co2Saved || 0).toFixed(2)} kg
                    </p>
                  </div>
                </div>

                {/* Material Breakdown */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Detailed Material Breakdown
                  </h3>
                  <div className="space-y-2">
                    {getMaterialBreakdown(selectedCollection).map(
                      (material) => (
                        <div
                          key={material.name}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-4 w-4 rounded-full ${material.color}`}
                            />
                            <span className="font-medium">{material.name}</span>
                          </div>
                          <span className="font-bold">
                            {material.weight} kg
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Notes */}
                {selectedCollection.notes && (
                  <div>
                    <h3 className="font-semibold mb-2">Notes</h3>
                    <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                      {selectedCollection.notes}
                    </p>
                  </div>
                )}

                {/* Timestamps */}
                <div className="pt-4 border-t space-y-1 text-sm text-muted-foreground">
                  <p>
                    Created:{" "}
                    {new Date(selectedCollection.createdAt).toLocaleString()}
                  </p>
                  <p>
                    Finalized:{" "}
                    {selectedCollection.finalizedAt
                      ? new Date(
                          selectedCollection.finalizedAt
                        ).toLocaleString()
                      : "N/A"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCollection(null)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      toast({
                        title: "Export Feature",
                        description:
                          "Export functionality will be available soon",
                      });
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default FinalizedCollections;
