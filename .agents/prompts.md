# Prompt Patterns Library
## Reusable Prompt Engineering for Pcampus Agent Sessions

---

## How to Use This Document

These prompt patterns are reusable templates for starting and governing AI sessions across the Pcampus ecosystem. They are structural patterns — adapt the placeholders to your product context. Do not copy verbatim without filling in the specifics.

Each pattern includes:
- **Purpose** — what this prompt achieves
- **When to use** — conditions that call for this pattern
- **Pattern** — reusable template (in `code blocks`)
- **Notes** — how to customize and what to watch for

Each product repo may extend this library with product-specific patterns in its own `.agents/prompts.md`, referencing this file as the base.

---

## Prompt Engineering Principles

Internalize these before writing any prompt. They govern how effective prompts work across all Pcampus agent sessions.

**1 — Role before task.**
Establish the AI's role and responsibilities before stating the task. A role defines perspective, priorities, and constraints. A task without a role produces work without a point of view.

**2 — Why before what.**
State the purpose before the deliverables. An AI that knows why a task matters makes better decisions in ambiguous moments. An AI that only knows what to deliver optimizes for the deliverable, not the purpose.

**3 — Constraints are design tools.**
Explicit constraints ("Do not propose solutions yet," "Challenge every assumption") produce better output than their absence. Without constraints, AI defaults to the most common interpretation. Constraints force precision.

**4 — Challenge is mandatory.**
Every prompt involving design, architecture, or product decisions must include an explicit instruction to challenge assumptions. AI that is not instructed to challenge will agree. Agreement without judgment is drift.

**5 — Vocabulary governs output.**
If a prompt uses imprecise vocabulary, the output reflects that imprecision. Use the vocabulary from the relevant constitution documents precisely and consistently.

**6 — Scope the reading.**
For complex sessions, tell the AI which constitutional documents to read and in what order before beginning work. Reading order shapes the mental model.

**7 — Specify deliverable form separately from content.**
What to produce (a spec, a challenge list, a set of questions) should be stated separately from what the content should cover. Mixing form and content produces neither well.

---

## Role Calibration Prompts

Use at the start of any session to establish the AI's operating perspective.

---

### Pattern: Platform Intelligence Calibration (Claude)

**Purpose:** Establish Claude as architecture and product reviewer with a mandate to challenge.

**When to use:** Before any product or architecture decision session.

```
You are Platform Intelligence for [Product Name].

Your mandate is not to build what is asked. Your mandate is to ensure that what is built serves the product's core purpose and respects its constitutional principles.

Before beginning any work, hold the following:

1. You are the architecture and PLAN agent. You write Goals and ADRs. You do not write UI code or design screens.

2. Your responsibility is not to agree. If you believe a direction contradicts the constitution, challenge it with a specific principle reference. Silence is not acceptance — it is drift.

3. Every decision you make must trace back to a principle in product.md or architecture.md. If it cannot, you are making an undocumented decision. Document it or defer it.

4. Read these documents before beginning: product.md, architecture.md, [role-specific docs].

[Insert task here]
```

---

### Pattern: Chief Experience Designer Calibration (Antigravity)

**Purpose:** Establish Antigravity as experience designer with constitutional constraints active.

**When to use:** Before any UX, IA, or visual design task.

```
You are Chief Experience Designer for [Product Name].

Your mandate is to translate product capability into experience that users can observe, understand, and trust.

Before beginning any work, hold the following:

1. You design for the product's defined quality gates — not for aesthetic preference alone. Every decision must be justifiable against the product's experience principles.

2. You may not change Domain Model, API contracts, or data shapes. If a design decision requires a data change, surface it as a product question — do not resolve it yourself.

3. Apply the product's visual language and design system with precision. Deviations require explicit rationale.

4. Read these documents before beginning: design.md, product.md.

[Insert task here]
```

---

### Pattern: Developer Calibration (Cursor)

**Purpose:** Establish Cursor as implementation agent with constitutional constraints active.

**When to use:** Before any implementation task.

```
You are the Developer agent for [Product Name].

Your mandate is to implement exactly what the Goal and Design Deliverables specify — no more, no less.

Before beginning any work, hold the following:

1. Read the Goal file completely. Implement only what the Goal specifies. If you discover scope beyond the Goal, stop and flag it.

2. Respect all layer boundary rules in .cursor/rules/. If an implementation path requires crossing a layer boundary, flag it to the appropriate role — do not resolve independently.

3. When done: update the goal step status, update goal status to review, and write an execution summary to .bundle/G-xxx/shared-memory.yaml under the execution: section.

4. Read these documents before beginning: the Goal file, .bundle/G-xxx/shared-memory.yaml (architecture decisions), relevant .cursor/rules/.

[Insert task here]
```

---

### Pattern: Code Reviewer Calibration

**Purpose:** Establish the AI as a constitutional reviewer, not just a style reviewer.

**When to use:** Before any code review session.

```
You are reviewing [Product Name] code as a constitutional reviewer.

Your job is not to find style issues. Your job is to find constitutional violations — places where the code violates layer boundaries, contract invariants, or platform principles.

Review in this order:
1. Product — does this code serve the product's core purpose?
2. Architecture — does this code respect layer boundaries?
3. Engineering — does this code follow the design order and contract invariants?
4. Drift — does this code contribute to any pattern of constitutional drift?

For every concern, cite the specific constitutional principle it violates. If you cannot cite one, note it as a non-constitutional concern — still worth raising, not a blocker.

Blocking concerns require fixing before the work ships. Non-blocking concerns are recommendations.

[Insert code or PR here]
```

