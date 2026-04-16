import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { CreateDealForm } from "./CreateDealForm";
import { useState } from "react";
import { Deal } from "@/types";
import { Badge } from "./ui/badge";
import { useParams } from "react-router-dom";

const DealsTab: React.FC<{ deals: Deal[] }> = ({ deals }) => {
  const { brandId } = useParams();
  const [dealDialogOpen, setDealDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Deals & Discounts</CardTitle>
          <CardDescription>Manage your promotional offers</CardDescription>
        </div>
        <Dialog open={dealDialogOpen} onOpenChange={setDealDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Deal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Deal</DialogTitle>
            </DialogHeader>
            <CreateDealForm
              brandId={brandId!}
              onSuccess={() => setDealDialogOpen(false)}
              onCancel={() => setDealDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {deals.length > 0 ? (
          <div className="space-y-4">
            {deals.map((deal) => (
              <Card key={deal.id} className="hover:bg-muted/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{deal.title}</CardTitle>
                    <Badge
                      variant={
                        deal.status === "active" ? "secondary" : "destructive"
                      }
                    >
                      {deal.status.charAt(0).toUpperCase() +
                        deal.status.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription>{deal.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Valid From: {new Date(deal.start_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Valid Until: {new Date(deal.end_date).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Badge className="h-12 w-12 rounded-full bg-accent/10 text-accent mx-auto mb-4 flex items-center justify-center text-lg">
              <Plus className="h-6 w-6" />
            </Badge>
            <h3 className="text-lg font-semibold mb-2">No deals created yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first deal to attract customers
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DealsTab;
