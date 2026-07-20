import { useId, useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Common audience segments for a rewards/sustainability campaign. Anything the
// brand needs beyond these is added through the "Others" chip.
const PREDEFINED_AUDIENCES = [
  "Women",
  "Men",
  "Aged 18-24",
  "Aged 25-34",
  "Aged 35-44",
  "Aged 45-54",
  "Aged 55+",
  "Students",
  "Young Professionals",
  "Families",
  "Frequent Shoppers",
  "New Customers",
];

// The field is persisted as a single comma-joined string, so it round-trips
// through the existing string API without any backend change.
const parseValue = (value: string): string[] =>
  value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

const isPredefined = (value: string) =>
  PREDEFINED_AUDIENCES.some((p) => p.toLowerCase() === value.toLowerCase());

interface TargetAudienceChipsProps {
  value: string;
  onChange: (value: string) => void;
}

export function TargetAudienceChips({ value, onChange }: TargetAudienceChipsProps) {
  const selected = parseValue(value);
  const selectedSet = new Set(selected.map((s) => s.toLowerCase()));
  const customValues = selected.filter((s) => !isPredefined(s));

  // Open the custom field by default when editing a campaign that already has
  // custom audiences, so they're visibly editable.
  const [showOther, setShowOther] = useState(customValues.length > 0);
  const [draft, setDraft] = useState("");
  const inputId = useId();

  // De-dupe case-insensitively while preserving order, then serialize.
  const commit = (next: string[]) => {
    const seen = new Set<string>();
    const deduped = next.filter((v) => {
      const key = v.toLowerCase();
      if (!v || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    onChange(deduped.join(", "));
  };

  const toggle = (label: string) => {
    if (selectedSet.has(label.toLowerCase())) {
      commit(selected.filter((s) => s.toLowerCase() !== label.toLowerCase()));
    } else {
      commit([...selected, label]);
    }
  };

  const removeValue = (label: string) =>
    commit(selected.filter((s) => s.toLowerCase() !== label.toLowerCase()));

  const addCustom = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (!selectedSet.has(trimmed.toLowerCase())) commit([...selected, trimmed]);
    setDraft("");
  };

  const chipBase =
    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50";
  const chipOff = "border-border bg-background text-foreground hover:bg-muted";
  const chipOn = "border-primary bg-primary text-primary-foreground hover:bg-primary/90";

  return (
    <div className="space-y-3" role="group" aria-label="Target audience">
      <div className="flex flex-wrap gap-2">
        {PREDEFINED_AUDIENCES.map((label) => {
          const on = selectedSet.has(label.toLowerCase());
          return (
            <button
              key={label}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(label)}
              className={cn(chipBase, on ? chipOn : chipOff)}
            >
              {on && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
              {label}
            </button>
          );
        })}

        {/* Custom (typed) audiences — selected by definition, always removable */}
        {customValues.map((label) => (
          <span key={label} className={cn(chipBase, chipOn)}>
            {label}
            <button
              type="button"
              onClick={() => removeValue(label)}
              className="-mr-1 ml-0.5 rounded-full p-0.5 hover:bg-primary-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/60"
              aria-label={`Remove ${label}`}
            >
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          </span>
        ))}

        {/* Others — reveals a field to type custom audiences */}
        <button
          type="button"
          aria-expanded={showOther}
          aria-controls={inputId}
          onClick={() => setShowOther((v) => !v)}
          className={cn(chipBase, showOther ? chipOn : chipOff)}
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Others
        </button>
      </div>

      {showOther && (
        <div className="flex items-center gap-2">
          <Input
            id={inputId}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustom();
              }
            }}
            placeholder="Type an audience and press Enter"
            className="max-w-xs"
            aria-label="Add a custom audience"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCustom}
            disabled={!draft.trim()}
          >
            Add
          </Button>
        </div>
      )}
    </div>
  );
}
