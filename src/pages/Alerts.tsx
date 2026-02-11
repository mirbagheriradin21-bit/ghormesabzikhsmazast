import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ConnectionButtons } from "@/components/dashboard/ConnectionButtons";
import { useConnection } from "@/contexts/ConnectionContext";
import { Bell, AlertTriangle, Info, CheckCircle, Shield } from "lucide-react";

export default function Alerts() {
  const { isPrimaryConnected, anomalyAlerts, currentInsight } = useConnection();

  const criticalAlerts = anomalyAlerts.filter(a => a.severity === 'critical');
  const warnAlerts = anomalyAlerts.filter(a => a.severity === 'warn');

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Alerts & Anomalies</h1>
            <p className="text-sm text-muted-foreground">
              {isPrimaryConnected ? `AI anomaly detection active • ${anomalyAlerts.length} events` : "Press Connect to activate detection"}
            </p>
          </div>
          <ConnectionButtons />
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Critical</span>
            </div>
            <div className="font-display text-2xl font-bold text-destructive">
              {isPrimaryConnected ? criticalAlerts.length : '--'}
            </div>
          </div>
          <div className="bg-card rounded-lg border border-warning/30 bg-warning/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-warning" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Warnings</span>
            </div>
            <div className="font-display text-2xl font-bold text-warning">
              {isPrimaryConnected ? warnAlerts.length : '--'}
            </div>
          </div>
          <div className="bg-card rounded-lg border border-primary/30 bg-primary/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Efficiency</span>
            </div>
            <div className="font-display text-2xl font-bold text-primary">
              {isPrimaryConnected && currentInsight ? currentInsight.efficiency_score : '--'}
            </div>
          </div>
          <div className="bg-card rounded-lg border border-success/30 bg-success/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Risk Level</span>
            </div>
            <div className="font-display text-2xl font-bold text-success">
              {isPrimaryConnected && currentInsight ? currentInsight.battery_risk_level.toUpperCase() : '--'}
            </div>
          </div>
        </div>

        {!isPrimaryConnected ? (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <div className="h-24 w-24 mx-auto mb-6 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
              <Bell className="h-12 w-12 text-muted-foreground/30" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Anomaly Detection Inactive</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Press Connect to activate real-time anomaly detection including voltage sags, current spikes, sensor freezes, and impact detection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Alert List */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Live Anomaly Feed ({anomalyAlerts.length})
                </h3>
              </div>
              <div className="max-h-[500px] overflow-y-auto divide-y divide-border">
                {anomalyAlerts.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No anomalies detected yet
                  </div>
                ) : (
                  [...anomalyAlerts].reverse().map((alert) => (
                    <div key={alert.id} className={`p-4 ${alert.severity === 'critical' ? 'bg-destructive/5' : 'bg-warning/5'}`}>
                      <div className="flex items-start gap-3">
                        {alert.severity === 'critical' ? (
                          <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                        ) : (
                          <Info className="h-5 w-5 text-warning mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-foreground text-sm">{alert.title}</span>
                            <span className="text-xs text-muted-foreground">T+{alert.timestamp}s</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{alert.recommended_action}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">Alert Timeline</h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {[...anomalyAlerts].reverse().slice(0, 15).map((alert, index) => (
                  <div key={alert.id} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`h-3 w-3 rounded-full ${alert.severity === 'critical' ? 'bg-destructive' : 'bg-warning'}`} />
                      {index < 14 && <div className="w-0.5 h-8 bg-border" />}
                    </div>
                    <div className="flex-1 pb-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{alert.title}</span>
                        <span className="text-xs text-muted-foreground">T+{alert.timestamp}s</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{alert.recommended_action}</p>
                    </div>
                  </div>
                ))}
                {anomalyAlerts.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">Monitoring for anomalies...</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
