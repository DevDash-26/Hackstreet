import express, { type Express } from 'express';
import helmet from 'helmet';
import { API_PREFIX } from 'shared';
import { aiRouter } from './routes/ai.js';
import { errorHandler } from './middleware/error-handler.js';
import { requestLogger } from './middleware/logging.js';
import { notFound } from './middleware/not-found.js';

export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(express.json({ limit: '1mb' }));
  app.use(requestLogger);

  const apiRouter = express.Router();
  apiRouter.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });
  apiRouter.use(aiRouter);
  app.use(API_PREFIX, apiRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
