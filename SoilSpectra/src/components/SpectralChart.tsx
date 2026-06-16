import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import type { SoilSample } from '../services/api';

interface SpectralChartProps {
  sample: SoilSample | null;
  compareSample?: SoilSample | null;
}

const WavelengthInfo: Record<string, { name: string, color: string, desc: string }> = {
  "940": { name: "940nm", color: "rgba(59, 130, 246, 0.2)", desc: "Moisture/Water absorption" },
  "1020": { name: "1020nm", color: "rgba(16, 185, 129, 0.2)", desc: "Nitrogen-Hydrogen (N-H) bonds. Dips indicate higher Nitrogen." },
  "1200": { name: "1200nm", color: "rgba(245, 158, 11, 0.2)", desc: "Organic matter & Carbon." },
  "1300": { name: "1300nm", color: "rgba(148, 163, 184, 0.2)", desc: "Stable reference line." },
  "1550": { name: "1550nm", color: "rgba(16, 185, 129, 0.2)", desc: "Nitrogen absorption dip." },
  "1650": { name: "1650nm", color: "rgba(245, 158, 11, 0.2)", desc: "Carbon absorption dip." },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const info = WavelengthInfo[label];
    return (
      <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '0.5rem', maxWidth: '250px' }}>
        <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--text-primary)' }}>{label} nm</p>
        <p style={{ margin: '0.5rem 0', color: 'var(--primary)' }}>Reflectance: {payload[0].value}</p>
        {info && (
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {info.desc}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export const SpectralChart: React.FC<SpectralChartProps> = ({ sample, compareSample }) => {
  const data = useMemo(() => {
    if (!sample) return [];
    
    const wavelengths = ["940", "1020", "1200", "1300", "1550", "1650"];
    return wavelengths.map(wl => {
      const point: any = { wavelength: wl, reflectance: sample.reflectance[wl as keyof typeof sample.reflectance] };
      if (compareSample) {
        point.compareReflectance = compareSample.reflectance[wl as keyof typeof compareSample.reflectance];
      }
      return point;
    });
  }, [sample, compareSample]);

  if (!sample) {
    return (
      <div className="widget" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>No sample selected.</p>
      </div>
    );
  }

  // Create ReferenceAreas based on the WavelengthInfo colors.
  // Recharts XAxis uses strings for categorical data in this case.
  // We can simulate bands by placing ReferenceAreas between midpoints if it was continuous, 
  // but with categorical string labels, ReferenceArea x1=x2 highlights the specific band if we adjust width,
  // or we can just let it highlight the category. Let's use x1 and x2 to span the category visually, 
  // or just background rectangles. 
  // An easier way to do categorical ReferenceArea is to just span from one point to the next, 
  // but since they are discrete points, we'll try x1=label x2=label.

  return (
    <div className="widget" style={{ height: '100%', minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ marginBottom: '1rem' }}>Spectral Reflectance Curve</h3>
      <div style={{ flex: 1, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="wavelength" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
            <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            
            {/* Draw Reference areas for background bands */}
            {data.map((d, i) => (
              <ReferenceArea 
                key={i}
                x1={d.wavelength} 
                x2={d.wavelength} 
                fill={WavelengthInfo[d.wavelength]?.color || 'transparent'} 
                fillOpacity={1}
              />
            ))}

            {compareSample && (
              <Line 
                type="monotone" 
                dataKey="compareReflectance" 
                stroke="var(--text-secondary)" 
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={{ fill: 'var(--surface-color)', strokeWidth: 2 }} 
                activeDot={false}
                name={`Reference (${compareSample.soil_texture})`}
              />
            )}
            
            <Line 
              type="monotone" 
              dataKey="reflectance" 
              stroke="var(--primary)" 
              strokeWidth={3}
              dot={{ fill: 'var(--surface-color)', strokeWidth: 2, r: 6 }} 
              activeDot={{ r: 8, stroke: 'var(--primary)', strokeWidth: 2, fill: '#fff' }}
              name={`Sample #${sample.id}`}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
