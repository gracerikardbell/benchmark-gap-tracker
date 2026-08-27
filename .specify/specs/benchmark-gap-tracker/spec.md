---
id: benchmark-gap-tracker
title: Benchmark Gap Tracker
status: draft
created: '2026-08-27'
updated: '2026-08-27'
author: Copilot
---

# Feature Specification: Benchmark Gap Tracker

## Overview

Leadership at a large enterprise has publicly committed to a cost-savings
benchmark but has no single, trusted view of progress toward that target.
This feature delivers a lightweight dashboard that shows the overall
gap-to-goal, breaks it down by portfolio and initiative, and surfaces what is
at risk of missing the target — so leadership can intervene early.

## User Stories

### P1 — Gap-to-Goal Visibility

As a **business stakeholder**, I want to **see the gap between the benchmark
target and actual+projected savings**, So that **I know how far off track the
organization is at a glance**.

- [ ] Landing page shows a chart with cumulative benchmark target line vs.
      actual+projected savings line, by year through 2030
- [ ] Landing page shows summary stats: total $ identified, total $
      delivered, count of at-risk portfolios/initiatives

### P1 — Spot What's At Risk

As a **business stakeholder**, I want to **see a single filtered view of every
at-risk portfolio and initiative sorted by $ at stake**, So that **I know what
to interrogate first**.

- [ ] "Needs attention" view lists all at-risk portfolios and initiatives
- [ ] List is sorted by $ at stake (estimated savings, descending)
- [ ] Each entry shows why it is flagged at risk

### P1 — Portfolio Drill-Down

As a **business stakeholder**, I want to **view all portfolios and drill into
one to see its initiatives**, So that **I can understand where value is
concentrated and who owns it**.

- [ ] Portfolio list shows name, objective, owner, identified potential,
      initiative count, % on track vs. at risk
- [ ] Clicking a portfolio shows its initiatives

### P2 — Manage Initiatives

As a **portfolio owner**, I want to **add or edit an initiative's details**,
So that **the tracker reflects the latest estimate/actual savings and
status**.

- [ ] Form captures: name, business case, estimated cash savings, actual cash
      savings, status, accountable owner, target date, portfolio (dropdown)
- [ ] Saved initiative updates the portfolio's rollups and at-risk state
      immediately

### P2 — Filter by Owner

As a **business stakeholder**, I want to **filter portfolios and initiatives
by accountable owner**, So that **I can focus on what a specific person is
responsible for**.

- [ ] Owner filter applies to portfolio view and initiative views

### P3 — Set Targets

As an **admin**, I want to **set/edit the overall benchmark target and yearly
milestones**, So that **the gap-to-goal chart reflects the current
commitment**.

- [ ] Settings area allows editing overall target and yearly milestones
      through 2030
- [ ] Changes immediately update the gap-to-goal chart

## Functional Requirements

| ID | Requirement | Validation | Integration |
| --- | --- | --- | --- |
| FR-1 | System shall compute and render cumulative benchmark target vs. actual+projected savings by year through 2030 | Chart values match settings + initiative data | Settings target/milestones, initiative data |
| FR-2 | System shall flag an initiative At Risk if actual savings < 50% of estimated savings past the halfway point to target date, or status manually set to At Risk | Unit test on `isInitiativeAtRisk` boundary conditions | Initiative form (status field), target date logic |
| FR-3 | System shall flag a portfolio At Risk if any of its initiatives are At Risk | Unit test on `isPortfolioAtRisk` | Initiative at-risk derivation |
| FR-4 | System shall provide a Needs Attention view listing all at-risk portfolios/initiatives sorted by $ at stake (descending) | Manual QA against seed data | Portfolio/initiative store |
| FR-5 | System shall provide a Portfolio page listing all 5 portfolios with rollup stats and drill-down to initiatives | Manual QA | Portfolio/initiative store |
| FR-6 | System shall provide an Initiative form to create/edit initiatives tied to a portfolio via dropdown | Manual QA, required-field validation | Portfolio list for dropdown |
| FR-7 | System shall support filtering portfolio and initiative views by accountable owner | Manual QA | Owner field on initiative |
| FR-8 | System shall provide a Settings area to edit overall benchmark target and yearly milestones | Manual QA | Gap-to-goal chart |
| FR-9 | System shall seed 5 portfolios (Procurement $2BN, Lost Production Opportunity $4BN, Asset Retirement $2BN, Capital Project Efficiency $3BN, Tech Scaling $3BN) each with 2-3 initiatives | Seed data review | Data layer |

