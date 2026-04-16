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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Truck,
  Warehouse,
  Package,
  MapPin,
  Weight,
  Calendar,
  Loader2,
  Recycle,
  Plus,
  CheckCircle2,
  BarChart3,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Collection } from "@/types";
import { Separator } from "@/components/ui/separator";

const TransitCollections = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [transitCollections, setTransitCollections] = useState<Collection[]>(
    []
  );
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);
  const [showWarehouseForm, setShowWarehouseForm] = useState(false);

  // Warehouse form data
  const [warehouseData, setWarehouseData] = useState({
    paper_weight: "",
    cardboard_weight: "",
    plastic_weight: "",
    glass_weight: "",
    aluminum_weight: "",
    steel_weight: "",
    electronic_weight: "",
    organic_weight: "",
  });

  useEffect(() => {
    fetchTransitCollections();
  }, []);

  const fetchTransitCollections = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockCollections: Collection[] = [
        {
          id: "1",
          brand_id: "1",
          brand_name: "EcoStore",
          status: "transit",
          total_weight: 150.5,
          collection_date: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
          pickup_location: "Downtown Location",
          notes: "Regular weekly pickup",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          brand_id: "2",
          brand_name: "GreenCafe",
          status: "transit",
          total_weight: 89.3,
          collection_date: new Date(
            Date.now() - 1 * 24 * 60 * 60 * 1000
          ).toISOString(),
          pickup_location: "Main Street Branch",
          notes: "Mostly organic waste",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "3",
          brand_id: "3",
          brand_name: "TechCycle",
          status: "transit",
          total_weight: 245.7,
          collection_date: new Date().toISOString(),
          pickup_location: "Tech Park Facility",
          notes: "Electronic waste collection",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      setTransitCollections(mockCollections);
    } catch (error) {
      console.error("Error fetching transit collections:", error);
      toast({
        title: "Error",
        description: "Failed to load transit collections",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProcessCollection = (collection: Collection) => {
    setSelectedCollection(collection);
    setShowWarehouseForm(true);
  };

  const handleFinalizeCollection = async () => {
    if (!selectedCollection) return;

    // Calculate total weight from breakdown
    const totalBreakdown =
      parseFloat(warehouseData.paper_weight || "0") +
      parseFloat(warehouseData.cardboard_weight || "0") +
      parseFloat(warehouseData.plastic_weight || "0") +
      parseFloat(warehouseData.glass_weight || "0") +
      parseFloat(warehouseData.aluminum_weight || "0") +
      parseFloat(warehouseData.steel_weight || "0") +
      parseFloat(warehouseData.electronic_weight || "0") +
      parseFloat(warehouseData.organic_weight || "0");

    if (totalBreakdown === 0) {
      toast({
        title: "Missing Information",
        description: "Please enter weight for at least one material type",
        variant: "destructive",
      });
      return;
    }

    try {
      setProcessingId(selectedCollection.id);

      // Calculate CO2 savings
      const CO2_SAVINGS_PER_KG = {
        paper: 3.3,
        cardboard: 3.3,
        plastic: 2.0,
        glass: 0.5,
        aluminum: 9.0,
        steel: 1.5,
        electronic: 4.0,
        organic: 0.3,
      };

      const co2Saved =
        parseFloat(warehouseData.paper_weight || "0") *
          CO2_SAVINGS_PER_KG.paper +
        parseFloat(warehouseData.cardboard_weight || "0") *
          CO2_SAVINGS_PER_KG.cardboard +
        parseFloat(warehouseData.plastic_weight || "0") *
          CO2_SAVINGS_PER_KG.plastic +
        parseFloat(warehouseData.glass_weight || "0") *
          CO2_SAVINGS_PER_KG.glass +
        parseFloat(warehouseData.aluminum_weight || "0") *
          CO2_SAVINGS_PER_KG.aluminum +
        parseFloat(warehouseData.steel_weight || "0") *
          CO2_SAVINGS_PER_KG.steel +
        parseFloat(warehouseData.electronic_weight || "0") *
          CO2_SAVINGS_PER_KG.electronic +
        parseFloat(warehouseData.organic_weight || "0") *
          CO2_SAVINGS_PER_KG.organic;

      // Update collection with warehouse details
      const finalizedCollection: Collection = {
        ...selectedCollection,
        status: "finalized",
        paper_weight: parseFloat(warehouseData.paper_weight || "0"),
        cardboard_weight: parseFloat(warehouseData.cardboard_weight || "0"),
        plastic_weight: parseFloat(warehouseData.plastic_weight || "0"),
        glass_weight: parseFloat(warehouseData.glass_weight || "0"),
        aluminum_weight: parseFloat(warehouseData.aluminum_weight || "0"),
        steel_weight: parseFloat(warehouseData.steel_weight || "0"),
        electronic_weight: parseFloat(warehouseData.electronic_weight || "0"),
        organic_weight: parseFloat(warehouseData.organic_weight || "0"),
        co2_saved: co2Saved,
        finalized_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Mock API call - replace with actual implementation
      console.log("Finalizing collection:", finalizedCollection);

      toast({
        title: "Collection Finalized",
        description: `Successfully processed ${totalBreakdown.toFixed(
          1
        )} kg of materials. CO₂ saved: ${co2Saved.toFixed(2)} kg`,
      });

      // Remove from transit collections
      setTransitCollections((prev) =>
        prev.filter((c) => c.id !== selectedCollection.id)
      );

      // Reset form
      setWarehouseData({
        paper_weight: "",
        cardboard_weight: "",
        plastic_weight: "",
        glass_weight: "",
        aluminum_weight: "",
        steel_weight: "",
        electronic_weight: "",
        organic_weight: "",
      });
      setSelectedCollection(null);
      setShowWarehouseForm(false);
    } catch (error) {
      console.error("Error finalizing collection:", error);
      toast({
        title: "Error",
        description: "Failed to finalize collection",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const totalBreakdown =
    parseFloat(warehouseData.paper_weight || "0") +
    parseFloat(warehouseData.cardboard_weight || "0") +
    parseFloat(warehouseData.plastic_weight || "0") +
    parseFloat(warehouseData.glass_weight || "0") +
    parseFloat(warehouseData.aluminum_weight || "0") +
    parseFloat(warehouseData.steel_weight || "0") +
    parseFloat(warehouseData.electronic_weight || "0") +
    parseFloat(warehouseData.organic_weight || "0");

  const expectedWeight = selectedCollection?.total_weight || 0;
  const weightDifference = totalBreakdown - expectedWeight;
  const weightMatchPercentage =
    expectedWeight > 0 ? (totalBreakdown / expectedWeight) * 100 : 0;

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
                <h1 className="text-xl font-bold">Transit Collections</h1>
                <p className="text-xs text-muted-foreground">
                  Manage collections in transit and process at warehouse
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate("/admin/dashboard/add-collection")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add More
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  navigate("/admin/dashboard/finalized-collections")
                }
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Finalized Collections
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/admin/dashboard")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transit Collections List */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Collections In Transit
                </CardTitle>
                <CardDescription>
                  {transitCollections.length} collection
                  {transitCollections.length !== 1 ? "s" : ""} waiting to be
                  processed
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : transitCollections.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-2">
                      No collections in transit
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/add-collection")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Collection
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transitCollections.map((collection) => (
                      <Card
                        key={collection.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedCollection?.id === collection.id
                            ? "border-primary ring-2 ring-primary/20"
                            : ""
                        }`}
                        onClick={() =>
                          !showWarehouseForm &&
                          handleProcessCollection(collection)
                        }
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">
                                  {collection.brand_name}
                                </h3>
                                <Badge variant="secondary" className="text-xs">
                                  <Truck className="h-3 w-3 mr-1" />
                                  In Transit
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Weight className="h-3 w-3" />
                                  <span>{collection.total_weight} kg</span>
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  <span>
                                    {new Date(
                                      collection.collection_date
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                {collection.pickup_location && (
                                  <div className="flex items-center gap-1 text-muted-foreground col-span-2">
                                    <MapPin className="h-3 w-3" />
                                    <span>{collection.pickup_location}</span>
                                  </div>
                                )}
                              </div>
                              {collection.notes && (
                                <p className="text-sm text-muted-foreground italic">
                                  {collection.notes}
                                </p>
                              )}
                            </div>
                            {selectedCollection?.id === collection.id &&
                              showWarehouseForm && (
                                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 ml-2" />
                              )}
                          </div>
                          {!showWarehouseForm && (
                            <Button
                              className="w-full mt-3"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProcessCollection(collection);
                              }}
                            >
                              <Warehouse className="h-4 w-4 mr-2" />
                              Process at Warehouse
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Warehouse Processing Form */}
          <div className="space-y-6">
            {!showWarehouseForm ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Warehouse className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Warehouse Processing
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Select a collection from the list to begin processing and
                    enter material breakdown details
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Warehouse className="h-5 w-5" />
                    Processing - {selectedCollection?.brand_name}
                  </CardTitle>
                  <CardDescription>
                    Break down materials by type for accurate tracking
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Summary Banner */}
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Expected Weight:
                      </span>
                      <span className="font-semibold">{expectedWeight} kg</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Current Total:
                      </span>
                      <span className="font-semibold">
                        {totalBreakdown.toFixed(1)} kg
                      </span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Difference:</span>
                      <span
                        className={`font-semibold ${
                          Math.abs(weightDifference) < 1
                            ? "text-green-600"
                            : "text-amber-600"
                        }`}
                      >
                        {weightDifference > 0 ? "+" : ""}
                        {weightDifference.toFixed(1)} kg
                      </span>
                    </div>
                    {totalBreakdown > 0 && (
                      <Progress
                        value={Math.min(weightMatchPercentage, 100)}
                        className="h-2"
                      />
                    )}
                  </div>

                  {/* Material Breakdown Inputs */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Material Breakdown
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Paper */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="paper"
                          className="flex items-center gap-2"
                        >
                          <div className="h-3 w-3 rounded-full bg-green-500" />
                          Paper (kg)
                        </Label>
                        <Input
                          id="paper"
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="0.0"
                          value={warehouseData.paper_weight}
                          onChange={(e) =>
                            setWarehouseData({
                              ...warehouseData,
                              paper_weight: e.target.value,
                            })
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          CO₂: 3.3 kg/kg
                        </p>
                      </div>

                      {/* Cardboard */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="cardboard"
                          className="flex items-center gap-2"
                        >
                          <div className="h-3 w-3 rounded-full bg-emerald-600" />
                          Cardboard (kg)
                        </Label>
                        <Input
                          id="cardboard"
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="0.0"
                          value={warehouseData.cardboard_weight}
                          onChange={(e) =>
                            setWarehouseData({
                              ...warehouseData,
                              cardboard_weight: e.target.value,
                            })
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          CO₂: 3.3 kg/kg
                        </p>
                      </div>

                      {/* Plastic */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="plastic"
                          className="flex items-center gap-2"
                        >
                          <div className="h-3 w-3 rounded-full bg-purple-500" />
                          Plastic (kg)
                        </Label>
                        <Input
                          id="plastic"
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="0.0"
                          value={warehouseData.plastic_weight}
                          onChange={(e) =>
                            setWarehouseData({
                              ...warehouseData,
                              plastic_weight: e.target.value,
                            })
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          CO₂: 2.0 kg/kg
                        </p>
                      </div>

                      {/* Glass */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="glass"
                          className="flex items-center gap-2"
                        >
                          <div className="h-3 w-3 rounded-full bg-blue-500" />
                          Glass (kg)
                        </Label>
                        <Input
                          id="glass"
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="0.0"
                          value={warehouseData.glass_weight}
                          onChange={(e) =>
                            setWarehouseData({
                              ...warehouseData,
                              glass_weight: e.target.value,
                            })
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          CO₂: 0.5 kg/kg
                        </p>
                      </div>

                      {/* Aluminum */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="aluminum"
                          className="flex items-center gap-2"
                        >
                          <div className="h-3 w-3 rounded-full bg-amber-500" />
                          Aluminum (kg)
                        </Label>
                        <Input
                          id="aluminum"
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="0.0"
                          value={warehouseData.aluminum_weight}
                          onChange={(e) =>
                            setWarehouseData({
                              ...warehouseData,
                              aluminum_weight: e.target.value,
                            })
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          CO₂: 9.0 kg/kg
                        </p>
                      </div>

                      {/* Steel */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="steel"
                          className="flex items-center gap-2"
                        >
                          <div className="h-3 w-3 rounded-full bg-slate-500" />
                          Steel (kg)
                        </Label>
                        <Input
                          id="steel"
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="0.0"
                          value={warehouseData.steel_weight}
                          onChange={(e) =>
                            setWarehouseData({
                              ...warehouseData,
                              steel_weight: e.target.value,
                            })
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          CO₂: 1.5 kg/kg
                        </p>
                      </div>

                      {/* Electronic */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="electronic"
                          className="flex items-center gap-2"
                        >
                          <div className="h-3 w-3 rounded-full bg-red-500" />
                          Electronic (kg)
                        </Label>
                        <Input
                          id="electronic"
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="0.0"
                          value={warehouseData.electronic_weight}
                          onChange={(e) =>
                            setWarehouseData({
                              ...warehouseData,
                              electronic_weight: e.target.value,
                            })
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          CO₂: 4.0 kg/kg
                        </p>
                      </div>

                      {/* Organic */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="organic"
                          className="flex items-center gap-2"
                        >
                          <div className="h-3 w-3 rounded-full bg-lime-500" />
                          Organic (kg)
                        </Label>
                        <Input
                          id="organic"
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="0.0"
                          value={warehouseData.organic_weight}
                          onChange={(e) =>
                            setWarehouseData({
                              ...warehouseData,
                              organic_weight: e.target.value,
                            })
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          CO₂: 0.3 kg/kg
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Weight Warning */}
                  {totalBreakdown > 0 && Math.abs(weightDifference) > 5 && (
                    <div className="flex items-start gap-2 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
                      <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-900 dark:text-amber-100">
                        <p className="font-medium">
                          Weight Discrepancy Detected
                        </p>
                        <p className="mt-1">
                          The total breakdown differs from expected by more than
                          5 kg. Please verify measurements.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowWarehouseForm(false);
                        setSelectedCollection(null);
                        setWarehouseData({
                          paper_weight: "",
                          cardboard_weight: "",
                          plastic_weight: "",
                          glass_weight: "",
                          aluminum_weight: "",
                          steel_weight: "",
                          electronic_weight: "",
                          organic_weight: "",
                        });
                      }}
                      disabled={processingId !== null}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleFinalizeCollection}
                      disabled={processingId !== null}
                    >
                      {processingId ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Finalizing...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Finalize Collection
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TransitCollections;
