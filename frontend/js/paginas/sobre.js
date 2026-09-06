/* contadores animados da moldura */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, fim = +el.dataset.conta, t0 = performance.now();
  (function passo(t){ const k = Math.min((t - t0) / 1400, 1);
    el.textContent = Math.round(fim * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(passo); })(t0);
  io.unobserve(el);
}), { threshold:.6 });
document.querySelectorAll('[data-conta]').forEach(el => io.observe(el));