# DevDash'26 Report: UCL Student Portal

- **Team:** HackStreet
- **Members:** Moksha, Usamah & Sayumdi
- **Repository:** [GitHub link]
- **Live demo (if hosted):** [URL]

> Draft status: sections 1 and 3–9 are drafted from the codebase; items marked
> `[confirm]` need a team decision before submission. Sections 2 and 6 are
> filled from the implemented feature set.

---

## 1. Introduction and problem understanding

University life is fragmented across a dozen disconnected channels — the
timetable lives in one system, grades in another, society notices arrive by
email, WhatsApp groups and pinboards, and room availability is often only known
by asking a member of staff. There is no single authoritative source, so
students cannot tell whether the notice they are reading is current, and staff
become the fallback answer for every question that has no home.

The users are **students**, who need one place to find the day-to-day
information and services they rely on, and **staff in different roles** —
academics, society organisers and administrators — who need to publish to the
right audience without leaking information to the wrong one.

Our solution is a single role-aware web portal: one sign-in, one navigation
shell, and a dashboard tailored to the signed-in persona. Announcements,
services, bookings and support are surfaced as structured, searchable sections
instead of scattered messages.

The outcomes we aimed for, taken from the brief: **informed students** who can
find official information in one place, **visibility of events and services**,
**less time spent searching**, and a **foundation to build on** — a clean
front-end/API/database separation that real university systems can be plugged
into later.

---

## 2. Scope and prioritisation

We prioritised by **mark weighting first, then student impact, effort and demo
value**: the high-mark items (BR33 assistant, BR12 access levels, BR1 unified
access, BR8 booking) were built to a working depth, while low-mark content
sections were delivered as consistent data-driven feeds so every requirement is
reachable in the demo.

> All data is client-side mock/demo data. **Working** means a reachable,
> interactive UI, not a persisted backend.

| Requirement | Marks | Status | Notes / reason |
|---|---|---|---|
| BR33 AI assistant | 9 | Stub | Deterministic keyword mock (`services/ai.ts`); no LLM, no "cannot find" path, no source citations. |
| BR12 Access levels | 6 | Working (client-side) | Role-scoped nav + `RoleRoute`; real enforcement deferred to Supabase RLS. |
| BR1 Unified access | 5 | Working | Single sign-in → one portal shell; role-aware dashboard. |
| BR8 Classroom booking | 5 | Simple | Live grid, deterministic occupancy, persisted bookings. Taken slots are disabled (prevented), not rejected with a message; no cross-user concurrency. |
| BR11 Content maintenance | 4 | Simple | Admin composer + section report dialogs; no draft→review→publish workflow. |
| BR2 Targeted announcements | 3 | Simple | Audience targeting is coarse (all / students / staff / engineering), not by faculty/year. |
| BR3 Event visibility | 3 | Working | `/portal/events` feed. |
| BR4 Event interest | 1 | Working | One-tap "Show interest" (stored locally). |
| BR5 Society visibility | 3 | Working | `/portal/societies` feed. |
| BR6 Society sign-up | 2 | Working | One-tap "Join" (stored locally). |
| BR7 Lost & found | 3 | Working | Search/filter + report dialog. |
| BR15 Emergency communication | 3 | Simple | Emergency info feed + 24/7 line; no global alert banner. |
| BR16 Schedule changes | 1 | Working | `/portal/schedule-changes` feed. |
| BR9 Academic support | — | Working | `/portal/academic-support`. |
| BR10 FAQ access | — | Working | `/portal/faq`. |
| BR13 Academic calendar | — | Working | `/portal/academic-calendar`. |
| BR14 Student onboarding | — | Working | Checklist + guide (checklist entry currently hidden from student home). |
| BR17 Feedback loop | — | Working | `/portal/feedback`. |
| BR18 Volunteering | — | Working | `/portal/volunteering`. |
| BR19 Alumni engagement | — | Working | `/portal/alumni`. |
| BR20 Jobs & internships | — | Working | `/portal/jobs`. |
| BR21 Facility issue reporting | — | Working | `/portal/facilities` report dialog. |
| BR22 Staff directory | — | Working | `/portal/staff-directory`. |
| BR23 Financial support | — | Working | `/portal/financial-support`. |
| BR24 Sports & recreation | — | Working | `/portal/sports`. |
| BR25 Dining information | — | Working | `/portal/dining`. |
| BR26 Printing services | — | Working | `/portal/printing`. |
| BR27 Textbook exchange | — | Working | `/portal/textbooks`. |
| BR28 Guest lectures | — | Working | `/portal/guest-lectures`. |
| BR29 Wellbeing support | — | Working | `/portal/wellbeing`. |
| BR30 IT support | — | Working | `/portal/it-support`. |
| BR31 Library resources | — | Working | `/portal/library`. |
| BR32 Student life highlights | — | Working | `/portal/highlights`. |

**Deliberately left out and why**

- Real Supabase auth/RLS enforcement — the app runs in demo persona mode; the
  backend was reduced to a health-only service.
