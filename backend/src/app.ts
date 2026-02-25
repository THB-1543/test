import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import contactsRouter from './routes/contacts.routes';
import leadsRouter from './routes/leads.routes';
import opportunitiesRouter from './routes/opportunities.routes';
import ticketsRouter from './routes/tickets.routes';
import conversationsRouter from './routes/conversations.routes';
import aiRouter from './routes/ai.routes';
import configRouter from './routes/config.routes';

export function createApp(): express.Application {
  const app = express();

  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(morgan('combined'));
  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Routes
  app.use('/api/contacts', contactsRouter);
  app.use('/api/leads', leadsRouter);
  app.use('/api/opportunities', opportunitiesRouter);
  app.use('/api/tickets', ticketsRouter);
  app.use('/api/conversations', conversationsRouter);
  app.use('/api/ai', aiRouter);
  app.use('/api', configRouter);

  // Error handling
  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  });

  return app;
}
