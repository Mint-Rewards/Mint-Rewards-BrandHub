import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Upload,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { registerOrg } from "@/actions/brandActions";
import { brandAuth, brandSession } from "@/lib/brandAuth";
import { isValidEmail, isValidPhone, isValidUrl, minLength } from "@/lib/validators";
import { BRAND_CATEGORIES } from "@/lib/brandCategories";
import { CountryPhoneInput } from "@/components/CountryPhoneInput";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  MAX_LOGO_SIZE_BYTES,
  MIN_LOGO_PX,
  RECOMMENDED_LOGO_PX,
  validateLogoDimensions,
  validateLogoFileBasics,
} from "@/lib/logoUpload";

const DRAFT_STORAGE_KEY = "brandhub:register-draft";

const INITIAL_FORM = {
  orgName: "",
  email: "",
  password: "",
  confirmPassword: "",
  brandName: "",
  category: "",
  logo: null as File | null,
  contactName: "",
  phone: "",
  website: "",
  appLink: "",
  address: "",
  description: "",
};

type RegisterForm = typeof INITIAL_FORM;

// Fields safe to persist across a refresh: everything except the credentials
// and the binary logo. Passwords are never written to storage.
type PersistableDraft = Partial<
  Omit<RegisterForm, "password" | "confirmPassword" | "logo">
>;

const loadDraft = (): PersistableDraft | null => {
  try {
    const raw = sessionStorage.getItem(DRAFT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistableDraft) : null;
  } catch {
    return null;
  }
};

// A draft is only worth restoring (and worth keeping in storage) once the user
// has actually entered something — an all-empty object is a fresh start.
const draftHasContent = (draft: PersistableDraft): boolean =>
  Object.values(draft).some(
    (value) => typeof value === "string" && value.trim() !== "",
  );

// True once the user has entered anything worth confirming before we discard it.
const formHasInput = (data: RegisterForm): boolean =>
  Object.entries(data).some(([key, value]) =>
    key === "logo"
      ? value !== null
      : typeof value === "string" && value.trim() !== "",
  );

const BrandRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Rehydrate a saved draft synchronously so there's no empty-then-filled flash.
  // Credentials and the logo are always reset — never restored from storage.
  const draftRestoredRef = useRef(false);
  const [formData, setFormData] = useState<RegisterForm>(() => {
    const draft = loadDraft();
    if (draft && draftHasContent(draft)) draftRestoredRef.current = true;
    return { ...INITIAL_FORM, ...draft, password: "", confirmPassword: "", logo: null };
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Persist a recoverable draft (never credentials or the binary logo) so an
  // accidental refresh or interruption doesn't wipe the user's progress.
  useEffect(() => {
    const draft: PersistableDraft = {
      orgName: formData.orgName,
      email: formData.email,
      brandName: formData.brandName,
      category: formData.category,
      contactName: formData.contactName,
      phone: formData.phone,
      website: formData.website,
      appLink: formData.appLink,
      address: formData.address,
      description: formData.description,
    };
    try {
      // Only keep a draft while there's something to recover; clear it once the
      // form is empty again so a later visit reads as a fresh start.
      if (draftHasContent(draft)) {
        sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      } else {
        sessionStorage.removeItem(DRAFT_STORAGE_KEY);
      }
    } catch {
      // Storage full or unavailable (e.g. private mode) — recovery is best-effort.
    }
  }, [formData]);

  // Let the user know once when we've brought their details back.
  useEffect(() => {
    if (draftRestoredRef.current) {
      draftRestoredRef.current = false;
      toast({
        title: "Draft restored",
        description:
          "We brought back the details you'd entered. Re-enter your password to continue.",
      });
    }
    // Run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Warn before an actual page unload (refresh/close/external nav) while the
  // form holds unsaved input. In-app (SPA) navigation does not trigger this.
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isSubmitting || !formHasInput(formData)) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formData, isSubmitting]);

  const totalSteps = 3;
  const isDirty = formHasInput(formData);

  const getFieldError = (field: string, value: string): string => {
    switch (field) {
      case "orgName":
        return minLength(value, 2, "Organisation name") ?? "";
      case "email":
        return !value ? "Email is required" : (isValidEmail(value) ?? "");
      case "password":
        return value.length >= 8
          ? ""
          : "Password must be at least 8 characters";
      case "confirmPassword":
        return value === formData.password ? "" : "Passwords do not match";
      case "brandName":
        return minLength(value, 2, "Brand name") ?? "";
      case "category":
        return !value ? "Category is required" : "";
      case "contactName":
        return !value ? "Contact name is required" : "";
      case "phone":
        return !value ? "Phone number is required" : (isValidPhone(value) ?? "");
      case "address":
        return !value ? "Address is required" : "";
      case "website":
        return !value ? "Website is required" : (isValidUrl(value) ?? "");
      case "appLink":
        return value ? isValidUrl(value) ?? "" : "";
      default:
        return "";
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: getFieldError(field, value) }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
    setTouched((prev) => ({ ...prev, category: true }));
    setErrors((prev) => ({ ...prev, category: getFieldError("category", value) }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value = String(formData[field as keyof typeof formData] ?? "");
    setErrors((prev) => ({ ...prev, [field]: getFieldError(field, value) }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const basicsError = validateLogoFileBasics(file);
    if (basicsError) {
      toast({
        title: basicsError.includes("5MB") ? "File too large" : "Invalid file type",
        description: basicsError,
        variant: "destructive",
      });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const dimensionError = await validateLogoDimensions(objectUrl);
    if (dimensionError) {
      URL.revokeObjectURL(objectUrl);
      setErrors((prev) => ({ ...prev, logo: dimensionError }));
      return;
    }

    setErrors((prev) => ({ ...prev, logo: "" }));
    setLogoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return objectUrl;
    });
    setFormData((prev) => ({ ...prev, logo: file }));
  };

  const removeLogo = () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview(null);
    setFormData((prev) => ({ ...prev, logo: null }));
    setErrors((prev) => ({ ...prev, logo: "" }));
  };

  const validateStepFields = (): boolean => {
    const stepFields: Record<number, string[]> = {
      1: ["orgName", "email", "password", "confirmPassword"],
      2: ["brandName", "category", "contactName", "phone", "website", "appLink", "address"],
    };

    const fields = stepFields[currentStep] ?? [];
    const newErrors: Record<string, string> = { ...errors };
    const newTouched: Record<string, boolean> = { ...touched };
    let hasError = false;

    for (const field of fields) {
      newTouched[field] = true;
      const value = String(formData[field as keyof typeof formData] ?? "");
      const error = getFieldError(field, value);
      newErrors[field] = error;
      if (error) hasError = true;
    }

    // Logo is optional, but a selected file that failed validation blocks.
    if (currentStep === 2 && errors.logo) hasError = true;

    setErrors(newErrors);
    setTouched(newTouched);
    return !hasError;
  };

  // Move keyboard focus to the first field in an error state so keyboard and
  // screen-reader users are taken straight to what needs fixing.
  const focusFirstInvalid = () => {
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>('[aria-invalid="true"]');
      el?.focus();
    });
  };

  const nextStep = () => {
    if (validateStepFields()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    } else {
      toast({
        title: "Please fix the errors above",
        description: "Fill in all required fields correctly before proceeding",
        variant: "destructive",
      });
      focusFirstInvalid();
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStartOver = () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview(null);
    setFormData({ ...INITIAL_FORM });
    setErrors({});
    setTouched({});
    setShowPassword(false);
    setCurrentStep(1);
    try {
      sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Storage unavailable — the empty-form effect clears the draft anyway.
    }
    toast({
      title: "Form cleared",
      description: "You're starting fresh from step 1.",
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const data = await registerOrg({
        orgName: formData.orgName,
        email: formData.email,
        password: formData.password,
        brandName: formData.brandName,
        category: formData.category,
        logo: formData.logo,
        contactName: formData.contactName || undefined,
        phone: formData.phone || undefined,
        website: formData.website || undefined,
        appLink: formData.appLink || undefined,
        address: formData.address || undefined,
        description: formData.description || undefined,
      });

      if (!data.token) {
        throw new Error("No token received from server");
      }

      // Registration succeeded — the draft is no longer needed.
      try {
        sessionStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        // Ignore — storage may be unavailable.
      }

      // Same session bootstrap as login so the user lands signed in.
      brandAuth.setToken(data.token);
      const brands = data.brands ?? [];
      brandSession.setBrands(brands);
      brandSession.setSubscribedModules(data.subscribedModules ?? []);

      toast({
        title: "Organisation Created!",
        description: "Welcome to MintRewards BrandHub.",
      });

      if (data.defaultBrandId) {
        navigate(`/dashboard/${data.defaultBrandId}`);
      } else {
        navigate("/brands");
      }
    } catch (error: unknown) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isInvalid = (field: string) => Boolean(errors[field] && touched[field]);

  // Build an aria-describedby string linking the input to any persistent hint
  // plus its error message (when one is rendered).
  const describedBy = (field: string, ...extraIds: string[]) => {
    const ids = extraIds.filter(Boolean);
    if (errors[field]) ids.push(`${field}-error`);
    return ids.length ? ids.join(" ") : undefined;
  };

  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? (
      <p
        id={`${field}-error`}
        role="alert"
        className="text-xs text-destructive mt-1"
      >
        {errors[field]}
      </p>
    ) : null;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organisation Name *</Label>
              <Input
                id="orgName"
                autoComplete="organization"
                value={formData.orgName}
                onChange={(e) => handleInputChange("orgName", e.target.value)}
                onBlur={() => handleBlur("orgName")}
                placeholder="Enter your organisation name"
                aria-invalid={isInvalid("orgName")}
                aria-describedby={describedBy("orgName")}
                className={errors.orgName && touched.orgName ? "border-destructive" : ""}
              />
              <FieldError field="orgName" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="you@company.com"
                aria-invalid={isInvalid("email")}
                aria-describedby={describedBy("email")}
                className={errors.email && touched.email ? "border-destructive" : ""}
              />
              <FieldError field="email" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    onBlur={() => handleBlur("password")}
                    placeholder="At least 8 characters"
                    aria-invalid={isInvalid("password")}
                    aria-describedby={describedBy("password")}
                    className={`pr-10 ${errors.password && touched.password ? "border-destructive" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <FieldError field="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  onBlur={() => handleBlur("confirmPassword")}
                  placeholder="Re-enter your password"
                  aria-invalid={isInvalid("confirmPassword")}
                  aria-describedby={describedBy("confirmPassword")}
                  className={errors.confirmPassword && touched.confirmPassword ? "border-destructive" : ""}
                />
                <FieldError field="confirmPassword" />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            {/* Group 1 — who the brand is */}
            <div role="group" aria-labelledby="group-identity">
              <div className="space-y-1">
                <h4
                  id="group-identity"
                  className="text-base font-semibold text-foreground"
                >
                  Brand identity
                </h4>
                <p className="text-xs text-muted-foreground">
                  How your brand appears across MintRewards.
                </p>
              </div>

              <div className="mt-5 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="brandName">Brand Name *</Label>
                  <Input
                    id="brandName"
                    value={formData.brandName}
                    onChange={(e) => handleInputChange("brandName", e.target.value)}
                    onBlur={() => handleBlur("brandName")}
                    placeholder="Enter your first brand's name"
                    aria-invalid={isInvalid("brandName")}
                    aria-describedby={describedBy("brandName", "brandName-hint")}
                    className={errors.brandName && touched.brandName ? "border-destructive" : ""}
                  />
                  <FieldError field="brandName" />
                  <p id="brandName-hint" className="text-xs text-muted-foreground">
                    Your organisation's first brand. You can add more later.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger
                      id="category"
                      aria-invalid={isInvalid("category")}
                      aria-describedby={describedBy("category")}
                      className={errors.category && touched.category ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRAND_CATEGORIES.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError field="category" />
                </div>

                <div className="space-y-4">
                  <Label>
                    Brand Logo (square, {RECOMMENDED_LOGO_PX}×{RECOMMENDED_LOGO_PX}px
                    recommended, min {MIN_LOGO_PX}×{MIN_LOGO_PX}px, max 5 MB)
                  </Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    {formData.logo && logoPreview ? (
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="h-32 w-32 object-cover rounded-lg border"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formData.logo.name}
                        </p>
                        <Button variant="outline" onClick={removeLogo}>
                          Remove Logo
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                        <div>
                          <p className="text-sm font-medium">Upload your brand logo</p>
                          <p className="text-xs text-muted-foreground">
                            Square PNG, JPG, or WebP — {RECOMMENDED_LOGO_PX}×
                            {RECOMMENDED_LOGO_PX}px recommended
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="logo-upload"
                        />
                        <Button variant="outline" asChild>
                          <label htmlFor="logo-upload" className="cursor-pointer">
                            Choose File
                          </label>
                        </Button>
                      </div>
                    )}
                  </div>
                  {errors.logo && (
                    <p role="alert" className="text-xs text-destructive">{errors.logo}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Shown in your dashboard header. Optional — you can add it later
                    from Settings.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Tell us about your brand…"
                    className="resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Group 2 — where to find the brand */}
            <div role="group" aria-labelledby="group-contact">
              <div className="space-y-1">
                <h4
                  id="group-contact"
                  className="text-base font-semibold text-foreground"
                >
                  Contact &amp; links
                </h4>
                <p className="text-xs text-muted-foreground">
                  Where members can find and reach your brand.
                </p>
              </div>

              <div className="mt-5 grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Name *</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange("contactName", e.target.value)}
                    onBlur={() => handleBlur("contactName")}
                    placeholder="Primary contact person"
                    aria-invalid={isInvalid("contactName")}
                    aria-describedby={describedBy("contactName")}
                    className={errors.contactName && touched.contactName ? "border-destructive" : ""}
                  />
                  <FieldError field="contactName" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <CountryPhoneInput
                    id="phone"
                    value={formData.phone}
                    onChange={(value) => handleInputChange("phone", value)}
                    onBlur={() => handleBlur("phone")}
                    invalid={Boolean(errors.phone && touched.phone)}
                    describedById={describedBy("phone")}
                  />
                  <FieldError field="phone" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website *</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    onBlur={() => handleBlur("website")}
                    placeholder="www.yourbrand.com"
                    aria-invalid={isInvalid("website")}
                    aria-describedby={describedBy("website")}
                    className={errors.website && touched.website ? "border-destructive" : ""}
                  />
                  <FieldError field="website" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appLink">App Link</Label>
                  <Input
                    id="appLink"
                    value={formData.appLink}
                    onChange={(e) => handleInputChange("appLink", e.target.value)}
                    onBlur={() => handleBlur("appLink")}
                    placeholder="apps.apple.com/…"
                    aria-invalid={isInvalid("appLink")}
                    aria-describedby={describedBy("appLink")}
                    className={errors.appLink && touched.appLink ? "border-destructive" : ""}
                  />
                  <FieldError field="appLink" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    onBlur={() => handleBlur("address")}
                    placeholder="Business address"
                    aria-invalid={isInvalid("address")}
                    aria-describedby={describedBy("address")}
                    className={errors.address && touched.address ? "border-destructive" : ""}
                  />
                  <FieldError field="address" />
                </div>
              </div>
            </div>
          </div>
        );

      case 3: {
        const summaryRows: { label: string; value: React.ReactNode }[] = [
          { label: "Organisation", value: formData.orgName },
          { label: "Email", value: formData.email },
          { label: "Brand Name", value: formData.brandName },
          { label: "Category", value: formData.category },
          {
            label: "Logo",
            value: logoPreview ? (
              <img
                src={logoPreview}
                alt="Brand logo"
                className="h-12 w-12 rounded-lg border object-cover"
              />
            ) : (
              "None (add later)"
            ),
          },
          { label: "Contact Name", value: formData.contactName },
          { label: "Phone", value: formData.phone },
          { label: "Website", value: formData.website },
          { label: "App Link", value: formData.appLink || "None (add later)" },
          { label: "Address", value: formData.address},
          { label: "Description", value: formData.description || "None (add later)" },
        ];

        return (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" aria-hidden="true" />
              <h4 className="text-base font-semibold text-foreground">
                Registration summary
              </h4>
            </div>
            <dl className="divide-y divide-border">
              {summaryRows.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-start sm:gap-4"
                >
                  <dt className="text-sm font-medium text-foreground sm:w-40 sm:shrink-0">
                    {label}
                  </dt>
                  <dd className="min-w-0 break-words text-sm text-muted-foreground">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        );
      }

      default:
        return null;
    }
  };

  const stepTitles = ["Organisation & Account", "Brand & Logo", "Review"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => navigate("/")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold">MintRewards Brand Management</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <h1 className="text-3xl font-bold">Create Your Organisation</h1>
            <div className="flex items-center gap-3">
              {isDirty && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Start over
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Start over?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This clears everything you've entered, removes your saved
                        draft, and returns you to step 1. This can't be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep editing</AlertDialogCancel>
                      <AlertDialogAction onClick={handleStartOver}>
                        Start over
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <span className="text-sm text-muted-foreground tabular-nums">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-0">
            {stepTitles.map((title, index) => {
              const stepNum = index + 1;
              const isCompleted = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;
              return (
                <div key={index} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isCompleted
                        ? "bg-primary text-primary-foreground"
                        : isCurrent
                        ? "bg-primary text-primary-foreground ring-2 ring-offset-2 ring-primary/40"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {isCompleted ? <CheckCircle className="h-4 w-4" /> : stepNum}
                    </div>
                    <span className={`text-xs whitespace-nowrap hidden sm:block ${isCurrent ? "text-primary font-medium" : "text-muted-foreground"}`}>
                      {title}
                    </span>
                  </div>
                  {index < stepTitles.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-2 mb-5 transition-colors ${stepNum < currentStep ? "bg-primary" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{stepTitles[currentStep - 1]}</CardTitle>
            <CardDescription>
              {currentStep === 1 && "Set up your organisation's owner account"}
              {currentStep === 2 && "Name your first brand and upload its logo"}
              {currentStep === 3 && "Review and create your organisation"}
            </CardDescription>
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 || isSubmitting}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Creating…" : "Create Organisation"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandRegister;
