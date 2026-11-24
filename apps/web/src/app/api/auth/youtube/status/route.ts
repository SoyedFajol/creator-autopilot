import { NextRequest, NextResponse } from 'next/server';
import { decryptSecret, encryptSecret } from '@creator-autopilot/core';

interface StoredConnection {
  channelId: string;
  channelTitle: string;
  connectedAt: string;
  encryptedTokens: string;
}

function getEncryptionKey(): string {
  return (
    process.env.ENCRYPTION_KEY ||
    process.env.NEXTAUTH_SECRET ||
    'dev-fallback-encryption-key-change-in-prod-32'
  );
}

function readConnections(req: NextRequest): Record<string, StoredConnection> {
  const raw = req.cookies.get('yt_connections')?.value;
  if (!raw) return {};
  try {
    return JSON.parse(decryptSecret(raw, getEncryptionKey()));
  } catch {
    return {};
  }
}

export async function GET(req: NextRequest) {
  const connections = readConnections(req);
  const safeChannels: Record<string, { channelId: string; channelTitle: string; connectedAt: string }> = {};

  for (const [brandId, conn] of Object.entries(connections)) {
    safeChannels[brandId] = {
      channelId: conn.channelId,
      channelTitle: conn.channelTitle,
      connectedAt: conn.connectedAt,
    };
  }

  return NextResponse.json({
    oauthConfigured: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    channels: safeChannels,
  });
}

export async function DELETE(req: NextRequest) {
  const brandId = req.nextUrl.searchParams.get('brandId');
  if (!brandId) {
    return NextResponse.json({ error: 'Missing brandId' }, { status: 400 });
  }

  const connections = readConnections(req);
  delete connections[brandId];

  const res = NextResponse.json({ success: true, brandId });
  const encKey = getEncryptionKey();
  res.cookies.set('yt_connections', encryptSecret(JSON.stringify(connections), encKey), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
