import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export interface StatusOption {
  value: string;
  label: string;
}

// Shared status + date-range filter bar for the Promotions tab's Campaigns
// and Deals lists. Keeps both lists' filter UI and clear-filters behavior
// in lockstep.
const PromotionsFilterBar: React.FC<{
  statusOptions: StatusOption[];
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}> = ({ statusOptions, statusFilter, onStatusFilterChange, dateRange, onDateRangeChange }) => {
  const hasFilters = statusFilter !== "all" || !!dateRange?.from;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-4">
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start gap-2 font-normal sm:w-64">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "MMM d, yyyy")} –{" "}
                  {format(dateRange.to, "MMM d, yyyy")}
                </>
              ) : (
                format(dateRange.from, "MMM d, yyyy")
              )
            ) : (
              "Filter by date"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="self-start sm:self-auto"
          onClick={() => {
            onStatusFilterChange("all");
            onDateRangeChange(undefined);
          }}
        >
          <X className="h-3.5 w-3.5 mr-1.5" />
          Clear filters
        </Button>
      )}
    </div>
  );
};

export default PromotionsFilterBar;
