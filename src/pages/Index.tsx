import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, TrendingUp, Shield, ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Building2 className="h-6 w-6" />,
      title: "Brand Registration",
      description: "Complete brand profile setup with logo, colors, and contact information"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Campaign Management",
      description: "Create and manage targeted marketing campaigns with approval workflows"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Analytics & Insights", 
      description: "Track performance metrics and get detailed campaign analytics"
    },
    {
      icon: <Shield className="h-6 w-6" />,
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
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xl font-bold">MintRewards</p>
                <p className="text-xs text-muted-foreground">Brand Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => navigate('/admin/login')}>
                Admin Login
              </Button>
              <Button variant="gradient" onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            MintRewards Partner Portal
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
          <div className="flex items-center justify-center space-x-4">
            <Button size="lg" variant="gradient" onClick={() => navigate('/register')}>
              Register Your Brand
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/demo')}>
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-2">What's included</h2>
            <p className="text-muted-foreground">A complete toolkit for brand managers and sustainability teams.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary mt-0.5">
                  {feature.icon}
                </div>
                <div>
                  <p className="font-semibold mb-1">{feature.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Everything your brand team needs</h2>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                One login covers your full partner lifecycle — from first submission to
                live campaign reporting. No separate tools, no spreadsheets.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <Card className="border-0 bg-gradient-to-br from-card via-card to-muted/20 p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Brand Dashboard</h3>
                      <p className="text-sm text-muted-foreground">Manage everything in one place</p>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-gradient-to-r from-primary to-accent rounded-full w-3/4"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="h-8 bg-muted rounded"></div>
                      <div className="h-8 bg-muted rounded"></div>
                      <div className="h-8 bg-muted rounded"></div>
                    </div>
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
          <h2 className="text-3xl font-bold mb-4">Apply to become a MintRewards partner</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Submit your brand registration and our team will review your application
            within 2–3 business days.
          </p>
          <Button size="lg" variant="gradient" onClick={() => navigate('/register')}>
            Register your brand
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/30 py-8 px-6">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold">MintRewards Brand Management</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2025 MintRewards Brand Management. Professional brand management made simple.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;