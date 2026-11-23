import React from 'react';

export const metadata = {
  title: 'Creator Autopilot — Faceless Brand Command Center',
  description: 'All-in-one autonomous platform manager, production pipeline, and daily report for faceless brands.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: '#0F172A',
          color: '#F8FAFC',
          fontFamily: "'Inter', sans-serif",
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
          {/* Top Header */}
          <header
            style={{
              height: '64px',
              borderBottom: '1px solid #1E293B',
              backgroundColor: '#090D16',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 24px',
              position: 'sticky',
              top: 0,
              zIndex: 100,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '18px',
                }}
              >
                ⚡
              </div>
              <span style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.5px' }}>
                Creator Autopilot
              </span>
              <span
                style={{
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: '#1E293B',
                  color: '#94A3B8',
                }}
              >
                v1.0 (US Brands)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '13px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                Pipeline Active
              </div>
            </div>
          </header>

          <div style={{ display: 'flex', flex: 1 }}>
            {/* Desktop Navigation Sidebar */}
            <nav
              style={{
                width: '240px',
                backgroundColor: '#090D16',
                borderRight: '1px solid #1E293B',
                padding: '24px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {[
                { label: '📊 Daily Report', href: '/' },
                { label: '🎬 Review Queue', href: '/queue' },
                { label: '📱 Manual Export', href: '/manual-export' },
                { label: '💬 Engagement', href: '/comments' },
                { label: '🎯 Morning Brief', href: '/brief' },
                { label: '🏷️ Brands', href: '/brands' },
                { label: '📈 Analytics', href: '/analytics' },
                { label: '💰 Revenue & Costs', href: '/revenue' },
                { label: '⚙️ Settings & Security', href: '/settings' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    color: '#94A3B8',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Main Content Area */}
            <main style={{ flex: 1, padding: '32px 24px 80px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
              {children}
            </main>
          </div>

          {/* Phone Mobile Bottom Navigation Bar */}
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60px',
              backgroundColor: '#090D16',
              borderTop: '1px solid #1E293B',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              zIndex: 100,
            }}
          >
            {[
              { label: 'Report', href: '/' },
              { label: 'Queue', href: '/queue' },
              { label: 'Export', href: '/manual-export' },
              { label: 'Brief', href: '/brief' },
              { label: 'Revenue', href: '/revenue' },
            ].map((tab) => (
              <a
                key={tab.href}
                href={tab.href}
                style={{
                  color: '#94A3B8',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {tab.label}
              </a>
            ))}
          </div>
        </div>
      </body>
    </html>
  );
}
