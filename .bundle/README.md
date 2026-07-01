# Execution bundles + shared memory (runtime)

Compiled by **Context Compiler**. IR cached; **shared-memory.yaml** = multi-agent handoff.

- [context-compiler.md](../docs/03-architecture/context-compiler.md)
- [compiler-ir.md](../docs/03-architecture/compiler-ir.md)
- [coordination.md](../docs/03-architecture/coordination.md)
- [working-memory.md](../docs/03-architecture/working-memory.md)

```text
.bundle/G-001/
  shared-memory.yaml           # Claude arch → Cursor exec → QA verify
  cache/G-001-a82f1c/          # IR (action-step-N.yaml)
  delta.md
```

| Session | Read |
|---------|------|
| เริ่ม step N | step-N + action + init shared-memory.execution |
| continue | shared-memory + delta |

Selection: ORG → PB → REC → IR. No replan. No copy-paste between agents.
