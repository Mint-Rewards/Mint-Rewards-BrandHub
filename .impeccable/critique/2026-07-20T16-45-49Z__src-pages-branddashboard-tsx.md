---
target: BrandDashboard
total_score: 25
p0_count: 1
p1_count: 2
timestamp: 2026-07-20T16-45-49Z
slug: src-pages-branddashboard-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Three independent loading flags (`loading`, `analyticsLoading`, `overviewLoading`) can desync; changing the date range re-triggers a full skeleton repaint for a minor interaction. |
| 2 | Match System / Real World | 3 | Error copy speaks in real org-role terms; campaign status vocabulary matches actual moderation states. |
| 3 | User Control and Freedom | 2 | No dirty-check before Settings edits are discarded on tab navigation. |
| 4 | Consistency and Standards | 2 | Overview and ESG present overlapping metric categories with opposite visual grammar (bordered strip vs. identical card grid). |
| 5 | Error Prevention | 2 | Silent data loss on Settings tab-switch; no confirmation before losing in-progress edits. |
| 6 | Recognition Rather Than Recall | 4 | Statistics Period banner explicitly states which metrics are period-scoped vs. all-time — externalizes a fact the user would otherwise have to remember. |
| 7 | Flexibility and Efficiency | 1 | `activeTab` and `dateRange` reset to defaults every session load, contradicting PRODUCT.md's "expect the tool to remember where they were." |
| 8 | Aesthetic and Minimalist Design | 3 | Mostly restrained; docked for emoji "eco" icons and EsgTab's card-grid noise. |
| 9 | Error Recovery | 3 | Typed error classes (402/403/404/401) drive specific, actionable messaging and retry affordances. |
| 10 | Help and Documentation | 2 | Locked-module toast has no follow-through CTA beyond the transient message. |
| **Total** | | **25/40** | **Acceptable — significant improvements needed before users are happy** |

## Anti-Patterns Verdict

**Does this look AI-generated? Mostly no — but with real, isolated backslides.**

**LLM assessment:** The dashboard largely avoids the hero-metric template — `OverviewTab.tsx` KPI strips use a single bordered `divide-x` container instead of gradient cards, which is genuinely better than the pattern the ban targets. But `EsgTab.tsx:109-127` reintroduces the exact "identical card grid" anti-pattern DESIGN.md bans, on data that's comparable and tabular (its own prescribed fix is a table/definition list). `OverviewTab.tsx:566-588` uses raw 🌳🚗💡 emoji for "Environmental Equivalents" — literally the leaf-icon greenwashing signal DESIGN.md's prose bans, just not phrased as "emoji." No gradient text, no side-stripe borders, no uppercase eyebrows found. The unevenness — disciplined in Overview, generic in ESG — reads as inconsistent care across the surface rather than uniform template scaffolding.

**Deterministic scan:** `detect.mjs --json` against all 10 target files (BrandDashboard.tsx + 5 tab components + 4 shared UI primitives) returned `[]`, exit code 0 — clean. This is expected and not a contradiction: the detector's lexical/pattern checks (gradient-clip-text, decorative side-stripes, tracked uppercase eyebrows) don't cover semantic anti-patterns like "these five cards are identically shaped and should be a table," missing KPI comparators, or an unwired theming rule. The clean scan and Assessment A's findings agree on everything the detector actually checks for; the real issues here live one level up, in semantic/system consistency the detector isn't built to see.

**Visual overlays:** Not available this run — no browser automation tool is present in this environment, so live-page injection was skipped entirely (not attempted-and-failed; simply unavailable). This critique is code-level only; treat layout/spacing/rendered-appearance claims as inferred from JSX and Tailwind classes, not confirmed on a live screen.

## Overall Impression

