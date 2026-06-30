---
name: MintRewards BrandHub
description: Partner brand management portal for the MintRewards sustainability platform.
colors:
  platform-teal: "#005660"
  precision-violet: "#8135F3"
  brand-dynamic: "#3B82F6"
  bg-base: "#FCFCFC"
  ink-primary: "#21242C"
  surface-muted: "#F3F5F7"
  ink-muted: "#7B8999"
  border-subtle: "#E0EBE4"
  state-success: "#16A249"
  state-warning: "#F59E0B"
  state-error: "#EF4444"
typography:
  headline:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  title:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  caption:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-brand:
    backgroundColor: "{colors.brand-dynamic}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "10px 16px"
  button-brand-hover:
    backgroundColor: "{colors.brand-dynamic}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "10px 16px"
  button-platform:
    backgroundColor: "{colors.platform-teal}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "10px 16px"
  button-outline:
    backgroundColor: "{colors.bg-base}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.lg}"
    padding: "10px 16px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.lg}"
    padding: "10px 16px"
  input-default:
    backgroundColor: "{colors.bg-base}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  card-default:
    backgroundColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
---

# Design System: MintRewards BrandHub

## 1. Overview

**Creative North Star: "The Accountability Ledger"**

BrandHub is where sustainability claims become documented fact. It combines the institutional authority of a certification board, the precision of an impact ledger, and the navigable clarity of a field report. A brand manager must be able to pull CO₂ savings for a quarterly board deck in under two minutes. An enterprise sustainability lead must trust what they see. The aesthetic IS the audit trail: structured, navigable, and built to survive a screenshot.

The system rejects two failure modes with equal force. First: the greenwashing aesthetic — leaf icons, earth-tone gradients, stock-photo warmth — where the design substitutes for the data. BrandHub's sustainability credibility comes from numbers in context, not from a green palette that performs eco-consciousness. Second: the generic SaaS scaffold — hero metric cards, cool-blue palette, identical card grids repeated page after page — that announces "this was built from a template." BrandHub must be unmistakably built for brands that take ESG impact seriously, not for a generic B2B dashboard market.

Color strategy is restrained. The platform's Certification Teal appears only in global navigation, platform-level CTAs, and the registration flow. Inside a brand dashboard, the CSS `--primary` variable is dynamically replaced by the brand's own registered `themeColor`. Each dashboard becomes a credible extension of the brand's identity; the Teal steps aside. The Precision Violet accent marks the platform's interactive layer — secondary actions, focus states, the gradient CTA.

**Key Characteristics:**
- One typeface family, in multiple weights only — system-ui for zero latency and native rendering at any DPI
- Platform teal for platform context; brand color for brand dashboard context — never compete
- Three named shadows, each with a specific structural role; decorative elevation is prohibited
- Every metric shown with context: no bare KPIs, always a comparator or real-world equivalent
- Standard affordances throughout — dropdowns, modals, inputs, buttons all follow platform conventions

## 2. Colors: The Two-Layer Palette

The palette operates at two layers: the platform identity layer and the brand identity layer. These never compete — they alternate by context.

### Primary

- **Certification Teal** (`#005660`): MintRewards platform identity. Appears in the global navigation logo mark, platform-level primary buttons (e.g. "Register Brand" on the Index page), and platform chrome that persists across all contexts. Never used as a fill inside brand dashboards — the brand's own color takes that role.

### Secondary

- **Precision Violet** (`#8135F3`): The platform's interactive accent. Used for the gradient button variant (which spans Teal → Violet for promotional moments in the registration flow), secondary CTA states, and focus-ring contrast. Appears on ≤10% of any given screen. Not used as a background fill or decorative tint.

### Tertiary

- **Brand Dynamic** (`#3B82F6` default, overridden per brand): The CSS `--primary` variable inside brand dashboard contexts. Set from the brand's registered `themeColor` at runtime. The default (`#3B82F6`) is only a fallback for rendering before a brand's data loads — it should never appear in production for an approved brand.

