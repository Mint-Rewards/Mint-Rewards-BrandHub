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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  DealCodesInput,
  emptyDealCodesValue,
  resolveDealCodes,
  type DealCodesValue,
} from "@/components/DealCodesInput";
import { toast } from "@/hooks/use-toast";
import { createDealAsAdmin } from "@/actions/brandActions";
import { isValidDateRange } from "@/lib/validators";
import { fromDateInputValue, toNullableNumber } from "@/lib/adminEditForm";
import type { Brand, Deal } from "@/types";

const createDealSchema = z
  .object({
    brandId: z.string().min(1, "Select a brand"),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    discountPercentage: z
      .string()
      .min(1, "Discount percentage is required")
      .refine(
        (v) => !Number.isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 100,
        "Enter a percentage between 0 and 100",
      ),
    minimumPurchase: z
      .string()
      .optional()
      .refine(
        (v) => !v || (!Number.isNaN(Number(v)) && Number(v) >= 0),
        "Enter a valid amount",
      ),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
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

type CreateDealFormData = z.infer<typeof createDealSchema>;

const defaultValues: CreateDealFormData = {
  brandId: "",
  title: "",
  description: "",
  discountPercentage: "",
  minimumPurchase: "",
  startDate: "",
  endDate: "",
};

/**
 * Admin creation of a deal on behalf of any brand.
 *
 * Unlike the brand-side CreateDealForm this has a brand picker and no code-mode
 * switch: the admin endpoint issues one-code-per-user inventory deals, with
 * capacity derived from the code count. Created deals go live immediately —
 * the admin is the approver, so there is nothing to queue for review.
 */
const AdminCreateDealDialog: React.FC<{
  brands: Brand[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDealCreated: (deal: Deal) => void;
}> = ({ brands, open, onOpenChange, onDealCreated }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [codesValue, setCodesValue] = useState<DealCodesValue>(emptyDealCodesValue);
  const [codesError, setCodesError] = useState<string | null>(null);

  const form = useForm<CreateDealFormData>({
    resolver: zodResolver(createDealSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) return;
    form.reset(defaultValues);
    setCodesValue(emptyDealCodesValue);
    setCodesError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Only approved brands can meaningfully run a deal, and a rejected brand's
  // deal would never surface in the app.
  const selectableBrands = brands.filter(
    (brand) => (brand.status ?? "").toLowerCase() === "approved",
  );

  const onSubmit = async (data: CreateDealFormData) => {
    const resolved = resolveDealCodes(codesValue);
    if ("error" in resolved) {
      setCodesError(resolved.error);
      return;
    }
    setCodesError(null);

    setIsSaving(true);
    try {
      const deal = await createDealAsAdmin(data.brandId, {
        ...resolved,
        title: data.title,
        description: data.description || undefined,
        discountPercentage: toNullableNumber(data.discountPercentage),
        minimumPurchase: toNullableNumber(data.minimumPurchase ?? ""),
        startDate: fromDateInputValue(data.startDate),
        endDate: fromDateInputValue(data.endDate),
      });

      toast({
        title: "Deal created",
        description: `"${deal.title}" is live.`,
      });
      onDealCreated(deal);
      onOpenChange(false);
    } catch (error) {
      // Backend 400s carry the authoritative code-validation message — show it
      // next to the codes input as well as in the toast.
      const message =
        error instanceof Error ? error.message : "Failed to create deal.";
      setCodesError(message);
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Deal</DialogTitle>
          <DialogDescription>
            Create a deal on behalf of a brand. It goes live immediately — no
            approval step.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="brandId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a brand" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectableBrands.map((brand) => {
                        const brandId = (brand._id ?? brand.id) as string;
                        return (
                          <SelectItem key={brandId} value={brandId}>
                            {brand.brandName ?? brand.companyName ?? brandId}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {selectableBrands.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      No approved brands yet — approve a brand before creating a
                      deal for it.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deal Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter deal title" {...field} />
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
                    <FormLabel>Discount Percentage (%)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" placeholder="20" {...field} />
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

            <div className="space-y-2">
              <FormLabel>Promo Codes</FormLabel>
              <DealCodesInput
                idPrefix="admin-create-deal"
                value={codesValue}
                onChange={setCodesValue}
              />
              <p className="text-xs text-muted-foreground">
                Each code is redeemable once, by one user — the number of codes
                is the deal's capacity.
              </p>
              {codesError && (
                <p className="text-sm font-medium text-destructive">{codesError}</p>
              )}
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe this deal…"
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
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Deal
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminCreateDealDialog;
