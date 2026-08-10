#!/usr/bin/env node
/**
 * pcampus-dispatch-mcp-server/index.js
 * ─────────────────────────────────────
 * Local MCP server that exposes Pcampus Agent OS dispatch tools to Claude Desktop.
 *
 * Tools exposed:
 *   dispatch_cursor            — run dispatch-cursor.sh (single task)
 *   dispatch_parallel          — run dispatch-parallel.sh (multiple agents)
 *   read_dispatch_log          — read latest dispatch log for a goal
 *   read_shared_memory         — read shared-memory.yaml for a goal
 *   write_architecture_handoff — write architecture decision + trigger dispatch
 *   read_goal_status           — read current status from G-xxx.md file
 *   poll_until_review          — wait until goal status becomes 'review', then return summary
 *
 * Claude ใช้ tools เหล่านี้เพื่อสั่ง Cursor agent โดยตรงจาก Claude Desktop
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { execFile, execFileSync } from "child_process";
import { promisify } from "util";
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const execFileAsync = promisify(execFile);

// ── Paths ────────────────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const SCRIPTS_DIR = join(REPO_ROOT, "scripts");
const DISPATCH_SCRIPT = join(SCRIPTS_DIR, "dispatch-cursor.sh");
const PARALLEL_SCRIPT = join(SCRIPTS_DIR, "dispatch-parallel.sh");
const BUNDLE_DIR = join(REPO_ROOT, ".bundle");

// ── Helpers ──────────────────────────────────────────────────────────────────
function getBundlePath(goalId) {
  return join(BUNDLE_DIR, goalId);
}

function getDispatchLogsDir(projectPath) {
  return join(projectPath, ".bundle", "dispatch-logs");
}

function latestLog(logsDir) {
  if (!existsSync(logsDir)) return null;
  const files = readdirSync(logsDir)
    .filter(f => f.endsWith(".log"))
    .map(f => ({ name: f, mtime: statSync(join(logsDir, f)).mtime }))
    .sort((a, b) => b.mtime - a.mtime);
  return files.length > 0 ? join(logsDir, files[0].name) : null;
}

// ── MCP Server ────────────────────────────────────────────────────────────────
const server = new McpServer({
  name: "pcampus-dispatch",
  version: "1.0.0",
});

// ── Tool: dispatch_cursor ─────────────────────────────────────────────────────
server.tool(
  "dispatch_cursor",
  "Dispatch a Cursor agent to execute a task on a project. " +
  "Use this when you (Claude) have completed architecture planning and need Cursor to implement. " +
  "The task prompt should reference the bundle step file and include scope constraints.",
  {
    project_path: z.string().describe("Absolute path to the project directory"),
    task_prompt: z.string().describe(
      "The task for Cursor to execute. Should reference bundle step file, e.g.: " +
      "'Read .bundle/G-021/step-2.md and implement the REST endpoint. " +
      "Follow .cursor/rules/. Do not modify UI files. Update shared-memory.yaml execution section when done.'"
    ),
    goal_id: z.string().optional().describe("Goal ID (e.g. G-021) for logging"),
    model: z.string().optional().default("claude-sonnet-4-5").describe("Cursor model to use"),
    timeout_seconds: z.number().optional().default(600).describe("Max execution time in seconds"),
  },
  async ({ project_path, task_prompt, goal_id, model, timeout_seconds }) => {
    // Governance: block dangerous patterns in prompt
    const BLOCKED_PATTERNS = [
      /git\s+(push|merge|rebase)/i,
      /deploy\s+prod/i,
      /rm\s+-rf/i,
      /DROP\s+TABLE/i,
    ];
    for (const pattern of BLOCKED_PATTERNS) {
      if (pattern.test(task_prompt)) {
        return {
          content: [{
            type: "text",
            text: `❌ BLOCKED: Task prompt contains a governance-blocked pattern: ${pattern}\n` +
                  `Per Pcampus governance, the following are not allowed without human approval:\n` +
                  `- git push/merge/rebase\n- production deploy\n- destructive file/DB operations`,
          }],
        };
      }
    }

    if (!existsSync(project_path)) {
      return {
        content: [{ type: "text", text: `❌ Project path does not exist: ${project_path}` }],
      };
    }

    const env = { ...process.env, PATH: `${process.env.HOME}/.local/bin:${process.env.PATH}` };

    try {
      const { stdout, stderr } = await execFileAsync(
        "bash",
        [DISPATCH_SCRIPT, project_path, task_prompt, model, String(timeout_seconds)],
        { env, timeout: (timeout_seconds + 30) * 1000 }
      );

      const output = [stdout, stderr].filter(Boolean).join("\n").trim();
      const logsDir = getDispatchLogsDir(project_path);
      const logFile = latestLog(logsDir);

      return {
        content: [{
          type: "text",
          text: `✅ Cursor agent dispatch completed${goal_id ? ` for ${goal_id}` : ""}.\n\n` +
                `**Output:**\n\`\`\`\n${output.slice(0, 3000)}\n\`\`\`\n\n` +
                (logFile ? `**Log file:** ${logFile}` : ""),
        }],
      };
    } catch (err) {
      const msg = err.stdout || err.stderr || err.message || String(err);
      return {
        content: [{
          type: "text",
          text: `❌ Cursor agent dispatch failed.\n\n**Error:**\n\`\`\`\n${msg.slice(0, 2000)}\n\`\`\``,
        }],
      };
    }
  }
);

// ── Tool: dispatch_parallel ───────────────────────────────────────────────────
server.tool(
  "dispatch_parallel",
  "Dispatch multiple Cursor agents in parallel. " +
  "Use when a goal step has clearly separable tasks (e.g., UI agent + API agent). " +
  "Each task runs independently; results are logged separately.",
  {
    project_path: z.string().describe("Absolute path to the project directory"),
    tasks: z.array(z.object({
      id: z.string().describe("Unique task ID (e.g. 'ui-agent', 'api-agent')"),
      prompt: z.string().describe("Task prompt for this agent"),
      model: z.string().optional().default("claude-sonnet-4-5"),
    })).describe("List of tasks to run in parallel"),
    goal_id: z.string().optional().describe("Goal ID for logging"),
  },
  async ({ project_path, tasks, goal_id }) => {
    if (!existsSync(project_path)) {
      return {
        content: [{ type: "text", text: `❌ Project path does not exist: ${project_path}` }],
      };
    }

    // Write tasks YAML to a temp file in the bundle dir
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const bundlePath = goal_id ? join(project_path, ".bundle", goal_id) : join(project_path, ".bundle", "tmp");
    mkdirSync(bundlePath, { recursive: true });

    const tasksYaml = `tasks:\n` + tasks.map(t =>
      `  - id: "${t.id}"\n    prompt: "${t.prompt.replace(/"/g, '\\"')}"\n    model: "${t.model}"`
    ).join("\n");

    const tasksFile = join(bundlePath, `parallel-tasks-${timestamp}.yaml`);
    writeFileSync(tasksFile, tasksYaml, "utf8");

    const env = { ...process.env, PATH: `${process.env.HOME}/.local/bin:${process.env.PATH}` };

    try {
      const { stdout, stderr } = await execFileAsync(
        "bash",
        [PARALLEL_SCRIPT, project_path, tasksFile],
        { env, timeout: 1200 * 1000 } // 20 min max for parallel
      );

      const output = [stdout, stderr].filter(Boolean).join("\n").trim();
      return {
        content: [{
          type: "text",
          text: `✅ ${tasks.length} parallel Cursor agents completed${goal_id ? ` for ${goal_id}` : ""}.\n\n` +
                `**Output:**\n\`\`\`\n${output.slice(0, 3000)}\n\`\`\`\n\n` +
                `**Tasks file:** ${tasksFile}`,
        }],
      };
    } catch (err) {
      const msg = err.stdout || err.stderr || err.message || String(err);
      return {
        content: [{
          type: "text",
          text: `❌ Parallel dispatch failed.\n\n**Error:**\n\`\`\`\n${msg.slice(0, 2000)}\n\`\`\``,
        }],
      };
    }
  }
);

// ── Tool: read_dispatch_log ───────────────────────────────────────────────────
server.tool(
  "read_dispatch_log",
  "Read the latest dispatch log for a project. Use to check what Cursor agent did.",
  {
    project_path: z.string().describe("Absolute path to the project directory"),
    lines: z.number().optional().default(100).describe("Number of lines from end of log to return"),
  },
  async ({ project_path, lines }) => {
    const logsDir = getDispatchLogsDir(project_path);
    const logFile = latestLog(logsDir);

    if (!logFile) {
      return {
        content: [{ type: "text", text: `No dispatch logs found at ${logsDir}` }],
      };
    }

    const content = readFileSync(logFile, "utf8");
    const logLines = content.split("\n");
    const tail = logLines.slice(-lines).join("\n");

    return {
      content: [{
        type: "text",
        text: `**Log file:** ${logFile}\n\n\`\`\`\n${tail}\n\`\`\``,
      }],
    };
  }
);

// ── Tool: read_shared_memory ──────────────────────────────────────────────────
server.tool(
  "read_shared_memory",
  "Read shared-memory.yaml for a goal. Use to check execution status after Cursor completes a step.",
  {
    project_path: z.string().describe("Absolute path to the project directory"),
    goal_id: z.string().describe("Goal ID, e.g. G-021"),
  },
  async ({ project_path, goal_id }) => {
    const sharedMemPath = join(project_path, ".bundle", goal_id, "shared-memory.yaml");

    if (!existsSync(sharedMemPath)) {
      return {
        content: [{ type: "text", text: `No shared-memory.yaml found at ${sharedMemPath}` }],
      };
    }

    const content = readFileSync(sharedMemPath, "utf8");
    return {
      content: [{
        type: "text",
        text: `**${sharedMemPath}**\n\n\`\`\`yaml\n${content}\n\`\`\``,
      }],
    };
  }
);

// ── Tool: write_architecture_handoff ─────────────────────────────────────────
server.tool(
  "write_architecture_handoff",
  "Write architecture decisions to shared-memory.yaml and optionally trigger dispatch. " +
  "Use after Claude completes PLAN phase — writes architecture: section then signals Cursor to start.",
  {
    project_path: z.string().describe("Absolute path to the project directory"),
    goal_id: z.string().describe("Goal ID, e.g. G-021"),
    architecture_summary: z.string().describe("One-line architecture summary"),
    decisions: z.array(z.string()).describe("Key architecture decisions as bullet list"),
    adr: z.string().optional().describe("Related ADR, e.g. ADR-005"),
    dispatch_after: z.boolean().optional().default(false).describe("If true, also dispatch Cursor agent for step 1"),
    step_prompt: z.string().optional().describe("Cursor task prompt (required if dispatch_after=true)"),
    model: z.string().optional().default("claude-sonnet-4-5"),
  },
  async ({ project_path, goal_id, architecture_summary, decisions, adr, dispatch_after, step_prompt, model }) => {
    const bundlePath = join(project_path, ".bundle", goal_id);
    mkdirSync(bundlePath, { recursive: true });
    const sharedMemPath = join(bundlePath, "shared-memory.yaml");

    const timestamp = new Date().toISOString();
    const decisionsYaml = decisions.map(d => `  - "${d.replace(/"/g, '\\"')}"`).join("\n");

    let existingContent = "";
    if (existsSync(sharedMemPath)) {
      existingContent = readFileSync(sharedMemPath, "utf8");
    }

    const architectureBlock = `\narchitecture:\n  author: claude\n  updated_at: "${timestamp}"\n  summary: "${architecture_summary.replace(/"/g, '\\"')}"\n  decisions:\n${decisionsYaml}${adr ? `\n  adr: ${adr}` : ""}\n`;

    // Merge: replace existing architecture block or append
    let newContent;
    if (existingContent.includes("architecture:")) {
      newContent = existingContent.replace(/architecture:[\s\S]*?(?=\n[a-z]|$)/, architectureBlock);
    } else {
      const header = existingContent || `goal_id: ${goal_id}\nupdated_at: "${timestamp}"\n`;
      newContent = header.trim() + "\n" + architectureBlock;
    }

    writeFileSync(sharedMemPath, newContent, "utf8");

    let result = `✅ Architecture handoff written to ${sharedMemPath}\n\n`;
    result += `**Architecture summary:** ${architecture_summary}\n`;
    result += `**Decisions:** ${decisions.length} recorded\n`;
    if (adr) result += `**ADR:** ${adr}\n`;

    if (dispatch_after && step_prompt) {
      result += `\n🚀 Dispatching Cursor agent...\n`;
      const env = { ...process.env, PATH: `${process.env.HOME}/.local/bin:${process.env.PATH}` };
      try {
        const { stdout } = await execFileAsync(
          "bash",
          [DISPATCH_SCRIPT, project_path, step_prompt, model, "600"],
          { env, timeout: 630 * 1000 }
        );
        result += `\n**Cursor output:**\n\`\`\`\n${stdout.slice(0, 2000)}\n\`\`\``;
      } catch (err) {
        result += `\n❌ Dispatch failed: ${(err.message || String(err)).slice(0, 500)}`;
      }
    }

    return { content: [{ type: "text", text: result }] };
  }
);

// ── Tool: read_goal_status ───────────────────────────────────────────────────
server.tool(
  "read_goal_status",
  "Read the current status and plan table from a goal file (G-xxx.md). " +
  "Use after dispatching Cursor to check if it has moved the goal to 'review'. " +
  "Also returns the step table so you can see which steps are done/current/pending.",
  {
    goal_id: z.string().describe("Goal ID, e.g. G-021"),
    project_path: z.string().describe("Absolute path to the project directory containing docs/07-backlog/goals/"),
  },
  async ({ goal_id, project_path }) => {
    // Try project-level goals first, then fall back to Agent OS repo
    const candidates = [
      join(project_path, "docs", "07-backlog", "goals", `${goal_id}.md`),
      join(REPO_ROOT, "docs", "07-backlog", "goals", `${goal_id}.md`),
    ];

    const goalFile = candidates.find(p => existsSync(p));
    if (!goalFile) {
      return {
        content: [{
          type: "text",
          text: `❌ Goal file not found for ${goal_id}.\nSearched:\n${candidates.join("\n")}`,
        }],
      };
    }

    const content = readFileSync(goalFile, "utf8");
    const lines = content.split("\n");

    // Extract status line ("**Status:** ...")  
    const statusLine = lines.find(l => l.startsWith("**Status:**")) || "Status: unknown";
    const statusMatch = statusLine.match(/\*\*Status:\*\*\s*([\w_]+)/);
    const status = statusMatch ? statusMatch[1] : "unknown";

    // Extract plan/step table (lines with | N | Step |)
    const stepLines = lines.filter(l => /^\|\s*\d+\s*\|/.test(l));
    const stepTable = stepLines.join("\n");

    // Extract collaboration phase
    const phaseLine = lines.find(l => l.includes("Collaboration phase:")) || "";

    const isReview = status === "review";
    const emoji = { review: "🟡", approved: "✅", done: "✅", in_progress: "🔵", ready: "⚪", blocked: "🔴" }[status] || "⚪";

    return {
      content: [{
        type: "text",
        text: `${emoji} **${goal_id} — Status: ${status.toUpperCase()}**\n` +
              `**File:** ${goalFile}\n\n` +
              (phaseLine ? `**Phase:** ${phaseLine.replace(/.*Collaboration phase:\s*/, "").trim()}\n\n` : "") +
              (stepTable ? `**Steps:**\n${stepTable}\n\n` : "") +
              (isReview
                ? `✅ Cursor has completed the step and moved the goal to **review**.\n` +
                  `Next: call \`read_dispatch_log\` and \`read_shared_memory\` to review what Cursor did,\n` +
                  `then run pcampus-code-review checklist.`
                : `ℹ️ Goal is not yet in review status. Cursor may still be working.`),
      }],
    };
  }
);

