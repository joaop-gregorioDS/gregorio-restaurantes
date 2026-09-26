# Gregórios Restaurantes

Delivery de pizzaria e cozinha ítalo-brasileira de **demonstração**. O avaliador monta o pedido, entra com a conta demo, finaliza o checkout e acompanha o status.

Pagamento e entrega são simulados. O backend persiste pedidos e atualiza o estoque do catálogo de demonstração; não há cobrança nem operação logística reais.

[Live](https://gregorio-restaurantes.vercel.app)

---

## Demonstração

- **App:** [https://gregorio-restaurantes.vercel.app](https://gregorio-restaurantes.vercel.app)

### Conta de um clique

| E-mail | Senha |
| :--- | :--- |
| `cliente@gregorios.com.br` | `123456` |

**Caminho do avaliador:** cardápio → cesta → entrar → checkout (entrega ou retirada) → pedidos.

O histórico de pedidos exige JWT. No código atual, a criação do pedido aceita sessão opcional (`optionalAuth`), portanto a API também pode gravar um pedido sem login quando os dados do cliente são enviados.

---

## O que é real e o que é simulado

| Real (grava na API) | Simulado |
| :--- | :--- |
| Cadastro, login, JWT | Pagamento (Pix, cartão) |
| Cardápio e categorias | Cobrança e adquirente |
| Carrinho, pedido, status | Entrega física |
| Favoritos e perfil | Painel do restaurante |

---

## Código

```
frontend/     vitrine, cardápio, cesta, checkout
backend/      API Express, MongoDB, JWT
```

Stack: Vanilla JS · Express · MongoDB Atlas.

---

## Licença

Projeto de portfólio. Uso livre para avaliação.
