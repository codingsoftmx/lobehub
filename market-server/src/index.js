/**
 * 🏪 Market Server Bridge — LobeHub ↔ OpenClaw
 * 
 * Sirve como Market Server auto-hospedado para LobeHub,
 * puenteando con OpenClaw para ejecución local de skills.
 * 
 * Endpoints compatibles con @lobehub/market-sdk
 */

import express from 'express';
import cors from 'cors';
import { execSync } from 'child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

const app = express();
const PORT = process.env.PORT || 4000;
const OPENCLAW_GATEWAY = process.env.OPENCLAW_GATEWAY || 'http://127.0.0.1:18789';
const SKILLS_DIR = process.env.SKILLS_DIR || resolve(process.cwd(), '..', '.agents', 'skills');

// ── Middleware ──
app.use(cors());
app.use(express.json());

// ── Leer skills del directorio local ──
function leerSkillsDelDirectorio() {
  if (!existsSync(SKILLS_DIR)) return [];
  try {
    const skills = [];
    const items = readdirSync(SKILLS_DIR);
    for (const item of items) {
      const skillPath = join(SKILLS_DIR, item);
      const skillMdPath = join(skillPath, 'SKILL.md');
      if (statSync(skillPath).isDirectory() && existsSync(skillMdPath)) {
        const content = readFileSync(skillMdPath, 'utf-8');
        const nameMatch = content.match(/name:\s*(.+)/);
        const descMatch = content.match(/description:\s*(.+)/);
        skills.push({
          id: item,
          name: nameMatch ? nameMatch[1].trim() : item,
          description: descMatch ? descMatch[1].trim().replace(/^['">\s]+/, '') : 'Skill personal',
          path: skillPath,
          source: 'local'
        });
      }
    }
    return skills;
  } catch (err) {
    console.error('Error leyendo skills:', err.message);
    return [];
  }
}

// ── Ejecutar comando OpenClaw ──
function ejecutarOpenClaw(comando) {
  try {
    const output = execSync(`openclaw ${comando}`, {
      encoding: 'utf-8',
      timeout: 10000,
      env: { ...process.env }
    });
    return { ok: true, output: output.trim() };
  } catch (err) {
    return { ok: false, error: err.message, stderr: err.stderr?.trim() };
  }
}

// ── Health ──
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    server: 'market-server-bridge',
    version: '1.0.0',
    openclaw: OPENCLAW_GATEWAY,
    timestamp: new Date().toISOString()
  });
});

// ── AGENTES / SKILLS ──
app.get('/agents/list', (req, res) => {
  const result = ejecutarOpenClaw('skills list --json');
  let skills = [];
  
  if (result.ok) {
    try {
      const parsed = JSON.parse(result.output);
      skills = (parsed.skills || [])
        .filter(s => s.eligible || !s.disabled)
        .map(s => ({
          id: s.name,
          name: `${s.emoji || ''} ${s.name}`.trim(),
          description: s.description?.substring(0, 200),
          source: s.source,
          enabled: !s.disabled,
          homepage: s.homepage
        }));
    } catch (e) { console.error('Error parseando:', e.message); }
  }
  
  // Skills locales del proyecto
  const localSkills = leerSkillsDelDirectorio();
  for (const ls of localSkills) {
    if (!skills.find(s => s.id === ls.id)) {
      skills.push({ id: ls.id, name: ls.name, description: ls.description, source: 'local', enabled: true });
    }
  }
  
  res.json({ agents: skills, total: skills.length, source: 'market-server-bridge' });
});

app.get('/agents/:id', (req, res) => {
  const { id } = req.params;
  const localSkills = leerSkillsDelDirectorio();
  const skill = localSkills.find(s => s.id === id);
  
  if (skill) {
    return res.json({ agent: { id: skill.id, name: skill.name, description: skill.description, source: 'local', enabled: true } });
  }
  
  const result = ejecutarOpenClaw('skills list --json');
  if (result.ok) {
    try {
      const parsed = JSON.parse(result.output);
      const ocSkill = (parsed.skills || []).find(s => s.name === id);
      if (ocSkill) {
        return res.json({ agent: { id: ocSkill.name, name: `${ocSkill.emoji || ''} ${ocSkill.name}`.trim(), description: ocSkill.description, source: ocSkill.source, enabled: !ocSkill.disabled } });
      }
    } catch (e) {}
  }
  
  res.status(404).json({ error: `Skill "${id}" no encontrado` });
});

