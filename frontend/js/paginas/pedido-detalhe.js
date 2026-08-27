(async () => {
  const area = Ui.$('#area');
  const p = await Api.obterPedido(Ui.qs('id'));

  if (!p) {
    area.innerHTML = `<div class="vazio"><b>👀</b>Pedido não encontrado.<br><br><a class="btn" href="pedidos.html">Meus pedidos</a></div>`;
    return;
  }

  const prods = await Api.listarProdutos();
  const PAG = { pix:'⚡ Pix', cartao:'💳 Cartão de crédito', dinheiro:'💵 Dinheiro' };
  const entrega = p.tipo_entrega === 'delivery';
  
  // Mapear status do Mongoose ['pendente', 'preparando', 'saiu_entrega', 'entregue', 'cancelado']
  const passos = entrega ? ['pendente','preparando','saiu_entrega','entregue'] : ['pendente','preparando','entregue'];
  const rotulos = { pendente:'Recebido', preparando:'Em preparo',
    saiu_entrega:'Em entrega', entregue: entrega ? 'Concluído' : 'Retirado' };
  const idx = p.status === 'cancelado' ? -1 : passos.indexOf(p.status);

  // Fallbacks temporários, já que o back-end não salvou frete e subtotal
  const frete = entrega ? Ui.EMPRESA.frete : 0;
  const subtotal = p.total - frete;
  const dataCriacao = p.createdAt || p.criado_em || new Date();

  area.innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;justify-content:space-between">
      <div><h2 style="font-size:1.5rem;letter-spacing:.08em">Pedido #${p.numero || p.id.slice(-4).toUpperCase()}</h2>
        <p class="pedido-meta">${new Date(dataCriacao).toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })} · ${entrega ? '🛵 Entrega' : '🏪 Retirada'}</p></div>
      <span class="status-badge ${p.status}">${rotulos[p.status] || p.status}</span>
    </div>

    ${p.status === 'cancelado'
      ? '<p class="aviso-demo" style="margin-top:1.2rem">Este pedido foi cancelado. Qualquer coisa, chame a casa no (11) 2225-4122.</p>'
      : `<div class="linha-tempo">${passos.map((s, i) => `
        <div class="lt-passo ${i <= idx ? 'feito' : ''}"><span class="bola">${i <= idx ? '✓' : ''}</span><small>${rotulos[s]}</small></div>`).join('')}</div>`}

    <div class="detalhe-grade">
      <div>
        <h3 style="margin-bottom:.8rem">Itens do Pedido</h3>
        ${p.itens.map(i => { const pr = i.produto && i.produto.nome ? i.produto : prods.find(x => x.id === (i.produto_id || i.produto || (i.produto && i.produto.id))); return `
          <div class="item-linha" data-reveal>
            <span class="emoji">${pr ? pr.emoji : '🍽️'}</span>
            <div style="flex:1"><strong>${pr ? pr.nome : 'Item'}</strong><br><small style="color:var(--suave)">${i.quantidade}× ${Ui.fmt(i.preco_unitario)}</small></div>
            <strong class="preco">${Ui.fmt(i.quantidade * i.preco_unitario)}</strong>
          </div>`; }).join('')}
      </div>
      <aside class="resumo">
        <h3>Resumo</h3>
        <div class="resumo-corpo">
          <div class="resumo-linha"><span>Subtotal</span><span>${Ui.fmt(subtotal)}</span></div>
          <div class="resumo-linha"><span>Frete</span><span>${frete ? Ui.fmt(frete) : '<span class="taxa-gratis">Grátis</span>'}</span></div>
          <div class="resumo-linha resumo-total"><span>Total</span><span class="preco">${Ui.fmt(p.total)}</span></div>
          <div class="resumo-linha" style="margin-top:.6rem"><span>Pagamento</span><span>${PAG[p.forma_pagamento] || p.forma_pagamento}</span></div>
          ${entrega && p.endereco_entrega
            ? `<p style="font-size:.83rem;color:var(--suave);margin-top:.6rem">📍 ${p.endereco_entrega.rua}, ${p.endereco_entrega.numero}${p.endereco_entrega.complemento ? ' - ' + p.endereco_entrega.complemento : ''} · ${p.endereco_entrega.bairro} · ${p.endereco_entrega.cidade}/${p.endereco_entrega.uf} · CEP ${p.endereco_entrega.cep}</p>`
            : `<p style="font-size:.83rem;color:var(--suave);margin-top:.6rem">🏪 Retirar em: ${Ui.EMPRESA.rua} - ${Ui.EMPRESA.bairro}, ${Ui.EMPRESA.cidade}</p>`}
        </div>
      </aside>
    </div>

    <div style="margin-top:2.2rem;display:flex;gap:.8rem;flex-wrap:wrap">
      <a class="btn btn-outline" href="pedidos.html">← Meus pedidos</a>
      <a class="btn" href="produtos.html">Pedir novamente</a>
    </div>`;

  Ui.reveal();
})();