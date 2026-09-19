import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  /** Optional live AI assistant. Leave empty to keep the frontend's canned mock. */
  AI_API_KEY: z.string().default(''),
  /** Model name passed to the configured OpenAI-compatible endpoint. */
  AI_MODEL: z.string().default('llama-3.3-70b-versatile'),
  /**
   * OpenAI-compatible chat-completions base URL. Works with Groq, OpenAI,
   * Google Gemini (OpenAI mode), Ollama, LM Studio, etc.
   */
  AI_PROVIDER_URL: z
    .string()
    .url()
    .default('https://api.groq.com/openai/v1'),
  /** Provider call timeout in milliseconds. */
  AI_TIMEOUT_MS: z.coerce.number().int().positive().default(15000),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  console.error(`Invalid environment configuration:\n${issues}`);
  throw new Error('Fix the environment configuration before starting the server.');
}

export const env = parsed.data;

export type Env = typeof env;
