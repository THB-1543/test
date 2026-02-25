import { v4 as uuid } from 'uuid';
import { getDatabase } from '../database/database';
import {
  Contact,
  Lead,
  Opportunity,
  Ticket,
  Activity,
  Conversation,
  Message,
  Segment,
  SegmentRule,
  Workflow,
  Integration,
  NextBestAction,
  CustomerProfile,
  PaginationParams,
} from '../types';
import { calculateLeadScore, analyzeSentiment, generateNextBestActions } from './ai.service';

// ============================================================
// Contact Service
// ============================================================

export class ContactService {
  static create(data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Contact {
    const db = getDatabase();
    const id = uuid();
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO contacts (id, first_name, last_name, email, phone, company, job_title, source, tags, custom_fields, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.firstName, data.lastName, data.email, data.phone || null, data.company || null,
      data.jobTitle || null, data.source || null, JSON.stringify(data.tags || []),
      JSON.stringify(data.customFields || {}), now, now);

    return { id, ...data, tags: data.tags || [], customFields: data.customFields || {}, createdAt: now, updatedAt: now };
  }

  static getById(id: string): Contact | null {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM contacts WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    if (!row) return null;
    return this.mapRow(row);
  }

  static getByEmail(email: string): Contact | null {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM contacts WHERE email = ?').get(email) as Record<string, unknown> | undefined;
    if (!row) return null;
    return this.mapRow(row);
  }

  static list(params: PaginationParams): { contacts: Contact[]; total: number } {
    const db = getDatabase();
    const offset = (params.page - 1) * params.pageSize;
    const rows = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC LIMIT ? OFFSET ?')
      .all(params.pageSize, offset) as Record<string, unknown>[];
    const totalRow = db.prepare('SELECT COUNT(*) as count FROM contacts').get() as { count: number };
    return { contacts: rows.map(r => this.mapRow(r)), total: totalRow.count };
  }

  static update(id: string, data: Partial<Contact>): Contact | null {
    const existing = this.getById(id);
    if (!existing) return null;
    const db = getDatabase();
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE contacts SET first_name = ?, last_name = ?, email = ?, phone = ?, company = ?, job_title = ?, source = ?, tags = ?, custom_fields = ?, updated_at = ?
      WHERE id = ?
    `).run(
      data.firstName ?? existing.firstName, data.lastName ?? existing.lastName,
      data.email ?? existing.email, data.phone ?? existing.phone,
      data.company ?? existing.company, data.jobTitle ?? existing.jobTitle,
      data.source ?? existing.source, JSON.stringify(data.tags ?? existing.tags),
      JSON.stringify(data.customFields ?? existing.customFields), now, id,
    );
    return this.getById(id);
  }

  static delete(id: string): boolean {
    const db = getDatabase();
    const result = db.prepare('DELETE FROM contacts WHERE id = ?').run(id);
    return result.changes > 0;
  }

  static search(query: string): Contact[] {
    const db = getDatabase();
    const rows = db.prepare(`
      SELECT * FROM contacts WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR company LIKE ?
      ORDER BY created_at DESC LIMIT 50
    `).all(`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`) as Record<string, unknown>[];
    return rows.map(r => this.mapRow(r));
  }

  private static mapRow(row: Record<string, unknown>): Contact {
    return {
      id: row.id as string,
      firstName: row.first_name as string,
      lastName: row.last_name as string,
      email: row.email as string,
      phone: row.phone as string | undefined,
      company: row.company as string | undefined,
      jobTitle: row.job_title as string | undefined,
      source: row.source as string | undefined,
      tags: JSON.parse((row.tags as string) || '[]'),
      customFields: JSON.parse((row.custom_fields as string) || '{}'),
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  }
}

// ============================================================
// Lead Service
// ============================================================

export class LeadService {
  static create(data: { contactId: string; source: string; assignedTo?: string }): Lead {
    const db = getDatabase();
    const id = uuid();
    const now = new Date().toISOString();

    // Auto-calculate lead score
    const contact = ContactService.getById(data.contactId);
    const activities = ActivityService.getByContactId(data.contactId);
    const { score, factors } = contact ? calculateLeadScore(contact, activities) : { score: 0, factors: [] };

    db.prepare(`
      INSERT INTO leads (id, contact_id, status, score, score_factors, assigned_to, source, created_at, updated_at)
      VALUES (?, ?, 'new', ?, ?, ?, ?, ?, ?)
    `).run(id, data.contactId, score, JSON.stringify(factors), data.assignedTo || null, data.source, now, now);

    return { id, contactId: data.contactId, status: 'new', score, scoreFactors: factors, assignedTo: data.assignedTo, source: data.source, createdAt: now, updatedAt: now };
  }

  static getById(id: string): Lead | null {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM leads WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    if (!row) return null;
    return this.mapRow(row);
  }

  static getByContactId(contactId: string): Lead[] {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM leads WHERE contact_id = ? ORDER BY created_at DESC').all(contactId) as Record<string, unknown>[];
    return rows.map(r => this.mapRow(r));
  }

  static list(params: PaginationParams): { leads: Lead[]; total: number } {
    const db = getDatabase();
    const offset = (params.page - 1) * params.pageSize;
    const rows = db.prepare('SELECT * FROM leads ORDER BY score DESC LIMIT ? OFFSET ?').all(params.pageSize, offset) as Record<string, unknown>[];
    const totalRow = db.prepare('SELECT COUNT(*) as count FROM leads').get() as { count: number };
    return { leads: rows.map(r => this.mapRow(r)), total: totalRow.count };
  }

  static updateStatus(id: string, status: string): Lead | null {
    const db = getDatabase();
    const now = new Date().toISOString();
    db.prepare('UPDATE leads SET status = ?, updated_at = ? WHERE id = ?').run(status, now, id);
    return this.getById(id);
  }

  static rescoreAll(): number {
    const db = getDatabase();
    const leads = db.prepare('SELECT * FROM leads').all() as Record<string, unknown>[];
    let updated = 0;
    for (const row of leads) {
      const contact = ContactService.getById(row.contact_id as string);
      if (contact) {
        const activities = ActivityService.getByContactId(contact.id);
        const { score, factors } = calculateLeadScore(contact, activities);
        db.prepare('UPDATE leads SET score = ?, score_factors = ?, updated_at = ? WHERE id = ?')
          .run(score, JSON.stringify(factors), new Date().toISOString(), row.id as string);
        updated++;
      }
    }
    return updated;
  }

  private static mapRow(row: Record<string, unknown>): Lead {
    return {
      id: row.id as string,
      contactId: row.contact_id as string,
      status: row.status as Lead['status'],
      score: row.score as number,
      scoreFactors: JSON.parse((row.score_factors as string) || '[]'),
      assignedTo: row.assigned_to as string | undefined,
      source: row.source as string,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  }
}

// ============================================================
// Opportunity Service
// ============================================================

export class OpportunityService {
  static create(data: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>): Opportunity {
    const db = getDatabase();
    const id = uuid();
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO opportunities (id, contact_id, lead_id, title, value, currency, stage, probability, expected_close_date, assigned_to, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.contactId, data.leadId || null, data.title, data.value, data.currency || 'EUR',
      data.stage, data.probability, data.expectedCloseDate || null, data.assignedTo || null,
      data.notes || '', now, now);

    return { id, ...data, currency: data.currency || 'EUR', notes: data.notes || '', createdAt: now, updatedAt: now };
  }

  static getById(id: string): Opportunity | null {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM opportunities WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    if (!row) return null;
    return this.mapRow(row);
  }

  static list(params: PaginationParams): { opportunities: Opportunity[]; total: number } {
    const db = getDatabase();
    const offset = (params.page - 1) * params.pageSize;
    const rows = db.prepare('SELECT * FROM opportunities ORDER BY created_at DESC LIMIT ? OFFSET ?').all(params.pageSize, offset) as Record<string, unknown>[];
    const totalRow = db.prepare('SELECT COUNT(*) as count FROM opportunities').get() as { count: number };
    return { opportunities: rows.map(r => this.mapRow(r)), total: totalRow.count };
  }

  static updateStage(id: string, stage: string): Opportunity | null {
    const db = getDatabase();
    const now = new Date().toISOString();
    db.prepare('UPDATE opportunities SET stage = ?, updated_at = ? WHERE id = ?').run(stage, now, id);
    return this.getById(id);
  }

  static getPipeline(): { stage: string; count: number; totalValue: number }[] {
    const db = getDatabase();
    const rows = db.prepare(`
      SELECT stage, COUNT(*) as count, COALESCE(SUM(value), 0) as total_value
      FROM opportunities GROUP BY stage ORDER BY
      CASE stage WHEN 'prospecting' THEN 1 WHEN 'qualification' THEN 2 WHEN 'proposal' THEN 3
      WHEN 'negotiation' THEN 4 WHEN 'closed_won' THEN 5 WHEN 'closed_lost' THEN 6 END
    `).all() as { stage: string; count: number; total_value: number }[];
    return rows.map(r => ({ stage: r.stage, count: r.count, totalValue: r.total_value }));
  }

  private static mapRow(row: Record<string, unknown>): Opportunity {
    return {
      id: row.id as string,
      contactId: row.contact_id as string,
      leadId: row.lead_id as string | undefined,
      title: row.title as string,
      value: row.value as number,
      currency: row.currency as string,
      stage: row.stage as Opportunity['stage'],
      probability: row.probability as number,
      expectedCloseDate: row.expected_close_date as string,
      assignedTo: row.assigned_to as string | undefined,
      notes: row.notes as string,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  }
}

// ============================================================
// Ticket Service
// ============================================================

export class TicketService {
  static create(data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'sentiment'>): Ticket {
    const db = getDatabase();
    const id = uuid();
    const now = new Date().toISOString();

    // Auto-analyze sentiment
    const sentiment = analyzeSentiment(data.description);

    // Auto-escalate if sentiment is negative
    let priority = data.priority;
    if (sentiment.label === 'negative' && sentiment.confidence > 0.6) {
      priority = priority === 'low' ? 'medium' : priority === 'medium' ? 'high' : 'critical';
    }

    db.prepare(`
      INSERT INTO tickets (id, contact_id, subject, description, status, priority, assigned_to, sentiment, channel, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.contactId, data.subject, data.description, data.status || 'open',
      priority, data.assignedTo || null, JSON.stringify(sentiment), data.channel || 'email', now, now);

    return { id, ...data, priority, status: data.status || 'open', sentiment, createdAt: now, updatedAt: now };
  }

  static getById(id: string): Ticket | null {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    if (!row) return null;
    return this.mapRow(row);
  }

  static list(params: PaginationParams): { tickets: Ticket[]; total: number } {
    const db = getDatabase();
    const offset = (params.page - 1) * params.pageSize;
    const rows = db.prepare('SELECT * FROM tickets ORDER BY created_at DESC LIMIT ? OFFSET ?').all(params.pageSize, offset) as Record<string, unknown>[];
    const totalRow = db.prepare('SELECT COUNT(*) as count FROM tickets').get() as { count: number };
    return { tickets: rows.map(r => this.mapRow(r)), total: totalRow.count };
  }

  static updateStatus(id: string, status: string): Ticket | null {
    const db = getDatabase();
    const now = new Date().toISOString();
    db.prepare('UPDATE tickets SET status = ?, updated_at = ? WHERE id = ?').run(status, now, id);
    return this.getById(id);
  }

  private static mapRow(row: Record<string, unknown>): Ticket {
    return {
      id: row.id as string,
      contactId: row.contact_id as string,
      subject: row.subject as string,
      description: row.description as string,
      status: row.status as Ticket['status'],
      priority: row.priority as Ticket['priority'],
      assignedTo: row.assigned_to as string | undefined,
      sentiment: row.sentiment ? JSON.parse(row.sentiment as string) : undefined,
      channel: row.channel as Ticket['channel'],
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  }
}

// ============================================================
// Activity Service
// ============================================================

export class ActivityService {
  static create(data: Omit<Activity, 'id' | 'timestamp'>): Activity {
    const db = getDatabase();
    const id = uuid();
    const timestamp = new Date().toISOString();
    db.prepare(`
      INSERT INTO activities (id, contact_id, type, description, metadata, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, data.contactId, data.type, data.description, JSON.stringify(data.metadata || {}), timestamp);
    return { id, ...data, metadata: data.metadata || {}, timestamp };
  }

  static getByContactId(contactId: string): Activity[] {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM activities WHERE contact_id = ? ORDER BY timestamp DESC').all(contactId) as Record<string, unknown>[];
    return rows.map(r => ({
      id: r.id as string,
      contactId: r.contact_id as string,
      type: r.type as Activity['type'],
      description: r.description as string,
      metadata: JSON.parse((r.metadata as string) || '{}'),
      timestamp: r.timestamp as string,
    }));
  }
}

// ============================================================
// Conversation Service
// ============================================================

export class ConversationService {
  static create(data: { contactId: string; channel: string; subject?: string }): Conversation {
    const db = getDatabase();
    const id = uuid();
    const now = new Date().toISOString();
    db.prepare(`INSERT INTO conversations (id, contact_id, channel, subject, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'active', ?, ?)`).run(id, data.contactId, data.channel, data.subject || null, now, now);
    return { id, contactId: data.contactId, channel: data.channel as Conversation['channel'], subject: data.subject, status: 'active', messages: [], createdAt: now, updatedAt: now };
  }

  static addMessage(conversationId: string, data: { sender: string; senderName: string; content: string; channel: string }): Message {
    const db = getDatabase();
    const id = uuid();
    const timestamp = new Date().toISOString();
    db.prepare(`INSERT INTO messages (id, conversation_id, sender, sender_name, content, channel, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)`).run(id, conversationId, data.sender, data.senderName, data.content, data.channel, timestamp);
    db.prepare('UPDATE conversations SET updated_at = ? WHERE id = ?').run(timestamp, conversationId);
    return { id, conversationId, sender: data.sender as Message['sender'], senderName: data.senderName, content: data.content, channel: data.channel as Message['channel'], timestamp };
  }

  static getById(id: string): Conversation | null {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM conversations WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    if (!row) return null;
    const messages = db.prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC').all(id) as Record<string, unknown>[];
    return {
      id: row.id as string,
      contactId: row.contact_id as string,
      channel: row.channel as Conversation['channel'],
      subject: row.subject as string | undefined,
      status: row.status as Conversation['status'],
      messages: messages.map(m => ({
        id: m.id as string,
        conversationId: m.conversation_id as string,
        sender: m.sender as Message['sender'],
        senderName: m.sender_name as string,
        content: m.content as string,
        channel: m.channel as Message['channel'],
        timestamp: m.timestamp as string,
        metadata: m.metadata ? JSON.parse(m.metadata as string) : undefined,
      })),
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  }

  static getByContactId(contactId: string): Conversation[] {
    const db = getDatabase();
    const rows = db.prepare('SELECT id FROM conversations WHERE contact_id = ? ORDER BY updated_at DESC').all(contactId) as { id: string }[];
    return rows.map(r => this.getById(r.id)).filter((c): c is Conversation => c !== null);
  }
}

// ============================================================
// Segment Service
// ============================================================

export class SegmentService {
  static create(data: Omit<Segment, 'id' | 'createdAt' | 'updatedAt' | 'contactCount'>): Segment {
    const db = getDatabase();
    const id = uuid();
    const now = new Date().toISOString();
    const contactCount = data.isDynamic ? this.evaluateRules(data.rules) : 0;
    db.prepare(`INSERT INTO segments (id, name, description, rules, contact_count, is_dynamic, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(id, data.name, data.description || '', JSON.stringify(data.rules || []), contactCount, data.isDynamic ? 1 : 0, now, now);
    return { id, ...data, contactCount, createdAt: now, updatedAt: now };
  }

  static getById(id: string): Segment | null {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM segments WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    if (!row) return null;
    return {
      id: row.id as string,
      name: row.name as string,
      description: row.description as string,
      rules: JSON.parse((row.rules as string) || '[]'),
      contactCount: row.contact_count as number,
      isDynamic: (row.is_dynamic as number) === 1,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  }

  static list(): Segment[] {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM segments ORDER BY created_at DESC').all() as Record<string, unknown>[];
    return rows.map(r => ({
      id: r.id as string,
      name: r.name as string,
      description: r.description as string,
      rules: JSON.parse((r.rules as string) || '[]'),
      contactCount: r.contact_count as number,
      isDynamic: (r.is_dynamic as number) === 1,
      createdAt: r.created_at as string,
      updatedAt: r.updated_at as string,
    }));
  }

  static evaluateRules(rules: SegmentRule[]): number {
    const db = getDatabase();
    if (rules.length === 0) return 0;
    // Simple rule evaluation — build WHERE clause
    const conditions: string[] = [];
    const params: unknown[] = [];
    for (const rule of rules) {
      const col = rule.field.replace(/[^a-zA-Z_]/g, '');
      switch (rule.operator) {
        case 'equals':
          conditions.push(`${col} = ?`);
          params.push(rule.value);
          break;
        case 'contains':
          conditions.push(`${col} LIKE ?`);
          params.push(`%${rule.value}%`);
          break;
        case 'greater_than':
          conditions.push(`${col} > ?`);
          params.push(rule.value);
          break;
        case 'less_than':
          conditions.push(`${col} < ?`);
          params.push(rule.value);
          break;
      }
    }
    if (conditions.length === 0) return 0;
    const result = db.prepare(`SELECT COUNT(*) as count FROM contacts WHERE ${conditions.join(' AND ')}`).get(...params) as { count: number };
    return result.count;
  }
}

// ============================================================
// Workflow Service
// ============================================================

export class WorkflowService {
  static create(data: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>): Workflow {
    const db = getDatabase();
    const id = uuid();
    const now = new Date().toISOString();
    db.prepare(`INSERT INTO workflows (id, name, description, trigger_config, steps, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(id, data.name, data.description || '', JSON.stringify(data.trigger), JSON.stringify(data.steps || []), data.isActive ? 1 : 0, now, now);
    return { id, ...data, createdAt: now, updatedAt: now };
  }

  static getById(id: string): Workflow | null {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM workflows WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    if (!row) return null;
    return {
      id: row.id as string,
      name: row.name as string,
      description: row.description as string,
      trigger: JSON.parse((row.trigger_config as string) || '{}'),
      steps: JSON.parse((row.steps as string) || '[]'),
      isActive: (row.is_active as number) === 1,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  }

  static list(): Workflow[] {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM workflows ORDER BY created_at DESC').all() as Record<string, unknown>[];
    return rows.map(r => ({
      id: r.id as string,
      name: r.name as string,
      description: r.description as string,
      trigger: JSON.parse((r.trigger_config as string) || '{}'),
      steps: JSON.parse((r.steps as string) || '[]'),
      isActive: (r.is_active as number) === 1,
      createdAt: r.created_at as string,
      updatedAt: r.updated_at as string,
    }));
  }
}

// ============================================================
// Integration Service
// ============================================================

export class IntegrationService {
  static create(data: Omit<Integration, 'id' | 'createdAt'>): Integration {
    const db = getDatabase();
    const id = uuid();
    const now = new Date().toISOString();
    db.prepare(`INSERT INTO integrations (id, name, type, status, config, last_sync_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)`).run(id, data.name, data.type, data.status || 'inactive', JSON.stringify(data.config || {}), data.lastSyncAt || null, now);
    return { id, ...data, createdAt: now };
  }

  static list(): Integration[] {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM integrations ORDER BY created_at DESC').all() as Record<string, unknown>[];
    return rows.map(r => ({
      id: r.id as string,
      name: r.name as string,
      type: r.type as Integration['type'],
      status: r.status as Integration['status'],
      config: JSON.parse((r.config as string) || '{}'),
      lastSyncAt: r.last_sync_at as string | undefined,
      createdAt: r.created_at as string,
    }));
  }

  static getAvailableIntegrations(): { name: string; type: string; description: string }[] {
    return [
      { name: 'HubSpot', type: 'marketing', description: 'Marketing automation and inbound marketing platform' },
      { name: 'Mailchimp', type: 'marketing', description: 'Email marketing and automation' },
      { name: 'SAP', type: 'erp', description: 'Enterprise resource planning — invoices and orders' },
      { name: 'Oracle', type: 'erp', description: 'Enterprise resource planning system' },
      { name: 'Shopify', type: 'ecommerce', description: 'E-commerce platform integration' },
      { name: 'Magento', type: 'ecommerce', description: 'E-commerce platform integration' },
      { name: 'Slack', type: 'collaboration', description: 'Team messaging and collaboration' },
      { name: 'Microsoft Teams', type: 'collaboration', description: 'Team communication and collaboration' },
      { name: 'Google Workspace', type: 'email_provider', description: 'Calendar, email and productivity suite' },
      { name: 'Microsoft 365', type: 'email_provider', description: 'Calendar, email and productivity suite' },
      { name: 'LinkedIn', type: 'social_media', description: 'Professional networking — contact enrichment' },
      { name: 'WhatsApp Business', type: 'social_media', description: 'Customer messaging via WhatsApp' },
    ];
  }
}

// ============================================================
// Customer Profile Service (360° View)
// ============================================================

export class CustomerProfileService {
  static getProfile(contactId: string): CustomerProfile | null {
    const contact = ContactService.getById(contactId);
    if (!contact) return null;

    const leads = LeadService.getByContactId(contactId);
    const db = getDatabase();
    const oppRows = db.prepare('SELECT * FROM opportunities WHERE contact_id = ? ORDER BY created_at DESC').all(contactId) as Record<string, unknown>[];
    const opportunities = oppRows.map(r => OpportunityService.getById(r.id as string)).filter((o): o is Opportunity => o !== null);
    const ticketRows = db.prepare('SELECT * FROM tickets WHERE contact_id = ? ORDER BY created_at DESC').all(contactId) as Record<string, unknown>[];
    const tickets = ticketRows.map(r => TicketService.getById(r.id as string)).filter((t): t is Ticket => t !== null);
    const activities = ActivityService.getByContactId(contactId);
    const conversations = ConversationService.getByContactId(contactId);

    // Calculate lifetime value
    const lifetimeValue = opportunities
      .filter(o => o.stage === 'closed_won')
      .reduce((sum, o) => sum + o.value, 0);

    // Calculate health score
    const openTickets = tickets.filter(t => t.status !== 'closed' && t.status !== 'resolved').length;
    const recentActivities = activities.filter(a => {
      const d = new Date(a.timestamp);
      return d > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }).length;
    const healthScore = Math.max(0, Math.min(100, 70 + recentActivities * 2 - openTickets * 10));

    // Generate next best actions
    const topLead = leads.length > 0 ? leads.reduce((best, l) => l.score > best.score ? l : best, leads[0]) : null;
    const nextBestActions = generateNextBestActions(contact, topLead, activities);

    // Get segment names
    const segments = SegmentService.list()
      .filter(s => s.isDynamic && SegmentService.evaluateRules(s.rules) > 0)
      .map(s => s.name);

    return {
      contact,
      leads,
      opportunities,
      tickets,
      activities,
      conversations,
      segments,
      lifetimeValue,
      healthScore,
      nextBestActions,
    };
  }
}
