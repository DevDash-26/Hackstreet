import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Laptop,
  Lock,
  RotateCcw,
  Smartphone,
  Tablet,
} from 'lucide-react';

import { usePortalAuth } from '@/hooks/use-portal-auth';
import { getNavForRole } from '@/constants/navigation';
import { useProfileStore, type FieldDict } from '@/features/profile/profile-store';
import {
  ROLE_PROFILES,
  buildValues,
  isPersistable,
  type ActiveSession,
  type ProfileField,
  type ProfileSection,
} from '@/features/profile/profile-definitions';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

function formatSaved(iso: string | undefined): string {
  if (iso === undefined) return 'Not saved yet';
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Small wrapper over the native select so it matches the Input primitives. */
function Select({
  value,
  onChange,
  options,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: ProfileField;
  value: string;
  onChange: (value: string) => void;
}) {
  if (field.kind === 'locked') {
    return (
      <div className="flex items-center gap-2">
        <Input value={value} disabled aria-readonly />
        <Badge variant="outline" className="shrink-0 gap-1">
          <Lock className="size-3" />
          Locked
        </Badge>
      </div>
    );
  }

  if (field.kind === 'select') {
    return <Select value={value} onChange={onChange} options={field.options ?? []} />;
  }

  if (field.kind === 'textarea') {
    return (
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        rows={3}
        className="resize-none"
      />
    );
  }

  return (
    <Input
      type={field.kind === 'password' ? 'password' : field.kind}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={field.placeholder}
      autoComplete={field.kind === 'password' ? 'new-password' : undefined}
    />
  );
}

function SessionDeviceIcon({ device }: { device: string }) {
  const text = device.toLowerCase();
  const Icon = text.includes('tablet') ? Tablet : text.includes('iphone') || text.includes('android') ? Smartphone : Laptop;
  return <Icon className="size-4" />;
}

function ActiveSessionsList({ sessions }: { sessions: ActiveSession[] }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <CalendarDays className="size-3.5" />
        Active sessions
      </div>
      {sessions.map((session) => (
        <div
          key={session.device}
          className="flex items-center gap-3 rounded-lg border border-border/60 p-2.5"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <SessionDeviceIcon device={session.device} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{session.device}</p>
            <p className="truncate text-xs text-muted-foreground">
              {session.location} · {session.time}
            </p>
          </div>
          {session.current ? (
            <Badge variant="secondary" className="shrink-0 text-[10px]">
              This device
            </Badge>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function ProfileIdentityCard({
  displayName,
  email,
  initials,
  badge,
  memberSince,
  lastSaved,
}: {
  displayName: string;
  email: string;
  initials: string;
  badge: { label: string; className: string };
  memberSince: string;
  lastSaved?: string;
}) {
  return (
    <Card className="gap-3">
      <CardContent className="flex flex-col items-center gap-3 p-4 text-center">
        <Avatar size="lg" className="size-16">
          <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center gap-1">
          <p className="font-heading text-base font-semibold text-foreground">{displayName}</p>
          <p className="break-all text-xs text-muted-foreground">{email}</p>
        </div>
        <Badge className={badge.className}>{badge.label}</Badge>
        <dl className="mt-1 grid w-full grid-cols-2 gap-2 border-t border-border/60 pt-3 text-left">
          <div className="flex flex-col">
            <dt className="text-[10px] tracking-wide text-muted-foreground uppercase">Member since</dt>
            <dd className="text-sm font-medium text-foreground">{memberSince}</dd>
          </div>
          <div className="flex flex-col">
            <dt className="text-[10px] tracking-wide text-muted-foreground uppercase">Last saved</dt>
            <dd className="text-sm font-medium text-foreground">{formatSaved(lastSaved)}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}

function QuickLinksCard() {
  const { role } = usePortalAuth();
  const links = getNavForRole(role)
    .flatMap((group) => group.items)
    .filter((item) => item.href !== '/portal/profile')
    .slice(0, 4);

  return (
    <Card className="gap-2.5">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">Quick links</CardTitle>
        <CardDescription>Jump to the sections you use most.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className="group flex items-center gap-2.5 rounded-lg border border-border/60 px-2.5 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                <Icon className="size-3.5" />
              </span>
              <span className="min-w-0 flex-1 truncate">{item.title}</span>
              <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}

function ProfileSectionCard({
  section,
  initial,
  onSave,
}: {
  section: ProfileSection;
  initial: FieldDict;
  onSave: (patch: FieldDict) => void;
}) {
  const [draft, setDraft] = useState<FieldDict>(() => {
    const values: FieldDict = {};
    for (const field of section.fields) values[field.key] = initial[field.key] ?? '';
    return values;
  });
  const [saved, setSaved] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const Icon = section.icon;
  const setValue = (key: string, value: string) => setDraft((prev) => ({ ...prev, [key]: value }));

  // Password fields are demo-only and never persisted, so they must not enable
  // "Save" on their own — otherwise we'd claim success while dropping input.
  const persistableDirty = section.fields.some(
    (field) => isPersistable(field) && (draft[field.key] ?? '') !== (initial[field.key] ?? ''),
  );
  const passwordEntered = section.fields.some(
    (field) => field.kind === 'password' && (draft[field.key] ?? '').length > 0,
  );

  const handleSave = () => {
    const newPassword = draft.newPassword?.trim() ?? '';
    const confirmPassword = draft.confirmPassword?.trim() ?? '';
    if (newPassword.length > 0 && newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }
    setPasswordError(null);
    const patch: FieldDict = {};
    for (const field of section.fields) {
      if (!isPersistable(field)) continue;
      patch[field.key] = (draft[field.key] ?? '').trim();
    }
    onSave(patch);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    const values: FieldDict = {};
    for (const field of section.fields) values[field.key] = initial[field.key] ?? '';
    setDraft(values);
    setPasswordError(null);
  };

  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-4" />
            </span>
            <div className="grid gap-0.5">
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </div>
          </div>
          {saved ? (
            <Badge className="shrink-0 gap-1 bg-success/10 text-success">
              <CheckCircle2 className="size-3" />
              Saved
            </Badge>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-2">
        {section.fields.map((field) => (
          <div key={field.key} className="flex flex-col gap-1.5">
            <Label>{field.label}</Label>
            <FieldInput field={field} value={draft[field.key] ?? ''} onChange={(v) => setValue(field.key, v)} />
            {field.hint ? <p className="text-xs text-muted-foreground">{field.hint}</p> : null}
          </div>
        ))}
      </CardContent>

      {section.sessions ? <CardContent><ActiveSessionsList sessions={section.sessions} /></CardContent> : null}

      {passwordError !== null ? (
        <CardContent className="pt-0">
          <p className="text-sm font-medium text-destructive" role="alert">
            {passwordError}
          </p>
        </CardContent>
      ) : null}

      {passwordEntered ? (
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground">
            Password changes aren&rsquo;t persisted in this demo — they&rsquo;re validated here but
            only saved once a real auth backend is wired.
          </p>
        </CardContent>
      ) : null}

      <CardContent className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
        <Button onClick={handleSave} disabled={!persistableDirty}>
          <Check />
          Save changes
        </Button>
        <Button variant="ghost" onClick={handleReset} disabled={!persistableDirty && !passwordEntered}>
          <RotateCcw />
          Revert
        </Button>
        <span className="ml-auto text-xs text-muted-foreground">
          Changes are saved to this device for the demo.
        </span>
      </CardContent>
    </Card>
  );
}

/** The account profile manager. Renders a real editor: an identity card with
 *  completion status plus role-specific, editable sections. Each persona gets
 *  slightly different fields (academic record, employment, ward details...). */
export function ProfilePage() {
  const { role, email, displayName, initials, badge } = usePortalAuth();
  const data = useProfileStore((s) => s.data);
  const savedAt = useProfileStore((s) => s.savedAt);
  const save = useProfileStore((s) => s.save);

  const profile = ROLE_PROFILES[role];
  const values = buildValues(role, data[email]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your identity, contact and role details. Your student, staff or ward record is
          shown to the offices that need it.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(15rem,20rem)_1fr]">
        <div className="flex flex-col gap-4">
          <ProfileIdentityCard
            displayName={displayName}
            email={email}
            initials={initials}
            badge={badge}
            memberSince={profile.memberSince}
            lastSaved={savedAt[email]}
          />
          <QuickLinksCard />
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          {profile.sections.map((section) => (
            <ProfileSectionCard
              key={`${email}-${section.id}`}
              section={section}
              initial={values}
              onSave={(patch) => save(email, patch)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}