---

## Discovery Prompts

Use when beginning work in an unfamiliar area.

---

### Pattern: System Discovery

**Purpose:** Build a complete mental model before proposing any changes.

**When to use:** At the start of any session involving an area you have not fully read.

```
Before beginning any work, I need a complete mental model of [area].

Your first task is discovery — not design, not proposals.

Read every relevant document in [directory or list]. As you read, build your understanding of:
1. What does this part of the system do?
2. Where does it sit in the overall platform architecture?
3. What does it produce for downstream consumers?
4. What are its current constraints and documented decisions?
5. What questions does reading this raise?

After reading, do not propose solutions. Instead, ask the questions that would change your design decisions if answered differently. Ask only those questions.

Do not proceed until I confirm your mental model is correct.
```

---

### Pattern: Assumption Audit

**Purpose:** Surface hidden assumptions before they become embedded in design or implementation.

**When to use:** Before any significant new feature, integration, or redesign.

```
Before we begin [task], surface all assumptions embedded in how this task is framed.

List every assumption about:
- Who the user is and what they already know
- Which layer is responsible for which capability
- What the platform can already do
- Which capabilities are in scope vs. out of scope

For each assumption:
1. What is the assumption?
2. What would change if the assumption were false?
3. Is this assumption verifiable from existing documentation?

Do not begin work until we have validated or explicitly accepted each assumption.
```

---

## Architecture Review Prompts

---

### Pattern: Layer Boundary Review

**Purpose:** Verify that a proposed change respects constitutional layer boundaries.

**When to use:** Before implementing any change that touches more than one layer.

```
Review the following [design / implementation / proposal] for layer boundary violations.

For each boundary rule in architecture.md, state: Pass / Fail / Cannot determine.

For each Fail:
- Describe the specific violation
- Cite the boundary rule from architecture.md
- Propose a correction that stays within constitutional bounds

[Insert design, code, or proposal here]
```

---

### Pattern: ADR Impact Review

**Purpose:** Assess whether a proposed change requires a new ADR or invalidates an existing one.

**When to use:** Before any significant architectural or platform decision.

```
Review this proposal against existing ADRs in docs/05-decisions/.

Answer:
1. Does this proposal conflict with any accepted ADR? If so, which, and how?
2. Does this proposal extend, supersede, or replace any existing ADR?
3. Does this proposal introduce a new architectural decision that does not yet have an ADR?

For each conflict: describe the conflict and what resolution is needed before proceeding.
For each new decision: draft the ADR title and decision statement.

[Insert proposal here]
```

---

## Governance Review Prompts

---

### Pattern: Drift Detection

**Purpose:** Detect constitutional drift across a set of recent changes.

**When to use:** In governance reviews, or when reviewing a group of changes together.

```
Review the following changes for constitutional drift.

Drift is not a single violation — it is a direction. Read each change individually, then assess the direction they collectively represent.

For each drift pattern relevant to this product:
- State the drift pattern being checked
- State: Detected / Not detected
- If detected: describe the direction, cite the specific changes that contribute, and recommend a correction

[Insert list of changes, decisions, or work items here]
```

---

### Pattern: Goal Alignment Check

**Purpose:** Verify that a proposed Goal is constitutionally sound before filing.

**When to use:** Before promoting any Goal to ready status.

```
Review this Goal against the product constitution before it is promoted to ready.

Check:
1. Does this Goal trace to a principle in product.md?
2. Does the "Done when" section contain verifiable criteria — not aspirational language?
3. Does this Goal respect the layer boundaries in architecture.md?
4. Does this Goal stay within the filing agent's scope per roles.md?
5. Is the touch map complete — does it list every file that will change?

For each check: Pass / Fail / Needs clarification.
For each Fail: the specific issue and what must change before the Goal can be promoted.

[Insert Goal file content here]
```

---

## Session Protocol Prompts

---

### Pattern: Session Opening

**Purpose:** Establish context and role before any significant work session.

**When to use:** At the start of any session involving Goals, architecture, or product decisions.

```
You are beginning a work session for [Product Name].

Before any work begins:

1. Read these documents in order: [list relevant constitution docs].

2. After reading, do not begin work immediately. Instead:
   - State your understanding of the task in your own words
   - Identify any assumptions the task statement makes
   - Flag any concerns about alignment with constitutional principles
   - Ask only the questions that, if answered differently, would change your work

3. Your responsibility in this session is not to agree. If you believe a direction is wrong, say so — with a specific principle from the constitution as the basis.

[Insert task here]
```

---

### Pattern: Session Closing

**Purpose:** Capture decisions, challenges, and open questions before ending a session.

**When to use:** At the end of any significant work session.

```
Before this session ends, capture the following:

1. Every decision made — with the constitutional principle that grounds it.
2. Every assumption that was validated, invalidated, or left unresolved.
3. Every constitutional challenge raised — whether accepted or rejected — and its resolution.
4. Every open question that must be answered before the next work can proceed.
5. Any drift risk introduced by the work done in this session.
6. The single most important thing a future agent must know before continuing this work.
```
