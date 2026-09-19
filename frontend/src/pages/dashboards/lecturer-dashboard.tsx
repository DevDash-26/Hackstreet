import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  MapPin,
  Megaphone,
  NotebookPen,
  Timer,
  UsersRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DemoStat {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
}

const DEMO_STATS: DemoStat[] = [
  { icon: BookOpen, label: 'Modules this term', value: '3', hint: '24 teaching weeks' },
  { icon: UsersRound, label: 'Total students', value: '148', hint: 'Across all modules' },
  { icon: ClipboardList, label: 'Awaiting marking', value: '23', hint: '4 submissions overdue' },
  { icon: CalendarDays, label: 'Office hours', value: 'Wed 2–4pm', hint: 'Room CSE 340' },
];

interface DemoClass {
  icon: LucideIcon;
  start: string;
  end: string;
  module: string;
  room: string;
  level: string;
  students: number;
  pending: number;
}

const DEMO_TODAY: DemoClass[] = [
  {
    icon: BookOpen,
    start: '09:00',
    end: '11:00',
    module: 'Software Engineering Fundamentals',
    room: 'CSE 101',
    level: 'Year 3',
    students: 52,
    pending: 8,
  },
  {
    icon: NotebookPen,
    start: '11:15',
    end: '12:45',
    module: 'Database Systems Lab',
    room: 'Lab 4',
    level: 'Year 2',
    students: 44,
    pending: 5,
  },
  {
    icon: GraduationCap,
    start: '14:00',
    end: '15:30',
    module: 'Dissertation Supervision',
    room: 'CSE 340',
    level: 'Year 4',
    students: 6,
    pending: 0,
  },
];

interface DemoGrading {
  title: string;
  module: string;
  due: string;
  received: number;
  graded: number;
}

const DEMO_GRADING: DemoGrading[] = [
  {
    title: 'Assignment 2 – Sprint review',
    module: 'CSE2201',
    due: 'Today, 18:00',
    received: 48,
    graded: 32,
  },
  {
    title: 'ERD & normalization worksheet',
    module: 'CSE2202',
    due: 'Fri, 22 Sep',
    received: 52,
    graded: 41,
  },
  {
    title: 'AVL tree implementation',
    module: 'CSE2203',
    due: 'Mon, 25 Sep',
    received: 38,
    graded: 12,
  },
];

interface DemoModule {
  code: string;
  title: string;
  students: number;
  progress: number;
  next: string;
  color: 'blue' | 'emerald' | 'amber';
}

const DEMO_MODULES: DemoModule[] = [
  {
    code: 'CSE2201',
    title: 'Software Engineering Fundamentals',
    students: 52,
    progress: 68,
    next: 'Week 9 · retrospective',
    color: 'blue',
  },
  {
    code: 'CSE2202',
    title: 'Database Systems',
    students: 48,
    progress: 54,
    next: 'Lab report due Fri',
    color: 'emerald',
  },
  {
    code: 'CSE2203',
    title: 'Data Structures & Algorithms',
    students: 44,
    progress: 41,
    next: 'Quiz next week',
    color: 'amber',
  },
];

interface DemoNote {
  tag: string;
  title: string;
  date: string;
}

const DEMO_NOTES: DemoNote[] = [
  {
    tag: 'Academic',
    title: 'Supplementary exam results released – 12 students to review',
    date: 'Yesterday',
  },
  { tag: 'Faculty', title: 'Module review board – submit feedback by Friday', date: '2 days ago' },
  { tag: 'Campus', title: 'Guest lecture: AI ethics – Dr. Perera (zoom)', date: '3 days ago' },
];

const MODULE_BAR: Record<DemoModule['color'], string> = {
  blue: 'bg-primary',
  emerald: 'bg-chart-2',
  amber: 'bg-chart-3',
};

export function LecturerDashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Greeting */}
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Good morning, Dr. Sanjaya 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}{' '}
          · Teaching week 9, Semester 2 2026
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {DEMO_STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-start gap-3 p-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xl font-semibold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                  <p className="truncate text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="truncate text-xs text-muted-foreground/70">{stat.hint}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick actions hero */}
      <Card className="gap-0 overflow-hidden">
        <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-5 text-primary-foreground">
          <div className="flex flex-col gap-1.5">
            <Badge className="w-fit bg-white/15 text-primary-foreground hover:bg-white/15">
              Teaching panel
            </Badge>
            <p className="font-heading text-base font-medium">
              Manage lectures, grading and student consultations for this term.
            </p>
          </div>
        </div>
      </Card>

      {/* Today's teaching + grading */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="size-4 text-primary" />
              Today&apos;s teaching
            </CardTitle>
            <CardDescription>Your classes on campus today.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {DEMO_TODAY.map((session) => {
              const Icon = session.icon;
              return (
                <div
                  key={session.module}
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
                    <p className="truncate text-sm font-medium text-foreground">{session.module}</p>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="size-3" />
                      <span className="truncate">
                        {session.room} · {session.level} · {session.students} students
                      </span>
                    </p>
                  </div>
                  {session.pending > 0 && (
                    <Badge variant="secondary" className="shrink-0">
                      {session.pending} ungraded
                    </Badge>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="size-4 text-primary" />
              Grading queue
            </CardTitle>
            <CardDescription>Submissions waiting for marks.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {DEMO_GRADING.map((item) => {
              const fraction = item.received === 0 ? 100 : (item.graded / item.received) * 100;
              return (
                <div
                  key={item.title}
                  className="rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">{item.due}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {item.module}
                    </Badge>
                    <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${fraction}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {item.graded}/{item.received}
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Modules + notes */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="size-4 text-primary" />
                My modules
              </CardTitle>
              <CardDescription>Progress through the teaching calendar.</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View all
              <ArrowUpRight />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {DEMO_MODULES.map((module) => (
              <div key={module.code} className="rounded-lg border border-border/60 p-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {module.code}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {module.students} students · {module.progress}%
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm font-medium text-foreground">
                  {module.title}
                </p>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn('h-full rounded-full', MODULE_BAR[module.color])}
                    style={{ width: `${module.progress}%` }}
                  />
                </div>
                <p className="mt-2.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                  <Timer className="size-3.5 shrink-0 text-primary" />
                  {module.next}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="size-4 text-primary" />
              Faculty announcements
            </CardTitle>
            <CardDescription>Latest updates relevant to your teaching.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {DEMO_NOTES.map((note) => (
              <div
                key={note.title}
                className="flex items-start gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/50"
              >
                <Megaphone className="mt-0.5 size-4 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="h-5 text-[10px]">
                      {note.tag}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{note.date}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-foreground">{note.title}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
