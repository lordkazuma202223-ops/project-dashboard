# Prerequisites

## ClawHub CLI Installation

The ClawHub CLI (`clawhub`) must be installed to use this skill.

### Install via npm
```bash
npm i -g clawhub
```

### Install via pnpm
```bash
pnpm add -g clawhub
```

### Verify Installation
```bash
clawhub --version
```

## Checking for CLI Availability

Before running any ClawHub commands, check if the CLI is installed:

```bash
clawhub --version
```

If the CLI is not found, inform the user and offer to help them install it with:
```bash
npm i -g clawhub
```

## Authentication

Some commands require authentication (like publishing or syncing):
- `clawhub login` - Browser-based login flow
- `clawhub login --token <token>` - Login with API token

For basic search and install, authentication is not required.
