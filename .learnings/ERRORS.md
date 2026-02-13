# ERRORS.md

Command failures, exceptions, and unexpected behavior.

*Last updated: 2026-02-04*

---

## [ERR-20260208-001] supervisor_build_timeout

**Logged**: 2026-02-08T09:00:00Z
**Priority**: high
**Status**: resolved
**Area**: backend

### Summary
Code review supervisor hangs when running Next.js production builds

### Error
```
Timeout - Supervisor hung indefinitely on npm run build
Next.js production build takes 20-30+ seconds
```

### Context
- **Command/operation attempted**: `npm run build`
- **Project**: Next.js 16.1.6 application
- **Location**: Code review skill, supervisor.js, runCommand()
- **Framework**: Next.js with TypeScript
- **Environment**: Windows_NT, Node.js v24.13.0

### Suggested Fix
Add timeout handling to runCommand():
```javascript
const timeouts = {
  build: 300000,  // 5 minutes for builds
  default: 60000   // 1 minute for other commands
};

// Use appropriate timeout based on command type
const timeout = isBuildCommand ? timeouts.build : timeouts.default;
```

### Metadata
- Reproducible: yes
- Related Files: C:\Users\user\.openclaw\workspace\skills\code-review\supervisor.js
- See Also: LRN-20260208-003

### Resolution
- **Resolved**: 2026-02-08T09:15:00Z
- **Commit**: Updated supervisor.js with timeout handling
- **Notes**: 5-minute timeout for builds, 1-minute default, graceful error messages

---

## [ERR-20260208-002] supervisorConfig_undefined

**Logged**: 2026-02-08T09:20:00Z
**Priority**: high
**Status**: resolved
**Area**: backend

### Summary
Cannot read properties of undefined when accessing supervisorConfig.checks

### Error
```
Cannot read properties of undefined (reading 'checks')
TypeError: Cannot read properties of undefined (reading 'checks')
```

### Context
- **Command/operation attempted**: Running code review checks
- **Trigger**: Checking test coverage
- **Root Cause**: When package.json doesn't exist, detectProject() returned object without supervisorConfig property
- **Location**: Code review skill, supervisor.js

### Suggested Fix
Always initialize supervisorConfig with defaults:
```javascript
const supervisorConfig = project.supervisorConfig || {
  checks: {},
  thresholds: {},
  skip: [],
  strictness: 'production'
};
```

### Metadata
- Reproducible: yes
- Related Files: C:\Users\user\.openclaw\workspace\skills\code-review\supervisor.js
- See Also: LRN-20260208-004, ERR-20260208-003

### Resolution
- **Resolved**: 2026-02-08T09:30:00Z
- **Commit**: Added default initialization in detectProject()
- **Notes**: All code paths now have supervisorConfig defaults

---

## [ERR-20260208-003] projectDeps_undefined

**Logged**: 2026-02-08T09:25:00Z
**Priority**: high
**Status**: resolved
**Area**: backend

### Summary
Cannot read properties of undefined when checking JSX tag closure

### Error
```
Cannot read properties of undefined (reading 'react')
TypeError: Cannot read properties of undefined (reading 'react')
```

### Context
- **Command/operation attempted**: JSX tag closure verification
- **Trigger**: Checking for React dependencies to enable JSX validation
- **Root Cause**: No null checks for project.deps when package.json parsing failed
- **Location**: Code review skill, supervisor.js, JSX check function

### Suggested Fix
Add optional chaining and null checks:
```javascript
// Before
if (project.deps.react) { /* JSX checks */ }

// After
if (project.deps?.react) { /* JSX checks */ }

// Multiple locations updated
const reactVersion = project.deps?.react || project.deps?.['react-dom'];
const hasReact = !!reactVersion;
```

### Metadata
- Reproducible: yes
- Related Files: C:\Users\user\.openclaw\workspace\skills\code-review\supervisor.js
- See Also: LRN-20260208-004, ERR-20260208-002

### Resolution
- **Resolved**: 2026-02-08T09:30:00Z
- **Commit**: Added optional chaining throughout supervisor.js
- **Notes**: All project.deps accesses now safely handle missing package.json
