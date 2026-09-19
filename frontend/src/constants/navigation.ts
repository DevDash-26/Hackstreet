import type { LucideIcon } from 'lucide-react';
import {
  Award,
  Banknote,
  BookCopy,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  CalendarRange,
  CalendarX,
  CircleHelp,
  ClipboardList,
  Contact,
  Dumbbell,
  GraduationCap,
  HeartPulse,
  HandHeart,
  LayoutDashboard,
  Library,
  LifeBuoy,
  Megaphone,
  MessageSquarePlus,
  MessagesSquare,
  MonitorPlay,
  Newspaper,
  PackageSearch,
  PartyPopper,
  Presentation,
  Printer,
  Rocket,
  Settings,
  Siren,
  TrendingUp,
  UserCog,
  UserRound,
  Users,
  Utensils,
  Wallet,
  Wifi,
  Wrench,
} from 'lucide-react';
import type { RoleKey } from 'shared';
import { RoleKeys } from 'shared';

export interface PortalNavItem {
  /** Display label in the sidebar/mobile nav. */
  title: string;
  /** Absolute in-app href (`/portal/...`). */
  href: string;
  /** Lucide icon for the nav item. */
  icon: LucideIcon;
  /** Optional count shown as a trailing badge. */
  badge?: number;
}

/** A labelled group of navigation items (mirrors the mockup's sidebar sections). */
export interface PortalNavGroup {
  label: string;
  items: PortalNavItem[];
}

/** Return the first nav item of each group (used by the mobile bottom bar). */
export function topLevelNavItems(nav: PortalNavGroup[]): PortalNavItem[] {
  return nav.flatMap((group) => group.items.slice(0, 1));
}

/**
 * Role-aware sidebar navigation.
 *
 * NOTE: the mockup defines a `lecturer` persona; `staff_academic` maps to it.
 * `staff_society` is reserved for future society admin staff. `admin` and
 * `parent` map directly to the mockup's administrator and parent personas.
 */
