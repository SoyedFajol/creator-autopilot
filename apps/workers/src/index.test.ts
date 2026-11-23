import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runDailyProduction } from './daily-production.js';
import { runPublishDispatcher } from './publish-dispatcher.js';
import { runAnalyticsCollector } from './analytics-collector.js';
import { runEncryptedBackup } from './backup-runner.js';

test('Worker: Daily production runs end-to-end for Stack Simple', async () => {
  const result = await runDailyProduction({ brandSlug: 'stack-simple', format: 'long_landscape' });
  assert.equal(result.status, 'ready_for_review');
  assert.equal(result.brand, 'Stack Simple');
  if (result.status === 'ready_for_review') {
    assert.ok(result.qualityScore > 0);
    assert.ok(result.title.length > 5);
  }
});

test('Worker: Daily production runs end-to-end for Worth the Upgrade Short format', async () => {
  const result = await runDailyProduction({ brandSlug: 'worth-the-upgrade', format: 'short_portrait' });
  assert.equal(result.status, 'ready_for_review');
  assert.equal(result.brand, 'Worth the Upgrade');
  if (result.status === 'ready_for_review') {
    assert.equal(result.format, 'short_portrait');
  }
});

test('Worker: Publish dispatcher executes all 4 platforms in manual export mode', async () => {
  const results = await runPublishDispatcher('post-test-123', 'stack-simple');
  assert.equal(results.length, 4);

  const yt = results.find((r) => r.platformId === 'youtube');
  assert.ok(yt);
  assert.equal(yt.status, 'ready_for_manual');

  const ig = results.find((r) => r.platformId === 'instagram');
  assert.ok(ig);
  assert.equal(ig.status, 'ready_for_manual');

  const fb = results.find((r) => r.platformId === 'facebook');
  assert.ok(fb);
  assert.equal(fb.status, 'ready_for_manual');

  const tt = results.find((r) => r.platformId === 'tiktok');
  assert.ok(tt);
  assert.equal(tt.status, 'ready_for_manual');
});

test('Worker: Analytics collector fetches metric snapshots across platforms', async () => {
  const snapshots = await runAnalyticsCollector();
  assert.ok(snapshots.length >= 4);
});

test('Worker: Encrypted backup executes and passes test restore verification', async () => {
  const backup = await runEncryptedBackup();
  assert.equal(backup.success, true);
  assert.match(backup.backupFilename, /\.sql\.zst\.age$/);
});
