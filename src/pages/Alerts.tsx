import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AlertPanel } from "@/components/dashboard/AlertPanel";
import { getAnalyzedTelemetryData } from "@/data/telemetryData";
import { Bell, AlertTriangle, Info, CheckCircle } from "lucide-react";

export default function Alerts() {
  const analyzedData = getAnalyzedTelemetryData();
  
  // Generate alerts from analyzed data
  const generatedAlerts = analyzedData
    .filter(row => row.status === "critical" || row.status === "warning")
    .map(row => ({
      id: row.id.toString(),
      type: row.status === "critical" ? "critical" as const : "warning" as const,
      title: row.status === "critical" ? "Critical Voltage Event" : "Voltage Warning",
      message: row.aiAnalysis || "",
      timestamp: `T+${row.time_recv_s}s`,
      sector: `Row ${row.id}`,
    }));

  const staticAlerts = [
    {
      id: "static-1",
      type: "info" as const,
      title: "AI recommendation available",
      message: "New speed optimization strategy calculated with 92% confidence.",
      timestamp: "14:31:42",
    },
    {
      id: "static-2",
      type: "success" as const,
      title: "System calibration complete",
      message: "All sensors calibrated and operating within normal parameters.",
      timestamp: "14:28:15",
    },
  ];

  const allAlerts = [...generatedAlerts.slice(0, 10), ...staticAlerts];

  const criticalCount = generatedAlerts.filter(a => a.type === "critical").length;
  const warningCount = generatedAlerts.filter(a => a.type === "warning").length;

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Alerts & Notifications</h1>
            <p className="text-sm text-muted-foreground">Real-time system alerts and AI recommendations</p>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded-full">
              {criticalCount + warningCount}
            </span>
          </div>
        </div>

        {/* Alert Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Critical</span>
            </div>
            <div className="font-display text-2xl font-bold text-destructive">{criticalCount}</div>
          </div>
          <div className="bg-card rounded-lg border border-warning/30 bg-warning/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-warning" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Warnings</span>
            </div>
            <div className="font-display text-2xl font-bold text-warning">{warningCount}</div>
          </div>
          <div className="bg-card rounded-lg border border-primary/30 bg-primary/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Info</span>
            </div>
            <div className="font-display text-2xl font-bold text-primary">1</div>
          </div>
          <div className="bg-card rounded-lg border border-success/30 bg-success/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Resolved</span>
            </div>
            <div className="font-display text-2xl font-bold text-success">1</div>
          </div>
        </div>

        {/* Alert List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AlertPanel alerts={allAlerts.slice(0, 6)} />
          
          <div className="bg-card rounded-lg border border-border p-4">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
              Alert Timeline
            </h3>
            <div className="space-y-3">
              {allAlerts.slice(0, 8).map((alert, index) => (
                <div key={alert.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`h-3 w-3 rounded-full ${
                      alert.type === "critical" ? "bg-destructive" :
                      alert.type === "warning" ? "bg-warning" :
                      alert.type === "success" ? "bg-success" : "bg-primary"
                    }`} />
                    {index < allAlerts.slice(0, 8).length - 1 && (
                      <div className="w-0.5 h-12 bg-border" />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{alert.title}</span>
                      <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All Alerts Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              All Detected Anomalies ({generatedAlerts.length})
            </h3>
          </div>
          <div className="max-h-[400px] overflow-y-auto divide-y divide-border">
            {generatedAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-4 ${alert.type === "critical" ? "bg-destructive/5" : "bg-warning/5"}`}
              >
                <div className="flex items-start gap-3">
                  {alert.type === "critical" ? (
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  ) : (
                    <Info className="h-5 w-5 text-warning mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{alert.title}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-secondary px-2 py-0.5 rounded">{alert.sector}</span>
                        <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
