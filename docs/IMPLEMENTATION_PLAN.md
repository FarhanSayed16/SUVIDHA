# SUVIDHA — Implementation Plan (How to Build It Properly)

This plan turns the existing planning docs into a clear, ordered way to build and complete the product. It prioritizes **working end-to-end flows** over building every microservice in isolation, and **demo-ready quality** over feature sprawl.

---

## Principles

- **Vertical slices first:** Get one full flow working (e.g. login → electricity bill → pay → receipt) before adding all services.
- **Shared foundation once:** API gateway, auth, DB schema, and config done once; then add services and UI on top.
- **Kiosk and admin share backend:** Same APIs and gateway; different UIs and roles.
- **Security and compliance from day one:** JWT, TLS, role-based access, audit logging — not bolted on later.
- **Document as you go:** API contracts, env setup, and deployment steps in repo (e.g. in `docs/`).

---

## Phase 0: Project Setup and Foundation (Week 1)

**Goal:** Repo structure, dev environment, and design decisions locked so everyone codes against the same base.

- **Repo structure:** Monorepo or multi-repo decision. Suggested: single repo with folders e.g. `backend/`, `gateway/`, `kiosk-ui/`, `admin-ui/`, `docs/`.
- **Tech stack (lock in):**
  - **Kiosk UI:** React (touch-friendly, good i18n).
  - **Admin UI:** React (reuse components/theming) or separate React app.
  - **API Gateway:** Node.js (Express/Fastify) or FastAPI — single entrypoint, JWT validation, routing.
  - **Backend services:** Same language as gateway (Node or Python/FastAPI) for consistency; REST only.
  - **Database:** PostgreSQL; one DB to start, schema per "service" (tables prefixed or in schemas).
- **Dev environment:** Docker Compose for PostgreSQL + (optionally) gateway + one backend service so that `docker compose up` gives a runnable system.
- **API contract:** OpenAPI/Swagger for gateway routes and payloads; store in repo and keep updated.
- **Docs:** Add `docs/SETUP.md` with prerequisites, `.env.example`, and how to run gateway + one service + DB.

**Exit criteria:** New dev can clone repo, run `docker compose up` (or equivalent), and see gateway + one stub service responding; README points to SETUP.md and ARCHITECTURE.md.

---

## Phase 1: Auth and First End-to-End Flow (Weeks 2–3)

**Goal:** Citizen can "log in" on the kiosk and complete one full journey (e.g. view electricity bill → pay → get receipt).

- **Authentication service:**
  - Mobile + OTP (use Twilio/similar or mock OTP for demo).
  - Issue short-lived JWT; refresh/session as per design.
  - Consumer ID / Service ID as optional second factor (demo-safe).
- **API Gateway:**
  - Verify JWT on protected routes; forward `userId`/claims to backend.
  - Route `/api/auth/*` to auth service; `/api/electricity/*` to electricity service.
- **Electricity service (first utility):**
  - REST: get bill by consumer ID, get payment confirmation, store transaction.
  - DB: tables for users/sessions, bills, transactions (minimal schema).
- **Payment service (minimal):**
  - Demo mode: accept "pay" request, record transaction, return success.
  - Integrate real gateway later; for now focus on flow and receipt.
- **Document/Receipt service (minimal):**
  - Generate PDF receipt (or HTML printable); call from payment flow.
- **Kiosk UI (minimal):**
  - Screens: Welcome → Language → Login (OTP) → Service choice → Electricity → Bill view → Pay → Receipt/print.
  - Use placeholder/mock data only where backend is not ready; then wire to real APIs.
- **Database:**
  - Migrations (e.g. Flyway, Alembic, or SQL scripts in repo); schema for users, sessions, bills, transactions, complaints (stub).

**Exit criteria:** User can select language, log in with OTP, see one electricity bill, "pay," and get a printable receipt; all via gateway; data in PostgreSQL.

---

## Phase 2: All Civic Services and Complaints (Weeks 4–5)

**Goal:** Same kiosk flow for Gas, Water, Municipal; plus complaint registration and status tracking.

- **Utility services:** Replicate electricity pattern for Gas, Water, Municipal (bill fetch, pay, receipt). Reuse payment and document services; add service-specific tables/APIs as needed.
- **Complaint & Grievance service:**
  - Register complaint (category, description, optional attachment); return reference number.
  - Status lifecycle: Registered → In Progress → Resolved; store in DB.
  - Optional: simple priority (Emergency / High / Normal) for demo.
- **Kiosk UI:** Add Gas, Water, Municipal screens; complaint form and status lookup (by reference number).
- **Admin UI (first version):**
  - Login (separate role/admin JWT).
  - List complaints; filter by status/service; update status.
  - Simple dashboard: total complaints, resolved count, maybe bill payment count (from DB).
- **Gateway:** New routes for gas, water, municipal, complaints; same JWT and role checks.

**Exit criteria:** Citizen can pay (demo) for any of the four utilities and register/track a complaint; admin can see and update complaints and see basic counts.

---

## Phase 3: Admin Dashboard, Notifications, and Content (Weeks 5–6)

**Goal:** Admin has full operational view; kiosk shows advisories and optional notifications.

- **Analytics and reporting:**
  - Usage stats (sessions, bills paid, complaints) by day/week; service-wise breakdown; peak hours (from DB).
  - Export CSV/PDF (simple report).
- **Content and notifications:**
  - Admin can create/edit advisories and outage notices; store in DB.
  - Notification service: "broadcast" to kiosks (e.g. "Power outage in Sector X"); kiosk fetches on interval or via simple push.
