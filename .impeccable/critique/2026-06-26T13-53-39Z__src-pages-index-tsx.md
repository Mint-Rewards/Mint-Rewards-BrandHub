---
target: the Index
total_score: 21
p0_count: 0
p1_count: 3
timestamp: 2026-06-26T13-53-39Z
slug: src-pages-index-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Hero CTAs have no loading state; dead "View Demo" route gives no feedback |
| 2 | Match System / Real World | 3 | Copy is specific post-clarify pass; "Admin Approval" feature name reads internal |
| 3 | User Control and Freedom | 3 | Clean nav; existing brand partners have no path back to their dashboard |
| 4 | Consistency and Standards | 3 | Button variants correct; icon chips don't vary by feature type |
| 5 | Error Prevention | 2 | "View Demo" → /demo likely dead route; no guard against duplicate registration |
| 6 | Recognition Rather Than Recall | 3 | All actions labeled and visible; registration is the only required action |
| 7 | Flexibility and Efficiency | 1 | One rigid path; existing partners can't reach their dashboard at all |
| 8 | Aesthetic and Minimalist Design | 2 | Fake card mockup with empty rectangles; icon grid is template-reflex |
| 9 | Error Recovery | 1 | No error path for dead demo link; static page limits exposure otherwise |
| 10 | Help and Documentation | 1 | No contextual help; nothing explaining what happens after registering |
| **Total** | | **21/40** | **Acceptable — significant improvements needed** |

## Anti-Patterns Verdict

**LLM assessment**: Copy passed the clarify bar but layout is the textbook SaaS template. Tells: identical icon-chip feature grid mapped from array; alternating muted/white section stripes; pill badge eyebrow above h1; decorative card mockup with empty rectangles.

**Deterministic scan**: detect.mjs returned zero findings (exit 0). No false positives.

## Overall Impression

Copy is now honest and specific. Layout is the modal SaaS landing page template — badge → h1 → icon grid → checklist + mockup → CTA stripe. Single biggest opportunity: replace the fake card mockup with a real static preview of the dashboard ledger bar.

## What's Working

1. Hero copy — specific, product-grounded, direct.
2. Sticky nav glassmorphism — correctly scoped to one place.
3. Features text — mechanisms named, not just benefit-speak.

## Priority Issues

**[P1] Identical icon-chip feature grid** — Four identical flex rows with same-sized rounded chips. Textbook card-grid anti-pattern. Fix: use divide-x ledger panel (consistent with app design system) or break grid by varying feature weight. Command: /impeccable layout Index features section

**[P1] Decorative card mockup** — Lines 139–161: gradient progress bar (violates gradient ban) + three empty h-8 bg-muted rectangles. Zero information value. Fix: replace with static CSS reproduction of actual ledger bar. Command: /impeccable craft index dashboard preview

**[P1] No return path for registered partners** — Existing approved partners have no "sign in to dashboard" path from the home page. Fix: add "Partner sign in" ghost button to header. Command: /impeccable harden Index

**[P2] "View Demo" links to likely dead /demo route** — First-interaction trust failure. Fix: remove or wire to BrandDashboard isPreviewMode. Command: /impeccable harden Index

**[P3] Footer copyright is 2025** — Fix: © {new Date().getFullYear()} MintRewards. Command: /impeccable polish Index

## Persona Red Flags

**Jordan (First-Timer)**: No "what is this platform" explainer above fold. "View Demo" dead link is first interactive failure. No expectation-setting on registration time/complexity.

**Casey (Mobile)**: Header three-element strip too tight on mobile. Fake mockup wastes space below checklist on stacked layout. Footer filler copy.

## Minor Observations

- text-muted-foreground on text-xl hero body may fail 4.5:1 contrast against white bg-background.
- Benefits prose missing text-wrap: pretty.
- Benefits list items describe features, not benefits (what user gets).
- Building2 icon used three times on one page for different purposes.

## Questions to Consider

- "The page explains the what but not the why — why should a brand partner MintRewards over any other rewards platform?"
- "If a brand manager lands here from a partner referral email, what's the first thing they need to know that they currently can't find?"
- "What if the benefits section right column showed one actual screenshot of the ledger bar instead of empty rectangles?"
