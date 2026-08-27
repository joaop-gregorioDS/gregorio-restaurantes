(async () => {
  const form = Ui.$('#form-login');
  const erro = Ui.$('#erro');
  const volta = Ui.qs('volta');

  /* já logado? redireciona direto */
  if (Estado.sessao) location.href = volta || 'perfil.html';

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const email = Ui.$('#email').value.trim();
    const senha = Ui.$('#senha').value;

    erro.hidden = true;
    if (!email.includes('@') || !senha) {
      erro.textContent = '⚠️ Informe e-mail e senha.';
      erro.hidden = false; return;
    }

    const r = await Api.login(email, senha);
    if (!r.ok) {
      erro.textContent = '⚠️ E-mail ou senha inválidos.';
      erro.hidden = false; return;
    }

    /* sessão iniciada */
    Estado.entrar(r.usuario);

    /* Fase 2 (MySQL): carrega os favoritos do banco para o estado local */
    if (Api.MODO === 'php') {
      Estado.favoritos = await Api.listarFavoritos(r.usuario.id);
      localStorage.setItem('gregorios_favoritos', JSON.stringify(Estado.favoritos));
    }

    Ui.badges();
    Ui.toast(`🍷 Bem-vindo(a), ${r.usuario.nome.split(' ')[0]}!`);
    location.href = volta || 'perfil.html';
  });
})();