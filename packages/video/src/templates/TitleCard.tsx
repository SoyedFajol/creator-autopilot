import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandColors, BrandFonts } from '@creator-autopilot/core';

export interface TitleCardProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  colors: BrandColors;
  fonts: BrandFonts;
}

export const TitleCard: React.FC<TitleCardProps> = ({
  title,
  subtitle,
  badgeText,
  colors,
  fonts,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6 },
  });

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px',
        opacity,
        transform: `scale(${scale})`,
        fontFamily: fonts.heading,
      }}
    >
      {badgeText && (
        <div
          style={{
            backgroundColor: colors.accent,
            color: '#FFFFFF',
            padding: '8px 24px',
            borderRadius: '9999px',
            fontSize: '28px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '24px',
          }}
        >
          {badgeText}
        </div>
      )}
      <h1
        style={{
          fontSize: '72px',
          fontWeight: 900,
          color: colors.primary,
          lineHeight: 1.15,
          margin: 0,
          textShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            fontSize: '36px',
            fontWeight: 500,
            color: colors.text,
            marginTop: '20px',
            maxWidth: '1200px',
            fontFamily: fonts.body,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
