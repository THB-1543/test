import React, { useState } from 'react';
import { Contact } from '../../types';

const mockContacts: Contact[] = [
  { id: '1', firstName: 'Anna', lastName: 'Schmidt', email: 'anna@techcorp.de', phone: '+49 30 1234567', company: 'TechCorp GmbH', jobTitle: 'CEO', source: 'website', tags: ['enterprise', 'hot-lead'], customFields: {}, createdAt: '2026-01-15', updatedAt: '2026-02-20' },
  { id: '2', firstName: 'Max', lastName: 'Müller', email: 'max@dataflow.de', phone: '+49 89 7654321', company: 'DataFlow AG', jobTitle: 'CTO', source: 'linkedin', tags: ['tech', 'decision-maker'], customFields: {}, createdAt: '2026-01-20', updatedAt: '2026-02-18' },
  { id: '3', firstName: 'Lisa', lastName: 'Weber', email: 'lisa@cloudbase.de', phone: '+49 40 9876543', company: 'CloudBase GmbH', jobTitle: 'VP Engineering', source: 'referral', tags: ['mid-market'], customFields: {}, createdAt: '2026-02-01', updatedAt: '2026-02-22' },
  { id: '4', firstName: 'Thomas', lastName: 'Fischer', email: 'thomas@greentech.de', company: 'GreenTech Solutions', jobTitle: 'Head of IT', source: 'event', tags: ['sustainability'], customFields: {}, createdAt: '2026-02-10', updatedAt: '2026-02-24' },
];

interface ContactsListProps {
  onSelectContact: (id: string) => void;
}

export const ContactsList: React.FC<ContactsListProps> = ({ onSelectContact }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = mockContacts.filter(c =>
    `${c.firstName} ${c.lastName} ${c.email} ${c.company}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h1>👥 Kontakte</h1>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ Neuer Kontakt</button>
      </div>

      <div className="card">
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Kontakte suchen..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid var(--gray-300)', borderRadius: '0.5rem', fontSize: '0.9rem' }}
          />
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>E-Mail</th>
                <th>Unternehmen</th>
                <th>Position</th>
                <th>Quelle</th>
                <th>Tags</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(contact => (
                <tr key={contact.id}>
                  <td style={{ fontWeight: 600 }}>{contact.firstName} {contact.lastName}</td>
                  <td>{contact.email}</td>
                  <td>{contact.company}</td>
                  <td>{contact.jobTitle}</td>
                  <td><span className="badge badge-gray">{contact.source}</span></td>
                  <td>
                    {contact.tags.map(tag => (
                      <span key={tag} className="badge badge-blue" style={{ marginRight: 4 }}>{tag}</span>
                    ))}
                  </td>
                  <td>
                    <button className="btn btn-sm btn-secondary" onClick={() => onSelectContact(contact.id)}>
                      360°-Profil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Neuen Kontakt erstellen</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Vorname</label>
                <input type="text" placeholder="Vorname" />
              </div>
              <div className="form-group">
                <label>Nachname</label>
                <input type="text" placeholder="Nachname" />
              </div>
            </div>
            <div className="form-group">
              <label>E-Mail</label>
              <input type="email" placeholder="email@beispiel.de" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Telefon</label>
                <input type="tel" placeholder="+49..." />
              </div>
              <div className="form-group">
                <label>Unternehmen</label>
                <input type="text" placeholder="Firmenname" />
              </div>
            </div>
            <div className="form-group">
              <label>Position</label>
              <input type="text" placeholder="z.B. CEO, CTO" />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Abbrechen</button>
              <button className="btn btn-primary" onClick={() => setShowAddModal(false)}>Erstellen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
