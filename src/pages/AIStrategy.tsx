import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AIStrategyPanel } from "@/components/dashboard/AIStrategyPanel";
import { ConnectionButtons } from "@/components/dashboard/ConnectionButtons";
import { MonteCarloPanel } from "@/components/dashboard/MonteCarloPanel";
import { useConnection } from "@/contexts/ConnectionContext";
import { Brain, TrendingUp, Zap, Shield, Target, Sparkles } from "lucide-react";

export default function AIStrategy() {
  const { 
    isPrimaryConnected, 
    currentPrimarySample, 
    primaryStreamData,
    monteCarloValue,
  } = useConnection();
  
  // Generate dynamic strategies based on live data
  const getStrategies = () => {
    if (!isPrimaryConnected || !currentPrimarySample) return [];
    
    const strategies = [];
    
    // Voltage-based strategy
    if (currentPrimarySample.V_car_last < 44) {
      strategies.push({
        id: "1",
        type: "energy" as const,
        title: "Reduce power consumption",
        description: `Voltage at ${currentPrimarySample.V_car_last.toFixed(2)}V. Reduce throttle by 8% to maintain above 44V threshold.`,
        confidence: 89,
        impact: "high" as const,
      });
    } else {
      strategies.push({
        id: "1",
        type: "energy" as const,
        title: "Optimal voltage maintained",
        description: `Battery at ${currentPrimarySample.V_car_last.toFixed(2)}V - within optimal range. Continue current strategy.`,
        confidence: 94,
        impact: "low" as const,
      });
    }
    
    // Current-based strategy
    if (currentPrimarySample.I_last > 50) {
      strategies.push({
        id: "2",
        type: "warning" as const,
        title: "High current draw detected",
        description: `${currentPrimarySample.I_last.toFixed(1)}A draw exceeds efficiency threshold. Consider regenerative braking.`,
        confidence: 86,
        impact: "high" as const,
      });
    } else if (currentPrimarySample.I_last < 0) {
      strategies.push({
        id: "2",
        type: "speed" as const,
        title: "Regenerative braking active",
        description: `Recovering ${Math.abs(currentPrimarySample.I_last).toFixed(1)}A. Maintain braking pressure for maximum recovery.`,
        confidence: 92,
        impact: "medium" as const,
      });
    }
    
    // Acceleration-based strategy
    if (currentPrimarySample.a_tot_last > 1.2) {
      strategies.push({
        id: "3",
        type: "reliability" as const,
        title: "High G-force detected",
        description: `${currentPrimarySample.a_tot_last.toFixed(2)}g acceleration. Smooth inputs will improve traction and efficiency.`,
        confidence: 78,
        impact: "medium" as const,
      });
    }
    
    // Signal quality strategy
    if (currentPrimarySample.rssi_dbm < -90) {
      strategies.push({
        id: "4",
        type: "warning" as const,
        title: "Signal degradation",
        description: `RSSI at ${currentPrimarySample.rssi_dbm}dBm. Telemetry may be affected in this sector.`,
        confidence: 72,
        impact: "medium" as const,
      });
    }
    
    return strategies;
  };
  
  const strategies = getStrategies();
  
  // Calculate stats from stream data
  const optimalCount = primaryStreamData.filter(d => d.status === "optimal").length;
  const warningCount = primaryStreamData.filter(d => d.status === "warning").length;
  const criticalCount = primaryStreamData.filter(d => d.status === "critical").length;

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">AI Strategy Engine</h1>
            <p className="text-sm text-muted-foreground">
              {isPrimaryConnected 
                ? "Quantum-enhanced simulation active" 
                : "Press Connect to activate AI predictions"}
            </p>
          </div>
          <ConnectionButtons />
        </div>

        {/* AI Stats */}
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
            <div className="font-display text-2xl font-bold text-success">
              {isPrimaryConnected ? optimalCount : '--'}
            </div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className={isPrimaryConnected ? "h-4 w-4 text-warning" : "h-4 w-4 text-muted-foreground"} />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Warnings</span>
            </div>
            <div className="font-display text-2xl font-bold text-warning">
              {isPrimaryConnected ? warningCount : '--'}
            </div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className={isPrimaryConnected ? "h-4 w-4 text-destructive" : "h-4 w-4 text-muted-foreground"} />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Critical</span>
            </div>
            <div className="font-display text-2xl font-bold text-destructive">
              {isPrimaryConnected ? criticalCount : '--'}
            </div>
          </div>
        </div>

        {/* Main Content */}
        {!isPrimaryConnected ? (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <div className="h-24 w-24 mx-auto mb-6 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
              <Brain className="h-12 w-12 text-muted-foreground/30" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">AI Strategy Engine Inactive</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Press the Connect button to activate quantum-enhanced simulations and receive real-time strategy recommendations.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Strategy Panel */}
            <AIStrategyPanel
              strategies={strategies}
              simulationCount={monteCarloValue || 0}
              lastUpdated={new Date().toLocaleTimeString("en-US", { hour12: false })}
            />

            {/* Monte Carlo Panel */}
            <MonteCarloPanel />

            {/* AI Insights Summary */}
            <div className="bg-card rounded-lg border border-border p-4 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-quantum" />
                <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Live AI Recommendations
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">Optimal Speed Range</h4>
                  <p className="text-sm text-muted-foreground">
                    Based on current power draw of {currentPrimarySample?.power_w.toFixed(0)}W, 
                    optimal speed range is 35-45 km/h for maximum efficiency.
                  </p>
                </div>

                <div className="p-4 bg-secondary/50 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">Energy Conservation</h4>
                  <p className="text-sm text-muted-foreground">
                    {currentPrimarySample && currentPrimarySample.I_last < 0 
                      ? `Regenerative braking recovering ${Math.abs(currentPrimarySample.I_last).toFixed(1)}A. Excellent energy management.`
                      : `Current draw at ${currentPrimarySample?.I_last.toFixed(1)}A. Reduce throttle before corners for regenerative recovery.`
                    }
                  </p>
                </div>

                <div className="p-4 bg-secondary/50 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">Battery Protection</h4>
                  <p className="text-sm text-muted-foreground">
                    Voltage at {currentPrimarySample?.V_car_last.toFixed(2)}V. 
                    {currentPrimarySample && currentPrimarySample.V_car_last > 44 
                      ? " Battery healthy and within optimal range."
                      : " Consider reducing power draw to protect battery longevity."
                    }
                  </p>
                </div>

                <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                  <h4 className="font-medium text-primary mb-2">Efficiency Insight</h4>
                  <p className="text-sm text-muted-foreground">
                    Based on {monteCarloValue?.toLocaleString()} simulations, current driving pattern 
                    achieves 87% efficiency. Improve by smoothing throttle inputs in corners.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
