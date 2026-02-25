import { Router, Request, Response } from 'express';
import {
  analyzeSentiment,
  generateEmailDraft,
  analyzeCall,
  calculateLeadScore,
} from '../services/ai.service';
import { ContactService, ActivityService } from '../services/crm.service';

const router = Router();

// --- Sentiment Analysis ---
router.post('/sentiment', (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ success: false, error: 'Text is required' });
  const result = analyzeSentiment(text);
  res.json({ success: true, data: result });
});

// --- Lead Scoring ---
router.post('/lead-score', (req: Request, res: Response) => {
  const { contactId } = req.body;
  if (!contactId) return res.status(400).json({ success: false, error: 'contactId is required' });
  const contact = ContactService.getById(contactId);
  if (!contact) return res.status(404).json({ success: false, error: 'Contact not found' });
  const activities = ActivityService.getByContactId(contactId);
  const result = calculateLeadScore(contact, activities);
  res.json({ success: true, data: result });
});

// --- Email Draft Generation ---
router.post('/email-draft', (req: Request, res: Response) => {
  const { contactId, purpose, tone, keywords } = req.body;
  if (!contactId || !purpose) return res.status(400).json({ success: false, error: 'contactId and purpose are required' });
  const contact = ContactService.getById(contactId);
  if (!contact) return res.status(404).json({ success: false, error: 'Contact not found' });
  const draft = generateEmailDraft(contact, purpose, tone, keywords);
  res.json({ success: true, data: draft });
});

// --- Call Analysis (Conversation Intelligence) ---
router.post('/analyze-call', (req: Request, res: Response) => {
  const { transcript } = req.body;
  if (!transcript || !Array.isArray(transcript)) {
    return res.status(400).json({ success: false, error: 'transcript array is required' });
  }
  const result = analyzeCall(transcript);
  res.json({ success: true, data: result });
});

export default router;
