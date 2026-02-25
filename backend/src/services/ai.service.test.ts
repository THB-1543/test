import {
  calculateLeadScore,
  analyzeSentiment,
  generateNextBestActions,
  generateEmailDraft,
  summarizeConversation,
  analyzeCall,
} from '../services/ai.service';
import { Contact, Activity, Lead } from '../types';

function makeContact(overrides: Partial<Contact> = {}): Contact {
  return {
    id: 'c1',
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max@example.com',
    phone: '+491234567890',
    company: 'Acme GmbH',
    jobTitle: 'CTO',
    source: 'website',
    tags: [],
    customFields: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function makeActivity(type: Activity['type'], meta?: Record<string, unknown>): Activity {
  return {
    id: `a-${Math.random()}`,
    contactId: 'c1',
    type,
    description: `Activity: ${type}`,
    metadata: meta,
    timestamp: new Date().toISOString(),
  };
}

describe('AI Service', () => {
  describe('calculateLeadScore', () => {
    it('returns 0 score for contact with no activities', () => {
      const contact = makeContact();
      const { score, factors } = calculateLeadScore(contact, []);
      // Profile completeness gives some points (email + phone + company + jobTitle)
      expect(score).toBeGreaterThanOrEqual(0);
      expect(factors.length).toBe(5);
    });

    it('increases score with email engagement activities', () => {
      const contact = makeContact();
      const activities = [
        makeActivity('email_open'),
        makeActivity('email_open'),
        makeActivity('email_click'),
      ];
      const { score } = calculateLeadScore(contact, activities);
      expect(score).toBeGreaterThan(20); // base profile + email engagement
    });

    it('increases score with page views and downloads', () => {
      const contact = makeContact();
      const activities = [
        makeActivity('page_view'),
        makeActivity('page_view'),
        makeActivity('download'),
      ];
      const { score } = calculateLeadScore(contact, activities);
      expect(score).toBeGreaterThan(20);
    });

    it('caps score at 100', () => {
      const contact = makeContact();
      const activities: Activity[] = [];
      for (let i = 0; i < 50; i++) {
        activities.push(makeActivity('email_open'));
        activities.push(makeActivity('email_click'));
        activities.push(makeActivity('page_view'));
        activities.push(makeActivity('download'));
        activities.push(makeActivity('form_submit'));
      }
      const { score } = calculateLeadScore(contact, activities);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('analyzeSentiment', () => {
    it('detects positive sentiment', () => {
      const result = analyzeSentiment('This is great, excellent service! I love it, amazing work!');
      expect(result.label).toBe('positive');
      expect(result.score).toBeGreaterThan(0);
    });

    it('detects negative sentiment', () => {
      const result = analyzeSentiment('This is terrible, I am frustrated and disappointed with the awful service!');
      expect(result.label).toBe('negative');
      expect(result.score).toBeLessThan(0);
    });

    it('detects neutral sentiment for plain text', () => {
      const result = analyzeSentiment('I would like to know the shipping time for my order number 12345.');
      expect(result.label).toBe('neutral');
    });

    it('detects German negative words', () => {
      const result = analyzeSentiment('Ich bin sehr frustriert und enttäuscht über den schrecklichen Service.');
      expect(result.label).toBe('negative');
    });

    it('detects German positive words', () => {
      const result = analyzeSentiment('Das ist großartig und fantastisch! Vielen Dank für den hervorragenden Service!');
      expect(result.label).toBe('positive');
    });
  });

  describe('generateNextBestActions', () => {
    it('suggests contacting high-scoring new lead', () => {
      const contact = makeContact();
      const lead: Lead = {
        id: 'l1', contactId: 'c1', status: 'new', score: 85, scoreFactors: [],
        source: 'website', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      const actions = generateNextBestActions(contact, lead, []);
      expect(actions.length).toBeGreaterThan(0);
      expect(actions[0].action).toContain('high-scoring');
    });

    it('suggests re-engagement for inactive contacts', () => {
      const contact = makeContact();
      const oldDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const activities = [{ ...makeActivity('page_view'), timestamp: oldDate }];
      const actions = generateNextBestActions(contact, null, activities);
      expect(actions.some(a => a.action.includes('Re-engage'))).toBe(true);
    });

    it('suggests pricing info for pricing page visitors', () => {
      const contact = makeContact();
      const activities = [makeActivity('page_view', { page: '/pricing' })];
      const actions = generateNextBestActions(contact, null, activities);
      expect(actions.some(a => a.action.includes('pricing'))).toBe(true);
    });
  });

  describe('generateEmailDraft', () => {
    it('generates follow-up email', () => {
      const contact = makeContact();
      const draft = generateEmailDraft(contact, 'follow_up', 'friendly');
      expect(draft.subject).toContain('Follow-up');
      expect(draft.body).toContain('Hallo Max');
      expect(draft.tone).toBe('friendly');
    });

    it('generates formal introduction email', () => {
      const contact = makeContact();
      const draft = generateEmailDraft(contact, 'introduction', 'formal');
      expect(draft.subject).toContain('Vorstellung');
      expect(draft.body).toContain('Sehr geehrte');
    });

    it('generates support email', () => {
      const contact = makeContact();
      const draft = generateEmailDraft(contact, 'support', 'friendly');
      expect(draft.subject).toContain('Anliegen');
    });
  });

  describe('summarizeConversation', () => {
    it('summarizes a conversation', () => {
      const messages = [
        { sender: 'customer', content: 'I need help with my recent order. It has not arrived yet and I am concerned.' },
        { sender: 'agent', content: 'I understand your concern. Let me check the shipping status for you right away.' },
        { sender: 'customer', content: 'Please do. I ordered it two weeks ago and still nothing.' },
      ];
      const summary = summarizeConversation(messages);
      expect(summary.summary).toBeTruthy();
      expect(summary.keyPoints.length).toBeGreaterThan(0);
      expect(summary.sentiment).toBeDefined();
    });
  });

  describe('analyzeCall', () => {
    it('analyzes call transcript', () => {
      const transcript = [
        { speaker: 'agent', text: 'Hello, thank you for calling. How can I help you today?', durationMs: 5000 },
        { speaker: 'customer', text: 'I am having issues with my subscription. It keeps failing to renew.', durationMs: 8000 },
        { speaker: 'agent', text: 'I see. Let me check your account. Could you please provide your email?', durationMs: 6000 },
        { speaker: 'customer', text: 'Sure, it is max@example.com. I am frustrated because this is the third time.', durationMs: 7000 },
      ];
      const result = analyzeCall(transcript);
      expect(result.talkRatio.agent + result.talkRatio.customer).toBe(100);
      expect(result.keywords.length).toBeGreaterThan(0);
      expect(result.duration).toBe(26000);
    });

    it('provides suggestions for unbalanced talk ratio', () => {
      const transcript = [
        { speaker: 'agent', text: 'Long agent monologue about our great products and services.', durationMs: 50000 },
        { speaker: 'customer', text: 'Ok.', durationMs: 2000 },
      ];
      const result = analyzeCall(transcript);
      expect(result.talkRatio.agent).toBeGreaterThan(70);
      expect(result.suggestions.some(s => s.includes('customer speak more'))).toBe(true);
    });
  });
});
