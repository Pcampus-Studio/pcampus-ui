#!/usr/bin/env bash
# Sync Pcampus Agent OS framework layer into an existing project.
# Does NOT overwrite product-owned files (code/, brief, goals content, ADRs, …).
#
# Usage:
#   ./scripts/upgrade-os.sh /path/to/existing-project [--dry-run] [--yes] [--report]
#
# Phase 1 (mechanical): --dry-run | --yes
# Drift report (for AI Phase 2): --report
# See docs/06-workflows/upgrade-agent-os.md and pcampus-upgrade-os skill.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OS_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

TARGET=""
DRY_RUN=false
ASSUME_YES=false
REPORT_ONLY=false

usage() {
  cat <<'EOF'
Usage: upgrade-os.sh <existing-project-path> [--dry-run] [--yes] [--report]

  Sync framework layer from Pcampus Agent OS into an existing project.

  --dry-run   Show rsync changes; do not write files
  --yes       Skip confirmation prompt (Phase 1 mechanical sync)
  --report    Drift report for AI semantic merge (no writes)

  Two-phase upgrade: Phase 1 = this script; Phase 2 = pcampus-upgrade-os skill
  Manifest: framework-manifest.yml

Examples:
  ./scripts/upgrade-os.sh ../my-app --report
  ./scripts/upgrade-os.sh ../my-app --dry-run
  ./scripts/upgrade-os.sh ../my-app --yes
EOF
}

log() { echo "==> $*"; }
warn() { echo "WARN: $*" >&2; }
info() { echo "  $*"; }

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    --yes) ASSUME_YES=true ;;
    --report) REPORT_ONLY=true ;;
    -h|--help) usage; exit 0 ;;
    *)
      if [[ -z "$TARGET" ]]; then
        TARGET="$arg"
      else
        echo "Unknown argument: $arg" >&2
        usage
        exit 1
      fi
      ;;
  esac
done

if [[ -z "$TARGET" ]]; then
  usage
  exit 1
fi

TARGET="$(cd "$TARGET" 2>/dev/null && pwd)" || {
  echo "ERROR: Target directory does not exist." >&2
  exit 1
}

if [[ "$TARGET" == "$OS_ROOT" ]]; then
  echo "ERROR: Target must be a different project — not the Agent OS repo itself." >&2
  exit 1
fi

if [[ ! -f "$TARGET/AGENTS.md" && ! -f "$TARGET/docs/07-backlog/goals.md" ]]; then
  echo "ERROR: Target does not look like a Pcampus project (missing AGENTS.md and docs/07-backlog/goals.md)." >&2
  echo "       For new projects use: ./scripts/bootstrap.sh <path> \"Project Name\"" >&2
  exit 1
fi

# --- rsync helpers ---
RSYNC_OPTS=(-a)
[[ "$DRY_RUN" == true ]] && RSYNC_OPTS+=(-n -v)

