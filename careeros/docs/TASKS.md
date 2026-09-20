# TASKS.md — Master Engineering Roadmap & Task Tracker
# AuraCareer AI (BitmAura) — Sovereign AGI & Autonomous Job Automation System

**Current Milestone**: Phase 2 — Autonomous Form Submission & Headless Browser Integrations  
**Test Suite Status**: 10/10 Test Suites Passing (60/60 Unit Tests Verified)  
**Last Updated**: 2026-09-20  

---

## Roadmap Overview

```
[Phase 1: Foundations & Core Engines] ────▶ [COMPLETED (60/60 Tests Passing)]
[Phase 2: Multi-Portal Scrapers & Workers] ─▶ [IN PROGRESS]
[Phase 3: Automated Browser Submissions] ──▶ [PLANNED]
[Phase 4: Production Scale & Deployment] ──▶ [PLANNED]
```

---

## Epic 1: Candidate Sovereign Knowledge Base & Governance (Pillar 1)
*Status: COMPLETED (Verified by `knowledge-base-store.test.ts`)*

- [x] **TASK-101**: Design Candidate Knowledge Base schema (Education, Experience, Verified Achievements, Technical Skills, Preferences).
- [x] **TASK-102**: Implement in-memory & local storage persistence layer (`knowledge-base-store.ts`).
- [x] **TASK-103**: Implement Question-Answer escalation engine for application portal screening questions.
- [x] **TASK-104**: Enforce candidate operating modes: `approval` (default), `autonomous`, and `assisted`.
- [x] **TASK-105**: Implement hard daily application submission limits and portal rate controls.
- [x] **TASK-106**: Author 6 unit tests covering answer matching, mode transitions, and daily limits.

---

## Epic 2: Overleaf & LaTeX ATS Resume Synthesizer (Pillar 2)
*Status: COMPLETED (Verified by `latex-generator.test.ts`)*

- [x] **TASK-201**: Implement clean, single-column Deedy/AltaCV compile-ready LaTeX templates (`latex-templates.ts`).
- [x] **TASK-202**: Implement dynamic tailoring engine that prioritizes verified candidate bullet points matching JD keywords without fabrication.
- [x] **TASK-203**: Implement instant 1-click Overleaf cloud integration URL generator (`generateOverleafUrl` via `snip_uri` base64 payload).
- [x] **TASK-204**: Implement 5-dimension mathematical ATS alignment scoring engine:
  - Core Skills match ($\ge 85\%$)
  - Tenure and experience match
  - Industry lexicon alignment
  - ATS single-column compliance
  - STAR metric density ($\ge 70\%$)
- [x] **TASK-205**: Build interactive `LatexPreview` component with live LaTeX code view, copy button, and Overleaf cloud launcher.
- [x] **TASK-206**: Author 5 unit tests covering LaTeX compilation cleanliness, ATS scoring, and Overleaf URL formatting.

---

## Epic 3: Multi-Portal Discovery & Deduplication Engine (Pillar 3)
*Status: COMPLETED (Verified by `dedup-engine.test.ts` & Python multi-portal scraper)*

- [x] **TASK-301**: Implement SHA-256 cross-portal deduplication hash generator (`generateJobDedupHash`).
- [x] **TASK-302**: Implement normalization pipeline for company names and job titles.
- [x] **TASK-303**: Enforce direct ATS link priority over third-party aggregator links.
- [x] **TASK-304**: Implement `MultiPortalJobScraper` in Python (`apps/workers/job-scraper/src/scrapers/multi_portal_scraper.py`) supporting 13 platforms:
  - LinkedIn, Naukri, Indeed, Glassdoor, Foundit, Wellfound, Internshala, Cutshort, Instahyre, Hirist, Shine, TimesJobs, Greenhouse, Lever, Workday.
- [x] **TASK-305**: Author 4 unit tests verifying hash collision resistance and ATS prioritization.

---

## Epic 4: Recruiter Discovery & Cold Outreach Engine (Pillar 4)
*Status: COMPLETED (Verified by `outreach.test.ts`)*

- [x] **TASK-401**: Implement human-grade cold email generator following the Problem-Proof-Proposal architecture (`cold-email-generator.ts`).
- [x] **TASK-402**: Implement inbound email sentiment classifier (`sentiment-analyzer.ts`):
  - `interview_opportunity`, `positive`, `action_required`, `neutral`, `rejection`.
- [x] **TASK-403**: Implement regex extractor for meeting booking links (Calendly, Cal.com, Google Meet, ChiliPiper).
- [x] **TASK-404**: Implement automated 2-stage follow-up cadence (3-5 business days) with immediate cancellation upon reply.
- [x] **TASK-405**: Build Outreach Command Hub UI (`/outreach`) with queue view, thread history, and 1-click meeting shortcuts.
- [x] **TASK-406**: Author 5 unit tests verifying sentiment accuracy and calendar link extraction.

---

## Epic 5: Closed-Loop Self-Learning & Reinforcement Engine (Pillar 5)
*Status: COMPLETED (Verified by `learning-engine.test.ts`)*

- [x] **TASK-501**: Implement learning engine tracking conversion yield across resume templates, keyword densities, email hooks, and job portals (`learning-engine.ts`).
- [x] **TASK-502**: Implement automated recurring screening question committing from candidate feedback into the Knowledge Base.
- [x] **TASK-503**: Build Self-Learning Analytics dashboard (`/analytics/learning`) showing A/B test results and conversion funnels.
- [x] **TASK-504**: Author 2 unit tests verifying conversion calculations and question-committing integrity.

---

## Epic 6: Command Center UI & Live Activity Feed (Pillar 6)
*Status: COMPLETED*

- [x] **TASK-601**: Build dark-mode Command Center dashboard (`/dashboard`) with real-time KPI metrics.
- [x] **TASK-602**: Build Live Activity Stream component (`activity-timeline.tsx`) with pulsing status indicators and event audit logs.
- [x] **TASK-603**: Build Operating Mode Switcher card (`operating-mode-card.tsx`) with daily quota meter.
- [x] **TASK-604**: Build Agent Settings page (`/agent/settings`) with portal toggles, rate limiters, and mode selectors.
- [x] **TASK-605**: Update primary sidebar navigation and AI tools directory with new autonomous agent capabilities.

---

## Epic 7: Autonomous Form Submission & Headless Browser Automation (Phase 2 — ACTIVE)
*Status: IN PROGRESS*

- [ ] **TASK-701**: Implement Playwright/Puppeteer automated form filler for Greenhouse ATS portals.
- [ ] **TASK-702**: Implement Playwright automated form filler for Lever ATS portals.
- [ ] **TASK-703**: Implement Workday automated form navigation and field mapping.
- [ ] **TASK-704**: Implement LinkedIn Easy Apply automation module with stealth fingerprinting.
- [ ] **TASK-705**: Implement Naukri 1-Click apply automation with credential vault.
- [ ] **TASK-706**: Build fallback human intervention modal when CAPTCHA is detected.

---

## Epic 8: Production Scaling & Cloud Deployment (Phase 3 — PLANNED)
*Status: PLANNED*

- [ ] **TASK-801**: Deploy Supabase PostgreSQL schema with Row Level Security (RLS) policies.
- [ ] **TASK-802**: Set up Redis / BullMQ worker cluster for async scraping and outreach dispatch.
- [ ] **TASK-803**: Configure Resend / SendGrid transactional email gateway with DKIM/SPF domain verification.
- [ ] **TASK-804**: Implement IMAP inbound email webhook listener for real-time recruiter response ingestion.
- [ ] **TASK-805**: End-to-end integration test of autonomous application lifecycle.
