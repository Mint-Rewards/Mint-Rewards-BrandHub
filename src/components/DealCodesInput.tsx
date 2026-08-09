import { useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUp } from "lucide-react";
import {
  MAX_CODES,
  MAX_PREFIX_LENGTH,
  codesFileToRaw,
  isValidPrefix,
  parseCodesInput,
} from "@/lib/dealCodes";

export type CodesMode = "upload" | "generate";

export interface DealCodesValue {
  mode: CodesMode;
  rawCodes: string;
  generateCount: string;
  generatePrefix: string;
}

export const emptyDealCodesValue: DealCodesValue = {
  mode: "upload",
  rawCodes: "",
  generateCount: "25",
  generatePrefix: "",
};

// Resolves the control's value into the payload the backend expects, or an
// error string when the current input can't be submitted.
export const resolveDealCodes = (
  value: DealCodesValue,
  // Codes already on the deal, when appending. The cap is on the deal's total
  // inventory, not on one submission — without this an existing 480-code deal
  // accepted another 100 here and only failed server-side.
  existingCodeCount = 0,
):
  | { codes: string[] }
  | { generateCodes: { count: number; prefix?: string } }
  | { error: string } => {
  const remaining = MAX_CODES - existingCodeCount;
  const tooMany = () =>
    existingCodeCount > 0
      ? `Too many codes — this deal already has ${existingCodeCount}, so you can add at most ${Math.max(remaining, 0)} more (${MAX_CODES} total)`
      : `Too many codes — the limit is ${MAX_CODES} per deal`;

  if (value.mode === "upload") {
    const { codes } = parseCodesInput(value.rawCodes);
    if (codes.length === 0) return { error: "Enter at least one valid code" };
    if (codes.length > remaining) return { error: tooMany() };
    return { codes };
  }
  const count = parseInt(value.generateCount, 10);
  if (!Number.isFinite(count) || count < 1 || count > MAX_CODES)
    return { error: `Enter a code count between 1 and ${MAX_CODES}` };
  if (count > remaining) return { error: tooMany() };
  if (!isValidPrefix(value.generatePrefix))
    return {
      error: `Prefix must be at most ${MAX_PREFIX_LENGTH} characters (letters, numbers, - and _)`,
    };
  const prefix = value.generatePrefix.trim().toUpperCase();
  return { generateCodes: { count, ...(prefix ? { prefix } : {}) } };
};

interface DealCodesInputProps {
  value: DealCodesValue;
  onChange: (value: DealCodesValue) => void;
  idPrefix: string;
  uploadLabel?: string;
  generateLabel?: string;
}

export function DealCodesInput({
  value,
  onChange,
  idPrefix,
  uploadLabel = "Upload my own codes",
  generateLabel = "Generate codes for me",
}: DealCodesInputProps) {
  const parsed = useMemo(() => parseCodesInput(value.rawCodes), [value.rawCodes]);
  const overLimit = parsed.codes.length > MAX_CODES;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow re-selecting the same file
    if (!file) return;
    const raw = codesFileToRaw(await file.text());
    // Append to whatever is already typed rather than clobbering it.
    const existing = value.rawCodes.trim();
    onChange({ ...value, rawCodes: existing ? `${existing}\n${raw}` : raw });
  };

  return (
    <div className="space-y-3">
      <Tabs
        value={value.mode}
        onValueChange={(mode) => onChange({ ...value, mode: mode as CodesMode })}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">{uploadLabel}</TabsTrigger>
          <TabsTrigger value="generate">{generateLabel}</TabsTrigger>
        </TabsList>
      </Tabs>

      {value.mode === "upload" ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Paste codes below, or import a .txt / .csv file (one code per
              line or comma-separated)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.csv,text/plain,text/csv"
              className="hidden"
              id={`${idPrefix}-codes-file`}
              onChange={handleFileImport}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileUp className="h-3.5 w-3.5 mr-1.5" />
              Import file
            </Button>
          </div>
          <Textarea
            id={`${idPrefix}-codes`}
            placeholder={"SUMMER-001\nSUMMER-002\n…one code per line (or comma-separated)"}
            rows={5}
            className="font-mono text-sm"
            value={value.rawCodes}
            onChange={(e) => onChange({ ...value, rawCodes: e.target.value })}
          />
          <div className="text-xs space-y-1">
            <p className={overLimit ? "text-destructive" : "text-muted-foreground"}>
              {parsed.codes.length} valid {parsed.codes.length === 1 ? "code" : "codes"} after
              trimming and uppercasing — each code must be unique
              {overLimit && ` — the limit is ${MAX_CODES} per deal`}
            </p>
            {parsed.duplicateCount > 0 && (
              <p className="text-destructive">
                {parsed.duplicateCount} duplicate {parsed.duplicateCount === 1 ? "code" : "codes"} removed
              </p>
            )}
            {parsed.rejected.length > 0 && (
              <ul className="text-destructive space-y-0.5 max-h-24 overflow-y-auto">
                {parsed.rejected.map((r, i) => (
                  <li key={i}>
                    <span className="font-mono">{r.line}</span> — {r.reason}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor={`${idPrefix}-count`}>How many codes?</Label>
            <Input
              id={`${idPrefix}-count`}
              type="number"
              min={1}
              max={MAX_CODES}
              value={value.generateCount}
              onChange={(e) => onChange({ ...value, generateCount: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${idPrefix}-prefix`}>Prefix (optional)</Label>
            <Input
              id={`${idPrefix}-prefix`}
              placeholder="SUMMER"
              maxLength={MAX_PREFIX_LENGTH}
              value={value.generatePrefix}
              onChange={(e) =>
                onChange({ ...value, generatePrefix: e.target.value.toUpperCase() })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
