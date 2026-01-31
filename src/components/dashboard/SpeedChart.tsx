import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SpeedChartProps {
  data: { time: string; speed: number; optimal: number }[];
}

export function SpeedChart({ data }: SpeedChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-xs text-muted-foreground mb-2 font-mono">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-mono font-semibold text-foreground">
                {entry.value.toFixed(1)} km/h
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(186, 100%, 50%)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(186, 100%, 50%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="optimalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(217, 33%, 20%)"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10, fontFamily: "JetBrains Mono" }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10, fontFamily: "JetBrains Mono" }}
            dx={-10}
            domain={[0, "auto"]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="optimal"
            stroke="hsl(142, 76%, 45%)"
            strokeWidth={1}
            strokeDasharray="4 4"
            fill="url(#optimalGradient)"
            name="Optimal"
          />
          <Area
            type="monotone"
            dataKey="speed"
            stroke="hsl(186, 100%, 50%)"
            strokeWidth={2}
            fill="url(#speedGradient)"
            name="Current"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
