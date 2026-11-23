import React from 'react';
import { INITIAL_BRANDS } from '@creator-autopilot/core';

export default function BrandsManagementPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 900, margin: '0 0 6px 0' }}>
          🏷️ Brands & Niche Registry
        </h1>
        <p style={{ color: '#94A3B8', margin: 0, fontSize: '14px' }}>
          Manage your brand profiles, content pillars, pauses, and activation toggles.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {INITIAL_BRANDS.map((brand) => (
          <div
            key={brand.id}
            style={{
              backgroundColor: '#1E293B',
              borderRadius: '16px',
              padding: '24px',
              border: brand.active ? `2px solid ${brand.colors.primary}` : '1px solid #334155',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: brand.colors.primary }} />
                <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>{brand.name}</h2>
              </div>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 800,
                  backgroundColor: brand.active ? '#064E3B' : '#334155',
                  color: brand.active ? '#10B981' : '#94A3B8',
                }}
              >
                {brand.active ? 'ACTIVE' : 'READY TO ACTIVATE'}
              </span>
            </div>

            <div style={{ fontSize: '13px', color: '#94A3B8' }}>
              <strong>Niche:</strong> {brand.niche}
            </div>

            <div style={{ fontSize: '13px', color: '#CBD5E1', backgroundColor: '#0F172A', padding: '12px', borderRadius: '8px' }}>
              <strong>Promise:</strong> "{brand.profile.promise}"
            </div>

            <div style={{ fontSize: '13px' }}>
              <div style={{ fontWeight: 700, color: '#94A3B8', marginBottom: '6px' }}>Content Pillars:</div>
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#CBD5E1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {brand.profile.contentPillars.slice(0, 3).map((p, idx) => (
                  <li key={idx}>{p.slice(0, 48)}...</li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #334155' }}>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                Voice: <code>{brand.voiceId}</code>
              </div>
              <button
                style={{
                  backgroundColor: brand.active ? '#334155' : '#2563EB',
                  color: '#FFF',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                {brand.active ? (brand.paused ? '▶️ Resume' : '⏸️ Pause') : '⚡ Activate Brand'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
