// Primary Telemetry Dataset - Triggered by white "Connect" button
// Column names exactly as specified - V_car_sag REMOVED

export interface PrimaryTelemetryRow {
  time_recv_s: number;
  time_send_ms: number;
  V_car_last: number;
  V_car_avg: number;
  V_car_min: number;
  V_car_max: number;
  V_esp32_last: number;
  RAW: number;
  I_last: number;
  I_avg: number;
  I_min: number;
  I_max: number;
  I_raw: number;
  ax_last: number;
  ay_last: number;
  az_last: number;
  a_tot_last: number;
  ax_avg: number;
  rssi_dbm: number;
  snr_db: number;
  // Computed fields
  power_w?: number;
  aiAnalysis?: string;
  status?: "normal" | "warning" | "critical" | "optimal";
}

// Primary telemetry data - exact values from specification
export const primaryTelemetryData: PrimaryTelemetryRow[] = [
  { time_recv_s: 0, time_send_ms: 442148, V_car_last: 42.73, V_car_avg: 42.84, V_car_min: 42.73, V_car_max: 42.94, V_esp32_last: 1.858, RAW: 2314, I_last: 55.57, I_avg: 54.46, I_min: 53.35, I_max: 55.57, I_raw: 2559, ax_last: -0.067, ay_last: 0.840, az_last: 0.026, a_tot_last: 0.843, ax_avg: -0.04, rssi_dbm: -74.00, snr_db: 12.25 },
  { time_recv_s: 1, time_send_ms: 443148, V_car_last: 44.18, V_car_avg: 44.22, V_car_min: 44.18, V_car_max: 44.25, V_esp32_last: 1.921, RAW: 2384, I_last: 57.94, I_avg: 57.10, I_min: 56.25, I_max: 57.94, I_raw: 2595, ax_last: -0.172, ay_last: 0.916, az_last: 0.055, a_tot_last: 0.933, ax_avg: -0.25, rssi_dbm: -85.00, snr_db: 12.00 },
  { time_recv_s: 2, time_send_ms: 444148, V_car_last: 44.37, V_car_avg: 44.02, V_car_min: 43.68, V_car_max: 44.37, V_esp32_last: 1.929, RAW: 2391, I_last: 53.35, I_avg: 45.97, I_min: 38.60, I_max: 53.35, I_raw: 2543, ax_last: 0.053, ay_last: 0.824, az_last: 0.294, a_tot_last: 0.877, ax_avg: 0.007, rssi_dbm: -79.00, snr_db: 12.50 },
  { time_recv_s: 3, time_send_ms: 445148, V_car_last: 43.70, V_car_avg: 43.80, V_car_min: 43.70, V_car_max: 43.91, V_esp32_last: 1.900, RAW: 2366, I_last: 39.13, I_avg: 37.07, I_min: 35.00, I_max: 39.13, I_raw: 2338, ax_last: 0.062, ay_last: 1.028, az_last: 0.052, a_tot_last: 1.031, ax_avg: -0.028, rssi_dbm: -83.00, snr_db: 12.25 },
  { time_recv_s: 4, time_send_ms: 446148, V_car_last: 44.09, V_car_avg: 44.15, V_car_min: 44.09, V_car_max: 44.21, V_esp32_last: 1.917, RAW: 2382, I_last: 33.70, I_avg: 30.68, I_min: 27.66, I_max: 33.70, I_raw: 2240, ax_last: -0.173, ay_last: 0.891, az_last: 0.155, a_tot_last: 0.921, ax_avg: -0.17, rssi_dbm: -76.00, snr_db: 13.00 },
  { time_recv_s: 5, time_send_ms: 447148, V_car_last: 43.88, V_car_avg: 44.04, V_car_min: 43.88, V_car_max: 44.21, V_esp32_last: 1.908, RAW: 2401, I_last: 41.73, I_avg: 34.93, I_min: 28.12, I_max: 41.73, I_raw: 2362, ax_last: 0.055, ay_last: 0.541, az_last: 0.490, a_tot_last: 0.732, ax_avg: -0.051, rssi_dbm: -84.00, snr_db: 12.25 },
  { time_recv_s: 9, time_send_ms: 451148, V_car_last: 44.37, V_car_avg: 44.33, V_car_min: 44.30, V_car_max: 44.37, V_esp32_last: 1.929, RAW: 2385, I_last: 45.78, I_avg: 46.97, I_min: 45.78, I_max: 48.15, I_raw: 2457, ax_last: -0.311, ay_last: 0.699, az_last: 0.518, a_tot_last: 0.924, ax_avg: -0.22, rssi_dbm: -90.00, snr_db: 12.00 },
  { time_recv_s: 10, time_send_ms: 452148, V_car_last: 44.11, V_car_avg: 43.85, V_car_min: 43.58, V_car_max: 44.11, V_esp32_last: 1.918, RAW: 2391, I_last: 30.80, I_avg: 36.65, I_min: 30.80, I_max: 42.49, I_raw: 2254, ax_last: -0.035, ay_last: 1.009, az_last: 0.691, a_tot_last: 1.224, ax_avg: -0.03, rssi_dbm: -97.00, snr_db: 8.75 },
  { time_recv_s: 11, time_send_ms: 453148, V_car_last: 44.04, V_car_avg: 43.81, V_car_min: 43.58, V_car_max: 44.04, V_esp32_last: 1.915, RAW: 2384, I_last: 29.96, I_avg: 34.28, I_min: 29.96, I_max: 38.60, I_raw: 2180, ax_last: -0.199, ay_last: 0.578, az_last: 0.472, a_tot_last: 0.773, ax_avg: -0.14, rssi_dbm: -92.00, snr_db: 12.00 },
  { time_recv_s: 13, time_send_ms: 455148, V_car_last: 43.56, V_car_avg: 43.63, V_car_min: 43.56, V_car_max: 43.70, V_esp32_last: 1.894, RAW: 2356, I_last: 39.74, I_avg: 39.82, I_min: 39.74, I_max: 39.90, I_raw: 2339, ax_last: -0.120, ay_last: 0.752, az_last: 0.388, a_tot_last: 0.854, ax_avg: -0.21, rssi_dbm: -92.00, snr_db: 11.75 },
  { time_recv_s: 14, time_send_ms: 456148, V_car_last: 43.91, V_car_avg: 43.85, V_car_min: 43.79, V_car_max: 43.91, V_esp32_last: 1.909, RAW: 2371, I_last: 31.49, I_avg: 35.46, I_min: 31.49, I_max: 39.44, I_raw: 2195, ax_last: -0.242, ay_last: 1.187, az_last: 0.275, a_tot_last: 1.242, ax_avg: -0.16, rssi_dbm: -85.00, snr_db: 11.75 },
  { time_recv_s: 15, time_send_ms: 457148, V_car_last: 44.11, V_car_avg: 43.99, V_car_min: 43.86, V_car_max: 44.11, V_esp32_last: 1.918, RAW: 2384, I_last: 30.19, I_avg: 33.59, I_min: 30.19, I_max: 36.99, I_raw: 2170, ax_last: 0.236, ay_last: 0.037, az_last: 0.542, a_tot_last: 0.592, ax_avg: 0.110, rssi_dbm: -79.00, snr_db: 12.25 },
  { time_recv_s: 16, time_send_ms: 458148, V_car_last: 43.79, V_car_avg: 44.04, V_car_min: 43.79, V_car_max: 44.30, V_esp32_last: 1.904, RAW: 2367, I_last: 38.60, I_avg: 43.45, I_min: 38.60, I_max: 48.30, I_raw: 2275, ax_last: -0.191, ay_last: 0.833, az_last: 0.060, a_tot_last: 0.857, ax_avg: -0.15, rssi_dbm: -85.00, snr_db: 12.00 },
  { time_recv_s: 17, time_send_ms: 459148, V_car_last: 44.30, V_car_avg: 44.10, V_car_min: 43.91, V_car_max: 44.30, V_esp32_last: 1.926, RAW: 2403, I_last: 44.41, I_avg: 40.51, I_min: 36.61, I_max: 44.41, I_raw: 2411, ax_last: -0.001, ay_last: 0.958, az_last: 0.182, a_tot_last: 0.975, ax_avg: -0.03, rssi_dbm: -76.00, snr_db: 12.00 },
  { time_recv_s: 18, time_send_ms: 460148, V_car_last: 44.27, V_car_avg: 44.23, V_car_min: 44.18, V_car_max: 44.27, V_esp32_last: 1.925, RAW: 2396, I_last: 24.84, I_avg: 25.79, I_min: 24.84, I_max: 26.75, I_raw: 2083, ax_last: -0.062, ay_last: 0.854, az_last: 0.010, a_tot_last: 0.857, ax_avg: -0.03, rssi_dbm: -81.00, snr_db: 12.75 },
  { time_recv_s: 19, time_send_ms: 461148, V_car_last: 44.57, V_car_avg: 44.29, V_car_min: 44.00, V_car_max: 44.57, V_esp32_last: 1.938, RAW: 2447, I_last: 41.04, I_avg: 36.72, I_min: 32.40, I_max: 41.04, I_raw: 2390, ax_last: 0.083, ay_last: 1.095, az_last: 0.142, a_tot_last: 1.107, ax_avg: -0.002, rssi_dbm: -77.00, snr_db: 12.25 },
  { time_recv_s: 20, time_send_ms: 462148, V_car_last: 44.21, V_car_avg: 44.15, V_car_min: 44.09, V_car_max: 44.21, V_esp32_last: 1.922, RAW: 2394, I_last: 29.57, I_avg: 30.68, I_min: 29.57, I_max: 31.79, I_raw: 2128, ax_last: -0.331, ay_last: 1.992, az_last: 0.382, a_tot_last: 2.055, ax_avg: -0.20, rssi_dbm: -91.00, snr_db: 12.25 },
  { time_recv_s: 21, time_send_ms: 463148, V_car_last: 44.23, V_car_avg: 44.16, V_car_min: 44.09, V_car_max: 44.23, V_esp32_last: 1.923, RAW: 2387, I_last: 32.48, I_avg: 32.59, I_min: 32.48, I_max: 32.71, I_raw: 2173, ax_last: -0.002, ay_last: 0.602, az_last: 0.167, a_tot_last: 0.625, ax_avg: -0.05, rssi_dbm: -87.00, snr_db: 12.25 },
  { time_recv_s: 23, time_send_ms: 465148, V_car_last: 44.60, V_car_avg: 44.63, V_car_min: 44.60, V_car_max: 44.67, V_esp32_last: 1.939, RAW: 2416, I_last: 29.88, I_avg: 29.65, I_min: 29.42, I_max: 29.88, I_raw: 2302, ax_last: -0.003, ay_last: 0.739, az_last: 0.372, a_tot_last: 0.827, ax_avg: 0.006, rssi_dbm: -84.00, snr_db: 11.75 },
  { time_recv_s: 24, time_send_ms: 466148, V_car_last: 47.43, V_car_avg: 48.24, V_car_min: 47.43, V_car_max: 49.06, V_esp32_last: 2.062, RAW: 2583, I_last: -25.16, I_avg: -21.38, I_min: -25.16, I_max: -17.59, I_raw: 1328, ax_last: -0.171, ay_last: 1.274, az_last: 0.418, a_tot_last: 1.352, ax_avg: 0, rssi_dbm: -83.00, snr_db: 12.00 },
  { time_recv_s: 27, time_send_ms: 469148, V_car_last: 44.07, V_car_avg: 43.96, V_car_min: 43.86, V_car_max: 44.07, V_esp32_last: 1.916, RAW: 2373, I_last: 62.22, I_avg: 48.92, I_min: 35.61, I_max: 62.22, I_raw: 2554, ax_last: -0.223, ay_last: 0.998, az_last: 0.212, a_tot_last: 1.045, ax_avg: -0.27, rssi_dbm: -95.00, snr_db: 11.00 },
  { time_recv_s: 28, time_send_ms: 470148, V_car_last: 44.11, V_car_avg: 44.06, V_car_min: 44.00, V_car_max: 44.11, V_esp32_last: 1.918, RAW: 2366, I_last: 40.28, I_avg: 46.81, I_min: 40.28, I_max: 53.35, I_raw: 2494, ax_last: -0.093, ay_last: 0.743, az_last: 0.245, a_tot_last: 0.788, ax_avg: -0.13, rssi_dbm: -84.00, snr_db: 12.25 },
  { time_recv_s: 30, time_send_ms: 472148, V_car_last: 43.33, V_car_avg: 43.34, V_car_min: 43.33, V_car_max: 43.35, V_esp32_last: 1.884, RAW: 2346, I_last: 44.48, I_avg: 46.85, I_min: 44.48, I_max: 49.22, I_raw: 2422, ax_last: -0.299, ay_last: 0.899, az_last: 0.367, a_tot_last: 1.016, ax_avg: -0.16, rssi_dbm: -84.00, snr_db: 12.00 },
  { time_recv_s: 32, time_send_ms: 474148, V_car_last: 43.72, V_car_avg: 43.68, V_car_min: 43.63, V_car_max: 43.72, V_esp32_last: 1.901, RAW: 2361, I_last: 30.87, I_avg: 32.79, I_min: 30.87, I_max: 34.70, I_raw: 2192, ax_last: -0.319, ay_last: 1.255, az_last: 0.452, a_tot_last: 1.371, ax_avg: -0.21, rssi_dbm: -89.00, snr_db: 11.50 },
  { time_recv_s: 33, time_send_ms: 475148, V_car_last: 43.75, V_car_avg: 43.96, V_car_min: 43.75, V_car_max: 44.18, V_esp32_last: 1.902, RAW: 2344, I_last: 48.07, I_avg: 50.22, I_min: 48.07, I_max: 52.36, I_raw: 2434, ax_last: -0.033, ay_last: 0.694, az_last: 0.447, a_tot_last: 0.826, ax_avg: -0.02, rssi_dbm: -84.00, snr_db: 11.75 },
  { time_recv_s: 34, time_send_ms: 476148, V_car_last: 44.21, V_car_avg: 43.94, V_car_min: 43.68, V_car_max: 44.21, V_esp32_last: 1.922, RAW: 2383, I_last: 48.30, I_avg: 45.86, I_min: 43.41, I_max: 48.30, I_raw: 2549, ax_last: -0.186, ay_last: 0.898, az_last: 0.226, a_tot_last: 0.944, ax_avg: -0.13, rssi_dbm: -78.00, snr_db: 12.25 },
  { time_recv_s: 35, time_send_ms: 477148, V_car_last: 43.58, V_car_avg: 43.88, V_car_min: 43.58, V_car_max: 44.18, V_esp32_last: 1.895, RAW: 2357, I_last: 39.13, I_avg: 34.58, I_min: 30.03, I_max: 39.13, I_raw: 2303, ax_last: 0.002, ay_last: 1.096, az_last: -0.022, a_tot_last: 1.096, ax_avg: -0.00, rssi_dbm: -91.00, snr_db: 10.75 },
  { time_recv_s: 36, time_send_ms: 478148, V_car_last: 44.07, V_car_avg: 44.13, V_car_min: 44.07, V_car_max: 44.18, V_esp32_last: 1.916, RAW: 2383, I_last: 27.59, I_avg: 28.24, I_min: 27.59, I_max: 28.89, I_raw: 2138, ax_last: -0.031, ay_last: 1.203, az_last: 0.105, a_tot_last: 1.208, ax_avg: 0.013, rssi_dbm: -64.00, snr_db: 12.75 },
  { time_recv_s: 37, time_send_ms: 479148, V_car_last: 43.93, V_car_avg: 43.92, V_car_min: 43.91, V_car_max: 43.93, V_esp32_last: 1.910, RAW: 2379, I_last: 34.70, I_avg: 34.77, I_min: 34.70, I_max: 34.85, I_raw: 2228, ax_last: -0.181, ay_last: 1.610, az_last: 0.154, a_tot_last: 1.627, ax_avg: -0.12, rssi_dbm: -48.00, snr_db: 12.75 },
  { time_recv_s: 38, time_send_ms: 480148, V_car_last: 44.37, V_car_avg: 44.46, V_car_min: 44.37, V_car_max: 44.55, V_esp32_last: 1.929, RAW: 2394, I_last: 27.43, I_avg: 34.31, I_min: 27.43, I_max: 41.19, I_raw: 2192, ax_last: -0.045, ay_last: 1.045, az_last: -0.012, a_tot_last: 1.046, ax_avg: -0.0, rssi_dbm: -63.00, snr_db: 13.50 },
  { time_recv_s: 39, time_send_ms: 481148, V_car_last: 43.86, V_car_avg: 44.13, V_car_min: 43.86, V_car_max: 44.39, V_esp32_last: 1.907, RAW: 2369, I_last: 34.70, I_avg: 38.63, I_min: 34.70, I_max: 42.57, I_raw: 2238, ax_last: 0.044, ay_last: 1.279, az_last: -0.067, a_tot_last: 1.281, ax_avg: -0.04, rssi_dbm: -68.00, snr_db: 12.25 },
  { time_recv_s: 40, time_send_ms: 482148, V_car_last: 44.44, V_car_avg: 44.29, V_car_min: 44.14, V_car_max: 44.44, V_esp32_last: 1.932, RAW: 2399, I_last: 24.45, I_avg: 27.93, I_min: 24.45, I_max: 31.41, I_raw: 2095, ax_last: -0.084, ay_last: 0.661, az_last: 0.140, a_tot_last: 0.681, ax_avg: -0.14, rssi_dbm: -75.00, snr_db: 12.75 },
  { time_recv_s: 41, time_send_ms: 483148, V_car_last: 44.53, V_car_avg: 44.59, V_car_min: 44.53, V_car_max: 44.64, V_esp32_last: 1.936, RAW: 2407, I_last: 30.65, I_avg: 34.70, I_min: 30.65, I_max: 38.75, I_raw: 2282, ax_last: -0.027, ay_last: 0.786, az_last: 0.347, a_tot_last: 0.859, ax_avg: -0.05, rssi_dbm: -72.00, snr_db: 12.50 },
  { time_recv_s: 42, time_send_ms: 484148, V_car_last: 44.57, V_car_avg: 44.47, V_car_min: 44.37, V_car_max: 44.57, V_esp32_last: 1.938, RAW: 2417, I_last: 26.13, I_avg: 25.79, I_min: 25.45, I_max: 26.13, I_raw: 2183, ax_last: -0.039, ay_last: 0.548, az_last: 0.486, a_tot_last: 0.733, ax_avg: -0.07, rssi_dbm: -80.00, snr_db: 12.50 },
  { time_recv_s: 43, time_send_ms: 485148, V_car_last: 44.41, V_car_avg: 44.15, V_car_min: 43.88, V_car_max: 44.41, V_esp32_last: 1.931, RAW: 2397, I_last: 28.12, I_avg: 32.86, I_min: 28.12, I_max: 37.60, I_raw: 2224, ax_last: -0.168, ay_last: 0.508, az_last: 0.572, a_tot_last: 0.783, ax_avg: -0.30, rssi_dbm: -96.00, snr_db: 10.50 },
  { time_recv_s: 44, time_send_ms: 486148, V_car_last: 43.79, V_car_avg: 43.83, V_car_min: 43.79, V_car_max: 43.86, V_esp32_last: 1.904, RAW: 2363, I_last: 36.38, I_avg: 36.57, I_min: 36.38, I_max: 36.76, I_raw: 2266, ax_last: -0.038, ay_last: 0.229, az_last: 0.595, a_tot_last: 0.639, ax_avg: -0.13, rssi_dbm: -93.00, snr_db: 10.75 },
  { time_recv_s: 45, time_send_ms: 487148, V_car_last: 44.11, V_car_avg: 43.99, V_car_min: 43.86, V_car_max: 44.11, V_esp32_last: 1.918, RAW: 2379, I_last: 29.04, I_avg: 30.87, I_min: 29.04, I_max: 32.71, I_raw: 2247, ax_last: -0.028, ay_last: 1.217, az_last: 0.663, a_tot_last: 1.386, ax_avg: -0.12, rssi_dbm: -89.00, snr_db: 11.75 },
  { time_recv_s: 46, time_send_ms: 488148, V_car_last: 43.49, V_car_avg: 43.55, V_car_min: 43.49, V_car_max: 43.61, V_esp32_last: 1.891, RAW: 2351, I_last: 41.35, I_avg: 39.86, I_min: 38.37, I_max: 41.35, I_raw: 2332, ax_last: -0.332, ay_last: 1.245, az_last: 0.606, a_tot_last: 1.424, ax_avg: -0.15, rssi_dbm: -88.00, snr_db: 11.50 },
  { time_recv_s: 47, time_send_ms: 489148, V_car_last: 44.07, V_car_avg: 43.99, V_car_min: 43.91, V_car_max: 44.07, V_esp32_last: 1.916, RAW: 2382, I_last: 31.72, I_avg: 31.07, I_min: 30.42, I_max: 31.72, I_raw: 2320, ax_last: -0.070, ay_last: 0.925, az_last: 0.427, a_tot_last: 1.021, ax_avg: -0.14, rssi_dbm: -95.00, snr_db: 11.00 },
  { time_recv_s: 50, time_send_ms: 492148, V_car_last: 43.70, V_car_avg: 43.77, V_car_min: 43.70, V_car_max: 43.84, V_esp32_last: 1.900, RAW: 2339, I_last: 44.94, I_avg: 43.76, I_min: 42.57, I_max: 44.94, I_raw: 2362, ax_last: -0.126, ay_last: 0.909, az_last: 0.402, a_tot_last: 1.002, ax_avg: -0.15, rssi_dbm: -88.00, snr_db: 11.75 },
  { time_recv_s: 51, time_send_ms: 493148, V_car_last: 43.61, V_car_avg: 43.60, V_car_min: 43.58, V_car_max: 43.61, V_esp32_last: 1.896, RAW: 2358, I_last: 38.60, I_avg: 39.25, I_min: 38.60, I_max: 39.90, I_raw: 2278, ax_last: -0.088, ay_last: 0.760, az_last: 0.550, a_tot_last: 0.942, ax_avg: -0.10, rssi_dbm: -94.00, snr_db: 11.50 },
  { time_recv_s: 52, time_send_ms: 494148, V_car_last: 44.18, V_car_avg: 43.55, V_car_min: 42.92, V_car_max: 44.18, V_esp32_last: 1.921, RAW: 2355, I_last: 30.03, I_avg: 35.16, I_min: 30.03, I_max: 40.28, I_raw: 2243, ax_last: -0.184, ay_last: 1.147, az_last: 0.218, a_tot_last: 1.182, ax_avg: -0.14, rssi_dbm: -95.00, snr_db: 11.25 },
  { time_recv_s: 53, time_send_ms: 495148, V_car_last: 43.98, V_car_avg: 44.03, V_car_min: 43.98, V_car_max: 44.09, V_esp32_last: 1.912, RAW: 2373, I_last: 30.87, I_avg: 29.54, I_min: 28.20, I_max: 30.87, I_raw: 2192, ax_last: -0.052, ay_last: 1.090, az_last: 0.203, a_tot_last: 1.110, ax_avg: -0.07, rssi_dbm: -97.00, snr_db: 10.50 },
  { time_recv_s: 54, time_send_ms: 496148, V_car_last: 43.81, V_car_avg: 43.99, V_car_min: 43.81, V_car_max: 44.16, V_esp32_last: 1.905, RAW: 2373, I_last: 34.70, I_avg: 37.45, I_min: 34.70, I_max: 40.20, I_raw: 2218, ax_last: -0.110, ay_last: 0.687, az_last: 0.523, a_tot_last: 0.871, ax_avg: -0.09, rssi_dbm: -102.00, snr_db: 8.00 },
  { time_recv_s: 57, time_send_ms: 499148, V_car_last: 44.48, V_car_avg: 44.48, V_car_min: 44.48, V_car_max: 44.48, V_esp32_last: 1.934, RAW: 2407, I_last: 30.65, I_avg: 33.21, I_min: 30.65, I_max: 35.77, I_raw: 2286, ax_last: -0.062, ay_last: 1.051, az_last: 0.102, a_tot_last: 1.058, ax_avg: -0.10, rssi_dbm: -89.00, snr_db: 12.50 },
  { time_recv_s: 58, time_send_ms: 500148, V_car_last: 44.44, V_car_avg: 44.67, V_car_min: 44.44, V_car_max: 44.90, V_esp32_last: 1.932, RAW: 2402, I_last: 20.94, I_avg: 27.28, I_min: 20.94, I_max: 33.63, I_raw: 2064, ax_last: 0.050, ay_last: 0.886, az_last: 0.412, a_tot_last: 0.978, ax_avg: -0.041, rssi_dbm: -88.00, snr_db: 12.00 },
  { time_recv_s: 59, time_send_ms: 501148, V_car_last: 44.00, V_car_avg: 44.14, V_car_min: 44.00, V_car_max: 44.27, V_esp32_last: 1.913, RAW: 2378, I_last: 32.71, I_avg: 29.80, I_min: 26.90, I_max: 32.71, I_raw: 2214, ax_last: -0.056, ay_last: 0.597, az_last: 0.099, a_tot_last: 0.608, ax_avg: 0.012, rssi_dbm: -85.00, snr_db: 11.50 },
  { time_recv_s: 61, time_send_ms: 503148, V_car_last: 44.57, V_car_avg: 44.23, V_car_min: 43.88, V_car_max: 44.57, V_esp32_last: 1.938, RAW: 2394, I_last: 44.48, I_avg: 39.51, I_min: 34.54, I_max: 44.48, I_raw: 2350, ax_last: -0.177, ay_last: 1.186, az_last: 0.645, a_tot_last: 1.361, ax_avg: -0.17, rssi_dbm: -85.00, snr_db: 10.50 },
  { time_recv_s: 62, time_send_ms: 504148, V_car_last: 44.07, V_car_avg: 43.94, V_car_min: 43.81, V_car_max: 44.07, V_esp32_last: 1.916, RAW: 2365, I_last: 38.52, I_avg: 37.22, I_min: 35.92, I_max: 38.52, I_raw: 2320, ax_last: -0.052, ay_last: 0.799, az_last: 0.383, a_tot_last: 0.887, ax_avg: -0.09, rssi_dbm: -82.00, snr_db: 12.25 },
  { time_recv_s: 63, time_send_ms: 505148, V_car_last: 43.70, V_car_avg: 43.92, V_car_min: 43.70, V_car_max: 44.14, V_esp32_last: 1.900, RAW: 2355, I_last: 37.30, I_avg: 37.95, I_min: 37.30, I_max: 38.60, I_raw: 2198, ax_last: -0.205, ay_last: 1.167, az_last: 0.408, a_tot_last: 1.253, ax_avg: -0.16, rssi_dbm: -75.00, snr_db: 12.50 },
  { time_recv_s: 64, time_send_ms: 506148, V_car_last: 43.52, V_car_avg: 43.52, V_car_min: 43.52, V_car_max: 43.52, V_esp32_last: 1.892, RAW: 2386, I_last: 45.86, I_avg: 43.60, I_min: 41.35, I_max: 45.86, I_raw: 2485, ax_last: -0.515, ay_last: 0.754, az_last: 0.781, a_tot_last: 1.202, ax_avg: -0.20, rssi_dbm: -83.00, snr_db: 12.00 },
  { time_recv_s: 67, time_send_ms: 509148, V_car_last: 48.07, V_car_avg: 48.06, V_car_min: 48.05, V_car_max: 48.07, V_esp32_last: 2.090, RAW: 2583, I_last: -22.48, I_avg: -22.48, I_min: -22.48, I_max: -22.48, I_raw: 1351, ax_last: 0.084, ay_last: 0.684, az_last: 0.500, a_tot_last: 0.852, ax_avg: 0, rssi_dbm: -78.00, snr_db: 12.00 },
  { time_recv_s: 68, time_send_ms: 510148, V_car_last: 46.74, V_car_avg: 53.84, V_car_min: 46.74, V_car_max: 60.95, V_esp32_last: 2.032, RAW: 2559, I_last: -15.68, I_avg: -11.59, I_min: -15.68, I_max: -7.50, I_raw: 1437, ax_last: -0.059, ay_last: 0.740, az_last: 0.614, a_tot_last: 0.963, ax_avg: 0, rssi_dbm: -74.00, snr_db: 12.25 },
  { time_recv_s: 69, time_send_ms: 511148, V_car_last: 48.32, V_car_avg: 47.82, V_car_min: 47.31, V_car_max: 48.32, V_esp32_last: 2.101, RAW: 2547, I_last: -4.83, I_avg: -4.37, I_min: -4.83, I_max: -3.91, I_raw: 1600, ax_last: 0.248, ay_last: 0.051, az_last: 1.177, a_tot_last: 1.204, ax_avg: 0.360, rssi_dbm: -83.00, snr_db: 12.00 },
  { time_recv_s: 71, time_send_ms: 513148, V_car_last: 47.06, V_car_avg: 47.00, V_car_min: 46.94, V_car_max: 47.06, V_esp32_last: 2.046, RAW: 2537, I_last: 0.75, I_avg: 0.98, I_min: 0.75, I_max: 1.21, I_raw: 1682, ax_last: -0.043, ay_last: 0.983, az_last: 0.108, a_tot_last: 0.990, ax_avg: -0.046, rssi_dbm: -83.00, snr_db: 12.00 },
  { time_recv_s: 72, time_send_ms: 514148, V_car_last: 46.97, V_car_avg: 47.01, V_car_min: 46.97, V_car_max: 47.06, V_esp32_last: 2.042, RAW: 2535, I_last: -1.16, I_avg: 0.14, I_min: -1.16, I_max: 1.44, I_raw: 1731, ax_last: -0.045, ay_last: 0.980, az_last: 0.103, a_tot_last: 0.986, ax_avg: -0.047, rssi_dbm: -79.00, snr_db: 12.25 },
  { time_recv_s: 73, time_send_ms: 515148, V_car_last: 47.04, V_car_avg: 47.00, V_car_min: 46.97, V_car_max: 47.04, V_esp32_last: 2.045, RAW: 2533, I_last: -1.46, I_avg: -1.46, I_min: -1.46, I_max: -1.46, I_raw: 1697, ax_last: -0.050, ay_last: 0.992, az_last: 0.058, a_tot_last: 0.995, ax_avg: -0.05, rssi_dbm: -77.00, snr_db: 12.75 },
];

