import type { LucideIcon } from 'lucide-react';
import {
  AtSign,
  Briefcase,
  Building2,
  FlaskConical,
  GraduationCap,
  IdCard,
  KeyRound,
  ShieldCheck,
  UsersRound,
} from 'lucide-react';
import { RoleKeys, type RoleKey } from 'shared';

export type ProfileFieldKind = 'text' | 'email' | 'tel' | 'date' | 'password' | 'textarea' | 'select' | 'locked';

export interface ProfileField {
  key: string;
  label: string;
  kind: ProfileFieldKind;
  /** Options for `select` fields. */
  options?: string[];
  placeholder?: string;
  hint?: string;
  defaultValue?: string;
  /** Password fields are editable but never persisted to the store. */
  persist?: boolean;
}

export interface ActiveSession {
  device: string;
  location: string;
  time: string;
  current?: boolean;
}

export interface ProfileSection {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  fields: ProfileField[];
  sessions?: ActiveSession[];
}

export interface RoleProfile {
  memberSince: string;
  sections: ProfileSection[];
}

const text = (key: string, label: string, defaultValue = '', placeholder?: string, hint?: string): ProfileField => ({
  key,
  label,
  kind: 'text',
  defaultValue,
  placeholder,
  hint,
});

const locked = (
  key: string,
  label: string,
  defaultValue: string,
  hint = 'Set by the registry and verified. Contact the Academic Office to change it.',
): ProfileField => ({ key, label, kind: 'locked', defaultValue, hint });

const select = (key: string, label: string, options: string[], defaultValue: string, hint?: string): ProfileField => ({
  key,
  label,
  kind: 'select',
  options,
  defaultValue,
  hint,
});

const PERSONAL_STUDENT: ProfileSection = {
  id: 'personal',
  title: 'Personal details',
  description: 'Your basic identity information on record.',
  icon: IdCard,
  fields: [
    text('fullName', 'Full name', 'Nimal Perera', 'e.g. Nimal Perera'),
    { key: 'dob', label: 'Date of birth', kind: 'date', defaultValue: '2003-04-12' },
    select('nationality', 'Nationality', ['Sri Lankan', 'Other'], 'Sri Lankan'),
    text('nic', 'National identity number', '200312400123V', 'NIC / passport number'),
    { key: 'address', label: 'Home address', kind: 'textarea', defaultValue: 'No. 24, Temple Road, Nugegoda', placeholder: 'Street, city, postcode' },
  ],
};

const CONTACT_STUDENT: ProfileSection = {
  id: 'contact',
  title: 'Contact information',
  description: 'How the university reaches you outside the portal.',
  icon: AtSign,
  fields: [
    locked('universityEmail', 'University email', 'nimal.perera@ucl.ac.lk'),
    text('alternateEmail', 'Alternative email', '', 'you@example.com', 'Used for alerts if the university address fails.'),
    { key: 'mobile', label: 'Mobile number', kind: 'tel', defaultValue: '+94 71 234 5678', placeholder: '+94 7X XXX XXXX' },
    text('emergencyName', 'Emergency contact', 'Priyanthi Perera', 'Name'),
    { key: 'emergencyPhone', label: 'Emergency contact phone', kind: 'tel', defaultValue: '+94 77 890 1234', placeholder: '+94 7X XXX XXXX' },
    text('emergencyRelation', 'Relationship', 'Mother', 'Mother / Father / Guardian'),
  ],
};

const SECURITY_COMMON: ActiveSession[] = [
  { device: 'Chrome · Windows desktop', location: 'Nugegoda, Colombo', time: 'Active now — this device', current: true },
  { device: 'Safari · iPhone 15', location: 'Dehiwala, Colombo', time: 'Yesterday, 21:14' },
  { device: 'Chrome · Android tablet', location: 'Lakeside Campus (eduroam)', time: 'Mon, 11:02' },
];

