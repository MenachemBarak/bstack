import { randomUUID } from "crypto";

export interface Timer {
  id: string;
  label: string;
  targetMs: number;
  startedAt: number; // Date.now() epoch ms
}

export interface TimerStatus {
  id: string;
  label: string;
  targetDuration: string;
  elapsedDuration: string;
  remainingDuration: string;
  elapsedMs: number;
  remainingMs: number;
  expired: boolean;
  percentComplete: number;
  startedAt: string;
  message: string;
}

const timers = new Map<string, Timer>();

export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const parts: string[] = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0 || h > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(" ");
}

export function startTimer(hours: number, minutes: number, seconds: number, label?: string): Timer {
  if (hours < 0 || minutes < 0 || seconds < 0) {
    throw new Error("Timer duration values must be non-negative");
  }
  const targetMs = ((hours * 3600) + (minutes * 60) + seconds) * 1000;
  if (targetMs <= 0) {
    throw new Error("Timer duration must be greater than zero");
  }
  const timer: Timer = {
    id: randomUUID().slice(0, 8),
    label: label || `Timer ${timers.size + 1}`,
    targetMs,
    startedAt: Date.now(),
  };
  timers.set(timer.id, timer);
  return timer;
}

export function checkTimer(id: string, now?: number): TimerStatus {
  const timer = timers.get(id);
  if (!timer) {
    throw new Error(`Timer '${id}' not found. Use timer_list to see active timers.`);
  }
  const currentTime = now ?? Date.now();
  const elapsedMs = currentTime - timer.startedAt;
  const remainingMs = Math.max(0, timer.targetMs - elapsedMs);
  const expired = remainingMs <= 0;
  const percentComplete = Math.min(100, Math.round((elapsedMs / timer.targetMs) * 100));

  let message: string;
  if (expired) {
    message = `Timer '${timer.label}' has EXPIRED. You have worked for ${formatDuration(elapsedMs)} (target was ${formatDuration(timer.targetMs)}). You may now conclude your work.`;
  } else {
    message = `Timer '${timer.label}' is STILL RUNNING. ${formatDuration(remainingMs)} remaining (${percentComplete}% complete). You MUST continue working — improve quality, add tests, try alternative approaches, verify edge cases. Do NOT stop until the timer expires.`;
  }

  return {
    id: timer.id,
    label: timer.label,
    targetDuration: formatDuration(timer.targetMs),
    elapsedDuration: formatDuration(elapsedMs),
    remainingDuration: formatDuration(remainingMs),
    elapsedMs,
    remainingMs,
    expired,
    percentComplete,
    startedAt: new Date(timer.startedAt).toISOString(),
    message,
  };
}

export function listTimers(now?: number): TimerStatus[] {
  const currentTime = now ?? Date.now();
  return Array.from(timers.values()).map((t) => checkTimer(t.id, currentTime));
}

export function clearTimers(): void {
  timers.clear();
}

export function getTimerCount(): number {
  return timers.size;
}
