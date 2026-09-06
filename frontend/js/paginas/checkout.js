(async () => {
  const area = Ui.$('#area');

  if (!Estado.carrinho.length) {
    area.innerHTML = `<div class="vazio"><b>🧺</b>Nada para finalizar ainda.<br><br><a class="btn" href="produtos.html">Ver cardápio</a></div>`;
    return;
  }
  if (!Estado.sessao) {
    area.innerHTML = `<div class="moldura cartao-form" style="text-align:center">
      <i class="canto tl"></i><i class="canto tr"></i><i class="canto bl"></i><i class="canto br"></i>
      <h1>Quase lá!</h1>
      <p class="tagline" style="margin:.7rem 0 1.3rem">Entre para finalizar seu pedido — leva meio minuto.</p>
      <a class="btn" href="login.html?volta=checkout.html">Entrar</a>
      <a class="btn btn-outline" href="cadastro.html?volta=checkout.html">Criar conta</a>
    </div>`;
    return;
  }

  const prods = await Api.listarProdutos();
  const itens = Estado.carrinho.map(i => ({ q: i.qtd, p: prods.find(p => p.id === i.id) })).filter(x => x.p);
  const subtotal = itens.reduce((s, x) => s + x.p.preco * x.q, 0);
  let tipo = 'entrega', pag = 'pix';
  const frete = () => tipo === 'entrega' ? Ui.EMPRESA.frete : 0;
  const e0 = (Estado.sessao.enderecos || [])[0] || {};

  area.innerHTML = `<div class="compra-grade">
    <form id="form-checkout" novalidate>
      <h3 style="margin-bottom:.8rem">Opções de Entrega</h3>
      <label class="opcao ativa"><input type="radio" name="tipo" value="entrega" checked><span class="opcao-ico">🛵</span>
        <span><strong>Entrega</strong> <small>Frete: ${Ui.fmt(Ui.EMPRESA.frete)} · Tempo estimado: ${Ui.EMPRESA.tempoEntrega}</small></span></label>
      <label class="opcao"><input type="radio" name="tipo" value="retirada"><span class="opcao-ico">🏪</span>
        <span><strong>Retirada no Balcão (Grátis)</strong> <small>${Ui.EMPRESA.rua} – ${Ui.EMPRESA.bairro} · pronto em ${Ui.EMPRESA.tempoRetirada}</small></span></label>

      <div id="bloco-endereco">
        <h3 style="margin:.8rem 0 .8rem">Endereço de Entrega</h3>
        <div class="linha-2">
          <div class="campo"><label for="cep">CEP</label><input id="cep" placeholder="00000-000" value="${e0.cep || ''}"></div>
          <div class="campo"><label for="bairro">Bairro</label><input id="bairro" value="${e0.bairro || ''}"></div>
        </div>
        <div class="campo"><label for="rua">Rua</label><input id="rua" value="${e0.rua || ''}"></div>
        <div class="linha-2">
          <div class="campo"><label for="numero">Número</label><input id="numero" value="${e0.numero || ''}"></div>
          <div class="campo"><label for="compl">Complemento</label><input id="compl" value="${e0.complemento || ''}"></div>
        </div>
        <div class="linha-2">
          <div class="campo"><label for="cidade">Cidade</label><input id="cidade" value="São Paulo"></div>
          <div class="campo"><label for="uf">UF</label><input id="uf" value="SP" maxlength="2"></div>
        </div>
      </div>

      <h3 style="margin:1.1rem 0 .8rem">Pagamento</h3>
      <label class="opcao ativa"><input type="radio" name="pag" value="pix" checked><span class="opcao-ico">⚡</span><span><strong>Pix</strong><small>Aprovação na hora — QR Code ao confirmar.</small></span></label>
      <label class="opcao"><input type="radio" name="pag" value="cartao"><span class="opcao-ico">💳</span><span><strong>Cartão de Crédito</strong><small>Visa · Mastercard (simulação).</small></span></label>
      <label class="opcao"><input type="radio" name="pag" value="dinheiro"><span class="opcao-ico">💵</span><span><strong>Dinheiro</strong><small>Troco na entrega ou retirada.</small></span></label>

      <div id="bloco-cartao" hidden>
        <div class="aviso-demo">🔒 Ambiente de aprendizado — não insira dados reais de cartão.</div>
        <div class="campo"><label for="cnum">Número do cartão</label><input id="cnum" inputmode="numeric" maxlength="19" placeholder="0000 0000 0000 0000"></div>
        <div class="campo"><label for="cnome">Nome impresso</label><input id="cnome" placeholder="COMO NO CARTÃO"></div>
        <div class="linha-2">
          <div class="campo"><label for="cval">Validade</label><input id="cval" maxlength="5" placeholder="MM/AA"></div>
          <div class="campo"><label for="cvv">CVV</label><input id="cvv" maxlength="4" placeholder="123"></div>
        </div>
      </div>
      <div id="bloco-dinheiro" hidden>
        <div class="campo"><label for="troco">Troco para quanto?</label><input id="troco" placeholder="Ex.: R$ 200,00 (opcional)"></div>
      </div>

      <div class="campo" style="margin-top:.9rem"><label for="obs">Observações</label><textarea id="obs" rows="2" placeholder="Ex.: ponto da carne, referência da rua…"></textarea></div>
    </form>

    <aside class="resumo coluna-sticky">
      <h3>Resumo do Pedido</h3>
      <div class="resumo-corpo">
        <div class="resumo-itens">${itens.map(x => `<div class="resumo-linha"><span>${x.q}× ${x.p.nome}</span><span>${Ui.fmt(x.p.preco * x.q)}</span></div>`).join('')}</div>
        <div class="resumo-linha"><span>Subtotal</span><span>${Ui.fmt(subtotal)}</span></div>
        <div class="resumo-linha"><span>Frete</span><span id="r-frete"></span></div>
        <div class="resumo-linha resumo-total"><span>Total</span><span class="preco" id="r-total"></span></div>
        <button class="btn" id="pagar">Pagar Agora</button>
        <div class="selos-pag"><span>VISA</span><span>MASTERCARD</span><span>PIX</span></div>
      </div>
    </aside>
  </div>`;

  function atualiza(){
    const f = frete();
    Ui.$('#r-frete').innerHTML = f ? Ui.fmt(f) : '<span class="taxa-gratis">Grátis</span>';
    Ui.$('#r-total').textContent = Ui.fmt(subtotal + f);
    Ui.$('#pagar').textContent = `Pagar Agora (${Ui.fmt(subtotal + f)})`;
  }
  atualiza();

  document.querySelectorAll('input[name="tipo"]').forEach(r => r.addEventListener('change', e => {
    tipo = e.target.value;
    document.querySelectorAll('input[name="tipo"]').forEach(x => x.closest('.opcao').classList.toggle('ativa', x.checked));
    Ui.$('#bloco-endereco').hidden = tipo !== 'entrega';
    atualiza();
  }));
  document.querySelectorAll('input[name="pag"]').forEach(r => r.addEventListener('change', e => {
    pag = e.target.value;
    document.querySelectorAll('input[name="pag"]').forEach(x => x.closest('.opcao').classList.toggle('ativa', x.checked));
    Ui.$('#bloco-cartao').hidden = pag !== 'cartao';
    Ui.$('#bloco-dinheiro').hidden = pag !== 'dinheiro';
  }));

  Ui.$('#pagar').onclick = async () => {
    if (tipo === 'entrega') {
      const ok = ['cep','rua','numero','bairro'].every(id => Ui.$('#' + id).value.trim());
      if (!ok) return Ui.toast('⚠️ Preencha CEP, rua, número e bairro para entrega.');
    }
    if (pag === 'cartao') {
      const num = Ui.$('#cnum').value.replace(/\D/g, '');
      if (num.length < 13 || !Ui.$('#cnome').value.trim() || Ui.$('#cval').value.length < 5 || Ui.$('#cvv').value.length < 3)
        return Ui.toast('⚠️ Confira os dados do cartão (simulação).');
    }
    const backendTipo = tipo === 'entrega' ? 'delivery' : 'retirada';
    const payload = {
      itens: itens.map(x => ({ produto: x.p.id, quantidade: x.q, preco_unitario: x.p.preco })),
      total: subtotal + frete(),
      tipo_entrega: backendTipo,
      forma_pagamento: pag
    };
    if (tipo === 'entrega') {
      payload.endereco_entrega = { 
        cep: Ui.$('#cep').value, 
        rua: Ui.$('#rua').value, 
        numero: Ui.$('#numero').value, 
        complemento: Ui.$('#compl').value, 
        bairro: Ui.$('#bairro').value, 
        cidade: Ui.$('#cidade').value, 
        uf: Ui.$('#uf').value 
      };
    }

    const pedido = await Api.criarPedido(payload);
    Estado.limpar(); Ui.badges();
    Ui.toast('🎉 Oba, estamos preparando seu pedido!');
    location.href = `pedido-detalhe.html?id=${pedido.id}`;
  };
})();