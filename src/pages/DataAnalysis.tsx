import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { getAnalyzedTelemetryData, rawTelemetryData, getTelemetrySummary } from "@/data/telemetryData";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Brain, AlertTriangle, CheckCircle, Info } from "lucide-react";

export default function DataAnalysis() {
  const analyzedData = getAnalyzedTelemetryData();
  const summary = getTelemetrySummary();
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "critical" | "warning" | "optimal" | "normal">("all");

  const filteredData = filter === "all" 
    ? analyzedData 
    : analyzedData.filter(row => row.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical": return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "warning": return <Info className="h-4 w-4 text-warning" />;
      case "optimal": return <CheckCircle className="h-4 w-4 text-success" />;
      default: return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "bg-destructive/10 border-destructive/30";
      case "warning": return "bg-warning/10 border-warning/30";
      case "optimal": return "bg-success/10 border-success/30";
      default: return "bg-muted/10 border-border";
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">AI Data Analysis</h1>
            <p className="text-sm text-muted-foreground">Line-by-line telemetry analysis with AI insights</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Brain className="h-5 w-5 text-primary" />
            <span className="text-muted-foreground">Analyzing {rawTelemetryData.length} data points</span>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "bg-card rounded-lg border p-4 text-left transition-all",
              filter === "all" ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/50"
            )}
          >
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Total Readings</div>
            <div className="font-display text-2xl font-bold text-foreground mt-1">{summary.totalReadings}</div>
          </button>
          <button
            onClick={() => setFilter("critical")}
            className={cn(
              "bg-card rounded-lg border p-4 text-left transition-all",
              filter === "critical" ? "border-destructive ring-1 ring-destructive" : "border-border hover:border-destructive/50"
            )}
          >
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Critical</div>
            <div className="font-display text-2xl font-bold text-destructive mt-1">{summary.criticalEvents}</div>
          </button>
          <button
            onClick={() => setFilter("warning")}
            className={cn(
              "bg-card rounded-lg border p-4 text-left transition-all",
              filter === "warning" ? "border-warning ring-1 ring-warning" : "border-border hover:border-warning/50"
            )}
          >
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Warnings</div>
            <div className="font-display text-2xl font-bold text-warning mt-1">{summary.warningEvents}</div>
          </button>
          <button
            onClick={() => setFilter("optimal")}
            className={cn(
              "bg-card rounded-lg border p-4 text-left transition-all",
              filter === "optimal" ? "border-success ring-1 ring-success" : "border-border hover:border-success/50"
            )}
          >
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Optimal</div>
            <div className="font-display text-2xl font-bold text-success mt-1">
              {analyzedData.filter(d => d.status === "optimal").length}
            </div>
          </button>
          <button
            onClick={() => setFilter("normal")}
            className={cn(
              "bg-card rounded-lg border p-4 text-left transition-all",
              filter === "normal" ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/50"
            )}
          >
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Normal</div>
            <div className="font-display text-2xl font-bold text-foreground mt-1">
              {analyzedData.filter(d => d.status === "normal").length}
            </div>
          </button>
        </div>

        {/* Data Table Header */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="grid grid-cols-12 gap-2 p-4 bg-secondary/50 text-xs font-medium uppercase tracking-wider text-muted-foreground border-b border-border">
            <div className="col-span-1">Row</div>
            <div className="col-span-1">Time</div>
            <div className="col-span-1">V_Last</div>
            <div className="col-span-1">V_Avg</div>
            <div className="col-span-1">V_Min</div>
            <div className="col-span-1">V_Max</div>
            <div className="col-span-1">Sag</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-3">AI Analysis</div>
            <div className="col-span-1"></div>
          </div>

          {/* Data Rows */}
          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {filteredData.map((row) => (
              <div key={row.id}>
                <div 
                  className={cn(
                    "grid grid-cols-12 gap-2 p-4 items-center cursor-pointer hover:bg-secondary/30 transition-colors",
                    getStatusColor(row.status || "normal")
                  )}
                  onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                >
                  <div className="col-span-1 font-mono text-sm text-foreground">{row.id}</div>
                  <div className="col-span-1 font-mono text-sm text-muted-foreground">{row.time_recv_s}s</div>
                  <div className="col-span-1 font-mono text-sm text-foreground">{row.V_car_last.toFixed(2)}</div>
                  <div className="col-span-1 font-mono text-sm text-foreground">{row.V_car_avg.toFixed(2)}</div>
                  <div className="col-span-1 font-mono text-sm text-muted-foreground">{row.V_car_min.toFixed(2)}</div>
                  <div className="col-span-1 font-mono text-sm text-muted-foreground">{row.V_car_max.toFixed(2)}</div>
                  <div className={cn(
                    "col-span-1 font-mono text-sm font-bold",
                    row.V_car_sag > 5 ? "text-destructive" : 
                    row.V_car_sag > 2 ? "text-warning" : 
                    row.V_car_sag > 1 ? "text-muted-foreground" : "text-success"
                  )}>
                    {row.V_car_sag.toFixed(2)}
                  </div>
                  <div className="col-span-1">
                    {getStatusIcon(row.status || "normal")}
                  </div>
                  <div className="col-span-3 text-sm text-muted-foreground truncate">
                    {row.aiAnalysis?.substring(0, 60)}...
                  </div>
                  <div className="col-span-1 flex justify-end">
                    {expandedRow === row.id ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Expanded Analysis */}
                {expandedRow === row.id && (
                  <div className={cn("p-4 border-t", getStatusColor(row.status || "normal"))}>
                    <div className="flex items-start gap-3">
                      <Brain className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-foreground mb-1">AI Analysis - Row {row.id}</div>
                        <p className="text-sm text-muted-foreground">{row.aiAnalysis}</p>
                        <div className="mt-3 grid grid-cols-4 gap-4 text-xs">
                          <div className="bg-secondary/50 p-2 rounded">
                            <span className="text-muted-foreground">Timestamp:</span>
                            <span className="font-mono ml-1 text-foreground">{row.time_send_ms}ms</span>
                          </div>
                          <div className="bg-secondary/50 p-2 rounded">
                            <span className="text-muted-foreground">Voltage Range:</span>
                            <span className="font-mono ml-1 text-foreground">{row.V_car_min.toFixed(2)} - {row.V_car_max.toFixed(2)}V</span>
                          </div>
                          <div className="bg-secondary/50 p-2 rounded">
                            <span className="text-muted-foreground">Delta:</span>
                            <span className="font-mono ml-1 text-foreground">{(row.V_car_max - row.V_car_min).toFixed(2)}V</span>
                          </div>
                          <div className="bg-secondary/50 p-2 rounded">
                            <span className="text-muted-foreground">Status:</span>
                            <span className={cn(
                              "ml-1 font-medium capitalize",
                              row.status === "critical" ? "text-destructive" :
                              row.status === "warning" ? "text-warning" :
                              row.status === "optimal" ? "text-success" : "text-foreground"
                            )}>{row.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-destructive" />
            <span>Critical (Sag &gt; 5V or Anomaly)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-warning" />
            <span>Warning (Sag &gt; 1V)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-success" />
            <span>Optimal (Stable &amp; High Voltage)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-muted-foreground" />
            <span>Normal</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
