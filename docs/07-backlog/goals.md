# Goal backlog

> **1 goal = 1 file = 1 outcome.** Pick **one** `ready` goal per dev round. Goals in **`draft`** / **`planned`** are spec-only — do not implement until promoted to `ready`.

## Dashboard

| Goal | Title | Status | Phase | Depends on |
|------|-------|--------|-------|------------|
|G-001 | Package scaffold — code/ setup  | done | SHIP | — |
|G-002 | Tokens — CSS custom properties + JS exports  | done | SHIP | G-001 |
|G-003 | Core primitives — Button, Badge, Avatar, Spinner, Skeleton  | done | SHIP | G-002 |
|G-004 | Form controls — Input, Select, Checkbox, Radio, Toggle  | done | SHIP | G-002 |
|G-005 | Overlays — Modal, Toast, Tooltip, Popover, Dropdown  | done | SHIP | G-003 |
|G-006 | Layout shell — AppShell, SnapshotPanel, SplitPanel, ThemeProvider  | done | SHIP | G-003, G-005 |
|G-007 | npm publish — GitHub Packages setup  | done | SHIP | G-001 |

---

## Layout

| Location | Purpose |
|----------|---------|
| [`goals/G-xxx.md`](goals/_template.md) | Active goal — one file per goal |
| [`goals/_archived/`](goals/_archived/) | Completed goals (`done`) — moved here on close |
| [`goals/_template.md`](goals/_template.md) | Copy when creating a new goal |
| [changelog-goals.md](changelog-goals.md) | Completion log (date, commit, summary) |

**Agent rule:** Only execute **`ready`** goals. Never self-start. Never mark **`done`** without human **`approved`**. On close → set `done`, move file to `goals/_archived/`, update **Dashboard** and this index.

## Status flow

```text
draft → ready → in_progress → review → approved → done → goals/_archived/
              ↘ blocked ↗
```

| Collaboration phase | Goal status |
|---------------|-------------|
| DEFINE | `draft`, `planned` |
| PLAN | `ready` (waiting for command trigger **"ทำ G-xxx"**) |
| EXECUTE | `in_progress` |
| REVIEW | `review`, `approved` |
| SHIP | `done` → archived |

Alias in goal Plan tables: **Pcampus phase** = collaboration phase (DEFINE–SHIP subset). Full cycle includes IMPROVE. See [design-spec.md](../03-architecture/design-spec.md) §8.

## Active queue

| Goal | Goal status | Collaboration phase | Depends on | File |
|------|--------|-------|------------|------|
|G-001 | done | SHIP | — | [goals/G-001.md](goals/G-001.md) |
|G-002 | done | SHIP | G-001 | [goals/G-002.md](goals/G-002.md) |
|G-003 | done | SHIP | G-002 | [goals/G-003.md](goals/G-003.md) |
|G-004 | done | SHIP | G-002 | [goals/G-004.md](goals/G-004.md) |
|G-005 | done | SHIP | G-003 | [goals/G-005.md](goals/G-005.md) |
|G-006 | done | SHIP | G-003, G-005 | [goals/G-006.md](goals/G-006.md) |
|G-007 | done | SHIP | G-001 | [goals/G-007.md](goals/G-007.md) |

## Archived

Completed goals: [`goals/_archived/`](goals/_archived/) · log: [changelog-goals.md](changelog-goals.md)

| Goal | Title | Closed | File |
|------|-------|--------|------|
| *(none yet)* | — | — | — |

## Create a goal

1. Assign next **G-xxx** ID (start at **G-001** for a new project)
2. Copy [`goals/_template.md`](goals/_template.md) → `goals/G-xxx.md` — see [goal-spec-guide.md](../06-workflows/goal-spec-guide.md)
3. Fill **Plan**, **In**, **Out**, **Touch map**, **Acceptance criteria**, **Test plan**, **Depends on**
4. Add a row to **Active queue** and **Dashboard** above
5. When promoting to `ready`, create `docs/02-product/acceptance/G-xxx.md` from [acceptance/_template.md](../02-product/acceptance/_template.md)
6. Tell human: say **"ทำ G-xxx"** when approved

## Close a goal

1. Acceptance criteria `[x]` in `goals/G-xxx.md`; all plan steps `done`
2. Status → **`done`** (only from **`approved`**)
3. **Move** `goals/G-xxx.md` → `goals/_archived/G-xxx.md`
4. Remove row from **Dashboard** and **Active queue**; goal remains in [changelog-goals.md](changelog-goals.md)
5. Append audit row to [changelog.md](changelog.md) if needed

## Plan legend

Update the **Dashboard** and **Plan** table when status or step changes.

| Symbol | Meaning |
|--------|---------|
| **●** | Current step / collaboration phase |
| ○ | Pending |
| ✓ | Done |
| ⏸ | Blocked |
