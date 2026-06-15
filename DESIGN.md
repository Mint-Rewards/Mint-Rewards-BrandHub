---
name: Mint Rewards Brand Hub
description: Privacy-first sustainability analytics dashboard for brand partners
colors:
  primary: "#005761"
  primary-glow: "#0097a8"
  primary-foreground: "#fafafa"
  secondary: "#f3f5f7"
  secondary-foreground: "#363b49"
  accent: "#8135f3"
  accent-foreground: "#fafafa"
  success: "#16a249"
  warning: "#f59f0a"
  destructive: "#ef4343"
  background: "#fcfcfc"
  foreground: "#21242c"
  card: "#ffffff"
  muted: "#f3f5f7"
  muted-foreground: "#7b899d"
  border: "#e0eaeb"
  input: "#edf2f3"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "12px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
    padding: "0.5rem 1rem"
    height: "2.5rem"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "0.5rem 1rem"
    height: "2.5rem"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "1.25rem"
  icon-badge-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary}"
    rounded: "{rounded.xl}"
    height: "2.75rem"
    width: "2.75rem"
---

# Design System: Mint Rewards Brand Hub

## 1. Overview

**Creative North Star: "The Field Ledger"**

The Field Ledger is the meeting point of two ideas: real environmental work happening in the field (waste collected, CO₂ saved, users recycling) and the calm, audited record-keeping of a ledger. Every screen should read like a trustworthy account of what actually happened — precise figures, restrained presentation, no embellishment. The brand managers reading this dashboard are deciding what to report to their own stakeholders; the design's job is to make that handoff feel effortless and credible.

This system explicitly rejects the generic SaaS-cream dashboard look — gradient hero stats, identical icon-and-gradient card grids, warm near-white "paper" backgrounds. The codebase is already mid-refactor away from that: two-stop gradient fills (`bg-gradient-to-br from-green-50 to-green-100`) on stat cards and tier containers are being replaced with flat tints (`bg-green-50`, `bg-muted/40`) and neutral whisper-thin borders (`border-border/60`). DESIGN.md codifies that direction as the standard, not an exception.

**Key Characteristics:**
- Numbers are the largest, boldest elements on any screen — everything else (labels, icons, badges) is quieter by design.
- Flat, tonal color — no gradients on cards, icon badges, or containers.
- A teal primary that reads as institutional and trustworthy, not playful.
- One accent color (violet), used rarely, for deliberate emphasis only.
- Whisper-thin borders (`border-border/60`) and `shadow-sm` are the entire elevation vocabulary — no heavy drop shadows or glow.

## 2. Colors

The palette is built around one deep, institutional teal, a near-white neutral base, and a single violet accent reserved for emphasis. Status colors (success/warning/destructive) and Tailwind's standard color scales (green/blue/purple/orange/yellow/gray) carry the per-metric and per-tier coding seen across the overview tabs.

### Primary
- **Ledger Teal** (`#005761` / `hsl(186 100% 19%)`): the platform's default brand color (Mint Rewards' own identity). Drives primary buttons, active tab indicators, links, focus rings, and primary icon accents (e.g. the calendar icon in `PeriodHeader`).
- **Ledger Teal Glow** (`#0097a8` / `hsl(186 100% 33%)`): a brighter tint of primary, available for charts or subtle highlight states. Used sparingly — it is a *tint of* primary, not a second color.

### Secondary
- **Signal Violet** (`#8135f3`): the one accent color in the system. Per PRODUCT.md, reserved for deliberate emphasis — projections, highlighted callouts, or a single standout data point. Never used as a default card or icon-badge tint.

### Neutral
- **Paper White** (`#fcfcfc`): page background. Nearly white, with a whisper of cool tone — deliberately *not* the warm cream/sand that reads as generic AI dashboard.
- **Card White** (`#ffffff`): card and popover surfaces, one step lighter than the page background so cards lift without needing a shadow.
- **Ink** (`#21242c`): primary text color. Near-black with a cool, teal-leaning undertone matching the primary hue family.
- **Mist** (`#f3f5f7`): secondary/muted surface — tab list backgrounds, subtle section dividers, `bg-muted/40` tonal containers (e.g. "Outstanding Performance" callouts).
- **Slate** (`#7b899d`): muted foreground — stat labels, captions, secondary text. Must stay legible (see Do's and Don'ts contrast rule).
- **Hairline** (`#e0eaeb` at full value, typically used as `border-border/60`): the system's only border color. Teal-tinted, not gray — ties borders back to the primary hue family.

