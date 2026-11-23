import { PlatformId } from '../types/index.js';
import { FacebookPlatform } from './FacebookPlatform.js';
import { InstagramPlatform } from './InstagramPlatform.js';
import { Platform } from './Platform.js';
import { TikTokPlatform } from './TikTokPlatform.js';
import { YouTubePlatform } from './YouTubePlatform.js';

export class PlatformRegistry {
  private platforms: Map<PlatformId, Platform> = new Map();

  constructor() {
    this.register(new YouTubePlatform());
    this.register(new InstagramPlatform());
    this.register(new FacebookPlatform());
    this.register(new TikTokPlatform());
  }

  register(platform: Platform): void {
    this.platforms.set(platform.platformId, platform);
  }

  get(platformId: PlatformId): Platform {
    const platform = this.platforms.get(platformId);
    if (!platform) {
      throw new Error(`Platform adapter not registered: ${platformId}`);
    }
    return platform;
  }

  getAll(): Platform[] {
    return Array.from(this.platforms.values());
  }

  getSupportedPlatformIds(): PlatformId[] {
    return Array.from(this.platforms.keys());
  }
}

export const platformRegistry = new PlatformRegistry();
