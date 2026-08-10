# pcampus-dispatch MCP Server

Local MCP server ที่ให้ Claude Desktop สั่งงาน Cursor Agent ได้โดยตรงผ่าน Pcampus Agent OS

## Tools

| Tool | Description |
|------|-------------|
| `dispatch_cursor` | สั่ง Cursor agent ทำ 1 task บน project |
| `dispatch_parallel` | สั่ง Cursor agents หลายตัวพร้อมกัน |
| `read_dispatch_log` | อ่าน log ล่าสุดจาก dispatch |
| `read_shared_memory` | อ่าน shared-memory.yaml ของ goal |
| `write_architecture_handoff` | เขียน architecture decision + trigger dispatch |

## Setup

### 1. Install dependencies
```bash
cd scripts/dispatch-mcp-server
npm install
```

### 2. Register กับ Claude Desktop
ไฟล์ `~/Library/Application Support/Claude/claude_desktop_config.json` ต้องมี:
```json
{
  "mcpServers": {
    "pcampus-dispatch": {
      "command": "node",
      "args": ["/Users/pcp-nattha/Project/Pcampus-Agent-OS/scripts/dispatch-mcp-server/index.js"],
      "env": {
        "PATH": "/Users/pcp-nattha/.local/bin:/usr/local/bin:/usr/bin:/bin"
      }
    }
  }
}
```

### 3. Restart Claude Desktop
หลังแก้ config ต้อง restart Claude Desktop ก่อน tool จะปรากฏ

### 4. ตรวจสอบ
ใน Claude Desktop → เห็น 🔧 icon → ตรวจว่า `dispatch_cursor` อยู่ใน tool list

## Usage ใน Claude

```
ฉัน: "dispatch cursor G-021 step 2 on PBCP-Cockpit project"

Claude จะ call:
dispatch_cursor(
  project_path="/Users/pcp-nattha/Project/PBCP-Cockpit",
  task_prompt="Read .bundle/G-021/step-2.md and implement the REST endpoint...",
  goal_id="G-021",
  model="claude-sonnet-4-5"
)
```

## Governance Guardrails

MCP server จะ **block** task prompts ที่มี:
- `git push` / `git merge` / `git rebase`
- `deploy prod`
- `rm -rf`
- `DROP TABLE`

Per Pcampus governance — ต้องมี human approval ก่อน

## Files ที่เกี่ยวข้อง

- `index.js` — MCP server implementation
- `../../scripts/dispatch-cursor.sh` — single task dispatcher
- `../../scripts/dispatch-parallel.sh` — parallel dispatcher
- `../../docs/06-workflows/cursor-dispatch.md` — full workflow docs
- `../../CLAUDE.md` — Claude role & dispatch instructions
