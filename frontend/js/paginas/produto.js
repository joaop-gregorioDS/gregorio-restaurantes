(async () => {
  const p = await Api.obterProduto(Ui.qs('id'));
  const root = Ui.$('#conteudo');

  if (!p) {
    root.innerHTML = `<div class="vazio"><b>🤌</b>Este prato não está no cardápio de hoje.<br><br><a class="btn" href="produtos.html">Voltar ao cardápio</a></div>`;
    return;
  }

  const cats = await Api.listarCategorias();
  const cat = cats.find(c => c.id === p.categoria_id);
  const fav = Estado.ehFav(p.id);

  root.innerHTML = `
    <nav class="migalhas" aria-label="Você está em">
      <a href="index.html">Início</a> › <a href="produtos.html">Cardápio</a> ›
      <a href="produtos.html?cat=${cat.slug}">${cat.nome}</a> › <strong>${p.nome}</strong>
    </nav>
    <div class="produto-grade">
      <div class="moldura" style="padding:12px" data-reveal>
        <i class="canto tl"></i><i class="canto tr"></i><i class="canto bl"></i><i class="canto br"></i>
        <div class="card-arte arte-${p.categoria_id} produto-arte"><span>${p.emoji}</span>${p.destaque ? '<em class="selo-dourado">★ da casa</em>' : ''}</div>
      </div>
      <div class="produto-info" data-reveal>
        <div>${(p.tags || []).map(t => `<span class="tag${t === 'da casa' ? ' vinho' : ''}">${t}</span>`).join('')}</div>
        <h1>${p.nome}</h1>
        <p class="tagline">${cat.nome}</p>
        <p style="margin:.9rem 0">${p.desc}</p>
        <div class="harmoniza">🍷 Harmoniza com: ${p.harmoniza}</div>
        <div class="produto-preco">${Ui.fmt(p.preco)}</div>
        ${p.disponivel ? `
        <div class="compra-linha">
          <span class="qtd"><button id="menos" aria-label="Diminuir">−</button><b id="qtdv">1</b><button id="mais" aria-label="Aumentar">+</button></span>
          <button class="btn" id="add">🧺 Adicionar à Cesta</button>
          <button class="btn-mini" id="fav" style="font-size:.95rem;padding:.6rem 1.1rem">${fav ? '♥ Favorito' : '♡ Favoritar'}</button>
        </div>` : `<span class="esgotado">Esgotado hoje — volte amanhã</span>`}
        <div class="info-entrega">
          <span>🛵 Entrega ${Ui.EMPRESA.tempoEntrega} · R$ 12,00</span>
          <span>🏪 Retirada grátis no balcão · ${Ui.EMPRESA.tempoRetirada}</span>
        </div>
      </div>
    </div>`;

  if (p.disponivel) {
    let qtd = 1;
    const v = Ui.$('#qtdv');
    Ui.$('#mais').onclick = () => { qtd = Math.min(qtd + 1, 20); v.textContent = qtd; };
    Ui.$('#menos').onclick = () => { qtd = Math.max(qtd - 1, 1); v.textContent = qtd; };
    Ui.$('#add').onclick = () => { Estado.add(p.id, qtd); Ui.badges(); Ui.toast(`🧺 ${qtd}× ${p.nome} na cesta!`); };
    Ui.$('#fav').onclick = e => {
      Estado.toggleFav(p.id); Ui.badges();
      e.target.textContent = Estado.ehFav(p.id) ? '♥ Favorito' : '♡ Favoritar';
      Ui.toast(Estado.ehFav(p.id) ? '♥ Adicionado aos favoritos!' : 'Removido dos favoritos.');
    };
  }

  /* relacionados da mesma categoria */
  const rel = (await Api.listarProdutos({ categoria: cat.slug })).filter(x => x.id !== p.id).slice(0, 6);
  Ui.$('#relacionados').innerHTML = rel.map(Ui.cardProduto).join('');
  Ui.reveal();
})();