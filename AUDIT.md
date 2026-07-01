# Brand Hub repo audit

Generated: 2026-06-30

## Stack
- Next.js version: **N/A — this is NOT a Next.js app**. It is a Vite 6 + React 18 SPA with React Router v6. There is no App Router, no Pages Router, and no server-side rendering. All data is fetched from an external backend at `VITE_API_URL`.
- Router: **React Router v6 (client-side SPA only)**
- Package manager: **npm** (`package-lock.json` present)
- Path aliases: `@/*` → `./src/*` (defined in `tsconfig.json` via `compilerOptions.paths`)
- Relevant deps already installed:
  - `mongodb` ^6.18.0 (native driver — used only in `scripts/seed-database.ts`, not in the SPA runtime)
  - `zod` ^3.23.8
  - `react-router-dom` ^6.26.2
  - `@tanstack/react-query` ^5.56.2
- Relevant deps NOT installed (will need `npm install` if adding server-side logic):
  - `mongoose` — not installed
  - `jsonwebtoken` — not installed
  - `bcrypt` / `bcryptjs` — not installed
  - `next-auth` — not installed (not applicable — no Next.js)
  - `jose` — not installed

> **Critical architectural note:** Brand Hub has no server-side API routes. Authentication, data models, and business logic all live in a separate external backend (the MERN/Next.js repo at `mint-rewards-mern-next-js.vercel.app`). Any RBAC implementation must account for this split architecture.

---

## Existing auth code
| File | Purpose | Status |
|---|---|---|
| `src/lib/adminAuth.ts` | Client-side token manager — stores/reads JWT in `localStorage` under key `admin_token`; builds `Authorization: Bearer` headers for API calls | Real (but client-only — no server-side validation in this repo) |
| `src/components/AdminProtectedRoute.tsx` | React Router guard — redirects to `/admin/login` if `localStorage.getItem('admin_token')` is falsy | Placeholder — trivially bypassed by setting localStorage directly; no server-side token verification |
| `src/pages/AdminLogin.tsx` | Login UI — POSTs `{ email, password }` to `${VITE_API_URL}/admin/login`, stores returned JWT in localStorage | Real integration with external backend (not stubbed) |

---

## Existing data models
| File | Model name | Key fields | Notes |
|---|---|---|---|
| `src/types.ts` | `User` (TS interface only) | `email`, `name`, `password?`, `role?`, `mintId`, `points`, `avatar`, `deviceToken`, `emailVerified` | TypeScript interface, not a Mongoose schema. `password` field present. `role` uses shared `Role` type |
| `src/types.ts` | `Brand` (TS interface only) | `companyName`, `brandName`, `email`, `logo`, `themeColor`, `status`, `role?`, `domain`, `registrationNumber` | TypeScript interface only. `role` field present but typed as the shared `Role` union |
| `src/types.ts` | `Campaign` (TS interface only) | `brand`, `name`, `startDate`, `endDate`, `status`, `discountCodes`, `budget`, `campaignType` | TypeScript interface only |
| `src/types.ts` | `Deal` (TS interface only) | `brandId`, `title`, `discountAmount`, `discountPercentage`, `promoCode`, `maxUses`, `status` | TypeScript interface only |
| `src/types.ts` | `Captain` (TS interface only) | `name`, `phone`, `email`, `password`, `role`, `deviceToken`, `emailVerified` | TypeScript interface only |
| `src/types.ts` | `Logistics` (TS interface only) | `name`, `phone`, `email`, `password`, `role`, `deviceToken`, `emailVerified` | TypeScript interface only |
| `src/types.ts` | `Role` (union type) | `"ADMIN" \| "MEMBER" \| "LOGISTIC" \| "BUSINESS_DEVELOPMENT" \| "BD_ADMIN" \| "CAPTAIN" \| "BRAND"` | No `"BRAND_USER"` or org-scoped roles exist yet |

**No `BrandUser` model exists anywhere in this repo.**
**No `Organization` model exists anywhere in this repo.**
**No Mongoose schemas exist** — there are zero `mongoose.Schema` / `mongoose.model` calls in the entire codebase.
The four files under `src/integrations/` (`database/client.ts`, `supabase/client.ts`, `supabase/mongodb-service.ts`, `supabase/types.ts`) are all **empty** (1-line placeholder files with no content).

---

## Existing API routes
This repo contains **no server-side API routes**. The SPA communicates exclusively with the external backend via `fetch`. The client-side routes are:

| Route | Type | Auth guard present? |
|---|---|---|
| `/` | Public page | No (public) |
| `/register` | Public page (brand registration form) | No (public) |
| `/admin/login` | Public page | No (public) |
| `/admin/dashboard` | Protected page | Yes — `AdminProtectedRoute` (localStorage check only) |
| `/admin/dashboard/add-collection/` | Protected page | Yes — `AdminProtectedRoute` (localStorage check only) |
| `/admin/dashboard/transit-collections/` | Protected page | Yes — `AdminProtectedRoute` (localStorage check only) |
| `/admin/dashboard/finalized-collections/` | Protected page | Yes — `AdminProtectedRoute` (localStorage check only) |
| `/demo` | Public page | No (public) |
| `/dashboard/:brandId` | Brand dashboard | **No auth guard at all** — any visitor can access any brand's dashboard |

