# Benchmark Gap Tracker

A prototype dashboard for tracking progress against an enterprise cost-savings
benchmark across portfolios and initiatives. See
[.specify/specs/benchmark-gap-tracker](.specify/specs/benchmark-gap-tracker)
for the full spec, plan, and tasks.

## Run locally

```powershell
npm install
npm run dev
```

## Test

```powershell
npm test
```

## Build

```powershell
npm run build
```

## Pages

- **Overview** (`/`) — gap-to-goal chart and summary stats
- **Portfolios** (`/portfolios`) — all 5 portfolios, drill into initiatives
- **Add/Edit Initiative** (`/initiatives/new`, `/initiatives/:id/edit`)
- **Needs Attention** (`/needs-attention`) — at-risk portfolios/initiatives
- **Settings** (`/settings`) — edit benchmark target and yearly milestones

## Data

All data is seeded in `src/data/seed.ts` and persisted to the browser's
`localStorage` as you make edits (no backend). This is a standalone
prototype — company names, owners, and initiatives are fictional.
