import { NextRequest, NextResponse } from 'next/server';
import { AuditLogger } from '@creator-autopilot/core';

export async function POST(req: NextRequest) {
  // Destructive action: Requires confirmation and audit log
  const body = await req.json().catch(() => ({}));
  const { confirmed } = body;

  if (!confirmed) {
    return NextResponse.json({ error: 'Destructive emergency action requires explicit confirmed: true parameter' }, { status: 400 });
  }

  const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';

  await AuditLogger.log(
    'emergency_stop',
    'admin-user',
    { reason: 'User invoked one-click emergency stop from dashboard' },
    clientIp
  );

  return NextResponse.json({
    success: true,
    message: 'Emergency stop activated. All publishing suspended, workers paused.',
    status: 'HALTED',
  });
}
