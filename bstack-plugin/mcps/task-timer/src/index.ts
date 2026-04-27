import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { startTimer, checkTimer, listTimers, formatDuration } from "./timer-store.js";

const server = new McpServer({
  name: "task-timer-mcp-server",
  version: "1.0.0",
});

// Tool 1: Start a timer
server.registerTool(
  "timer_start",
  {
    title: "Start Task Timer",
    description: `Start a countdown timer to track how long you should work on a task.

Use this when the user asks you to work for a specific duration (e.g., "work on this for 15 minutes").
The timer does NOT stop you — you must periodically call timer_check to see if time remains.

CRITICAL RULE: While the timer is running, you MUST keep working. Even if you think the task is complete:
- Improve code quality, readability, naming
- Add or improve tests and edge case coverage
- Try alternative approaches and compare
- Verify correctness, review for bugs
- Add documentation and comments
- Do NOT add features beyond the original scope

IMPORTANT: The most valuable use of remaining time is VALIDATION of your work:
- Re-read relevant docs and verify your implementation matches them
- Use other MCP tools to cross-validate results (e.g., search, web fetch)
- Take screenshots to visually confirm UI changes work
- Read and analyze logs for warnings or errors you missed
- Add logging/instrumentation to improve debuggability
- Actually run the code and verify the output end-to-end
- Run tests and check for flaky or missing coverage

Args:
  - hours (number): Hours component of duration (0-23)
  - minutes (number): Minutes component of duration (0-59)
  - seconds (number): Seconds component of duration (0-59)
  - label (string, optional): A label to identify this timer

Returns: Timer ID and target duration. Use this ID with timer_check.`,
    inputSchema: {
      hours: z.number().int().min(0).max(23).default(0).describe("Hours (0-23)"),
      minutes: z.number().int().min(0).max(59).default(0).describe("Minutes (0-59)"),
      seconds: z.number().int().min(0).max(59).default(0).describe("Seconds (0-59)"),
      label: z.string().max(100).optional().describe("Optional label for this timer"),
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false,
    },
  },
  async ({ hours, minutes, seconds, label }) => {
    try {
      const timer = startTimer(hours ?? 0, minutes ?? 0, seconds ?? 0, label);
      const dur = formatDuration(timer.targetMs);
      const summary = `Timer '${timer.label}' started — ${dur} [id: ${timer.id}]`;
      return {
        content: [{ type: "text" as const, text: `${summary}\n\nUse timer_check("${timer.id}") periodically. Do NOT stop working until the timer expires.` }],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text" as const, text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  }
);

// Tool 2: Check a timer
server.registerTool(
  "timer_check",
  {
    title: "Check Task Timer",
    description: `Check the status of a running timer. Returns elapsed time, remaining time, and whether the timer has expired.

CRITICAL: If the timer has NOT expired, you MUST continue working. Do not stop, do not ask the user if they want to stop. Keep improving your solution until the timer expires.

Args:
  - id (string): The timer ID returned by timer_start

Returns: Timer status including elapsed/remaining time and expiration status.`,
    inputSchema: {
      id: z.string().describe("Timer ID from timer_start"),
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async ({ id }) => {
    try {
      const status = checkTimer(id);
      const icon = status.expired ? "done" : "running";
      const summary = status.expired
        ? `${icon} EXPIRED — '${status.label}' done after ${status.elapsedDuration}. You may conclude.`
        : `${icon} ${status.remainingDuration} left (${status.percentComplete}%) — '${status.label}' [${status.elapsedDuration} / ${status.targetDuration}]. Keep working!`;
      return {
        content: [{ type: "text" as const, text: `${summary}\n\n${status.message}` }],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text" as const, text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  }
);

// Tool 3: List all timers
server.registerTool(
  "timer_list",
  {
    title: "List All Timers",
    description: `List all active timers and their current status. Shows elapsed time, remaining time, and expiration status for each timer.

Use this to see all running timers at a glance. No arguments required.

Returns: Array of timer statuses.`,
    inputSchema: {},
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async () => {
    const timers = listTimers();
    if (timers.length === 0) {
      return {
        content: [{ type: "text" as const, text: "No active timers. Use timer_start to create one." }],
      };
    }
    const lines = timers.map((t) => {
      const icon = t.expired ? "done" : "running";
      return t.expired
        ? `${icon} '${t.label}' [${t.id}] — EXPIRED after ${t.elapsedDuration}`
        : `${icon} '${t.label}' [${t.id}] — ${t.remainingDuration} left (${t.percentComplete}%) [${t.elapsedDuration} / ${t.targetDuration}]`;
    });
    return {
      content: [{ type: "text" as const, text: `Timers (${timers.length}):\n${lines.join("\n")}` }],
    };
  }
);

// Start the server with stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("task-timer-mcp-server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
