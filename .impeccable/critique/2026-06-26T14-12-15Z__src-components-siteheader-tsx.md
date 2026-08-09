---
target: the header components
total_score: 25
p0_count: 0
p1_count: 1
timestamp: 2026-06-26T14-12-15Z
slug: src-components-siteheader-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Admin badge; BrandDashboard Active/Pending; Bell has no unread count |
| 2 | Match System / Real World | 3 | "Exit Dashboard", "Admin Login", "Logout" natural; "Get Started" borderline generic |
| 3 | User Control and Freedom | 3 | "Exit Dashboard" clear; logo is not a home link on any surface |
| 4 | Consistency and Standards | 2 | Admin uses shadcn Badge; BrandDashboard uses raw span with inline style for status |
| 5 | Error Prevention | 3 | Logout no confirm (acceptable); no destructive actions in headers |
| 6 | Recognition Rather Than Recall | 3 | All text-labeled actions; Bell is icon-only |
| 7 | Flexibility and Efficiency | 2 | No skip-to-content link; logo not clickable home shortcut |
| 8 | Aesthetic and Minimalist Design | 3 | Clean; BrandDashboard accent line good brand touch |
| 9 | Error Recovery | 2 | No error states; logout irreversible without confirm |
| 10 | Help and Documentation | 1 | No contextual help |
| **Total** | | **25/40** | **Acceptable** |

## Anti-Patterns Verdict

**LLM assessment**: No AI slop in headers — structural components, not design surfaces. DESIGN.md explicitly permits glassmorphism on sticky nav; it's used correctly. BrandDashboard accent line is a well-executed brand touch.

**Deterministic scan**: detect.mjs returned zero findings. Clean.

## Overall Impression

Extraction to SiteHeader was correct. Three remaining gaps: no mobile layout, two status badge patterns, Bell button that does nothing.

## What's Working

1. BrandDashboard h-0.5 accent line — one pixel of brand color, no visual weight, correct.
2. titleAs prop — preserves semantic heading structure across uses without duplication.
3. Actions slot as ReactNode — unconstrained, flexible API.

## Priority Issues

**[P1] No mobile layout** — overflow at 375px. Left block + right block exceeds container width on narrow viewports. Fix: min-w-0 + truncate on title block, hidden sm:block on subtitle, mobile treatment for action buttons. Command: /impeccable adapt SiteHeader

**[P2] Two status badge patterns** — Admin uses shadcn Badge; BrandDashboard uses raw span with brandColor+"1a" opacity trick. Light brand colors will fail 4.5:1 contrast. Fix: use Badge component in BrandDashboard with inline style only for color/bg. Command: /impeccable polish BrandDashboard

**[P2] Logo is not a home link** — All three headers have a non-interactive logo area. Fix: wrap logo+title in Link/button with logoHref prop defaulting to "/". Command: /impeccable harden SiteHeader

**[P2] Bell notification button does nothing** — No click handler, no unread count. Trust-destroying empty affordance. Fix: remove until notifications are built. Command: /impeccable harden BrandDashboard

**[P3] text-xs text-muted-foreground subtitle contrast** — 12px body text ~4.2:1 estimated; may be below 4.5:1 threshold. Fix: bump to text-sm or darken to text-foreground/70. Command: /impeccable audit SiteHeader

## Persona Red Flags

**Sam (Accessibility)**: No skip-to-content link; subtitle contrast risk; logo not in tab order (expected) but skip link would compensate.

**Casey (Mobile)**: Index header action buttons overflow and are unreachable by thumb on 375px. "Get Started" in top-right not thumb-accessible on mobile.

## Minor Observations

- space-x-3 in SiteHeader vs space-x-4 in original AdminDashboard — absorbed into extraction, minor rhythm change.
- AdminLogin has no sticky header at all — inconsistent nav pattern.
- z-50 used without a documented z-index scale — cross-component layering risk.
- Brand accent line h-0.5 subtracts 2px from perceived header height vs SiteHeader variant.
