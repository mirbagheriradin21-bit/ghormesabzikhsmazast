import { useState } from 'react';
import { Wifi, WifiOff, Server, Play, Pause, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BackendConnectionProps {
  connected: boolean;
  isDemoMode: boolean;
  backendUrl: string;
  serverTime: string | null;
  onUrlChange: (url: string) => void;
  onToggleDemoMode: () => void;
}

export function BackendConnection({
  connected,
  isDemoMode,
  backendUrl,
  serverTime,
  onUrlChange,
  onToggleDemoMode,
}: BackendConnectionProps) {
  const [urlInput, setUrlInput] = useState(backendUrl);

  const handleUrlSubmit = () => {
    onUrlChange(urlInput);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Status Badge */}
      <Badge
        variant="outline"
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1',
          connected && !isDemoMode
            ? 'border-success/50 bg-success/10 text-success'
            : isDemoMode
              ? 'border-warning/50 bg-warning/10 text-warning'
              : 'border-destructive/50 bg-destructive/10 text-destructive'
        )}
      >
        {connected && !isDemoMode ? (
          <>
            <Wifi className="h-3 w-3" />
            <span className="text-xs font-medium">LIVE</span>
          </>
        ) : isDemoMode ? (
          <>
            <Play className="h-3 w-3" />
            <span className="text-xs font-medium">DEMO</span>
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3" />
            <span className="text-xs font-medium">OFFLINE</span>
          </>
        )}
      </Badge>

      {/* Settings Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-1">Backend Connection</h4>
              <p className="text-xs text-muted-foreground">
                Configure the telemetry backend server
              </p>
            </div>

            {/* Demo Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isDemoMode ? (
                  <Play className="h-4 w-4 text-warning" />
                ) : (
                  <Pause className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm">Demo Mode</span>
              </div>
              <Switch
                checked={isDemoMode}
                onCheckedChange={onToggleDemoMode}
              />
            </div>

            {/* Backend URL */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Backend URL</label>
              <div className="flex gap-2">
                <Input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="http://localhost:8000"
                  className="flex-1 h-8 text-xs"
                />
                <Button size="sm" onClick={handleUrlSubmit} className="h-8">
                  Connect
                </Button>
              </div>
            </div>

            {/* Connection Status */}
            <div className="rounded-lg bg-muted/50 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium">Server Status</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Connected:</span>
                  <span className={cn('ml-1', connected ? 'text-success' : 'text-destructive')}>
                    {connected ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Mode:</span>
                  <span className={cn('ml-1', isDemoMode ? 'text-warning' : 'text-success')}>
                    {isDemoMode ? 'Demo' : 'Live'}
                  </span>
                </div>
              </div>

              {serverTime && (
                <div className="text-xs text-muted-foreground">
                  Server time: {new Date(serverTime).toLocaleTimeString()}
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="text-xs text-muted-foreground border-t pt-3">
              <p className="font-medium mb-1">To connect:</p>
              <ol className="list-decimal list-inside space-y-0.5">
                <li>Run the Python backend on your laptop</li>
                <li>Enter the server URL above</li>
                <li>Disable Demo Mode</li>
              </ol>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
