import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SabisTrackMap } from "@/components/dashboard/SabisTrackMap";
import { ConnectionButtons } from "@/components/dashboard/ConnectionButtons";
import { useConnection } from "@/contexts/ConnectionContext";
import trackImage from "@/assets/dubai-autodrome-track.png";

export default function TrackMapPage() {
  const { isPrimaryConnected, currentInsight, primaryStreamData } = useConnection();

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Track Map</h1>
            <p className="text-sm text-muted-foreground">
              {isPrimaryConnected ? "Live vehicle tracking active" : "Press Connect to activate track visualization"}
            </p>
          </div>
          <ConnectionButtons />
        </div>

        {/* Track Info */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Track</div>
            <div className="font-display text-lg font-bold text-foreground mt-1">Dubai Autodrome</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Lap Time</div>
            <div className="font-display text-lg font-bold text-foreground mt-1">36.3s</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Efficiency</div>
            <div className="font-display text-lg font-bold text-primary mt-1">
              {isPrimaryConnected && currentInsight ? currentInsight.efficiency_score : '--'}
            </div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">SoC</div>
            <div className="font-display text-lg font-bold text-success mt-1">
              {isPrimaryConnected && currentInsight ? `${(currentInsight.soc_est * 100).toFixed(1)}%` : '--'}
            </div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Samples</div>
            <div className="font-display text-lg font-bold text-primary mt-1">
              {isPrimaryConnected ? primaryStreamData.length : '--'}
            </div>
          </div>
        </div>

        {/* Track Map (main) */}
        <SabisTrackMap />
      </div>
    </DashboardLayout>
  );
}
