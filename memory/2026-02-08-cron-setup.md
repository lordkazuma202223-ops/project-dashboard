## Capability-Evolver Automated Setup (2026-02-08 10:56 PM)

### Configured Cron Jobs

**Old Job (Disabled):**
- Name: capability-evolver-daily
- Schedule: 2:00 AM daily (Asia/Singapore)
- Status: Disabled (no review mode, less safe)

**New Job (Active):**
- Name: Capability Evolver Daily Review
- Schedule: 3:00 AM daily (Asia/Singapore)
- Mode: Review (--review flag)
- Status: Enabled

### How It Works

**Daily at 3 AM:**
1. Cron job injects system event: "Capability-evolver review: Run cd ~/.openclaw/skills/capability-evolver && node index.js run --review"
2. Capability-evolver analyzes patterns from candidates.jsonl
3. Proposes evolution improvements based on detected signals
4. **Asks for approval** before applying changes (review mode)
5. User can approve/deny each proposed evolution
6. Approved changes are applied and captured as Capsules

### Current Schedule

| Job | Time | Frequency | Status |
|-----|------|------------|--------|
| heartbeat-hourly | Every hour | Hourly | ✅ Active |
| Daily Motivation (Burmese) | 8:00 AM | Weekdays | ✅ Active |
| capability-evolver-daily | 2:00 AM | Daily | ❌ Disabled |
| Capability Evolver Daily Review | 3:00 AM | Daily | ✅ Active (NEW) |

### Safety Features

- **Review mode**: No automatic changes without approval
- **Small, reversible patches**: All changes are limited in scope
- **Validation steps**: Each evolution is validated before application
- **Rollback on failure**: Failed evolutions are rolled back
- **Audit trail**: All evolutions recorded in events.jsonl

### What Gets Captured

**Signals:**
- Repeated tool usage patterns (exec, read, write, cron, process)
- Protocol drift (user instructions not followed)
- Memory missing (context not captured)
- Log errors (runtime failures)

**Output:**
- Capsules: Reusable solutions for common problems
- EvolutionEvents: Audit trail of all evolutions
- Gene updates: Pattern recognition improvements

### Expected Impact

**Before:**
- Patterns detected but never acted on
- Manual intervention required for every improvement
- No reusable knowledge base

**After:**
- Daily automatic analysis of patterns
- Human-in-the-loop approval process
- Reusable Capsules accumulate over time
- Continuous, systematic evolution

### Next Run

First automated run: **Tomorrow at 3:00 AM (Asia/Singapore)**

---

*End of 2026-02-08 cron setup*
