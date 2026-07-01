#!/usr/bin/env bash
# Copy Pcampus Agent OS into a new project directory.
# Usage: ./scripts/bootstrap.sh /path/to/new-repo "My Project Name"

set -euo pipefail

TARGET="${1:-}"
PROJECT_NAME="${2:-My Project}"

if [[ -z "$TARGET" ]]; then
  echo "Usage: $0 /path/to/new-repo \"Project Name\""
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OS_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

mkdir -p "$TARGET"

# Copy Agent OS (exclude bootstrap target if nested)
rsync -a --exclude '.git' "$OS_ROOT/" "$TARGET/"

# Replace common placeholders
if [[ "$(uname)" == "Darwin" ]]; then
  SED_INPLACE=(-i '')
else
  SED_INPLACE=(-i)
fi

find "$TARGET" -type f \( -name '*.md' -o -name '*.mdc' \) -print0 | while IFS= read -r -d '' file; do
  sed "${SED_INPLACE[@]}" "s/{PROJECT_NAME}/$PROJECT_NAME/g" "$file" 2>/dev/null || true
  sed "${SED_INPLACE[@]}" "s/{DATE}/$(date +%Y-%m-%d)/g" "$file" 2>/dev/null || true
done

echo "Bootstrap complete: $TARGET"
echo ""
echo "Next steps:"
echo "  1. cd $TARGET"
echo "  2. Run discovery: prompt Cursor with 'discover' (pcampus-discovery skill)"
echo "     -> knowledge-map.json, knowledge-digest.md, assumptions.md, project-brief.md, mvp-scope.md"
echo "  3. Fill docs/03-architecture/overview.md and AGENTS.md {TEST_COMMANDS}"
echo "  4. Replace docs/05-decisions/0001-example-postgresql.md with real ADR(s)"
echo "  5. Add .cursor/rules/{stack}.mdc if needed (copy from stack-*.example.mdc)"
echo "  6. Copy .github/ci-config.example.yml → .github/ci-config.yml (at G-001)"
echo "  7. Enable branch protection — docs/06-workflows/github-governance.md"
echo "  8. Set G-001 to ready and prompt: อ่าน AGENTS.md แล้วทำ G-001"
echo ""
echo "Existing project? Use ./scripts/upgrade-os.sh <path> — see docs/06-workflows/upgrade-agent-os.md"
echo ""
echo "Keep unchanged: design-spec.md, pcampus-* skills, process workflows."
