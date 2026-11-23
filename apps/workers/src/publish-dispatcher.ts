import {
  INITIAL_BRANDS,
  platformRegistry,
  PublishingPolicy,
  Asset,
  Post,
  PlatformId,
} from '@creator-autopilot/core';

export async function runPublishDispatcher(postId: string, brandSlug: string) {
  const brand = INITIAL_BRANDS.find((b) => b.slug === brandSlug);
  if (!brand) throw new Error(`Brand not found: ${brandSlug}`);

  console.info(`\n🚀 [PUBLISH] Initiating publishing pipeline for ${brand.name} (Post: ${postId})`);

  const policy = new PublishingPolicy(platformRegistry);

  // Setup mock asset & posts map
  const mockAsset: Asset = {
    id: `asset-${Date.now()}`,
    contentPieceId: `cp-${Date.now()}`,
    format: 'long_landscape',
    renderProfileId: 'long_landscape',
    filePath: `renders/${brand.slug}/video.mp4`,
    subtitlePath: `renders/${brand.slug}/captions.srt`,
    thumbnailPath: `renders/${brand.slug}/thumbnail.svg`,
    status: 'ready',
    renderTimeMs: 14000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const platforms: PlatformId[] = ['youtube', 'instagram', 'facebook', 'tiktok'];
  const postsMap = new Map<PlatformId, { post: Post; asset: Asset }>();

  for (const pId of platforms) {
    postsMap.set(pId, {
      post: {
        id: `post-${pId}-${Date.now()}`,
        assetId: mockAsset.id,
        brandId: brand.id,
        platformId: pId,
        idempotencyKey: `idempotency-${pId}-${Date.now()}`,
        status: 'publishing',
        caption: `New release from ${brand.name}! Breakdown and free resources linked below.`,
        hashtags: ['#Tech', '#Review', '#Guide'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      asset: mockAsset,
    });
  }

  // Execute pipeline following dependencies (YouTube first, then staggered)
  // Default to manual export mode as sanctioned in planning document
  const results = await policy.executePipeline(postsMap, brand, { forceManual: true });

  console.info('📋 [PUBLISH RESULTS]:');
  for (const r of results) {
    console.info(`   - ${r.platformId.toUpperCase()}: ${r.status} ${r.errorMessage ? `(${r.errorMessage})` : ''}`);
  }

  return results;
}

if (process.argv[1]?.includes('publish-dispatcher')) {
  runPublishDispatcher('post-demo-1', 'stack-simple')
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
