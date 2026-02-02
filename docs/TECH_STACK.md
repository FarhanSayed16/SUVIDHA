# SUVIDHA — Complete Technical Stack

This document lists the full technology stack for building and running SUVIDHA: frontend, gateway, backend services, database, security, DevOps, and tooling.

---

## 1. Presentation Layer (Frontend)

### 1.1 Kiosk UI

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | React.js | Touch-optimized SPA, component-based, strong ecosystem |
| **Language** | JavaScript / TypeScript | UI logic; TypeScript recommended for type safety |
| **Markup & styling** | HTML5, CSS3 | Structure and layout |
| **Build tool** | Vite / Create React App | Bundling, dev server, production build |
| **State management** | React Context / Redux / Zustand | Session, user, service selection state |
| **Internationalization (i18n)** | react-i18next | Multilingual (English, Hindi, regional); language selection at welcome |
| **Accessibility** | ARIA, focus management, theme CSS | Large-font mode, high-contrast, keyboard/touch targets; optional TTS (browser API or lightweight lib) |
| **HTTP client** | Axios / Fetch | API calls to gateway |
| **Routing** | React Router | Welcome → Login → Services → Bill → Pay → Receipt flows |
| **UI components** | Custom components + (optional) Material-UI / Chakra UI | Touch-friendly buttons, forms, modals |
| **QR code** | qrcode.react / similar | Generate QR for “continue on mobile” |
| **Print** | Browser print API / react-to-print | Receipt and document printing |

**Deployment:** Static build; runs in browser on physical kiosk hardware or web demo.

---

### 1.2 Admin Dashboard UI

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | React.js | Reuse patterns and (optionally) components from kiosk |
| **Language** | JavaScript / TypeScript | Same as kiosk |
| **Build tool** | Vite / Create React App | Same as kiosk |
| **State & API** | React Context or Redux + Axios/Fetch | Admin session, analytics, complaints, content |
| **Charts / tables** | Recharts / Chart.js, AG-Grid or similar | Analytics, complaint list, reports |
| **Auth** | JWT in headers; separate admin login flow | Role-based access (Admin only) |

**Deployment:** Static build; served over HTTPS; same API gateway as kiosk.

---

## 2. API Gateway Layer

| Category | Technology | Purpose |
|----------|------------|---------|
| **Runtime** | Node.js (Express / Fastify) **or** Python (FastAPI) | Single entrypoint for all client requests |
| **Responsibilities** | — | Route to microservices, verify JWT, rate limit, validate request, log |
| **Routing** | Express router / FastAPI sub-routes | `/api/auth/*`, `/api/electricity/*`, `/api/gas/*`, `/api/water/*`, `/api/municipal/*`, `/api/complaints/*`, `/api/payments/*`, `/api/notifications/*`, `/api/documents/*`, `/api/analytics/*` |
| **Auth middleware** | JWT verify (e.g. jsonwebtoken / PyJWT) | Validate token; forward `userId` / claims to backend |
| **Rate limiting** | express-rate-limit / slowapi | Prevent abuse |
| **Proxy** | http-proxy / uvicorn reverse proxy | Forward to backend services |
| **API contract** | OpenAPI (Swagger) | Document routes and payloads; store in repo |

**Alternative:** NGINX as reverse proxy in front of gateway for production (TLS termination, load balancing).

---

## 3. Backend Microservices Layer

**Communication:** REST APIs only; JSON payloads.

| Service | Suggested stack | Purpose |
|---------|------------------|---------|
| **Authentication** | Node.js (Express/Fastify) or Python (FastAPI) | OTP send/verify (Twilio or mock), JWT issue/refresh, session store |
| **Electricity** | Node.js or Python | Bill fetch by consumer ID, payment trigger, consumption history |
| **Gas** | Node.js or Python | Same as Electricity for gas |
| **Water** | Node.js or Python | Same as Electricity for water |
| **Municipal** | Node.js or Python | Municipal bills, service requests, grievances |
| **Complaint & Grievance** | Node.js or Python | Register complaint, status lifecycle (Registered → In Progress → Resolved), priority (Emergency/High/Normal), department mapping |
| **Payment** | Node.js or Python | Accept payment request, record transaction, integrate payment gateway (demo: mock success); call Document service for receipt |
| **Notification** | Node.js or Python | SMS/Email (simulated), emergency alerts, advisories; store in DB; kiosk fetches on interval |
| **Document** | Node.js or Python | PDF receipt (e.g. PDFKit / ReportLab), QR code generation, print-ready HTML/PDF |

**Common backend stack (pick one):**

- **Node.js:** Express or Fastify, TypeScript optional, `pg` (PostgreSQL), `jsonwebtoken`, `nodemailer` (optional for notifications).
- **Python:** FastAPI, SQLAlchemy or raw SQL, PyJWT, `reportlab` or `weasyprint` for PDF.

---

## 4. Data Layer

| Category | Technology | Purpose |
|----------|------------|---------|
| **Primary database** | PostgreSQL (recommended) or MySQL | Single DB to start; schema per “service” (tables or schemas) |
| **ORM / query** | Prisma (Node) / SQLAlchemy (Python) or raw SQL | Migrations, queries; no direct DB access from frontend |
| **Migrations** | Flyway / Alembic / SQL scripts in repo | Versioned schema changes |
| **Stored data** | Users, sessions, bills (electricity/gas/water/municipal), transactions, complaints, advisories, audit logs, analytics aggregates | Per ARCHITECTURE.md |

**No direct UI → DB;** all access via backend services.

---

## 5. Security & Compliance

