import React, { useState } from 'react';
import './App.css';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { ContactsList } from './components/contacts/ContactsList';
import { CustomerProfile } from './components/contacts/CustomerProfile';
import { LeadsList } from './components/leads/LeadsList';
import { OpportunitiesList } from './components/opportunities/OpportunitiesList';
import { TicketsList } from './components/tickets/TicketsList';
import { ConversationsView } from './components/conversations/ConversationsView';
import { AIAssistant } from './components/ai/AIAssistant';
import { SegmentsView } from './components/contacts/SegmentsView';
import { WorkflowsView } from './components/contacts/WorkflowsView';
import { IntegrationsView } from './components/integrations/IntegrationsView';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  const handleNavigate = (view: string) => {
    setActiveView(view);
    setSelectedContactId(null);
  };

  const handleSelectContact = (id: string) => {
    setSelectedContactId(id);
    setActiveView('profile');
  };

  return (
    <div className="app">
      <Sidebar activeView={activeView} onNavigate={handleNavigate} />
      <div className="main-content">
        {activeView === 'dashboard' && <Dashboard />}
        {activeView === 'contacts' && <ContactsList onSelectContact={handleSelectContact} />}
        {activeView === 'profile' && selectedContactId && (
          <CustomerProfile contactId={selectedContactId} onBack={() => setActiveView('contacts')} />
        )}
        {activeView === 'leads' && <LeadsList />}
        {activeView === 'opportunities' && <OpportunitiesList />}
        {activeView === 'tickets' && <TicketsList />}
        {activeView === 'conversations' && <ConversationsView />}
        {activeView === 'ai' && <AIAssistant />}
        {activeView === 'segments' && <SegmentsView />}
        {activeView === 'workflows' && <WorkflowsView />}
        {activeView === 'integrations' && <IntegrationsView />}
      </div>
    </div>
  );
}

export default App;
