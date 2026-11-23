import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandColors } from '@creator-autopilot/core';

export interface ProgressBarProps {
  colors: BrandColors;
  heightPx?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ colors, heightPx = 10 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progressPercent = interpolate(frame, [0, durationInFrames], [0, 100], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: `${heightPx}px`,
        backgroundColor: 'rgba(0,0,0,0.15)',
        zIndex: 50,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progressPercent}%`,
          backgroundColor: colors.accent,
        }}
      />
    </div>
  );
};