### Neutral

- **Ink Primary** (`#21242C`): All body text, headings, and data labels. Near-black with a slight blue-grey cast for legibility at small sizes.
- **Ink Muted** (`#7B8999`): Supporting text, metadata, timestamp labels, placeholder text. Verified at ≥4.5:1 on `bg-base`.
- **Surface Base** (`#FCFCFC`): Page background. Pure near-white; no warm tint.
- **Surface Muted** (`#F3F5F7`): Secondary surface for sidebars, table alternating rows, and tab panels. Slightly cool-grey.
- **Border Subtle** (`#E0EBE4`): Card borders, dividers, and input strokes. Green-tinted at hue 139° to harmonise with the platform's green heritage without asserting it.

### State Palette

- **Success** (`#16A249`): Approved status, completed actions, positive trends.
- **Warning** (`#F59E0B`): Pending review, under-threshold metrics, time-sensitive alerts.
- **Error** (`#EF4444`): Rejected status, validation failures, destructive action confirmation.

### Named Rules

**The Dynamic Brand Rule.** Inside any `/dashboard/:brandId` route, the platform's Certification Teal must not appear as a fill color. Navigation chrome, the "Exit Dashboard" action, and platform-level badges (e.g. "Active" / "Pending") retain platform conventions, but all primary fills inside the dashboard content area use the brand's `themeColor`. The dashboard is the brand's space; the platform is a frame.

**The One Accent Rule.** Precision Violet is used in two places only: the gradient button variant and secondary interactive states (focus rings, selected tab underlines). Never as a background, a card tint, a section header color, or any decorative element. Its rarity is the point — it marks moments of platform-layer interaction.

## 3. Typography

**Body Font:** system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

A single sans-serif family in multiple weights. No custom typeface, no Google Fonts — system-ui renders at native resolution on every device, carries zero latency, and signals the tool-not-product register. Enterprise sustainability teams using this on high-DPI displays and Windows enterprise machines get the same clarity everywhere. The brand's credibility comes from data precision, not typographic personality.

**Character:** Precise, dense, legible. The type system carries large amounts of analytics data — CO₂ figures, kg weights, percentage comparisons — without becoming cramped. Tight scale (1.25 step ratio), consistently weighted labels, and restrained letter-spacing keep tables and charts readable at a glance.

### Hierarchy

- **Headline** (700, 20px, line-height 1.3, -0.01em letter-spacing): Page titles and major section headers. Used sparingly — one per view.
- **Title** (600, 16px, line-height 1.4): Card titles, tab labels, named sections within a view.
- **Body** (400, 14px, line-height 1.5): All prose, descriptions, and data context text. Cap line length at 65ch for readability in multi-column layouts.
- **Label** (500, 14px): Field labels, table column headers, button text, navigation links.
- **Caption** (400, 12px): Metadata, timestamp suffixes, chart axis labels, supporting context under KPI values.

### Named Rules

**The Single Family Rule.** No second typeface is permitted, not even for data visualization. Monospace for code or command strings is the only exception, and only if code appears in the interface (it currently does not). Introducing a display or serif creates a register mismatch that undermines the tool-like credibility this surface requires.

**The Context Requirement.** A number without a unit, a comparator, or a time frame is prohibited. "8.4" means nothing. "8.4 tons CO₂ saved — 24% above category average" is a fact. Apply this rule to every KPI, metric card, and chart tooltip.

## 4. Elevation

Purposeful and structural. Depth is used to separate layers, not to decorate surfaces. Three named shadows, each with a specific context. At rest, surfaces are flat; elevation is a state response, not a design choice.

### Shadow Vocabulary