### Status & Category Colors
- **Success Green** (`#16a249` / Tailwind `green-600/700`): positive trends, "above average" performance, completed states. Trend badges use `bg-green-50` + `text-green-700` (light) / `bg-green-900/30` + `text-green-400` (dark) — flat tints, never gradients.
- **Warning Amber** (`#f59f0a`): caution states, mid-range tiers.
- **Destructive Red** (`#ef4343` / Tailwind `red-600/700`): "below average" performance, errors, destructive actions.
- **Category accents** (Tailwind `blue`, `purple`, `orange`, `yellow`, `amber`, `gray` at the `-50`/`-600`/`-700`/`-800` steps): used per-metric in `BrandsTab` and per-tier in `UsersTab` (Platinum = yellow, Gold = amber, Silver = gray, etc.) as flat tints + matching text color. These are decorative category coding, not brand colors — keep them flat and muted, matching the Ledger Teal system's restraint.

### Named Rules
**The Brand-Themable Primary Rule.** `--primary` (and its derivatives `--primary-glow`, `--ring`, `--primary-foreground`) is the platform's *override point*. `#005761` (Ledger Teal) is the Mint Rewards default when a brand has no custom theme. Each registered brand sets a `theme_color` during registration (see `BrandRegister`, `brand.theme_color`); when that wiring is connected, the brand's color should recompute `--primary` and its derivatives — never hardcode a brand color into individual components. Until that wiring exists, treat `#005761` as the canonical default everywhere.

**The Flat Tint Rule.** No two-stop gradient fills (`bg-gradient-to-X from-A to-B`) on cards, icon badges, or containers. Use a single flat tint (`bg-{color}-50`, `bg-primary/10`, `bg-muted/40`) plus, if needed, a matching `border-{color}-200` or `border-border/60`. This is the direction the current overview refactor is already moving in — DESIGN.md makes it the rule, not the exception.

**The One Accent Rule.** Signal Violet (`#8135f3`) appears in at most one element per view, and only when that element is the single most important thing on the screen (e.g. a projections highlight). If violet shows up on more than one card in the same tab, that's a signal something else should carry the emphasis instead.

## 3. Typography

**Body Font:** ui-sans-serif, system-ui, sans-serif (Tailwind/shadcn default stack — no custom font is loaded)

**Character:** A neutral system-native sans. The Field Ledger doesn't need a distinctive display face — it needs to disappear so the numbers and data read as fact, not as marketing.

