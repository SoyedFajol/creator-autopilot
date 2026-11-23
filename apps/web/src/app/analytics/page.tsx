import React from 'react';

export default function AnalyticsDashboardPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 900, margin: '0 0 6px 0' }}>
          📈 Normalized Analytics & Experimentation
        </h1>
        <p style={{ color: '#94A3B8', margin: 0, fontSize: '14px' }}>
          Time-series metrics normalized across platforms and template version tests.
        </p>
      </div>

      {/* Platform Comparison Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {[
          { platform: 'YouTube', views: 820, avgWatchTime: '48.2s', completionRate: '54%', color: '#EF4444' },
          { platform: 'Instagram', views: 360, avgWatchTime: '14.5s', completionRate: '42%', color: '#EC4899' },
          { platform: 'TikTok', views: 510, avgWatchTime: '18.1s', completionRate: '46%', color: '#06B6D4' },
          { platform: 'Facebook', views: 150, avgWatchTime: '12.0s', completionRate: '31%', color: '#3B82F6' },
        ].map((item) => (
          <div key={item.platform} style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '12px', borderLeft: `6px solid ${item.color}` }}>
            <div style={{ fontWeight: 800, fontSize: '18px' }}>{item.platform}</div>
            <div style={{ fontSize: '28px', fontWeight: 900, marginTop: '8px' }}>{item.views}</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
              Avg Watch: {item.avgWatchTime} | Completion: {item.completionRate}
            </div>
          </div>
        ))}
      </div>

      {/* Experimentation Comparison Table */}
      <div style={{ backgroundColor: '#1E293B', borderRadius: '16px', padding: '24px', border: '1px solid #334155' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 16px 0' }}>
          🧪 Active Experiments (Hook Styles, Templates & Voices)
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            {
              variable: 'Hook Style',
              variantA: 'Question Hook ("Is This Really Free?")',
              variantB: 'Negative Hook ("Stop Using X Today")',
              winner: 'Question Hook (+32% Retention)',
            },
            {
              variable: 'Template Style',
              variantA: 'Clean Minimal',
              variantB: 'Bold Punchy',
              winner: 'Clean Minimal (+18% Completion in Stack Simple)',
            },
          ].map((exp, idx) => (
            <div key={idx} style={{ padding: '16px', backgroundColor: '#0F172A', borderRadius: '10px', fontSize: '14px' }}>
              <div style={{ fontWeight: 700, color: '#38BDF8', marginBottom: '4px' }}>{exp.variable}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', color: '#CBD5E1' }}>
                <div>A: {exp.variantA}</div>
                <div>B: {exp.variantB}</div>
                <div style={{ fontWeight: 700, color: '#10B981' }}>Verdict: {exp.winner}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
