import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { INITIAL_BRANDS } from '@creator-autopilot/core';
import { buildCuesFromSections, formatSrtTimestamp, generateSrtContent } from './subtitles/srt.js';
import { generateThumbnail } from './thumbnails/generateThumbnail.js';

test('Subtitles: SRT formatting & cues generation', () => {
  assert.equal(formatSrtTimestamp(0), '00:00:00,000');
  assert.equal(formatSrtTimestamp(65.5), '00:01:05,500');

  const cues = buildCuesFromSections([
    { spokenText: 'First sentence here. Second sentence starts.', estimatedDurationSec: 4 },
  ]);

  assert.equal(cues.length, 2);
  const srtOutput = generateSrtContent(cues);
  assert.match(srtOutput, /00:00:00,000 --> 00:00:02,000/);
  assert.match(srtOutput, /First sentence here\./);
});

test('Thumbnails: Generates SVG thumbnail with max 4 words headline & brand styling', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'thumb-test-'));
  const outputPath = path.join(tmpDir, 'test-thumbnail.svg');

  const brand = INITIAL_BRANDS[0];
  const concept = {
    id: 'c1',
    headlineText: 'BEST FREE TOOLS 2026 EXTRA WORDS', // 6 words -> should be clipped to 4 words
    focalObject: 'Comparison Matrix',
    visualLayout: 'badge_highlight' as const,
  };

  const generatedPath = await generateThumbnail({
    outputPath,
    format: '16:9',
    concept,
    brand,
  });

  const content = await fs.readFile(generatedPath, 'utf8');
  assert.match(content, /BEST FREE TOOLS 2026/);
  assert.doesNotMatch(content, /EXTRA WORDS/); // Verifies strict 4-word truncation
  assert.match(content, new RegExp(brand.name.toUpperCase()));

  // Cleanup
  await fs.rm(tmpDir, { recursive: true, force: true });
});
