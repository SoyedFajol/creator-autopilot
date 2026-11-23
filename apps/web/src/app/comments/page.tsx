import React from 'react';

export default function EngagementPage() {
  const sampleComments = [
    {
      id: 'c1',
      platform: 'YouTube',
      author: '@SoloBuilder_Dave',
      comment: 'Does the free tier allow sharing workspaces with 1 other person without paying?',
      postTitle: 'Free Tier Walkthrough: Notion vs Obsidian',
      draftReply:
        'Great question! The free tier allows unlimited guests on single pages, but shared team workspaces require the Team plan. Check the free comparison checklist linked in our description!',
      time: '2 hours ago',
    },
    {
      id: 'c2',
      platform: 'TikTok',
      author: '@sarah_tech',
      comment: 'Wait is this really free or a 14 day trial?',
      postTitle: 'Is This Free Tier Actually Usable?',
      draftReply:
        'It is 100% free forever, not a trial! No credit card needed. Full breakdown is in our bio link 🙌',
      time: '4 hours ago',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 900, margin: '0 0 6px 0' }}>
          💬 Engagement & Comment Queue
        </h1>
        <p style={{ color: '#94A3B8', margin: 0, fontSize: '14px' }}>
          AI generates draft replies for incoming comments. <strong>Never posted without your explicit manual approval.</strong>
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {sampleComments.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: '#1E293B',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #334155',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ backgroundColor: '#2563EB', color: '#FFF', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>
                  {item.platform}
                </span>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>{item.author}</span>
                <span style={{ color: '#94A3B8', fontSize: '12px' }}>on "{item.postTitle}"</span>
              </div>
              <span style={{ color: '#94A3B8', fontSize: '12px' }}>{item.time}</span>
            </div>

            <div style={{ padding: '12px 16px', backgroundColor: '#0F172A', borderRadius: '8px', fontSize: '14px', borderLeft: '4px solid #38BDF8' }}>
              "{item.comment}"
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                AI Suggested Reply (Editable)
              </label>
              <textarea
                rows={3}
                defaultValue={item.draftReply}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#0F172A',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#CBD5E1',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                style={{
                  backgroundColor: '#334155',
                  color: '#FFF',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                Dismiss
              </button>
              <button
                style={{
                  backgroundColor: '#10B981',
                  color: '#FFF',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                ✅ Approve & Post Reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
