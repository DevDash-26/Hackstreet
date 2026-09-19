import { env } from '../config/env.js';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AiProviderResult {
  reply: string;
  /** The model that produced the answer, used as the provider label. */
  provider: string;
}

/** Raised when the provider call fails or returns unusable output. */
export class AiProviderError extends Error {}

export function isAiConfigured(): boolean {
  return env.AI_API_KEY.trim() !== '';
}

/** Calls the configured OpenAI-compatible `/chat/completions` endpoint. */
export async function completeChat(messages: ChatMessage[]): Promise<AiProviderResult> {
  if (!isAiConfigured()) {
    throw new AiProviderError('AI assistant is not configured: missing AI_API_KEY on the server');
  }

  const baseUrl = env.AI_PROVIDER_URL.replace(/\/+$/, '');
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.AI_MODEL,
      messages,
      temperature: 0.4,
      max_tokens: 420,
    }),
    signal: AbortSignal.timeout(env.AI_TIMEOUT_MS),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new AiProviderError(`AI provider returned ${response.status}: ${detail.slice(0, 300)}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (content === undefined || content === '') {
    throw new AiProviderError('AI provider returned an empty response');
  }

  return { reply: content, provider: env.AI_MODEL };
}