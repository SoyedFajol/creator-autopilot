import { pgTable, text, timestamp, boolean, integer, jsonb, doublePrecision } from 'drizzle-orm/pg-core';

export const brands = pgTable('brands', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  niche: text('niche').notNull(),
  active: boolean('active').notNull().default(false),
  paused: boolean('paused').notNull().default(false),
  voiceId: text('voice_id').notNull(),
  colors: jsonb('colors').notNull(),
  fonts: jsonb('fonts').notNull(),
  motionStyle: text('motion_style').notNull().default('clean_minimal'),
  profile: jsonb('profile').notNull(),
  cadence: jsonb('cadence').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const ideas = pgTable('ideas', {
  id: text('id').primaryKey(),
  brandId: text('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  topic: text('topic').notNull(),
  pillar: text('pillar').notNull(),
  source: text('source').notNull(),
  similarityScore: doublePrecision('similarity_score').notNull().default(0),
  notes: text('notes'),
  status: text('status').notNull().default('proposed'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const contentPieces = pgTable('content_pieces', {
  id: text('id').primaryKey(),
  brandId: text('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  ideaId: text('idea_id').references(() => ideas.id),
  format: text('format').notNull(), // 'long_landscape' | 'short_portrait'
  status: text('status').notNull().default('planned'),
  chosenTitle: text('chosen_title'),
  titleOptions: jsonb('title_options'),
  thumbnailConcepts: jsonb('thumbnail_concepts'),
  chosenThumbnailIndex: integer('chosen_thumbnail_index').default(0),
  script: jsonb('script'),
  factClaims: jsonb('fact_claims'),
  qualityScore: jsonb('quality_score'),
  promptVersionId: text('prompt_version_id').default('v1.0.0'),
  templateVersionId: text('template_version_id').default('v1.0.0'),
  hookStyle: text('hook_style').default('curiosity_gap'),
  reviewNotes: text('review_notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const assets = pgTable('assets', {
  id: text('id').primaryKey(),
  contentPieceId: text('content_piece_id').notNull().references(() => contentPieces.id, { onDelete: 'cascade' }),
  brandId: text('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  format: text('format').notNull(),
  renderProfileId: text('render_profile_id').notNull(),
  filePath: text('file_path').notNull(),
  subtitlePath: text('subtitle_path'),
  thumbnailPath: text('thumbnail_path'),
  status: text('status').notNull().default('pending'),
  renderTimeMs: integer('render_time_ms').default(0),
  fileSizeBytes: integer('file_size_bytes').default(0),
  musicLicenceId: text('music_licence_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const posts = pgTable('posts', {
  id: text('id').primaryKey(),
  assetId: text('asset_id').notNull().references(() => assets.id, { onDelete: 'cascade' }),
  brandId: text('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  platformId: text('platform_id').notNull(),
  idempotencyKey: text('idempotency_key').notNull().unique(),
  externalId: text('external_id'),
  status: text('status').notNull().default('draft'),
  caption: text('caption').notNull(),
  hashtags: jsonb('hashtags').notNull(),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  manualUrl: text('manual_url'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const metricSnapshots = pgTable('metric_snapshots', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  brandId: text('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  collectedAt: timestamp('collected_at', { withTimezone: true }).defaultNow().notNull(),
  views: integer('views'),
  likes: integer('likes'),
  comments: integer('comments'),
  shares: integer('shares'),
  avgWatchTimeSec: doublePrecision('avg_watch_time_sec'),
  completionRate: doublePrecision('completion_rate'),
  followersGained: integer('followers_gained'),
  rawPayload: jsonb('raw_payload'),
});

export const revenueEntries = pgTable('revenue_entries', {
  id: text('id').primaryKey(),
  brandId: text('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  postId: text('post_id').references(() => posts.id),
  source: text('source').notNull(),
  amountUsd: doublePrecision('amount_usd').notNull(),
  date: timestamp('date', { withTimezone: true }).notNull(),
  note: text('note'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const costEntries = pgTable('cost_entries', {
  id: text('id').primaryKey(),
  brandId: text('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  contentPieceId: text('content_piece_id').references(() => contentPieces.id),
  category: text('category').notNull(),
  amountUsd: doublePrecision('amount_usd').notNull(),
  date: timestamp('date', { withTimezone: true }).notNull(),
  note: text('note'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const experiments = pgTable('experiments', {
  id: text('id').primaryKey(),
  brandId: text('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  variableName: text('variable_name').notNull(),
  variantA: text('variant_a').notNull(),
  variantB: text('variant_b').notNull(),
  postIdA: text('post_id_a').references(() => posts.id),
  postIdB: text('post_id_b').references(() => posts.id),
  metricJudged: text('metric_judged').notNull(),
  resultVerdict: text('result_verdict'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const musicLicences = pgTable('music_licences', {
  id: text('id').primaryKey(),
  trackName: text('track_name').notNull(),
  artist: text('artist').notNull(),
  source: text('source').notNull(),
  licenceType: text('licence_type').notNull(),
  licenceCertPath: text('licence_cert_path').notNull(),
  commercialUseOk: boolean('commercial_use_ok').notNull().default(true),
  attributionRequired: boolean('attribution_required').notNull().default(false),
  platformsCovered: jsonb('platforms_covered').notNull(),
  isFlagged: boolean('is_flagged').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  action: text('action').notNull(),
  actor: text('actor').notNull(),
  ipAddress: text('ip_address'),
  details: jsonb('details').notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
});

export const platformCredentials = pgTable('platform_credentials', {
  id: text('id').primaryKey(),
  brandId: text('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  platformId: text('platform_id').notNull(),
  encryptedTokenPayload: text('encrypted_token_payload').notNull(),
  tokenExpiresAt: timestamp('token_expires_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
