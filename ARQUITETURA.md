# 🏗️ Arquitetura & Stack — Gregórios Restaurantes

Documento técnico: decisões de arquitetura, stack, camadas, fluxo de dados e contrato da API.

---

## 1. Decisão central: camada de dados desacoplada

**Nenhuma página acessa dados diretamente.** Tudo passa por `js/api.js`, que expõe um contrato fixo de funções. A fonte dos dados é trocada por **uma única constante**:

```js
// js/api.js
const MODO = 'json'; // Fase 1: JSON local · Fase 2: 'php' → MySQL via /api/*.php
```

| Fase | Fonte | Persistência | O que muda |
|------|-------|--------------|------------|
| **Fase 1 (atual)** | `dados/*.json` via `fetch()` + cache em memória | `localStorage` (carrinho, favoritos, sessão, pedidos novos, usuários novos) | nada — já é o padrão |
| **Fase 2** | `api/*.php` → PDO → MySQL 8 | tabelas `gregorio_db` | `MODO = 'php'` em `js/api.js` |

As 14 páginas e os 14 scripts de página **não precisam de nenhuma alteração** na migração.

### Contrato público de `Api`

```js
Api.MODO                                  // 'json' | 'php'
Api.listarCategorias()                    → [{id,slug,nome,descricao,icone,ordem}]
Api.listarProdutos({categoria?,busca?,destaque?,ordem?})  → [Produto]   // ordem: 'preco-asc'|'preco-desc'|'nome'
Api.obterProduto(id)                      → Produto | null
Api.obterCategoria(slug)                  → Categoria | null
Api.login(email, senha)                   → {ok, usuario?} | {ok:false}
Api.cadastrar({nome,email,senha,telefone})→ {ok, usuario?} | {ok:false, erro}
Api.salvarUsuario(usuario)                → {ok}
Api.listarPedidos(usuarioId)              → [Pedido]           (locais + seed, desc)
Api.obterPedido(id)                       → Pedido | null
Api.criarPedido(payload)                  → Pedido             (id, criado_em, status:'recebido')
Api.listarFavoritos(usuarioId)            → [produtoId]
Api.setFavorito(usuarioId, produtoId, on) → void               (só persiste no modo php)
```

**Formato `Produto`:** `{id, categoria_id, nome, desc, preco, emoji, tags[], harmoniza, destaque, disponivel}`
**Formato `Pedido`:** `{id, usuario_id, tipo_entrega:'entrega'|'retirada', status, pagamento:'pix'|'cartao'|'dinheiro', itens:[{produto_id,quantidade,preco_unitario}], subtotal, frete, total, observacoes, criado_em, endereco?}`

---

## 2. Stack

| Camada | Tecnologia | Observações |
|--------|-----------|-------------|
| Marcação | HTML5 semântico | 14 páginas estáticas, `lang="pt-BR"`, viewport responsivo |
| Estilo | CSS3 puro (sem frameworks) | design system em custom properties (`:root`), Grid/Flexbox, `clamp()` |
| Lógica | JavaScript ES6+ puro (sem build, sem deps) | módulos IIFE globais: `Api`, `Estado`, `Ui` |
| Fontes | Google Fonts (Cinzel, Karla, Cormorant Garamond) | fallback Georgia/system-ui para offline |
| Servidor dev | PHP built-in (`php -S`) / Live Server / XAMPP | obrigatório por causa do `fetch()` |
| Backend F2 | PHP 8 + PDO + MySQL 8 | esqueleto completo em `/api` |
| Estado cliente | `localStorage` (chaves `gregorios_*`) | carrinho, favoritos, sessão, usuários/pedidos locais |

---

## 3. Camadas do frontend

```
┌────────────────────────────────────────────────────┐
│  Páginas (.html)  +  js/paginas/*.js               │  ← apresentação/orquestração
│  renderizam com template literals; chamam Api/Ui   │
├────────────────────────────────────────────────────┤
│  Ui (js/ui.js)                                     │  ← componentes compartilhados
│  header/footer dinâmicos · toast · badges ·        │
│  cardProduto() · reveal() · fmt(R$) · EMPRESA      │
├────────────────────────────────────────────────────┤
│  Estado (js/estado.js)                             │  ← estado do usuário
│  carrinho[] · favoritos[] · sessao                 │
│  add/setQtd/remover/limpar/toggleFav/entrar/sair   │
├────────────────────────────────────────────────────┤
│  Api (js/api.js)                                   │  ← ÚNICO ponto de dados
│  MODO='json' → fetch(dados/*.json)+localStorage    │
│  MODO='php'  → fetch(api/*.php)                    │
└────────────────────────────────────────────────────┘
```

