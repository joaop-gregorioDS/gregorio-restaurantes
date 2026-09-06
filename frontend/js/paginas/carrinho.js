(async () => {
  const area = Ui.$('#area');

  async function render(){
    if (!Estado.carrinho.length) {
      area.innerHTML = `<div class="vazio"><b>🧺</b>Sua cesta está vazia — o forno, porém, está aceso.<br><br><a class="btn" href="produtos.html">Ver cardápio</a></div>`;
      return;
    }
    const prods = await Api.listarProdutos();
    const itens = Estado.carrinho.map(i => ({ i, p: prods.find(p => p.id === i.id) })).filter(x => x.p);
    const subtotal = itens.reduce((s, x) => s + x.p.preco * x.i.qtd, 0);

    area.innerHTML = `<div class="compra-grade">
      <div>
        ${itens.map(({ i, p }) => `
        <div class="carrinho-item" data-reveal>
          <span class="emoji arte-${p.categoria_id}">${p.emoji}</span>
          <div style="flex:1"><strong><a href="produto.html?id=${p.id}" style="color:var(--vinho);text-decoration:none">${p.nome}</a></strong><br><small style="color:var(--suave)">${Ui.fmt(p.preco)} cada</small></div>
          <span class="qtd"><button data-menos="${p.id}" aria-label="Diminuir">−</button><b>${i.qtd}</b><button data-mais="${p.id}" aria-label="Aumentar">+</button></span>
          <strong class="preco" style="min-width:92px;text-align:right">${Ui.fmt(p.preco * i.qtd)}</strong>
          <button class="btn-mini" data-rm="${p.id}" title="Remover">✕</button>
        </div>`).join('')}
        <button class="limpar-link" id="limpar">esvaziar cesta</button>
      </div>
      <aside class="resumo coluna-sticky">
        <h3>Resumo</h3>
        <div class="resumo-corpo">
          <div class="resumo-linha"><span>Subtotal</span><span>${Ui.fmt(subtotal)}</span></div>
          <div class="resumo-linha"><span>Frete</span><small style="color:var(--suave)">definido no checkout</small></div>
          <div class="resumo-linha resumo-total"><span>Total</span><span class="preco">${Ui.fmt(subtotal)}</span></div>
          <a class="btn" href="checkout.html">Finalizar Pedido</a>
          <a class="btn btn-outline" href="produtos.html">Continuar comprando</a>
        </div>
      </aside>
    </div>`;

    area.querySelectorAll('[data-mais]').forEach(b => b.onclick = () => { Estado.add(+b.dataset.mais, 1); Ui.badges(); render(); });
    area.querySelectorAll('[data-menos]').forEach(b => b.onclick = () => { const id = +b.dataset.menos; Estado.setQtd(id, Estado.carrinho.find(i => i.id === id).qtd - 1); Ui.badges(); render(); });
    area.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { Estado.remover(+b.dataset.rm); Ui.badges(); Ui.toast('Item removido da cesta.'); render(); });
    Ui.$('#limpar').onclick = () => { Estado.limpar(); Ui.badges(); Ui.toast('Cesta esvaziada.'); render(); };
    Ui.reveal();
  }
  render();
})();