import React from "react";

interface SiteHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  /** Element to render the title as. Use "h1" when this is the page's primary heading. Defaults to "p". */
  titleAs?: React.ElementType;
  /** Right-side slot: buttons, badges, etc. */
  actions?: React.ReactNode;
}

const SiteHeader = ({
  icon,
  title,
  subtitle,
  titleAs: Title = "p",
  actions,
}: SiteHeaderProps) => (
  <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
    <div className="container mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div>
            <Title className="text-xl font-bold">{title}</Title>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center space-x-3">{actions}</div>
        )}
      </div>
    </div>
  </header>
);

export default SiteHeader;
