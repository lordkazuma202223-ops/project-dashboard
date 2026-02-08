'use client';

import { useState, useEffect } from 'react';
import { Activity, Clock, Server, AlertTriangle, CheckCircle, XCircle, Globe, HardDrive, Cpu, Calendar } from 'lucide-react';

interface CronJob {
  name: string;
  schedule: string;
  timezone: string;
  nextRun: string;
  lastRun?: string;
  status: 'ok' | 'error' | 'pending';
  enabled: boolean;
}

interface Project {
  name: string;
  url: string;
  status: 'active' | 'error' | 'deploying';
  lastUpdated: string;
}

export default function Dashboard() {
  const [cronJobs, setCronJobs] = useState<CronJob[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [system, setSystem] = useState({ diskUsage: 64.2, memoryUsage: 23 });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Mock data - in production, fetch from API
    setCronJobs([
      {
        name: 'heartbeat-hourly',
        schedule: '0 * * * *',
        timezone: 'Asia/Singapore',
        nextRun: new Date(Date.now() + 8 * 60 * 1000).toISOString(),
        status: 'ok',
        enabled: true,
      },
      {
        name: 'capability-evolver-daily',
        schedule: '0 2 * * *',
        timezone: 'Asia/Singapore',
        nextRun: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
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
    ]);

    setProjects([
      {
        name: 'mingalbar-sg',
        url: 'https://mingalbar-sg.vercel.app',
        status: 'active',
        lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
    ]);
  }, []);

  const refreshData = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatNextRun = (date: string) => {
    const now = Date.now();
    const next = new Date(date).getTime();
    const diff = next - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Project Dashboard
            </h1>
            <p className="text-slate-400 text-sm">Real-time status monitoring</p>
          </div>
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200"
          >
            <Activity className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </header>

        {/* System Overview */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm font-medium">Disk Usage</span>
              <HardDrive className="w-5 h-5 text-amber-400" />
            </div>
            <div className="space-y-2">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{system.diskUsage}%</span>
                <span className="text-slate-400 text-sm mb-1">C: Drive</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                  style={{ width: `${system.diskUsage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm font-medium">Memory Usage</span>
              <Cpu className="w-5 h-5 text-blue-400" />
            </div>
            <div className="space-y-2">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{system.memoryUsage}%</span>
                <span className="text-slate-400 text-sm mb-1">Session Context</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                  style={{ width: `${system.memoryUsage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm font-medium">System Health</span>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-lg font-semibold">All systems operational</span>
              </div>
              <p className="text-slate-400 text-sm">Uptime: 118.1 hours</p>
            </div>
          </div>
        </section>

        {/* Cron Jobs */}
        <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-700/50">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              Cron Jobs
            </h2>
          </div>
          <div className="divide-y divide-slate-700/50">
            {cronJobs.map((job) => (
              <div key={job.name} className="p-6 hover:bg-slate-700/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{job.name}</h3>
                      <span className="text-xs px-2 py-1 bg-slate-700 rounded-full text-slate-300">
                        {job.timezone}
                      </span>
                      {job.enabled ? (
                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">Enabled</span>
                      ) : (
                        <span className="text-xs px-2 py-1 bg-slate-700 text-slate-400 rounded-full">Disabled</span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm font-mono bg-slate-900/50 inline-block px-3 py-1 rounded">
                      {job.schedule}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      {job.status === 'ok' && <CheckCircle className="w-5 h-5 text-green-400" />}
                      {job.status === 'error' && <XCircle className="w-5 h-5 text-red-400" />}
                      {job.status === 'pending' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                      <span className="text-sm font-medium">
                        {job.status === 'ok' ? 'OK' : job.status === 'error' ? 'Error' : 'Pending'}
                      </span>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-sm">
                        <span className="text-slate-400">Next:</span> {formatNextRun(job.nextRun)}
                      </div>
                      {job.lastRun && (
                        <div className="text-sm text-slate-400">
                          Last: {formatTime(job.lastRun)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-700/50">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              Projects
            </h2>
          </div>
          <div className="divide-y divide-slate-700/50">
            {projects.map((project) => (
              <div key={project.name} className="p-6 hover:bg-slate-700/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{project.name}</h3>
                      {project.status === 'active' && (
                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">Active</span>
                      )}
                      {project.status === 'error' && (
                        <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-full">Error</span>
                      )}
                      {project.status === 'deploying' && (
                        <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full">Deploying</span>
                      )}
                    </div>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-amber-400 transition-colors text-sm"
                    >
                      {project.url}
                    </a>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      {project.status === 'active' && <CheckCircle className="w-5 h-5 text-green-400" />}
                      {project.status === 'error' && <XCircle className="w-5 h-5 text-red-400" />}
                      {project.status === 'deploying' && <Server className="w-5 h-5 text-amber-400" />}
                    </div>
                    <div className="text-sm text-slate-400">
                      Updated: {formatTime(project.lastUpdated)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
