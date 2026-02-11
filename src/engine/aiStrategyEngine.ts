// AI Strategy Engine - Sample-by-sample streaming analysis
// Computes derived metrics, rolling windows, anomaly detection, efficiency scoring, Monte Carlo

import { PrimaryTelemetryRow } from '@/data/primaryTelemetryData';

// ============ Types ============

export interface AIInsight {
  ts: number;
  anomaly_flag: boolean;
  anomaly_reason: string;
  severity: 'info' | 'warn' | 'critical';
  efficiency_score: number;
  battery_risk_level: 'low' | 'med' | 'high';
  soc_est: number;
  time_to_empty_s: number;
  time_remaining_s: number;
  burn_rate_w: number;
  suggested_action: string;
  notes: string[];
  monte_carlo: {
    finish_probability: number;
    expected_soc_finish: number;
    risk_percent: number;
  };
  // Extra computed
  power_w: number;
  power_kw: number;
  energy_wh_used: number;
  aggressiveness: number;
  link_quality: number;
}

export interface AnomalyAlert {
  id: string;
  timestamp: number;
  severity: 'info' | 'warn' | 'critical';
  title: string;
  message: string;
  recommended_action: string;
}

// ============ Engine State ============

export class AIStrategyEngine {
  // Config
  private usableWh = 576; // 48V * 12Ah
  private heatDurationS = 1800; // 30 min heat
  private eps = 0.001;

  // Cumulative state
  private energyWhUsed = 0;
  private connectTime = 0;
  private prevTimestamp: number | null = null;
  private sampleCount = 0;

  // Rolling windows
  private powerWindow: { t: number; v: number }[] = [];
  private accelWindow: { t: number; v: number }[] = [];
  private voltageWindow: { t: number; v: number }[] = [];
  private currentWindow: { t: number; v: number }[] = [];

  // Anomaly tracking
  private alerts: AnomalyAlert[] = [];
  private voltageFreezeCount = 0;
  private lastVoltage: number | null = null;
  private lastSampleTime: number | null = null;
  private powerSpikesLast30s = 0;
  private voltageSagActive = false;

  // Monte Carlo cache
  private lastMonteCarloResult = { finish_probability: 0.9, expected_soc_finish: 0.05, risk_percent: 10 };
  private lastMonteCarloTime = 0;

  reset() {
    this.energyWhUsed = 0;
    this.connectTime = Date.now();
    this.prevTimestamp = null;
    this.sampleCount = 0;
    this.powerWindow = [];
    this.accelWindow = [];
    this.voltageWindow = [];
    this.currentWindow = [];
    this.alerts = [];
    this.voltageFreezeCount = 0;
    this.lastVoltage = null;
    this.lastSampleTime = null;
    this.powerSpikesLast30s = 0;
    this.voltageSagActive = false;
    this.lastMonteCarloResult = { finish_probability: 0.9, expected_soc_finish: 0.05, risk_percent: 10 };
    this.lastMonteCarloTime = 0;
  }

  getAlerts(): AnomalyAlert[] {
    return this.alerts;
  }

