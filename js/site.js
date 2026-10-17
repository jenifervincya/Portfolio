(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
  const root = document.documentElement;
  root.dataset.theme = store.get('theme') || 'dark';

  const pages = [['index', 'Home'], ['about', 'About'], ['projects', 'Projects'], ['experience', 'Experience'], ['achievements', 'Achievements'], ['publication', 'Publication'], ['contact', 'Contact']];
  const cur = document.body.dataset.page;
  document.body.insertAdjacentHTML('afterbegin',
    `<div id="progress"></div><header><a class="logo" href="index.html">Jenifer<b>.</b>Vincy</a>
    <nav id="nav"><ul>${pages.map(([f, n]) => `<li><a href="${f}.html" class="${f === cur ? 'on' : ''}">${n}</a></li>`).join('')}</ul></nav>
    <div class="hbtns"><button class="ic" id="theme" aria-label="Toggle theme"></button><button class="ic" id="menu" aria-label="Menu">☰</button></div></header>`);
  document.body.insertAdjacentHTML('beforeend',
    `<footer><span>&copy; 2026 Jenifer Vincy A</span><div><a href="mailto:jenifervincy@gmail.com">Email</a>
    <a href="https://github.com/jenifervincya" target="_blank" rel="noopener noreferrer">GitHub</a>
    <a href="https://www.linkedin.com/in/jenifer-vincy-a-ab569b325" target="_blank" rel="noopener noreferrer">LinkedIn</a></div></footer>`);
  const th = $('#theme'), setIcon = () => th.textContent = root.dataset.theme === 'dark' ? '☀' : '☾';
  setIcon(); th.onclick = () => { root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'; store.set('theme', root.dataset.theme); setIcon(); };
  $('#menu').onclick = () => $('#nav').classList.toggle('open');

  addEventListener('scroll', () => { const h = root; $('#progress').style.width = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight) * 100 + '%'; }, { passive: true });

  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .1 });
  $$('.card,.stat,.title').forEach((el, i) => { el.classList.add('rv'); el.style.transitionDelay = (i % 3) * 80 + 'ms'; io.observe(el); });
  $$('.card').forEach(c => c.addEventListener('mousemove', e => { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px'); }));

  $$('[data-count]').forEach(el => {
    const t = parseFloat(el.dataset.count), d = +(el.dataset.dec || 0), suf = el.dataset.suf || '';
    if (calm) { el.textContent = t.toFixed(d) + suf; return; }
    new IntersectionObserver(([e], o) => { if (!e.isIntersecting) return; o.disconnect(); const t0 = performance.now();
      (function f(n) { const p = Math.min((n - t0) / 1400, 1); el.textContent = (t * (1 - Math.pow(1 - p, 3))).toFixed(d) + suf; if (p < 1) requestAnimationFrame(f); })(t0); }).observe(el);
  });

  const ty = $('#typed');
  if (ty) {
    const w = ['Embedded Systems', 'Edge AI & TinyML', 'IoT Solutions', 'PCB Design', 'Software Defined Vehicles'];
    if (calm) ty.textContent = w[0]; else { let r = 0, c = 0, del = false;
      (function k() { const s = w[r]; ty.textContent = s.slice(0, c);
        if (!del && c === s.length) { del = true; return setTimeout(k, 1400); }
        if (del && c === 0) { del = false; r = (r + 1) % w.length; }
        c += del ? -1 : 1; setTimeout(k, del ? 40 : 80); })(); }
  }

  const cv = $('#net');
  if (cv && !calm) {
    const x = cv.getContext('2d'); let W, H, P = [];
    const size = () => { W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; P = Array.from({ length: Math.round(W * H / 22000) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 })); };
    size(); addEventListener('resize', size);
    (function draw() {
      const col = getComputedStyle(root).getPropertyValue('--g').trim(); x.clearRect(0, 0, W, H); x.fillStyle = col; x.strokeStyle = col;
      P.forEach((p, i) => { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
        x.globalAlpha = .8; x.beginPath(); x.arc(p.x, p.y, 1.8, 0, 7); x.fill();
        for (let j = i + 1; j < P.length; j++) { const q = P[j], d = Math.hypot(p.x - q.x, p.y - q.y); if (d < 130) { x.globalAlpha = (1 - d / 130) * .35; x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(q.x, q.y); x.stroke(); } } });
      requestAnimationFrame(draw); })();
  }

  $$('.filters button').forEach(b => b.onclick = () => { $$('.filters button').forEach(x => x.classList.remove('on')); b.classList.add('on');
    $$('.proj').forEach(c => c.classList.toggle('hide', b.dataset.f !== 'all' && !c.dataset.cat.split(' ').includes(b.dataset.f))); });

  const pl = $('#pub-link'); if (pl && pl.getAttribute('href').includes('PASTE')) pl.style.display = 'none';
})();
