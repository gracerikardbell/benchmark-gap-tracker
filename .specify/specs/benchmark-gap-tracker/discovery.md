---
feature: 'Benchmark Gap Tracker'
created: '2026-08-27T00:00:00Z'
discoveredBy: Copilot + User
status: complete
---

# Business Discovery: Benchmark Gap Tracker

## Problem Statement

**Pain Point**: A large enterprise (modeled on a global oil & gas company) has made public
benchmark commitments on cost savings and operational performance but has fallen behind
competitors, with the gap widening year over year. Cost/efficiency improvements have
historically been driven locally by business units and never scaled into an enterprise-wide
view.

**Current State**: No single, trusted way to see the benchmark target, the current
gap-to-goal, what initiatives are underway to close it, which are on/off track, who owns
each, and where to intervene first.

**Impact**: Leadership cannot prioritize interventions early enough to protect the
publicly committed benchmark target.

## Target Users

### Primary Users

- **Persona**: Business stakeholders / leadership (portfolio sponsors, executives)
- **Technical Level**: Non-technical, dashboard consumers
- **Key Needs**: At-a-glance gap-to-goal visibility, drill-down into portfolios/initiatives,
  filter by accountable owner, quickly spot what's at risk

## Value Proposition

**Primary Value**: Gap-to-goal identification — surface the delta between benchmark target
and actual+projected savings, and pinpoint what's at risk before it threatens the target.

**Quantified Goal**: Faster time-to-insight on at-risk initiatives/portfolios; improved cash
savings realization rate (actual vs. estimated).

## Success Metrics

| Metric                              | Target                          | Measurement                                   |
| ------------------------------------ | -------------------------------- | ---------------------------------------------- |
| Time-to-insight / early-warning       | At-risk items surfaced immediately | "Needs attention" view + at-risk flags       |
| Cash savings realization rate         | Actual / Estimated savings ratio | Per-initiative and rolled-up portfolio totals |

## Competitive Analysis

**Status**: Skipped (prototype — moving quickly through stages)

## Domain Model & Business Rules

- **Single metric**: every initiative is tracked on one common metric — cash savings
  (estimated vs. actual).
- **Portfolios (5, seeded)**: Procurement ($2BN identified), Lost Production Opportunity
  ($4BN), Asset Retirement ($2BN), Capital Project Efficiency ($3BN), Tech Scaling ($3BN).
  Total identified potential: $14BN. Each portfolio has 2-3 realistic made-up oil & gas
  initiatives, an objective, and an owner (senior sponsor).
- **At-risk logic**:
  - An initiative is **At Risk** if actual savings are <50% of estimated savings past the
    halfway point to its target date, OR its status is manually set to At Risk.
  - A portfolio is **At Risk** if any initiative under it is At Risk.

## Pages / Scope

1. **Landing page** — gap-to-goal chart (cumulative benchmark target line vs.
   actual+projected savings line, by year through 2030) + summary stats: total $
   identified, total $ delivered, count of at-risk portfolios/initiatives.
2. **Portfolio page** — list of all 5 portfolios (name, objective, owner, identified
   potential, initiative count, % on track vs. at risk); click through to initiatives.
3. **Initiative input page** — add/edit form: name, business case, estimated cash savings,
   actual cash savings, status, accountable owner, target date, portfolio (dropdown).
4. **Needs attention view** — filtered list of every at-risk portfolio/initiative, sorted
   by $ at stake.

## Global Features

- Filter by accountable owner (applies across portfolio and initiative views).
- Target setting — settings area to set/edit overall benchmark target and yearly
  milestones, driving the gap-to-goal chart.
- Generic branding — clean, neutral color palette, no client logos or real company names.

## Discovery Decisions

| Decision      | Choice                                  | Rationale                                   |
| ------------- | ---------------------------------------- | -------------------------------------------- |
| Problem Focus | No unified view of benchmark gap-to-goal | Stated directly by user                      |
| User Target   | Business stakeholders / leadership       | Dashboard consumers, not builders            |
| Value Metric  | Gap-to-goal identification               | Core value driver, cash savings single metric |
| Scope         | Prototype                                | User asked to move quickly through stages    |

## Application Classification

| Field                           | Decision                                    |
| -------------------------------- | -------------------------------------------- |
| Classification                   | Application delivery (dashboard/portal)      |
| Reason                           | Building screens (landing, portfolio, form, needs-attention) for business users |
| Four-step AI journey required    | Not applicable — prototype, no generative AI assistance requested; proceeding with standard CRUD/dashboard UI flow |

## AI-Readable Blocks Bridge

| Field                     | Decision                    |
| -------------------------- | ---------------------------- |
| Profile Choice             | Internal                     |
| Package Lane               | app-local                    |
| Coupling Status            | DAISY-decoupled (prototype, standalone) |
| Public-Readiness Target    | Not applicable                |
| Block Porting Need         | Custom-build for prototype    |
