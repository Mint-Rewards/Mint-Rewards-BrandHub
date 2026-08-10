import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
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
import { toast } from "@/hooks/use-toast";
import { updateBrandAsAdmin, type AdminBrandUpdate } from "@/actions/brandActions";
import { CountryPhoneInput } from "@/components/CountryPhoneInput";
import {
  RECOMMENDED_LOGO_PX,
  MIN_LOGO_PX,
  validateLogoDimensions,
  validateLogoFileBasics,
} from "@/lib/logoUpload";
import { BRAND_CATEGORIES } from "@/lib/brandCategories";
import {
  adminBrandProfileSchema,
  type AdminBrandProfileFormData,
} from "@/lib/brandProfileSchema";
import { resolveBrandEmail, isPlaceholderBrandEmail } from "@/lib/brandEmail";
import { pickDirtyValues } from "@/lib/adminEditForm";
import type { Brand } from "@/types";

const toFormValues = (brand: Brand): AdminBrandProfileFormData => ({
  brandName: brand.brandName ?? "",
  companyName: brand.companyName ?? "",
  category: brand.category ?? "",
  contactName: brand.contactName ?? "",
  // Org-signup brands carry a `brand-<id>@brandhub.local` placeholder with the
  // real address in contactName, so show the resolved one. Only dirty fields
  // are submitted, so an untouched placeholder is never written back.
  email: resolveBrandEmail(brand) ?? "",
  phone: brand.phone ?? "",
  webLink: brand.webLink ?? brand.website ?? "",
  appLink: brand.appLink ?? "",
  description: brand.description ?? "",
  address: brand.address ?? "",
  domain: brand.domain ?? "",
  themeColor: brand.themeColor ?? "",
});

/**
 * Admin overwrite of any brand's profile and contact details. Available for
 * brands in every status — unlike approve/reject, which is pending-only.
 * Identity fields (registration number, status) are shown read-only; the
 * backend ignores them anyway.
 */
const AdminEditBrandDialog: React.FC<{
  brand: Brand | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBrandUpdated: (brand: Brand) => void;
}> = ({ brand, open, onOpenChange, onBrandUpdated }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);

  const form = useForm<AdminBrandProfileFormData>({
    resolver: zodResolver(adminBrandProfileSchema),
    defaultValues: brand
      ? toFormValues(brand)
      : toFormValues({} as Brand),
  });

  const brandId = brand?.id ?? brand?._id;

  const resetLogo = () => {
    setLogoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setLogoFile(null);
    setLogoError(null);
  };

  useEffect(() => {
    if (!brand) return;
    form.reset(toFormValues(brand));
    resetLogo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand, open]);

  const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const basicsError = validateLogoFileBasics(file);
    if (basicsError) {
      setLogoError(basicsError);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const dimensionError = await validateLogoDimensions(objectUrl);
    if (dimensionError) {
      URL.revokeObjectURL(objectUrl);
      setLogoError(dimensionError);
      return;
    }

    setLogoError(null);
    setLogoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return objectUrl;
    });
    setLogoFile(file);
  };

  const onSubmit = async (data: AdminBrandProfileFormData) => {
    if (!brandId) return;

    // Only send what the admin actually touched, so an untouched field can
    // never overwrite the stored value (notably the placeholder email).
    const payload: AdminBrandUpdate = pickDirtyValues(
      data,
      form.formState.dirtyFields,
    );
    if (logoFile) payload.logo = logoFile;

    if (Object.keys(payload).length === 0) {
      toast({ title: "No changes", description: "Nothing to save." });
      return;
    }

    setIsSaving(true);
    try {
      const updated = await updateBrandAsAdmin(brandId, payload);
      toast({
        title: "Brand updated",
        description: `${updated.brandName ?? "Brand"} details have been saved.`,
      });
      onBrandUpdated(updated);
      resetLogo();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update brand.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      resetLogo();
      if (brand) form.reset(toFormValues(brand));
    }
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Brand Details</DialogTitle>
          <DialogDescription>
            Overwrite this brand's profile and contact information. Approval
            status is managed separately.
          </DialogDescription>
        </DialogHeader>

        {brand && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-md border bg-muted/40 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Registration Number
                </p>
                <p className="text-base">{brand.registrationNumber ?? "—"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="text-base">{brand.status ?? "—"}</p>
              </div>
            </div>

            {isPlaceholderBrandEmail(brand.email) && (
              <p className="rounded-md border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                This brand signed up through an organisation, so its stored
                login email is a placeholder. The address shown below is the
                org contact's — saving it will replace the placeholder.
              </p>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <FormLabel>
                    Brand Logo (square, {RECOMMENDED_LOGO_PX}×{RECOMMENDED_LOGO_PX}px
                    recommended, min {MIN_LOGO_PX}×{MIN_LOGO_PX}px, max 5 MB)
                  </FormLabel>
                  <div className="flex items-center gap-4">
                    {logoPreview || brand.logo ? (
                      <img
                        src={logoPreview ?? brand.logo}
                        alt="Logo preview"
                        className="h-16 w-16 rounded-lg object-cover border"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg border bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        No logo
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleLogoChange}
                      className="hidden"
                      id="admin-brand-logo-upload"
                    />
                    <Button variant="outline" type="button" asChild>
                      <label
                        htmlFor="admin-brand-logo-upload"
                        className="cursor-pointer"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Change Logo
                      </label>
                    </Button>
                  </div>
                  {logoError && (
                    <p className="text-sm font-medium text-destructive">
                      {logoError}
                    </p>
                  )}
                </div>

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
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BRAND_CATEGORIES.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="contact@company.com"
                            {...field}
                          />
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
                          <CountryPhoneInput
                            id="admin-brand-phone"
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            invalid={Boolean(form.formState.errors.phone)}
                          />
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
                          <Input placeholder="www.yourbrand.com" {...field} />
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
                    name="domain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Domain</FormLabel>
                        <FormControl>
                          <Input placeholder="yourbrand.com" {...field} />
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
                          placeholder="About this brand…"
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdminEditBrandDialog;