// Add computed power_w field
export function computePower(row: PrimaryTelemetryRow): number {
  return row.V_car_last * row.I_last;
}

// AI Analysis for primary telemetry (no V_car_sag)
export function analyzePrimaryRow(row: PrimaryTelemetryRow): { analysis: string; status: "normal" | "warning" | "critical" | "optimal" } {
  const power = computePower(row);
  const voltageRange = row.V_car_max - row.V_car_min;
  
  // Critical: High voltage spike
  if (row.V_car_max > 55) {
    return {
      analysis: `🚨 CRITICAL: Voltage spike to ${row.V_car_max.toFixed(2)}V detected. Possible regenerative braking surge or sensor anomaly.`,
      status: "critical"
    };
  }
  
  // Critical: High current spike
  if (row.I_max > 60) {
    return {
      analysis: `⚠️ CRITICAL: High current draw ${row.I_max.toFixed(2)}A detected. Motor under heavy load. Monitor battery temperature.`,
      status: "critical"
    };
  }
  
  // Critical: High acceleration (impact detection)
  if (row.a_tot_last > 2.0) {
    return {
      analysis: `🚨 IMPACT DETECTED: Total acceleration ${row.a_tot_last.toFixed(2)}g exceeds safety threshold. Check vehicle condition.`,
      status: "critical"
    };
  }
  
  // Warning: Regenerative braking (negative current)
  if (row.I_last < -10) {
    return {
      analysis: `⚡ REGEN ACTIVE: Regenerative braking at ${Math.abs(row.I_last).toFixed(2)}A. Recovering ${Math.abs(power).toFixed(0)}W to battery.`,
      status: "optimal"
    };
  }
  
  // Warning: Low signal quality
  if (row.rssi_dbm < -95 || row.snr_db < 10) {
    return {
      analysis: `📡 SIGNAL WARNING: RSSI ${row.rssi_dbm}dBm, SNR ${row.snr_db}dB. Consider repositioning antenna.`,
      status: "warning"
    };
  }
  
  // Warning: High voltage variation
  if (voltageRange > 1.0) {
    return {
      analysis: `📊 VOLTAGE VARIATION: ${voltageRange.toFixed(2)}V range detected. Battery responding to power demands.`,
      status: "warning"
    };
  }
  
  // Warning: High power consumption
  if (power > 2000) {
    return {
      analysis: `🔋 HIGH POWER: ${power.toFixed(0)}W draw detected. Consider reducing throttle for efficiency.`,
      status: "warning"
    };
  }
  
  // Optimal: Perfect stability
  if (voltageRange < 0.1 && row.I_avg > 0 && row.I_avg < 40) {
    return {
      analysis: `✅ OPTIMAL: Stable voltage at ${row.V_car_avg.toFixed(2)}V, efficient current draw ${row.I_avg.toFixed(1)}A.`,
      status: "optimal"
    };
  }
  
  // Normal operation
  return {
    analysis: `📈 NORMAL: V=${row.V_car_last.toFixed(2)}V, I=${row.I_last.toFixed(1)}A, P=${power.toFixed(0)}W. Operating within parameters.`,
    status: "normal"
  };
}

