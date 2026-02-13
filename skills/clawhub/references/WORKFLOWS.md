# ClawHub Workflows

Detailed workflows and examples for common ClawHub operations, with emphasis on interactive experiences using inline buttons.

## Interactive Search with Buttons

When searching for skills, present results with inline buttons for one-click installation on supported platforms (Telegram, etc.).

### Search Command
```bash
clawhub search "calendar"
```

### Presenting Results with Buttons

Use the `message` tool to create interactive buttons:

```python
message(
    action="send",
    channel="telegram",
    to="<user_id>",
    message="Found 3 skills for \"calendar\":\n\n• **calendar-sync** - Sync with Google Calendar\n• **event-manager** - Create and manage events\n• **date-helper** - Date calculations and formatting",
    buttons=[[{"text": "Install calendar-sync", "callback_data": "install calendar-sync"},
             {"text": "Install event-manager", "callback_data": "install event-manager"},
             {"text": "Install date-helper", "callback_data": "install date-helper"}]]
)
```

### Handling Button Callbacks

When a user clicks a button, the callback_data routes back as a user message. Parse and install:

```python
if message.startswith("install "):
    skill_slug = message.split(" ", 1)[1]
    exec(f"clawhub install {skill_slug}")
    # Confirm with user
```

## Search Skills

### Basic Search
```bash
clawhub search "calendar"
clawhub search "image editing"
clawhub search "database postgres"
```

### Limit Results
```bash
clawhub search "automation" --limit 5
```

### Presenting Results to Users
When showing search results, format them clearly (bullet lists work well for Telegram/Discord):

• **skill-name** - Brief description of what it does
• **another-skill** - Another useful skill for something

Include the slug (the installable ID) and a concise description. Always provide inline buttons for quick installation.

## Install Skills

### Basic Installation
```bash
clawhub install my-cool-skill
```

### Install Specific Version
```bash
clawhub install my-cool-skill --version 1.2.0
```

### Force Overwrite
```bash
clawhub install my-cool-skill --force
```

### After Installation
Inform the user that they need to start a new session for the skill to be loaded:
> "Installed! You'll need to start a new session for the skill to be picked up."

## Update Skills

### Update Single Skill
```bash
clawhub update my-cool-skill
```

### Update All Skills
```bash
clawhub update --all
```

### Update to Specific Version
```bash
clawhub update my-cool-skill --version 2.0.0
```

## List Installed Skills

```bash
clawhub list
```

This reads `.clawhub/lock.json` and shows all skills installed via ClawHub.

## Publish Skills

### First-Time Publish
```bash
clawhub publish ./my-skill --slug my-skill --name "My Skill" --version 1.0.0 --tags latest
```

### Publish with Changelog
```bash
clawhub publish ./my-skill --slug my-skill --name "My Skill" --version 1.1.0 --changelog "Added feature X" --tags latest
```

### Publish Without Tags (Empty)
```bash
clawhub publish ./my-skill --slug my-skill --name "My Skill" --version 1.0.0
```

## Sync Multiple Skills

### Dry Run (Preview)
```bash
clawhub sync --dry-run
```

### Sync All (Non-Interactive)
```bash
clawhub sync --all
```

### Sync with Version Bump
```bash
clawhub sync --all --bump patch
clawhub sync --all --bump minor
clawhub sync --all --bump major
```

### Sync with Custom Changelog
```bash
clawhub sync --all --changelog "Regular update"
```

## Interactive Browsing

### Browse by Category
When users want to explore skills, offer category-based browsing with buttons:

```
Browse Skills by Category:

[Calendar & Time]
[Image & Media]
[Database & Storage]
[Automation & Scripts]
[Documents & Files]
[Developer Tools]
[Show All Skills]
```

### Popular Skills
Show popular skills with install buttons:

```
Popular Skills:

• **agent-browser** - Automates web interactions
  [Install]

• **nano-banana-pro** - AI image generation
  [Install]

• **summarize** - Document summarization
  [Install]
```

### Skill Details View
When a user wants more info about a skill before installing:

```
agent-browser

Automates browser interactions for web testing, form filling, screenshots, and data extraction.

Tags: browser, automation, testing
Version: 2.1.0
Stars: 127

[Install agent-browser]  [Search Similar]
```

## Authentication

### Login (Browser Flow)
```bash
clawhub login
```

### Login with Token
```bash
clawhub login --token <your-token>
```

### Logout
```bash
clawhub logout
```

### Check Current User
```bash
clawhub whoami
```

## Common Issues

### "clawhub: command not found"
Install the CLI first:
```bash
npm i -g clawhub
```

### "No skills found"
Make sure `clawhub` is running from the correct directory, or specify `--workdir <workspace-path>`.

### Skills not showing in session
Skills installed via ClawHub require a new session to be loaded. Inform the user to start a fresh session.

### Local changes vs registry
If local skill files don't match any published version, `clawhub update` will prompt before overwriting. Use `--force` to override (in non-interactive mode).
