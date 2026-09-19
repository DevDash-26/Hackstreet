import { useState } from 'react';
import type { ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  HeartHandshake,
  KeyRound,
  LogIn,
  Shield,
  Sparkles,
  UserRound,
} from 'lucide-react';
import type { RoleKey } from 'shared';
import { RoleKeys } from 'shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Brand, Crest } from '@/components/layout/brand';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { AssistantWidget } from '@/features/assistant/assistant-widget';
import { useDemoSession } from '@/app/store/demo-session';


interface DemoRole {
  id: string;
  role: RoleKey;
  label: string;
  tagline: string;
  icon: ComponentType<{ className?: string }>;
  name: string;
  email: string;
  password: string;
}

/** Demo personas from the mockup. Sign-in stores the persona in the demo
 *  session and enters the portal shell (template mode). */
const DEMO_ROLES: DemoRole[] = [
  {
    id: 'student',
    role: RoleKeys.STUDENT,
    label: 'Student',
    tagline: 'Coursework, grades & timetable',
    icon: GraduationCap,
    name: 'Nimal Perera',
    email: 'nimal.perera@ucl.ac.lk',
    password: 'demo1234',
  },
  {
    id: 'lecturer',
    role: RoleKeys.STAFF_ACADEMIC,
    label: 'Lecturer',
    tagline: 'Teach, assess & manage modules',
    icon: BookOpen,
    name: 'Dr. Sanjaya Silva',
    email: 'sanjaya.s@ucl.ac.lk',
    password: 'demo1234',
  },
  {
    id: 'admin',
    role: RoleKeys.ADMIN,
    label: 'Administrator',
    tagline: 'Platform & portal administration',
    icon: Shield,
    name: 'Priyanka Perera',
    email: 'priyanka.s@ucl.ac.lk',
    password: 'demo1234',
  },
  {
    id: 'parent',
    role: RoleKeys.PARENT,
    label: 'Parent',
    tagline: 'Track ward progress & fees',
    icon: HeartHandshake,
    name: 'Sharon Perera',
    email: 'sharon.p@email.lk',
    password: 'demo1234',
  },
];

