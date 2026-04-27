#!/usr/bin/env node

/**
 * Bootstrap script for task-timer MCP server.
 *
 * dist/ is shipped pre-built in the repo, so on a clean plugin install
 * we only need to install production npm deps (fast, ~2-3s).
 * Falls back to full install + build if dist is somehow missing.
 *
 * Used by .mcp.json for plugin auto-start.
 */

const { execSync, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const mcpDir = path.join(__dirname, "mcps", "task-timer");
const nodeModules = path.join(mcpDir, "node_modules");
const distIndex = path.join(mcpDir, "dist", "index.js");

// Install production deps only (fast — skips typescript, jest, etc.)
if (!fs.existsSync(nodeModules)) {
  process.stderr.write("[task-timer] Installing runtime dependencies...\n");
  execSync("npm install --omit=dev", { cwd: mcpDir, stdio: "ignore" });
}

// Build only if dist is missing (shouldn't happen — dist/ is committed)
if (!fs.existsSync(distIndex)) {
  process.stderr.write("[task-timer] dist/ missing, rebuilding...\n");
  execSync("npm install --production=false", { cwd: mcpDir, stdio: "ignore" });
  execSync("npm run build", { cwd: mcpDir, stdio: "ignore" });
}

// Start the MCP server (stdin/stdout passthrough for stdio transport)
const child = spawn(process.execPath, [distIndex], {
  cwd: mcpDir,
  stdio: "inherit",
});

child.on("exit", (code) => process.exit(code || 0));
