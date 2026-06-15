# Product

## Register

product

## Users

Brand-side stakeholders at companies participating in the Mint Rewards recycling/sustainability program, viewing their own brand's analytics dashboard:

- **Sustainability managers** — need precise, reportable environmental metrics (waste collected by material, CO₂ savings) for stakeholder reporting and goal tracking.
- **Marketing teams** — need campaign and deal performance data to optimize rewards offerings and measure ROI.
- **Executive leadership** — need high-level strategic views: sector benchmarking, growth projections, competitive positioning.

Context: used in office/desktop settings, periodically (weekly/monthly review cadence) rather than continuously. Users are reviewing their own brand's data only — there is no cross-brand or individual-user PII visible.

## Product Purpose

Mint Rewards Brand Hub is a sustainability analytics and brand management platform for companies in environmental recycling/rewards programs. It turns raw collection and engagement data into:

- Environmental impact tracking (waste by material, CO₂ savings, equivalents like trees planted)
- User community engagement insights (tiers, retention, growth) — fully anonymized/aggregated
- Campaign and deal performance analytics
- Sector benchmarking against category averages (confidential, non-identifiable competitor data)
- Forward-looking projections (3-month / 6-month / year-end forecasts) for strategic planning

Success looks like a brand manager opening a tab and immediately understanding "where do we stand and what should we do next" — without needing to interpret raw numbers themselves.

## Brand Personality

**Professional, data-forward, calm.** Precision and trustworthiness carry the design — this is a B2B analytics tool where credibility matters more than visual flair. The mint-green primary identity should feel grounded and confident (sustainability as serious business performance, not a lifestyle gimmick), with the purple accent reserved for deliberate emphasis.

Tone: clear, declarative, confident. Numbers and trends are the hero, not decorative gradients or oversized hero stats.

## Anti-references

- **Generic SaaS-cream dashboards** — the saturated AI-default look (warm near-white body bg, gradient-text hero metrics, identical icon+stat card grids repeated across every tab). This dashboard already has a mint-green/purple identity; lean into that instead of defaulting to neutral cream.
- Gradient backgrounds on icon badges / stat cards as a substitute for real hierarchy (seen in the pre-refactor `StatCard`, now corrected to tinted flat badges — keep that direction).
- Dense, cramped financial-terminal layouts — keep breathing room even though the content is data-heavy.

## Design Principles

1. **Privacy-first by design** — every view must reflect that individual user data is never exposed; community/user metrics are always aggregated and anonymized. This isn't just a backend rule, it should read clearly in the UI (e.g., tier counts, not names).
2. **Numbers are the hero, restraint is the style** — let the data carry visual weight through typography and layout, not gradients or decoration. Tinted flat accents (icon badges, trend indicators) over gradients/glass.
3. **Each tab answers "so what?"** — Impact, Users, Sector, Projections etc. should each surface a clear takeaway or action, not just raw charts (benchmarks vs. average, growth opportunities, seasonal factors).
4. **One consistent stat-card vocabulary** — StatCard, TrendStatCard, CenteredStat and similar primitives should stay visually consistent across all overview tabs so the dashboard reads as one system, not six different screens.
5. **Calm, professional color use** — mint-green primary signals trust/sustainability credibility; purple accent and semantic colors (success/warning/destructive) are used deliberately for status and trends, not as default decoration.

## Accessibility & Inclusion

- Target **WCAG 2.1 AA** for contrast and interaction (this is the default for the dashboard's data-heavy, text-driven surfaces).
- Body text and stat labels must meet ≥4.5:1 contrast against their backgrounds — particularly muted-gray text on tinted card backgrounds.
- Respect `prefers-reduced-motion` for any chart/tab transitions or hover animations.
