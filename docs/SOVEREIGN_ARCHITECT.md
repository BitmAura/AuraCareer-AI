# SOVEREIGN_ARCHITECT.md
# AuraCareer AI — Sovereign System Architecture & Engineering Blueprint (BitmAura)

> **"Syntax is a commodity. Domain truth is a monopoly. Never trust AI output blindly; constrain it with mathematical laws."**  
> — *The Sovereign Architect Playbook & Universal System Architect Framework (USAF)*

---

## 1. Architectural Philosophy & Foundations

AuraCareer AI is designed under the **Universal System Architect Framework (USAF)** and **The Sovereign Architect Playbook**. It transforms job acquisition from a manual, high-entropy struggle into a deterministic, verifiable, mathematical pipeline.

Rather than relying on brittle LLM prompt chains or generic chatbots, AuraCareer AI operates as a **Sovereign System**:
- **Candidate Sovereignty First**: The candidate owns 100% of their data, credentials, and review gates.
- **Deterministic Finite State Machine (FSM)**: Every job opening follows strict mathematical state transitions.
- **Fact Preservation Guarantee (Zero Hallucination)**: Rigorous formal constraints prevent fabrication of credentials, achievements, or employment history.
- **Mathematical Invariants**: ATS alignment, keyword density, and deduplication hashes are mathematically computed, not guessed.

---

## 2. Universal 7-Layer Architecture (USAF Applied)

```
┌────────────────────────────────────────────────────────────────────────┐
│ Layer 7: Observability, Audit Trail & Live Activity Stream            │
│          (agent_audit_logs, real-time SSE stream, latency counters)    │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 6: Command Center UI (Next.js 16 App Router, React 19, Tailwind)│
│          (Kanban, Resume Studio, Outreach Hub, Learning Matrix)        │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 5: Transport & Security Gateway                                 │
│          (Next.js Route Handlers / NestJS, Zod Schemas, RLS Policies) │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 4: Ingestion & Outreach Adapters                                │
│          (13-Portal Scrapers, Overleaf Snip URI, SMTP/Resend, IMAP)   │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 3: Pure Agent State Machine & Decision Engine                   │
│          (Deterministic FSM, Sentiment Classifier, Tailoring Engine)  │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 2: Persistence Ledger                                           │
│          (Supabase PostgreSQL, pgvector embeddings, immutable logs)   │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 1: Candidate Sovereign Knowledge Base & Golden Invariants       │
│          (Master Resume JSON, STAR achievements, screening bank)      │
└────────────────────────────────────────────────────────────────────────┘
```

### Layer-by-Layer Responsibilities:

- **Layer 1: Sovereign Knowledge Base & Golden Invariants**: The immutable single source of truth for the candidate. Stores verified employment history, educational credentials, quantifiable metrics, technical skills, and answers to recurring screening questions.
- **Layer 2: Persistence Ledger**: Multi-tenant relational persistence backed by Supabase PostgreSQL. Enforces Row Level Security (RLS) on `user_id`. Houses vectorized job descriptions via `pgvector` for semantic similarity search.
- **Layer 3: Pure Agent Decision Engine**: Decoupled from I/O. Implements pure, testable functions for keyword extraction, ATS scoring, resume section re-weighting, and sentiment analysis.
- **Layer 4: Ingestion & Outreach Adapters**: Stealth Crawl4AI / Firecrawl scrapers for 13 job portals, LaTeX compiler and Overleaf snip URL generator, and email transport adapters (Resend / SendGrid / IMAP listener).
- **Layer 5: Transport & Security Gateway**: Validates all incoming payloads using Zod schemas. Enforces authentication, rate limits, and permission boundaries before invoking internal services.
- **Layer 6: Command Center UI**: Modern, high-performance responsive frontend built with Next.js 16, React 19, and Tailwind CSS. Features dark-mode aesthetics, live activity timelines, and interactive Overleaf compile triggers.
- **Layer 7: Observability & Audit Trail**: Real-time event stream logging every state transition, LLM token usage, scrape cycle, and outreach dispatch to ensure total auditability.

---

## 3. The 4 Golden Invariants

### Invariant 1: Fact Preservation Guarantee (Zero Hallucination)
- The agent may re-order, re-weight, emphasize, or tailor bullet points to match target JDs, but it **CANNOT fabricate or hallucinate** employers, job titles, educational degrees, dates, certifications, or unverified achievements.
- Mathematical Rule:
  $$\forall b \in \text{TailoredResume.bullets}, \quad \exists a \in \text{KnowledgeBase.achievements} \quad \text{such that} \quad \text{FactCheck}(b, a) = \text{VALID}$$
- If an application screening question cannot be answered from the Knowledge Base with $\ge 90\%$ certainty, the agent halts submission and escalates to the candidate.

