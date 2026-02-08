import { NextRequest, NextResponse } from 'next/server';

// Types
interface SystemStatus {
  diskUsage: number;
  memoryUsage: number;
  uptime: number;
  healthStatus: 'ok' | 'error' | 'warning';
}

// GET /api/system-status - Fetch system status from OpenClaw
export async function GET(request: NextRequest) {
  try {
    // In production, call OpenClaw API or system monitoring
    // For now, return mock data with some simulated variation
    const now = Date.now();
    
    // Simulate disk usage with slight variation
    const diskUsage = 80 + Math.random() * 5; // 80-85%
    
    // Simulate memory usage with slight variation
    const memoryUsage = 23 + Math.random() * 10; // 23-33%
    
    // Calculate uptime (system started ~118 hours ago)
    const uptime = 118.1 + Math.random() * 0.5; // ~118 hours
    
    const systemStatus: SystemStatus = {
      diskUsage: parseFloat(diskUsage.toFixed(1)),
      memoryUsage: parseFloat(memoryUsage.toFixed(1)),
      uptime: parseFloat(uptime.toFixed(1)),
      healthStatus: 'ok',
    };

    return NextResponse.json(systemStatus);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch system status' },
      { status: 500 }
    );
  }
}
