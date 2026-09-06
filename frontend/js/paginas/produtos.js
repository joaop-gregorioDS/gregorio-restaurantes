(async () => {
  const cats = await Api.listarCategorias();
  const estado = { cat: Ui.qs('cat') || '', busca: Ui.qs('busca') || '', ordem: '' };
  const chips = Ui.$('#chips'), grade = Ui.$('#grade'), busca = Ui.$('#busca');

  chips.innerHTML =
    `<button type="button" class="chip ${!estado.cat ? 'ativo' : ''}" data-cat="">🍽️ Todas</button>` +
    cats.map(c => `<button type="button" class="chip ${estado.cat === c.slug ? 'ativo' : ''}" data-cat="${c.slug}">${c.icone} ${c.nome}</button>`).join('');
  if (estado.busca) busca.value = estado.busca;

  async function render(){
    const prods = await Api.listarProdutos({
      categoria: estado.cat || undefined,
      busca: estado.busca || undefined,
      ordem: estado.ordem || undefined
    });
    /* sem ordenação escolhida: destaques primeiro */
    if (!estado.ordem) prods.sort((a,b) => (b.destaque?1:0) - (a.destaque?1:0));
    Ui.$('#contagem').textContent = `${prods.length} ${prods.length === 1 ? 'item' : 'itens'}`;
    grade.innerHTML = prods.length
      ? prods.map(Ui.cardProduto).join('')
      : `<div class="vazio" style="grid-column:1/-1"><b>🤌</b>Nada encontrado por aqui…<br><br><button class="btn" onclick="location.href='produtos.html'">Ver todo o cardápio</button></div>`;
    Ui.reveal();
  }

  chips.addEventListener('click', e => {
    const ch = e.target.closest('.chip'); if (!ch) return;
    chips.querySelectorAll('.chip').forEach(c => c.classList.remove('ativo'));
    ch.classList.add('ativo');
    estado.cat = ch.dataset.cat;
    history.replaceState(null, '', estado.cat ? `?cat=${estado.cat}` : 'produtos.html');
    render();
  });

  let t;
  busca.addEventListener('input', e => { clearTimeout(t); t = setTimeout(() => { estado.busca = e.target.value.trim(); render(); }, 250); });
  Ui.$('#ordem').addEventListener('change', e => { estado.ordem = e.target.value; render(); });

  render();
})();