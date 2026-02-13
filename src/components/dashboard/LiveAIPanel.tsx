import { useState } from 'react';
import { useConnection } from '@/contexts/ConnectionContext';
import { Brain, Sparkles, TrendingUp, Zap, Shield, AlertTriangle, Battery, Gauge, Timer, Maximize2, Minimize2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export function LiveAIPanel() {
  const { isPrimaryConnected, currentInsight, insightHistory } = useConnection();
  const [isExpanded, setIsExpanded] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);

  const getRiskColor = (level: string) => {
    if (level === 'high') return 'text-destructive';
    if (level === 'med') return 'text-warning';
    return 'text-success';
  };

  const getRiskBg = (level: string) => {
    if (level === 'high') return 'bg-destructive/10 border-destructive/30';
    if (level === 'med') return 'bg-warning/10 border-warning/30';
    return 'bg-success/10 border-success/30';
  };

  const handleSend = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);

    // Generate AI response from current insight
    setTimeout(() => {
      let response = 'No telemetry data available yet. Press Connect to start streaming.';
      if (currentInsight) {
        const soc = (currentInsight.soc_est * 100).toFixed(1);
        const eff = currentInsight.efficiency_score;
        const action = currentInsight.suggested_action;
        response = `Current SoC: ${soc}% | Efficiency: ${eff}/100\n\nRecommendation: ${action}\n\nBurn rate: ${currentInsight.burn_rate_w}W | Time remaining: ${Math.floor(currentInsight.time_remaining_s / 60)}m ${currentInsight.time_remaining_s % 60}s`;
      }
      setChatMessages(prev => [...prev, { role: 'ai', text: response }]);
    }, 500);
  };

  const panelContent = (
    <div className="relative z-10 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded-md", isPrimaryConnected ? "bg-quantum/20 glow-border-quantum" : "bg-muted")}>
            <Brain className={cn("h-4 w-4", isPrimaryConnected ? "text-quantum" : "text-muted-foreground")} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Telemetry AI Assistant</h3>
            <p className="text-xs text-muted-foreground">
              {isPrimaryConnected ? "Live analysis active" : "Waiting for connection"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isPrimaryConnected && (
            <div className="flex items-center gap-1.5 text-xs">
              <Sparkles className="h-3 w-3 text-quantum animate-pulse" />
              <span className="font-mono text-quantum">ACTIVE</span>
            </div>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-md hover:bg-secondary transition-colors"
          >
            {isExpanded ? <Minimize2 className="h-4 w-4 text-muted-foreground" /> : <Maximize2 className="h-4 w-4 text-muted-foreground" />}
          </button>
        </div>
      </div>

      {!isPrimaryConnected ? (
        <div className="py-8 text-center">
          <div className="h-16 w-16 mx-auto mb-4 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
            <Brain className="h-8 w-8 text-muted-foreground/30" />
          </div>
          <p className="text-muted-foreground text-sm">Press Connect to activate AI analysis</p>
        </div>
      ) : currentInsight ? (
        <div className="flex-1 flex flex-col min-h-0 space-y-3">
          {/* Primary Action */}
          <div className={cn("p-3 rounded-lg border shrink-0", getRiskBg(currentInsight.battery_risk_level))}>
            <div className="flex items-center gap-2 mb-1">
              <Shield className={cn("h-4 w-4", getRiskColor(currentInsight.battery_risk_level))} />
              <span className="text-sm font-medium text-foreground">Primary Action</span>
            </div>
            <p className="text-sm text-foreground font-mono">{currentInsight.suggested_action}</p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 shrink-0">
            <div className="bg-secondary/50 rounded-lg p-2 text-center">
              <Battery className="h-3 w-3 mx-auto mb-1 text-primary" />
              <div className="text-xs text-muted-foreground">SoC</div>
              <div className="font-display text-sm font-bold text-primary">
                {(currentInsight.soc_est * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-2 text-center">
              <Gauge className="h-3 w-3 mx-auto mb-1 text-warning" />
              <div className="text-xs text-muted-foreground">Efficiency</div>
              <div className={cn("font-display text-sm font-bold",
                currentInsight.efficiency_score > 80 ? "text-success" :
                currentInsight.efficiency_score > 50 ? "text-warning" : "text-destructive"
              )}>
                {currentInsight.efficiency_score}
              </div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-2 text-center">
              <Zap className="h-3 w-3 mx-auto mb-1 text-quantum" />
              <div className="text-xs text-muted-foreground">Burn</div>
              <div className="font-display text-sm font-bold text-quantum">
                {currentInsight.burn_rate_w}W
              </div>
            </div>
          </div>

          {/* Time Estimates */}
          <div className="grid grid-cols-2 gap-2 shrink-0">
            <div className="bg-secondary/50 rounded-lg p-2 flex items-center gap-2">
              <Timer className="h-3.5 w-3.5 text-primary" />
              <div>
                <div className="text-[10px] text-muted-foreground">Time to Empty</div>
                <div className="font-mono text-xs font-bold text-foreground">
                  {Math.floor(currentInsight.time_to_empty_s / 60)}m {currentInsight.time_to_empty_s % 60}s
                </div>
              </div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-2 flex items-center gap-2">
              <Timer className="h-3.5 w-3.5 text-success" />
              <div>
                <div className="text-[10px] text-muted-foreground">Remaining</div>
                <div className="font-mono text-xs font-bold text-foreground">
                  {Math.floor(currentInsight.time_remaining_s / 60)}m {currentInsight.time_remaining_s % 60}s
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {currentInsight.notes.slice(0, 3).map((note, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground shrink-0">
              <TrendingUp className="h-3 w-3 mt-0.5 text-primary/60 shrink-0" />
              <span>{note}</span>
            </div>
          ))}

          {/* Anomaly flag */}
          {currentInsight.anomaly_flag && (
            <div className="p-2 bg-destructive/10 border border-destructive/30 rounded-lg flex items-center gap-2 shrink-0">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-xs font-medium text-destructive">{currentInsight.anomaly_reason}</span>
            </div>
          )}

          {/* Chat Area */}
          <div className="flex-1 min-h-0 flex flex-col mt-2 border-t border-border pt-3">
            <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 shrink-0">AI Chat</h4>
            <ScrollArea className="flex-1 min-h-[100px] max-h-[200px]">
              <div className="space-y-2 pr-2">
                {chatMessages.length === 0 && (
                  <p className="text-xs text-muted-foreground/50 italic">Ask the AI about your telemetry data...</p>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={cn(
                    "text-xs p-2 rounded-lg max-w-[90%] whitespace-pre-wrap",
                    msg.role === 'user'
                      ? "bg-primary/20 text-foreground ml-auto"
                      : "bg-secondary/80 text-foreground mr-auto"
                  )}>
                    {msg.text}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="flex gap-2 mt-2 shrink-0">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about telemetry..."
                className="flex-1 bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={handleSend}
                className="p-2 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors"
              >
                <Send className="h-4 w-4 text-primary" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6">
        <div className="bg-card rounded-xl border border-border p-6 w-full max-w-3xl max-h-[90vh] flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-quantum via-transparent to-primary" />
          </div>
          {panelContent}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4 relative overflow-hidden lg:col-span-1">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-quantum via-transparent to-primary" />
      </div>
      {panelContent}
    </div>
  );
}
