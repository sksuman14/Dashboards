import React from 'react';
import type { SoilSample } from '../services/api';

interface HistoryFeedProps {
  samples: SoilSample[];
  activeSampleId: number | null;
  onSelectSample: (sample: SoilSample) => void;
  isLoading: boolean;
}

export const HistoryFeed: React.FC<HistoryFeedProps> = ({ samples, activeSampleId, onSelectSample, isLoading }) => {
  return (
    <div className="widget" style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '800px' }}>
      <h3 style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
        Scan History
      </h3>
      
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading history...
          </div>
        ) : samples.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No samples found.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {samples.map(sample => (
              <div 
                key={sample.id}
                onClick={() => onSelectSample(sample)}
                style={{
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  border: `1px solid ${activeSampleId === sample.id ? 'var(--primary)' : 'var(--glass-border)'}`,
                  background: activeSampleId === sample.id ? 'rgba(59, 130, 246, 0.1)' : 'var(--surface-color-hover)',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>Sample #{sample.id}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{sample.region_name}</span>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                  <div><span style={{ color: 'var(--text-secondary)' }}>Type:</span> <span style={{ color: 'var(--warning)', fontWeight: 500 }}>{sample.soil_texture}</span></div>
                  <div><span style={{ color: 'var(--text-secondary)' }}>NPK:</span> <span style={{ color: 'var(--accent)' }}>{sample.npk_ratio}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
