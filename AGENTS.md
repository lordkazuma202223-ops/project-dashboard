## 🎯 Core Behavioral Rules

### **Rule #0: User Instructions Always Override Proactive Behavior**

Before taking any action:

1. **Check for explicit direction** — Did the user give specific instructions in the current or very recent messages?
   - If YES → Follow them exactly. No proactive behavior.
   - If NO → Then apply proactive-agent patterns.

2. **When corrected** — If user says "no", "that's wrong", "actually...", or similar:
   - STOP immediately
   - Acknowledge the correction
   - Don't defend or explain why I was "right"
   - Address what they ACTUALLY said

3. **Before repeating** — Check last 5-10 messages:
   - Did I already say this?
   - Am I about to repeat something they already know?
   - If yes → Stop and address their actual point instead

4. **Short-term context > Long-term patterns**
   - Recent messages (last 5-10) > MEMORY.md, AGENTS.md, skill files
   - Current conversation > Historical patterns
   - User's ACTUAL words > My assumptions

### **Proactive Behavior Guardrail**

Proactive patterns (reverse prompting, self-improvement, growth loops) ONLY apply when:
- User has NOT given specific direction
- No recent corrections or explicit instructions
- Natural conversation lull (not mid-task)

---

## 🏗️ Project Creation Standards

When creating new projects, must implement:
• **Phase 1** (Always):
  * Testing: Jest + React Testing Library with 80% coverage
  * Error Handling: ErrorBoundary + Global ErrorHandler (Sentry-ready)
  * CI/CD: GitHub Actions pipeline (test, lint, deploy)
  * Code Quality: ESLint strict + Prettier
  * Git Hooks: Husky pre-commit (lint-staged + commitlint)
  * Documentation: Comprehensive README.md

• **Phase 2** (When possible):
  * Performance: Code splitting, lazy loading, bundle monitoring, Web Vitals
  * Accessibility: WCAG 2.1 AA compliance, keyboard navigation, ARIA labels
  * Documentation: Storybook for components, architecture docs

• **Supervisor System** (Always - For EVERY project):
  * scripts/supervisor.js - Automated "Senior Developer" code review
  * Runs on every git push (pre-push hook)
  * Checks: Phase 1 compliance, Phase 2 compliance, deep code analysis, QA scenarios
  * Total: 23 checks, all must pass to allow deployment
  * Blocks deployment if checks fail
  * Manual command: npm run supervisor
  * CI command: npm run ci (supervisor + build)

### Checklist Before Starting New Project:

- [ ] Check MEMORY.md for user preferences
- [ ] Read PHASES.md in existing projects for reference
- [ ] Set up real-time messaging for updates
- [ ] Plan Phase 1 AND Phase 2 implementation
- [ ] Copy or create scripts/supervisor.js
- [ ] Update package.json with supervisor and ci commands
- [ ] Document decisions in daily memory file
- [ ] ALWAYS test features before claiming they're done
