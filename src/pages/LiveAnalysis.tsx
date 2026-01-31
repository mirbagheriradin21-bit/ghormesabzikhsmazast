import { Gauge, Zap, Radio, BatteryCharging, TrendingUp, TrendingDown } from "lucide-react";
import { TelemetryCard } from "@/components/dashboard/TelemetryCard";
import { SpeedChart } from "@/components/dashboard/SpeedChart";
import { EnergyChart } from "@/components/dashboard/EnergyChart";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useTelemetryData } from "@/hooks/useTelemetryData";
import { rawTelemetryData, getTelemetrySummary } from "@/data/telemetryData";
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
  const { currentData, historicalData } = useTelemetryData();
  const summary = getTelemetrySummary();
  
  // Transform raw data for chart
  const voltageChartData = rawTelemetryData.map((row) => ({
    time: row.time_recv_s,
    last: row.V_car_last,
    avg: row.V_car_avg,
    min: row.V_car_min,
    max: row.V_car_max,
  }));

  const sagChartData = rawTelemetryData.map((row) => ({
    time: row.time_recv_s,
    sag: row.V_car_sag,
  }));

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Live Analysis Engine</h1>
          <p className="text-sm text-muted-foreground">Real-time telemetry monitoring and trend detection</p>
        </div>

        {/* Live Telemetry Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TelemetryCard
            title="Current Speed"
            value={currentData.speed.toFixed(1)}
            unit="km/h"
            icon={<Gauge className="h-4 w-4" />}
            trend={currentData.speed > 45 ? "up" : "down"}
            trendValue={`${currentData.speed > 45 ? "+" : ""}${(currentData.speed - 45).toFixed(1)} km/h`}
            status={currentData.speed > 55 ? "warning" : "optimal"}
          />
          <TelemetryCard
            title="Battery Voltage"
            value={currentData.voltage.toFixed(2)}
            unit="V"
            icon={<Zap className="h-4 w-4" />}
            trend={currentData.voltage > 12 ? "stable" : "down"}
            status={currentData.voltage < 11.5 ? "warning" : "optimal"}
          />
          <TelemetryCard
            title="Power Draw"
            value={Math.round(currentData.power)}
            unit="W"
            icon={<BatteryCharging className="h-4 w-4" />}
            trend={currentData.power > 300 ? "up" : "stable"}
            status={currentData.power > 350 ? "warning" : "optimal"}
          />
          <TelemetryCard
            title="Signal Quality"
            value={Math.round(currentData.rssi)}
            unit="dBm"
            icon={<Radio className="h-4 w-4" />}
            trendValue={`SNR: ${Math.round(currentData.snr)} dB`}
            status={currentData.rssi < -70 ? "warning" : "optimal"}
          />
        </div>

        {/* Live Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
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

          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Energy Metrics
              </h3>
            </div>
            <EnergyChart data={historicalData} />
          </div>
        </div>

        {/* Recorded Data Charts */}
        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
            Recorded Voltage Data (60 Readings)
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={voltageChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                  label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                  domain={[30, 70]}
                  label={{ value: 'Voltage (V)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(222, 47%, 8%)",
                    border: "1px solid hsl(217, 33%, 20%)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <ReferenceLine y={45} stroke="hsl(142, 76%, 45%)" strokeDasharray="5 5" label={{ value: 'Optimal', fill: 'hsl(142, 76%, 45%)', fontSize: 10 }} />
                <Line 
                  type="monotone" 
                  dataKey="last" 
                  name="V_car_last"
                  stroke="hsl(186, 100%, 50%)" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="avg" 
                  name="V_car_avg"
                  stroke="hsl(38, 92%, 50%)" 
                  strokeWidth={1}
                  dot={false}
                  opacity={0.7}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Voltage Sag Chart */}
        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
            Voltage Sag Analysis
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sagChartData}>
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
                  domain={[0, 25]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(222, 47%, 8%)",
                    border: "1px solid hsl(217, 33%, 20%)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <ReferenceLine y={2} stroke="hsl(38, 92%, 50%)" strokeDasharray="5 5" label={{ value: 'Warning', fill: 'hsl(38, 92%, 50%)', fontSize: 10 }} />
                <ReferenceLine y={5} stroke="hsl(0, 84%, 60%)" strokeDasharray="5 5" label={{ value: 'Critical', fill: 'hsl(0, 84%, 60%)', fontSize: 10 }} />
                <Line 
                  type="monotone" 
                  dataKey="sag" 
                  name="V_car_sag"
                  stroke="hsl(280, 100%, 60%)" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Avg Voltage</div>
            <div className="font-display text-2xl font-bold text-foreground mt-1">{summary.avgVoltage.toFixed(2)}V</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Voltage Range</div>
            <div className="font-display text-2xl font-bold text-foreground mt-1">{summary.minVoltage.toFixed(1)} - {summary.maxVoltage.toFixed(1)}V</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Max Sag</div>
            <div className="font-display text-2xl font-bold text-destructive mt-1">{summary.maxSag.toFixed(2)}V</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Avg Sag</div>
            <div className="font-display text-2xl font-bold text-warning mt-1">{summary.avgSag.toFixed(2)}V</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
