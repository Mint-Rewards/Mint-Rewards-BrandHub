import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TierRowProps {
  icon: LucideIcon | string;
  iconBgClassName: string;
  containerClassName: string;
  title: string;
  titleClassName: string;
  description: string;
  descriptionClassName: string;
  count: number;
  countClassName: string;
  countLabelClassName: string;
}

// Row showing a user performance tier: badge icon, title/description, and a count.
const TierRow = ({
  icon: Icon,
  iconBgClassName,
  containerClassName,
  title,
  titleClassName,
  description,
  descriptionClassName,
  count,
  countClassName,
  countLabelClassName,
}: TierRowProps) => {
  return (
    <div className={cn("flex items-center justify-between p-3 rounded-lg border", containerClassName)}>
      <div className="flex items-center space-x-3">
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", iconBgClassName)}>
          {typeof Icon === "string" ? (
            <span className="text-white font-bold text-sm">{Icon}</span>
          ) : (
            <Icon className="h-4 w-4 text-white" />
          )}
        </div>
        <div>
          <p className={cn("font-medium", titleClassName)}>{title}</p>
          <p className={cn("text-sm", descriptionClassName)}>{description}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={cn("text-lg font-bold", countClassName)}>{count}</p>
        <p className={cn("text-xs", countLabelClassName)}>users</p>
      </div>
    </div>
  );
};

export default TierRow;
