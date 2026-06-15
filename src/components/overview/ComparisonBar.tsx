interface ComparisonBarProps {
  yourBrand: number;
  categoryAvg: number;
}

// Horizontal bar showing the brand's value with a marker for the category average.
const ComparisonBar = ({ yourBrand, categoryAvg }: ComparisonBarProps) => {
  const max = Math.max(yourBrand, categoryAvg);

  return (
    <div className="relative">
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-primary h-3 rounded-full transition-all duration-300"
          style={{ width: `${Math.min((yourBrand / max) * 100, 100)}%` }}
        />
      </div>
      <div
        className="absolute top-0 h-3 w-1 bg-amber-500 rounded-full"
        style={{ left: `${Math.min((categoryAvg / max) * 100, 100)}%` }}
      />
    </div>
  );
};

export default ComparisonBar;
