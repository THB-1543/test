import React from 'react';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

const navItems = [
  { section: 'Overview' },
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { section: 'CRM' },
  { id: 'contacts', label: 'Kontakte', icon: '👥' },
  { id: 'leads', label: 'Leads & Scoring', icon: '🎯' },
  { id: 'opportunities', label: 'Opportunities', icon: '💰' },
  { id: 'tickets', label: 'Support-Tickets', icon: '🎫' },
  { section: 'Kommunikation' },
  { id: 'conversations', label: 'Omnichannel-Inbox', icon: '💬' },
  { section: 'KI-Tools' },
  { id: 'ai', label: 'KI-Assistent', icon: '🤖' },
  { section: 'Konfiguration' },
  { id: 'segments', label: 'Segmente', icon: '📋' },
  { id: 'workflows', label: 'Workflows', icon: '⚡' },
  { id: 'integrations', label: 'Integrationen', icon: '🔗' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <span>🏢 CRM Pro</span>
      </div>
      <nav>
        {navItems.map((item, idx) => {
          if ('section' in item && item.section) {
            return <div key={idx} className="section-label">{item.section}</div>;
          }
          if ('id' in item && item.id) {
            return (
              <button
                key={item.id}
                className={activeView === item.id ? 'active' : ''}
                onClick={() => onNavigate(item.id!)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          }
          return null;
        })}
      </nav>
    </div>
  );
};