rsync_path() {
  local src="$1"
  local dest="$2"
  shift 2

  if [[ ! -e "$OS_ROOT/$src" ]]; then
    warn "Source path missing, skipping: $src"
    return 0
  fi

  mkdir -p "$(dirname "$dest")"
  if (($# > 0)); then
    rsync "${RSYNC_OPTS[@]}" "$@" "$OS_ROOT/$src" "$dest"
  else
    rsync "${RSYNC_OPTS[@]}" "$OS_ROOT/$src" "$dest"
  fi
}

rsync_dir() {
  local src="$1"
  local dest="$2"
  shift 2

  if [[ ! -d "$OS_ROOT/$src" ]]; then
    warn "Source directory missing, skipping: $src"
    return 0
  fi

  mkdir -p "$dest"
  if (($# > 0)); then
    rsync "${RSYNC_OPTS[@]}" "$@" "$OS_ROOT/$src/" "$dest/"
  else
    rsync "${RSYNC_OPTS[@]}" "$OS_ROOT/$src/" "$dest/"
  fi
}

# --- version helpers ---
os_version_string() {
  local version=""
  if git -C "$OS_ROOT" rev-parse --short HEAD >/dev/null 2>&1; then
    version="$(git -C "$OS_ROOT" rev-parse --short HEAD)"
    local tag
    tag="$(git -C "$OS_ROOT" describe --tags --always 2>/dev/null || true)"
    [[ -n "$tag" ]] && version="$tag ($version)"
  else
    version="unknown"
  fi
  echo "$version"
}

manifest_version() {
  if [[ -f "$OS_ROOT/framework-manifest.yml" ]]; then
    grep -E '^version:' "$OS_ROOT/framework-manifest.yml" | head -1 \
      | sed -E 's/^version:[[:space:]]*"?([^"]+)"?/\1/'
  else
    echo "unknown"
  fi
}

target_version_string() {
  if [[ -f "$TARGET/.pcampus-os-version" ]]; then
    head -1 "$TARGET/.pcampus-os-version"
  else
    echo "(not stamped — never upgraded or pre-manifest)"
  fi
}

skill_version() {
  local file="$1"
  if [[ -f "$file" ]]; then
    grep -E '^version:' "$file" 2>/dev/null | head -1 \
      | sed -E 's/^version:[[:space:]]*"?([^"]+)"?/\1/' || echo "?"
  else
    echo "(missing)"
  fi
}

# --- report helpers ---
rsync_itemize() {
  local src="$1"
  local dest="$2"
  shift 2

  [[ -e "$OS_ROOT/$src" ]] || return 0
  mkdir -p "$(dirname "$dest")" 2>/dev/null || true
  rsync -ain "$@" "$OS_ROOT/$src" "$dest" 2>/dev/null || true
}

rsync_dir_itemize() {
  local src="$1"
  local dest="$2"
  shift 2

  [[ -d "$OS_ROOT/$src" ]] || return 0
  mkdir -p "$dest" 2>/dev/null || true
  rsync -ain "$@" "$OS_ROOT/$src/" "$dest/" 2>/dev/null || true
}

file_differs() {
  local rel="$1"
  if [[ ! -f "$OS_ROOT/$rel" ]]; then
    return 1
  fi
  if [[ ! -f "$TARGET/$rel" ]]; then
    return 0
  fi
  ! cmp -s "$OS_ROOT/$rel" "$TARGET/$rel"
}

count_glob() {
  local pattern="$1"
  local dir="$2"
  local count=0
  shopt -s nullglob
  local files=("$dir"/$pattern)
  shopt -u nullglob
  count=${#files[@]}
  echo "$count"
}

run_drift_check() {
  local id="$1"
  local file="$2"
  local must="${3:-}"
  local warn_contains="${4:-}"

  [[ -n "$file" ]] || return 0

  local path="$TARGET/$file"
  if [[ ! -f "$path" ]]; then
    echo "DRIFT|$id|missing|$file|File not found — create or merge from OS"
    return 0
  fi

  if [[ -n "$must" ]] && ! grep -qF "$must" "$path" 2>/dev/null; then
    echo "DRIFT|$id|missing_section|$file|Expected content: $must"
  fi

  if [[ -n "$warn_contains" ]] && grep -qF "$warn_contains" "$path" 2>/dev/null; then
    echo "DRIFT|$id|legacy|$file|Contains legacy pattern: $warn_contains"
  fi
}

run_report() {
  local os_ver manifest_ver target_ver
  os_ver="$(os_version_string)"
  manifest_ver="$(manifest_version)"
  target_ver="$(target_version_string)"

  echo "=== PCAMPUS UPGRADE REPORT ==="
  echo ""
  echo "VERSION"
  echo "  OS source:     $OS_ROOT"
  echo "  OS commit:     $os_ver"
  echo "  Manifest:      $manifest_ver"
  echo "  Target:        $TARGET"
  echo "  Target stamp:  $target_ver"
  echo ""

  echo "MECHANICAL (Phase 1 — upgrade-os.sh --yes)"
  local mechanical=0

  for skill_dir in "$OS_ROOT"/.cursor/skills/pcampus-*/; do
    [[ -d "$skill_dir" ]] || continue
    local name
    name="$(basename "$skill_dir")"
    local os_v tg_v
    os_v="$(skill_version "$OS_ROOT/.cursor/skills/$name/SKILL.md")"
    tg_v="$(skill_version "$TARGET/.cursor/skills/$name/SKILL.md")"
    if [[ "$os_v" != "$tg_v" ]] || [[ ! -d "$TARGET/.cursor/skills/$name" ]]; then
      echo "  ~ .cursor/skills/$name ($tg_v → $os_v)"
      mechanical=$((mechanical + 1))
    fi
  done

  local mech_files=(
    "framework-manifest.yml"
    "CLAUDE.md"
    ".agents/agents.md"
    ".agents/workflows/arch-review.md"
    ".cursor/rules/governance.mdc"
    "scripts/ci/governance-check.sh"
    "scripts/upgrade-os.sh"
    "scripts/dispatch-cursor.sh"
    "scripts/dispatch-parallel.sh"
    "scripts/dispatch-mcp-server/index.js"
    "scripts/dispatch-mcp-server/package.json"
    "docs/07-backlog/goals/_template.md"
    "docs/07-backlog/goals/_archived/README.md"
    "docs/06-workflows/upgrade-agent-os.md"
    "docs/06-workflows/cursor-dispatch.md"
  )
  for rel in "${mech_files[@]}"; do
    if file_differs "$rel"; then
      if [[ -f "$TARGET/$rel" ]]; then
        echo "  ~ $rel (differs from OS)"
      else
        echo "  + $rel (missing in target)"
      fi
      mechanical=$((mechanical + 1))
    fi
  done

  if [[ "$mechanical" -eq 0 ]]; then
    echo "  (no mechanical changes detected — Phase 1 may be up to date)"
  fi
  echo ""

  echo "DRIFT (Phase 2 — pcampus-upgrade-os skill semantic merge)"
  local drift=0

  while IFS= read -r line; do
    [[ -z "$line" ]] && continue
    drift=$((drift + 1))
    local id kind file msg
    IFS='|' read -r _ id kind file msg <<< "$line"
    echo "  ! [$id] $file — $msg"
  done < <(
    run_drift_check "goals-dashboard" "docs/07-backlog/goals.md" "## Dashboard"
    run_drift_check "goals-layout" "docs/07-backlog/goals.md" "## Layout"
    run_drift_check "goals-plan-legend" "docs/07-backlog/goals.md" "## Plan legend"
    run_drift_check "goals-archived-path" "docs/07-backlog/goals.md" "goals/_archived/" "goals/_archive/"
    run_drift_check "template-plan" "docs/07-backlog/goals/_template.md" "#### Plan"
    run_drift_check "agents-goals-file" "AGENTS.md" "goals/G-xxx.md"
    run_drift_check "lean-index" "docs/07-backlog/goals.md" "" "lean index"
    run_drift_check "knowledge-map" "docs/02-product/knowledge-map.json" "\"os_health\""
  )

  if [[ -d "$TARGET/docs/07-backlog/goals/_archive" ]]; then
    drift=$((drift + 1))
    echo "  ! [archive-folder] docs/07-backlog/goals/_archive/ — migrate to _archived/"
  fi

  if [[ "$drift" -eq 0 ]]; then
    echo "  (no drift detected — semantic merge may be complete)"
  fi
  echo ""

  echo "MERGE (Phase 2 — hybrid files, never blind overwrite)"
  echo "  • AGENTS.md — keep mission + {TEST_COMMANDS}; merge governance/skills/CI"
  echo "  • docs/07-backlog/goals.md — keep Dashboard/queue; merge Layout/Status flow/legend"
  echo "  • docs/00-index.md, README.md — merge doc map / upgrade sections"
  echo "  • Skill: .cursor/skills/pcampus-upgrade-os/SKILL.md"
  echo "  • Manifest: framework-manifest.yml"
  echo ""

  local active_goals archived_goals
  active_goals="$(count_glob "G-*.md" "$TARGET/docs/07-backlog/goals")"
  archived_goals="$(count_glob "G-*.md" "$TARGET/docs/07-backlog/goals/_archived")"

  echo "SAFE (product-owned — not touched by Phase 1)"
  echo "  ✓ code/"
  echo "  ✓ $active_goals active goal file(s) in docs/07-backlog/goals/G-*.md"
  echo "  ✓ $archived_goals archived goal file(s) in goals/_archived/G-*.md"
  echo "  ✓ docs/02-product/project-brief.md, mvp-scope.md"
  echo "  ✓ docs/02-product/knowledge-map.json (+ digest, assumptions, learning-log, os-health) — data never overwritten"
  echo "  ✓ docs/02-product/knowledge-map.schema.json — synced from OS (framework contract)"
  echo "  ✓ docs/05-decisions/, docs/03-architecture/api|data/"
  echo "  ✓ .github/ci-config.yml, .cursor/rules/{stack}.mdc"
  echo ""

  echo "NEXT STEPS"
  echo "  1. Human: open upgrade goal or approve upgrade"
  echo "  2. Phase 1: ./scripts/upgrade-os.sh \"$TARGET\" --yes"
  echo "  3. Phase 2: Agent with pcampus-upgrade-os skill — merge hybrid files"
  echo "  4. Verify: cd \"$TARGET\" && bash scripts/ci/governance-check.sh"
  echo "  5. Commit: G-xxx: upgrade Pcampus Agent OS to $manifest_ver"
  echo ""
  echo "Docs: docs/06-workflows/upgrade-agent-os.md"
}

# --- version stamp ---
write_version_stamp() {
  [[ "$DRY_RUN" == true ]] && return 0

  local version
  version="$(os_version_string)"
  printf '%s\n%s\n' "$version" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$TARGET/.pcampus-os-version"
  log "Wrote .pcampus-os-version ($version)"
}

print_merge_checklist() {
  echo ""
  echo "=== Phase 2 — semantic merge (AI) ==="
  echo "  Attach pcampus-upgrade-os skill and merge hybrid files."
  echo "  Run: ./scripts/upgrade-os.sh \"$TARGET\" --report"
  echo ""
  echo "  Hybrid files: AGENTS.md, goals.md (structure), 00-index.md, README.md"
  echo "  Manifest: framework-manifest.yml"
  echo ""
  echo "=== Post-sync setup ==="
  echo "  ▸ dispatch-mcp-server: cd \"$TARGET/scripts/dispatch-mcp-server\" && npm install"
  echo "  ▸ Claude Desktop: add 'pcampus-dispatch' server to claude_desktop_config.json"
  echo "    see: $TARGET/scripts/dispatch-mcp-server/README.md"
  echo ""
  echo "=== Suggested next steps ==="
  echo "  1. git diff — review Phase 1 framework updates"
  echo "  2. Agent Phase 2 merge (pcampus-upgrade-os)"
  echo "  3. bash scripts/ci/governance-check.sh"
  echo "  4. Commit: G-xxx: upgrade Pcampus Agent OS"
  echo ""
  echo "Docs: docs/06-workflows/upgrade-agent-os.md"
}

# --- main sync (Phase 1) ---
run_upgrade() {
  log "Agent OS source: $OS_ROOT"
  log "Target:   $TARGET"
  log "Manifest: $(manifest_version)"
  [[ "$DRY_RUN" == true ]] && log "Mode:     DRY RUN (no writes)"

  log "Syncing framework manifest..."
  rsync_path "framework-manifest.yml" "$TARGET/framework-manifest.yml"

  log "Syncing pcampus-* skills..."
  for skill_dir in "$OS_ROOT"/.cursor/skills/pcampus-*/; do
    [[ -d "$skill_dir" ]] || continue
    name="$(basename "$skill_dir")"
    rsync_dir ".cursor/skills/$name" "$TARGET/.cursor/skills/$name" --delete
  done

  log "Syncing Cursor rules (framework)..."
  for rule in governance security core guidelines commits testing goal-execution; do
    rsync_path ".cursor/rules/${rule}.mdc" "$TARGET/.cursor/rules/${rule}.mdc"
  done
  for example in "$OS_ROOT"/.cursor/rules/stack-*.example.mdc; do
    [[ -f "$example" ]] || continue
    name="$(basename "$example")"
    rsync_path ".cursor/rules/$name" "$TARGET/.cursor/rules/$name"
  done

  log "Syncing Antigravity bridge (.agents/, CLAUDE.md)..."
  rsync_dir ".agents" "$TARGET/.agents"
  rsync_path "CLAUDE.md" "$TARGET/CLAUDE.md"

  log "Syncing GitHub workflows & PR template..."
  rsync_dir ".github/workflows" "$TARGET/.github/workflows"
  rsync_path ".github/pull_request_template.md" "$TARGET/.github/pull_request_template.md"
  rsync_path ".github/ci-config.example.yml" "$TARGET/.github/ci-config.example.yml"

  log "Syncing scripts..."
  rsync_dir "scripts/ci" "$TARGET/scripts/ci"
  rsync_path "scripts/bootstrap.sh" "$TARGET/scripts/bootstrap.sh"
  rsync_path "scripts/upgrade-os.sh" "$TARGET/scripts/upgrade-os.sh"

  log "Syncing dispatch scripts & MCP server..."
  rsync_path "scripts/dispatch-cursor.sh" "$TARGET/scripts/dispatch-cursor.sh"
  rsync_path "scripts/dispatch-parallel.sh" "$TARGET/scripts/dispatch-parallel.sh"
  mkdir -p "$TARGET/scripts/dispatch-mcp-server"
  rsync_path "scripts/dispatch-mcp-server/index.js" "$TARGET/scripts/dispatch-mcp-server/index.js"
  rsync_path "scripts/dispatch-mcp-server/package.json" "$TARGET/scripts/dispatch-mcp-server/package.json"
  rsync_path "scripts/dispatch-mcp-server/README.md" "$TARGET/scripts/dispatch-mcp-server/README.md"

  log "Syncing process docs..."
  rsync_dir "docs/04-agents" "$TARGET/docs/04-agents"
  rsync_dir "docs/06-workflows" "$TARGET/docs/06-workflows"
  rsync_path "docs/03-architecture/design-spec.md" "$TARGET/docs/03-architecture/design-spec.md"
  rsync_path "docs/02-product/acceptance-template.md" "$TARGET/docs/02-product/acceptance-template.md"
  rsync_dir "docs/02-product/acceptance" "$TARGET/docs/02-product/acceptance"

  log "Syncing knowledge OS framework (schema + README — product map data is never overwritten)..."
  rsync_path "docs/02-product/knowledge-map.schema.json" "$TARGET/docs/02-product/knowledge-map.schema.json"
  rsync_path "docs/02-product/knowledge-map.README.md" "$TARGET/docs/02-product/knowledge-map.README.md"

  log "Syncing goals scaffolding (framework)..."
  mkdir -p "$TARGET/docs/07-backlog/goals/_archived"
  rsync_path "docs/07-backlog/goals/_template.md" "$TARGET/docs/07-backlog/goals/_template.md"
  rsync_path "docs/07-backlog/goals/_archived/README.md" "$TARGET/docs/07-backlog/goals/_archived/README.md"

  log "Creating missing product scaffolds (--ignore-existing; never overwrites filled data)..."
  local create_if_missing=(
    "docs/00-project-snapshot.md"
    "docs/02-product/knowledge-digest.md"
    "docs/02-product/knowledge-map.json"
    "docs/02-product/learning-log.md"
    "docs/02-product/os-health.md"
    "docs/02-product/assumptions.md"
    "docs/07-backlog/changelog.md"
  )
  for rel in "${create_if_missing[@]}"; do
    rsync_path "$rel" "$TARGET/$rel" --ignore-existing
  done

  write_version_stamp

  if [[ "$DRY_RUN" == true ]]; then
    log "Dry run complete — no files were modified."
  else
    chmod +x "$TARGET/scripts/ci/"*.sh 2>/dev/null || true
    chmod +x "$TARGET/scripts/bootstrap.sh" "$TARGET/scripts/upgrade-os.sh" 2>/dev/null || true
    chmod +x "$TARGET/scripts/dispatch-cursor.sh" "$TARGET/scripts/dispatch-parallel.sh" 2>/dev/null || true
    log "Phase 1 mechanical sync complete."
  fi

  print_merge_checklist
}

# --- main ---
if [[ "$REPORT_ONLY" == true ]]; then
  run_report
  exit 0
fi

if [[ "$ASSUME_YES" != true && "$DRY_RUN" != true ]]; then
  echo ""
  echo "Phase 1 — mechanical framework sync into:"
  echo "  $TARGET"
  echo ""
  echo "Product files (code/, goals/G-*.md, brief, ADRs, ci-config.yml) are NOT touched."
  echo "Phase 2 semantic merge: pcampus-upgrade-os skill (run --report first)."
  echo ""
  read -r -p "Continue? [y/N] " reply
  if [[ ! "$reply" =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
  fi
fi

run_upgrade
