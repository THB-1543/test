import React, { useState } from 'react';

export const CustomerProfile: React.FC<{ contactId: string; onBack: () => void }> = ({ contactId, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock profile data
  const profile = {
    contact: { id: contactId, firstName: 'Anna', lastName: 'Schmidt', email: 'anna@techcorp.de', phone: '+49 30 1234567', company: 'TechCorp GmbH', jobTitle: 'CEO' },
    healthScore: 85,
    lifetimeValue: 125000,
    leads: [{ id: 'l1', score: 92, status: 'qualified', source: 'website' }],
    opportunities: [
      { id: 'o1', title: 'Enterprise Lizenz', value: 50000, stage: 'negotiation', probability: 0.75 },
      { id: 'o2', title: 'Support-Vertrag', value: 12000, stage: 'proposal', probability: 0.6 },
    ],
    tickets: [
      { id: 't1', subject: 'API-Integration Frage', status: 'resolved', priority: 'medium', sentiment: { label: 'neutral' as const } },
    ],
    activities: [
      { type: 'page_view', description: 'Visited pricing page', timestamp: '2026-02-24T14:30:00' },
      { type: 'email_open', description: 'Opened "Product Update" email', timestamp: '2026-02-23T10:15:00' },
      { type: 'download', description: 'Downloaded whitepaper "Cloud Migration"', timestamp: '2026-02-22T09:00:00' },
      { type: 'meeting', description: 'Discovery call with Sales team', timestamp: '2026-02-20T16:00:00' },
      { type: 'form_submit', description: 'Submitted demo request form', timestamp: '2026-02-18T11:30:00' },
    ],
    nextBestActions: [
      { action: 'Send contract proposal', reason: 'High lead score and active engagement', priority: 0.95, channel: 'email' },
      { action: 'Schedule follow-up call', reason: 'Opportunity in negotiation stage', priority: 0.85, channel: 'phone' },
    ],
    segments: ['Enterprise', 'Active Users', 'High Value'],
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={onBack}>← Zurück</button>
          <h1>360°-Kundenprofil</h1>
        </div>
      </div>

      <div className="profile-header">
        <div className="profile-avatar">
          {profile.contact.firstName[0]}{profile.contact.lastName[0]}
        </div>
        <div className="profile-info">
          <h2>{profile.contact.firstName} {profile.contact.lastName}</h2>
          <p>{profile.contact.jobTitle} bei {profile.contact.company}</p>
          <p>{profile.contact.email} · {profile.contact.phone}</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
          {profile.segments.map(s => (
            <span key={s} className="badge badge-blue">{s}</span>
          ))}
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="label">Lead Score (KI)</div>
          <div className="value">{profile.leads[0]?.score || 0}</div>
          <div className="score-bar" style={{ marginTop: '0.5rem' }}>
            <div className="score-bar-fill high" style={{ width: `${profile.leads[0]?.score || 0}%` }} />
          </div>
        </div>
        <div className="metric-card">
          <div className="label">Health Score</div>
          <div className="value">{profile.healthScore}</div>
          <div className="score-bar" style={{ marginTop: '0.5rem' }}>
            <div className={`score-bar-fill ${profile.healthScore > 70 ? 'high' : profile.healthScore > 40 ? 'medium' : 'low'}`} style={{ width: `${profile.healthScore}%` }} />
          </div>
        </div>
        <div className="metric-card">
          <div className="label">Lifetime Value</div>
          <div className="value">€{(profile.lifetimeValue / 1000).toFixed(0)}K</div>
        </div>
        <div className="metric-card">
          <div className="label">Offene Deals</div>
          <div className="value">{profile.opportunities.length}</div>
        </div>
      </div>

      <div className="tabs">
        {['overview', 'activities', 'deals', 'tickets', 'ai-actions'].map(tab => (
          <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'overview' && 'Übersicht'}
            {tab === 'activities' && 'Aktivitäten'}
            {tab === 'deals' && 'Deals'}
            {tab === 'tickets' && 'Tickets'}
            {tab === 'ai-actions' && 'KI-Empfehlungen'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="profile-grid">
          <div className="card">
            <div className="card-header"><h3>Letzte Aktivitäten</h3></div>
            {profile.activities.slice(0, 5).map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid var(--gray-100)' }}>
                <span style={{ fontSize: '1.2rem' }}>
                  {a.type === 'page_view' && '🌐'}
                  {a.type === 'email_open' && '📧'}
                  {a.type === 'download' && '📥'}
                  {a.type === 'meeting' && '📅'}
                  {a.type === 'form_submit' && '📝'}
                </span>
                <div>
                  <div style={{ fontSize: '0.85rem' }}>{a.description}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                    {new Date(a.timestamp).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-header"><h3>KI-Empfehlungen</h3></div>
            {profile.nextBestActions.map((a, i) => (
              <div key={i} style={{ padding: '0.75rem', background: 'var(--gray-50)', borderRadius: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{a.action}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{a.reason}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <span className="badge badge-gray">{a.channel === 'email' ? '📧 E-Mail' : '📞 Telefon'}</span>
                  <button className="btn btn-sm btn-primary">Ausführen</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'activities' && (
        <div className="card">
          <div className="card-header"><h3>Alle Aktivitäten (Customer Journey)</h3></div>
          {profile.activities.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid var(--gray-100)' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {a.type === 'page_view' && '🌐'}
                {a.type === 'email_open' && '📧'}
                {a.type === 'download' && '📥'}
                {a.type === 'meeting' && '📅'}
                {a.type === 'form_submit' && '📝'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>{a.description}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                  {new Date(a.timestamp).toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <span className="badge badge-gray">{a.type}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'deals' && (
        <div className="card">
          <div className="card-header"><h3>Opportunities</h3></div>
          <table>
            <thead>
              <tr><th>Titel</th><th>Wert</th><th>Phase</th><th>Wahrscheinlichkeit</th></tr>
            </thead>
            <tbody>
              {profile.opportunities.map(o => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 600 }}>{o.title}</td>
                  <td>€{o.value.toLocaleString()}</td>
                  <td><span className="badge badge-blue">{o.stage}</span></td>
                  <td>{(o.probability * 100).toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className="card">
          <div className="card-header"><h3>Support-Tickets</h3></div>
          <table>
            <thead>
              <tr><th>Betreff</th><th>Status</th><th>Priorität</th><th>Stimmung</th></tr>
            </thead>
            <tbody>
              {profile.tickets.map(t => (
                <tr key={t.id}>
                  <td>{t.subject}</td>
                  <td><span className={`badge ${t.status === 'resolved' ? 'badge-green' : 'badge-yellow'}`}>{t.status}</span></td>
                  <td><span className="badge badge-gray">{t.priority}</span></td>
                  <td>
                    <div className="sentiment">
                      <div className={`sentiment-dot ${t.sentiment.label}`} />
                      {t.sentiment.label}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'ai-actions' && (
        <div className="card">
          <div className="card-header"><h3>🤖 KI-gestützte Empfehlungen</h3></div>
          <p style={{ color: 'var(--gray-500)', marginBottom: '1rem', fontSize: '0.85rem' }}>
            Basierend auf Verhaltensdaten, Lead-Scoring und historischen Mustern empfiehlt die KI folgende Aktionen:
          </p>
          {profile.nextBestActions.map((a, i) => (
            <div key={i} style={{ padding: '1rem', background: 'var(--gray-50)', borderRadius: '0.75rem', marginBottom: '0.75rem', border: '1px solid var(--gray-200)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong>{a.action}</strong>
                <span className={`badge ${a.priority > 0.9 ? 'badge-red' : 'badge-yellow'}`}>
                  Priorität: {(a.priority * 100).toFixed(0)}%
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '0.5rem' }}>{a.reason}</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-sm btn-primary">✓ Ausführen</button>
                <button className="btn btn-sm btn-secondary">Später</button>
                <button className="btn btn-sm btn-secondary">Ablehnen</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
