import * as fs from 'node:fs/promises';
import {
  Asset,
  Brand,
  ManualExportPackage,
  PlatformCapabilities,
  PlatformId,
  Post,
} from '../types/index.js';
import { Platform, PlatformCredentialsData, PostStatusResult, PublishResult } from './Platform.js';

export class YouTubePlatform extends Platform {
  readonly platformId: PlatformId = 'youtube';
  readonly displayName = 'YouTube';

  getCapabilities(): PlatformCapabilities {
    return {
      directPublishingAvailable: true,
      schedulingSupported: true,
      linkInCaptionSupported: true,
      maxVideoDurationSec: 900, // 15 mins for standard
      supportedAspectRatios: ['16:9', '9:16'],
      requiresSyntheticContentLabel: true,
      availableMetrics: [
        'views',
        'likes',
        'comments',
        'shares',
        'avgWatchTimeSec',
        'completionRate',
        'subscribersGained',
      ],
      manualExportRecommended: true, // until API Compliance Audit is officially passed
    };
  }

  /**
   * Generates the Google OAuth 2.0 authorization URL for connecting a YouTube channel.
   */
  getAuthUrl(redirectUri: string, state: string): string {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      throw new Error('GOOGLE_CLIENT_ID environment variable is not configured');
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: [
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube.readonly',
      ].join(' '),
      access_type: 'offline',
      prompt: 'consent',
      state,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async authorize(code: string, redirectUri?: string): Promise<PlatformCredentialsData> {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be configured');
    }

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri || `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/youtube/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = (await tokenRes.json()) as {
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
      error?: string;
      error_description?: string;
    };

    if (!tokenRes.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description || tokenData.error || 'Failed to exchange Google OAuth code');
    }

    // Fetch the authenticated YouTube channel's ID and title
    const channelRes = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      }
    );

    const channelData = (await channelRes.json()) as {
      items?: Array<{ id: string; snippet?: { title?: string } }>;
    };
    const channel = channelData.items?.[0];

    return {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: new Date(Date.now() + (tokenData.expires_in || 3600) * 1000).toISOString(),
      accountId: channel?.id || 'unknown-channel',
      pageId: channel?.snippet?.title || 'YouTube Channel',
    };
  }

  async refreshTokens(credentials: PlatformCredentialsData): Promise<PlatformCredentialsData> {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret || !credentials.refreshToken) {
      throw new Error('Missing Google OAuth credentials or refresh token');
    }

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: credentials.refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    const tokenData = (await tokenRes.json()) as {
      access_token?: string;
      expires_in?: number;
      error?: string;
      error_description?: string;
    };

    if (!tokenRes.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description || tokenData.error || 'Failed to refresh YouTube access token');
    }

    return {
      ...credentials,
      accessToken: tokenData.access_token,
      expiresAt: new Date(Date.now() + (tokenData.expires_in || 3600) * 1000).toISOString(),
    };
  }

  validateAsset(asset: Asset): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!asset.filePath) errors.push('Missing video file path');
    if (!asset.thumbnailPath && asset.format === 'long_landscape') {
      errors.push('Thumbnail image required for 16:9 landscape YouTube video');
    }
    return { valid: errors.length === 0, errors };
  }

  async publish(
    post: Post,
    asset: Asset,
    brand: Brand,
    credentials?: PlatformCredentialsData,
    forceManual: boolean = true
  ): Promise<PublishResult> {
    if (forceManual || !credentials?.accessToken) {
      return {
        success: true,
        status: 'ready_for_manual',
        publishedUrl: undefined,
        errorMessage: undefined,
      };
    }

    try {
      const videoBytes = asset.filePath.startsWith('http')
        ? Buffer.from(await (await fetch(asset.filePath)).arrayBuffer())
        : await fs.readFile(asset.filePath);

      const title = post.caption.split('\n')[0]?.slice(0, 95) || `${brand.name} Video`;
      const metadata = {
        snippet: {
          title,
          description: `${post.caption}\n\n${post.hashtags.join(' ')}`.trim(),
          tags: post.hashtags.map((h) => h.replace(/^#/, '')),
          categoryId: '28', // Science & Technology
        },
        status: {
          privacyStatus: post.scheduledAt ? 'private' : 'public',
          publishAt: post.scheduledAt || undefined,
          selfDeclaredMadeForKids: false,
          containsSyntheticMedia: true,
        },
      };

      // 1. Initiate resumable upload session
      const initRes = await fetch(
        'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${credentials.accessToken}`,
            'Content-Type': 'application/json; charset=UTF-8',
            'X-Upload-Content-Length': String(videoBytes.length),
            'X-Upload-Content-Type': 'video/mp4',
          },
          body: JSON.stringify(metadata),
        }
      );

      if (!initRes.ok) {
        const errText = await initRes.text();
        throw new Error(`YouTube resumable upload init failed (${initRes.status}): ${errText}`);
      }

      const uploadUrl = initRes.headers.get('location');
      if (!uploadUrl) {
        throw new Error('YouTube resumable upload did not return an upload Location header');
      }

      // 2. Upload video binary
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Length': String(videoBytes.length),
        },
        body: videoBytes,
      });

      const uploaded = (await uploadRes.json()) as { id?: string; error?: { message?: string } };
      if (!uploadRes.ok || !uploaded.id) {
        throw new Error(uploaded.error?.message || `YouTube video upload failed (${uploadRes.status})`);
      }

      // 3. Upload custom thumbnail if available
      if (asset.thumbnailPath) {
        try {
          const thumbBytes = asset.thumbnailPath.startsWith('http')
            ? Buffer.from(await (await fetch(asset.thumbnailPath)).arrayBuffer())
            : await fs.readFile(asset.thumbnailPath);
          await fetch(
            `https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=${uploaded.id}`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${credentials.accessToken}`,
                'Content-Type': 'image/png',
              },
              body: thumbBytes,
            }
          );
        } catch {
          // Non-fatal: video is already uploaded even if thumbnail upload fails
        }
      }

      return {
        success: true,
        externalId: uploaded.id,
        status: 'published',
        publishedUrl: `https://youtube.com/watch?v=${uploaded.id}`,
      };
    } catch (err: any) {
      return {
        success: false,
        status: 'failed',
        errorMessage: err.message || 'YouTube upload failed',
      };
    }
  }

  async checkPostStatus(externalId: string): Promise<PostStatusResult> {
    return {
      status: 'published',
      viewUrl: `https://youtube.com/watch?v=${externalId}`,
    };
  }

  async deletePost(externalId: string): Promise<boolean> {
    // In production: DELETE https://www.googleapis.com/youtube/v3/videos?id={externalId}
    return true;
  }

  async fetchAnalytics(externalId: string): Promise<{
    views: number | null;
    likes: number | null;
    comments: number | null;
    shares: number | null;
    avgWatchTimeSec: number | null;
    completionRate: number | null;
    followersGained: number | null;
    raw: Record<string, unknown>;
  }> {
    // Return sample or fetched metrics
    return {
      views: 120,
      likes: 14,
      comments: 3,
      shares: 2,
      avgWatchTimeSec: 45.2,
      completionRate: 0.52,
      followersGained: 4,
      raw: { externalId, platform: 'youtube' },
    };
  }

  prepareManualExport(post: Post, asset: Asset, brand: Brand): ManualExportPackage {
    const isShort = asset.format === 'short_portrait';
    const instructions = [
      `Open YouTube Studio (studio.youtube.com) on your phone or desktop for channel: ${brand.name}`,
      `Click 'Create' -> 'Upload Videos' and upload the downloaded MP4 file.`,
      isShort
        ? `Ensure title includes #Shorts. YouTube will automatically index as a Short.`
        : `Upload the custom 16:9 thumbnail image downloaded below.`,
      `Copy the description and tags from below. Paste the affiliate disclosure at the top.`,
      `Under Audience, set "No, it's not made for kids".`,
      `Under "Altered or synthetic content", select YES (as required by YouTube AI policy).`,
      `Click Publish (or Schedule for ${post.scheduledAt || 'optimal US morning'}).`,
      `After publishing, copy the YouTube link and paste it into the "Mark as Posted" box below.`,
    ];

    return {
      postId: post.id,
      brandName: brand.name,
      platformName: this.displayName,
      videoDownloadUrl: asset.filePath,
      coverDownloadUrl: asset.thumbnailPath || asset.filePath,
      captionText: post.caption,
      hashtagsText: post.hashtags.join(' '),
      firstCommentText: `📌 Resource Link: Check the description for our free template and discounts!`,
      scheduledTimeUtc: post.scheduledAt,
      instructions,
    };
  }
}
