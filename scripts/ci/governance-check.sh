#!/usr/bin/env bash
# Pcampus governance checks — run locally or in GitHub Actions.
# See docs/06-workflows/github-governance.md

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

FAIL=0

warn() { echo "::warning file=governance-check.sh::$*" >&2 || echo "WARN: $*" >&2; }
fail() { echo "::error file=governance-check.sh::$*" >&2 || echo "ERROR: $*" >&2; FAIL=1; }
info() { echo "$*"; }

GOAL_PATTERN='G-[0-9]{3}'
COMMIT_MSG_PATTERN='^G-[0-9]{3}: .+'

FORBIDDEN_PATH_PATTERNS=(
  '\.env$'
  '\.env\.'
  'credentials\.json'
  '\.pem$'
  '\.p12$'
  '\.key$'
  'id_rsa'
  'service-account.*\.json'
)

pr_has_bypass() {
  local title="${PR_TITLE:-}"
  [[ -n "$title" ]] || return 1
  echo "$title" | grep -qE '\[(governance|skip-goal|skip-governance)\]'
}

extract_goals() {
  # grep exits 1 when no match — must not trigger set -e on push events (empty PR text)
  grep -oE "$GOAL_PATTERN" <<< "${1:-}" | sort -u || true
}

diff_name_only() {
  local base_ref="${1:-}"

  if [[ -n "$base_ref" ]]; then
    git fetch origin "$base_ref" 2>/dev/null || true
    if git rev-parse "origin/${base_ref}" >/dev/null 2>&1; then
      git diff --name-only "origin/${base_ref}...HEAD" 2>/dev/null && return
    fi
  fi

  if [[ "${GITHUB_EVENT_NAME:-}" == "push" && -n "${GITHUB_EVENT_BEFORE:-}" ]]; then
    if git rev-parse "${GITHUB_EVENT_BEFORE}" >/dev/null 2>&1; then
      git diff --name-only "${GITHUB_EVENT_BEFORE}" HEAD 2>/dev/null && return
    fi
  fi

  git diff --name-only HEAD~1 HEAD 2>/dev/null || true
}

check_forbidden_files() {
  local base_ref="${1:-}"
  local files
  files="$(diff_name_only "$base_ref")"

  while IFS= read -r file; do
    [[ -z "$file" ]] && continue
    for pat in "${FORBIDDEN_PATH_PATTERNS[@]}"; do
      if echo "$file" | grep -qE "$pat"; then
        fail "Forbidden path in diff: $file (secrets/credentials must not be committed)"
      fi
    done
  done <<< "$files"

  info "Secret path scan: OK"
}

check_pr_goal_reference() {
  if [[ "${GITHUB_EVENT_NAME:-local}" != "pull_request" ]]; then
    info "PR goal reference check: skipped (not a pull_request event)"
    return 0
  fi

  local title="${PR_TITLE:-}"
  local body="${PR_BODY:-}"
  local combined="$title $body"

  if pr_has_bypass; then
    warn "PR uses governance bypass tag — OK for Agent OS / process-only changes"
    return 0
  fi

  if echo "$combined" | grep -qE "$GOAL_PATTERN"; then
    info "PR goal reference: OK"
    return 0
  fi

  fail "PR title or body must reference a goal (G-xxx) or use [governance] for process-only PRs"
}

