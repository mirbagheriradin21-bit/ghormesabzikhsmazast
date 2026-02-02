/**
 * Telemetry Service - Handles real-time data from backend with demo mode fallback
 */

export interface TelemetrySample {
  timestamp?: number;
  time_recv_s?: number;
  voltage?: number;
  V_car_last?: number;
  V_car_avg?: number;
  V_car_min?: number;
  V_car_max?: number;
  V_car_sag?: number;
  current?: number;
  power_w?: number;
  speed?: number;
  ax?: number;
  ay?: number;
  az?: number;
  lat?: number;
  lon?: number;
  rssi?: number;
  snr?: number;
  gps_fix?: boolean;
  server_time?: string;
}

export interface AIInsight {
  timestamp: string;
  sample_time: string;
  anomaly_flag: boolean;
  anomaly_count: number;
  anomaly_reasons: string[];
  anomaly_reason: string | null;
  efficiency_score: number;
  battery_risk_level: 'low' | 'medium' | 'high';
  suggested_actions: string[];
  suggested_action: string;
  metrics_analyzed: {
    voltage: number | null;
    current: number | null;
    speed: number | null;
    voltage_sag: number | null;
  };
}

export interface BackendStatus {
  connected: boolean;
  serverTime: string | null;
  csvExists: boolean;
  sampleCount: number;
}

class TelemetryService {
  private backendUrl: string = 'http://localhost:8000';
  private eventSource: EventSource | null = null;
  private aiEventSource: EventSource | null = null;
  private isConnected: boolean = false;
  private demoMode: boolean = true;
  private listeners: Set<(sample: TelemetrySample) => void> = new Set();
  private aiListeners: Set<(insight: AIInsight) => void> = new Set();
  private statusListeners: Set<(status: BackendStatus) => void> = new Set();
  private demoInterval: NodeJS.Timeout | null = null;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private lastDemoTime: number = 0;

  constructor() {
    this.startHealthCheck();
  }

  /**
   * Set the backend URL
   */
  setBackendUrl(url: string) {
    this.backendUrl = url.replace(/\/$/, ''); // Remove trailing slash
    this.checkConnection();
  }

  /**
   * Get current backend URL
   */
  getBackendUrl(): string {
    return this.backendUrl;
  }

  /**
   * Check if connected to backend
   */
  isBackendConnected(): boolean {
    return this.isConnected && !this.demoMode;
  }

  /**
   * Check if in demo mode
   */
  isDemoMode(): boolean {
    return this.demoMode;
  }

  /**
   * Force demo mode on/off
   */
  setDemoMode(enabled: boolean) {
    this.demoMode = enabled;
    if (enabled) {
      this.stopStreaming();
      this.startDemoData();
    } else {
      this.stopDemoData();
      this.checkConnection();
    }
  }

  /**
   * Start periodic health checks
   */
  private startHealthCheck() {
    this.checkConnection();
    this.healthCheckInterval = setInterval(() => {
      this.checkConnection();
    }, 5000);
  }

