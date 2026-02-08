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

Currently uses mock data. Production integration points:

- Cron jobs: OpenClaw gateway API
- Projects: website-manager registry
- System: Session status API

## Future Enhancements

- [ ] Real API integration
- [ ] Alert notifications (Telegram)
- [ ] Historical data charts
- [ ] Add/edit cron jobs
- [ ] Project deployment triggers
