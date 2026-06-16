import React from 'react';

interface NutrientDialsProps {
  N: number;
  P: number;
  K: number;
}

const Dial = ({ label, value, max, color }: { label: string, value: number, max: number, color: string }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / max) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="var(--surface-color-hover)"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
        <text
          x="50"
          y="55"
          fill="var(--text-primary)"
          fontSize="18"
          fontWeight="bold"
          textAnchor="middle"
        >
          {value}
        </text>
      </svg>
      <div style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>{label}</div>
    </div>
  );
};

export const NutrientDials: React.FC<NutrientDialsProps> = ({ N, P, K }) => {
  // Max values for scaling (rough estimates, can be adjusted)
  const MAX_N = 200;
  const MAX_P = 200;
  const MAX_K = 300;

  // Threshold colors
  const getColor = (val: number, max: number) => {
    const ratio = val / max;
    if (ratio < 0.3) return 'var(--danger)'; // Red
    if (ratio < 0.7) return 'var(--warning)'; // Yellow
    return 'var(--accent)'; // Green
  };

  return (
    <div className="widget" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center', padding: '2rem', gap: '1rem' }}>
      <Dial label="Nitrogen (N)" value={N} max={MAX_N} color={getColor(N, MAX_N)} />
      <Dial label="Phosphorus (P)" value={P} max={MAX_P} color={getColor(P, MAX_P)} />
      <Dial label="Potassium (K)" value={K} max={MAX_K} color={getColor(K, MAX_K)} />
    </div>
  );
};
