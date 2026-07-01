# Skills bridge

Each `pcampus-*.md` file is a **symlink** to the canonical skill at `.cursor/skills/pcampus-*/SKILL.md`.

- Edit skills only under `.cursor/skills/` (synced by `upgrade-os.sh`).
- Antigravity reads this folder natively; Cursor reads `.cursor/skills/`.
- If symlinks break on your OS, open the path shown by `readlink pcampus-goal-workflow.md`.
