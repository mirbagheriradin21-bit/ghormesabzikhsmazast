import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TelemetryCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: ReactNode;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  status?: "optimal" | "warning" | "critical" | "normal";
  className?: string;
}

export function TelemetryCard({
  title,
  value,
  unit,
  icon,
  trend = "stable",
  trendValue,
  status = "normal",
  className,
}: TelemetryCardProps) {
  const statusColors = {
    optimal: "border-success/50 bg-success/5",
    warning: "border-warning/50 bg-warning/5",
    critical: "border-destructive/50 bg-destructive/5",
    normal: "border-border bg-card",
  };

  const statusGlow = {
    optimal: "shadow-[0_0_15px_hsl(var(--success)/0.2)]",
    warning: "shadow-[0_0_15px_hsl(var(--warning)/0.2)]",
    critical: "shadow-[0_0_15px_hsl(var(--destructive)/0.2)]",
    normal: "",
  };

  const trendColors = {
    up: "text-success",
    down: "text-destructive",
    stable: "text-muted-foreground",
  };

  const TrendIcon = {
    up: TrendingUp,
    down: TrendingDown,
    stable: Minus,
  }[trend];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border p-4 transition-all duration-300 card-hover",
        statusColors[status],
        statusGlow[status],
        className
      )}
    >
      {/* Scan line effect */}
      <div className="absolute inset-0 scan-lines opacity-50" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </span>
          <div className="p-1.5 rounded-md bg-secondary/50 text-primary">
            {icon}
          </div>
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="font-display text-3xl font-bold tracking-tight text-foreground">
            {value}
          </span>
          <span className="text-sm font-mono text-muted-foreground">{unit}</span>
        </div>

        {/* Trend */}
        {trendValue && (
          <div className={cn("flex items-center gap-1 text-xs font-mono", trendColors[trend])}>
            <TrendIcon className="h-3 w-3" />
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      {/* Status indicator dot */}
      <div
        className={cn(
          "absolute top-3 right-3 h-2 w-2 rounded-full",
          status === "optimal" && "bg-success pulse-live",
          status === "warning" && "bg-warning animate-pulse",
          status === "critical" && "bg-destructive animate-pulse",
          status === "normal" && "bg-muted-foreground"
        )}
      />
    </div>
  );
}
