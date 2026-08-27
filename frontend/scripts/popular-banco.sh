#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
#  GREGÓRIOS RESTAURANTES · popular banco MySQL (Fase 2)
#  Uso: ./scripts/popular-banco.sh [-h HOST] [-P PORTA] [-u USUARIO] [-p SENHA]
# ═══════════════════════════════════════════════════════════════
set -euo pipefail

HOST="localhost"; PORT="3306"; USER="root"; PASS=""
while getopts "h:P:u:p:" opt; do
  case $opt in
    h) HOST="$OPTARG" ;;
    P) PORT="$OPTARG" ;;
    u) USER="$OPTARG" ;;
    p) PASS="$OPTARG" ;;
    *) echo "Uso: $0 [-h host] [-P porta] [-u usuario] [-p senha]"; exit 1 ;;
  esac
done

DIR="$(cd "$(dirname "$0")/.." && pwd)"
SCHEMA="$DIR/sql/schema.sql"
SEED="$DIR/sql/seed.sql"

[ -f "$SCHEMA" ] || { echo "❌ Não encontrei $SCHEMA"; exit 1; }
[ -f "$SEED" ]    || { echo "❌ Não encontrei $SEED";    exit 1; }

# ── localizar cliente mysql ──
MYSQL="$(command -v mysql || true)"
if [ -z "$MYSQL" ]; then
  for c in /Applications/XAMPP/xamppfiles/bin/mysql /usr/local/mysql/bin/mysql /opt/homebrew/opt/mysql-client/bin/mysql /opt/homebrew/bin/mysql; do
    [ -x "$c" ] && MYSQL="$c" && break
  done
fi
[ -n "$MYSQL" ] || { echo "❌ Cliente 'mysql' não encontrado. Instale com: brew install mysql (ou use XAMPP/Docker — veja sql/COMO_POPULAR.md)"; exit 1; }
echo "✔ Cliente: $MYSQL"

MYSQL_ARGS=(--host="$HOST" --port="$PORT" --user="$USER")
[ -n "$PASS" ] && MYSQL_ARGS+=(--password="$PASS")

echo "→ Testando conexão $USER@$HOST:$PORT ..."
if ! "$MYSQL" "${MYSQL_ARGS[@]}" -e "SELECT 1;" >/dev/null 2>&1; then
  echo "❌ Falha na conexão. O MySQL está rodando? Senha correta? (use -p'SUA_SENHA')"
  echo "   Dica XAMPP: /Applications/XAMPP/xamppfiles/bin/mysql -u root"
  exit 1
fi
echo "✔ Conectado."

echo "→ Importando schema.sql (cria gregorio_db + tabelas)..."
"$MYSQL" "${MYSQL_ARGS[@]}" < "$SCHEMA"

echo "→ Importando seed.sql (dados completos de demonstração)..."
"$MYSQL" "${MYSQL_ARGS[@]}" < "$SEED"

echo ""
echo "✅ Banco populado! Contagens:"
"$MYSQL" "${MYSQL_ARGS[@]}" -N -e "
USE gregorio_db;
SELECT CONCAT('  categorias: ', COUNT(*)) FROM categorias;
SELECT CONCAT('  produtos:   ', COUNT(*)) FROM produtos;
SELECT CONCAT('  usuarios:   ', COUNT(*)) FROM usuarios;
SELECT CONCAT('  enderecos:  ', COUNT(*)) FROM enderecos;
SELECT CONCAT('  pedidos:    ', COUNT(*)) FROM pedidos;
SELECT CONCAT('  itens_pedido: ', COUNT(*)) FROM itens_pedido;
SELECT CONCAT('  favoritos:  ', COUNT(*)) FROM favoritos;"
echo ""
echo "🔑 Login demo: cliente@gregorios.com.br · senha 123456"
echo "▶ Próximo passo: em js/api.js troque  const MODO = 'json'  por  const MODO = 'php'"
