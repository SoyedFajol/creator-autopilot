export type PlatformId = 'youtube' | 'instagram' | 'facebook' | 'tiktok';

export type IdeaStatus = 'proposed' | 'selected' | 'rejected' | 'used';

export type ContentStatus =
  | 'planned'
  | 'packaged'
  | 'scripted'
  | 'visual_planned'
  | 'rendering'
  | 'rendered'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'publishing'
  | 'ready_for_manual'
  | 'published'
  | 'partially_published'
  | 'failed';

export type AssetStatus = 'pending' | 'rendering' | 'ready' | 'failed';

export type PostStatus =
  | 'draft'
  | 'scheduled'
  | 'publishing'
  | 'ready_for_manual'
  | 'published'
  | 'failed';

export type VideoFormat = 'long_landscape' | 'short_portrait';

export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface BrandFonts {
  heading: string;
  body: string;
  mono?: string;
}

export interface Cadence {
  longVideosPerWeek: number;
  shortsPerWeek: number;
  publishTimesUtc: {
    youtube?: string; // HH:mm
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
}

export interface BrandProfile {
  targetViewer: string;
  problemSolved: string;
  promise: string;
  contentPillars: string[];
  recurringSeries: string[];
  tone: string;
  differentiator: string;
  requiredDisclaimer?: string;
  ymylRisk: 'none' | 'low' | 'medium' | 'high' | 'very_high';
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  niche: string;
  active: boolean;
  paused: boolean;
  voiceId: string;
  colors: BrandColors;
  fonts: BrandFonts;
  motionStyle: 'clean_minimal' | 'bold_punchy' | 'tech_modern' | 'editorial';
  profile: BrandProfile;
  cadence: Cadence;
  createdAt: string;
  updatedAt: string;
}

export interface Idea {
  id: string;
  brandId: string;
  topic: string;
  pillar: string;
  source: 'youtube_trending' | 'search_demand' | 'manual' | 'daily_report_action';
  similarityScore: number;
  notes?: string;
  status: IdeaStatus;
  createdAt: string;
}

export interface TitleOption {
  title: string;
  hookAngle: string;
  score: number;
}

export interface ThumbnailConcept {
  id: string;
  headlineText: string; // 4 words or fewer
  focalObject: string;
  visualLayout: 'split' | 'centered' | 'badge_highlight' | 'comparison';
  stockKeywordQuery?: string;
}

export interface FactClaim {
  id: string;
  claim: string;
  sourceUrl?: string;
  sourceTitle?: string;
  verified: boolean;
  verificationNotes?: string;
  isNumerical: boolean;
}

export interface ScriptSection {
  id: string;
  sectionNumber: number;
  title: string;
  spokenText: string;
  estimatedDurationSec: number;
  visualPlan: {
    visualType: 'stock_clip' | 'animated_chart' | 'animated_text' | 'diagram' | 'screen_recording' | 'comparison_table';
    description: string;
    stockQuery?: string;
    chartData?: {
      type: 'bar' | 'line' | 'metric_card';
      labels: string[];
      values: number[];
      unit?: string;
    };
    tableData?: {
      headers: string[];
      rows: string[][];
    };
    screenRecordingInstruction?: string;
  };
}

export interface Script {
  hook: string;
  first15SecondsPayoff: string;
  sections: ScriptSection[];
  callToAction: {
    type: 'next_video' | 'free_resource' | 'affiliate_link';
    message: string;
    url?: string;
  };
  chapters: Array<{ timestamp: string; title: string }>;
  descriptionTemplate: string;
  tags: string[];
  nativeCaptions: Record<PlatformId, { caption: string; hashtags: string[] }>;
  factClaims: FactClaim[];
}

export interface QualityScore {
  overallScore: number; // 0 - 100
  hookScore: number; // 0 - 25
  pacingScore: number; // 0 - 25
  clarityScore: number; // 0 - 25
  originalityScore: number; // 0 - 25
  unverifiedClaimsCount: number;
  hasSyntheticLabelRequired: boolean;
  policyViolations: string[];
  pass: boolean;
  reviewNotes: string[];
}

export interface MusicLicence {
  id: string;
  trackName: string;
  artist: string;
  source: 'pixabay' | 'youtube_audio_library' | 'custom';
  licenceType: string;
  licenceCertPath: string;
  commercialUseOk: boolean;
  attributionRequired: boolean;
  platformsCovered: PlatformId[];
  isFlagged: boolean;
}

export interface RenderProfile {
  id: string;
  name: string;
  aspectRatio: '16:9' | '9:16';
  width: number;
  height: number;
  fps: number;
  maxDurationSec: number;
  safeZones: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface Asset {
  id: string;
  contentPieceId: string;
  format: VideoFormat;
  renderProfileId: string;
  filePath: string;
  subtitlePath: string;
  thumbnailPath: string;
  status: AssetStatus;
  renderTimeMs: number;
  fileSizeBytes?: number;
  musicLicenceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrackedLink {
  id: string;
  brandId: string;
  platform: PlatformId;
  destinationUrl: string;
  shortCode: string;
  utmCampaign: string;
  clicks: number;
}

export interface Post {
  id: string;
  assetId: string;
  brandId: string;
  platformId: PlatformId;
  idempotencyKey: string;
  externalId?: string;
  status: PostStatus;
  caption: string;
  hashtags: string[];
  scheduledAt?: string;
  publishedAt?: string;
  manualUrl?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MetricSnapshot {
  id: string;
  postId: string;
  collectedAt: string;
  views: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  avgWatchTimeSec: number | null;
  completionRate: number | null;
  followersGained: number | null;
  rawPayload?: Record<string, unknown>;
}

export interface RevenueEntry {
  id: string;
  brandId: string;
  postId?: string;
  source: 'affiliate' | 'email_product' | 'sponsorship' | 'platform_ads';
  amountUsd: number;
  date: string;
  note?: string;
}

export interface CostEntry {
  id: string;
  brandId: string;
  contentPieceId?: string;
  category: 'github_actions' | 'vps_hosting' | 'ai_api' | 'storage' | 'domain';
  amountUsd: number;
  date: string;
  note?: string;
}

export interface Experiment {
  id: string;
  brandId: string;
  variableName: 'hook_style' | 'voice_id' | 'template_style' | 'title_angle';
  variantA: string;
  variantB: string;
  postIdA?: string;
  postIdB?: string;
  metricJudged: string;
  resultVerdict?: string;
  createdAt: string;
}

export interface PlatformCapabilities {
  directPublishingAvailable: boolean;
  schedulingSupported: boolean;
  linkInCaptionSupported: boolean;
  maxVideoDurationSec: number;
  supportedAspectRatios: ('16:9' | '9:16')[];
  requiresSyntheticContentLabel: boolean;
  availableMetrics: string[];
  manualExportRecommended: boolean;
}

export interface ManualExportPackage {
  postId: string;
  brandName: string;
  platformName: string;
  videoDownloadUrl: string;
  coverDownloadUrl: string;
  captionText: string;
  hashtagsText: string;
  firstCommentText?: string;
  scheduledTimeUtc?: string;
  instructions: string[];
}

export interface AuditLogEntry {
  id: string;
  action: 'sign_in' | 'approve_content' | 'reject_content' | 'manual_publish' | 'api_publish' | 'reply_comment' | 'emergency_stop' | 'toggle_brand' | 'backup_restore';
  actor: string;
  ipAddress?: string;
  details: Record<string, unknown>;
  timestamp: string;
}
