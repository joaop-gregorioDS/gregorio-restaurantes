/* ═══ GREGÓRIOS · camada de dados ═══
   Integração com API Node.js / MongoDB
*/
const Api = (() => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const BASE_URL = isLocalhost ? 'http://localhost:5000/api' : 'https://sua-api-no-render.com/api';

  const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('gregorios_sessao'));
    return user ? user.token : null;
  };

  const getHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    const token = getAuthToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  const http = async (endpoint, opts = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    opts.headers = { ...getHeaders(), ...opts.headers };
    
    const r = await fetch(url, opts);
    const data = await r.json();
    if (!r.ok) throw new Error(data.message || 'Falha na requisição');
    return data;
  };

  const post = (endpoint, body) => http(endpoint, { method: 'POST', body: JSON.stringify(body) });
  const put = (endpoint, body) => http(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  const del = (endpoint) => http(endpoint, { method: 'DELETE' });

  /* catálogo */
  const listarCategorias = () => http('/products/categorias');
  async function listarProdutos(f = {}) {
    let prods = await http('/products');
    if (f.categoria) { 
        const cats = await listarCategorias(); 
        const c = cats.find(c => c.slug === f.categoria); 
        if (c) prods = prods.filter(p => p.categoria && p.categoria.id === c.id); 
    }
    if (f.busca) { const b = f.busca.toLowerCase(); prods = prods.filter(p => p.nome.toLowerCase().includes(b) || p.desc.toLowerCase().includes(b)); }
    if (f.destaque) prods = prods.filter(p => p.destaque);
    if (f.ordem === 'preco-asc') prods.sort((a, b) => a.preco - b.preco);
    if (f.ordem === 'preco-desc') prods.sort((a, b) => b.preco - a.preco);
    if (f.ordem === 'nome') prods.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    return prods;
  }
  const obterProduto = id => http(`/products/${id}`);
  const obterCategoria = async slug => (await listarCategorias()).find(c => c.slug === slug) || null;

  /* conta */
  async function login(email, senha) {
    try {
        const data = await post('/auth/login', { email, senha });
        return { ok: true, usuario: { ...data.user, token: data.token } };
    } catch(e) {
        return { ok: false, erro: e.message };
    }
  }
  const cadastrar = async dados => {
    try {
        const data = await post('/auth/register', dados);
        return { ok: true, usuario: { ...data.user, token: data.token } };
    } catch(e) {
        return { ok: false, erro: e.message };
    }
  };
  const salvarUsuario = async u => {
    try {
        const data = await put('/users/perfil', u);
        const sessao = JSON.parse(localStorage.getItem('gregorios_sessao'));
        localStorage.setItem('gregorios_sessao', JSON.stringify({ ...sessao, ...data }));
        return { ok: true };
    } catch (e) {
        return { ok: false, erro: e.message };
    }
  };

  /* pedidos */
  const listarPedidos = () => http('/orders/meus-pedidos');
  const obterPedido = id => http(`/orders/${id}`);
  const criarPedido = async payload => {
    // A API espera: { itens, total, tipo_entrega, endereco_entrega, forma_pagamento }
    return await post('/orders', payload);
  };

  /* favoritos */
  const listarFavoritos = () => http('/users/favoritos');
  const setFavorito = async (uid, pid, on) => {
    // API faz toggle no post
    try {
        await post(`/users/favoritos/${pid}`);
    } catch(e) {
        console.error('Erro ao atualizar favorito', e);
    }
  };

  return { listarCategorias, listarProdutos, obterProduto, obterCategoria, login, cadastrar, salvarUsuario, listarPedidos, obterPedido, criarPedido, listarFavoritos, setFavorito };
})();