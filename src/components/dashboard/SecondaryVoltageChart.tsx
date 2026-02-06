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
  AreaChart,
  Area,
} from 'recharts';
import { Zap, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { getVoltageSummary } from '@/data/secondaryVoltageData';

export function SecondaryVoltageChart() {
  const { isSecondaryConnected, secondaryStreamData, secondaryStreamIndex } = useConnection();
  
  // Transform data for chart
  const chartData = secondaryStreamData.map((row, index) => ({
    index: index + 1,
    V_last: row.V_car_last,
    V_avg: row.V_car_avg,
    V_min: row.V_car_min,
    V_max: row.V_car_max,
    range: row.V_car_max - row.V_car_min,
  }));
  
  const summary = getVoltageSummary();
  const currentSample = secondaryStreamData.length > 0 ? secondaryStreamData[secondaryStreamData.length - 1] : null;
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-xs text-muted-foreground mb-2 font-mono">Sample: {label}</p>
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
  
  if (!isSecondaryConnected) return null;
  
  return (
    <div className="bg-card rounded-lg border-2 border-warning/50 p-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-warning/20">
            <Zap className="h-4 w-4 text-warning" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Secondary Voltage Stream
            </h3>
            <p className="text-xs text-muted-foreground">
              {secondaryStreamIndex} samples • Stability Analysis
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <div className="h-2 w-2 rounded-full bg-warning animate-pulse" />
          <span className="font-mono text-warning">VOLTAGE ACTIVE</span>
        </div>
      </div>
      
      {/* Current Status */}
      {currentSample && (
        <div className="mb-4 p-3 bg-secondary/50 rounded-lg border border-border">
          <p className="text-sm text-foreground">{currentSample.aiAnalysis}</p>
        </div>
      )}
      
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-secondary/50 rounded-lg p-3 text-center">
          <div className="text-xs text-muted-foreground uppercase">Current</div>
          <div className="font-display text-xl font-bold text-warning">
            {currentSample?.V_car_last.toFixed(2) || '--'}V
          </div>
        </div>
        <div className="bg-secondary/50 rounded-lg p-3 text-center">
          <div className="text-xs text-muted-foreground uppercase">Average</div>
          <div className="font-display text-xl font-bold text-foreground">
            {currentSample?.V_car_avg.toFixed(2) || '--'}V
          </div>
        </div>
        <div className="bg-secondary/50 rounded-lg p-3 text-center">
          <div className="text-xs text-muted-foreground uppercase">Min</div>
          <div className="font-display text-xl font-bold text-destructive">
            {currentSample?.V_car_min.toFixed(2) || '--'}V
          </div>
        </div>
        <div className="bg-secondary/50 rounded-lg p-3 text-center">
          <div className="text-xs text-muted-foreground uppercase">Max</div>
          <div className="font-display text-xl font-bold text-success">
            {currentSample?.V_car_max.toFixed(2) || '--'}V
          </div>
        </div>
      </div>
      
      {/* Main Chart */}
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="voltageGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" vertical={false} />
            <XAxis
              dataKey="index"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              domain={[30, 70]}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={45}
              stroke="hsl(142, 76%, 45%)"
              strokeDasharray="4 4"
              label={{ value: 'Optimal', fill: 'hsl(142, 76%, 45%)', fontSize: 10 }}
            />
            <ReferenceLine
              y={40}
              stroke="hsl(38, 92%, 50%)"
              strokeDasharray="4 4"
              strokeOpacity={0.5}
            />
            <Area
              type="monotone"
              dataKey="V_last"
              name="V_last"
              stroke="hsl(38, 92%, 50%)"
              strokeWidth={2}
              fill="url(#voltageGradient)"
              animationDuration={300}
            />
            <Line
              type="monotone"
              dataKey="V_avg"
              name="V_avg"
              stroke="hsl(186, 100%, 50%)"
              strokeWidth={1}
              dot={false}
              opacity={0.7}
              animationDuration={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Voltage Alerts */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <div>
            <div className="text-sm font-medium text-foreground">Spike Detected</div>
            <div className="text-xs text-muted-foreground">Max: {summary.maxVoltage.toFixed(2)}V</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-warning/10 border border-warning/30 rounded-lg">
          <TrendingDown className="h-5 w-5 text-warning" />
          <div>
            <div className="text-sm font-medium text-foreground">Drop Detected</div>
            <div className="text-xs text-muted-foreground">Min: {summary.minVoltage.toFixed(2)}V</div>
          </div>
        </div>
      </div>
    </div>
  );
}