export const NAV_BY_ROLE: Record<RoleKey, PortalNavGroup[]> = {
  [RoleKeys.STUDENT]: [
    {
      label: 'Overview',
      items: [
        { title: 'Home', href: '/portal', icon: LayoutDashboard },
        { title: 'Schedule', href: '/portal/schedule', icon: CalendarDays },
        { title: 'Courses', href: '/portal/courses', icon: BookOpen },
        { title: 'Assignments & Grades', href: '/portal/assignments', icon: ClipboardList },
        { title: 'Recordings', href: '/portal/recordings', icon: MonitorPlay },
        { title: 'Academic Calendar', href: '/portal/academic-calendar', icon: CalendarRange },
        { title: 'Announcements', href: '/portal/announcements', icon: Megaphone },
      ],
    },
    {
      label: 'Campus Services',
      items: [
        { title: 'Campus Bookings', href: '/portal/bookings', icon: Building2 },
        { title: 'Dining & Food', href: '/portal/dining', icon: Utensils },
        { title: 'Sports & Fitness', href: '/portal/sports', icon: Dumbbell },
        { title: 'Library', href: '/portal/library', icon: Library },
        { title: 'Printing & Scanning', href: '/portal/printing', icon: Printer },
        { title: 'Lost & Found', href: '/portal/lost-found', icon: PackageSearch },
        { title: 'IT & Tech Support', href: '/portal/it-support', icon: Wifi },
        { title: 'Facilities & Maintenance', href: '/portal/facilities', icon: Wrench },
        { title: 'Staff Directory', href: '/portal/staff-directory', icon: Contact },
        { title: 'Textbook Exchange', href: '/portal/textbooks', icon: BookCopy },
      ],
    },
    {
      label: 'Student Life',
      items: [
        { title: 'Clubs & Societies', href: '/portal/societies', icon: Users },
        { title: 'Events', href: '/portal/events', icon: PartyPopper },
        { title: 'Guest Lectures', href: '/portal/guest-lectures', icon: Presentation },
        { title: 'Wellbeing & Care', href: '/portal/wellbeing', icon: HeartPulse },
        { title: 'Volunteering', href: '/portal/volunteering', icon: HandHeart },
        { title: 'Jobs & Internships', href: '/portal/jobs', icon: Briefcase },
        { title: 'Alumni & Giving', href: '/portal/alumni', icon: GraduationCap },
        { title: 'Student Highlights', href: '/portal/highlights', icon: Newspaper },
      ],
    },
    {
      label: 'Support',
      items: [
        { title: 'Academic Support', href: '/portal/academic-support', icon: LifeBuoy },
        { title: 'Financial Support', href: '/portal/financial-support', icon: Award },
        { title: 'Emergency & Safety', href: '/portal/emergency', icon: Siren },
        { title: 'FAQ', href: '/portal/faq', icon: MessagesSquare },
        { title: 'Feedback', href: '/portal/feedback', icon: MessageSquarePlus },
        { title: 'Schedule Changes', href: '/portal/schedule-changes', icon: CalendarX },
        { title: 'New Student Guide', href: '/portal/onboarding', icon: Rocket },
      ],
    },
    {
      label: 'Account',
      items: [
        { title: 'Profile', href: '/portal/profile', icon: UserRound },
        { title: 'Settings', href: '/portal/settings', icon: Settings },
        { title: 'Help & Support', href: '/portal/help', icon: CircleHelp },
      ],
    },
  ],
  [RoleKeys.STAFF_ACADEMIC]: [
    {
      label: 'Overview',
      items: [
        { title: 'Home', href: '/portal', icon: LayoutDashboard },
        { title: 'Schedule', href: '/portal/schedule', icon: CalendarDays },
        { title: 'My Courses', href: '/portal/courses', icon: BookOpen },
        { title: 'Assessments', href: '/portal/assignments', icon: ClipboardList },
        { title: 'Academic Calendar', href: '/portal/academic-calendar', icon: CalendarRange },
        { title: 'Announcements', href: '/portal/announcements', icon: Megaphone },
      ],
    },
    {
      label: 'Campus Services',
      items: [
        { title: 'Campus Bookings', href: '/portal/bookings', icon: Building2 },
        { title: 'Dining & Food', href: '/portal/dining', icon: Utensils },
        { title: 'Sports & Fitness', href: '/portal/sports', icon: Dumbbell },
        { title: 'Printing & Scanning', href: '/portal/printing', icon: Printer },
        { title: 'IT & Tech Support', href: '/portal/it-support', icon: Wifi },
        { title: 'Staff Directory', href: '/portal/staff-directory', icon: Contact },
      ],
    },
    {
      label: 'Support',
      items: [
        { title: 'Academic Support', href: '/portal/academic-support', icon: LifeBuoy },
        { title: 'FAQ', href: '/portal/faq', icon: MessagesSquare },
        { title: 'Emergency & Safety', href: '/portal/emergency', icon: Siren },
        { title: 'Feedback', href: '/portal/feedback', icon: MessageSquarePlus },
      ],
    },
    {
      label: 'Account',
      items: [
        { title: 'Profile', href: '/portal/profile', icon: UserRound },
        { title: 'Settings', href: '/portal/settings', icon: Settings },
        { title: 'Help & Support', href: '/portal/help', icon: CircleHelp },
      ],
    },
  ],
  [RoleKeys.STAFF_SOCIETY]: [
    {
      label: 'Overview',
      items: [
        { title: 'Home', href: '/portal', icon: LayoutDashboard },
        { title: 'My Societies', href: '/portal/societies', icon: Users },
        { title: 'Events', href: '/portal/events', icon: PartyPopper },
        { title: 'Announcements', href: '/portal/announcements', icon: Megaphone },
        { title: 'Student Highlights', href: '/portal/highlights', icon: Newspaper },
      ],
    },
    {
      label: 'Campus Services',
      items: [
        { title: 'Campus Bookings', href: '/portal/bookings', icon: Building2 },
        { title: 'Dining & Food', href: '/portal/dining', icon: Utensils },
        { title: 'IT & Tech Support', href: '/portal/it-support', icon: Wifi },
        { title: 'Staff Directory', href: '/portal/staff-directory', icon: Contact },
      ],
    },
    {
      label: 'Support',
      items: [
        { title: 'FAQ', href: '/portal/faq', icon: MessagesSquare },
        { title: 'Emergency & Safety', href: '/portal/emergency', icon: Siren },
        { title: 'Feedback', href: '/portal/feedback', icon: MessageSquarePlus },
      ],
    },
    {
      label: 'Account',
      items: [
        { title: 'Profile', href: '/portal/profile', icon: UserRound },
        { title: 'Settings', href: '/portal/settings', icon: Settings },
        { title: 'Help & Support', href: '/portal/help', icon: CircleHelp },
      ],
    },
  ],
  [RoleKeys.ADMIN]: [
    {
      label: 'Overview',
      items: [
        { title: 'Home', href: '/portal', icon: LayoutDashboard },
        { title: 'Finance Analytics', href: '/portal/finance', icon: Banknote },
        { title: 'Announcements', href: '/portal/announcements', icon: Megaphone },
        { title: 'User Management', href: '/portal/users', icon: UserCog },
        { title: 'Emergency & Safety', href: '/portal/emergency', icon: Siren },
        { title: 'Academic Calendar', href: '/portal/academic-calendar', icon: CalendarRange },
      ],
    },
    {
      label: 'Campus Services',
      items: [
        { title: 'Campus Bookings', href: '/portal/bookings', icon: Building2 },
        { title: 'Facilities & Maintenance', href: '/portal/facilities', icon: Wrench },
        { title: 'Lost & Found', href: '/portal/lost-found', icon: PackageSearch },
        { title: 'Dining & Food', href: '/portal/dining', icon: Utensils },
        { title: 'IT & Tech Support', href: '/portal/it-support', icon: Wifi },
        { title: 'Staff Directory', href: '/portal/staff-directory', icon: Contact },
      ],
    },
    {
      label: 'Support',
      items: [
        { title: 'FAQ', href: '/portal/faq', icon: MessagesSquare },
        { title: 'Feedback', href: '/portal/feedback', icon: MessageSquarePlus },
      ],
    },
    {
      label: 'Account',
      items: [
        { title: 'Profile', href: '/portal/profile', icon: UserRound },
        { title: 'Settings', href: '/portal/settings', icon: Settings },
        { title: 'Help & Support', href: '/portal/help', icon: CircleHelp },
      ],
    },
  ],
  [RoleKeys.PARENT]: [
    {
      label: 'Overview',
      items: [
        { title: 'Home', href: '/portal', icon: LayoutDashboard },
        { title: 'Ward Progress', href: '/portal/progress', icon: TrendingUp },
        { title: 'Fees & Payments', href: '/portal/fees', icon: Wallet },
        { title: 'Academic Calendar', href: '/portal/academic-calendar', icon: CalendarRange },
        { title: 'Announcements', href: '/portal/announcements', icon: Megaphone },
      ],
    },
    {
      label: 'Student Life',
      items: [
        { title: 'Timetable', href: '/portal/timetable', icon: CalendarDays },
        { title: 'Grades & Reports', href: '/portal/grades', icon: ClipboardList },
        { title: 'Events', href: '/portal/events', icon: PartyPopper },
        { title: 'Financial Support', href: '/portal/financial-support', icon: Award },
      ],
    },
    {
      label: 'Support',
      items: [
        { title: 'FAQ', href: '/portal/faq', icon: MessagesSquare },
        { title: 'Emergency & Safety', href: '/portal/emergency', icon: Siren },
        { title: 'Staff Directory', href: '/portal/staff-directory', icon: Contact },
      ],
    },
    {
      label: 'Account',
      items: [
        { title: 'Profile', href: '/portal/profile', icon: UserRound },
        { title: 'Settings', href: '/portal/settings', icon: Settings },
        { title: 'Help & Support', href: '/portal/help', icon: CircleHelp },
      ],
    },
  ],
};

/** Convenience accessor used by the layout components. */
export function getNavForRole(role: RoleKey | null): PortalNavGroup[] {
  return role !== null && NAV_BY_ROLE[role] !== undefined
    ? NAV_BY_ROLE[role]
    : NAV_BY_ROLE[RoleKeys.STUDENT];
}
