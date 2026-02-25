const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'API error');
  return json.data;
}

// Contacts
export const api = {
  contacts: {
    list: (page = 1, pageSize = 20) => request<any>(`/contacts?page=${page}&pageSize=${pageSize}`).then((_, ...args) => _),
    listFull: (page = 1, pageSize = 20) =>
      fetch(`${API_BASE}/contacts?page=${page}&pageSize=${pageSize}`).then(r => r.json()),
    get: (id: string) => request<any>(`/contacts/${id}`),
    create: (data: any) => request<any>('/contacts', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/contacts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/contacts/${id}`, { method: 'DELETE' }),
    search: (q: string) => request<any>(`/contacts/search?q=${encodeURIComponent(q)}`),
    getProfile: (id: string) => request<any>(`/contacts/${id}/profile`),
    getActivities: (id: string) => request<any>(`/contacts/${id}/activities`),
  },
  leads: {
    list: (page = 1, pageSize = 20) => request<any>(`/leads?page=${page}&pageSize=${pageSize}`).then((_, ...args) => _),
    listFull: (page = 1, pageSize = 20) =>
      fetch(`${API_BASE}/leads?page=${page}&pageSize=${pageSize}`).then(r => r.json()),
    get: (id: string) => request<any>(`/leads/${id}`),
    create: (data: any) => request<any>('/leads', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) =>
      request<any>(`/leads/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    rescore: () => request<any>('/leads/rescore', { method: 'POST' }),
  },
  opportunities: {
    list: (page = 1, pageSize = 20) =>
      fetch(`${API_BASE}/opportunities?page=${page}&pageSize=${pageSize}`).then(r => r.json()),
    create: (data: any) => request<any>('/opportunities', { method: 'POST', body: JSON.stringify(data) }),
    getPipeline: () => request<any>('/opportunities/pipeline'),
    updateStage: (id: string, stage: string) =>
      request<any>(`/opportunities/${id}/stage`, { method: 'PATCH', body: JSON.stringify({ stage }) }),
  },
  tickets: {
    list: (page = 1, pageSize = 20) =>
      fetch(`${API_BASE}/tickets?page=${page}&pageSize=${pageSize}`).then(r => r.json()),
    create: (data: any) => request<any>('/tickets', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) =>
      request<any>(`/tickets/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },
  conversations: {
    get: (id: string) => request<any>(`/conversations/${id}`),
    create: (data: any) => request<any>('/conversations', { method: 'POST', body: JSON.stringify(data) }),
    addMessage: (id: string, data: any) =>
      request<any>(`/conversations/${id}/messages`, { method: 'POST', body: JSON.stringify(data) }),
    getSummary: (id: string) => request<any>(`/conversations/${id}/summary`),
    getByContact: (contactId: string) => request<any>(`/conversations/contact/${contactId}`),
  },
  ai: {
    analyzeSentiment: (text: string) =>
      request<any>('/ai/sentiment', { method: 'POST', body: JSON.stringify({ text }) }),
    getLeadScore: (contactId: string) =>
      request<any>('/ai/lead-score', { method: 'POST', body: JSON.stringify({ contactId }) }),
    generateEmailDraft: (contactId: string, purpose: string, tone: string, keywords: string[] = []) =>
      request<any>('/ai/email-draft', { method: 'POST', body: JSON.stringify({ contactId, purpose, tone, keywords }) }),
    analyzeCall: (transcript: any[]) =>
      request<any>('/ai/analyze-call', { method: 'POST', body: JSON.stringify({ transcript }) }),
  },
  segments: {
    list: () => request<any>('/segments'),
    create: (data: any) => request<any>('/segments', { method: 'POST', body: JSON.stringify(data) }),
  },
  workflows: {
    list: () => request<any>('/workflows'),
    create: (data: any) => request<any>('/workflows', { method: 'POST', body: JSON.stringify(data) }),
  },
  integrations: {
    list: () => request<any>('/integrations'),
    marketplace: () => request<any>('/integrations/marketplace'),
    create: (data: any) => request<any>('/integrations', { method: 'POST', body: JSON.stringify(data) }),
  },
};