function securitySection(label: string): ProfileSection {
  return {
    id: 'security',
    title: 'Login & security',
    description: `${label} password, two-factor and where your account is signed in.`,
    icon: KeyRound,
    sessions: SECURITY_COMMON,
    fields: [
      { key: 'currentPassword', label: 'Current password', kind: 'password', placeholder: '••••••••', persist: false },
      { key: 'newPassword', label: 'New password', kind: 'password', placeholder: 'At least 8 characters', persist: false },
      { key: 'confirmPassword', label: 'Confirm new password', kind: 'password', placeholder: 'Re-enter new password', persist: false },
      select(
        'twoFactor',
        'Two-factor authentication',
        ['Enabled', 'Disabled'],
        'Enabled',
        'Requires a code from your authenticator app when signing in.',
      ),
    ],
  };
}

const LECTURER_PERSONAL: ProfileSection = {
  id: 'personal',
  title: 'Personal details',
  description: 'Your basic identity information on staff records.',
  icon: IdCard,
  fields: [
    select('title', 'Title', ['Dr.', 'Prof.', 'Mr.', 'Ms.', 'Mrs.'], 'Dr.'),
    text('fullName', 'Full name', 'Sanjaya Silva', 'e.g. Sanjaya Silva'),
    { key: 'dob', label: 'Date of birth', kind: 'date', defaultValue: '1980-06-23' },
    select('nationality', 'Nationality', ['Sri Lankan', 'Other'], 'Sri Lankan'),
    text('nic', 'National identity number', '800623000V', 'NIC / passport number'),
    { key: 'address', label: 'Home address', kind: 'textarea', defaultValue: 'No. 18, Rosmead Place, Colombo 07', placeholder: 'Street, city, postcode' },
  ],
};

const LECTURER_EMPLOYMENT: ProfileSection = {
  id: 'employment',
  title: 'Employment & department',
  description: 'Your appointment and where you are based on campus.',
  icon: Briefcase,
  fields: [
    locked('staffId', 'Staff ID', 'UCL/STA/0451', 'Set by HR. Contact HR Services to change it.'),
    select(
      'designation',
      'Designation',
      ['Professor', 'Senior Lecturer', 'Lecturer', 'Assistant Lecturer', 'Temporary Lecturer'],
      'Senior Lecturer',
    ),
    select(
      'department',
      'Department',
      ['Computer Science & Engineering', 'Electrical & Electronic Engineering', 'Mechanical Engineering', 'Mathematics', 'Business Administration'],
      'Computer Science & Engineering',
    ),
    locked('faculty', 'Faculty', 'Faculty of Engineering'),
    text('officeRoom', 'Office room', 'CSE 305', 'e.g. CSE 305'),
    text('officeHours', 'Office hours', 'Wed 14:00 – 16:00', 'e.g. Wed 14:00 – 16:00'),
    select('campus', 'Campus', ['Lakeside Campus', 'City Centre Campus'], 'Lakeside Campus'),
  ],
};

const LECTURER_RESEARCH: ProfileSection = {
  id: 'research',
  title: 'Research & public profile',
  description: 'Research areas and links shown on the staff directory.',
  icon: FlaskConical,
  fields: [
    {
      key: 'researchAreas',
      label: 'Research areas',
      kind: 'textarea',
      defaultValue: 'Software engineering, agile delivery, DevOps and technical debt.',
      placeholder: 'Comma-separated research interests',
    },
    text('orcid', 'ORCID iD', '', '0000-0000-0000-0000'),
    text('scholarUrl', 'Google Scholar profile', '', 'https://scholar.google.com/…'),
  ],
};

const ADMIN_PERSONAL: ProfileSection = {
  id: 'personal',
  title: 'Personal details',
  description: 'Your identity details on the HR record.',
  icon: IdCard,
  fields: [
    text('fullName', 'Full name', 'Priyanka Perera', 'e.g. Priyanka Perera'),
    { key: 'dob', label: 'Date of birth', kind: 'date', defaultValue: '1987-11-03' },
    select('nationality', 'Nationality', ['Sri Lankan', 'Other'], 'Sri Lankan'),
    text('nic', 'National identity number', '870603562V', 'NIC / passport number'),
    { key: 'address', label: 'Home address', kind: 'textarea', defaultValue: 'No. 57, Park Road, Colombo 05', placeholder: 'Street, city, postcode' },
  ],
};

