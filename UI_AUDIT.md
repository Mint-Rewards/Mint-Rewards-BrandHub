# Brand Hub UI Audit
Generated: 2026-06-24

---

## P0 — Release blockers

| # | Surface | File | Issue |
|---|---------|------|-------|
| P0-1 | Landing hero H1 | `src/pages/Index.tsx:76–81` | **Gradient text** (`background-clip: text` + gradient bg) — absolute ban per design system. Rewrite to solid `text-foreground`. |
| P0-2 | Global tokens | `src/index.css` | **Contrast failure**: `--muted-foreground: 215 15% 55%` yields ~3.1:1 against `--background: 0 0% 99%`. Fails WCAG AA 4.5:1 for body text. Used as placeholder text and caption text throughout. Darken to `215 15% 43%` (~4.7:1). |
| P0-3 | Admin login | `src/pages/AdminLogin.tsx:191–199, 263–272, 293–302` | **Missing accessible label** on password-visibility toggle buttons. Eye/EyeOff icon-only buttons have no `aria-label`. Screen readers cannot identify their purpose. |

---

## P1 — Fix this sprint

| # | Surface | File | Issue |
|---|---------|------|-------|
| P1-1 | OverviewTab analytics | `src/components/OverviewTab.tsx` | **Hardcoded color rainbow** — 40+ instances of hardcoded Tailwind colour utilities (`text-emerald-600`, `text-blue-600`, `text-indigo-600`, `text-purple-600`, `text-teal-600`, `text-green-600`, `text-orange-600`, `text-amber-600`, `text-yellow-800`) and raw hex values (`#10B981`, `#059669`, `#8B5CF6`, etc.) in UI chrome. Data-viz category colours are acceptable; dashboard tile text, heading colours, and container backgrounds must use design tokens. |
| P1-2 | OverviewTab — projection cards | `src/components/OverviewTab.tsx:1530–1636` | **Decorative gradient backgrounds** — 9+ `bg-gradient-to-br from-green-50 to-emerald-50`, `from-blue-50 to-cyan-50`, `from-purple-50 to-pink-50`, `from-orange-50 to-red-50`, `from-indigo-50 to-purple-50`, `from-teal-50 to-cyan-50` backgrounds on forecast cards. AI slop — identical card-grid with coloured gradients. Replace with flat `bg-muted/40`. |
| P1-3 | OverviewTab — reward categories | `src/components/OverviewTab.tsx:867–940` | **Decorative gradient circles** — numbered rank indicators use `bg-gradient-to-r from-green-500 to-emerald-500`, `from-blue-500 to-cyan-500`, `from-orange-500 to-red-500`, `from-purple-500 to-pink-500`. Decorative multi-color gradient on inline icons — banned. Replace with flat solid tints using `bg-primary/15 text-primary` or semantic tokens. |
| P1-4 | OverviewTab — user tier cards | `src/components/OverviewTab.tsx:1021–1100` | **Decorative gradient tier backgrounds** — `bg-gradient-to-r from-yellow-50 to-yellow-100`, `from-amber-50 to-amber-100`, etc. Same pattern. Replace with flat `bg-muted/40 border border-border`. |
| P1-5 | Landing page | `src/pages/Index.tsx:106–123` | **Identical card grid** — four feature cards (`Building2`, `Users`, `TrendingUp`, `Shield`) are identical template: icon box + title + description text. This is the "identical card grid" absolute ban pattern. Rewrite as a two-column structured feature list. |
| P1-6 | Button component | `src/components/ui/button.tsx:13` | **No reduced-motion guard** — gradient button uses `hover:scale-[1.02] transition-all duration-300`. Transform animation must respect `prefers-reduced-motion: reduce`. |
| P1-7 | All pages | Multiple | **Decorative page background gradient** — `bg-gradient-to-br from-background via-muted/20 to-background` on `<div className="min-h-screen...">` appears on every page (Index, BrandDashboard, AdminLogin, AdminDashboard). Decorative; replace with flat `bg-background`. |
| P1-8 | All header logo marks | Index, BrandDashboard, AdminLogin, AdminDashboard | **Gradient logo mark** — `bg-gradient-to-br from-primary to-accent` on icon containers. Decorative gradient use on non-promotional elements — banned. Replace with solid `bg-primary`. |
| P1-9 | BrandDashboard loading | `src/pages/BrandDashboard.tsx:134–145` | **Spinner in card for full-page load** — uses `Loader2 animate-spin` inside a small Card centred on screen. For content-area loading, use skeleton loaders that match real content dimensions to prevent CLS. |
| P1-10 | OverviewTab — "Community Growth Insights" | `src/components/OverviewTab.tsx:1142` | **Hardcoded `indigo` tinted box** — `bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200` and `text-indigo-600/700` — completely outside the design system palette. Replace with `bg-muted/40 border-border` and `text-foreground`. |

