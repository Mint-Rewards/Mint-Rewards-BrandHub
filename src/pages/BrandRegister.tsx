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
import { Textarea } from "@/components/ui/textarea";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { registerBrand } from "@/actions/brandActions";
import {
  isValidEmail,
  isValidUrl,
  isValidPhone,
  isValidDomain,
  isValidHex,
  minLength,
} from "@/lib/validators";

const BrandRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    brandName: "",
    category: "",
    website: "",
    appLink: "",
    address: "",
    description: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    registrationNumber: uuidv4(),
    logo: null as File | null,
    themeColor: "#3B82F6",
    domain: "",
    customEmails: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const categories = [
    "Technology",
    "Healthcare",
    "Finance",
    "Retail",
    "Food & Beverage",
    "Fashion",
    "Education",
    "Real Estate",
    "Travel",
    "Entertainment",
    "Other",
  ];

  const getFieldError = (field: string, value: string): string => {
    switch (field) {
      case "companyName":
        return minLength(value, 2, "Company name") ?? "";
      case "brandName":
        return minLength(value, 2, "Brand name") ?? "";
      case "contactName":
        return minLength(value, 2, "Contact name") ?? "";
      case "category":
        return value ? "" : "Please select a category";
      case "website":
        return !value ? "Website is required" : (isValidUrl(value) ?? "");
      case "appLink":
        return value ? (isValidUrl(value) ?? "") : "";
      case "contactEmail":
        return !value ? "Email is required" : (isValidEmail(value) ?? "");
      case "contactPhone":
        return !value ? "Phone is required" : (isValidPhone(value) ?? "");
      case "domain":
        return value ? (isValidDomain(value) ?? "") : "";
      case "themeColor":
        return isValidHex(value) ?? "";
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

    if (file.size > 5 * 1024 * 1024) {
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
        description: "Please upload a PNG or JPG image",
        variant: "destructive",
      });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      if (img.width < 100 || img.height < 100) {
        setErrors((prev) => ({
          ...prev,
          logo: "Logo must be at least 100×100 pixels",
        }));
        return;
      }
      setErrors((prev) => ({ ...prev, logo: "" }));
      setFormData((prev) => ({ ...prev, logo: file }));
    };
    img.src = objectUrl;
  };

  const validateStepFields = (): boolean => {
    const stepFields: Record<number, string[]> = {
      1: ["companyName", "brandName", "category", "website", "appLink"],
      2: ["contactName", "contactPhone", "contactEmail", "domain"],
      3: ["themeColor"],
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

    if (currentStep === 3 && !formData.logo) {
      newErrors.logo = "Logo is required";
      newTouched.logo = true;
      hasError = true;
    }

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
    try {
      const data = await registerBrand(formData);

      toast({
        title: "Registration Submitted!",
        description: "Your brand registration is pending approval.",
      });

      setFormData((prev) => ({ ...prev, registrationNumber: uuidv4() }));

      const brandId =
        typeof data.brandId === "string"
          ? data.brandId
          : typeof data.brand_id === "string"
            ? data.brand_id
            : undefined;

      setTimeout(() => {
        if (brandId) {
          navigate(`/dashboard/${brandId}`);
          return;
        }
        navigate("/");
      }, 2000);
    } catch (error: unknown) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
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
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  onBlur={() => handleBlur("companyName")}
                  placeholder="Enter your company name"
                  className={errors.companyName && touched.companyName ? "border-destructive" : ""}
                />
                <FieldError field="companyName" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brandName">Brand Name *</Label>
                <Input
                  id="brandName"
                  value={formData.brandName}
                  onChange={(e) => handleInputChange("brandName", e.target.value)}
                  onBlur={() => handleBlur("brandName")}
                  placeholder="Enter your brand name"
                  className={errors.brandName && touched.brandName ? "border-destructive" : ""}
                />
                <FieldError field="brandName" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Brand Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  handleInputChange("category", value);
                  setTouched((prev) => ({ ...prev, category: true }));
                }}
              >
                <SelectTrigger
                  className={errors.category && touched.category ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select your brand category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError field="category" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website *</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                onBlur={() => handleBlur("website")}
                placeholder="https://yourwebsite.com"
                className={errors.website && touched.website ? "border-destructive" : ""}
              />
              <FieldError field="website" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appLink">App Link (Optional)</Label>
              <Input
                id="appLink"
                type="url"
                value={formData.appLink}
                onChange={(e) => handleInputChange("appLink", e.target.value)}
                onBlur={() => handleBlur("appLink")}
                placeholder="https://apps.apple.com/... or https://play.google.com/..."
                className={errors.appLink && touched.appLink ? "border-destructive" : ""}
              />
              <FieldError field="appLink" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Business Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter your business address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Brand Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your brand (max 500 characters)"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.description.length}/500 characters
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Person Name *</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => handleInputChange("contactName", e.target.value)}
                  onBlur={() => handleBlur("contactName")}
                  placeholder="Enter contact person's name"
                  className={errors.contactName && touched.contactName ? "border-destructive" : ""}
                />
                <FieldError field="contactName" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone *</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                  onBlur={() => handleBlur("contactPhone")}
                  placeholder="+1 (555) 123-4567"
                  className={errors.contactPhone && touched.contactPhone ? "border-destructive" : ""}
                />
                <FieldError field="contactPhone" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                onBlur={() => handleBlur("contactEmail")}
                placeholder="contact@company.com"
                className={errors.contactEmail && touched.contactEmail ? "border-destructive" : ""}
              />
              <FieldError field="contactEmail" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain">Domain Name (Optional)</Label>
              <Input
                id="domain"
                value={formData.domain}
                onChange={(e) => handleInputChange("domain", e.target.value)}
                onBlur={() => handleBlur("domain")}
                placeholder="company.com"
                className={errors.domain && touched.domain ? "border-destructive" : ""}
              />
              <FieldError field="domain" />
              <p className="text-xs text-muted-foreground">
                Used for employee email identification
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Brand Logo * (PNG/JPG, min 100×100 px, max 5 MB)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                {formData.logo ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <img
                        src={URL.createObjectURL(formData.logo)}
                        alt="Logo preview"
                        className="h-32 w-32 object-cover rounded-lg border"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formData.logo.name}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, logo: null }));
                        setErrors((prev) => ({ ...prev, logo: "Logo is required" }));
                      }}
                    >
                      Remove Logo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <p className="text-sm font-medium">Upload your brand logo</p>
                      <p className="text-xs text-muted-foreground">PNG or JPG, max 5 MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/png,image/jpeg"
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
              {errors.logo && touched.logo && (
                <p className="text-xs text-destructive">{errors.logo}</p>
              )}
            </div>

            <div className="space-y-4">
              <Label>Brand Theme Color *</Label>
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  value={formData.themeColor}
                  onChange={(e) => handleInputChange("themeColor", e.target.value)}
                  className="h-12 w-12 rounded-lg border border-border cursor-pointer"
                />
                <div className="flex-1">
                  <Input
                    value={formData.themeColor}
                    onChange={(e) => handleInputChange("themeColor", e.target.value)}
                    onBlur={() => handleBlur("themeColor")}
                    placeholder="#3B82F6"
                    className={errors.themeColor && touched.themeColor ? "border-destructive" : ""}
                  />
                  <FieldError field="themeColor" />
                </div>
                <div
                  className="h-12 w-24 rounded-lg border border-border"
                  style={{ backgroundColor: formData.themeColor }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                This color will be used throughout your brand dashboard
              </p>
            </div>
          </div>
        );

      case 4:
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
                    <p className="font-medium">Brand Name</p>
                    <p className="text-muted-foreground">{formData.brandName}</p>
                  </div>
                  <div>
                    <p className="font-medium">Category</p>
                    <p className="text-muted-foreground">{formData.category}</p>
                  </div>
                  <div>
                    <p className="font-medium">Contact Email</p>
                    <p className="text-muted-foreground">{formData.contactEmail}</p>
                  </div>
                  <div>
                    <p className="font-medium">Website</p>
                    <p className="text-muted-foreground">{formData.website}</p>
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

  const stepTitles = [
    "Brand Information",
    "Contact Details",
    "Brand Assets",
    "Final Details",
  ];

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
            <h1 className="text-3xl font-bold">Brand Registration</h1>
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
              {currentStep === 1 && "Tell us about your brand and business"}
              {currentStep === 2 && "Provide your contact information"}
              {currentStep === 3 && "Upload your brand assets"}
              {currentStep === 4 && "Review and complete your registration"}
            </CardDescription>
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
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
            <Button onClick={handleSubmit} variant="gradient">
              Submit Registration
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandRegister;
