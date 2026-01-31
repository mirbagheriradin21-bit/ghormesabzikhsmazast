import { Brain, Zap, Target, TrendingUp, AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Strategy {
  id: string;
  type: "speed" | "energy" | "reliability" | "warning";
  title: string;
  description: string;
  confidence: number;
  impact: "high" | "medium" | "low";
}

interface AIStrategyPanelProps {
  strategies: Strategy[];
  simulationCount: number;
  lastUpdated: string;
  className?: string;
}

export function AIStrategyPanel({
  strategies,
  simulationCount,
  lastUpdated,
  className,
}: AIStrategyPanelProps) {
  const typeConfig = {
    speed: {
      icon: Zap,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/30",
    },
    energy: {
      icon: Target,
      color: "text-success",
      bg: "bg-success/10",
      border: "border-success/30",
    },
    reliability: {
      icon: TrendingUp,
      color: "text-quantum",
      bg: "bg-quantum/10",
      border: "border-quantum/30",
    },
    warning: {
      icon: AlertTriangle,
      color: "text-warning",
      bg: "bg-warning/10",
      border: "border-warning/30",
    },
  };

  const impactColors = {
    high: "text-success",
    medium: "text-warning",
    low: "text-muted-foreground",
  };

  return (
    <div
      className={cn(
        "bg-card rounded-lg border border-border p-4 relative overflow-hidden",
        className
      )}
    >
      {/* Quantum effect background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-quantum via-transparent to-primary" />
      </div>

      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-quantum/20 glow-border-quantum">
              <Brain className="h-4 w-4 text-quantum" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Simulation & Strategy AI
              </h3>
              <p className="text-xs text-muted-foreground">
                Quantum-enhanced predictions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Sparkles className="h-3 w-3 text-quantum animate-pulse" />
            <span className="font-mono text-quantum">{simulationCount.toLocaleString()}</span>
            <span className="text-muted-foreground">sims</span>
          </div>
        </div>

        {/* Strategies */}
        <div className="space-y-3">
          {strategies.map((strategy) => {
            const config = typeConfig[strategy.type];
            const Icon = config.icon;

            return (
              <div
                key={strategy.id}
                className={cn(
                  "rounded-lg border p-3 transition-all duration-200 hover:bg-secondary/30",
                  config.border,
                  config.bg
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("p-1 rounded", config.bg)}>
                    <Icon className={cn("h-4 w-4", config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {strategy.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-xs font-mono uppercase",
                            impactColors[strategy.impact]
                          )}
                        >
                          {strategy.impact}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {strategy.description}
                    </p>
                    {/* Confidence bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            strategy.confidence > 80
                              ? "bg-success"
                              : strategy.confidence > 60
                              ? "bg-warning"
                              : "bg-destructive"
                          )}
                          style={{ width: `${strategy.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground w-10">
                        {strategy.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Last updated: <span className="font-mono">{lastUpdated}</span>
          </span>
          <button className="text-xs text-primary hover:text-primary/80 font-medium transition-colors">
            View All Predictions →
          </button>
        </div>
      </div>
    </div>
  );
}
