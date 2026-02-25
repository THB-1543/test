import { Router, Request, Response } from 'express';
import { LeadService } from '../services/crm.service';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  try {
    const lead = LeadService.create(req.body);
    res.status(201).json({ success: true, data: lead });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create lead';
    res.status(400).json({ success: false, error: message });
  }
});

router.get('/', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 20;
  const { leads, total } = LeadService.list({ page, pageSize });
  res.json({ success: true, data: leads, meta: { page, pageSize, total } });
});

router.get('/:id', (req: Request, res: Response) => {
  const lead = LeadService.getById(req.params.id as string);
  if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });
  res.json({ success: true, data: lead });
});

router.patch('/:id/status', (req: Request, res: Response) => {
  const lead = LeadService.updateStatus(req.params.id as string, req.body.status);
  if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });
  res.json({ success: true, data: lead });
});

router.post('/rescore', (_req: Request, res: Response) => {
  const count = LeadService.rescoreAll();
  res.json({ success: true, data: { rescored: count } });
});

export default router;
