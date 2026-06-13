#!/bin/bash
# 🏪 start-market.sh — Inicia el ecosistema completo
# Agentes ↔ Market Server ↔ OpenClaw
#
# Uso: ./start-market.sh [dev|prod]

set -e

MODE="${1:-dev}"
MARKET_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$MARKET_DIR/.." && pwd)"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║     🏪 Iniciando Ecosistema Agentes           ║"
echo "║     Agentes ↔ Market Server ↔ OpenClaw      ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# ── 1. Verificar OpenClaw ──
echo "🔍 [1/3] Verificando OpenClaw Gateway..."
if command -v openclaw &> /dev/null; then
  echo "   ✅ OpenClaw disponible: $(openclaw --version 2>&1 | head -1)"
  
  # Verificar que el gateway esté corriendo
  if curl -s -o /dev/null -w "" http://127.0.0.1:18789/ 2>/dev/null; then
    echo "   ✅ OpenClaw Gateway: http://127.0.0.1:18789"
  else
    echo "   ⚠️  Gateway no detectado, intentando iniciar..."
    # El gateway se inicia automáticamente con openclaw
  fi
else
  echo "   ❌ OpenClaw no encontrado. Instala con: npm install -g openclaw"
  exit 1
fi

# ── 2. Iniciar Market Server ──
echo ""
echo "🔍 [2/3] Iniciando Market Server Bridge..."
cd "$MARKET_DIR"

if [ ! -d "node_modules" ]; then
  echo "   📦 Instalando dependencias..."
  npm install --silent
fi

# Puerto por defecto 4000, o el definido en PORT
PORT="${PORT:-4000}"
echo "   🚀 Market Server: http://localhost:$PORT"
echo "   🩺 Health check:  http://localhost:$PORT/health"

# Iniciar en background
node src/index.js &
MARKET_PID=$!
echo "   📌 PID: $MARKET_PID"

# Esperar a que esté listo
for i in {1..10}; do
  if curl -s http://localhost:$PORT/health > /dev/null 2>&1; then
    echo "   ✅ Market Server listo!"
    break
  fi
  sleep 1
done

# ── 3. Configurar Agentes ──
echo ""
echo "🔍 [3/3] Verificando configuración de Agentes..."
if [ "$MODE" = "dev" ]; then
  echo "   🔧 Modo desarrollo"
  echo "   📁 .env: $(cat $PROJECT_DIR/.env.development 2>/dev/null | grep MARKET_BASE_URL || echo '⚠️  No configurado')"
  echo ""
  echo "   📋 Para iniciar Agentes en otra terminal:"
  echo "      cd $PROJECT_DIR"
  echo "      npm run dev"
  echo ""
  echo "   🌐 Abrir: http://localhost:3000"
elif [ "$MODE" = "prod" ]; then
  echo "   🔧 Modo producción"
  echo "   📋 Para construir:"
  echo "      cd $PROJECT_DIR && npm run build && npm run start"
fi

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║     ✅ Ecosistema Listo!                     ║"
echo "║                                              ║"
echo "║  🏪 Market Server: http://localhost:$PORT      ║"
echo "║  🦞 OpenClaw:      http://127.0.0.1:18789    ║"
echo "║  🌐 Agentes:      http://localhost:3000      ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "Presiona Ctrl+C para detener el Market Server"

# Mantener el proceso vivo
wait $MARKET_PID