  /**
   * Check connection to backend
   */
  private async checkConnection() {
    try {
      const response = await fetch(`${this.backendUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(2000),
      });

      if (response.ok) {
        const data = await response.json();
        this.isConnected = true;

        if (this.demoMode) {
          this.demoMode = false;
          this.stopDemoData();
          this.startStreaming();
        }

        this.notifyStatus({
          connected: true,
          serverTime: data.server_time,
          csvExists: data.csv_exists,
          sampleCount: 0,
        });
      } else {
        throw new Error('Health check failed');
      }
    } catch {
      this.isConnected = false;
      if (!this.demoMode) {
        this.demoMode = true;
        this.stopStreaming();
        this.startDemoData();
      }

      this.notifyStatus({
        connected: false,
        serverTime: null,
        csvExists: false,
        sampleCount: 0,
      });
    }
  }

  /**
   * Start SSE streaming from backend
   */
  private startStreaming() {
    if (this.eventSource) return;

    try {
      // Telemetry stream
      this.eventSource = new EventSource(`${this.backendUrl}/stream`);
      this.eventSource.addEventListener('telemetry', (event) => {
        try {
          const sample = JSON.parse(event.data.replace(/'/g, '"'));
          this.notifyListeners(sample);
        } catch (e) {
          console.error('Failed to parse telemetry:', e);
        }
      });

      this.eventSource.onerror = () => {
        this.stopStreaming();
        this.demoMode = true;
        this.startDemoData();
      };

      // AI stream
      this.aiEventSource = new EventSource(`${this.backendUrl}/ai/stream`);
      this.aiEventSource.addEventListener('insight', (event) => {
        try {
          const insight = JSON.parse(event.data.replace(/'/g, '"'));
          this.notifyAIListeners(insight);
        } catch (e) {
          console.error('Failed to parse AI insight:', e);
        }
      });
    } catch {
      this.demoMode = true;
      this.startDemoData();
    }
  }

  /**
   * Stop SSE streaming
   */
  private stopStreaming() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    if (this.aiEventSource) {
      this.aiEventSource.close();
      this.aiEventSource = null;
    }
  }

  /**
   * Start generating demo data
   */
  private startDemoData() {
    if (this.demoInterval) return;

    this.demoInterval = setInterval(() => {
      const sample = this.generateDemoSample();
      this.notifyListeners(sample);

      // Generate AI insight every 2nd sample
      if (this.lastDemoTime % 2 === 0) {
        const insight = this.generateDemoInsight(sample);
        this.notifyAIListeners(insight);
      }
      this.lastDemoTime++;
    }, 500);
  }

  /**
   * Stop generating demo data
   */
  private stopDemoData() {
    if (this.demoInterval) {
      clearInterval(this.demoInterval);
      this.demoInterval = null;
    }
  }

  /**
   * Generate a demo telemetry sample
   */
  private generateDemoSample(): TelemetrySample {
    const now = Date.now();
    const t = now * 0.001;

    // Simulate realistic voltage behavior with occasional sags
    const baseVoltage = 44 + Math.sin(t * 0.1) * 3;
    const sagChance = Math.random();
    const sag = sagChance > 0.95 ? 5 + Math.random() * 3 : sagChance > 0.8 ? 1 + Math.random() * 2 : Math.random() * 0.5;

    return {
      timestamp: now,
      time_recv_s: Math.floor(now / 1000),
      V_car_last: baseVoltage - sag * 0.3,
      V_car_avg: baseVoltage,
      V_car_min: baseVoltage - sag,
      V_car_max: baseVoltage + Math.random() * 0.5,
      V_car_sag: sag,
      voltage: baseVoltage - sag * 0.3,
      current: 10 + Math.sin(t * 0.2) * 5 + Math.random() * 3,
      power_w: (baseVoltage - sag * 0.3) * (10 + Math.sin(t * 0.2) * 5),
      speed: 30 + Math.sin(t * 0.15) * 15 + Math.random() * 5,
      rssi: -55 + Math.sin(t * 0.05) * 15,
      snr: 20 + Math.random() * 5,
      gps_fix: Math.random() > 0.05,
      server_time: new Date().toISOString(),
    };
  }

  /**
   * Generate a demo AI insight
   */
  private generateDemoInsight(sample: TelemetrySample): AIInsight {
    const sag = sample.V_car_sag || 0;
    const voltage = sample.voltage || sample.V_car_last || 44;

    const anomalies: string[] = [];
    const actions: string[] = [];

    if (sag > 5) {
      anomalies.push(`Critical voltage sag: ${sag.toFixed(2)}V`);
      actions.push('Reduce throttle immediately');
    } else if (sag > 2) {
      anomalies.push(`Voltage sag warning: ${sag.toFixed(2)}V`);
      actions.push('Monitor battery closely');
    }

    if (voltage < 38) {
      anomalies.push(`Low voltage: ${voltage.toFixed(1)}V`);
      actions.push('Check battery connections');
    }

    const efficiency = Math.max(0, Math.min(100, 100 - sag * 10 - (44 - voltage) * 2));

    return {
      timestamp: new Date().toISOString(),
      sample_time: sample.server_time || new Date().toISOString(),
      anomaly_flag: anomalies.length > 0,
      anomaly_count: anomalies.length,
      anomaly_reasons: anomalies,
      anomaly_reason: anomalies[0] || null,
      efficiency_score: Math.round(efficiency),
      battery_risk_level: sag > 5 ? 'high' : sag > 2 ? 'medium' : 'low',
      suggested_actions: actions,
      suggested_action: actions[0] || 'Systems nominal, maintain current strategy',
      metrics_analyzed: {
        voltage: voltage,
        current: sample.current || null,
        speed: sample.speed || null,
        voltage_sag: sag,
      },
    };
  }

  /**
   * Subscribe to telemetry updates
   */
  subscribe(callback: (sample: TelemetrySample) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Subscribe to AI insight updates
   */
  subscribeAI(callback: (insight: AIInsight) => void): () => void {
    this.aiListeners.add(callback);
    return () => this.aiListeners.delete(callback);
  }

  /**
   * Subscribe to status updates
   */
  subscribeStatus(callback: (status: BackendStatus) => void): () => void {
    this.statusListeners.add(callback);
    return () => this.statusListeners.delete(callback);
  }

  private notifyListeners(sample: TelemetrySample) {
    this.listeners.forEach((cb) => cb(sample));
  }

  private notifyAIListeners(insight: AIInsight) {
    this.aiListeners.forEach((cb) => cb(insight));
  }

  private notifyStatus(status: BackendStatus) {
    this.statusListeners.forEach((cb) => cb(status));
  }

  /**
   * Fetch latest telemetry (polling mode)
   */
  async fetchLatest(): Promise<TelemetrySample | null> {
    if (this.demoMode) {
      return this.generateDemoSample();
    }

    try {
      const response = await fetch(`${this.backendUrl}/latest`);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.error('Failed to fetch latest:', e);
    }
    return null;
  }

  /**
   * Fetch telemetry history (polling mode)
   */
  async fetchHistory(seconds: number = 30): Promise<TelemetrySample[]> {
    if (this.demoMode) {
      // Generate demo history
      const samples: TelemetrySample[] = [];
      for (let i = 0; i < seconds * 2; i++) {
        samples.push(this.generateDemoSample());
      }
      return samples;
    }

    try {
      const response = await fetch(`${this.backendUrl}/history?seconds=${seconds}`);
      if (response.ok) {
        const data = await response.json();
        return data.samples || [];
      }
    } catch (e) {
      console.error('Failed to fetch history:', e);
    }
    return [];
  }

  /**
   * Fetch latest AI insight
   */
  async fetchAILatest(): Promise<AIInsight | null> {
    if (this.demoMode) {
      return this.generateDemoInsight(this.generateDemoSample());
    }

    try {
      const response = await fetch(`${this.backendUrl}/ai/latest`);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.error('Failed to fetch AI latest:', e);
    }
    return null;
  }

  /**
   * Cleanup
   */
  destroy() {
    this.stopStreaming();
    this.stopDemoData();
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
  }
}

// Singleton instance
export const telemetryService = new TelemetryService();
