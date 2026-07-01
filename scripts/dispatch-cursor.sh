#!/usr/bin/env bash
# =============================================================================
# dispatch-cursor.sh — Antigravity → Cursor Agent Dispatcher (Approach A)
# =============================================================================
# Usage:
#   ./scripts/dispatch-cursor.sh <project_path> "<task_prompt>" [model] [timeout_seconds]
#
# Examples:
#   ./scripts/dispatch-cursor.sh /path/to/project "implement login API endpoint per step-2.md"
#   ./scripts/dispatch-cursor.sh /path/to/project "fix lint errors in auth module" claude-sonnet-4-5 300
#
# Environment Variables:
#   CURSOR_MODEL    - Default model to use (default: claude-sonnet-4-5)
#   CURSOR_TIMEOUT  - Max execution time in seconds (default: 600)
# =============================================================================

set -euo pipefail

# ── Colours ─────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

log()   { echo -e "${CYAN}[dispatch]${RESET} $*"; }
ok()    { echo -e "${GREEN}[dispatch]${RESET} ✓ $*"; }
warn()  { echo -e "${YELLOW}[dispatch]${RESET} ⚠ $*"; }
error() { echo -e "${RED}[dispatch]${RESET} ✗ $*" >&2; }

# ── Argument Parsing ─────────────────────────────────────────────────────────
PROJECT_PATH="${1:?Usage: $0 <project_path> \"<task>\" [model] [timeout]}"
TASK="${2:?Task prompt is required}"
MODEL="${3:-${CURSOR_MODEL:-claude-sonnet-4-5}}"
TIMEOUT="${4:-${CURSOR_TIMEOUT:-600}}"

# ── Pre-flight Checks ────────────────────────────────────────────────────────
if ! command -v agent &>/dev/null; then
  error "cursor 'agent' CLI not found. Install with: curl https://cursor.com/install -fsS | bash"
  error "Then add ~/.local/bin to PATH."
  exit 1
fi

if [[ ! -d "$PROJECT_PATH" ]]; then
  error "Project path does not exist: $PROJECT_PATH"
  exit 1
fi

# ── Dispatch Log ─────────────────────────────────────────────────────────────
TIMESTAMP=$(date -u +"%Y%m%dT%H%M%SZ")
LOG_DIR="${PROJECT_PATH}/.bundle/dispatch-logs"
mkdir -p "$LOG_DIR"
LOG_FILE="${LOG_DIR}/dispatch-${TIMESTAMP}.log"

log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "Project : ${BOLD}${PROJECT_PATH}${RESET}"
log "Model   : ${BOLD}${MODEL}${RESET}"
log "Timeout : ${TIMEOUT}s"
log "Log     : ${LOG_FILE}"
log "Task    :"
echo -e "  ${YELLOW}${TASK}${RESET}"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── Write task manifest ───────────────────────────────────────────────────────
cat > "${LOG_DIR}/dispatch-${TIMESTAMP}.yaml" <<YAML
dispatched_at: "${TIMESTAMP}"
project_path: "${PROJECT_PATH}"
model: "${MODEL}"
timeout: ${TIMEOUT}
task: |
$(echo "$TASK" | sed 's/^/  /')
YAML

# ── Portable timeout (macOS has no GNU timeout by default) ───────────────────
run_with_timeout() {
  local secs="$1"
  shift
  if command -v timeout &>/dev/null; then
    timeout "$secs" "$@"
  elif command -v gtimeout &>/dev/null; then
    gtimeout "$secs" "$@"
  else
    warn "timeout/gtimeout not found — running agent without wall-clock limit (${secs}s ignored)"
    warn "Optional: brew install coreutils"
    "$@"
  fi
}

# ── Execute via cursor agent CLI ─────────────────────────────────────────────
log "Launching Cursor Agent..."
START_TIME=$(date +%s)

set +e
(
  cd "${PROJECT_PATH}" &&
  run_with_timeout "${TIMEOUT}" agent -p "${TASK}"
) 2>&1 | tee "${LOG_FILE}"
EXIT_CODE=${PIPESTATUS[0]}
set -e

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

# ── Result ───────────────────────────────────────────────────────────────────
echo "" >> "${LOG_FILE}"
echo "exit_code=${EXIT_CODE} duration=${DURATION}s" >> "${LOG_FILE}"

if [[ $EXIT_CODE -eq 0 ]]; then
  ok "Cursor Agent completed in ${DURATION}s"
  ok "Log saved: ${LOG_FILE}"
elif [[ $EXIT_CODE -eq 124 ]]; then
  warn "Cursor Agent timed out after ${TIMEOUT}s"
  warn "Partial log: ${LOG_FILE}"
  exit 2
else
  error "Cursor Agent exited with code ${EXIT_CODE} after ${DURATION}s"
  error "Log: ${LOG_FILE}"
  exit $EXIT_CODE
fi
