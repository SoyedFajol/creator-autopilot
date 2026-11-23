import React from 'react';
import { INITIAL_BRANDS } from '@creator-autopilot/core';

export default function ReviewQueuePage() {
  const brand = INITIAL_BRANDS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 900, margin: '0 0 6px 0' }}>
          📱 Review & Approval Queue
        </h1>
        <p style={{ color: '#94A3B8', margin: 0, fontSize: '14px' }}>
          Nothing is published without your explicit confirmation. Optimized for phone review.
        </p>
      </div>

      {/* Review Card */}
      <div
        style={{
          backgroundColor: '#1E293B',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #334155',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Brand & Format Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ backgroundColor: brand.colors.primary, color: '#FFF', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>
              {brand.name}
            </span>
            <span style={{ backgroundColor: '#334155', color: '#FFF', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
              16:9 Long Landscape
            </span>
          </div>

          {/* Quality Score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', color: '#94A3B8' }}>Quality Score:</span>
            <span style={{ fontSize: '16px', fontWeight: 900, color: '#10B981' }}>88/100 (PASS)</span>
          </div>
        </div>

        {/* Video Preview Frame */}
        <div
          style={{
            height: '240px',
            backgroundColor: '#0F172A',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed #475569',
          }}
        >
          <div style={{ fontSize: '48px' }}>▶️</div>
          <div style={{ fontWeight: 600, marginTop: '8px' }}>Rendered MP4 Preview</div>
          <div style={{ fontSize: '12px', color: '#94A3B8' }}>Duration: 08:42 | Kokoro Voice: am-michael</div>
        </div>

        {/* Title & Hook Editor */}
        <div>
          <label style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
            Chosen Video Title
          </label>
          <input
            type="text"
            defaultValue="Is This Free Tier Actually Usable? Notion vs Obsidian Breakdown"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#0F172A',
              border: '1px solid #475569',
              color: '#FFF',
              fontSize: '15px',
              fontWeight: 600,
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Thumbnail Selector */}
        <div>
          <label style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
            Select Designed Thumbnail (Max 4 Words Enforced)
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div
              style={{
                border: '2px solid #2563EB',
                borderRadius: '8px',
                padding: '12px',
                backgroundColor: '#0F172A',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 800, color: '#2563EB' }}>OPTION A (Selected)</div>
              <div style={{ fontSize: '18px', fontWeight: 900, margin: '8px 0' }}>FREE TIER TRUTH</div>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>Layout: Comparison Checklist</div>
            </div>
            <div
              style={{
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '12px',
                backgroundColor: '#0F172A',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 800, color: '#94A3B8' }}>OPTION B</div>
              <div style={{ fontSize: '18px', fontWeight: 900, margin: '8px 0' }}>WATCH BEFORE BUYING</div>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>Layout: Warning Badge</div>
            </div>
          </div>
        </div>

        {/* Fact Claim Audit */}
        <div style={{ backgroundColor: '#0F172A', padding: '14px', borderRadius: '8px', fontSize: '13px' }}>
          <div style={{ fontWeight: 700, color: '#10B981', marginBottom: '6px' }}>
            ✅ Fact Claims Verified (1/1):
          </div>
          <div style={{ color: '#CBD5E1' }}>
            "Free tier includes up to 3 active projects" — <em>Source: Official Specs Documentation</em>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
          <button
            style={{
              flex: 1,
              backgroundColor: '#10B981',
              color: '#FFF',
              border: 'none',
              padding: '14px',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '15px',
              cursor: 'pointer',
            }}
          >
            ✅ Approve for Manual Export
          </button>
          <button
            style={{
              backgroundColor: '#334155',
              color: '#FFF',
              border: 'none',
              padding: '14px 20px',
              borderRadius: '10px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            🔄 Request Re-render
          </button>
          <button
            style={{
              backgroundColor: '#991B1B',
              color: '#FFF',
              border: 'none',
              padding: '14px 20px',
              borderRadius: '10px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ❌ Reject
          </button>
        </div>
      </div>
    </div>
  );
}
