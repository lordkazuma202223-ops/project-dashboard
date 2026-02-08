import { NextRequest, NextResponse } from 'next/server';

// Types
interface CronJob {
  name: string;
  schedule: string;
  timezone: string;
  enabled: boolean;
  nextRun: string;
  lastRun?: string;
  status: 'ok' | 'error' | 'pending';
}

interface Project {
  name: string;
  url: string;
  status: 'active' | 'error' | 'deploying';
  lastUpdated: string;
}

interface SystemStatus {
  diskUsage: number;
  memoryUsage: number;
  uptime: number;
  healthStatus: 'ok' | 'error' | 'warning';
}

// GET /api/cron-jobs - Fetch cron jobs from OpenClaw
export async function GET(request: NextRequest) {
  try {
    // In production, call OpenClaw API
    // For now, return mock data structure that matches real data
    const cronJobs: CronJob[] = [
      {
        name: 'heartbeat-hourly',
        schedule: '0 * * * *',
        timezone: 'Asia/Singapore',
        nextRun: new Date(Date.now() + 8 * 60 * 1000).toISOString(),
        lastRun: new Date(Date.now() - 52 * 60 * 1000).toISOString(),
        status: 'ok',
        enabled: true,
      },
      {
        name: 'capability-evolver-daily',
        schedule: '0 2 * * *',
        timezone: 'Asia/Singapore',
        nextRun: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'ok',
        enabled: true,
      },
      {
        name: 'Daily Motivation (Burmese)',
        schedule: '0 8 * * 1-5',
        timezone: 'Asia/Singapore',
        nextRun: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(),
        lastRun: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        status: 'ok',
        enabled: true,
      },
    ];

    return NextResponse.json(cronJobs);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch cron jobs' },
      { status: 500 }
    );
  }
}
