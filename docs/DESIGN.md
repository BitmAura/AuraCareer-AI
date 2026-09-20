# DESIGN.md — UI/UX Design System & Aesthetics Specification
# AuraCareer AI (BitmAura) — Autonomous Job Automation Command Center

> **Design Philosophy**: High-precision, dark-mode-first sovereign command center inspired by Linear, Raycast, and Vercel. Engineered for cognitive clarity, high information density, sub-second perceived latency, and aesthetic distinction.

---

## 1. Visual Identity & Design Principles

1. **Information Density with Breathing Room**:
   - Power users and candidates need deep visibility into background agent activity without visual clutter. Use strict grid alignments, curated badges, and subtle separators.
2. **Tactile Feedback & Live Pulse**:
   - The interface must feel actively alive. Background scrapers, tailoring runs, and email dispatches emit glowing micro-pulses, animated status dots, and live timeline feeds.
3. **Restraint & Purposeful Color**:
   - Dark surfaces dominate. Vibrant semantic accents (Indigo, Cyan, Emerald, Amber, Rose) are reserved exclusively for state transitions, ATS match scores, and action alerts.
4. **Monospace Domain Precision**:
   - LaTeX code, deduplication hashes, and API endpoints are styled in clean monospace (`JetBrains Mono` / `ui-monospace`) with high contrast.

---

## 2. Color Palette & Token System

### 2.1 Surfaces & Backgrounds
```css
--bg-canvas:       #090A0F;  /* Ultra-deep obsidian background */
--bg-surface:      #0F111A;  /* Primary container surface */
--bg-elevated:     #161926;  /* Elevated cards, dropdowns, modals */
--bg-highlight:    #1E2235;  /* Hover states & selected list rows */
--border-subtle:   #1E2333;  /* 1px subtle container borders */
--border-active:   #313952;  /* Focused / active element borders */
--border-accent:   rgba(99, 102, 241, 0.4); /* Glowing focus ring */
```

### 2.2 Semantic Accents
```css
--brand-primary:   #6366F1;  /* Electric Indigo - primary CTA, agent actions */
--brand-secondary: #06B6D4;  /* Cyan Pulse - discovery, scraping, research */
--state-success:   #10B981;  /* Emerald - submitted, interview secured, high ATS */
--state-warning:   #F59E0B;  /* Amber - approval required, unknown question */
--state-danger:    #F43F5E;  /* Rose - rejection, portal rate-limit, error */
--state-neutral:   #64748B;  /* Slate - skipped, drafted, archived */
```

### 2.3 Typography Colors
```css
--text-primary:    #F8FAFC;  /* 98% brightness for primary headings */
--text-secondary:  #94A3B8;  /* Readable muted gray for descriptions */
--text-muted:      #64748B;  /* Subtle timestamps, metadata, labels */
--text-inverse:    #090A0F;  /* Contrast text on bright badges */
```

---

## 3. Typography Scale & Hierarchy

