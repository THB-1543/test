import { Router, Request, Response } from 'express';
import { TicketService } from '../services/crm.service';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  try {
    const ticket = TicketService.create(req.body);
    res.status(201).json({ success: true, data: ticket });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create ticket';
    res.status(400).json({ success: false, error: message });
  }
});

router.get('/', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 20;
  const { tickets, total } = TicketService.list({ page, pageSize });
  res.json({ success: true, data: tickets, meta: { page, pageSize, total } });
});

router.get('/:id', (req: Request, res: Response) => {
  const ticket = TicketService.getById(req.params.id as string);
  if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });
  res.json({ success: true, data: ticket });
});

router.patch('/:id/status', (req: Request, res: Response) => {
  const ticket = TicketService.updateStatus(req.params.id as string, req.body.status);
  if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });
  res.json({ success: true, data: ticket });
});

export default router;
