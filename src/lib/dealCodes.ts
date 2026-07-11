// Client-side mirror of the backend's deal-code rules (4–32 chars, A-Z 0-9 - _
// after trim/uppercase/dedupe, max 500 per deal). The backend remains
// authoritative — its 400 messages are surfaced verbatim in the forms.

export const MAX_CODES = 500;
export const MAX_PREFIX_LENGTH = 10;
export const CODE_PATTERN = /^[A-Z0-9\-_]{4,32}$/;

export interface ParsedCodes {
  codes: string[];
  rejected: { line: string; reason: string }[];
}

export const parseCodesInput = (raw: string): ParsedCodes => {
  const seen = new Set<string>();
  const codes: string[] = [];
  const rejected: { line: string; reason: string }[] = [];

  for (const piece of raw.split(/[\n,]+/)) {
    const line = piece.trim();
    if (!line) continue;
    const code = line.toUpperCase();
    if (code.length < 4 || code.length > 32) {
      rejected.push({ line, reason: "must be 4–32 characters" });
    } else if (!CODE_PATTERN.test(code)) {
      rejected.push({ line, reason: "only letters, numbers, - and _ allowed" });
    } else if (seen.has(code)) {
      // duplicates are silently collapsed, same as the backend
    } else {
      seen.add(code);
      codes.push(code);
    }
  }

  return { codes, rejected };
};

export const isValidPrefix = (prefix: string): boolean =>
  prefix === "" || (prefix.length <= MAX_PREFIX_LENGTH && /^[A-Z0-9\-_]+$/.test(prefix.toUpperCase()));
