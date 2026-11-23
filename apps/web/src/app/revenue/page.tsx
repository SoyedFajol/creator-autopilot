import React from 'react';

export default function RevenueTrackingPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 900, margin: '0 0 6px 0' }}>
          💰 Revenue & Funnel Tracking
        </h1>
        <p style={{ color: '#94A3B8', margin: 0, fontSize: '14px' }}>
          Track affiliate clicks, email resource downloads, and monthly server cost vs your $50 budget.
        </p>
      </div>

      {/* Budget Meter */}
      <div style={{ backgroundColor: '#1E293B', borderRadius: '16px', padding: '24px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '14px', color: '#94A3B8' }}>Monthly Spend: </span>
            <strong style={{ fontSize: '20px', color: '#10B981' }}>$6.50</strong>
            <span style={{ fontSize: '14px', color: '#94A3B8' }}> / $50.00 Budget</span>
          </div>
          <span style={{ fontSize: '13px', color: '#10B981', fontWeight: 700 }}>$43.50 Under Budget (87% Buffer)</span>
        </div>
        <div style={{ height: '14px', backgroundColor: '#0F172A', borderRadius: '7px', overflow: 'hidden' }}>
          <div style={{ width: '13%', height: '100%', backgroundColor: '#10B981', borderRadius: '7px' }} />
        </div>
      </div>

      {/* Tracked Link Builder */}
      <div style={{ backgroundColor: '#1E293B', borderRadius: '16px', padding: '24px', border: '1px solid #334155' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 16px 0' }}>
          🔗 Per-Video Tracked Link Builder (Affiliate & Lead Magnets)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              Destination Affiliate URL
            </label>
            <input
              type="text"
              defaultValue="https://partnerstack.com/app/notion?ref=stacksimple"
              style={{ width: '100%', padding: '10px', backgroundColor: '#0F172A', border: '1px solid #475569', borderRadius: '8px', color: '#FFF', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              Platform / Campaign
            </label>
            <input
              type="text"
              defaultValue="yt_long_notion_vs_obsidian"
              style={{ width: '100%', padding: '10px', backgroundColor: '#0F172A', border: '1px solid #475569', borderRadius: '8px', color: '#FFF', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>
        </div>
        <div style={{ padding: '12px 16px', backgroundColor: '#0F172A', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <code style={{ color: '#38BDF8', fontSize: '14px' }}>https://stacksimple.com/go/notion-free</code>
          <button style={{ backgroundColor: '#2563EB', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}>
            Copy Tracked Link
          </button>
        </div>
      </div>
    </div>
  );
}
