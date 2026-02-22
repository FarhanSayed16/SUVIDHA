# SUVIDHA — Smart Urban Virtual Interactive Digital Helpdesk Assistant

SUVIDHA is a unified, touch-based, multilingual self-service KIOSK system designed to deliver essential civic services (Electricity, Gas, Water, Municipal) through a single digital interface. 

It is built on a scalable Node.js microservices architecture with a React.js client and adheres to Smart City 2.0 / DPI (Digital Public Infrastructure) guidelines, integrating BBPS, Bhashini, DigiLocker, MeriPehchaan, MeghRaj, and Mappls.

---

## 🚀 Quick Start / Demo Environments

To run the full stack locally (including the Postgres database, API Gateway, and frontend UI), see the deployment guides:
1. **[Setup & Development Details](docs/SETUP.md)** - Raw local builds.
2. **[Production Deployment (Docker & MeghRaj)](docs/DEPLOYMENT.md)** - Secure DPI containerization.
3. **[Database Seeding Guide](docs/SEED_GUIDE.md)** - How to inject Demo mock data.

---

## 📖 User Manuals

Are you evaluating the Kiosk interface or Admin Dashboards? Read the manuals:
* **[Citizen User Manual](docs/USER_MANUAL_CITIZEN.md)** - Step-by-step instructions for paying bills and registering grievances on the Kiosk.
* **[Admin User Manual](docs/USER_MANUAL_ADMIN.md)** - Instructions for resolving complaints and managing municipal alerts.

---

## 🏗️ Technical Documentation

Explore the structural, architectural, and strategic roadmap of the Suvidha platform:
* **[Implementation Master Plan](docs/MASTER_PLAN.md)** - The 20-Phase construction tracker.
* **[System Architecture](docs/ARCHITECTURE.md)** - Details on the 4-layer microservices architecture.
* **[Technology Stack](docs/TECH_STACK.md)** - Breakdown of the Node.js/React stack.
* **[DPI Integration Roadmap](docs/DPI_INTEGRATION_ROADMAP.md)** - Detailed Phase 20 Atmanirbhar Bharat integration deferrals (BBPS, Bhashini, DigiLocker).
* **[Features & Innovation](docs/FEATURES_AND_INNOVATION.md)** - Comprehensive list of Citizen and Admin features.
* **[API Specifications](docs/api/openapi.yaml)** - OpenAPI 3.0 contracts for the gateway and microservices.

---

## 📂 Project Structure
```text
/backend/       - Independent Node.js microservices (Auth, Electricity, Payments, etc.)
/gateway/       - Node.js API Gateway (Routing, JWT, RBAC)
/kiosk-ui/      - React.js Kiosk Frontend
/admin-ui/      - React.js Admin Dashboard Frontend
/docs/          - All project documentation and plans
/scripts/       - Seeding scripts and database migration tools
```
