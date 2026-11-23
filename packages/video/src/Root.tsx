import React from 'react';
import { Composition } from 'remotion';
import { INITIAL_BRANDS, RENDER_PROFILES, Script } from '@creator-autopilot/core';
import { MainVideo } from './compositions/MainVideo.js';
import { ShortVideo } from './compositions/ShortVideo.js';

const mockScript: Script = {
  hook: 'Is This Tool Worth Upgrading to in 2026?',
  first15SecondsPayoff: 'We tested the free tier and compared the numbers so you do not have to.',
  sections: [
    {
      id: 's1',
      sectionNumber: 1,
      title: 'Free vs Paid Comparison',
      spokenText: 'Here is what you get for zero dollars compared to the premium plan.',
      estimatedDurationSec: 5,
      visualPlan: {
        visualType: 'animated_chart',
        description: 'Bar chart',
        chartData: {
          type: 'bar',
          labels: ['Free Tier', 'Pro Plan'],
          values: [0, 49],
          unit: '$',
        },
      },
    },
  ],
  callToAction: {
    type: 'free_resource',
    message: 'Check description for the free comparison guide.',
  },
  chapters: [{ timestamp: '00:00', title: 'Intro' }],
  descriptionTemplate: 'Full breakdown in description.',
  tags: ['tech', 'review'],
  nativeCaptions: {
    youtube: { caption: 'Full review', hashtags: ['#Tech'] },
    instagram: { caption: 'Reel review', hashtags: ['#Tech'] },
    facebook: { caption: 'FB review', hashtags: ['#Tech'] },
    tiktok: { caption: 'TikTok review', hashtags: ['#Tech'] },
  },
  factClaims: [],
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition<any, any>
        id="MainVideoLandscape"
        component={MainVideo}
        durationInFrames={30 * 60} // 60s preview duration
        fps={30}
        width={RENDER_PROFILES.long_landscape.width}
        height={RENDER_PROFILES.long_landscape.height}
        defaultProps={{
          script: mockScript,
          brand: INITIAL_BRANDS[0],
        }}
      />
      <Composition<any, any>
        id="ShortVideoPortrait"
        component={ShortVideo}
        durationInFrames={30 * 30} // 30s
        fps={30}
        width={RENDER_PROFILES.short_portrait.width}
        height={RENDER_PROFILES.short_portrait.height}
        defaultProps={{
          script: mockScript,
          brand: INITIAL_BRANDS[0],
        }}
      />
    </>
  );
};
