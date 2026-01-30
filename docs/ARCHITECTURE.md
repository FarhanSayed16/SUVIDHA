# SUVIDHA — System Architecture

SUVIDHA follows a **microservices-based, layered architecture** designed for scalability, security, independent service management, and Smart City deployments.

---

## High-Level Overview

The system has **4 main layers**:

1. **Presentation Layer** — Kiosk interface  
2. **API Gateway Layer** — Central control  
3. **Backend Microservices Layer** — Business logic & services  
4. **Data Layer** — Persistent storage  

---

## 1. Presentation Layer (Kiosk Interface)

### Components

- Touch-based Kiosk UI (**React.js** / **Angular**)
- Runs on:
  - Physical kiosk hardware  
  - Web browser (demo environment)  

### Responsibilities

- Language selection & accessibility
- User interaction & navigation
- Data input (payments, complaints, documents)
- Display real-time responses from backend
- Receipt preview & print trigger  

**No business logic here — only UI & API calls.**

---

## 2. API Gateway Layer (Central Control)

### Components

- API Gateway (**Node.js** / **NGINX** / **FastAPI Gateway**)

### Responsibilities

- Single entry point for all kiosk requests
- Route requests to the correct microservice
- Handle:
  - Authentication verification  
  - Rate limiting  
  - Request validation  
  - Logging  

Improves security and prevents direct exposure of microservices.

---

## 3. Backend Microservices Layer

Each service runs **independently** and communicates via **REST APIs**.

### Core Microservices

| Service | Responsibility |
|---------|----------------|
| **Authentication Service** | OTP-based login, JWT token generation, session management |
| **Electricity Service** | Bill fetching, service requests, consumption history |
| **Gas Service** | Bill fetching, service requests, consumption history |
| **Water Service** | Bill fetching, service requests, consumption history |
| **Complaint & Grievance Service** | Complaint registration, status tracking, department mapping |
| **Payment Service** | Secure payment processing, gateway integration (demo-safe), transaction verification, receipt generation |
| **Notification Service** | SMS / Email (simulated), emergency alerts, service updates |
| **Document Service** | PDF receipt generation, QR code creation, print-ready document formatting |

---

## 4. Data Layer (Persistent Storage)

### Databases

- **PostgreSQL** / **MySQL**

### Stored Data

- User authentication logs  
- Service requests & complaints  
- Payment transactions  
- Kiosk usage analytics  
- Audit & security logs  

Data access is **strictly service-based** (no direct UI access to DB).

---

## Data Flow Example: Bill Payment

1. User selects **Electricity Bill Payment** on kiosk  
2. UI sends request → **API Gateway**  
3. Gateway verifies **JWT** → routes to **Electricity Service**  
4. Electricity Service fetches bill from DB  
5. User confirms payment → **Payment Service**  
6. Payment success → **Receipt** generated  
7. UI displays confirmation & prints receipt  

---

## Security Architecture (Built-in)

- **JWT-based** authentication  
- **TLS-encrypted** service communication  
- **Role-based access** (Citizen / Admin)  
- API gateway shielding microservices  
- **Audit logging** for compliance (DPDP Act)  

---

## Admin Dashboard Architecture

- **Admin UI** (web-based)
- Connects to the **same API Gateway**
- Accesses:
  - Analytics Service  
  - Complaint Management Service  
  - Content Management Service  

Same backend, **different role permissions**.

---

## Scalability & Deployment

- Each microservice can **scale independently**
- Supports:
  - Single city deployment  
  - Multi-city rollout  
- Can be deployed on:
  - Government cloud  
  - On-premise data centers  
  - Hybrid Smart City infrastructure  

---

## Architecture Strengths (Evaluation-Ready)

- **Microservices** — industry-grade, modular  
- **Secure & compliant** — DPDP, IT Act aligned  
- **Scalable** — Smart City 2.0 ready  
- **Extensible** — easy to add AI and new services later  