### Invariant 2: Sovereign Candidate Governance (Human-in-the-Loop)
- The candidate holds total authority over their digital identity.
- Three configurable operating modes:
  - **Approval Mode (Default)**: Agent queues 100% of prepared submissions for 1-click candidate approval.
  - **Fully Autonomous**: Agent submits within strict, user-configured daily caps (e.g. 15–25 applications/day).
  - **Assisted Mode**: Agent generates research, tailored LaTeX, and email copy for manual execution.
- Strict daily submission caps and portal rate limits are enforced at the database layer.

### Invariant 3: Cross-Portal Deduplication Invariant
- A candidate must **never apply to the same job opening twice**, regardless of how many portals it is syndicated across.
- Composite Hash Signature:
  $$\text{Hash} = \text{SHA256}(\text{Normalize}(\text{Company}) + \text{Normalize}(\text{Title}) + \text{SemanticFingerprint}(\text{JD}))$$
- When a direct company ATS link exists (Greenhouse, Lever, Workday), the aggregator link (LinkedIn, Indeed) is superseded.

### Invariant 4: Mathematical ATS Alignment & Scoring
- Every tailored resume must satisfy a multi-dimensional objective function before submission:
  $$\text{ATS Score} = w_1 S_{\text{skills}} + w_2 S_{\text{tenure}} + w_3 S_{\text{lexicon}} + w_4 S_{\text{format}} + w_5 S_{\text{star}}$$
  Where:
  - $S_{\text{skills}} \ge 0.85$ (Core competency keyword match)
  - $S_{\text{format}} = 1.0$ (Single-column, standard headings, parseable dates, zero tables/graphics)
  - $S_{\text{star}} \ge 0.70$ (STAR impact density: $\ge 70\%$ of bullets have measurable metrics)

---

## 4. Finite State Machine (FSM): Application & Outreach Lifecycle

```
[DISCOVERED] ──────> [ANALYZED] ──────> [TAILORED] ──────> [QUEUED_FOR_APPROVAL]
                           │                                      │
                           ▼ (Score < Threshold)                  ▼ (Candidate Confirms or Auto)
                      [SKIPPED]                              [SUBMITTED]
                                                                  │
                                                                  ▼
[HR_DISCOVERED] ────> [COLD_EMAIL_DRAFTED] ─> [EMAIL_SENT] ─> [WAITING_FOR_REPLY]
                                                                  │
                           ┌──────────────────────────────────────┼──────────────────────────────┐
                           ▼                                      ▼                              ▼
                 [REPLY_INTERVIEW]                       [REPLY_REJECTION]              [NO_REPLY_FOLLOWUP_DUE]
                 (Alert Candidate)                      (Feed Learning Loop)            (Draft Follow-Up #1)
```

### State Machine Transition Rules:
1. `DISCOVERED -> ANALYZED`: Triggered when scraper completes raw extraction and extracts skills, requirements, and hiring entity.
2. `ANALYZED -> TAILORED`: Occurs only if ATS match score $\ge 65\%$; otherwise transitions to `SKIPPED`.
3. `TAILORED -> QUEUED_FOR_APPROVAL`: LaTeX resume is generated, validated for compile errors, and placed in approval queue.
4. `QUEUED_FOR_APPROVAL -> SUBMITTED`: Triggered by candidate 1-click confirmation (or autonomous scheduler if enabled and daily quota not exceeded).
5. `SUBMITTED -> HR_DISCOVERED`: Scraper adapter queries organizational charts and discovers recruiters/hiring managers.
6. `HR_DISCOVERED -> COLD_EMAIL_DRAFTED`: Contextual cold email written using matched candidate achievements and target JD hooks.
7. `COLD_EMAIL_DRAFTED -> EMAIL_SENT`: Email dispatched via verified SMTP/API adapter with attached LaTeX resume.
8. `EMAIL_SENT -> WAITING_FOR_REPLY`: IMAP listener / webhook activated for inbound response detection.
9. Inbound classification branches:
   - `REPLY_INTERVIEW`: Calendar link extracted, urgent notification dispatched.
   - `REPLY_REJECTION`: Logged to learning engine for conversion attribution.
   - `NO_REPLY_FOLLOWUP_DUE`: Follow-up #1 scheduled after 3 business days; Follow-up #2 after 5 business days; then `CLOSED_NO_REPLY`.

---

## 5. Core Engine Specifications

### 5.1 Job Discovery & Deduplication Engine
- **Supported Platforms (13+)**: LinkedIn, Naukri, Indeed, Glassdoor, Foundit, Wellfound, Internshala, Cutshort, Instahyre, Hirist, Shine, TimesJobs, Greenhouse, Lever, Workday, Ashby, SmartRecruiters.
- **Stealth Scraper Architecture**: Crawl4AI + Firecrawl headless browser sessions with anti-detection fingerprinting, random human-like scroll jitter (3–7s), and rotating residential proxies.
- **Normalization Pipeline**: Trims noise phrases (`Senior Full Stack Developer - Remote / Flexible` $\rightarrow$ `Senior Full Stack Developer`), resolves company corporate parent entities, and stores normalized hashes.