**Constante `EMPRESA`** (`js/ui.js`): fonte única da verdade para endereço, telefones, frete (12), tempos de entrega/retirada — usada por header, footer, checkout e produto.

**Delegação global de eventos** (`ui.js`): qualquer elemento `[data-add]` adiciona à cesta e `[data-fav]` favorita, em qualquer página, com toast de feedback.

---

## 4. Backend Fase 2 — endpoints `/api/*.php`

Todos retornam JSON (`Content-Type: application/json; charset=utf-8`). Conexão centralizada em `config.php` (PDO + exceptions). Copie `config.exemple.php` → `config.php` e ajuste credenciais.

| Método & rota | Função | Parâmetros |
|---------------|--------|-----------|
| `GET api/produtos.php` | lista produtos disponíveis | — |
| `GET api/produtos.php?id=5` | um produto hidratado (`tags` vira array, tipos numéricos) | `id` |
| `GET api/categorias.php` | categorias ativas por `ordem` | — |
| `GET api/auth.php?email=&senha=` | login (`password_verify` bcrypt) | query |
| `POST api/auth.php` | cadastro (`password_hash`) — erro se e-mail duplicado | body JSON `{nome,email,senha,telefone}` |
| `POST api/auth.php` `{acao:'atualizar',...}` | atualiza perfil | body JSON |
| `GET api/pedidos.php?usuario_id=` | pedidos do usuário (com itens) | query |
| `GET api/pedidos.php?id=` | um pedido detalhado | query |
| `POST api/pedidos.php` | cria pedido + itens (transação) | body JSON (mesmo payload do checkout) |
| `GET api/favoritos.php?usuario_id=` | ids favoritados | query |
| `POST api/favoritos.php` | favorita (`INSERT IGNORE`) | body JSON |
| `DELETE api/favoritos.php?usuario_id=&produto_id=` | desfavorita | query |

⚠️ Notas de segurança (projeto didático): login via GET apenas para simplificar a Fase 1→2; em produção usar POST + HTTPS + sessão/token. Senhas sempre bcrypt.

---

## 5. Modelo de dados MySQL

Banco: `gregorio_db` (`utf8mb4_unicode_ci`). DDL completo em [`sql/schema.sql`](sql/schema.sql).

```
categorias ──< produtos ──< itens_pedido >── pedidos >── enderecos
                                    │                          │
                                    └── favoritos >── usuarios─┘
```

| Tabela | Colunas-chave | Relações |
|--------|--------------|----------|
| `categorias` | id, nome, slug UNIQUE, icone, ordem, ativo | — |
| `produtos` | id, categoria_id FK, nome, descricao, preco DECIMAL(8,2), emoji, tags CSV, harmoniza, destaque, disponivel | FK → categorias |
| `usuarios` | id, nome, email UNIQUE, senha_hash (bcrypt), telefone, criado_em | — |
| `enderecos` | id, usuario_id FK CASCADE, apelido, cep CHAR(9), rua, numero, complemento, bairro, cidade, uf CHAR(2) | FK → usuarios |
| `pedidos` | id, usuario_id FK, endereco_id FK NULL (retirada), tipo_entrega ENUM, status ENUM(6), pagamento ENUM(3), subtotal/frete/total DECIMAL, observacoes, criado_em | FKs → usuarios, enderecos |
| `itens_pedido` | pedido_id FK CASCADE, produto_id FK, quantidade, preco_unitario (preço congelado no momento da compra) | FKs → pedidos, produtos |
| `favoritos` | PK composta (usuario_id, produto_id), ambos CASCADE | FKs → usuarios, produtos |

Decisões de modelagem:
- `endereco_id` é **nullable**: pedidos de retirada não têm endereço.
- `itens_pedido.preco_unitario` congela o preço histórico (mudanças no cardápio não alteram pedidos antigos).
- `tags` como CSV simples (didático); normalizar em tabela `produto_tags` se precisar filtrar no SQL.
- `status` ENUM espelha exatamente os valores de `Ui.STATUS` no frontend.

---

## 6. Design system (`css/base.css`) — GLASS