### Hierarchy
- **Display** (700, 1.5rem–1.875rem / `text-2xl`–`text-3xl`, line-height 1.2, letter-spacing -0.02em): the metric values themselves — `StatCard`, `TrendStatCard`, and `CenteredStat` values. This is the true "hero" text of the system; everything else is built to support it.
- **Headline** (600, 1.5rem / `text-2xl`, line-height 1, letter-spacing -0.02em): `CardTitle` — section and tab headers (e.g. "Company Impact", "Sector Performance").
- **Title** (600, 0.875rem / `text-sm`): sub-labels that need emphasis without competing with metric values — tier names ("Platinum Tier"), callout headings ("Outstanding Performance").
- **Body** (400, 0.875rem / `text-sm`, line-height 1.5): `CardDescription` and general copy, typically in Slate (`text-muted-foreground`).
- **Label** (500, 0.75rem–0.875rem / `text-xs`–`text-sm`): stat labels (`StatCard`'s label row), badge text, captions. Often paired with Slate for de-emphasis.

### Named Rules
**The Quiet Hierarchy Rule.** Only metric values (Display) and section titles (Headline) use `font-bold`/`font-semibold` at larger sizes. Labels and captions stay at `text-xs`/`text-sm` and `font-medium` at most — the contrast between a 30px bold number and a 12px medium label *is* the hierarchy. Don't add extra weight or size to labels to "balance" a card; let the number dominate.

## 4. Elevation

The system is flat by default. Depth is conveyed through two tools only: a 1px whisper-thin border (`border-border/60`, the teal-tinted Hairline color) and Tailwind's default `shadow-sm` (from the base `Card` component, `0 1px 2px 0 rgb(0 0 0 / 0.05)`). There is no layered shadow scale, no glow, and no glassmorphism.

Three custom shadow tokens (`--shadow-elegant`, `--shadow-card`, `--shadow-button`) and four gradient tokens (`--gradient-primary`, `--gradient-hero`, `--gradient-card`, `--gradient-subtle`) exist in `src/index.css` but are **not used anywhere in the component tree** — they are leftovers from a pre-refactor gradient-heavy style. Treat them as dead; do not reach for them in new work (see Do's and Don'ts).

### Named Rules
**The Flat-By-Default Rule.** Surfaces sit at `shadow-sm` + `border-border/60` and never change on hover unless the element is interactive (buttons get `hover:shadow-md`, per `buttonVariants`). Cards displaying data are not interactive and should not gain shadow on hover.

## 5. Components

### Buttons
- **Shape:** `rounded-lg` (10px, `--radius`).
- **Primary:** Ledger Teal background (`bg-primary`), `primary-foreground` text (`#fafafa`), `shadow-sm` at rest.
- **Hover / Focus:** primary → `bg-primary/90` with `shadow-md`; all variants share `transition-all duration-200` and a 2px `ring` in `--ring` (same hue as primary) on focus-visible.
- **Outline / Ghost:** `border-border` + `bg-background`, hover to `bg-muted`. Used for secondary actions (e.g. "Admin Login").
- **Status variants** (`success`, `warning`, `destructive`): flat fill in the matching status color, same shape/hover treatment as primary. No `gradient` variant should be used going forward (see Do's and Don'ts) even though `buttonVariants` still defines one.

### Cards / Containers
- **Corner Style:** `rounded-lg` (10px) for cards and section containers; `rounded-xl` (12px) specifically for the square icon badges inside stat cards.
- **Background:** `bg-card` (Card White, `#ffffff`) on `bg-background` (Paper White, `#fcfcfc`) — a one-step lift with no shadow needed for the base contrast.
- **Shadow Strategy:** `shadow-sm` only, per Elevation above.
- **Border:** `border-border/60` (Hairline at 60% opacity) is the standard for data/stat cards — lighter than the base `Card` component's full `border`, keeping dense grids of cards from feeling boxed-in.
- **Internal Padding:** `p-4` (16px) for compact stat cards (`StatCard`), `p-5` (20px) for `TrendStatCard`, `p-6` (24px, the `Card` default) for section-level cards with headers.

### Stat Card (signature component)
The core building block of every overview tab (`StatCard`, `TrendStatCard`, `CenteredStat`):
- A square icon badge (`h-11 w-11`, `rounded-xl`, flat tint background like `bg-primary/10`, icon colored to match — e.g. `text-primary`) sits beside or above the metric.
- The metric value is Display typography (bold, `text-2xl`–`text-3xl`, `tracking-tight`).
- The label is Label typography in Slate (`text-sm text-muted-foreground`).
- An optional trend badge (`TrendStatCard`) uses the `Badge` `outline` variant with a flat status tint (`bg-green-50 text-green-700`) and a small leading icon (`TrendingUp`, `h-3 w-3`) — never a colored left-border stripe.

### Badges / Tags
- **Style:** `rounded-full`, `text-xs font-semibold`, flat background + matching text color (e.g. `bg-green-50 text-green-700`, dark mode `bg-green-900/30 text-green-400`).
- **State:** trend badges pair a directional icon (`TrendingUp`/`TrendingDown`) with the value; tier/category badges use the category's flat tint pair.

### Navigation (Tabs)
- `TabsList` sits on `bg-muted` (Mist) with `rounded-lg`; the active `TabsTrigger` becomes `bg-card` with `shadow-sm` — the same flat-elevation language as cards, just inverted (active = "lifted" card on a recessed track).

## 6. Do's and Don'ts

### Do:
- **Do** let metric values dominate — bold, `text-2xl`/`text-3xl`, `tracking-tight`, Ink color (`#21242c`).
- **Do** use flat single-tint backgrounds for icon badges, trend badges, and tier containers (`bg-primary/10`, `bg-green-50`, `bg-muted/40`).
- **Do** use `border-border/60` (Hairline) as the default card border for data/stat cards, with `shadow-sm` only.
- **Do** treat `#005761` (Ledger Teal) as the default `--primary` and recompute `--primary-glow`/`--ring` from it if a brand's `theme_color` is ever wired in (the Brand-Themable Primary Rule).
- **Do** keep Signal Violet (`#8135f3`) to a single emphasis element per view.
- **Do** keep all individual-user data aggregated and anonymized in the UI — tier counts and community totals only, per PRODUCT.md's privacy-first principle.

### Don't:
- **Don't** use two-stop gradient fills (`bg-gradient-to-br from-X-50 to-X-100`) on cards, icon badges, or containers — this is the generic SaaS-cream pattern PRODUCT.md explicitly rejects, and the codebase is already removing these.
- **Don't** use the unused `--gradient-*` or `--shadow-elegant`/`--shadow-card`/`--shadow-button` custom properties in `src/index.css` — they're dead legacy tokens from the pre-refactor style.
- **Don't** add drop shadows, glow, or glassmorphism for "depth" — `shadow-sm` + `border-border/60` is the entire elevation vocabulary.
- **Don't** use a colored `border-left`/`border-right` stripe as an accent on cards or list items — use a flat tint or leading icon instead.
- **Don't** let Slate (`#7b899d`) drop below 4.5:1 contrast — it's already near the limit on `#ffffff`; never place it on a tinted card background (`bg-muted`, `bg-{color}-50`) without checking contrast again.
- **Don't** hardcode a brand's color into a specific component — any brand-specific theming flows through `--primary` and its derivatives (see the Brand-Themable Primary Rule).
