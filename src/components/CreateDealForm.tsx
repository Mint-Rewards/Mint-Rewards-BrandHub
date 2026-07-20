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

  const onSubmit = async (data: DealFormData) => {
    const resolved = resolveDealCodes(codesValue);
    if ("error" in resolved) {
      setCodesError(resolved.error);
      return;
    }
    setCodesError(null);
    setIsSubmitting(true);
    try {
      // Maximum uses always equals the number of codes on the deal — one
      // redemption per unique code — so it's derived here, not user-entered.
      const maxUses = "codes" in resolved ? resolved.codes.length : resolved.generateCodes.count;
      await createDeal(brandId, {
        ...resolved,
        title: data.title,
        description: data.description || undefined,
        discountPercentage: parseInt(data.discountPercentage),
        // discountAmount: parseFloat(data.discountAmount),
        startDate: format(data.startDate, "yyyy-MM-dd"),
        endDate: format(data.endDate, "yyyy-MM-dd"),
        maxUses,
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
          <FormLabel>Promo Codes</FormLabel>
          <DealCodesInput idPrefix="create-deal" value={codesValue} onChange={setCodesValue} />
          <p className="text-xs text-muted-foreground">
            Each code is redeemable once, by one user.
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
                      disabled={(date) => date < new Date()}
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
                      disabled={(date) => date < new Date()}
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
