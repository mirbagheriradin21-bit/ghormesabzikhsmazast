import { useConnection } from '@/contexts/ConnectionContext';
import { Brain, Sparkles, TrendingUp, Zap, Shield, AlertTriangle, Battery, Gauge, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LiveAIPanel() {
  const { isPrimaryConnected, currentInsight } = useConnection();

  const getRiskColor = (level: string) => {
    if (level === 'high') return 'text-destructive';
    if (level === 'med') return 'text-warning';
    return 'text-success';
  };

  const getRiskBg = (level: string) => {
    if (level === 'high') return 'bg-destructive/10 border-destructive/30';
    if (level === 'med') return 'bg-warning/10 border-warning/30';
    return 'bg-success/10 border-success/30';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-quantum via-transparent to-primary" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={cn("p-1.5 rounded-md", isPrimaryConnected ? "bg-quantum/20 glow-border-quantum" : "bg-muted")}>
              <Brain className={cn("h-4 w-4", isPrimaryConnected ? "text-quantum" : "text-muted-foreground")} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">AI Strategy Engine</h3>
              <p className="text-xs text-muted-foreground">
                {isPrimaryConnected ? "Live analysis active" : "Waiting for connection"}
              </p>
            </div>
          </div>
          {isPrimaryConnected && (
            <div className="flex items-center gap-1.5 text-xs">
              <Sparkles className="h-3 w-3 text-quantum animate-pulse" />
              <span className="font-mono text-quantum">ACTIVE</span>
            </div>
          )}
        </div>

        {!isPrimaryConnected ? (
          <div className="py-8 text-center">
            <div className="h-16 w-16 mx-auto mb-4 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
              <Brain className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <p className="text-muted-foreground text-sm">Press Connect to activate AI analysis</p>
          </div>
        ) : currentInsight ? (
          <div className="space-y-3">
            {/* Primary Action */}
            <div className={cn("p-3 rounded-lg border", getRiskBg(currentInsight.battery_risk_level))}>
              <div className="flex items-center gap-2 mb-1">
                <Shield className={cn("h-4 w-4", getRiskColor(currentInsight.battery_risk_level))} />
                <span className="text-sm font-medium text-foreground">Primary Action</span>
              </div>
              <p className="text-sm text-foreground font-mono">{currentInsight.suggested_action}</p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-secondary/50 rounded-lg p-2 text-center">
                <Battery className="h-3 w-3 mx-auto mb-1 text-primary" />
                <div className="text-xs text-muted-foreground">SoC</div>
                <div className="font-display text-sm font-bold text-primary">
                  {(currentInsight.soc_est * 100).toFixed(1)}%
                </div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-2 text-center">
                <Gauge className="h-3 w-3 mx-auto mb-1 text-warning" />
                <div className="text-xs text-muted-foreground">Efficiency</div>
                <div className={cn("font-display text-sm font-bold",
                  currentInsight.efficiency_score > 80 ? "text-success" :
                  currentInsight.efficiency_score > 50 ? "text-warning" : "text-destructive"
                )}>
                  {currentInsight.efficiency_score}
                </div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-2 text-center">
                <Zap className="h-3 w-3 mx-auto mb-1 text-quantum" />
                <div className="text-xs text-muted-foreground">Burn</div>
                <div className="font-display text-sm font-bold text-quantum">
                  {currentInsight.burn_rate_w}W
                </div>
              </div>
            </div>

            {/* Time Estimates */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-secondary/50 rounded-lg p-2 flex items-center gap-2">
                <Timer className="h-3.5 w-3.5 text-primary" />
                <div>
                  <div className="text-[10px] text-muted-foreground">Time to Empty</div>
                  <div className="font-mono text-xs font-bold text-foreground">
                    {Math.floor(currentInsight.time_to_empty_s / 60)}m {currentInsight.time_to_empty_s % 60}s
                  </div>
                </div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-2 flex items-center gap-2">
                <Timer className="h-3.5 w-3.5 text-success" />
                <div>
                  <div className="text-[10px] text-muted-foreground">Remaining</div>
                  <div className="font-mono text-xs font-bold text-foreground">
                    {Math.floor(currentInsight.time_remaining_s / 60)}m {currentInsight.time_remaining_s % 60}s
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {currentInsight.notes.slice(0, 3).map((note, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mt-0.5 text-primary/60 shrink-0" />
                <span>{note}</span>
              </div>
            ))}

            {/* Anomaly flag */}
            {currentInsight.anomaly_flag && (
              <div className="p-2 bg-destructive/10 border border-destructive/30 rounded-lg flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-xs font-medium text-destructive">{currentInsight.anomaly_reason}</span>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
