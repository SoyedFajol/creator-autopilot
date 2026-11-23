import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandColors, BrandFonts } from '@creator-autopilot/core';

export interface StepListProps {
  steps: string[];
  colors: BrandColors;
  fonts: BrandFonts;
}

export const StepList: React.FC<StepListProps> = ({ steps, colors, fonts }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '900px',
        margin: 'auto',
        fontFamily: fonts.body,
      }}
    >
      {steps.map((step, idx) => {
        const delay = idx * 15;
        const opacity = interpolate(frame, [delay, delay + 10], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const translateY = spring({
          frame: Math.max(0, frame - delay),
          fps,
          from: 40,
          to: 0,
        });

        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              padding: '20px 28px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              opacity,
              transform: `translateY(${translateY}px)`,
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: colors.primary,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: 800,
                flexShrink: 0,
                fontFamily: fonts.heading,
              }}
            >
              {idx + 1}
            </div>
            <div style={{ fontSize: '28px', fontWeight: 600, color: colors.text }}>
              {step}
            </div>
          </div>
        );
      })}
    </div>
  );
};
