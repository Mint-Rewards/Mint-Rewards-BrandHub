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
import { updateDeal } from "@/actions/brandActions";
import { isValidDateRange } from "@/lib/validators";
import {
  pickDirtyValues,
  toDateInputValue,
  fromDateInputValue,
  toNullableNumber,
} from "@/lib/adminEditForm";
import type { Deal } from "@/types";

// Mirrors ALLOWED_FIELDS in the backend's
// PATCH /api/brands/[id]/deals/[dealId] route, minus two:
//   • `status` — approval stays on the approve/reject buttons.
//   • `maxUses` — server-derived from the code count; never sent from the
//     client, and editing it here is exactly what produces a deal that reports
//     "Sold Out" while the UI advertises free capacity.
const dealEditSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    promoCode: z.string().optional(),
    discountPercentage: z
      .string()
      .optional()
      .refine(
        (v) => !v || (!Number.isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 100),
        "Enter a percentage between 0 and 100",
      ),
    discountAmount: z
      .string()
      .optional()
      .refine(
        (v) => !v || (!Number.isNaN(Number(v)) && Number(v) >= 0),
        "Enter a valid amount",
      ),
    minimumPurchase: z
      .string()
      .optional()
      .refine(
        (v) => !v || (!Number.isNaN(Number(v)) && Number(v) >= 0),
        "Enter a valid amount",
      ),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
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

type DealEditFormData = z.infer<typeof dealEditSchema>;

const toFormValues = (deal: Deal): DealEditFormData => ({
  title: deal.title ?? "",
  description: deal.description ?? "",
  promoCode: deal.promoCode ?? "",
  discountPercentage:
    deal.discountPercentage != null ? String(deal.discountPercentage) : "",
  discountAmount: deal.discountAmount != null ? String(deal.discountAmount) : "",
  minimumPurchase:
    deal.minimumPurchase != null ? String(deal.minimumPurchase) : "",
  startDate: toDateInputValue(deal.startDate),
  endDate: toDateInputValue(deal.endDate),
});

const NUMERIC_FIELDS = new Set([
  "discountPercentage",
  "discountAmount",
  "minimumPurchase",
]);

/**
 * Admin overwrite of a deal's details, available in every status. Approval and
 * capacity (codes / maxUses) are managed elsewhere.
 */
const AdminEditDealDialog: React.FC<{
  deal: Deal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDealUpdated: (deal: Deal) => void;
}> = ({ deal, open, onOpenChange, onDealUpdated }) => {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<DealEditFormData>({
    resolver: zodResolver(dealEditSchema),
    defaultValues: deal ? toFormValues(deal) : toFormValues({} as Deal),
  });

  useEffect(() => {
    if (!deal) return;
    form.reset(toFormValues(deal));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deal, open]);

  const onSubmit = async (data: DealEditFormData) => {
    if (!deal) return;
    const dealId = deal.id ?? deal._id;
    if (!dealId) return;

    const dirty = pickDirtyValues(data, form.formState.dirtyFields);
    if (Object.keys(dirty).length === 0) {
      toast({ title: "No changes", description: "Nothing to save." });
      return;
    }

    const payload: Parameters<typeof updateDeal>[2] = {};
    for (const [key, value] of Object.entries(dirty)) {
      if (key === "startDate" || key === "endDate") {
        payload[key] = fromDateInputValue(String(value ?? ""));
      } else if (NUMERIC_FIELDS.has(key)) {
        (payload as Record<string, unknown>)[key] = toNullableNumber(
          String(value ?? ""),
        );
      } else {
        (payload as Record<string, unknown>)[key] = value;
      }
    }

    setIsSaving(true);
    try {
      const updated = await updateDeal(deal.brandId ?? "", dealId, payload);
      toast({
        title: "Deal updated",
        description: `"${updated.title ?? deal.title}" has been saved.`,
      });
      onDealUpdated(updated);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update deal.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next && deal) form.reset(toFormValues(deal));
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Deal</DialogTitle>
          <DialogDescription>
            Overwrite this deal's details. Approval status and code capacity are
            managed separately.
          </DialogDescription>
        </DialogHeader>

        {deal && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-md border bg-muted/40 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p className="text-base">{deal.status ?? "—"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Capacity</p>
                  <p className="text-base">{deal.capacity ?? "Uncapped"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Remaining</p>
                  <p className="text-base">{deal.remaining ?? "—"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Deal title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="promoCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Promo Code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. SUMMER20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discountPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount %</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="100" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discountAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Flat Discount (PKR)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minimumPurchase"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Purchase (PKR)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" placeholder="0" {...field} />
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
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="About this deal…"
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

export default AdminEditDealDialog;
