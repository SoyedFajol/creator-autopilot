'use client';

import React, { useEffect, useState } from 'react';

interface ChannelInfo {
  channelId: string;
  channelTitle: string;
  connectedAt: string;
}

export function YouTubeChannelConnect({ brandId }: { brandId: string }) {
  const [channel, setChannel] = useState<ChannelInfo | null>(null);
  const [oauthConfigured, setOauthConfigured] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/auth/youtube/status')
      .then((r) => r.json())
      .then((data) => {
        setOauthConfigured(Boolean(data.oauthConfigured));
        if (data.channels?.[brandId]) {
          setChannel(data.channels[brandId]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [brandId]);

  async function handleDisconnect() {
    setLoading(true);
    try {
      await fetch(`/api/auth/youtube/status?brandId=${encodeURIComponent(brandId)}`, {
        method: 'DELETE',
      });
      setChannel(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ fontSize: '12px', color: '#94A3B8', padding: '8px 0' }}>
        Checking YouTube channel connection...
      </div>
    );
  }

  if (channel) {
    return (
      <div
        style={{
          backgroundColor: '#064E3B',
          border: '1px solid #10B981',
          borderRadius: '8px',
          padding: '10px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <div style={{ fontSize: '12px', color: '#ECFDF5' }}>
          <div style={{ fontWeight: 700 }}>✅ YouTube Connected: {channel.channelTitle}</div>
          <div style={{ color: '#A7F3D0', fontSize: '11px' }}>Channel ID: {channel.channelId}</div>
        </div>
        <button
          type="button"
          onClick={handleDisconnect}
          style={{
            backgroundColor: '#0F172A',
            color: '#FCA5A5',
            border: '1px solid #EF4444',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <a
        href={`/api/auth/youtube?brandId=${encodeURIComponent(brandId)}`}
        style={{
          display: 'inline-block',
          textAlign: 'center',
          backgroundColor: '#DC2626',
          color: '#FFFFFF',
          textDecoration: 'none',
          padding: '9px 14px',
          borderRadius: '8px',
          fontWeight: 700,
          fontSize: '12px',
        }}
      >
        ▶️ Connect YouTube Channel (OAuth)
      </a>
      {!oauthConfigured && (
        <div style={{ fontSize: '11px', color: '#FBBF24' }}>
          Requires <code>GOOGLE_CLIENT_ID</code> &amp; <code>GOOGLE_CLIENT_SECRET</code> in Vercel / <code>.env</code>.
        </div>
      )}
    </div>
  );
}
