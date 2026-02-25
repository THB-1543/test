import React from 'react';

export const WorkflowsView: React.FC = () => {
  const workflows = [
    {
      id: '1', name: 'Willkommens-E-Mail-Sequenz', description: 'Sendet eine Willkommens-E-Mail und Follow-up an neue Leads',
      trigger: { type: 'event', event: 'lead_created' }, isActive: true,
      steps: [
        { type: 'email', label: 'Willkommens-E-Mail senden' },
        { type: 'wait', label: '24 Stunden warten' },
        { type: 'email', label: 'Follow-up mit Ressourcen senden' },
        { type: 'wait', label: '3 Tage warten' },
        { type: 'condition', label: 'E-Mail geöffnet?' },
        { type: 'email', label: 'Demo-Einladung senden' },
      ],
    },
    {
      id: '2', name: 'Warenkorbabbruch-Recovery', description: 'Personalisierte Rückgewinnungskampagne bei Kaufabbruch',
      trigger: { type: 'event', event: 'cart_abandoned' }, isActive: true,
      steps: [
        { type: 'wait', label: '1 Stunde warten' },
        { type: 'email', label: 'Hilfsangebot per E-Mail' },
        { type: 'wait', label: '1 Tag warten' },
        { type: 'sms', label: 'SMS mit Rabattcode (5%)' },
      ],
    },
    {
      id: '3', name: 'Vertragsverlängerung', description: 'Automatische Erinnerung vor Vertragsablauf',
      trigger: { type: 'schedule', event: 'contract_expiry_30d' }, isActive: true,
      steps: [
        { type: 'email', label: 'Erinnerung: Vertrag läuft in 30 Tagen ab' },
        { type: 'wait', label: '14 Tage warten' },
        { type: 'notify', label: 'Account Manager benachrichtigen' },
        { type: 'email', label: 'Erneuerungsangebot senden' },
      ],
    },
    {
      id: '4', name: 'Lead-Nurturing', description: 'Bildungs- und Engagement-Kampagne für neue Leads',
      trigger: { type: 'event', event: 'form_submitted' }, isActive: false,
      steps: [
        { type: 'email', label: 'Whitepaper zusenden' },
        { type: 'wait', label: '5 Tage warten' },
        { type: 'email', label: 'Case Study zusenden' },
        { type: 'wait', label: '7 Tage warten' },
        { type: 'condition', label: 'Lead Score > 60?' },
        { type: 'notify', label: 'Vertrieb benachrichtigen' },
      ],
    },
  ];

  const stepIcon = (type: string) => {
    const map: Record<string, string> = { email: '📧', wait: '⏳', condition: '🔀', sms: '📱', notify: '🔔', webhook: '🔗', update_field: '✏️' };
    return map[type] || '⚙️';
  };

  return (
    <div>
      <div className="page-header">
        <h1>⚡ Workflow-Automatisierung</h1>
        <button className="btn btn-primary">+ Neuer Workflow</button>
      </div>

      <p style={{ color: 'var(--gray-500)', marginBottom: '1rem', fontSize: '0.9rem' }}>
        No-Code Workflow-Builder: Erstellen Sie automatisierte Kommunikationsketten ohne Programmierkenntnisse.
      </p>

      {workflows.map(wf => (
        <div key={wf.id} className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h3>{wf.name}</h3>
              <span className={`badge ${wf.isActive ? 'badge-green' : 'badge-gray'}`}>
                {wf.isActive ? '✅ Aktiv' : '⏸️ Inaktiv'}
              </span>
            </div>
            <button className="btn btn-sm btn-secondary">Bearbeiten</button>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '0.75rem' }}>{wf.description}</p>
          <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: '0.75rem' }}>
            Trigger: <span className="badge badge-blue">{wf.trigger.type === 'event' ? `🎯 Event: ${wf.trigger.event}` : `⏰ Schedule: ${wf.trigger.event}`}</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {wf.steps.map((step, i) => (
              <React.Fragment key={i}>
                <div style={{
                  padding: '0.4rem 0.75rem', background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
                  borderRadius: '0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem',
                }}>
                  {stepIcon(step.type)} {step.label}
                </div>
                {i < wf.steps.length - 1 && <span style={{ color: 'var(--gray-300)' }}>→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
