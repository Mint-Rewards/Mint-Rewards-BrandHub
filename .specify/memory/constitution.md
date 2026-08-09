# Constitution — Mint Rewards BrandHub

## Project Overview

BrandHub is the partner-facing management portal for MintRewards, a sustainability rewards platform. Brand/marketing managers and enterprise sustainability teams use it to register their company, manage reward campaigns, and track sustainability impact.

**Stack:** React + TypeScript + Vite, Tailwind CSS, Supabase (auth + database), shadcn/ui components, Bun/npm.

## Context Detection

### You're in a Ralph Loop if:
- Started by `scripts/ralph-loop.sh` or a PowerShell equivalent
- Prompt mentions "implement spec" or "work through all"
- You see `<promise>` completion signals

**Action:** Focus on implementation. Complete acceptance criteria. Output `<promise>DONE</promise>` only when ALL criteria pass. No approval-seeking.

### You're in Interactive Chat if:
- User is asking questions or discussing ideas
- No Ralph loop was started

**Action:** Be helpful, guide, explain. When the user says **"Ralph, start working"**, tell them to run `./scripts/ralph-loop.sh` from the project root.

---

## Core Principles

1. **TypeScript only** — no plain JS files in `src/`. Strict types; avoid `any`.
2. **Tailwind for styling** — no inline `style` props, no CSS modules. Use existing design tokens.
3. **shadcn/ui first** — prefer existing components from `src/components/ui/` before creating new ones.
4. **Supabase for data** — all data access goes through Supabase client in `src/integrations/supabase/`. Never hardcode credentials.
5. **No bare KPIs** — every metric must show context (comparison, trend, or real-world equivalent). See PRODUCT.md for design principles.
6. **WCAG 2.1 AA** — sufficient contrast, keyboard navigation on all interactive elements.

---

## Autonomy Settings

- **YOLO mode:** ON — implement specs autonomously without asking for approval on each step.
- **Git autonomy:** Commit and push after each successfully verified spec. Use clear, descriptive commit messages.
- **Iteration limit:** 20 (configurable when running `./scripts/ralph-loop.sh 20`).

---

## Workflow

1. Read specs from `specs/` — pick the highest-priority incomplete spec.
2. Implement until all acceptance criteria pass.
3. Run the project's type-checker: `npx tsc --noEmit`.
4. Commit changes with a descriptive message.
5. Output `<promise>DONE</promise>`.

---

## Running the Ralph Loop

```bash
# From project root — run indefinitely
./scripts/ralph-loop.sh

# Limit to N iterations
./scripts/ralph-loop.sh 20
```

---

## Spec Format

Place specs in `specs/` as markdown files. Each spec must include:
- **Goal** — one sentence
- **Acceptance criteria** — checkboxes
- **Out of scope** — explicit exclusions

---

## Key Files & Paths

- `src/` — all React source
- `src/components/ui/` — shadcn/ui component library
- `src/integrations/supabase/` — Supabase client and type definitions
- `scripts/` — automation scripts including this Ralph loop
- `specs/` — feature specifications
- `logs/` — Ralph loop session logs
- `.specify/memory/` — this constitution and agent memory
