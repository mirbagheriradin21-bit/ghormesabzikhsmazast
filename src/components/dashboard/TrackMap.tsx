import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TrackMapProps {
  vehiclePosition: number; // 0-100 percentage around track
  speedData: { position: number; speed: number }[];
  className?: string;
}

export function TrackMap({ vehiclePosition, speedData, className }: TrackMapProps) {
  const [animatedPosition, setAnimatedPosition] = useState(vehiclePosition);

  useEffect(() => {
    setAnimatedPosition(vehiclePosition);
  }, [vehiclePosition]);

  // Oval track path
  const trackPath = "M 150 50 A 100 50 0 1 1 150 150 A 100 50 0 1 1 150 50";
  
  // Calculate vehicle position on track
  const getPositionOnTrack = (percent: number) => {
    const angle = (percent / 100) * 2 * Math.PI - Math.PI / 2;
    const cx = 150;
    const cy = 100;
    const rx = 100;
    const ry = 50;
    const x = cx + rx * Math.cos(angle);
    const y = cy + ry * Math.sin(angle);
    return { x, y };
  };

  const vehiclePos = getPositionOnTrack(animatedPosition);

  // Generate speed overlay points
  const speedOverlayPoints = speedData.map((point, index) => {
    const pos = getPositionOnTrack(point.position);
    const normalizedSpeed = Math.min(point.speed / 80, 1); // Normalize to max 80 km/h
    return { ...pos, speed: normalizedSpeed, index };
  });

  return (
    <div className={cn("relative bg-card rounded-lg border border-border p-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Track Position
        </h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Vehicle</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-8 bg-gradient-to-r from-success via-warning to-destructive rounded" />
            <span className="text-muted-foreground">Speed</span>
          </div>
        </div>
      </div>

      {/* SVG Track */}
      <svg viewBox="0 0 300 200" className="w-full h-auto">
        {/* Grid pattern */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="hsl(217, 33%, 15%)"
              strokeWidth="0.5"
            />
          </pattern>
          
          {/* Glow filter for vehicle */}
          <filter id="vehicleGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Speed gradient */}
          <linearGradient id="speedGradientTrack" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(142, 76%, 45%)" />
            <stop offset="50%" stopColor="hsl(38, 92%, 50%)" />
            <stop offset="100%" stopColor="hsl(0, 84%, 60%)" />
          </linearGradient>
        </defs>

        {/* Grid background */}
        <rect width="300" height="200" fill="url(#grid)" />

        {/* Track outline (outer) */}
        <ellipse
          cx="150"
          cy="100"
          rx="110"
          ry="60"
          fill="none"
          stroke="hsl(217, 33%, 20%)"
          strokeWidth="30"
          opacity="0.5"
        />

        {/* Track surface */}
        <ellipse
          cx="150"
          cy="100"
          rx="100"
          ry="50"
          fill="none"
          stroke="hsl(217, 33%, 12%)"
          strokeWidth="20"
        />

        {/* Track center line */}
        <ellipse
          cx="150"
          cy="100"
          rx="100"
          ry="50"
          fill="none"
          stroke="hsl(186, 100%, 50%)"
          strokeWidth="1"
          strokeDasharray="8 4"
          opacity="0.3"
        />

        {/* Speed indicators */}
        {speedOverlayPoints.map((point) => (
          <circle
            key={point.index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill={`hsl(${142 - point.speed * 142}, ${76 + point.speed * 8}%, ${45 + point.speed * 15}%)`}
            opacity={0.6}
          />
        ))}

        {/* Start/Finish line */}
        <line
          x1="150"
          y1="40"
          x2="150"
          y2="60"
          stroke="hsl(var(--foreground))"
          strokeWidth="3"
        />
        <text
          x="150"
          y="35"
          textAnchor="middle"
          fill="hsl(var(--muted-foreground))"
          fontSize="8"
          fontFamily="JetBrains Mono"
        >
          S/F
        </text>

        {/* Sector markers */}
        <text
          x="250"
          y="105"
          textAnchor="middle"
          fill="hsl(var(--muted-foreground))"
          fontSize="8"
          fontFamily="JetBrains Mono"
        >
          S1
        </text>
        <text
          x="150"
          y="160"
          textAnchor="middle"
          fill="hsl(var(--muted-foreground))"
          fontSize="8"
          fontFamily="JetBrains Mono"
        >
          S2
        </text>
        <text
          x="50"
          y="105"
          textAnchor="middle"
          fill="hsl(var(--muted-foreground))"
          fontSize="8"
          fontFamily="JetBrains Mono"
        >
          S3
        </text>

        {/* Vehicle indicator */}
        <g filter="url(#vehicleGlow)">
          {/* Outer pulse ring */}
          <circle
            cx={vehiclePos.x}
            cy={vehiclePos.y}
            r="12"
            fill="none"
            stroke="hsl(186, 100%, 50%)"
            strokeWidth="1"
            opacity="0.3"
            className="animate-pulse-ring"
          />
          
          {/* Vehicle dot */}
          <circle
            cx={vehiclePos.x}
            cy={vehiclePos.y}
            r="6"
            fill="hsl(186, 100%, 50%)"
            stroke="hsl(var(--background))"
            strokeWidth="2"
          />
        </g>

        {/* Position indicator */}
        <text
          x={vehiclePos.x}
          y={vehiclePos.y - 15}
          textAnchor="middle"
          fill="hsl(186, 100%, 50%)"
          fontSize="10"
          fontWeight="bold"
          fontFamily="Orbitron"
        >
          {Math.round(animatedPosition)}%
        </text>
      </svg>

      {/* Lap info */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Lap</div>
          <div className="font-display text-lg font-bold text-foreground">3/10</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Best</div>
          <div className="font-mono text-lg font-bold text-success">1:23.456</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Current</div>
          <div className="font-mono text-lg font-bold text-primary">1:24.892</div>
        </div>
      </div>
    </div>
  );
}
