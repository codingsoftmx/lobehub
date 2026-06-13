#!/bin/bash
# Iniciar Agentes con Market Server + OpenClaw
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
export MARKET_SERVER_PORT=${MARKET_SERVER_PORT:-4000}
export AGENTES_PORT=${AGENTES_PORT:-3000}

echo "🚀 Iniciando ecosistema Agentes + Market Server + OpenClaw"
echo ""

# 1. Iniciar Market Server
echo "1️⃣  Iniciando Market Server..."
cd "$SCRIPT_DIR/market-server"
node src/index.js &
MARKET_PID=$!
sleep 2

# 2. Verificar health
if curl -s http://localhost:$MARKET_SERVER_PORT/health > /dev/null 2>&1; then
  echo "   ✅ Market Server OK (puerto $MARKET_SERVER_PORT)"
else
  echo "   ⚠️  Market Server no responde"
fi

# 3. Iniciar Agentes con envs forzadas
echo ""
echo "2️⃣  Iniciando Agentes..."
cd "$SCRIPT_DIR"

# Forzar las env vars en el proceso
export AUTH_SECRET="ebeb83e1e1970385fcfcd56114ece6955178d244cabb4d5c5a4185380244501f"
export BETTER_AUTH_SECRET="ebeb83e1e1970385fcfcd56114ece6955178d244cabb4d5c5a4185380244501f"

npx next dev --port $AGENTES_PORT &
NEXT_PID=$!

echo "   ✅ Agentes iniciando (puerto $AGENTES_PORT)"
echo ""
echo "═══════════════════════════════════════════"
echo "  🏪 Market Server: http://localhost:$MARKET_SERVER_PORT"
echo "  🦞 OpenClaw:      http://127.0.0.1:18789"
echo "  🌐 Agentes:       http://localhost:$AGENTES_PORT"
echo "═══════════════════════════════════════════"
echo ""
echo "Presiona Ctrl+C para detener todo"

trap "kill $MARKET_PID $NEXT_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
