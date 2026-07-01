# OS Evolution — release notes for the OS

> **Not code changelog** — how the **framework** improved between versions, measured on real projects.  
> Compare: [os-benchmark.md](os-benchmark.md) aggregates · Source: [framework-manifest.yml](../../framework-manifest.yml) `version`

---

## Purpose

```text
v1.12 → v1.13

Compile tokens     -31%
Human interruptions -22%
Acceptance         +4%
Recipe reuse       +18%
```

Decisions from **data**, not feel.

---

## Evolution entry template

Add a row when bumping `framework-manifest.yml` after **validated usage** evidence:

```markdown
## v1.14.0 — YYYY-MM-DD

**Evidence:** G-003..G-007 (reference implementation project)

| Metric | v1.13 avg | v1.14 avg | Δ |
|--------|-----------|-----------|---|
| Bundle tokens | 2100 | 1450 | -31% |
| Continue tokens | 340 | 210 | -38% |
| Human interruptions | 2.1/goal | 1.6/goal | -24% |
| Acceptance pass | 91% | 95% | +4pp |
| Recipe reuse | 52% | 68% | +16pp |

**Shipped:** shared-memory handoff spec, os benchmark schema  
**Tuned:** capability matrix cursor.rest_api 0.93→0.95  
**Not changed:** Core invariants
```

Do not name consumer products in this file — use goal IDs and metric deltas only.

---

## What to include

| Include | Skip |
|---------|------|
| Benchmark deltas from validated projects | Code-only refactors |
| Recipe/playbook changes with stats | Internal doc typos |
| Threshold tuning (_extensions) | Speculative features |
| Regression (metric got worse) | Marketing language |

---

## Process

1. Run goals on a consumer project with the new OS version
2. Compare `os_benchmark` rollup to previous version window
3. Append section to this file + brief note in [changelog-goals.md](../07-backlog/changelog-goals.md)
4. Bump `framework-manifest.yml`

---

## History

| Version | Date | Headline |
|---------|------|----------|
| 1.13.0 | 2026-06-27 | Coordination — playbooks, capability IR, shared memory spec |
| 1.12.0 | 2026-06-27 | Context compiler — recipes, working memory |
| 1.10.0 | 2026-06-27 | Context resolver / compile pipeline |

*(Fill metric deltas when benchmark data from production use exists.)*

---

## Related

- [platform-consumer rule](../../.cursor/rules/platform-consumer.mdc)
- [reference-implementation.md](../06-workflows/reference-implementation.md)
- [os-health.md](os-health.md)