// Get analyzed primary data
export function getAnalyzedPrimaryData(): (PrimaryTelemetryRow & { aiAnalysis: string; status: string; power_w: number })[] {
  return primaryTelemetryData.map(row => {
    const { analysis, status } = analyzePrimaryRow(row);
    return {
      ...row,
      aiAnalysis: analysis,
      status,
      power_w: computePower(row),
    };
  });
}

// Summary statistics
export function getPrimarySummary() {
  const data = primaryTelemetryData;
  const voltages = data.map(d => d.V_car_avg);
  const currents = data.map(d => d.I_avg);
  const powers = data.map(d => computePower(d));
  
  return {
    avgVoltage: voltages.reduce((a, b) => a + b, 0) / voltages.length,
    minVoltage: Math.min(...data.map(d => d.V_car_min)),
    maxVoltage: Math.max(...data.map(d => d.V_car_max)),
    avgCurrent: currents.reduce((a, b) => a + b, 0) / currents.length,
    maxCurrent: Math.max(...data.map(d => d.I_max)),
    avgPower: powers.reduce((a, b) => a + b, 0) / powers.length,
    maxPower: Math.max(...powers),
    avgRSSI: data.reduce((a, d) => a + d.rssi_dbm, 0) / data.length,
    avgSNR: data.reduce((a, d) => a + d.snr_db, 0) / data.length,
    totalReadings: data.length,
    duration: Math.max(...data.map(d => d.time_recv_s)),
  };
}
