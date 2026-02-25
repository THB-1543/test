import request from 'supertest';
import { createApp } from '../app';
import { initializeDatabase, closeDatabase, getDatabase } from '../database/database';
import path from 'path';
import fs from 'fs';
import express from 'express';

let app: express.Application;
const testDbPath = path.join(__dirname, '../../data/test.db');

beforeAll(() => {
  // Use in-memory or temp DB
  const dataDir = path.join(__dirname, '../../data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  process.env.DB_PATH = testDbPath;
  initializeDatabase();
  app = createApp();
});

afterAll(() => {
  closeDatabase();
  if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
});

beforeEach(() => {
  // Clean tables between tests
  const db = getDatabase();
  db.exec('DELETE FROM messages');
  db.exec('DELETE FROM conversations');
  db.exec('DELETE FROM next_best_actions');
  db.exec('DELETE FROM activities');
  db.exec('DELETE FROM tickets');
  db.exec('DELETE FROM opportunities');
  db.exec('DELETE FROM leads');
  db.exec('DELETE FROM contacts');
  db.exec('DELETE FROM segments');
  db.exec('DELETE FROM workflows');
  db.exec('DELETE FROM integrations');
  db.exec('DELETE FROM dashboards');
});

describe('API Endpoints', () => {
  describe('GET /api/health', () => {
    it('returns ok status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('Contacts CRUD', () => {
    it('creates a contact', async () => {
      const res = await request(app).post('/api/contacts').send({
        firstName: 'Anna',
        lastName: 'Schmidt',
        email: 'anna@example.com',
        company: 'Test GmbH',
      });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.firstName).toBe('Anna');
      expect(res.body.data.id).toBeDefined();
    });

    it('lists contacts with pagination', async () => {
      await request(app).post('/api/contacts').send({ firstName: 'A', lastName: 'B', email: 'a@b.com' });
      await request(app).post('/api/contacts').send({ firstName: 'C', lastName: 'D', email: 'c@d.com' });
      const res = await request(app).get('/api/contacts?page=1&pageSize=10');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.meta.total).toBe(2);
    });

    it('gets a contact by id', async () => {
      const createRes = await request(app).post('/api/contacts').send({ firstName: 'Test', lastName: 'User', email: 'test@user.com' });
      const id = createRes.body.data.id;
      const res = await request(app).get(`/api/contacts/${id}`);
      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe('test@user.com');
    });

    it('returns 404 for non-existent contact', async () => {
      const res = await request(app).get('/api/contacts/non-existent-id');
      expect(res.status).toBe(404);
    });

    it('updates a contact', async () => {
      const createRes = await request(app).post('/api/contacts').send({ firstName: 'Old', lastName: 'Name', email: 'old@name.com' });
      const id = createRes.body.data.id;
      const res = await request(app).put(`/api/contacts/${id}`).send({ firstName: 'New' });
      expect(res.status).toBe(200);
      expect(res.body.data.firstName).toBe('New');
    });

    it('deletes a contact', async () => {
      const createRes = await request(app).post('/api/contacts').send({ firstName: 'Del', lastName: 'Me', email: 'del@me.com' });
      const id = createRes.body.data.id;
      const res = await request(app).delete(`/api/contacts/${id}`);
      expect(res.status).toBe(200);
      expect(res.body.data.deleted).toBe(true);
    });

    it('searches contacts', async () => {
      await request(app).post('/api/contacts').send({ firstName: 'Suchbar', lastName: 'Kontakt', email: 'such@bar.com' });
      const res = await request(app).get('/api/contacts/search?q=Suchbar');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });
  });

  describe('Leads', () => {
    it('creates a lead for a contact', async () => {
      const contactRes = await request(app).post('/api/contacts').send({ firstName: 'Lead', lastName: 'Test', email: 'lead@test.com' });
      const contactId = contactRes.body.data.id;
      const res = await request(app).post('/api/leads').send({ contactId, source: 'website' });
      expect(res.status).toBe(201);
      expect(res.body.data.contactId).toBe(contactId);
      expect(res.body.data.score).toBeDefined();
    });

    it('lists leads sorted by score', async () => {
      const c1 = await request(app).post('/api/contacts').send({ firstName: 'A', lastName: 'B', email: 'ab@test.com' });
      await request(app).post('/api/leads').send({ contactId: c1.body.data.id, source: 'web' });
      const res = await request(app).get('/api/leads');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });

    it('updates lead status', async () => {
      const c = await request(app).post('/api/contacts').send({ firstName: 'S', lastName: 'T', email: 'st@test.com' });
      const lead = await request(app).post('/api/leads').send({ contactId: c.body.data.id, source: 'web' });
      const res = await request(app).patch(`/api/leads/${lead.body.data.id}/status`).send({ status: 'qualified' });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('qualified');
    });
  });

  describe('Opportunities', () => {
    it('creates and retrieves opportunity', async () => {
      const c = await request(app).post('/api/contacts').send({ firstName: 'Opp', lastName: 'Test', email: 'opp@test.com' });
      const res = await request(app).post('/api/opportunities').send({
        contactId: c.body.data.id,
        title: 'Big Deal',
        value: 50000,
        stage: 'qualification',
        probability: 0.6,
      });
      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe('Big Deal');
      expect(res.body.data.value).toBe(50000);
    });

    it('returns pipeline summary', async () => {
      const c = await request(app).post('/api/contacts').send({ firstName: 'P', lastName: 'L', email: 'pl@test.com' });
      await request(app).post('/api/opportunities').send({ contactId: c.body.data.id, title: 'D1', value: 10000, stage: 'prospecting', probability: 0.2 });
      await request(app).post('/api/opportunities').send({ contactId: c.body.data.id, title: 'D2', value: 20000, stage: 'proposal', probability: 0.5 });
      const res = await request(app).get('/api/opportunities/pipeline');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
    });
  });

  describe('Tickets with Sentiment Analysis', () => {
    it('creates ticket and auto-analyzes sentiment', async () => {
      const c = await request(app).post('/api/contacts').send({ firstName: 'Ticket', lastName: 'Test', email: 'ticket@test.com' });
      const res = await request(app).post('/api/tickets').send({
        contactId: c.body.data.id,
        subject: 'Broken product',
        description: 'I am very frustrated and angry about the terrible quality!',
        priority: 'medium',
        channel: 'email',
      });
      expect(res.status).toBe(201);
      expect(res.body.data.sentiment).toBeDefined();
      expect(res.body.data.sentiment.label).toBe('negative');
      // Should auto-escalate priority
      expect(['high', 'critical']).toContain(res.body.data.priority);
    });

    it('keeps priority for positive tickets', async () => {
      const c = await request(app).post('/api/contacts').send({ firstName: 'Happy', lastName: 'User', email: 'happy@test.com' });
      const res = await request(app).post('/api/tickets').send({
        contactId: c.body.data.id,
        subject: 'Great service',
        description: 'Everything is great, excellent work! I love it!',
        priority: 'low',
        channel: 'email',
      });
      expect(res.status).toBe(201);
      expect(res.body.data.priority).toBe('low');
    });
  });

  describe('Conversations & Omnichannel', () => {
    it('creates conversation and adds messages', async () => {
      const c = await request(app).post('/api/contacts').send({ firstName: 'Chat', lastName: 'Test', email: 'chat@test.com' });
      const conv = await request(app).post('/api/conversations').send({
        contactId: c.body.data.id,
        channel: 'chat',
        subject: 'Product inquiry',
      });
      expect(conv.status).toBe(201);

      await request(app).post(`/api/conversations/${conv.body.data.id}/messages`).send({
        sender: 'customer',
        senderName: 'Chat Test',
        content: 'I want to know about your pricing plans.',
        channel: 'chat',
      });

      await request(app).post(`/api/conversations/${conv.body.data.id}/messages`).send({
        sender: 'agent',
        senderName: 'Agent Smith',
        content: 'I would be happy to help! We have three plans available.',
        channel: 'chat',
      });

      const getRes = await request(app).get(`/api/conversations/${conv.body.data.id}`);
      expect(getRes.status).toBe(200);
      expect(getRes.body.data.messages.length).toBe(2);
    });

    it('generates conversation summary', async () => {
      const c = await request(app).post('/api/contacts').send({ firstName: 'Sum', lastName: 'Test', email: 'sum@test.com' });
      const conv = await request(app).post('/api/conversations').send({ contactId: c.body.data.id, channel: 'email' });

      await request(app).post(`/api/conversations/${conv.body.data.id}/messages`).send({
        sender: 'customer', senderName: 'Sum Test',
        content: 'We need to discuss the contract renewal. Please send updated terms.',
        channel: 'email',
      });

      const res = await request(app).get(`/api/conversations/${conv.body.data.id}/summary`);
      expect(res.status).toBe(200);
      expect(res.body.data.summary).toBeTruthy();
      expect(res.body.data.keyPoints).toBeDefined();
    });
  });

  describe('AI Endpoints', () => {
    it('analyzes sentiment via API', async () => {
      const res = await request(app).post('/api/ai/sentiment').send({ text: 'I am happy and satisfied!' });
      expect(res.status).toBe(200);
      expect(res.body.data.label).toBe('positive');
    });

    it('generates email draft', async () => {
      const c = await request(app).post('/api/contacts').send({ firstName: 'Draft', lastName: 'Test', email: 'draft@test.com', company: 'Draft Co' });
      const res = await request(app).post('/api/ai/email-draft').send({
        contactId: c.body.data.id,
        purpose: 'follow_up',
        tone: 'friendly',
      });
      expect(res.status).toBe(200);
      expect(res.body.data.subject).toBeTruthy();
      expect(res.body.data.body).toContain('Draft');
    });

    it('analyzes call transcript', async () => {
      const res = await request(app).post('/api/ai/analyze-call').send({
        transcript: [
          { speaker: 'agent', text: 'Hello!', durationMs: 2000 },
          { speaker: 'customer', text: 'Hi, I need help.', durationMs: 3000 },
        ],
      });
      expect(res.status).toBe(200);
      expect(res.body.data.talkRatio).toBeDefined();
      expect(res.body.data.duration).toBe(5000);
    });
  });

  describe('360° Customer Profile', () => {
    it('returns unified customer profile', async () => {
      const c = await request(app).post('/api/contacts').send({
        firstName: 'Profile', lastName: 'Test', email: 'profile@test.com', company: 'Profile Co',
      });
      const contactId = c.body.data.id;

      // Create associated data
      await request(app).post('/api/leads').send({ contactId, source: 'website' });
      await request(app).post('/api/opportunities').send({
        contactId, title: 'Profile Deal', value: 30000, stage: 'proposal', probability: 0.5,
      });
      await request(app).post('/api/tickets').send({
        contactId, subject: 'Profile Question', description: 'Just a question about pricing.', priority: 'low', channel: 'email',
      });
      await request(app).post(`/api/contacts/${contactId}/activities`).send({
        type: 'page_view', description: 'Visited homepage',
      });

      const res = await request(app).get(`/api/contacts/${contactId}/profile`);
      expect(res.status).toBe(200);
      expect(res.body.data.contact.email).toBe('profile@test.com');
      expect(res.body.data.leads.length).toBe(1);
      expect(res.body.data.opportunities.length).toBe(1);
      expect(res.body.data.tickets.length).toBe(1);
      expect(res.body.data.activities.length).toBe(1);
      expect(res.body.data.healthScore).toBeDefined();
      expect(res.body.data.lifetimeValue).toBeDefined();
    });
  });

  describe('Segments', () => {
    it('creates a dynamic segment', async () => {
      const res = await request(app).post('/api/segments').send({
        name: 'Enterprise Customers',
        description: 'Companies with large deals',
        rules: [{ field: 'company', operator: 'contains', value: 'GmbH' }],
        isDynamic: true,
      });
      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('Enterprise Customers');
    });
  });

  describe('Workflows', () => {
    it('creates a workflow', async () => {
      const res = await request(app).post('/api/workflows').send({
        name: 'Welcome Email',
        description: 'Sends a welcome email to new leads',
        trigger: { type: 'event', event: 'lead_created' },
        steps: [
          { id: 's1', type: 'email', config: { template: 'welcome' } },
          { id: 's2', type: 'wait', config: { duration: '1h' }, nextStepId: 's3' },
          { id: 's3', type: 'email', config: { template: 'follow_up' } },
        ],
        isActive: true,
      });
      expect(res.status).toBe(201);
      expect(res.body.data.steps.length).toBe(3);
      expect(res.body.data.isActive).toBe(true);
    });
  });

  describe('Integrations Marketplace', () => {
    it('lists available integrations', async () => {
      const res = await request(app).get('/api/integrations/marketplace');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(5);
      const names = res.body.data.map((i: { name: string }) => i.name);
      expect(names).toContain('HubSpot');
      expect(names).toContain('SAP');
      expect(names).toContain('Shopify');
      expect(names).toContain('Slack');
      expect(names).toContain('Google Workspace');
    });

    it('creates an integration', async () => {
      const res = await request(app).post('/api/integrations').send({
        name: 'Slack',
        type: 'collaboration',
        status: 'active',
        config: { webhookUrl: 'https://hooks.slack.com/test' },
      });
      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('Slack');
    });
  });
});
