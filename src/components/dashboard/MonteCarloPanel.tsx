import { useConnection } from '@/contexts/ConnectionContext';
import { Sparkles, Cpu, BarChart3, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MonteCarloPanel() {
  const { isPrimaryConnected, monteCarloValue, currentInsight } = useConnection();

  const mc = currentInsight?.monte_carlo;

  const getRiskIcon = () => {
    if (!mc) return null;
    if (mc.risk_percent > 30) return <AlertTriangle className="h-4 w-4 text-destructive" />;
    if (mc.risk_percent > 10) return <TrendingUp className="h-4 w-4 text-warning" />;
    return <CheckCircle className="h-4 w-4 text-success" />;
  };

  const getRiskLabel = () => {
    if (!mc) return '--';
    if (mc.risk_percent > 30) return 'HIGH';
    if (mc.risk_percent > 10) return 'MEDIUM';
    return 'LOW';
  };

  const getRiskColor = () => {
    if (!mc) return 'text-muted-foreground';
    if (mc.risk_percent > 30) return 'text-destructive';
    if (mc.risk_percent > 10) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-transparent to-quantum" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={cn("p-1.5 rounded-md", isPrimaryConnected ? "bg-primary/20 glow-border" : "bg-muted")}>
              <Cpu className={cn("h-4 w-4", isPrimaryConnected ? "text-primary" : "text-muted-foreground")} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Monte Carlo Simulation</h3>
              <p className="text-xs text-muted-foreground">Finish-risk quantification</p>
            </div>
          </div>
          {isPrimaryConnected && (
            <div className="flex items-center gap-1.5 text-xs">
              <Sparkles className="h-3 w-3 text-primary animate-pulse" />
              <span className="font-mono text-primary">RUNNING</span>
            </div>
          )}
        </div>

        {!isPrimaryConnected ? (
          <div className="py-8 text-center">
            <div className="h-16 w-16 mx-auto mb-4 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <p className="text-muted-foreground text-sm">Press Connect to start simulation</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Sim Counter */}
            <div className="text-center py-2">
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Simulations</div>
              <div className="font-display text-3xl font-bold text-primary text-glow-sm">
                {monteCarloValue?.toLocaleString() || '0'}
              </div>
            </div>

            {/* MC Results */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground">Finish Prob</div>
                <div className={cn("font-display text-lg font-bold", getRiskColor())}>
                  {mc ? `${(mc.finish_probability * 100).toFixed(1)}%` : '--'}
                </div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground">Risk</div>
                <div className={cn("font-display text-lg font-bold", getRiskColor())}>
                  {mc ? `${mc.risk_percent}%` : '--'}
                </div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground">SoC Finish</div>
                <div className="font-display text-lg font-bold text-quantum">
                  {mc ? `${(mc.expected_soc_finish * 100).toFixed(1)}%` : '--'}
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className={cn("p-3 rounded-lg border flex items-center gap-3",
              mc && mc.risk_percent > 30 ? "bg-destructive/10 border-destructive/30" :
              mc && mc.risk_percent > 10 ? "bg-warning/10 border-warning/30" :
              "bg-success/10 border-success/30"
            )}>
              {getRiskIcon()}
              <div>
                <span className={cn("text-sm font-medium", getRiskColor())}>
                  Depletion Risk: {getRiskLabel()}
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {mc && mc.risk_percent > 30
                    ? 'Battery may not last — conserve immediately'
                    : mc && mc.risk_percent > 10
                    ? 'Moderate risk — maintain current strategy'
                    : 'On track to finish with margin'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
