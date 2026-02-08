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
    // Call OpenClaw gateway API
    const response = await fetch('http://localhost:18789/api/cron-jobs', {
      headers: {
        'Authorization': '07a5d8cd5744df1c744101dcecad78cec1c320aed8342ed9',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`OpenClaw API error: ${response.status}`);
    }

    const cronJobs = await response.json();
    return NextResponse.json(cronJobs);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch cron jobs from OpenClaw' },
      { status: 500 }
    );
  }
}
