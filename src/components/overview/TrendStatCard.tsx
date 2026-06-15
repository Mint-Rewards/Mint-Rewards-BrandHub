import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TrendStatCardProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  caption: string;
  cardClassName: string;
  iconClassName: string;
  labelClassName: string;
  valueClassName: string;
  captionClassName: string;
}

// Gradient card with a leading icon, a label, a large value, and a trend caption.
const TrendStatCard = ({
  icon: Icon,
  label,
  value,
  caption,
  cardClassName,
  iconClassName,
  labelClassName,
  valueClassName,
  captionClassName,
}: TrendStatCardProps) => {
  return (
    <Card className={cardClassName}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-2">
          <Icon className={cn("h-5 w-5", iconClassName)} />
          <span className={cn("text-sm font-medium", labelClassName)}>{label}</span>
        </div>
        <p className={cn("text-2xl font-bold mt-2", valueClassName)}>{value}</p>
        <p className={cn("text-xs", captionClassName)}>{caption}</p>
      </CardContent>
    </Card>
  );
};

export default TrendStatCard;
