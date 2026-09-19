import { Router } from 'express';
import { z } from 'zod';
import type { RoleKey } from 'shared';
import { RoleKeys } from 'shared';
import { logger } from '../lib/logger.js';
import { buildSystemPrompt } from '../services/ai-prompt.js';
import { AiProviderError, completeChat, isAiConfigured } from '../services/ai-provider.js';

const assistantSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  role: z
    .string()
    .refine((value) => Object.values(RoleKeys).includes(value as RoleKey))
    .default(RoleKeys.STUDENT),
  section: z.string().trim().max(80).default('portal'),
});

export const aiRouter = Router();

aiRouter.post('/assistant', async (req, res) => {
  const parsed = assistantSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
  }

  if (!isAiConfigured()) {
    return res
      .status(503)
      .json({ error: 'AI assistant is not configured on the server', provider: 'unconfigured' });
  }

  const { message, role, section } = parsed.data;
  const messages = [
    { role: 'system' as const, content: buildSystemPrompt(role as RoleKey, section) },
    { role: 'user' as const, content: message },
  ];

  try {
    const result = await completeChat(messages);
    return res.json({ reply: result.reply, provider: result.provider, configured: true });
  } catch (error) {
    if (error instanceof AiProviderError) {
      logger.error(error.message);
      return res.status(502).json({ error: error.message, provider: 'unavailable' });
    }
    logger.error('Unexpected error in /assistant', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});