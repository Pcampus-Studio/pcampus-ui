# Workflow: /arch-review

When the user types **`/arch-review`** (optionally with `ADR-xxx` or `G-xxx`):

1. Read [../../AGENTS.md](../../AGENTS.md) and [../../CLAUDE.md](../../CLAUDE.md).
2. Execute [../../.cursor/skills/pcampus-architecture-governance/SKILL.md](../../.cursor/skills/pcampus-architecture-governance/SKILL.md) end to end.
3. Load linked goal (`docs/07-backlog/goals/G-xxx.md`) or ADR (`docs/05-decisions/`) from user input.
4. Produce an **Architecture Impact Report** in chat (or append to ADR if user asked to update docs).
5. If decisions are ready for implementation, patch `.bundle/G-xxx/shared-memory.yaml`:

```yaml
architecture:
  author: claude
  summary: "<one line>"
  decisions: []
  adr: ADR-xxx
```

6. Stop — do **not** edit `code/`. Tell the human to hand off to Cursor: **compile G-xxx** then **เริ่ม step 1**.

If scope is discovery-only (no ADR yet), route to [../../.cursor/skills/pcampus-discovery/SKILL.md](../../.cursor/skills/pcampus-discovery/SKILL.md) first.
