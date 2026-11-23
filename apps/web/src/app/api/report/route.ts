import { NextResponse } from 'next/server';
import { DailyReportService, INITIAL_BRANDS } from '@creator-autopilot/core';

export async function GET() {
  const service = new DailyReportService();
  const report = service.compileDailyReport(
    INITIAL_BRANDS.filter((b) => b.active),
    [],
    [],
    [],
    [],
    14
  );

  return NextResponse.json(report);
}
