---
feature: 'Benchmark Gap Tracker'
stage: research
created: '2026-08-27T00:00:00Z'
status: complete
---

# Research: Benchmark Gap Tracker

## Structured Problem Statement

- **Problem summary**: Leadership has no single, trusted view of the benchmark
  cost-savings target, the current gap-to-goal, or which initiatives/portfolios
  are on track vs. at risk.
- **Current state friction**: Improvement efforts are tracked locally per
  business unit with no roll-up; no shared source of truth for gap-to-goal,
  ownership, or at-risk status.
- **Desired outcome**: A lightweight dashboard app that shows gap-to-goal,
  portfolio/initiative drill-down, ownership filtering, and a single
  "needs attention" view for at-risk items.

## Structured Target Persona

- **Primary persona**: Business stakeholder / portfolio sponsor / executive
- **Skill level**: Novice (non-technical, dashboard consumer)
- **Primary needs**: Fast visual read of gap-to-goal, drill-down by portfolio,
  filter by owner, immediate spotting of at-risk items
- **Constraints**: Prototype — must be simple, fast to build, no real client
  data or branding

## Structured Value Proposition

- **Primary value**: Gap-to-goal identification and early-warning on at-risk
  initiatives
- **Quantified goal**: Faster time-to-insight; track cash savings realization
  (actual vs. estimated) per initiative/portfolio
- **Why prioritized now**: Prototype to validate the concept before any
  platform integration

## Codebase Findings

Workspace is **greenfield** — `.specify/` scaffolding only, no existing
application code, package manifests, or frameworks installed. No reuse-before-
create scan applies since there is nothing to reuse. Skipping subagent
codebase research (no relevant surface area) to keep this prototype moving
quickly, per user direction.

## Application-Delivery Gate Summary

- **Preview-first rationale**: Not applicable — this is a standalone
  prototype, not built on the EnterpriseAI Vertical Template/DAISY platform.
- **Vertical Template reuse constraints**: Not applicable (no platform blocks
  installed in this workspace).
- **Package profile**: Internal / app-local, standalone single-page app.
- **Service-fit gate**: Not applicable — no EnterpriseAI platform services in
  scope for this prototype.

## Technology Decisions

| Decision | Choice | Rationale | Alternatives Considered |
| --- | --- | --- | --- |
| Frontend framework | React + TypeScript (Vite) | Fast dev server, minimal setup, ubiquitous for dashboards | Next.js (overkill for a no-backend prototype) |
| Routing | React Router | Simple client-side routing for 4 pages | File-based routing frameworks (unnecessary overhead) |
| Charting | Recharts | Lightweight, good line/area chart support for gap-to-goal viz | Chart.js, D3 (more boilerplate) |
| State/data | In-memory store + `localStorage` persistence | No backend needed for a prototype; edits survive refresh | Real backend/DB (out of scope for prototype speed) |
| Styling | Plain CSS (CSS modules), neutral palette | Matches "generic branding" requirement, avoids design-system setup time | Tailwind, MUI (extra setup for a few-page prototype) |
| Seed data | Static TS module with 5 portfolios / initiatives | Matches specified $ potential per portfolio | JSON file (equivalent; TS gives type safety) |

## Architecture Overview

- **Single-page app**, 4 routes: `/` (landing), `/portfolios` (+ `/portfolios/:id`),
  `/initiatives/new` & `/initiatives/:id/edit`, `/needs-attention`, plus a
  `/settings` route for target/milestones.
- **Data layer**: `src/data/seed.ts` provides initial portfolios/initiatives;
  a small context/store (`src/state/store.tsx`) holds live data in memory and
  syncs to `localStorage` so edits persist across reloads.
- **At-risk logic**: pure function `isInitiativeAtRisk(initiative)` computed
  from target date, estimated/actual savings, and manual status override;
  `isPortfolioAtRisk(portfolio)` derived from its initiatives.
- **Gap-to-goal chart**: derived series computed from benchmark target +
  yearly milestones (settings) vs. cumulative actual+projected savings by year
  through 2030.

## Patterns To Follow

None from existing code (greenfield). Will follow standard React conventions:
functional components, hooks, colocated types, one component per file.

## Constraints / Considerations

- No backend/auth — single-user prototype, all data client-side.
- No real company names/logos — generic labels only, per discovery.
- Keep dependency count low to keep setup/build time minimal.

## Competitive Analysis

**Status**: Skipped — prototype, moving quickly per user direction (also
skipped at discovery stage).
