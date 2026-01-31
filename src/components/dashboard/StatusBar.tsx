import { Wifi, WifiOff, Battery, Clock, Radio, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBarProps {
  connectionStatus: "connected" | "disconnected" | "weak";
  signalStrength: number; // -100 to 0 dBm (RSSI)
  snr: number; // Signal to Noise Ratio
  batteryLevel: number; // 0-100
  uptime: string;
  dataRate: number; // packets per second
}

export function StatusBar({
  connectionStatus,
  signalStrength,
  snr,
  batteryLevel,
  uptime,
  dataRate,
}: StatusBarProps) {
  const getSignalBars = (rssi: number) => {
    if (rssi >= -50) return 4;
    if (rssi >= -60) return 3;
    if (rssi >= -70) return 2;
    if (rssi >= -80) return 1;
    return 0;
  };

  const signalBars = getSignalBars(signalStrength);

  const connectionConfig = {
    connected: { color: "text-success", label: "Connected" },
    disconnected: { color: "text-destructive", label: "Disconnected" },
    weak: { color: "text-warning", label: "Weak Signal" },
  };

  const config = connectionConfig[connectionStatus];

  return (
    <div className="flex items-center gap-6 px-4 py-2 bg-card/50 border-b border-border text-xs">
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        {connectionStatus === "disconnected" ? (
          <WifiOff className={cn("h-4 w-4", config.color)} />
        ) : (
          <Wifi className={cn("h-4 w-4", config.color)} />
        )}
        <span className={cn("font-medium", config.color)}>{config.label}</span>
      </div>

      {/* Divider */}
      <div className="h-4 w-px bg-border" />

      {/* Signal Strength */}
      <div className="flex items-center gap-2">
        <div className="flex items-end gap-0.5 h-4">
          {[1, 2, 3, 4].map((bar) => (
            <div
              key={bar}
              className={cn(
                "w-1 rounded-sm transition-all",
                bar <= signalBars ? "bg-success" : "bg-muted",
                bar === 1 && "h-1",
                bar === 2 && "h-2",
                bar === 3 && "h-3",
                bar === 4 && "h-4"
              )}
            />
          ))}
        </div>
        <span className="font-mono text-muted-foreground">
          {signalStrength} dBm
        </span>
      </div>

      {/* SNR */}
      <div className="flex items-center gap-1.5">
        <Radio className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-muted-foreground">SNR:</span>
        <span className={cn(
          "font-mono",
          snr >= 20 ? "text-success" : snr >= 10 ? "text-warning" : "text-destructive"
        )}>
          {snr} dB
        </span>
      </div>

      {/* Divider */}
      <div className="h-4 w-px bg-border" />

      {/* Data Rate */}
      <div className="flex items-center gap-1.5">
        <Activity className="h-3.5 w-3.5 text-primary animate-pulse" />
        <span className="font-mono text-primary">{dataRate}</span>
        <span className="text-muted-foreground">pkt/s</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Battery */}
      <div className="flex items-center gap-1.5">
        <Battery
          className={cn(
            "h-4 w-4",
            batteryLevel > 50
              ? "text-success"
              : batteryLevel > 20
              ? "text-warning"
              : "text-destructive"
          )}
        />
        <span className="font-mono text-muted-foreground">{batteryLevel}%</span>
      </div>

      {/* Uptime */}
      <div className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-mono text-muted-foreground">{uptime}</span>
      </div>
    </div>
  );
}
