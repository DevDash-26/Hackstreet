/**
 * AI Assistant gateway.
 *
 * STUB: there is no backend yet, so this returns canned demo replies with
 * simulated latency. To wire a real provider later (e.g. Groq, OpenAI, or
 * Gemini — all expose an OpenAI-compatible chat-completions endpoint),
 * replace the body of `askAssistant` with your fetch call. The rest of the
 * app only depends on this function's shape.
 */

import { RoleKeys, type RoleKey } from 'shared';

export interface AssistantRequest {
  /** Free-text question from the user. */
  message: string;
  /** Current role, used to tailor canned replies. */
  role: RoleKey;
  /** Current portal section slug (e.g. "bookings"), for context. */
  section?: string;
}

export interface AssistantResult {
  reply: string;
  provider: string;
}

export const ASSISTANT_PROVIDER = 'mock';

const ROLE_LABEL: Record<RoleKey, string> = {
  [RoleKeys.STUDENT]: 'student',
  [RoleKeys.STAFF_ACADEMIC]: 'academic staff member',
  [RoleKeys.STAFF_SOCIETY]: 'society staff member',
  [RoleKeys.ADMIN]: 'administrator',
  [RoleKeys.PARENT]: 'parent',
};

export async function askAssistant(request: AssistantRequest): Promise<AssistantResult> {
  await new Promise((resolve) => setTimeout(resolve, 900));

  // const url = `${API_PREFIX}/assistant`;
  // const res = await fetch(url, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(request),
  // });

  const topic = detectTopic(request.message);

  return {
    reply: buildCannedReply(request, topic),
    provider: ASSISTANT_PROVIDER,
  };
}

/** Loose keyword match to pick a relevant demo answer. */
function detectTopic(message: string): string {
  const text = message.toLowerCase();
  const topics: Array<[string, string[]]> = [
    [
      'academicSupport',
      ['study group', 'tutor', 'mentor', 'academic support', 'help with studies'],
    ],
    ['wellbeing', ['wellbeing', 'counsel', 'mental', 'stress', 'anxiety']],
    ['jobs', ['job', 'internship', 'placement', 'part-time', 'career', 'vacancy']],
    ['emergency', ['emergency', 'safety', 'fire', 'evacuat', 'security', 'ambulance']],
    ['calendar', ['calendar', 'deadline', 'add/drop', 'exam', 'results', 'semester date']],
    ['lostFound', ['lost', 'found', 'missing']],
    ['dining', ['dining', 'food', 'canteen', 'cafe', 'lunch', 'menu', 'eat']],
    ['library', ['library', 'borrow', 'reading room', 'kiosk']],
    ['bookings', ['book', 'room', 'classroom', 'space', 'meeting']],
    ['timetable', ['timetable', 'schedule', 'lecture', 'class', 'slot']],
    ['fees', ['fee', 'pay', 'payment', 'finance', 'invoice', 'scholarship', 'bursary']],
    ['campus', ['campus', 'building', 'where', 'location', 'directions', 'map']],
    ['support', ['support', 'it', 'help', 'problem', 'issue', 'password', 'wifi', 'wi-fi']],
    ['notifications', ['notification', 'announce', 'whatsapp', 'alert', 'news']],
  ];
  for (const [name, words] of topics) {
    if (words.some((w) => text.includes(w))) return name;
  }
  return 'general';
}

function buildCannedReply(request: AssistantRequest, topic: string): string {
  const role = ROLE_LABEL[request.role] ?? 'student';
  const section = request.section ?? 'portal';

  const answers: Record<string, string> = {
    academicSupport:
      'Academic Support lets you join a study group, request peer tutoring or ask for a ' +
      'staff mentor. Open the Academic Support section and pick the option you need — ' +
      'requests go straight to the academic office.',
    wellbeing:
      'Wellbeing & Care lists confidential counselling, drop-in sessions and a 24/7 phone ' +
      'line. Sessions are free and private, and you can book from the Wellbeing section.',
    jobs:
      'Jobs & Internships collects on-campus roles, placements and internships. Open that ' +
      'section and tap “Show interest” to be put forward for a role.',
    emergency:
      'For anything urgent, call the campus emergency line in the Emergency & Safety ' +
      'section (+94 11 700 0000, 24/7). That section also has fire, medical and evacuation ' +
      'guidance you can save to your phone.',
    calendar:
      'The Academic Calendar lists add/drop dates, breaks, exam periods and results release. ' +
      'Check it before planning anything time-sensitive.',
    lostFound:
      'Lost & Found lets you search reported items and report one you have found or lost. ' +
      'Open the section, search by keyword, or tap “Report an item”.',
    dining:
      'Dining & Food shows every canteen and cafe with opening hours, menus and locations — ' +
      'including the Student Centre and library concourse.',
    library:
      'The Library section covers opening hours, group study pods, course reserves and ' +
      'self-service borrowing. You can book a pod straight from there.',
    bookings:
      'You can book a classroom directly from Campus Bookings — pick a day, select free ' +
      'slots from the grid, and confirm. No admin approval needed, and your bookings are saved.',
    timetable:
      'Your timetable lives in the Schedule section of the portal. If a class has been ' +
      'rescheduled, the affected entry is flagged there too.',
    fees:
      'Fee details, due dates and payment status are shown in the Financial Support and ' +
      'Fees sections. Admins track the same ledger from Finance Analytics.',
    campus:
      'The Library (Level 2), CSE Block and Innovation Hub all have bookable study space. ' +
      'See Campus Bookings for live availability, or the Staff Directory for who to contact.',
    support:
      'For IT help, open IT & Tech Support and raise a ticket, or check the FAQ section for ' +
      'password, Wi-Fi and printing answers. The helpdesk is in the CSE Block (Mon–Fri).',
    notifications:
      'Official announcements appear in your notification bell (top-right), including ' +
      'messages sent over WhatsApp, plus the Announcements section. Urgent notices land here.',
    general:
      `I can help you navigate the portal as a ${role}. Try asking about timetables, ` +
      `bookings, fees, wellbeing, jobs or campus support. You reached me from the ${section} section.`,
  };

  // Keep the reply short and readable in the chat bubble.
  return answers[topic] ?? answers.general;
}

export interface Suggestion {
  label: string;
  query: string;
}

export function getSuggestions(role: RoleKey): Suggestion[] {
  if (role === RoleKeys.ADMIN) {
    return [
      { label: 'Send an announcement', query: 'How do I send an announcement to students?' },
      { label: 'Emergency procedure', query: 'What is the campus emergency procedure?' },
      { label: 'Staff directory', query: 'Who is in the staff directory?' },
      { label: 'Student wellbeing', query: 'What wellbeing support is available?' },
    ];
  }
  return [
    { label: 'Book a study room', query: 'How do I book a study room?' },
    { label: 'Academic calendar', query: 'What are the key academic calendar dates?' },
    { label: 'Get academic support', query: 'How do I get academic support or a tutor?' },
    { label: 'I lost something', query: 'How do I report or find a lost item?' },
  ];
}
