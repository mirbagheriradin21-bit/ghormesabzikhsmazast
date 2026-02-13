import { useConnection } from '@/contexts/ConnectionContext';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BackendStatusIndicator() {
  const { backendConnected, isPrimaryConnected } = useConnection();

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300",
      backendConnected
        ? "bg-success/10 border border-success/30 text-success"
        : "bg-destructive/10 border border-destructive/30 text-destructive"
    )}>
      {backendConnected ? (
        <>
          <Wifi className="h-3.5 w-3.5" />
          <span>Telemetry Connected</span>
          {isPrimaryConnected && (
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          )}
        </>
      ) : (
        <>
          <WifiOff className="h-3.5 w-3.5" />
          <span>Telemetry Disconnected</span>
        </>
      )}
    </div>
  );
}
