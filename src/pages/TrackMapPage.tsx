import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { rawTelemetryData, getTelemetrySummary } from "@/data/telemetryData";
import trackImage from "@/assets/dubai-autodrome-track.png";
import { useState } from "react";

export default function TrackMapPage() {
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const summary = getTelemetrySummary();

  // Map data points to track positions (simplified mapping)
  const trackPoints = rawTelemetryData.map((row, index) => {
    const progress = index / rawTelemetryData.length;
    // Simulate position along track
    return {
      ...row,
      x: 50 + 40 * Math.cos(progress * 2 * Math.PI),
      y: 50 + 30 * Math.sin(progress * 2 * Math.PI),
    };
  });

  const getColorForVoltage = (voltage: number) => {
    if (voltage > 46) return "hsl(142, 76%, 45%)"; // Green
    if (voltage > 42) return "hsl(38, 92%, 50%)"; // Yellow
    if (voltage > 38) return "hsl(25, 95%, 53%)"; // Orange
    return "hsl(0, 84%, 60%)"; // Red
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Track Map</h1>
          <p className="text-sm text-muted-foreground">Dubai Autodrome - Vehicle Position & Performance Visualization</p>
        </div>

        {/* Track Info */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Track Name</div>
            <div className="font-display text-lg font-bold text-foreground mt-1">GT GP</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Overtake</div>
            <div className="font-display text-lg font-bold text-foreground mt-1">51:51</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Length</div>
            <div className="font-display text-lg font-bold text-foreground mt-1">610 m</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Corners</div>
            <div className="font-display text-lg font-bold text-foreground mt-1">12</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Data Points</div>
            <div className="font-display text-lg font-bold text-primary mt-1">{rawTelemetryData.length}</div>
          </div>
        </div>

        {/* Track Map with Overlay */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Track Layout - Dubai Autodrome GT GP Circuit
            </h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-success" />
                <span className="text-muted-foreground">High Voltage (&gt;46V)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-warning" />
                <span className="text-muted-foreground">Normal (42-46V)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive" />
                <span className="text-muted-foreground">Low (&lt;42V)</span>
              </div>
            </div>
          </div>

          <div className="relative rounded-lg overflow-hidden bg-background/50">
            <img 
              src={trackImage} 
              alt="Dubai Autodrome GT GP Track" 
              className="w-full h-auto"
            />
            
            {/* Marshal Post Legend */}
            <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border">
              <div className="text-xs font-medium text-foreground mb-2">Track Info</div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>• Length: 610m</div>
                <div>• Corners: 12</div>
                <div>• Marshal Posts: Marked</div>
              </div>
            </div>
          </div>
        </div>

        {/* Voltage Map Table */}
        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
            Voltage by Track Position (Sample Data)
          </h3>
          <div className="grid grid-cols-10 gap-1">
            {rawTelemetryData.slice(0, 60).map((row, index) => (
              <div 
                key={row.id}
                className="aspect-square rounded flex items-center justify-center text-[8px] font-mono cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: getColorForVoltage(row.V_car_avg) }}
                title={`T${row.time_recv_s}s: ${row.V_car_avg.toFixed(2)}V`}
                onClick={() => setSelectedPoint(index)}
              >
                {row.time_recv_s}
              </div>
            ))}
          </div>
          
          {selectedPoint !== null && (
            <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
              <div className="text-sm font-medium text-foreground">
                Selected Point: T{rawTelemetryData[selectedPoint].time_recv_s}s
              </div>
              <div className="grid grid-cols-3 gap-4 mt-2 text-xs text-muted-foreground">
                <div>
                  <span className="block text-foreground font-mono text-lg">
                    {rawTelemetryData[selectedPoint].V_car_last.toFixed(2)}V
                  </span>
                  Last Voltage
                </div>
                <div>
                  <span className="block text-foreground font-mono text-lg">
                    {rawTelemetryData[selectedPoint].V_car_avg.toFixed(2)}V
                  </span>
                  Average Voltage
                </div>
                <div>
                  <span className="block text-foreground font-mono text-lg">
                    {rawTelemetryData[selectedPoint].V_car_sag.toFixed(2)}V
                  </span>
                  Voltage Sag
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lap Info */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border border-border p-4 text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Session Duration</div>
            <div className="font-mono text-2xl font-bold text-foreground mt-1">{summary.duration}s</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Min Voltage</div>
            <div className="font-mono text-2xl font-bold text-destructive mt-1">{summary.minVoltage.toFixed(2)}V</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Max Voltage</div>
            <div className="font-mono text-2xl font-bold text-success mt-1">{summary.maxVoltage.toFixed(2)}V</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
