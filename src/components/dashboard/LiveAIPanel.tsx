import { useConnection } from '@/contexts/ConnectionContext';
import { Brain, Sparkles, TrendingUp, Zap, Shield, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LiveAIPanel() {
  const { isPrimaryConnected, currentPrimarySample, primaryStreamData } = useConnection();
  
  // Generate AI recommendations based on current data
  const getRecommendations = () => {
    if (!currentPrimarySample) return [];
    
    const recommendations = [];
    
    // Voltage recommendation
    if (currentPrimarySample.V_car_last > 47) {
      recommendations.push({
        type: 'optimal',
        icon: TrendingUp,
        title: 'High Voltage Detected',
        description: 'Regenerative braking active. Battery recovering energy efficiently.',
      });
    } else if (currentPrimarySample.V_car_last < 43) {
      recommendations.push({
        type: 'warning',
        icon: Zap,
        title: 'Voltage Drop',
        description: 'Consider reducing power draw. Maintain above 42V for optimal performance.',
      });
    }
    
    // Current recommendation
    if (currentPrimarySample.I_last > 55) {
      recommendations.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'High Current Draw',
        description: `${currentPrimarySample.I_last.toFixed(1)}A detected. Reduce throttle by 10% to preserve battery.`,
      });
    } else if (currentPrimarySample.I_last < 0) {
      recommendations.push({
        type: 'optimal',
        icon: Shield,
        title: 'Energy Recovery',
        description: `Recovering ${Math.abs(currentPrimarySample.I_last).toFixed(1)}A through regenerative braking.`,
      });
    }
    
    // Signal quality
    if (currentPrimarySample.rssi_dbm < -90) {
      recommendations.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Weak Signal',
        description: 'Consider antenna repositioning. RSSI below -90dBm threshold.',
      });
    }
    
    // Default optimal state
    if (recommendations.length === 0) {
      recommendations.push({
        type: 'optimal',
        icon: TrendingUp,
        title: 'Operating Optimally',
        description: 'All systems within normal parameters. Maintain current driving pattern.',
      });
    }
    
    return recommendations.slice(0, 3);
  };
  
  const recommendations = getRecommendations();
  
  return (
    <div className="bg-card rounded-lg border border-border p-4 relative overflow-hidden">
      {/* Quantum effect background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-quantum via-transparent to-primary" />
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-1.5 rounded-md",
              isPrimaryConnected ? "bg-quantum/20 glow-border-quantum" : "bg-muted"
            )}>
              <Brain className={cn(
                "h-4 w-4",
                isPrimaryConnected ? "text-quantum" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                AI Strategy Engine
              </h3>
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
        
        {/* Content */}
        {!isPrimaryConnected ? (
          <div className="py-8 text-center">
            <div className="h-16 w-16 mx-auto mb-4 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
              <Brain className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <p className="text-muted-foreground text-sm">Press Connect to activate AI analysis</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Current Status */}
            {currentPrimarySample && (
              <div className="p-3 bg-secondary/50 rounded-lg border border-border">
                <p className="text-sm text-foreground">{currentPrimarySample.aiAnalysis}</p>
              </div>
            )}
            
            {/* Recommendations */}
            {recommendations.map((rec, index) => {
              const Icon = rec.icon;
              const isOptimal = rec.type === 'optimal';
              
              return (
                <div
                  key={index}
                  className={cn(
                    "p-3 rounded-lg border transition-all",
                    isOptimal 
                      ? "bg-success/10 border-success/30" 
                      : "bg-warning/10 border-warning/30"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <Icon className={cn(
                      "h-4 w-4 mt-0.5",
                      isOptimal ? "text-success" : "text-warning"
                    )} />
                    <div>
                      <h4 className="text-sm font-medium text-foreground">{rec.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{rec.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
