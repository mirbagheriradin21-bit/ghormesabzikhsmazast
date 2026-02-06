import { useConnection } from '@/contexts/ConnectionContext';
import { cn } from '@/lib/utils';
import sabisTrackImage from '@/assets/sabis-track.png';

interface SabisTrackMapProps {
  className?: string;
}

export function SabisTrackMap({ className }: SabisTrackMapProps) {
  const { isPrimaryConnected, trackPosition, currentPrimarySample } = useConnection();
  
  // Define track path points (approximating the oval track from the image)
  // The track is roughly an oval/rectangle with rounded corners
  const getVehiclePosition = (percent: number) => {
    // Track dimensions based on image aspect ratio
    // Outer track path approximation - starts at top-right, goes clockwise
    const trackPath = [
      // Top straight (right to left)
      { x: 85, y: 8 },   // Start
      { x: 15, y: 8 },   // End of top straight
      // Left curve
      { x: 5, y: 20 },
      { x: 3, y: 50 },
      { x: 5, y: 80 },
      // Bottom straight (left to right)
      { x: 15, y: 92 },
      { x: 85, y: 92 },
      // Right curve
      { x: 95, y: 80 },
      { x: 97, y: 50 },
      { x: 95, y: 20 },
      { x: 85, y: 8 },   // Back to start
    ];
    
    // Interpolate position along the path
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
    <div className={cn(
      "relative bg-card rounded-lg border border-border overflow-hidden",
      className
    )}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-card via-card/80 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              SABIS Track Map
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Lap Time: 36.3s
            </p>
          </div>
          {isPrimaryConnected && (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-mono text-success">LIVE</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Track Image Container */}
      <div className="relative w-full aspect-[16/9]">
        {/* Track Image */}
        <img
          src={sabisTrackImage}
          alt="SABIS Track"
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            !isPrimaryConnected && "opacity-30 grayscale"
          )}
        />
        
        {/* Overlay when not connected */}
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
        
        {/* Vehicle Indicator (only when connected) */}
        {isPrimaryConnected && (
          <div
            className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100"
            style={{
              left: `${vehiclePos.x}%`,
              top: `${vehiclePos.y}%`,
            }}
          >
            {/* Outer glow ring */}
            <div className="absolute inset-0 h-8 w-8 -m-4 rounded-full bg-primary/30 animate-ping" />
            
            {/* Main vehicle dot */}
            <div className="relative h-6 w-6 rounded-full bg-primary shadow-[0_0_20px_hsl(var(--primary))] flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
            </div>
            
            {/* Trail effect */}
            <div 
              className="absolute h-4 w-4 rounded-full bg-primary/50 -z-10"
              style={{
                left: '-4px',
                top: '4px',
                filter: 'blur(4px)',
              }}
            />
          </div>
        )}
      </div>
      
      {/* Stats Footer (only when connected) */}
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
