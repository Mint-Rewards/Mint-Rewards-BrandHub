import { Plus, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
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
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from "./ui/dialog";
import { CreateCampaignForm } from "./CreateCampaignForm";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Campaign } from "@/types";
import { Badge } from "./ui/badge";

const CampaignsTab: React.FC<{
  campaigns: Campaign[];
  onCampaignCreated?: () => Promise<void>;
}> = ({ campaigns, onCampaignCreated }) => {
  const { brandId } = useParams();

  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);

  // Debug: Log campaigns data
  console.log(
    "CampaignsTab - campaigns:",
    campaigns,
    "length:",
    campaigns.length
  );

  const handleCampaignSuccess = async () => {
    setCampaignDialogOpen(false);
    if (onCampaignCreated) {
      await onCampaignCreated();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Campaign Management</CardTitle>
          <CardDescription>
            Create and manage your marketing campaigns
          </CardDescription>
        </div>
        <Dialog open={campaignDialogOpen} onOpenChange={setCampaignDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
            </DialogHeader>
            <CreateCampaignForm
              brandId={brandId!}
              onSuccess={handleCampaignSuccess}
              onCancel={() => setCampaignDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {campaigns.length > 0 ? (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:bg-muted/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{campaign.title}</CardTitle>
                    <Badge
                      variant={
                        campaign.status === "active"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {campaign.status.charAt(0).toUpperCase() +
                        campaign.status.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription>{campaign.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Start Date:{" "}
                    {new Date(campaign.start_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    End Date: {new Date(campaign.end_date).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first campaign to get started
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignsTab;
