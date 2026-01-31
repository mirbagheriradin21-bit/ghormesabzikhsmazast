import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AIStrategyPanel } from "@/components/dashboard/AIStrategyPanel";
import { getTelemetrySummary, getAnalyzedTelemetryData } from "@/data/telemetryData";
import { Brain, TrendingUp, Zap, Shield, Target } from "lucide-react";

const mockStrategies = [
  {
    id: "1",
    type: "speed" as const,
    title: "Reduce speed in S2",
    description: "AI detects 12% energy waste in sector 2. Reducing speed by 5 km/h could save 8% battery.",
    confidence: 87,
    impact: "high" as const,
  },
  {
    id: "2",
    type: "energy" as const,
    title: "Optimal regeneration point",
    description: "Enable regenerative braking 15m earlier before Turn 3 for maximum energy recovery.",
    confidence: 92,
    impact: "medium" as const,
  },
  {
    id: "3",
    type: "reliability" as const,
    title: "Voltage stability concern",
    description: "Detected high voltage sag events (21.55V max). Consider battery cooling strategy.",
    confidence: 88,
    impact: "high" as const,
  },
  {
    id: "4",
    type: "speed" as const,
    title: "Corner exit optimization",
    description: "Power application timing at Turn 7 could be improved for better acceleration.",
    confidence: 76,
    impact: "medium" as const,
  },
];

export default function AIStrategy() {
  const summary = getTelemetrySummary();
  const analyzedData = getAnalyzedTelemetryData();
  
  const optimalCount = analyzedData.filter(d => d.status === "optimal").length;
  const warningCount = analyzedData.filter(d => d.status === "warning").length;
  const criticalCount = analyzedData.filter(d => d.status === "critical").length;

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">AI Strategy Engine</h1>
          <p className="text-sm text-muted-foreground">Quantum-enhanced simulation and predictive analysis</p>
        </div>

        {/* AI Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Simulations Run</span>
            </div>
            <div className="font-display text-2xl font-bold text-foreground">12,847</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-success" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Optimal Readings</span>
            </div>
            <div className="font-display text-2xl font-bold text-success">{optimalCount}</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-warning" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Warnings</span>
            </div>
            <div className="font-display text-2xl font-bold text-warning">{warningCount}</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-destructive" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Critical Events</span>
            </div>
            <div className="font-display text-2xl font-bold text-destructive">{criticalCount}</div>
          </div>
        </div>

        {/* Main Strategy Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AIStrategyPanel
            strategies={mockStrategies}
            simulationCount={12847}
            lastUpdated={new Date().toLocaleTimeString("en-US", { hour12: false })}
          />

          {/* AI Insights Summary */}
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                AI Analysis Summary
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-secondary/50 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Voltage Stability Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  AI detected {criticalCount} critical voltage events with max sag of {summary.maxSag.toFixed(2)}V. 
                  Primary concern at T15s with anomalous 67.83V spike. Recommend sensor calibration check.
                </p>
              </div>

              <div className="p-4 bg-secondary/50 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Power Efficiency</h4>
                <p className="text-sm text-muted-foreground">
                  Average voltage of {summary.avgVoltage.toFixed(2)}V is within acceptable range. 
                  {summary.avgVoltage > 42 ? " Battery performing optimally." : " Consider power conservation mode."}
                </p>
              </div>

              <div className="p-4 bg-secondary/50 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Quantum Simulation Results</h4>
                <p className="text-sm text-muted-foreground">
                  Based on 12,847 simulated scenarios, optimal strategy suggests maintaining voltage above 42V 
                  with regenerative braking activation 15m before each corner entry.
                </p>
              </div>

              <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                <h4 className="font-medium text-primary mb-2">Recommendation</h4>
                <p className="text-sm text-muted-foreground">
                  Reduce power draw during T20-T23 window where significant voltage drop occurred. 
                  Enable battery cooling for sustained high-performance sections.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Confidence Chart */}
        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
            Strategy Confidence Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {mockStrategies.map((strategy) => (
              <div key={strategy.id} className="p-4 bg-secondary/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{strategy.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    strategy.impact === "high" ? "bg-destructive/20 text-destructive" :
                    strategy.impact === "medium" ? "bg-warning/20 text-warning" :
                    "bg-success/20 text-success"
                  }`}>
                    {strategy.impact}
                  </span>
                </div>
                <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="absolute h-full bg-primary rounded-full transition-all"
                    style={{ width: `${strategy.confidence}%` }}
                  />
                </div>
                <div className="text-right text-xs text-muted-foreground mt-1">
                  {strategy.confidence}% confidence
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
