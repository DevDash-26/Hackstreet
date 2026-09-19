import { useState } from 'react';
import type { ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  HeartHandshake,
  KeyRound,
  MapPin,
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
    name: 'Kamala Perera',
    email: 'kamala.p@email.lk',
    password: 'demo1234',
  },
];

export function LoginPage() {
  const navigate = useNavigate();
  const signInAs = useDemoSession((s) => s.signInAs);
  const [selectedRole, setSelectedRole] = useState<DemoRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const pickRole = (role: DemoRole) => {
    setSelectedRole(role);
    setEmail(role.email);
    setPassword(role.password);
  };

  const handleSignIn = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedRole === null) return;
    // Template mode: store the demo persona so the portal renders the right
    // role-aware dashboard. Swap for supabase.auth.signInWithPassword later.
    void password;
    void email;
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
      {/* Lakeside cue: cool mist along the Diyawanna Lake horizon */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-44 bg-gradient-to-t from-sky-200/10 to-transparent"
      />
      {/* Fine grain line to seat the interface on the photograph */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-14 z-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      <header className="relative z-10 flex h-14 items-center justify-between px-4 sm:px-6">
        <Brand title="UCL Portal" subtitle="" className="[&_span]:text-white" />
        <div className="[&_button]:text-white [&_button:hover]:bg-white/10">
          <ThemeToggle />
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-border/60 bg-card/95 shadow-xl backdrop-blur-md">
          <div className="grid md:grid-cols-[1fr_1.2fr]">
            {/* Left: UCL info */}
            <div className="flex flex-col justify-center gap-4 bg-gradient-to-br from-primary via-primary/90 to-primary/75 p-6 text-primary-foreground md:p-7">
              <Crest className="size-10 rounded-lg bg-card/10 p-1" />
              <div className="flex flex-col gap-2">
                <h1 className="font-heading text-xl leading-tight font-semibold">
                  One portal for all of university life
                </h1>
                <p className="text-xs text-primary-foreground/85">
                  Timetables, grades, bookings, societies and support services — in one place.
                </p>
              </div>
              <ul className="flex flex-col gap-1.5 text-xs text-primary-foreground/85">
                <li className="flex items-center gap-2">
                  <Sparkles className="size-3.5" /> Live timetable &amp; grades
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="size-3.5" /> Campus bookings &amp; facilities
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="size-3.5" /> Societies, events &amp; wellbeing
                </li>
              </ul>
            </div>

            {/* Right: sign-in options */}
            <div className="p-5 sm:p-6">
              {selectedRole === null ? (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-0.5">
                    <h2 className="font-heading text-lg font-semibold text-foreground">
                      Sign in as
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Pick a role — demo credentials are pre-filled.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    {DEMO_ROLES.map((role) => {
                      const Icon = role.icon;
                      return (
                        <button
                          key={role.id}
                          onClick={() => pickRole(role)}
                          className="group flex items-center gap-3 rounded-lg border border-border/70 px-3 py-2.5 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
                        >
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                            <Icon className="size-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium text-foreground">
                              {role.label}
                            </span>
                            <span className="block text-xs text-muted-foreground">
                              {role.tagline}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                    <KeyRound className="size-3.5 text-primary" />
                    Password{' '}
                    <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
                      demo1234
                    </code>
                  </p>
                </div>
              ) : (
                <form className="flex flex-col gap-3.5" onSubmit={handleSignIn}>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary" className="w-fit">
                        {selectedRole.label}
                      </Badge>
                      <button
                        type="button"
                        onClick={() => setSelectedRole(null)}
                        className="text-xs font-medium text-muted-foreground underline-offset-3 hover:text-foreground hover:underline"
                      >
                        Switch
                      </button>
                    </div>
                    <h2 className="font-heading text-lg font-semibold text-foreground">
                      Sign in to {selectedRole.label} portal
                    </h2>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <UserRound className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        autoComplete="username"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="pl-8"
                        placeholder="you@ucl.ac.lk"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <KeyRound className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type="text"
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="mt-1 w-full">
                    Sign in
                    <ArrowRight />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 flex items-center justify-center gap-1.5 py-4 text-xs text-white/60">
        <MapPin className="size-3.5" />
        <span>UCL Lakeside Campus · Rajagiriya, Sri Lanka</span>
      </footer>

      {/* Value before commitment: Mr. Damith helps visitors before they sign in */}
      <AssistantWidget />
    </div>
  );
}
