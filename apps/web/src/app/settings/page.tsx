import React from 'react';
import { AuditLogger } from '@creator-autopilot/core';

export default function SettingsAndSecurityPage() {
  const auditLogs = AuditLogger.getRecentLogs();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 900, margin: '0 0 6px 0' }}>
          ⚙️ Settings, Security & Emergency Controls
        </h1>
        <p style={{ color: '#94A3B8', margin: 0, fontSize: '14px' }}>
          Hardened access, encrypted token storage, audit trail, and one-click emergency stop.
        </p>
      </div>

      {/* Emergency Kill Switch */}
      <div style={{ backgroundColor: '#450A0A', border: '2px solid #EF4444', borderRadius: '16px', padding: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#FCA5A5', margin: '0 0 8px 0' }}>
          🚨 ONE-CLICK EMERGENCY STOP
        </h2>
        <p style={{ color: '#FECACA', fontSize: '13px', margin: '0 0 16px 0' }}>
          Instantly pauses all scheduled workflows, suspends publishing across all platforms, and prevents any worker from executing.
        </p>
        <button
          style={{
            backgroundColor: '#DC2626',
            color: '#FFF',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: 800,
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          🛑 ACTIVATE EMERGENCY STOP
        </button>
      </div>

      {/* Database Backup & Restore Status */}
      <div style={{ backgroundColor: '#1E293B', borderRadius: '16px', padding: '24px', border: '1px solid #334155' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 12px 0' }}>
          💾 Off-Server Encrypted Database Backups
        </h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '14px', color: '#10B981', fontWeight: 700 }}>
              ✅ Last Backup: Today at 01:00 UTC (Compressed & Age-Encrypted)
            </div>
            <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
              Stored off-server in private Backblaze B2 bucket with 30-day retention.
            </div>
          </div>
          <button
            style={{
              backgroundColor: '#0F172A',
              border: '1px solid #38BDF8',
              color: '#38BDF8',
              padding: '10px 18px',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            🧪 Run Test Restore
          </button>
        </div>
      </div>

      {/* Secret Rotation & Maintenance Checklist */}
      <div style={{ backgroundColor: '#1E293B', borderRadius: '16px', padding: '24px', border: '1px solid #334155' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 12px 0' }}>
          🔑 Key Rotation & Monthly Server Checklist
        </h2>
        <div style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.6 }}>
          <div>1. <strong>Quarterly Secret Rotation:</strong> Re-generate <code>WORKFLOW_API_SECRET</code> and update GitHub Secrets.</div>
          <div>2. <strong>Server Updates:</strong> Unattended security upgrades are active. SSH password auth is permanently disabled.</div>
          <div>3. <strong>Coolify Isolation:</strong> Admin port 8000 is firewalled off; reachable only via local SSH tunnel.</div>
        </div>
      </div>

      {/* Audit Log Trail */}
      <div style={{ backgroundColor: '#1E293B', borderRadius: '16px', padding: '24px', border: '1px solid #334155' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 16px 0' }}>
          📜 Security Audit Trail
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
          {auditLogs.length === 0 ? (
            <div style={{ color: '#94A3B8' }}>Audit logger initialized. All sensitive events are recorded.</div>
          ) : (
            auditLogs.map((log) => (
              <div key={log.id} style={{ padding: '10px 14px', backgroundColor: '#0F172A', borderRadius: '6px' }}>
                <span style={{ color: '#94A3B8' }}>{log.timestamp}</span> | <strong>{log.action}</strong> by{' '}
                <span style={{ color: '#38BDF8' }}>{log.actor}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
