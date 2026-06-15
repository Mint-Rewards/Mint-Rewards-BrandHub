import { cn } from "@/lib/utils";

interface CenteredStatProps {
  value: React.ReactNode;
  label: string;
  caption?: string;
  containerClassName: string;
  valueClassName: string;
  labelClassName?: string;
  captionClassName?: string;
}

// Centered gradient block used to highlight a single stat with a label and caption.
const CenteredStat = ({
  value,
  label,
  caption,
  containerClassName,
  valueClassName,
  labelClassName,
  captionClassName,
}: CenteredStatProps) => {
  return (
    <div className={cn("text-center p-4 rounded-lg", containerClassName)}>
      <div className={cn("text-2xl font-bold mb-1", valueClassName)}>{value}</div>
      <p className={cn("text-sm font-medium", labelClassName)}>{label}</p>
      {caption && (
        <p className={cn("text-xs text-muted-foreground mt-1", captionClassName)}>
          {caption}
        </p>
      )}
    </div>
  );
};

export default CenteredStat;
