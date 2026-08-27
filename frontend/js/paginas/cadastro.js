(async () => {
  const form = Ui.$('#form-cad');
  const erro = Ui.$('#erro');
  const volta = Ui.qs('volta');

  if (Estado.sessao) location.href = volta || 'perfil.html';

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const nome = Ui.$('#nome').value.trim();
    const email = Ui.$('#email').value.trim();
    const tel = Ui.$('#tel').value.trim();
    const senha = Ui.$('#senha').value;
    const conf = Ui.$('#conf').value;

    erro.hidden = true;
    if (!nome || nome.split(' ').length < 2) return mostrarErro('⚠️ Informe seu nome completo.');
    if (!email.includes('@')) return mostrarErro('⚠️ E-mail inválido.');
    if (senha.length < 6) return mostrarErro('⚠️ A senha precisa ter ao menos 6 caracteres.');
    if (senha !== conf) return mostrarErro('⚠️ As senhas não conferem.');

    const r = await Api.cadastrar({ nome, email, telefone: tel, senha });
    if (!r.ok) return mostrarErro('⚠️ ' + (r.erro || 'Não foi possível criar a conta.'));

    Estado.entrar(r.usuario);
    Ui.badges();
    Ui.toast('🍷 Conta criada — benvenuto!');
    location.href = volta || 'perfil.html';
  });

  function mostrarErro(msg){ erro.textContent = msg; erro.hidden = false; }
})();