import {
  Asset,
  Brand,
  ManualExportPackage,
  PlatformCapabilities,
  PlatformId,
  Post,
} from '../types/index.js';
import { Platform, PlatformCredentialsData, PostStatusResult, PublishResult } from './Platform.js';

export class FacebookPlatform extends Platform {
  readonly platformId: PlatformId = 'facebook';
  readonly displayName = 'Facebook';

  getCapabilities(): PlatformCapabilities {
    return {
      directPublishingAvailable: true,
      schedulingSupported: true,
      linkInCaptionSupported: true, // Facebook captions support clickable URLs
      maxVideoDurationSec: 90,
      supportedAspectRatios: ['9:16', '16:9'],
      requiresSyntheticContentLabel: true,
      availableMetrics: ['views', 'likes', 'comments', 'shares', 'reach'],
      manualExportRecommended: true,
    };
  }

  async authorize(code: string): Promise<PlatformCredentialsData> {
    return {
      accessToken: `mock-fb-page-token-${Date.now()}`,
      pageId: 'mock-fb-page-id',
    };
  }

  async refreshTokens(credentials: PlatformCredentialsData): Promise<PlatformCredentialsData> {
    return credentials;
  }

  validateAsset(asset: Asset): { valid: boolean; errors: string[] } {
    return { valid: true, errors: [] };
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
      // POST /{page-id}/videos or /{page-id}/video_reels
      const mockPostId = `fb_reel_${Date.now()}`;
      return {
        success: true,
        externalId: mockPostId,
        status: 'published',
        publishedUrl: `https://facebook.com/watch/?v=${mockPostId}`,
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
      viewUrl: `https://facebook.com/watch/?v=${externalId}`,
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
      views: 64,
      likes: 6,
      comments: 0,
      shares: 1,
      avgWatchTimeSec: null,
      completionRate: null,
      followersGained: 0,
      raw: { externalId, platform: 'facebook' },
    };
  }

  prepareManualExport(post: Post, asset: Asset, brand: Brand): ManualExportPackage {
    const instructions = [
      `Open Meta Business Suite (business.facebook.com) or Facebook App for Page: ${brand.name}`,
      `Click 'Create Reel' or 'Upload Video'.`,
      `Select the downloaded video.`,
      `Paste the caption from below (includes clickable links & disclosure).`,
      `Under Content Disclosures, mark "AI-generated content".`,
      `Publish or schedule to match US audience hours.`,
      `Paste the Facebook post link into the "Mark as Posted" input below.`,
    ];

    return {
      postId: post.id,
      brandName: brand.name,
      platformName: this.displayName,
      videoDownloadUrl: asset.filePath,
      coverDownloadUrl: asset.thumbnailPath || asset.filePath,
      captionText: post.caption,
      hashtagsText: post.hashtags.join(' '),
      scheduledTimeUtc: post.scheduledAt,
      instructions,
    };
  }
}
