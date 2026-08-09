import type { Campaign, Deal } from "@/types";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { ENDING_SOON_DAYS, endsWithinDays, lifecycleOf } from "@/lib/metrics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// A deal this far through its allowance is close enough to running dry that the
// brand should know before customers hit an exhausted code.
const NEARLY_EXHAUSTED = 0.9;

interface AttentionItem {
  id: string;
  label: string;
  count: number;
  tab: string;
}

const OverviewAttention: React.FC<{
  campaigns?: Campaign[];
  deals?: Deal[];
  campaignsUnavailable?: boolean;
  dealsUnavailable?: boolean;
  onNavigate?: (tab: string) => void;
}> = ({
  campaigns,
  deals,
  campaignsUnavailable = false,
  dealsUnavailable = false,
  onNavigate,
}) => {
  const campaignsReady = Boolean(campaigns) && !campaignsUnavailable;
  const dealsReady = Boolean(deals) && !dealsUnavailable;

  // Nothing can be asserted about lists that failed to load — say so instead of
  // implying a clean slate.
  if (!campaignsReady && !dealsReady) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Needs your attention</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Campaign and deal lists didn't load, so we can't check what needs
            attention right now.
          </p>
        </CardContent>
      </Card>
    );
  }

  const campaignList = campaignsReady ? campaigns! : [];
  const dealList = dealsReady ? deals! : [];

  const awaitingCampaigns = campaignList.filter(
    (c) => lifecycleOf(c) === "awaiting",
  ).length;
  const awaitingDeals = dealList.filter((d) => lifecycleOf(d) === "awaiting").length;

  const endingSoon = [...campaignList, ...dealList].filter(
    (record) =>
      lifecycleOf(record) === "live" && endsWithinDays(record, ENDING_SOON_DAYS),
  ).length;

  // Only live deals qualify: a deal that has ended or been deactivated with its
  // codes used up is a historical fact, not something the brand can act on.
  const nearlyExhausted = dealList.filter((deal) => {
    if (lifecycleOf(deal) !== "live") return false;
    if (deal.maxUses == null || deal.maxUses <= 0) return false;
    return (deal.currentUses ?? 0) / deal.maxUses >= NEARLY_EXHAUSTED;
  }).length;

  const items: AttentionItem[] = [
    {
      id: "awaiting-campaigns",
      label: `${awaitingCampaigns === 1 ? "Campaign" : "Campaigns"} awaiting approval`,
      count: awaitingCampaigns,
      tab: "promotions",
    },
    {
      id: "awaiting-deals",
      label: `${awaitingDeals === 1 ? "Deal" : "Deals"} awaiting approval`,
      count: awaitingDeals,
      tab: "promotions",
    },
    {
      id: "ending-soon",
      label: `Ending within ${ENDING_SOON_DAYS} days`,
      count: endingSoon,
      tab: "promotions",
    },
    {
      id: "nearly-exhausted",
      label: `${nearlyExhausted === 1 ? "Deal" : "Deals"} almost out of codes`,
      count: nearlyExhausted,
      tab: "promotions",
    },
  ].filter((item) => item.count > 0);

  const partial = !campaignsReady || !dealsReady;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Needs your attention</CardTitle>
        <CardDescription>
          {items.length > 0
            ? "Items waiting on a decision or about to close."
            : "Checked against your campaigns and deals."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex items-center gap-2.5">
            <CheckCircle2
              className="h-4 w-4 shrink-0 text-success"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              Nothing needs your attention right now.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border -my-2">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onNavigate?.(item.tab)}
                  disabled={!onNavigate}
                  className="flex w-full min-h-[44px] items-center justify-between gap-3 py-2.5 text-left rounded-sm transition-colors duration-150 motion-reduce:transition-none hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none"
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <span className="text-base font-semibold tabular-nums shrink-0">
                      {item.count.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground truncate">
                      {item.label}
                    </span>
                  </span>
                  {onNavigate && (
                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

        {partial && (
          <p className="mt-3 text-xs text-muted-foreground">
            {campaignsReady ? "Deals" : "Campaigns"} didn't load, so this check
            covers only part of your activity.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default OverviewAttention;
