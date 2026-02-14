import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { primaryTelemetryData, PrimaryTelemetryRow, computePower } from '@/data/primaryTelemetryData';
import { secondaryVoltageData, SecondaryVoltageRow, analyzeVoltageRow } from '@/data/secondaryVoltageData';
import { AIStrategyEngine, AIInsight, AnomalyAlert } from '@/engine/aiStrategyEngine';

interface EnrichedPrimaryRow extends PrimaryTelemetryRow {
  power_w: number;
  aiAnalysis: string;
  status: 'normal' | 'warning' | 'critical' | 'optimal';
}

interface ConnectionContextType {
  isPrimaryConnected: boolean;
  isSecondaryConnected: boolean;
  primaryStreamData: EnrichedPrimaryRow[];
  secondaryStreamData: (SecondaryVoltageRow & { aiAnalysis: string; status: string })[];
  currentPrimarySample: EnrichedPrimaryRow | null;
  currentSecondarySample: (SecondaryVoltageRow & { aiAnalysis: string; status: string }) | null;
  primaryStreamIndex: number;
  secondaryStreamIndex: number;
  monteCarloValue: number | null;
  trackPosition: number;
  // AI Engine outputs
  currentInsight: AIInsight | null;
  insightHistory: AIInsight[];
  anomalyAlerts: AnomalyAlert[];
  // Backend bridging
  backendConnected: boolean;
  backendUrl: string;
  setBackendUrl: (url: string) => void;
  // Actions
  connectPrimary: () => void;
  connectSecondary: () => void;
  disconnectPrimary: () => void;
  disconnectSecondary: () => void;
}

const ConnectionContext = createContext<ConnectionContextType | null>(null);

