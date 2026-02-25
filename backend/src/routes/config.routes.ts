import { Router, Request, Response } from 'express';
import { SegmentService, WorkflowService, IntegrationService } from '../services/crm.service';

const router = Router();

// --- Segments ---
router.post('/segments', (req: Request, res: Response) => {
  try {
    const segment = SegmentService.create(req.body);
    res.status(201).json({ success: true, data: segment });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create segment';
    res.status(400).json({ success: false, error: message });
  }
});

router.get('/segments', (_req: Request, res: Response) => {
  const segments = SegmentService.list();
  res.json({ success: true, data: segments });
});

router.get('/segments/:id', (req: Request, res: Response) => {
  const segment = SegmentService.getById(req.params.id as string);
  if (!segment) return res.status(404).json({ success: false, error: 'Segment not found' });
  res.json({ success: true, data: segment });
});

// --- Workflows ---
router.post('/workflows', (req: Request, res: Response) => {
  try {
    const workflow = WorkflowService.create(req.body);
    res.status(201).json({ success: true, data: workflow });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create workflow';
    res.status(400).json({ success: false, error: message });
  }
});

router.get('/workflows', (_req: Request, res: Response) => {
  const workflows = WorkflowService.list();
  res.json({ success: true, data: workflows });
});

router.get('/workflows/:id', (req: Request, res: Response) => {
  const workflow = WorkflowService.getById(req.params.id as string);
  if (!workflow) return res.status(404).json({ success: false, error: 'Workflow not found' });
  res.json({ success: true, data: workflow });
});

// --- Integrations ---
router.post('/integrations', (req: Request, res: Response) => {
  try {
    const integration = IntegrationService.create(req.body);
    res.status(201).json({ success: true, data: integration });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create integration';
    res.status(400).json({ success: false, error: message });
  }
});

router.get('/integrations', (_req: Request, res: Response) => {
  const integrations = IntegrationService.list();
  res.json({ success: true, data: integrations });
});

router.get('/integrations/marketplace', (_req: Request, res: Response) => {
  const available = IntegrationService.getAvailableIntegrations();
  res.json({ success: true, data: available });
});

export default router;