---

## DB connection helper
- Path: **None exists in this SPA**
- `src/integrations/database/client.ts` is an empty placeholder file
- `scripts/seed-database.ts` instantiates `new MongoClient(process.env.MONGODB_URI)` inline — this is a standalone script, not a reusable helper
- Export name: N/A
- Already cached/pooled: no

---

## Environment
- `.env` present: **yes** (1 key: `VITE_API_URL`)
- `.env.local` present: no
- `JWT_SECRET` key present: **no** (auth secrets live in the external backend, not this SPA)
- `MONGODB_URI` key present: **no** (not in `.env`; only referenced in `scripts/seed-database.ts` via `process.env`)
- Secrets ever committed to git history: **yes** — commit `a906da4` ("Updated backend url") committed `.env` with `VITE_API_URL` value. The secret is in git history and the file remains tracked in HEAD (see below).
- `.gitignore` covers `.env*`: **partially** — `.gitignore` lists `.env` and `.env.local`, but `.env` was committed **before** the ignore rule was added (at `3cfc5d8`), and `git rm --cached .env` was never run. The file is still tracked by git (`git ls-tree HEAD -- .env` returns a blob entry), so `.gitignore` has no effect on it.

---

## Known issues — current status

### Secrets in git history
**Still present.** The `.env` file containing `VITE_API_URL` was committed at `a906da4` and remains tracked in HEAD. The remediation at `3cfc5d8` ("added .env to .gitignore") was incomplete — the file was added to `.gitignore` but not removed from git's index. To fix: run `git rm --cached .env`, commit, and rotate the leaked secret. Full history rewrite (BFG / `git filter-repo`) is needed to purge it from historical commits.

### Placeholder auth checks
**Still present.** `AdminProtectedRoute` (`src/components/AdminProtectedRoute.tsx`) only checks for the existence of a token in `localStorage`. It does not verify the token's signature, expiry, or claims — any string set at `localStorage.setItem('admin_token', 'anything')` will bypass the guard. The actual JWT validation happens at the external backend on each API call, so API-level security is real; but the SPA route guard itself is a facade.

Additionally, `/dashboard/:brandId` has **no auth guard** — any unauthenticated visitor can open any brand's dashboard page. Several API calls within `BrandDashboard` do not attach auth headers (e.g. `fetchBrandById`, `fetchCampaignsForBrand`), meaning brand data is fetched without any authentication.

### Unauthenticated endpoints
**Still present (partially).** There are no server-side routes in this repo to guard. At the SPA routing level, `/dashboard/:brandId` is fully unprotected. Admin routes use `AdminProtectedRoute` (localStorage-only check). Enforcement of authentication ultimately depends on the external backend requiring `Authorization` headers — and several `brandActions.ts` calls omit auth headers entirely (`fetchBrandById`, `fetchCampaignsForBrand`, `fetchDealsForBrand`, `createDeal`, `deleteDeal`, `deleteCampaign`).

### Hardcoded mock data
**Fixed** (in runtime code). No `mockData`, `dummyData`, or `fakeUser` patterns exist in SPA source files. `scripts/seed-database.ts` contains hardcoded sample objects, but this is a dev seed script — expected and not in the production bundle.

---

## Recommendation for RBAC prototype implementation

- **Architectural reality check first:** Brand Hub is a pure client-side SPA with zero server-side code. `BrandUser` and `Organization` Mongoose models cannot be added to this repo without first adding a server runtime. Options are: (a) convert to Next.js and add API routes here, (b) add the models to the existing external backend repo (`mint-rewards-mern-next-js`), or (c) add a lightweight Express/Fastify server alongside the Vite app. The implementation prompt must pick one and state it explicitly — this repo as-is cannot host Mongoose models.

- **Do not create `lib/db/Organization.ts` or `lib/db/BrandUser.ts` in this repo** until a server runtime is added. There is nowhere to run Mongoose connection logic in a Vite SPA. If the plan is to extend the external backend, those files belong there, not here.

- **Do not create a DB connection helper in this repo** for the same reason. The empty `src/integrations/database/client.ts` placeholder should be replaced only once a server runtime is wired in.

- **No login/register routes exist in this repo** — the external backend owns them (`/admin/login` here is a UI form that calls the backend). The implementation prompt should not expect to find or extend local auth routes; it would need to create them from scratch alongside a server runtime.

- **Path alias:** `@/*` maps to `./src/*`. Any new files must live under `src/` to be importable via `@/`.

- **The leaked `VITE_API_URL` secret must be rotated and the git history cleaned** before the RBAC prototype goes to production. At minimum, run `git rm --cached .env && git commit -m "untrack .env"` and rotate the API URL immediately. A full rewrite with BFG Repo-Cleaner is needed to purge the historical commit.

- **`/dashboard/:brandId` must be protected** as part of any RBAC work — currently any visitor can view any brand's dashboard without authentication.
