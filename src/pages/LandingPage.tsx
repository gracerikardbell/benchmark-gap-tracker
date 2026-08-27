import { Link } from 'react-router-dom';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAppStore } from '../state/store';
import { buildGapToGoalSeries, totalDelivered, totalIdentified } from '../domain/gapToGoal';
import { computeAllRollups } from '../domain/rollups';

function formatCurrency(value: number): string {
  return `$${(value / 1_000_000_000).toFixed(1)}BN`;
}

export default function LandingPage() {
  const { data } = useAppStore();
  const series = buildGapToGoalSeries(data.settings, data.initiatives);
  const rollups = computeAllRollups(data.portfolios, data.initiatives);
  const atRiskPortfolios = rollups.filter((r) => r.isAtRisk).length;
  const atRiskInitiatives = rollups.reduce((sum, r) => sum + r.atRiskCount, 0);
  const currentYear = new Date().getFullYear();
  const gapToGoalRemaining = data.settings.overallTarget - totalDelivered(data.initiatives);
  const finalPoint = series[series.length - 1];
  const unallocatedGap = finalPoint.benchmarkTarget - finalPoint.currentTrajectory;
  const allocatedGap = finalPoint.currentTrajectory - finalPoint.momentumCase;

  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <span className="hero-eyebrow">Enterprise Benchmark Program</span>
          <h1>Benchmark Gap Tracker</h1>
          <p>
            One place to see the gap to goal, track portfolios and initiatives, and spot what
            needs attention before it threatens the target.
          </p>
          <div className="hero-actions">
            <Link to="/portfolios" className="hero-cta-primary">
              View portfolios &rarr;
            </Link>
            <Link to="/needs-attention" className="hero-cta-secondary">
              See what needs attention
            </Link>
          </div>
        </div>
      </section>

      <section className="stat-strip">
        <div className="stat-strip-item">
          <span className="stat-strip-value">{formatCurrency(gapToGoalRemaining)}</span>
          <span className="stat-strip-label">Gap to goal remaining</span>
        </div>
        <div className="stat-strip-item">
          <span className="stat-strip-value">{formatCurrency(totalIdentified(data.initiatives))}</span>
          <span className="stat-strip-label">Total $ identified</span>
        </div>
        <div className="stat-strip-item">
          <span className="stat-strip-value">{formatCurrency(totalDelivered(data.initiatives))}</span>
          <span className="stat-strip-label">Total $ delivered</span>
        </div>
        <div className="stat-strip-item stat-strip-item-risk">
          <span className="stat-strip-value">{atRiskPortfolios}</span>
          <span className="stat-strip-label">At-risk portfolios</span>
        </div>
        <div className="stat-strip-item stat-strip-item-risk">
          <span className="stat-strip-value">{atRiskInitiatives}</span>
          <span className="stat-strip-label">At-risk initiatives</span>
        </div>
      </section>

      <div className="page">
        <h2>Gap to goal</h2>
        <p className="page-subtitle">
          Benchmark ambition vs. current trajectory (momentum + initiatives) vs. momentum case
          (continuous improvement only, no transformation), by year through 2030.
        </p>
      </div>

      <section className="chart-section">
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={series} margin={{ top: 16, right: 24, bottom: 8, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ebef" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} />
              <YAxis
                tickFormatter={(v) => formatCurrency(v)}
                width={80}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend iconType="plainline" />
              <ReferenceLine
                x={currentYear}
                stroke="#cbd5e1"
                strokeDasharray="4 4"
                label={{ value: 'Today', position: 'insideTopRight', fill: '#94a3b8', fontSize: 12 }}
              />
              <Line
                type="natural"
                dataKey="benchmarkTarget"
                name="Benchmark Savings"
                stroke="#2f6fed"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="natural"
                dataKey="currentTrajectory"
                name="Projected Target (with initiatives)"
                stroke="#e2872f"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="natural"
                dataKey="momentumCase"
                name="Momentum Case (no transformation)"
                stroke="#f0b23a"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="gap-callouts">
            <div className="gap-callout">
              <span className="gap-callout-swatch gap-callout-swatch-unallocated" />
              <span className="gap-callout-label">Unallocated gap to goal ({finalPoint.year})</span>
              <span className="gap-callout-value">{formatCurrency(unallocatedGap)}</span>
            </div>
            <div className="gap-callout">
              <span className="gap-callout-swatch gap-callout-swatch-allocated" />
              <span className="gap-callout-label">Allocated gap to goal ({finalPoint.year})</span>
              <span className="gap-callout-value">{formatCurrency(allocatedGap)}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="page">
        <h2>Explore</h2>
        <div className="capability-grid">
          <Link to="/portfolios" className="capability-card">
            <span className="capability-card-title">Portfolios</span>
            <span className="capability-card-desc">
              See all 5 portfolios, identified potential, and % on track vs. at risk.
            </span>
            <span className="capability-card-link">Open &rarr;</span>
          </Link>
          <Link to="/needs-attention" className="capability-card">
            <span className="capability-card-title">Needs attention</span>
            <span className="capability-card-desc">
              Every at-risk portfolio and initiative, sorted by $ at stake.
            </span>
            <span className="capability-card-link">Open &rarr;</span>
          </Link>
          <Link to="/initiatives/new" className="capability-card">
            <span className="capability-card-title">Add an initiative</span>
            <span className="capability-card-desc">
              Log a new initiative with its business case and savings targets.
            </span>
            <span className="capability-card-link">Open &rarr;</span>
          </Link>
          <Link to="/settings" className="capability-card">
            <span className="capability-card-title">Settings</span>
            <span className="capability-card-desc">
              Set the overall benchmark target and yearly milestones.
            </span>
            <span className="capability-card-link">Open &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

