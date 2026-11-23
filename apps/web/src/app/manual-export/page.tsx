import React from 'react';

export default function ManualExportPage() {
  const sampleExport = {
    brandName: 'Stack Simple',
    platform: 'YouTube',
    title: 'Is This Free Tier Actually Usable? Notion vs Obsidian Breakdown',
    caption:
      'In this video we break down the free tier and compare the numbers so you can decide for yourself.\n\n📌 Free Resource & Checklist: https://stacksimple.com/free-template\n\nDISCLOSURE: This video contains affiliate links. If you purchase through them, we may receive a commission at no extra charge to you.',
    hashtags: '#Software #Freelancer #TechReview #Comparison',
    scheduledTime: 'Today at 10:00 AM EST (15:00 UTC)',
    videoUrl: '/renders/sample-video.mp4',
    coverUrl: '/renders/sample-cover.svg',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 900, margin: '0 0 6px 0' }}>
          📱 Fast Phone Export Page
        </h1>
        <p style={{ color: '#94A3B8', margin: 0, fontSize: '14px' }}>
          One-tap downloads and copying for uploading directly on your phone or desktop.
        </p>
      </div>

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 800, fontSize: '18px' }}>{sampleExport.platform} Package</span>
          <span style={{ backgroundColor: '#2563EB', color: '#FFF', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>
            {sampleExport.brandName}
          </span>
        </div>

        {/* Download Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <a
            href={sampleExport.videoUrl}
            download
            style={{
              backgroundColor: '#0F172A',
              border: '1px solid #2563EB',
              color: '#38BDF8',
              textAlign: 'center',
              padding: '16px',
              borderRadius: '10px',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '15px',
            }}
          >
            📥 Download Video File (MP4)
          </a>
          <a
            href={sampleExport.coverUrl}
            download
            style={{
              backgroundColor: '#0F172A',
              border: '1px solid #10B981',
              color: '#10B981',
              textAlign: 'center',
              padding: '16px',
              borderRadius: '10px',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '15px',
            }}
          >
            🖼️ Download Cover Thumbnail
          </a>
        </div>

        {/* Title One-Tap Copy */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600 }}>Video Title</label>
            <span style={{ fontSize: '12px', color: '#38BDF8', cursor: 'pointer', fontWeight: 600 }}>📋 Copy Title</span>
          </div>
          <div style={{ padding: '12px', backgroundColor: '#0F172A', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}>
            {sampleExport.title}
          </div>
        </div>

        {/* Caption One-Tap Copy */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600 }}>Caption & Description</label>
            <span style={{ fontSize: '12px', color: '#38BDF8', cursor: 'pointer', fontWeight: 600 }}>📋 Copy Description</span>
          </div>
          <textarea
            readOnly
            rows={5}
            value={sampleExport.caption}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#0F172A',
              borderRadius: '8px',
              border: '1px solid #475569',
              color: '#CBD5E1',
              fontSize: '13px',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Mandatory Policy Checklist */}
        <div style={{ backgroundColor: '#0F172A', padding: '16px', borderRadius: '10px', borderLeft: '4px solid #EAB308' }}>
          <div style={{ fontWeight: 700, color: '#EAB308', marginBottom: '6px' }}>⚠️ Publishing Policy Reminders:</div>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#94A3B8', lineHeight: 1.6 }}>
            <li>Set audience to <strong>"Not made for kids"</strong>.</li>
            <li>Select <strong>YES for Altered or synthetic content</strong> (AI label policy).</li>
            <li>Target US Morning publishing: <strong>{sampleExport.scheduledTime}</strong>.</li>
          </ul>
        </div>

        {/* Mark as Posted Link Confirmation */}
        <div style={{ paddingTop: '12px', borderTop: '1px solid #334155' }}>
          <label style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
            After posting, paste the published live link here:
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#0F172A',
                border: '1px solid #475569',
                color: '#FFF',
                fontSize: '14px',
              }}
            />
            <button
              style={{
                backgroundColor: '#10B981',
                color: '#FFF',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Mark Posted
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
