import { Asset, Brand, PlatformId, Post, VideoFormat } from '../types/index.js';
import { Platform } from './Platform.js';
import { PlatformRegistry } from './PlatformRegistry.js';

export interface PublishStepResult {
  platformId: PlatformId;
  success: boolean;
  status: 'published' | 'ready_for_manual' | 'failed' | 'skipped';
  externalId?: string;
  errorMessage?: string;
}

export interface StaggerSchedule {
  platformId: PlatformId;
  delayMinutes: number;
}

export class PublishingPolicy {
  constructor(private registry: PlatformRegistry) {}

  /**
   * Default platform execution order and dependencies:
   * 1. YouTube must go first and succeed (primary anchor for content & monetization).
   * 2. Instagram, Facebook, and TikTok run afterwards staggered.
   * 3. A failure on a later platform (e.g. TikTok) does NOT block or roll back the others.
   */
  readonly executionOrder: PlatformId[] = ['youtube', 'instagram', 'facebook', 'tiktok'];

  readonly defaultStaggers: StaggerSchedule[] = [
    { platformId: 'youtube', delayMinutes: 0 },
    { platformId: 'instagram', delayMinutes: 60 },
    { platformId: 'facebook', delayMinutes: 120 },
    { platformId: 'tiktok', delayMinutes: 180 },
  ];

  /**
   * Resolves the required video format profile for each platform.
   * Instagram, Facebook, and TikTok receive the short portrait profile.
   * YouTube supports both long landscape (standard video) and short portrait (Shorts).
   */
  getTargetFormat(platformId: PlatformId, sourceFormat: VideoFormat): VideoFormat {
    if (platformId === 'youtube') {
      return sourceFormat;
    }
    // All secondary syndication channels strictly receive short vertical portrait
    return 'short_portrait';
  }

  /**
   * Validates whether an asset is compatible with all target platforms.
   */
  validateAll(
    platforms: PlatformId[],
    asset: Asset
  ): Record<PlatformId, { valid: boolean; errors: string[] }> {
    const results: Partial<Record<PlatformId, { valid: boolean; errors: string[] }>> = {};

    for (const pId of platforms) {
      const platform = this.registry.get(pId);
      results[pId] = platform.validateAsset(asset);
    }

    return results as Record<PlatformId, { valid: boolean; errors: string[] }>;
  }

  /**
   * Executes publishing sequentially following dependencies.
   */
  async executePipeline(
    postsByPlatform: Map<PlatformId, { post: Post; asset: Asset }>,
    brand: Brand,
    options?: { forceManual?: boolean }
  ): Promise<PublishStepResult[]> {
    const stepResults: PublishStepResult[] = [];
    const forceManual = options?.forceManual ?? true; // Default to manual export mode as planned

    // Check YouTube first
    const youtubeEntry = postsByPlatform.get('youtube');
    let youtubeSucceeded = false;

    if (youtubeEntry) {
      const ytPlatform = this.registry.get('youtube');
      const ytRes = await ytPlatform.publish(
        youtubeEntry.post,
        youtubeEntry.asset,
        brand,
        undefined,
        forceManual
      );

      youtubeSucceeded = ytRes.success;
      stepResults.push({
        platformId: 'youtube',
        success: ytRes.success,
        status: ytRes.status,
        externalId: ytRes.externalId,
        errorMessage: ytRes.errorMessage,
      });

      if (!youtubeSucceeded) {
        // If YouTube fails, secondary syndication is suspended until YouTube succeeds
        for (const pId of this.executionOrder.filter((id) => id !== 'youtube')) {
          if (postsByPlatform.has(pId)) {
            stepResults.push({
              platformId: pId,
              success: false,
              status: 'skipped',
              errorMessage: 'Skipped because prerequisite YouTube publishing failed',
            });
          }
        }
        return stepResults;
      }
    } else {
      youtubeSucceeded = true;
    }

    // Secondary platforms run independently; a failure does not block others
    const remaining = this.executionOrder.filter((id) => id !== 'youtube');
    for (const pId of remaining) {
      const entry = postsByPlatform.get(pId);
      if (!entry) continue;

      try {
        const platform = this.registry.get(pId);
        const res = await platform.publish(
          entry.post,
          entry.asset,
          brand,
          undefined,
          forceManual
        );

        stepResults.push({
          platformId: pId,
          success: res.success,
          status: res.status,
          externalId: res.externalId,
          errorMessage: res.errorMessage,
        });
      } catch (err: any) {
        stepResults.push({
          platformId: pId,
          success: false,
          status: 'failed',
          errorMessage: err.message,
        });
      }
    }

    return stepResults;
  }
}
