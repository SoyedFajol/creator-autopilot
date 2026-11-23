import React from 'react';
import { INITIAL_BRANDS } from '@creator-autopilot/core';

export default function MorningBriefPage() {
  const activeBrands = INITIAL_BRANDS.filter((b) => b.active);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 900, margin: '0 0 6px 0' }}>
          ⏰ Morning Brief (8:00 AM Asia/Dhaka)
        </h1>
        <p style={{ color: '#94A3B8', margin: 0, fontSize: '14px' }}>
          Override today's video output, force a topic, or let saved defaults proceed automatically after cutoff.
        </p>
      </div>

      <div style={{ backgroundColor: '#1E293B', borderRadius: '16px', padding: '24px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', color: '#38BDF8', fontWeight: 700 }}>
            ⏳ Auto-Cutoff Window: 2 Hours Remaining (Defaults take over at 10:00 AM)
          </div>
          <span style={{ backgroundColor: '#064E3B', color: '#10B981', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>
            DEFAULT CADENCE: 2-3 LONG / WEEK + 1 SHORT / DAY
          </span>
        </div>

        {activeBrands.map((brand) => (
          <div key={brand.id} style={{ padding: '20px', backgroundColor: '#0F172A', borderRadius: '12px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 14px 0', color: brand.colors.primary }}>
              {brand.name}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Today's Output</label>
                <select style={{ width: '100%', padding: '10px', backgroundColor: '#1E293B', border: '1px solid #475569', borderRadius: '8px', color: '#FFF' }}>
                  <option value="both">Both (Long Video + Short)</option>
                  <option value="long">Long Landscape Video Only</option>
                  <option value="short">Portrait Short Only</option>
                  <option value="skip">Skip Output Today</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Target Platforms</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <span style={{ padding: '6px 10px', backgroundColor: '#2563EB', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>YouTube</span>
                  <span style={{ padding: '6px 10px', backgroundColor: '#334155', borderRadius: '6px', fontSize: '12px' }}>Instagram</span>
                  <span style={{ padding: '6px 10px', backgroundColor: '#334155', borderRadius: '6px', fontSize: '12px' }}>TikTok</span>
                  <span style={{ padding: '6px 10px', backgroundColor: '#334155', borderRadius: '6px', fontSize: '12px' }}>Facebook</span>
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>
                Force Topic (Optional - Leave blank to use YouTube AI search demand)
              </label>
              <input
                type="text"
                placeholder="e.g. Supabase vs Firebase Free Tier breakdown"
                style={{ width: '100%', padding: '10px', backgroundColor: '#1E293B', border: '1px solid #475569', borderRadius: '8px', color: '#FFF', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        ))}

        <button
          style={{
            width: '100%',
            backgroundColor: '#2563EB',
            color: '#FFF',
            border: 'none',
            padding: '14px',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '15px',
            cursor: 'pointer',
            marginTop: '8px',
          }}
        >
          Confirm Brief & Start Daily Production
        </button>
      </div>
    </div>
  );
}
