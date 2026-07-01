# Cursor Dispatch — Antigravity สั่งงาน Cursor โดยตรง

> **เอกสารนี้อธิบายกลไกที่ Antigravity ใช้สั่งงาน Cursor Agent โดยอัตโนมัติ**  
> ไม่ต้องให้ human พิมพ์ "เริ่ม step N" ใน Cursor อีกต่อไป

ดูเพิ่มเติม: [coordination.md](../03-architecture/coordination.md) · [multi-agent-model.md](../04-agents/multi-agent-model.md)

---

## Overview

```
Antigravity (Orchestrator)
    │
    ├─ อ่าน Goal (goals/G-xxx.md)
    ├─ แตก Epic → Tasks → เขียน Bundle (.bundle/G-xxx/step-N.md)
    │
    ├─ [Single Task]   → dispatch-cursor.sh    → cursor agent CLI
    └─ [Parallel Tasks] → dispatch-parallel.sh → multiple agents
```

---

## Approach A — Single Task (dispatch-cursor.sh)

ใช้เมื่อต้องการสั่งงาน **1 task** บน **1 project**

### Command

```bash
./scripts/dispatch-cursor.sh <project_path> "<task_prompt>" [model] [timeout_seconds]
```

### Examples

```bash
# Antigravity สั่ง Cursor implement API endpoint ตาม step-2.md
./scripts/dispatch-cursor.sh \
  /Users/pcp-nattha/Project/PBCP-Cockpit \
  "Read .bundle/G-021/step-2.md and implement the REST endpoint. Follow .cursor/rules/. Update shared-memory.yaml execution section when done." \
  claude-sonnet-4-5 \
  600

# สั่งทำ code review
./scripts/dispatch-cursor.sh \
  /Users/pcp-nattha/Project/PBCP-Cockpit \
  "Run pcampus-code-review skill on the last changed files. Write results to .bundle/G-021/review.md"
```

### What happens

1. `dispatch-cursor.sh` รัน `agent --cwd <project> -p "<task>"`
2. Cursor Agent อ่าน `.cursor/rules/` และ `.cursor/skills/` โดยอัตโนมัติ
3. Output log บันทึกที่ `.bundle/dispatch-logs/dispatch-<timestamp>.log`
4. Task manifest บันทึกที่ `.bundle/dispatch-logs/dispatch-<timestamp>.yaml`

---

## Approach C — Parallel Tasks (dispatch-parallel.sh)

ใช้เมื่อต้องการรัน **หลาย tasks พร้อมกัน** เช่น UI agent + API agent พร้อมกัน

### Tasks File Format

สร้างไฟล์ YAML ระบุ tasks:

```yaml
# .bundle/G-021/parallel-tasks.yaml
tasks:
  - id: "ui-agent"
    prompt: "Read .bundle/G-021/step-3.md UI section and implement React components. Do not touch API files."
    model: "claude-sonnet-4-5"

  - id: "api-agent"
    prompt: "Read .bundle/G-021/step-3.md API section and implement REST endpoints. Do not touch UI files."
    model: "claude-sonnet-4-5"
```

### Command

```bash
./scripts/dispatch-parallel.sh \
  /Users/pcp-nattha/Project/PBCP-Cockpit \
  .bundle/G-021/parallel-tasks.yaml
```

### Logs

ทุก agent จะมี log แยกกันที่:
```
.bundle/dispatch-logs/parallel-<timestamp>/
  ├── ui-agent.log
  └── api-agent.log
```

---

## Antigravity Dispatch Protocol

เมื่อ Antigravity ต้องการสั่งงาน Cursor ให้ทำตาม protocol นี้:

### Step 1 — เตรียม Bundle
```
.bundle/G-xxx/
  ├── step-N.md          ← task description สำหรับ Cursor
  ├── action-step-N.yaml ← allowed files + constraints
  └── shared-memory.yaml ← handoff state
```

