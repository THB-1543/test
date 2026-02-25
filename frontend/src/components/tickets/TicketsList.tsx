import React from 'react';

export const TicketsList: React.FC = () => {
  const tickets = [
    { id: '1', subject: 'API-Endpoint gibt 500 zurück', contact: 'Max Müller', status: 'open', priority: 'high', channel: 'email', sentiment: { label: 'negative' as const, score: -0.6 }, description: 'Ich bin sehr frustriert! Der API-Endpoint gibt ständig Fehler zurück.' },
    { id: '2', subject: 'Rechnungsfrage Q1', contact: 'Anna Schmidt', status: 'in_progress', priority: 'medium', channel: 'chat', sentiment: { label: 'neutral' as const, score: 0 }, description: 'Können Sie mir bitte die Rechnung für Q1 zusenden?' },
    { id: '3', subject: 'Funktionsanfrage: Dark Mode', contact: 'Lisa Weber', status: 'open', priority: 'low', channel: 'email', sentiment: { label: 'positive' as const, score: 0.5 }, description: 'Tolles Produkt! Wäre es möglich, einen Dark Mode zu implementieren?' },
    { id: '4', subject: 'Datenimport fehlgeschlagen', contact: 'Thomas Fischer', status: 'waiting', priority: 'critical', channel: 'phone', sentiment: { label: 'negative' as const, score: -0.8 }, description: 'Der Datenimport ist zum dritten Mal fehlgeschlagen. Das ist inakzeptabel!' },
  ];

  const priorityBadge = (p: string) => {
    const map: Record<string, string> = { low: 'badge-gray', medium: 'badge-yellow', high: 'badge-red', critical: 'badge-red' };
    return map[p] || 'badge-gray';
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = { open: 'badge-yellow', in_progress: 'badge-blue', waiting: 'badge-gray', resolved: 'badge-green', closed: 'badge-green' };
    return map[s] || 'badge-gray';
  };

  const channelIcon = (c: string) => {
    const map: Record<string, string> = { email: '📧', phone: '📞', chat: '💬', whatsapp: '📱', sms: '📲', social: '🌐' };
    return map[c] || '📧';
  };

  return (
    <div>
      <div className="page-header">
        <h1>🎫 Support-Tickets</h1>
        <button className="btn btn-primary">+ Neues Ticket</button>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="label">Offene Tickets</div>
          <div className="value">{tickets.filter(t => t.status === 'open').length}</div>
        </div>
        <div className="metric-card">
          <div className="label">In Bearbeitung</div>
          <div className="value">{tickets.filter(t => t.status === 'in_progress').length}</div>
        </div>
        <div className="metric-card">
          <div className="label">Negatives Sentiment</div>
          <div className="value" style={{ color: 'var(--danger)' }}>{tickets.filter(t => t.sentiment.label === 'negative').length}</div>
        </div>
        <div className="metric-card">
          <div className="label">Kritische Priorität</div>
          <div className="value" style={{ color: 'var(--danger)' }}>{tickets.filter(t => t.priority === 'critical').length}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Alle Tickets (mit KI-Sentiment-Analyse)</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Betreff</th>
                <th>Kontakt</th>
                <th>Kanal</th>
                <th>Status</th>
                <th>Priorität</th>
                <th>KI-Sentiment</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id}>
                  <td style={{ fontWeight: 600 }}>{ticket.subject}</td>
                  <td>{ticket.contact}</td>
                  <td>{channelIcon(ticket.channel)} {ticket.channel}</td>
                  <td><span className={`badge ${statusBadge(ticket.status)}`}>{ticket.status}</span></td>
                  <td><span className={`badge ${priorityBadge(ticket.priority)}`}>{ticket.priority}</span></td>
                  <td>
                    <div className="sentiment">
                      <div className={`sentiment-dot ${ticket.sentiment.label}`} />
                      {ticket.sentiment.label}
                      <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                        ({ticket.sentiment.score.toFixed(1)})
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>⚠️ Auto-Eskalation durch KI</h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '0.75rem' }}>
          Die KI erkennt automatisch negative Stimmungen in Kunden-Nachrichten und eskaliert Tickets bei Bedarf.
        </p>
        {tickets.filter(t => t.sentiment.label === 'negative').map(t => (
          <div key={t.id} style={{ padding: '0.75rem', background: '#fee2e2', borderRadius: '0.5rem', marginBottom: '0.5rem', border: '1px solid #fecaca' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>⚠️ {t.subject}</div>
            <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Kunde: {t.contact} · Sentiment: {t.sentiment.score.toFixed(1)}</div>
            <div style={{ fontSize: '0.8rem', fontStyle: 'italic', marginTop: '0.25rem', color: 'var(--gray-700)' }}>"{t.description}"</div>
          </div>
        ))}
      </div>
    </div>
  );
};
