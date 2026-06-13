# Market Server Bridge — Código Fuente

## Archivo Principal: `market-server/src/index.js`

El Market Server Bridge es un servidor Express.js que implementa los endpoints
compatibles con `@lobehub/market-sdk`.

### Endpoints Implementados

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Health check del servidor |
| GET | `/agents/list` | Lista todos los skills |
| GET | `/agents/:id` | Detalle de un skill |
| GET | `/agents/categories` | Categorías de skills |
| GET | `/plugins/list` | Plugins disponibles |
| GET | `/plugins/:id/manifest` | Manifest del plugin |
| GET | `/mcps/list` | Servidores MCP |
| GET | `/mcps/:id/manifest` | Manifest MCP |
| GET | `/models/list` | Modelos disponibles |
| GET | `/providers/list` | Proveedores de modelos |
| GET | `/openclaw/status` | Estado del Gateway OpenClaw |
| POST | `/openclaw/install` | Instalar un skill |

### Ubicación

```
/Users/codingsoft/github-prod/asistentes/lobehub/market-server/
├── package.json
├── src/index.js          # ← Servidor principal
├── start-market.sh       # Script de inicio
└── node_modules/
```

### Puerto: 4000
