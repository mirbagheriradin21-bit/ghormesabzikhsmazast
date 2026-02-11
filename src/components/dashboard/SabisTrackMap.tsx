import { useConnection } from '@/contexts/ConnectionContext';
import { cn } from '@/lib/utils';
import trackImage from '@/assets/dubai-autodrome-track.png';

interface SabisTrackMapProps {
  className?: string;
}

export function SabisTrackMap({ className }: SabisTrackMapProps) {
  const { isPrimaryConnected, trackPosition, currentPrimarySample } = useConnection();

  // Track path matching the uploaded image shape (elongated L-shape, angled)
  // The track runs from bottom-left complex section to top-right long section
  const getVehiclePosition = (percent: number) => {
    const trackPath = [
      // Start at left complex area
      { x: 22, y: 38 },
      { x: 18, y: 28 },
      { x: 14, y: 18 },
      { x: 18, y: 12 },
      { x: 25, y: 15 },
      { x: 22, y: 25 },
      { x: 28, y: 32 },
      // Middle transition
      { x: 35, y: 38 },
      { x: 40, y: 42 },
      { x: 45, y: 44 },
      // Right long section with S-curves
      { x: 52, y: 46 },
      { x: 58, y: 48 },
      { x: 64, y: 46 },
      { x: 68, y: 50 },
      { x: 72, y: 52 },
      { x: 76, y: 48 },
      { x: 80, y: 50 },
      { x: 84, y: 52 },
      { x: 88, y: 48 },
      { x: 90, y: 44 },
      // Return path
      { x: 88, y: 56 },
      { x: 84, y: 58 },
      { x: 78, y: 56 },
      { x: 72, y: 58 },
      { x: 66, y: 56 },
      { x: 60, y: 54 },
      { x: 54, y: 52 },
      { x: 48, y: 50 },
      { x: 42, y: 48 },
      { x: 36, y: 44 },
      { x: 30, y: 40 },
      { x: 22, y: 38 }, // back to start
    ];

    const totalSegments = trackPath.length - 1;
    const segmentProgress = (percent / 100) * totalSegments;
    const segmentIndex = Math.floor(segmentProgress);
    const segmentFraction = segmentProgress - segmentIndex;
    const currentPoint = trackPath[segmentIndex % trackPath.length];
    const nextPoint = trackPath[(segmentIndex + 1) % trackPath.length];
    return {
      x: currentPoint.x + (nextPoint.x - currentPoint.x) * segmentFraction,
      y: currentPoint.y + (nextPoint.y - currentPoint.y) * segmentFraction,
    };
  };

  const vehiclePos = getVehiclePosition(trackPosition);

  return (
    <div className={cn("relative bg-card rounded-lg border border-border overflow-hidden", className)}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-card via-card/80 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Track Map</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Lap Time: 36.3s</p>
          </div>
          {isPrimaryConnected && (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-mono text-success">LIVE</span>
            </div>
          )}
        </div>
      </div>

      {/* Track Image */}
      <div className="relative w-full aspect-[16/9]">
        <img
          src={trackImage}
          alt="Track Layout"
          className={cn(
            "w-full h-full object-contain transition-all duration-500",
            !isPrimaryConnected && "opacity-30 grayscale"
          )}
        />

        {/* Not connected overlay */}
        {!isPrimaryConnected && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <div className="text-center">
              <div className="h-16 w-16 mx-auto mb-4 rounded-full border-2 border-dashed border-muted-foreground/50 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full border-2 border-muted-foreground/30" />
              </div>
              <p className="text-muted-foreground text-sm">Press Connect to activate track</p>
            </div>
          </div>
        )}

        {/* Vehicle dot */}
        {isPrimaryConnected && (
          <div
            className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100"
            style={{ left: `${vehiclePos.x}%`, top: `${vehiclePos.y}%` }}
          >
            <div className="absolute inset-0 h-8 w-8 -m-4 rounded-full bg-primary/30 animate-ping" />
            <div className="relative h-6 w-6 rounded-full bg-primary shadow-[0_0_20px_hsl(var(--primary))] flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
            </div>
            <div className="absolute h-4 w-4 rounded-full bg-primary/50 -z-10" style={{ left: '-4px', top: '4px', filter: 'blur(4px)' }} />
          </div>
        )}
      </div>

      {/* Stats Footer */}
      {isPrimaryConnected && currentPrimarySample && (
        <div className="p-4 border-t border-border bg-card/50 backdrop-blur">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Position</div>
              <div className="font-display text-lg font-bold text-primary">{trackPosition.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Voltage</div>
              <div className="font-display text-lg font-bold text-foreground">{currentPrimarySample.V_car_last.toFixed(1)}V</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Current</div>
              <div className="font-display text-lg font-bold text-warning">{currentPrimarySample.I_last.toFixed(1)}A</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Power</div>
              <div className="font-display text-lg font-bold text-quantum">{currentPrimarySample.power_w.toFixed(0)}W</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
