// Client-side mirror of the backend's deal-code rules (4–32 chars, A-Z 0-9 - _
// after trim/uppercase, unique per deal, max 500 per deal). The backend
// remains authoritative — its 400 messages are surfaced verbatim in the forms.

export const MAX_CODES = 500;
export const MAX_PREFIX_LENGTH = 10;
export const CODE_PATTERN = /^[A-Z0-9\-_]{4,32}$/;

export interface ParsedCodes {
  codes: string[];
  rejected: { line: string; reason: string }[];
  duplicateCount: number;
}

export const parseCodesInput = (raw: string): ParsedCodes => {
  const seen = new Set<string>();
  const codes: string[] = [];
  const rejected: { line: string; reason: string }[] = [];
  let duplicateCount = 0;

  for (const piece of raw.split(/[\n,]+/)) {
    const line = piece.trim();
    if (!line) continue;
    const code = line.toUpperCase();
    if (code.length < 4 || code.length > 32) {
      rejected.push({ line, reason: "must be 4–32 characters" });
    } else if (!CODE_PATTERN.test(code)) {
      rejected.push({ line, reason: "only letters, numbers, - and _ allowed" });
    } else if (seen.has(code)) {
      // Flag duplicates explicitly rather than silently collapsing them —
      // maxUses is derived from this count, so a quiet drop would leave the
      // brand thinking they issued more unique codes than they actually did.
      // Counted rather than listed line-by-line: a summary is more useful
      // than a long repeat of codes the user can already see above.
      duplicateCount += 1;
    } else {
      seen.add(code);
      codes.push(code);
    }
  }

  return { codes, rejected, duplicateCount };
};

export const isValidPrefix = (prefix: string): boolean =>
  prefix === "" || (prefix.length <= MAX_PREFIX_LENGTH && /^[A-Z0-9\-_]+$/.test(prefix.toUpperCase()));

// Normalizes an uploaded .txt/.csv file's text into the raw form
// parseCodesInput expects: strip BOM, CSV quoting, and a header row like
// "code"/"codes"/"promo_code" (which would otherwise pass CODE_PATTERN and
// become a bogus code).
export const codesFileToRaw = (text: string): string => {
  const lines = text
    .replace(/^﻿/, "")
    .replace(/"/g, "")
    .split(/\r?\n/);
  const firstContent = lines.find((l) => l.trim());
  if (
    firstContent &&
    /^(code|codes|promo[ _-]?codes?|coupon[ _-]?codes?)$/i.test(firstContent.trim())
  ) {
    lines.splice(lines.indexOf(firstContent), 1);
  }
  return lines.join("\n");
};

// Client-side download of a deal's codes as .txt (one per line) or .csv
// (with a "code" header).
export const downloadCodes = (
  codes: string[],
  format: "txt" | "csv",
  baseName: string,
): void => {
  const content =
    format === "csv" ? ["code", ...codes].join("\n") : codes.join("\n");
  const slug =
    baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "deal";
  const blob = new Blob([content], {
    type: format === "csv" ? "text/csv;charset=utf-8" : "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slug}-codes.${format}`;
  a.click();
  URL.revokeObjectURL(url);
};
