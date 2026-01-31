# SUVIDHA — Architecture UML Diagrams (PlantUML)

This folder contains **PlantUML** (`.puml`) source files for SUVIDHA system architecture. Use them to generate PNG, SVG, or PDF diagrams for documentation and proposals.

---

## Diagram List

| File | Diagram Type | Description |
|------|--------------|-------------|
| **SUVIDHA_Component_Architecture.puml** | Component | 4-layer system: Presentation (Kiosk + Admin), API Gateway, Backend Microservices, Data Layer. Shows all services and connections. |
| **SUVIDHA_Sequence_Login.puml** | Sequence | Citizen login flow: OTP send → OTP verify → JWT → Service selection. |
| **SUVIDHA_Sequence_BillPayment.puml** | Sequence | Bill payment flow: Fetch bill → Pay → Receipt (Electricity/Gas/Water/Municipal). |
| **SUVIDHA_Sequence_Complaint.puml** | Sequence | Complaint flow: Register complaint → Reference number; Track status by reference. |
| **SUVIDHA_Deployment.puml** | Deployment | Deployment view: Clients → Reverse Proxy → API Gateway → Backend Services → PostgreSQL. |
| **SUVIDHA_Class_Model.puml** | Class | Simplified domain model: User, Session, Bill, Transaction, Complaint, Advisory, AuditLog. |
| **SUVIDHA_Flow_Citizen.puml** | Activity | Citizen flow: Login → Service → Bill → Payment → Receipt. |
| **SUVIDHA_Flow_Complaint.puml** | Activity | Complaint flow: Register (get ref) or Track (by ref). |
| **SUVIDHA_Flow_Admin.puml** | Activity | Admin flow: Dashboard → Complaints → Advisories → Reports. |
| **SUVIDHA_Implementation_Steps.puml** | Flowchart | 6 implementation steps: Setup → Login → Bill → Complaint → Admin → Security. |
| **SUVIDHA_Technical_Stack.puml** | Component | Tech stack: Frontend, Backend, Database, APIs, Hardware (Section 6). |

---

## Design & Styling

- **Colors:** Presentation (blue), Gateway (green), Microservices (orange/amber), Data (purple). Consistent across diagrams.
- **Font:** Segoe UI; titles bold; rounded corners.
- **Layout:** Clear layers and arrows; notes for security and constraints where relevant.

---

## How to Render (Generate PNG/SVG/PDF)

### Option 1: PlantUML online
1. Open [PlantUML Online](https://www.plantuml.com/plantuml/uml/).
2. Copy-paste the contents of a `.puml` file.
3. Click **Submit** to see the diagram; use **PNG** / **SVG** to download.

### Option 2: VS Code extension
1. Install **PlantUML** (jebbs.plantuml) in VS Code.
2. Open a `.puml` file.
3. Press `Alt+D` (or right-click → **Preview Current Diagram**) to preview.
4. Export via command palette: **PlantUML: Export Current Diagram**.

### Option 3: Command line (Java + PlantUML jar)
```bash
java -jar plantuml.jar SUVIDHA_Component_Architecture.puml
```
Generates `SUVIDHA_Component_Architecture.png` in the same folder.

### Option 4: Docker
```bash
docker run -v $(pwd):/data plantuml/plantuml SUVIDHA_Component_Architecture.puml
```

---

## File Locations

- **Diagrams:** `docs/Architecture/*.puml`
- **Existing image:** `docs/Architecture/SUVIDHA_System_Architecture.png` (you can replace or supplement with exports from the component diagram)

Use the generated images in proposals, README, or `docs/ARCHITECTURE.md` as needed.
