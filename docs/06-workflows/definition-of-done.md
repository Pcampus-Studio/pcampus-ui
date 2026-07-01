# Definition of done

A goal is **done** only when all items below pass **and** status is **`approved`** with human sign-off.

## Per-goal checklist (copy into goal or acceptance contract)

```markdown
## G-xxx DoD

- [ ] Feature implemented within **In** scope and **Touch map**
- [ ] Acceptance contract scenarios verified (if `docs/02-product/acceptance/G-xxx.md` exists)
- [ ] Tests passing (goal **Test plan** + AGENTS.md standard commands)
- [ ] No lint / analyzer errors
- [ ] Docs updated (API, data, ADR if architectural)
- [ ] Acceptance criteria in goals.md checked `[x]`
- [ ] pcampus-code-review checklist passed
- [ ] Human approved → status `approved`
- [ ] Changelog entries written
```

## Code

- [ ] All **acceptance criteria** in the goal are met
- [ ] Acceptance contract scenarios pass (when present)
- [ ] Changes stay within goal **In** scope and **Touch map**
- [ ] No commented-out dead code or debug prints left behind
- [ ] Public APIs / schemas updated in `docs/03-architecture/api/` if changed
- [ ] Domain rules updated in `docs/03-architecture/data/` if changed
- [ ] ADR written or linked for architectural decisions

## Quality

- [ ] [pcampus-testing](../../.cursor/skills/pcampus-testing/SKILL.md) — test/lint commands pass
- [ ] New behavior has tests where logic is non-trivial
- [ ] [pcampus-code-review](../../.cursor/skills/pcampus-code-review/SKILL.md) checklist passed (all review lenses)

## Process

- [ ] Goal status flow: `in_progress` → `review` → `approved` → `done`
- [ ] One commit (or agreed split) referencing `G-xxx`
- [ ] Goal status `done` in [../07-backlog/goals.md](../07-backlog/goals.md)
- [ ] Entry in [../07-backlog/changelog-goals.md](../07-backlog/changelog-goals.md)
- [ ] Audit row in [../07-backlog/changelog.md](../07-backlog/changelog.md) (significant sessions)

## Ship (deploy goals only)

- [ ] [pcampus-deploy-staging](../../.cursor/skills/pcampus-deploy-staging/SKILL.md) pre-deploy checklist complete
- [ ] Staging smoke tests pass
- [ ] Human confirmed deploy outcome
- [ ] Rollback path documented if deploy failed

## Product (if user-facing)

- [ ] Copy and UX reviewed against product brief / design docs
- [ ] Security and privacy constraints respected

## Not required every goal

- Full E2E (unless goal says so)
- README marketing updates
- Production deploy (unless goal explicitly includes it)

## Related

- [dev-loop.md](dev-loop.md)
- [../02-product/acceptance-template.md](../02-product/acceptance-template.md)
- [github-governance.md](github-governance.md)
- [../02-product/acceptance/README.md](../02-product/acceptance/README.md)
- [../04-agents/skills-library.md](../04-agents/skills-library.md)
- [../../.cursor/rules/governance.mdc](../../.cursor/rules/governance.mdc)
