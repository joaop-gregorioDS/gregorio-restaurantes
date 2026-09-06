(async () => {
  const area = Ui.$('#area');

  if (!Estado.sessao) {
    area.innerHTML = `<div class="vazio"><b>🔐</b>Entre para ver sua conta.<br><br><a class="btn" href="login.html?volta=perfil.html">Entrar</a></div>`;
    return;
  }

  const pedidos = await Api.listarPedidos(Estado.sessao.id);
  const ativos = pedidos.filter(p => !['concluido','cancelado'].includes(p.status));
  const enderecos = Estado.sessao.enderecos || [];

  area.innerHTML = `
    <h1 class="titulo-secao">Minha Conta</h1><div class="divisor"></div>

    <div class="moldura" style="margin-bottom:1.6rem" data-reveal>
      <i class="canto tl"></i><i class="canto tr"></i><i class="canto bl"></i><i class="canto br"></i>
      <div style="display:flex;flex-wrap:wrap;gap:1.2rem;align-items:center;justify-content:space-between">
        <div><h2 style="font-size:1.4rem;letter-spacing:.06em">Olá, ${Estado.sessao.nome.split(' ')[0]} 👋</h2>
          <p style="color:var(--suave);margin-top:.3rem">${Estado.sessao.email}${Estado.sessao.telefone ? ' · ' + Estado.sessao.telefone : ''}</p></div>
        <button class="btn btn-outline" id="sair">Sair da conta</button>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:.9rem;margin-bottom:2rem">
      <a class="pedido-card" href="pedidos.html" style="flex-direction:column;align-items:flex-start"><strong style="font-family:var(--fd);color:var(--vinho);font-size:1.8rem">${pedidos.length}</strong><span class="pedido-meta">Pedidos na casa</span></a>
      <a class="pedido-card" href="pedidos.html" style="flex-direction:column;align-items:flex-start"><strong style="font-family:var(--fd);color:var(--vinho);font-size:1.8rem">${ativos.length}</strong><span class="pedido-meta">Ativos agora</span></a>
      <a class="pedido-card" href="favoritos.html" style="flex-direction:column;align-items:flex-start"><strong style="font-family:var(--fd);color:var(--vinho);font-size:1.8rem">${Estado.favoritos.length}</strong><span class="pedido-meta">Favoritos ♥</span></a>
      <a class="pedido-card" href="#enderecos" style="flex-direction:column;align-items:flex-start"><strong style="font-family:var(--fd);color:var(--vinho);font-size:1.8rem">${enderecos.length}</strong><span class="pedido-meta">Endereços salvos</span></a>
    </div>

    <h2 class="titulo-secao">Meus Dados</h2><div class="divisor"></div>
    <form class="moldura cartao-form" id="form-perfil" style="max-width:640px" novalidate>
      <i class="canto tl"></i><i class="canto tr"></i><i class="canto bl"></i><i class="canto br"></i>
      <div class="campo"><label for="p-nome">Nome</label><input id="p-nome" value="${Estado.sessao.nome}"></div>
      <div class="campo"><label for="p-email">E-mail</label><input id="p-email" type="email" value="${Estado.sessao.email}"></div>
      <div class="campo"><label for="p-tel">Telefone</label><input id="p-tel" value="${Estado.sessao.telefone || ''}"></div>
      <button class="btn" type="submit">Salvar alterações</button>
    </form>

    <h2 class="titulo-secao" id="enderecos" style="margin-top:2.4rem">Endereços</h2><div class="divisor"></div>
    <div id="blocos-end" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem">
      ${enderecos.length ? enderecos.map(e => `
        <div class="moldura" style="padding:1.2rem" data-reveal>
          <i class="canto tl"></i><i class="canto tr"></i><i class="canto bl"></i><i class="canto br"></i>
          <h3 style="font-size:.95rem;letter-spacing:.08em;margin-bottom:.4rem">${e.apelido || 'Casa'}</h3>
          <p style="font-size:.88rem;color:var(--suave)">${e.rua}, ${e.numero}${e.complemento ? ' – ' + e.complemento : ''}<br>${e.bairro} · ${e.cidade}/${e.uf}<br>CEP ${e.cep}</p>
        </div>`).join('') : '<p style="color:var(--suave)">Você ainda não tem endereços salvos. Eles serão gravados no primeiro pedido de entrega.</p>'}
    </div>

    <div style="margin-top:2.4rem;display:flex;gap:.8rem;flex-wrap:wrap">
      <a class="btn" href="pedidos.html">📦 Meus pedidos</a>
      <a class="btn btn-outline" href="favoritos.html">♥ Favoritos</a>
      <a class="btn btn-outline" href="produtos.html">🍽️ Cardápio</a>
    </div>
  `;

  Ui.$('#sair').onclick = () => {
    Estado.sair();
    Ui.toast('Até breve — sua mesa fica guardada.');
    location.href = 'login.html';
  };

  Ui.$('#form-perfil').addEventListener('submit', async e => {
    e.preventDefault();
    const atualizado = {
      ...Estado.sessao,
      nome: Ui.$('#p-nome').value.trim(),
      email: Ui.$('#p-email').value.trim(),
      telefone: Ui.$('#p-tel').value.trim()
    };
    if (!atualizado.nome) return Ui.toast('⚠️ Nome é obrigatório.');
    await Api.salvarUsuario(atualizado);
    Estado.entrar(atualizado);
    Ui.toast('✅ Dados salvos!');
  });

  Ui.reveal();
})();