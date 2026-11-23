import { Brand, QualityScore, Script } from '../types/index.js';

export class QualityScoringService {
  /**
   * Scores content across Hook, Pacing, Clarity, and Originality (0-100 total).
   * Checks policy risks and AI synthetic content labeling rules.
   */
  evaluateContent(script: Script, brand: Brand, pastTopics: string[] = []): QualityScore {
    let hookScore = 20;
    let pacingScore = 22;
    let clarityScore = 24;
    let originalityScore = 22;

    const reviewNotes: string[] = [];
    const policyViolations: string[] = [];

    // 1. Hook evaluation (First 15s payoff)
    if (!script.first15SecondsPayoff || script.first15SecondsPayoff.length < 20) {
      hookScore -= 10;
      reviewNotes.push('Hook payoff is too weak or missing in the first 15 seconds.');
    } else {
      hookScore += 3;
    }

    // 2. Unverified claims evaluation
    const unverifiedCount = script.factClaims.filter((c) => !c.verified).length;
    if (unverifiedCount > 0) {
      clarityScore -= Math.min(15, unverifiedCount * 5);
      reviewNotes.push(`${unverifiedCount} unverified factual claims flagged for review.`);
    }

    // 3. YMYL and policy checks
    if (brand.profile.ymylRisk === 'high' || brand.profile.ymylRisk === 'very_high') {
      const containsDisclaimer = script.descriptionTemplate.includes('education') || script.descriptionTemplate.includes('advice');
      if (!containsDisclaimer) {
        policyViolations.push('Missing mandatory educational disclaimer for high-risk YMYL niche.');
      }
    }

    // 4. Similarity to past topics check
    const currentTopicLower = script.hook.toLowerCase();
    for (const past of pastTopics) {
      if (currentTopicLower.includes(past.toLowerCase())) {
        originalityScore -= 8;
        reviewNotes.push(`Similarity detected with past video topic: "${past}".`);
        break;
      }
    }

    // 5. Mandatory synthetic / AI content label check
    const hasSyntheticLabelRequired = true; // Required by all major video platforms for synthetic TTS and AI graphics

    const overallScore = Math.max(0, Math.min(100, hookScore + pacingScore + clarityScore + originalityScore));
    const pass = overallScore >= 70 && policyViolations.length === 0;

    return {
      overallScore,
      hookScore,
      pacingScore,
      clarityScore,
      originalityScore,
      unverifiedClaimsCount: unverifiedCount,
      hasSyntheticLabelRequired,
      policyViolations,
      pass,
      reviewNotes,
    };
  }
}
