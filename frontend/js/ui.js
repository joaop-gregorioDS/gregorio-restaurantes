/* ═══ GREGÓRIOS · UI compartilhada ═══ */
const Ui = (() => {
  const $ = s => document.querySelector(s);
  const fmt = n => n.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
  const qs = k => new URLSearchParams(location.search).get(k);
  const STATUS = { 
    recebido:'Recebido', preparo:'Em preparo', pronto:'Pronto', entrega:'Em entrega', concluido:'Concluído', cancelado:'Cancelado',
    pendente:'Recebido', preparando:'Em preparo', saiu_entrega:'Em entrega', entregue:'Concluído'
  };
  const EMPRESA = { nome:'Gregórios Restaurantes', rua:'Rua Tuiuti, 2122', bairro:'Tatuapé', cidade:'São Paulo/SP', cep:'CEP 03307-005', tel:'(11) 2225-4122', whats:'(11) 97225-4122', email:'joaop.gregorio@outlook.com', frete:12, tempoEntrega:'45–60 min', tempoRetirada:'~30 min' };

  const ico = {
    cesta:'<svg viewBox="0 0 24 24"><path d="M6 7h12l1.5 13h-15L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>',
    coracao:'<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.6-9.2-9C1.2 7.6 3 4.5 6.2 4.5c2 0 3.4 1.1 4.3 2.6.9-1.5 2.3-2.6 4.3-2.6 3.2 0 5 3.1 3.4 6.5C16 15.4 12 20 12 20z"/></svg>',
    usuario:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 5-5 8-5s6.5 1 8 5"/></svg>'
  };

  function ambiente(){
    if (document.querySelector('.aurora')) return;
    const d = document.createElement('div');
    d.className = 'aurora'; d.setAttribute('aria-hidden','true');
    d.innerHTML = '<i class="ab1"></i><i class="ab2"></i><i class="ab3"></i>';
    document.body.prepend(d);
  }

  function cabecalho(){
    const el = $('#cabecalho'); if (!el) return;
    const pag = location.pathname.split('/').pop() || 'index.html';
    const at = p => pag === p ? ' class="ativo"' : '';
    el.innerHTML = `
    <div class="topo"><div class="topo-barra wrap"><span>📍 ${EMPRESA.rua} – ${EMPRESA.bairro} · ${EMPRESA.cep}</span><span>🕐 Ter–Dom · 11h às 23h</span></div></div>
    <div class="topo-nav"><div class="nav-inner">
      <a class="logo" href="index.html"><img src="assets/img/logo.svg" alt="Brasão Gregórios Restaurantes"><span class="logo-word">Gregórios<small>Restaurantes</small></span></a>
      <button class="hamb" id="hamb" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu">☰</button>
      <nav id="menu" aria-label="Navegação principal"><ul>
        <li><a${at('index.html')} href="index.html">Início</a></li>
        <li><a${at('produtos.html')} href="produtos.html">Cardápio</a></li>
        <li><a${at('categorias.html')} href="categorias.html">Categorias</a></li>
        <li><a${at('sobre.html')} href="sobre.html">Sobre</a></li>
        <li><a${at('contato.html')} href="contato.html">Contato</a></li>
      </ul></nav>
      <div class="icones">
        <a class="icone-btn" href="favoritos.html" title="Favoritos" aria-label="Favoritos">${ico.coracao}<span class="badge" id="badge-fav" hidden></span></a>
        <a class="icone-btn" href="carrinho.html" title="Cesta" aria-label="Cesta">${ico.cesta}<span class="badge" id="badge-cart" hidden></span></a>
        <a class="icone-btn" href="${Estado.sessao ? 'perfil.html' : 'login.html'}" title="Minha conta" aria-label="Minha conta">${ico.usuario}</a>
      </div>
    </div></div>`;
    const hamb = $('#hamb'), menu = $('#menu');
    const fechar = () => { menu.classList.remove('aberto'); hamb.setAttribute('aria-expanded','false'); hamb.textContent='☰'; hamb.setAttribute('aria-label','Abrir menu'); document.body.style.overflow=''; };
    const abrir = () => { menu.classList.add('aberto'); hamb.setAttribute('aria-expanded','true'); hamb.textContent='✕'; hamb.setAttribute('aria-label','Fechar menu'); if(window.innerWidth<=900) document.body.style.overflow='hidden'; };
    hamb.addEventListener('click', e => { e.stopPropagation(); menu.classList.contains('aberto') ? fechar() : abrir(); });
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click', fechar));
    document.addEventListener('click', e => { if(menu.classList.contains('aberto') && !menu.contains(e.target) && !hamb.contains(e.target)) fechar(); });
    document.addEventListener('keydown', e => { if(e.key==='Escape' && menu.classList.contains('aberto')) fechar(); });
    window.addEventListener('resize', () => { if(window.innerWidth>900) fechar(); });
    badges();
  }

  function rodape(){
    const el = $('#rodape'); if (!el) return;
    el.innerHTML = `
    <footer class="rodape">
      <div class="wrap rodape-grade">
        <div><h4>Gregórios</h4><p style="font-size:.88rem;opacity:.9">Pizzaria, Cozinha Mediterrânea &amp; Grelhados.<br><em style="font-family:var(--fi)">Tradição Ítalo-Brasileira | Vinhos Selecionados</em></p></div>
        <div><h4>Contato</h4><ul><li>${EMPRESA.rua} - ${EMPRESA.bairro}</li><li>${EMPRESA.cidade} – ${EMPRESA.cep}</li><li>Tel: <a href="tel:+551122254122">${EMPRESA.tel}</a></li><li>WhatsApp: <a href="https://wa.me/5511972254122" target="_blank" rel="noopener">${EMPRESA.whats}</a></li><li><a href="mailto:${EMPRESA.email}">${EMPRESA.email}</a></li></ul></div>
        <div><h4>Tech Stack</h4><ul><li>Node.js & Express</li><li>MongoDB Atlas</li><li>JavaScript Vanilla</li><li>HTML5 & CSS3 (Sem libs)</li></ul></div>
        <div><h4>Navegue</h4><ul>
          <li><a href="produtos.html">Cardápio</a></li><li><a href="carrinho.html">Minha cesta</a></li>
          <li><a href="pedidos.html">Meus pedidos</a></li><li><a href="sobre.html">Nossa história</a></li><li><a href="contato.html">Fale conosco</a></li>
        </ul></div>
      </div>
      <div class="rodape-bottom">© 2026 Gregórios Restaurantes · Desenvolvimento Full-Stack · MERN Stack Application</div>
    </footer>`;
  }

  function badges(){
    const bc = $('#badge-cart'), bf = $('#badge-fav');
    const n = Estado.carrinho.reduce((s,i)=>s+i.qtd,0);
    bc.hidden = !n; bc.textContent = n;
    bf.hidden = !Estado.favoritos.length; bf.textContent = Estado.favoritos.length;
  }

  let toastTimer;
  function toast(msg){
    let t = $('#toast');
    if (!t){ t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('mostrar');
    clearTimeout(toastTimer); toastTimer = setTimeout(()=>t.classList.remove('mostrar'), 2600);
  }

  function reveal(){
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('visivel'); io.unobserve(e.target); } }), { threshold:.12 });
    document.querySelectorAll('[data-reveal]:not(.visivel)').forEach(el => io.observe(el));
  }

  function cardProduto(p){
    const fav = Estado.ehFav(p.id);
    return `<article class="card-produto" data-reveal>
      <a class="card-arte arte-${p.categoria_id}" href="produto.html?id=${p.id}"><span>${p.emoji}</span>${p.destaque ? '<em class="selo-dourado">★ da casa</em>' : ''}</a>
      <div class="card-corpo">
        <h3><a href="produto.html?id=${p.id}">${p.nome}</a></h3>
        <p class="card-desc">${p.desc}</p>
        <div>${(p.tags||[]).map(t=>`<span class="tag${t==='da casa'?' vinho':''}">${t}</span>`).join('')}</div>
        <div class="card-rodape"><strong class="preco">${fmt(p.preco)}</strong>
          <span class="card-acoes"><button class="btn-mini" data-fav="${p.id}" title="Favoritar">${fav?'♥':'♡'}</button>
          <button class="btn-mini btn-mini-cheio" data-add="${p.id}">+ Cesta</button></span>
        </div>
      </div></article>`;
  }

  /* delegação global: adicionar à cesta / favoritar em qualquer página */
  document.addEventListener('click', async e => {
    const add = e.target.closest('[data-add]');
    if (add){ const p = await Api.obterProduto(add.dataset.add); Estado.add(p.id,1); badges(); toast(`😋 ${p.nome} adicionado à cesta!`); }

    const fav = e.target.closest('[data-fav]');
    if (fav){
      const id = fav.dataset.fav; Estado.toggleFav(id);
      const on = Estado.ehFav(id);
      fav.textContent = on ? '♥' : '♡'; badges();
      toast(on ? '♥ Adicionado aos favoritos!' : 'Removido dos favoritos.');
      if (Estado.sessao) Api.setFavorito(Estado.sessao.id, id, on);
    }
  });

  document.addEventListener('DOMContentLoaded', () => { ambiente(); cabecalho(); rodape(); reveal(); });
  return { $, fmt, qs, toast, reveal, badges, cardProduto, STATUS, EMPRESA };
})();