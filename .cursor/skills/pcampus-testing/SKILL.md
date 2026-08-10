---
name: pcampus-testing
version: "1.0.0"
description: >-
  Pcampus testing procedure for unit and integration tests. Use when adding
  tests, fixing test failures, or when a goal test plan requires new coverage.
---

# Testing procedure

## When to test

- Every goal before marking `done`
- After any fix for failing CI or local tests
- When logic is non-trivial (not for trivial constants or config-only changes)

## Commands

Run from repo root using commands in `AGENTS.md` **Standard commands** and the goal **Test plan**.

Typical pattern:

```bash
cd code && {test command}
cd code && {lint/analyze command}
```

Fill stack-specific commands at project bootstrap.

## What to test

| Layer | Focus |
|-------|--------|
| **Unit** | Business logic, validators, pure functions |
| **Integration** | API handlers, DB access, external adapters (mocked) |
| **E2E** | Only when goal **Test plan** explicitly requires it |

**Test behavior, not implementation details.** Avoid tests that only assert constants.

## Adding tests

1. Place tests per [folder-structure.md](../../../docs/03-architecture/folder-structure.md) under `code/`
2. Name tests after behavior: `returns_404_when_user_not_found`
3. Cover happy path + primary failure modes from acceptance criteria
4. No flaky timing; mock external services

## Failure loop

```text
Run tests → fail → fix smallest cause → re-run full test plan → pass
```

Do not mark goal `done` while any test or analyzer command fails.

## Related

- [testing.mdc](../../rules/testing.mdc)
- [definition-of-done.md](../../../docs/06-workflows/definition-of-done.md)
- [pcampus-rest-api](../pcampus-rest-api/SKILL.md) — API test minimums
