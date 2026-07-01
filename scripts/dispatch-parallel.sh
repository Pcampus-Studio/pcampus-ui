#!/usr/bin/env bash
# =============================================================================
# dispatch-parallel.sh — Antigravity → Multiple Cursor Agents (Approach C Hybrid)
# =============================================================================
# Spawns multiple cursor agent tasks in parallel as background processes.
# Each task runs independently; all must finish before script exits.
#
# Usage:
#   ./scripts/dispatch-parallel.sh <project_path> <tasks_yaml_file>
#
# tasks_yaml_file format (see scripts/cursor-orchestrator/example-tasks.yaml):
#   tasks:
#     - id: ui-agent
#       prompt: "implement React dashboard component per step-3.md"
#       model: claude-sonnet-4-5
#     - id: api-agent
#       prompt: "implement REST endpoint per step-3.md API section"
#       model: claude-sonnet-4-5
# =============================================================================

set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

log()   { echo -e "${CYAN}[parallel]${RESET} $*"; }
ok()    { echo -e "${GREEN}[parallel]${RESET} ✓ $*"; }
error() { echo -e "${RED}[parallel]${RESET} ✗ $*" >&2; }

PROJECT_PATH="${1:?Usage: $0 <project_path> <tasks_yaml>}"
TASKS_FILE="${2:?Tasks YAML file is required}"

if [[ ! -f "$TASKS_FILE" ]]; then
  error "Tasks file not found: $TASKS_FILE"
  exit 1
fi

if ! command -v agent &>/dev/null; then
  error "cursor 'agent' CLI not found."
  exit 1
fi

# Parse tasks using Python (available on macOS)
TASK_COUNT=$(python3 -c "
import sys, re
content = open('$TASKS_FILE').read()
prompts = re.findall(r'prompt:\s*[\"\'](.*?)[\"\']', content, re.DOTALL)
print(len(prompts))
")

log "Dispatching ${TASK_COUNT} parallel Cursor Agent tasks..."

TIMESTAMP=$(date -u +"%Y%m%dT%H%M%SZ")
LOG_DIR="${PROJECT_PATH}/.bundle/dispatch-logs/parallel-${TIMESTAMP}"
mkdir -p "$LOG_DIR"

# Run tasks in parallel using background processes
PIDS=()
TASK_IDS=()

while IFS= read -r line; do
  if [[ "$line" =~ ^[[:space:]]*-[[:space:]]*id:[[:space:]]*(.*) ]]; then
    CURRENT_ID="${BASH_REMATCH[1]}"
  elif [[ "$line" =~ ^[[:space:]]*prompt:[[:space:]]*(.*) ]]; then
    PROMPT="${BASH_REMATCH[1]}"
    LOG_FILE="${LOG_DIR}/${CURRENT_ID}.log"
    
    log "Spawning agent: ${BOLD}${CURRENT_ID}${RESET}"
    (
      agent --cwd "${PROJECT_PATH}" -p "${PROMPT}" \
        > "${LOG_FILE}" 2>&1
      echo "EXIT:$?" >> "${LOG_FILE}"
    ) &
    PIDS+=($!)
    TASK_IDS+=("$CURRENT_ID")
  fi
done < "$TASKS_FILE"

# Wait for all agents to complete
FAILED=0
for i in "${!PIDS[@]}"; do
  PID="${PIDS[$i]}"
  ID="${TASK_IDS[$i]}"
  
  if wait "$PID"; then
    ok "Agent '${ID}' completed"
  else
    error "Agent '${ID}' failed (PID: ${PID})"
    FAILED=$((FAILED + 1))
  fi
done

if [[ $FAILED -eq 0 ]]; then
  ok "All ${TASK_COUNT} agents completed successfully"
  ok "Logs: ${LOG_DIR}/"
  exit 0
else
  error "${FAILED}/${TASK_COUNT} agents failed. See logs: ${LOG_DIR}/"
  exit 1
fi
