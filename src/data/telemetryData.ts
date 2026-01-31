export interface TelemetryRow {
  id: number;
  time_recv_s: number;
  time_send_ms: number;
  V_car_last: number;
  V_car_avg: number;
  V_car_min: number;
  V_car_max: number;
  V_car_sag: number;
  aiAnalysis?: string;
  status?: "normal" | "warning" | "critical" | "optimal";
}

// Raw telemetry data from vehicle
export const rawTelemetryData: TelemetryRow[] = [
  { id: 1, time_recv_s: 1, time_send_ms: 1309154, V_car_last: 46.37, V_car_avg: 46.31, V_car_min: 46.25, V_car_max: 46.37, V_car_sag: 0.12 },
  { id: 2, time_recv_s: 2, time_send_ms: 1310154, V_car_last: 46.44, V_car_avg: 46.33, V_car_min: 46.23, V_car_max: 46.44, V_car_sag: 0.21 },
  { id: 3, time_recv_s: 3, time_send_ms: 1311154, V_car_last: 46.53, V_car_avg: 46.45, V_car_min: 46.37, V_car_max: 46.53, V_car_sag: 0.16 },
  { id: 4, time_recv_s: 4, time_send_ms: 1312154, V_car_last: 46.28, V_car_avg: 46.39, V_car_min: 46.28, V_car_max: 46.51, V_car_sag: 0.23 },
  { id: 5, time_recv_s: 5, time_send_ms: 1313154, V_car_last: 46.55, V_car_avg: 46.55, V_car_min: 46.55, V_car_max: 46.55, V_car_sag: 0 },
  { id: 6, time_recv_s: 6, time_send_ms: 1314154, V_car_last: 46.23, V_car_avg: 46.21, V_car_min: 46.18, V_car_max: 46.23, V_car_sag: 0.05 },
  { id: 7, time_recv_s: 7, time_send_ms: 1315154, V_car_last: 46.32, V_car_avg: 46.33, V_car_min: 46.32, V_car_max: 46.35, V_car_sag: 0.02 },
  { id: 8, time_recv_s: 8, time_send_ms: 1316154, V_car_last: 46.18, V_car_avg: 46.26, V_car_min: 46.18, V_car_max: 46.35, V_car_sag: 0.16 },
  { id: 9, time_recv_s: 9, time_send_ms: 1317154, V_car_last: 46.23, V_car_avg: 46.25, V_car_min: 46.23, V_car_max: 46.28, V_car_sag: 0.05 },
  { id: 10, time_recv_s: 10, time_send_ms: 1318154, V_car_last: 46.05, V_car_avg: 46.06, V_car_min: 46.05, V_car_max: 46.07, V_car_sag: 0.02 },
  { id: 11, time_recv_s: 11, time_send_ms: 1319154, V_car_last: 45.7, V_car_avg: 46.2, V_car_min: 45.7, V_car_max: 46.69, V_car_sag: 0.99 },
  { id: 12, time_recv_s: 12, time_send_ms: 1320154, V_car_last: 46.09, V_car_avg: 46.03, V_car_min: 45.98, V_car_max: 46.09, V_car_sag: 0.12 },
  { id: 13, time_recv_s: 13, time_send_ms: 1321154, V_car_last: 45.7, V_car_avg: 45.08, V_car_min: 44.46, V_car_max: 45.7, V_car_sag: 1.24 },
  { id: 14, time_recv_s: 14, time_send_ms: 1322154, V_car_last: 45.75, V_car_avg: 45.91, V_car_min: 45.75, V_car_max: 46.07, V_car_sag: 0.32 },
  { id: 15, time_recv_s: 15, time_send_ms: 1323154, V_car_last: 67.83, V_car_avg: 57.05, V_car_min: 46.28, V_car_max: 67.83, V_car_sag: 21.55 },
  { id: 16, time_recv_s: 16, time_send_ms: 1324154, V_car_last: 44.44, V_car_avg: 44.72, V_car_min: 44.44, V_car_max: 45.01, V_car_sag: 0.58 },
  { id: 17, time_recv_s: 17, time_send_ms: 1325154, V_car_last: 45.75, V_car_avg: 45.25, V_car_min: 44.76, V_car_max: 45.75, V_car_sag: 0.99 },
  { id: 18, time_recv_s: 18, time_send_ms: 1326154, V_car_last: 45.91, V_car_avg: 46.17, V_car_min: 45.91, V_car_max: 46.44, V_car_sag: 0.53 },
  { id: 19, time_recv_s: 19, time_send_ms: 1327154, V_car_last: 45.13, V_car_avg: 45.16, V_car_min: 45.13, V_car_max: 45.19, V_car_sag: 0.07 },
  { id: 20, time_recv_s: 20, time_send_ms: 1328154, V_car_last: 41.03, V_car_avg: 41.68, V_car_min: 41.03, V_car_max: 42.32, V_car_sag: 1.29 },
  { id: 21, time_recv_s: 21, time_send_ms: 1329154, V_car_last: 40.27, V_car_avg: 38.23, V_car_min: 36.18, V_car_max: 40.27, V_car_sag: 4.09 },
  { id: 22, time_recv_s: 22, time_send_ms: 1330154, V_car_last: 38.32, V_car_avg: 38.28, V_car_min: 38.25, V_car_max: 38.32, V_car_sag: 0.07 },
  { id: 23, time_recv_s: 23, time_send_ms: 1331154, V_car_last: 39.33, V_car_avg: 40.62, V_car_min: 39.33, V_car_max: 41.91, V_car_sag: 2.58 },
  { id: 24, time_recv_s: 24, time_send_ms: 1332154, V_car_last: 41.47, V_car_avg: 41, V_car_min: 40.53, V_car_max: 41.47, V_car_sag: 0.94 },
  { id: 25, time_recv_s: 25, time_send_ms: 1333154, V_car_last: 41.68, V_car_avg: 41.96, V_car_min: 41.68, V_car_max: 42.25, V_car_sag: 0.57 },
  { id: 26, time_recv_s: 26, time_send_ms: 1334154, V_car_last: 42.85, V_car_avg: 42.83, V_car_min: 42.8, V_car_max: 42.85, V_car_sag: 0.05 },
  { id: 27, time_recv_s: 27, time_send_ms: 1335154, V_car_last: 42.46, V_car_avg: 42.53, V_car_min: 42.46, V_car_max: 42.6, V_car_sag: 0.14 },
  { id: 28, time_recv_s: 28, time_send_ms: 1336154, V_car_last: 44.53, V_car_avg: 44.36, V_car_min: 44.18, V_car_max: 44.53, V_car_sag: 0.35 },
  { id: 29, time_recv_s: 29, time_send_ms: 1337154, V_car_last: 43.77, V_car_avg: 44.24, V_car_min: 43.77, V_car_max: 44.71, V_car_sag: 0.94 },
  { id: 30, time_recv_s: 30, time_send_ms: 1338154, V_car_last: 46.67, V_car_avg: 46.17, V_car_min: 45.68, V_car_max: 46.67, V_car_sag: 0.99 },
  { id: 31, time_recv_s: 31, time_send_ms: 1339154, V_car_last: 46.76, V_car_avg: 46.09, V_car_min: 45.42, V_car_max: 46.76, V_car_sag: 1.33 },
  { id: 32, time_recv_s: 32, time_send_ms: 1340154, V_car_last: 40.27, V_car_avg: 40.01, V_car_min: 39.74, V_car_max: 40.27, V_car_sag: 0.53 },
  { id: 33, time_recv_s: 33, time_send_ms: 1341154, V_car_last: 41.22, V_car_avg: 41.22, V_car_min: 41.22, V_car_max: 41.22, V_car_sag: 0 },
  { id: 34, time_recv_s: 34, time_send_ms: 1342154, V_car_last: 40.6, V_car_avg: 40.8, V_car_min: 40.6, V_car_max: 41.01, V_car_sag: 0.41 },
  { id: 35, time_recv_s: 35, time_send_ms: 1343154, V_car_last: 41.28, V_car_avg: 41.26, V_car_min: 41.24, V_car_max: 41.28, V_car_sag: 0.05 },
  { id: 36, time_recv_s: 36, time_send_ms: 1344154, V_car_last: 41.03, V_car_avg: 41.51, V_car_min: 41.03, V_car_max: 42, V_car_sag: 0.97 },
  { id: 37, time_recv_s: 37, time_send_ms: 1345154, V_car_last: 41.7, V_car_avg: 41.66, V_car_min: 41.63, V_car_max: 41.7, V_car_sag: 0.07 },
  { id: 38, time_recv_s: 38, time_send_ms: 1346154, V_car_last: 41.1, V_car_avg: 41.39, V_car_min: 41.1, V_car_max: 41.68, V_car_sag: 0.58 },
  { id: 39, time_recv_s: 39, time_send_ms: 1347154, V_car_last: 41.17, V_car_avg: 41.78, V_car_min: 41.17, V_car_max: 42.39, V_car_sag: 1.22 },
  { id: 40, time_recv_s: 40, time_send_ms: 1348154, V_car_last: 41.17, V_car_avg: 41.06, V_car_min: 40.94, V_car_max: 41.17, V_car_sag: 0.23 },
  { id: 41, time_recv_s: 41, time_send_ms: 1349154, V_car_last: 42.18, V_car_avg: 41.93, V_car_min: 41.68, V_car_max: 42.18, V_car_sag: 0.51 },
  { id: 42, time_recv_s: 42, time_send_ms: 1350154, V_car_last: 42.39, V_car_avg: 42.04, V_car_min: 41.7, V_car_max: 42.39, V_car_sag: 0.69 },
  { id: 43, time_recv_s: 43, time_send_ms: 1351154, V_car_last: 41.51, V_car_avg: 41.7, V_car_min: 41.51, V_car_max: 41.88, V_car_sag: 0.37 },
  { id: 44, time_recv_s: 44, time_send_ms: 1352154, V_car_last: 42, V_car_avg: 42.29, V_car_min: 42, V_car_max: 42.57, V_car_sag: 0.57 },
  { id: 45, time_recv_s: 45, time_send_ms: 1353154, V_car_last: 46.83, V_car_avg: 46.79, V_car_min: 46.76, V_car_max: 46.83, V_car_sag: 0.07 },
  { id: 46, time_recv_s: 46, time_send_ms: 1354154, V_car_last: 46.37, V_car_avg: 46.9, V_car_min: 46.37, V_car_max: 47.43, V_car_sag: 1.06 },
  { id: 47, time_recv_s: 47, time_send_ms: 1355154, V_car_last: 41.98, V_car_avg: 44.55, V_car_min: 41.98, V_car_max: 47.13, V_car_sag: 5.15 },
  { id: 48, time_recv_s: 48, time_send_ms: 1356154, V_car_last: 35.6, V_car_avg: 36.63, V_car_min: 35.6, V_car_max: 37.65, V_car_sag: 2.05 },
  { id: 49, time_recv_s: 49, time_send_ms: 1357154, V_car_last: 37.05, V_car_avg: 37.67, V_car_min: 37.05, V_car_max: 38.29, V_car_sag: 1.24 },
  { id: 50, time_recv_s: 50, time_send_ms: 1358154, V_car_last: 40.48, V_car_avg: 39.96, V_car_min: 39.44, V_car_max: 40.48, V_car_sag: 1.03 },
  { id: 51, time_recv_s: 51, time_send_ms: 1359154, V_car_last: 41.08, V_car_avg: 40.55, V_car_min: 40.02, V_car_max: 41.08, V_car_sag: 1.06 },
  { id: 52, time_recv_s: 52, time_send_ms: 1360154, V_car_last: 40.16, V_car_avg: 40.12, V_car_min: 40.09, V_car_max: 40.16, V_car_sag: 0.07 },
  { id: 53, time_recv_s: 53, time_send_ms: 1361154, V_car_last: 41.49, V_car_avg: 41.32, V_car_min: 41.15, V_car_max: 41.49, V_car_sag: 0.35 },
  { id: 54, time_recv_s: 54, time_send_ms: 1362154, V_car_last: 41.03, V_car_avg: 40.96, V_car_min: 40.89, V_car_max: 41.03, V_car_sag: 0.14 },
  { id: 55, time_recv_s: 55, time_send_ms: 1363154, V_car_last: 41.95, V_car_avg: 41.68, V_car_min: 41.4, V_car_max: 41.95, V_car_sag: 0.55 },
  { id: 56, time_recv_s: 56, time_send_ms: 1364154, V_car_last: 41.81, V_car_avg: 41.35, V_car_min: 40.89, V_car_max: 41.81, V_car_sag: 0.92 },
  { id: 57, time_recv_s: 57, time_send_ms: 1365154, V_car_last: 42.07, V_car_avg: 41.66, V_car_min: 41.26, V_car_max: 42.07, V_car_sag: 0.81 },
  { id: 58, time_recv_s: 58, time_send_ms: 1366154, V_car_last: 40.34, V_car_avg: 40.99, V_car_min: 40.34, V_car_max: 41.63, V_car_sag: 1.29 },
  { id: 59, time_recv_s: 59, time_send_ms: 1367154, V_car_last: 41.22, V_car_avg: 41.46, V_car_min: 41.22, V_car_max: 41.7, V_car_sag: 0.48 },
  { id: 60, time_recv_s: 60, time_send_ms: 1368154, V_car_last: 41.75, V_car_avg: 41.78, V_car_min: 41.75, V_car_max: 41.81, V_car_sag: 0.07 },
];

