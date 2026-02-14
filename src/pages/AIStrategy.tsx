import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AIStrategyPanel } from "@/components/dashboard/AIStrategyPanel";
import { ConnectionButtons } from "@/components/dashboard/ConnectionButtons";
import { MonteCarloPanel } from "@/components/dashboard/MonteCarloPanel";
import { LiveAIPanel } from "@/components/dashboard/LiveAIPanel";
import { useConnection } from "@/contexts/ConnectionContext";
import { Brain, TrendingUp, Zap, Shield, Target, Sparkles, Battery, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AIStrategy() {
  const { 
    isPrimaryConnected, 
    currentPrimarySample, 
    primaryStreamData,
    monteCarloValue,
    currentInsight,
  } = useConnection();
  
  const getStrategies = () => {
    if (!isPrimaryConnected || !currentPrimarySample || !currentInsight) return [];
    const strategies = [];
    
    if (currentInsight.battery_risk_level === 'high') {
      strategies.push({
        id: "1", type: "warning" as const,
        title: "Battery at risk — conserve now",
        description: currentInsight.suggested_action,
        confidence: 92, impact: "high" as const,
      });
    } else if (currentInsight.battery_risk_level === 'med') {
      strategies.push({
        id: "1", type: "energy" as const,
        title: "Moderate energy concern",
        description: currentInsight.suggested_action,
        confidence: 85, impact: "medium" as const,
      });
    } else {
      strategies.push({
        id: "1", type: "speed" as const,
        title: "Energy margin available",
        description: currentInsight.suggested_action,
        confidence: 94, impact: "low" as const,
      });
    }
    
    if (currentInsight.aggressiveness > 0.7) {
      strategies.push({
        id: "2", type: "reliability" as const,
        title: "Aggressive driving detected",
        description: "Smooth throttle exits to reduce current spikes and improve tyre life.",
        confidence: 78, impact: "medium" as const,
      });
    }
    
    if (currentInsight.link_quality < 50) {
      strategies.push({
        id: "3", type: "warning" as const,
        title: "Telemetry link degraded",
        description: `Link quality at ${currentInsight.link_quality.toFixed(0)}%. Expect data gaps.`,
        confidence: 72, impact: "medium" as const,
      });
    }
    
    return strategies;
  };
  
  const strategies = getStrategies();
  const optimalCount = primaryStreamData.filter(d => d.status === "optimal").length;
  const warningCount = primaryStreamData.filter(d => d.status === "warning").length;
  const criticalCount = primaryStreamData.filter(d => d.status === "critical").length;

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">AI Strategy Engine</h1>
            <p className="text-sm text-muted-foreground">
              {isPrimaryConnected ? "Streaming analysis + Monte Carlo active" : "Press Connect to activate AI predictions"}
            </p>
          </div>
          <ConnectionButtons />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className={isPrimaryConnected ? "h-4 w-4 text-primary" : "h-4 w-4 text-muted-foreground"} />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Simulations</span>
            </div>
            <div className="font-display text-2xl font-bold text-foreground">
              {isPrimaryConnected ? monteCarloValue?.toLocaleString() || '0' : '--'}
            </div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className={isPrimaryConnected ? "h-4 w-4 text-success" : "h-4 w-4 text-muted-foreground"} />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Optimal</span>
            </div>
            <div className="font-display text-2xl font-bold text-success">{isPrimaryConnected ? optimalCount : '--'}</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className={isPrimaryConnected ? "h-4 w-4 text-warning" : "h-4 w-4 text-muted-foreground"} />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Warnings</span>
            </div>
            <div className="font-display text-2xl font-bold text-warning">{isPrimaryConnected ? warningCount : '--'}</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className={isPrimaryConnected ? "h-4 w-4 text-destructive" : "h-4 w-4 text-muted-foreground"} />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Critical</span>
            </div>
            <div className="font-display text-2xl font-bold text-destructive">{isPrimaryConnected ? criticalCount : '--'}</div>
          </div>
        </div>

        {!isPrimaryConnected ? (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <div className="h-24 w-24 mx-auto mb-6 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
              <Brain className="h-12 w-12 text-muted-foreground/30" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">AI Strategy Engine Inactive</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Press Connect to activate real-time strategy analysis with Monte Carlo finish-risk simulation.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AIStrategyPanel
              strategies={strategies}
              simulationCount={monteCarloValue || 0}
              lastUpdated={new Date().toLocaleTimeString("en-US", { hour12: false })}
            />
            <MonteCarloPanel />

            {/* AI Analysis Panel */}
            <div className="lg:col-span-2">
              <LiveAIPanel />
            </div>

            {/* Live AI Recommendations */}
            <div className="bg-card rounded-lg border border-border p-4 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-quantum" />
                <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Live AI Recommendations
                </h3>
              </div>
              
              {currentInsight && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Battery className="h-4 w-4 text-primary" />
                      <h4 className="font-medium text-foreground">Battery Pacing</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      SoC at {(currentInsight.soc_est * 100).toFixed(1)}%. 
                      Burn rate {currentInsight.burn_rate_w}W. 
                      {currentInsight.time_to_empty_s > currentInsight.time_remaining_s 
                        ? ' On track to finish with margin.' 
                        : ' Risk of depletion — conserve power.'}
                    </p>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-success" />
                      <h4 className="font-medium text-foreground">Driving Efficiency</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Efficiency score: {currentInsight.efficiency_score}/100. 
                      Aggressiveness: {(currentInsight.aggressiveness * 100).toFixed(0)}%.
                      {currentInsight.aggressiveness > 0.7 
                        ? ' Smooth throttle inputs to improve.' 
                        : ' Driving style is well-controlled.'}
                    </p>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Gauge className="h-4 w-4 text-warning" />
                      <h4 className="font-medium text-foreground">Energy Conservation</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {currentPrimarySample && currentPrimarySample.I_last < 0 
                        ? `Regenerative braking recovering ${Math.abs(currentPrimarySample.I_last).toFixed(1)}A (${Math.abs(currentPrimarySample.power_w).toFixed(0)}W).`
                        : `Current draw ${currentPrimarySample?.I_last.toFixed(1)}A. Coast before corners for regen recovery.`
                      }
                    </p>
                  </div>
                  <div className={cn("p-4 rounded-lg border",
                    currentInsight.monte_carlo.risk_percent > 30 ? "bg-destructive/10 border-destructive/30" :
                    currentInsight.monte_carlo.risk_percent > 10 ? "bg-warning/10 border-warning/30" :
                    "bg-success/10 border-success/30"
                  )}>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <h4 className="font-medium text-primary">Monte Carlo Prediction</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {monteCarloValue?.toLocaleString()} simulations: {(currentInsight.monte_carlo.finish_probability * 100).toFixed(1)}% finish probability.
                      Expected SoC at finish: {(currentInsight.monte_carlo.expected_soc_finish * 100).toFixed(1)}%.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
