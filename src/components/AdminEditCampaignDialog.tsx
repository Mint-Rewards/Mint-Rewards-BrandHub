import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { toast } from "@/hooks/use-toast";
import { updateCampaign } from "@/actions/brandActions";
import { isValidDateRange } from "@/lib/validators";
import {
  pickDirtyValues,
  toDateInputValue,
  fromDateInputValue,
  toNullableNumber,
} from "@/lib/adminEditForm";
import type { Campaign } from "@/types";

// Mirrors BRAND_EDITABLE in the backend's
// PATCH /api/brands/[id]/campaigns/[campaignId] route. `status` is excluded:
// approval stays on the approve/reject buttons. Discount codes are excluded
// too — that route does not support editing an existing campaign's code pool.
const campaignEditSchema = z
  .object({
    name: z.string().min(1, "Title is required"),
    subtitle: z.string().optional(),
    badge: z.string().optional(),
    description: z.string().optional(),
    campaignType: z.string().min(1, "Campaign type is required"),
    targetAudience: z.string().optional(),
    budget: z
      .string()
      .optional()
      .refine(
        (v) => !v || (!Number.isNaN(Number(v)) && Number(v) > 0),
        "Enter an amount greater than 0",
      ),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    backgroundColor: z
      .string()
      .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Use a valid hex colour")
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (!data.startDate || !data.endDate) return;
    const message = isValidDateRange(
      new Date(data.startDate),
      new Date(data.endDate),
    );
    if (!message) return;
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["endDate"], message });
  });

type CampaignEditFormData = z.infer<typeof campaignEditSchema>;

const toFormValues = (campaign: Campaign): CampaignEditFormData => ({
  name: campaign.name ?? "",
  subtitle: campaign.subtitle ?? "",
  badge: campaign.badge ?? "",
  description: campaign.description ?? "",
  campaignType: campaign.campaignType ?? "",
  targetAudience: campaign.targetAudience ?? "",
  budget: campaign.budget != null ? String(campaign.budget) : "",
  startDate: toDateInputValue(campaign.startDate),
  endDate: toDateInputValue(campaign.endDate),
  backgroundColor: campaign.backgroundColor ?? "",
});

/**
 * Admin overwrite of a campaign's details, available in every status.
 * Approval remains a separate action, so saving here does not change status.
 */
const AdminEditCampaignDialog: React.FC<{
  campaign: Campaign | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCampaignUpdated: (campaign: Campaign) => void;
}> = ({ campaign, open, onOpenChange, onCampaignUpdated }) => {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<CampaignEditFormData>({
    resolver: zodResolver(campaignEditSchema),
    defaultValues: campaign
      ? toFormValues(campaign)
      : toFormValues({} as Campaign),
  });

  useEffect(() => {
    if (!campaign) return;
    form.reset(toFormValues(campaign));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign, open]);

  const onSubmit = async (data: CampaignEditFormData) => {
    if (!campaign) return;
    const brandId = String(campaign.brand ?? "");
    const campaignId = campaign.id ?? campaign._id;
    if (!campaignId) return;

    const dirty = pickDirtyValues(data, form.formState.dirtyFields);
    if (Object.keys(dirty).length === 0) {
      toast({ title: "No changes", description: "Nothing to save." });
      return;
    }

    // Text fields pass through as-is; dates and budget need their wire types.
    const payload: Parameters<typeof updateCampaign>[2] = {};
    for (const [key, value] of Object.entries(dirty)) {
      if (key === "startDate" || key === "endDate") {
        payload[key] = fromDateInputValue(String(value ?? "")) ?? undefined;
      } else if (key === "budget") {
        payload.budget = toNullableNumber(String(value ?? ""));
      } else {
        (payload as Record<string, unknown>)[key] = value;
      }
    }

    setIsSaving(true);
    try {
      const updated = await updateCampaign(brandId, campaignId, payload);
      toast({
        title: "Campaign updated",
        description: `"${updated.name ?? campaign.name}" has been saved.`,
      });
      onCampaignUpdated(updated);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update campaign.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next && campaign) form.reset(toFormValues(campaign));
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Campaign</DialogTitle>
          <DialogDescription>
            Overwrite this campaign's details. Approval status and discount
            codes are managed separately.
          </DialogDescription>
        </DialogHeader>

        {campaign && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="rounded-md border bg-muted/40 px-4 py-3">
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="text-base">{campaign.status ?? "—"}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Campaign title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle</FormLabel>
                      <FormControl>
                        <Input placeholder="Subtitle" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="campaignType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Seasonal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Students" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget (PKR)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="badge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Badge</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. New" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="backgroundColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Background Colour</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            className="h-10 w-16 rounded-md"
                            value={field.value || "#0EA5E9"}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                          <Input
                            placeholder="#0EA5E9"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            ref={field.ref}
                            name={field.name}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="About this campaign…"
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdminEditCampaignDialog;
