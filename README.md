# SAP BW/HANA → SAP BDC Migration Cockpit

An AI-powered cockpit for end-to-end SAP BW / Native HANA to SAP Business Data Cloud (BDC) migration programs. Built with React (Vite), React Router v6, and JSON-based mock data — designed to be extended screen by screen into a fully backend-connected application.

---

## Table of Contents

1. [Running the App Locally](#1-running-the-app-locally)
2. [Running the HTML Wireframe Locally](#2-running-the-html-wireframe-locally)
3. [Architecture Overview](#3-architecture-overview)
4. [End-to-End Migration Journey](#4-end-to-end-migration-journey)
5. [Screen Reference](#5-screen-reference)
   - [Command Center](#51-command-center)
   - [BW Discovery](#52-bw-discovery)
   - [Dependency Explorer](#53-dependency-explorer)
   - [Rationalization](#54-rationalization)
   - [TCO Calculator](#55-tco-calculator)
   - [BW to BW PCE Planner](#56-bw-to-bw-pce-planner)
   - [Wave Planner](#57-wave-planner)
   - [Extractor → CDS Studio](#58-extractor--cds-studio)
   - [Query Analyzer & FSD Generator](#59-query-analyzer--fsd-generator)
   - [InfoProvider Mapper](#510-infoprovider-mapper)
   - [Data Product Studio](#511-data-product-studio)
   - [Data Quality Center](#512-data-quality-center)
   - [AI Consumption Copilot](#513-ai-consumption-copilot)
   - [Persona Insight Workspace](#514-persona-insight-workspace)
   - [Autonomous Action Center](#515-autonomous-action-center)
   - [Agent Console](#516-agent-console)
   - [User Management](#517-user-management)
   - [Connections](#518-connections)
6. [Data Architecture](#6-data-architecture)
7. [Extending to a Real Backend](#7-extending-to-a-real-backend)

---

## 1. Running the App Locally

### Prerequisites

- **Node.js 18 or later** — download from [nodejs.org](https://nodejs.org)
- Verify installation: `node -v && npm -v`

### Steps

```bash
# 1. Clone / navigate to the project directory
cd /Users/VIneet/Documents/VSCode/bw_migration_cockpit

# 2. Install dependencies (first time only)
npm install

# 3. Start the development server
npm run dev
```

The terminal will print a local URL (typically `http://localhost:5173`). Open it in any browser.

### Navigation

The app opens on the **Command Center** (`/command-center`). Use the left sidebar to navigate between all 18 screens. The top bar has a **Copilot** button that jumps to the AI chat screen.

### Build for Production

```bash
npm run build      # outputs to /dist
npm run preview    # serves the production build locally
```

---

## 2. Running the HTML Wireframe Locally

The original single-file wireframe (`wireframe.html`) requires no build tools.

```bash
# Option A — open directly in a browser
open wireframe.html

# Option B — serve via Python (recommended to avoid CORS quirks)
python3 -m http.server 8080
# then open http://localhost:8080/wireframe.html
```

Use the buttons at the top of the wireframe page to switch between screens. The wireframe uses an inline `show(id)` JavaScript function to toggle `<section>` elements — no framework required.

---

## 3. Architecture Overview

```
src/
├── main.jsx                   # React entry point
├── App.jsx                    # BrowserRouter + all 18 routes
├── index.css                  # Global CSS with design tokens
├── data/                      # JSON mock data (one file per domain)
│   ├── dashboard.json
│   ├── bwObjects.json
│   ├── waves.json
│   ├── rationalization.json
│   ├── extractors.json
│   ├── queries.json
│   ├── dataProducts.json
│   ├── actions.json
│   ├── agents.json
│   ├── copilot.json
│   ├── users.json
│   └── connections.json
├── services/
│   └── dataService.js         # Service layer — swap JSON for fetch() here
├── context/
│   └── DataContext.jsx        # Global state + mutators via React Context
├── components/
│   ├── layout/
│   │   ├── Layout.jsx         # Shell: TopBar + Sidebar + <Outlet />
│   │   ├── TopBar.jsx         # Logo, search, Copilot button, avatar
│   │   └── Sidebar.jsx        # NavLink-based navigation with sections
│   └── common/
│       ├── KPICard.jsx        # Metric card with optional progress bar
│       ├── Badge.jsx          # Status badge (30+ status → CSS class map)
│       └── PageHeader.jsx     # Breadcrumbs + title + action slot
└── pages/                     # One file per screen (18 total)
```

**Key design principle:** `dataService.js` is the only file that touches data sources. Every function returns `Promise.resolve(localJSON)` today. To connect a backend endpoint, replace the function body with `fetch('/api/...')` — no component code changes needed.

---

## 4. End-to-End Migration Journey

The cockpit supports four phases of the migration lifecycle. Each phase maps to one or more screens.

### Phase 1 — Assess & Plan

**Goal:** Understand what exists in BW, decide what to migrate, retire, or redesign, and estimate cost and effort.

1. **Connections** — Register and test RFC connections to all BW source systems (PRD, QAS, DEV). Verify BDC tenant OAuth credentials.
2. **BW Discovery** — Run an automated scan. The cockpit inventories all 2,847 BW objects (ADSOs, DSOs, InfoCubes, MultiProviders, CompositeProviders, BEx Queries, Process Chains, Transformations, etc.) with usage metrics, last-used dates, complexity scores, and package owners.
3. **Dependency Explorer** — Visualise lineage across the object graph. Understand which InfoCubes feed which queries. Identify cascading impacts before moving an object.
4. **Rationalization** — AI analyses usage and complexity to recommend Migrate / Retire / Consolidate / Redesign per object. Migration Leads review AI recommendations and lock in decisions. 312 pending decisions drive the migration scope.
5. **TCO Calculator** — Model the 3-year total cost of ownership: BW infrastructure, SAP licences, BDC subscription, and migration execution effort. The live sliders compute projected savings in real time.
6. **BW to BW PCE Planner** — Optional path: lift-and-shift to BW Private Cloud Edition as an interim step before full BDC migration. Assess PCE compatibility (87% in demo) and plan the remediation sprint.

### Phase 2 — Migration Factory

**Goal:** Execute the migration object by object, in structured waves, with AI-generated code reviewed by humans.

7. **Wave Planner** — Objects decided as "Migrate" are grouped into waves by domain (Finance, Sales, HR, Supply Chain). Each wave has an owner, target date, quality gate, and progress tracking. Blocked objects are flagged with root-cause notes.
8. **Extractor → CDS Studio** — For each ADSO/DSO/DataSource, the AI generates an equivalent SAP CDS view with delta-capable annotations. Engineers review the ABAP source vs. generated CDS side by side, validate field mappings (auto vs. manual), and approve before deployment.
9. **Query Analyzer & FSD Generator** — BEx queries are analysed for complexity (variables, calculated key figures, exceptions). The AI produces a Functional Specification Document (FSD) that describes the equivalent BDC Analytic Model. Architects review and approve before handoff to developers.

### Phase 3 — Data Product Studio

**Goal:** Package migrated data into governed, certified, reusable Data Products in BDC / SAP Datasphere.

10. **InfoProvider Mapper** — Source InfoProviders (InfoCubes, ADSOs) are mapped to target BDC Data Products by domain. The AI proposes clustering and naming conventions.
11. **Data Product Studio** — Define KPIs, glossary terms, quality rules, and certification workflows for each Data Product. Track certification steps (Technical Review → Data Steward Signoff → Owner Approval → Published).
12. **Data Quality Center** — Monitor data quality across five dimensions: Completeness, Accuracy, Consistency, Timeliness, and Uniqueness. AI identifies root causes for failing rules and suggests remediation actions.

### Phase 4 — AI Consumption & Control

**Goal:** Enable business users to consume migrated data via natural language, and give the program team governance over autonomous AI actions.

13. **AI Consumption Copilot** — Business users ask natural language questions against certified BDC Data Products. The copilot answers with confidence scores, cites source Data Products, and suggests follow-up actions.
14. **Persona Insight Workspace** — Role-specific dashboards. A Migration Lead sees wave progress and blockers. An Executive Sponsor sees TCO savings and readiness. A BW Architect sees extraction coverage. Each persona gets curated insight cards and recommended questions.
15. **Autonomous Action Center** — AI agents propose actions (e.g. "Retire 62 zero-usage ADSOs", "Create CDS view for ZFI_AR_AGING"). A human reviews and approves or rejects each action before execution. An audit log records every decision.
16. **Agent Console** — Operational view of all 8 registered AI agents (Discovery, Rationalization, CDS Generator, Query Analyzer, Mapping, Quality, Copilot, Orchestrator). Shows real-time status, tool call history, and error logs.

### Governance Throughout

- Every AI output (recommendations, generated code, FSDs, mappings) goes through a human approval gate before taking effect.
- The Action Center records who approved what and when.
- Data Stewards must sign off on Data Product certification.
- User roles control screen-level access — Business Users cannot access the Agent Console or Action Center.

---

## 5. Screen Reference

### 5.1 Command Center

**Route:** `/command-center`  
**Persona:** All (especially Executive Sponsor, Migration Lead)

The home screen. Shows the overall migration health at a glance:

- **Readiness Score** (74%) — composite of object coverage, wave progress, data quality, and open risks
- **Object Inventory** — breakdown of 2,847 objects by type with decision status
- **Wave Progress** — progress bars for all 4 migration waves
- **AI Recommendations** — top 4 AI-surfaced actions with priority
- **Open Risks** — top 5 risks with severity and owner

How it fits the journey: The first screen a Migration Lead opens each morning. If the readiness score drops or a new high-severity risk appears, this is where they see it.

---

### 5.2 BW Discovery

**Route:** `/bw-discovery`  
**Persona:** BW Architect, Migration Lead

Displays the complete BW object inventory from the connected source system scan:

- Filter by object type (ADSO, InfoCube, BEx Query, etc.) and rationalization decision
- Table shows: object name, type, package, owner, last used, usage/month, complexity, size, decision
- Action buttons route directly to Dependency Explorer, Rationalization, and Extractor Studio for the selected object

How it fits the journey: After connecting to BW (Connections screen) and running a scan, architects work through the object list to understand scope and validate AI-assigned decisions before Wave Planning.

---

### 5.3 Dependency Explorer

**Route:** `/dependency-explorer`  
**Persona:** BW Architect

SVG-rendered lineage graph showing the source-to-target object chain:

- Visual graph from DataSources → Transformations → ADSOs → MultiProviders → BEx Queries
- Object profile panel with full metadata
- AI impact analysis: which downstream objects are affected if this object changes
- Navigate to Rationalization or Wave Planner from the impact panel

How it fits the journey: Before retiring or migrating an object, architects use this screen to confirm that no active queries or reports depend on it unexpectedly.

---

### 5.4 Rationalization

**Route:** `/rationalization`  
**Persona:** Migration Lead, BW Architect

The decision hub for every object in scope:

- Summary KPIs: Migrate / Retire / Consolidate / Pending counts
- Decision table with inline `<select>` per object — clicking saves immediately via the service layer
- Filter by decision, complexity, or domain
- AI-suggested decisions pre-filled based on usage, complexity, and dependency analysis

How it fits the journey: This screen drives the entire downstream scope. Objects marked Retire are removed from Wave Planner scope (reducing effort by ~18% in the demo). Objects marked Migrate flow into Wave Planning and the Extractor/Query pipelines.

---

### 5.5 TCO Calculator

**Route:** `/tco-calculator`  
**Persona:** Executive Sponsor, Migration Lead

Live cost modelling with four adjustable sliders:

- BW infrastructure cost per year
- BDC licence cost per year
- Migration effort (person-months)
- Estimated duration (months)

Output: 3-year BW cost, 3-year BDC cost, migration cost, net savings, and a bar chart visualisation. All values update in real time as sliders move — no form submission required.

How it fits the journey: Used in the business case phase to justify the migration investment. The Executive Sponsor uses this to confirm the $3.8M projected savings before approving the programme budget.

---

### 5.6 BW to BW PCE Planner

**Route:** `/pce-planner`  
**Persona:** Migration Lead, BW Architect

For organisations choosing an interim lift-and-shift to BW Private Cloud Edition before full BDC migration:

- Compatibility assessment table: 5 categories (Custom ABAP, Process Chains, BAdIs, Legacy DSOs, Open Hub) with compatible vs. needs-fix counts
- Timeline: Remediation Sprint → System Copy → Validation → Go-Live PCE
- 87% compatibility score; 48 remediation items identified

How it fits the journey: Optional Phase 2 step. If business constraints prevent immediate BDC migration, PCE provides a cloud-ready interim state while the full BDC programme continues in parallel.

---

### 5.7 Wave Planner

**Route:** `/wave-planner`  
**Persona:** Migration Lead

Kanban-style view of all migration waves:

- 4 wave columns (Finance Core, Sales Analytics, HR & Payroll, Supply Chain)
- Each wave shows: owner, target date, progress %, quality gate status, open issues
- Object cards within each wave show status (In Progress, Done, Blocked)
- Blocked objects have red-bordered cards with blocker notes
- Empty waves show a placeholder with a button to add objects from Rationalization

How it fits the journey: After Rationalization, the Migration Lead assigns Migrate-flagged objects to waves. During execution, this is the daily view for tracking wave health and resolving blockers.

---

### 5.8 Extractor → CDS Studio

**Route:** `/extractor-cds`  
**Persona:** BW Architect, AI Engineer

AI-powered ABAP-to-CDS conversion workbench:

- Extractor catalog: lists all DataSources/Extractors with type, status, complexity, delta mode
- Selected extractor view:
  - ABAP source code (read-only reference)
  - AI-generated CDS view with delta annotations
  - Field mapping table: source field → target field with auto/manual badge
  - AI insights panel with warnings and suggestions
- Approve generated CDS → triggers deployment action in Action Center

How it fits the journey: The most technically intensive screen. BW Architects validate AI-generated extraction logic before it is deployed to BDC. Every generated CDS view requires human approval — it never deploys automatically.

---

### 5.9 Query Analyzer & FSD Generator

**Route:** `/query-analyzer`  
**Persona:** BW Architect, Data Product Owner

Converts BEx queries into documented Functional Specifications:

- Query selector: lists all BEx queries with InfoProvider, usage/month, complexity
- AI breakdown panel: analyses variables, calculated key figures, exceptions, and risks
- Key figures table with migration status per measure
- FSD Preview: formatted specification document describing the equivalent BDC Analytic Model, including variable definitions, filter logic, and exception rules
- Download FSD / Approve for development buttons

How it fits the journey: BEx queries cannot be migrated 1:1 to BDC. This screen documents what each query does, flags risks, and produces the FSD that developers use to build the equivalent in BDC.

---

### 5.10 InfoProvider Mapper

**Route:** `/infoprovider-mapper`  
**Persona:** Data Product Owner, BW Architect

Maps source BW InfoProviders to target BDC Data Products:

- Source objects table grouped by domain cluster (Finance, Sales, HR) with colour coding
- Target Data Product cards showing which InfoProviders contribute to each product
- AI mapping recommendation panel explaining the proposed grouping rationale
- Approve Mapping button

How it fits the journey: Bridges the migration factory (extractors/queries) and the data product studio. This screen defines the many-to-one mapping: multiple ADSOs become one certified Data Product.

---

### 5.11 Data Product Studio

**Route:** `/data-product-studio`  
**Persona:** Data Product Owner, Data Steward

Full lifecycle management for each BDC Data Product:

- Profile grid: domain, BDC space, owner, steward, version, quality score, certification status
- KPIs table with definition, source, and current value
- Glossary terms with approval status
- Quality rules (threshold, current value, pass/fail)
- Certification step timeline: Technical Review → Data Steward Signoff → Owner Approval → Published

How it fits the journey: After mapping is approved, Data Product Owners build the product definition in this screen. Certification requires sign-off from multiple roles before the product is published to consumers.

---

### 5.12 Data Quality Center

**Route:** `/data-quality`  
**Persona:** Data Steward, Migration Lead

Continuous data quality monitoring across five dimensions:

- Overall quality score + one KPI card per dimension (Completeness, Accuracy, Consistency, Timeliness, Uniqueness)
- Rule results table: rule name, dimension, threshold, current value, trend, pass/fail status
- AI root cause panel: explains why a rule is failing (e.g., "PC_FI_DELTA process chain failed at 04:00 — 48 records missing")
- Action buttons: Create Remediation Action, Schedule Monitor, View in Action Center

How it fits the journey: Runs continuously once Data Products are published. A quality score below 80% triggers an alert for the Data Steward and is surfaced on the Command Center. The AI root cause saves hours of manual investigation.

---

### 5.13 AI Consumption Copilot

**Route:** `/ai-copilot`  
**Persona:** Business User, Migration Lead, Executive Sponsor

Natural language interface to migration data and certified BDC Data Products:

- Chat interface with confidence score and source citations on every AI response
- Suggested question chips for common queries
- Data Product Context panel showing available products and quality scores
- AI suggested follow-up actions (route to Action Center for execution)

How it fits the journey: The end-state for Business Users who previously used BEx reports. Instead of navigating InfoProviders and queries, they type questions and get answers grounded in certified, quality-validated data.

---

### 5.14 Persona Insight Workspace

**Route:** `/persona-workspace`  
**Persona:** All (role-switched via dropdown)

Role-specific KPI dashboards and curated insights:

- Persona selector: Migration Lead, Executive Sponsor, BW Architect, Data Product Owner, Business User
- KPI row changes per persona (e.g. Migration Lead sees wave progress; Executive Sponsor sees TCO savings)
- Insight cards: AI-surfaced risk, win, or warning relevant to that persona with action button
- Recommended questions panel that navigates to Copilot pre-filled
- Saved Insights list for returning to prior analyses

How it fits the journey: Reduces information overload. Each stakeholder sees only what matters to their role, with direct links to the action or detail screen.

---

### 5.15 Autonomous Action Center

**Route:** `/action-center`  
**Persona:** Migration Lead, AI Engineer

Human-in-the-loop governance for all AI-proposed actions:

- Pending Approval queue: AI-proposed actions with impact description, risk level, and affected objects
- Approved Today list: actions approved in the last 24 hours
- Approve / Reject buttons — status updates immediately in local state
- Audit log: full history of who approved/rejected what and when

How it fits the journey: Ensures no AI action executes without a human decision. The audit log satisfies compliance and change management requirements. Every critical step — retiring objects, deploying CDS views, creating Data Products — passes through this screen.

---

### 5.16 Agent Console

**Route:** `/agent-console`  
**Persona:** AI Engineer

Operational dashboard for all 8 Infosys Topaz / Anthropic Claude agents:

- Agent registry with status indicators: Running (green), Processing (orange), Error (red)
- Recent tool calls table: agent, tool, parameters, result, timestamp
- Error log with stack traces and retry status
- Prompt version table for tracking prompt changes across agents

How it fits the journey: Used by AI Engineers to monitor agent health, debug failures, and tune prompts. If an agent fails mid-pipeline (e.g. CDS Generator crashes on a complex ABAP routine), the error appears here with enough context to diagnose and restart.

---

### 5.17 User Management

**Route:** `/user-management`  
**Persona:** Migration Lead (admin), IT Administrator

Manage all cockpit users across the migration programme:

- User directory with search, role filter, and status filter
- Per-user: avatar, name, email, role badge, team, status (Active/Inactive/Pending), last login, screen access count
- Edit user: side panel with full profile and per-screen access toggle
- Activate / Deactivate button per user
- Add User modal: name, email, team, role — sends invitation email on confirmation
- Role Definitions panel: documents what each role can access
- Screen Access Matrix: shows how many users have access to each functional area
- Recent Activity log: last 5 actions taken by any user

How it fits the journey: As the migration programme grows, new architects, data stewards, and business users are onboarded here. Role-based access ensures that Business Users cannot accidentally approve AI actions or view sensitive architecture screens.

---

### 5.18 Connections

**Route:** `/connections`  
**Persona:** Migration Lead, IT Administrator, AI Engineer

Centralised connection management for all external systems:

**BW Source Systems tab:**
- Card per BW system (PRD, QAS, DEV) with host, port, client, RFC user, DB size, last scan date
- Real-time Test Connection button — simulates latency and returns a live pass/fail
- Run Scan button — triggers the BW object discovery scan
- Error cards highlighted in red with action notes (e.g. "RFC user password expired")

**BDC Target Tenants tab:**
- Card per BDC tenant (Production, Development) with BTP host, tenant ID, region, OAuth client, Datasphere spaces
- Published vs Draft product counts
- Test Connection and Open in BDC Console buttons

**External Integrations tab:**
- Table of all 6 integrations: Jira, Microsoft Teams, ServiceNow, Anthropic Claude API, Infosys Topaz, GitHub Enterprise
- Status, endpoint URL, last tested, notes per integration
- Test and Edit buttons

**Connection Health Overview:** summary panel showing live status of all connections across all types.

How it fits the journey: Must be configured before BW Discovery can run (requires valid BW RFC connection) and before any CDS views can be deployed (requires BDC OAuth token). Errors here block the entire migration pipeline.

---

## 6. Data Architecture

All mock data lives in `src/data/`. Each file maps directly to one domain and one set of service functions.

| File | Service Functions | Used By |
|------|-----------------|---------|
| `dashboard.json` | `getDashboard` | Command Center |
| `bwObjects.json` | `getBWObjects`, `getBWObjectById` | BW Discovery, Dependency Explorer |
| `waves.json` | `getWaves`, `getWaveById` | Wave Planner, Persona Workspace |
| `rationalization.json` | `getRationalization`, `updateDecision` | Rationalization |
| `extractors.json` | `getExtractors`, `getExtractorById` | Extractor → CDS Studio |
| `queries.json` | `getQueries`, `getQueryById` | Query Analyzer |
| `dataProducts.json` | `getDataProducts`, `getDataProductById` | InfoProvider Mapper, Data Product Studio, AI Copilot |
| `actions.json` | `getActions`, `approveAction` | Action Center |
| `agents.json` | `getAgents` | Agent Console |
| `copilot.json` | `getCopilotConfig`, `sendCopilotMessage` | AI Copilot |
| `users.json` | `getUsers` | User Management |
| `connections.json` | `getConnections` | Connections |

### Global State

`DataContext.jsx` loads all data on app mount via `Promise.all`. Components consume data via the `useData()` hook. Mutator functions (`approveAction`, `updateDecision`) update both the service layer and local state atomically.

---

## 7. Extending to a Real Backend

The service abstraction layer makes backend connectivity a localised change. For each domain:

**Step 1 — Replace the import with a fetch call in `src/services/dataService.js`:**

```js
// Before (mock)
import bwObjects from '../data/bwObjects.json'
export const getBWObjects = () => Promise.resolve(bwObjects)

// After (real backend)
export const getBWObjects = () =>
  fetch('/api/bw/objects').then(r => r.json())
```

**Step 2 — For mutations, use the appropriate HTTP method:**

```js
// Before
export const approveAction = (id) => {
  actions.queue.find(a => a.id === id).status = 'Approved'
  return Promise.resolve()
}

// After
export const approveAction = (id) =>
  fetch(`/api/actions/${id}/approve`, { method: 'POST' }).then(r => r.json())
```

No component code changes are required. The `DataContext` and all pages remain identical.

### Recommended Backend Endpoints (reference)

| Method | Path | Service Function |
|--------|------|-----------------|
| GET | `/api/dashboard` | `getDashboard` |
| GET | `/api/bw/objects` | `getBWObjects` |
| GET | `/api/waves` | `getWaves` |
| PATCH | `/api/rationalization/:id` | `updateDecision` |
| GET | `/api/extractors` | `getExtractors` |
| GET | `/api/queries` | `getQueries` |
| GET | `/api/data-products` | `getDataProducts` |
| GET | `/api/actions` | `getActions` |
| POST | `/api/actions/:id/approve` | `approveAction` |
| GET | `/api/agents` | `getAgents` |
| POST | `/api/copilot/chat` | `sendCopilotMessage` |
| GET | `/api/users` | `getUsers` |
| GET | `/api/connections` | `getConnections` |

### Authentication

Add an `Authorization: Bearer <token>` header in a shared `apiFetch` wrapper and replace all `fetch()` calls with it. No component changes needed.

```js
const apiFetch = (path, opts = {}) =>
  fetch(path, {
    ...opts,
    headers: { 'Authorization': `Bearer ${getToken()}`, ...opts.headers }
  }).then(r => r.json())
```

---

## Personas Quick Reference

| Persona | Primary Screens | Key Actions |
|---------|----------------|-------------|
| Executive Sponsor | Command Center, TCO Calculator, Persona Workspace | Read-only; views savings and readiness |
| Migration Lead | All screens | Approves actions, owns wave progress |
| BW Architect | Discovery, Dependency, Rationalization, Extractor, Query | Validates AI-generated technical artefacts |
| Data Product Owner | InfoProvider Mapper, Data Product Studio, Data Quality, Copilot | Certifies and publishes Data Products |
| Data Steward | Data Quality, Data Product Studio | Signs off on quality and glossary |
| Business User | AI Copilot, Persona Workspace | Self-service insights in natural language |
| AI Engineer | Agent Console, Action Center, Connections | Monitors agents, manages connections |
