import { Gauge, Zap, Radio, BatteryCharging, Activity } from "lucide-react";
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

export default function LiveAnalysis() {
  const { 
    isPrimaryConnected, 
    isSecondaryConnected,
    currentPrimarySample,
    primaryStreamData,
    primaryStreamIndex,
  } = useConnection();

  // Transform data for acceleration chart
  const accelChartData = primaryStreamData.map((row) => ({
    time: row.time_recv_s,
    ax: row.ax_last,
    ay: row.ay_last,
    az: row.az_last,
    total: row.a_tot_last,
  }));

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Live Analysis Engine</h1>
            <p className="text-sm text-muted-foreground">
              {isPrimaryConnected 
                ? `Real-time monitoring • ${primaryStreamIndex} samples`
                : "Press Connect to start live analysis"}
            </p>
          </div>
          <ConnectionButtons />
        </div>

        {/* Live Telemetry Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <TelemetryCard
            title="Voltage"
            value={isPrimaryConnected && currentPrimarySample ? currentPrimarySample.V_car_last.toFixed(2) : "--"}
            unit="V"
            icon={<Zap className="h-4 w-4" />}
            status={isPrimaryConnected && currentPrimarySample && currentPrimarySample.V_car_last > 44 ? "optimal" : "normal"}
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

        {/* AI Analysis */}
        <LiveAIPanel />

        {/* Live Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PrimaryVoltageChart />
          <PrimaryCurrentChart />
        </div>

        {/* Acceleration Chart */}
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Acceleration Analysis (G-Force)
            </h3>
            {isPrimaryConnected && (
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-destructive" />
                  <span className="text-muted-foreground">X-Axis</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <span className="text-muted-foreground">Y-Axis</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Z-Axis</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-quantum" />
                  <span className="text-muted-foreground">Total</span>
                </div>
              </div>
            )}
          </div>
          <div className="h-[200px]">
            {!isPrimaryConnected ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="h-12 w-12 mx-auto mb-3 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                    <Gauge className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                  <p className="text-muted-foreground text-sm">Press Connect to view acceleration data</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={accelChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" />
                  <XAxis 
                    dataKey="time" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    tickLine={false}
                    domain={[-1, 2.5]}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(222, 47%, 8%)",
                      border: "1px solid hsl(217, 33%, 20%)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <ReferenceLine y={1.5} stroke="hsl(38, 92%, 50%)" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="ax" name="ax" stroke="hsl(0, 84%, 60%)" strokeWidth={1} dot={false} />
                  <Line type="monotone" dataKey="ay" name="ay" stroke="hsl(142, 76%, 45%)" strokeWidth={1} dot={false} />
                  <Line type="monotone" dataKey="az" name="az" stroke="hsl(186, 100%, 50%)" strokeWidth={1} dot={false} />
                  <Line type="monotone" dataKey="total" name="Total" stroke="hsl(280, 100%, 65%)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Secondary Voltage Chart (only when orange button pressed) */}
        {isSecondaryConnected && (
          <SecondaryVoltageChart />
        )}

        {/* Summary Stats */}
        {isPrimaryConnected && currentPrimarySample && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">V_esp32</div>
              <div className="font-display text-2xl font-bold text-foreground mt-1">
                {currentPrimarySample.V_esp32_last.toFixed(3)}V
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">RAW</div>
              <div className="font-display text-2xl font-bold text-foreground mt-1">
                {currentPrimarySample.RAW}
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">I_raw</div>
              <div className="font-display text-2xl font-bold text-foreground mt-1">
                {currentPrimarySample.I_raw}
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Samples</div>
              <div className="font-display text-2xl font-bold text-primary mt-1">
                {primaryStreamIndex}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