check_pr_body_filled() {
  if [[ "${GITHUB_EVENT_NAME:-local}" != "pull_request" ]]; then
    info "PR body completeness: skipped (not a pull_request event)"
    return 0
  fi

  local title="${PR_TITLE:-}"
  local body="${PR_BODY:-}"
  local combined="$title $body"

  if pr_has_bypass; then
    info "PR body completeness: skipped (governance bypass)"
    return 0
  fi

  if [[ -z "${body//[[:space:]]/}" ]]; then
    fail "PR body is empty — fill .github/pull_request_template.md before opening"
    return 0
  fi

  if echo "$body" | grep -qE '<!--'; then
    fail "PR body still has HTML comment placeholders — fill Summary and Test plan"
  fi

  if echo "$body" | grep -qE 'G-___|\*\*G-xxx:\*\*|^- \*\*G-xxx:\*\*'; then
    fail "PR body still has template goal placeholder (G-___ or G-xxx) — set the real goal ID"
  fi

  if echo "$body" | grep -qF '_(Required — 1–3 sentences'; then
    fail "PR Summary is still the template placeholder — describe what changed"
  fi

  if echo "$body" | grep -qF '_(Required — commands run'; then
    fail "PR Test plan is still the template placeholder — list commands you ran"
  fi

  local summary_text
  summary_text="$(echo "$body" | awk '
    /^## Summary$/ { in_summary=1; next }
    /^## / { if (in_summary) exit }
    in_summary && $0 !~ /^[[:space:]]*$/ && $0 !~ /^<!--/ && $0 !~ /^_\(Required/ { print; exit }
  ')"

  if [[ -z "$summary_text" ]]; then
    fail "PR Summary section is empty — add 1–3 sentences under ## Summary"
  fi

  info "PR body completeness: OK"
}

check_commit_messages() {
  local base_ref="${1:-main}"
  local bypass="${2:-false}"

  if [[ "$bypass" == "true" ]]; then
    info "Commit message format check: skipped (governance bypass)"
    return 0
  fi

  git fetch origin "$base_ref" 2>/dev/null || true
  local range
  if git rev-parse "origin/${base_ref}" >/dev/null 2>&1; then
    range="origin/${base_ref}..HEAD"
  else
    range="HEAD~10..HEAD"
  fi

  local commits=0
  local bad=0

  while IFS= read -r subject; do
    [[ -z "$subject" ]] && continue
    commits=$((commits + 1))

    if echo "$subject" | grep -qE '^Merge '; then
      continue
    fi

    if echo "$subject" | grep -qE "$COMMIT_MSG_PATTERN"; then
      continue
    fi

    fail "Commit message must match 'G-xxx: description': $subject"
    bad=$((bad + 1))
  done < <(git log --format=%s "$range" 2>/dev/null || true)

  if [[ "$commits" -eq 0 ]]; then
    info "Commit message format: no commits in range (OK)"
  elif [[ "$bad" -eq 0 ]]; then
    info "Commit message format: OK ($commits commit(s))"
  fi
}

check_goals_in_backlog() {
  local combined="${1:-}"
  local goals
  goals="$(extract_goals "$combined")"

  [[ -z "$goals" ]] && return 0

  while IFS= read -r goal; do
    [[ -z "$goal" ]] && continue
    if [[ -f "docs/07-backlog/goals/${goal}.md" ]] && grep -qE "^# ${goal}([:—]| )" "docs/07-backlog/goals/${goal}.md" 2>/dev/null; then
      info "Backlog contains $goal (active file)"
    elif [[ -f "docs/07-backlog/goals/_archived/${goal}.md" ]] && grep -qE "^# ${goal}([:—]| )" "docs/07-backlog/goals/_archived/${goal}.md" 2>/dev/null; then
      info "Backlog contains $goal (archived)"
    elif grep -qE "### ${goal}([:—]| )" docs/07-backlog/goals.md 2>/dev/null; then
      info "Backlog contains $goal (dashboard)"
    else
      warn "Goal $goal referenced but not found in docs/07-backlog/goals/G-xxx.md or goals/_archived/"
    fi
  done <<< "$goals"
}

main() {
  local base_ref="${GITHUB_BASE_REF:-main}"
  local title="${PR_TITLE:-}"
  local body="${PR_BODY:-}"
  local combined="$title $body"
  local bypass="false"

  if pr_has_bypass; then
    bypass="true"
  fi

  info "Pcampus governance check (event=${GITHUB_EVENT_NAME:-local}, base=${base_ref})"
  check_forbidden_files "$base_ref"
  check_pr_goal_reference
  check_pr_body_filled
  check_commit_messages "$base_ref" "$bypass"
  check_goals_in_backlog "$combined"

  if [[ "$FAIL" -ne 0 ]]; then
    echo ""
    fail "Governance checks failed — see docs/06-workflows/github-governance.md"
    exit 1
  fi

  info "All governance checks passed."
}

main "$@"
