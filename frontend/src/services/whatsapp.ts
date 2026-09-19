/**
 * WhatsApp delivery gateway.
 *
 * STUB: there is no backend yet, so this simulates a WhatsApp Business
 * API call and resolves locally. To wire a real provider later (e.g. Twilio
 * WhatsApp or the WhatsApp Business Cloud API), replace the body of
 * `sendWhatsApp` with your HTTP/2 request — the rest of the app only
 * depends on this function's shape.
 */

export interface WhatsAppMessage {
  /** Phone number(s) in E.164 form — e.g. +94771234567. */
  to: string[];
  body: string;
  /** Freesample branding handled by the template. */
  templateName?: string;
}

export interface WhatsAppResult {
  ok: boolean;
  messageId?: string;
  provider?: string;
  error?: string;
}

export const WHATSAPP_PROVIDER = 'mock';

export async function sendWhatsApp(_message: WhatsAppMessage): Promise<WhatsAppResult> {
  // const url = `${API_PREFIX}/whatsapp/send`;
  // const res = await fetch(url, { method: 'POST', body: JSON.stringify(message) });
  await new Promise((resolve) => setTimeout(resolve, 650));
  return {
    ok: true,
    messageId: `wa_${Date.now().toString(36)}`,
    provider: WHATSAPP_PROVIDER,
  };
}

/** Build targeted phone numbers. Stubbed — replace with a real directory
 *  lookup (e.g. from the users registry by `audience`). */
export function resolveAudienceNumbers(_audience: string): string[] {
  return ['+94771234567', '+94779876543'];
}
