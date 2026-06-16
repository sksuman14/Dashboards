import React, { useState, useEffect } from 'react';
import { fetchSoilData, type SoilSample } from '../services/api';
import { SpectralChart } from './SpectralChart';
import { NutrientDials } from './NutrientDials';
import { SoilHealthCard } from './SoilHealthCard';
import { HistoryFeed } from './HistoryFeed';

export const AnalyticsView: React.FC = () => {
  const [samples, setSamples] = useState<SoilSample[]>([]);
  const [activeSample, setActiveSample] = useState<SoilSample | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("Faridabad");
  const regions = ["All", "Faridabad", "Uttar Pradesh", "Rajasthan", "Punjab", "Meerut", "Himachal Pradesh", "Haryana"];

  useEffect(() => {
    // Initial fetch
    const loadData = async () => {
      try {
        setIsLoading(true);
        const params: any = { limit: 50 };
        if (selectedRegion !== "All") {
          params.region = selectedRegion;
        }
        const res = await fetchSoilData(params);
        setSamples(res.samples);
        if (res.samples.length > 0) {
          setActiveSample(res.samples[0]);
        } else {
          setActiveSample(null);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [selectedRegion]);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      
      {/* Top Controls / Hero */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Live Analytics</h2>
        <select 
          value={selectedRegion} 
          onChange={(e) => setSelectedRegion(e.target.value)}
          style={{ 
            padding: '0.5rem 1rem', 
            borderRadius: '0.5rem', 
            background: 'var(--surface-color)', 
            color: 'var(--text-primary)', 
            border: '1px solid var(--border-color)' 
          }}
        >
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', flex: 1, minHeight: 0 }}>
        
        {/* Analysis Core (Left) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '-0.5rem' }}>
            <h3 style={{ margin: 0 }}>Spectral & Chemical Analysis</h3>
          </div>

          <SpectralChart 
            sample={activeSample} 
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <NutrientDials 
              N={activeSample?.N || 0} 
              P={activeSample?.P || 0} 
              K={activeSample?.K || 0} 
            />
            <SoilHealthCard sample={activeSample} />
          </div>

        </div>

        {/* History Feed (Right) */}
        <div style={{ height: '100%' }}>
          <HistoryFeed 
            samples={samples} 
            activeSampleId={activeSample?.id || null} 
            onSelectSample={setActiveSample}
            isLoading={isLoading}
          />
        </div>

      </div>
    </div>
  );
};
