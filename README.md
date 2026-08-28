# 🍷 Gregórios Restaurantes — Full-Stack MERN

[![Deploy Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://gregorio-restaurantes.vercel.app/)
[![Deploy Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=for-the-badge&logo=netlify)](https://gregorio-restaurantes.netlify.app/)
[![API Render](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render)](https://gregorio-restaurantes-api.onrender.com)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/cloud/atlas)

> **Acesse o projeto rodando ao vivo:** [https://gregorio-restaurantes.netlify.app/](https://gregorio-restaurantes.netlify.app/)

Projeto de portfólio Full-Stack simulando um e-commerce/delivery de restaurante, com separação completa entre Front-end e Back-end.

## 🚀 Tecnologias e Arquitetura

O projeto adota o **MERN Stack** moderno, focando em aprofundar conhecimentos nos fundamentos da Web (Vanilla JS) e na criação de APIs robustas.

- **Front-end:** HTML5, CSS3 Grid/Flexbox, Vanilla JavaScript (Manipulação de DOM, Fetch API, LocalStorage).
- **Back-end:** Node.js, Express, Middlewares de Autenticação.
- **Banco de Dados:** MongoDB Atlas & Mongoose (ODM).
- **Infraestrutura/Deploy:** Netlify & Vercel (Front-end em Deploy Multi-plataforma para Alta Disponibilidade), Render.com (Back-end/API REST).

## 🌍 Arquitetura Distribuída e Alta Disponibilidade

Este projeto foi desenhado para simular um ambiente corporativo real de **Alta Disponibilidade (High Availability)** utilizando uma estratégia de deploy multi-plataforma:

1. **Back-end Centralizado (Render.com):** A API e a lógica de negócios rodam de forma centralizada e independente em contêineres na nuvem, conectando-se ao MongoDB Atlas.
2. **Front-end Multi-CDN (Vercel & Netlify):** O código cliente (Vanilla JS) foi hospedado simultaneamente em duas das maiores CDNs (Content Delivery Networks) do mundo. Isso garante que, se uma infraestrutura sofrer instabilidade, a outra assume imediatamente o tráfego do restaurante, sem interrupção para o cliente.

## 📚 Documentação Adicional

Para se aprofundar em como o sistema foi estruturado e testar as rotas, acesse os guias abaixo:

- [📄 DOCUMENTACAO.md](./DOCUMENTACAO.md) — Guia de funcionalidades, fluxos do usuário e testes.
- [🏗️ ARQUITETURA.md](./ARQUITETURA.md) — Contratos, modelagem de dados e decisões de infraestrutura.

## ▶️ Como rodar o projeto localmente

### 1. Configurar a API (Back-end)
Abra o terminal na pasta raiz e entre no diretório do servidor:
```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend/` e adicione a sua URI do MongoDB Atlas e o secret do JWT:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<usuario>:<senha>@cluster.mongodb.net/meu_banco
JWT_SECRET=super_secret_jwt_key
```

Inicie o servidor:
```bash
npm start
```
*A API ficará disponível em http://localhost:5000*

### 2. Rodar a Interface (Front-end)
O Front-end consumirá automaticamente a API hospedada em produção ou o `localhost` caso você esteja desenvolvendo.

Abra a pasta `frontend/` no VS Code, instale a extensão **Live Server** e clique em *Go Live*. (Alternativamente, use `npx serve frontend`).

> **Login para testar o checkout:**
> **E-mail:** `cliente@gregorios.com.br` | **Senha:** `senha`

---
*Desenvolvido por João P. Gregório.*
