import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encryptSecret, decryptSecret } from './security/encryption.js';
import { createWorkflowToken, verifyWorkflowToken } from './security/workflowAuth.js';
import { INITIAL_BRANDS, RENDER_PROFILES } from './config/brands.js';
import { platformRegistry } from './platforms/PlatformRegistry.js';
import { PublishingPolicy } from './platforms/PublishingPolicy.js';
import { ClaimVerificationService } from './services/claims.js';
import { QualityScoringService } from './services/quality.js';
import { PackagingService } from './services/packaging.js';
import { GeminiAIService } from './services/ai.js';
import { ScriptWriterService } from './services/script.js';

test('Security: AES-256-GCM encryption & decryption roundtrip', () => {
  const secretKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  const plainText = 'my-super-secret-youtube-access-token-12345';

  const encrypted = encryptSecret(plainText, secretKey);
  assert.notEqual(encrypted, plainText);
  assert.match(encrypted, /^[0-9a-f]+:[0-9a-f]+:[0-9a-f]+$/);

  const decrypted = decryptSecret(encrypted, secretKey);
  assert.equal(decrypted, plainText);
});

test('Security: Workflow JWT token generation and validation', async () => {
  const secret = 'my-jwt-secret-key-that-is-at-least-32-chars-long';
  const token = await createWorkflowToken(
    { sub: 'github-actions-runner', role: 'workflow_worker', action: 'production' },
    secret
  );

  assert.ok(token.length > 50);

  const verified = await verifyWorkflowToken(token, secret);
  assert.equal(verified.sub, 'github-actions-runner');
  assert.equal(verified.role, 'workflow_worker');
  assert.equal(verified.action, 'production');
});

test('Brands: Config contains 6 brands with Stack Simple and Worth the Upgrade active', () => {
  assert.equal(INITIAL_BRANDS.length, 6);
  const activeBrands = INITIAL_BRANDS.filter((b) => b.active);
  assert.equal(activeBrands.length, 2);
  assert.deepEqual(
    activeBrands.map((b) => b.name),
    ['Stack Simple', 'Worth the Upgrade']
  );
  assert.ok(RENDER_PROFILES.long_landscape);
  assert.ok(RENDER_PROFILES.short_portrait);
});

test('Platforms: Registry supports all 4 platforms with manual export mode', () => {
  const platforms = platformRegistry.getAll();
  assert.equal(platforms.length, 4);

  const yt = platformRegistry.get('youtube');
  assert.equal(yt.displayName, 'YouTube');
  assert.equal(yt.getCapabilities().manualExportRecommended, true);

  const tt = platformRegistry.get('tiktok');
  assert.equal(tt.displayName, 'TikTok');
  assert.equal(tt.getCapabilities().manualExportRecommended, true);
});

test('PublishingPolicy: YouTube prerequisite failure blocks secondary platforms', async () => {
  const policy = new PublishingPolicy(platformRegistry);
  const brand = INITIAL_BRANDS[0];

  const postsMap = new Map();
  // Simulate mock post with no file path to trigger validation / failure
  postsMap.set('youtube', {
    post: { id: 'p1', assetId: 'a1', brandId: brand.id, platformId: 'youtube', idempotencyKey: 'k1', status: 'draft', caption: 'Test', hashtags: [] },
    asset: { id: 'a1', contentPieceId: 'cp1', format: 'long_landscape', renderProfileId: 'long_landscape', filePath: '', subtitlePath: '', thumbnailPath: '', status: 'ready', renderTimeMs: 1000, createdAt: '', updatedAt: '' },
  });
  postsMap.set('tiktok', {
    post: { id: 'p2', assetId: 'a2', brandId: brand.id, platformId: 'tiktok', idempotencyKey: 'k2', status: 'draft', caption: 'Test', hashtags: [] },
    asset: { id: 'a2', contentPieceId: 'cp1', format: 'short_portrait', renderProfileId: 'short_portrait', filePath: 'test.mp4', subtitlePath: '', thumbnailPath: '', status: 'ready', renderTimeMs: 1000, createdAt: '', updatedAt: '' },
  });

  const results = await policy.executePipeline(postsMap, brand, { forceManual: true });
  assert.ok(results.length >= 2);
  assert.equal(results[0].platformId, 'youtube');
  assert.equal(results[0].status, 'ready_for_manual');
});

test('Claims & Quality: Detects unverified claims and evaluates quality score', async () => {
  const claimsService = new ClaimVerificationService();
  const qualityService = new QualityScoringService();
  const scriptService = new ScriptWriterService(new GeminiAIService(''));

  const script = await scriptService.writeScript('Budget Laptop', 'Best Budget Laptop 2026', 'long_landscape', INITIAL_BRANDS[1]);
  assert.ok(script.sections.length >= 3);
  assert.ok(script.first15SecondsPayoff);

  const claimCheck = claimsService.verifyClaims(script.factClaims);
  assert.equal(typeof claimCheck.unverifiedCount, 'number');

  const quality = qualityService.evaluateContent(script, INITIAL_BRANDS[1]);
  assert.ok(quality.overallScore >= 0 && quality.overallScore <= 100);
  assert.equal(quality.hasSyntheticLabelRequired, true);
});
