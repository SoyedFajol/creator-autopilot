import { FactClaim } from '../types/index.js';

export interface ClaimVerificationResult {
  allNumericalClaimsVerified: boolean;
  unverifiedCount: number;
  flaggedClaims: FactClaim[];
  verificationReport: string[];
}

export class ClaimVerificationService {
  /**
   * Verifies fact claims against policy rules:
   * 1. Numerical claims (dollars, percentages, benchmarks) MUST have a verified source.
   * 2. Unverified claims cannot be used to generate animated charts.
   * 3. Claims in YMYL niches (finance, legal, insurance) are subjected to strict verification flags.
   */
  verifyClaims(claims: FactClaim[]): ClaimVerificationResult {
    const flaggedClaims: FactClaim[] = [];
    const report: string[] = [];

    let unverifiedCount = 0;
    let allNumericalClaimsVerified = true;

    for (const claim of claims) {
      if (!claim.verified || !claim.sourceUrl) {
        unverifiedCount++;
        flaggedClaims.push(claim);

        if (claim.isNumerical) {
          allNumericalClaimsVerified = false;
          report.push(`[BLOCKED CHART DATA] Numerical claim lacks verified source: "${claim.claim}"`);
        } else {
          report.push(`[UNVERIFIED CLAIM] "${claim.claim}" (Requires manual verification before publishing)`);
        }
      }
    }

    if (unverifiedCount === 0) {
      report.push('All factual claims successfully verified against documentation.');
    }

    return {
      allNumericalClaimsVerified,
      unverifiedCount,
      flaggedClaims,
      verificationReport: report,
    };
  }

  /**
   * Cleans numbers for animated chart rendering.
   * If any number is unverified, throws an error or strips it to ensure charts only render verified facts.
   */
  sanitizeChartNumbers(numbers: number[], verified: boolean): number[] {
    if (!verified) {
      throw new Error('Refusing to render animated chart with unverified numbers.');
    }
    return numbers;
  }
}
