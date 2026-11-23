import React from 'react';
import { INITIAL_BRANDS } from '@creator-autopilot/core';

export default function DailyReportPage() {
  const activeBrands = INITIAL_BRANDS.filter((b) => b.active);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Top Banner & "Give me today's update" Button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
            Combined Daily Performance & Revenue
          </h1>
          <p style={{ color: '#94A3B8', margin: 0, fontSize: '15px' }}>
            Single-screen verdict across all brands, platforms, and unit economics.
          </p>
        </div>

        <button
          style={{
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '15px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(37,99,235,0.4)',
          }}
        >
          ⚡ Give me today's update
        </button>
      </div>

      {/* Top Level Financials (Revenue minus Cost) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div style={{ backgroundColor: '#1E293B', padding: '24px', borderRadius: '16px' }}>
          <div style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 600 }}>Total Revenue</div>
          <div style={{ fontSize: '36px', fontWeight: 900, color: '#10B981', marginTop: '8px' }}>$42.50</div>
          <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '6px' }}>Affiliates & Digital products</div>
        </div>
        <div style={{ backgroundColor: '#1E293B', padding: '24px', borderRadius: '16px' }}>
          <div style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 600 }}>Total Cost</div>
          <div style={{ fontSize: '36px', fontWeight: 900, color: '#F43F5E', marginTop: '8px' }}>$6.50</div>
          <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '6px' }}>Hetzner VPS + Actions Free Tier</div>
        </div>
        <div style={{ backgroundColor: '#1E293B', padding: '24px', borderRadius: '16px', border: '1px solid #10B981' }}>
          <div style={{ fontSize: '14px', color: '#10B981', fontWeight: 700 }}>Net Profit (ROI)</div>
          <div style={{ fontSize: '36px', fontWeight: 900, color: '#F8FAFC', marginTop: '8px' }}>+$36.00</div>
          <div style={{ fontSize: '13px', color: '#10B981', marginTop: '6px' }}>Profitable! Measured by net margin</div>
        </div>
        <div style={{ backgroundColor: '#1E293B', padding: '24px', borderRadius: '16px' }}>
          <div style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 600 }}>Cross-Platform Views</div>
          <div style={{ fontSize: '36px', fontWeight: 900, color: '#38BDF8', marginTop: '8px' }}>1,840</div>
          <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '6px' }}>YouTube, IG, FB, TikTok</div>
        </div>
      </div>

      {/* Brand Summaries */}
      {activeBrands.map((brand) => (
        <div
          key={brand.id}
          style={{
            backgroundColor: '#1E293B',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid #334155',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: brand.colors.primary,
                }}
              />
              <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>{brand.name}</h2>
              <span
                style={{
                  fontSize: '12px',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  backgroundColor: '#0F172A',
                  color: '#38BDF8',
                  fontWeight: 600,
                }}
              >
                Active (US Audience)
              </span>
            </div>
            <div style={{ fontSize: '14px', color: '#94A3B8' }}>
              Best Platform: <strong style={{ color: '#F8FAFC' }}>YouTube</strong> | Best Pillar:{' '}
              <strong style={{ color: '#F8FAFC' }}>{brand.profile.contentPillars[0].slice(0, 30)}...</strong>
            </div>
          </div>

          {/* Target Benchmarks & Progress */}
          <div
            style={{
              backgroundColor: '#0F172A',
              padding: '18px',
              borderRadius: '12px',
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <span style={{ fontSize: '13px', color: '#94A3B8' }}>Checkpoint: </span>
              <strong style={{ color: '#F8FAFC' }}>Day 30 Target (Realistic Range: 30-80 subs)</strong>
            </div>
            <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
              <div>
                Subscribers: <strong style={{ color: '#10B981' }}>52 / 50</strong> (On Track)
              </div>
              <div>
                Retention: <strong style={{ color: '#10B981' }}>44%</strong> (Target &ge; 40%)
              </div>
              <div>
                Verdict:{' '}
                <span style={{ padding: '2px 8px', borderRadius: '6px', backgroundColor: '#064E3B', color: '#10B981', fontWeight: 700 }}>
                  CONTINUE
                </span>
              </div>
            </div>
          </div>

          {/* Posts Verdict Table */}
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 14px 0', color: '#94A3B8' }}>
            Recent Post Verdicts (Compared to brand recent median of 100 views)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              {
                title: brand.slug === 'stack-simple' ? 'Free Tier Walkthrough: Notion vs Obsidian' : 'Worth the Upgrade? M4 Mac Mini Review',
                platform: 'YouTube',
                views: 245,
                verdict: 'good',
                cause: 'High retention in first 15s payoff matched US search demand.',
              },
              {
                title: '3 Hidden Settings You Must Turn Off Now #Shorts',
                platform: 'TikTok',
                views: 120,
                verdict: 'average',
                cause: 'Aligned with normal indexing baseline.',
              },
            ].map((post, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 18px',
                  backgroundColor: '#0F172A',
                  borderRadius: '10px',
                  fontSize: '14px',
                }}
              >
                <div>
                  <span style={{ fontWeight: 600 }}>{post.title}</span>
                  <span style={{ marginLeft: '12px', color: '#94A3B8', fontSize: '12px' }}>{post.platform}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span>{post.views} views</span>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      backgroundColor: post.verdict === 'good' ? '#064E3B' : '#334155',
                      color: post.verdict === 'good' ? '#10B981' : '#F8FAFC',
                    }}
                  >
                    {post.verdict.toUpperCase()}
                  </span>
                  <span style={{ color: '#94A3B8', fontSize: '12px', maxWidth: '300px' }}>{post.cause}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 3 Actions for Tomorrow */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #334155' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#38BDF8', margin: '0 0 10px 0' }}>
              💡 3 Recommended Actions For Tomorrow:
            </h4>
            <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#E2E8F0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Produce 1 comparison video targeting published benchmarks for popular free tiers.</li>
              <li>Test curiosity-gap question format on the 9:16 portrait Short.</li>
              <li>Ensure the affiliate link disclosure is placed before the "Show More" fold in YouTube description.</li>
            </ol>
          </div>
        </div>
      ))}
    </div>
  );
}