- A distinct `finance` role — finance analytics lives under the admin role; no
  separate finance persona was built.
- AI LLM integration — kept as a provider-shaped stub so the demo has no API
  key or network dependency.
- WhatsApp delivery — `services/whatsapp.ts` is a deterministic stub; messages
  appear in the portal notification bell instead of a real gateway.

---

## 3. Design and architecture

**Architecture overview**

```
        ┌────────────────────────┐
        │  React SPA (Vite)      │
        │  role-aware portal UI  │
        └──────────┬─────────────┘
                   │  (demo: local state / zustand + persist)
                   │  (prod: fetch JSON)
        ┌──────────▼─────────────┐        ┌──────────────────┐
        │  Express API           │        │  AI service      │
        │  /api/v1/health only   │        │  mock (ai.ts)    │
        └──────────┬─────────────┘        └──────────────────┘
                   │
        ┌──────────▼─────────────┐
        │  PostgreSQL (Supabase) │
        │  user_roles, announce- │
        │  ments, RLS policies   │
        └────────────────────────┘
```

**Technology choices and why**

- **React 19 + Vite 8 + TypeScript** — fast dev loop, strong typing across the
  front and back end.
- **Tailwind CSS 4 + Base UI + `cn`** — utility styling with accessible
  primitives; a shared `cn` helper for conditional classes.
- **Zustand (with `persist`)** — tiny state stores for sessions, notifications,
  bookings and feed interactions; survives reloads without a backend.
- **React Hook Form + Zod** — typed, declarative validation (booking form).
- **Express 5 + Helmet** — minimal, hardened API surface; currently health-only.
- **Supabase (PostgreSQL + RLS)** — chosen as the intended production datastore
  for role-based row-level security.
- **Monorepo workspaces** — `frontend`, `backend`, `shared`, `scripts`, so role
  keys and constants live in one place.

**Data model** `[confirm against migrations]`

- `user_roles` — maps a user id to a role key (`student`, `staff_academic`,
  `staff_society`, `admin`, `parent`).
- `announcements` — title, body, audience, sender, created-at.
- `profiles`, `roles`, `permissions` — legacy tables from the initial migration,
  retained but not used by the active model.
- Row-level security policies restrict reads/writes by role.

**Roles and permissions**

- **Student** — view portal, schedule, grades, bookings, societies, support;
  act on feed items; submit reports.
- **Academic staff** — student view plus assessments, course/announcement
  management.
- **Society staff** — societies/events visibility and sign-ups; announcements.
- **Admin** — finance analytics, user management, broadcast composer, and all
  sections.
- **Parent** — ward progress, fees, timetable and grades.

Role gating is implemented in the client via role-scoped navigation and route
guards; the intended production enforcement is Supabase RLS.

**AI assistant design**

"Mr. Damith" answers from a fixed, curated set of topics aligned to the portal's
own content (timetable, bookings, fees, wellbeing, library, lost & found…). It
matches keywords to a topic and returns a deterministic reply — because there is
no generative model, it cannot invent facts outside its script. It is
provider-shaped (`services/ai.ts`), so a real OpenAI-compatible endpoint can be
dropped in without touching the UI. **Known limitation:** an unmatched question
returns a generic navigation hint rather than an explicit "I can't find that",
and replies do not cite a source.

**UI and usability decisions**

- Mobile-first, responsive shell with a bottom navigation bar on small screens.
- Plain-language labels and a consistent section-feed pattern for every service.
- Accessibility: labelled controls, `aria-pressed` on toggles, `role="alert"` on
  errors, visible focus states, and light/dark themes.

---

## 4. Implementation and key decisions

| Time | Decision | Alternatives considered | Reason |
|---|---|---|---|
| `[hh:mm]` | Demo persona mode instead of live Supabase auth | Require Supabase credentials | Lets judges explore every role with no setup |
| `[hh:mm]` | Zustand + `persist` for local state | Context, Redux | Minimal boilerplate, survives reloads |
| `[hh:mm]` | Strip backend to health-only | Keep full REST modules | Removed unreachable/dead code for a clean submission |
| `[hh:mm]` | Reuse one feed renderer for all content sections | Bespoke page per BR | Consistency and far less code |
| `[hh:mm]` | Zod-validated booking form | Manual validation | Typed rules and clear messages |

**Notable problems and how we solved them**

- Corrupted `package-lock.json` (duplicate TypeScript/@types/node) → regenerated
  the lockfile and pinned versions via root `overrides`.
- Build failure after removing a dependency → traced to a CSS `@import` and
  restored the package.
- Occupied booking slots could still be toggled → re-checked occupancy inside
  the store action, not only in the UI.

**Screenshots as evidence of development:** [insert with captions and times]

---

## 5. Non-functional qualities

