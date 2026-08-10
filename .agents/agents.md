# Antigravity agent index — @pcampus/ui

Thin bridge for Google Antigravity. **Canonical sources:**

| File | Purpose |
|------|---------|
| [roles.md](roles.md) | Organizational constitution — 3 roles, boundaries, replaceable test |
| [prompts.md](prompts.md) | Prompt patterns — role calibration, discovery, review, governance |
| [product.md](product.md) | What lives here, consumers, 4-tier system, promotion process |
| [design.md](design.md) | Visual foundation — token conventions, patterns, what stays in Cockpit |
| [engineering.md](engineering.md) | Stack, component API standards, export rules, hard rules |
| [review.md](review.md) | 6-stage publish gate before any component ships |
| [../AGENTS.md](../AGENTS.md) | Shared entry — workflow, governance, skills catalog |
| [../CLAUDE.md](../CLAUDE.md) | Claude role — PLAN / architecture / ADR |
| [../.cursor/rules/](../.cursor/rules/) | Always-on constraints (read when planning) |
| [../docs/01-vision.md](../docs/01-vision.md) | Why this library exists — north star |
| [../docs/03-architecture/design-tokens.md](../docs/03-architecture/design-tokens.md) | Full `--pcampus-*` token reference — implement in `src/tokens/index.css` |
| [../docs/](../docs/) | Specs, goals, ADR, architecture |

## Multi-agent roles

| Agent | Primary phases | Writes | Dispatch channel |
|-------|----------------|--------|------------------|
| **Claude** (this overlay) | DEFINE, PLAN | ADR, arch impact, `.bundle/G-xxx/shared-memory.yaml` → `architecture:` | MCP tools → `dispatch_cursor` / `write_architecture_handoff` |
| **Antigravity** | ORCHESTRATE | `.bundle/` bundles, dispatch logs | `run_command(dispatch-cursor.sh)` |
| **Cursor** | EXECUTE, REVIEW, SHIP | `code/`, goal status, `shared-memory.yaml` → `execution:` | Receives via `agent --cwd ... -p "..."` |

**Dispatch flow:**
```
Claude ──(MCP: dispatch_cursor)──► dispatch-mcp-server ──► dispatch-cursor.sh ──► cursor-agent CLI ──► Cursor
   └──(MCP: write_architecture_handoff, dispatch_after=True)──► same flow
```

See [../docs/03-architecture/coordination.md](../docs/03-architecture/coordination.md) · [../docs/06-workflows/cursor-dispatch.md](../docs/06-workflows/cursor-dispatch.md)

## Skills

Modular playbooks live in [skills/](skills/) as symlinks to [../.cursor/skills/pcampus-*/](../.cursor/skills/) — **do not edit copies here**; change canonical `SKILL.md` only.

Catalog: [../docs/04-agents/skills-library.md](../docs/04-agents/skills-library.md)

## Workflows

| Command | File |
|---------|------|
| `/arch-review` | [workflows/arch-review.md](workflows/arch-review.md) |
