#!/usr/bin/env bash
# =============================================================================
# register-mcp.sh — Auto-register a project's dispatch-mcp-server with Claude Desktop
# =============================================================================
# Usage (from Pcampus Agent OS repo):
#   ./scripts/register-mcp.sh /path/to/project
#
# Called automatically by upgrade-os.sh --yes after Phase 1 sync.
# Can also be run standalone after bootstrap.
#
# What it does:
#   1. Derives a unique server name from the project folder name
#   2. Adds/updates the entry in ~/Library/Application Support/Claude/claude_desktop_config.json
#   3. Prints confirmation — user still needs to restart Claude Desktop
# =============================================================================

set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

log()   { echo -e "${CYAN}[register-mcp]${RESET} $*"; }
ok()    { echo -e "${GREEN}[register-mcp]${RESET} ✓ $*"; }
warn()  { echo -e "${YELLOW}[register-mcp]${RESET} ⚠ $*"; }
error() { echo -e "${RED}[register-mcp]${RESET} ✗ $*" >&2; }

PROJECT_PATH="${1:?Usage: $0 <project_path>}"
PROJECT_PATH="$(cd "$PROJECT_PATH" && pwd)"

# ── Paths ─────────────────────────────────────────────────────────────────────
MCP_SERVER_JS="$PROJECT_PATH/scripts/dispatch-mcp-server/index.js"
CLAUDE_CONFIG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"

# ── Derive unique server name ─────────────────────────────────────────────────
PROJECT_NAME="$(basename "$PROJECT_PATH" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g')"
SERVER_NAME="pcampus-dispatch-${PROJECT_NAME}"

log "Project : ${BOLD}${PROJECT_PATH}${RESET}"
log "Server  : ${BOLD}${SERVER_NAME}${RESET}"

# ── Pre-flight checks ─────────────────────────────────────────────────────────
if [[ ! -f "$MCP_SERVER_JS" ]]; then
  error "MCP server not found: $MCP_SERVER_JS"
  error "Run upgrade-os.sh --yes first, then npm install in scripts/dispatch-mcp-server/"
  exit 1
fi

if [[ ! -d "$PROJECT_PATH/scripts/dispatch-mcp-server/node_modules" ]]; then
  warn "node_modules not found — running npm install first..."
  if command -v npm &>/dev/null; then
    npm install --prefix "$PROJECT_PATH/scripts/dispatch-mcp-server" --silent
    ok "npm install complete"
  else
    error "npm not found. Run: cd '$PROJECT_PATH/scripts/dispatch-mcp-server' && npm install"
    exit 1
  fi
fi

if [[ ! -f "$CLAUDE_CONFIG" ]]; then
  warn "Claude Desktop config not found at: $CLAUDE_CONFIG"
  warn "Creating empty config..."
  mkdir -p "$(dirname "$CLAUDE_CONFIG")"
  echo '{}' > "$CLAUDE_CONFIG"
fi

# ── PATH for node to find cursor-agent ───────────────────────────────────────
AGENT_PATH="$HOME/.local/bin:/usr/local/bin:/usr/bin:/bin"

# ── Register in Claude Desktop config ────────────────────────────────────────
python3 - "$PROJECT_PATH" "$SERVER_NAME" "$MCP_SERVER_JS" "$AGENT_PATH" "$CLAUDE_CONFIG" <<'PYEOF'
import json, sys

project_path, server_name, server_js, agent_path, config_path = sys.argv[1:]

with open(config_path) as f:
    config = json.load(f)

config.setdefault('mcpServers', {})

existing = config['mcpServers'].get(server_name)
config['mcpServers'][server_name] = {
    'command': 'node',
    'args': [server_js],
    'env': {'PATH': agent_path}
}

with open(config_path, 'w') as f:
    json.dump(config, f, indent=2)

action = 'updated' if existing else 'added'
print(action)
PYEOF

RESULT=$(python3 - "$PROJECT_PATH" "$SERVER_NAME" "$MCP_SERVER_JS" "$AGENT_PATH" "$CLAUDE_CONFIG" <<'PYEOF' 2>/dev/null
import json, sys
project_path, server_name, server_js, agent_path, config_path = sys.argv[1:]
with open(config_path) as f:
    config = json.load(f)
servers = list(config.get('mcpServers', {}).keys())
print(', '.join(servers))
PYEOF
)

ok "Registered '${SERVER_NAME}' in Claude Desktop"
log "All registered servers: ${RESULT}"
echo ""
echo -e "  ${YELLOW}⚠ Restart Claude Desktop to activate the new server${RESET}"
echo -e "  ${CYAN}Tools available after restart:${RESET}"
echo "    dispatch_cursor, dispatch_parallel, read_goal_status,"
echo "    poll_until_review, read_dispatch_log, read_shared_memory,"
echo "    write_architecture_handoff"
echo ""
