# Gregórios Restaurantes

Delivery de pizzaria e cozinha ítalo-brasileira de **demonstração**. O avaliador monta o pedido, entra com a conta demo, finaliza o checkout e acompanha o status.

Pagamento, entrega e estoque são simulados. Não há cobrança real.

[Live](https://gregorio-restaurantes.vercel.app)

---

## Demonstração

- **App:** [https://gregorio-restaurantes.vercel.app](https://gregorio-restaurantes.vercel.app)

### Conta de um clique

| E-mail | Senha |
| :--- | :--- |
| `cliente@gregorios.com.br` | `123456` |

**Caminho do avaliador:** cardápio → cesta → entrar → checkout (entrega ou retirada) → pedidos.

Rotas de conta e pedido exigem JWT. Sem token, o checkout e o histórico respondem **401**.

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
