import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  cardClassName?: string;
  iconWrapperClassName: string;
  labelClassName?: string;
  valueClassName?: string;
}

// Card with a tinted icon badge alongside a label/value pair.
const StatCard = ({
  icon: Icon,
  label,
  value,
  cardClassName,
  iconWrapperClassName,
  labelClassName,
  valueClassName,
}: StatCardProps) => {
  return (
    <Card className={cn("border-border/60", cardClassName)}>
      <CardContent className="flex items-center gap-4 p-4">
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", iconWrapperClassName)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-0.5">
          <p className={cn("text-sm text-muted-foreground", labelClassName)}>{label}</p>
          <p className={cn("text-2xl font-bold tracking-tight text-foreground", valueClassName)}>{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