- **shadow-card** (`0 4px 20px -4px rgba(33, 36, 44, 0.08)`): Soft ambient. Applied to card containers that sit on the `bg-base` surface. Not applied to list items, table rows, or inline components. The default resting state for contained content groups.
- **shadow-button** (`0 2px 8px -2px rgba(var(--primary-rgb), 0.3)`): Brand-color-tinted. Appears only on hover of the primary brand button, dynamically colored to the brand's registered `themeColor`. Never at rest.
- **shadow-elegant** (`0 10px 40px -10px rgba(var(--primary-rgb), 0.15)`): Brand-tinted. Used for modal/dialog overlays and the featured "Preview Dashboard" card. Signals elevated context, not decoration.

### Named Rules

**The Flat-By-Default Rule.** No shadow at rest except `shadow-card` on explicit card containers. List items, table rows, tab panels, and inline components are flat. A surface with a shadow is making a claim about its importance in the hierarchy — most elements don't qualify.

**The Tinted Shadow Rule.** `shadow-button` and `shadow-elegant` use the current `--primary` (brand color in dashboard contexts, platform teal elsewhere). The shadow inherits the brand identity. Hardcoded colored shadows are prohibited; they would create visual noise when the brand color changes.

## 5. Components

Components are structured and legible. The vocabulary is identical across the entire surface — same button shapes, same input strokes, same card radii — so users build mental models from the first screen and never have to re-learn.

### Buttons

**Shape:** Gently curved (10px radius, all variants). Height is always 40px for default, 36px for sm, 44px for lg. No square or pill variants.

- **Brand Primary:** Brand `themeColor` fill, white text, 16px horizontal padding. `shadow-button` on hover. Used for the primary CTA within a brand dashboard. Changes color per brand.
- **Platform Primary:** Certification Teal (`#005660`) fill, white text, same geometry. Used only in platform-level contexts: global navigation actions, the registration submit button, the Index page CTA.
- **Gradient:** Diagonal gradient from Certification Teal to Precision Violet. Used exclusively for the "Preview Dashboard" promotional moment and any major one-per-page promotional CTA. Not a general-purpose button.
- **Outline:** 1px border (`border-subtle`), white background, `ink-primary` text. Hover reveals `surface-muted` fill and `shadow-card`. Secondary actions alongside a primary.
- **Ghost:** No border, no background. `ink-primary` text. Hover reveals `surface-muted`. Navigation-level and tertiary actions, icon-button adjacents.

