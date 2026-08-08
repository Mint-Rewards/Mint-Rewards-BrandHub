import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { createDeal } from "@/actions/brandActions";
import {
  DealCodesInput,
  emptyDealCodesValue,
  resolveDealCodes,
  type DealCodesValue,
} from "@/components/DealCodesInput";
import { isValidDateRange, startOfDay, today } from "@/lib/validators";

type CodeMode = "inventory" | "shared";

const dealSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  discountPercentage: z
    .string()
    .min(1, "Discount percentage is required")
    .refine(
      (v) => !Number.isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 100,
      "Enter a percentage between 0 and 100",
    ),
  // discountAmount: z
  //   .string()
  //   .min(1, "Flat discount amount is required")
  //   .refine((v) => !Number.isNaN(Number(v)) && Number(v) >= 0, "Enter a valid amount"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  minimumPurchase: z
    .string()
    .min(1, "Minimum purchase is required")
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) >= 0, "Enter a valid amount"),
}).superRefine((data, ctx) => {
  const message = isValidDateRange(data.startDate, data.endDate);
  if (!message) return;
  ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["endDate"], message });
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    path: ["startDate"],
    message: "Start date must be before the end date",
  });
});

type DealFormData = z.infer<typeof dealSchema>;

interface CreateDealFormProps {
  brandId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateDealForm({
  brandId,
  onSuccess,
  onCancel,
}: CreateDealFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codesValue, setCodesValue] = useState<DealCodesValue>(emptyDealCodesValue);
  const [codesError, setCodesError] = useState<string | null>(null);
  // How the codes are rationed. Fixed at creation: switching a live deal would
  // retroactively change what the codes already handed out mean.
  const [codeMode, setCodeMode] = useState<CodeMode>("inventory");
  const [maxUses, setMaxUses] = useState("");

  const form = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: "",
      description: "",
      discountPercentage: "",
      // discountAmount: "",
      minimumPurchase: "",
    },
  });

  // Each picker bounds the other so an invalid range can't be selected at all.
  const startDay = startOfDay(form.watch("startDate"));
  const endDay = startOfDay(form.watch("endDate"));

  const onSubmit = async (data: DealFormData) => {
    const resolved = resolveDealCodes(codesValue);
    if ("error" in resolved) {
      setCodesError(resolved.error);
      return;
    }

    // A shared deal hands codes[0] to everyone, so any further code would be
    // unreachable. The server enforces this too; catching it here keeps the
    // message next to the input the brand has to change.
    const codeCount =
      "codes" in resolved ? resolved.codes.length : resolved.generateCodes.count;
    if (codeMode === "shared" && codeCount !== 1) {
      setCodesError(
        "A shared deal takes exactly one code. Choose “Unique code per user” to issue several.",
      );
      return;
    }

    let sharedMaxUses: number | null = null;
    if (codeMode === "shared" && maxUses.trim() !== "") {
      const parsed = Number(maxUses);
      if (!Number.isInteger(parsed) || parsed < 1) {
        setCodesError("Redemption limit must be a whole number of 1 or more.");
        return;
      }
      sharedMaxUses = parsed;
    }

    setCodesError(null);
    setIsSubmitting(true);
    try {
      // maxUses is sent only for a shared deal, where it is the sole bound on a
      // reusable code. An inventory deal's is derived server-side from the code
      // count after cleaning — deriving it client-side overshoots whenever a
      // duplicate is dropped (issue #44).
      await createDeal(brandId, {
        ...resolved,
        codeMode,
        ...(codeMode === "shared" && sharedMaxUses !== null
          ? { maxUses: sharedMaxUses }
          : {}),
        title: data.title,
        description: data.description || undefined,
        discountPercentage: parseInt(data.discountPercentage),
        // discountAmount: parseFloat(data.discountAmount),
        startDate: format(data.startDate, "yyyy-MM-dd"),
        endDate: format(data.endDate, "yyyy-MM-dd"),
        minimumPurchase: parseFloat(data.minimumPurchase),
      });

      toast({
        title: "Deal submitted",
        description: "Your deal is pending admin approval.",
      });

      onSuccess();
    } catch (error) {
      // Backend 400s carry the authoritative code-validation message —
      // surface it in the codes error area verbatim.
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create deal. Please try again.";
      setCodesError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

        </div>

        <div className="space-y-2">
          <FormLabel htmlFor="create-deal-code-mode">Redemption</FormLabel>
          <Select
            value={codeMode}
            onValueChange={(value) => setCodeMode(value as CodeMode)}
          >
            <SelectTrigger id="create-deal-code-mode">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inventory">Unique code per user</SelectItem>
              <SelectItem value="shared">One shared code</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {codeMode === "inventory"
              ? "Each code goes to one user, so the number of codes is the number of redemptions."
              : "Every user is given the same code, up to the limit you set below."}
          </p>
        </div>

        {codeMode === "shared" && (
          <div className="space-y-2">
            <FormLabel htmlFor="create-deal-max-uses">Redemption limit</FormLabel>
            <Input
              id="create-deal-max-uses"
              type="number"
              min={1}
              placeholder="Leave blank for unlimited"
              value={maxUses}
              onChange={(event) => setMaxUses(event.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              How many users may redeem the shared code in total.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <FormLabel>{codeMode === "shared" ? "Promo Code" : "Promo Codes"}</FormLabel>
          <DealCodesInput idPrefix="create-deal" value={codesValue} onChange={setCodesValue} />
          <p className="text-xs text-muted-foreground">
            {codeMode === "inventory"
              ? "Each code is redeemable once, by one user."
              : "A shared deal takes exactly one code — every user is handed this one."}
          </p>
          {codesError && <p className="text-sm font-medium text-destructive">{codesError}</p>}
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your deal..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="discountPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Percentage (%) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="20"
                    min="0"
                    max="100"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="discountAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Flat Discount Amount (PKR) *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="10.00" {...field} />
                </FormControl>
                <FormDescription>
                  A fixed rupee amount off, applied alongside the percentage discount above.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => !!endDay && date >= endDay}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      // A deal may be backdated to start in the past, but it
                      // must not be created already expired — so the end date
                      // is bounded by today as well as by the start date.
                      disabled={(date) =>
                        date < today() || (!!startDay && date <= startDay)
                      }
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="minimumPurchase"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Purchase (PKR) *</FormLabel>
              <FormControl>
                <Input type="number" placeholder="50.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Create Deal
          </Button>
        </div>
      </form>
    </Form>
  );
}
