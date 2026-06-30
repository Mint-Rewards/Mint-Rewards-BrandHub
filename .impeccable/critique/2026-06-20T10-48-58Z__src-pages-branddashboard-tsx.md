---
target: BrandDashboard
total_score: 20
p0_count: 1
p1_count: 4
timestamp: 2026-06-20T10-48-58Z
slug: src-pages-branddashboard-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Date range picker updates the label but data never changes — the filtering is a functional illusion |
| 2 | Match System / Real World | 2 | "Total Wastage Collected" is non-standard; hardcoded "2-3 business days" and placeholder phone number shipped |
| 3 | User Control and Freedom | 3 | Preview mode has a clear exit; "Exit Dashboard" is accessible; bell button is icon-only with no dismiss |
| 4 | Consistency and Standards | 2 | Two tiers of Tabs with no visual hierarchy difference; 30+ hardcoded color classes bypass the brand dynamic color system |
| 5 | Error Prevention | 2 | "Exit Dashboard" navigates away without confirmation; date range allows any selection silently |
| 6 | Recognition Rather Than Recall | 3 | Tab labels are clear; dual-level tab navigation requires some mental mapping; no breadcrumbs |
| 7 | Flexibility and Efficiency | 1 | No keyboard shortcuts; no export; the only customization (date range) doesn't function |
| 8 | Aesthetic and Minimalist Design | 1 | Hero-metric KPI grid; nested cards; 30+ purple/violet/indigo gradients; persistent non-dismissible welcome banner |
| 9 | Error Recovery | 2 | Load error navigates to "/" (loses context); toast exists for brand fetch; no inline recovery |
| 10 | Help and Documentation | 2 | "Need Help?" in pending view is good; zero contextual help in approved dashboard |
| **Total** | | **20/40** | **Acceptable — significant improvements needed before enterprise users are happy** |

---

## Anti-Patterns Verdict

**Does this look AI-generated?** The OverviewTab is a clear yes. The BrandDashboard shell is substantially cleaner.

**LLM assessment**: The BrandDashboard.tsx shell — the header, the dual pending/approved state, the preview mode — has real design intent behind it. The preview banner, the "What's Next?" checklist, and the structural split between states are smart. But the moment the approved view opens and renders OverviewTab, the aesthetic collapses into the textbook AI scaffold: three identical gradient KPI cards (green → blue → purple), a repeated numbered-circle ranked-list pattern with different gradient fills for each rank, cards nested inside cards, and six chart types on a single tab. Every layout instinct is a training-data default.

**Deterministic scan**: 30+ `ai-color-palette` findings, all in `OverviewTab.tsx`. The detector caught purple-50, purple-100, purple-500, purple-600, purple-700, purple-800, purple-900, indigo-50, and indigo-600 gradients scattered across 20+ locations. These are hardcoded Tailwind utility classes, not design system tokens — meaning they ignore the brand's registered `themeColor` entirely. A brand that registers with `themeColor: "#C00000"` (red) will still see a green KPI card, a blue KPI card, and a purple KPI card in their dashboard. The detector confirms what the LLM review found independently.

**Visual overlays**: Browser injection was not performed (no dev server running in this session). No overlay to show.

---

## Overall Impression

The structural skeleton of BrandDashboard is genuinely well-considered: dual state, preview mode, clean header. But OverviewTab carries the weight of the screen and it's all placeholder — mock data, hardcoded rainbow palette, a date range picker that changes a label but filters nothing. The single biggest opportunity is not cosmetic: **connect the data layer and replace the hardcoded color cascade with design system tokens**. Everything else is polish. Until those two things are addressed, no amount of visual refinement will make this feel like a real product.

---

## What's Working

**1. Dual-state architecture with preview mode.** The PendingApprovalView / ApprovedDashboardView split is the right pattern. The preview mode with its amber banner and "Exit Preview" button is clear and well-executed. Brand managers waiting for approval get meaningful wayfinding rather than a dead end.

