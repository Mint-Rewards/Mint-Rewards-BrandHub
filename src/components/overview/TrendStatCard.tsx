import { LucideIcon, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TrendStatCardProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  caption: string;
  cardClassName?: string;
  iconClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
  captionClassName?: string;
}

// Card with a label/icon row, a large value, and a trend badge.
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
    <Card className={cn("border-border/60", cardClassName)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className={cn("text-sm font-medium text-muted-foreground", labelClassName)}>{label}</span>
          <Icon className={cn("h-4 w-4 text-muted-foreground", iconClassName)} />
        </div>
        <p className={cn("mt-2 text-3xl font-bold tracking-tight text-foreground", valueClassName)}>{value}</p>
        <Badge
          variant="outline"
          className={cn(
            "mt-3 gap-1 border-transparent bg-green-50 font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400",
            captionClassName
          )}
        >
          <TrendingUp className="h-3 w-3" />
          {caption}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default TrendStatCard;
