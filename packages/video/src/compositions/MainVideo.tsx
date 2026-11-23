import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Brand, Script } from '@creator-autopilot/core';
import { TitleCard } from '../templates/TitleCard.js';
import { AnimatedChart } from '../templates/AnimatedChart.js';
import { ComparisonTable } from '../templates/ComparisonTable.js';
import { LowerThird } from '../templates/LowerThird.js';
import { Callout } from '../templates/Callout.js';
import { ProgressBar } from '../templates/ProgressBar.js';

export interface MainVideoProps {
  script: Script;
  brand: Brand;
}

export const MainVideo: React.FC<MainVideoProps> = ({ script, brand }) => {
  const fps = 30;
  let currentStartFrame = 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: brand.colors.background,
        color: brand.colors.text,
        fontFamily: brand.fonts.body,
        overflow: 'hidden',
      }}
    >
      <ProgressBar colors={brand.colors} />

      {/* Intro Hook / Payoff Sequence */}
      <Sequence from={0} durationInFrames={fps * 6}>
        <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TitleCard
            title={script.hook}
            subtitle={script.first15SecondsPayoff}
            badgeText={brand.name}
            colors={brand.colors}
            fonts={brand.fonts}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Script Sections Sequences */}
      {script.sections.map((section, idx) => {
        const durationFrames = Math.max(fps * 4, section.estimatedDurationSec * fps);
        const fromFrame = currentStartFrame + fps * 6;
        currentStartFrame += durationFrames;

        return (
          <Sequence key={section.id || idx} from={fromFrame} durationInFrames={durationFrames}>
            <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
              {section.visualPlan.visualType === 'animated_chart' && section.visualPlan.chartData ? (
                <AnimatedChart
                  type={section.visualPlan.chartData.type}
                  title={section.title}
                  labels={section.visualPlan.chartData.labels}
                  values={section.visualPlan.chartData.values}
                  unit={section.visualPlan.chartData.unit}
                  colors={brand.colors}
                  fonts={brand.fonts}
                />
              ) : section.visualPlan.visualType === 'comparison_table' && section.visualPlan.tableData ? (
                <ComparisonTable
                  headers={section.visualPlan.tableData.headers}
                  rows={section.visualPlan.tableData.rows}
                  colors={brand.colors}
                  fonts={brand.fonts}
                />
              ) : section.visualPlan.visualType === 'animated_text' ? (
                <Callout text={section.spokenText} badge={`POINT ${section.sectionNumber}`} colors={brand.colors} fonts={brand.fonts} />
              ) : (
                <TitleCard
                  title={section.title}
                  subtitle={section.spokenText.slice(0, 120) + '...'}
                  colors={brand.colors}
                  fonts={brand.fonts}
                />
              )}

              <LowerThird
                primaryText={brand.name}
                secondaryText={section.title}
                colors={brand.colors}
                fonts={brand.fonts}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
