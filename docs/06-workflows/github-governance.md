# GitHub governance — hard guards

> **For humans.** Soft guards live in `.cursor/rules/governance.mdc`. This doc wires **GitHub** to enforce them.

## What ships in Agent OS

| Asset | Purpose |
|-------|---------|
| [.github/workflows/governance.yml](../../.github/workflows/governance.yml) | PR goal reference, commit format, secret path scan |
| [.github/workflows/ci.yml](../../.github/workflows/ci.yml) | App test/lint from `ci-config.yml` |
| [.github/pull_request_template.md](../../.github/pull_request_template.md) | Human + agent PR checklist |
| [scripts/ci/governance-check.sh](../../scripts/ci/governance-check.sh) | Runnable locally |
| [scripts/ci/app-ci.sh](../../scripts/ci/app-ci.sh) | App CI runner |
| [.github/ci-config.example.yml](../../.github/ci-config.example.yml) | Stack commands (copy at G-001) |

## Setup after bootstrap

### 1. App CI (G-001)

```bash
cp .github/ci-config.example.yml .github/ci-config.yml
# Edit test: and lint: for your stack
```

Align commands with `AGENTS.md` **Standard commands**.

### 2. Protected branches (GitHub UI)

**Settings → Branches → Add branch protection rule** for `main`:

| Setting | Recommended |
|---------|-------------|
| Require pull request before merging | ✅ |
| Require approvals | ✅ (≥ 1) |
| Require status checks | ✅ |
| Required checks | `Governance / Goal & secret guardrails`, `CI / Test & lint` |
| Do not allow bypassing | ✅ |
| Restrict who can push | ✅ (humans only — not bots/agents) |

Agents create PRs; **humans merge**.

### 3. Optional: rulesets (GitHub Enterprise / public repos)

Use repository rulesets to block direct pushes and require signed commits if your org policy needs it.

## CI rules

### Pull requests

1. **Title or body** must contain `G-xxx` (e.g. `G-003`)
2. **Body must be filled** — not the raw template (CI rejects `G-___`, HTML comments `<!--`, empty Summary / Test plan)
3. **Commit messages** must match `G-xxx: imperative description`
4. **No forbidden paths** in diff (`.env`, `*.pem`, `credentials.json`, …)

**Bypass:** Process-only PRs (Agent OS / governance docs) — add `[governance]` to the PR title.

### Push to main

- Secret path scan on changed files
- Commit message format on commits in push range

## Run locally

```bash
# Simulate PR checks (set env vars as needed)
PR_TITLE="G-003: add health endpoint" PR_BODY="Closes G-003" \
  GITHUB_EVENT_NAME=pull_request GITHUB_BASE_REF=main \
  bash scripts/ci/governance-check.sh

bash scripts/ci/app-ci.sh
```

## Operating mode: Incident

During incidents, human may authorize emergency merge under **Operating mode: Incident**. Prefer:

1. Human merges with explicit approval
2. Log in [changelog.md](../07-backlog/changelog.md)
3. Follow [pcampus-incident-response](../../.cursor/skills/pcampus-incident-response/SKILL.md)

Do not disable branch protection permanently for convenience.

## Related

- [upgrade-agent-os.md](upgrade-agent-os.md) — sync framework into existing repos
- [governance.mdc](../../.cursor/rules/governance.mdc)
- [team-workflow.md](team-workflow.md)
- [definition-of-done.md](definition-of-done.md)
