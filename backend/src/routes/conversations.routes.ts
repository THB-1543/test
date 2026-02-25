import { Router, Request, Response } from 'express';
import { ConversationService } from '../services/crm.service';
import { summarizeConversation } from '../services/ai.service';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  try {
    const conversation = ConversationService.create(req.body);
    res.status(201).json({ success: true, data: conversation });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create conversation';
    res.status(400).json({ success: false, error: message });
  }
});

router.get('/:id', (req: Request, res: Response) => {
  const conversation = ConversationService.getById(req.params.id as string);
  if (!conversation) return res.status(404).json({ success: false, error: 'Conversation not found' });
  res.json({ success: true, data: conversation });
});

router.post('/:id/messages', (req: Request, res: Response) => {
  try {
    const message = ConversationService.addMessage(req.params.id as string, req.body);
    res.status(201).json({ success: true, data: message });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to add message';
    res.status(400).json({ success: false, error: msg });
  }
});

router.get('/:id/summary', (req: Request, res: Response) => {
  const conversation = ConversationService.getById(req.params.id as string);
  if (!conversation) return res.status(404).json({ success: false, error: 'Conversation not found' });
  const summary = summarizeConversation(conversation.messages.map(m => ({ sender: m.sender, content: m.content })));
  res.json({ success: true, data: summary });
});

router.get('/contact/:contactId', (req: Request, res: Response) => {
  const conversations = ConversationService.getByContactId(req.params.contactId as string);
  res.json({ success: true, data: conversations });
});

export default router;
