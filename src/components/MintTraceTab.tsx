import { Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "./ui/card";

const MintTraceTab: React.FC<{ brandColor?: string }> = ({ brandColor = "#008081" }) => (
  <Card>
    <CardContent className="p-12 text-center space-y-4">
      <div
        className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto"
        style={{ backgroundColor: brandColor + "1a" }}
      >
        <Link2 className="h-7 w-7" style={{ color: brandColor }} aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-xl font-semibold text-foreground">MintTrace</h2>
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
            Coming soon
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Blockchain-backed traceability for collected materials. Follow every batch from
          collection point to recycling facility with a tamper-proof chain of custody, and give
          your customers verifiable proof of where their waste ends up.
        </p>
      </div>
    </CardContent>
  </Card>
);

export default MintTraceTab;
