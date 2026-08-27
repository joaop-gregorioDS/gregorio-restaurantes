# 🍷 Gregórios Restaurantes — Full-Stack MERN

Projeto de aprendizado Full-Stack abrangendo Front-end (Vanilla JS) e Back-end (Node.js/Express + MongoDB Atlas). 
Rua Tuiuti, 2122 – Tatuapé · São Paulo/SP · CEP 03307-005

## 📚 Documentação completa

| Documento | Conteúdo |
| :--- | :--- |
| [DOCUMENTACAO.md](./DOCUMENTACAO.md) | Guia do projeto: páginas, funcionalidades, fluxo de teste, como rodar |
| [ARQUITETURA.md](./ARQUITETURA.md) | Stack, camadas, contrato da API, modelo de dados Mongoose, design system |

## ▶️ Como rodar localmente

Este projeto utiliza uma arquitetura separada entre a API (Back-end) e o Site (Front-end).

### 1. Back-end (API Node.js)
Abra um terminal na pasta `backend/`:
```bash
cd backend
npm install
npm start
```
*A API ficará disponível em http://localhost:5000*

### 2. Front-end (Vanilla JS)
Abra a pasta `frontend/` e sirva os arquivos estáticos.
* **VS Code:** Use a extensão **Live Server** e clique em *Go Live*.
* **Node:** `npx serve frontend`
*A aplicação vai rodar em http://127.0.0.1:5500*

**Login demo:** `cliente@gregorios.com.br` · senha `senha`

## ☁️ Conexão com MongoDB Atlas

O banco de dados do projeto está hospedado na nuvem (MongoDB Atlas). Para conectar a API ao banco, certifique-se de configurar a variável de ambiente `MONGODB_URI` no arquivo `.env` localizado na pasta `backend/`.

## 🧱 Estrutura de Diretórios

- **`frontend/`**: Aplicação SPA em HTML/CSS/JS puro (Vanilla).
  - `css/`: Design system e responsividade.
  - `js/`: Camada de dados (`api.js`), estado (`estado.js`), componentes (`ui.js`) e controladores de página.
- **`backend/`**: API RESTful em Node.js com Express e Mongoose.
  - `models/`: Schemas do MongoDB (User, Product, Order, Category).
  - `routes/`: Endpoints da API.
  - `middleware/`: Autenticação e validação (JWT/Tokens).