**Focus:** All variants use a 2px outline at `platform-teal` (the platform layer's focus color, not the brand color) at `outline-offset: 2`.

### Inputs / Fields

**Style:** 1px `border-subtle` stroke, `bg-base` fill, 8px radius (md), 12px horizontal padding, 40px height.

- **Focus:** Border shifts to `platform-teal`, `box-shadow: 0 0 0 2px rgba(0,86,96,0.2)`.
- **Error:** Border shifts to `state-error`, `box-shadow: 0 0 0 2px rgba(239,68,68,0.15)`. Error message in `state-error` at caption size, below the field.
- **Disabled:** 50% opacity, `cursor: not-allowed`.
- **Placeholder:** `ink-muted` color. Verified at 4.5:1 against `bg-base`.

### Cards / Containers

**Corner Style:** Gently curved (10px radius, matching buttons for vocabulary consistency).
**Background:** White (`#ffffff`), distinct from `bg-base` to lift from the page.
**Shadow Strategy:** `shadow-card` always. No additional elevation on hover unless the card is interactive (a clickable card adds `shadow-elegant` on hover, cursor pointer).
**Border:** 1px `border-subtle`. Present on all cards. Not omitted "for minimalism."
**Internal Padding:** 24px (`spacing.lg`) default. 16px (`spacing.md`) for compact/dashboard stat cells.

**Nested Cards are prohibited.** A card inside a card is always wrong — restructure into a table, a definition list, or a grouped section within the outer card.

### Navigation (Dashboard Header)

**Style:** Sticky top bar, 64px height, `bg-base` at 80% opacity with `backdrop-filter: blur(12px)`. 1px `border-subtle` bottom edge. z-index 40.

- **Logo mark:** 36×36px rounded square (8px radius) in Certification Teal, white icon inside.
- **Brand name:** Title weight (600, 16px).
- **Status badge:** Inline, right-aligned. `state-success` fill for Active, `state-warning` for Pending. Pill shape (6px radius), 12px caption.
- **Navigation actions:** Ghost buttons only in the header — Bell (icon), Exit Dashboard (label).

### Status Badges

**Pending:** `state-warning` 10% opacity background, `#B45309` text.
**Approved / Active:** `state-success` 10% opacity background, `#15803D` text.
**Rejected:** `state-error` 10% opacity background, `#B91C1C` text.

Pill shape, 6px radius, caption size (12px), medium weight. No icons. Status is communicated by color + text, not by icon alone, for accessibility.

### Analytics Period Selector (Signature Component)

The Statistics Period banner atop the analytics dashboard is a branded interaction point — a date-range picker wrapped in the platform's gradient border.

**Container:** `bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10`, 1px `primary/20` border, 10px radius, 16px padding.
**Trigger button:** Outline variant with a CalendarIcon prefix. Displays the selected range as a label. Opens a 2-month `react-day-picker` calendar in a Popover aligned to the right edge.
**Selected range display:** `ink-primary` for the date string, `primary` color for emphasis.

This component serves both enterprise users (who need custom reporting windows) and brand managers (who want month-to-date defaults). Default: first of current month to today.

## 6. Do's and Don'ts

### Do:

- **Do** use Certification Teal (`#005660`) for global navigation, the registration CTA, and platform-level primary buttons only. Defer to the brand's `themeColor` for all fills inside `/dashboard/:brandId` routes.
- **Do** show every metric with a denominator, a comparison, or a real-world equivalent. "8.4 tons CO₂ saved — 24% above category average in Technology" is a fact. "8.4 tons" is not.
- **Do** apply `shadow-card` to card containers. Keep list items, table rows, and inline elements flat.
- **Do** verify all body and caption text at ≥4.5:1 contrast on their background. `ink-muted` (`#7B8999`) on `bg-base` (`#FCFCFC`) passes; do not lighten it further.
- **Do** use the system-ui font stack. Do not introduce web fonts, even for headings.
- **Do** give every interactive element a visible keyboard focus state using the 2px `platform-teal` outline.
- **Do** use the Status Badge component for brand status (Pending / Active / Rejected) — text + background tint, no icons, always caption size.

### Don't:

- **Don't** use the hero-metric template (big number + small label + gradient accent card). This is an absolute ban. Rewrite metric displays to include context inline.
- **Don't** build identical card grids (same-sized cards with icon + heading + text, repeated). Vary presentation: use tables for comparable data, definition lists for structured facts, and cards only when content is genuinely self-contained.
- **Don't** use the generic SaaS scaffold — cool-blue primary, identical card grids, gradient-to-white hero sections. BrandHub's identity comes from data precision, not from a familiar B2B aesthetic template.
- **Don't** use leaf icons, earth-tone gradients, or stock-photo eco imagery to signal sustainability. The platform's sustainability credibility comes from the metrics, not the palette.
- **Don't** use Precision Violet as a background fill, section tint, or decorative element. It marks the platform's interactive layer only — gradient buttons and focus rings.
- **Don't** use gradient text (`background-clip: text` + gradient background). Single solid color only.
- **Don't** use side-stripe borders (`border-left` or `border-right` > 1px as a colored accent). Rewrite with background tints or full borders.
- **Don't** use glassmorphism decoratively. `backdrop-filter: blur()` is permitted on the sticky navigation header only.
- **Don't** apply `shadow-button` or `shadow-elegant` at rest. Shadows on these elements appear as hover/state responses only.
- **Don't** introduce a second typeface. Not for data visualization, not for section kickers, not for "personality."
- **Don't** place a card inside a card. Restructure the content.
