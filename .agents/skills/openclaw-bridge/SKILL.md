---
name: openclaw-bridge
description: >
  REQUIRED for managing the OpenClaw Bridge integration with Agentes.
  Use when the user asks to "connect OpenClaw", "openclaw status", "enable skill",
  "disable skill", "install clawhub skill", "sync openclaw", "openclaw config",
  "manage openclaw skills", "openclaw gateway".
  When this skill is invoked, use the OpenClaw CLI and the Market Server API.
---

# 🦞 OpenClaw Bridge

## When This Skill Applies

**ALWAYS invoke this skill when the user's request involves ANY of these:**
- "openclaw status", "openclaw gateway", or "openclaw dashboard"
- "install [skill] from clawhub", "install openclaw skill"
- "enable skill", "disable skill", or "list openclaw skills"
- "sync skills to market" or "sync openclaw to lobehub"
- "openclaw config", "openclaw setup", or "openclaw doctor"

## OpenClaw Gateway

Your OpenClaw Gateway runs at:
- **Dashboard**: http://127.0.0.1:18789
- **CLI**: `openclaw` command
- **Version**: OpenClaw 2026.6.6

## Managing Skills via OpenClaw CLI

### List all skills
```bash
openclaw skills list
```

### Install a skill from ClawHub
```bash
openclaw skills install <skill-name>
```

### Check skill details
```bash
openclaw skills list --json
```

### View OpenClaw status
```bash
openclaw status
```

### Run doctor / diagnostics
```bash
openclaw doctor
```

## Skills Bridge Architecture

When a new skill is installed via OpenClaw CLI, it must be synced to the project:

```
ClawHub → openclaw skills install → ~/.openclaw/workspace/skills/
                                          ↓ (copy)
                                   .agents/skills/ (proyecto)
                                          ↓ (Market Server lo sirve)
                                   Agentes puede usarlo
```

## Manual Sync Command
```bash
SKILL_NAME="<skill-name>"
cp -r ~/.openclaw/workspace/skills/$SKILL_NAME \
  /ruta/proyecto/.agents/skills/$SKILL_NAME
```

## References

- [OpenClaw Docs](https://docs.openclaw.ai)
- [ClawHub Registry](https://clawhub.ai)
- [Awesome OpenClaw Skills](https://github.com/VoltAgent/awesome-openclaw-skills)
