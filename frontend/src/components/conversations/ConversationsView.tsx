import React, { useState } from 'react';

const mockConversations = [
  {
    id: '1', contact: 'Anna Schmidt', channel: 'chat', subject: 'Produktanfrage', status: 'active',
    messages: [
      { sender: 'customer' as const, senderName: 'Anna Schmidt', content: 'Hallo! Ich interessiere mich für Ihr Enterprise-Paket. Können Sie mir mehr Informationen geben?', channel: 'chat', timestamp: '2026-02-25T09:00:00' },
      { sender: 'bot' as const, senderName: 'KI-Chatbot', content: 'Willkommen, Anna! Ich habe Ihre Kundendaten gefunden. Sie haben bereits das Professional-Paket. Ich verbinde Sie mit einem Berater für das Enterprise-Upgrade.', channel: 'chat', timestamp: '2026-02-25T09:00:05' },
      { sender: 'agent' as const, senderName: 'Berater Stefan', content: 'Hallo Anna! Ich sehe, Sie nutzen bereits unser Professional-Paket seit 6 Monaten. Das Enterprise-Paket bietet Ihnen zusätzlich SSO, Priority Support und unbegrenzte API-Calls. Soll ich Ihnen ein individuelles Angebot erstellen?', channel: 'chat', timestamp: '2026-02-25T09:01:00' },
    ],
  },
  {
    id: '2', contact: 'Max Müller', channel: 'whatsapp', subject: 'Bestellstatus', status: 'active',
    messages: [
      { sender: 'customer' as const, senderName: 'Max Müller', content: 'Wie ist der Status meiner Bestellung #12345?', channel: 'whatsapp', timestamp: '2026-02-25T08:30:00' },
      { sender: 'bot' as const, senderName: 'KI-Chatbot', content: 'Ihre Bestellung #12345 wurde am 23.02.2026 versendet und befindet sich aktuell im Transit. Voraussichtliche Lieferung: 26.02.2026. Kann ich Ihnen noch weiterhelfen?', channel: 'whatsapp', timestamp: '2026-02-25T08:30:03' },
    ],
  },
  {
    id: '3', contact: 'Lisa Weber', channel: 'email', subject: 'Technische Frage: API Rate Limits', status: 'active',
    messages: [
      { sender: 'customer' as const, senderName: 'Lisa Weber', content: 'Betreff: API Rate Limits\n\nGuten Tag,\n\nwir stoßen bei der Integration auf Rate Limits. Gibt es die Möglichkeit, diese für unseren Account zu erhöhen?\n\nMit freundlichen Grüßen,\nLisa Weber', channel: 'email', timestamp: '2026-02-24T16:00:00' },
      { sender: 'agent' as const, senderName: 'Support Team', content: 'Liebe Frau Weber,\n\nvielen Dank für Ihre Anfrage. Für Ihren Professional-Plan liegt das Standard-Limit bei 1000 Requests/Minute. Ich habe Ihren Account auf 5000 Requests/Minute angehoben.\n\nMit freundlichen Grüßen,\nSupport Team', channel: 'email', timestamp: '2026-02-25T09:15:00' },
    ],
  },
];

const channelIcons: Record<string, string> = { chat: '💬', email: '📧', whatsapp: '📱', phone: '📞', sms: '📲', social: '🌐' };

export const ConversationsView: React.FC = () => {
  const [selectedConv, setSelectedConv] = useState(mockConversations[0]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;
    selectedConv.messages.push({
      sender: 'agent',
      senderName: 'Mitarbeiter',
      content: newMessage,
      channel: selectedConv.channel,
      timestamp: new Date().toISOString(),
    });
    setNewMessage('');
  };

  return (
    <div>
      <div className="page-header">
        <h1>💬 Omnichannel-Inbox</h1>
      </div>

      <div style={{ display: 'flex', gap: '1rem', height: 'calc(100vh - 150px)' }}>
        {/* Conversation List */}
        <div style={{ width: 320, borderRight: '1px solid var(--gray-200)', paddingRight: '1rem', overflowY: 'auto' }}>
          <div style={{ marginBottom: '1rem' }}>
            <input type="text" placeholder="Konversationen suchen..." style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--gray-300)', borderRadius: '0.5rem', fontSize: '0.85rem' }} />
          </div>
          {mockConversations.map(conv => (
            <div
              key={conv.id}
              onClick={() => setSelectedConv(conv)}
              style={{
                padding: '0.75rem', borderRadius: '0.5rem', cursor: 'pointer', marginBottom: '0.5rem',
                background: selectedConv.id === conv.id ? 'var(--primary-light)' : '#fff',
                border: `1px solid ${selectedConv.id === conv.id ? 'var(--primary)' : 'var(--gray-200)'}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.9rem' }}>{conv.contact}</strong>
                <span style={{ fontSize: '0.75rem' }}>{channelIcons[conv.channel]} {conv.channel}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>{conv.subject}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {conv.messages[conv.messages.length - 1]?.content.substring(0, 60)}...
              </div>
            </div>
          ))}
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{selectedConv.contact}</strong>
              <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                {channelIcons[selectedConv.channel]} {selectedConv.channel} · {selectedConv.subject}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-sm btn-secondary">📋 Zusammenfassung</button>
              <button className="btn btn-sm btn-secondary">🤖 KI-Antwort</button>
            </div>
          </div>

          <div className="chat-messages" style={{ flex: 1, overflowY: 'auto' }}>
            {selectedConv.messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.sender}`}>
                <div className="sender">{msg.senderName} {msg.sender === 'bot' ? '🤖' : ''}</div>
                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                <div className="time">
                  {new Date(msg.timestamp).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>

          <div className="chat-input">
            <select style={{ width: 'auto', padding: '0.5rem', border: '1px solid var(--gray-300)', borderRadius: '0.5rem', fontSize: '0.85rem' }}>
              <option>{channelIcons[selectedConv.channel]} {selectedConv.channel}</option>
              <option>📧 email</option>
              <option>📱 whatsapp</option>
              <option>📞 phone</option>
              <option>📲 sms</option>
            </select>
            <input
              type="text"
              placeholder="Nachricht eingeben..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button className="btn btn-primary" onClick={handleSend}>Senden</button>
          </div>
        </div>
      </div>
    </div>
  );
};