// AI Analysis function - analyzes each row and provides insights
export function analyzeDataRow(row: TelemetryRow): { analysis: string; status: "normal" | "warning" | "critical" | "optimal" } {
  const { V_car_last, V_car_avg, V_car_sag, V_car_min, V_car_max } = row;
  
  // Critical: Very high voltage spike or sag
  if (V_car_sag > 5) {
    return {
      analysis: `⚠️ CRITICAL: Extreme voltage sag detected (${V_car_sag.toFixed(2)}V). Possible power surge or battery instability. Immediate investigation required. Range: ${V_car_min.toFixed(2)}V - ${V_car_max.toFixed(2)}V`,
      status: "critical"
    };
  }
  
  // Critical: Anomalous voltage reading
  if (V_car_last > 60 || V_car_max > 60) {
    return {
      analysis: `🚨 ANOMALY: Voltage spike to ${V_car_max.toFixed(2)}V detected. This exceeds normal operating range. Check for sensor malfunction or regenerative braking surge.`,
      status: "critical"
    };
  }
  
  // Warning: Significant voltage drop
  if (V_car_sag > 2) {
    return {
      analysis: `⚡ WARNING: High voltage variation (${V_car_sag.toFixed(2)}V sag). Battery under heavy load. Consider reducing power draw. Current: ${V_car_last.toFixed(2)}V`,
      status: "warning"
    };
  }
  
  // Warning: Low voltage
  if (V_car_avg < 40) {
    return {
      analysis: `🔋 LOW VOLTAGE: Average ${V_car_avg.toFixed(2)}V is below optimal threshold. Battery depletion detected. Consider pit stop or reduced power mode.`,
      status: "warning"
    };
  }
  
  // Warning: Moderate sag
  if (V_car_sag > 1) {
    return {
      analysis: `📊 MODERATE SAG: ${V_car_sag.toFixed(2)}V variation detected. Battery responding to power demands. Voltage range: ${V_car_min.toFixed(2)}V - ${V_car_max.toFixed(2)}V`,
      status: "warning"
    };
  }
  
  // Optimal: Perfect stability
  if (V_car_sag === 0) {
    return {
      analysis: `✅ PERFECT: Zero voltage sag. Battery in ideal state. Steady output at ${V_car_last.toFixed(2)}V. Maximum efficiency achieved.`,
      status: "optimal"
    };
  }
  
  // Optimal: Very stable
  if (V_car_sag < 0.2 && V_car_avg > 44) {
    return {
      analysis: `✅ OPTIMAL: Excellent voltage stability (${V_car_sag.toFixed(2)}V sag). Battery performing efficiently at ${V_car_avg.toFixed(2)}V average.`,
      status: "optimal"
    };
  }
  
  // Normal: Good performance
  if (V_car_avg > 42) {
    return {
      analysis: `📈 NORMAL: Voltage at ${V_car_last.toFixed(2)}V with ${V_car_sag.toFixed(2)}V sag. Battery responding normally to power demands.`,
      status: "normal"
    };
  }
  
  // Normal: Acceptable
  return {
    analysis: `📊 STABLE: Current ${V_car_last.toFixed(2)}V, Avg ${V_car_avg.toFixed(2)}V, Sag ${V_car_sag.toFixed(2)}V. Battery operating within acceptable parameters.`,
    status: "normal"
  };
}

// Get analyzed data
export function getAnalyzedTelemetryData(): TelemetryRow[] {
  return rawTelemetryData.map(row => {
    const { analysis, status } = analyzeDataRow(row);
    return {
      ...row,
      aiAnalysis: analysis,
      status
    };
  });
}

// Summary statistics
export function getTelemetrySummary() {
  const data = rawTelemetryData;
  const voltages = data.map(d => d.V_car_avg);
  const sags = data.map(d => d.V_car_sag);
  
  return {
    avgVoltage: voltages.reduce((a, b) => a + b, 0) / voltages.length,
    minVoltage: Math.min(...data.map(d => d.V_car_min)),
    maxVoltage: Math.max(...data.map(d => d.V_car_max)),
    avgSag: sags.reduce((a, b) => a + b, 0) / sags.length,
    maxSag: Math.max(...sags),
    criticalEvents: data.filter(d => d.V_car_sag > 5 || d.V_car_max > 60).length,
    warningEvents: data.filter(d => d.V_car_sag > 1 && d.V_car_sag <= 5).length,
    totalReadings: data.length,
    duration: data.length, // seconds
  };
}
