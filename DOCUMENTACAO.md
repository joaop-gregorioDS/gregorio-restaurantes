# 📖 Documentação do Projeto — Gregórios Restaurantes

Site completo de restaurante com cardápio, carrinho, checkout e área do cliente.
**Projeto de aprendizado** · dados 100% simulados na Fase 1 · pronto para MySQL na Fase 2.

> 🏠 **Endereço oficial:** Rua Tuiuti, 2122 – Tatuapé · São Paulo/SP · CEP 03307-005
> 📞 Tel: (11) 2225-4122 · WhatsApp: (11) 97225-4122

---

## ▶️ Como rodar local

O site usa `fetch()` para carregar os JSONs — **não abra os HTML com duplo clique**. Use um servidor local:

```bash
# Opção 1 — PHP (recomendada: já serve a Fase 2 também)
cd /Users/joaopaulogregorio/Documents/gregorio-restaurantes
php -S localhost:8080
# → http://localhost:8080

# Opção 2 — Acesso pelo celular na mesma rede Wi-Fi
php -S 0.0.0.0:8080
# → http://<SEU_IP>:8080   (descubra o IP com: ipconfig getifaddr en0)

# Opção 3 — VS Code Live Server (extensão) → botão "Go Live"

# Opção 4 — XAMPP/Laragon: copie a pasta para htdocs/ e acesse
# → http://localhost/gregorio-restaurantes
```

**Servidor atual desta máquina** (se estiver rodando): `http://192.168.68.113:8080` (rede) ou `http://localhost:8080`.

## 🔑 Login de demonstração

| Campo | Valor |
|-------|-------|
| E-mail | `cliente@gregorios.com.br` |
| Senha | `123456` |

Na Fase 1 a sessão fica no `localStorage`; novos cadastros também são salvos localmente.

---

## 🗺️ Mapa de páginas (14)

| Página | O que faz | Dados que consome |
|--------|-----------|-------------------|
| `index.html` | Vitrine: hero, letreiro animado, destaques, categorias, como funciona | `listarProdutos({destaque})`, `listarCategorias()` |
| `produtos.html` | Cardápio completo com busca, chips de categoria e ordenação | `listarProdutos({categoria,busca,ordem})` |
| `produto.html?id=` | Detalhe do prato: quantidade, favoritar, harmonização, relacionados | `obterProduto(id)` |
| `categorias.html` | As 6 cozinhas da casa com contagem de itens | `listarCategorias()` |
| `carrinho.html` | Cesta: alterar qtd, remover, esvaziar, resumo | `Estado.carrinho` (localStorage) |
| `checkout.html` | Entrega (frete R$ 12 / 45–60 min) ou retirada grátis (~30 min), pagamento Pix/cartão/dinheiro | `criarPedido(payload)` |
| `login.html` | Entrar na conta (validação + sessão local) | `Api.login()` |
| `cadastro.html` | Criar conta | `Api.cadastrar()` |
| `pedidos.html` | Histórico de pedidos com status | `listarPedidos(uid)` |
| `pedido-detalhe.html?id=` | Itens, valores e timeline de status do pedido | `obterPedido(id)` |
| `perfil.html` | Editar dados + endereços | `salvarUsuario()`, sessão |
| `favoritos.html` | Lista de desejos: remover, mover p/ cesta | `Estado.favoritos` |
| `contato.html` | Formulário + endereço/mapa Tatuapé | estático |
| `sobre.html` | História da casa desde 1987, linha do tempo, contadores | estático |

## ✨ Funcionalidades principais

- **Cardápio filtrável** — busca por nome/ingrediente (debounce 250ms), chips por categoria, ordenação por preço/nome/destaques.
- **Cesta persistente** — sobrevive a refresh e fechamento do navegador (`localStorage`).
- **Checkout com 2 modalidades** — entrega com frete fixo R$ 12,00 (45–60 min) ou retirada no balcão grátis (~30 min). Endereço só aparece na modalidade entrega.
- **Pagamento simulado** — Pix, cartão (com formulário fake e aviso de ambiente de teste) e dinheiro (com campo de troco).
- **Pedidos com status** — recebido → preparo → pronto → entrega/concluído (+ cancelado), exibidos em timeline visual.
- **Favoritos** — coração em qualquer card; badge no header sincroniza.
- **Header/footer dinâmicos** — injetados por `js/ui.js` em todas as páginas, com badges de cesta/favoritos em tempo real.
- **100% responsivo** — testado em 320–430 px (iPhone SE/14 Pro, Moto G) e tablet; menu hambúrguer acessível (Esc fecha, clique fora fecha, `aria-expanded`).
- **Acessibilidade** — foco visível dourado, `aria-label`s, suporte a `prefers-reduced-motion`.

