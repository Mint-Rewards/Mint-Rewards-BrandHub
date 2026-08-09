---
target: brand registration flow (src/pages/BrandRegister.tsx)
total_score: 27
p0_count: 0
p1_count: 2
timestamp: 2026-07-20T13-02-14Z
slug: src-pages-brandregister-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Progress stepper, inline blur validation, and a "Creating…" submit state all present; no autosave indicator (none needed at this scale) |
| 2 | Match System / Real World | 3 | Plain language throughout; "Organisation" spelling consistent; post-submit lands on a real pending-approval dashboard honoring the landing page's "2–3 business days" promise |
| 3 | User Control and Freedom | 2 | Previous + Back to Home exist, but the Review step has no per-field "edit" jump, and a refresh destroys all progress |
| 4 | Consistency and Standards | 3 | Design-system drift resolved this session (gradient reserved, `--accent` = Precision Violet, blur removed, Step 2 chunked); minor residue: page h1 is `text-3xl`, not a DESIGN type token |
| 5 | Error Prevention | 3 | Inline blur validation, category constrained to a Select, logo size/MIME/decoded-dimension checks before upload |
| 6 | Recognition Rather Than Recall | 3 | Step 3 restates every entered value incl. logo preview with graceful "None (add later)" fallbacks — genuine strength for infrequent users |
| 7 | Flexibility and Efficiency of Use | 2 | Native keyboard/tab works, but no `autoComplete` (blocks autofill + password managers), no save-and-resume, confirm-password adds a step |
| 8 | Aesthetic and Minimalist Design | 3 | Blur gone, Step 2's 8 fields now split into two labeled ≤4 groups; the step is still long but digestible |
| 9 | Error Recovery | 3 | Specific plain-language errors near each field, form never wiped; but errors aren't announced to assistive tech |
| 10 | Help and Documentation | 2 | Inline hints on brand name / logo / review, but password rules vanish (placeholder-only) and "Category" has no explanation; no support affordance |
| **Total** | | **27/40** | **Acceptable — one point off Good; design-system fidelity fixed, robustness/a11y gaps remain** |

## Anti-Patterns Verdict

**LLM assessment:** No AI-slop tells — no eyebrows, gradient text, hero-metric cards, side-stripe borders, or identical card grids. The design-system infidelities the prior critique flagged (gradient-as-default-CTA, `--accent` not matching documented Precision Violet, decorative glassmorphism, ungrouped Step 2) are all resolved in the current code. What remains is not slop; it's robustness, accessibility, and help gaps.

**Deterministic scan:** `detect.mjs --json src/pages/BrandRegister.tsx` returned `[]` (clean, exit 0). The detector's ban list targets universal AI-slop patterns, so a clean result confirms no cross-register bans — it does not evaluate flow robustness or a11y wiring, which is where the live issues are.

**Browser visualization:** Not available this session — no browser automation tool configured. Static/source review only; no user-visible overlay was produced.

## Overall Impression

This is a well-engineered wizard that just paid down its design-system debt. Validation is real, step-gating is sensible, the Review step is a genuine recognition-over-recall win, and submit routes users into a live dashboard rather than a dead-end "check your email." The remaining weaknesses are all about resilience and inclusion, not aesthetics: an accidental refresh silently wipes the entire form, and validation errors are invisible to screen readers. Fixing those two moves this from "looks right" to "trustworthy for an infrequent, task-oriented user" — which is exactly the persona PRODUCT.md names.

## What's Working

- **The Review step (Step 3)** restates every value, including a logo thumbnail and "None (add later)" fallbacks — nothing must be held in working memory across the flow.
- **Honest post-submit destination:** registration logs the user in and routes to a real dashboard with a pending-approval state that matches the "2–3 business days" promise from the landing page. No dead end.
- **Logo upload validation** checks size, MIME type, and decoded pixel dimensions with specific, actionable copy before the file ever hits a request — error prevention done properly.

## Priority Issues

