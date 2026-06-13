---
name: market-server-admin
description: >
  REQUIRED for managing the Market Server Bridge — the heart of your custom Agentes ecosystem.
  Use when the user asks to "check market server", "restart market", "view market logs",
  "market status", "health check", "list market skills", "market server config".
  When this skill is invoked, use the Market Server API at http://localhost:4000
  plus the OpenClaw CLI for underlying skill operations.
---

# 🏪 Market Server Admin

## When This Skill Applies

**ALWAYS invoke this skill when the user's request involves ANY of these:**
- "market status" or "health check" of the Market Server
- "restart market", "stop market", or "start market"
- "list skills", "market skills", or "skills in the market"
- "market config", "market server setup", or "openclaw bridge"
- Any mention of the Market Server Bridge, port 4000, or localhost:4000

## Architecture Overview

Your Market Server Bridge sits between Agentes and OpenClaw:

```
Agentes ←→ Market Server (puerto 4000) ←→ OpenClaw Gateway (puerto 18789)
                │
                └── Sirve skills desde .agents/skills/ (42 skills)
```

## Quick Commands

### Health Check
```bash
curl -s http://localhost:4000/health
```

### List All Skills in Market
```bash
curl -s http://localhost:4000/agents/list
```

### Check OpenClaw Gateway Status
```bash
curl -s http://localhost:4000/openclaw/status
```

### Install a New Skill
```bash
curl -s -X POST http://localhost:4000/openclaw/install \
  -H "Content-Type: application/json" \
  -d '{"skill":"<skill-name>"}'
```

### Start Market Server
```bash
cd /ruta/del/proyecto/market-server
node src/index.js
```

## File Locations

| Component | Path |
|-----------|------|
| Market Server code | `market-server/src/index.js` |
| Startup script | `market-server/start-market.sh` |
| Config (.env) | `.env.development` |
| Skills directory | `.agents/skills/` |

## References

- [Market Server Bridge Source](references/market-server-code.md)
- [OpenClaw Gateway Docs](references/openclaw-gateway.md)