const ADMIN_EMPLOYMENT: ProfileSection = {
  id: 'employment',
  title: 'Role & department',
  description: 'Your administrative post and reporting line.',
  icon: Building2,
  fields: [
    locked('staffId', 'Staff ID', 'UCL/ADM/0012', 'Set by HR. Contact HR Services to change it.'),
    select(
      'division',
      'Division',
      ['IT Services', "Registrar's Office", 'Finance Office', 'Student Services', 'Facilities & Estates'],
      'IT Services',
    ),
    select(
      'jobTitle',
      'Job title',
      ['Portal Administrator', 'Systems Administrator', 'Database Administrator', 'Support Analyst', 'Network Engineer'],
      'Portal Administrator',
    ),
    locked('manager', 'Reporting to', 'Mr. Nuwan Pathirana', 'Department head on record.'),
    text('officeRoom', 'Office room', 'CSE 440', 'e.g. CSE 440'),
    select('campus', 'Campus', ['Lakeside Campus', 'City Centre Campus'], 'Lakeside Campus'),
  ],
};

function adminAccess(): ProfileSection {
  return {
    id: 'access',
    title: 'Role & permissions',
    description: 'The access your administrator account holds.',
    icon: ShieldCheck,
    fields: [
      locked('role', 'Role', 'Administrator', 'Elevated roles are assigned by IT Security.'),
      locked('permissions', 'Permissions', 'Portal administration, user management, announcements, finance analytics', "These can't be edited here."),
    ],
  };
}

const PARENT_PERSONAL: ProfileSection = {
  id: 'personal',
  title: 'Personal details',
  description: 'Your details as the linked guardian.',
  icon: IdCard,
  fields: [
    text('fullName', 'Full name', 'Sharon Perera', 'e.g. Sharon Perera'),
    select('relationship', 'Relationship to student', ['Mother', 'Father', 'Guardian'], 'Mother'),
    { key: 'dob', label: 'Date of birth', kind: 'date', defaultValue: '1974-09-02' },
    select('nationality', 'Nationality', ['Sri Lankan', 'Other'], 'Sri Lankan'),
    text('nic', 'National identity number', '740902071V', 'NIC / passport number'),
    { key: 'address', label: 'Home address', kind: 'textarea', defaultValue: 'No. 24, Temple Road, Nugegoda', placeholder: 'Street, city, postcode' },
  ],
};

const PARENT_WARD: ProfileSection = {
  id: 'ward',
  title: 'Linked student',
  description: 'The student you can view progress and fees for.',
  icon: UsersRound,
  fields: [
    locked('wardName', 'Student name', 'Nimal Perera'),
    locked('wardStudentId', 'Student ID', 'UCL/UG/2024/0821'),
    locked('wardProgramme', 'Programme', 'BSc Software Engineering'),
    select('wardYear', 'Year of study', ['Year 1', 'Year 2', 'Year 3', 'Year 4'], 'Year 2'),
    locked('wardResidence', 'Accommodation', 'Halls of Residence — Block B'),
    select(
      'guardianConsent',
      'Guardian access',
      ['Grades & attendance', 'Grades, attendance & fees', 'Full academic record'],
      'Grades, attendance & fees',
    ),
  ],
};

const PARENT_CONTACT: ProfileSection = {
  id: 'contact',
  title: 'Contact information',
  description: 'How the university keeps you updated about your student.',
  icon: AtSign,
  fields: [
    locked('universityEmail', 'Primary email', 'sharon.p@email.lk'),
    text('alternateEmail', 'Alternative email', '', 'you@example.com', 'Used for alerts if the primary address fails.'),
    { key: 'mobile', label: 'Mobile number', kind: 'tel', defaultValue: '+94 77 809 2233', placeholder: '+94 7X XXX XXXX' },
    select('preferredContact', 'Preferred contact method', ['Email', 'SMS', 'Phone call'], 'SMS'),
    text('emergencyName', 'Emergency contact', 'Bernard Perera', 'Name'),
    { key: 'emergencyPhone', label: 'Emergency contact phone', kind: 'tel', defaultValue: '+94 78 443 5566', placeholder: '+94 7X XXX XXXX' },
  ],
};

