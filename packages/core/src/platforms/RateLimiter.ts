import { PlatformId } from '../types/index.js';

interface RateLimitConfig {
  maxRequestsPerMinute: number;
  maxRequestsPerDay: number;
}

export class RateLimiter {
  private static instance: RateLimiter;

  // Platform API quotas
  private limits: Record<PlatformId, RateLimitConfig> = {
    youtube: { maxRequestsPerMinute: 60, maxRequestsPerDay: 10000 },
    instagram: { maxRequestsPerMinute: 30, maxRequestsPerDay: 200 },
    facebook: { maxRequestsPerMinute: 60, maxRequestsPerDay: 200 },
    tiktok: { maxRequestsPerMinute: 20, maxRequestsPerDay: 100 },
  };

  private requestCounts: Map<string, { minuteCount: number; lastMinute: number; dailyCount: number; lastDay: number }> =
    new Map();

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  canMakeRequest(platformId: PlatformId, brandId: string): { allowed: boolean; waitMs?: number; reason?: string } {
    const key = `${platformId}:${brandId}`;
    const now = Date.now();
    const currentMinute = Math.floor(now / 60000);
    const currentDay = Math.floor(now / 86400000);

    const config = this.limits[platformId];
    let state = this.requestCounts.get(key);

    if (!state) {
      state = { minuteCount: 0, lastMinute: currentMinute, dailyCount: 0, lastDay: currentDay };
      this.requestCounts.set(key, state);
    }

    // Reset minute bucket
    if (state.lastMinute !== currentMinute) {
      state.minuteCount = 0;
      state.lastMinute = currentMinute;
    }

    // Reset daily bucket
    if (state.lastDay !== currentDay) {
      state.dailyCount = 0;
      state.lastDay = currentDay;
    }

    if (state.minuteCount >= config.maxRequestsPerMinute) {
      const waitMs = (currentMinute + 1) * 60000 - now;
      return { allowed: false, waitMs, reason: `Exceeded minute rate limit for ${platformId}` };
    }

    if (state.dailyCount >= config.maxRequestsPerDay) {
      return { allowed: false, reason: `Exceeded daily quota for ${platformId}` };
    }

    return { allowed: true };
  }

  recordRequest(platformId: PlatformId, brandId: string): void {
    const key = `${platformId}:${brandId}`;
    const state = this.requestCounts.get(key);
    if (state) {
      state.minuteCount++;
      state.dailyCount++;
    }
  }
}

export const rateLimiter = RateLimiter.getInstance();
