import { Gauge, Zap, Radio, BatteryCharging } from "lucide-react";
import { TelemetryCard } from "@/components/dashboard/TelemetryCard";
import { SpeedChart } from "@/components/dashboard/SpeedChart";
import { EnergyChart } from "@/components/dashboard/EnergyChart";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useTelemetryData } from "@/hooks/useTelemetryData";
import { getTelemetrySummary, getAnalyzedTelemetryData } from "@/data/telemetryData";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Dashboard() {
  const { currentData, historicalData } = useTelemetryData();
  const summary = getTelemetrySummary();
  const analyzedData = getAnalyzedTelemetryData();
  const criticalRows = analyzedData.filter(d => d.status === "critical");
  const warningRows = analyzedData.filter(d => d.status === "warning");

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Dashboard Overview</h1>
            <p className="text-sm text-muted-foreground">Real-time telemetry summary</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TelemetryCard
            title="Avg Voltage"
            value={summary.avgVoltage.toFixed(2)}
            unit="V"
            icon={<Zap className="h-4 w-4" />}
            status={summary.avgVoltage > 42 ? "optimal" : "warning"}
          />
          <TelemetryCard
            title="Max Sag"
            value={summary.maxSag.toFixed(2)}
            unit="V"
            icon={<BatteryCharging className="h-4 w-4" />}
            status={summary.maxSag > 5 ? "critical" : summary.maxSag > 2 ? "warning" : "optimal"}
          />
          <TelemetryCard
            title="Critical Events"
            value={summary.criticalEvents}
            unit="events"
            icon={<Radio className="h-4 w-4" />}
            status={summary.criticalEvents > 0 ? "critical" : "optimal"}
          />
          <TelemetryCard
            title="Total Readings"
            value={summary.totalReadings}
            unit="rows"
            icon={<Gauge className="h-4 w-4" />}
            status="normal"
          />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/live-analysis" 
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Live Analysis</h3>
                <p className="text-sm text-muted-foreground mt-1">Real-time telemetry monitoring</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>
          <Link 
            to="/track-map" 
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Track Map</h3>
                <p className="text-sm text-muted-foreground mt-1">Dubai Autodrome visualization</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>
          <Link 
            to="/data-analysis" 
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">AI Data Analysis</h3>
                <p className="text-sm text-muted-foreground mt-1">Line-by-line AI insights</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
              Speed Overview
            </h3>
            <SpeedChart data={historicalData} />
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
              Energy Overview
            </h3>
            <EnergyChart data={historicalData} />
          </div>
        </div>

        {/* Recent Alerts Preview */}
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Recent Critical Events
            </h3>
            <Link to="/data-analysis" className="text-xs text-primary hover:underline">
              View All →
            </Link>
          </div>
          <div className="space-y-2">
            {criticalRows.slice(0, 3).map((row) => (
              <div key={row.id} className="flex items-start gap-3 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                <div className="h-2 w-2 mt-1.5 rounded-full bg-destructive animate-pulse" />
                <div>
                  <span className="font-mono text-sm text-foreground">Row {row.id} @ {row.time_recv_s}s</span>
                  <p className="text-sm text-muted-foreground">{row.aiAnalysis}</p>
                </div>
              </div>
            ))}
            {criticalRows.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No critical events detected</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
