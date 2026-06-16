import React from 'react';
import type { SoilSample } from '../services/api';

interface SoilHealthCardProps {
  sample: SoilSample | null;
}

export const SoilHealthCard: React.FC<SoilHealthCardProps> = ({ sample }) => {
  if (!sample) {
    return (
      <div className="widget" style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Select a sample to view health card</p>
      </div>
    );
  }

  // Calculate a mock Soil Quality Index (SQI) based on N, P, K and pH
  // Optimal pH: 6.0 - 7.5
  const phScore = sample.pH >= 6.0 && sample.pH <= 7.5 ? 1 : 0.5;
  const nScore = sample.N > 100 ? 1 : sample.N / 100;
  const pScore = sample.P > 100 ? 1 : sample.P / 100;
  const kScore = sample.K > 150 ? 1 : sample.K / 150;
  
  const sqi = ((phScore + nScore + pScore + kScore) / 4).toFixed(2);
  const sqiValue = parseFloat(sqi);

  let healthStatus = "Needs Amendment";
  let statusColor = "var(--danger)";
  if (sqiValue >= 0.75) {
    healthStatus = "Excellent";
    statusColor = "var(--accent)";
  } else if (sqiValue >= 0.5) {
    healthStatus = "Moderate";
    statusColor = "var(--warning)";
  }

  // Generate dynamic advice
  let advice = "Soil is healthy. Maintain current practices.";
  if (sample.N < 50) {
    advice = "Low Nitrogen detected. Recommended: Add Nitrogen-rich fertilizers like Urea.";
  } else if (sample.P < 40) {
    advice = "Low Phosphorus detected. Consider adding DAP or SSP.";
  } else if (sample.pH < 5.5) {
    advice = "Soil is too acidic. Consider applying agricultural lime.";
  }

  return (
    <div className="widget" style={{ 
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
      border: `1px solid ${statusColor}`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background element */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: statusColor,
        opacity: 0.1,
        filter: 'blur(30px)'
      }} />

      <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
        <span>Digital Soil Health Card</span>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>ID: #{sample.id}</span>
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Soil Quality Index (SQI)</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: statusColor }}>{sqi}</div>
          <div style={{ fontSize: '0.875rem', fontWeight: 'bold', color: statusColor }}>{healthStatus}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Textural Class</div>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '0.5rem 1rem', 
            background: 'rgba(245, 158, 11, 0.1)', 
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '0.5rem',
            color: 'var(--warning)',
            fontWeight: 'bold',
            marginTop: '0.25rem'
          }}>
            {sample.soil_texture}
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            pH Level: <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{sample.pH}</span>
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem', borderLeft: `4px solid ${statusColor}` }}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.25rem', fontWeight: 'bold' }}>
          Agronomy Advice
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
          {advice}
        </div>
      </div>
    </div>
  );
};