export function LoginPage() {
  const navigate = useNavigate();
  const signInAs = useDemoSession((s) => s.signInAs);
  const [selectedRole, setSelectedRole] = useState<DemoRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInError, setSignInError] = useState<string | null>(null);

  const pickRole = (role: DemoRole) => {
    setSelectedRole(role);
    setEmail(role.email);
    setPassword(role.password);
    setSignInError(null);
  };

  const handleSignIn = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedRole === null) return;
    // Template mode: validate against the demo persona so the form is honest, then
    // store the persona so the portal renders the right role-aware dashboard.
    // Swap for supabase.auth.signInWithPassword later.
    if (email.trim().toLowerCase() !== selectedRole.email.toLowerCase()) {
      setSignInError(`That email doesn't match the ${selectedRole.label} demo account.`);
      return;
    }
    if (password !== selectedRole.password) {
      setSignInError('Incorrect password. Every demo role signs in with demo1234.');
      return;
    }
    setSignInError(null);
    signInAs({ role: selectedRole.role, name: selectedRole.name, email: selectedRole.email });
    navigate('/portal');
  };

  return (
    <div
      className="relative flex min-h-dvh flex-col overflow-hidden bg-[#0c0c0e] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/landingpage-bg.png')" }}
    >
      {/* Depth of field: charcoal cinematic wash, bottom-heavy for readability */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25"
      />
      {/* Vignette to focus the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 [background:radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]"
      />
      {/* UCL red ambient accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-primary/25 via-transparent to-transparent"
      />
      {/* lakeside cue: cool mist along the Diyawanna Lake horizon */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-44 bg-gradient-to-t from-sky-200/10 to-transparent"
      />
      {/* fine grain line to seat the interface on the photograph */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-14 z-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      <header className="relative z-10 flex h-14 items-center justify-between px-4 sm:px-6">
        <Brand className="[&_span]:text-white" />
        <div className="[&_button]:text-white [&_button:hover]:bg-white/10">
          <ThemeToggle />
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-border/60 bg-card/95 shadow-xl backdrop-blur-md ring-1 ring-border">
          <div className="grid md:grid-cols-[1fr_1.4fr]">
            {/* Left brand panel */}
            <div className="flex flex-col justify-between gap-8 bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-8 text-primary-foreground md:p-10">
              <div className="flex flex-col gap-3">
                <Crest className="size-12 bg-card/10 rounded-lg p-1.5" />
                <h1 className="font-heading text-2xl leading-tight font-semibold">
                  One portal for all of university life
                </h1>
                <p className="text-sm text-primary-foreground/85">
                  Timetables, grades, bookings, societies and support services — in one place.
                </p>
              </div>
              <div className="flex flex-col gap-6">
                <ul className="flex flex-col gap-2 text-xs text-primary-foreground/85">
                  <li className="flex items-center gap-2">
                    <Sparkles className="size-3.5" /> Live timetable &amp; grade tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="size-3.5" /> Campus bookings &amp; facilities
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="size-3.5" /> Societies, events &amp; wellbeing
                  </li>
                </ul>

              {/* Value before sign-in: an honest, no-obligation campus snapshot
                  (reciprocity) — useful now, not locked behind a form. */}
              <div className="rounded-xl bg-card/10 p-3.5 ring-1 ring-card/15 backdrop-blur-sm">
              </div>
              </div>
            </div>

            {/* Right panel: role selection + sign in */}
            <div className="p-6 sm:p-8">
              {selectedRole === null ? (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <h2 className="font-heading text-xl font-semibold text-foreground">
                      Who are you signing in as?
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Pick a role to preview its portal with pre-filled demo credentials.
                    </p>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {DEMO_ROLES.map((role) => {
                      const Icon = role.icon;
                      return (
                        <button
                          key={role.id}
                          onClick={() => pickRole(role)}
                          className="group flex items-start gap-3 rounded-xl border border-border/80 p-3.5 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
                        >
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                            <Icon className="size-4.5" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-medium text-foreground">
                              {role.label}
                            </span>
                            <span className="block truncate text-xs text-muted-foreground">
                              {role.tagline}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2.5 text-xs text-muted-foreground">
                    <KeyRound className="size-4 shrink-0 text-primary" />
                    Every role signs in with password&nbsp;
                    <code className="rounded bg-background px-1 py-0.5 font-mono text-xs">
                      demo1234
                    </code>
                  </div>
                </div>
              ) : (
                <form className="flex flex-col gap-4" onSubmit={handleSignIn}>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="w-fit">
                        {selectedRole.label}
                      </Badge>
                      <button
                        type="button"
                        onClick={() => setSelectedRole(null)}
                        className="text-xs font-medium text-muted-foreground underline-offset-3 hover:text-foreground hover:underline"
                      >
                        Switch role
                      </button>
                    </div>
                    <h2 className="font-heading text-xl font-semibold text-foreground">
                      Sign in to {selectedRole.label} portal
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Demo account {selectedRole.email}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <UserRound className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        autoComplete="username"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          setSignInError(null);
                        }}
                        className="pl-8"
                        placeholder="you@ucl.ac.lk"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <KeyRound className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  {signInError !== null ? (
                    <p className="text-sm font-medium text-destructive" role="alert">
                      {signInError}
                    </p>
                  ) : null}

                  <Button type="submit" size="lg" className="mt-2 w-full">
                    Sign in
                    <ArrowRight />
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Template mode — credentials are pre-filled and no account is required.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 flex items-center justify-center gap-1.5 py-4 text-xs text-white/60">
        <LogIn className="size-3.5" />
        <span>UCL Portal · basic template</span>
      </footer>

      {/* Value before commitment: Mr. Damith helps visitors before they sign in */}
      <AssistantWidget />
    </div>
  );
}
