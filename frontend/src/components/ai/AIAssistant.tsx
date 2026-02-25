import React, { useState } from 'react';

export const AIAssistant: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sentiment');
  const [sentimentText, setSentimentText] = useState('');
  const [sentimentResult, setSentimentResult] = useState<{ label: string; score: number; keywords: string[] } | null>(null);
  const [emailPurpose, setEmailPurpose] = useState('follow_up');
  const [emailTone, setEmailTone] = useState('friendly');
  const [emailDraft, setEmailDraft] = useState<{ subject: string; body: string } | null>(null);

  const analyzeSentiment = () => {
    const text = sentimentText.toLowerCase();
    const positive = ['great', 'excellent', 'love', 'amazing', 'happy', 'satisfied', 'thank', 'großartig', 'fantastisch', 'toll', 'danke', 'super'];
    const negative = ['angry', 'frustrated', 'terrible', 'awful', 'hate', 'broken', 'useless', 'wütend', 'frustriert', 'enttäuscht', 'schrecklich', 'inakzeptabel'];

    const posCount = positive.filter(w => text.includes(w)).length;
    const negCount = negative.filter(w => text.includes(w)).length;
    const keywords = [...positive.filter(w => text.includes(w)), ...negative.filter(w => text.includes(w))];

    let label = 'neutral';
    let score = 0;
    if (posCount > negCount) { label = 'positive'; score = posCount / (posCount + negCount); }
    else if (negCount > posCount) { label = 'negative'; score = -(negCount / (posCount + negCount)); }

    setSentimentResult({ label, score: Math.round(score * 100) / 100, keywords });
  };

  const generateEmail = () => {
    const templates: Record<string, { subject: string; body: string }> = {
      follow_up: {
        subject: 'Follow-up: Unser Gespräch',
        body: emailTone === 'formal'
          ? 'Sehr geehrte(r) Herr/Frau Mustermann,\n\nvielen Dank für Ihr Interesse und das angenehme Gespräch.\n\nIch möchte gerne an unser letztes Gespräch anknüpfen und Ihnen weitere Informationen zukommen lassen.\n\nWann passt es Ihnen am besten für ein kurzes Telefonat?\n\nMit freundlichen Grüßen'
          : 'Hallo Herr/Frau Mustermann,\n\nvielen Dank für Ihr Interesse und das angenehme Gespräch.\n\nIch möchte gerne an unser letztes Gespräch anknüpfen und Ihnen weitere Informationen zukommen lassen.\n\nWann passt es Ihnen am besten für ein kurzes Telefonat?\n\nBeste Grüße',
      },
      introduction: {
        subject: 'Vorstellung: Wie wir Ihrem Unternehmen helfen können',
        body: emailTone === 'formal'
          ? 'Sehr geehrte(r) Herr/Frau Mustermann,\n\nich hoffe, diese Nachricht erreicht Sie gut.\n\nWir unterstützen Unternehmen dabei, ihre Geschäftsprozesse zu optimieren.\n\nGerne würde ich Ihnen in einem kurzen Gespräch zeigen, wie wir auch Ihnen helfen können.\n\nMit freundlichen Grüßen'
          : 'Hallo Herr/Frau Mustermann,\n\nich hoffe, diese Nachricht erreicht Sie gut.\n\nWir unterstützen Unternehmen dabei, ihre Geschäftsprozesse zu optimieren.\n\nGerne würde ich Ihnen in einem kurzen Gespräch zeigen, wie wir auch Ihnen helfen können.\n\nBeste Grüße',
      },
      support: {
        subject: 'Ihr Anliegen — Wir sind für Sie da',
        body: 'Hallo Herr/Frau Mustermann,\n\nvielen Dank, dass Sie sich an uns gewendet haben.\n\nWir haben Ihr Anliegen erhalten und kümmern uns umgehend darum. Ein Mitarbeiter wird sich in Kürze bei Ihnen melden.\n\nBeste Grüße',
      },
    };
    setEmailDraft(templates[emailPurpose] || templates.follow_up);
  };

  return (
    <div>
      <div className="page-header">
        <h1>🤖 KI-Assistent</h1>
      </div>

      <div className="tabs">
        {[
          { id: 'sentiment', label: '😊 Sentiment-Analyse' },
          { id: 'email', label: '📧 E-Mail-Generator' },
          { id: 'coaching', label: '🎙️ Gesprächs-Coaching' },
          { id: 'summary', label: '📝 Zusammenfassungen' },
        ].map(tab => (
          <button key={tab.id} className={`tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'sentiment' && (
        <div className="card">
          <div className="card-header">
            <h3>Sentiment-Analyse</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>
            Analysieren Sie die Stimmung in Kunden-Nachrichten, E-Mails oder Support-Tickets automatisch.
          </p>
          <div className="form-group">
            <label>Text eingeben</label>
            <textarea
              placeholder="Kunden-Nachricht hier einfügen..."
              value={sentimentText}
              onChange={e => setSentimentText(e.target.value)}
              rows={5}
            />
          </div>
          <button className="btn btn-primary" onClick={analyzeSentiment}>🔍 Sentiment analysieren</button>

          {sentimentResult && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--gray-50)', borderRadius: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Stimmung</div>
                  <div className="sentiment" style={{ marginTop: '0.25rem' }}>
                    <div className={`sentiment-dot ${sentimentResult.label}`} />
                    <strong style={{ textTransform: 'capitalize' }}>{sentimentResult.label}</strong>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Score</div>
                  <strong>{sentimentResult.score}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Schlüsselwörter</div>
                  <div>{sentimentResult.keywords.map(k => <span key={k} className="badge badge-blue" style={{ marginRight: 4 }}>{k}</span>)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'email' && (
        <div className="card">
          <div className="card-header">
            <h3>KI-E-Mail-Generator</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>
            Erstellen Sie personalisierte E-Mail-Entwürfe auf Basis von Stichworten und Kundendaten.
          </p>
          <div className="form-row">
            <div className="form-group">
              <label>Zweck</label>
              <select value={emailPurpose} onChange={e => setEmailPurpose(e.target.value)}>
                <option value="follow_up">Follow-up</option>
                <option value="introduction">Vorstellung</option>
                <option value="support">Support-Antwort</option>
              </select>
            </div>
            <div className="form-group">
              <label>Tonalität</label>
              <select value={emailTone} onChange={e => setEmailTone(e.target.value)}>
                <option value="friendly">Freundlich</option>
                <option value="formal">Formell</option>
                <option value="urgent">Dringend</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" onClick={generateEmail}>✨ E-Mail generieren</button>

          {emailDraft && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Betreff: {emailDraft.subject}</div>
              <div className="email-draft">{emailDraft.body}</div>
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm">📧 Senden</button>
                <button className="btn btn-secondary btn-sm">✏️ Bearbeiten</button>
                <button className="btn btn-secondary btn-sm">🔄 Neu generieren</button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'coaching' && (
        <div className="card">
          <div className="card-header">
            <h3>Conversation Intelligence — Gesprächs-Coaching</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>
            Analyse von Verkaufsgesprächen mit KI-Feedback zu Redeanteil, Schlüsselwörtern und Tonalität.
          </p>

          <div style={{ padding: '1rem', background: 'var(--gray-50)', borderRadius: '0.75rem', marginBottom: '1rem' }}>
            <h4 style={{ marginBottom: '0.75rem' }}>Letzte Gesprächsanalyse: Anruf mit Max Müller (12:35 Min)</h4>
            <div className="form-row">
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>Redeanteil</div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <div style={{ flex: 1, height: 20, background: 'var(--primary)', borderRadius: '4px 0 0 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem' }}>
                    Berater 62%
                  </div>
                  <div style={{ flex: 0.6, height: 20, background: 'var(--gray-300)', borderRadius: '0 4px 4px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                    Kunde 38%
                  </div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>Stimmung</div>
                <div className="sentiment">
                  <div className="sentiment-dot neutral" />
                  Neutral → Positiv
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>Schlüsselwörter</div>
              {['Preismodell', 'Enterprise', 'Integration', 'API', 'Support', 'Timeline'].map(kw => (
                <span key={kw} className="badge badge-blue" style={{ marginRight: 4, marginBottom: 4 }}>{kw}</span>
              ))}
            </div>

            <div style={{ marginTop: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: '0.5rem' }}>KI-Empfehlungen</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ padding: '0.5rem', background: '#fff', borderRadius: '0.5rem', fontSize: '0.85rem' }}>
                  💡 Tipp: Versuchen Sie, den Kunden mehr sprechen zu lassen (Ziel: 50/50 Ratio)
                </div>
                <div style={{ padding: '0.5rem', background: '#fff', borderRadius: '0.5rem', fontSize: '0.85rem' }}>
                  ✅ Gut: Sie haben die wichtigsten Themen (Pricing, Integration) angesprochen
                </div>
                <div style={{ padding: '0.5rem', background: '#fff', borderRadius: '0.5rem', fontSize: '0.85rem' }}>
                  📅 Nächster Schritt: Demo-Termin innerhalb der nächsten Woche vereinbaren
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'summary' && (
        <div className="card">
          <div className="card-header">
            <h3>KI-Zusammenfassungen</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>
            Automatische Zusammenfassung von E-Mail-Verläufen, Meeting-Notizen oder Support-Tickets.
          </p>

          <div style={{ padding: '1rem', background: 'var(--gray-50)', borderRadius: '0.75rem' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Zusammenfassung: E-Mail-Verlauf mit Anna Schmidt (5 Nachrichten)</h4>
            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.5rem', marginBottom: '0.75rem' }}>
              <strong>Zusammenfassung:</strong>
              <p style={{ marginTop: '0.25rem', fontSize: '0.85rem' }}>
                Anna Schmidt von TechCorp GmbH interessiert sich für ein Upgrade auf das Enterprise-Paket. Sie hat Fragen zur
                API-Integration und SSO-Funktionalität. Ein Demo-Termin wurde für nächste Woche vereinbart. Der Vertragsvorschlag
                soll bis Freitag versendet werden.
              </p>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <strong style={{ fontSize: '0.85rem' }}>Wichtige Punkte:</strong>
              <ul style={{ paddingLeft: '1.5rem', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                <li>Interesse am Enterprise-Paket</li>
                <li>Fragen zu API-Integration und SSO</li>
                <li>Demo-Termin nächste Woche</li>
                <li>Budget vorhanden, Entscheidung bis Monatsende</li>
              </ul>
            </div>

            <div>
              <strong style={{ fontSize: '0.85rem' }}>Aktionspunkte:</strong>
              <ul style={{ paddingLeft: '1.5rem', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                <li>✅ Vertragsvorschlag bis Freitag senden</li>
                <li>✅ Demo-Termin bestätigen</li>
                <li>✅ Technische Dokumentation für API-Integration bereitstellen</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