- **Kiosk:** Advisory/announcement strip or modal; optional "emergency alert" mode when active.
- **Admin UI:** Screens for "Manage advisories," "View analytics," "Export report"; link from dashboard.

**Exit criteria:** Admin dashboard shows live-ish analytics and report export; kiosk displays advisories; emergency-style alert can be triggered and shown.

---

## Phase 4: Accessibility, Multilingual, and Security Hardening (Week 6–7)

**Goal:** Inclusive design and compliance-ready security.

- **Multilingual (i18n):** Use React i18n (e.g. react-i18next); language selection at welcome; Hindi + English at minimum; keys for all kiosk strings; store translations in repo.
- **Accessibility:** Large-font mode (CSS/theme switch), high-contrast option, focus management, and keyboard/touch targets per WCAG-style checklist; optional TTS (browser API or lightweight lib).
- **Security:** TLS everywhere (HTTPS); rate limiting on gateway; session timeout and auto-logout; audit log (who did what, when) for payments and complaint updates; no secrets in frontend.
- **Compliance:** Document data retention and minimal fields; ensure consent/notice where required; align with DPDP/IT Act in design (document in `docs/COMPLIANCE.md`).

**Exit criteria:** Kiosk supports at least English and Hindi; large font and high contrast work; audit log exists for critical actions; COMPLIANCE.md describes approach.

---

## Phase 5: Innovation Hooks and Demo Polish (Week 7–8)

**Goal:** Differentiation features and stable demo.

- **QR "continue on mobile":** At any step, kiosk generates QR with session/request ID; simple mobile page (or deep link) to resume; backend supports "get state by token" and "continue flow."
- **Voice guidance (optional):** Text-to-speech for current screen or key steps; use browser TTS or lightweight library.
- **Complaint prioritization:** In complaint service and admin, show priority (Emergency/High/Normal); sort/filter by it.
- **Demo data and scripts:** Seed DB with sample consumers, bills, complaints; one-click or script to reset demo; clear "Demo mode" label on kiosk and payment.
- **Deployment:** Docker Compose (or similar) for full stack; optional single-server deploy doc; kiosk UI build runs in browser (no native app required for demo).

**Exit criteria:** Demo can be reset and run end-to-end; QR continuation and at least one innovation (e.g. voice or priority) shown; judges can use kiosk + admin without hand-holding.

---

## Phase 6: Documentation and Handover (Ongoing, finalize by Week 8)

- **User manual (citizen):** Short doc or in-app help: how to log in, pay bill, register complaint, get receipt.
- **User manual (admin):** How to view analytics, manage complaints, post advisories, export reports.
- **Technical docs:** Architecture (already in `docs/ARCHITECTURE.md`); API overview and link to OpenAPI; deployment and env vars in `docs/SETUP.md` or `docs/DEPLOYMENT.md`.
- **README:** One-page "What is SUVIDHA," how to run demo, link to docs and problem statement.

---

## Suggested Order of Implementation (Summary)

1. **Phase 0:** Repo, stack, Docker, OpenAPI, SETUP.md.
2. **Phase 1:** Auth + Gateway + Electricity + Payment + Receipt + minimal Kiosk UI (one flow).
3. **Phase 2:** Gas, Water, Municipal, Complaints service + Kiosk screens + Admin (complaints + basic dashboard).
4. **Phase 3:** Analytics, reports, advisories, notification service, kiosk advisories/alert.
5. **Phase 4:** i18n (EN/HI), accessibility, security hardening, COMPLIANCE.md.
6. **Phase 5:** QR continuation, voice (optional), priority, demo seed, deployment.
7. **Phase 6:** User manuals, technical docs, README.

---

## Phase Checklist (Todos)

| Phase | Task | Status |
|-------|------|--------|
| 0 | Repo structure, tech stack, Docker, OpenAPI, SETUP.md | Pending |
| 1 | Auth + Gateway + Electricity + Payment + Receipt + minimal Kiosk UI | Pending |
| 2 | Gas, Water, Municipal, Complaints + Admin (complaints + dashboard) | Pending |
| 3 | Analytics, reports, advisories, notifications, kiosk alerts | Pending |
| 4 | i18n (EN/HI), accessibility, security hardening, COMPLIANCE.md | Pending |
| 5 | QR continuation, voice/priority, demo seed, deployment | Pending |
| 6 | User manuals, technical docs, README finalization | Pending |

---

## Risks and Mitigations

- **Scope creep:** Stick to "one flow first" (Phase 1); defer "nice-to-haves" (e.g. full AI chatbot) to post-demo.
- **Integration delays:** Define API contracts (OpenAPI) in Phase 0; frontend can mock from them until backend is ready.
- **Auth/security gaps:** Implement JWT + role check in gateway from Phase 1; add audit log and TLS early (Phase 4).

---

## Success Definition

- **Demo-ready:** One person can, in 10 minutes, show login → choose service → pay bill → get receipt → register complaint → see status; and show admin dashboard with analytics and complaint management.
- **Documented:** README, SETUP, ARCHITECTURE, COMPLIANCE, and user-facing docs in repo.
- **Aligned with proposal:** Matches FEATURES.md (core citizen + admin features), ARCHITECTURE.md (layers, microservices, gateway), and TECHNICAL_PROPOSAL.md (stack, security, deliverables).

This plan is the single "how we build it" reference; link it from `docs/README.md` and keep it updated as phases complete.
