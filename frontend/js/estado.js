/* ═══ GREGÓRIOS · estado local (localStorage) ═══ */
const Estado = {
  carrinho: JSON.parse(localStorage.getItem('gregorios_carrinho') || '[]'),
  favoritos: JSON.parse(localStorage.getItem('gregorios_favoritos') || '[]'),
  sessao: JSON.parse(localStorage.getItem('gregorios_sessao') || 'null'),

  _salvarC(){ localStorage.setItem('gregorios_carrinho', JSON.stringify(this.carrinho)); },
  add(id, qtd = 1){
    const item = this.carrinho.find(i => i.id === id);
    item ? item.qtd += qtd : this.carrinho.push({ id, qtd });
    this._salvarC();
  },
  setQtd(id, qtd){ const i = this.carrinho.find(i => i.id === id); if (!i) return; i.qtd = qtd; if (i.qtd <= 0) this.remover(id); else this._salvarC(); },
  remover(id){ this.carrinho = this.carrinho.filter(i => i.id !== id); this._salvarC(); },
  limpar(){ this.carrinho = []; this._salvarC(); },

  ehFav(id){ return this.favoritos.includes(id); },
  toggleFav(id){ this.ehFav(id) ? this.favoritos = this.favoritos.filter(f => f !== id) : this.favoritos.push(id); localStorage.setItem('gregorios_favoritos', JSON.stringify(this.favoritos)); },

  entrar(u){ this.sessao = u; localStorage.setItem('gregorios_sessao', JSON.stringify(u)); },
  sair(){ this.sessao = null; localStorage.removeItem('gregorios_sessao'); }
};