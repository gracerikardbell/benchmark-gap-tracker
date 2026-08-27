import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../state/store';
import { isInitiativeAtRisk } from '../domain/risk';
import { uniqueOwners } from '../domain/rollups';

function formatCurrency(value: number): string {
  return `$${(value / 1_000_000).toFixed(0)}M`;
}

export default function InitiativesPage() {
  const { data } = useAppStore();
  const [owner, setOwner] = useState<string | null>(null);
  const [portfolioId, setPortfolioId] = useState<string | null>(null);
  const owners = useMemo(() => uniqueOwners(data.portfolios, data.initiatives), [data]);

  const initiatives = data.initiatives.filter(
    (i) => (!owner || i.owner === owner) && (!portfolioId || i.portfolioId === portfolioId),
  );

  function portfolioName(id: string): string {
    return data.portfolios.find((p) => p.id === id)?.name ?? id;
  }

  return (
    <div className="page">
      <h1>Initiatives</h1>
      <p className="page-subtitle">All initiatives across every portfolio.</p>

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

        <label htmlFor="portfolio-filter">Portfolio:</label>
        <select
          id="portfolio-filter"
          value={portfolioId ?? ''}
          onChange={(e) => setPortfolioId(e.target.value || null)}
        >
          <option value="">All portfolios</option>
          {data.portfolios.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Initiative</th>
            <th>Portfolio</th>
            <th>Owner</th>
            <th>Estimated</th>
            <th>Actual</th>
            <th>Status</th>
            <th>Target Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {initiatives.map((i) => {
            const atRisk = isInitiativeAtRisk(i);
            return (
              <tr key={i.id} className={atRisk ? 'row-at-risk' : ''}>
                <td>{i.name}</td>
                <td>
                  <Link to={`/portfolios/${i.portfolioId}`}>{portfolioName(i.portfolioId)}</Link>
                </td>
                <td>{i.owner}</td>
                <td>{formatCurrency(i.estimatedSavings)}</td>
                <td>{formatCurrency(i.actualSavings)}</td>
                <td>
                  <span
                    className={`status-badge ${
                      atRisk
                        ? 'status-badge-risk'
                        : i.status === 'Complete'
                          ? 'status-badge-complete'
                          : 'status-badge-ontrack'
                    }`}
                  >
                    {atRisk ? 'At Risk' : i.status}
                  </span>
                </td>
                <td>{i.targetDate}</td>
                <td>
                  <Link to={`/initiatives/${i.id}/edit`}>Edit</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Link className="button-link" to="/initiatives/new">
        + Add Initiative
      </Link>
    </div>
  );
}