**[P1] A refresh or interruption silently destroys the entire form**
Why it matters: Org name, email, brand name, category, and the uploaded logo all live in React state only — no `sessionStorage`, no `beforeunload` guard (confirmed absent). One accidental refresh, tab-switch timeout, or back-gesture on mobile and a partly-completed registration is gone. This directly undercuts the "register in under 10 minutes" success metric and hits the infrequent/mobile user hardest.
Fix: Persist `formData` (minus the two password fields) to `sessionStorage` on change, rehydrate on mount, clear on successful submit. Optionally add a `beforeunload` warning while the form is dirty.
Suggested command: /impeccable harden

**[P1] Validation errors are invisible to assistive tech**
Why it matters: `FieldError` renders a plain `<p>`; inputs carry no `aria-invalid`, no `aria-describedby` linking the message, and there's no `aria-live` region (confirmed: zero aria attributes in the file). A screen-reader user (Sam) tabs into a field that's visually red and hears nothing wrong. The error-in-a-red-border also leans on color alone.
Fix: Give each error a stable id, set `aria-describedby` + `aria-invalid` on the input, and wrap the message in `role="alert"` (or an `aria-live="polite"` region). Move focus to the first invalid field on failed `Next`.
Suggested command: /impeccable harden (or /impeccable audit to enumerate a11y gaps first)

**[P2] Password requirements disappear and there's no help at decision points**
Why it matters: "At least 8 characters" is a placeholder — it vanishes the moment the user types, so Jordan (first-timer) is left guessing why the field rejects them. "Category" is presented with no hint about what it affects downstream, despite being required.
Fix: Make the password rule persistent helper text (ideally a live checklist), and add a one-line hint under Category.
Suggested command: /impeccable clarify

**[P2] No `autoComplete` — autofill and password managers can't help**
Why it matters: None of the account-step inputs declare `autoComplete` (confirmed absent), so browsers and password managers won't offer email/organization autofill or generate/store a new password. That's real friction on the exact step where autofill matters most, and it's worst on mobile.
Fix: Add `autoComplete="email"`, `"organization"`, and `"new-password"` (both password fields) to the relevant inputs.
Suggested command: /impeccable harden

**[P2] The Review step can't edit — only walk backwards**
Why it matters: To correct one field, the user hits Previous repeatedly and hunts for it. For a form that just grew visible sub-groups, a direct jump is cheap and expected.
Fix: Add an "Edit" affordance per Review section that sets `currentStep` to the owning step (and ideally focuses the field).
Suggested command: /impeccable layout

## Persona Red Flags

**Sam (Accessibility-Dependent):** No `aria-invalid` / `aria-describedby` on inputs, errors as plain paragraphs, no live region, and focus is not moved to the new step's heading on Next/Previous — a keyboard/SR user gets no announcement that the step or the error state changed. Error state also signaled largely by color.

**Casey (Distracted Mobile):** Refresh/app-switch loses everything (no persistence). Step labels are `hidden sm:block`, so on a phone the stepper is bare numbered circles with no "Organisation / Brand / Review" wayfinding. Missing `autoComplete` forces manual typing of email + password on a small keyboard.

**Jordan (Confused First-Timer):** Password rule is placeholder-only (gone once typing starts); "Category" required with no explanation of its effect; no help/support link anywhere in the flow.

## Minor Observations

- Logo dropzone renders a `border-2 border-dashed` "drop here" affordance but wires no `onDrop`/`onDragOver` — it's click-only, so the visual promises something it doesn't do. Either wire drag-and-drop or soften the affordance.
- Step 2's `CardDescription` ("Name your first brand and upload its logo") is now stale — it no longer mentions the Contact & links group.
- Confirm-password remains despite a show/hide toggle already letting users verify what they typed — friction with little modern payoff.
- Address is free-text with no format guidance, unlike every validated sibling (acceptable since optional, but inconsistent).
- Page h1 "Create Your Organisation" (`text-3xl`, 30px) exceeds the DESIGN.md headline token (20px/700); harmless but off-system.

## Questions to Consider

- Registration progress is the user's investment — should any accidental refresh really be able to erase it?
- If a screen-reader user can't perceive a validation error, is the "good inline validation" strength actually delivered for them?
- Now that gradient is reserved again, is there one genuine promotional moment in this flow worth spending it on — or does the flow stay all-teal by design?