**Conceito "Aurora na Adega"**: fundo ambiente quente (gradiente fixo creme→pêssego) + 3 blobs de aurora (`dourado/vinho/oliva`, animação só de `transform`, injetados por `js/ui.js` em `.aurora`). Dois níveis de vidro criam a hierarquia:

```css
/* vidro claro (conteúdo: molduras, cards, formulários) */
--glass-light:rgba(251,246,234,.60); --glass-border:rgba(255,255,255,.55);
backdrop-filter:blur(14px) saturate(130%); box-shadow:var(--sombra),var(--specular);
/* vidro escuro (chrome: header, menu, rodapé, toast, faixas) */
--glass-dark:rgba(63,18,32,.58);
backdrop-filter:blur(18px) saturate(150%)
```

Marca preservada: `--vinho:#5A1B2C · --creme:#F5EEDF · --dourado:#C9A25C · --oliva:#6D7C3F` · Cinzel/Karla/Cormorant.

Componentes reutilizáveis: `.btn/.btn-outline/.btn-oliva` (pílulas com brilho especular), `.moldura` (vidro claro + cantos dourados `.canto.tl/tr/bl/br`), `.divisor`, `.card-produto` (arte por categoria `.arte-1…6`), `.card-cat`, `.chip`, `.opcao`, `.resumo`, `.linha-tempo`, `.qtd`, `.campo`, `#toast`.

Breakpoints: `900px` (menu hambúrguer em vidro escuro, grids colapsam) · `600px` (mobile: hero empilhado, grade 1 coluna, chips com scroll horizontal, inputs 16px anti-zoom iOS) · `480px`/`380px` (telas mínimas). Fallback `@supports not (backdrop-filter)` aumenta opacidades; `prefers-reduced-motion` desliga aurora e transições.

---

## 7. Fluxos principais

**Compra:** `produtos.html` → filtros client-side sobre `listarProdutos()` → `Estado.add()` → badge header → `carrinho.html` lê `Estado.carrinho` + hidrata com `obterProduto` → `checkout.html` exige sessão (`login.html?volta=checkout.html`) → calcula `subtotal + frete()` → `criarPedido()` grava (localStorage ou POST) → limpa cesta → redireciona `pedido-detalhe.html?id=`.

**Sessão:** `Estado.sessao` = objeto usuário sem senha no `localStorage`. Header alterna ícone conta ↔ perfil. Cadastro grava em `gregorios_usuarios_extra` (F1) ou `INSERT` (F2).

**Favoritos:** coração em todo card → `Estado.toggleFav(id)` (instantâneo, localStorage) → se `MODO='php'` e há sessão, sincroniza com `setFavorito()`.

---

## 8. Testes executados nesta máquina

**Auditoria mobile completa (Puppeteer + Chrome headless, emulação touch):**

- ✅ **0 overflow horizontal** — 14 páginas × 4 viewports (320 / 375 / 393 / 412 px), `scrollWidth = innerWidth` em todas
- ✅ Menu hambúrguer: abre/fecha, `aria-expanded`, links com 49 px de altura (≥44 recomendado), fecha com `Esc` e clique fora
- ✅ Alvos de toque ≥ 40–44 px: ícones do header, botões −/+ de quantidade, chips, `.btn-mini`, links do rodapé e migalhas
- ✅ Chips do cardápio rolam horizontalmente dentro do próprio container (`overflow-x:auto` + `contain:inline-size`), sem estourar a página
- ✅ Inputs com `font-size:16px` (evita zoom automático no iOS)
- ✅ Fluxo funcional no mobile: filtro por categoria → produto (2×) → badge cesta → carrinho (R$ 149,80) → checkout entrega R$ 161,80 ↔ retirada Grátis com endereço oculto
- ✅ Metas mobile em todas as páginas: `viewport-fit=cover`, `theme-color` vinho, `format-detection`, `apple-touch-icon` 180×180
- ✅ JSONs válidos: 100 produtos / 6 categorias / 1 usuário / 2 pedidos; integridade `categoria_id` 100%
- ⚠️ `api/*.php` retorna erro de conexão sem MySQL ativo — esperado; o frontend ignora porque roda em `MODO='json'`

**Correção estrutural aplicada:** o cardápio (`produtos.html`) expandia o layout para ~1180 px em celulares. Causa raiz: `.chips` com `flex-wrap:nowrap` propagava a largura mínima dos chips (~1248 px) para `main` (flex item do `body`). Corrigido com `main{min-width:0}`, `html,body{overflow-x:hidden}` e `contain:inline-size` no `.chips`.
