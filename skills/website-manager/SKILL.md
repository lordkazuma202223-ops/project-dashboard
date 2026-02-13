---
name: website-manager
description: Manage multiple websites and projects. List deployed sites, track status, and maintain a registry of all your created websites. Use when you have multiple projects or want to manage your web presence.
---

# Website Manager

Manage all your deployed websites and projects in one place. Quick switch between sites, check deployment status, and maintain a registry.

## When to Use

Use this skill when you:
- Want to see a list of all your websites
- Need to quickly switch between projects
- Want to check deployment status
- Want to add a new project to your registry
- Want to manage your web presence

## File Structure

Website registry: `~/.openclaw/websites/registry.json`

```
{
  "websites": [
    {
      "name": "mingalbar-sg",
      "url": "https://mingalbar-sg.vercel.app",
      "description": "Guide for Myanmar newcomers in Singapore",
      "tech_stack": "Next.js, TypeScript, Tailwind",
      "created_at": "2026-02-05T01:31:00+08:00",
      "last_updated": "2026-02-05T09:30:00+08:00",
      "status": "active"
    }
  ]
}
```

## Website List

```bash
# List all websites
cat ~/.openclaw/websites/registry.json

# Or use CLI (create skill that adds this)
```

## Adding New Website

```bash
# Add to registry
npx skills add website-manager update-registry "website-name" "description" "https://preview-url.vercel.app" --status active
```

## Updating Website Status

```bash
# Update website status
npx skills add website-manager update-status "website-name" --status deployed
```

## Switching Context

To switch between websites:
- Edit `~/.openclaw/websites/current.json`
- Or use: `npx skills add website-manager switch "website-name"`

## Quick Actions

### View Websites
```bash
# Show list with details
cat ~/.openclaw/websites/registry.json | jq
```

### Open Website
```bash
# Open in browser
npx skills add website-manager open "website-name"
```

### Deploy New Project
```bash
# Use fullstack-web-builder to deploy new site
npx skills add fullstack-web-builder deploy "create a website about [topic]"
```

### Archive Website
```bash
# Mark as inactive
npx skills add website-manager archive "website-name"
```

## Website Registry Format

Each website in your registry has:

**Basic Information:**
- `name` - Unique identifier
- `url` - Production URL
- `description` - What the website does
- `tech_stack` - Framework and technologies
- `created_at` - Date first deployed
- `last_updated` - Last deployment date
- `status` - active, inactive, archived

**Deployment Details:**
- `preview_url` - Latest preview deployment URL
- `production_url` - Production URL (if different)
- `vercel_project_id` - Vercel project ID
- `build_status` - build success, failed, or pending

**Configuration:**
- `environment` - Variables configured
- `domain` - Custom domain (if any)
- `github_repo` - Connected GitHub repository (if applicable)

## Setup

Initial setup for website manager:

```bash
# Create registry directory
mkdir -p ~/.openclaw/websites

# Initialize registry
cat > ~/.openclaw/websites/registry.json <<EOF
{
  "websites": [],
  "current": null
  "current_context": null
}
EOF

# Add to fullstack-web-builder workflow
# After each deployment, automatically add to registry
```

## Commands

### List Websites
```bash
npx skills add website-manager list
```

### Add Website
```bash
npx skills add website-manager add "site-name" "description" "url" "https://preview-url.vercel.app"
```

### Update Status
```bash
npx skills add website-manager update-status "site-name" --status deployed
```

### Open Site
```bash
npx skills add website-manager open "site-name"
```

### Remove Site
```bash
npx skills add website-manager remove "site-name"
```

### Switch Current Site
```bash
npx skills add website-manager switch "site-name"
```

## Integration with Fullstack Web Builder

When you deploy a new website using fullstack-web-builder:

1. Fullstack-web-builder will automatically register the site
2. Add to `~/.openclaw/websites/registry.json`
3. Store deployment details

```bash
# Fullstack-web-builder will call:
npx skills add website-manager register "name" "url" "description" "tech-stack" "status"
```

## Tips

### Organize by Category
Add category metadata to each website:
```json
"category": "personal" | "business" | "portfolio" | "blog"
```

### Track Deployments
Maintain a deployment history:
```json
{
  "deployments": [
    {
      "date": "2026-02-05T09:30:00+08:00",
      "website": "mingalbar-sg",
      "action": "deploy",
      "url": "https://mingalbar-sg.vercel.app"
    }
  ]
}
```

## Troubleshooting

### Registry Not Found
```bash
mkdir -p ~/.openclaw/websites
cat > ~/.openclaw/websites/registry.json <<EOF
{
  "websites": [],
  "current": null,
  "current_context": null
}
EOF
```

### Website Not Registered
```bash
# If deployed site not in registry:
npx skills add website-manager register "site-name" "url" "description"
```

## Future Features

- Search websites by category
- Tag websites with labels (production, staging, personal)
- Export registry to JSON backup
- Quick deploy multiple sites at once
- Website health checks (uptime, SSL status)
- Analytics integration
