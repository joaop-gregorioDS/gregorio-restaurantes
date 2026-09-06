(async () => {
  const area = Ui.$('#area');
  const ids = Estado.favoritos;

  if (!ids.length) {
    area.innerHTML = `<div class="vazio"><b>♡</b>Sua lista de favoritos ainda está vazia.<br>Toque no coração dos pratos para guardá-los aqui.<br><br><a class="btn" href="produtos.html">Explorar o cardápio</a></div>`;
    return;
  }

  const prods = await Api.listarProdutos();
  const favs = prods.filter(p => ids.includes(p.id));

  area.innerHTML = `
    <p class="contagem" style="margin-bottom:1.1rem">${favs.length} ${favs.length === 1 ? 'item favorito' : 'itens favoritos'}</p>
    <div class="grade-produtos">${favs.map(Ui.cardProduto).join('')}</div>`;

  Ui.reveal();
})();