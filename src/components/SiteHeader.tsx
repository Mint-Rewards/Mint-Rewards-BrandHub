import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface SiteHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  /** Element to render the title as. Use "h1" when this is the page's primary heading. Defaults to "p". */
  titleAs?: React.ElementType;
  /** Route the logo navigates to. Defaults to "/". */
  logoHref?: string;
  /** Right-side slot: buttons, badges, etc. Hidden on mobile; shown in sheet. */
  actions?: React.ReactNode;
}

const SiteHeader = ({
  icon,
  title,
  subtitle,
  titleAs: Title = "p",
  logoHref = "/",
  actions,
}: SiteHeaderProps) => (
  <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
    <div className="container mx-auto px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <Link
          to={logoHref}
          className="flex items-center space-x-3 min-w-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:opacity-80 transition-opacity"
          aria-label={`${title} — go to home`}
        >
          <div className="shrink-0">{icon}</div>
          <div className="min-w-0">
            <Title className="text-xl font-bold">{title}</Title>
            {subtitle && (
              <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
            )}
          </div>
        </Link>

        {actions && (
          <>
            {/* Desktop actions — hidden below md */}
            <div className="hidden md:flex items-center space-x-3 shrink-0">
              {actions}
            </div>

            {/* Mobile hamburger — hidden at md and above */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden shrink-0"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <SheetHeader>
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-3 pt-6 [&_button]:w-full [&_button]:justify-start">
                  {actions}
                </div>
              </SheetContent>
            </Sheet>
          </>
        )}
      </div>
    </div>
  </header>
);

export default SiteHeader;
