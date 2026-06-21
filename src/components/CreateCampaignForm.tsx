import { useRef, useState } from "react";
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
import { CalendarIcon, ImagePlus, Loader2, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { createCampaign, updateCampaign } from "@/actions/brandActions";
import { Campaign } from "@/types";

const hexColorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const campaignSchema = z.object({
  badge: z.string().optional(),
  name: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
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
  if (sanitized.length !== 6) return "#FFFFFF";
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
  /** Pass an existing campaign to switch to edit mode */
  campaign?: Campaign;
}

function RequiredMark() {
  return <span className="text-destructive ml-0.5" aria-hidden>*</span>;
}

export function CreateCampaignForm({
  brandId,
  onSuccess,
  onCancel,
  logoUrl,
  campaign,
}: CreateCampaignFormProps) {
  const isEdit = !!campaign;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(
    campaign?.banner ?? null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      badge: campaign?.badge ?? "",
      name: campaign?.name ?? "",
      subtitle: campaign?.subtitle ?? "",
      description: campaign?.description ?? "",
      budget: campaign?.budget != null ? String(campaign.budget) : "",
      targetAudience: campaign?.targetAudience ?? "",
      campaignType: campaign?.campaignType ?? "general",
      backgroundColor: campaign?.backgroundColor ?? "#0F172A",
      startDate: campaign?.startDate ? new Date(campaign.startDate) : undefined,
      endDate: campaign?.endDate ? new Date(campaign.endDate) : undefined,
    },
  });

  const badgePreview = form.watch("badge")?.trim() || "";
  const namePreview = form.watch("name")?.trim() || "";
  const subtitlePreview = form.watch("subtitle")?.trim() || "";
  const showPreviewContent =
    badgePreview.length > 0 || namePreview.length > 0 || subtitlePreview.length > 0;
  const backgroundPreview = form.watch("backgroundColor") || "#0F172A";
  const logoPreview = logoUrl?.trim() || "";
  const previewTextColor = getContrastingTextColor(backgroundPreview);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image file.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Banner must be under 5 MB.", variant: "destructive" });
      return;
    }
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const clearBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: CampaignFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
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
        banner: bannerFile ?? undefined,
      };

      if (isEdit && campaign?.id) {
        await updateCampaign(brandId, campaign.id, payload);
        toast({ title: "Campaign updated", description: "Your changes have been saved." });
      } else {
        await createCampaign(brandId, payload);
        toast({
          title: "Campaign submitted",
          description: "Your campaign is pending admin approval.",
        });
      }

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Banner preview */}
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

          {bannerPreview ? (
            <div className="relative rounded-2xl overflow-hidden border shadow-sm">
              <img
                src={bannerPreview}
                alt="Campaign banner"
                className="w-full h-40 object-cover"
              />
              <button
                type="button"
                onClick={clearBanner}
                className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                aria-label="Remove banner"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div
              className="rounded-2xl border shadow-sm p-6 transition-colors"
              style={{ backgroundColor: backgroundPreview, color: previewTextColor }}
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
                  <p className="text-sm text-white/70" style={{ color: previewTextColor }}>
                    Start adding a badge, title, or subtitle to preview the banner.
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
          )}

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              id="campaign-banner-upload"
              onChange={handleBannerChange}
            />
            <label
              htmlFor="campaign-banner-upload"
              className="inline-flex items-center gap-2 text-sm cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
            >
              <ImagePlus className="h-4 w-4" />
              {bannerPreview ? "Replace banner image" : "Upload a custom banner image"}
              <span className="text-xs text-muted-foreground/60">(optional · max 5 MB)</span>
            </label>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campaign Title<RequiredMark /></FormLabel>
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
                <FormLabel>Campaign Type<RequiredMark /></FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select campaign type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="productLaunch">Product Launch</SelectItem>
                    <SelectItem value="brandAwareness">Brand Awareness</SelectItem>
                    <SelectItem value="seasonal">Seasonal</SelectItem>
                    <SelectItem value="influencer">Influencer Marketing</SelectItem>
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
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  <Input
                    placeholder="#0F172A"
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

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description<RequiredMark /></FormLabel>
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
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
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
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
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
                <Textarea placeholder="Describe your target audience..." {...field} />
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
            {isEdit ? "Save Changes" : "Create Campaign"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
