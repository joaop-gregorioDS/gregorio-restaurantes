Ui.$('#form-contato').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  if (!f['c-nome'].value || !f['c-email'].value.includes('@') || !f['c-msg'].value) return Ui.toast('⚠️ Preencha nome, e-mail e mensagem.');
  f.reset();
  Ui.toast('📨 Mensagem enviada! (simulação — retornaremos em breve)');
});