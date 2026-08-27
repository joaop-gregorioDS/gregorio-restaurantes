(async () => {
  const area = Ui.$('#area');

  if (!Estado.sessao) {
    area.innerHTML = `<div class="vazio"><b>🔐</b>Entre para ver seu histórico de pedidos.<br><br><a class="btn" href="login.html?volta=pedidos.html">Entrar</a></div>`;
    return;
  }

  const pedidos = await Api.listarPedidos(Estado.sessao.id);
  if (!pedidos.length) {
    area.innerHTML = `<div class="vazio"><b>🧾</b>Você ainda não fez pedidos na casa.<br><br><a class="btn" href="produtos.html">Fazer meu primeiro pedido</a></div>`;
    return;
  }

  area.innerHTML = `<p class="contagem" style="margin-bottom:1.1rem">${pedidos.length} ${pedidos.length === 1 ? 'pedido' : 'pedidos'}</p>` +
    pedidos.map(p => `
    <a class="pedido-card" href="pedido-detalhe.html?id=${p.id}" data-reveal>
      <div><h3>Pedido #${p.numero || p.id.slice(-4).toUpperCase()}</h3>
        <p class="pedido-meta">${new Date(p.createdAt || p.criado_em).toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })}
        · ${p.tipo_entrega === 'delivery' ? '🛵 Entrega' : '🏪 Retirada'} · ${p.itens.length} ${p.itens.length === 1 ? 'item' : 'itens'}</p></div>
      <span class="status-badge ${p.status}">${Ui.STATUS[p.status]}</span>
      <strong class="preco">${Ui.fmt(p.total)}</strong>
      <span class="btn-mini">Ver detalhes →</span>
    </a>`).join('');

  Ui.reveal();
})();