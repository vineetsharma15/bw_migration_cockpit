# SAP BW → SAP Business Data Cloud Migration Cockpit

**Data Estate Modernization powered by Infosys Topaz Agentic Framework**

An AI-powered cockpit for end-to-end SAP BW / Native HANA to SAP Business Data Cloud (BDC) migration programs. Built with React (Vite), React Router v6, and JSON-based mock data — designed to be extended screen by screen into a fully backend-connected application.

---

## Table of Contents

1. [Running the App Locally](#1-running-the-app-locally)
2. [Running the HTML Wireframe Locally](#2-running-the-html-wireframe-locally)
3. [Architecture Overview](#3-architecture-overview)
4. [Migration Journey & Agentic Framework](#4-migration-journey--agentic-framework)
5. [Screen Reference](#5-screen-reference)
   - [Command Center](#51-command-center)
   - **Step 1 · Assess & Plan**
     - [BW Discovery](#52-bw-discovery)
     - [Dependency & Lineage Explorer](#53-dependency--lineage-explorer)
     - [AI-Driven Report Rationalization](#54-ai-driven-report-rationalization)
     - [TCO Calculator & Sizing Recommender](#55-tco-calculator--sizing-recommender)
   - **Step 2 · Lift to BW PCE (Optional)**
     - [BW to BW PCE Planner](#56-bw-to-bw-pce-planner)
     - [Migration Wave Planner](#57-migration-wave-planner)
     - [BEX Query Analyzer & Auto-TSD Generator](#58-bex-query-analyzer--auto-tsd-generator)
   - **Step 3 · Shift to BDC Data Products**
     - [Extractor → CDS Converter](#59-extractor--cds-converter)
     - [InfoProvider → Data Product Mapper](#510-infoprovider--data-product-mapper)
     - [BDC Data Product Studio](#511-bdc-data-product-studio)
     - [AI-Driven Data Quality Assurance](#512-ai-driven-data-quality-assurance)
   - **Step 4A · AI Driven Consumption**
     - [AI Co-pilot for Business](#513-ai-co-pilot-for-business)
     - [Persona Insight Workspace](#514-persona-insight-workspace)
   - **Step 4B · Autonomous Insights to Action**
     - [Autonomous Action Center](#515-autonomous-action-center)
     - [Agent Orchestration Console](#516-agent-orchestration-console)
   - **Administration**
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

The app opens on the **Command Center** (`/command-center`), which displays the 5-step migration journey strip at the top for direct navigation. The left sidebar is organised into the 5 migration steps plus Administration. The top bar has an **AI Co-pilot** button that jumps directly to the chat screen.

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
│   │   ├── TopBar.jsx         # Logo, search, AI Co-pilot button, avatar
│   │   └── Sidebar.jsx        # NavLink-based navigation organised by step
│   └── common/
│       ├── KPICard.jsx        # Metric card with optional progress bar
│       ├── Badge.jsx          # Status badge (30+ status → CSS class map)
│       └── PageHeader.jsx     # Breadcrumbs + title + action slot
└── pages/                     # One file per screen (18 total)
```

**Key design principle:** `dataService.js` is the only file that touches data sources. Every function returns `Promise.resolve(localJSON)` today. To connect a backend endpoint, replace the function body with `fetch('/api/...')` — no component code changes needed.

---

## 4. Migration Journey & Agentic Framework

The cockpit implements the **Infosys Topaz Agentic Framework** — a 5-step migration journey where AI accelerates every phase.

```
Step 1           Step 2              Step 3                  Step 4A              Step 4B
Assess & Plan  → Lift to BW PCE  →  Shift to BDC        →   AI Driven       →   Autonomous
                 (Optional)          Data Products            Consumption          Insights to Action

AI Accelerator:
System scan,     Accelerate Shift    Re-architecture          NL queries &         Autonomous
lineage &        and assure quality  with confidence          auto-insights        actions
Documentation    of migration
```

### Agentic Framework — 4 Agent Tiers

| Tier | Agents | Migration Steps |
|------|--------|-----------------|
| **Analysis Agents** | Agentic DW System Analysis Tool · TCO Calculator · Sizing Recommender · AI-Driven Report Rationalization · BEX Query & FSD Creator | Step 1 |
| **Lift-Shift Orchestration Agents** | Intelligent Object Migration Agent · Code Modernization Agent · Auto TSD Generation | Step 2 & 3 |
| **Consumption & Governance Agents** | Data Catalogue & Glossary · AI-Driven Data Quality Assurance · Co-pilot for Business · Autonomous Insights Generation Agent | Step 3 & 4A |
| **Industry Data Products / Agents** | Joule agents for S/4 process acceleration · BDC Data Products — LS, CPG, Retail & Utilities | Step 4B |

### Governance Throughout

- Every AI output (recommendations, generated code, TSDs/FSDs, mappings) goes through a human approval gate before taking effect.
- The Autonomous Action Center records who approved what and when.
- Data Stewards must sign off on Data Product certification.
- User roles control screen-level access — Business Users cannot access the Agent Console or Action Center.

---

## 5. Screen Reference

### 5.1 Command Center

**Route:** `/command-center`  
**Persona:** All (especially Executive Sponsor, Migration Lead)

The home screen. Features an interactive **5-step migration journey strip** at the top with direct navigation to each step's screens, plus:

- **Readiness Score** (74%) — composite of object coverage, wave progress, data quality, and open risks
- **Object Inventory** — breakdown of 2,847 objects by type with decision status
- **Wave Progress** — progress bars for all 4 migration waves
- **AI Agent Recommendations** — top AI-surfaced actions with priority and confidence
- **Open Risks** — top risks with severity and owner

---

### Step 1 · Assess & Plan

*Goal: Inventory and rationalize BW objects, define scope, and build the business case.*  
*AI Accelerator: System scan, lineage analysis & Documentation (Analysis Agents)*

---

### 5.2 BW Discovery

**Route:** `/bw-discovery`  
**Persona:** BW Architect, Migration Lead

**Agentic DW System Analysis Tool** — scans the connected BW system and inventories all objects:

- Filter by object type (ADSO, InfoCube, BEx Query, Process Chain, etc.) and rationalization decision
- Table shows: object name, type, package, owner, last used, usage/month, complexity, decision
- Action buttons route directly to Dependency Explorer, Rationalization, and Extractor Converter for the selected object
- System connection panel shows host, release, DB size, and last scan completion status

---

### 5.3 Dependency & Lineage Explorer

**Route:** `/dependency-explorer`  
**Persona:** BW Architect

**Analysis Agent — Lineage Analysis & Documentation** — SVG-rendered lineage graph:

- Visual graph from DataSources → Transformations → ADSOs → MultiProviders → BEx Queries
- Object profile panel with full metadata (rows, size, upstream/downstream counts)
- AI migration impact analysis: which downstream objects are affected if this object changes
- Navigate to Rationalization or InfoProvider Mapper from the impact panel

---

### 5.4 AI-Driven Report Rationalization

**Route:** `/rationalization`  
**Persona:** Migration Lead, BW Architect

**Analysis Agent — AI-Driven Report Rationalization** — the decision hub for every object in scope:

- Summary KPIs: Migrate / Retire / Consolidate / Pending counts with percentages
- Decision table with inline `<select>` per object — saving immediately via the service layer
- AI-Driven Report Rationalization Agent pre-classifies 89% of inventory; human review locks final decisions
- Objects marked Retire are removed from Wave Planner scope; objects marked Migrate flow into Step 2

---

### 5.5 TCO Calculator & Sizing Recommender

**Route:** `/tco-calculator`  
**Persona:** Executive Sponsor, Migration Lead

**Analysis Agent — TCO Calculator + Sizing Recommender** — live cost modelling:

- Four adjustable sliders: BW infrastructure cost, BDC licence, migration effort, duration
- **AI Sizing Recommender panel**: recommends BDC tenant size, validates migration duration estimate, and identifies cost optimisation opportunities
- Output: 3-year BW vs BDC cost comparison, migration cost, net savings ($3.8M in demo), payback period
- Bar chart visualisation updates in real time as sliders move

---

### Step 2 · Lift to BW PCE (Optional)

*Goal: Optional lift-and-shift to BW Private Cloud Edition as an interim step — keep investment while accelerating shift.*  
*AI Accelerator: Lift-Shift Orchestration Agents — Intelligent Object Migration, Code Modernization, Auto TSD Generation*

---

### 5.6 BW to BW PCE Planner

**Route:** `/pce-planner`  
**Persona:** Migration Lead, BW Architect

**Lift-Shift Orchestration Agents** — manages the optional PCE migration path:

- **Intelligent Object Migration Agent**: auto-migrates compatible objects to PCE with zero-touch validation
- **Code Modernization Agent**: analyzes and adapts custom ABAP objects for PCE compatibility with diff review
- **Auto TSD Generation**: Technical Specification Documents auto-generated for all migrated objects
- Compatibility assessment table: Custom ABAP, Process Chains, BAdIs, Legacy DSOs, Open Hub (87% compatible in demo)
- Remediation timeline: Remediation Sprint → System Copy & Upgrade → Validation & UAT → Go-Live PCE

---

### 5.7 Migration Wave Planner

**Route:** `/wave-planner`  
**Persona:** Migration Lead

**Step 2 Lift-Shift** — Kanban-style wave execution with quality assurance:

- 4 wave columns (Finance Core, Sales Analytics, HR & Payroll, Supply Chain)
- Each wave: owner, target date, progress %, quality gate status, open issues, blockers
- Object cards within each wave show status (In Progress, Done, Blocked)
- Blocked objects show red-bordered cards with blocker notes and link to Action Center
- Empty waves prompt assignment from Rationalization

---

### 5.8 BEX Query Analyzer & Auto-TSD Generator

**Route:** `/query-analyzer`  
**Persona:** BW Architect, Data Product Owner

**Analysis Agent — BEX Query Analysis & FSD/TSD Creation**:

- Query selector: lists all BEx queries with InfoProvider, usage/month, complexity
- AI breakdown panel: analyses variables, calculated key figures, exceptions, and migration risks
- Key figures table with auto-mapped vs manual BDC equivalents
- **FSD/TSD Preview**: auto-generated Functional Specification + Technical Specification Document describing the equivalent BDC Analytic Model
- Export FSD/TSD, push to Jira, or send mapping to Data Product

---

### Step 3 · Shift to BDC Data Products

*Goal: Convert InfoProviders into governed, certified data products in BDC — re-architecture with confidence.*  
*AI Accelerator: Code Modernization Agent + Consumption & Governance Agents*

---

### 5.9 Extractor → CDS Converter

**Route:** `/extractor-cds`  
**Persona:** BW Architect, AI Engineer

**Code Modernization Agent — Re-architecture with confidence**:

- Extractor catalog: all DataSources/Extractors with type, status, complexity, delta mode
- ABAP source code (read-only reference) alongside AI-generated CDS view with delta annotations
- Field mapping table: source field → target field with auto/manual badge
- AI conversion analysis panel with confidence scores and warnings
- Approve generated CDS → triggers deployment action in Action Center

---

### 5.10 InfoProvider → Data Product Mapper

**Route:** `/infoprovider-mapper`  
**Persona:** Data Product Owner, BW Architect

**Step 3 · Re-architecture with confidence** — maps source InfoProviders to target BDC Data Products:

- Source objects table grouped by AI-proposed domain cluster (Finance Core, Sales Analytics, HR Analytics) with colour coding
- Target Data Product cards showing which InfoProviders contribute to each product, domain, BDC Space, and owner
- AI mapping recommendation panel with rationale and confidence scores (avg 87% in demo)
- Approve Mapping → Data Product Studio

---

### 5.11 BDC Data Product Studio

**Route:** `/data-product-studio`  
**Persona:** Data Product Owner, Data Steward

**Step 3 · Data Catalogue & Governance** — full lifecycle management for each BDC Data Product:

- Profile grid: domain, BDC space, owner, steward, version, certification status, tags
- KPI definitions table with formula, source, and certified status
- **Business Glossary** terms with approval workflow (unapproved terms highlighted)
- Quality rules with threshold, current score, and pass/warn/fail status
- Certification step timeline: Technical Review → Data Steward Signoff → Owner Approval → Published

---

### 5.12 AI-Driven Data Quality Assurance

**Route:** `/data-quality`  
**Persona:** Data Steward, Migration Lead

**Consumption & Governance Agent — AI-Driven Data Quality Assurance**:

- Overall quality score + one KPI card per dimension (Completeness, Accuracy, Consistency, Timeliness, Uniqueness)
- Rule results table: rule, dimension, records checked, failures, score, pass/fail
- **AI Root Cause Analysis panel**: explains why a rule is failing with specific process chain and record details
- Action buttons: Create Remediation Action (routes to Action Center), Mark as Accepted Risk

---

### Step 4A · AI Driven Consumption

*Goal: Contextual insights driven by persona needs, underpinned by data readiness — NL queries & auto-insights.*  
*AI Accelerator: Co-pilot for Business + Autonomous Insights Generation Agent*

---

### 5.13 AI Co-pilot for Business

**Route:** `/ai-copilot`  
**Persona:** Business User, Migration Lead, Executive Sponsor

**Consumption & Governance Agent — Co-pilot for Business**:

- Natural language chat interface grounded in certified BDC Data Products
- Confidence score and source citations on every AI response
- Suggested questions: migration status, data product quality risks, wave progress, auto-insights
- Data Product Context panel showing available products and quality scores
- **Autonomous Insights Generation Agent panel**: auto-suggested follow-up actions, scheduled quality scorecards, data catalogue update notifications

---

### 5.14 Persona Insight Workspace

**Route:** `/persona-workspace`  
**Persona:** All (role-switched via dropdown)

**Step 4A · Contextual insights driven by persona needs** — role-specific dashboards:

- Persona selector: Migration Lead, Executive Sponsor, BW Architect, Data Product Owner, Business User
- KPI row changes per persona (Migration Lead: wave progress & blockers; Executive Sponsor: TCO savings & readiness)
- AI-surfaced insight cards: risk, win, or warning relevant to that persona with direct action links
- Recommended questions panel that navigates to AI Co-pilot
- **Autonomous Insights Generation Agent**: continuously surfaces new insights as data readiness improves
- Saved Insights list for returning to prior analyses

---

### Step 4B · Autonomous Insights to Action

*Goal: Joule agents grounded in BDC execute actions in S/4 and other transactional systems — autonomous actions.*  
*AI Accelerator: Industry Data Products/Agents — LS, CPG, Retail & Utilities*

---

### 5.15 Autonomous Action Center

**Route:** `/action-center`  
**Persona:** Migration Lead, AI Engineer

**Step 4B · Joule agents grounded in BDC for process acceleration**:

- **Industry Data Products & Agents panel**: shows active Joule agents per industry vertical
  - *Life Sciences (LS)*: batch release compliance agent, regulatory data packages
  - *CPG (Consumer Products)*: promotion effectiveness agent, margin optimisation actions in S/4
  - *Retail & Utilities*: inventory replenishment agent, purchase order proposals from BDC demand signals
- Pending Approval queue: AI-proposed actions with impact description, risk level, and affected objects
- Approve / Reject buttons — no autonomous action executes without a human decision
- Audit log: full history of who approved/rejected what and when with result

---

### 5.16 Agent Orchestration Console

**Route:** `/agent-console`  
**Persona:** AI Engineer

**Infosys Topaz Agentic Framework — full observability across all 4 agent tiers**:

- **4-Tier Framework Overview** grid: Analysis Agents · Lift-Shift Orchestration · Consumption & Governance · Industry Data Products — with live status per agent
- Agent registry with status indicators: Running (green), Processing (orange), Idle (grey), Error (red)
- Recent tool calls table: agent, tool, parameters, result, timestamp
- Error log with stack traces and retry status
- Prompt version table for tracking prompt changes across all agents

---

### Administration

---

### 5.17 User Management

**Route:** `/user-management`  
**Persona:** Migration Lead (admin), IT Administrator

Manage all cockpit users across the migration programme:

- User directory with search, role filter, and status filter (Active / Inactive / Pending)
- Per-user: avatar, name, email, role badge, team, last login, screen access count
- Edit user side panel with full profile and per-screen access toggle
- Add User modal: name, email, team, role — sends invitation on confirmation
- Role Definitions panel: documents what each role can access across the 5 steps
- Screen Access Matrix: shows how many users can access each step (Step 1 through Step 4B)
- Recent Activity log

---

### 5.18 Connections

**Route:** `/connections`  
**Persona:** Migration Lead, IT Administrator, AI Engineer

Centralised connection management — must be configured before Step 1 (BW Discovery) can run:

**BW Source Systems tab:**
- Card per BW system (PRD, QAS, DEV) with host, port, client, RFC user, DB size, last scan date
- Real-time Test Connection button and Run Scan button
- Error cards highlighted in red with action notes

**BDC Target Tenants tab:**
- Card per BDC tenant with BTP host, tenant ID, region, OAuth client, Datasphere spaces
- Published vs Draft product counts per tenant

**External Integrations tab:**
- Table of all integrations: Jira, Microsoft Teams, ServiceNow, Anthropic Claude API, Infosys Topaz, GitHub Enterprise
- Status, endpoint URL, last tested, notes per integration

**Connection Health Overview:** live status summary across all connection types.

---

## 6. Data Architecture

All mock data lives in `src/data/`. Each file maps directly to one domain and one set of service functions.

| File | Service Functions | Used By |
|------|-----------------|---------|
| `dashboard.json` | `getDashboard` | Command Center |
| `bwObjects.json` | `getBWObjects`, `getBWObjectById` | BW Discovery, Dependency Explorer, InfoProvider Mapper |
| `waves.json` | `getWaves`, `getWaveById` | Wave Planner, Persona Workspace |
| `rationalization.json` | `getRationalization`, `updateDecision` | AI-Driven Report Rationalization |
| `extractors.json` | `getExtractors`, `getExtractorById` | Extractor → CDS Converter |
| `queries.json` | `getQueries`, `getQueryById` | BEX Query Analyzer & Auto-TSD Generator |
| `dataProducts.json` | `getDataProducts`, `getDataProductById` | InfoProvider Mapper, Data Product Studio, AI Co-pilot |
| `actions.json` | `getActions`, `approveAction` | Autonomous Action Center |
| `agents.json` | `getAgents` | Agent Orchestration Console |
| `copilot.json` | `getCopilotConfig`, `sendCopilotMessage` | AI Co-pilot for Business |
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
| Executive Sponsor | Command Center, TCO Calculator & Sizing Recommender, Persona Workspace | Read-only; views savings and readiness |
| Migration Lead | All screens | Approves actions, owns wave progress, locks rationalization decisions |
| BW Architect | BW Discovery, Dependency Explorer, Rationalization, Extractor → CDS, BEX Query Analyzer | Validates AI-generated technical artefacts (CDS views, TSDs) |
| Data Product Owner | InfoProvider Mapper, BDC Data Product Studio, AI-Driven DQA, AI Co-pilot | Certifies and publishes Data Products |
| Data Steward | AI-Driven Data Quality Assurance, BDC Data Product Studio | Signs off on quality scores and business glossary |
| Business User | AI Co-pilot for Business, Persona Workspace | Self-service NL queries and auto-insights |
| AI Engineer | Agent Orchestration Console, Autonomous Action Center, Connections | Monitors 4-tier agent framework, manages connections |

---

## Migration Step → Screen Mapping

| Migration Step | Screens |
|----------------|---------|
| Step 1 · Assess & Plan | BW Discovery · Dependency & Lineage Explorer · AI-Driven Report Rationalization · TCO Calculator & Sizing Recommender |
| Step 2 · Lift to BW PCE (Optional) | BW to BW PCE Planner · Migration Wave Planner · BEX Query Analyzer & Auto-TSD Generator |
| Step 3 · Shift to BDC Data Products | Extractor → CDS Converter · InfoProvider → Data Product Mapper · BDC Data Product Studio · AI-Driven Data Quality Assurance |
| Step 4A · AI Driven Consumption | AI Co-pilot for Business · Persona Insight Workspace |
| Step 4B · Autonomous Insights to Action | Autonomous Action Center · Agent Orchestration Console |
| Administration | User Management · Connections |
