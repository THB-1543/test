import React from 'react';

export const SegmentsView: React.FC = () => {
  const segments = [
    { id: '1', name: 'Enterprise-Kunden', description: 'Große Unternehmen mit >100 Mitarbeitern', contactCount: 45, isDynamic: true, rules: [{ field: 'company', operator: 'contains', value: 'GmbH' }] },
    { id: '2', name: 'Aktive Nutzer', description: 'Kontakte mit Aktivität in den letzten 30 Tagen', contactCount: 234, isDynamic: true, rules: [] },
    { id: '3', name: 'High-Value Leads', description: 'Leads mit Score > 70', contactCount: 28, isDynamic: true, rules: [] },
    { id: '4', name: 'Abwanderungsgefährdet', description: 'Kunden ohne Aktivität seit 60+ Tagen', contactCount: 12, isDynamic: true, rules: [] },
    { id: '5', name: 'Newsletter-Abonnenten', description: 'Opt-in für Marketing-E-Mails', contactCount: 567, isDynamic: false, rules: [] },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>📋 Dynamische Segmente</h1>
        <button className="btn btn-primary">+ Neues Segment</button>
      </div>

      <p style={{ color: 'var(--gray-500)', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Kunden werden in Echtzeit basierend auf Verhalten und Interessen segmentiert — keine starren Listen.
      </p>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Segment</th>
                <th>Beschreibung</th>
                <th>Kontakte</th>
                <th>Typ</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {segments.map(seg => (
                <tr key={seg.id}>
                  <td style={{ fontWeight: 600 }}>{seg.name}</td>
                  <td style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>{seg.description}</td>
                  <td><strong>{seg.contactCount}</strong></td>
                  <td>
                    <span className={`badge ${seg.isDynamic ? 'badge-blue' : 'badge-gray'}`}>
                      {seg.isDynamic ? '🔄 Dynamisch' : '📌 Statisch'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-secondary">Bearbeiten</button>
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
