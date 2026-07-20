import { useState } from "react";
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
import { CountryPhoneInput } from "@/components/CountryPhoneInput";
import { Textarea } from "@/components/ui/textarea";

const MAX_LOGO_SIZE_BYTES = 5 * 1024 * 1024;
const MIN_LOGO_PX = 128;
const RECOMMENDED_LOGO_PX = 512;

const BrandRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    orgName: "",
    email: "",
    password: "",
    confirmPassword: "",
    brandName: "",
    logo: null as File | null,
    phone: "",
    website: "",
    appLink: "",
    address: "",
    description: "",
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const totalSteps = 3;

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
      case "phone":
        return !value ? "Phone number is required" : (isValidPhone(value) ?? "");
      case "website":
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

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value = String(formData[field as keyof typeof formData] ?? "");
    setErrors((prev) => ({ ...prev, [field]: getFieldError(field, value) }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_LOGO_SIZE_BYTES) {
      toast({
        title: "File too large",
        description: "Logo must be under 5MB",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PNG, JPG, or WebP image",
        variant: "destructive",
      });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (img.width !== img.height) {
        URL.revokeObjectURL(objectUrl);
        setErrors((prev) => ({
          ...prev,
          logo: `Logo must be square — this one is ${img.width}×${img.height}px. ${RECOMMENDED_LOGO_PX}×${RECOMMENDED_LOGO_PX}px recommended.`,
        }));
        return;
      }
      if (img.width < MIN_LOGO_PX) {
        URL.revokeObjectURL(objectUrl);
        setErrors((prev) => ({
          ...prev,
          logo: `Logo must be at least ${MIN_LOGO_PX}×${MIN_LOGO_PX}px (${RECOMMENDED_LOGO_PX}×${RECOMMENDED_LOGO_PX}px recommended)`,
        }));
        return;
      }
      setErrors((prev) => ({ ...prev, logo: "" }));
      setLogoPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return objectUrl;
      });
      setFormData((prev) => ({ ...prev, logo: file }));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setErrors((prev) => ({
        ...prev,
        logo: "Could not read this image — please try another file",
      }));
    };
    img.src = objectUrl;
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
      2: ["brandName", "phone", "website", "appLink"],
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

  const nextStep = () => {
    if (validateStepFields()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    } else {
      toast({
        title: "Please fix the errors above",
        description: "Fill in all required fields correctly before proceeding",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const data = await registerOrg({
        orgName: formData.orgName,
        email: formData.email,
        password: formData.password,
        brandName: formData.brandName,
        logo: formData.logo,
        phone: formData.phone || undefined,
        website: formData.website || undefined,
        appLink: formData.appLink || undefined,
        address: formData.address || undefined,
        description: formData.description || undefined,
      });

      if (!data.token) {
        throw new Error("No token received from server");
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

  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? (
      <p className="text-xs text-destructive mt-1">{errors[field]}</p>
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
                value={formData.orgName}
                onChange={(e) => handleInputChange("orgName", e.target.value)}
                onBlur={() => handleBlur("orgName")}
                placeholder="Enter your organisation name"
                className={errors.orgName && touched.orgName ? "border-destructive" : ""}
              />
              <FieldError field="orgName" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="you@company.com"
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
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    onBlur={() => handleBlur("password")}
                    placeholder="At least 8 characters"
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
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  onBlur={() => handleBlur("confirmPassword")}
                  placeholder="Re-enter your password"
                  className={errors.confirmPassword && touched.confirmPassword ? "border-destructive" : ""}
                />
                <FieldError field="confirmPassword" />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="brandName">Brand Name *</Label>
              <Input
                id="brandName"
                value={formData.brandName}
                onChange={(e) => handleInputChange("brandName", e.target.value)}
                onBlur={() => handleBlur("brandName")}
                placeholder="Enter your first brand's name"
                className={errors.brandName && touched.brandName ? "border-destructive" : ""}
              />
              <FieldError field="brandName" />
              <p className="text-xs text-muted-foreground">
                Your organisation's first brand. You can add more later.
              </p>
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
                <p className="text-xs text-destructive">{errors.logo}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Shown in your dashboard header. Optional — you can add it later
                from Settings.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <CountryPhoneInput
                  id="phone"
                  value={formData.phone}
                  onChange={(value) => handleInputChange("phone", value)}
                  onBlur={() => handleBlur("phone")}
                  invalid={Boolean(errors.phone && touched.phone)}
                />
                <FieldError field="phone" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  onBlur={() => handleBlur("website")}
                  placeholder="https://yourbrand.com"
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
                  placeholder="https://apps.apple.com/…"
                  className={errors.appLink && touched.appLink ? "border-destructive" : ""}
                />
                <FieldError field="appLink" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Business address"
                />
              </div>
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
        );

      case 3:
        return (
          <div className="space-y-6">
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  Registration Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Organisation</p>
                    <p className="text-muted-foreground">{formData.orgName}</p>
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">{formData.email}</p>
                  </div>
                  <div>
                    <p className="font-medium">Brand Name</p>
                    <p className="text-muted-foreground">{formData.brandName}</p>
                  </div>
                  <div>
                    <p className="font-medium">Logo</p>
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo"
                        className="h-12 w-12 object-cover rounded-lg border mt-1"
                      />
                    ) : (
                      <p className="text-muted-foreground">None (add later)</p>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">{formData.phone}</p>
                  </div>
                  <div>
                    <p className="font-medium">Website</p>
                    <p className="text-muted-foreground">{formData.website || "None (add later)"}</p>
                  </div>
                  <div>
                    <p className="font-medium">App Link</p>
                    <p className="text-muted-foreground">{formData.appLink || "None (add later)"}</p>
                  </div>
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">{formData.address || "None (add later)"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-medium">Description</p>
                    <p className="text-muted-foreground">{formData.description || "None (add later)"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const stepTitles = ["Organisation & Account", "Brand & Logo", "Review"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Create Your Organisation</h1>
            <span className="text-sm text-muted-foreground tabular-nums">
              Step {currentStep} of {totalSteps}
            </span>
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
        <Card className="border-0 bg-card/60 backdrop-blur-sm shadow-lg">
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
            <Button onClick={nextStep} variant="gradient">
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} variant="gradient" disabled={isSubmitting}>
              {isSubmitting ? "Creating…" : "Create Organisation"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandRegister;
