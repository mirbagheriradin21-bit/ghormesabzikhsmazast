import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { primaryTelemetryData, PrimaryTelemetryRow, computePower, analyzePrimaryRow } from '@/data/primaryTelemetryData';
import { secondaryVoltageData, SecondaryVoltageRow, analyzeVoltageRow } from '@/data/secondaryVoltageData';

interface ConnectionContextType {
  // Connection states
  isPrimaryConnected: boolean;
  isSecondaryConnected: boolean;
  
  // Streaming data
  primaryStreamData: (PrimaryTelemetryRow & { power_w: number; aiAnalysis: string; status: string })[];
  secondaryStreamData: (SecondaryVoltageRow & { aiAnalysis: string; status: string })[];
  
  // Current sample (latest)
  currentPrimarySample: (PrimaryTelemetryRow & { power_w: number; aiAnalysis: string; status: string }) | null;
  currentSecondarySample: (SecondaryVoltageRow & { aiAnalysis: string; status: string }) | null;
  
  // Stream progress
  primaryStreamIndex: number;
  secondaryStreamIndex: number;
  
  // Monte Carlo simulation value (only after primary connection)
  monteCarloValue: number | null;
  
  // Track position (0-100, animates over 36.3 seconds)
  trackPosition: number;
  
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
  
  const [primaryStreamData, setPrimaryStreamData] = useState<(PrimaryTelemetryRow & { power_w: number; aiAnalysis: string; status: string })[]>([]);
  const [secondaryStreamData, setSecondaryStreamData] = useState<(SecondaryVoltageRow & { aiAnalysis: string; status: string })[]>([]);
  
  const [primaryStreamIndex, setPrimaryStreamIndex] = useState(0);
  const [secondaryStreamIndex, setSecondaryStreamIndex] = useState(0);
  
  const [monteCarloValue, setMonteCarloValue] = useState<number | null>(null);
  const [trackPosition, setTrackPosition] = useState(0);
  
  const primaryIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const secondaryIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const trackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const currentPrimarySample = primaryStreamData.length > 0 ? primaryStreamData[primaryStreamData.length - 1] : null;
  const currentSecondarySample = secondaryStreamData.length > 0 ? secondaryStreamData[secondaryStreamData.length - 1] : null;
  
  // Cleanup on unmount
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
    
    // Generate Monte Carlo value (random integer 2000-13000)
    const mcValue = Math.floor(Math.random() * (13000 - 2000 + 1)) + 2000;
    setMonteCarloValue(mcValue);
    
    // Start streaming primary data (one sample every 500ms for smooth effect)
    let index = 0;
    primaryIntervalRef.current = setInterval(() => {
      if (index < primaryTelemetryData.length) {
        const row = primaryTelemetryData[index];
        const { analysis, status } = analyzePrimaryRow(row);
        const enrichedRow = {
          ...row,
          power_w: computePower(row),
          aiAnalysis: analysis,
          status,
        };
        
        setPrimaryStreamData(prev => [...prev, enrichedRow]);
        setPrimaryStreamIndex(index + 1);
        index++;
      } else {
        // Loop back to beginning for continuous streaming
        index = 0;
        setPrimaryStreamData([]);
      }
    }, 500);
    
    // Start track animation (36.3 seconds for full lap = 100%)
    const lapDuration = 36300; // 36.3 seconds in ms
    const updateInterval = 100; // Update every 100ms
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
    
    // Start streaming secondary voltage data
    let index = 0;
    secondaryIntervalRef.current = setInterval(() => {
      if (index < secondaryVoltageData.length) {
        const row = secondaryVoltageData[index];
        const { analysis, status } = analyzeVoltageRow(row);
        const enrichedRow = {
          ...row,
          aiAnalysis: analysis,
          status,
        };
        
        setSecondaryStreamData(prev => [...prev, enrichedRow]);
        setSecondaryStreamIndex(index + 1);
        index++;
      } else {
        // Loop back
        index = 0;
        setSecondaryStreamData([]);
      }
    }, 500);
    
  }, [isSecondaryConnected]);
  
  const disconnectPrimary = useCallback(() => {
    if (primaryIntervalRef.current) {
      clearInterval(primaryIntervalRef.current);
      primaryIntervalRef.current = null;
    }
    if (trackIntervalRef.current) {
      clearInterval(trackIntervalRef.current);
      trackIntervalRef.current = null;
    }
    setIsPrimaryConnected(false);
    setPrimaryStreamData([]);
    setPrimaryStreamIndex(0);
    setMonteCarloValue(null);
    setTrackPosition(0);
  }, []);
  
  const disconnectSecondary = useCallback(() => {
    if (secondaryIntervalRef.current) {
      clearInterval(secondaryIntervalRef.current);
      secondaryIntervalRef.current = null;
    }
    setIsSecondaryConnected(false);
    setSecondaryStreamData([]);
    setSecondaryStreamIndex(0);
  }, []);
  
  return (
    <ConnectionContext.Provider value={{
      isPrimaryConnected,
      isSecondaryConnected,
      primaryStreamData,
      secondaryStreamData,
      currentPrimarySample,
      currentSecondarySample,
      primaryStreamIndex,
      secondaryStreamIndex,
      monteCarloValue,
      trackPosition,
      connectPrimary,
      connectSecondary,
      disconnectPrimary,
      disconnectSecondary,
    }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnection must be used within a ConnectionProvider');
  }
  return context;
}
