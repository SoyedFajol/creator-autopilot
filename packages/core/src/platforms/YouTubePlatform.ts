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

  async authorize(code: string): Promise<PlatformCredentialsData> {
    return {
      accessToken: `mock-yt-token-${Date.now()}`,
      refreshToken: `mock-yt-refresh-${Date.now()}`,
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      accountId: 'mock-yt-channel-id',
    };
  }

  async refreshTokens(credentials: PlatformCredentialsData): Promise<PlatformCredentialsData> {
    return {
      ...credentials,
      accessToken: `mock-yt-refreshed-token-${Date.now()}`,
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
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
    // If compliance audit is pending or forceManual is enabled, generate manual export package
    if (forceManual || !credentials?.accessToken) {
      return {
        success: true,
        status: 'ready_for_manual',
        publishedUrl: undefined,
        errorMessage: undefined,
      };
    }

    // Direct YouTube Data API v3 upload implementation structure:
    try {
      // 1. Check idempotency: Query existing videos for post.idempotencyKey tag
      // 2. Perform Resumable Upload to https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status
      // 3. Set custom thumbnail via https://www.googleapis.com/upload/youtube/v3/thumbnails/set
      // 4. Attach caption/subtitle track if available
      const mockVideoId = `yt_${Date.now()}`;
      return {
        success: true,
        externalId: mockVideoId,
        status: 'published',
        publishedUrl: `https://youtube.com/watch?v=${mockVideoId}`,
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
