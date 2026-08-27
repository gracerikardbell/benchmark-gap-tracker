import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../state/store';
import { computeAllRollups, filterByOwner, uniqueOwners } from '../domain/rollups';
import { isInitiativeAtRisk, atRiskReason } from '../domain/risk';

function formatCurrency(value: number): string {
  return `$${(value / 1_000_000).toFixed(0)}M`;
}

export default function NeedsAttentionPage() {
  const { data } = useAppStore();
  const [owner, setOwner] = useState<string | null>(null);
  const owners = useMemo(() => uniqueOwners(data.portfolios, data.initiatives), [data]);

  const allRollups = computeAllRollups(data.portfolios, data.initiatives);
  const rollups = (owner ? allRollups.filter((r) => r.portfolio.owner === owner) : allRollups).filter(
    (r) => r.isAtRisk,
  );

  const atRiskInitiatives = filterByOwner(data.initiatives, owner)
    .filter((i) => isInitiativeAtRisk(i))
    .sort((a, b) => b.estimatedSavings - a.estimatedSavings);

  return (
    <div className="page">
      <h1>Needs Attention</h1>
      <p className="page-subtitle">
        At-risk portfolios and initiatives, sorted by $ at stake — interrogate these first.
      </p>

      <div className="filter-bar">
        <label htmlFor="owner-filter">Filter by owner:</label>
        <select
          id="owner-filter"
          value={owner ?? ''}
          onChange={(e) => setOwner(e.target.value || null)}
        >
          <option value="">All owners</option>
          {owners.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <h2>At-Risk Portfolios ({rollups.length})</h2>
      {rollups.length === 0 && <p>No portfolios at risk.</p>}
      <ul className="risk-list">
        {rollups
          .sort((a, b) => b.estimatedSavings - a.estimatedSavings)
          .map((r) => (
            <li key={r.portfolio.id}>
              <Link to={`/portfolios/${r.portfolio.id}`}>{r.portfolio.name}</Link> —{' '}
              {formatCurrency(r.estimatedSavings)} at stake, {r.atRiskCount} initiative(s) at risk
            </li>
          ))}
      </ul>

      <h2>At-Risk Initiatives ({atRiskInitiatives.length})</h2>
      {atRiskInitiatives.length === 0 && <p>No initiatives at risk.</p>}
      <ul className="risk-list">
        {atRiskInitiatives.map((i) => (
          <li key={i.id}>
            <Link to={`/initiatives/${i.id}/edit`}>{i.name}</Link> —{' '}
            {formatCurrency(i.estimatedSavings)} at stake ({i.owner}): {atRiskReason(i)}
          </li>
        ))}
      </ul>
    </div>
  );
}
