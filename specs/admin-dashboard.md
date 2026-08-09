# Admin Dashboard — Fix & Complete

## Goal

Fix data display bugs, wire up real auth protection, and implement the Analytics tab so the Admin Dashboard is fully functional and production-ready.

## Context

File: `src/pages/AdminDashboard.tsx`
Route: `/admin/dashboard` (protected — only accessible after admin login at `/admin/login`)

Known issues found in the current implementation:

- `checkAuth()` is empty — the dashboard is unprotected
- Campaigns tab shows `campaign.id` for both "Brand" and "Contact" fields instead of real brand info
- Deals tab renders `deal.brandId` as the card headline instead of `deal.title`
- Deal approve/reject uses statuses `"active"`/`"inactive"` — inconsistent with a pending-approval flow
- Stats row only counts brands; campaigns and deals have no summary stat
- Analytics tab is an empty placeholder
- "View Details" buttons have no `onClick` — they are dead

---

## Acceptance Criteria

### Auth

- [ ] `checkAuth` redirects to `/admin/login` if `VITE_ADMIN_SECRET` is absent from `import.meta.env`; the dashboard is never shown to unauthenticated visitors
- [ ] Logout clears any admin session state before navigating to `/admin/login`

### Stats Row

- [ ] Stats row shows six cards: Total Brands, Pending Brands, Approved Brands, Rejected Brands, Total Campaigns, Total Deals
- [ ] Campaign and deal counts are derived from the already-fetched `campaigns` and `deals` state — no extra fetch

### Brands Tab

- [ ] Approve and Reject buttons only appear for brands with status `"pending"` or `"PENDING"` (case-insensitive check)
- [ ] Clicking Reject opens a small inline prompt (input or `window.prompt`) to collect an optional rejection reason, which is passed to `handleApproval`
- [ ] "View Details" button opens a shadcn `Dialog` showing all available brand fields: company name, brand name, category, email, phone, website, app link, address, description, registration number, submitted date

### Campaigns Tab

- [ ] Each campaign card shows `campaign.name` as the headline (not `campaign.id`)
- [ ] The "Brand" field shows the brand name resolved from the `brands` state array by matching `campaign.brand` to `brand._id ?? brand.id`; falls back to the raw ID if no match
- [ ] Approve/Reject buttons only appear for campaigns where `campaign.status.toUpperCase() === "PENDING"`
- [ ] "View Details" button opens a `Dialog` showing: name, status, start/end dates, campaign type, budget, description, target audience

### Deals Tab

- [ ] Each deal card headline shows `deal.title` (not `deal.brandId`)
- [ ] The "Brand" field shows brand name resolved from `brands` state by `deal.brandId`; falls back to raw ID
- [ ] Activate/Deactivate buttons only appear for deals where `deal.status === "inactive"` or `deal.status === "PENDING"`; do not show for already-active deals
- [ ] "View Details" button opens a `Dialog` showing: title, description, discount amount/percentage, promo code, start/end date, max uses, current uses, minimum purchase

### Analytics Tab

- [ ] Replace the placeholder with a real summary grid containing:
  - Total brands / approved / pending / rejected (same numbers as stats row)
  - Total campaigns / approved / pending
  - Total deals / active / inactive
- [ ] Each figure is shown with a label — no bare numbers

---

## Out of Scope

- Pagination or infinite scroll on any list
- Email notifications on approve/reject
- Charts or time-series graphs in Analytics
- Editing brand/campaign/deal fields from the admin dashboard
- Role-based access beyond the `VITE_ADMIN_SECRET` env check
