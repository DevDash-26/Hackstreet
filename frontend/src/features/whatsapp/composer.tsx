import { useState } from 'react';
import { MessageSquare, Send, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  useNotificationsStore,
  timeAgo,
  type NotificationAudience,
} from '@/app/store/notifications';
import { sendWhatsApp, resolveAudienceNumbers } from '@/services/whatsapp';

const AUDIENCES: Array<{ value: NotificationAudience; label: string }> = [
  { value: 'all', label: 'Everyone' },
  { value: 'students', label: 'All students' },
  { value: 'engineering', label: 'Engineering students' },
  { value: 'staff', label: 'Staff' },
];

function audienceLabel(value: NotificationAudience): string {
  return AUDIENCES.find((entry) => entry.value === value)?.label ?? value;
}

export function AdminNotificationComposer() {
  const send = useNotificationsStore((state) => state.send);
  const notifications = useNotificationsStore((state) => state.notifications);

  const [audience, setAudience] = useState<NotificationAudience>('students');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const waSent = notifications.filter((n) => n.channel.includes('whatsapp'));

  const handleSend = async () => {
    if (title.trim().length < 3 || body.trim().length < 10) {
      setError(true);
      return;
    }
    setError(false);
    setSending(true);
    try {
      const recipients = resolveAudienceNumbers(audience);
      const result = await sendWhatsApp({ to: recipients, body: body.trim() });
      if (result.ok) {
        send({
          title: title.trim(),
          body: body.trim(),
          sender: 'Administration',
          channel: ['whatsapp'],
          audience,
        });
        setTitle('');
        setBody('');
        setSent(true);
        setTimeout(() => setSent(false), 4000);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-2">
          <MessageSquare className="size-4 text-primary" />
          Send a WhatsApp notification
        </CardTitle>
        <CardDescription>
          Compose a broadcast for this demo. WhatsApp delivery is stubbed locally &mdash; the
          notification is saved to this device so you can preview the admin flow.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Audience</Label>
          <div className="flex flex-wrap gap-1.5">
            {AUDIENCES.map((entry) => (
              <Button
                key={entry.value}
                type="button"
                size="sm"
                variant={audience === entry.value ? 'default' : 'outline'}
                onClick={() => setAudience(entry.value)}
              >
                <Users className="size-3.5" />
                {entry.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="wa-title">Title</Label>
          <Input
            id="wa-title"
            placeholder="e.g. Exam hall change for CSE2201"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            aria-invalid={error && title.trim().length < 3}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="wa-body">Message</Label>
          <Textarea
            id="wa-body"
            rows={3}
            placeholder="Type the message that will be delivered via WhatsApp&hellip;"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            aria-invalid={error && body.trim().length < 10}
          />
        </div>

        {error ? (
          <p className="text-sm font-medium text-destructive" role="alert">
            Please add a title and a message of at least 10 characters.
          </p>
        ) : null}
        {sent ? (
          <p className="text-sm font-medium text-success" role="status">
            Notification queued for {audienceLabel(audience)} (demo preview on this device).
          </p>
        ) : null}

        <Button className="self-start" onClick={() => void handleSend()} disabled={sending}>
          {sending ? 'Sending&hellip;' : 'Send via WhatsApp'}
          <Send />
        </Button>
      </CardContent>

      <CardContent className="flex flex-col gap-1">
        <h2 className="mb-1 text-sm font-medium text-foreground">Recently sent</h2>
        {waSent.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing sent yet.</p>
        ) : (
          waSent.slice(0, 5).map((notification) => (
            <div
              key={notification.id}
              className="flex items-start justify-between gap-2 rounded-lg border border-border p-2.5"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">{notification.title}</span>
                <span className="text-xs text-muted-foreground line-clamp-2">
                  {notification.body}
                </span>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <Badge variant="secondary" className="h-5">
                  WhatsApp
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {timeAgo(notification.sentAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
