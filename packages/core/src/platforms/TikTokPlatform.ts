import {
  Asset,
  Brand,
  ManualExportPackage,
  PlatformCapabilities,
  PlatformId,
  Post,
} from '../types/index.js';
import { Platform, PlatformCredentialsData, PostStatusResult, PublishResult } from './Platform.js';

export class TikTokPlatform extends Platform {
  readonly platformId: PlatformId = 'tiktok';
  readonly displayName = 'TikTok';

  getCapabilities(): PlatformCapabilities {
    return {
      directPublishingAvailable: true,
      schedulingSupported: true,
      linkInCaptionSupported: false, // TikTok captions do not support clickable URLs
      maxVideoDurationSec: 60,
      supportedAspectRatios: ['9:16'],
      requiresSyntheticContentLabel: true,
      availableMetrics: ['views', 'likes', 'comments', 'shares', 'completionRate'],
      manualExportRecommended: true, // TikTok explicitly bans personal use apps from public publishing
    };
  }

  async authorize(code: string): Promise<PlatformCredentialsData> {
    return {
      accessToken: `mock-tiktok-token-${Date.now()}`,
      accountId: 'mock-tiktok-open-id',
    };
  }

  async refreshTokens(credentials: PlatformCredentialsData): Promise<PlatformCredentialsData> {
    return credentials;
  }

  validateAsset(asset: Asset): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (asset.format !== 'short_portrait') {
      errors.push('TikTok only accepts vertical 9:16 portrait format');
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
    // Unaudited TikTok client apps are restricted to SELF_ONLY (private) posts.
    // Manual upload is the official sanctioned path for single creator channels.
    if (forceManual || !credentials?.accessToken) {
      return {
        success: true,
        status: 'ready_for_manual',
      };
    }

    try {
      // POST https://open.tiktokapis.com/v2/post/publish/video/init/
      const mockPublishId = `tt_publish_${Date.now()}`;
      return {
        success: true,
        externalId: mockPublishId,
        status: 'published',
        publishedUrl: `https://tiktok.com/@${brand.slug}/video/${mockPublishId}`,
      };
    } catch (err: any) {
      return {
        success: false,
        status: 'failed',
        errorMessage: err.message,
      };
    }
  }

  async checkPostStatus(externalId: string): Promise<PostStatusResult> {
    return {
      status: 'published',
      viewUrl: `https://tiktok.com/video/${externalId}`,
    };
  }

  async deletePost(externalId: string): Promise<boolean> {
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
    return {
      views: 195,
      likes: 22,
      comments: 4,
      shares: 7,
      avgWatchTimeSec: 18.5,
      completionRate: 0.44,
      followersGained: 2,
      raw: { externalId, platform: 'tiktok' },
    };
  }

  prepareManualExport(post: Post, asset: Asset, brand: Brand): ManualExportPackage {
    const instructions = [
      `Open TikTok App on your phone and switch to: @${brand.slug}`,
      `Tap '+' and upload the downloaded vertical 9:16 video.`,
      `Select a high-contrast cover frame or text sticker for the thumbnail.`,
      `Paste the caption & hashtags from below using the one-tap copy button.`,
      `Under 'More options', toggle on 'AI-generated content' label (mandatory policy).`,
      `Post the video (or schedule).`,
      `Copy the link from the TikTok share sheet and paste it below to register tracking.`,
    ];

    return {
      postId: post.id,
      brandName: brand.name,
      platformName: this.displayName,
      videoDownloadUrl: asset.filePath,
      coverDownloadUrl: asset.thumbnailPath || asset.filePath,
      captionText: post.caption,
      hashtagsText: post.hashtags.join(' '),
      firstCommentText: `👉 Link in bio for the free downloadable guide!`,
      scheduledTimeUtc: post.scheduledAt,
      instructions,
    };
  }
}
