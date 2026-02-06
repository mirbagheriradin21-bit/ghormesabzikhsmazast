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
  Area,
  AreaChart,
} from 'recharts';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PrimaryCurrentChart() {
  const { isPrimaryConnected, primaryStreamData } = useConnection();
  
  // Transform data for chart
  const chartData = primaryStreamData.map((row) => ({
    time: row.time_recv_s,
    I_last: row.I_last,
    I_avg: row.I_avg,
    power: row.power_w,
    efficiency: Math.max(0, 100 - Math.abs(row.I_last - 35) * 2), // Efficiency score
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
                {entry.value?.toFixed(1)}{entry.name.includes('Power') ? 'W' : entry.name.includes('Eff') ? '%' : 'A'}
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
          <Activity className={cn(
            "h-4 w-4",
            isPrimaryConnected ? "text-warning" : "text-muted-foreground"
          )} />
          <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Current Draw vs Efficiency
          </h3>
        </div>
        {isPrimaryConnected && (
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-warning" />
              <span className="text-muted-foreground">Current</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-quantum" />
              <span className="text-muted-foreground">Power</span>
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
                <Activity className="h-6 w-6 text-muted-foreground/30" />
              </div>
              <p className="text-muted-foreground text-sm">Press Connect to view current data</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" vertical={false} />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                dy={10}
              />
              <YAxis
                yAxisId="current"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                dx={-10}
              />
              <YAxis
                yAxisId="power"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                dx={10}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                yAxisId="current"
                y={35}
                stroke="hsl(142, 76%, 45%)"
                strokeDasharray="4 4"
                strokeOpacity={0.5}
              />
              <Line
                yAxisId="current"
                type="monotone"
                dataKey="I_last"
                name="I_last"
                stroke="hsl(38, 92%, 50%)"
                strokeWidth={2}
                dot={false}
                animationDuration={300}
              />
              <Line
                yAxisId="power"
                type="monotone"
                dataKey="power"
                name="Power"
                stroke="hsl(280, 100%, 65%)"
                strokeWidth={1.5}
                dot={false}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
