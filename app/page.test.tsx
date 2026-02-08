import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '@/app/page';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Activity: ({ className }: { className?: string }) => <div data-testid="activity" className={className} />,
  Clock: ({ className }: { className?: string }) => <div data-testid="clock" className={className} />,
  Server: ({ className }: { className?: string }) => <div data-testid="server" className={className} />,
  AlertTriangle: ({ className }: { className?: string }) => <div data-testid="alert-triangle" className={className} />,
  CheckCircle: ({ className }: { className?: string }) => <div data-testid="check-circle" className={className} />,
  XCircle: ({ className }: { className?: string }) => <div data-testid="x-circle" className={className} />,
  Globe: ({ className }: { className?: string }) => <div data-testid="globe" className={className} />,
  HardDrive: ({ className }: { className?: string }) => <div data-testid="hard-drive" className={className} />,
  Cpu: ({ className }: { className?: string }) => <div data-testid="cpu" className={className} />,
  Calendar: ({ className }: { className?: string }) => <div data-testid="calendar" className={className} />,
}));

describe('Dashboard', () => {
  it('should render the dashboard header', () => {
    render(<Dashboard />);
    expect(screen.getByText('Project Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Real-time status monitoring')).toBeInTheDocument();
  });

  it('should render system overview cards', () => {
    render(<Dashboard />);
    expect(screen.getByText('Disk Usage')).toBeInTheDocument();
    expect(screen.getByText('Memory Usage')).toBeInTheDocument();
    expect(screen.getByText('System Health')).toBeInTheDocument();
  });

  it('should render cron jobs section', () => {
    render(<Dashboard />);
    expect(screen.getByText('Cron Jobs')).toBeInTheDocument();
    expect(screen.getByText('heartbeat-hourly')).toBeInTheDocument();
    expect(screen.getByText('capability-evolver-daily')).toBeInTheDocument();
    expect(screen.getByText('Daily Motivation (Burmese)')).toBeInTheDocument();
  });

  it('should render projects section', () => {
    render(<Dashboard />);
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('mingalbar-sg')).toBeInTheDocument();
    expect(screen.getByText('https://mingalbar-sg.vercel.app')).toBeInTheDocument();
  });

  it('should render refresh button', () => {
    render(<Dashboard />);
    const refreshButton = screen.getByText('Refresh');
    expect(refreshButton).toBeInTheDocument();
  });

  it('should handle refresh button click', () => {
    render(<Dashboard />);
    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);
    // Button should show "Refreshing..." after click
    expect(screen.getByText('Refreshing...')).toBeInTheDocument();
  });

  it('should display cron job status correctly', () => {
    render(<Dashboard />);
    // Check for enabled status badges
    const enabledBadges = screen.getAllByText('Enabled');
    expect(enabledBadges.length).toBeGreaterThan(0);
  });

  it('should display project status correctly', () => {
    render(<Dashboard />);
    // Check for active status badge
    const activeBadges = screen.getAllByText('Active');
    expect(activeBadges.length).toBeGreaterThan(0);
  });

  it('should display system uptime', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Uptime:/)).toBeInTheDocument();
  });
});
