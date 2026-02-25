import React from 'react';

export const OpportunitiesList: React.FC = () => {
  const pipeline = [
    { stage: 'Prospektion', deals: [{ title: 'CloudBase Pilot', value: 15000, contact: 'Lisa Weber', probability: 0.2 }] },
    { stage: 'Qualifikation', deals: [{ title: 'DataFlow Integration', value: 35000, contact: 'Max Müller', probability: 0.4 }, { title: 'GreenTech Beratung', value: 8000, contact: 'Thomas Fischer', probability: 0.3 }] },
    { stage: 'Angebot', deals: [{ title: 'TechCorp Support', value: 12000, contact: 'Anna Schmidt', probability: 0.6 }] },
    { stage: 'Verhandlung', deals: [{ title: 'TechCorp Enterprise', value: 50000, contact: 'Anna Schmidt', probability: 0.75 }] },
    { stage: 'Gewonnen', deals: [{ title: 'FinServ Starter', value: 5000, contact: 'Sandra Klein', probability: 1.0 }] },
  ];

  const totalValue = pipeline.flatMap(p => p.deals).reduce((s, d) => s + d.value, 0);
  const weightedValue = pipeline.flatMap(p => p.deals).reduce((s, d) => s + d.value * d.probability, 0);

  return (
    <div>
      <div className="page-header">
        <h1>💰 Opportunities</h1>
        <button className="btn btn-primary">+ Neue Opportunity</button>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="label">Pipeline-Gesamtwert</div>
          <div className="value">€{(totalValue / 1000).toFixed(0)}K</div>
        </div>
        <div className="metric-card">
          <div className="label">Gewichteter Wert</div>
          <div className="value">€{(weightedValue / 1000).toFixed(0)}K</div>
        </div>
        <div className="metric-card">
          <div className="label">Offene Deals</div>
          <div className="value">{pipeline.flatMap(p => p.deals).length}</div>
        </div>
      </div>

      <div className="pipeline">
        {pipeline.map(stage => (
          <div key={stage.stage} className="pipeline-stage">
            <div className="stage-name">{stage.stage}</div>
            <div className="stage-value">€{(stage.deals.reduce((s, d) => s + d.value, 0) / 1000).toFixed(0)}K</div>
            <div className="stage-count">{stage.deals.length} Deals</div>
            <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {stage.deals.map((deal, i) => (
                <div key={i} style={{ padding: '0.5rem', background: 'var(--gray-50)', borderRadius: '0.5rem', fontSize: '0.8rem' }}>
                  <div style={{ fontWeight: 600 }}>{deal.title}</div>
                  <div style={{ color: 'var(--gray-500)' }}>{deal.contact} · €{deal.value.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
