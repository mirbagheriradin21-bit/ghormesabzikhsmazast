import { Gauge, Zap, Radio, BatteryCharging, Activity, Signal, Wifi } from "lucide-react";
import { TelemetryCard } from "@/components/dashboard/TelemetryCard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ConnectionButtons } from "@/components/dashboard/ConnectionButtons";
import { PrimaryVoltageChart } from "@/components/dashboard/PrimaryVoltageChart";
import { PrimaryCurrentChart } from "@/components/dashboard/PrimaryCurrentChart";
import { SecondaryVoltageChart } from "@/components/dashboard/SecondaryVoltageChart";
import { LiveAIPanel } from "@/components/dashboard/LiveAIPanel";
import { useConnection } from "@/contexts/ConnectionContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function LiveTelemetry() {
  const {
    isPrimaryConnected,
    isSecondaryConnected,
    currentPrimarySample,
    primaryStreamData,
    primaryStreamIndex,
    currentInsight,
    backendConnected,
  } = useConnection();

  // Power chart data
  const powerChartData = primaryStreamData.map((row) => ({
    time: row.time_recv_s,
    power: row.power_w,
    speed: row.speed_kmh || 0,
  }));

  // Speed chart data
  const speedChartData = primaryStreamData.map((row) => ({
    time: row.time_recv_s,
    speed: row.speed_kmh || 0,
  }));

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Live Telemetry</h1>
            <p className="text-sm text-muted-foreground">
              {isPrimaryConnected
                ? `Streaming live • ${primaryStreamIndex} samples`
                : "Press Connect to start live telemetry"}
            </p>
          </div>
          <ConnectionButtons />
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
              isPrimaryConnected ? "bg-success/10 text-success" : "bg-muted/50 text-muted-foreground"
            }`}
          >
            <Signal className="h-4 w-4" />
            {isPrimaryConnected ? "Telemetry Active" : "No Connection"}
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
              backendConnected
                ? "bg-success/10 text-success"
                : "bg-warning/10 text-warning"
            }`}
          >
            <Wifi className="h-4 w-4" />
            {backendConnected ? "Backend Connected" : "Local Dataset Mode"}
          </div>
        </div>

        {/* Live Telemetry Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <TelemetryCard
            title="Voltage"
            value={isPrimaryConnected && currentPrimarySample ? currentPrimarySample.V_car_last.toFixed(2) : "--"}
            unit="V"
            icon={<Zap className="h-4 w-4" />}
            status={isPrimaryConnected && currentPrimarySample ? (currentPrimarySample.V_car_last < 38 ? "critical" : currentPrimarySample.V_car_last < 42 ? "warning" : "optimal") : "normal"}
          />
          <TelemetryCard
            title="Current"
            value={isPrimaryConnected && currentPrimarySample ? currentPrimarySample.I_last.toFixed(1) : "--"}
            unit="A"
            icon={<BatteryCharging className="h-4 w-4" />}
            status={isPrimaryConnected && currentPrimarySample && currentPrimarySample.I_last > 50 ? "warning" : "optimal"}
          />
          <TelemetryCard
            title="Power"
            value={isPrimaryConnected && currentPrimarySample ? currentPrimarySample.power_w.toFixed(0) : "--"}
            unit="W"
            icon={<Activity className="h-4 w-4" />}
            status={isPrimaryConnected && currentPrimarySample && currentPrimarySample.power_w > 2000 ? "warning" : "optimal"}
          />
          <TelemetryCard
            title="Speed"
            value={isPrimaryConnected && currentPrimarySample ? (currentPrimarySample.speed_kmh || 0).toFixed(1) : "--"}
            unit="km/h"
            icon={<Gauge className="h-4 w-4" />}
            status="normal"
          />
          <TelemetryCard
            title="Accel"
            value={isPrimaryConnected && currentPrimarySample ? currentPrimarySample.a_tot_last.toFixed(2) : "--"}
            unit="g"
            icon={<Gauge className="h-4 w-4" />}
            status={isPrimaryConnected && currentPrimarySample && currentPrimarySample.a_tot_last > 1.5 ? "warning" : "optimal"}
          />
          <TelemetryCard
            title="Signal"
            value={isPrimaryConnected && currentPrimarySample ? Math.round(currentPrimarySample.rssi_dbm) : "--"}
            unit="dBm"
            icon={<Radio className="h-4 w-4" />}
            trendValue={isPrimaryConnected && currentPrimarySample ? `SNR: ${currentPrimarySample.snr_db.toFixed(1)}` : ""}
            status={isPrimaryConnected && currentPrimarySample && currentPrimarySample.rssi_dbm < -90 ? "warning" : "optimal"}
          />
        </div>

        {/* AI Insights */}
        <LiveAIPanel />

        {/* Live Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PrimaryVoltageChart />
          <PrimaryCurrentChart />

          {/* Power Chart */}
          <div className="bg-card rounded-lg border border-border p-4">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
              Power (Live)
            </h3>
            <div className="h-[250px]">
              {!isPrimaryConnected ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">Press Connect to view power data</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={powerChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} tickFormatter={(v) => `${v}W`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(222, 47%, 8%)",
                        border: "1px solid hsl(217, 33%, 20%)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [`${value.toFixed(0)}W`, "Power"]}
                    />
                    <Line type="monotone" dataKey="power" stroke="hsl(142, 76%, 45%)" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Speed Chart */}
          <div className="bg-card rounded-lg border border-border p-4">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
              Speed (Live)
            </h3>
            <div className="h-[250px]">
              {!isPrimaryConnected ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">Press Connect to view speed data</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={speedChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} tickFormatter={(v) => `${v}km/h`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(222, 47%, 8%)",
                        border: "1px solid hsl(217, 33%, 20%)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [`${value.toFixed(1)}km/h`, "Speed"]}
                    />
                    <Line type="monotone" dataKey="speed" stroke="hsl(186, 100%, 50%)" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Voltage Chart (only when orange button pressed) */}
        {isSecondaryConnected && <SecondaryVoltageChart />}

        {/* Latest Sample Debug Info */}
        {isPrimaryConnected && currentPrimarySample && (
          <div className="bg-card rounded-lg border border-border p-4">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-2">
              Latest Sample (Debug)
            </h3>
            <div className="font-mono text-xs text-muted-foreground overflow-x-auto">
              <pre>{JSON.stringify(currentPrimarySample, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
