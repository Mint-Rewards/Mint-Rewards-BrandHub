import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TrendBadgeProps {
  performance: "above" | "below" | "average";
  percentageDiff: number;
}

const PERFORMANCE_STYLES: Record<TrendBadgeProps["performance"], string> = {
  above: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  below: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  average: "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400",
};

const PERFORMANCE_ARROWS: Record<TrendBadgeProps["performance"], string> = {
  above: "↑",
  below: "↓",
  average: "=",
};

// Pill showing how a metric compares to the category average (↑/↓/= X%).
const TrendBadge = ({ performance, percentageDiff }: TrendBadgeProps) => {
  return (
    <Badge
      variant="outline"
      className={cn("border-transparent", PERFORMANCE_STYLES[performance])}
    >
      {PERFORMANCE_ARROWS[performance]} {percentageDiff}%
    </Badge>
  );
};

export default TrendBadge;
