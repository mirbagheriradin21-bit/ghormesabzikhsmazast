import { useConnection } from '@/contexts/ConnectionContext';
import { cn } from '@/lib/utils';
import { Power, Zap, Wifi, WifiOff } from 'lucide-react';

export function ConnectionButtons() {
  const { 
    isPrimaryConnected, 
    isSecondaryConnected, 
    connectPrimary, 
    connectSecondary,
    disconnectPrimary,
    disconnectSecondary,
  } = useConnection();
  
  return (
    <div className="flex items-center gap-4">
      {/* Large White Connect Button */}
      <button
        onClick={isPrimaryConnected ? disconnectPrimary : connectPrimary}
        className={cn(
          "relative flex items-center gap-3 px-6 py-3 rounded-lg font-display text-sm font-semibold uppercase tracking-wider transition-all duration-300",
          isPrimaryConnected
            ? "bg-success text-success-foreground shadow-[0_0_20px_hsl(var(--success)/0.5)]"
            : "bg-foreground text-background hover:bg-foreground/90 hover:shadow-[0_0_30px_hsl(var(--foreground)/0.3)]"
        )}
      >
        {isPrimaryConnected ? (
          <>
            <Wifi className="h-5 w-5 animate-pulse" />
            <span>Connected</span>
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-success animate-ping" />
          </>
        ) : (
          <>
            <Power className="h-5 w-5" />
            <span>Connect</span>
          </>
        )}
      </button>
      
      {/* Small Orange Circular Voltage Button */}
      <button
        onClick={isSecondaryConnected ? disconnectSecondary : connectSecondary}
        className={cn(
          "relative flex items-center justify-center h-12 w-12 rounded-full transition-all duration-300",
          isSecondaryConnected
            ? "bg-warning shadow-[0_0_20px_hsl(var(--warning)/0.6)] ring-2 ring-warning/50"
            : "bg-warning/80 hover:bg-warning hover:shadow-[0_0_15px_hsl(var(--warning)/0.4)]"
        )}
        title={isSecondaryConnected ? "Voltage Stream Active" : "Activate Voltage Stream"}
      >
        <Zap className={cn(
          "h-5 w-5 text-warning-foreground",
          isSecondaryConnected && "animate-pulse"
        )} />
        {isSecondaryConnected && (
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-warning animate-ping" />
        )}
      </button>
    </div>
  );
}
