import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Brand, Script } from '@creator-autopilot/core';
import { TitleCard } from '../templates/TitleCard.js';
import { Callout } from '../templates/Callout.js';
import { AnimatedChart } from '../templates/AnimatedChart.js';
import { ProgressBar } from '../templates/ProgressBar.js';

export interface ShortVideoProps {
  script: Script;
  brand: Brand;
}

export const ShortVideo: React.FC<ShortVideoProps> = ({ script, brand }) => {
  const fps = 30;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: brand.colors.background,
        color: brand.colors.text,
        fontFamily: brand.fonts.body,
        overflow: 'hidden',
      }}
    >
      <ProgressBar colors={brand.colors} heightPx={16} />

      {/* Hook Section (0-4s) */}
      <Sequence from={0} durationInFrames={fps * 4}>
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '240px 60px 360px 60px', // Within Safe Zones
            textAlign: 'center',
          }}
        >
          <TitleCard
            title={script.hook}
            badgeText={brand.name}
            colors={brand.colors}
            fonts={brand.fonts}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Quick Visual Section */}
      <Sequence from={fps * 4} durationInFrames={fps * 20}>
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '240px 60px 360px 60px', // Respect safe zones
          }}
        >
          {script.sections[0]?.visualPlan.chartData ? (
            <AnimatedChart
              type="metric_card"
              title={script.sections[0].title}
              labels={script.sections[0].visualPlan.chartData.labels}
              values={script.sections[0].visualPlan.chartData.values}
              unit={script.sections[0].visualPlan.chartData.unit}
              colors={brand.colors}
              fonts={brand.fonts}
            />
          ) : (
            <Callout
              text={script.first15SecondsPayoff}
              badge="THE VERDICT"
              colors={brand.colors}
              fonts={brand.fonts}
            />
          )}
        </AbsoluteFill>
      </Sequence>

      {/* CTA Sequence (24s-30s) */}
      <Sequence from={fps * 24} durationInFrames={fps * 6}>
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '240px 60px 360px 60px',
            textAlign: 'center',
          }}
        >
          <TitleCard
            title={script.callToAction.message}
            badgeText="LINK IN BIO"
            colors={brand.colors}
            fonts={brand.fonts}
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