## 🎨 Identidade visual

| Elemento | Definição |
|----------|-----------|
| Nome | Gregórios Restaurantes — monograma/brasão "GR" (`assets/img/logo.svg`) |
| Sistema | **Glass ("Aurora na Adega")** — fundo ambiente com blobs de luz + dois níveis de vidro: escuro (header/rodapé/toast) e claro (cards/molduras), com `backdrop-filter` e brilhos especulares |
| Paleta | Vinho `#5A1B2C` · Vinho escuro `#3F1220` · Creme `#F5EEDF` · Dourado `#C9A25C` · Oliva `#6D7C3F` |
| Tipografia | Cinzel (títulos) · Karla (texto) · Cormorant Garamond itálico (taglines) — Google Fonts com fallback serif/sans offline |
| Movimento | Letreiro marquee dos destaques, cards com leve inclinação no hover, revelação em cascata (`IntersectionObserver`), aurora flutuante (só `transform`) |
| Imagens | Placeholders emoji + gradiente por categoria (arte-1…arte-6); slots prontos para fotos reais |

## 🧪 Fluxo de teste recomendado (5 min)

1. `index.html` → toque em **Ver Cardápio**.
2. Em `produtos.html`, filtre por **Pizzas**, busque "burrata", ordene por menor preço.
3. Abra **Pizza Burrata & Parma** → qtd 2 → **Adicionar à Cesta**.
4. Adicione um vinho (taça) pela grade → abra a **Cesta** → ajuste quantidades.
5. **Finalizar Pedido** → entre com o login demo → escolha **Retirada** (frete vira Grátis) → **Pagar Agora**.
6. Você cai em `pedido-detalhe.html` com a timeline **Recebido** ativa.
7. Favoritar 2 pratos → conferir `favoritos.html` e o badge do coração.

## 🗄️ Banco de dados (Fase 2)

Guias separados:
- **Popular o banco:** [`sql/COMO_POPULAR.md`](sql/COMO_POPULAR.md) (passo a passo XAMPP/Laragon/Homebrew/Docker + script automático `scripts/popular-banco.sh`)
- **Arquitetura e stack:** [`ARQUITETURA.md`](ARQUITETURA.md)

Resumo rápido:
```bash
mysql -u root < sql/schema.sql     # cria gregorio_db + 7 tabelas + seed mínimo
mysql -u root < sql/seed.sql       # popula tudo (100 produtos, usuário demo, pedidos...)
# depois: js/api.js → const MODO = 'php'
```

## 📁 Estrutura de pastas

```
gregorio-restaurantes/
├── *.html .................... 14 páginas
├── css/base.css .............. design system (paleta, componentes, responsivo)
├── css/paginas.css ........... estilos específicos (catálogo, compra, pedidos)
├── js/api.js ................. camada de dados (MODO 'json' ↔ 'php')
├── js/estado.js .............. carrinho, favoritos, sessão (localStorage)
├── js/ui.js .................. header/footer, toasts, formatação R$, cards
├── js/paginas/*.js ........... 1 script por página
├── dados/*.json .............. banco simulado da Fase 1
├── api/*.php ................. endpoints PHP+PDO (Fase 2)
├── sql/schema.sql ............ DDL completo (7 tabelas)
├── sql/seed.sql .............. dados de exemplo completos
├── sql/COMO_POPULAR.md ....... guia de população do banco
├── scripts/popular-banco.sh .. automatiza schema + seed
├── assets/img/ ............... logo.svg (brasão GR) + PNGs da marca
├── DOCUMENTACAO.md ........... este arquivo
└── ARQUITETURA.md ............ arquitetura técnica e stack
```
