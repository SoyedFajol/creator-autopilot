import React from 'react';
import { INITIAL_BRANDS } from '@creator-autopilot/core';
import { YouTubeChannelConnect } from '../../components/YouTubeChannelConnect';

export default async function BrandsManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ yt_connected?: string; channel?: string; yt_error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 900, margin: '0 0 6px 0' }}>
          🏷️ Brands & Niche Registry
        </h1>
        <p style={{ color: '#94A3B8', margin: 0, fontSize: '14px' }}>
          Manage your brand profiles, YouTube channel OAuth connections, content pillars, and activation toggles.
        </p>
      </div>

      {params.yt_connected && (
        <div
          style={{
            backgroundColor: '#064E3B',
            border: '1px solid #10B981',
            color: '#ECFDF5',
            padding: '14px 18px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 700,
          }}
        >
          ✅ Successfully connected YouTube channel <strong>{params.channel || 'YouTube Channel'}</strong> to{' '}
          <code>{params.yt_connected}</code>!
        </div>
      )}

      {params.yt_error && (
        <div
          style={{
            backgroundColor: '#450A0A',
            border: '1px solid #EF4444',
            color: '#FECACA',
            padding: '14px 18px',
            borderRadius: '10px',
            fontSize: '13px',
          }}
        >
          {params.yt_error === 'missing_google_oauth_env' ? (
            <>
              <strong>⚠️ Google OAuth not configured yet:</strong> Add <code>GOOGLE_CLIENT_ID</code> and{' '}
              <code>GOOGLE_CLIENT_SECRET</code> to your Vercel Environment Variables (and set the Authorized Redirect
              URI in Google Cloud Console to <code>https://&lt;your-domain&gt;/api/auth/youtube/callback</code>).
            </>
          ) : (
            <>
              <strong>⚠️ YouTube connection error:</strong> {params.yt_error}
            </>
          )}
        </div>
      )}

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

            <YouTubeChannelConnect brandId={brand.id} />

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
