---
name: skill-publisher
description: >
  REQUIRED for creating, editing, and publishing custom skills to the Market Server.
  Use when the user asks to "create a skill", "new skill", "publish skill",
  "add skill to market", "author a skill", "generate SKILL.md", "make a skill",
  "build custom skill", "write skill", "develop skill".
  When this skill is invoked, scaffold the SKILL.md, validate it with skill-vetter,
  copy it to .agents/skills/, and verify it appears in the Market Server.
---

# 📦 Skill Publisher

## When This Skill Applies

**ALWAYS invoke this skill when the user's request involves ANY of these:**
- "create a skill", "new skill", or "make a skill"
- "publish to market", "add skill to market"
- "author SKILL.md", "write a skill", "develop custom skill"
- "build a tool for the agent", "extend the agent"
- "skill template", "skill scaffold", or "skill generator"

## SKILL.md Format

Every skill needs this structure:

```
nombre-skill/
├── SKILL.md               # Requerido: punto de entrada
├── commands/              # Opcional: subcomandos invocables
│   └── ejemplo.md
└── references/            # Opcional: contexto adicional
    └── docs.md
```

## Frontmatter Template

```yaml
---
name: mi-skill-personalizado
description: >
  REQUIRED for [describe exactamente cuándo se usa].
  Use when the user asks to "trigger phrase 1", "trigger phrase 2".
  Triggers: keyword1, keyword2, keyword3.

  When this skill is invoked, [instrucción explícita de qué hacer].
---
```

## SKILL.md Body Template

```markdown
# Título de mi Skill

## When This Skill Applies

**ALWAYS invoke this skill when the user's request involves ANY of these:**

- Escenario específico 1
- Escenario específico 2

## Instructions

Pasos concretos que el agente debe seguir...

## Commands

- [Subcomando 1](commands/comando1.md)

## References

- [Documentación](references/docs.md)
```

## Publication Workflow

```
1. Crear directorio:        mkdir -p .agents/skills/mi-skill/
2. Escribir SKILL.md:        SKILL.md con frontmatter + body
3. Validar con skill-vetter: openclaw skills list
4. Verificar en Market:      curl http://localhost:4000/agents/mi-skill
5. Usar desde Agentes:       El agente lo detecta automáticamente
```

## Best Practices

- Mantén SKILL.md bajo 500 líneas
- Usa `references/` para documentación detallada
- Usa `commands/` para subcomandos invocables
- Describe triggers explícitamente en frontmatter
- Nombres en kebab-case (mi-skill, no "Mi Skill")
- Pon ejemplos de código en bloques fenced

## References

- [skill-creator (OpenClaw)](https://lobehub.com/skills/openclaw-openclaw-skill-creator)
- [AgentSkills Spec](https://docs.openclaw.ai/tools/skills)
