import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { createCampaign } from "@/actions/brandActions";

const hexColorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const campaignSchema = z.object({
  badge: z.string().optional(),
  name: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  description: z
    .string()
    .min(10, "Description is required")
    .max(400, "Keep the description under 400 characters"),
  budget: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  targetAudience: z.string().optional(),
  campaignType: z.string().min(1, "Campaign type is required"),
  backgroundColor: z
    .string()
    .regex(hexColorRegex, "Use a valid hex color (e.g. #0EA5E9)"),
});

const getContrastingTextColor = (hexColor: string) => {
  const sanitized = hexColor.replace("#", "");
  if (sanitized.length !== 6) {
    return "#FFFFFF";
  }

  const r = parseInt(sanitized.substring(0, 2), 16);
  const g = parseInt(sanitized.substring(2, 4), 16);
  const b = parseInt(sanitized.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.6 ? "#0F172A" : "#FFFFFF";
};

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CreateCampaignFormProps {
  brandId: string;
  onSuccess: () => void;
  onCancel: () => void;
  logoUrl?: string;
}

export function CreateCampaignForm({
  brandId,
  onSuccess,
  onCancel,
  logoUrl,
}: CreateCampaignFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      badge: "",
      name: "",
      subtitle: "",
      description: "",
      budget: "",
      targetAudience: "",
      campaignType: "general",
      backgroundColor: "#0F172A",
    },
  });

  const badgePreview = form.watch("badge")?.trim() || "";
  const namePreview = form.watch("name")?.trim() || "";
  const subtitlePreview = form.watch("subtitle")?.trim() || "";
  const showPreviewContent =
    badgePreview.length > 0 ||
    namePreview.length > 0 ||
    subtitlePreview.length > 0;
  const backgroundPreview = form.watch("backgroundColor") || "#0F172A";
  const logoPreview = logoUrl?.trim() || "";
  const previewTextColor = getContrastingTextColor(backgroundPreview);

  const onSubmit = async (data: CampaignFormData) => {
    setIsSubmitting(true);
    try {
      await createCampaign(brandId, {
        name: data.name,
        startDate: data.startDate ? format(data.startDate, "yyyy-MM-dd") : null,
        endDate: data.endDate ? format(data.endDate, "yyyy-MM-dd") : null,
        description: data.description,
        campaignType: data.campaignType,
        targetAudience: data.targetAudience || undefined,
        budget: data.budget ? parseFloat(data.budget) : null,
        backgroundColor: data.backgroundColor,
        badge: data.badge || undefined,
        subtitle: data.subtitle || undefined,
      });

      toast({
        title: "Campaign submitted",
        description: "Your campaign is pending admin approval.",
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <section className="space-y-4 rounded-2xl border bg-card/60 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Campaign banner preview</p>
              <p className="text-xs text-muted-foreground">
                Updates in real-time as you edit the visual fields below.
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              Preview only
            </Badge>
          </div>

          <div
            className="rounded-2xl border shadow-sm p-6 transition-colors"
            style={{
              backgroundColor: backgroundPreview,
              color: previewTextColor,
            }}
          >
            <div className="flex flex-col gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
              {showPreviewContent ? (
                <div className="flex flex-col items-center gap-4 md:flex-row md:items-center">
                  <div className="space-y-2">
                    {badgePreview && (
                      <Badge
                        className="bg-white/20 text-xs font-semibold uppercase tracking-wide border-white/30"
                        style={{ color: previewTextColor }}
                      >
                        {badgePreview}
                      </Badge>
                    )}
                    {namePreview && (
                      <h2
                        className="text-2xl font-semibold"
                        style={{ color: previewTextColor }}
                      >
                        {namePreview}
                      </h2>
                    )}
                    {subtitlePreview && (
                      <p
                        className="text-sm opacity-90"
                        style={{ color: previewTextColor }}
                      >
                        {subtitlePreview}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p
                  className="text-sm text-white/70"
                  style={{ color: previewTextColor }}
                >
                  Start adding a badge, title, or subtitle to preview the
                  banner.
                </p>
              )}
              <div className="flex items-center justify-center">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Brand logo"
                    className="h-16 w-16 rounded-full border border-white/40 bg-white/10 object-cover"
                  />
                ) : (
                  <div
                    className="h-16 w-16 rounded-full border border-white/40 bg-white/10 flex items-center justify-center text-xs font-semibold"
                    style={{ color: previewTextColor }}
                  >
                    Logo
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campaign Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter campaign title" {...field} />
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select campaign type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="productLaunch">
                      Product Launch
                    </SelectItem>
                    <SelectItem value="brandAwareness">
                      Brand Awareness
                    </SelectItem>
                    <SelectItem value="seasonal">Seasonal</SelectItem>
                    <SelectItem value="influencer">
                      Influencer Marketing
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="badge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Badge Label</FormLabel>
                <FormControl>
                  <Input placeholder="Limited Time" {...field} />
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
                  <Input placeholder="Share a quick summary" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="backgroundColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banner Background Color</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    className="h-10 w-16 rounded-md"
                    value={field.value}
                    onChange={(event) => field.onChange(event.target.value)}
                  />
                  <Input
                    placeholder="#0F172A"
                    value={field.value}
                    onChange={(event) => field.onChange(event.target.value)}
                    ref={field.ref}
                    name={field.name}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your campaign..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget ($)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
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
            name="endDate"
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

        <FormField
          control={form.control}
          name="targetAudience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Audience</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your target audience..."
                  {...field}
                />
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
            Create Campaign
          </Button>
        </div>
      </form>
    </Form>
  );
}
