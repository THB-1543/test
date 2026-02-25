import { Router, Request, Response } from 'express';
import { ContactService, LeadService, ActivityService, CustomerProfileService } from '../services/crm.service';

const router = Router();

// --- Contacts ---
router.post('/', (req: Request, res: Response) => {
  try {
    const contact = ContactService.create(req.body);
    res.status(201).json({ success: true, data: contact });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create contact';
    res.status(400).json({ success: false, error: message });
  }
});

router.get('/', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 20;
  const { contacts, total } = ContactService.list({ page, pageSize });
  res.json({ success: true, data: contacts, meta: { page, pageSize, total } });
});

router.get('/search', (req: Request, res: Response) => {
  const query = req.query.q as string || '';
  const contacts = ContactService.search(query);
  res.json({ success: true, data: contacts });
});

router.get('/:id', (req: Request, res: Response) => {
  const contact = ContactService.getById(req.params.id as string);
  if (!contact) return res.status(404).json({ success: false, error: 'Contact not found' });
  res.json({ success: true, data: contact });
});

router.put('/:id', (req: Request, res: Response) => {
  const contact = ContactService.update(req.params.id as string, req.body);
  if (!contact) return res.status(404).json({ success: false, error: 'Contact not found' });
  res.json({ success: true, data: contact });
});

router.delete('/:id', (req: Request, res: Response) => {
  const deleted = ContactService.delete(req.params.id as string);
  if (!deleted) return res.status(404).json({ success: false, error: 'Contact not found' });
  res.json({ success: true, data: { deleted: true } });
});

// --- 360° Customer Profile ---
router.get('/:id/profile', (req: Request, res: Response) => {
  const profile = CustomerProfileService.getProfile(req.params.id as string);
  if (!profile) return res.status(404).json({ success: false, error: 'Contact not found' });
  res.json({ success: true, data: profile });
});

// --- Contact Activities ---
router.get('/:id/activities', (req: Request, res: Response) => {
  const activities = ActivityService.getByContactId(req.params.id as string);
  res.json({ success: true, data: activities });
});

router.post('/:id/activities', (req: Request, res: Response) => {
  try {
    const activity = ActivityService.create({ ...req.body, contactId: req.params.id as string });
    res.status(201).json({ success: true, data: activity });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create activity';
    res.status(400).json({ success: false, error: message });
  }
});

// --- Contact Leads ---
router.get('/:id/leads', (req: Request, res: Response) => {
  const leads = LeadService.getByContactId(req.params.id as string);
  res.json({ success: true, data: leads });
});

export default router;
