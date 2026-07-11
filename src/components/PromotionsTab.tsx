import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CampaignsTab from "@/components/CampaignsTab";
import DealsTab from "@/components/DealsTab";
import { Campaign, Deal } from "@/types";

interface PromotionsTabProps {
  campaigns: Campaign[];
  deals: Deal[];
  logoUrl?: string;
  brandColor?: string;
  onCampaignCreated: () => Promise<void> | void;
  onCampaignUpdated?: (campaign: Campaign) => void;
  onDealCreated: () => Promise<void> | void;
}

const PromotionsTab = ({
  campaigns,
  deals,
  logoUrl,
  brandColor,
  onCampaignCreated,
  onCampaignUpdated,
  onDealCreated,
}: PromotionsTabProps) => {
  const [subTab, setSubTab] = useState<"campaigns" | "deals">("campaigns");

  return (
    <div className="space-y-6">
      <Tabs value={subTab} onValueChange={(v) => setSubTab(v as "campaigns" | "deals")}>
        <TabsList className="grid w-full max-w-xs grid-cols-2">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
        </TabsList>
      </Tabs>
      {/* Both sub-views stay mounted so filters and open dialogs survive
          switching between Campaigns and Deals within a session. */}
      <div hidden={subTab !== "campaigns"}>
        <CampaignsTab
          campaigns={campaigns}
          logoUrl={logoUrl}
          onCampaignCreated={onCampaignCreated}
          onCampaignUpdated={onCampaignUpdated}
        />
      </div>
      <div hidden={subTab !== "deals"}>
        <DealsTab deals={deals} onDealCreated={onDealCreated} brandColor={brandColor} />
      </div>
    </div>
  );
};

export default PromotionsTab;
