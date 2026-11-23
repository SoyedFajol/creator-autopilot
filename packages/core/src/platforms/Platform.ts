import {
  Asset,
  Brand,
  ManualExportPackage,
  PlatformCapabilities,
  PlatformId,
  Post,
} from '../types/index.js';

export interface PublishResult {
  success: boolean;
  externalId?: string;
  status: 'published' | 'ready_for_manual' | 'failed';
  publishedUrl?: string;
  errorMessage?: string;
  idempotencyKeyMatched?: boolean;
}

export interface PostStatusResult {
  status: 'processing' | 'published' | 'failed';
  viewUrl?: string;
  errorMessage?: string;
}

export interface PlatformCredentialsData {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  accountId?: string;
  pageId?: string;
}

export abstract class Platform {
  abstract readonly platformId: PlatformId;
  abstract readonly displayName: string;

  abstract getCapabilities(): PlatformCapabilities;

  abstract authorize(code: string): Promise<PlatformCredentialsData>;

  abstract refreshTokens(credentials: PlatformCredentialsData): Promise<PlatformCredentialsData>;

  abstract validateAsset(asset: Asset): { valid: boolean; errors: string[] };

  abstract publish(
    post: Post,
    asset: Asset,
    brand: Brand,
    credentials?: PlatformCredentialsData,
    forceManual?: boolean
  ): Promise<PublishResult>;

  abstract checkPostStatus(
    externalId: string,
    credentials?: PlatformCredentialsData
  ): Promise<PostStatusResult>;

  abstract deletePost(
    externalId: string,
    credentials?: PlatformCredentialsData
  ): Promise<boolean>;

  abstract fetchAnalytics(
    externalId: string,
    credentials?: PlatformCredentialsData
  ): Promise<{
    views: number | null;
    likes: number | null;
    comments: number | null;
    shares: number | null;
    avgWatchTimeSec: number | null;
    completionRate: number | null;
    followersGained: number | null;
    raw: Record<string, unknown>;
  }>;

  abstract prepareManualExport(
    post: Post,
    asset: Asset,
    brand: Brand
  ): ManualExportPackage;
}
