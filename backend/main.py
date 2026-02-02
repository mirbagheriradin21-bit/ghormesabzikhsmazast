"""
EVGP Telemetry Backend Server
FastAPI server that bridges CSV telemetry data to the Lovable dashboard
"""

import os
import asyncio
from datetime import datetime
from typing import Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sse_starlette.sse import EventSourceResponse

from csv_reader import get_reader, TelemetryCSVReader
from ai_analyzer import get_analyzer, TelemetryAIAnalyzer


# Configuration
CSV_PATH = os.environ.get("TELEMETRY_CSV_PATH", "logs/live_telemetry.csv")
HOST = os.environ.get("HOST", "0.0.0.0")
PORT = int(os.environ.get("PORT", "8000"))


# Global instances
reader: Optional[TelemetryCSVReader] = None
analyzer: Optional[TelemetryAIAnalyzer] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    global reader, analyzer
    
    print(f"Starting EVGP Telemetry Backend...")
    print(f"CSV Path: {CSV_PATH}")
    print(f"Server: http://{HOST}:{PORT}")
    
    # Initialize CSV reader and AI analyzer
    reader = get_reader(CSV_PATH)
    analyzer = get_analyzer()
    
    # Start background processing
    asyncio.create_task(process_telemetry_loop())
    
    yield
    
    # Cleanup
    if reader:
        reader.stop()
    print("Server shutdown complete")


app = FastAPI(
    title="EVGP Telemetry Backend",
    description="Real-time telemetry data bridge for Lovable dashboard",
    version="1.0.0",
    lifespan=lifespan
)


# CORS - Allow Lovable and localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",  # Allow all origins for demo
        "https://lovable.dev",
        "https://*.lovable.app",
        "http://localhost:*",
        "http://127.0.0.1:*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def process_telemetry_loop():
    """Background loop to process new telemetry and run AI analysis"""
    global reader, analyzer
    
    last_sample_time = None
    
    while True:
        try:
            if reader and analyzer:
                latest = reader.get_latest()
                
                # Only analyze if we have new data
                if latest:
                    sample_time = latest.get('server_time')
                    if sample_time != last_sample_time:
                        analyzer.analyze_sample(latest)
                        last_sample_time = sample_time
            
            await asyncio.sleep(0.1)  # 10Hz processing
            
        except Exception as e:
            print(f"Error in telemetry processing loop: {e}")
            await asyncio.sleep(1)


# =============================================================================
# HEALTH & STATUS ENDPOINTS
# =============================================================================

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "server_time": datetime.now().isoformat(),
        "csv_path": CSV_PATH,
        "csv_exists": os.path.exists(CSV_PATH),
    }


@app.get("/status")
async def status():
    """Detailed status endpoint"""
    history_count = len(reader.history) if reader else 0
    insight_count = len(analyzer.insight_history) if analyzer else 0
    
    return {
        "status": "running",
        "server_time": datetime.now().isoformat(),
        "csv_path": CSV_PATH,
        "csv_exists": os.path.exists(CSV_PATH),
        "telemetry_samples_in_memory": history_count,
        "ai_insights_in_memory": insight_count,
        "csv_headers": reader.headers if reader else [],
    }


# =============================================================================
# TELEMETRY DATA ENDPOINTS
# =============================================================================

@app.get("/latest")
async def get_latest_telemetry():
    """Get the most recent telemetry sample"""
    if not reader:
        return JSONResponse(
            status_code=503,
            content={"error": "Reader not initialized"}
        )
    
    latest = reader.get_latest()
    
    if not latest:
        return JSONResponse(
            status_code=404,
            content={"error": "No telemetry data available yet"}
        )
    
    return latest


@app.get("/history")
async def get_telemetry_history(seconds: int = Query(default=30, ge=1, le=300)):
    """Get telemetry samples from the last N seconds"""
    if not reader:
        return JSONResponse(
            status_code=503,
            content={"error": "Reader not initialized"}
        )
    
    history = reader.get_history(seconds)
    
    return {
        "count": len(history),
        "seconds": seconds,
        "samples": history
    }


@app.get("/stream")
async def stream_telemetry():
    """
    Server-Sent Events stream for real-time telemetry updates.
    Connect with EventSource in the browser.
    """
    async def event_generator():
        last_time = None
        
        while True:
            try:
                if reader:
                    latest = reader.get_latest()
                    
                    if latest:
                        current_time = latest.get('server_time')
                        
                        if current_time != last_time:
                            last_time = current_time
                            yield {
                                "event": "telemetry",
                                "data": str(latest).replace("'", '"')
                            }
                
                await asyncio.sleep(0.1)  # 10Hz updates
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                print(f"Stream error: {e}")
                await asyncio.sleep(1)
    
    return EventSourceResponse(event_generator())


# =============================================================================
# AI ANALYSIS ENDPOINTS
# =============================================================================

@app.get("/ai/latest")
async def get_latest_ai_insight():
    """Get the most recent AI analysis insight"""
    if not analyzer:
        return JSONResponse(
            status_code=503,
            content={"error": "AI Analyzer not initialized"}
        )
    
    latest = analyzer.get_latest()
    
    if not latest:
        return JSONResponse(
            status_code=404,
            content={"error": "No AI insights available yet"}
        )
    
    return latest


@app.get("/ai/history")
async def get_ai_history(seconds: int = Query(default=30, ge=1, le=300)):
    """Get AI insights from the last N seconds"""
    if not analyzer:
        return JSONResponse(
            status_code=503,
            content={"error": "AI Analyzer not initialized"}
        )
    
    history = analyzer.get_history(seconds)
    
    return {
        "count": len(history),
        "seconds": seconds,
        "insights": history
    }


@app.get("/ai/stream")
async def stream_ai_insights():
    """
    Server-Sent Events stream for real-time AI insights.
    """
    async def event_generator():
        last_time = None
        
        while True:
            try:
                if analyzer:
                    latest = analyzer.get_latest()
                    
                    if latest:
                        current_time = latest.get('timestamp')
                        
                        if current_time != last_time:
                            last_time = current_time
                            yield {
                                "event": "insight",
                                "data": str(latest).replace("'", '"')
                            }
                
                await asyncio.sleep(0.2)  # 5Hz updates for AI
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                print(f"AI Stream error: {e}")
                await asyncio.sleep(1)
    
    return EventSourceResponse(event_generator())


# =============================================================================
# MAIN
# =============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=HOST, port=PORT)