## Non-Functional Requirements

- **Performance**: Client-side only; all views must render instantly from
  in-memory data (no network calls).
- **Persistence**: Edits to initiatives/settings must persist across page
  reloads within the same browser (localStorage acceptable for a prototype).
- **Security**: No auth required (single-user prototype, no sensitive real
  data — seed data is fictional).
- **Compatibility**: Modern evergreen browsers (Chrome/Edge/Firefox).
- **Branding**: Generic, neutral color palette; no real company names or
  logos.

## Success Criteria

| Criterion | Target | Measurement |
| --- | --- | --- |
| Gap-to-goal visible in one view | Landing page loads with chart + stats | Manual QA |
| At-risk items surfaced immediately | Needs Attention view populated from seed data | Manual QA |
| Portfolio total matches spec | $14BN total identified potential across 5 portfolios | Seed data check |
| Owner filter works | Filtering reduces visible set correctly | Manual QA |

## Assumptions

- No backend/database is required for the prototype; browser localStorage is
  sufficient persistence.
- Single user/session — no concurrent editing or auth concerns.
- "Projected" savings for years beyond the current date extrapolate from
  estimated savings of in-flight initiatives (simple assumption, no forecasting
  model).
- Workspace is greenfield; no existing code/patterns to integrate with
  (confirmed in research.md).

## Dependencies

- Recharts (or equivalent) for the gap-to-goal line/area chart.
- React Router for the 4+ page navigation (landing, portfolios, initiative
  form, needs attention, settings).

## Out of Scope

- Authentication/authorization, multi-user collaboration.
- Real backend/database persistence.
- Real company branding, logos, or data.
- Forecasting/statistical modeling beyond simple linear projection.
- EnterpriseAI platform integration (Vertical Template blocks, DAISY,
  service-fit gate) — not applicable to this standalone prototype.

## Glossary

- **Portfolio**: A named grouping of initiatives owned by a senior sponsor
  (e.g., Procurement).
- **Initiative**: An individual improvement effort with its own business case
  and projected cash savings, belonging to one portfolio.
- **Gap-to-goal**: The difference between the cumulative benchmark target and
  cumulative actual+projected savings.
- **At Risk**: An initiative (or portfolio containing one) whose actual
  savings are trailing badly relative to its target date, or manually flagged.

## Research Traceability

| Research Finding | Spec Section |
| --- | --- |
| Greenfield workspace, no existing code | Assumptions |
| Tech stack decisions (React/Vite/Recharts/localStorage) | Dependencies, NFRs |
| At-risk logic definition | FR-2, FR-3 |
| 5 seeded portfolios with $ potential | FR-9, Success Criteria |
| 4 pages + global features | User Stories, FR-4–FR-8 |

## AI-Augmented 4-Step Journey

Not applicable — classified as standard application delivery without
generative AI assistance (see discovery.md Application Classification).

## UI Preview And Approval Gate

Not applicable — standalone prototype, not built on the EnterpriseAI Vertical
Template platform.

## EnterpriseAI Service Fit

Not applicable — no EnterpriseAI platform services in scope for this
prototype.

## EnterpriseAI Contract Pack Summary

Not applicable — no EnterpriseAI object types, workflows, or APIs are being
integrated; this is a standalone client-side prototype.
