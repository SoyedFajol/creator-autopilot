import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandColors, BrandFonts } from '@creator-autopilot/core';

export interface LowerThirdProps {
  primaryText: string;
  secondaryText?: string;
  colors: BrandColors;
  fonts: BrandFonts;
}

export const LowerThird: React.FC<LowerThirdProps> = ({
  primaryText,
  secondaryText,
  colors,
  fonts,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const translateX = spring({
    frame,
    fps,
    from: -300,
    to: 0,
    config: { damping: 15 },
  });

  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '80px',
        left: '80px',
        display: 'flex',
        flexDirection: 'column',
        transform: `translateX(${translateX}px)`,
        opacity,
        fontFamily: fonts.heading,
        zIndex: 10,
      }}
    >
      <div
        style={{
          backgroundColor: colors.primary,
          color: '#FFFFFF',
          padding: '12px 28px',
          fontSize: '32px',
          fontWeight: 'bold',
          borderRadius: '8px 8px 0 0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          display: 'inline-block',
        }}
      >
        {primaryText}
      </div>
      {secondaryText && (
        <div
          style={{
            backgroundColor: colors.secondary,
            color: '#FFFFFF',
            padding: '8px 24px',
            fontSize: '22px',
            fontWeight: 500,
            borderRadius: '0 8px 8px 8px',
            fontFamily: fonts.body,
          }}
        >
          {secondaryText}
        </div>
      )}
    </div>
  );
};
