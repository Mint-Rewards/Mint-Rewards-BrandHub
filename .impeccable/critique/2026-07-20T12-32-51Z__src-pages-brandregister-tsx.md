---
target: brand registration flow (src/pages/BrandRegister.tsx)
total_score: 23
p0_count: 0
p1_count: 2
timestamp: 2026-07-20T12-32-51Z
slug: src-pages-brandregister-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Step indicator + submit loading state are solid; no per-field "saving" feedback needed at this scale |
| 2 | Match System / Real World | 3 | Plain language throughout; post-registration Pending Approval view actually matches the "2-3 day review" promise made on the landing page |
| 3 | User Control and Freedom | 2 | Can go Previous, but Review step has no direct "edit this field" jump. No draft recovery on refresh |
| 4 | Consistency and Standards | 2 | `gradient` button variant used as the default primary CTA (Next, Create Organisation) and 3x on the Index page — contradicts this project's own DESIGN.md, which defines it as a rare one-per-page promotional accent |
| 5 | Error Prevention | 3 | Good inline blur validation, logo dimension/size/type checks before upload |
| 6 | Recognition Rather Than Recall | 3 | Step 3 restates every field so nothing needs to be remembered — a genuine strength |
| 7 | Flexibility and Efficiency of Use | 1 | No keyboard shortcuts, no skip/save-and-resume, confirm-password field adds a step with no real benefit over a show/hide toggle |
| 8 | Aesthetic and Minimalist Design | 2 | Decorative `backdrop-blur` glassmorphism on the header and the main form Card (DESIGN.md restricts this to the sticky nav only); Step 2 shows 8 fields in one ungrouped block |
| 9 | Error Recovery | 3 | Plain-language, specific errors, shown near the field, form never wiped |
| 10 | Help and Documentation | 1 | No contextual help anywhere in the flow |
| **Total** | | **23/40** | **Acceptable — functional, but drifting from its own design system** |

## Anti-Patterns Verdict

**LLM assessment:** No classic AI slop tells (no eyebrows, gradient text, hero-metric cards, side-stripes). Fails its own design system instead: gradient button used as general-purpose primary action (DESIGN.md reserves it for one promotional moment per page — violated on BrandRegister.tsx Next/Create Organisation and 3x on Index.tsx); `--accent` in index.css (186 100% 19%, dark teal) doesn't match DESIGN.md's documented Precision Violet (#8135F3), so the gradient renders nearly flat.

**Deterministic scan:** `detect.mjs --json` on BrandRegister.tsx + Index.tsx returned `[]` (clean, exit 0). Its ban list targets universal AI-slop patterns, not project-specific DESIGN.md token misuse, so it can't catch a brand's own rules being broken.

**Browser visualization:** Not available this session — no browser automation tool configured. Static/source review only.

## Overall Impression

Well-engineered under the hood — real inline validation, sensible step-gating, a genuinely good review screen, and a Pending Approval dashboard state that honors the "2-3 business days" promise from the landing page. Biggest gap is design-system fidelity (gradient rarity + blur restriction both broken in the flow DESIGN.md calls out by name) and information density in Step 2 (8 fields, no sub-grouping) working against the "register in under 10 minutes" success metric.

## What's Working

- Review step (Step 3) restates every entered value including logo preview and graceful "None (add later)" fallbacks — strong recognition-over-recall for infrequent users.
- Post-submit state honesty: registration logs the user into a dashboard showing a proper PendingApprovalView with estimated timeline, matching the Index page promise.
- Logo upload validation: size, MIME type, and decoded dimension/aspect-ratio checks with specific actionable error copy before the file touches a request.

## Priority Issues

**[P1] Gradient button used as the default primary action, not a rare accent**
Why it matters: DESIGN.md reserves gradient for one promotional moment per page. Here it's the de facto primary button style across the entire flow plus 3 instances on Index.tsx. Because `--accent` isn't actually violet, it currently renders as near-flat teal anyway.
Fix: Use `variant="default"` for Next/Create Organisation and Index CTAs; reserve `gradient` for one genuine promotional moment. Fix `--accent` to Precision Violet HSL.
Suggested command: /impeccable audit or /impeccable colorize

**[P1] Step 2 presents 8 fields with no visual grouping**
Why it matters: brandName, category, logo, phone, website, appLink, address, description all in one continuous block — doubles the cognitive-load chunking cap of ≤4 items per group.
Fix: Split into sub-groups ("Identity" vs "Contact") or push optional fields into a labeled disclosure.
Suggested command: /impeccable layout

**[P2] Decorative glassmorphism outside its permitted use**
Why it matters: DESIGN.md permits backdrop-filter blur on the sticky nav header only. The registration header (not sticky) and main form Card both use `backdrop-blur-sm` decoratively.
Fix: Drop backdrop-blur-sm from both; use solid background with shadow-card.
Suggested command: /impeccable polish

**[P2] No draft persistence — a refresh silently destroys the whole form**
Why it matters: Org name, email, password, brand name, category, and uploaded logo can all be lost to an accidental refresh or interruption.
Fix: Persist formData (minus password) to sessionStorage on change, restore on mount, clear on submit.
Suggested command: /impeccable harden

**[P3] Confirm-password field adds friction with no modern equivalent benefit**
Why it matters: Show/hide toggle already lets users verify what they typed.
Fix: Consider dropping confirm-password or making it optional.
Suggested command: /impeccable clarify

## Persona Red Flags

**Jordan (Confused First-Timer):** No contextual help anywhere — "Category" has no explanation of what it affects downstream. Password field gives no visible complexity requirement beyond "at least 8 characters."

**Riley (Deliberate Stress Tester):** Refreshing mid-flow loses all progress with zero warning — no beforeunload, no session storage. Review step has no way to jump directly back to a specific field, only sequential Previous.

**Sam (Accessibility-Dependent User):** Field errors render as plain paragraphs with no aria-describedby linking them to their input, and no aria-invalid on the input itself — a screen reader user won't hear that a field is in an error state.

## Minor Observations

- Password/Confirm Password inputs lack autoComplete="new-password".
- Logo upload dropzone has no drag-and-drop handler wired up despite the visual affordance.
- stepTitles labels are hidden below sm breakpoint — mobile users see only numbered circles with no label.
- Address field has no validation or format guidance, unlike every sibling field.

## Questions to Consider

- If gradient stops being the default CTA style, what's the one moment worth making the teal-to-violet gradient a genuine "moment" for?
- Does grouping Step 2's 8 fields change the step count, or just add visual breaks within Step 2?
- Is confirm-password a compliance/support requirement, or safe to cut?