**2. "Data earns trust" in the sector comparison.** The sector comparison in the Sector tab (your-brand vs. category-average with explicit percentage deltas) is exactly the right structure. `8.4 tons CO₂ saved — 24% above Technology category average` is a board-deck fact, not a bare metric. This section does what the PRODUCT.md asks for.

**3. Statistics period picker interaction pattern.** The popover date range picker using react-day-picker with a two-month calendar is the right affordance for enterprise analytics. The trigger button showing the current range label, the banner showing "Showing metrics for [range]", and the popover alignment are all correct. The pattern is right; it just needs to be wired to the data.

---

## Priority Issues

**[P0] Date range picker is a functional illusion**
- **What**: The `dateRange` state updates the display label but has zero effect on the data. All charts and KPIs always show the same `mockAnalyticsData` regardless of the selected range.
- **Why it matters**: An enterprise sustainability lead selects Q1 2026 to pull for a board report and sees the same numbers as before. They trust the data is wrong, not the UI. This destroys credibility — the defining quality of the product.
- **Fix**: Either (a) wire the date range to the API query parameters and filter real data, or (b) remove the picker entirely and show a clear "Data shown: last 30 days" static label until filtering is implemented. Never display an interactive control that has no effect.
- **Suggested command**: `/impeccable harden BrandDashboard` (connect to real data) or `/impeccable clarify BrandDashboard` (add clear "coming soon" state to the picker)

**[P1] OverviewTab ignores brand themeColor — hardcoded rainbow palette throughout**
- **What**: `OverviewTab.tsx` uses 30+ hardcoded Tailwind color classes (`from-green-50`, `text-blue-600`, `bg-purple-500`, `text-indigo-600`) instead of design system tokens (`text-primary`, `bg-primary`, `from-primary/10`). The detector found violations at lines 289–1993.
- **Why it matters**: The entire brand identity system — the core architectural feature documented in DESIGN.md — breaks silently. Every brand sees the same green/blue/purple palette regardless of their registered color.
- **Fix**: Replace all hardcoded color utilities in OverviewTab with CSS custom property references (`text-primary`, `bg-primary`, `from-primary/5`, `to-primary/10`). The chart `fill` props should use `hsl(var(--primary))` via a computed value.
- **Suggested command**: `/impeccable colorize OverviewTab` (replace hardcoded palette with token-based system colors)

**[P1] Hero-metric KPI cards — absolute banned pattern**
- **What**: Three cards in a grid, each with a gradient background (green, blue, purple), a colored icon, a 2xl bold number, and a small label (`OverviewTab.tsx:289–385`). This is the verbatim "hero-metric template" from the absolute bans.
- **Why it matters**: "15.6K kg" in a green gradient card is the pattern that PRODUCT.md explicitly rejects as "generic SaaS." It undermines the credibility register the product requires, and it shows placeholder numbers without context (no comparator, no trend, no real-world equivalent).
- **Fix**: Replace with a compact stat row or a structured table showing each metric with its comparator and trend. "15.6K kg collected this period — +22% vs Technology category average" is a contextualised fact. A gradient card with "15.6K kg" is not.
- **Suggested command**: `/impeccable layout OverviewTab` (restructure KPI display)

**[P1] Nested cards in Brands tab and Sector section**
- **What**: `OverviewTab.tsx:1244–1289` — a Card wraps a `grid-cols-4` of 4 inner Cards. `OverviewTab.tsx:1396–1452` — same pattern in the Sector tab with performanceMetrics. These are cards inside cards, which DESIGN.md explicitly bans.
- **Why it matters**: Nested cards create visual noise, force the eye to parse multiple elevation levels, and make the grid feel cramped on smaller screens.
- **Fix**: Replace the inner cards with a simple responsive stat row (4-column grid of div containers with border-b or nothing) or a table. The outer card provides the container; the inner cells don't need independent elevation.
- **Suggested command**: `/impeccable layout OverviewTab` (flatten nested card grid)

