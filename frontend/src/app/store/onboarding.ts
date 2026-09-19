import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OnboardingStep {
  id: string;
  label: string;
  description: string;
  /** Portal section to visit; omit for actions that open in place. */
  href?: string;
  /** Action id for non-navigation steps (e.g. open the assistant). */
  action?: 'assistant';
  done: boolean;
}

/**
 * Onboarding checklist.
 *
 * Goal-gradient principle: the first two steps are genuinely already complete
 * (the user has an account and has signed in), so progress starts above 0% and
 * the remaining steps feel achievable rather than daunting.
 */
const INITIAL_STEPS: OnboardingStep[] = [
  {
    id: 'account',
    label: 'Account created',
    description: 'Your university portal account is ready.',
    done: true,
  },
  {
    id: 'verified',
    label: 'Email verified',
    description: 'nimal.perera@ucl.ac.lk is confirmed.',
    done: true,
  },
  {
    id: 'profile',
    label: 'Complete your profile',
    description: 'Add a photo and your contact details.',
    href: '/portal/profile',
    done: false,
  },
  {
    id: 'schedule',
    label: 'Review your timetable',
    description: 'Check this semester\u2019s lectures and labs.',
    href: '/portal/schedule',
    done: false,
  },
  {
    id: 'booking',
    label: 'Book a study space',
    description: 'Reserve a room for group work.',
    href: '/portal/bookings',
    done: false,
  },
  {
    id: 'assistant',
    label: 'Meet Mr. Damith',
    description: 'Ask the campus assistant a question.',
    action: 'assistant',
    done: false,
  },
];

interface OnboardingState {
  steps: OnboardingStep[];
  complete: (id: string) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      steps: INITIAL_STEPS,
      complete: (id) =>
        set((state) => ({
          steps: state.steps.map((step) => (step.id === id ? { ...step, done: true } : step)),
        })),
      reset: () => set({ steps: INITIAL_STEPS }),
    }),
    { name: 'university-portal-onboarding' },
  ),
);
