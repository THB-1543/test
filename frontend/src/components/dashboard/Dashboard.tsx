import React from 'react';

export const Dashboard: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <h1>📊 Dashboard</h1>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="label">Kontakte gesamt</div>
          <div className="value">1.247</div>
          <div className="change positive">↑ 12% vs. Vormonat</div>
        </div>
        <div className="metric-card">
          <div className="label">Aktive Leads</div>
          <div className="value">89</div>
          <div className="change positive">↑ 8% vs. Vormonat</div>
        </div>
        <div className="metric-card">
          <div className="label">Pipeline-Wert</div>
          <div className="value">€423K</div>
          <div className="change positive">↑ 15% vs. Vormonat</div>
        </div>
        <div className="metric-card">
          <div className="label">Offene Tickets</div>
          <div className="value">23</div>
          <div className="change negative">↑ 3% vs. Vormonat</div>
        </div>
        <div className="metric-card">
          <div className="label">Abschlussquote</div>
          <div className="value">34%</div>
          <div className="change positive">↑ 2% vs. Vormonat</div>
        </div>
        <div className="metric-card">
          <div className="label">Kundenzufriedenheit</div>
          <div className="value">4.6/5</div>
          <div className="change positive">↑ 0.2 vs. Vormonat</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>🎯 Top Leads (KI-Scoring)</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Unternehmen</th>
                <th>Score</th>
                <th>Status</th>
                <th>Nächste Aktion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Anna Schmidt</td>
                <td>TechCorp GmbH</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="score-bar" style={{ width: 80 }}>
                      <div className="score-bar-fill high" style={{ width: '92%' }} />
                    </div>
                    <span>92</span>
                  </div>
                </td>
                <td><span className="badge badge-green">Qualifiziert</span></td>
                <td>Demo-Termin vereinbaren</td>
              </tr>
              <tr>
                <td>Max Müller</td>
                <td>DataFlow AG</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="score-bar" style={{ width: 80 }}>
                      <div className="score-bar-fill high" style={{ width: '85%' }} />
                    </div>
                    <span>85</span>
                  </div>
                </td>
                <td><span className="badge badge-blue">Kontaktiert</span></td>
                <td>Preisinfo senden</td>
              </tr>
              <tr>
                <td>Lisa Weber</td>
                <td>CloudBase GmbH</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="score-bar" style={{ width: 80 }}>
                      <div className="score-bar-fill medium" style={{ width: '67%' }} />
                    </div>
                    <span>67</span>
                  </div>
                </td>
                <td><span className="badge badge-yellow">Neu</span></td>
                <td>Erstgespräch führen</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>💰 Verkaufs-Pipeline</h3>
        </div>
        <div className="pipeline">
          {[
            { name: 'Prospektion', count: 12, value: '€45K' },
            { name: 'Qualifikation', count: 8, value: '€89K' },
            { name: 'Angebot', count: 5, value: '€156K' },
            { name: 'Verhandlung', count: 3, value: '€133K' },
            { name: 'Gewonnen', count: 15, value: '€890K' },
          ].map(stage => (
            <div key={stage.name} className="pipeline-stage">
              <div className="stage-name">{stage.name}</div>
              <div className="stage-value">{stage.value}</div>
              <div className="stage-count">{stage.count} Deals</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>🤖 KI-Empfehlungen (Next Best Actions)</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Priorität</th>
                <th>Empfehlung</th>
                <th>Begründung</th>
                <th>Kanal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="badge badge-red">Hoch</span></td>
                <td>Vertrag von TechCorp verlängern</td>
                <td>Vertrag läuft in 14 Tagen aus</td>
                <td>📞 Telefon</td>
              </tr>
              <tr>
                <td><span className="badge badge-red">Hoch</span></td>
                <td>Max Müller kontaktieren</td>
                <td>Hat Preisseite 5x besucht</td>
                <td>📧 E-Mail</td>
              </tr>
              <tr>
                <td><span className="badge badge-yellow">Mittel</span></td>
                <td>Info-Paket an Lisa Weber senden</td>
                <td>3 Whitepaper heruntergeladen</td>
                <td>📧 E-Mail</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
