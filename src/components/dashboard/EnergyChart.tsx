import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface EnergyChartProps {
  data: { time: string; voltage: number; power: number }[];
}

export function EnergyChart({ data }: EnergyChartProps) {
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
                {entry.value.toFixed(1)} {entry.name === "Voltage" ? "V" : "W"}
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
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
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
            yAxisId="voltage"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10, fontFamily: "JetBrains Mono" }}
            dx={-10}
            domain={[10, 15]}
          />
          <YAxis
            yAxisId="power"
            orientation="right"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10, fontFamily: "JetBrains Mono" }}
            dx={10}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            yAxisId="voltage"
            y={12}
            stroke="hsl(38, 92%, 50%)"
            strokeDasharray="4 4"
            strokeOpacity={0.5}
          />
          <Line
            yAxisId="voltage"
            type="monotone"
            dataKey="voltage"
            stroke="hsl(38, 92%, 50%)"
            strokeWidth={2}
            dot={false}
            name="Voltage"
          />
          <Line
            yAxisId="power"
            type="monotone"
            dataKey="power"
            stroke="hsl(280, 100%, 65%)"
            strokeWidth={2}
            dot={false}
            name="Power"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
