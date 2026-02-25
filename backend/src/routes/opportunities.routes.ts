import { Router, Request, Response } from 'express';
import { OpportunityService } from '../services/crm.service';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  try {
    const opp = OpportunityService.create(req.body);
    res.status(201).json({ success: true, data: opp });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create opportunity';
    res.status(400).json({ success: false, error: message });
  }
});

router.get('/', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 20;
  const { opportunities, total } = OpportunityService.list({ page, pageSize });
  res.json({ success: true, data: opportunities, meta: { page, pageSize, total } });
});

router.get('/pipeline', (_req: Request, res: Response) => {
  const pipeline = OpportunityService.getPipeline();
  res.json({ success: true, data: pipeline });
});

router.get('/:id', (req: Request, res: Response) => {
  const opp = OpportunityService.getById(req.params.id as string);
  if (!opp) return res.status(404).json({ success: false, error: 'Opportunity not found' });
  res.json({ success: true, data: opp });
});

router.patch('/:id/stage', (req: Request, res: Response) => {
  const opp = OpportunityService.updateStage(req.params.id as string, req.body.stage);
  if (!opp) return res.status(404).json({ success: false, error: 'Opportunity not found' });
  res.json({ success: true, data: opp });
});

export default router;
