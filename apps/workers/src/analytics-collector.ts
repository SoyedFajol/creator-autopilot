import { INITIAL_BRANDS, platformRegistry, MetricSnapshot } from '@creator-autopilot/core';

export async function runAnalyticsCollector() {
  console.info('\n🌙 [ANALYTICS] Starting nightly metric collection across active platforms...');

  const activeBrands = INITIAL_BRANDS.filter((b) => b.active);
  const snapshots: MetricSnapshot[] = [];

  for (const brand of activeBrands) {
    console.info(`📊 Collecting metrics for brand: ${brand.name}`);

    for (const platform of platformRegistry.getAll()) {
      try {
        const metrics = await platform.fetchAnalytics(`sample-external-id-${platform.platformId}`);

        const snapshot: MetricSnapshot = {
          id: `metric-${platform.platformId}-${Date.now()}`,
          postId: `post-sample-${platform.platformId}`,
          collectedAt: new Date().toISOString(),
          views: metrics.views,
          likes: metrics.likes,
          comments: metrics.comments,
          shares: metrics.shares,
          avgWatchTimeSec: metrics.avgWatchTimeSec,
          completionRate: metrics.completionRate,
          followersGained: metrics.followersGained,
          rawPayload: metrics.raw,
        };

        snapshots.push(snapshot);
        console.info(
          `   - ${platform.displayName}: ${snapshot.views} views, ${snapshot.likes} likes, avg watch: ${snapshot.avgWatchTimeSec ?? 'N/A'}s`
        );
      } catch (err) {
        console.warn(`   ⚠️ Failed to collect metrics for ${platform.displayName}:`, err);
      }
    }
  }

  console.info(`✅ Successfully collected ${snapshots.length} metric snapshots.`);
  return snapshots;
}

if (process.argv[1]?.includes('analytics-collector')) {
  runAnalyticsCollector()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
