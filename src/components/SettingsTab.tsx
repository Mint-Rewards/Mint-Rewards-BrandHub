import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Settings, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { toast } from "@/hooks/use-toast";
import { updateBrandSettings } from "@/actions/brandActions";

const settingsSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),
  companyName: z.string().min(1, "Company name is required"),
  contactName: z.string().optional(),
  phone: z.string().optional(),
  webLink: z.string().url("Enter a valid URL").or(z.literal("")).optional(),
  appLink: z.string().url("Enter a valid URL").or(z.literal("")).optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  themeColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Use a valid hex colour")
    .optional()
    .or(z.literal("")),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const SettingsTab: React.FC<{
  brandId: string;
  name?: string;
  companyName?: string;
  category?: string;
  contactEmail?: string;
  contactPhone?: string;
  webLink?: string;
  appLink?: string;
  description?: string;
  address?: string;
  themeColor?: string;
  brandColor?: string;
  onSettingsUpdated?: () => Promise<void>;
}> = ({
  brandId,
  name,
  companyName,
  category,
  contactEmail,
  contactPhone,
  webLink,
  appLink,
  description,
  address,
  themeColor,
  brandColor = "hsl(var(--primary))",
  onSettingsUpdated,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const defaultFormValues = {
    brandName: name ?? "",
    companyName: companyName ?? "",
    contactName: "",
    phone: contactPhone ?? "",
    webLink: webLink ?? "",
    appLink: appLink ?? "",
    description: description ?? "",
    address: address ?? "",
    themeColor: themeColor ?? "",
  };

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    form.reset({
      brandName: name ?? "",
      companyName: companyName ?? "",
      contactName: "",
      phone: contactPhone ?? "",
      webLink: webLink ?? "",
      appLink: appLink ?? "",
      description: description ?? "",
      address: address ?? "",
      themeColor: themeColor ?? "",
    });
  }, [name, companyName, contactPhone, webLink, appLink, description, address, themeColor]);

  const onSubmit = async (data: SettingsFormData) => {
    setIsSaving(true);
    try {
      await updateBrandSettings(brandId, {
        brandName: data.brandName,
        companyName: data.companyName || undefined,
        contactName: data.contactName || undefined,
        phone: data.phone || undefined,
        webLink: data.webLink || undefined,
        appLink: data.appLink || undefined,
        description: data.description || undefined,
        address: data.address || undefined,
        themeColor: data.themeColor || undefined,
      });

      toast({
        title: "Settings saved",
        description: "Your brand profile has been updated.",
      });

      if (onSettingsUpdated) await onSettingsUpdated();
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save settings.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Brand Settings</CardTitle>
          <CardDescription>Manage your brand profile and preferences</CardDescription>
        </div>
        {!isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {!isEditing ? (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Brand Name</p>
                <p className="text-base">{name ?? "—"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Company Name</p>
                <p className="text-base">{companyName ?? "—"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Category</p>
                <p className="text-base">{category ?? "—"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact Email</p>
                <p className="text-base">{contactEmail ?? "—"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact Phone</p>
                <p className="text-base">{contactPhone ?? "—"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Website</p>
                <p className="text-base">{webLink ? <a href={webLink} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline" style={{ color: brandColor }}>{webLink}</a> : "—"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">App Link</p>
                <p className="text-base">{appLink ? <a href={appLink} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline" style={{ color: brandColor }}>{appLink}</a> : "—"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p className="text-base">{address ?? "—"}</p>
              </div>
              {themeColor && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Brand Colour</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="inline-block h-5 w-5 rounded-full border border-border"
                      style={{ backgroundColor: themeColor }}
                    />
                    <p className="text-base font-mono">{themeColor}</p>
                  </div>
                </div>
              )}
            </div>
            {description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                <p className="text-base text-muted-foreground">{description}</p>
              </div>
            )}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="brandName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Brand name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Legal company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Primary contact" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="webLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://yourbrand.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="appLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>App Link</FormLabel>
                      <FormControl>
                        <Input placeholder="https://apps.apple.com/…" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="themeColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Colour</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            className="h-10 w-16 rounded-md"
                            value={field.value || "#3B82F6"}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                          <Input
                            placeholder="#3B82F6"
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
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Business address" {...field} />
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
                        placeholder="Tell us about your brand…"
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default SettingsTab;
