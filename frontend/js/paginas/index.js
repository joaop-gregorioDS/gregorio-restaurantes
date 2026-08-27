(async () => {
  const [prods, cats] = await Promise.all([Api.listarProdutos(), Api.listarCategorias()]);

  /* letreiro com os destaques da casa */
  const destaques = prods.filter(p => p.destaque);
  const trilha = destaques.map(p => `${p.emoji} ${p.nome} · ${Ui.fmt(p.preco)}`).join('  ✦  ') + '  ✦  ';
  Ui.$('#letreiro').innerHTML = `<span>${trilha}</span><span>${trilha}</span>`;

  Ui.$('#destaques').innerHTML = destaques.map(Ui.cardProduto).join('');

  Ui.$('#cats').innerHTML = cats.map(c => `
    <a class="card-cat" href="produtos.html?cat=${c.slug}" data-reveal>
      <span class="cat-ico">${c.icone}</span><h3>${c.nome}</h3>
      <small>${prods.filter(p => p.categoria_id === c.id).length} itens</small>
    </a>`).join('');

  Ui.reveal();
})();