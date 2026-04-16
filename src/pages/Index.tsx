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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">MintRewards Brand Management</h1>
                <p className="text-xs text-muted-foreground">Professional Brand Management</p>
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
            Professional Brand Management Platform
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Manage Your Brand
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Like a Pro
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Complete brand management solution with registration, campaign management, 
            and admin approval workflows. Built for businesses that take their brand seriously.
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

      {/* Features Grid */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg">Everything you need to manage your brand effectively</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 bg-card/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose MintRewards Brand Management?</h2>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                Our platform combines powerful brand management tools with enterprise-grade 
                security and approval workflows.
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
      <section className="py-16 px-6 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join hundreds of brands already using MintRewards Brand Management to manage their presence.
          </p>
          <Button size="lg" variant="gradient" onClick={() => navigate('/register')}>
            Register Your Brand Today
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/30 py-8 px-6">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold">MintRewards Brand Management</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2024 MintRewards Brand Management. Professional brand management made simple.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;