import { useConnection } from '@/contexts/ConnectionContext';
import { Sparkles, Cpu, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MonteCarloPanel() {
  const { isPrimaryConnected, monteCarloValue } = useConnection();
  
  return (
    <div className="bg-card rounded-lg border border-border p-4 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-transparent to-quantum" />
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-1.5 rounded-md",
              isPrimaryConnected ? "bg-primary/20 glow-border" : "bg-muted"
            )}>
              <Cpu className={cn(
                "h-4 w-4",
                isPrimaryConnected ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Monte Carlo Simulation
              </h3>
              <p className="text-xs text-muted-foreground">
                Quantum-enhanced predictions
              </p>
            </div>
          </div>
          {isPrimaryConnected && (
            <div className="flex items-center gap-1.5 text-xs">
              <Sparkles className="h-3 w-3 text-primary animate-pulse" />
              <span className="font-mono text-primary">RUNNING</span>
            </div>
          )}
        </div>
        
        {/* Content */}
        {!isPrimaryConnected ? (
          <div className="py-8 text-center">
            <div className="h-16 w-16 mx-auto mb-4 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <p className="text-muted-foreground text-sm">Press Connect to start simulation</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Main Simulation Counter */}
            <div className="text-center py-4">
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Simulations Completed
              </div>
              <div className="font-display text-4xl font-bold text-primary text-glow-sm">
                {monteCarloValue?.toLocaleString() || '0'}
              </div>
            </div>
            
            {/* Simulation Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground">Confidence</div>
                <div className="font-display text-lg font-bold text-success">94.2%</div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground">Scenarios</div>
                <div className="font-display text-lg font-bold text-quantum">1,024</div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground">Accuracy</div>
                <div className="font-display text-lg font-bold text-warning">97.8%</div>
              </div>
            </div>
            
            {/* Prediction Result */}
            <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Optimal Strategy</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Maintain voltage above 44V with 35-40A average current draw. 
                Enable regenerative braking 20m before corner entry for maximum efficiency.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
