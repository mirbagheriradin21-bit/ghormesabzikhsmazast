import { useConnection } from '@/contexts/ConnectionContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PrimaryVoltageChart() {
  const { isPrimaryConnected, primaryStreamData } = useConnection();
  
  // Transform data for chart
  const chartData = primaryStreamData.map((row, index) => ({
    time: row.time_recv_s,
    V_last: row.V_car_last,
    V_avg: row.V_car_avg,
    V_min: row.V_car_min,
    V_max: row.V_car_max,
    optimal: 45, // AI optimal voltage line
  }));
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-xs text-muted-foreground mb-2 font-mono">T: {label}s</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-mono font-semibold text-foreground">
                {entry.value?.toFixed(2)}V
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className={cn(
            "h-4 w-4",
            isPrimaryConnected ? "text-primary" : "text-muted-foreground"
          )} />
          <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Battery Voltage vs AI-Optimal
          </h3>
        </div>
        {isPrimaryConnected && (
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">V_last</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-success opacity-50" />
              <span className="text-muted-foreground">Optimal</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Chart */}
      <div className="h-[200px]">
        {!isPrimaryConnected ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="h-12 w-12 mx-auto mb-3 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                <Zap className="h-6 w-6 text-muted-foreground/30" />
              </div>
              <p className="text-muted-foreground text-sm">Press Connect to view voltage data</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" vertical={false} />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                domain={[40, 52]}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={45}
                stroke="hsl(142, 76%, 45%)"
                strokeDasharray="4 4"
                strokeOpacity={0.5}
              />
              <Line
                type="monotone"
                dataKey="V_last"
                name="V_last"
                stroke="hsl(186, 100%, 50%)"
                strokeWidth={2}
                dot={false}
                animationDuration={300}
              />
              <Line
                type="monotone"
                dataKey="V_avg"
                name="V_avg"
                stroke="hsl(38, 92%, 50%)"
                strokeWidth={1}
                dot={false}
                opacity={0.7}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
