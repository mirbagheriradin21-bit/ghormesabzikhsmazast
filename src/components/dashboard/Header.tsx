import { Activity, Settings, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  teamName: string;
  sessionName: string;
  isLive: boolean;
}

export function Header({ teamName, sessionName, isLive }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-card/80 backdrop-blur-sm border-b border-border">
      {/* Left: Logo & Title */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-info flex items-center justify-center glow-border">
              <span className="font-display font-bold text-lg text-primary-foreground">A</span>
            </div>
            {isLive && (
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-success pulse-live" />
            )}
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-wider gradient-text">
              ATLAS_LITE
            </h1>
            <p className="text-xs text-muted-foreground -mt-0.5">
              Race Intelligence Dashboard
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-border mx-2" />

        {/* Team Info */}
        <div>
          <div className="text-sm font-medium text-foreground">{teamName}</div>
          <div className="text-xs text-muted-foreground">{sessionName}</div>
        </div>
      </div>

      {/* Center: Live Indicator */}
      <div className="flex items-center gap-3">
        {isLive && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-success/30 rounded-full">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-success uppercase tracking-wider">
              Live Telemetry
            </span>
          </div>
        )}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-quantum/10 border border-quantum/30 rounded-full">
          <Activity className="h-3 w-3 text-quantum" />
          <span className="text-xs font-medium text-quantum uppercase tracking-wider">
            AI Active
          </span>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
          <Maximize2 className="h-4 w-4 text-muted-foreground" />
        </button>
        <button className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
          <Settings className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
