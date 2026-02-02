# SUVIDHA — Complete Master Plan

**Smart Urban Virtual Interactive Digital Helpdesk Assistant**

This document is the **single source of truth** for building SUVIDHA from zero to a demo-ready, governance-grade civic kiosk. Use it to track progress, assign work, and ensure nothing is missed. Each phase has sub-phases and concrete tasks; mark items complete as you go.

---

## How to Use This Master Plan

- **Track progress:** Use the checkboxes `[ ]` / `[x]` or the Phase Status Table at the end to mark phases and sub-phases complete.
- **Order:** Phases are sequenced; complete Phase N before starting Phase N+1 unless noted otherwise.
- **Exit criteria:** Do not consider a phase done until all exit criteria are met.
- **References:** TECH_STACK.md, FEATURES_AND_INNOVATION.md, ARCHITECTURE.md, and IMPLEMENTATION_PLAN.md support this plan.

---

## Principles

1. **Vertical slices first** — Get one full flow working (login → electricity bill → pay → receipt) before expanding.
2. **Shared foundation once** — API gateway, auth, and DB schema are built once; then services and UIs are added.
3. **Kiosk and admin share backend** — Same APIs and gateway; different UIs and roles.
4. **Security and compliance from day one** — JWT, TLS, RBAC, audit logging from Phase 3–4 onward.
5. **Document as you go** — API contracts, SETUP.md, and deployment steps live in the repo.

---

## Success Definition (End of Master Plan)

- **Demo-ready:** In ~10 minutes, one person can demonstrate: login → choose service → pay bill → get receipt → register complaint → see status; and show admin dashboard with analytics and complaint management.
- **Documented:** README, SETUP, ARCHITECTURE, COMPLIANCE, user manuals in repo.
- **Aligned:** Matches FEATURES_AND_INNOVATION.md (core citizen + admin), ARCHITECTURE.md (layers, microservices), TECHNICAL_PROPOSAL.md (stack, security, deliverables).

---

---

# Phase 0: Project Foundation & Governance

**Goal:** Lock project structure, tech stack, and governance so the team codes against one base.

**Estimated duration:** 3–5 days  
**Dependencies:** None

---

## Phase 0 — Sub-Phase 0.1: Repository Structure

- [ ] Decide monorepo vs multi-repo; document decision in README or docs.
- [ ] Create root folder structure. Suggested (monorepo):
  - [ ] `backend/` — all microservices (or `services/auth/`, `services/electricity/`, etc.)
  - [ ] `gateway/` — API gateway code
  - [ ] `kiosk-ui/` — React kiosk app
  - [ ] `admin-ui/` — React admin app
  - [ ] `docs/` — all documentation (already present)
  - [ ] `scripts/` — seed data, migrations, deploy helpers
- [ ] Add root `.gitignore` (node_modules, .env, build, __pycache__, .venv, etc.).
- [ ] Add root README.md with project name, one-line description, and link to docs/README.md and docs/SETUP.md (to be created in Phase 0.4).

**Deliverable:** Repository structure committed; README and .gitignore in place.

---

## Phase 0 — Sub-Phase 0.2: Tech Stack Lock-In

- [ ] Finalize and document in docs/TECH_STACK.md (or a one-page summary in SETUP.md):
  - [ ] **Kiosk UI:** React + (TypeScript recommended); build tool (Vite recommended).
  - [ ] **Admin UI:** React + same build tool.
  - [ ] **API Gateway:** Node.js (Express/Fastify) OR Python (FastAPI) — choose one.
  - [ ] **Backend services:** Same language as gateway (Node or Python).
  - [ ] **Database:** PostgreSQL (recommended) or MySQL.
  - [ ] **Auth:** JWT; OTP provider (Twilio / MSG91 / mock for demo).
- [ ] Document chosen versions (e.g. Node 20 LTS, Python 3.11, PostgreSQL 15) in SETUP.md.
- [ ] Ensure TECH_STACK.md is up to date with these choices.

**Deliverable:** TECH_STACK.md (or SETUP.md) states exact stack and versions; no ambiguity.

---

## Phase 0 — Sub-Phase 0.3: API Contract & OpenAPI

- [ ] Create `docs/api/` or `gateway/openapi/` folder for API contract.
- [ ] Add OpenAPI 3.0 spec (YAML or JSON) covering:
  - [ ] Base URL and server(s).
  - [ ] **Auth:** POST /api/auth/otp/send, POST /api/auth/otp/verify, POST /api/auth/refresh (if used).
  - [ ] **Electricity:** GET /api/electricity/bill/{consumerId}, POST /api/electricity/pay (or similar).
  - [ ] **Payments:** POST /api/payments/initiate, POST /api/payments/confirm (or single endpoint for demo).
  - [ ] **Documents:** GET /api/documents/receipt/{transactionId} (or POST that returns PDF/HTML).