| Requirement | What we did | Evidence |
|---|---|---|
| NFR1 Usability | Role-aware nav, plain labels, consistent section layout, mobile bottom bar | `components/layout/*`, `constants/navigation.ts` |
| NFR2 Performance and scalability | Vite production build, code-split-ready routing, no server round-trip in demo mode | `npm run build` output |
| NFR3 Reliability and availability | Graceful server shutdown, deterministic mock data (no random flicker), persisted state | `backend/src/server.ts`, booking `hash01` seeding |
| NFR4 Security and privacy | Role-scoped UI + route guards, Helmet on the API, no personal data in the bundle, RLS schema for production | `backend/src/app.ts`, `docs/security/access-control.md` |
| NFR5 Maintainability | Monorepo with a single `shared` role catalogue, layered `features/`, README + docs, one config location | `shared/src/constants/roles.ts`, `docs/**` |
| NFR6 Robustness | Zod input validation, error boundaries in forms, guarded store actions, clear error text | `features/bookings/*`, `features/whatsapp/composer.tsx` |

---

## 6. Testing and validation

| # | Feature | Test case | Expected result | Actual result | Pass / Fail |
|---|---|---|---|---|---|
| 1 | Access levels | Student tries to publish a notice | Blocked | No publish control is rendered for the student role; only the admin sees the composer. | Pass (client-side) |
| 2 | Access levels | Society rep publishes outside their categories | Blocked | Cannot be run — there is no society login persona and no publish flow. | Not run |
| 3 | Room booking | Book an already-taken slot | Rejected with a clear message | Occupied slots are disabled and `toggleSlot` re-checks, so selection is prevented — but no message is shown. | Partial |
| 4 | Emergency alert | Admin publishes an alert | Banner appears for students | No banner; the message appears in the notification bell and Announcements feed. | Fail |
| 5 | Validation | Submit a form with an empty or over-long title | Clear error, no crash | Empty title blocked with a min-length alert; over-long title is accepted (no max), no crash. | Partial |
| 6 | AI assistant | Ask a question with no answer in the content | Says it cannot find it | Returns a generic navigation hint; never states it cannot find an answer. | Fail |
| 7 | AI assistant | Ask a question that has an answer | Correct answer with source | Returns a plausible canned answer; no source is cited. | Partial |
| 8 | Mobile | Open on a phone-sized screen | Usable layout | Responsive shell with a mobile bottom nav bar. | Pass |

**Bugs found and fixed**

- Duplicate TypeScript/@types/node in the lockfile → regenerated.
- Build broke after a dependency removal (CSS `@import`) → restored.
- Occupied booking slots could be toggled → store-level guard added.

**Known issues remaining**

- Mock AI: no "cannot find" behaviour and no source citations.
- No distinct `finance` role; finance analytics sits under admin.
- No society login persona, so test 2 cannot be run.
- No global emergency alert banner.
- Over-long form input is not rejected.
- No automated tests; verification is manual/build-based.
- Front-end bundle is not code-split (~1.0 MB / ~303 kB gzip).
- Legacy unused tables from the initial migration remain.

---

## 7. Limitations and future work

- **Stubs / prototypes:** all portal content is seed data; notifications are
  stored locally; WhatsApp and the AI assistant are deterministic stubs;
  bookings are per-browser.
- **Not integrated:** student records, timetabling, finance and the WhatsApp
  gateway are outside the prototype (per the brief's assumptions).
- **Next steps:** real notifications, calendar sync, analytics, code-splitting,
  automated tests, and production hardening.
- **What the university would need to run it:** hosting for the SPA and API, a
  Supabase project with migrations applied, an owner for content, and support
  for the notification/WhatsApp integration.

---

## 8. Tools, libraries and AI use (required disclosure)

| Name | Version | Purpose | Licence / source |
|---|---|---|---|
| React / React DOM | 19.2.8 | UI library | MIT |
| Vite | 8.3.0 | Build tool & dev server | MIT |
| TypeScript | ~6.0.2 | Type safety | Apache-2.0 |
| Tailwind CSS | 4.3.3 | Styling | MIT |
| React Router | 7.18.4 | Client routing | MIT |
| Zustand | 5.0.3 | State management | MIT |
| React Hook Form | 7.88.0 | Form state | MIT |
| Zod | 4.6.5 | Schema validation | MIT |
| @hookform/resolvers | 5.9.1 | RHF ↔ Zod bridge | MIT |
| Lucide React | 1.47.0 | Icons | ISC |
| @base-ui/react | 1.8.0 | Accessible UI primitives | MIT |
| @supabase/supabase-js | 2.116.0 | Auth/DB client | MIT |
| Express | 5.2.1 | API server | MIT |
| Helmet | 8.3.0 | API security headers | MIT |
| PostgreSQL / Supabase | — | Database + RLS | PostgreSQL / Apache-2.0 |

> Verify exact licences before submission.

**AI tools used as aids during development:** an AI coding assistant was used to
explain errors, draft boilerplate and review the documentation. `[confirm the
specific tools used.]`

**What was written by the team:** the product concept, data model, role
definitions, UI design, prioritisation decisions and core feature logic.

---

## 9. Team contributions

| Member | Main responsibilities |
|---|---|
| Moksha | `[confirm]` |
| Usamah | `[confirm]` |
| Sayumdi | `[confirm]` |

---

Repository structure and how to run the project are in the README.