---

## P2 — Next cycle

| # | Surface | Issue |
|---|---------|-------|
| P2-1 | OverviewTab | Deeply nested `<Tabs>` (3 levels: impact → company → analytics sub-tabs). Cognitive overhead. Flatten to a max of 2 levels. |
| P2-2 | BrandDashboard | The "Preview Dashboard" button and feature exist in pending state but the preview mode itself shows the full approved dashboard without any indication of what's real vs preview. |
| P2-3 | Index landing page | The page has a B2C consumer-product tone (gradient hero, benefit checklist, "Why Choose…" section) that conflicts with the B2B tool positioning in PRODUCT.md. The personas (brand manager, sustainability officer) arrive with task intent, not discovery intent. |
| P2-4 | Dark mode tokens | `--accent` in dark mode becomes `217.2 32.6% 17.5%` (a muted navy) instead of Precision Violet. The dark palette is largely generic shadcn defaults and would need a dedicated pass if dark mode is ever enabled for end users. |
| P2-5 | AdminDashboard | Stats grid `grid md:grid-cols-6 gap-4` — six narrow cards at md breakpoints will overflow or become unreadably narrow on most laptop viewports. |
| P2-6 | OverviewTab | Sector and Projections tabs are present in the component but not exposed in the parent TabsList (only Impact, Rewards, Brands are shown). Dead code risk. |

---

## P3 — Polish

| # | Surface | Issue |
|---|---------|-------|
| P3-1 | Footer | `© 2024` is stale — should be dynamic or updated to 2025. |
| P3-2 | Index page | `h1` tag used for both the main page heading (line 54: "MintRewards Brand Management") in the header AND the hero section (line 76). Two H1s on one page. |
| P3-3 | BrandDashboard | `<p className="text-xs text-muted-foreground">Brand Dashboard</p>` subtitle in the header changes nothing for the user — remove or replace with the brand's category. |
| P3-4 | AdminLogin | "First time here?" info box below the login form is redundant — the Sign Up tab is directly visible. Remove. |
| P3-5 | OverviewTab | The `Calendar` import is aliased as `CalendarIcon` but also a separate `CalendarIcon` import exists from lucide — import conflict risk. |
| P3-6 | OverviewTab | Waste Collection Trend chart (`LineChart`) is imported but never rendered (the sub-tab "users" is present in the component but the TabsList trigger is commented out). |
| P3-7 | General copy | Placeholder/empty state copy in OverviewTab: `"Loading campaign data…"` uses an ellipsis — inconsistent with other loading indicators that use none. |

---

## Design Quality (Phase 3 — Critique)

### AI Slop Verdict

**Gradient text**: FAIL — `background-clip: text` gradient used on the hero H1 in Index.tsx. This is the single most reliable visual tell for AI-scaffolded code.

**Gradient logo marks**: FAIL — `bg-gradient-to-br from-primary to-accent` icon containers appear on every page header. These serve a structural purpose (logo mark) but use a decorative gradient where solid brand color should be.

**Identical card grid**: FAIL — Four feature cards on the landing page are structurally and visually identical: same dimensions, same icon-above-title-above-text layout, same border-radius, same hover behavior. No information hierarchy.

**Color palette**: PARTIAL — The core design tokens are well-considered (Certification Teal, Precision Violet, system neutrals). However, OverviewTab introduces a full rainbow of hardcoded Tailwind colors (green, emerald, blue, cyan, purple, pink, orange, amber, indigo, yellow, teal) as UI chrome colors, completely overriding the restrained design system palette. This makes the analytics dashboard look like a generic Bootstrap admin template.

