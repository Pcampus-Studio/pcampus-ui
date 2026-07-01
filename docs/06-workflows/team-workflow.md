# Team workflow — goal-driven development with AI agents

> **For humans.** AI agents: read [AGENTS.md](../../AGENTS.md) and [dev-loop.md](dev-loop.md).

This document explains how **Pcampus Studio** runs every project with Cursor agents — goals, rules, and versioned skills so Human + Agent collaboration stays scoped and reviewable.

Framework reference: [design-spec.md](../03-architecture/design-spec.md) · Collaboration cycle: [team-workflow.md](team-workflow.md)

---

## 1. Human + Agent cycle (6 phases)

```mermaid
flowchart TB
  subgraph human["Human"]
    H1["Define goal"]
    H2["Make decision"]
    H3["Review & improve"]
    H4["Ensure quality"]
    H5["Own outcome / SHIP"]
  end

  subgraph agent["AI Agent"]
    A1["Understand context"]
    A2["Plan & execute"]
    A3["Generate & modify"]
    A4["Test & validate"]
    A5["Report & learn"]
  end

  D["DEFINE"] --> P["PLAN"] --> E["EXECUTE"] --> R["REVIEW"] --> I["IMPROVE"] --> S["SHIP"]
  D --- H1 & A1
  P --- H2 & A2
  E --- A3
  R --- H3 & A5
  I --- H4 & A4
  S --- H5 & A5
  S --> D
```

| Collaboration phase | Human | Agent | Docs / skills |
|-------|-------|-------|---------------|
| DEFINE | Scope, priority, discovery | Interview → evidence → map → PDR | `knowledge-map.json`, `knowledge-digest`, `assumptions`, brief, mvp-scope | `pcampus-discovery` |
| PLAN | ADR, goal breakdown | Confirm scope | `pcampus-goal-workflow` |
| EXECUTE | — | Code in touch map | `pcampus-rest-api`, `pcampus-db-migration`, … |
| REVIEW | Approve / request changes | Report diff | `pcampus-code-review` |
| IMPROVE | Quality bar | Run tests | `pcampus-testing`, DoD |
| SHIP | Approve deploy | Prepare staging | `pcampus-deploy-staging` |

---

## 2. Big picture — where everything lives

```mermaid
flowchart TB
  subgraph humanTeam["Team (humans)"]
    PO["PO / Lead<br/>brief, scope, goals"]
    Dev["Developer<br/>prompt, review, commit"]
  end

  subgraph docsLayer["docs — source of truth"]
    Brief["02-product/"]
    API["03-architecture/api/"]
    Data["03-architecture/data/"]
    GoalsFile["07-backlog/goals.md"]
    ADR["05-decisions/"]
    DoDNode["definition-of-done.md"]
  end

  subgraph agentLayers["Cursor agent layers"]
    Rules[".cursor/rules/\ngovernance + security"]
    Skills[".cursor/skills/pcampus-*/"]
    AgentsMD["AGENTS.md"]
  end

  PO --> Brief
  PO --> GoalsFile
  Dev -->|"ทำ G-xxx"| AgentsMD
  AgentsMD --> Rules
  AgentsMD --> GoalsFile
  AgentsMD --> Skills
  Skills --> API
  Skills --> Data
  GoalsFile --> DoDNode
  ADR --> Skills
```

| Layer | Who writes it | Who consumes it |
|-------|---------------|-----------------|
| `docs/02-product/` | PO / lead | Everyone + agent |
| `docs/03-architecture/api/`, `data/` | Dev + agent (per goal) | Everyone + agent |
| `docs/07-backlog/goals.md` | Planner | Agent picks **one** `ready` goal |
| `docs/05-decisions/` | Tech lead | Agent when linked in goal |
| `.cursor/rules/` | Pcampus Agent OS + stack | Agent always |
| `.cursor/skills/pcampus-*/` | Pcampus Agent OS | Agent when task matches |
| `AGENTS.md` | Bootstrap customize | Agent first read |

---

## 3. Goal lifecycle

```mermaid
stateDiagram-v2
  [*] --> draft: PO drafts goal\nspec only
  draft --> ready: Dependencies done\nacceptance contract clear
  ready --> in_progress: Dev assigns\n"ทำ G-xxx"
  in_progress --> review: Tests green\nimplementation complete
  review --> approved: Human approves\ncode-review skill
  review --> in_progress: Changes requested
  review --> blocked: External blocker
  approved --> done: Commit + changelog\n(if applicable)
  in_progress --> blocked: Blocked
  blocked --> ready: Unblocked
  done --> [*]

  note right of draft
    Agent must NOT implement
  end note
  note right of ready
    Agent may pick when human starts
  end note
  note right of review
    Agent reports — no new features
  end note
  note right of approved
    Human signed off — may commit
  end note
```

---

## 4. One dev round (one goal)

```mermaid
flowchart LR
  A["1. Pick goal\nready"] --> B["2. Confirm scope"]
  B --> C["3. Execute\n+ skill"]
  C --> D["4. Test"]
  D --> E{"Pass?"}
  E -->|No| C
  E -->|Yes| F["5. Review\nstatus → review\ncode-review skill"]
  F --> F2{"Human\napproves?"}
  F2 -->|No| C
  F2 -->|Yes| F3["status → approved"]
  F3 --> G["6. Commit\nif user asks"]
  G --> H["7. Close goal"]
  H --> I{"SHIP goal?"}
  I -->|Yes| J["8. Deploy staging\nhuman approves"]
  I -->|No| K["Done"]
  J --> K
```