This is a competently-built dashboard with real engineering discipline in the places that are hardest to fake — typed error handling, point-in-time data derivation with a justifying comment, a genuinely good "which numbers are period-scoped" disclosure. It doesn't read as templated AI scaffolding. But it fails its own stated design system in specific, traceable ways: the "Dynamic Brand Rule" that's supposed to make every dashboard feel brand-owned has no actual runtime implementation (it's manually re-created per component, and was missed on the Settings save button); the tab meant to survive a board-room screenshot (ESG) has less contextual rigor than the tab meant for a weekly glance (Overview); and a real, silent data-loss bug sits one file away from the exact fix the team already shipped for a similar case. The single biggest opportunity: close the gap between what DESIGN.md promises (dynamic brand theming, contextualized metrics, a reserved gradient moment) and what's actually wired up — the rules are well-written; the implementation trails them in three or four concrete spots.

## What's Working

1. **The Statistics Period banner's explicit scope copy** (`BrandDashboard.tsx:628-634`) tells users in plain language which numbers move with the date picker and which don't — exactly the "data earns trust" discipline the design system asks for, and it's the reason Recognition Rather Than Recall scores a 4/4.
2. **Point-in-time count derivation** (`OverviewTab.tsx:184-263`) deliberately re-derives active/total campaign counts from the live list rather than trusting a possibly-stale backend aggregate, while keeping backend-sourced fields (redemptions, unique users) authoritative — real rigor in service of data correctness, not cosmetic polish.
3. **Typed, differentiated error handling** (`brandActions.ts:183-226`, feeding `BrandDashboard.tsx:512-529`) distinguishes locked-module vs. forbidden-role vs. not-found states with distinct copy — a more mature error model than most dashboards this size ship.

## Priority Issues

**[P0] Settings edits are silently destroyed on tab switch, with no warning and no recovery.**
- **Why it matters**: Radix `TabsContent` unmounts inactive panels by default, and `SettingsTab.tsx` keeps form state locally with no persistence. Switching away from Settings mid-edit wipes every typed change with zero signal — the user doesn't find out until they come back and their changes are gone. This is a real support-ticket generator: infrequent users interrupted mid-task (the exact usage pattern PRODUCT.md describes) lose real work silently.
- **Fix**: `PromotionsTab.tsx:39-49` already solved this exact problem — it keeps sub-views mounted via `hidden` specifically so state survives tab switching. Apply the same pattern to the top-level dashboard Tabs, or add a dirty-check confirmation before `handleTabChange` navigates away.
- **Suggested command**: `/impeccable harden`

**[P1] EsgTab — the tab most likely to be screenshotted for a board report — has the least contextual rigor of any tab.**
- **Why it matters**: Every figure in `EsgTab.tsx:47-127` is a bare number in an identical card grid: no comparator, no benchmark, and no stated time frame (it's silently all-time, per `BrandDashboard.tsx:68-70`, but the tab never says so). This directly undermines PRODUCT.md's core promise for the sustainability-lead persona — "a credible CO₂ and waste metric for a quarterly report in under 2 minutes" — and violates DESIGN.md's Context Requirement and its ban on identical card grids in the same stroke.
- **Fix**: Restructure the card grid into a table or definition list (DESIGN.md's own prescribed alternative for comparable data), add an explicit "all-time" label matching Overview's convention, and add at least one comparator per headline figure.
- **Suggested command**: `/impeccable clarify`

**[P1] Brand `themeColor` has no contrast validation, and the forbidden default blue is reachable in production.**
- **Why it matters**: `SettingsTab.tsx:49-53` validates hex format only, never contrast, before that color is painted as white-on-fill and fill-on-white throughout the dashboard. Separately, `createOrgBrand` (`brandActions.ts:244-264`) can create a brand with no `themeColor` at all, silently falling back to `#3B82F6` — the exact hex DESIGN.md names as something that "should never appear in production for an approved brand." A real brand can go live with illegible text and no one is warned, which conflicts with PRODUCT.md's stated WCAG AA commitment.
- **Fix**: Add a contrast check on the themeColor field (warn below 4.5:1 against white), and require a themeColor before a brand can be approved/go live.
- **Suggested command**: `/impeccable harden`

**[P2] The "Dynamic Brand Rule" isn't actually implemented — it's manually re-applied per component, and was missed on the most important button in Settings.**
- **Why it matters**: A repo-wide check confirms nothing sets CSS `--primary` from `brand.themeColor` at runtime; `brandColor` is threaded manually via inline styles component-by-component. `SettingsTab.tsx:506`'s "Save Changes" button — the single most important action on the tab — was never given that treatment, so it renders in the global default teal instead of the brand's own color, on the org's own settings screen.
- **Fix**: Set the CSS custom property on a dashboard-scoped wrapper so `bg-primary`/`text-primary` utilities inherit brand color automatically, rather than requiring every new component to remember to opt in.
- **Suggested command**: `/impeccable harden`

**[P2] The one designed "delight" moment isn't built with the components DESIGN.md reserves for it.**
- **Why it matters**: DESIGN.md names the `gradient` button variant and `shadow-elegant` as exclusively for the "Preview Dashboard" moment — the one CTA meant to soften the deflating "your registration is pending" message. `BrandDashboard.tsx:464-480` implements it as a plain `Outline` button with default card shadow, visually identical to "Cancel" and "Try again." The single highest-leverage emotional beat in the registration journey reads as generic.
- **Fix**: Apply `variant="gradient"` and the `shadow-elegant` treatment to that card specifically, matching DESIGN.md's named rule.
- **Suggested command**: `/impeccable delight`

## Persona Red Flags

Selected for a B2B admin dashboard used by both a returning report-builder and an accessibility-dependent viewer: **Alex** and **Sam**.

**Alex (returning, report-building user)**: `activeTab` and `dateRange` reset to defaults on every session (`BrandDashboard.tsx:80-89`) — every return visit discards whatever custom multi-month range was set for last quarter's report, directly contradicting PRODUCT.md's "expect the tool to remember where they were." The ESG CSV export (`EsgTab.tsx:72-89`) has no period field, just a generation timestamp — someone archiving quarterly exports can't tell which period a file covers from the file itself.

**Sam (accessibility-dependent)**: Locked module tabs render as bare `<button>` elements inside a Radix `role="tablist"` alongside real `TabsTrigger`s (`BrandDashboard.tsx:591-601, 603-613`) — breaks the ARIA tablist/roving-tabindex contract for keyboard and screen-reader users mid-strip. Separately, the unchecked `themeColor` contrast gap (P1 above) means every dashboard's legibility depends on one unvalidated hex value with no signal at pick-time or render-time.

## Minor Observations

- `badge.tsx` has no `success`/`warning` variant baked into `badgeVariants`, so every state badge hand-rolls className overrides — likely why the header's Active/Pending badge uses `brandColor` instead of the fixed platform state-colors DESIGN.md's own carve-out requires for that specific badge.
- The pending-approval contact email is `engineering@mymintrewards.com` (`BrandDashboard.tsx:449`) — an internal engineering alias surfaced as the customer-facing support contact for waiting brand partners; worth double-checking this is intentional.
- Focus rings use Tailwind's `focus-visible:ring-2` (box-shadow-based) rather than the literal `outline` + `outline-offset: 2px` DESIGN.md's component prose describes — same visual color, different mechanism, low-stakes.
- `MATERIAL_COLORS.glass = "#3B82F6"` (`OverviewTab.tsx:63`) coincidentally reuses the "forbidden" generic SaaS blue as a chart categorical color — unrelated purpose, harmless, but worth a second glance given the fallback issue above.
- `tailwind.config.ts` never maps the three named shadow tokens (`shadow-card`/`shadow-button`/`shadow-elegant`) into actual Tailwind utilities; they exist only as unused CSS custom properties, and every button variant instead gets a stock `shadow-sm` at rest — a systemic, if subtle, violation of the Flat-By-Default Rule across every button in the app.

## Questions to Consider

- If the Dynamic Brand Rule isn't wired into the CSS variable system, is it a rule, or a description of what components happen to remember to do? What's the plan for the next ten components?
- Why does the tab built to survive a board-room screenshot (ESG) carry less contextual scaffolding than the tab built for a weekly glance (Overview)? What would it look like if the priority were inverted to match the stakes?
- Would the team accept the Settings data-loss risk if it were framed as "delete this campaign with no confirmation" instead of "navigate to another tab with no confirmation"? They're the same failure mode in different clothes.