app.get('/agents/categories', (req, res) => {
  res.json({
    categories: [
      { id: 'coding-agents', name: 'Coding Agents & IDEs', count: 0 },
      { id: 'git-github', name: 'Git & GitHub', count: 0 },
      { id: 'devops', name: 'DevOps & Cloud', count: 0 },
      { id: 'browser', name: 'Browser & Automation', count: 0 },
      { id: 'self-hosted', name: 'Self-Hosted & Automation', count: 0 },
      { id: 'security', name: 'Security & Passwords', count: 0 },
      { id: 'local', name: 'Local Skills', count: 0 }
    ]
  });
});

// ── PLUGINS ──
app.get('/plugins/list', (req, res) => {
  res.json({
    plugins: [{
      id: 'openclaw-bridge',
      name: 'OpenClaw Bridge Plugin',
      description: 'Plugin puente LobeHub ↔ OpenClaw runtime local',
      source: 'market-server',
      version: '1.0.0',
      type: 'default',
      manifest: '/plugins/openclaw-bridge/manifest'
    }],
    total: 1
  });
});

app.get('/plugins/:id', (req, res) => {
  res.json({ plugin: { id: req.params.id, name: req.params.id, description: 'Plugin del Market Server Bridge', source: 'local', version: '1.0.0' } });
});

app.get('/plugins/:id/manifest', (req, res) => {
  res.json({ identifier: req.params.id, name: req.params.id, description: 'Plugin manifest desde Market Server', version: '1.0.0', tools: [] });
});

app.get('/plugins/categories', (req, res) => {
  res.json({ categories: [{ id: 'tools', name: 'Tools', count: 0 }, { id: 'integration', name: 'Integration', count: 0 }] });
});

// ── MCPs ──
app.get('/mcps/list', (req, res) => {
  res.json({
    mcps: [{
      id: 'openclaw-gateway',
      name: 'OpenClaw Gateway MCP',
      description: 'Conexión MCP al Gateway local de OpenClaw',
      source: 'local',
      type: 'http',
      url: `${OPENCLAW_GATEWAY}/mcp`
    }],
    total: 1
  });
});

app.get('/mcps/:id', (req, res) => {
  res.json({ mcp: { id: req.params.id, name: req.params.id, description: 'MCP Server desde Market Server', source: 'local', type: 'http', url: `${OPENCLAW_GATEWAY}/mcp` } });
});

app.get('/mcps/:id/manifest', (req, res) => {
  res.json({ id: req.params.id, name: req.params.id, type: 'http', url: `${OPENCLAW_GATEWAY}/mcp`, tools: [] });
});

app.get('/mcps/categories', (req, res) => {
  res.json({ categories: [{ id: 'local', name: 'Local', count: 0 }, { id: 'remote', name: 'Remote', count: 0 }] });
});

// ── MODELOS ──
app.get('/models/list', (req, res) => {
  res.json({ models: [{ id: 'local-openclaw', name: 'OpenClaw Local Model', provider: 'openclaw' }] });
});

app.get('/providers/list', (req, res) => {
  res.json({ providers: [{ id: 'openclaw', name: 'OpenClaw', description: 'Runtime local de OpenClaw' }] });
});

// ── OPENCLAW BRIDGE ──
app.get('/openclaw/status', (req, res) => {
  const result = ejecutarOpenClaw('status');
  res.json({
    gateway: OPENCLAW_GATEWAY,
    connected: result.ok,
    skills: result.ok ? 'Listo' : 'No disponible',
    details: result.ok ? { output: result.output.substring(0, 500) } : { error: result.error }
  });
});

app.post('/openclaw/install', (req, res) => {
  const { skill } = req.body;
  if (!skill) return res.status(400).json({ error: 'Se requiere el nombre del skill' });
  const result = ejecutarOpenClaw(`skills install ${skill}`);
  res.json({ skill, installed: result.ok, output: result.ok ? result.output : result.error });
});

// ── Inicio ──
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║     🏪 Market Server Bridge                  ║
║     LobeHub ↔ OpenClaw                       ║
║                                              ║
║  Puerto:     ${String(PORT).padEnd(33)}║
║  OpenClaw:   ${OPENCLAW_GATEWAY.padEnd(33)}║
║  Skills:     ${SKILLS_DIR.slice(0, 35).padEnd(33)}║
║  Health:     http://localhost:${PORT}/health  ║
╚══════════════════════════════════════════════╝
  `);
});
