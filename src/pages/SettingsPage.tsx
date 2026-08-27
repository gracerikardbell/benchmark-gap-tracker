import { useState } from 'react';
import { useAppStore } from '../state/store';
import type { YearlyMilestone } from '../domain/types';

export default function SettingsPage() {
  const { data, updateSettings } = useAppStore();
  const [overallTarget, setOverallTarget] = useState(data.settings.overallTarget);
  const [milestones, setMilestones] = useState<YearlyMilestone[]>(data.settings.yearlyMilestones);
  const [saved, setSaved] = useState(false);

  function updateMilestone(year: number, target: number) {
    setMilestones((prev) => prev.map((m) => (m.year === year ? { ...m, target } : m)));
  }

  function handleSave() {
    updateSettings({ overallTarget, yearlyMilestones: milestones });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="page">
      <h1>Settings</h1>
      <p className="page-subtitle">Set the overall benchmark target and yearly milestones.</p>

      <label className="settings-field">
        Overall Benchmark Target ($)
        <input
          type="number"
          value={overallTarget}
          onChange={(e) => setOverallTarget(Number(e.target.value))}
        />
      </label>

      <table className="data-table">
        <thead>
          <tr>
            <th>Year</th>
            <th>Cumulative Target ($)</th>
          </tr>
        </thead>
        <tbody>
          {milestones.map((m) => (
            <tr key={m.year}>
              <td>{m.year}</td>
              <td>
                <input
                  type="number"
                  value={m.target}
                  onChange={(e) => updateMilestone(m.year, Number(e.target.value))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="form-actions">
        <button onClick={handleSave}>Save Settings</button>
        {saved && <span className="save-confirmation">Saved.</span>}
      </div>
    </div>
  );
}