- **Primary Font**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`
- **Monospace Font**: `JetBrains Mono`, `Fira Code`, `Consolas`, `monospace`

| Style Token | Size | Line Height | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `display-xl` | 32px | 40px | 700 | -0.025em | Command Center hero stat headings |
| `title-lg` | 24px | 32px | 600 | -0.02em | Page titles, major section headers |
| `title-md` | 18px | 26px | 600 | -0.015em | Card headers, modal titles |
| `title-sm` | 15px | 22px | 500 | -0.01em | Sub-card headers, list item titles |
| `body-base` | 14px | 20px | 400 | normal | Standard body text, descriptions |
| `caption` | 12px | 16px | 500 | +0.02em | Form labels, metadata, timestamps |
| `badge-pill` | 11px | 14px | 600 | +0.04em | Status tags, uppercase pill labels |
| `code-sm` | 13px | 18px | 400 | normal | LaTeX source, JSON view, hash codes |

---

## 4. Spacing System & Layout Architecture

Follows a strict **8-point geometric grid**:
- Spacing units: `4px` (xxs), `8px` (xs), `12px` (sm), `16px` (md), `24px` (lg), `32px` (xl), `48px` (2xl).

### Layout Geometry
```
┌────────────────────────────────────────────────────────────────────────┐
│ Top Bar: Agent Status • Daily Quota Meter (18/25) • Quick Mode Switch  │
├──────────────┬─────────────────────────────────────────────────────────┤
│ Sidebar      │ Main Viewport: Fluid Responsive Canvas                  │
│ (240px fixed)│                                                         │
│ • Dashboard  │  [KPI Metric Cards: Discovered, Tailored, Applied, Int] │
│ • Jobs       │                                                         │
│ • Resumes    │  ┌─────────────────────────────┬──────────────────────┐ │
│ • Outreach   │  │ Main Workflow Panel         │ Live Activity Feed   │ │
│ • Learning   │  │ (Kanban / Editor / Queue)   │ (Real-time SSE audit)│ │
│ • Settings   │  └─────────────────────────────┴──────────────────────┘ │
└──────────────┴─────────────────────────────────────────────────────────┘
```

---

## 5. Component Design System

### 5.1 Operating Mode Switcher Card
- **Visual Design**: Sleek glassmorphic card with a 3-way toggle (`Approval Mode` | `Autonomous` | `Assisted`).
- **Active State Indicator**: Glowing radial halo around the active mode.
- **Daily Quota Progress Bar**: Linear gradient (`#6366F1` to `#06B6D4`) showing applications used today against the user-configured daily cap.

### 5.2 ATS Score Radial Gauge
- High-contrast circular progress ring:
  - $\ge 85\%$: Emerald (`#10B981`) with glowing drop-shadow.
  - $70\% - 84\%$: Amber (`#F59E0B`).
  - $< 70\%$: Rose (`#F43F5E`).
- Centered percentage readout with sub-breakdown tooltip (Skills, Tenure, Lexicon, Layout, STAR metrics).

### 5.3 Resume Studio & Overleaf 1-Click Button
- **Split Pane**: Left pane displays parsed JD keywords and required competencies; right pane contains syntax-highlighted LaTeX source code.
- **Overleaf Action Button**:
  - Styled with Overleaf green branding (`#127C44` hover `#0E6637`).
  - Includes external link icon.
  - Instantly opens the compile-ready LaTeX document in the Overleaf cloud editor via `https://www.overleaf.com/docs?snip_uri=...`.

### 5.4 Outreach & Recruiter Response Cards
- **Sentiment Indicator Badges**:
  - `interview_opportunity`: Pulsing Emerald badge with Calendar icon. Prominently highlights extracted Calendly/Cal.com booking buttons.
  - `positive`: Blue badge with thumbs-up icon.
  - `action_required`: Amber badge with alert triangle. Triggers 1-click answer modal.
  - `rejection`: Muted Slate badge with learning attribution tag.

### 5.5 Live Activity Feed Timeline
- Vertical glowing line with event nodes.
- Each event row displays:
  - Relative timestamp (`2m ago`, `Just now`).
  - Event type badge (`SCRAPE`, `TAILOR`, `APPROVAL`, `EMAIL_SENT`, `REPLY`).
  - Target company & role link.
  - Secondary metadata snippet (e.g. `ATS Score: 92%`, `Domain verified`).

---

## 6. Motion & Micro-Interactions

- **Card Hover Elevation**: `transition: transform 180ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 180ms ease`. Cards elevate by 2px on hover with a subtle indigo glow (`box-shadow: 0 8px 24px -4px rgba(99, 102, 241, 0.15)`).
- **Status Pulse**: Active scraper runs and email watchers feature a perpetual 2-second pulse animation (`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`).
- **Button Feedback**: Active button press responds with `transform: scale(0.98)` for immediate tactile confirmation.
- **Modal Transitions**: `opacity: 0 -> 1`, `transform: scale(0.96) -> scale(1.0)` over 200ms with backdrop blur `backdrop-blur-md`.