  processSample(row: PrimaryTelemetryRow): AIInsight {
    this.sampleCount++;
    const now = row.time_recv_s;

    // --- dt ---
    const dt_s = this.prevTimestamp !== null ? Math.max(now - this.prevTimestamp, 0.5) : 1;
    this.prevTimestamp = now;

    // --- Core metrics ---
    const power_w = row.V_car_last * row.I_last;
    const power_kw = power_w / 1000;

    // Energy (only count positive power as consumption)
    if (power_w > 0) {
      this.energyWhUsed += (power_w * dt_s) / 3600;
    }

    const soc_est = Math.max(0, Math.min(1, 1 - this.energyWhUsed / this.usableWh));

    // --- Rolling windows (keep 30s) ---
    this.powerWindow.push({ t: now, v: power_w });
    this.accelWindow.push({ t: now, v: row.a_tot_last });
    this.voltageWindow.push({ t: now, v: row.V_car_last });
    this.currentWindow.push({ t: now, v: row.I_last });

    const cutoff30 = now - 30;
    const cutoff10 = now - 10;
    const cutoff5 = now - 5;
    this.powerWindow = this.powerWindow.filter(p => p.t >= cutoff30);
    this.accelWindow = this.accelWindow.filter(p => p.t >= cutoff30);
    this.voltageWindow = this.voltageWindow.filter(p => p.t >= cutoff30);
    this.currentWindow = this.currentWindow.filter(p => p.t >= cutoff30);

    // --- Burn rate (10s rolling mean) ---
    const power10s = this.powerWindow.filter(p => p.t >= cutoff10);
    const burn_rate_w = power10s.length > 0
      ? power10s.reduce((s, p) => s + p.v, 0) / power10s.length
      : Math.max(power_w, 0);

    // --- Time estimates ---
    const timeElapsedS = (Date.now() - this.connectTime) / 1000;
    const time_remaining_s = Math.max(0, this.heatDurationS - timeElapsedS);
    const effectiveBurn = Math.max(burn_rate_w, this.eps);
    const remainingWh = this.usableWh - this.energyWhUsed;
    const time_to_empty_s = (remainingWh * 3600) / effectiveBurn;

    // --- SoC pacing ---
    const soc_target_now = Math.max(0, 1 - (timeElapsedS / this.heatDurationS));
    const soc_error = soc_est - soc_target_now;

    // --- Aggressiveness ---
    const powerMean30 = this.powerWindow.length > 0
      ? this.powerWindow.reduce((s, p) => s + p.v, 0) / this.powerWindow.length : 0;
    const powerStd30 = this.powerWindow.length > 1
      ? Math.sqrt(this.powerWindow.reduce((s, p) => s + (p.v - powerMean30) ** 2, 0) / this.powerWindow.length) : 1;
    const accelMean10 = this.accelWindow.filter(p => p.t >= cutoff10);
    const accelM = accelMean10.length > 0 ? accelMean10.reduce((s, p) => s + p.v, 0) / accelMean10.length : 0;
    const accelStd = accelMean10.length > 1
      ? Math.sqrt(accelMean10.reduce((s, p) => s + (p.v - accelM) ** 2, 0) / accelMean10.length) : 1;

    const powerZ = powerStd30 > this.eps ? (power_w - powerMean30) / powerStd30 : 0;
    const accelZ = accelStd > this.eps ? (row.a_tot_last - accelM) / accelStd : 0;
    const aggressiveness = Math.min(1, Math.max(0, (Math.abs(powerZ) + Math.abs(accelZ)) / 4));

    // --- Link quality ---
    const rssiNorm = Math.max(0, Math.min(100, (row.rssi_dbm + 110) * 2.5));
    const snrNorm = Math.max(0, Math.min(100, row.snr_db * 7));
    const link_quality = (rssiNorm * 0.6 + snrNorm * 0.4);

    // --- Power spikes in last 30s ---
    this.powerSpikesLast30s = this.powerWindow.filter(p => p.v > 2200).length;

    // ============ ANOMALY DETECTION ============
    const anomalies: { flag: boolean; reason: string; severity: 'info' | 'warn' | 'critical' }[] = [];

    // Voltage sag under load
    const v5s = this.voltageWindow.filter(p => p.t >= cutoff5);
    if (v5s.length >= 2) {
      const dvdt = (v5s[v5s.length - 1].v - v5s[0].v) / Math.max(v5s[v5s.length - 1].t - v5s[0].t, 0.5);
      if (dvdt < -0.5 && row.I_last > 40) {
        anomalies.push({ flag: true, reason: 'Voltage sag under load', severity: 'warn' });
        this.voltageSagActive = true;
      } else {
        this.voltageSagActive = false;
      }
    }

    // Voltage spike
    if (this.lastVoltage !== null && Math.abs(row.V_car_last - this.lastVoltage) > 3) {
      anomalies.push({ flag: true, reason: `Voltage spike (${this.lastVoltage.toFixed(1)}V → ${row.V_car_last.toFixed(1)}V)`, severity: 'warn' });
    }

    // Near cutoff
    if (soc_est < 0.08 && time_remaining_s > 120) {
      anomalies.push({ flag: true, reason: 'Low SoC risk', severity: 'critical' });
    }

    // Freeze detection
    if (this.lastVoltage !== null && Math.abs(row.V_car_last - this.lastVoltage) < 0.001) {
      this.voltageFreezeCount++;
      if (this.voltageFreezeCount > 5) {
        anomalies.push({ flag: true, reason: 'Voltage sensor freeze suspected', severity: 'warn' });
      }
    } else {
      this.voltageFreezeCount = 0;
    }

    // Impact detection
    if (row.a_tot_last > 2.0) {
      anomalies.push({ flag: true, reason: `Impact / abnormal G detected (${row.a_tot_last.toFixed(2)}g)`, severity: 'critical' });
    }

    // Link quality
    if (row.rssi_dbm < -95 || row.snr_db < 5) {
      anomalies.push({ flag: true, reason: 'Telemetry link weak', severity: 'warn' });
    }

    // High current
    if (row.I_last > 55) {
      anomalies.push({ flag: true, reason: `High current draw (${row.I_last.toFixed(1)}A)`, severity: 'warn' });
    }

    this.lastVoltage = row.V_car_last;
    this.lastSampleTime = now;

    // Store alerts
    for (const a of anomalies) {
      this.alerts.push({
        id: `alert-${this.sampleCount}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: now,
        severity: a.severity,
        title: a.reason,
        message: a.reason,
        recommended_action: this.getRecommendedAction(a.reason),
      });
    }
    // Keep last 50 alerts
    if (this.alerts.length > 50) this.alerts = this.alerts.slice(-50);

    const topAnomaly = anomalies.length > 0
      ? anomalies.reduce((worst, a) => a.severity === 'critical' ? a : worst, anomalies[0])
      : null;

    // ============ RECOMMENDATION ENGINE ============
    let suggested_action = '';
    let battery_risk_level: 'low' | 'med' | 'high' = 'low';
    const notes: string[] = [];

    // A) Battery pacing
    if (time_to_empty_s < time_remaining_s * 1.05) {
      suggested_action = 'CONSERVE: reduce throttle ~5-15% and smooth exits';
      battery_risk_level = 'high';
    } else if (soc_error < -0.05) {
      suggested_action = 'CONSERVE: target slightly lower speed on straights';
      battery_risk_level = 'med';
    } else if (soc_error > 0.05) {
      suggested_action = 'PUSH: you have energy margin; increase pace gradually';
      battery_risk_level = 'low';
    } else {
      suggested_action = 'HOLD: current pace is on plan';
    }

    // B) Driving style
    if (aggressiveness > 0.85 && soc_error < 0) {
      notes.push('Smooth throttle; avoid full-power spikes out of corners');
    }

    // C) Energy info
    notes.push(`Energy burn is ${soc_error > 0 ? 'under' : 'above'} target for elapsed time (SoC: ${(soc_est * 100).toFixed(1)}%)`);

    // Regen credit
    if (row.I_last < 0) {
      notes.push(`Regen active: recovering ${Math.abs(power_w).toFixed(0)}W`);
    }

    // D) Link quality
    notes.push(`Telemetry link ${link_quality > 60 ? 'OK' : 'WEAK'} (RSSI ${row.rssi_dbm.toFixed(0)} dBm, SNR ${row.snr_db.toFixed(1)} dB)`);

    // ============ EFFICIENCY SCORE ============
    const pacing_penalty = Math.min(40, Math.abs(soc_error) * 300);
    const spike_penalty = Math.min(25, this.powerSpikesLast30s * 5);
    const sag_penalty = this.voltageSagActive ? 20 : 0;
    const link_penalty = Math.min(15, Math.max(0, (50 - link_quality) / 2));
    const efficiency_score = Math.max(0, Math.min(100,
      100 - pacing_penalty - spike_penalty - sag_penalty - link_penalty
    ));

    // ============ MONTE CARLO (every ~10 samples) ============
    if (this.sampleCount % 10 === 0 || this.sampleCount === 1) {
      this.lastMonteCarloResult = this.runMonteCarlo(burn_rate_w, remainingWh, time_remaining_s);
      this.lastMonteCarloTime = now;

      // Update battery risk from MC
      if (this.lastMonteCarloResult.risk_percent > 30) battery_risk_level = 'high';
      else if (this.lastMonteCarloResult.risk_percent > 10) battery_risk_level = 'med';
    }

    return {
      ts: now,
      anomaly_flag: anomalies.length > 0,
      anomaly_reason: topAnomaly?.reason || '',
      severity: topAnomaly?.severity || 'info',
      efficiency_score: Math.round(efficiency_score),
      battery_risk_level,
      soc_est,
      time_to_empty_s: Math.round(time_to_empty_s),
      time_remaining_s: Math.round(time_remaining_s),
      burn_rate_w: Math.round(burn_rate_w),
      suggested_action,
      notes,
      monte_carlo: this.lastMonteCarloResult,
      power_w,
      power_kw,
      energy_wh_used: this.energyWhUsed,
      aggressiveness,
      link_quality,
    };
  }

  private runMonteCarlo(burnRateMean: number, remainingWh: number, timeRemainingS: number): {
    finish_probability: number;
    expected_soc_finish: number;
    risk_percent: number;
  } {
    const runs = 1000;
    const burnStd = Math.max(burnRateMean * 0.15, 50); // 15% variability
    const whUncertainty = this.usableWh * 0.07; // ±7%
    let depleted = 0;
    let socFinishSum = 0;

    for (let i = 0; i < runs; i++) {
      const sampledBurn = burnRateMean + (Math.random() - 0.5) * 2 * burnStd;
      const sampledWh = remainingWh + (Math.random() - 0.5) * 2 * whUncertainty;
      const energyNeeded = (Math.max(sampledBurn, 0) * timeRemainingS) / 3600;
      const leftover = sampledWh - energyNeeded;
      const socFinish = Math.max(0, leftover / this.usableWh);
      socFinishSum += socFinish;
      if (leftover < 0) depleted++;
    }

    const finish_probability = 1 - depleted / runs;
    const expected_soc_finish = socFinishSum / runs;
    const risk_percent = Math.round((depleted / runs) * 100);

    return { finish_probability, expected_soc_finish, risk_percent };
  }

  private getRecommendedAction(reason: string): string {
    if (reason.includes('sag')) return 'Reduce power draw to prevent deep voltage sag';
    if (reason.includes('spike')) return 'Check sensor connections; monitor for recurrence';
    if (reason.includes('SoC')) return 'Immediately reduce speed by 20%';
    if (reason.includes('freeze')) return 'Check voltage sensor wiring';
    if (reason.includes('Impact')) return 'Stop vehicle for safety inspection';
    if (reason.includes('link')) return 'Reposition antenna; check for interference';
    if (reason.includes('current')) return 'Reduce throttle to limit motor stress';
    return 'Monitor and report if issue persists';
  }
}
