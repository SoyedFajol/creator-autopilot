import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandColors, BrandFonts } from '@creator-autopilot/core';

export interface CalloutProps {
  text: string;
  badge?: string;
  colors: BrandColors;
  fonts: BrandFonts;
}

export const Callout: React.FC<CalloutProps> = ({ text, badge = 'TAKEAWAY', colors, fonts }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity,
        backgroundColor: colors.background,
        borderLeft: `10px solid ${colors.accent}`,
        borderRadius: '16px',
        padding: '36px 44px',
        maxWidth: '900px',
        margin: 'auto',
        boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
        fontFamily: fonts.body,
      }}
    >
      <div
        style={{
          display: 'inline-block',
          backgroundColor: colors.accent,
          color: '#FFFFFF',
          padding: '6px 18px',
          borderRadius: '9999px',
          fontSize: '22px',
          fontWeight: 'bold',
          marginBottom: '16px',
          fontFamily: fonts.heading,
          letterSpacing: '1px',
        }}
      >
        {badge}
      </div>
      <div
        style={{
          fontSize: '38px',
          fontWeight: 700,
          color: colors.text,
          lineHeight: 1.3,
        }}
      >
        "{text}"
      </div>
    </div>
  );
};
