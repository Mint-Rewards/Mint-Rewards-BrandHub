// Deal moderation/lifecycle status presentation, shared by the Promotions
// Deals tab and the ESG Deal Inventory so a deal's badge looks the same
// wherever it is listed.
// `className` carries the border tint for the outline <Badge> in the
// Promotions Deals tab. `chipClassName` is the borderless pill variant, so a
// deal chip renders identically to a campaign chip in ESG reporting.
export const DEAL_STATUS_CONFIG = {
  pending: {
    label: "Pending",
    className: "bg-warning/10 text-warning border-warning/20",
    chipClassName: "bg-warning/10 text-warning",
  },
  active: {
    label: "Active",
    className: "bg-success/10 text-success border-success/20",
    chipClassName: "bg-success/10 text-success",
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive/10 text-destructive border-destructive/20",
    chipClassName: "bg-destructive/10 text-destructive",
  },
  inactive: {
    label: "Inactive",
    className: "bg-muted text-muted-foreground border-border",
    chipClassName: "bg-muted text-muted-foreground",
  },
  // Expiry is a lifecycle end, not a moderation failure — muted, never the
  // destructive red used for Rejected. Matches how campaigns render EXPIRED.
  expired: {
    label: "Expired",
    className: "bg-muted text-muted-foreground border-border",
    chipClassName: "bg-muted text-muted-foreground",
  },
} as const;

export type DealStatusKey = keyof typeof DEAL_STATUS_CONFIG;

// Resolve any raw status string to a config entry, defaulting to inactive.
export const dealStatusConfig = (status: string | null | undefined) =>
  DEAL_STATUS_CONFIG[(status ?? "inactive").toLowerCase() as DealStatusKey] ??
  DEAL_STATUS_CONFIG.inactive;