export function ConnectionProvider({ children }: { children: React.ReactNode }) {
  const [isPrimaryConnected, setIsPrimaryConnected] = useState(false);
  const [isSecondaryConnected, setIsSecondaryConnected] = useState(false);
  const [primaryStreamData, setPrimaryStreamData] = useState<EnrichedPrimaryRow[]>([]);
  const [secondaryStreamData, setSecondaryStreamData] = useState<(SecondaryVoltageRow & { aiAnalysis: string; status: string })[]>([]);
  const [primaryStreamIndex, setPrimaryStreamIndex] = useState(0);
  const [secondaryStreamIndex, setSecondaryStreamIndex] = useState(0);
  const [monteCarloValue, setMonteCarloValue] = useState<number | null>(null);
  const [trackPosition, setTrackPosition] = useState(0);
  const [currentInsight, setCurrentInsight] = useState<AIInsight | null>(null);
  const [insightHistory, setInsightHistory] = useState<AIInsight[]>([]);
  const [anomalyAlerts, setAnomalyAlerts] = useState<AnomalyAlert[]>([]);
  const [backendUrl, setBackendUrlState] = useState('http://localhost:8000');
  const [backendConnected, setBackendConnected] = useState(false);
  const primaryIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const secondaryIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const trackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const healthIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const aiEngineRef = useRef<AIStrategyEngine>(new AIStrategyEngine());

  const currentPrimarySample = primaryStreamData.length > 0 ? primaryStreamData[primaryStreamData.length - 1] : null;
  const currentSecondarySample = secondaryStreamData.length > 0 ? secondaryStreamData[secondaryStreamData.length - 1] : null;

  // Poll backend health every 3 seconds
  useEffect(() => {
    const checkHealth = () => {
      fetch(`${backendUrl}/health`, { signal: AbortSignal.timeout(2000) })
        .then(r => { if (r.ok) setBackendConnected(true); else setBackendConnected(false); })
        .catch(() => setBackendConnected(false));
    };
    checkHealth();
    healthIntervalRef.current = setInterval(checkHealth, 3000);
    return () => {
      if (healthIntervalRef.current) clearInterval(healthIntervalRef.current);
    };
  }, [backendUrl]);

  useEffect(() => {
    return () => {
      if (primaryIntervalRef.current) clearInterval(primaryIntervalRef.current);
      if (secondaryIntervalRef.current) clearInterval(secondaryIntervalRef.current);
      if (trackIntervalRef.current) clearInterval(trackIntervalRef.current);
    };
  }, []);

  const connectPrimary = useCallback(() => {
    if (isPrimaryConnected) return;
    setIsPrimaryConnected(true);
    setPrimaryStreamData([]);
    setPrimaryStreamIndex(0);
    setTrackPosition(0);
    setInsightHistory([]);
    setAnomalyAlerts([]);
    setCurrentInsight(null);

    // Reset AI engine
    aiEngineRef.current.reset();

    // Monte Carlo value
    const mcValue = Math.floor(Math.random() * (13000 - 2000 + 1)) + 2000;
    setMonteCarloValue(mcValue);

    let index = 0;
    primaryIntervalRef.current = setInterval(() => {
      if (index < primaryTelemetryData.length) {
        const row = primaryTelemetryData[index];
        
        // Run AI engine on this sample
        const insight = aiEngineRef.current.processSample(row);
        
        const enrichedRow: EnrichedPrimaryRow = {
          ...row,
          power_w: computePower(row),
          aiAnalysis: insight.suggested_action,
          status: insight.severity === 'critical' ? 'critical' : 
                  insight.anomaly_flag ? 'warning' : 
                  insight.efficiency_score > 80 ? 'optimal' : 'normal',
        };

        setPrimaryStreamData(prev => [...prev, enrichedRow]);
        setPrimaryStreamIndex(index + 1);
        setCurrentInsight(insight);
        setInsightHistory(prev => [...prev.slice(-99), insight]);
        setAnomalyAlerts(aiEngineRef.current.getAlerts());
        index++;
      } else {
        // Loop
        index = 0;
        setPrimaryStreamData([]);
        aiEngineRef.current.reset();
      }
    }, 500);

    // Track animation (2 minute lap = 120s)
    const lapDuration = 120000;
    const updateInterval = 100;
    const positionIncrement = (100 / lapDuration) * updateInterval;
    trackIntervalRef.current = setInterval(() => {
      setTrackPosition(prev => {
        const newPos = prev + positionIncrement;
        return newPos >= 100 ? 0 : newPos;
      });
    }, updateInterval);
  }, [isPrimaryConnected]);

  const connectSecondary = useCallback(() => {
    if (isSecondaryConnected) return;
    setIsSecondaryConnected(true);
    setSecondaryStreamData([]);
    setSecondaryStreamIndex(0);

    let index = 0;
    secondaryIntervalRef.current = setInterval(() => {
      if (index < secondaryVoltageData.length) {
        const row = secondaryVoltageData[index];
        const { analysis, status } = analyzeVoltageRow(row);
        setSecondaryStreamData(prev => [...prev, { ...row, aiAnalysis: analysis, status }]);
        setSecondaryStreamIndex(index + 1);
        index++;
      } else {
        index = 0;
        setSecondaryStreamData([]);
      }
    }, 500);
  }, [isSecondaryConnected]);

  const disconnectPrimary = useCallback(() => {
    if (primaryIntervalRef.current) clearInterval(primaryIntervalRef.current);
    if (trackIntervalRef.current) clearInterval(trackIntervalRef.current);
    primaryIntervalRef.current = null;
    trackIntervalRef.current = null;
    setIsPrimaryConnected(false);
    setPrimaryStreamData([]);
    setPrimaryStreamIndex(0);
    setMonteCarloValue(null);
    setTrackPosition(0);
    setCurrentInsight(null);
    setInsightHistory([]);
    setAnomalyAlerts([]);
  }, []);

  const disconnectSecondary = useCallback(() => {
    if (secondaryIntervalRef.current) clearInterval(secondaryIntervalRef.current);
    secondaryIntervalRef.current = null;
    setIsSecondaryConnected(false);
    setSecondaryStreamData([]);
    setSecondaryStreamIndex(0);
  }, []);

  const setBackendUrl = useCallback((url: string) => {
    setBackendUrlState(url);
    // Try to connect to backend
    fetch(`${url}/health`, { signal: AbortSignal.timeout(2000) })
      .then(r => { if (r.ok) setBackendConnected(true); else setBackendConnected(false); })
      .catch(() => setBackendConnected(false));
  }, []);

  return (
    <ConnectionContext.Provider value={{
      isPrimaryConnected, isSecondaryConnected,
      primaryStreamData, secondaryStreamData,
      currentPrimarySample, currentSecondarySample,
      primaryStreamIndex, secondaryStreamIndex,
      monteCarloValue, trackPosition,
      currentInsight, insightHistory, anomalyAlerts,
      backendConnected, backendUrl, setBackendUrl,
      connectPrimary, connectSecondary, disconnectPrimary, disconnectSecondary,
    }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  const context = useContext(ConnectionContext);
  if (!context) throw new Error('useConnection must be used within a ConnectionProvider');
  return context;
}
