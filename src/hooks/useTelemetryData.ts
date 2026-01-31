import { useState, useEffect, useCallback } from "react";

interface TelemetryData {
  speed: number;
  voltage: number;
  power: number;
  rssi: number;
  snr: number;
  position: number;
  timestamp: Date;
}

interface HistoricalPoint {
  time: string;
  speed: number;
  optimal: number;
  voltage: number;
  power: number;
}

export function useTelemetryData() {
  const [currentData, setCurrentData] = useState<TelemetryData>({
    speed: 45.2,
    voltage: 12.4,
    power: 280,
    rssi: -55,
    snr: 22,
    position: 0,
    timestamp: new Date(),
  });

  const [historicalData, setHistoricalData] = useState<HistoricalPoint[]>([]);
  const [speedMapData, setSpeedMapData] = useState<{ position: number; speed: number }[]>([]);

  // Generate initial historical data
  useEffect(() => {
    const initialData: HistoricalPoint[] = [];
    const now = new Date();
    
    for (let i = 59; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 1000);
      const baseSpeed = 40 + Math.sin(i * 0.1) * 15;
      initialData.push({
        time: time.toLocaleTimeString("en-US", { hour12: false, minute: "2-digit", second: "2-digit" }),
        speed: baseSpeed + (Math.random() - 0.5) * 10,
        optimal: 48 + Math.sin(i * 0.1) * 12,
        voltage: 12 + Math.sin(i * 0.05) * 0.8 + (Math.random() - 0.5) * 0.3,
        power: 250 + Math.sin(i * 0.08) * 80 + (Math.random() - 0.5) * 30,
      });
    }
    
    setHistoricalData(initialData);

    // Initialize speed map data
    const mapData = [];
    for (let i = 0; i < 100; i += 5) {
      mapData.push({
        position: i,
        speed: 35 + Math.sin(i * 0.06) * 20 + Math.random() * 10,
      });
    }
    setSpeedMapData(mapData);
  }, []);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentData((prev) => {
        const newPosition = (prev.position + 0.5) % 100;
        const speedVariation = Math.sin(newPosition * 0.1) * 15;
        
        return {
          speed: Math.max(0, 40 + speedVariation + (Math.random() - 0.5) * 8),
          voltage: Math.max(10, Math.min(14.5, prev.voltage + (Math.random() - 0.5) * 0.2)),
          power: Math.max(100, Math.min(450, prev.power + (Math.random() - 0.5) * 30)),
          rssi: Math.max(-90, Math.min(-30, prev.rssi + (Math.random() - 0.5) * 5)),
          snr: Math.max(5, Math.min(35, prev.snr + (Math.random() - 0.5) * 2)),
          position: newPosition,
          timestamp: new Date(),
        };
      });

      // Update historical data
      setHistoricalData((prev) => {
        const now = new Date();
        const newPoint: HistoricalPoint = {
          time: now.toLocaleTimeString("en-US", { hour12: false, minute: "2-digit", second: "2-digit" }),
          speed: 40 + Math.sin(Date.now() * 0.001) * 15 + (Math.random() - 0.5) * 10,
          optimal: 48 + Math.sin(Date.now() * 0.001) * 12,
          voltage: 12 + Math.sin(Date.now() * 0.0005) * 0.8 + (Math.random() - 0.5) * 0.3,
          power: 250 + Math.sin(Date.now() * 0.0008) * 80 + (Math.random() - 0.5) * 30,
        };
        
        return [...prev.slice(1), newPoint];
      });

      // Update speed map data occasionally
      if (Math.random() < 0.1) {
        setSpeedMapData((prev) => {
          const newData = [...prev];
          const randomIndex = Math.floor(Math.random() * newData.length);
          newData[randomIndex] = {
            ...newData[randomIndex],
            speed: 35 + Math.sin(newData[randomIndex].position * 0.06) * 20 + Math.random() * 10,
          };
          return newData;
        });
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return {
    currentData,
    historicalData,
    speedMapData,
  };
}