**[P1] `text-warning` (amber) fails contrast on white and warning/10 backgrounds**
- **What**: The preview mode banner uses `text-warning` (`hsl(38, 92%, 50%)` ≈ `#F59E0B`) on `bg-warning/10` and the pending state card uses `text-warning` on `bg-warning/5`. Amber at 50% lightness against near-white fails WCAG AA at 14px text (~2.9:1 ratio).
- **Why it matters**: The preview mode banner is the single most important piece of communication on that screen — it tells brand managers they're seeing a preview. If it fails contrast, color-sensitive users miss it.
- **Fix**: Use `text-amber-800` (`#92400E`, ~1.8% L) on amber-tinted backgrounds for body text. Reserve `text-warning` for 18px+ or bold 14px+ text only.
- **Suggested command**: `/impeccable audit BrandDashboard` (full a11y contrast check)

---

## Persona Red Flags

**Alex (Power User / Enterprise Sustainability Lead)**
Walking through: "I need CO₂ savings for Q1 2026 for our board report."

- Finds the Statistics Period picker. Selects January 1 – March 31 2026. Numbers don't change. Selects different dates. Still same numbers. Assumes the tool is broken or the API is slow and waits.
- Wants to export or copy the CO₂ comparison table. No export button anywhere in the interface.
- Tries keyboard navigation through tabs. `Tab` key doesn't cycle between dashboard tabs in the expected order.
- Finds "tons CO₂ Saved" in the KPI card: `8.4 tons`. No comparator, no period label, no category average. Is this good or bad? Can't tell from the card.

**Jordan (First-Time Brand Manager)**
Walking through: "I just got approved — what should I do first?"

- Approved state loads. Big "Welcome to MintRewards Brand Management!" banner. Reads it. No CTA, no "start here" button. Doesn't know what to do.
- Sees "Overview / Campaigns / Deals / Settings" tabs. Clicks "Campaigns." Sees a campaigns list (or empty state). Wants to create a campaign but isn't sure where to click.
- Returns to Overview. Sees charts and numbers. "15.6K kg" — doesn't know if this is their brand's data or platform data. The heading says "Total Wastage Collected" — collected by whom? By everyone? Just them?
- Date picker appears interactive. Clicks it. Selects a date range. Numbers don't change. Confused.

**Sam (Sustainability Manager — project-specific persona)**
Enterprise user who screenshots dashboards for board decks. Uses standard browser, occasionally accesses from mobile to check quickly.

- Bell button in header has no `aria-label`. Screen reader announces "button" with no context.
- KPI cards convey state through background color only (green = good, blue = neutral, purple = different). Color-only meaning is an accessibility failure.
- On mobile (375px), the `grid-cols-3` KPI row either scrolls horizontally or stacks. Card content is unaffected but density increases. Progress bars in the sector comparison section are 3px high — too small for motor-impaired touch users.

---

## Minor Observations

- `<Button variant="ghost" size="sm"><Bell className="h-4 w-4" /></Button>` at `BrandDashboard.tsx:386` has no `aria-label`. Add `aria-label="Notifications"`.
- `PendingApprovalView` and `ApprovedDashboardView` are defined as closures inside `BrandDashboard`. React treats each new function reference as a new component type and will fully unmount/remount their subtrees on every parent render. Move them to named exports or extract to a separate file.
- `AnalyticsDashboard` component is also defined inline inside `OverviewTab.tsx`. Same remounting issue.
- "Estimated Approval: 2-3 business days" is hardcoded in `formattedData.estimatedApproval`. This should come from the API or a configurable constant, not a string literal in the component.
- The "Welcome to MintRewards Brand Management!" success card (`BrandDashboard.tsx:308–324`) appears on every approved session visit. Consider dismissing it after first view (local storage flag) or removing it entirely once the user has been approved for > 24h.
- Placeholder contact phone `+1 (555) 123-4567` in `PendingApprovalView` (`BrandDashboard.tsx:266`) should be replaced with a real number before production.
- `--transition-bounce: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)` in `index.css:61` — bounce/elastic easing is in the absolute bans. Remove or replace with `ease-out-expo` if needed.
- Commented-out tabs (`{/* <TabsTrigger value="users"> */}`, `{/* <TabsTrigger value="sector"> */}`) should be removed from the codebase or moved to a feature flag. Dead HTML in production output is confusing.
