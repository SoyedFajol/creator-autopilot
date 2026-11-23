import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandColors, BrandFonts } from '@creator-autopilot/core';

export interface AnimatedChartProps {
  type: 'bar' | 'line' | 'metric_card';
  title?: string;
  labels: string[];
  values: number[];
  unit?: string;
  colors: BrandColors;
  fonts: BrandFonts;
}

export const AnimatedChart: React.FC<AnimatedChartProps> = ({
  type,
  title,
  labels,
  values,
  unit = '',
  colors,
  fonts,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: { damping: 16, mass: 0.8 },
  });

  const maxValue = Math.max(...values, 1);

  return (
    <div
      style={{
        backgroundColor: colors.background,
        border: `3px solid ${colors.primary}`,
        borderRadius: '24px',
        padding: '36px',
        width: '80%',
        maxWidth: '1000px',
        margin: 'auto',
        boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
        fontFamily: fonts.body,
      }}
    >
      {title && (
        <h3
          style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: colors.primary,
            margin: '0 0 28px 0',
            fontFamily: fonts.heading,
            textAlign: 'center',
          }}
        >
          {title}
        </h3>
      )}

      {type === 'bar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {labels.map((label, idx) => {
            const rawVal = values[idx] || 0;
            const currentVal = Math.round(rawVal * progress);
            const barWidthPercent = (rawVal / maxValue) * 100 * progress;

            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '24px', fontWeight: 600 }}>
                  <span>{label}</span>
                  <span style={{ color: colors.primary }}>
                    {unit}
                    {currentVal}
                  </span>
                </div>
                <div
                  style={{
                    height: '28px',
                    backgroundColor: 'rgba(0,0,0,0.06)',
                    borderRadius: '14px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${barWidthPercent}%`,
                      backgroundColor: idx === 0 ? colors.accent : colors.primary,
                      borderRadius: '14px',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {type === 'metric_card' && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${labels.length}, 1fr)`, gap: '20px' }}>
          {labels.map((label, idx) => (
            <div
              key={idx}
              style={{
                textAlign: 'center',
                padding: '24px',
                borderRadius: '16px',
                backgroundColor: 'rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ fontSize: '56px', fontWeight: 900, color: colors.primary }}>
                {unit}
                {Math.round((values[idx] || 0) * progress)}
              </div>
              <div style={{ fontSize: '22px', fontWeight: 600, color: colors.text, marginTop: '8px' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
