import { useState, useEffect, useCallback, useRef } from 'react';
import { telemetryService, TelemetrySample, AIInsight, BackendStatus } from '@/services/telemetryService';

interface LiveTelemetryState {
  latest: TelemetrySample | null;
  history: TelemetrySample[];
  aiInsight: AIInsight | null;
  status: BackendStatus;
  isDemoMode: boolean;
}

export function useLiveTelemetry(historySeconds: number = 30) {
  const [state, setState] = useState<LiveTelemetryState>({
    latest: null,
    history: [],
    aiInsight: null,
    status: {
      connected: false,
      serverTime: null,
      csvExists: false,
      sampleCount: 0,
    },
    isDemoMode: true,
  });

  const historyRef = useRef<TelemetrySample[]>([]);
  const maxHistoryLength = historySeconds * 2; // Assuming 2 samples per second

  useEffect(() => {
    // Subscribe to telemetry updates
    const unsubTelemetry = telemetryService.subscribe((sample) => {
      historyRef.current = [...historyRef.current, sample].slice(-maxHistoryLength);
      
      setState((prev) => ({
        ...prev,
        latest: sample,
        history: historyRef.current,
        isDemoMode: telemetryService.isDemoMode(),
      }));
    });

    // Subscribe to AI updates
    const unsubAI = telemetryService.subscribeAI((insight) => {
      setState((prev) => ({
        ...prev,
        aiInsight: insight,
      }));
    });

    // Subscribe to status updates
    const unsubStatus = telemetryService.subscribeStatus((status) => {
      setState((prev) => ({
        ...prev,
        status,
        isDemoMode: telemetryService.isDemoMode(),
      }));
    });

    return () => {
      unsubTelemetry();
      unsubAI();
      unsubStatus();
    };
  }, [maxHistoryLength]);

  const setBackendUrl = useCallback((url: string) => {
    telemetryService.setBackendUrl(url);
  }, []);

  const toggleDemoMode = useCallback(() => {
    telemetryService.setDemoMode(!telemetryService.isDemoMode());
    setState((prev) => ({
      ...prev,
      isDemoMode: telemetryService.isDemoMode(),
    }));
  }, []);

  return {
    ...state,
    setBackendUrl,
    toggleDemoMode,
    backendUrl: telemetryService.getBackendUrl(),
  };
}

/**
 * Hook for chart data formatting
 */
export function useChartData(history: TelemetrySample[]) {
  return history.map((sample, index) => ({
    time: sample.time_recv_s || index,
    voltage: sample.voltage || sample.V_car_last || 0,
    voltage_avg: sample.V_car_avg || sample.voltage || 0,
    voltage_min: sample.V_car_min || 0,
    voltage_max: sample.V_car_max || 0,
    sag: sample.V_car_sag || 0,
    current: sample.current || 0,
    power: sample.power_w || (sample.voltage || 0) * (sample.current || 0),
    speed: sample.speed || 0,
    rssi: sample.rssi || -60,
    snr: sample.snr || 20,
  }));
}
