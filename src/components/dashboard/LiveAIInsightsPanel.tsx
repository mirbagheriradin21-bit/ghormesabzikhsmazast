import { AlertTriangle, CheckCircle, TrendingUp, Battery, Zap, Lightbulb } from 'lucide-react';
import { AIInsight } from '@/services/telemetryService';
import { cn } from '@/lib/utils';

interface LiveAIInsightsPanelProps {
  insight: AIInsight | null;
}

export function LiveAIInsightsPanel({ insight }: LiveAIInsightsPanelProps) {
  if (!insight) {
    return (
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            AI Insights
          </h3>
        </div>
        <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
          Waiting for telemetry data...
        </div>
      </div>
    );
  }

  const riskColors = {
    low: 'text-success',
    medium: 'text-warning',
    high: 'text-destructive',
  };

  const riskBgColors = {
    low: 'bg-success/10 border-success/30',
    medium: 'bg-warning/10 border-warning/30',
    high: 'bg-destructive/10 border-destructive/30',
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            AI Insights
          </h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {new Date(insight.timestamp).toLocaleTimeString()}
        </span>
      </div>

      <div className="space-y-4">
        {/* Status Row */}
        <div className="flex items-center gap-4">
          {/* Anomaly Status */}
          <div
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg border',
              insight.anomaly_flag
                ? 'bg-destructive/10 border-destructive/30'
                : 'bg-success/10 border-success/30'
            )}
          >
            {insight.anomaly_flag ? (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            ) : (
              <CheckCircle className="h-4 w-4 text-success" />
            )}
            <span
              className={cn(
                'text-sm font-medium',
                insight.anomaly_flag ? 'text-destructive' : 'text-success'
              )}
            >
              {insight.anomaly_flag
                ? `${insight.anomaly_count} Anomal${insight.anomaly_count > 1 ? 'ies' : 'y'}`
                : 'All Systems Normal'}
            </span>
          </div>

          {/* Efficiency Score */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm">
              Efficiency:{' '}
              <span
                className={cn(
                  'font-bold',
                  insight.efficiency_score >= 80
                    ? 'text-success'
                    : insight.efficiency_score >= 50
                      ? 'text-warning'
                      : 'text-destructive'
                )}
              >
                {insight.efficiency_score}%
              </span>
            </span>
          </div>

          {/* Battery Risk */}
          <div
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg border',
              riskBgColors[insight.battery_risk_level]
            )}
          >
            <Battery className={cn('h-4 w-4', riskColors[insight.battery_risk_level])} />
            <span className={cn('text-sm font-medium', riskColors[insight.battery_risk_level])}>
              {insight.battery_risk_level.toUpperCase()} Risk
            </span>
          </div>
        </div>

        {/* Anomaly Details */}
        {insight.anomaly_flag && insight.anomaly_reasons.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Detected Issues
            </h4>
            <div className="space-y-1">
              {insight.anomaly_reasons.map((reason, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-sm text-destructive bg-destructive/5 px-3 py-2 rounded"
                >
                  <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Actions */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Recommended Action
          </h4>
          <div className="flex items-start gap-2 text-sm bg-primary/5 border border-primary/20 px-3 py-2 rounded">
            <Zap className="h-3.5 w-3.5 mt-0.5 text-primary flex-shrink-0" />
            <span className="text-foreground">{insight.suggested_action}</span>
          </div>
        </div>

        {/* Metrics Analyzed */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-border">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Voltage</div>
            <div className="font-mono text-sm text-foreground">
              {insight.metrics_analyzed.voltage?.toFixed(1) || '--'}V
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Current</div>
            <div className="font-mono text-sm text-foreground">
              {insight.metrics_analyzed.current?.toFixed(1) || '--'}A
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Speed</div>
            <div className="font-mono text-sm text-foreground">
              {insight.metrics_analyzed.speed?.toFixed(1) || '--'}km/h
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Sag</div>
            <div
              className={cn(
                'font-mono text-sm',
                (insight.metrics_analyzed.voltage_sag || 0) > 2
                  ? 'text-warning'
                  : 'text-foreground'
              )}
            >
              {insight.metrics_analyzed.voltage_sag?.toFixed(2) || '--'}V
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
