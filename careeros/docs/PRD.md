# Product Requirements Document (PRD)
# AuraCareer AI — Sovereign Autonomous Career Operating System by BitmAura

**Document Version**: 2.1.0  
**Status**: Approved & Institutional Baseline  
**Brand Identity**: AuraCareer AI (BitmAura)  
**Workspace**: `p:\Carrer OS AI`  

---

## 1. Executive Summary & Vision

### 1.1 The Problem Statement
The modern employment landscape is structurally broken for candidates:
- **Mass Disqualification by Opaque ATS Bots**: Over 75% of qualified resumes are filtered out before reaching a human recruiter due to non-standard layouts, graphics, tables, or lack of precise keyword alignment.
- **Application Fatigue & Time Sink**: Applying to 20 relevant positions manually requires 30–40 hours per week of repetitive portal navigation, form filling, and screening question re-entry.
- **Portal Fragmentation**: Opportunities are scattered across 13+ distinct platforms (LinkedIn, Naukri, Indeed, Glassdoor, Foundit, Wellfound, Internshala, Cutshort, Instahyre, Hirist, Shine, TimesJobs, and direct company ATS portals).
- **The "Black Hole" Effect**: Less than 3% of direct portal submissions yield recruiter responses without targeted, direct cold email outreach to hiring managers.
- **Zero Closed-Loop Feedback**: Candidates submit hundreds of applications without understanding which resume variants, keywords, or email hooks resonate with recruiters.

### 1.2 The Sovereign Solution
**AuraCareer AI** is an autonomous, persistent, sovereign career operating system engineered by **BitmAura** that executes the entire job discovery, Overleaf/LaTeX resume tailoring, multi-portal application submission, HR cold email outreach, response sentiment analysis, and continuous self-learning loop on behalf of the candidate.

Operating under strict candidate sovereignty and the **6 Immutable Laws of the Sovereign Architect**, AuraCareer AI operates 24/7 as a 50-person specialized talent agency dedicated to a single candidate.

---

## 2. Candidate Persona & User Onboarding Journey

### 2.1 Candidate Knowledge Base Inputs
During onboarding, the candidate establishes their sovereign profile:
1. **Master Resume**: Parsed into structured JSON schema (Education, Experience, Verified Achievements, Technical Skills, Projects, Certifications).
2. **Target Preferences**:
   - Up to 3 Target Job Titles (e.g. *Senior Full-Stack Engineer*, *Staff AI/ML Engineer*, *Principal Solutions Architect*).
   - Preferred Locations & Work Modes (Remote, Hybrid, On-site, Specific Geographies / Relocation).
   - Experience Level & Seniority Tier (Junior, Mid, Senior, Lead, Staff, Director).
   - Compensation Parameters (Base Target, Equity Target, Minimum Acceptable CTC/Salary).
3. **Screening Knowledge Base**: Pre-answered answers for standard portal questions (Visa status, notice period, willingness to relocate, diversity, clearance, GitHub/Portfolio URLs).

### 2.2 Operating Modes
The candidate selects their operational governance model:
- **Approval Mode (Default / Recommended)**: The agent conducts 100% of research, deduplication, LaTeX resume tailoring, and email drafting. All actions queue up in the pending approvals hub. The candidate reviews and approves in 1 click before submission.
- **Fully Autonomous Mode**: The agent automatically submits applications and dispatches outreach within strict, user-configured daily caps (e.g. 15–25 applications/day) and portal rate limits.
- **Assisted Mode**: The agent produces the tailored LaTeX resume, ATS match score, and recruiter email packet, leaving actual submission to candidate manual execution.

---

## 3. Core Functional Pillars & Requirements

### Pillar 1: Multi-Portal Job Discovery & Cross-Portal Deduplication
- **1.1 Coverage of 13+ Platforms**:
  - Global aggregators: LinkedIn, Indeed, Glassdoor.
  - Regional & Specialized tech hubs: Naukri, Foundit, Wellfound (AngelList), Internshala, Cutshort, Instahyre, Hirist, Shine, TimesJobs.
  - Direct ATS platforms: Workday, Greenhouse, Lever, Ashby, SmartRecruiters.
- **1.2 Ingestion Engine**:
  - Stealth browser scraping and structured JSON extraction via Crawl4AI and Firecrawl patterns.
  - Periodic polling intervals with jitter and proxy rotation to avoid IP rate-limiting.
- **1.3 Cross-Portal Deduplication Invariant**:
  - SHA-256 fingerprint generated: `Hash(Normalize(Company) + Normalize(Title) + SemanticFingerprint(JD))`.
  - Same role posted across multiple aggregators is merged into a single canonical entity.
  - ATS links take priority over 3rd-party aggregators.

### Pillar 2: Overleaf & LaTeX ATS-Friendly Resume Synthesizer
- **2.1 Compile-Ready LaTeX Code Generation**:
  - Outputs single-column, standard typography (Deedy/AltaCV format) guaranteed to compile with `pdflatex` or `xelatex`.
  - Strictly bans multi-column tables, unparseable graphics, canvas elements, and unusual character sets.
- **2.2 Instant Overleaf Cloud Integration**:
  - Generates an instant 1-click cloud URL (`https://www.overleaf.com/docs?snip_uri=...`) allowing candidates to inspect, edit, and compile in the Overleaf cloud IDE in real time.