### 5.2 Overleaf & LaTeX ATS Resume Synthesizer
- **Format Integrity**: Employs clean, single-column Deedy/AltaCV format. Completely avoids LaTeX packages known to break ATS parsers (e.g. `tabularx`, nested tikz matrices, multi-column flows).
- **Overleaf Cloud Integration**:
  - Encodes generated LaTeX document into a URI-safe payload.
  - Constructs `https://www.overleaf.com/docs?snip_uri=data:application/x-tex;base64,...` allowing real-time 1-click cloud compile and visual verification.
- **Keyword Alignment Optimizer**: Automatically matches keywords from the JD with candidate's verified skills and reorders experience bullet points to place the most relevant achievements at the top of each role.

### 5.3 Recruiter Discovery & Cold Outreach Engine
- **Contact Enrichment**: Queries Apollo, Hunter, and LinkedIn company directories to resolve verified email addresses for Technical Recruiters and Engineering Managers.
- **Human-Grade Copywriting**:
  - Enforces brevity (under 150 words).
  - Bans generic openings ("I hope this email finds you well").
  - Employs the **Problem-Proof-Proposal Framework**:
    1. *Problem*: Acknowledges team growth / project challenge mentioned in JD.
    2. *Proof*: 1–2 quantified bullet points from candidate's verified achievements solving this exact problem.
    3. *Proposal*: Low-friction call to action ("Are you open to a brief 10-minute sync this Thursday?").
- **Automated Calendar Link Detection**: Regex extracts Calendly, Cal.com, Google Meet, and ChiliPiper URLs from inbound emails.

### 5.4 Closed-Loop Self-Learning & Reinforcement Engine
- **Attribution Matrix**: Tracks every outcome back to:
  - Resume template style.
  - Keyword density tier ($<80\%$, $80-90\%$, $>90\%$).
  - Cold email hook strategy (Direct metric, Team project reference, Tech stack alignment).
  - Portal yield per job category.
- **Dynamic Optimization**: Reinforces successful phrasing in subsequent prompt generations, continuously boosting overall conversion rates.

---

## 6. Persistence Schema & Data Ledger

### Core Tables (Supabase PostgreSQL + pgvector):
```sql
-- Candidate Knowledge Base
CREATE TABLE candidate_knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    master_resume_json JSONB NOT NULL,
    target_titles TEXT[] NOT NULL,
    preferred_locations TEXT[] NOT NULL,
    min_salary_target NUMERIC,
    operating_mode TEXT CHECK (operating_mode IN ('autonomous', 'approval', 'assisted')) DEFAULT 'approval',
    daily_application_cap INT DEFAULT 20,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Screening Question Answers
CREATE TABLE screening_question_bank (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    question_pattern TEXT NOT NULL,
    answer_text TEXT NOT NULL,
    category TEXT,
    confidence_score NUMERIC DEFAULT 1.0,
    verified_by_user BOOLEAN DEFAULT true
);

-- Jobs Ledger
CREATE TABLE jobs_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    dedup_hash TEXT UNIQUE NOT NULL,
    portal TEXT NOT NULL,
    company TEXT NOT NULL,
    title TEXT NOT NULL,
    location TEXT,
    jd_raw TEXT NOT NULL,
    jd_embedding vector(1536),
    status TEXT NOT NULL DEFAULT 'discovered',
    ats_score NUMERIC,
    applied_at TIMESTAMPTZ,
    resume_snapshot_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tailored Resumes & LaTeX Versions
CREATE TABLE tailored_resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs_ledger(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    latex_source TEXT NOT NULL,
    overleaf_url TEXT NOT NULL,
    ats_score NUMERIC NOT NULL,
    matched_skills TEXT[] NOT NULL,
    version INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Outreach Communications
CREATE TABLE outreach_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs_ledger(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recruiter_name TEXT,
    recruiter_email TEXT NOT NULL,
    recruiter_title TEXT,
    email_subject TEXT NOT NULL,
    email_body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'drafted',
    sentiment TEXT,
    booking_link TEXT,
    sent_at TIMESTAMPTZ,
    reply_received_at TIMESTAMPTZ
);

-- Immutable Agent Audit Log
CREATE TABLE agent_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 7. Operational Directives & Testing Verification

1. **Deterministic Test Verification**:
   - Every engine module must be verified by automated unit tests (`vitest`).
   - Testing must cover edge cases: malformed JDs, missing candidate fields, regex punctuation stripping, and calendar link extraction.
2. **Sub-second Client Performance**:
   - Resume formatting, keyword matching, and deduplication logic must run with sub-second client latency.
3. **Continuous Auditability**:
   - No state changes occur without writing an immutable record into `agent_audit_logs`.
