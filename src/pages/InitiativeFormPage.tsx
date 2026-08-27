import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../state/store';
import type { Initiative, Status } from '../domain/types';

function emptyInitiative(portfolioId: string): Initiative {
  return {
    id: `init-${Date.now()}`,
    portfolioId,
    name: '',
    businessCase: '',
    estimatedSavings: 0,
    actualSavings: 0,
    status: 'OnTrack',
    owner: '',
    startDate: new Date().toISOString().slice(0, 10),
    targetDate: new Date().toISOString().slice(0, 10),
  };
}

export default function InitiativeFormPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data, addInitiative, updateInitiative } = useAppStore();

  const existing = id ? data.initiatives.find((i) => i.id === id) : undefined;
  const initialPortfolioId = searchParams.get('portfolioId') ?? data.portfolios[0]?.id ?? '';

  const [form, setForm] = useState<Initiative>(existing ?? emptyInitiative(initialPortfolioId));
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(existing);

  function update<K extends keyof Initiative>(key: K, value: Initiative[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.owner.trim() || !form.portfolioId) {
      setError('Name, owner, and portfolio are required.');
      return;
    }
    if (form.estimatedSavings < 0 || form.actualSavings < 0) {
      setError('Savings values must be zero or greater.');
      return;
    }
    if (new Date(form.startDate) > new Date(form.targetDate)) {
      setError('Start date must be on or before the target date.');
      return;
    }
    setError(null);

    if (isEditing) {
      updateInitiative(form);
    } else {
      addInitiative(form);
    }
    navigate(`/portfolios/${form.portfolioId}`);
  }

  const portfolioOptions = useMemo(() => data.portfolios, [data.portfolios]);

  return (
    <div className="page">
      <h1>{isEditing ? 'Edit Initiative' : 'Add Initiative'}</h1>
      <form className="form" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}

        <label>
          Name
          <input value={form.name} onChange={(e) => update('name', e.target.value)} />
        </label>

        <label>
          Business Case
          <textarea
            value={form.businessCase}
            onChange={(e) => update('businessCase', e.target.value)}
          />
        </label>

        <label>
          Estimated Cash Savings ($)
          <input
            type="number"
            value={form.estimatedSavings}
            onChange={(e) => update('estimatedSavings', Number(e.target.value))}
          />
        </label>

        <label>
          Actual Cash Savings ($)
          <input
            type="number"
            value={form.actualSavings}
            onChange={(e) => update('actualSavings', Number(e.target.value))}
          />
        </label>

        <label>
          Status
          <select value={form.status} onChange={(e) => update('status', e.target.value as Status)}>
            <option value="OnTrack">On Track</option>
            <option value="AtRisk">At Risk</option>
            <option value="Complete">Complete</option>
          </select>
        </label>

        <label>
          Accountable Owner
          <input value={form.owner} onChange={(e) => update('owner', e.target.value)} />
        </label>

        <label>
          Start Date
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => update('startDate', e.target.value)}
          />
        </label>

        <label>
          Target Date
          <input
            type="date"
            value={form.targetDate}
            onChange={(e) => update('targetDate', e.target.value)}
          />
        </label>

        <label>
          Portfolio
          <select
            value={form.portfolioId}
            onChange={(e) => update('portfolioId', e.target.value)}
          >
            {portfolioOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <div className="form-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
