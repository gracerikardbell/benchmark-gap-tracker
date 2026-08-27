---
feature: benchmark-gap-tracker
spec: spec.md
research: research.md
status: ready
created: '2026-08-27'
---

# Implementation Plan: Benchmark Gap Tracker

## Technical Context

### Tech Stack

- **Language**: TypeScript
- **Framework**: React 18 (Vite dev/build)
- **Routing**: React Router v6
- **Charting**: Recharts
- **Persistence**: `localStorage` (via a small store module)
- **Testing**: Vitest + React Testing Library (unit tests for at-risk logic
  and rollups)

### Architecture

Single-page app with a top-level `AppStore` (React Context) holding portfolios,
initiatives, and benchmark target/milestones in memory, hydrated from and
synced to `localStorage`. Pages read from context via hooks and dispatch
actions to update state. All derived values (rollups, at-risk flags,
gap-to-goal series) are pure functions computed from state, not stored
redundantly.

```
Browser
 └── App (Router)
      ├── AppStoreProvider (context + localStorage sync)
      ├── Landing page        → useGapToGoalSeries(), useSummaryStats()
      ├── Portfolios page      → usePortfolios(), useOwnerFilter()
      │    └── Portfolio detail (initiatives list)
      ├── Initiative form page → create/edit initiative
      ├── Needs Attention page → useAtRiskItems()
      └── Settings page        → edit benchmark target/milestones
```

### Integration Points

| Component | File | Integration Type |
| --- | --- | --- |
| App store | `src/state/store.tsx` | React Context provider, localStorage read/write |
| Seed data | `src/data/seed.ts` | Initial state for AppStoreProvider |
| At-risk logic | `src/domain/risk.ts` | Pure functions used by Portfolios, Needs Attention, Landing |
| Gap-to-goal series | `src/domain/gapToGoal.ts` | Pure function used by Landing chart |
| Router | `src/App.tsx` | React Router routes to all pages |

### Key Dependencies

- `react`, `react-dom`, `react-router-dom`, `recharts` (runtime)
- `vite`, `typescript`, `vitest`, `@testing-library/react` (dev/test)

## Constitution Check

No `.specify/memory/constitution.md` project principles exist yet — skipped
(not blocking for this prototype).

## Implementation Phases

### Phase 1: Setup & Foundation

**Goal**: Scaffold the Vite/React/TS project with routing and base types.

- [ ] Scaffold Vite + React + TS project at repo root
- [ ] Install `react-router-dom`, `recharts`
- [ ] Define domain types in `src/domain/types.ts` (Portfolio, Initiative,
      BenchmarkTarget, Status)
- [ ] Set up `src/App.tsx` with React Router routes and neutral base CSS

**Verification**: `npm run dev` serves an empty-shell app with working
navigation between 4 placeholder pages.

### Phase 2: Data Layer

**Goal**: Seed data, store, and localStorage persistence.

- [ ] `src/data/seed.ts` — 5 portfolios with 2-3 initiatives each, matching
      $ potential (Procurement $2BN, LPO $4BN, Asset Retirement $2BN, Capital
      Project Efficiency $3BN, Tech Scaling $3BN)
- [ ] `src/state/store.tsx` — Context provider, `useAppStore()` hook,
      load/save to `localStorage`, CRUD actions for initiatives and settings
- [ ] Validation for initiative form fields (required fields, numeric
      savings, valid date)

**Verification**: Store initializes from seed on first load, persists edits
across page refresh (unit test + manual check).

### Phase 3: Business Logic

**Goal**: Derived domain logic per user story.

- [ ] `src/domain/risk.ts` — `isInitiativeAtRisk(initiative, today)`,
      `isPortfolioAtRisk(portfolio, initiatives, today)`
- [ ] `src/domain/gapToGoal.ts` — build yearly series (target line vs.
      actual+projected) through 2030 from settings + initiatives
- [ ] `src/domain/rollups.ts` — portfolio rollups (% on track vs. at risk,
      identified potential, initiative count)
- [ ] Owner filter selector shared by Portfolios and Needs Attention pages

