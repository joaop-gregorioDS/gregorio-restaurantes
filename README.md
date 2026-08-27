# 🍷 Gregórios Restaurantes — site & pedidos

Projeto de aprendizado · dados 100% simulados · pronto para MySQL (Fase 2).
**Rua Tuiuti, 2122 – Tatuapé · São Paulo/SP · CEP 03307-005**

## 📚 Documentação completa

| Documento | Conteúdo |
|-----------|----------|
| [`DOCUMENTACAO.md`](DOCUMENTACAO.md) | Guia do projeto: páginas, funcionalidades, fluxo de teste, como rodar |
| [`ARQUITETURA.md`](ARQUITETURA.md) | Stack, camadas, contrato da API, modelo de dados, design system |
| [`sql/COMO_POPULAR.md`](sql/COMO_POPULAR.md) | Passo a passo para popular o MySQL (XAMPP/Homebrew/Docker) |
| `scripts/popular-banco.sh` | Script que automatiza schema + seed + validação |

## ▶️ Como rodar local (Fase 1)
O site usa `fetch()` para os JSON, então precisa de um servidor local (não abra com duplo clique):
- **PHP:** `php -S localhost:8080` na pasta do projeto → http://localhost:8080
- **Celular na rede Wi-Fi:** `php -S 0.0.0.0:8080` → http://SEU_IP:8080 (`ipconfig getifaddr en0`)
- **XAMPP:** copie a pasta em `htdocs/` → http://localhost/gregorio-restaurantes
- **VS Code:** extensão *Live Server* → clique em *Go Live*

**Login demo:** `cliente@gregorios.com.br` · senha `123456`

## 🗄️ Conectar ao MySQL (Fase 2)
1. `./scripts/popular-banco.sh` (ou importe manualmente `sql/schema.sql` + `sql/seed.sql` — detalhes em [`sql/COMO_POPULAR.md`](sql/COMO_POPULAR.md));
2. Copie `api/config.example.php` → `api/config.php` e preencha as credenciais;
3. Em `js/api.js`, troque `const MODO = 'json'` por `const MODO = 'php'`. Pronto.

## 🧱 Estrutura
14 páginas HTML · `css/` design system · `js/` (api = camada de dados, estado = carrinho/sessão, ui = componentes) · `dados/` = banco simulado · `api/` = PHP/MySQL · `sql/` = schema + seed + guia · `scripts/` = automação.