import { Link, useParams } from 'react-router-dom';
import { useAppStore } from '../state/store';
import { isInitiativeAtRisk, atRiskReason } from '../domain/risk';
import { computeRollup } from '../domain/rollups';

function formatCurrency(value: number): string {
  return `$${(value / 1_000_000).toFixed(0)}M`;
}

export default function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data } = useAppStore();
  const portfolio = data.portfolios.find((p) => p.id === id);
  const initiatives = data.initiatives.filter((i) => i.portfolioId === id);

  if (!portfolio) {
    return (
      <div className="page">
        <p>Portfolio not found.</p>
        <Link to="/portfolios">Back to portfolios</Link>
      </div>
    );
  }

  const rollup = computeRollup(portfolio, data.initiatives);

  return (
    <div className="page">
      <Link to="/portfolios">&larr; Back to portfolios</Link>
      <h1>{portfolio.name}</h1>
      <p className="page-subtitle">{portfolio.objective}</p>
      <p>
        Owner: <strong>{portfolio.owner}</strong>
      </p>

      <div className="stat-cards-inline">
        <div className="stat-card">
          <span className="stat-label">Identified potential</span>
          <span className="stat-value">{formatCurrency(rollup.identifiedPotential)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Actual savings</span>
          <span className="stat-value">{formatCurrency(rollup.actualSavings)}</span>
        </div>
        <div className="stat-card stat-card-risk">
          <span className="stat-label">At-risk initiatives</span>
          <span className="stat-value">{rollup.atRiskCount} / {rollup.initiativeCount}</span>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Initiative</th>
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
                  {atRisk && <span className="at-risk-reason">{atRiskReason(i)}</span>}
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

      <Link className="button-link" to={`/initiatives/new?portfolioId=${portfolio.id}`}>
        + Add Initiative
      </Link>
    </div>
  );
}