**Verification**: Unit tests cover at-risk boundary conditions (exactly 50%,
before/after halfway point, manual override) and rollup totals equal $14BN
identified across seed data.

### Phase 4: UI / Pages Layer

**Goal**: Build the 4 required pages + settings, wired to store and domain
logic.

- [ ] Landing page: gap-to-goal chart (Recharts) + summary stat cards
- [ ] Portfolios page: table/list of 5 portfolios + owner filter; detail view
      per portfolio listing its initiatives
- [ ] Initiative form page: create/edit form with portfolio dropdown,
      validation, save/cancel
- [ ] Needs Attention page: at-risk portfolios/initiatives sorted by $ at
      stake descending, with reason shown
- [ ] Settings page: edit benchmark target + yearly milestones

**Verification**: Manual walkthrough of all 4 pages + settings against
acceptance criteria in spec.md.

### Phase 5: Polish & Integration

**Goal**: Final consistency pass.

- [ ] Neutral shared styling (palette, typography, spacing) across all pages
- [ ] Empty/loading state handling, basic responsive layout
- [ ] README with run instructions
- [ ] Final pass: re-verify all spec.md acceptance criteria

**Verification**: `npm run build` succeeds; app runs via `npm run dev` with
all pages functional.

## File Structure

```
/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── domain/
    │   ├── types.ts
    │   ├── risk.ts
    │   ├── gapToGoal.ts
    │   └── rollups.ts
    ├── data/
    │   └── seed.ts
    ├── state/
    │   └── store.tsx
    ├── pages/
    │   ├── LandingPage.tsx
    │   ├── PortfoliosPage.tsx
    │   ├── PortfolioDetailPage.tsx
    │   ├── InitiativeFormPage.tsx
    │   ├── NeedsAttentionPage.tsx
    │   └── SettingsPage.tsx
    └── styles/
        └── global.css
```

## Risk Assessment

| Risk | Impact | Mitigation |
| --- | --- | --- |
| localStorage data shape drifts from seed shape after edits | Medium | Version the stored schema; fall back to seed if parse/shape check fails |
| At-risk boundary logic ambiguity (exact halfway point) | Low | Unit-test boundary explicitly per FR-2 wording |
| Chart projection method looks arbitrary | Low | Document simple linear-projection assumption in README/spec Assumptions |

## Spec Traceability

### User Story Coverage

| Story | Status | Plan Reference |
| --- | --- | --- |
| Gap-to-Goal Visibility (P1) | Covered | Phase 3 (gapToGoal.ts), Phase 4 (LandingPage) |
| Spot What's At Risk (P1) | Covered | Phase 3 (risk.ts), Phase 4 (NeedsAttentionPage) |
| Portfolio Drill-Down (P1) | Covered | Phase 3 (rollups.ts), Phase 4 (PortfoliosPage, PortfolioDetailPage) |
| Manage Initiatives (P2) | Covered | Phase 2 (store.tsx), Phase 4 (InitiativeFormPage) |
| Filter by Owner (P2) | Covered | Phase 3 (owner filter selector), Phase 4 (PortfoliosPage, NeedsAttentionPage) |
| Set Targets (P3) | Covered | Phase 2 (store.tsx settings), Phase 4 (SettingsPage) |

### Requirement Coverage

| FR-ID | Status | Plan Reference |
| --- | --- | --- |
| FR-1 | Covered | Phase 3 gapToGoal.ts, Phase 4 LandingPage |
| FR-2 | Covered | Phase 3 risk.ts |
| FR-3 | Covered | Phase 3 risk.ts |
| FR-4 | Covered | Phase 4 NeedsAttentionPage |
| FR-5 | Covered | Phase 4 PortfoliosPage/PortfolioDetailPage |
| FR-6 | Covered | Phase 4 InitiativeFormPage |
| FR-7 | Covered | Phase 3 owner filter, Phase 4 pages |
| FR-8 | Covered | Phase 4 SettingsPage |
| FR-9 | Covered | Phase 2 seed.ts |

## AI-Readable Blocks Bridge

Not applicable — standalone prototype, no EnterpriseAI Vertical Template
blocks/DAISY platform involved (per research.md and spec.md).
