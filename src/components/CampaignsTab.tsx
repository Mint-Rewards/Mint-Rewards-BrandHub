import { useState } from "react";
import { Plus, MoreHorizontal, Pencil, Trash2, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { CreateCampaignForm } from "./CreateCampaignForm";
import { useParams } from "react-router-dom";
import { Campaign } from "@/types";
import { deleteCampaign } from "@/actions/brandActions";
import { toast } from "@/hooks/use-toast";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING:  { label: "Pending",  className: "bg-warning/10 text-warning border-warning/20" },
  APPROVED: { label: "Approved", className: "bg-success/10 text-success border-success/20" },
  REJECTED: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
  EXPIRED:  { label: "Expired",  className: "bg-muted text-muted-foreground border-border" },
};

function statusConfig(raw: string) {
  return STATUS_CONFIG[raw?.toUpperCase()] ?? STATUS_CONFIG.PENDING;
}

const CampaignsTab: React.FC<{
  campaigns: Campaign[];
  logoUrl?: string;
  onCampaignCreated?: () => Promise<void>;
}> = ({ campaigns, logoUrl, onCampaignCreated }) => {
  const { brandId } = useParams();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleCreateSuccess = async () => {
    setCreateOpen(false);
    await onCampaignCreated?.();
  };

  const handleEditSuccess = async () => {
    setEditingCampaign(null);
    await onCampaignCreated?.();
  };

  const handleDelete = async () => {
    if (!deletingCampaign || !brandId) return;
    setBusyId(deletingCampaign.id);
    try {
      await deleteCampaign(brandId, deletingCampaign.id);
      toast({
        title: "Campaign deleted",
        description: `"${deletingCampaign.name}" has been removed.`,
      });
      setDeletingCampaign(null);
      await onCampaignCreated?.();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete campaign.",
        variant: "destructive",
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Campaign Management</CardTitle>
            <CardDescription>Create and manage your marketing campaigns</CardDescription>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </CardHeader>

        <CardContent>
          {campaigns.length > 0 ? (
            <div className="divide-y divide-border">
              {campaigns.map((campaign) => {
                const config = statusConfig(campaign.status);
                const isBusy = busyId === campaign.id;

                return (
                  <div
                    key={campaign.id}
                    className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {campaign.banner ? (
                        <img
                          src={campaign.banner}
                          alt=""
                          className="mt-0.5 h-10 w-16 rounded-md object-cover shrink-0 border"
                        />
                      ) : (
                        <div
                          className="mt-0.5 h-10 w-16 rounded-md shrink-0 border"
                          style={{ backgroundColor: campaign.backgroundColor ?? "#0F172A" }}
                        />
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium leading-snug">{campaign.name}</p>
                          <Badge
                            variant="outline"
                            className={`text-xs shrink-0 ${config.className}`}
                          >
                            {config.label}
                          </Badge>
                        </div>
                        {campaign.description && (
                          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                            {campaign.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          {campaign.campaignType && (
                            <span className="text-xs text-muted-foreground capitalize">
                              {campaign.campaignType.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                          )}
                          {campaign.startDate && campaign.endDate && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(campaign.startDate).toLocaleDateString()} –{" "}
                              {new Date(campaign.endDate).toLocaleDateString()}
                            </span>
                          )}
                          {campaign.budget != null && (
                            <span className="text-xs text-muted-foreground">
                              ${campaign.budget.toLocaleString()} budget
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center">
                      {isBusy ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground m-2" />
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              aria-label={`Actions for ${campaign.name}`}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => setEditingCampaign(campaign)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeletingCampaign(campaign)}
                              className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold mb-1">No campaigns yet</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto">
                Create your first campaign to start engaging customers and driving rewards.
              </p>
              <Button size="sm" onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
          </DialogHeader>
          <CreateCampaignForm
            brandId={brandId!}
            logoUrl={logoUrl}
            onSuccess={handleCreateSuccess}
            onCancel={() => setCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={!!editingCampaign} onOpenChange={(open) => !open && setEditingCampaign(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
          </DialogHeader>
          {editingCampaign && (
            <CreateCampaignForm
              brandId={brandId!}
              logoUrl={logoUrl}
              campaign={editingCampaign}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingCampaign(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deletingCampaign}
        onOpenChange={(open) => !open && setDeletingCampaign(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>"{deletingCampaign?.name}"</strong> will be permanently removed. This cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={!!busyId}
            >
              {busyId === deletingCampaign?.id && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CampaignsTab;