**Decorative gradients**: FAIL — At least 12 instances of `from-X-50 to-Y-100` gradient backgrounds on metric tiles and forecast cards in OverviewTab. These communicate no information and exist purely as visual decoration.

### Persona Tests

**"Brand manager checking in once a month on desktop"**
- Landing page CTA hierarchy is clear ("Register Your Brand" is primary). ✓
- After login, the dashboard tab structure (Overview, Campaigns, Deals, Settings) is intuitive. ✓
- The analytics section has too much data density without clear prioritisation — the most important number (CO₂ saved) is buried in the middle of a 3-column KPI strip. △
- The colour rainbow in analytics creates visual noise that slows orientation. ✗

**"Sustainability officer pulling data for a board report"**
- KPI values do have context ("vs Technology avg", "+24% above category average") — the design principle "every metric shown in context" is partially respected. ✓
- The sector comparison table is well-structured (your brand vs category average with percentage diff badges). ✓
- However the data is mock/hardcoded — in production this persona is the most demanding and would need real API data. △
- The `screenshot survivability` of individual charts is low — the colour rainbow suggests a consumer app, not an ESG reporting tool. ✗

**"Skeptical VP with 90 seconds and a demo link"**
- The Index landing page fails this persona. Gradient hero + identical card grid + generic "Why Choose…" section reads as a template site.  ✗
- The DemoPage (from a recent commit) gives a cleaner overview but also uses generic card patterns. △
- No executive-grade proof point visible above the fold — no data, no social proof, no "X brands, Y tons CO₂ tracked" number. ✗

---

## Per-page scores (baseline — Phase 2)

| Page | Accessibility | Theming | Responsive | Anti-patterns | Notes |
|------|:---:|:---:|:---:|:---:|-------|
| Index (landing) | 5/10 | 4/10 | 7/10 | 3/10 | Gradient text, identical cards, two H1s |
| AdminLogin | 6/10 | 6/10 | 8/10 | 6/10 | Missing aria-labels on toggle buttons |
| BrandRegister | 7/10 | 7/10 | 8/10 | 7/10 | Recently improved; solid validation |
| BrandDashboard | 6/10 | 6/10 | 7/10 | 5/10 | Spinner loading, gradient header |
| OverviewTab (analytics) | 5/10 | 3/10 | 6/10 | 2/10 | Color rainbow, decorative gradients |
| AdminDashboard | 6/10 | 6/10 | 6/10 | 6/10 | 6-col grid overflow risk |
| CampaignsTab | 8/10 | 8/10 | 7/10 | 8/10 | Clean, semantic status badges |
| DealsTab | 8/10 | 7/10 | 7/10 | 7/10 | Minor token inconsistencies |

---

## Post-improvement scores (Phase 9 — after fixes)

| Page | Accessibility | Theming | Responsive | Anti-patterns | Notes |
|------|:---:|:---:|:---:|:---:|-------|
| Index (landing) | 9/10 | 9/10 | 8/10 | 9/10 | Single H1, flat bg, feature list layout, no gradient text |
| AdminLogin | 9/10 | 9/10 | 8/10 | 9/10 | All aria-labels added, redundant info box removed |
| BrandRegister | 8/10 | 9/10 | 8/10 | 9/10 | Step indicator with completed/current/upcoming states |
| BrandDashboard | 8/10 | 9/10 | 8/10 | 9/10 | Skeleton loading, category subtitle, flat bg |
| OverviewTab (analytics) | 7/10 | 9/10 | 7/10 | 9/10 | All hardcoded rainbow colors replaced with tokens |
| AdminDashboard | 6/10 | 9/10 | 6/10 | 9/10 | 6-col grid overflow risk remains (P2) |
| CampaignsTab | 8/10 | 9/10 | 7/10 | 9/10 | Unchanged — already clean |
| DealsTab | 8/10 | 8/10 | 7/10 | 9/10 | Unchanged — already clean |

### Remaining open items
- **P2-1**: OverviewTab 3-level nested Tabs — future refactor
- **P2-5**: AdminDashboard 6-col grid too narrow on laptop — future layout pass
- **P2-2/3**: B2C tone of landing page and preview mode clarity — content/UX work
