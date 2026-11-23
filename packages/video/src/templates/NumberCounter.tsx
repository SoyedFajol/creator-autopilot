import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandColors, BrandFonts } from '@creator-autopilot/core';

export interface NumberCounterProps {
  targetNumber: number;
  prefix?: string;
  suffix?: string;
  label?: string;
  colors: BrandColors;
  fonts: BrandFonts;
}

export const NumberCounter: React.FC<NumberCounterProps> = ({
  targetNumber,
  prefix = '',
  suffix = '',
  label,
  colors,
  fonts,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6 },
  });

  const displayVal = Math.round(targetNumber * progress);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        fontFamily: fonts.heading,
      }}
    >
      <div
        style={{
          fontSize: '110px',
          fontWeight: 900,
          color: colors.primary,
          lineHeight: 1,
          textShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}
      >
        {prefix}
        {displayVal}
        {suffix}
      </div>
      {label && (
        <div
          style={{
            fontSize: '36px',
            fontWeight: 600,
            color: colors.text,
            marginTop: '20px',
            fontFamily: fonts.body,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
