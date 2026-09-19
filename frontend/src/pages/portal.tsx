import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock,
  MapPin,
  Target,
  Building2,
  FileText,
  BellRing,
  CircleAlert,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { SetupChecklist } from '@/features/onboarding/setup-checklist';
import { cn } from '@/lib/utils';

/* --------------------------------------------------------------------------
 * Demo data — replace with real API/data sources once the backend is wired.
 * ------------------------------------------------------------------------ */

interface DemoAction {
  icon: LucideIcon;
  tone: 'ok' | 'warn' | 'bad';
  title: string;
  value: string;
  hint: string;
}

const DEMO_ACTIONS: DemoAction[] = [
  {
    icon: ClipboardList,
    tone: 'ok',
    title: 'Software Engineering',
    value: 'Assignment 2 due Today',
    hint: '17:55pm · Submit now',
  },
  {
    icon: Clock,
    tone: 'warn',
    title: 'Registration',
    value: 'Finalize semester modules',
    hint: 'Closes in 2 days',
  },
  {
    icon: Target,
    tone: 'bad',
    title: 'Fitness Centre',
    value: 'Book gym slot',
    hint: 'All evening slots booked',
  },
];

interface DemoClass {
  icon: LucideIcon;
  start: string;
  end: string;
  course: string;
  room: string;
  kind: 'Lecture' | 'Lab' | 'Tutorial';
  attending: boolean;
}

const DEMO_TODAY: DemoClass[] = [
  {
    icon: BookOpen,
    start: '08:30',
    end: '10:00',
    course: 'Software Engineering Fundamentals',
    room: 'CSE 101',
    kind: 'Lecture',
    attending: true,
  },
  {
    icon: Building2,
    start: '10:15',
    end: '12:00',
    course: 'Database Systems',
    room: 'CSE 203',
    kind: 'Lab',
    attending: true,
  },
  {
    icon: ClipboardList,
    start: '13:30',
    end: '15:00',
    course: 'Data Structures & Algorithms',
    room: 'CSE 305',
    kind: 'Tutorial',
    attending: true,
  },
];

interface DemoDeadline {
  label: string;
  title: string;
  date: string;
  left: string;
  tone: 'ok' | 'warn' | 'bad';
}

const DEMO_DEADLINES: DemoDeadline[] = [
  {
    label: 'Software Eng.',
    title: 'Assignment 2 - Sprint review',
    date: 'Due today, 17:55',
    left: 'Today',
    tone: 'bad',
  },
  {
    label: 'Database Systems',
    title: 'ERD + normalization worksheet',
    date: 'Fri, 22 Sep · 23:59',
    left: '3 days',
    tone: 'warn',
  },
  {
    label: 'Data Structures',
    title: 'AVL tree implementation',
    date: 'Mon, 25 Sep · 09:00',
    left: '6 days',
    tone: 'warn',
  },
];

interface DemoCourse {
  code: string;
  title: string;
  progress: number;
  next: string;
  color: 'blue' | 'emerald' | 'amber';
}

const DEMO_COURSES: DemoCourse[] = [
  {
    code: 'CSE2201',
    title: 'Software Engineering Fundamentals',
    progress: 68,
    next: 'Assignment 2 due today',
    color: 'blue',
  },
  {
    code: 'CSE2202',
    title: 'Database Systems',
    progress: 54,
    next: 'Lab report due Fri',
    color: 'emerald',
  },
  {
    code: 'CSE2203',
    title: 'Data Structures & Algorithms',
    progress: 41,
    next: 'Quiz next week',
    color: 'amber',
  },
];

const COURSE_BAR: Record<DemoCourse['color'], string> = {
  blue: 'bg-primary',
  emerald: 'bg-chart-2',
  amber: 'bg-chart-3',
};

interface DemoAnnouncement {
  tag: string;
  title: string;
  date: string;
}

const DEMO_ANNOUNCEMENTS: DemoAnnouncement[] = [
  { tag: 'Academic', title: 'Supplementary exam results released', date: 'Yesterday' },
  { tag: 'Campus', title: 'Guest lecture: AI ethics - Dr. Perera (zoom)', date: '2 days ago' },
  { tag: 'Societies', title: 'CS Society hackathon - registrations open', date: '3 days ago' },
];

const TONE_BADGE: Record<DemoAction['tone'], string> = {
  ok: 'bg-success/10 text-success',
  warn: 'bg-warning/10 text-warning',
  bad: 'bg-destructive/10 text-destructive',
};

