import { Gauge, Zap, Radio, BatteryCharging, Activity, Thermometer } from "lucide-react";
import { TelemetryCard } from "@/components/dashboard/TelemetryCard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ConnectionButtons } from "@/components/dashboard/ConnectionButtons";
import { SabisTrackMap } from "@/components/dashboard/SabisTrackMap";
import { PrimaryVoltageChart } from "@/components/dashboard/PrimaryVoltageChart";
import { PrimaryCurrentChart } from "@/components/dashboard/PrimaryCurrentChart";
import { MonteCarloPanel } from "@/components/dashboard/MonteCarloPanel";
import { LiveAIPanel } from "@/components/dashboard/LiveAIPanel";
import { SecondaryVoltageChart } from "@/components/dashboard/SecondaryVoltageChart";
import { useConnection } from "@/contexts/ConnectionContext";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Dashboard() {
  const { 
    isPrimaryConnected, 
    isSecondaryConnected,
    currentPrimarySample,
    primaryStreamIndex,
    secondaryStreamIndex,
  } = useConnection();

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Page Header with Connection Buttons */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Dashboard Overview</h1>
            <p className="text-sm text-muted-foreground">
              {isPrimaryConnected 
                ? `Streaming telemetry • ${primaryStreamIndex} samples received`
                : "Press Connect to start live telemetry"}
            </p>
          </div>
          <ConnectionButtons />
        </div>

        {/* Summary Cards - Only show data when connected */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TelemetryCard
            title="Voltage"
            value={isPrimaryConnected && currentPrimarySample ? currentPrimarySample.V_car_last.toFixed(2) : "--"}
            unit="V"
            icon={<Zap className="h-4 w-4" />}
            status={isPrimaryConnected ? (currentPrimarySample && currentPrimarySample.V_car_last > 44 ? "optimal" : "warning") : "normal"}
          />
          <TelemetryCard
            title="Current"
            value={isPrimaryConnected && currentPrimarySample ? currentPrimarySample.I_last.toFixed(1) : "--"}
            unit="A"
            icon={<BatteryCharging className="h-4 w-4" />}
            status={isPrimaryConnected ? (currentPrimarySample && currentPrimarySample.I_last > 50 ? "warning" : "optimal") : "normal"}
          />
          <TelemetryCard
            title="Power"
            value={isPrimaryConnected && currentPrimarySample ? currentPrimarySample.power_w.toFixed(0) : "--"}
            unit="W"
            icon={<Activity className="h-4 w-4" />}
            status={isPrimaryConnected ? (currentPrimarySample && currentPrimarySample.power_w > 2000 ? "warning" : "optimal") : "normal"}
          />
          <TelemetryCard
            title="Signal"
            value={isPrimaryConnected && currentPrimarySample ? Math.round(currentPrimarySample.rssi_dbm) : "--"}
            unit="dBm"
            icon={<Radio className="h-4 w-4" />}
            trendValue={isPrimaryConnected && currentPrimarySample ? `SNR: ${currentPrimarySample.snr_db.toFixed(1)} dB` : ""}
            status={isPrimaryConnected ? (currentPrimarySample && currentPrimarySample.rssi_dbm < -90 ? "warning" : "optimal") : "normal"}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Track Map */}
          <SabisTrackMap className="lg:row-span-2" />
          
          {/* AI Panel */}
          <LiveAIPanel />
          
          {/* Monte Carlo Simulation */}
          <MonteCarloPanel />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Primary Voltage Chart */}
          <PrimaryVoltageChart />
          
          {/* Primary Current Chart */}
          <PrimaryCurrentChart />
        </div>

        {/* Secondary Voltage Chart (only shows when orange button pressed) */}
        {isSecondaryConnected && (
          <SecondaryVoltageChart />
        )}

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
                <p className="text-sm text-muted-foreground mt-1">SABIS track visualization</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>
          <Link 
            to="/ai-strategy" 
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">AI Strategy</h3>
                <p className="text-sm text-muted-foreground mt-1">Quantum-enhanced predictions</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
