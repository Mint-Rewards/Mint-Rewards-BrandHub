import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, TrendingUp, Shield, ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Building2 className="h-4 w-4" />,
      title: "Brand Registration",
      description: "Complete brand profile setup with logo, colors, and contact information"
    },
    {
      icon: <Users className="h-4 w-4" />,
      title: "Campaign Management",
      description: "Create and manage targeted marketing campaigns with approval workflows"
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      title: "Analytics & Insights",
      description: "Track performance metrics and get detailed campaign analytics"
    },
    {
      icon: <Shield className="h-4 w-4" />,
      title: "Admin Approval",
      description: "Secure approval process ensuring quality and compliance"
    }
  ];

  const benefits = [
    "Professional brand management dashboard",
    "Multi-step registration with validation", 
    "Secure admin approval workflows",
    "Real-time campaign tracking",
    "Geographic targeting capabilities",
    "Comprehensive analytics reporting"
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader
        icon={<Building2 className="h-6 w-6 text-primary-foreground" aria-hidden="true" />}
        title="MintRewards"
        subtitle="BrandHub"
        actions={
          <>
            <Button variant="ghost" onClick={() => navigate('/admin/login')}>
              Admin Login
            </Button>
            <Button variant="gradient" onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </>
        }
      />

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            MintRewards BrandHub
          </Badge>
          <h1 className="text-5xl font-bold mb-6 text-foreground" style={{ textWrap: "balance" }}>
            Your brand on{" "}
            <span className="text-primary">MintRewards</span>, set up in minutes.
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Register your brand, submit campaigns for approval, create member deals, and
            monitor performance — all from one dashboard. Once our team approves your
            application, you're live.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Button size="lg" variant="gradient" onClick={() => navigate('/register')}>
              Register Your Brand
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
            <p className="text-sm text-muted-foreground">
              Already a partner?{" "}
              <span className="font-medium text-foreground">Check your approval email for your dashboard link.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-2" style={{ textWrap: "balance" }}>What's included</h2>
            <p className="text-muted-foreground">A complete toolkit for brand managers and sustainability teams.</p>
          </div>
          <dl className="grid md:grid-cols-2 gap-x-12 gap-y-6">
            {features.map((feature, index) => (
              <div key={index}>
                <dt className="font-semibold text-foreground mb-1.5 flex items-center gap-2">
                  <span className="text-primary shrink-0" aria-hidden="true">{feature.icon}</span>
                  {feature.title}
                </dt>
                <dd className="text-sm text-muted-foreground leading-relaxed pl-6">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ textWrap: "balance" }}>Everything your brand team needs</h2>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed" style={{ textWrap: "pretty" }}>
                One login covers your full partner lifecycle — from first submission to
                live campaign reporting. No separate tools, no spreadsheets.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" aria-hidden="true" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <Card className="border bg-card overflow-hidden" role="img" aria-label="Example brand dashboard: 4 active campaigns, 12 deals, 2.4k members reached">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Brand Dashboard</p>
                    <p className="text-xs text-muted-foreground">Live campaign overview</p>
                  </div>
                  <Badge className="bg-success/10 text-success border-success/20 text-xs font-medium">Active</Badge>
                </div>
                <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Campaigns</p>
                    <p className="text-xl font-bold text-foreground">4</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Active Deals</p>
                    <p className="text-xl font-bold text-foreground">12</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Members Reached</p>
                    <p className="text-xl font-bold text-success">2.4k</p>
                  </div>
                </div>
                <div className="divide-y divide-border">
                  <div className="px-5 py-3 flex items-center justify-between">
                    <span className="text-sm text-foreground">Summer Campaign</span>
                    <Badge className="bg-success/10 text-success border-success/20 text-xs">Live</Badge>
                  </div>
                  <div className="px-5 py-3 flex items-center justify-between">
                    <span className="text-sm text-foreground">Student Discount</span>
                    <Badge variant="secondary" className="text-xs">Deal</Badge>
                  </div>
                  <div className="px-5 py-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Spring Promo</span>
                    <Badge variant="outline" className="text-xs">Review</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4" style={{ textWrap: "balance" }}>Apply to become a MintRewards partner</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Submit your brand registration and our team will review your application
            within 2–3 business days.
          </p>
          <Button size="lg" variant="gradient" onClick={() => navigate('/register')}>
            Register Your Brand
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/30 py-8 px-6">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
            </div>
            <span className="font-semibold">MintRewards Brand Management</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} MintRewards Brand Management.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;