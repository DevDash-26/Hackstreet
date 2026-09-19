import { Check, ChevronRight, PartyPopper } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from 'cn';

import { useOnboardingStore } from '@/app/store/onboarding';
import { useChatStore } from '@/app/store/chat';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function SetupChecklist() {
  const navigate = useNavigate();
  const steps = useOnboardingStore((s) => s.steps);
  const complete = useOnboardingStore((s) => s.complete);
  const openAssistant = useChatStore((s) => s.setOpen);

  const done = steps.filter((s) => s.done).length;
  const total = steps.length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  const allDone = done === total;

  function handleStep(id: string, href?: string, action?: string) {
    complete(id);
    if (href) {
      navigate(href);
    } else if (action === 'assistant') {
      openAssistant(true);
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div className="flex flex-col gap-1">
          <CardTitle className="flex items-center gap-2">
            <PartyPopper className="size-4 text-primary" />
            {allDone ? "You're all set" : 'Getting started'}
          </CardTitle>
          <CardDescription>
            {allDone
              ? 'Nice work — you have completed every setup step.'
              : `${done} of ${total} steps done. Keep the momentum going.`}
          </CardDescription>
        </div>
        <span className="shrink-0 font-heading text-lg font-semibold text-primary">{percent}%</span>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Onboarding progress"
          className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          {steps.map((step) => (
            <button
              key={step.id}
              type="button"
              disabled={step.done}
              onClick={() => handleStep(step.id, step.href, step.action)}
              className={cn(
                'group flex items-center gap-3 rounded-lg border border-border/60 p-2.5 text-left transition-colors',
                step.done ? 'opacity-70' : 'hover:border-primary/40 hover:bg-primary/5',
              )}
            >
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full border',
                  step.done
                    ? 'border-transparent bg-success text-success-foreground'
                    : 'border-input text-transparent group-hover:border-primary/50',
                )}
              >
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    'block text-sm font-medium',
                    step.done ? 'text-muted-foreground line-through' : 'text-foreground',
                  )}
                >
                  {step.label}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {step.description}
                </span>
              </span>
              {step.done ? null : (
                <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              )}
            </button>
          ))}
        </div>

        {!allDone ? (
          <Button
            variant="outline"
            size="sm"
            className="self-start"
            onClick={() => {
              const next = steps.find((s) => !s.done);
              if (next) handleStep(next.id, next.href, next.action);
            }}
          >
            Continue setup
            <ChevronRight />
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
