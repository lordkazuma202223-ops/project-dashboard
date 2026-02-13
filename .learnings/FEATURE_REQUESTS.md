# FEATURE_REQUESTS.md

User-requested capabilities and improvements.

*Last updated: 2026-02-04*

---

## [FEAT-20260208-001] comprehensive_code_review

**Logged**: 2026-02-08T07:00:00Z
**Priority**: high
**Status**: completed
**Area**: backend

### Requested Capability
Comprehensive pre-deployment code review system with multiple checks

### User Context
Need automated code review to prevent deployment issues:
- Syntax validation
- Code quality checks
- Testing verification
- Security auditing
- Project standards compliance

### Complexity Estimate
complex

### Suggested Implementation
Create workspace-level skill with:
- Syntax validation (TypeScript, JSX, HTML, JSON)
- Tag closure verification (prevents unclosed `</div>`)
- Code quality (ESLint, Prettier, console statements)
- Testing (unit tests, coverage thresholds)
- Build verification (production build check)
- Security (npm audit, vulnerability detection)
- Deployment readiness (git status, env vars, docs)
- Phase 1 & Phase 2 standards compliance

Support frameworks: Next.js, React, Node.js, NestJS, Express, Expo, Browser Extensions

### Metadata
- Frequency: recurring
- Related Features: vercel-deploy skill, github skill
- See Also: None

### Resolution
- **Completed**: 2026-02-08T09:00:00Z
- **Location**: C:\Users\user\.openclaw\workspace\skills\code-review\
- **Files**: SKILL.md, supervisor.js (62 checks), configs/, README.md
- **Notes**: 62 total checks across 7 categories, tested on Productivity Dashboard

---

## [FEAT-20260208-002] real_time_project_dashboard

**Logged**: 2026-02-08T10:00:00Z
**Priority**: medium
**Status**: completed
**Area**: frontend

### Requested Capability
Real-time monitoring dashboard for cron jobs, projects, and system status

### User Context
Need centralized view of:
- Cron jobs monitoring with status tracking
- Projects overview with deployment status
- System health metrics (disk, memory, uptime)
- Real-time data fetching from OpenClaw APIs

### Complexity Estimate
medium

### Suggested Implementation
Next.js 16.1.6 application with:
- API endpoints for cron-jobs, projects, system-status
- 60-second auto-refresh polling
- Loading states during refresh
- Timezone support (Asia/Singapore)
- Integration with OpenClaw gateway APIs
- Deployment to Vercel

### Metadata
- Frequency: first_time
- Related Features: OpenClaw gateway, Localtunnel
- See Also: None

### Resolution
- **Completed**: 2026-02-08T10:55:00Z
- **Location**: C:\Users\user\.openclaw\workspace\project-dashboard\
- **URL**: https://project-dashboard-3micukrzy-lordlofis-projects.vercel.app
- **Notes**: Real-time data via Localtunnel to localhost gateway, auto-refresh every 60s

---

## [FEAT-20260208-003] proactive_agent_modification

**Logged**: 2026-02-08T22:23:00Z
**Priority**: high
**Status**: completed
**Area**: config

### Requested Capability
Modify proactive-agent skill to fix over-proactive bias while keeping benefits

### User Context
User wants to:
- Keep proactive-agent skill features (self-improvement, growth loops, memory)
- Fix over-proactive behavior that ignores user instructions
- Add short-term context handling (last 5-10 messages)
- Maintain ability to anticipate needs when appropriate

### Complexity Estimate
simple

### Suggested Implementation
Add "Rule #0" to AGENTS.md:
1. Check for explicit user direction first
2. If user gives instructions → Follow exactly. No proactive behavior
3. If no direction → Then apply proactive patterns
4. Priority: Recent messages > Long-term patterns

### Metadata
- Frequency: first_time
- Related Features: proactive-agent skill, AGENTS.md
- See Also: LRN-20260208-001, LRN-20260208-002

### Resolution
- **Completed**: 2026-02-08T22:23:00Z
- **Location**: C:\Users\user\.openclaw\workspace\AGENTS.md
- **Files**: Added Rule #0 section at top of file
- **Notes**: All proactive features retained, guardrails added to prevent override of user instructions
