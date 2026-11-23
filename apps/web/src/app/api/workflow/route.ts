import { NextRequest, NextResponse } from 'next/server';
import { verifyWorkflowToken, AuditLogger } from '@creator-autopilot/core';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing bearer token' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.WORKFLOW_API_SECRET || 'super-secret-workflow-jwt-signing-key-32-chars';

  try {
    const verified = await verifyWorkflowToken(token, secret);

    const body = await req.json();
    const { action, brandId, payload } = body;

    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';

    await AuditLogger.log(
      'api_publish',
      `workflow-worker-${verified.sub}`,
      { action, brandId, payloadSummary: Object.keys(payload || {}) },
      clientIp
    );

    return NextResponse.json({
      success: true,
      receivedAction: action,
      brandId,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Invalid workflow authorization' }, { status: 403 });
  }
}
