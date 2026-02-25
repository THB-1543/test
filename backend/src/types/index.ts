// ============================================================
// Core CRM Type Definitions
// ============================================================

// --- Contact & Lead Management ---

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
  status: LeadStatus;
  score: number;
  scoreFactors: ScoreFactor[];
  assignedTo?: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';

export interface ScoreFactor {
  factor: string;
  weight: number;
  value: number;
  description: string;
}

// --- Opportunity / Deal ---

export interface Opportunity {
  id: string;
  contactId: string;
  leadId?: string;
  title: string;
  value: number;
  currency: string;
  stage: OpportunityStage;
  probability: number;
  expectedCloseDate: string;
  assignedTo?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type OpportunityStage =
  | 'prospecting'
  | 'qualification'
  | 'proposal'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost';

// --- Support Tickets ---

export interface Ticket {
  id: string;
  contactId: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo?: string;
  sentiment?: SentimentResult;
  channel: CommunicationChannel;
  createdAt: string;
  updatedAt: string;
}

export type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

// --- AI / Intelligence ---

export interface SentimentResult {
  score: number; // -1 to 1
  label: 'negative' | 'neutral' | 'positive';
  confidence: number;
  keywords: string[];
}

export interface NextBestAction {
  id: string;
  contactId: string;
  action: string;
  reason: string;
  priority: number;
  channel: CommunicationChannel;
  suggestedAt: string;
  status: 'pending' | 'accepted' | 'dismissed';
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

export interface ConversationIntelligence {
  callId: string;
  duration: number;
  talkRatio: { agent: number; customer: number };
  sentiment: SentimentResult;
  keywords: string[];
  suggestions: string[];
  analyzedAt: string;
}

// --- Communication / Omnichannel ---

export type CommunicationChannel = 'email' | 'phone' | 'sms' | 'whatsapp' | 'chat' | 'social';

export interface Conversation {
  id: string;
  contactId: string;
  channel: CommunicationChannel;
  subject?: string;
  status: 'active' | 'closed';
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: 'customer' | 'agent' | 'bot';
  senderName: string;
  content: string;
  channel: CommunicationChannel;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// --- Segmentation ---

export interface Segment {
  id: string;
  name: string;
  description: string;
  rules: SegmentRule[];
  contactCount: number;
  isDynamic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SegmentRule {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: unknown;
}

// --- Workflow Automation ---

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowTrigger {
  type: 'event' | 'schedule' | 'manual';
  event?: string;
  schedule?: string;
  conditions?: SegmentRule[];
}

export interface WorkflowStep {
  id: string;
  type: 'email' | 'sms' | 'wait' | 'condition' | 'update_field' | 'notify' | 'webhook';
  config: Record<string, unknown>;
  nextStepId?: string;
}

// --- Integration ---

export interface Integration {
  id: string;
  name: string;
  type: IntegrationType;
  status: 'active' | 'inactive' | 'error';
  config: Record<string, unknown>;
  lastSyncAt?: string;
  createdAt: string;
}

export type IntegrationType =
  | 'email_provider'
  | 'calendar'
  | 'erp'
  | 'ecommerce'
  | 'marketing'
  | 'collaboration'
  | 'social_media'
  | 'custom';

// --- Activity Tracking ---

export interface Activity {
  id: string;
  contactId: string;
  type: ActivityType;
  description: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export type ActivityType =
  | 'page_view'
  | 'email_open'
  | 'email_click'
  | 'download'
  | 'form_submit'
  | 'call'
  | 'meeting'
  | 'note'
  | 'purchase'
  | 'support_ticket';

// --- Customer Profile (360° View) ---

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

// --- Dashboard ---

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'list' | 'funnel';
  title: string;
  config: Record<string, unknown>;
  position: { x: number; y: number; w: number; h: number };
}

export interface Dashboard {
  id: string;
  userId: string;
  name: string;
  widgets: DashboardWidget[];
  createdAt: string;
  updatedAt: string;
}

// --- API Response Types ---

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
  };
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}