- [ ] Document request/response schemas (JSON) for above.
- [ ] Add placeholder paths for future services: /api/gas/*, /api/water/*, /api/municipal/*, /api/complaints/*, /api/notifications/*, /api/analytics/*.
- [ ] Commit OpenAPI file; plan to update it as each phase adds endpoints.

**Deliverable:** OpenAPI spec in repo; frontend/backend can mock from it.

---

## Phase 0 — Sub-Phase 0.4: Developer Environment & SETUP.md

- [ ] Write docs/SETUP.md with:
  - [ ] Prerequisites (Node, Python, PostgreSQL, Docker, Git).
  - [ ] How to clone repo and install dependencies (per app: gateway, backend services, kiosk-ui, admin-ui).
  - [ ] How to run PostgreSQL locally (install or Docker).
  - [ ] `.env.example` listing all required env vars (DB_URL, JWT_SECRET, GATEWAY_PORT, SERVICE_URLs, OTP_MOCK_FLAG, etc.).
- [ ] Create `.env.example` at repo root (or per service) and add to SETUP.md.
- [ ] Document minimal “run gateway + one stub service + DB” steps so a new dev can see something responding (stub can be added in Phase 1 or 4).

**Deliverable:** SETUP.md and .env.example in repo; new dev can follow and run base stack.

---

## Phase 0 — Exit Criteria

- [ ] Repo structure is final and documented.
- [ ] Tech stack and versions are locked and documented.
- [ ] OpenAPI spec exists and includes auth, electricity, payment, document placeholder.
- [ ] SETUP.md and .env.example exist; a new developer can clone, install, and run PostgreSQL (and optionally a stub).

---

---

# Phase 1: Repository & Development Environment (Docker & Tooling)

**Goal:** One-command run of database and (optionally) gateway + one stub service for fast feedback.

**Estimated duration:** 2–4 days  
**Dependencies:** Phase 0 complete

---

## Phase 1 — Sub-Phase 1.1: Docker for Database

- [ ] Add `docker-compose.yml` at repo root (or in a `deploy/` / `docker/` folder).
- [ ] Define PostgreSQL service (image, e.g. postgres:15-alpine; port 5432; env POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB).
- [ ] Add volume for data persistence.
- [ ] Document in SETUP.md: `docker compose up -d` (or `docker-compose up -d`) to start DB.
- [ ] Verify: connect to DB with psql or GUI; create database if not auto-created.

**Deliverable:** docker-compose.yml with PostgreSQL; SETUP.md updated.

---

## Phase 1 — Sub-Phase 1.2: Database Migrations Setup

- [ ] Choose migration tool: Flyway (Java), Alembic (Python), or raw SQL scripts in repo.
- [ ] Create migrations folder (e.g. `backend/migrations/`, `database/migrations/`).
- [ ] Add initial migration: create schema version table (if using Flyway/Alembic) or 001_initial.sql that creates no app tables yet (reserved for Phase 2).
- [ ] Document in SETUP.md how to run migrations (e.g. `npm run migrate` or `alembic upgrade head`).
- [ ] Ensure migrations run against DB URL from .env.

**Deliverable:** Migration tool configured; one initial migration; docs updated.

---

## Phase 1 — Sub-Phase 1.3: Gateway Stub (Optional but Recommended)

- [ ] Initialize gateway project in `gateway/` (npm init or poetry/pip).
- [ ] Add minimal server: one GET /health that returns 200 OK.
- [ ] Add gateway to docker-compose.yml (build from gateway/Dockerfile or use node image and mount); expose port (e.g. 8080).
- [ ] Document: after `docker compose up`, GET http://localhost:8080/health returns 200.
- [ ] Ensure gateway reads PORT from env.

**Deliverable:** Gateway stub in Docker Compose; health check works.

---

## Phase 1 — Sub-Phase 1.4: Linting & Formatting

- [ ] Add ESLint + Prettier for kiosk-ui and admin-ui (and gateway if Node).
- [ ] Add Pylint/Flake8 + Black for backend if Python.
- [ ] Add config files (.eslintrc, .prettierrc, pyproject.toml or setup.cfg) and commit.
- [ ] Optionally: add pre-commit or npm/pip scripts (e.g. `npm run lint`, `npm run format`).

**Deliverable:** Linting and formatting configured; one lint/format pass on existing code.

---

## Phase 1 — Exit Criteria

- [ ] `docker compose up` starts PostgreSQL (and optionally gateway).
- [ ] Migrations run successfully (even if empty schema).
- [ ] SETUP.md describes full local run; README points to SETUP.md and ARCHITECTURE.md.

---

---

# Phase 2: Database & Data Layer Foundation

**Goal:** Persistent schema for users, sessions, bills, transactions, and complaints (stub) so all services share one data model.

**Estimated duration:** 3–5 days  
**Dependencies:** Phase 1 complete

---

## Phase 2 — Sub-Phase 2.1: Core Tables Design

- [ ] Design and document (in docs or migration file comments) tables:
  - [ ] **users** — id, mobile, consumer_id (nullable), role (citizen/admin), created_at, updated_at.
  - [ ] **sessions** — id, user_id, token_hash or jti, expires_at, created_at.
  - [ ] **electricity_bills** — id, consumer_id, amount, due_date, status, period, created_at (add gas/water/municipal later or single bills table with service_type).
  - [ ] **transactions** — id, user_id, service_type (electricity/gas/water/municipal), amount, status, reference_id, created_at.
  - [ ] **complaints** — id, user_id, category, description, priority (emergency/high/normal), status (registered/in_progress/resolved), reference_number, created_at, updated_at.
- [ ] Add audit_log table: id, user_id, action, entity_type, entity_id, payload (jsonb), created_at.
- [ ] Decide: one DB with schemas or table prefixes per “service”; document in ARCHITECTURE.md or SETUP.md.

**Deliverable:** Table design document or commented migration.

---

## Phase 2 — Sub-Phase 2.2: Migrations for Core Tables

- [ ] Write migration 002 (or next) creating users, sessions, electricity_bills (or unified bills with service_type), transactions, complaints, audit_log.
- [ ] Add indexes: user_id on sessions and transactions; consumer_id on electricity_bills; reference_number on complaints; created_at where needed for reports.
- [ ] Run migration; verify tables exist in DB.
- [ ] Optionally: add seed script for one test user and one test electricity bill (or defer to Phase 17).

**Deliverable:** Migration applied; tables and indexes present.

---

## Phase 2 — Sub-Phase 2.3: Backend DB Client / ORM

- [ ] In backend (or shared lib), add DB client: Prisma (Node) or SQLAlchemy (Python) or pg (Node) / psycopg2 (Python).
- [ ] Configure connection from env (DATABASE_URL or DB_URL).
- [ ] Add one read-only query (e.g. “select 1”) to verify connectivity; expose via a small script or health endpoint.
- [ ] Document in SETUP.md: backend connects to same PostgreSQL as in Docker.

**Deliverable:** Backend can connect to PostgreSQL and run a query.

---

## Phase 2 — Exit Criteria

- [ ] All core tables exist and migrations are versioned.
- [ ] Backend (or at least one service) can connect and query DB.
- [ ] Schema supports auth, one utility (electricity), payments, and complaints.

---

---

# Phase 3: Authentication Service

**Goal:** Citizen and admin can “log in” (OTP + optional Consumer ID); service issues JWT and manages session.

**Estimated duration:** 5–7 days  
**Dependencies:** Phase 2 complete

---

## Phase 3 — Sub-Phase 3.1: Auth Service Skeleton

- [ ] Create auth service project under backend (e.g. `backend/services/auth/` or `backend/auth-service/`).
- [ ] Add framework: Express/Fastify (Node) or FastAPI (Python).
- [ ] Add routes: POST /otp/send, POST /otp/verify (or /login). Plan for POST /refresh if using refresh tokens.
- [ ] Add health endpoint GET /health.
- [ ] Service reads DB (users, sessions) and env (JWT_SECRET, OTP_PROVIDER, OTP_MOCK).

**Deliverable:** Auth service runs locally; routes return stub JSON.

---

## Phase 3 — Sub-Phase 3.2: OTP Send & Verify (Demo)

- [ ] Implement POST /otp/send:
  - [ ] Accept body: { mobile: string }.
  - [ ] If OTP_MOCK=true: generate 6-digit OTP, store in memory/Redis/DB with TTL (e.g. 10 min); return { success: true }.
  - [ ] If real provider: call Twilio/MSG91; store OTP with TTL; return { success: true/false }.
- [ ] Implement POST /otp/verify:
  - [ ] Accept body: { mobile: string, otp: string }.
  - [ ] Validate OTP; if invalid return 401.
  - [ ] Upsert user by mobile (create if not exists); create session; generate JWT (short-lived, e.g. 15 min–1 hr).
  - [ ] Return { token: string, user: { id, mobile, role } }.
- [ ] Store session in DB (session id, user_id, expires_at) if using server-side session; or stateless JWT only and document.
- [ ] Update OpenAPI spec with auth request/response schemas.

**Deliverable:** Citizen can “log in” via mobile + OTP and receive JWT.

---

## Phase 3 — Sub-Phase 3.3: Admin Login & Role

- [ ] Add admin user(s) in DB (role=admin). Optionally seed one admin (e.g. admin@demo / password or admin mobile + OTP).
- [ ] If admin uses password: add POST /admin/login (username/email + password) and return JWT with role=admin.
- [ ] If admin uses same OTP flow: ensure JWT payload includes role from users.role; gateway will use this for RBAC.
- [ ] Ensure JWT payload includes: userId (or sub), role (citizen | admin), exp, iat.

**Deliverable:** Admin can obtain JWT with role=admin.

---

## Phase 3 — Sub-Phase 3.4: Consumer ID / Service ID (Optional for Demo)

- [ ] Allow optional consumer_id (or service_connection_id) in login flow: after OTP verify, accept consumer_id in body or in a separate “link account” call; store in users.consumer_id or separate table.
- [ ] Document: used for fetching bills by consumer ID; demo can use one seeded consumer_id.

**Deliverable:** Optional consumer ID supported and documented.

---

## Phase 3 — Exit Criteria

- [ ] POST /otp/send and POST /otp/verify work (mock or real OTP).
- [ ] Response includes JWT; JWT contains userId and role.
- [ ] Admin login works and returns admin JWT.
- [ ] OpenAPI spec updated for auth.

---

---

# Phase 4: API Gateway

**Goal:** Single entrypoint for all clients; routes to auth and (later) other services; verifies JWT and applies rate limiting.

**Estimated duration:** 4–6 days  
**Dependencies:** Phase 3 complete

---

## Phase 4 — Sub-Phase 4.1: Gateway Routing to Auth

- [ ] Gateway exposes /api/auth/* and forwards to auth service (e.g. http://auth-service:3000 or localhost:3001).
- [ ] Implement proxy: POST /api/auth/otp/send → auth POST /otp/send; POST /api/auth/otp/verify → auth POST /otp/verify.
- [ ] Gateway reads AUTH_SERVICE_URL from env.
- [ ] Test: call gateway /api/auth/otp/send and /api/auth/otp/verify; same behavior as calling auth directly.

**Deliverable:** Gateway proxies auth routes; client can login via gateway.

---

## Phase 4 — Sub-Phase 4.2: JWT Verification Middleware

- [ ] Add middleware that runs on all routes except /api/auth/* and /health: extract Bearer token from Authorization header.
- [ ] Verify JWT signature and exp using JWT_SECRET (same as auth service).
- [ ] On success: attach decoded payload (userId, role) to request; pass to downstream.
- [ ] On failure: return 401 Unauthorized.
- [ ] Document: protected routes require header `Authorization: Bearer <token>`.

**Deliverable:** Gateway rejects invalid/missing token; forwards userId and role when valid.

---

## Phase 4 — Sub-Phase 4.3: Rate Limiting & Request Logging

- [ ] Add rate limiting (e.g. express-rate-limit or slowapi): limit per IP for /api/auth/otp/send (e.g. 5/min) to prevent abuse.
- [ ] Add request logging: method, path, status, duration; log to stdout or file.
- [ ] Optionally: add request ID for tracing.

**Deliverable:** Rate limit on OTP send; all requests logged.

---

## Phase 4 — Sub-Phase 4.4: Placeholder Routes for Future Services

- [ ] Add placeholder routes that return 501 or 404 for: /api/electricity/*, /api/payments/*, /api/documents/* (and later gas, water, municipal, complaints, notifications, analytics).
- [ ] Or: add proxy to “stub” service that returns “not implemented” until Phase 5–6.

**Deliverable:** Gateway structure ready for adding service proxies in next phases.

---

## Phase 4 — Exit Criteria

- [ ] Client can login only through gateway (/api/auth/*).
- [ ] Protected routes require valid JWT; gateway forwards userId and role.
- [ ] Rate limiting and logging in place.
- [ ] Docker Compose (if used) runs gateway + auth + DB; SETUP.md updated.

---

---

# Phase 5: Electricity Service (First Utility)

**Goal:** Fetch electricity bill by consumer ID; record payment and return success (demo payment); support receipt generation flow.

**Estimated duration:** 5–7 days  
**Dependencies:** Phase 2, 4 complete

---

## Phase 5 — Sub-Phase 5.1: Electricity Service Skeleton

- [ ] Create electricity service under backend (e.g. `backend/services/electricity/`).
- [ ] Add GET /bill/:consumerId (or query ?consumerId=) — returns bill for consumer; 404 if not found.
- [ ] Add GET /health.
- [ ] Connect to DB; read electricity_bills (or bills where service_type=electricity).
- [ ] Gateway: add proxy /api/electricity/* → electricity service.

**Deliverable:** GET /api/electricity/bill/:consumerId returns bill from DB (seed one bill for testing).

---

## Phase 5 — Sub-Phase 5.2: Bill Response Schema

- [ ] Return JSON: { consumerId, amount, dueDate, period, status } (and any extra fields from DB).
- [ ] Document in OpenAPI; ensure gateway forwards JWT so service can optionally validate user owns consumerId (or allow any for demo).

**Deliverable:** Bill API contract in OpenAPI; electricity service returns consistent schema.

---

## Phase 5 — Sub-Phase 5.3: Payment Trigger (Electricity)

- [ ] Electricity service: POST /pay or delegate to payment service. Decision: electricity service calls payment service internally, or gateway receives POST /api/electricity/pay and gateway calls payment service.
- [ ] Preferred: gateway exposes POST /api/payments/pay (body: serviceType, consumerId, amount, userId from JWT); payment service records transaction and returns success. Electricity service only fetches bill; payment is centralized in Phase 6.
- [ ] For Phase 5 minimal: add POST /api/electricity/pay that creates a transaction row (status=success for demo) and returns { transactionId, status: 'success' }. Implement in electricity service or stub in gateway.
- [ ] Ensure transactions table has row for audit.

**Deliverable:** “Pay” for electricity creates transaction and returns transactionId.

---

## Phase 5 — Exit Criteria

- [ ] GET /api/electricity/bill/:consumerId returns bill (with gateway JWT).
- [ ] POST pay (electricity) creates transaction and returns transactionId.
- [ ] OpenAPI updated for electricity and payment flow.

---

---

# Phase 6: Payment & Document Services

**Goal:** Centralized payment flow (demo: mock success); document service generates receipt (PDF or printable HTML) and optional QR.

**Estimated duration:** 5–7 days  
**Dependencies:** Phase 5 complete

---

## Phase 6 — Sub-Phase 6.1: Payment Service

- [ ] Create payment service under backend.
- [ ] POST /pay (or /initiate + /confirm for two-step): accept { serviceType, consumerId, amount, userId } (userId from gateway JWT).
- [ ] Validate amount against bill (optional for demo: accept any amount).
- [ ] Insert row in transactions; return { transactionId, status: 'success' } (demo mode).
- [ ] If real gateway: integrate Razorpay/Paytm; webhook for confirmation; update transaction status.
- [ ] Call document service to generate receipt (or return transactionId and let client call GET /documents/receipt/:transactionId).

**Deliverable:** Payment service records transaction; returns transactionId. Gateway proxies /api/payments/* to payment service.

---

## Phase 6 — Sub-Phase 6.2: Document / Receipt Service

- [ ] Create document service under backend.
- [ ] GET /receipt/:transactionId — returns PDF or HTML (printable). Fetch transaction and bill from DB; fill template; return file or HTML.
- [ ] Use PDFKit (Node) or ReportLab/WeasyPrint (Python); or return HTML and use browser print.
- [ ] Add optional QR in receipt: link to “view receipt online” or continue-session URL (Phase 16).
- [ ] Gateway: GET /api/documents/receipt/:transactionId → document service.

**Deliverable:** Client can get receipt by transactionId; printable.

---

## Phase 6 — Sub-Phase 6.3: Electricity Flow End-to-End (Backend)

- [ ] Kiosk (or Postman): login → GET electricity bill → POST pay (via gateway) → GET receipt. All via gateway with JWT.
- [ ] Payment service calls document service or kiosk calls GET /api/documents/receipt/:transactionId after pay.
- [ ] Verify transaction and receipt in DB.

**Deliverable:** Full electricity pay + receipt flow works from API perspective.

---

## Phase 6 — Exit Criteria

- [ ] Payment service accepts pay request; records transaction; returns transactionId.
- [ ] Document service returns receipt (PDF or HTML) for transactionId.
- [ ] Gateway routes /api/payments/* and /api/documents/* correctly.

---

---

# Phase 7: Kiosk UI — Core Flow (First End-to-End)

**Goal:** Citizen uses kiosk: Welcome → Language → Login (OTP) → Service choice → Electricity → Bill view → Pay → Receipt/print. Full E2E with real backend.

**Estimated duration:** 7–10 days  
**Dependencies:** Phase 4, 5, 6 complete

---

## Phase 7 — Sub-Phase 7.1: Kiosk Project Setup

- [ ] Create React app in kiosk-ui/ (Vite + React + TypeScript recommended).
- [ ] Add React Router; structure routes: /, /login, /services, /electricity, /electricity/bill, /electricity/pay, /receipt.
- [ ] Add Axios (or fetch) with base URL from env (gateway URL); attach JWT to requests (store token in state/context after login).
- [ ] Add state management (Context or Zustand): user, token, selectedLanguage, selectedService.
- [ ] Configure proxy in dev (e.g. Vite proxy to gateway) to avoid CORS during development.

**Deliverable:** Kiosk app runs; can call gateway; token stored and sent in headers.

---

## Phase 7 — Sub-Phase 7.2: Welcome & Language Selection

- [ ] Screen 1: Welcome message; buttons for language (English, Hindi at minimum). Store language in state; use it for all labels (hardcoded for now; i18n in Phase 14).
- [ ] Large touch-friendly buttons; simple layout.
- [ ] “Next” or “Proceed” to go to Login.

**Deliverable:** Welcome screen with language choice; navigates to login.

---

## Phase 7 — Sub-Phase 7.3: Login (OTP)

- [ ] Screen: input mobile number; “Send OTP” button. Call POST /api/auth/otp/send.
- [ ] Input OTP; “Verify” button. Call POST /api/auth/otp/verify; store token and user in state; redirect to Service choice.
- [ ] Optional: Consumer ID input (or skip for demo).
- [ ] Handle errors (invalid OTP, network); show message.
- [ ] Session timeout: optional timer; on expiry clear token and redirect to Welcome (Phase 15).

**Deliverable:** User can login with mobile + OTP; token stored; redirect to services.

---

## Phase 7 — Sub-Phase 7.4: Service Choice & Electricity

- [ ] Screen: four tiles/cards — Electricity, Gas, Water, Municipal. Only Electricity wired; others can show “Coming soon” or navigate to placeholder.
- [ ] On Electricity: navigate to Electricity flow (e.g. /electricity).
- [ ] Electricity: ask for Consumer ID (input); “Fetch Bill” calls GET /api/electricity/bill/:consumerId.
- [ ] Show bill (amount, due date, period); “Pay Now” button.

**Deliverable:** User can select Electricity, enter consumer ID, see bill.

---

## Phase 7 — Sub-Phase 7.5: Pay & Receipt

- [ ] On “Pay Now”: call POST /api/payments/pay (or /api/electricity/pay) with consumerId, amount; get transactionId.
- [ ] Navigate to receipt: GET /api/documents/receipt/:transactionId (or open in new tab); or show success screen with “Print Receipt” that fetches receipt and triggers window.print().
- [ ] Receipt screen: show transaction ID, amount, date; “Print” button; “Done” to go back to Service choice or Logout.

**Deliverable:** User can pay and see/print receipt; full E2E electricity flow works.

---

## Phase 7 — Sub-Phase 7.6: Logout & Navigation Guard

- [ ] Logout: clear token and user; redirect to Welcome.
- [ ] Protect routes: if no token and route is not Welcome/Login, redirect to Login.
- [ ] Optional: “Back” from Service choice to Login; from Electricity to Service choice.

**Deliverable:** Logout works; unauthenticated users cannot access services.

---

## Phase 7 — Exit Criteria

- [ ] Full flow: Welcome → Language → Login (OTP) → Service choice → Electricity → Bill → Pay → Receipt/print.
- [ ] All calls go through gateway with JWT.
- [ ] Data persists in PostgreSQL; receipt is viewable/printable.

---

---

# Phase 8: Gas, Water, Municipal Services (Backend)

**Goal:** Replicate electricity pattern for Gas, Water, Municipal: bill fetch and pay (reuse payment and document services).

**Estimated duration:** 5–7 days  
**Dependencies:** Phase 5, 6 complete

---

## Phase 8 — Sub-Phase 8.1: Gas Service

- [ ] Create gas service (or extend single “utility” service with serviceType=gas).
- [ ] DB: gas_bills table or bills with service_type=gas; add migration.
- [ ] GET /api/gas/bill/:consumerId (or :connectionId); POST /api/payments/pay with serviceType=gas.
- [ ] Gateway: proxy /api/gas/* to gas service.
- [ ] Seed one gas bill for testing.

**Deliverable:** Gas bill fetch and pay work via API.

---

## Phase 8 — Sub-Phase 8.2: Water Service

- [ ] Same as 8.1 for water: water_bills or bills with service_type=water; GET /api/water/bill/:consumerId; pay via payment service.
- [ ] Gateway: proxy /api/water/* to water service.
- [ ] Seed one water bill.

**Deliverable:** Water bill fetch and pay work via API.

---

## Phase 8 — Sub-Phase 8.3: Municipal Service

- [ ] Municipal bills or service requests: GET /api/municipal/bill/:consumerId or /api/municipal/services; pay via payment service.
- [ ] Gateway: proxy /api/municipal/* to municipal service.
- [ ] Seed one municipal bill or demo data.

**Deliverable:** Municipal bill fetch and pay work via API.

---

## Phase 8 — Exit Criteria

- [ ] Gas, Water, Municipal each have bill API and payment flow (same payment and document services).
- [ ] Gateway routes all four utilities; OpenAPI updated.

---

---

# Phase 9: Complaint & Grievance Service

**Goal:** Register complaint (category, description); return reference number; status lifecycle (Registered → In Progress → Resolved); optional priority (Emergency/High/Normal).

**Estimated duration:** 5–7 days  
**Dependencies:** Phase 2, 4 complete

---

## Phase 9 — Sub-Phase 9.1: Complaint Registration API

- [ ] Create complaint service under backend.
- [ ] POST /api/complaints — body: { category, description, userId (from JWT), optional priority }. Insert into complaints; generate reference_number (e.g. SUV-YYYYMMDD-XXXX); return { referenceNumber, complaintId }.
- [ ] GET /api/complaints/status/:referenceNumber — return complaint status (registered / in_progress / resolved) and details (no PII beyond what user owns).
- [ ] Gateway: proxy /api/complaints/* to complaint service; JWT required.

**Deliverable:** Citizen can register complaint and get reference number; can check status by reference number.

---

## Phase 9 — Sub-Phase 9.2: Complaint Categories & Priority

- [ ] Categories: power_outage, gas_leakage, water_issue, sanitation, other (or per FEATURES_AND_INNOVATION.md).
- [ ] Priority: emergency, high, normal. Store in complaints.priority; use in admin filters and sorting (Phase 11).
- [ ] Update OpenAPI for complaints.

**Deliverable:** Complaints have category and priority; API and DB aligned.

---

## Phase 9 — Exit Criteria

- [ ] POST /api/complaints and GET /api/complaints/status/:referenceNumber work.
- [ ] Complaints table has reference_number, status, priority; admin can update status (Phase 11).

---

---

# Phase 10: Kiosk UI — All Services & Complaints

**Goal:** Kiosk supports Gas, Water, Municipal (same flow as Electricity); plus complaint registration and status lookup.

**Estimated duration:** 5–7 days  
**Dependencies:** Phase 7, 8, 9 complete

---

## Phase 10 — Sub-Phase 10.1: Gas, Water, Municipal Screens

- [ ] From Service choice: wire Gas, Water, Municipal to same flow as Electricity (consumer ID → fetch bill → pay → receipt). Use same receipt component; pass serviceType to payment API.
- [ ] Reuse bill display and pay components; only API endpoint and labels change per service.
- [ ] Add “Back to services” after receipt.

**Deliverable:** User can complete bill pay for all four utilities from kiosk.

---

## Phase 10 — Sub-Phase 10.2: Complaint Registration Screen

- [ ] New route: /complaints or from Service choice “Register Complaint”.
- [ ] Form: category dropdown, description text area, optional priority (or auto-set by category). Submit → POST /api/complaints; show success with reference number.
- [ ] “Write down or print reference number” message; optional “Print” for acknowledgment (document service can add GET /api/documents/complaint-ack/:complaintId later).

**Deliverable:** User can register complaint and see reference number.

---

## Phase 10 — Sub-Phase 10.3: Complaint Status Lookup

- [ ] Screen: “Track complaint” — input reference number; “Check status” calls GET /api/complaints/status/:referenceNumber; display status and short details.
- [ ] Link from success screen after registration (“Track this complaint”).

**Deliverable:** User can track complaint by reference number on kiosk.

---

## Phase 10 — Exit Criteria

- [ ] All four utilities (Electricity, Gas, Water, Municipal) have full pay + receipt flow on kiosk.
- [ ] Complaint registration and status lookup work on kiosk.

---

---

# Phase 11: Admin Dashboard — Core

**Goal:** Admin can log in; view and update complaints; see basic dashboard (total complaints, resolved count, bill payment count).

**Estimated duration:** 6–8 days  
**Dependencies:** Phase 9 complete

---

## Phase 11 — Sub-Phase 11.1: Admin UI Project Setup

- [ ] Create React app in admin-ui/ (Vite + React + TypeScript).
- [ ] Add React Router; routes: /login, /dashboard, /complaints, (later /analytics, /advisories).
- [ ] Axios + base URL to gateway; store admin JWT after login; send in Authorization header.
- [ ] Admin login: POST /api/auth/admin/login (or same OTP with admin user) and get JWT with role=admin.

**Deliverable:** Admin app runs; admin can login and get JWT.

---

## Phase 11 — Sub-Phase 11.2: Complaints List & Update

- [ ] GET /api/complaints/list (or /api/admin/complaints) — returns all complaints with filters (status, service/category, priority). Implement in complaint service; gateway route only for admin role (check JWT role).
- [ ] Admin UI: table of complaints; columns: reference number, category, priority, status, created date. Filter by status and priority.
- [ ] “Update status” dropdown or buttons: Registered → In Progress → Resolved. PATCH /api/complaints/:id with { status }.
- [ ] Optional: assign to department (demo: dropdown; store in DB if column exists).

**Deliverable:** Admin can list complaints, filter, and update status.

---

## Phase 11 — Sub-Phase 11.3: Dashboard Counts

- [ ] GET /api/analytics/dashboard or /api/admin/dashboard — returns { totalComplaints, resolvedComplaints, billsPaidCount (from transactions), activeSessions (optional) }. Implement in analytics service (or complaint service + payment DB read) with admin-only route.
- [ ] Admin dashboard page: cards or numbers for total complaints, resolved, bills paid; link to complaints list.
- [ ] Gateway: /api/analytics/* or /api/admin/* → analytics or respective service; middleware: allow only role=admin.

**Deliverable:** Admin dashboard shows key counts; admin can navigate to complaints.

---

## Phase 11 — Exit Criteria

- [ ] Admin can login and see dashboard with counts.
- [ ] Admin can list, filter, and update complaint status.
- [ ] All admin routes require JWT with role=admin; gateway enforces.

---

---

# Phase 12: Analytics, Reports & Content Management

**Goal:** Admin can see usage stats (sessions, bills paid, complaints by day/week); service-wise breakdown; peak hours; export CSV/PDF. Admin can create/edit advisories and FAQs.

**Estimated duration:** 6–8 days  
**Dependencies:** Phase 11 complete

---

## Phase 12 — Sub-Phase 12.1: Analytics API

- [ ] GET /api/analytics/usage — query params: fromDate, toDate, groupBy=day|week. Return time series: sessions count, bills paid count, complaints count per period.
- [ ] GET /api/analytics/service-breakdown — bills paid and complaints by service (electricity, gas, water, municipal).
- [ ] GET /api/analytics/peak-hours — usage by hour of day (from sessions or transactions).
- [ ] Implement in analytics service (or extend complaint + transaction queries); admin-only.

**Deliverable:** Analytics APIs return data for dashboard charts.

---

## Phase 12 — Sub-Phase 12.2: Admin Charts & Reports

- [ ] Admin UI: charts (Recharts or Chart.js) for usage over time, service breakdown, peak hours.
- [ ] “Export report” button: fetch data and generate CSV or PDF (client-side or GET /api/analytics/export?format=csv|pdf). Simple CSV export is enough for MVP; PDF can be backend.
- [ ] Document in user manual: how to view analytics and export.

**Deliverable:** Admin can view charts and export report (CSV minimum).

---

## Phase 12 — Sub-Phase 12.3: Content & Advisories (Backend)

- [ ] Table advisories: id, title, body, type (announcement|outage|emergency), active_from, active_until, created_at. Migration.
- [ ] Admin API: POST/PUT /api/admin/advisories, GET /api/admin/advisories. Public (kiosk) API: GET /api/notifications/advisories (active only).
- [ ] Notification service or dedicated content service; gateway routes.
- [ ] Optional: FAQs table and CRUD for admin; GET /api/notifications/faqs for kiosk.

**Deliverable:** Advisories stored and retrievable; admin can create/edit; kiosk can fetch active advisories.

---

## Phase 12 — Exit Criteria

- [ ] Admin can see usage and service breakdown and peak hours; export CSV (or PDF).
- [ ] Admin can manage advisories; kiosk can fetch active advisories (display in Phase 13).

---

---

# Phase 13: Notifications & Emergency Alerts (Kiosk Display)

**Goal:** Kiosk shows advisories (strip or modal); optional “emergency alert” mode when active alert exists. Admin can trigger emergency alert.

**Estimated duration:** 3–5 days  
**Dependencies:** Phase 12 complete

---

## Phase 13 — Sub-Phase 13.1: Kiosk Advisory Display

- [ ] Kiosk: on load or interval (e.g. every 5 min), GET /api/notifications/advisories. Display in a top strip or dismissible modal; respect active_from/active_until.
- [ ] If type=emergency: show prominently; optional “Emergency alert” mode (full-screen or persistent banner) until dismissed or expired.

**Deliverable:** Kiosk shows active advisories; emergency type has prominent display.

---

## Phase 13 — Sub-Phase 13.2: Admin Emergency Alert

- [ ] Admin UI: “Create advisory” with type “Emergency”; set active_from now, active_until (e.g. 2 hours). Save via POST /api/admin/advisories.
- [ ] Kiosks that poll /api/notifications/advisories will show it; no push required for MVP.

**Deliverable:** Admin can publish emergency alert; kiosk shows it.

---

## Phase 13 — Exit Criteria

- [ ] Kiosk displays advisories; emergency alerts are prominent.
- [ ] Admin can create advisories including emergency type.

---

---

# Phase 14: Multilingual (i18n) & Accessibility

**Goal:** Kiosk supports English and Hindi (minimum); large-font and high-contrast modes; focus and touch targets per accessibility guidelines.

**Estimated duration:** 5–7 days  
**Dependencies:** Phase 7, 10 complete

---

## Phase 14 — Sub-Phase 14.1: i18n Setup

- [ ] Add react-i18next (or similar) to kiosk-ui. Create locale files: en.json, hi.json (and optional regional).
- [ ] Extract all user-facing strings into keys (welcome.title, login.mobile, services.electricity, etc.).
- [ ] Language selector on Welcome screen sets i18n language and persists (localStorage or state).
- [ ] Verify all screens use t('key') for text; no hardcoded English/Hindi in UI.

**Deliverable:** Kiosk supports English and Hindi; language selectable at start.

---

## Phase 14 — Sub-Phase 14.2: Accessibility — Large Font & High Contrast

- [ ] Add theme/context: normal, largeFont, highContrast. Toggle in Welcome or Settings (e.g. “Accessibility options”).
- [ ] CSS: largeFont increases base font-size; highContrast uses high-contrast colors (e.g. white on dark, larger borders).
- [ ] Ensure focus visible (outline) and touch targets at least 44px; test with keyboard and touch.

**Deliverable:** User can switch to large font and high contrast; focus and touch targets meet basic accessibility.

---

## Phase 14 — Sub-Phase 14.3: Voice (Optional)

- [ ] Optional: add text-to-speech for current screen title or key instructions (e.g. “Select your language”). Use browser SpeechSynthesis API or lightweight library.
- [ ] Toggle “Voice guidance on/off” in accessibility options.

**Deliverable:** Optional voice guidance for key steps; can be disabled.

---

## Phase 14 — Exit Criteria

- [ ] At least English and Hindi; all kiosk strings from locale files.
- [ ] Large font and high contrast work; accessibility options discoverable.
- [ ] Optional voice implemented or explicitly deferred with note in docs.

---

---

# Phase 15: Security Hardening & Compliance

**Goal:** TLS everywhere; rate limiting and session timeout; audit log for payments and complaint updates; COMPLIANCE.md documenting DPDP/IT Act alignment.

**Estimated duration:** 4–6 days  
**Dependencies:** Phase 4, 11 complete

---

## Phase 15 — Sub-Phase 15.1: TLS & Environment

- [ ] Ensure production deployment uses HTTPS (TLS). Document in DEPLOYMENT.md: use reverse proxy (e.g. Nginx) or platform TLS.
- [ ] No secrets in frontend; all in env vars or secret manager. Review .env.example; document where JWT_SECRET, DB URL, API keys are set.

**Deliverable:** Deployment doc states HTTPS; secrets not in repo.

---

## Phase 15 — Sub-Phase 15.2: Session Timeout & Auto-Logout

- [ ] Kiosk: inactivity timer (e.g. 5–10 min); on expiry clear token and redirect to Welcome. Show “Session expired” message.
- [ ] Admin: same or longer timeout; redirect to admin login.
- [ ] Optional: backend session expiry aligned with JWT exp; optional refresh token flow.

**Deliverable:** Kiosk and admin auto-logout on inactivity; user sees message.

---

## Phase 15 — Sub-Phase 15.3: Audit Logging

- [ ] For every payment (transaction insert) and complaint status update: insert row in audit_log (user_id, action, entity_type, entity_id, payload, created_at).
- [ ] Optional: admin view “Audit log” (filter by date, action); or export for compliance. Document that audit log exists and what is recorded.

**Deliverable:** Critical actions (payment, complaint update) written to audit_log.

---

## Phase 15 — Sub-Phase 15.4: COMPLIANCE.md

- [ ] Create docs/COMPLIANCE.md: describe data stored (minimal: mobile, consumer_id, transactions, complaints); retention approach; consent/notice (e.g. “By using kiosk you agree…”); alignment with DPDP Act and IT Act; audit log usage.

**Deliverable:** COMPLIANCE.md in repo; evaluators can read privacy and compliance approach.

---

## Phase 15 — Exit Criteria

- [ ] HTTPS documented; session timeout and audit log implemented.
- [ ] COMPLIANCE.md describes privacy and compliance.

---

---

# Phase 16: Innovation Features (QR, Voice, Priority)

**Goal:** QR “continue on mobile”; complaint priority visible and filterable; optional voice guidance (if not done in Phase 14). Demo differentiation.

**Estimated duration:** 4–6 days  
**Dependencies:** Phase 10, 11, 14 complete

---

## Phase 16 — Sub-Phase 16.1: QR “Continue on Mobile”

- [ ] At any step (e.g. after bill view or before pay), kiosk can generate QR code containing: session token or request ID + deep link URL (e.g. https://suvidha.demo/continue?token=xxx).
- [ ] Backend: GET /api/session/resume?token=xxx returns state (e.g. bill, transactionId) so mobile page can show same and allow “Continue payment” or “View receipt”.
- [ ] Simple mobile-friendly page (or same React app with /continue route): scan opens URL; page fetches state and shows “Continue on this device” or receipt. Optional: complete payment on mobile (same payment API with token).
- [ ] Use qrcode.react (or similar) in kiosk to render QR.

**Deliverable:** User can scan QR and continue or view receipt on phone; backend supports resume by token.

---

## Phase 16 — Sub-Phase 16.2: Complaint Priority in Admin & Kiosk

- [ ] Admin: complaints list and filters include priority (Emergency / High / Normal); sort by priority. Already in DB from Phase 9; ensure UI shows and filters.
- [ ] Kiosk: when registering complaint, user can select priority or it’s auto-set by category (e.g. gas_leak → emergency). Document in user manual.

**Deliverable:** Priority visible and filterable in admin; optional priority selection on kiosk.

---

## Phase 16 — Sub-Phase 16.3: Voice Guidance (If Not in Phase 14)

- [ ] If voice was deferred: implement TTS for current screen title and key instruction; toggle in accessibility. Same as Phase 14.3.

**Deliverable:** Voice guidance available or explicitly out of scope with note.

---

## Phase 16 — Exit Criteria

- [ ] QR continuation works: scan → resume or view receipt on mobile.
- [ ] Complaint priority in admin (and kiosk if applicable).
- [ ] At least one innovation (QR or voice or priority) clearly demo-able.

---

---

# Phase 17: Demo Data, Testing & Polish

**Goal:** Seed data for demo; one-click or script to reset demo; “Demo mode” label; basic testing and bug fixes.

**Estimated duration:** 4–6 days  
**Dependencies:** Phase 10, 11 complete

---

## Phase 17 — Sub-Phase 17.1: Seed Data Script

- [ ] Script (e.g. scripts/seed-demo.js or scripts/seed_demo.py): create demo users (1–2 citizens, 1 admin), demo bills (electricity, gas, water, municipal for test consumer IDs), demo complaints (few with different statuses and priorities).
- [ ] Document: run script after migrations; “Demo consumer IDs: ELEC001, GAS001, …” in SETUP.md or USER_MANUAL.md.
- [ ] Optional: script to reset DB (drop data, re-run migrations, re-seed) for clean demo.

**Deliverable:** One command seeds demo data; document consumer IDs and credentials.

---

## Phase 17 — Sub-Phase 17.2: Demo Mode Label & Warnings

- [ ] Kiosk and payment screens show “Demo mode” or “For demonstration only” so evaluators know it’s not production.
- [ ] Admin: same if applicable. Optional: banner “Demo environment”.

**Deliverable:** Demo mode clearly labeled; no confusion with production.

---

## Phase 17 — Sub-Phase 17.3: Testing & Bug Fixes

- [ ] Run through full flows: login (citizen + admin), all four utilities pay + receipt, complaint register + track, admin update complaint, admin analytics and export.
- [ ] Fix critical bugs; document known limitations (e.g. “Payment is simulated”).
- [ ] Optional: add a few unit tests (auth, payment, complaint) and one E2E test (e.g. Playwright for kiosk login → electricity pay).

**Deliverable:** Demo flows work end-to-end; known issues documented; optional tests added.

---

## Phase 17 — Exit Criteria

- [ ] Demo seed runs; demo consumer IDs and credentials documented.
- [ ] Demo mode labeled; full E2E flows pass manual test.
- [ ] Optional: automated tests for critical paths.

---

---

# Phase 18: Deployment & DevOps

**Goal:** Full stack runnable via Docker Compose; deployment doc for single-server or cloud; kiosk and admin as static builds.

**Estimated duration:** 4–6 days  
**Dependencies:** Phase 17 complete

---

## Phase 18 — Sub-Phase 18.1: Docker Compose Full Stack

- [ ] docker-compose.yml includes: PostgreSQL, gateway, auth, electricity, gas, water, municipal, complaint, payment, notification, document, analytics (or combined backend image). Environment variables for each service.
- [ ] Build and run: `docker compose up --build` brings up entire backend + gateway; frontends built and served by Nginx or separate static server in Compose.
- [ ] Optional: single “backend” image that runs all services (e.g. Node with multiple processes) for simpler demo.

**Deliverable:** One command runs full stack (DB + gateway + all services + optional static hosting).

---

## Phase 18 — Sub-Phase 18.2: Frontend Build & Serve

- [ ] Build kiosk-ui and admin-ui (e.g. npm run build); output static files. Serve via Nginx in Docker or place in gateway public folder.
- [ ] Document: production build steps; env vars for API base URL (e.g. VITE_GATEWAY_URL).

**Deliverable:** Kiosk and admin builds; served over same host or separate; CORS and base URL correct.

---

## Phase 18 — Sub-Phase 18.3: Deployment Documentation

- [ ] docs/DEPLOYMENT.md: prerequisites (Docker, etc.); clone repo; copy .env.example to .env and fill; docker compose up; how to run migrations; how to seed; URLs for kiosk and admin. Optional: single-server deploy, cloud (e.g. AWS/GCP) high-level steps.

**Deliverable:** DEPLOYMENT.md allows a reviewer to run full demo locally or on a server.

---

## Phase 18 — Exit Criteria

- [ ] Full stack runs with Docker Compose; kiosk and admin accessible in browser.
- [ ] DEPLOYMENT.md complete; README links to it.

---

---

# Phase 19: Documentation & Handover

**Goal:** User manuals (citizen + admin); technical docs updated; README final. Ready for handover and evaluation.

**Estimated duration:** 3–5 days  
**Dependencies:** Phase 17, 18 complete

---

## Phase 19 — Sub-Phase 19.1: User Manual — Citizen

- [ ] docs/USER_MANUAL_CITIZEN.md (or in-app help): how to select language; how to login (mobile + OTP); how to pay bill (choose service, enter consumer ID, pay, get receipt); how to register complaint and get reference number; how to track complaint; how to use accessibility options (large font, high contrast, voice); how to print receipt. Screenshots optional.

**Deliverable:** Citizen user manual in repo.

---

## Phase 19 — Sub-Phase 19.2: User Manual — Admin

- [ ] docs/USER_MANUAL_ADMIN.md: how to login; dashboard (counts, charts); how to list and filter complaints; how to update complaint status; how to create advisories and emergency alerts; how to export reports; optional: how to view audit log.

**Deliverable:** Admin user manual in repo.

---

## Phase 19 — Sub-Phase 19.3: Technical Documentation

- [ ] Ensure docs/ARCHITECTURE.md is up to date (all services, data flow).
- [ ] docs/API.md or link to OpenAPI: list of main endpoints and purpose; link to OpenAPI spec (Swagger UI if hosted).
- [ ] SETUP.md and DEPLOYMENT.md reviewed and complete.
- [ ] COMPLIANCE.md and IMPLEMENTATION_PLAN.md linked from README.

**Deliverable:** Architecture, API overview, SETUP, DEPLOYMENT, COMPLIANCE all current and linked.

---

## Phase 19 — Sub-Phase 19.4: README Finalization

- [ ] Root README.md: project name; one-line description; “What is SUVIDHA”; how to run demo (link to SETUP.md and DEPLOYMENT.md); link to docs (ARCHITECTURE, FEATURES_AND_INNOVATION, TECH_STACK, MASTER_PLAN); link to problem statement or hackathon guidelines if applicable.
- [ ] Short “Quick start” section: clone, install, docker compose up, open kiosk URL and admin URL.

**Deliverable:** README is the entry point; evaluator can run demo and find all docs.

---

## Phase 19 — Exit Criteria

- [ ] USER_MANUAL_CITIZEN.md and USER_MANUAL_ADMIN.md exist.
- [ ] Technical docs and README complete and linked.
- [ ] Project ready for handover and evaluation.

---

---

# Phase 20: DPI & Indigenous Tech Integration

**Goal:** Integrate or document alignment with India’s Digital Public Infrastructure (DPI) for production and proposal enhancement (Atmanirbhar Bharat, MeitY, Smart City 2.0).

**Estimated duration:** Post–MVP; can run in parallel or after Phase 19  
**Dependencies:** Core SUVIDHA (auth, bill, complaint, admin) stable (Phase 7–12 complete)

---

## Phase 20 — Sub-Phase 20.1: BBPS (Bharat Bill Payment System)

- [ ] Research BBPS Agent onboarding and API (bill fetch, payment).
- [ ] Integrate or wrap bill fetch/pay via BBPS APIs (replace or augment mock billing for Electricity, Gas, Water, Municipal).
- [ ] Document: SUVIDHA as BBPS Agent; single API for utility bills; Consumer ID / Mobile across BBPS-onboarded billers.

**Deliverable:** BBPS integration (demo/API) or documented deferral with reason.

---

## Phase 20 — Sub-Phase 20.2: Bhashini (TTS / ASR)

- [ ] Integrate Bhashini TTS API in kiosk for menu/bill in selected regional language.
- [ ] Integrate Bhashini ASR for voice complaint flow (native dialect → translated for Admin).
- [ ] Document: language and voice-complaint flows; fallback to react-i18next if API unavailable.

**Deliverable:** Bhashini TTS/ASR in kiosk (demo/API) or documented deferral.

---

## Phase 20 — Sub-Phase 20.3: DigiLocker

- [ ] Implement consent flow for citizen; fetch verified ID/Address from DigiLocker for new connection or KYC.
- [ ] Push receipts and No Dues Certificates to citizen DigiLocker (API integration).
- [ ] Document: KYC and issuance flows; security and consent.

**Deliverable:** DigiLocker fetch/push (demo/API) or documented deferral.

---

## Phase 20 — Sub-Phase 20.4: MeriPehchaan / Parichay (SSO)

- [ ] Integrate MeriPehchaan (or Parichay) for Admin login via government SSO.
- [ ] Optional: citizen login via Jan Parichay; document scope and fallback (OTP).
- [ ] Document: SSO flow; role mapping.

**Deliverable:** Admin SSO via MeriPehchaan (demo/API) or documented deferral.

---

## Phase 20 — Sub-Phase 20.5: MeghRaj (GI Cloud)

- [ ] Document deployment runbook and config for Government of India cloud (MeghRaj).
- [ ] No code change required if stack is already containerized (Docker); adjust env and networking.
- [ ] Document: data sovereignty and localization; compliance.

**Deliverable:** MeghRaj deployment doc and (optional) demo environment.

---

## Phase 20 — Sub-Phase 20.6: Mappls (MapmyIndia)

- [ ] Geo-tag complaints (lat/long) in Complaint service; capture from kiosk or admin.
- [ ] Optional: utility outage map on kiosk using Mappls.
- [ ] Document: geo-tagging and map usage; replace any generic map references.

**Deliverable:** Mappls geo-tag (and optional map) (demo/API) or documented deferral.

---

## Phase 20 — Exit Criteria

- [ ] Each chosen DPI component is either integrated (demo/API) or clearly deferred with reason in docs.
- [ ] TECH_STACK.md, FEATURES_AND_INNOVATION.md, and proposal (PROFORMA) reflect DPI alignment and indigenized tech table.
- [ ] docs/Enhancement/ENHANCEMENT_DPI_SUMMARY.md (and optional ENHANCEMENT_DPI_INTEGRATION.md) updated.

---

---

# Phase Status Table (Progress Tracking)

Use this table to track completion. Mark with [x] or replace Pending with Done/In Progress and date.

| Phase | Name | Status | Notes |
|-------|------|--------|-------|
| 0 | Project Foundation & Governance | Pending | |
| 1 | Repository & Development Environment | Pending | |
| 2 | Database & Data Layer Foundation | Pending | |
| 3 | Authentication Service | Pending | |
| 4 | API Gateway | Pending | |
| 5 | Electricity Service (First Utility) | Pending | |
| 6 | Payment & Document Services | Pending | |
| 7 | Kiosk UI — Core Flow (First E2E) | Pending | |
| 8 | Gas, Water, Municipal Services (Backend) | Pending | |
| 9 | Complaint & Grievance Service | Pending | |
| 10 | Kiosk UI — All Services & Complaints | Pending | |
| 11 | Admin Dashboard — Core | Pending | |
| 12 | Analytics, Reports & Content Management | Pending | |
| 13 | Notifications & Emergency Alerts (Kiosk) | Pending | |
| 14 | Multilingual (i18n) & Accessibility | Pending | |
| 15 | Security Hardening & Compliance | Pending | |
| 16 | Innovation Features (QR, Voice, Priority) | Pending | |
| 17 | Demo Data, Testing & Polish | Pending | |
| 18 | Deployment & DevOps | Pending | |
| 19 | Documentation & Handover | Pending | |
| 20 | DPI & Indigenous Tech Integration | Pending | |

---

# Sub-Phase Quick Index

| Phase | Sub-Phases |
|-------|------------|
| 0 | 0.1 Repo structure, 0.2 Tech stack lock-in, 0.3 API contract & OpenAPI, 0.4 SETUP.md & .env.example |
| 1 | 1.1 Docker DB, 1.2 Migrations setup, 1.3 Gateway stub, 1.4 Linting & formatting |
| 2 | 2.1 Core tables design, 2.2 Migrations for core tables, 2.3 Backend DB client |
| 3 | 3.1 Auth skeleton, 3.2 OTP send/verify, 3.3 Admin login & role, 3.4 Consumer ID optional |
| 4 | 4.1 Gateway routing to auth, 4.2 JWT middleware, 4.3 Rate limiting & logging, 4.4 Placeholder routes |
| 5 | 5.1 Electricity service skeleton, 5.2 Bill response schema, 5.3 Payment trigger |
| 6 | 6.1 Payment service, 6.2 Document/receipt service, 6.3 Electricity E2E backend |
| 7 | 7.1 Kiosk project setup, 7.2 Welcome & language, 7.3 Login OTP, 7.4 Service choice & electricity, 7.5 Pay & receipt, 7.6 Logout & guard |
| 8 | 8.1 Gas service, 8.2 Water service, 8.3 Municipal service |
| 9 | 9.1 Complaint registration API, 9.2 Categories & priority |
| 10 | 10.1 Gas/Water/Municipal screens, 10.2 Complaint registration screen, 10.3 Complaint status lookup |
| 11 | 11.1 Admin UI setup, 11.2 Complaints list & update, 11.3 Dashboard counts |
| 12 | 12.1 Analytics API, 12.2 Admin charts & reports, 12.3 Content & advisories backend |
| 13 | 13.1 Kiosk advisory display, 13.2 Admin emergency alert |
| 14 | 14.1 i18n setup, 14.2 Large font & high contrast, 14.3 Voice optional |
| 15 | 15.1 TLS & env, 15.2 Session timeout, 15.3 Audit logging, 15.4 COMPLIANCE.md |
| 16 | 16.1 QR continue on mobile, 16.2 Complaint priority, 16.3 Voice if deferred |
| 17 | 17.1 Seed data script, 17.2 Demo mode label, 17.3 Testing & bug fixes |
| 18 | 18.1 Docker Compose full stack, 18.2 Frontend build & serve, 18.3 DEPLOYMENT.md |
| 19 | 19.1 User manual citizen, 19.2 User manual admin, 19.3 Technical docs, 19.4 README final |
| 20 | 20.1 BBPS, 20.2 Bhashini, 20.3 DigiLocker, 20.4 MeriPehchaan, 20.5 MeghRaj, 20.6 Mappls |

---

*End of Master Plan. Update this document as phases complete; keep MASTER_PLAN.md in sync with IMPLEMENTATION_PLAN.md and other docs.*
