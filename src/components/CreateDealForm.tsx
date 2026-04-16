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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const dealSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  discount_percentage: z.string().optional(),
  discount_amount: z.string().optional(),
  promo_code: z.string().optional(),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  max_uses: z.string().optional(),
  minimum_purchase: z.string().optional(),
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

  const form = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: "",
      description: "",
      discount_percentage: "",
      discount_amount: "",
      promo_code: "",
      max_uses: "",
      minimum_purchase: "",
    },
  });

  const onSubmit = async (data: DealFormData) => {
    setIsSubmitting(true);
    try {
      const dealData = {
        brand_id: brandId,
        title: data.title,
        description: data.description,
        discount_percentage: data.discount_percentage
          ? parseInt(data.discount_percentage)
          : null,
        discount_amount: data.discount_amount
          ? parseFloat(data.discount_amount)
          : null,
        promo_code: data.promo_code,
        start_date: data.start_date
          ? format(data.start_date, "yyyy-MM-dd")
          : null,
        end_date: data.end_date ? format(data.end_date, "yyyy-MM-dd") : null,
        max_uses: data.max_uses ? parseInt(data.max_uses) : null,
        minimum_purchase: data.minimum_purchase
          ? parseFloat(data.minimum_purchase)
          : null,
        status: "active",
        current_uses: 0,
      };

      toast({
        title: "Success",
        description: "Deal created successfully!",
      });

      onSuccess();
    } catch (error) {
      console.error("Error creating deal:", error);
      toast({
        title: "Error",
        description: "Failed to create deal. Please try again.",
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

          <FormField
            control={form.control}
            name="promo_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Promo Code</FormLabel>
                <FormControl>
                  <Input placeholder="SAVE20" {...field} />
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
                <Textarea placeholder="Describe your deal..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="discount_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Percentage (%)</FormLabel>
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

          <FormField
            control={form.control}
            name="discount_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Amount ($)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="10.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
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
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="max_uses"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Uses</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minimum_purchase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Purchase ($)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="50.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