// ── Tool: poll_until_review ───────────────────────────────────────────────────
server.tool(
  "poll_until_review",
  "Poll the goal file every N seconds until status becomes 'review' (or timeout). " +
  "Use after dispatch_cursor when you want to wait and get a completion summary automatically. " +
  "Returns full status summary once Cursor marks goal as review.",
  {
    goal_id: z.string().describe("Goal ID to watch, e.g. G-021"),
    project_path: z.string().describe("Absolute path to the project directory"),
    poll_interval_seconds: z.number().optional().default(15).describe("How often to check (seconds)"),
    timeout_seconds: z.number().optional().default(900).describe("Max wait time (seconds, default 15 min)"),
  },
  async ({ goal_id, project_path, poll_interval_seconds, timeout_seconds }) => {
    const candidates = [
      join(project_path, "docs", "07-backlog", "goals", `${goal_id}.md`),
      join(REPO_ROOT, "docs", "07-backlog", "goals", `${goal_id}.md`),
    ];
    const goalFile = candidates.find(p => existsSync(p));

    if (!goalFile) {
      return {
        content: [{ type: "text", text: `❌ Goal file not found: ${goal_id}` }],
      };
    }

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const deadline = Date.now() + timeout_seconds * 1000;
    let attempts = 0;

    while (Date.now() < deadline) {
      attempts++;
      const content = readFileSync(goalFile, "utf8");
      const statusLine = content.split("\n").find(l => l.startsWith("**Status:**")) || "";
      const statusMatch = statusLine.match(/\*\*Status:\*\*\s*([\w_]+)/);
      const status = statusMatch ? statusMatch[1] : "unknown";

      if (status === "review" || status === "approved" || status === "done") {
        // Extract git diff summary from project
        let gitSummary = "";
        try {
          const { stdout } = await execFileAsync(
            "git", ["diff", "HEAD~1", "--stat"],
            { cwd: project_path, timeout: 10000 }
          );
          gitSummary = stdout.trim();
        } catch (_) {
          try {
            const { stdout } = await execFileAsync(
              "git", ["status", "--short"],
              { cwd: project_path, timeout: 10000 }
            );
            gitSummary = stdout.trim();
          } catch (_2) { /* ignore */ }
        }

        // Read last dispatch log
        const logsDir = join(project_path, ".bundle", "dispatch-logs");
        const logFile = (() => {
          if (!existsSync(logsDir)) return null;
          const files = readdirSync(logsDir)
            .filter(f => f.endsWith(".log"))
            .map(f => ({ name: f, mtime: statSync(join(logsDir, f)).mtime }))
            .sort((a, b) => b.mtime - a.mtime);
          return files.length > 0 ? join(logsDir, files[0].name) : null;
        })();

        const logTail = logFile
          ? readFileSync(logFile, "utf8").split("\n").slice(-30).join("\n")
          : "(no log found)";

        return {
          content: [{
            type: "text",
            text: `✅ **${goal_id} moved to ${status.toUpperCase()}** after ${attempts} polls (~${attempts * poll_interval_seconds}s)\n\n` +
                  `**Goal file:** ${goalFile}\n\n` +
                  (gitSummary ? `**Git changes:**\n\`\`\`\n${gitSummary}\n\`\`\`\n\n` : "") +
                  `**Last dispatch log (tail):**\n\`\`\`\n${logTail.slice(0, 2000)}\n\`\`\`\n\n` +
                  `**Next steps:**\n` +
                  `1. Run \`read_shared_memory\` to see execution details\n` +
                  `2. Review changed files via git diff\n` +
                  `3. Run pcampus-code-review checklist\n` +
                  `4. If accepted → human approves → goal moves to \`approved\``,
          }],
        };
      }

      // Not review yet — wait
      await sleep(poll_interval_seconds * 1000);
    }

    return {
      content: [{
        type: "text",
        text: `⏰ **Timeout** — ${goal_id} did not reach 'review' status within ${timeout_seconds}s (${attempts} polls).\n` +
              `Last known status: check \`read_goal_status\` manually.\n` +
              `Cursor may still be working or may have encountered an error.`,
      }],
    };
  }
);

// ── Start ─────────────────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("pcampus-dispatch MCP server started");
