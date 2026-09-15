# CampusCare AI

> Report. Analyze. Resolve.
 
# https://campuscare-ai-ljfh.bolt.host

## Problem Statement
In colleges, students frequently face campus issues such as:

- Broken fans, lights, and electrical fixtures
- Wi-Fi and network connectivity problems
- Water leakage and sanitation issues
- Classroom and lab equipment failures
- Cleanliness and hygiene concerns
- General maintenance problems

These complaints are usually communicated **manually** to different departments — by email, phone, paper forms, or word of mouth. This causes:

- **Delays** — complaints sit in inboxes with no tracking
- **Incorrect routing** — students don't know which department handles what
- **No prioritization** — a broken lab microscope before an exam gets the same attention as a flickering light
- **No visibility** — students can't track the status of their complaint
- **No accountability** — departments can't see workload or response times

### The Solution

**CampusCare AI** is an agentic AI-powered complaint management system. A student submits a complaint once, and a team of six AI agents automatically processes it — understanding the issue, determining urgency, routing it to the correct department, creating an action plan, generating follow-ups, and producing a final report — all visible on a live dashboard.

### The Agentic Workflow

```
Student Complaint
       ↓
Complaint Analysis Agent   →  Understands the issue, extracts keywords & summary
       ↓
Priority Agent             →  Classifies urgency: Low / Medium / High / Critical
       ↓
Department Routing Agent   →  Routes to Electrical, IT/Wi-Fi, Maintenance, etc.
       ↓
Action Planning Agent      →  Generates recommended action, next step, response time
       ↓
Follow-up Agent            →  Tracks status, generates follow-up message
       ↓
Summary Agent              →  Combines all outputs into a final report
       ↓
Resolution Dashboard       →  Live stats, filters, status tracking, agent activity
```

### Example

A student submits:

> "Wi-Fi is not working in the Block A computer lab and students cannot access their online lab materials."

The system produces:

| Field             | Result                                                    |
|-------------------|-----------------------------------------------------------|
| Category          | IT / Wi-Fi                                                |
| Priority          | High — disrupts core academic activities                  |
| Department        | IT Support                                                |
| Recommended Action| Dispatch a network technician to inspect the access point |
| Status            | Assigned                                                  |
| Expected Response | 2-4 hours                                                 |
| Follow-up         | The department has been notified. Expect a response soon. |

---

## Tech Stack

- **React + TypeScript** — frontend UI
- **Tailwind CSS** — styling
- **Supabase** — database for complaints and agent activity logs
- **Vite** — build tooling

## Features

- Submit a complaint with student info, location, and category
- Watch 6 AI agents process the complaint in real time with animated progress
- View detailed agent outputs (summary, priority reasoning, department routing, action plan)
- Update complaint status (Submitted → Assigned → In Progress → Resolved)
- Dashboard with live statistics, search, and filters (priority, status, department)
- Agent activity timeline with timestamps
- Fully responsive (mobile + desktop)
- Demo mode — works without any external AI API key

## Getting Started

```bash
npm install
npm run dev
```

The app seeds 5 sample complaints on first load so the dashboard is populated for demos.