| Category | Technology / Practice | Purpose |
|----------|----------------------|---------|
| **Authentication** | JWT (short-lived access token) | Stateless auth; gateway validates and forwards claims |
| **OTP** | Twilio / MSG91 or mock for demo | Mobile number + OTP login |
| **Transport** | TLS (HTTPS) | Encrypt all client–gateway and gateway–service traffic |
| **Secrets** | Environment variables / secret manager | No secrets in frontend or repo |
| **Rate limiting** | Gateway middleware | Protect auth and public APIs |
| **Session** | Timeout + auto-logout | Kiosk and admin; configurable duration |
| **Audit log** | DB table or dedicated service | Who did what, when (payments, complaint updates, admin actions) |
| **Compliance** | Design for DPDP Act, IT Act | Minimal data, consent/notice, document in COMPLIANCE.md |
| **Access control** | Role-based (Citizen / Admin) | Gateway and services enforce by role |

---

## 6. Payment Integration

| Category | Technology | Purpose |
|----------|------------|---------|
| **Demo** | Mock payment API | Always success; record transaction in DB |
| **Production-ready** | Payment gateway (e.g. Razorpay, Paytm, CCAvenue) | Secure payment; webhook for confirmation; integrate in Payment service |

---

## 7. DevOps, Deployment & Tooling

| Category | Technology | Purpose |
|----------|------------|---------|
| **Version control** | Git | Code and docs in repo |
| **Containerization** | Docker | One image per service (gateway, each microservice); optional single image for all backend |
| **Orchestration (local/demo)** | Docker Compose | PostgreSQL + gateway + backend services; `docker compose up` runs stack |
| **Environment** | .env / env files | DB URL, JWT secret, gateway URLs; provide `.env.example` in repo |
| **API docs** | OpenAPI (Swagger) | Contract in repo; optional Swagger UI served from gateway |
| **Frontend hosting** | Static hosting (Nginx, S3+CloudFront, Vercel, etc.) | Serve kiosk and admin builds |
| **Backend hosting** | VM / container platform (e.g. single server, AWS ECS, GCP Run) | Gateway + microservices; government cloud / on-premise as required |

---

## 8. Development & Quality (Recommended)

| Category | Technology | Purpose |
|----------|------------|---------|
| **Linting** | ESLint (frontend), Pylint/Flake8 (Python) | Code style and basic checks |
| **Formatting** | Prettier (JS/TS), Black (Python) | Consistent formatting |
| **Testing (unit)** | Jest (Node/React), Pytest (Python) | Service and component tests |
| **Testing (API)** | Postman / REST client / Jest + supertest | Call gateway and backend endpoints |
| **i18n** | react-i18next + JSON/PO files | English, Hindi (minimum); keys for all kiosk strings |

---

## 9. Summary Table (At a Glance)

| Layer | Technologies |
|-------|--------------|
| **Kiosk UI** | React, TypeScript/JS, Vite, react-i18next, Axios, React Router, QR lib, browser print |
| **Admin UI** | React, TypeScript/JS, Vite, Axios, Charts, tables |
| **API Gateway** | Node.js (Express/Fastify) or FastAPI; JWT, rate limit, OpenAPI |
| **Backend services** | Node.js or Python (FastAPI); REST; one service per domain |
| **Database** | PostgreSQL (or MySQL); migrations |
| **Auth** | JWT, OTP (Twilio or mock) |
| **Security** | TLS, rate limit, audit log, RBAC |
| **Payment** | Mock (demo) / Razorpay or similar (production) |
| **Documents** | PDF (PDFKit/ReportLab), QR generation |
| **DevOps** | Git, Docker, Docker Compose, .env |

---

## 10. Indigenized / DPI (Enhancement for Production)

SUVIDHA is designed to align with India’s **Digital Public Infrastructure (DPI)** and Smart City 2.0. The baseline stack above is used for development and demo; the following indigenized components are recommended for production and proposal alignment (Atmanirbhar Bharat, MeitY guidelines).

| Component | Baseline (Current) | Indigenized (DPI Proposal) |
|-----------|--------------------|----------------------------|
| **Utility Billing** | Custom APIs / mock billers | **BBPS** (Bharat Bill Payment System) — SUVIDHA as BBPS Agent; single API for Electricity, Gas, Water, Municipal; bill fetch by Consumer ID / Mobile across BBPS-onboarded billers |
| **Translation & Voice** | react-i18next / browser TTS | **Bhashini API** — TTS for menu/bill in regional languages; ASR for voice complaint in native dialect → translated for Admin |
| **Documents** | File upload / PDF download | **DigiLocker** — KYC: fetch verified ID/Address from citizen's DigiLocker; push receipts and No Dues Certificates to DigiLocker |
| **Maps & Geo** | (None or generic) | **Mappls** (MapmyIndia) — Geo-tag complaints (lat/long); optional utility outage maps on kiosk |
| **Authentication** | JWT + OTP (Twilio/mock) | **MeriPehchaan / Parichay** (National SSO) — Admin login via government SSO; optional citizen login via Jan Parichay |
| **Hosting** | Generic cloud (AWS/Azure) or on-premise | **MeghRaj** (GI Cloud) — Run full stack on Government of India cloud; data sovereignty and localization |

**Implementation:** See **MASTER_PLAN.md** Phase 20 (DPI & Indigenous tech integration) and **docs/Enhancement/ENHANCEMENT_DPI_SUMMARY.md**. Baseline stack remains for MVP; DPI components can be integrated post–core (BBPS and Bhashini first for highest citizen impact).

---

This stack aligns with **ARCHITECTURE.md**, **TECHNICAL_PROPOSAL.md**, and **IMPLEMENTATION_PLAN.md**. Lock one option per row (e.g. Node vs Python for gateway/backend) in Phase 0 and document it in `docs/SETUP.md`.
