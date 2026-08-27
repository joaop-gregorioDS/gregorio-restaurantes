# 🏗️ Arquitetura do Sistema

O **Gregórios Restaurantes** adota o padrão **MERN Stack** moderno, mas substituindo o React por **Vanilla JavaScript** no front-end para demonstrar domínio profundo do DOM, Fetch API e CSS Grid/Flexbox sem dependência de bibliotecas pesadas.

---

## 🛠️ Stack Tecnológica

### Back-end (API REST)
* **Node.js & Express**: Roteamento, middlewares e controle de fluxo.
* **MongoDB Atlas & Mongoose**: Banco de dados NoSQL em nuvem (DBaaS) e modelagem de dados orientada a objetos (ODM).
* **CORS & Dotenv**: Controle de acesso HTTP e variáveis de ambiente (credenciais).

### Front-end (Single-Page-like Application)
* **HTML5 Semântico**: Estruturação acessível.
* **CSS3 Nativo**: Variáveis CSS, Flexbox, CSS Grid, responsividade (Mobile-First) e efeitos Glassmorphism.
* **JavaScript (ES6+)**: Funções assíncronas (`async/await`), Fetch API, manipulação direta de DOM e Web Storage (`localStorage`).

---

## 📂 Camadas do Front-end

A estrutura lógica em `frontend/js/` é baseada em três pilares:

1. **`api.js` (Camada de Dados / Serviço):** Único ponto do sistema que conversa com a API Node.js. Abstrai as requisições `fetch()`, headers de autenticação e rotas.
2. **`estado.js` (Gerência de Estado):** Singleton que cuida dos dados voláteis e persistentes do navegador (Sessão de usuário, itens do carrinho).
3. **`ui.js` (Componentes & UI):** Funções utilitárias de formatação monetária, toasts de notificação, modais e o "Data Binding" injetando cabeçalhos e rodapés na página.

---

## 🗄️ Modelo de Dados (MongoDB)

O banco de dados (MongoDB Atlas) possui as seguintes coleções, gerenciadas pelos Schemas do Mongoose:

* **Users (`/models/User.js`)**: Armazena clientes. Possui array de endereços embutidos para facilitar a entrega.
* **Products (`/models/Product.js`)**: Itens do cardápio. Possui referência (ObjectId) para a coleção de Categories.
* **Categories (`/models/Category.js`)**: Departamentos (Ex: Pizzas, Adega, Sobremesas).
* **Orders (`/models/Order.js`)**: Pedidos fechados. Possui um array de itens (produto populado, preço congelado no momento da compra e quantidade), cálculo de frete/total e um controle de `status` (pendente, preparando, saiu_entrega, entregue).

*(Todos os IDs devolvidos pela API sofrem uma transformação Mongoose `toJSON` para converter `_id` nativo em `id` legível pelo front-end).*
