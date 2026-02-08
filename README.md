# Project Dashboard

Real-time monitoring dashboard for OpenClaw workspace.

## Features

- **Cron Jobs Monitoring** - View all scheduled jobs with next runs and status
- **Project Status** - Track deployment status of all projects
- **System Overview** - Monitor disk usage, memory usage, and system health

## Tech Stack

- Next.js 16.1.6 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React (icons)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view.

## Data Sources

### API Endpoints

The dashboard now fetches real data from internal APIs:

**Cron Jobs:** `/api/cron-jobs`
- Returns list of scheduled jobs with status
- Auto-refreshes every 60 seconds
- Shows next run time and status

**Projects:** `/api/projects`
- Returns all registered projects with deployment status
- Tracks last updated timestamp
- Shows active/error/deploying status

**System Status:** `/api/system-status`
- Monitors disk usage (%)
- Monitors memory usage (%)
- Tracks system uptime (hours)
- Health status indicator

### Current Implementation

**Development:**
- Mock data in API routes (for testing)
- Polls every 60 seconds for updates
- Real-time status updates

**Production Integration:**
- Replace mock data with OpenClaw API calls
- Cron jobs: OpenClaw `cron list` endpoint
- Projects: Deployed projects registry
- System: OpenClaw session status API

### Real-Time Features

✅ Auto-refresh every 60 seconds
✅ Instant status updates
✅ Loading states during refresh
✅ Error handling with logger utility
✅ Production-ready API structure

## Future Enhancements

- [ ] WebSocket for instant updates
- [ ] Alert notifications (Telegram/Email)
- [ ] Historical data charts
- [ ] Add/edit cron jobs (API integration)
- [ ] Project deployment triggers (API integration)
- [ ] Error rate limiting and caching
