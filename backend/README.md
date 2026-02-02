# EVGP Telemetry Backend

FastAPI backend server that bridges your CSV telemetry data to the Lovable dashboard.

## Quick Start (macOS)

### 1. Install Python dependencies

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Create the logs directory

```bash
mkdir -p logs
```

### 3. Set your CSV path (optional)

By default, the server looks for `logs/live_telemetry.csv`. To change:

```bash
export TELEMETRY_CSV_PATH="/path/to/your/telemetry.csv"
```

### 4. Start the server

```bash
python main.py
```

Or with uvicorn directly:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The server will start at `http://localhost:8000`

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check with server time |
| `GET /status` | Detailed server status |
| `GET /latest` | Most recent telemetry sample |
| `GET /history?seconds=30` | Telemetry from last N seconds |
| `GET /stream` | SSE stream of live telemetry |
| `GET /ai/latest` | Most recent AI insight |
| `GET /ai/history?seconds=30` | AI insights from last N seconds |
| `GET /ai/stream` | SSE stream of AI insights |

## CSV Format

Your CSV should have a header row. Example columns:

```csv
timestamp,voltage,current,ax,ay,az,speed,lat,lon,rssi,snr,gps_fix
1234567890,45.2,12.5,0.1,-0.05,1.02,35.5,25.1234,55.4321,-65,22,true
```

The backend handles:
- Missing fields gracefully
- Type conversion (floats, ints, bools)
- Computed fields (power_w = voltage × current)

## Connecting to Lovable Dashboard

1. Start this backend on your laptop
2. Find your local IP: `ifconfig | grep "inet "`
3. In the Lovable dashboard, set the backend URL to `http://YOUR_IP:8000`
4. The dashboard will auto-detect the backend and switch from demo mode

## Testing

Check if server is running:

```bash
curl http://localhost:8000/health
```

Get latest telemetry:

```bash
curl http://localhost:8000/latest
```

## Troubleshooting

**CSV not found**: Make sure the file exists at the expected path

**CORS errors**: The server allows all origins by default for demo

**No data**: Check that your logger is actively writing to the CSV

## AI Analyzer

The AI module (`ai_analyzer.py`) processes telemetry one sample at a time and detects:

- Voltage sag under load
- Voltage out of range
- Current spikes
- Impact/crash (acceleration)
- GPS fix lost
- Sensor freeze

To swap in your own ML model:

```python
# In ai_analyzer.py
import joblib

class TelemetryAIAnalyzer:
    def __init__(self):
        self.model = joblib.load('your_model.pkl')
    
    def analyze_sample(self, sample):
        features = self._extract_features(sample)
        prediction = self.model.predict([features])[0]
        return prediction
```
