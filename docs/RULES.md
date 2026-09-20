# RULES.md — Immutable Operational & Engineering Rules
# AuraCareer AI (BitmAura) Sovereign Autonomous Job Automation System

> **AUTHORITATIVE DIRECTIVE**:  
> Every engineer, agent, subagent, and automated process working in this repository must strictly adhere to these rules. There are **ZERO EXCEPTIONS**.

---

## 1. Candidate Sovereignty & Fact Preservation Rules

### Rule 1.1: The Zero Hallucination Law (Fact Preservation Guarantee)
- Under no circumstances may the agent fabricate, hallucinate, embellish, or invent:
  - Employers, companies, or organizations.
  - Job titles, roles, or promotions.
  - Dates of employment, matriculation, or graduation.
  - Educational institutions, degrees, majors, or GPAs.
  - Certifications, licenses, or accreditations.
  - Quantified metrics or unverified achievements.
- **Allowed Actions**:
  - The agent MAY re-order bullet points to highlight relevancy to target JD keywords.
  - The agent MAY re-weight and re-phrase bullet points to emphasize verified technologies matching the JD lexicon.
  - The agent MAY select which projects to include from the candidate's Master Knowledge Base.
- **Enforcement**: Any generated resume containing an achievement not mathematically traceable to the candidate's Knowledge Base is rejected by the compiler.

### Rule 1.2: The Candidate Approval Gate
- **Default Mode**: CareerOS operates in **Approval Mode** by default.
- No job application may be submitted, and no cold outreach email may be dispatched, without candidate confirmation unless the candidate has explicitly enabled **Fully Autonomous Mode**.
- In **Autonomous Mode**, hard daily application caps (default 15–25/day) are strictly enforced at the database level. Once reached, the agent halts until the next 24-hour cycle.

### Rule 1.3: Unanswered Question Escalation
- If an application portal presents a question that cannot be answered with $\ge 90\%$ certainty from the Candidate Knowledge Base, the agent **MUST NOT GUESS**.
- The agent must pause submission, set status to `ACTION_REQUIRED`, and notify the candidate.
- Once confirmed by the candidate, the answer is saved to `screening_question_bank` for future reuse.

---

## 2. Scraping, Discovery & Deduplication Rules

### Rule 2.1: The Cross-Portal Deduplication Invariant
- A candidate must **never apply to the same job opening twice**, even if the role is syndicated across multiple portals (e.g. LinkedIn, Naukri, Indeed, Glassdoor).
- Deduplication Hash = `SHA256(Normalize(Company) + Normalize(Title) + SemanticFingerprint(JD))`.
- If an application already exists with this hash, the duplicate entry must be discarded or linked as an alias.

### Rule 2.2: ATS Direct Link Priority
- If both a third-party aggregator link (e.g. LinkedIn, Indeed) and a direct ATS link (e.g. Greenhouse, Lever, Workday, Ashby) exist for the same opening, the agent must **always prioritize the direct ATS portal**.

### Rule 2.3: Anti-Ban & Ethical Scraping Guardrails
- Scrapers must employ randomized human-like jitter between requests (minimum 3–7 seconds).
- Direct browser scraping must rotate headers, user-agents, and IP proxies.
- Scrapers must strictly respect portal rate limits and disengage immediately upon detecting CAPTCHAs or Cloudflare blocks.

---

## 3. Resume Synthesis & LaTeX ATS Rules

### Rule 3.1: Strict ATS Formatting Standards
- Resumes must be generated as compile-ready LaTeX code in single-column layout (Deedy/AltaCV format).
- **Strictly Banned**:
  - Multi-column tables (`tabularx`, multi-column `table` environments).
  - Icons, images, headshots, or graphic ornaments.
  - Non-standard fonts or unusual character encodings.
  - Unparseable date representations (standard: `MMM YYYY – MMM YYYY` or `MM/YYYY`).
- Standard ATS section headers must be used: `Experience`, `Education`, `Technical Skills`, `Projects`, `Certifications`.

### Rule 3.2: 1-Click Overleaf Cloud Compilation
- Every tailored LaTeX resume must generate a valid, URI-safe Overleaf cloud URL (`https://www.overleaf.com/docs?snip_uri=...`) allowing instant candidate review, modification, and PDF download.

### Rule 3.3: Mathematical ATS Alignment Gate
- A tailored resume cannot be submitted unless its calculated ATS score reaches at least **85%**.
- Required scoring weights:
  - Core Skills Match: 35%
  - Experience & Tenure Match: 25%
  - Industry Lexicon Alignment: 20%
  - Layout & Format Compliance: 10%
  - Quantified STAR Metric Density ($\ge 70\%$ of bullets with numbers): 10%

---

## 4. Recruiter Outreach & Follow-Up Rules

### Rule 4.1: Recruiter Domain Verification
- The agent may only send cold outreach to email addresses whose domain matches the target employer's official domain (e.g. `@stripe.com`, `@uber.com`).
- Third-party personal email addresses (e.g. personal Gmail/Yahoo) are strictly forbidden unless publicly listed on the job posting.

### Rule 4.2: Anti-Spam Cadence & Outreach Limits
- Maximum **1 initial cold email** per job opening.
- Maximum **2 follow-ups**, spaced 3 to 5 business days apart.
- If the recruiter replies with ANY response, all future automated follow-up sequences for that thread are **immediately cancelled**.
- Cold emails must never exceed 150 words and must strictly follow the Problem-Proof-Proposal structure.

### Rule 4.3: Sentiment Classification & Calendar Assist
- Inbound replies must be parsed through the Sentiment Analyzer.
- When an email contains meeting links (Calendly, Cal.com, Google Meet), the agent must tag the status as `interview_opportunity` and surface the booking link on the dashboard immediately.

---

## 5. Engineering, Security & Code Quality Standards

### Rule 5.1: Zero Placeholder Policy
- Code must be production-ready and fully implemented.
- **Banned**: `// TODO: implement this`, `/* write later */`, stub mock implementations pretending to work, or fake delays.

### Rule 5.2: Strict Typing & Validation
- 100% TypeScript with strict mode enabled (`noImplicitAny: true`).
- Every external API endpoint, worker payload, and database transition must be validated using **Zod** schemas.

### Rule 5.3: Automated Test Verification
- All business logic (keyword matching, deduplication hashing, LaTeX generation, sentiment analysis, learning engine updates) must have accompanying **Vitest** unit tests.
- Every commit must pass `npm run test` with zero failures.

### Rule 5.4: Persistence & Data Security
- Supabase PostgreSQL Row Level Security (RLS) is mandatory on every table containing user data.
- Sensitive credentials (email tokens, API keys, resume documents) must remain encrypted and candidate-controlled.
- Every state transition must emit an immutable log into `agent_audit_logs`.
