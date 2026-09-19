# Business Requirements

The portal is organised as a set of business requirements (BR1–BR33). Each
requirement is surfaced through the role-aware navigation
(`frontend/src/constants/navigation.ts`) and the section feed data
(`frontend/src/features/sections/data.ts`), backed by client-side mock data.

Status legend: **Implemented** = reachable UI with interactive affordances;
**Partial** = reachable but reduced depth; **Mock** = deterministic stub.

## Feature catalogue

| ID   | Requirement              | Where it lives                                               | Status      |
| ---- | ------------------------ | ------------------------------------------------------------ | ----------- |
| BR1  | Unified Access           | `pages/login.tsx`, `components/layout/*`                     | Implemented |
| BR2  | Targeted Announcements   | `/portal/announcements` + admin composer                     | Partial     |
| BR3  | Event Visibility         | `/portal/events`                                             | Implemented |
| BR4  | Event Interest           | `/portal/events` (feed action `interest`)                    | Implemented |
| BR5  | Society Visibility       | `/portal/societies`                                          | Implemented |
| BR6  | Society Sign-up          | `/portal/societies` (feed action `join`)                     | Implemented |
| BR7  | Lost & Found             | `/portal/lost-found`                                         | Implemented |
| BR8  | Classroom Booking        | `/portal/bookings` + `features/bookings/*`                   | Implemented |
| BR9  | Academic Support         | `/portal/academic-support`                                   | Implemented |
| BR10 | FAQ Access               | `/portal/faq`                                                | Implemented |
| BR11 | Content Maintenance      | admin dashboard + section report dialogs                     | Partial     |
| BR12 | Access Levels            | roles in `shared` + `RoleRoute` + nav                        | Implemented |
| BR13 | Academic Calendar        | `/portal/academic-calendar`                                  | Implemented |
| BR14 | Student Onboarding       | `/portal/onboarding` + `features/onboarding/*`               | Implemented |
| BR15 | Emergency Communication  | `/portal/emergency`                                          | Implemented |
| BR16 | Schedule Changes         | `/portal/schedule-changes`                                   | Implemented |
| BR17 | Feedback Loop            | `/portal/feedback`                                           | Implemented |
| BR18 | Volunteering             | `/portal/volunteering`                                       | Implemented |
| BR19 | Alumni Engagement        | `/portal/alumni`                                             | Implemented |
| BR20 | Jobs & Internships       | `/portal/jobs`                                               | Implemented |
| BR21 | Facility Issue Reporting | `/portal/facilities`                                         | Implemented |
| BR22 | Staff Directory          | `/portal/staff-directory`                                    | Implemented |
| BR23 | Financial Support        | `/portal/financial-support`                                  | Implemented |
| BR24 | Sports & Recreation      | `/portal/sports`                                             | Implemented |
| BR25 | Dining Information       | `/portal/dining`                                             | Implemented |
| BR26 | Printing Services        | `/portal/printing`                                           | Implemented |
| BR27 | Textbook Exchange        | `/portal/textbooks`                                          | Implemented |
| BR28 | Guest Lectures           | `/portal/guest-lectures`                                     | Implemented |
| BR29 | Wellbeing Support        | `/portal/wellbeing`                                          | Implemented |
| BR30 | IT Support               | `/portal/it-support`                                         | Implemented |
| BR31 | Library Resources        | `/portal/library`                                            | Implemented |
| BR32 | Student Life Highlights  | `/portal/highlights`                                         | Implemented |
| BR33 | AI Assistant             | `features/assistant/assistant-widget.tsx` + `services/ai.ts` | Mock        |

## Cross-cutting concerns

- **BR1 / BR12** rely on the role catalogue in `shared/src/constants/roles.ts` and
  the role-aware navigation/route guards. Real enforcement is delegated to Supabase
  RLS when the hosted backend is enabled (`docs/security/access-control.md`).
- **BR2 (targeting)** currently models audience at the section/nav level
  (`all`, students, staff) rather than by faculty/programme/year.
- **BR11** provides admin-side composition and section report dialogs; a full
  draft → review → publish workflow is not implemented.
- **BR33** is a deterministic keyword-based assistant with a provider-shaped API
  (`services/ai.ts`); a real LLM/provider can be dropped in without touching the UI.
