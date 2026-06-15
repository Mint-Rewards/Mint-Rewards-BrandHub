import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  cardClassName: string;
  iconWrapperClassName: string;
  labelClassName: string;
  valueClassName: string;
}

// Gradient card with an icon badge alongside a label/value pair.
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
    <Card className={cardClassName}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className={cn("p-2 rounded-lg", iconWrapperClassName)}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className={cn("text-sm", labelClassName)}>{label}</p>
            <p className={cn("text-2xl font-bold", valueClassName)}>{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
