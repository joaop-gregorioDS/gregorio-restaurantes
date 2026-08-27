# 📖 Documentação e Guia de Uso

O projeto simula a experiência completa de um e-commerce/delivery de um restaurante italiano.

## 🧭 Fluxo de Telas (User Journey)

1. **`index.html` (Landing Page):** Apresentação do restaurante, explicação do modelo de negócio (delivery ou balcão) e destaques do cardápio.
2. **`categorias.html`:** Visão em Grid das famílias de pratos (Pizzas, Mediterrâneo, Bebidas, etc).
3. **`produtos.html`:** O cardápio completo. Possui sistema de filtros em abas (Chips), campo de busca por nome/ingrediente, e ordenação (Preço Crescente/Decrescente).
4. **`produto.html`:** Detalhe de um único item com foto em alta qualidade, tag de sugestão de harmonização e botão de adição ao carrinho.
5. **`carrinho.html`:** A cesta do usuário. Permite alterar quantidades, remover itens e conferir o subtotal dinâmico.
6. **`checkout.html`:** Finalização. Requer login (`login.html`) ou cadastro (`cadastro.html`). Possui cálculo de taxa de entrega dinâmico (grátis se retirada no balcão) e simulador de cartão de crédito.
7. **`pedidos.html` & `pedido-detalhe.html`:** Histórico de compras do cliente logado, contendo a linha do tempo (status) do pedido gerado em tempo real pelo banco de dados.

## 🧪 Como Testar as Funcionalidades

### 1. Sistema de Carrinho e Persistência
Navegue pelo cardápio, adicione itens na cesta e feche a aba do navegador. Abra novamente. O carrinho continuará salvo no seu computador (via `localStorage`), não se perdendo até a finalização do checkout.

### 2. Autenticação e Checkout
Para visualizar o fluxo final, utilize a conta de demonstração:
* **E-mail:** `cliente@gregorios.com.br`
* **Senha:** `senha` *(ou 123456)*

Isso gerará um Token no Back-end e validará seu acesso.
Na tela de checkout, alterne entre "Entrega" e "Retirada". A taxa de R$ 12,00 do frete será adicionada/removida instantaneamente.

### 3. Validações e Toasts
Tente avançar no fluxo de checkout informando um "Cartão de Crédito" sem digitar os números, ou deixando o endereço em branco na opção "Entrega". A camada de UI interceptará com um pop-up (Toast) amigável no canto inferior esquerdo.

## 🚀 Próximos Passos (Possíveis Evoluções)

* Construção de um Painel de Administração (`/admin`) em React.js para que o dono do restaurante mude o status dos pedidos para "Em preparo" ou "Em entrega", refletindo instantaneamente no Front-end do cliente.
* Implementação do WebSockets (Socket.io) para a atualização da "Linha do Tempo" do pedido ao vivo na tela do usuário, sem precisar recarregar a página.
