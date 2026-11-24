import { NextRequest, NextResponse } from 'next/server';
import {
  AuditLogger,
  YouTubePlatform,
  decryptSecret,
  encryptSecret,
} from '@creator-autopilot/core';

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

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const stateParam = req.nextUrl.searchParams.get('state');
  const errorParam = req.nextUrl.searchParams.get('error');

  if (errorParam) {
    const errUrl = new URL('/brands', req.nextUrl.origin);
    errUrl.searchParams.set('yt_error', errorParam);
    return NextResponse.redirect(errUrl);
  }

  if (!code || !stateParam) {
    const errUrl = new URL('/brands', req.nextUrl.origin);
    errUrl.searchParams.set('yt_error', 'missing_oauth_code');
    return NextResponse.redirect(errUrl);
  }

  let brandId = 'brand-stack-simple';
  let nonce = '';
  try {
    const parsed = JSON.parse(Buffer.from(stateParam, 'base64url').toString('utf8'));
    brandId = parsed.brandId || brandId;
    nonce = parsed.nonce || '';
  } catch {
    const errUrl = new URL('/brands', req.nextUrl.origin);
    errUrl.searchParams.set('yt_error', 'invalid_oauth_state');
    return NextResponse.redirect(errUrl);
  }

  const expectedNonce = req.cookies.get('yt_oauth_state')?.value;
  if (!expectedNonce || expectedNonce !== nonce) {
    const errUrl = new URL('/brands', req.nextUrl.origin);
    errUrl.searchParams.set('yt_error', 'csrf_state_mismatch');
    return NextResponse.redirect(errUrl);
  }

  try {
    const yt = new YouTubePlatform();
    const redirectUri = `${req.nextUrl.origin}/api/auth/youtube/callback`;
    const credentials = await yt.authorize(code, redirectUri);

    const encKey = getEncryptionKey();
    const encryptedTokens = encryptSecret(JSON.stringify(credentials), encKey);

    let connections: Record<string, StoredConnection> = {};
    const existingCookie = req.cookies.get('yt_connections')?.value;
    if (existingCookie) {
      try {
        connections = JSON.parse(decryptSecret(existingCookie, encKey));
      } catch {
        connections = {};
      }
    }

    connections[brandId] = {
      channelId: credentials.accountId || 'unknown',
      channelTitle: credentials.pageId || 'YouTube Channel',
      connectedAt: new Date().toISOString(),
      encryptedTokens,
    };

    const sealedCookie = encryptSecret(JSON.stringify(connections), encKey);

    await AuditLogger.log(
      'sign_in',
      'dashboard-admin',
      { event: 'youtube_oauth_connected', brandId, channelId: credentials.accountId, channelTitle: credentials.pageId },
      req.headers.get('x-forwarded-for') || '127.0.0.1'
    );

    const successUrl = new URL('/brands', req.nextUrl.origin);
    successUrl.searchParams.set('yt_connected', brandId);
    successUrl.searchParams.set('channel', credentials.pageId || 'YouTube Channel');

    const res = NextResponse.redirect(successUrl);
    res.cookies.delete('yt_oauth_state');
    res.cookies.set('yt_connections', sealedCookie, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return res;
  } catch (err: any) {
    const errUrl = new URL('/brands', req.nextUrl.origin);
    errUrl.searchParams.set('yt_error', err.message || 'oauth_exchange_failed');
    return NextResponse.redirect(errUrl);
  }
}