const DEADLINE_TONE: Record<DemoDeadline['tone'], string> = {
  ok: 'bg-success text-success-foreground',
  warn: 'bg-warning text-warning-foreground',
  bad: 'bg-destructive text-destructive-foreground',
};

const KIND_BADGE: Record<DemoClass['kind'], string> = {
  Lecture: 'bg-primary/10 text-primary',
  Lab: 'bg-chart-5/10 text-chart-5',
  Tutorial: 'bg-info/10 text-info',
};

/* -------------------------------------------------------------------------- */

export function PortalPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Greeting */}
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Good morning, Nimal 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}{' '}
          · Semester 2, 2026
        </p>
      </div>

      {/* Quick actions hero */}
      <Card className="gap-0 overflow-hidden">
        <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-5 text-primary-foreground">
          <div className="flex flex-col gap-1.5">
            <Badge className="w-fit bg-white/15 text-primary-foreground hover:bg-white/15">
              Welcome back
            </Badge>
            <p className="font-heading text-base font-medium">
              You&rsquo;re in your second year - keep an eye on your deadlines and lecture schedule
              below.
            </p>
          </div>
        </div>
      </Card>

      {/* Getting-started checklist — progress starts above zero (goal gradient) */}
      {/* <SetupChecklist /> */}

      {/* Two-column: action required + today */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="size-4 text-primary" />
              Action required
            </CardTitle>
            <CardDescription>Things that need your attention today.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {DEMO_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <div
                  key={action.title}
                  className="flex items-center gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/50"
                >
                  <span
                    className={cn(
                      'flex size-9 shrink-0 items-center justify-center rounded-lg',
                      TONE_BADGE[action.tone],
                    )}
                  >
                    <Icon className="size-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{action.title}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="truncate">{action.value}</span>
                      <span className="text-border">·</span>
                      <span className="shrink-0">{action.hint}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon-sm" aria-label={`Open ${action.title}`}>
                    <ArrowUpRight />
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="size-4 text-primary" />
              Today's classes
            </CardTitle>
            <CardDescription>What&apos;s on campus today.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {DEMO_TODAY.map((session) => {
              const Icon = session.icon;
              return (
                <div
                  key={session.course}
                  className="flex items-center gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex w-11 shrink-0 flex-col items-center">
                    <span className="text-sm font-semibold text-foreground">{session.start}</span>
                    <span className="text-[10px] text-muted-foreground">{session.end}</span>
                  </div>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="size-4 text-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{session.course}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3" />
                      {session.room}
                    </p>
                  </div>
                  <Badge className={cn('shrink-0', KIND_BADGE[session.kind])}>{session.kind}</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming deadlines + announcements */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              Upcoming deadlines
            </CardTitle>
            <CardDescription>Assignments, quizzes and submissions.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {DEMO_DEADLINES.map((deadline) => (
              <div
                key={deadline.title}
                className="flex items-center gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/50"
              >
                <span
                  className={cn(
                    'flex h-10 w-11 shrink-0 flex-col items-center justify-center rounded-lg text-[10px] font-medium',
                    DEADLINE_TONE[deadline.tone],
                  )}
                >
                  <span>{deadline.left}</span>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{deadline.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {deadline.label} · {deadline.date}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="size-4 text-primary" />
              Announcements
            </CardTitle>
            <CardDescription>Latest from the university.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {DEMO_ANNOUNCEMENTS.map((announcement) => (
              <div
                key={announcement.title}
                className="flex items-start gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/50"
              >
                <CircleAlert className="mt-0.5 size-4 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="h-5 text-[10px]">
                      {announcement.tag}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{announcement.date}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-foreground">{announcement.title}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Courses in progress */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-4 text-primary" />
              My courses
            </CardTitle>
            <CardDescription>Current semester progress.</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View all
            <ArrowUpRight />
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {DEMO_COURSES.map((course) => (
            <div key={course.code} className="rounded-lg border border-border/60 p-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono text-[10px]">
                  {course.code}
                </Badge>
                <span className="text-xs text-muted-foreground">{course.progress}%</span>
              </div>
              <p className="mt-2.5 line-clamp-2 text-sm font-medium text-foreground">
                {course.title}
              </p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn('h-full rounded-full', COURSE_BAR[course.color])}
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              <p className="mt-2.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                <CheckCircle2 className="size-3.5 shrink-0 text-success" />
                {course.next}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
