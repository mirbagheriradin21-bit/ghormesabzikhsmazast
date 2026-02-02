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

interface LiveVoltageChartProps {
  data: Array<{
    time: number;
    voltage: number;
    voltage_avg?: number;
    voltage_min?: number;
    voltage_max?: number;
    sag: number;
  }>;
}

export function LiveVoltageChart({ data }: LiveVoltageChartProps) {
  const minVoltage = Math.min(...data.map((d) => d.voltage_min || d.voltage)) - 2;
  const maxVoltage = Math.max(...data.map((d) => d.voltage_max || d.voltage)) + 2;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" />
        <XAxis
          dataKey="time"
          stroke="hsl(var(--muted-foreground))"
          fontSize={10}
          tickLine={false}
          tickFormatter={(value) => `${value % 100}s`}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={10}
          tickLine={false}
          domain={[minVoltage, maxVoltage]}
          tickFormatter={(value) => `${value}V`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(222, 47%, 8%)',
            border: '1px solid hsl(217, 33%, 20%)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          formatter={(value: number, name: string) => [
            `${value.toFixed(2)}V`,
            name === 'voltage' ? 'Current' : name === 'voltage_avg' ? 'Average' : name,
          ]}
        />
        <ReferenceLine
          y={45}
          stroke="hsl(142, 76%, 45%)"
          strokeDasharray="5 5"
          label={{ value: 'Optimal', fill: 'hsl(142, 76%, 45%)', fontSize: 10 }}
        />
        <ReferenceLine
          y={38}
          stroke="hsl(0, 84%, 60%)"
          strokeDasharray="5 5"
          label={{ value: 'Critical', fill: 'hsl(0, 84%, 60%)', fontSize: 10 }}
        />
        <Line
          type="monotone"
          dataKey="voltage"
          name="voltage"
          stroke="hsl(186, 100%, 50%)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="voltage_avg"
          name="voltage_avg"
          stroke="hsl(38, 92%, 50%)"
          strokeWidth={1}
          dot={false}
          opacity={0.6}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface LiveCurrentChartProps {
  data: Array<{
    time: number;
    current: number;
  }>;
}

export function LiveCurrentChart({ data }: LiveCurrentChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" />
        <XAxis
          dataKey="time"
          stroke="hsl(var(--muted-foreground))"
          fontSize={10}
          tickLine={false}
          tickFormatter={(value) => `${value % 100}s`}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={10}
          tickLine={false}
          tickFormatter={(value) => `${value}A`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(222, 47%, 8%)',
            border: '1px solid hsl(217, 33%, 20%)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          formatter={(value: number) => [`${value.toFixed(2)}A`, 'Current']}
        />
        <Line
          type="monotone"
          dataKey="current"
          stroke="hsl(280, 100%, 60%)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface LivePowerChartProps {
  data: Array<{
    time: number;
    power: number;
  }>;
}

export function LivePowerChart({ data }: LivePowerChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" />
        <XAxis
          dataKey="time"
          stroke="hsl(var(--muted-foreground))"
          fontSize={10}
          tickLine={false}
          tickFormatter={(value) => `${value % 100}s`}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={10}
          tickLine={false}
          tickFormatter={(value) => `${value}W`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(222, 47%, 8%)',
            border: '1px solid hsl(217, 33%, 20%)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          formatter={(value: number) => [`${value.toFixed(0)}W`, 'Power']}
        />
        <Line
          type="monotone"
          dataKey="power"
          stroke="hsl(142, 76%, 45%)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface LiveSpeedChartProps {
  data: Array<{
    time: number;
    speed: number;
  }>;
}

export function LiveSpeedChart({ data }: LiveSpeedChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" />
        <XAxis
          dataKey="time"
          stroke="hsl(var(--muted-foreground))"
          fontSize={10}
          tickLine={false}
          tickFormatter={(value) => `${value % 100}s`}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={10}
          tickLine={false}
          tickFormatter={(value) => `${value}km/h`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(222, 47%, 8%)',
            border: '1px solid hsl(217, 33%, 20%)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          formatter={(value: number) => [`${value.toFixed(1)}km/h`, 'Speed']}
        />
        <Line
          type="monotone"
          dataKey="speed"
          stroke="hsl(186, 100%, 50%)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
