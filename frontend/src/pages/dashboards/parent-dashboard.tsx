import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  MapPin,
  Megaphone,
  TrendingUp,
  Wallet,
  Clock,
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
  { icon: TrendingUp, label: 'Current average', value: '72%', hint: '+4% vs last term' },
  { icon: CheckCircle2, label: 'Attendance', value: '88%', hint: 'Attendance target 85%+' },
  {
    icon: CalendarDays,
    label: 'Absences this term',
    value: '6',
    hint: '2 excused · 4 unauthorised',
  },
  { icon: Wallet, label: 'Fees outstanding', value: 'Rs 145,000', hint: 'Next bill due 30 Sep' },
];

interface DemoGrade {
  module: string;
  grade: string;
  feedback: string;
  date: string;
  tone: 'ok' | 'warn' | 'bad';
}

const DEMO_GRADES: DemoGrade[] = [
  {
    module: 'Software Engineering Fundamentals',
    grade: 'B+',
    feedback: 'Strong sprint delivery',
    date: 'Last week',
    tone: 'ok',
  },
  {
    module: 'Database Systems',
    grade: 'C',
    feedback: 'ERD practice needed',
    date: '2 weeks ago',
    tone: 'warn',
  },
  {
    module: 'Data Structures & Algorithms',
    grade: 'B-',
    feedback: 'Good but revisit AVL trees',
    date: '3 weeks ago',
    tone: 'ok',
  },
];

interface DemoThing {
  time: string;
  title: string;
  detail: string;
  kind: 'class' | 'exam' | 'activity';
}

const DEMO_TIMETABLE: DemoThing[] = [
  {
    time: '08:30',
    title: 'Software Engineering Fundamentals',
    detail: 'CSE 101 · Lecture',
    kind: 'class',
  },
  { time: '10:15', title: 'Database Systems', detail: 'CSE 203 · Lab', kind: 'class' },
  {
    time: '13:30',
    title: 'Data Structures & Algorithms',
    detail: 'CSE 305 · Tutorial',
    kind: 'class',
  },
  {
    time: '16:00',
    title: 'CS Society meeting',
    detail: 'Student Centre · Room 2',
    kind: 'activity',
  },
];

interface DemoFee {
  title: string;
  amount: string;
  due: string;
  status: 'paid' | 'due';
}

const DEMO_FEES: DemoFee[] = [
  {
    title: 'Semester 2 tuition · Instalment 2',
    amount: 'Rs 145,000',
    due: 'Due 30 Sep',
    status: 'due',
  },
  {
    title: 'Semester 2 tuition · Instalment 1',
    amount: 'Rs 145,000',
    due: 'Paid 15 Jul',
    status: 'paid',
  },
  {
    title: 'Accommodation · Halls of residence',
    amount: 'Rs 60,000',
    due: 'Paid 01 Aug',
    status: 'paid',
  },
];

const KIND_BADGE: Record<DemoThing['kind'], string> = {
  class: 'bg-primary/10 text-primary',
  exam: 'bg-destructive/10 text-destructive',
  activity: 'bg-chart-5/10 text-chart-5',
};

const GRADE_TONE: Record<DemoGrade['tone'], string> = {
  ok: 'bg-success/10 text-success',
  warn: 'bg-warning/10 text-warning',
  bad: 'bg-destructive/10 text-destructive',
};

export function ParentDashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Greeting */}
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Good morning, Kamala 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}{' '}
          · Ward: Nimal Perera · Year 4, BSc Computer Science
        </p>
      </div>

      {/* Ward stats */}
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
              Parent portal
            </Badge>
            <p className="font-heading text-base font-medium">
              Track your ward&apos;s academic progress, attendance and fees in one place.
            </p>
          </div>
        </div>
      </Card>

      {/* Timetable + grades */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="size-4 text-primary" />
              Ward&apos;s day
            </CardTitle>
            <CardDescription>Nimal&apos;s scheduled activities today.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {DEMO_TIMETABLE.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/50"
              >
                <span className="flex w-14 shrink-0 items-center gap-1 text-sm font-semibold text-foreground">
                  <Clock className="size-3.5 text-muted-foreground" />
                  {item.time}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                  <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <MapPin className="size-3" />
                    {item.detail}
                  </p>
                </div>
                <Badge className={cn('shrink-0', KIND_BADGE[item.kind])}>{item.kind}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="size-4 text-primary" />
                Recent results
              </CardTitle>
              <CardDescription>Latest assessed work.</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View all
              <ArrowUpRight />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {DEMO_GRADES.map((entry) => (
              <div
                key={entry.module}
                className="flex items-center gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/50"
              >
                <span
                  className={cn(
                    'flex h-10 w-11 shrink-0 items-center justify-center rounded-lg text-sm font-semibold',
                    GRADE_TONE[entry.tone],
                  )}
                >
                  {entry.grade}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{entry.module}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {entry.feedback} · {entry.date}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Fees + messages */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle className="flex items-center gap-2">
                <Wallet className="size-4 text-primary" />
                Fees &amp; payments
              </CardTitle>
              <CardDescription>Billing and instalments for your ward.</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Pay now
              <ArrowUpRight />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {DEMO_FEES.map((fee) => (
              <div
                key={fee.title}
                className="flex items-center gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/50"
              >
                <Wallet className="mt-0.5 size-4 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{fee.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{fee.due}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-0.5">
                  <span className="text-sm font-semibold text-foreground">{fee.amount}</span>
                  <Badge
                    className={
                      fee.status === 'paid'
                        ? 'bg-success/10 text-success'
                        : 'bg-destructive/10 text-destructive'
                    }
                  >
                    {fee.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="size-4 text-primary" />
              University updates
            </CardTitle>
            <CardDescription>Messages relevant to parents.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {[
              {
                tag: 'Wellbeing',
                title: 'Campus wellbeing week – support sessions available',
                date: 'Today',
              },
              { tag: 'Academic', title: 'Supplementary exam results released', date: 'Yesterday' },
              {
                tag: 'Finance',
                title: 'Semester 2 fee instalment reminder sent to guardians',
                date: '3 days ago',
              },
            ].map((update) => (
              <div
                key={update.title}
                className="flex items-start gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/50"
              >
                <BookOpen className="mt-0.5 size-4 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="h-5 text-[10px]">
                      {update.tag}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{update.date}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-foreground">{update.title}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