### Step 2 — สร้าง Prompt
Prompt ที่ดีต้องระบุ:
- ไฟล์ที่ต้องอ่าน (`Read .bundle/G-xxx/step-N.md`)
- Scope ที่ทำได้ (`Only modify files in src/api/`)
- สิ่งที่ห้ามทำ (`Do not modify UI files`)
- สิ่งที่ต้องทำเมื่อเสร็จ (`Update shared-memory.yaml execution section`)

### Step 3 — Dispatch

```bash
# Single task
bash scripts/dispatch-cursor.sh <project> "<prompt>"

# Parallel tasks  
bash scripts/dispatch-parallel.sh <project> <tasks.yaml>
```

### Step 4 — Monitor & Handoff
- Antigravity อ่าน log จาก `.bundle/dispatch-logs/`
- อ่าน `shared-memory.yaml` เพื่อดู execution status
- ส่ง handoff ต่อให้ Claude review ถ้าจำเป็น

---

## Governance Constraints

ข้อจำกัดที่ต้องระบุใน prompt เสมอ (ตาม Pcampus governance):

| ห้ามทำ | วิธีระบุใน prompt |
|--------|-------------------|
| Merge to main | "Do not run git merge or git push" |
| Deploy production | "Do not run any deploy commands" |
| Modify auth/security | "Do not touch files in src/auth/ or src/security/" |
| Mark goal done | ไม่ต้องระบุ — Cursor ไม่มีสิทธิ์เปลี่ยน goal status |

---

## Environment Setup

```bash
# ตรวจสอบ cursor-agent ติดตั้งแล้ว
agent --version

# ถ้ายังไม่มี
curl https://cursor.com/install -fsS | bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## Completion Detection & Review

Cursor ส่งสัญญาณว่าเสร็จแล้วโดยการ **อัปเดต status ใน `G-xxx.md`** จาก `in_progress` → `review`

### วิธีที่ผม (Antigravity) รู้ว่าเสร็จ

```
dispatch-cursor.sh รัน cursor-agent (blocking)
    │
    └── เมื่อ return → Cursor agent session จบแล้ว
                       (แต่ Cursor อาจยังไม่ได้ update goal file)
```

จึงต้องอ่านไฟล์ goal เพิ่ม:

```bash
# ผมอ่าน status จาก goal file โดยตรง
grep "^\*\*Status:\*\*" docs/07-backlog/goals/G-xxx.md
```

### สำหรับ Claude (ผ่าน MCP tools)

```
dispatch_cursor(...)           ← สั่งงาน
    ↓
poll_until_review(             ← รอ (poll ทุก 15 วิ จนเห็น review)
  goal_id="G-xxx",
  project_path="..."
)
    ↓ เมื่อ status = review
read_shared_memory(...)        ← ดู execution details
read_dispatch_log(...)         ← ดู Cursor output log
    ↓
review code → บอก human "ready for approval"
```

### สำหรับ Antigravity (ผ่าน run_command)

```bash
# 1. dispatch
bash scripts/dispatch-cursor.sh /project "task..."

# 2. ตรวจ status
grep "^\*\*Status:\*\*" /project/docs/07-backlog/goals/G-xxx.md

# 3. review git diff
git -C /project diff HEAD~1 --stat

# 4. อ่าน log
cat /project/.bundle/dispatch-logs/dispatch-latest.log | tail -50
```

### Review Checklist (pcampus-code-review)

หลัง Cursor ทำ status = `review`:

- [ ] `read_goal_status` → ตรวจ step table ว่าครบ
- [ ] `read_shared_memory` → ตรวจ execution section
- [ ] `read_dispatch_log` → ตรวจ Cursor output ไม่มี error
- [ ] `git diff` → code ตรง touch map เท่านั้น
- [ ] Tests pass (run ตาม Test plan ใน goal file)
- [ ] บอก human → human approve → `approved`

