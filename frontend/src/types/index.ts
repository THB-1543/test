// Shared types matching backend API responses

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  source?: string;
  tags: string[];
  customFields: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  contactId: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';
  score: number;
  scoreFactors: ScoreFactor[];
  assignedTo?: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScoreFactor {
  factor: string;
  weight: number;
  value: number;
  description: string;
}

export interface Opportunity {
  id: string;
  contactId: string;
  title: string;
  value: number;
  currency: string;
  stage: string;
  probability: number;
  expectedCloseDate: string;
  assignedTo?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  contactId: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  assignedTo?: string;
  sentiment?: SentimentResult;
  channel: string;
  createdAt: string;
  updatedAt: string;
}

export interface SentimentResult {
  score: number;
  label: 'negative' | 'neutral' | 'positive';
  confidence: number;
  keywords: string[];
}

export interface Conversation {
  id: string;
  contactId: string;
  channel: string;
  subject?: string;
  status: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: string;
  senderName: string;
  content: string;
  channel: string;
  timestamp: string;
}

export interface Segment {
  id: string;
  name: string;
  description: string;
  rules: unknown[];
  contactCount: number;
  isDynamic: boolean;
  createdAt: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: { type: string; event?: string };
  steps: unknown[];
  isActive: boolean;
  createdAt: string;
}

export interface Integration {
  id: string;
  name: string;
  type: string;
  status: string;
  config: Record<string, unknown>;
  createdAt: string;
}

export interface MarketplaceIntegration {
  name: string;
  type: string;
  description: string;
}

export interface CustomerProfile {
  contact: Contact;
  leads: Lead[];
  opportunities: Opportunity[];
  tickets: Ticket[];
  activities: Activity[];
  conversations: Conversation[];
  segments: string[];
  lifetimeValue: number;
  healthScore: number;
  nextBestActions: NextBestAction[];
}

export interface Activity {
  id: string;
  contactId: string;
  type: string;
  description: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface NextBestAction {
  id: string;
  contactId: string;
  action: string;
  reason: string;
  priority: number;
  channel: string;
  suggestedAt: string;
  status: string;
}

export interface EmailDraft {
  subject: string;
  body: string;
  tone: string;
  generatedAt: string;
}

export interface ConversationSummary {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  sentiment: SentimentResult;
  generatedAt: string;
}

export interface PipelineStage {
  stage: string;
  count: number;
  totalValue: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: { page?: number; pageSize?: number; total?: number };
}
