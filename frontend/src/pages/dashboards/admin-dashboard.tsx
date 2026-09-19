import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Building2,
  ClipboardCheck,
  MapPin,
  Megaphone,
  TriangleAlert,
  UserCog,
  Users,
  Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface DemoStat {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
}

const DEMO_STATS: DemoStat[] = [
  { icon: Users, label: 'Active students', value: '4,281', hint: '+38 this week' },
  { icon: UserCog, label: 'Staff accounts', value: '486', hint: '12 pending approval' },
  { icon: Building2, label: 'Bookings today', value: '217', hint: '94% seat utilisation' },
  { icon: Wrench, label: 'Open facility issues', value: '23', hint: '6 escalated' },
];

interface DemoApproval {
  icon: LucideIcon;
  title: string;
  value: string;
  hint: string;
}

const DEMO_ACTIONS: DemoApproval[] = [
  {
    icon: UserCog,
    title: 'New staff account',
    value: 'Amara Fernando · Academic',
    hint: 'Awaiting role assignment',
  },
  {
    icon: Building2,
    title: 'Auditorium booking',
    value: 'CS Society · Fri 19:00',
    hint: 'Conflicts with IT hall',
  },
  {
    icon: Wrench,
    title: 'Facility report',
    value: 'Hall B projector fault',
    hint: 'Unverified · reported 2h ago',
  },
];

interface DemoIssue {
  title: string;
  location: string;
  reportedAt: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
}

const DEMO_ISSUES: DemoIssue[] = [
  {
    title: 'AC not cooling in CSE 201',
    location: 'CSE Block · Floor 2',
    reportedAt: 'Today, 09:12',
    status: 'in-progress',
    priority: 'high',
  },
  {
    title: 'Projector lamp replacement',
    location: 'Hall B',
    reportedAt: 'Today, 08:40',
    status: 'in-progress',
    priority: 'high',
  },
  {
    title: 'Loose handrail near lab 3',
    location: 'Science Wing',
    reportedAt: 'Yesterday',
    status: 'open',
    priority: 'medium',
  },
  {
    title: 'Flooded sink in cafeteria',
    location: 'Student Centre',
    reportedAt: 'Yesterday',
    status: 'open',
    priority: 'medium',
  },
  {
    title: 'Wi-Fi dropouts in library',
    location: 'Library · 2nd floor',
    reportedAt: '2 days ago',
    status: 'open',
    priority: 'low',
  },
];

interface DemoAnnouncement {
  tag: string;
  title: string;
  date: string;
  status: 'published' | 'draft';
}

const DEMO_ANNOUNCEMENTS: DemoAnnouncement[] = [
  {
    tag: 'Academic',
    title: 'Supplementary exam results released',
    date: 'Yesterday',
    status: 'published',
  },
  {
    tag: 'Campus',
    title: 'Semester break maintenance closures',
    date: '2 days ago',
    status: 'draft',
  },
  {
    tag: 'Events',
    title: 'Careers fair – hall bookings confirmed',
    date: 'Today',
    status: 'draft',
  },
];

const STATUS_BADGE: Record<DemoIssue['status'], string> = {
  open: 'bg-muted text-muted-foreground',
  'in-progress': 'bg-primary/10 text-primary',
  resolved: 'bg-success/10 text-success',
};

const PRIORITY_BADGE: Record<DemoIssue['priority'], string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-warning/10 text-warning',
  high: 'bg-destructive/10 text-destructive',
};

export function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Greeting */}
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Good morning, Priyanka 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}{' '}
          · Platform administration · Semester 2, 2026
        </p>
      </div>

      {/* Platform stats */}
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
              Admin panel
            </Badge>
            <p className="font-heading text-base font-medium">
              Approve requests, manage accounts and keep campus services running.
            </p>
          </div>
        </div>
      </Card>

      {/* Approvals + issues */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="size-4 text-primary" />
              Approvals needed
            </CardTitle>
            <CardDescription>Requests waiting on your review.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {DEMO_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <div
                  key={action.title}
                  className="flex items-center gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/50"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
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
              <Activity className="size-4 text-primary" />
              Campus activity
            </CardTitle>
            <CardDescription>System health &amp; adoption at a glance.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {[
              ['Portal sign-ins today', '1,204', '12% above weekly avg'],
              ['Support tickets opened', '47', '9 awaiting reply'],
              ['Campus bookings this week', '1,089', '92% seat utilisation'],
              ['Announcements published', '18', '4 drafts in review'],
            ].map(([label, value, hint]) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/50"
              >
                <BarChart3 className="size-4 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{label}</p>
                  <p className="truncate text-xs text-muted-foreground">{hint}</p>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {value}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Facility issues + announcements */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle className="flex items-center gap-2">
                <Wrench className="size-4 text-primary" />
                Facility issues
              </CardTitle>
              <CardDescription>Latest maintenance reports.</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Manage
              <ArrowUpRight />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {DEMO_ISSUES.map((issue) => (
              <div
                key={issue.title}
                className="flex items-center gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/50"
              >
                <TriangleAlert className="mt-0.5 size-4 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{issue.title}</p>
                  <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <MapPin className="size-3 shrink-0" />
                    {issue.location} · {issue.reportedAt}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Badge className={STATUS_BADGE[issue.status]}>{issue.status}</Badge>
                  <Badge className={PRIORITY_BADGE[issue.priority]}>{issue.priority}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="size-4 text-primary" />
              Announcements
            </CardTitle>
            <CardDescription>Publish official announcements to the portal.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {DEMO_ANNOUNCEMENTS.map((announcement) => (
              <div
                key={announcement.title}
                className="flex items-start gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/50"
              >
                <Megaphone className="mt-0.5 size-4 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="h-5 text-[10px]">
                      {announcement.tag}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{announcement.date}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-foreground">{announcement.title}</p>
                </div>
                <Badge
                  className={
                    announcement.status === 'published'
                      ? 'bg-success/10 text-success'
                      : 'bg-muted text-muted-foreground'
                  }
                >
                  {announcement.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
