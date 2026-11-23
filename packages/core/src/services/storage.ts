import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export interface StorageService {
  uploadFile(localPath: string, destinationKey: string): Promise<string>;
  getSignedDownloadUrl(destinationKey: string, expiresInSec?: number): Promise<string>;
  deleteFile(destinationKey: string): Promise<boolean>;
}

/**
 * Local / Hybrid File Storage adapter
 * Serves files directly or via pre-signed public/private paths
 */
export class LocalDiskStorageService implements StorageService {
  constructor(private baseDir: string, private publicBaseUrl: string = 'http://localhost:3000/renders') {}

  async uploadFile(localPath: string, destinationKey: string): Promise<string> {
    const targetPath = path.join(this.baseDir, destinationKey);
    await fs.mkdir(path.dirname(targetPath), { recursive: true });

    if (path.resolve(localPath) !== path.resolve(targetPath)) {
      await fs.copyFile(localPath, targetPath);
    }

    return `${this.publicBaseUrl}/${destinationKey.replace(/\\/g, '/')}`;
  }

  async getSignedDownloadUrl(destinationKey: string, expiresInSec: number = 3600): Promise<string> {
    // Generates short-lived URL with token or direct route
    const expiresAt = Date.now() + expiresInSec * 1000;
    return `${this.publicBaseUrl}/${destinationKey.replace(/\\/g, '/')}?expires=${expiresAt}`;
  }

  async deleteFile(destinationKey: string): Promise<boolean> {
    const targetPath = path.join(this.baseDir, destinationKey);
    try {
      await fs.unlink(targetPath);
      return true;
    } catch {
      return false;
    }
  }
}
