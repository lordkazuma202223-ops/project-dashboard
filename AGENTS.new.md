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
