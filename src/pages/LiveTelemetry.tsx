import { Gauge, Zap, Radio, BatteryCharging, Wifi, Signal } from "lucide-react";
import { TelemetryCard } from "@/components/dashboard/TelemetryCard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BackendConnection } from "@/components/dashboard/BackendConnection";
import { LiveAIInsightsPanel } from "@/components/dashboard/LiveAIInsightsPanel";
import { LiveVoltageChart, LiveCurrentChart, LivePowerChart, LiveSpeedChart } from "@/components/dashboard/LiveCharts";
import { useLiveTelemetry, useChartData } from "@/hooks/useLiveTelemetry";

export default function LiveTelemetry() {
  const { latest, history, aiInsight, status, isDemoMode, backendUrl, setBackendUrl, toggleDemoMode } =
    useLiveTelemetry(60);

  const chartData = useChartData(history);

  // Extract values with fallbacks
  const voltage = latest?.voltage ?? latest?.V_car_last ?? 0;
  const current = latest?.current ?? 0;
  const power = latest?.power_w ?? voltage * current;
  const speed = latest?.speed ?? 0;
  const rssi = latest?.rssi ?? -60;
  const snr = latest?.snr ?? 20;
  const gpsFix = latest?.gps_fix ?? true;
  const sag = latest?.V_car_sag ?? 0;

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Live Telemetry</h1>
            <p className="text-sm text-muted-foreground">
              Real-time data stream from vehicle
              {isDemoMode && " (Demo Mode)"}
            </p>
          </div>
          <BackendConnection
            connected={status.connected}
            isDemoMode={isDemoMode}
            backendUrl={backendUrl}
            serverTime={status.serverTime}
            onUrlChange={setBackendUrl}
            onToggleDemoMode={toggleDemoMode}
          />
        </div>

        {/* Live Telemetry Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <TelemetryCard
            title="Voltage"
            value={voltage.toFixed(2)}
            unit="V"
            icon={<Zap className="h-4 w-4" />}
            status={voltage < 38 ? "critical" : voltage < 42 ? "warning" : "optimal"}
          />
          <TelemetryCard
            title="Current"
            value={current.toFixed(1)}
            unit="A"
            icon={<BatteryCharging className="h-4 w-4" />}
            status={current > 50 ? "warning" : "optimal"}
          />
          <TelemetryCard
            title="Power"
            value={power.toFixed(0)}
            unit="W"
            icon={<Gauge className="h-4 w-4" />}
            status={power > 500 ? "warning" : "optimal"}
          />
          <TelemetryCard
            title="Speed"
            value={speed.toFixed(1)}
            unit="km/h"
            icon={<Gauge className="h-4 w-4" />}
            status="normal"
          />
          <TelemetryCard
            title="Voltage Sag"
            value={sag.toFixed(2)}
            unit="V"
            icon={<Zap className="h-4 w-4" />}
            status={sag > 5 ? "critical" : sag > 2 ? "warning" : "optimal"}
          />
          <TelemetryCard
            title="Signal"
            value={rssi.toFixed(0)}
            unit="dBm"
            icon={<Radio className="h-4 w-4" />}
            trendValue={`SNR: ${snr.toFixed(0)}dB`}
            status={rssi < -80 ? "warning" : "optimal"}
          />
        </div>

        {/* GPS & Connection Status */}
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
              gpsFix ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
            }`}
          >
            <Signal className="h-4 w-4" />
            GPS: {gpsFix ? "Fixed" : "No Fix"}
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
              status.connected && !isDemoMode
                ? "bg-success/10 text-success"
                : "bg-warning/10 text-warning"
            }`}
          >
            <Wifi className="h-4 w-4" />
            {status.connected && !isDemoMode ? "Backend Connected" : "Demo Mode Active"}
          </div>
        </div>

        {/* AI Insights Panel */}
        <LiveAIInsightsPanel insight={aiInsight} />

        {/* Live Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
              Voltage (Live)
            </h3>
            <div className="h-[250px]">
              <LiveVoltageChart data={chartData} />
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-4">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
              Current (Live)
            </h3>
            <div className="h-[250px]">
              <LiveCurrentChart data={chartData} />
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-4">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
              Power (Live)
            </h3>
            <div className="h-[250px]">
              <LivePowerChart data={chartData} />
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-4">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
              Speed (Live)
            </h3>
            <div className="h-[250px]">
              <LiveSpeedChart data={chartData} />
            </div>
          </div>
        </div>

        {/* Latest Sample Debug Info */}
        {latest && (
          <div className="bg-card rounded-lg border border-border p-4">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-2">
              Latest Sample (Debug)
            </h3>
            <div className="font-mono text-xs text-muted-foreground overflow-x-auto">
              <pre>{JSON.stringify(latest, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
