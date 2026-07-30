import { ensureSchedule } from "../services/jobs";
import type { JobKind } from "./kinds";

const DEFAULT_SCHEDULES: { kind: JobKind; intervalSeconds: number }[] = [
  { kind: "feedback.enrich.sweep", intervalSeconds: 5 * 60 },
  { kind: "digest.weekly.sweep", intervalSeconds: 7 * 24 * 60 * 60 },
];

export async function ensureDefaultSchedules(): Promise<void> {
  for (const schedule of DEFAULT_SCHEDULES) {
    await ensureSchedule(schedule.kind, schedule.intervalSeconds);
  }
}
