import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'node:crypto';
import { YouTubePlatform } from '@creator-autopilot/core';

export async function GET(req: NextRequest) {
  const brandId = req.nextUrl.searchParams.get('brandId') || 'brand-stack-simple';

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    const errorUrl = new URL('/brands', req.nextUrl.origin);
    errorUrl.searchParams.set('yt_error', 'missing_google_oauth_env');
    return NextResponse.redirect(errorUrl);
  }

  const redirectUri = `${req.nextUrl.origin}/api/auth/youtube/callback`;
  const nonce = crypto.randomBytes(16).toString('hex');
  const state = Buffer.from(JSON.stringify({ brandId, nonce })).toString('base64url');

  const yt = new YouTubePlatform();
  const authUrl = yt.getAuthUrl(redirectUri, state);

  const res = NextResponse.redirect(authUrl);
  res.cookies.set('yt_oauth_state', nonce, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 600,
  });
  return res;
}
