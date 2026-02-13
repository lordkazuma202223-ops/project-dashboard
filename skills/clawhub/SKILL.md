---
name: clawhub
description: Search, browse, install, and update skills from ClawHub.com - the public OpenClaw skills registry. Use when the user wants to find skills for a specific task or capability, install a new skill from ClawHub, update installed skills, list currently installed skills, publish or sync skills to ClawHub, or explore available skills.
---

# ClawHub - Skills Registry

ClawHub is the public skills registry for OpenClaw. This skill provides interactive workflows to search, browse, install, and update skills from ClawHub.com using inline buttons for easy selection.

## Interactive Workflow

This skill is designed for **interactive use** with inline buttons on supported platforms (Telegram, etc.). When searching for skills, present results with buttons for quick installation.

## Quick Reference

- Search for skills: `clawhub search "<query>"` (present with install buttons)
- Install a skill: `clawhub install <slug>`
- Update a skill: `clawhub update <slug>` or `clawhub update --all`
- List installed skills: `clawhub list`
- Publish a skill: `clawhub publish <path> --slug <slug> --name "<name>" --version <version>`

## When to Use This Skill

Use this skill when:

- User asks to "find skills for X" or "search for skills"
- User wants to install a skill they heard about
- User wants to see what skills are available
- User needs to update existing skills
- User wants to publish their own skill to ClawHub
- User asks "what skills do we have?" (for ClawHub, not local)

## Prerequisites

The `clawhub` CLI must be installed to use this skill. Before running commands, verify:

```bash
clawhub --version
```

If not found, install it:
```bash
npm i -g clawhub
```

See [PREREQUISITES.md](references/PREREQUISITES.md) for more details.

## Workflows

### Search and Install (Interactive)

1. **Search for skills** matching the user's need:
   ```bash
   clawhub search "<user's query>"
   ```
   Use natural language queries like "calendar", "image editing", "database", etc.

2. **Present results interactively** with inline buttons:
   - Show skill name, description, and slug for each result
   - Add an "Install [slug]" button for each skill
   - Use the `message` tool with `buttons=[[{text,callback_data}]]`

3. **When user clicks install button** (callback_data contains the slug):
   ```bash
   clawhub install <skill-slug>
   ```
   Skills install to `<workspace>/skills` by default.

4. **Confirm installation** and remind user that a new session is needed:
   > "Installed [skill-name]! You'll need to start a new session for the skill to be picked up."

#### Example Interactive Format

```
Found 3 skills for "calendar":

• **calendar-sync** - Sync with Google Calendar
  [Install calendar-sync]

• **event-manager** - Create and manage events
  [Install event-manager]

• **date-helper** - Date calculations and formatting
  [Install date-helper]
```

### Update Skills

1. **Check installed skills**:
   ```bash
   clawhub list
   ```

2. **Update specific skill**:
   ```bash
   clawhub update <slug>
   ```

3. **Or update all**:
   ```bash
   clawhub update --all
   ```

### Publish a Skill

User must be logged in first (`clawhub login`).

1. **Publish a single skill**:
   ```bash
   clawhub publish <path-to-skill> --slug <slug> --name "Display Name" --version 1.0.0 --tags latest
   ```

2. **Sync multiple skills** (scan and publish new/updated):
   ```bash
   clawhub sync --all
   ```

See [WORKFLOWS.md](references/WORKFLOWS.md) for detailed examples and patterns.

## Common Options

- `--workdir <dir>`: Override working directory (default: current dir or workspace)
- `--no-input`: Non-interactive mode (no prompts)
- `--version <ver>`: Install/update specific version
- `--force`: Overwrite existing files
- `--limit <n>`: Limit search results

## Notes

- Skills are installed to `<workspace>/skills` and take precedence over bundled/managed skills
- New skills require a new OpenClaw session to be picked up
- For detailed CLI documentation, see the ClawHub guide or run `clawhub --help`
