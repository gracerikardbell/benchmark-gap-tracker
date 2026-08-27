import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useAppStore } from '../state/store';
import { computeAllRollups, uniqueOwners } from '../domain/rollups';

function formatCurrency(value: number): string {
  return `$${(value / 1_000_000_000).toFixed(1)}BN`;
}

export default function PortfoliosPage() {
  const { data } = useAppStore();
  const [owner, setOwner] = useState<string | null>(null);
  const owners = useMemo(() => uniqueOwners(data.portfolios, data.initiatives), [data]);
  const allRollups = computeAllRollups(data.portfolios, data.initiatives);
  const rollups = owner ? allRollups.filter((r) => r.portfolio.owner === owner) : allRollups;

  return (
    <div className="page">
      <h1>Portfolios</h1>
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

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Objective</th>
            <th>Owner</th>
            <th>Identified Potential</th>
            <th>Initiatives</th>
            <th>% On Track</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rollups.map((r) => (
            <tr key={r.portfolio.id} className={r.isAtRisk ? 'row-at-risk' : ''}>
              <td>
                <Link to={`/portfolios/${r.portfolio.id}`}>{r.portfolio.name}</Link>
              </td>
              <td>{r.portfolio.objective}</td>
              <td>{r.portfolio.owner}</td>
              <td>{formatCurrency(r.identifiedPotential)}</td>
              <td>{r.initiativeCount}</td>
              <td>{r.onTrackPercent}%</td>
              <td>
                <span className={`status-badge ${r.isAtRisk ? 'status-badge-risk' : 'status-badge-ontrack'}`}>
                  {r.isAtRisk ? 'At Risk' : 'On Track'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
