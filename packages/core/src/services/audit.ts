import { AuditLogEntry } from '../types/index.js';

export class AuditLogger {
  private static inMemoryLogs: AuditLogEntry[] = [];

  static async log(
    action: AuditLogEntry['action'],
    actor: string,
    details: Record<string, unknown>,
    ipAddress?: string
  ): Promise<AuditLogEntry> {
    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      action,
      actor,
      ipAddress,
      details,
      timestamp: new Date().toISOString(),
    };

    // Store in memory buffer & write to secure log
    AuditLogger.inMemoryLogs.unshift(entry);
    if (AuditLogger.inMemoryLogs.length > 500) {
      AuditLogger.inMemoryLogs.pop();
    }

    console.info(`[AUDIT_LOG] ${entry.timestamp} | ${action} by ${actor}`);
    return entry;
  }

  static getRecentLogs(limit: number = 50): AuditLogEntry[] {
    return AuditLogger.inMemoryLogs.slice(0, limit);
  }
}
