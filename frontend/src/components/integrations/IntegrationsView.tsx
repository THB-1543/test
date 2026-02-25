import React from 'react';

export const IntegrationsView: React.FC = () => {
  const activeIntegrations = [
    { name: 'Google Workspace', type: 'email_provider', status: 'active', lastSync: '2026-02-25T09:30:00' },
    { name: 'Slack', type: 'collaboration', status: 'active', lastSync: '2026-02-25T09:25:00' },
    { name: 'Shopify', type: 'ecommerce', status: 'active', lastSync: '2026-02-25T08:00:00' },
  ];

  const marketplace = [
    { name: 'HubSpot', type: 'marketing', description: 'Marketing-Automatisierung und Inbound-Marketing-Plattform' },
    { name: 'Mailchimp', type: 'marketing', description: 'E-Mail-Marketing und Automatisierung' },
    { name: 'SAP', type: 'erp', description: 'Enterprise Resource Planning — Rechnungs- und Bestelldaten' },
    { name: 'Oracle', type: 'erp', description: 'Enterprise Resource Planning System' },
    { name: 'Shopify', type: 'ecommerce', description: 'E-Commerce-Plattform-Integration' },
    { name: 'Magento', type: 'ecommerce', description: 'E-Commerce-Plattform-Integration' },
    { name: 'Slack', type: 'collaboration', description: 'Team-Messaging und Zusammenarbeit' },
    { name: 'Microsoft Teams', type: 'collaboration', description: 'Team-Kommunikation und Zusammenarbeit' },
    { name: 'Google Workspace', type: 'email_provider', description: 'Kalender, E-Mail und Produktivitätssuite' },
    { name: 'Microsoft 365', type: 'email_provider', description: 'Kalender, E-Mail und Produktivitätssuite' },
    { name: 'LinkedIn', type: 'social_media', description: 'Professionelles Netzwerk — Kontaktanreicherung' },
    { name: 'WhatsApp Business', type: 'social_media', description: 'Kunden-Messaging über WhatsApp' },
  ];

  const typeBadge = (type: string) => {
    const map: Record<string, { badge: string; label: string }> = {
      marketing: { badge: 'badge-blue', label: '📈 Marketing' },
      erp: { badge: 'badge-yellow', label: '🏭 ERP' },
      ecommerce: { badge: 'badge-green', label: '🛒 E-Commerce' },
      collaboration: { badge: 'badge-blue', label: '💬 Kollaboration' },
      email_provider: { badge: 'badge-gray', label: '📧 E-Mail/Kalender' },
      social_media: { badge: 'badge-blue', label: '🌐 Social Media' },
    };
    return map[type] || { badge: 'badge-gray', label: type };
  };

  return (
    <div>
      <div className="page-header">
        <h1>🔗 Integrationen</h1>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Aktive Integrationen</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Typ</th>
                <th>Status</th>
                <th>Letzte Synchronisierung</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {activeIntegrations.map(int => (
                <tr key={int.name}>
                  <td style={{ fontWeight: 600 }}>{int.name}</td>
                  <td><span className={`badge ${typeBadge(int.type).badge}`}>{typeBadge(int.type).label}</span></td>
                  <td><span className="badge badge-green">Aktiv</span></td>
                  <td>{new Date(int.lastSync).toLocaleString('de-DE')}</td>
                  <td>
                    <button className="btn btn-sm btn-secondary">⚙️ Konfigurieren</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>🏪 Integration Marketplace</h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>
          Verbinden Sie Ihr CRM mit führenden Business-Tools per Klick.
        </p>
        <div className="integrations-grid">
          {marketplace.map(int => (
            <div key={int.name} className="integration-card">
              <h4>{int.name}</h4>
              <span className={`badge ${typeBadge(int.type).badge}`}>{typeBadge(int.type).label}</span>
              <p>{int.description}</p>
              <button className="btn btn-sm btn-primary" style={{ marginTop: 'auto' }}>
                {activeIntegrations.some(a => a.name === int.name) ? '✅ Verbunden' : '+ Verbinden'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>🔧 REST API</h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '0.75rem' }}>
          Nutzen Sie unsere leistungsfähige REST API für maßgeschneiderte Integrationen.
        </p>
        <div style={{ padding: '1rem', background: 'var(--gray-900)', color: '#fff', borderRadius: '0.5rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
          <div style={{ color: '#9ca3af' }}># API-Endpunkte</div>
          <div>GET    /api/contacts         <span style={{ color: '#6ee7b7' }}>{/* Kontakte abrufen */}</span></div>
          <div>POST   /api/contacts         <span style={{ color: '#6ee7b7' }}>{/* Kontakt erstellen */}</span></div>
          <div>GET    /api/leads            <span style={{ color: '#6ee7b7' }}>{/* Leads mit KI-Scoring */}</span></div>
          <div>POST   /api/ai/sentiment     <span style={{ color: '#6ee7b7' }}>{/* Sentiment-Analyse */}</span></div>
          <div>POST   /api/ai/email-draft   <span style={{ color: '#6ee7b7' }}>{/* KI-E-Mail-Generator */}</span></div>
          <div>POST   /api/ai/analyze-call  <span style={{ color: '#6ee7b7' }}>{/* Gesprächsanalyse */}</span></div>
          <div>GET    /api/opportunities/pipeline <span style={{ color: '#6ee7b7' }}>{/* Pipeline-Übersicht */}</span></div>
        </div>
      </div>
    </div>
  );
};
