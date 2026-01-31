import { Gauge, Zap, Radio, BatteryCharging } from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { StatusBar } from "@/components/dashboard/StatusBar";
import { TelemetryCard } from "@/components/dashboard/TelemetryCard";
import { SpeedChart } from "@/components/dashboard/SpeedChart";
import { EnergyChart } from "@/components/dashboard/EnergyChart";
import { TrackMap } from "@/components/dashboard/TrackMap";
import { AIStrategyPanel } from "@/components/dashboard/AIStrategyPanel";
import { AlertPanel } from "@/components/dashboard/AlertPanel";
import { useTelemetryData } from "@/hooks/useTelemetryData";

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
    title: "Motor temperature trend",
    description: "Current trajectory suggests temp will reach threshold in 4 laps. Consider cooling strategy.",
    confidence: 73,
    impact: "high" as const,
  },
];

const mockAlerts = [
  {
    id: "1",
    type: "warning" as const,
    title: "Voltage fluctuation detected",
    message: "Battery voltage dropped 0.3V in the last 30 seconds. Monitor closely.",
    timestamp: "14:32:15",
    sector: "S1",
  },
  {
    id: "2",
    type: "info" as const,
    title: "AI recommendation available",
    message: "New speed optimization strategy calculated with 92% confidence.",
    timestamp: "14:31:42",
  },
];

export default function Index() {
  const { currentData, historicalData, speedMapData } = useTelemetryData();

  const getSpeedStatus = (speed: number) => {
    if (speed > 55) return "warning";
    if (speed > 40) return "optimal";
    if (speed < 20) return "critical";
    return "normal";
  };

  const getVoltageStatus = (voltage: number) => {
    if (voltage < 11) return "critical";
    if (voltage < 11.5) return "warning";
    if (voltage > 13.5) return "warning";
    return "optimal";
  };

  const getSignalStatus = (rssi: number) => {
    if (rssi < -80) return "critical";
    if (rssi < -70) return "warning";
    return "optimal";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header
        teamName="Fzero (ISC Dubai)"
        sessionName="Practice Session 2 — Dubai Autodrome"
        isLive={true}
      />

      {/* Status Bar */}
      <StatusBar
        connectionStatus="connected"
        signalStrength={Math.round(currentData.rssi)}
        snr={Math.round(currentData.snr)}
        batteryLevel={78}
        uptime="01:23:45"
        dataRate={42}
      />

      {/* Main Dashboard */}
      <main className="flex-1 p-4 grid-pattern">
        <div className="max-w-[1600px] mx-auto space-y-4">
          {/* Top Row: Telemetry Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TelemetryCard
              title="Speed"
              value={currentData.speed.toFixed(1)}
              unit="km/h"
              icon={<Gauge className="h-4 w-4" />}
              trend={currentData.speed > 45 ? "up" : "down"}
              trendValue={`${(currentData.speed > 45 ? "+" : "")}${(currentData.speed - 45).toFixed(1)} km/h`}
              status={getSpeedStatus(currentData.speed)}
            />
            <TelemetryCard
              title="Battery Voltage"
              value={currentData.voltage.toFixed(2)}
              unit="V"
              icon={<Zap className="h-4 w-4" />}
              trend={currentData.voltage > 12 ? "stable" : "down"}
              trendValue={currentData.voltage > 12 ? "Stable" : "-0.2V"}
              status={getVoltageStatus(currentData.voltage)}
            />
            <TelemetryCard
              title="Power Draw"
              value={Math.round(currentData.power)}
              unit="W"
              icon={<BatteryCharging className="h-4 w-4" />}
              trend={currentData.power > 300 ? "up" : "stable"}
              trendValue={`${currentData.power > 300 ? "High" : "Optimal"}`}
              status={currentData.power > 350 ? "warning" : "optimal"}
            />
            <TelemetryCard
              title="Signal Quality"
              value={Math.round(currentData.rssi)}
              unit="dBm"
              icon={<Radio className="h-4 w-4" />}
              trend="stable"
              trendValue={`SNR: ${Math.round(currentData.snr)} dB`}
              status={getSignalStatus(currentData.rssi)}
            />
          </div>

          {/* Middle Row: Charts & Map */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Speed Chart */}
            <div className="lg:col-span-2 bg-card rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Speed Analysis
                </h3>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-muted-foreground">Current</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-success opacity-50" />
                    <span className="text-muted-foreground">Optimal</span>
                  </div>
                </div>
              </div>
              <SpeedChart data={historicalData} />
            </div>

            {/* Track Map */}
            <TrackMap
              vehiclePosition={currentData.position}
              speedData={speedMapData}
            />
          </div>

          {/* Bottom Row: Energy Chart, AI Panel, Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Energy Chart */}
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Energy Metrics
                </h3>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-warning" />
                    <span className="text-muted-foreground">Voltage</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-quantum" />
                    <span className="text-muted-foreground">Power</span>
                  </div>
                </div>
              </div>
              <EnergyChart data={historicalData} />
            </div>

            {/* AI Strategy Panel */}
            <AIStrategyPanel
              strategies={mockStrategies}
              simulationCount={12847}
              lastUpdated="14:32:18"
            />

            {/* Alerts */}
            <AlertPanel alerts={mockAlerts} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-3 bg-card/50 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>ATLAS_LITE v1.0</span>
          <span>•</span>
          <span className="font-mono">Session: PST-2024-001</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Powered by</span>
          <span className="gradient-text-quantum font-semibold">Quantum-Enhanced AI</span>
        </div>
      </footer>
    </div>
  );
}
