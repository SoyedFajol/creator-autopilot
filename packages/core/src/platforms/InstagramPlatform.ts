import {
  Asset,
  Brand,
  ManualExportPackage,
  PlatformCapabilities,
  PlatformId,
  Post,
} from '../types/index.js';
import { Platform, PlatformCredentialsData, PostStatusResult, PublishResult } from './Platform.js';

export class InstagramPlatform extends Platform {
  readonly platformId: PlatformId = 'instagram';
  readonly displayName = 'Instagram';

  getCapabilities(): PlatformCapabilities {
    return {
      directPublishingAvailable: true,
      schedulingSupported: true,
      linkInCaptionSupported: false, // Instagram captions do not support clickable links
      maxVideoDurationSec: 90, // Reels limit
      supportedAspectRatios: ['9:16'],
      requiresSyntheticContentLabel: true,
      availableMetrics: ['views', 'likes', 'comments', 'shares', 'reach', 'saves'],
      manualExportRecommended: true, // Meta App in Dev mode is invisible to public
    };
  }

  async authorize(code: string): Promise<PlatformCredentialsData> {
    return {
      accessToken: `mock-ig-token-${Date.now()}`,
      expiresAt: new Date(Date.now() + 60 * 86400 * 1000).toISOString(),
      accountId: 'mock-ig-user-id',
    };
  }

  async refreshTokens(credentials: PlatformCredentialsData): Promise<PlatformCredentialsData> {
    return credentials;
  }

  validateAsset(asset: Asset): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (asset.format !== 'short_portrait') {
      errors.push('Instagram Reels require 9:16 vertical short format');
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
      };
    }

    try {
      // 1. POST /{ig-user-id}/media?media_type=REELS&video_url=...&caption=...
      // 2. Poll container status until FINISHED
      // 3. POST /{ig-user-id}/media_publish?creation_id=...
      const mockContainerId = `ig_reel_${Date.now()}`;
      return {
        success: true,
        externalId: mockContainerId,
        status: 'published',
        publishedUrl: `https://instagram.com/reel/${mockContainerId}`,
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
      viewUrl: `https://instagram.com/reel/${externalId}`,
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
      views: 85,
      likes: 9,
      comments: 1,
      shares: 3,
      avgWatchTimeSec: null, // IG API exposes plays / reach
      completionRate: null,
      followersGained: 1,
      raw: { externalId, platform: 'instagram' },
    };
  }

  prepareManualExport(post: Post, asset: Asset, brand: Brand): ManualExportPackage {
    const instructions = [
      `Open Instagram on your phone and switch to profile: ${brand.name}`,
      `Tap '+' and choose 'Reel'. Select the downloaded vertical video.`,
      `Select a cover frame or upload the vertical cover image.`,
      `Tap 'Next' and paste the caption & hashtags from the one-tap copy button below.`,
      `Add "Link in bio for full resources" if applicable.`,
      `Under 'Advanced settings', toggle on 'Made with AI' (Meta synthetic content policy).`,
      `Tap Share (or Schedule). Paste the live Reel link below to complete tracking.`,
    ];

    return {
      postId: post.id,
      brandName: brand.name,
      platformName: this.displayName,
      videoDownloadUrl: asset.filePath,
      coverDownloadUrl: asset.thumbnailPath || asset.filePath,
      captionText: post.caption,
      hashtagsText: post.hashtags.join(' '),
      firstCommentText: `🔗 Check link in bio for the complete template and resources!`,
      scheduledTimeUtc: post.scheduledAt,
      instructions,
    };
  }
}
