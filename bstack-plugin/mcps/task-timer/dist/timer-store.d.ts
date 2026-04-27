export interface Timer {
    id: string;
    label: string;
    targetMs: number;
    startedAt: number;
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
export declare function formatDuration(ms: number): string;
export declare function startTimer(hours: number, minutes: number, seconds: number, label?: string): Timer;
export declare function checkTimer(id: string, now?: number): TimerStatus;
export declare function listTimers(now?: number): TimerStatus[];
export declare function clearTimers(): void;
export declare function getTimerCount(): number;
