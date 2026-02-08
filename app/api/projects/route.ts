import { NextRequest, NextResponse } from 'next/server';

// Types
interface Project {
  name: string;
  url: string;
  status: 'active' | 'error' | 'deploying';
  lastUpdated: string;
}

// GET /api/projects - Fetch projects from OpenClaw
export async function GET(request: NextRequest) {
  try {
    // In production, call OpenClaw API or fetch from database
    // For now, return mock data structure
    const projects: Project[] = [
      {
        name: 'mingalbar-sg',
        url: 'https://mingalbar-sg.vercel.app',
        status: 'active',
        lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
      {
        name: 'project-dashboard',
        url: 'https://project-dashboard-i7qkapxuw-lordlofis-projects.vercel.app',
        status: 'active',
        lastUpdated: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      },
    ];

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
