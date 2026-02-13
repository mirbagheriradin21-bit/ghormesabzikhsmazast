import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ConnectionButtons } from "@/components/dashboard/ConnectionButtons";
import { useConnection } from "@/contexts/ConnectionContext";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Brain, AlertTriangle, CheckCircle, Info } from "lucide-react";

export default function DataAnalysis() {
  const {
    isPrimaryConnected,
    primaryStreamData,
    primaryStreamIndex,
  } = useConnection();

  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "critical" | "warning" | "optimal" | "normal">("all");

  const filteredData = filter === "all"
    ? primaryStreamData
    : primaryStreamData.filter(row => row.status === filter);

  const criticalCount = primaryStreamData.filter(d => d.status === "critical").length;
  const warningCount = primaryStreamData.filter(d => d.status === "warning").length;
  const optimalCount = primaryStreamData.filter(d => d.status === "optimal").length;
  const normalCount = primaryStreamData.filter(d => d.status === "normal").length;

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
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">AI Data Analysis</h1>
            <p className="text-sm text-muted-foreground">
              {isPrimaryConnected
                ? `Line-by-line telemetry analysis • ${primaryStreamIndex} samples`
                : "Press Connect to start data analysis"}
            </p>
          </div>
          <ConnectionButtons />
        </div>

        {!isPrimaryConnected ? (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <div className="h-24 w-24 mx-auto mb-6 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
              <Brain className="h-12 w-12 text-muted-foreground/30" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Data Analysis Inactive</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Press Connect to start streaming telemetry data with real-time AI analysis.
            </p>
          </div>
        ) : (
          <>
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
                <div className="font-display text-2xl font-bold text-foreground mt-1">{primaryStreamData.length}</div>
              </button>
              <button
                onClick={() => setFilter("critical")}
                className={cn(
                  "bg-card rounded-lg border p-4 text-left transition-all",
                  filter === "critical" ? "border-destructive ring-1 ring-destructive" : "border-border hover:border-destructive/50"
                )}
              >
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Critical</div>
                <div className="font-display text-2xl font-bold text-destructive mt-1">{criticalCount}</div>
              </button>
              <button
                onClick={() => setFilter("warning")}
                className={cn(
                  "bg-card rounded-lg border p-4 text-left transition-all",
                  filter === "warning" ? "border-warning ring-1 ring-warning" : "border-border hover:border-warning/50"
                )}
              >
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Warnings</div>
                <div className="font-display text-2xl font-bold text-warning mt-1">{warningCount}</div>
              </button>
              <button
                onClick={() => setFilter("optimal")}
                className={cn(
                  "bg-card rounded-lg border p-4 text-left transition-all",
                  filter === "optimal" ? "border-success ring-1 ring-success" : "border-border hover:border-success/50"
                )}
              >
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Optimal</div>
                <div className="font-display text-2xl font-bold text-success mt-1">{optimalCount}</div>
              </button>
              <button
                onClick={() => setFilter("normal")}
                className={cn(
                  "bg-card rounded-lg border p-4 text-left transition-all",
                  filter === "normal" ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/50"
                )}
              >
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Normal</div>
                <div className="font-display text-2xl font-bold text-foreground mt-1">{normalCount}</div>
              </button>
            </div>

            {/* Data Table */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="grid grid-cols-12 gap-2 p-4 bg-secondary/50 text-xs font-medium uppercase tracking-wider text-muted-foreground border-b border-border">
                <div className="col-span-1">Time</div>
                <div className="col-span-1">V_Last</div>
                <div className="col-span-1">V_Avg</div>
                <div className="col-span-1">V_Min</div>
                <div className="col-span-1">V_Max</div>
                <div className="col-span-1">Current</div>
                <div className="col-span-1">Power</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-3">AI Analysis</div>
                <div className="col-span-1"></div>
              </div>

              <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                {filteredData.map((row, idx) => (
                  <div key={`${row.time_recv_s}-${idx}`}>
                    <div
                      className={cn(
                        "grid grid-cols-12 gap-2 p-4 items-center cursor-pointer hover:bg-secondary/30 transition-colors",
                        getStatusColor(row.status || "normal")
                      )}
                      onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
                    >
                      <div className="col-span-1 font-mono text-sm text-foreground">{row.time_recv_s}s</div>
                      <div className="col-span-1 font-mono text-sm text-foreground">{row.V_car_last.toFixed(2)}</div>
                      <div className="col-span-1 font-mono text-sm text-foreground">{row.V_car_avg.toFixed(2)}</div>
                      <div className="col-span-1 font-mono text-sm text-muted-foreground">{row.V_car_min.toFixed(2)}</div>
                      <div className="col-span-1 font-mono text-sm text-muted-foreground">{row.V_car_max.toFixed(2)}</div>
                      <div className="col-span-1 font-mono text-sm text-foreground">{row.I_last.toFixed(1)}</div>
                      <div className="col-span-1 font-mono text-sm text-foreground">{row.power_w.toFixed(0)}</div>
                      <div className="col-span-1">{getStatusIcon(row.status || "normal")}</div>
                      <div className="col-span-3 text-sm text-muted-foreground truncate">
                        {row.aiAnalysis?.substring(0, 60)}...
                      </div>
                      <div className="col-span-1 flex justify-end">
                        {expandedRow === idx ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {expandedRow === idx && (
                      <div className={cn("p-4 border-t", getStatusColor(row.status || "normal"))}>
                        <div className="flex items-start gap-3">
                          <Brain className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <div className="text-sm font-medium text-foreground mb-1">AI Analysis — T+{row.time_recv_s}s</div>
                            <p className="text-sm text-muted-foreground">{row.aiAnalysis}</p>
                            <div className="mt-3 grid grid-cols-4 gap-4 text-xs">
                              <div className="bg-secondary/50 p-2 rounded">
                                <span className="text-muted-foreground">Voltage Range:</span>
                                <span className="font-mono ml-1 text-foreground">{row.V_car_min.toFixed(2)} - {row.V_car_max.toFixed(2)}V</span>
                              </div>
                              <div className="bg-secondary/50 p-2 rounded">
                                <span className="text-muted-foreground">Current:</span>
                                <span className="font-mono ml-1 text-foreground">{row.I_last.toFixed(1)}A</span>
                              </div>
                              <div className="bg-secondary/50 p-2 rounded">
                                <span className="text-muted-foreground">Power:</span>
                                <span className="font-mono ml-1 text-foreground">{row.power_w.toFixed(0)}W</span>
                              </div>
                              <div className="bg-secondary/50 p-2 rounded">
                                <span className="text-muted-foreground">Signal:</span>
                                <span className="font-mono ml-1 text-foreground">{row.rssi_dbm}dBm / {row.snr_db}dB</span>
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
                <span>Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-warning" />
                <span>Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-success" />
                <span>Optimal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-muted-foreground" />
                <span>Normal</span>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
