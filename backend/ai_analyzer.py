"""
AI Analyzer Module - Streaming telemetry analysis with anomaly detection
Designed for easy swapping with ML models later (e.g., joblib .pkl)
"""

from typing import Dict, List, Optional, Any
from datetime import datetime
from collections import deque
import threading


class TelemetryAIAnalyzer:
    """
    Streaming AI analyzer that processes telemetry one sample at a time.
    Uses rolling windows for pattern detection.
    
    To swap in a trained model later:
    1. Load your model in __init__: self.model = joblib.load('model.pkl')
    2. Replace analyze_sample() logic with: return self.model.predict(features)
    """
    
    def __init__(self, window_size: int = 10):
        self.window_size = window_size
        self.lock = threading.Lock()
        
        # Rolling windows for different metrics
        self.voltage_window: deque = deque(maxlen=window_size)
        self.current_window: deque = deque(maxlen=window_size)
        self.speed_window: deque = deque(maxlen=window_size)
        self.accel_window: deque = deque(maxlen=window_size)
        self.gps_window: deque = deque(maxlen=window_size)
        
        # Latest analysis result
        self.latest_insight: Optional[Dict[str, Any]] = None
        self.insight_history: List[Dict[str, Any]] = []
        self.max_history_seconds = 300
        
        # Thresholds (can be tuned or learned)
        self.thresholds = {
            'voltage_sag_critical': 5.0,      # V drop is critical
            'voltage_sag_warning': 2.0,       # V drop is warning
            'voltage_min': 35.0,              # Below this is critical
            'voltage_max': 60.0,              # Above this is spike
            'current_spike': 50.0,            # A sudden spike
            'accel_impact': 3.0,              # G-force impact detection
            'freeze_threshold': 5,            # Same value for N samples
        }
    
    def _get_value(self, sample: Dict[str, Any], keys: List[str]) -> Optional[float]:
        """Get value from sample trying multiple possible key names"""
        for key in keys:
            if key in sample and sample[key] is not None:
                try:
                    return float(sample[key])
                except (TypeError, ValueError):
                    pass
        return None
    
    def _detect_freeze(self, window: deque) -> bool:
        """Detect if values are frozen (same value repeated)"""
        if len(window) < self.thresholds['freeze_threshold']:
            return False
        
        recent = list(window)[-self.thresholds['freeze_threshold']:]
        if not recent:
            return False
            
        return len(set(recent)) == 1
    
    def _compute_efficiency(self, sample: Dict[str, Any]) -> float:
        """Compute efficiency score 0-100"""
        score = 100.0
        
        # Voltage health (40% weight)
        voltage = self._get_value(sample, ['voltage', 'V_car_last', 'V_car_avg'])
        if voltage:
            if voltage < self.thresholds['voltage_min']:
                score -= 40
            elif voltage < 40:
                score -= 20
            elif voltage > self.thresholds['voltage_max']:
                score -= 30
        
        # Voltage sag (30% weight)
        sag = self._get_value(sample, ['V_car_sag', 'voltage_sag'])
        if sag:
            if sag > self.thresholds['voltage_sag_critical']:
                score -= 30
            elif sag > self.thresholds['voltage_sag_warning']:
                score -= 15
        
        # Current stability (20% weight)
        if len(self.current_window) >= 3:
            currents = list(self.current_window)
            variance = max(currents) - min(currents) if currents else 0
            if variance > 20:
                score -= 20
            elif variance > 10:
                score -= 10
        
        # Signal quality (10% weight)
        rssi = self._get_value(sample, ['rssi', 'RSSI'])
        if rssi and rssi < -80:
            score -= 10
        
        return max(0, min(100, score))
    
    def _compute_battery_risk(self, sample: Dict[str, Any]) -> str:
        """Compute battery risk level"""
        voltage = self._get_value(sample, ['voltage', 'V_car_last', 'V_car_avg'])
        sag = self._get_value(sample, ['V_car_sag', 'voltage_sag'])
        
        if voltage and voltage < self.thresholds['voltage_min']:
            return 'high'
        
        if sag and sag > self.thresholds['voltage_sag_critical']:
            return 'high'
        
        if sag and sag > self.thresholds['voltage_sag_warning']:
            return 'medium'
        
        if voltage and voltage < 40:
            return 'medium'
        
        return 'low'
    
    def analyze_sample(self, sample: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze a single telemetry sample and return insights.
        This is the main entry point - swap this logic for ML model later.
        """
        anomalies = []
        suggested_actions = []
        
        with self.lock:
            # Extract and store values in rolling windows
            voltage = self._get_value(sample, ['voltage', 'V_car_last', 'V_car_avg'])
            current = self._get_value(sample, ['current', 'I_car'])
            speed = self._get_value(sample, ['speed', 'Speed'])
            ax = self._get_value(sample, ['ax', 'accel_x'])
            ay = self._get_value(sample, ['ay', 'accel_y'])
            az = self._get_value(sample, ['az', 'accel_z'])
            gps_fix = sample.get('gps_fix', sample.get('GPS_fix'))
            sag = self._get_value(sample, ['V_car_sag', 'voltage_sag'])
            
            if voltage is not None:
                self.voltage_window.append(voltage)
            if current is not None:
                self.current_window.append(current)
            if speed is not None:
                self.speed_window.append(speed)
            if gps_fix is not None:
                self.gps_window.append(gps_fix)
            
            # Compute total acceleration
            if ax is not None and ay is not None and az is not None:
                total_accel = (ax**2 + ay**2 + az**2) ** 0.5
                self.accel_window.append(total_accel)
            
            # === ANOMALY DETECTION ===
            
            # 1. Voltage sag under load
            if sag and sag > self.thresholds['voltage_sag_critical']:
                anomalies.append(f"Critical voltage sag: {sag:.2f}V")
                suggested_actions.append("Reduce throttle immediately, check battery connections")
            elif sag and sag > self.thresholds['voltage_sag_warning']:
                anomalies.append(f"Voltage sag warning: {sag:.2f}V")
                suggested_actions.append("Monitor battery, consider reducing power in next sector")
            
            # 2. Voltage out of range
            if voltage and voltage < self.thresholds['voltage_min']:
                anomalies.append(f"Critical low voltage: {voltage:.1f}V")
                suggested_actions.append("Stop and check battery immediately")
            elif voltage and voltage > self.thresholds['voltage_max']:
                anomalies.append(f"Voltage spike detected: {voltage:.1f}V")
                suggested_actions.append("Check for regenerative braking issue or sensor error")
            
            # 3. Current spike
            if current and current > self.thresholds['current_spike']:
                anomalies.append(f"High current draw: {current:.1f}A")
                suggested_actions.append("Reduce acceleration, check motor efficiency")
            
            # 4. Impact/crash detection
            if self.accel_window and len(self.accel_window) > 0:
                latest_accel = self.accel_window[-1]
                if latest_accel > self.thresholds['accel_impact']:
                    anomalies.append(f"Impact detected: {latest_accel:.1f}G")
                    suggested_actions.append("Check vehicle, possible collision or bump")
            
            # 5. GPS fix lost
            if len(self.gps_window) >= 2:
                prev_fix = self.gps_window[-2] if len(self.gps_window) >= 2 else True
                curr_fix = self.gps_window[-1]
                if prev_fix and not curr_fix:
                    anomalies.append("GPS fix lost")
                    suggested_actions.append("Check GPS antenna, may affect position tracking")
            
            # 6. Sensor freeze detection
            if self._detect_freeze(self.voltage_window):
                anomalies.append("Voltage sensor may be frozen")
                suggested_actions.append("Check voltage sensor connection")
            
            if self._detect_freeze(self.speed_window):
                anomalies.append("Speed sensor may be frozen")
                suggested_actions.append("Check wheel speed sensor")
            
            # Compute derived metrics
            efficiency = self._compute_efficiency(sample)
            battery_risk = self._compute_battery_risk(sample)
            
            # Build insight object
            insight = {
                'timestamp': datetime.now().isoformat(),
                'sample_time': sample.get('server_time', datetime.now().isoformat()),
                'anomaly_flag': len(anomalies) > 0,
                'anomaly_count': len(anomalies),
                'anomaly_reasons': anomalies,
                'anomaly_reason': anomalies[0] if anomalies else None,
                'efficiency_score': round(efficiency, 1),
                'battery_risk_level': battery_risk,
                'suggested_actions': suggested_actions,
                'suggested_action': suggested_actions[0] if suggested_actions else "Systems nominal, maintain current strategy",
                'metrics_analyzed': {
                    'voltage': voltage,
                    'current': current,
                    'speed': speed,
                    'voltage_sag': sag,
                }
            }
            
            self.latest_insight = insight
            self.insight_history.append(insight)
            
            # Trim old history
            now = datetime.now().timestamp()
            cutoff = now - self.max_history_seconds
            self.insight_history = [
                i for i in self.insight_history
                if datetime.fromisoformat(i['timestamp']).timestamp() > cutoff
            ]
            
            return insight
    
    def get_latest(self) -> Optional[Dict[str, Any]]:
        """Get the most recent AI insight"""
        with self.lock:
            return self.latest_insight.copy() if self.latest_insight else None
    
    def get_history(self, seconds: int = 30) -> List[Dict[str, Any]]:
        """Get AI insights from the last N seconds"""
        with self.lock:
            now = datetime.now().timestamp()
            cutoff = now - seconds
            return [
                i.copy() for i in self.insight_history
                if datetime.fromisoformat(i['timestamp']).timestamp() > cutoff
            ]


# Singleton instance
_analyzer: Optional[TelemetryAIAnalyzer] = None


def get_analyzer() -> TelemetryAIAnalyzer:
    """Get or create the singleton AI analyzer"""
    global _analyzer
    if _analyzer is None:
        _analyzer = TelemetryAIAnalyzer()
    return _analyzer
