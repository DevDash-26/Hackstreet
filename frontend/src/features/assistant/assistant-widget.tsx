import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { Bot, Minus, Send, Sparkles } from 'lucide-react';
import { cn } from 'cn';

import { WELCOME_MESSAGE, useChatStore } from '@/app/store/chat';
import { askAssistant, getSuggestions } from '@/services/ai';
import { usePortalAuth } from '@/hooks/use-portal-auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

function timeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function AssistantWidget() {
  const { role } = usePortalAuth();
  const { pathname } = useLocation();
  const section = pathname.split('/')[2];

  const open = useChatStore((s) => s.open);
  const messages = useChatStore((s) => s.messages);
  const pending = useChatStore((s) => s.pending);
  const setOpen = useChatStore((s) => s.setOpen);
  const clear = useChatStore((s) => s.clear);
  const send = useChatStore((s) => s.send);
  const setPending = useChatStore((s) => s.setPending);

  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, pending, open]);

  async function submit(content: string) {
    const trimmed = content.trim();
    if (!trimmed || pending) return;
    setInput('');
    setPending(true);

    const result = await askAssistant({ message: trimmed, role, section });
    send(trimmed, result.reply);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submit(input);
  }

  const showSuggestions = messages.length === 0 && !pending;

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open ? (
        <section
          aria-label="Mr. Damith assistant"
          className={cn(
            'flex h-[28rem] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-popover shadow-xl',
            'animate-in fade-in-0 zoom-in-95 duration-150',
          )}
        >
          <header className="flex items-center gap-3 border-b border-border/80 bg-primary px-4 py-3 text-primary-foreground">
            <div className="relative grid size-9 place-items-center rounded-full bg-primary-foreground/15">
              <Sparkles className="size-4" />
              <span className="absolute top-0 right-0 size-2 rounded-full bg-success ring-2 ring-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-tight font-semibold">Mr. Damith</p>
              <p className="truncate text-xs text-primary-foreground/70">
                {pending ? 'Thinking…' : 'Online · demo mode'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                setOpen(false);
                clear();
              }}
              className="text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
              aria-label="Minimise assistant"
            >
              <Minus className="size-4" />
            </Button>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 ? <AssistantBubble message={WELCOME_MESSAGE} /> : null}
            {messages.map((m) =>
              m.role === 'user' ? (
                <UserBubble key={m.id} content={m.content} at={m.at} />
              ) : (
                <AssistantBubble key={m.id} message={m} />
              ),
            )}
            {pending ? (
              <div className="flex items-end gap-2">
                <BotAvatar />
                <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-border bg-muted/50 px-3 py-2.5 text-muted-foreground">
                  <span
                    className="size-1.5 animate-bounce rounded-full bg-current"
                    style={{ animationDelay: '0ms' }}
                  />
                  <span
                    className="size-1.5 animate-bounce rounded-full bg-current"
                    style={{ animationDelay: '120ms' }}
                  />
                  <span
                    className="size-1.5 animate-bounce rounded-full bg-current"
                    style={{ animationDelay: '240ms' }}
                  />
                </div>
              </div>
            ) : null}
          </div>

          {showSuggestions ? (
            <div className="flex flex-wrap gap-2 px-4 pb-2">
              {getSuggestions(role).map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => void submit(s.query)}
                  className="rounded-full border border-input bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-foreground"
                >
                  {s.label}
                </button>
              ))}
            </div>
          ) : null}

          <form
            onSubmit={onSubmit}
            className="flex items-end gap-2 border-t border-border/80 bg-muted/40 p-3"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void submit(input);
                }
              }}
              placeholder="Ask about the portal…"
              rows={1}
              className="max-h-24 min-h-10 flex-1 resize-none"
              aria-label="Message the assistant"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || pending}
              aria-label="Send message"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </section>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          size="icon"
          className="size-14 rounded-full shadow-lg"
          aria-label="Open Mr. Damith assistant"
        >
          <Bot className="size-6" />
        </Button>
      )}
    </div>
  );
}

function BotAvatar() {
  return (
    <Avatar className="size-7 shrink-0">
      <AvatarFallback className="bg-primary text-primary-foreground">
        <Bot className="size-4" />
      </AvatarFallback>
    </Avatar>
  );
}

function AssistantBubble({ message }: { message: { content: string; at: string } }) {
  return (
    <div className="flex items-end gap-2">
      <BotAvatar />
      <div className="max-w-[80%]">
        <div className="rounded-2xl rounded-bl-sm border border-border bg-muted/50 px-3 py-2 text-sm text-foreground">
          {message.content}
        </div>
        <p className="mt-0.5 pl-1 text-[10px] text-muted-foreground">{timeLabel(message.at)}</p>
      </div>
    </div>
  );
}

function UserBubble({ content, at }: { content: string; at: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%]">
        <div className="rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground">
          {content}
        </div>
        <p className="mt-0.5 pr-1 text-right text-[10px] text-muted-foreground">{timeLabel(at)}</p>
      </div>
    </div>
  );
}