- **2.3 Mathematical ATS Alignment**:
  - Calculates a quantitative ATS match score (0–100%) evaluating:
    1. Core Competencies & Skills Match ($\ge 85\%$ target).
    2. Experience Level & Tenure Match.
    3. Industry & Role Lexicon Alignment.
    4. Single-column parseable layout compliance.
    5. Quantified STAR Impact Density ($\ge 70\%$ of bullet points contain measurable metrics).
- **2.4 Fact Preservation Guarantee**:
  - Zero hallucination: The agent re-weights, emphasizes, and tailors candidate achievements to JD keywords, but **never fabricates** employers, titles, degrees, dates, or unverified achievements.

### Pillar 3: Multi-Portal Form Filling & Application Submission
- **3.1 Automated Form Filling**:
  - Auto-fills candidate personal details, education, past employers, links, and screening questions.
- **3.2 Escalation Engine for Unknown Questions**:
  - When a portal question cannot be resolved from the Candidate Knowledge Base with $\ge 90\%$ certainty, the agent halts submission and alerts the candidate for confirmation.
  - Once answered, the response is persisted into the Knowledge Base for future autonomous reuse.
- **3.3 Immutable Application Ledger**:
  - Every submission captures an immutable snapshot: Exact LaTeX resume version, answers supplied, submission timestamp, confirmation screenshot/ID, and portal link.

### Pillar 4: Recruiter Discovery & Cold Outreach Engine
- **4.1 Recruiter Identification**:
  - Identifies relevant talent acquisition specialists, technical recruiters, hiring managers, and department heads associated with the job opening.
- **4.2 Human-Grade Cold Email Generation**:
  - Generates concise, hyper-relevant, non-templated cold emails referencing specific company challenges, team projects, and candidate's matching achievements.
  - Attaches tailored ATS LaTeX resume.
- **4.3 Response Sentiment Classifier**:
  - Automatically parses incoming recruiter replies:
    - `interview_opportunity`: Triggers immediate high-priority dashboard alert and extracts calendar booking links (Calendly, Cal.com, Google Meet).
    - `positive`: Recruiter interested; drafts tailored follow-up.
    - `action_required`: Missing info requested; pulls from Knowledge Base.
    - `neutral`: Acknowledgment logged.
    - `rejection`: Logged for closed-loop learning.
- **4.4 Multi-Stage Follow-Up Sequence**:
  - Supports up to 2 gentle follow-ups spaced 3 to 5 business days apart if no reply is received. Automatically halts if a reply is detected.

### Pillar 5: Closed-Loop Self-Learning & Reinforcement Engine
- **5.1 Conversion Analytics**:
  - Tracks conversion funnels across: Discovered $\rightarrow$ Tailored $\rightarrow$ Submitted $\rightarrow$ Recruiter Reply $\rightarrow$ Interview Secured.
- **5.2 A/B Testing Matrix**:
  - Evaluates resume templates (Modern single-column vs Traditional academic vs AltaCV).
  - Evaluates cold email subject lines, opening hooks, and send times.
  - Evaluates portal response yields (e.g. Wellfound vs LinkedIn vs Cutshort).
- **5.3 Continuous Prompt & Strategy Optimization**:
  - System updates prompt weights based on positive yields, reinforcing winning bullet phrasing and high-converting email hooks.

### Pillar 6: Unified Command Center UI
- **6.1 Live Activity Stream**: Real-time audit log of agent actions (scrapes, tailor events, approval queues, email dispatches).
- **6.2 Job Tracker & Kanban**: Full visualization across lifecycle stages.
- **6.3 Resume Studio**: Side-by-side JD vs LaTeX editor, Overleaf 1-click compile button, and ATS score radar.
- **6.4 Outreach Hub**: Cold email queue, thread history, sentiment indicators, and calendar booking link shortcuts.
- **6.5 Learning Dashboard**: Visual representation of A/B test results, portal response rates, and recurring question bank.

---

## 4. Non-Functional Requirements

| Dimension | Specification |
| :--- | :--- |
| **Data Sovereignty & Security** | AES-256 encryption at rest for candidate credentials; Supabase Row Level Security (RLS); zero multi-tenant data leakage. |
| **Auditability** | 100% deterministic event ledger (`agent_audit_logs`) recording every state transition, LLM prompt, and candidate decision. |
| **System Latency** | Resume tailoring and ATS scoring under 3.5 seconds; LaTeX generation under 500ms; UI state updates under 100ms. |
| **Anti-Detection & Resilience**| Randomized scraping jitter (3–8s), headless browser fingerprint masking, HTTP proxy rotation, strict portal rate limits. |
| **Scalability** | Distributed worker queue (BullMQ / Redis / Python async workers) capable of processing 10,000+ daily candidate discovery tasks. |

---

## 5. Success Metrics & Target KPIs

- **Interview Conversion Rate**: $\ge 12\%$ of submitted applications resulting in recruiter screens or interviews (vs industry baseline of 1.5–3%).
- **ATS Compliance Rate**: 100% of generated LaTeX resumes score $\ge 85\%$ on ATS parser benchmarks.
- **Recruiter Cold Email Reply Rate**: $\ge 22\%$ positive reply rate on personalized outreach.
- **Candidate Time Saved**: $\ge 95\%$ reduction in manual hours spent applying to jobs (from 35 hours/week to $< 1.5$ hours/week of review).
- **Zero Hallucination Tolerance**: 0% fabricated facts, employers, or credentials in any generated artifact.
