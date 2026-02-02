"""
CSV Reader Module - Efficiently reads new rows from telemetry CSV file
Supports tail-like behavior without re-reading entire file
"""

import os
import time
import csv
from typing import Dict, List, Optional, Any
from datetime import datetime
import threading


class TelemetryCSVReader:
    """
    Continuously monitors a CSV file and yields new rows as they appear.
    Uses file position tracking to avoid re-reading the entire file.
    """
    
    def __init__(self, csv_path: str = "logs/live_telemetry.csv"):
        self.csv_path = csv_path
        self.last_position = 0
        self.headers: List[str] = []
        self.latest_sample: Optional[Dict[str, Any]] = None
        self.history: List[Dict[str, Any]] = []
        self.max_history_seconds = 300  # Keep 5 minutes of history
        self.lock = threading.Lock()
        self._running = False
        self._thread: Optional[threading.Thread] = None
        
    def _parse_value(self, key: str, value: str) -> Any:
        """Convert string value to appropriate type"""
        if value == "" or value is None:
            return None
            
        value = value.strip()
        
        # Boolean fields
        if key.lower() in ['gps_fix', 'connected', 'armed']:
            return value.lower() in ['true', '1', 'yes']
        
        # Try float first (handles ints too)
        try:
            parsed = float(value)
            # Return int if it's a whole number and field suggests int
            if parsed.is_integer() and key.lower() in ['timestamp', 'time_ms', 'count', 'satellites']:
                return int(parsed)
            return parsed
        except ValueError:
            return value
    
    def _compute_derived_fields(self, sample: Dict[str, Any]) -> Dict[str, Any]:
        """Compute derived fields like power_w"""
        # Compute power if voltage and current exist
        voltage = sample.get('voltage') or sample.get('V_car_last') or sample.get('v_car')
        current = sample.get('current') or sample.get('I_car') or sample.get('i_car')
        
        if voltage is not None and current is not None:
            try:
                sample['power_w'] = float(voltage) * float(current)
            except (TypeError, ValueError):
                sample['power_w'] = None
        
        # Add server timestamp
        sample['server_time'] = datetime.now().isoformat()
        
        return sample
    
    def _read_new_rows(self) -> List[Dict[str, Any]]:
        """Read any new rows from the CSV file"""
        new_rows = []
        
        if not os.path.exists(self.csv_path):
            return new_rows
            
        try:
            with open(self.csv_path, 'r', newline='') as f:
                # If this is first read, get headers
                if not self.headers:
                    header_line = f.readline()
                    if header_line:
                        self.headers = [h.strip() for h in header_line.strip().split(',')]
                        self.last_position = f.tell()
                
                # Seek to last known position
                f.seek(self.last_position)
                
                # Read new lines
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    
                    values = line.split(',')
                    if len(values) != len(self.headers):
                        continue  # Skip malformed rows
                    
                    sample = {}
                    for i, header in enumerate(self.headers):
                        sample[header] = self._parse_value(header, values[i])
                    
                    sample = self._compute_derived_fields(sample)
                    new_rows.append(sample)
                
                self.last_position = f.tell()
                
        except Exception as e:
            print(f"Error reading CSV: {e}")
            
        return new_rows
    
    def update(self) -> List[Dict[str, Any]]:
        """
        Check for new rows and update internal state.
        Returns list of new samples.
        """
        new_rows = self._read_new_rows()
        
        with self.lock:
            for row in new_rows:
                self.latest_sample = row
                self.history.append(row)
            
            # Trim old history
            now = datetime.now()
            cutoff = now.timestamp() - self.max_history_seconds
            self.history = [
                s for s in self.history 
                if self._get_sample_time(s) > cutoff
            ]
        
        return new_rows
    
    def _get_sample_time(self, sample: Dict[str, Any]) -> float:
        """Extract timestamp from sample as unix timestamp"""
        # Try various timestamp field names
        for key in ['timestamp', 'time_recv_s', 'time_ms', 'server_time']:
            if key in sample and sample[key] is not None:
                val = sample[key]
                if isinstance(val, str):
                    try:
                        return datetime.fromisoformat(val).timestamp()
                    except:
                        pass
                elif isinstance(val, (int, float)):
                    # Assume milliseconds if > 1e12, else seconds
                    if val > 1e12:
                        return val / 1000
                    return val
        
        # Fallback to current time
        return datetime.now().timestamp()
    
    def get_latest(self) -> Optional[Dict[str, Any]]:
        """Get the most recent telemetry sample"""
        with self.lock:
            return self.latest_sample.copy() if self.latest_sample else None
    
    def get_history(self, seconds: int = 30) -> List[Dict[str, Any]]:
        """Get samples from the last N seconds"""
        with self.lock:
            now = datetime.now().timestamp()
            cutoff = now - seconds
            return [
                s.copy() for s in self.history 
                if self._get_sample_time(s) > cutoff
            ]
    
    def start_background_reader(self, interval: float = 0.1):
        """Start background thread that continuously reads new CSV rows"""
        if self._running:
            return
            
        self._running = True
        
        def reader_loop():
            while self._running:
                self.update()
                time.sleep(interval)
        
        self._thread = threading.Thread(target=reader_loop, daemon=True)
        self._thread.start()
        print(f"Started CSV reader thread for {self.csv_path}")
    
    def stop(self):
        """Stop the background reader"""
        self._running = False
        if self._thread:
            self._thread.join(timeout=1)


# Singleton instance
_reader: Optional[TelemetryCSVReader] = None


def get_reader(csv_path: str = "logs/live_telemetry.csv") -> TelemetryCSVReader:
    """Get or create the singleton CSV reader"""
    global _reader
    if _reader is None:
        _reader = TelemetryCSVReader(csv_path)
        _reader.start_background_reader()
    return _reader
