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
    // Call OpenClaw gateway API for projects registry
    const response = await fetch('http://localhost:18789/api/projects', {
      headers: {
        'Authorization': '07a5d8cd5744df1c744101dcecad78cec1c320aed8342ed9',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`OpenClaw API error: ${response.status}`);
    }

    const projects = await response.json();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects from OpenClaw' },
      { status: 500 }
    );
  }
}
