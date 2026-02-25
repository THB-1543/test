import React from 'react';

export const LeadsList: React.FC = () => {
  const leads = [
    { id: '1', name: 'Anna Schmidt', company: 'TechCorp GmbH', score: 92, status: 'qualified', source: 'website', factors: ['Email engagement: 5 opens, 3 clicks', 'Web activity: 12 page views, 2 downloads', 'Form engagement: 2 form submissions', 'Profile completeness: 100%', 'Recency: 8 activities in last 7 days'] },
    { id: '2', name: 'Max Müller', company: 'DataFlow AG', score: 85, status: 'contacted', source: 'linkedin', factors: ['Email engagement: 3 opens, 2 clicks', 'Web activity: 8 page views, 1 download', 'Recency: 5 activities in last 7 days'] },
    { id: '3', name: 'Lisa Weber', company: 'CloudBase GmbH', score: 67, status: 'new', source: 'referral', factors: ['Web activity: 6 page views', 'Form engagement: 1 form submission'] },
    { id: '4', name: 'Thomas Fischer', company: 'GreenTech Solutions', score: 45, status: 'new', source: 'event', factors: ['Email engagement: 1 open', 'Profile completeness: 75%'] },
    { id: '5', name: 'Sandra Klein', company: 'FinServ GmbH', score: 33, status: 'unqualified', source: 'cold-email', factors: ['Low engagement', 'No recent activity'] },
  ];

  const getScoreClass = (score: number) => score > 70 ? 'high' : score > 40 ? 'medium' : 'low';
  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = { new: 'badge-yellow', contacted: 'badge-blue', qualified: 'badge-green', unqualified: 'badge-gray', converted: 'badge-green' };
    return map[status] || 'badge-gray';
  };

  return (
    <div>
      <div className="page-header">
        <h1>🎯 Leads & KI-Scoring</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary">🔄 Alle neu bewerten</button>
          <button className="btn btn-primary">+ Neuer Lead</button>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="label">Gesamte Leads</div>
          <div className="value">{leads.length}</div>
        </div>
        <div className="metric-card">
          <div className="label">Durchschn. Score</div>
          <div className="value">{Math.round(leads.reduce((s, l) => s + l.score, 0) / leads.length)}</div>
        </div>
        <div className="metric-card">
          <div className="label">Qualifiziert</div>
          <div className="value">{leads.filter(l => l.status === 'qualified').length}</div>
        </div>
        <div className="metric-card">
          <div className="label">Hohe Priorität (Score &gt; 70)</div>
          <div className="value">{leads.filter(l => l.score > 70).length}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Lead-Übersicht (sortiert nach KI-Score)</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Unternehmen</th>
                <th>KI-Score</th>
                <th>Status</th>
                <th>Quelle</th>
                <th>Score-Faktoren</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id}>
                  <td style={{ fontWeight: 600 }}>{lead.name}</td>
                  <td>{lead.company}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="score-bar" style={{ width: 100 }}>
                        <div className={`score-bar-fill ${getScoreClass(lead.score)}`} style={{ width: `${lead.score}%` }} />
                      </div>
                      <strong>{lead.score}</strong>
                    </div>
                  </td>
                  <td><span className={`badge ${getStatusBadge(lead.status)}`}>{lead.status}</span></td>
                  <td><span className="badge badge-gray">{lead.source}</span></td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                    {lead.factors.slice(0, 2).join(' · ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