const LECTURER_CONTACT: ProfileSection = {
  id: 'contact',
  title: 'Contact information',
  description: 'How students, staff and the registry reach you.',
  icon: AtSign,
  fields: [
    locked('universityEmail', 'University email', 'sanjaya.s@ucl.ac.lk'),
    text('alternateEmail', 'Alternative email', '', 'you@example.com', 'Used for alerts if the university address fails.'),
    { key: 'mobile', label: 'Mobile number', kind: 'tel', defaultValue: '+94 77 345 6789', placeholder: '+94 7X XXX XXXX' },
    text('emergencyName', 'Emergency contact', 'Ruwani Silva', 'Name'),
    { key: 'emergencyPhone', label: 'Emergency contact phone', kind: 'tel', defaultValue: '+94 76 112 3344', placeholder: '+94 7X XXX XXXX' },
  ],
};

const ADMIN_CONTACT: ProfileSection = {
  id: 'contact',
  title: 'Contact information',
  description: 'How colleagues and supported users reach you.',
  icon: AtSign,
  fields: [
    locked('universityEmail', 'University email', 'priyanka.s@ucl.ac.lk'),
    text('alternateEmail', 'Alternative email', '', 'you@example.com', 'Used for alerts if the university address fails.'),
    { key: 'mobile', label: 'Mobile number', kind: 'tel', defaultValue: '+94 71 908 1122', placeholder: '+94 7X XXX XXXX' },
    text('emergencyName', 'Emergency contact', 'Ruwan Perera', 'Name'),
    { key: 'emergencyPhone', label: 'Emergency contact phone', kind: 'tel', defaultValue: '+94 72 331 4455', placeholder: '+94 7X XXX XXXX' },
  ],
};

const STUDENT_ACADEMIC: ProfileSection = {
  id: 'academic',
  title: 'Academic record',
  description: 'Programme details and progress on record.',
  icon: GraduationCap,
  fields: [
    locked('studentId', 'Student ID', 'UCL/UG/2024/0821'),
    locked('programme', 'Programme', 'BSc Software Engineering'),
    select('yearOfStudy', 'Year of study', ['Year 1', 'Year 2', 'Year 3', 'Year 4'], 'Year 2'),
    locked('academicAdvisor', 'Academic advisor', 'Dr. Sanjaya Silva'),
    locked('enrolmentStatus', 'Enrolment status', 'Active'),
    text('sponsor', 'Sponsor / scholarship', 'Merit scholarship — Rs 250,000', 'Sponsor name or award'),
  ],
};

export const ROLE_PROFILES: Record<RoleKey, RoleProfile> = {
  [RoleKeys.STUDENT]: {
    memberSince: 'Sep 2024',
    sections: [PERSONAL_STUDENT, CONTACT_STUDENT, STUDENT_ACADEMIC, securitySection('Your')],
  },
  [RoleKeys.STAFF_ACADEMIC]: {
    memberSince: 'Mar 2016',
    sections: [LECTURER_PERSONAL, LECTURER_EMPLOYMENT, LECTURER_CONTACT, LECTURER_RESEARCH, securitySection('Your staff')],
  },
  [RoleKeys.STAFF_SOCIETY]: {
    memberSince: 'Jan 2021',
    sections: [LECTURER_PERSONAL, LECTURER_EMPLOYMENT, LECTURER_CONTACT, securitySection('Your staff')],
  },
  [RoleKeys.ADMIN]: {
    memberSince: 'Jan 2018',
    sections: [ADMIN_PERSONAL, ADMIN_EMPLOYMENT, adminAccess(), ADMIN_CONTACT, securitySection('Your administrator')],
  },
  [RoleKeys.PARENT]: {
    memberSince: 'Aug 2024',
    sections: [PARENT_PERSONAL, PARENT_WARD, PARENT_CONTACT, securitySection('Your')],
  },
};

/** Merge the per-role defaults with anything the user has already saved. */
export function buildValues(role: RoleKey, stored: Record<string, string> | undefined): Record<string, string> {
  const merged: Record<string, string> = {};
  for (const section of ROLE_PROFILES[role].sections) {
    for (const field of section.fields) {
      merged[field.key] = stored?.[field.key] ?? field.defaultValue ?? '';
    }
  }
  return merged;
}

export function isPersistable(field: ProfileField): boolean {
  return field.kind !== 'locked' && field.persist !== false;
}