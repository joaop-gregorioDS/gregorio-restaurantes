(async () => {
  const [cats, prods] = await Promise.all([Api.listarCategorias(), Api.listarProdutos()]);

  Ui.$('#grade').innerHTML = cats.map(c => {
    const doCat = prods.filter(p => p.categoria && p.categoria.id === c.id);
    const min = Math.min(...doCat.map(p => p.preco));
    return `
    <a class="card-cat" href="produtos.html?cat=${c.slug}" data-reveal>
      <span class="cat-ico">${c.icone}</span>
      <h3>${c.nome}</h3>
      <p class="cat-desc">${c.descricao}</p>
      <small>${doCat.length} itens · a partir de <strong>${Ui.fmt(min)}</strong></small><br>
      <span class="btn-mini btn-mini-cheio" style="margin-top:.9rem;display:inline-block">Ver itens →</span>
    </a>`;
  }).join('');

  Ui.reveal();
})();