**Rule:** One goal ≈ one commit ≈ one reviewable PR slice.

---

## 5. Roles in one session

```mermaid
flowchart TB
  subgraph Planner["Planner"]
    P1["Write brief & mvp-scope"]
    P2["Break into G-001…"]
    P3["Set planned / ready"]
  end

  subgraph Implementer["Implementer (agent + dev)"]
    I1["Read active goal + skill"]
    I2["Code in touch map"]
  end

  subgraph Tester["Tester"]
    T1["pcampus-testing"]
    T2["Fix until green"]
  end

  subgraph Reviewer["Reviewer (human)"]
    R1["pcampus-code-review"]
    R2["Approve commit"]
  end

  subgraph Shipper["Shipper (human-led)"]
    S1["Approve staging deploy"]
    S2["Smoke test"]
  end

  Planner --> Implementer --> Tester --> Reviewer
  Reviewer --> Shipper
```

Same person can wear all hats — the **documents and skills** keep roles explicit.

---

## 6. How to talk to the agent

```mermaid
flowchart TD
  Start(["Developer opens Cursor"]) --> Read["Agent reads AGENTS.md\n+ active goal + skill"]
  Read --> Good{"Clear G-xxx?"}
  Good -->|Yes| Work["Implement goal"]
  Good -->|No| Vague{"Vague request?"}
  Vague -->|Yes| Stop["Stop — ask goal ID\nor draft planned goal"]
  Vague -->|No| Pick["Pick next ready goal"]
  Work --> Test["pcampus-testing"]
  Test --> Review["pcampus-code-review"]
  Review --> Commit{"User says commit?"}
  Commit -->|Yes| Done["G-xxx commit + close"]
  Commit -->|No| Wait["Wait for user"]
```

### Prompt cheat sheet

| ✅ Good | ❌ Avoid |
|---------|----------|
| discover — เริ่มสัมภาษณ์ Step 1 | ทำแอปให้เสร็จ (ไม่มี goal) |
| os health | OS KPI dashboard |
| trace G-xxx | Traceability % |
| pattern search | auto-accept ADR จาก pattern โดยไม่มี E-xxx |
| intake change — {อธิบายการเปลี่ยน} | promote goal ready โดยไม่ audit |
| ทำ G-005 ตาม goals.md | brief G-005 สับสนกับ discover |
| review diff G-005 | merge ให้เลย |
| approve G-005 | agent ปิด done เอง |
| deploy staging ตาม G-010 | deploy prod เอง |
| ต่อ goal ready ถัดไป | refactor ทั้ง repo |
| commit G-005 | commit ทุกอย่างที่แก้ |

### Bootstrap prompts (new project)

**Discovery (no code yet):**

```
discover
อ่าน pcampus-discovery skill และ knowledge-loop.md
เริ่ม Step 1 — Business — ถามทีละ step
บันทึก Evidence (E-xxx) + sync knowledge-map.json และ knowledge-digest.md
ยังไม่เขียน production code ยังไม่ promote goals เป็น ready
```

**Planner (after discovery locked):**

```
อ่าน AGENTS.md, project-brief.md, mvp-scope.md, knowledge-digest.md
ช่วยแตก goals G-001… (planned) — บันทึก PDR สำหรับการตัด scope ที่ตัดไปแล้ว
ยังไม่เขียน production code
```

**First implementation:**

```
อ่าน AGENTS.md แล้วทำ G-001 ตาม goals.md
ใช้ pcampus-testing + pcampus-code-review ก่อนปิด goal
อย่า commit จนกว่าฉันจะสั่ง
```

---

## 7. Standard skills (always available)

See [skills-library.md](../04-agents/skills-library.md) for versions and changelog.

| Skill | Command triggers |
|-------|---------|
| `pcampus-learning-loop` | `observe`, `learn`, `post-ship G-xxx` |
| `pcampus-discovery` | `discover`, `coverage`, `trace G-xxx`, `pattern search`, change intake |
| `pcampus-goal-workflow` | Any G-xxx work |
| `pcampus-rest-api` | API endpoints |
| `pcampus-testing` | Tests |
| `pcampus-code-review` | Before done / PR |
| `pcampus-deploy-staging` | SHIP / staging |
| `pcampus-incident-response` | Incidents |
| `pcampus-db-migration` | Schema changes |

## GitHub hard guards

See [github-governance.md](../06-workflows/github-governance.md) — PR template, governance CI, protected branches.

Add `{project}-*` skills only for conventions unique to one product.

---

## Related

- [dev-loop.md](dev-loop.md)
- [definition-of-done.md](definition-of-done.md)
- [../07-backlog/changelog.md](../07-backlog/changelog.md) — audit trail
- [github-governance.md](github-governance.md)
- [../04-agents/dev-roles.md](../04-agents/dev-roles.md)
- [../04-agents/skills-library.md](../04-agents/skills-library.md)
- [../07-backlog/goals.md](../07-backlog/goals.md)
- [../../AGENTS.md](../../AGENTS.md)
