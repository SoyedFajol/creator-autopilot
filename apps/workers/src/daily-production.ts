import * as path from 'node:path';
import * as os from 'node:os';
import * as fs from 'node:fs/promises';
import {
  INITIAL_BRANDS,
  GeminiAIService,
  PackagingService,
  ScriptWriterService,
  ClaimVerificationService,
  QualityScoringService,
  LocalKokoroVoiceService,
  NtfyNotificationService,
  LocalDiskStorageService,
  VideoFormat,
} from '@creator-autopilot/core';
import { buildCuesFromSections, generateSrtContent, generateThumbnail } from '@creator-autopilot/video';

export interface ProductionRunOptions {
  brandSlug: string;
  forcedTopic?: string;
  format?: VideoFormat;
}

export async function runDailyProduction(options: ProductionRunOptions) {
  const brand = INITIAL_BRANDS.find((b) => b.slug === options.brandSlug);
  if (!brand) {
    throw new Error(`Brand not found: ${options.brandSlug}`);
  }

  if (brand.paused || !brand.active) {
    console.info(`[WORKER] Brand ${brand.name} is paused or inactive. Skipping production.`);
    return { status: 'skipped' as const, brand: brand.name };
  }

  console.info(`\n🚀 [WORKER] Starting daily production for: ${brand.name}`);

  // 1. Initialize services
  const ai = new GeminiAIService(process.env.GEMINI_API_KEY);
  const packagingService = new PackagingService(ai);
  const scriptService = new ScriptWriterService(ai);
  const claimsService = new ClaimVerificationService();
  const qualityService = new QualityScoringService();
  const voiceService = new LocalKokoroVoiceService();
  const notifyService = new NtfyNotificationService();
  const storageDir = path.join(os.tmpdir(), 'creator-autopilot-renders', brand.slug);
  const storage = new LocalDiskStorageService(storageDir);

  // 2. Select topic (use forced topic or pick from content pillar)
  const format: VideoFormat = options.format || 'long_landscape';
  const topic =
    options.forcedTopic ||
    (brand.slug === 'stack-simple'
      ? 'Notion vs Obsidian Free Tier Workflow Breakdown'
      : 'Is the M4 Mac Mini Actually Worth It for Creators?');

  console.info(`📌 [TOPIC] Selected: "${topic}" (Format: ${format})`);

  // 3. Packaging First: 5 titles + 2 thumbnail concepts (Max 4 words enforced)
  console.info('🎨 [PACKAGING] Generating titles & high-contrast thumbnail concepts...');
  const packaging = await packagingService.generatePackaging(topic, brand.profile.contentPillars[0], brand);
  console.info(`   Chosen Title: "${packaging.chosenTitle}"`);
  console.info(`   Thumbnail Concept 1: "${packaging.thumbnailConcepts[0].headlineText}" (Object: ${packaging.thumbnailConcepts[0].focalObject})`);

  // 4. Script Writer: Chapters, native captions, fact-claims list
  console.info('📝 [SCRIPT] Generating structured script, payoff hook, and verified claim list...');
  const script = await scriptService.writeScript(topic, packaging.chosenTitle, format, brand);
  console.info(`   Script contains ${script.sections.length} sections and ${script.factClaims.length} fact claims.`);

  // 5. Fact Claim Verification
  console.info('🔍 [CLAIMS] Auditing numerical facts and verifying source attribution...');
  const claimsAudit = claimsService.verifyClaims(script.factClaims);
  console.info(`   Verified claims: ${script.factClaims.length - claimsAudit.unverifiedCount}/${script.factClaims.length}`);

  // 6. Voice Synthesis: Kokoro Natural Pacing
  console.info(`🎙️ [VOICE] Synthesizing speech with Kokoro voice (${brand.voiceId})...`);
  const fullSpokenText = script.sections.map((s) => s.spokenText).join(' ');
  const audioFile = path.join(storageDir, 'audio.wav');
  const voiceResult = await voiceService.synthesizeSpeech(fullSpokenText, audioFile, brand.voiceId);
  console.info(`   Audio rendered: ${voiceResult.durationSec}s duration.`);

  // 7. Subtitles & Word Timing
  console.info('💬 [SUBTITLES] Generating SRT captions for YouTube closed captions...');
  const cues = buildCuesFromSections(script.sections);
  const srtContent = generateSrtContent(cues);
  const srtFile = path.join(storageDir, 'captions.srt');
  await fs.writeFile(srtFile, srtContent, 'utf8');
  await storage.uploadFile(srtFile, `${brand.slug}/captions.srt`);

  // 8. Designed Thumbnail Generation
  console.info('🖼️ [THUMBNAIL] Composing designed SVG thumbnail with brand styling...');
  const thumbPath = path.join(storageDir, 'thumbnail.svg');
  await generateThumbnail({
    outputPath: thumbPath,
    format: format === 'long_landscape' ? '16:9' : '9:16',
    concept: packaging.thumbnailConcepts[0],
    brand,
  });

  // 9. Pre-approval Quality Scoring
  console.info('⚖️ [QUALITY SCORE] Evaluating hook, pacing, clarity, and policy requirements...');
  const quality = qualityService.evaluateContent(script, brand);
  console.info(`   Score: ${quality.overallScore}/100 | Pass: ${quality.pass ? 'YES' : 'FLAGGED'}`);

  // 10. Dispatch Phone Notification to User
  const reviewUrl = 'http://localhost:3000/queue';
  await notifyService.sendApprovalPrompt(brand.name, packaging.chosenTitle, reviewUrl);
  console.info(`📲 [NOTIFICATION] Dispatched review alert via Ntfy to your phone.`);

  return {
    status: 'ready_for_review' as const,
    brand: brand.name,
    title: packaging.chosenTitle,
    format,
    durationSec: voiceResult.durationSec,
    qualityScore: quality.overallScore,
    claimsVerified: claimsAudit.allNumericalClaimsVerified,
  };
}

// Allow direct CLI invocation (e.g. from GitHub Actions matrix job)
if (process.argv[1]?.includes('daily-production')) {
  const brandSlug = process.argv[2] || 'stack-simple';
  runDailyProduction({ brandSlug })
    .then((res) => {
      console.info('\n✅ Production completed successfully:', res);
      process.exit(0);
    })
    .catch((err) => {
      console.error('\n❌ Production failed:', err);
      process.exit(1);
    });
}
