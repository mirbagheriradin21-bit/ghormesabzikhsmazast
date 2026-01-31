import { AlertTriangle, AlertCircle, Info, CheckCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info" | "success";
  title: string;
  message: string;
  timestamp: string;
  sector?: string;
}

interface AlertPanelProps {
  alerts: Alert[];
  className?: string;
}

export function AlertPanel({ alerts, className }: AlertPanelProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  const visibleAlerts = alerts.filter((alert) => !dismissedAlerts.has(alert.id));

  const dismissAlert = (id: string) => {
    setDismissedAlerts((prev) => new Set([...prev, id]));
  };

  const typeConfig = {
    critical: {
      icon: AlertTriangle,
      color: "text-destructive",
      bg: "bg-destructive/10",
      border: "border-destructive/50",
      glow: "shadow-[0_0_10px_hsl(var(--destructive)/0.3)]",
    },
    warning: {
      icon: AlertCircle,
      color: "text-warning",
      bg: "bg-warning/10",
      border: "border-warning/50",
      glow: "shadow-[0_0_10px_hsl(var(--warning)/0.3)]",
    },
    info: {
      icon: Info,
      color: "text-info",
      bg: "bg-info/10",
      border: "border-info/50",
      glow: "",
    },
    success: {
      icon: CheckCircle,
      color: "text-success",
      bg: "bg-success/10",
      border: "border-success/50",
      glow: "",
    },
  };

  if (visibleAlerts.length === 0) {
    return (
      <div className={cn("bg-card rounded-lg border border-border p-4", className)}>
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Alerts
          </h3>
        </div>
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <CheckCircle className="h-5 w-5 mr-2 text-success" />
          <span className="text-sm">All systems nominal</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-card rounded-lg border border-border p-4", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Alerts
          </h3>
        </div>
        <span className="text-xs font-mono bg-destructive/20 text-destructive px-2 py-0.5 rounded">
          {visibleAlerts.length} active
        </span>
      </div>

      <div className="space-y-2 max-h-[200px] overflow-y-auto">
        {visibleAlerts.map((alert) => {
          const config = typeConfig[alert.type];
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className={cn(
                "rounded-lg border p-3 relative animate-slide-up",
                config.border,
                config.bg,
                alert.type === "critical" && config.glow
              )}
            >
              <button
                onClick={() => dismissAlert(alert.id)}
                className="absolute top-2 right-2 p-1 hover:bg-background/50 rounded transition-colors"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
              
              <div className="flex items-start gap-2 pr-6">
                <Icon className={cn("h-4 w-4 mt-0.5 flex-shrink-0", config.color)} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-sm font-medium text-foreground">
                      {alert.title}
                    </h4>
                    {alert.sector && (
                      <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {alert.sector}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{alert.message}</p>
                  <span className="text-xs font-mono text-muted-foreground/70 mt-1 block">
                    {alert.timestamp}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
