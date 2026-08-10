# Upgrade Pcampus Agent OS (existing projects)

> **For humans.** New projects use [bootstrap.sh](../../scripts/bootstrap.sh) instead.

When **Pcampus Agent OS** ships a new framework version, use a **two-phase upgrade** — mechanical sync plus AI semantic merge. One script alone cannot safely update project-specific files (`goals.md`, `AGENTS.md`).

## Two phases

```text
Phase 1 — Mechanical (script)          Phase 2 — Semantic (AI)
─────────────────────────────          ─────────────────────────
upgrade-os.sh --yes                    pcampus-upgrade-os skill
skills, rules, CI, _template.md   →    merge hybrid files per manifest
```

| Phase | Tool | Writes? |
|-------|------|---------|
| **Report** | `upgrade-os.sh --report` | No — drift checklist for agent |
| **1** | `upgrade-os.sh --yes` | Yes — framework paths only |
| **2** | `pcampus-upgrade-os` skill | Yes — hybrid files, surgical merge |

## Quick start

From a clone of the latest **Pcampus Agent OS**:

```bash
# 1. Drift report (give this to Cursor / agent)
./scripts/upgrade-os.sh /path/to/my-existing-app --report

# 2. Preview mechanical changes
./scripts/upgrade-os.sh /path/to/my-existing-app --dry-run

# 3. Mechanical sync (human approves)
./scripts/upgrade-os.sh /path/to/my-existing-app --yes

# 4. AI Phase 2 — in Cursor, attach pcampus-upgrade-os skill:
#    "อัปเกรด Agent OS สำหรับ /path/to/my-existing-app — ทำ Phase 2 merge"
```

Or from inside the target repo:

```bash
/path/to/pcampus-agent-os/scripts/upgrade-os.sh . --report
```

## Manifest

[framework-manifest.yml](../../framework-manifest.yml) defines:

- **overwrite** — Phase 1 paths (safe rsync)
- **merge** — Phase 2 hybrid files + strategy
- **never_touch** — product-owned paths
- **drift_checks** — what `--report` validates

## Phase 1 — overwritten (framework)

- `framework-manifest.yml`
- `.cursor/skills/pcampus-*/` (with `--delete` for removed skills)
- `.cursor/rules/` — `governance`, `security`, `core`, `guidelines`, `commits`, `testing`, `goal-execution`, `stack-*.example.mdc`
- `CLAUDE.md` — Claude / Antigravity PLAN overlay
- `.agents/` — Antigravity bridge (`agents.md`, `workflows/`, `skills/` symlinks → `.cursor/skills/`)
- `.github/workflows/`, PR template, `ci-config.example.yml`
- `scripts/ci/`, `scripts/bootstrap.sh`, `scripts/upgrade-os.sh`
- `scripts/dispatch-cursor.sh`, `scripts/dispatch-parallel.sh`
- `scripts/dispatch-mcp-server/index.js`, `package.json`, `README.md`
- `docs/04-agents/`, `docs/06-workflows/`, `design-spec.md`
- `docs/02-product/acceptance-template.md`, `docs/02-product/acceptance/`
- `docs/07-backlog/goals/_template.md`, `goals/_archived/README.md`

## Never touched (product)

- `code/`
- `docs/02-product/project-brief.md`, `mvp-scope.md`
- `docs/02-product/knowledge-map.json`, `knowledge-digest.md`, `assumptions.md`, `learning-log.md`, `os-health.md` — **product knowledge data**
- `docs/03-architecture/overview.md`, `api/`, `data/`
- `docs/05-decisions/` (your ADRs)
- `docs/07-backlog/goals.md` — **structure merged in Phase 2 only**
- `docs/07-backlog/goals/G-*.md`, `goals/_archived/G-*.md`
- `docs/07-backlog/changelog-goals.md`
- `AGENTS.md`, `README.md`, `docs/00-index.md` — **merged in Phase 2**
- `.github/ci-config.yml`
- `.cursor/rules/{stack}.mdc` (non-example)
- `.cursor/skills/{project}-*/`

## Created only if missing (`--ignore-existing` — never overwrites product data)

Phase 1 creates these when absent; **does not** replace files that already exist:

- `docs/00-project-snapshot.md`
- `docs/07-backlog/changelog.md`
- `docs/02-product/knowledge-digest.md`
- `docs/02-product/knowledge-map.json` — empty graph scaffold
- `docs/02-product/assumptions.md`
- `docs/02-product/learning-log.md`
- `docs/02-product/os-health.md`

## Synced every upgrade (framework contract — safe to overwrite)

- `docs/02-product/knowledge-map.schema.json`
- `docs/02-product/knowledge-map.README.md`

**Split:** `knowledge-map.json` = **product data** (`never_touch`). Schema/README = **framework** (Phase 1 sync).

If an existing `knowledge-map.json` predates `os_health` or other keys, Phase 2 agent merges **missing keys only** from OS template — do not wipe project nodes.

## Phase 2 — AI merge (hybrid files)

Agent follows [pcampus-upgrade-os](../../.cursor/skills/pcampus-upgrade-os/SKILL.md) + manifest `merge:` section:

| File | Keep local | Merge from OS |
|------|------------|---------------|
| `AGENTS.md` | mission, `{TEST_COMMANDS}` | governance, skills table, CI |
| `goals.md` | Dashboard, queue, archived rows | Layout, status flow, create/close, legend |
| `00-index.md` | project status | doc map |
| `README.md` | project setup | upgrade workflow |

Legacy `goals/_archive/` → rename to `_archived/` (paths only; do not edit goal content).

## Recommended goal

```markdown
### G-xxx: Upgrade Pcampus Agent OS

**In:** --report, Phase 1 --yes, Phase 2 AI merge, governance-check
**Out:** feature code, active goal content changes
**Touch map:** framework paths + AGENTS.md + goals.md structure
```

## Version tracking

After Phase 1, target gets `.pcampus-os-version` (OS git tag/commit + timestamp).

## Post-sync setup (after Phase 1)

หลัง `upgrade-os.sh --yes` เสร็จ ต้องทำ 2 อย่าง:

```bash
# 1. Install MCP server dependencies
cd scripts/dispatch-mcp-server && npm install

# 2. Register MCP server กับ Claude Desktop
# เพิ่มใน ~/Library/Application Support/Claude/claude_desktop_config.json:
# {
#   "mcpServers": {
#     "pcampus-dispatch": {
#       "command": "node",
#       "args": ["/path/to/project/scripts/dispatch-mcp-server/index.js"],
#       "env": { "PATH": "~/.local/bin:/usr/local/bin:/usr/bin:/bin" }
#     }
#   }
# }
```

ดูรายละเอียด: [cursor-dispatch.md](cursor-dispatch.md) · [dispatch-mcp-server/README.md](../../scripts/dispatch-mcp-server/README.md)

---

## Related

- [pcampus-upgrade-os skill](../../.cursor/skills/pcampus-upgrade-os/SKILL.md)
- [framework-manifest.yml](../../framework-manifest.yml)
- [github-governance.md](github-governance.md)
- [team-workflow.md](team-workflow.md)
- [cursor-dispatch.md](cursor-dispatch.md)
- [../../scripts/bootstrap.sh](../../scripts/bootstrap.sh)
- [../../scripts/upgrade-os.sh](../../scripts/upgrade-os.sh)
