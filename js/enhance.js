(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll progress + back-to-top
  const bar = document.createElement('div'); bar.id = 'progress'; document.body.prepend(bar);
  const up = document.createElement('button'); up.id = 'totop'; up.textContent = '↑';
  up.setAttribute('aria-label', 'Back to top');
  up.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
  document.body.append(up);
  addEventListener('scroll', () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + '%';
    up.classList.toggle('show', h.scrollTop > 600);
  }, { passive: true });

  // Typing effect in hero
  const roles = ['Embedded Systems', 'Edge AI & TinyML', 'IoT Solutions', 'PCB Design', 'Software Defined Vehicles'];
  const line = document.createElement('div'); line.className = 'typed-line';
  line.innerHTML = 'I work on <span class="typed"></span>';
  $('.hero-content p').after(line);
  const out = line.querySelector('.typed');
  if (calm) out.textContent = roles[0];
  else {
    let r = 0, c = 0, del = false;
    (function tick() {
      const word = roles[r];
      out.textContent = word.slice(0, c);
      if (!del && c === word.length) { del = true; return setTimeout(tick, 1400); }
      if (del && c === 0) { del = false; r = (r + 1) % roles.length; }
      c += del ? -1 : 1;
      setTimeout(tick, del ? 40 : 80);
    })();
  }

  // CGPA count-up
  const cg = $$('.hero-stats strong').find(e => /^\d+\.\d+/.test(e.textContent));
  if (cg && !calm) {
    const target = parseFloat(cg.textContent), rest = cg.textContent.replace(/^[\d.]+/, '');
    const t0 = performance.now();
    (function step(t) {
      const p = Math.min((t - t0) / 1500, 1);
      cg.textContent = (target * (1 - Math.pow(1 - p, 3))).toFixed(2) + rest;
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  // Project filters
  const cards = $$('#projects .project-card');
  const rules = { 'Embedded & IoT': /STM32|ESP32|PCB|IoT|RFID/, 'AI': /AI|TinyML/, 'Web & Software': /React|FastAPI|HTML|Marketplace/ };
  cards.forEach(c => {
    const tags = c.querySelector('.tags')?.textContent || '';
    c.dataset.cats = Object.keys(rules).filter(k => rules[k].test(tags)).join('|');
  });
  const bank = document.createElement('div'); bank.className = 'filters';
  ['All', ...Object.keys(rules)].forEach((name, i) => {
    const b = document.createElement('button'); b.textContent = name;
    if (i === 0) b.classList.add('on');
    b.onclick = () => {
      $$('.filters button').forEach(x => x.classList.remove('on')); b.classList.add('on');
      cards.forEach(c => c.classList.toggle('hide', name !== 'All' && !c.dataset.cats.split('|').includes(name)));
    };
    bank.append(b);
  });
  $('#projects .card-grid').before(bank);

  // Cursor spotlight on cards
  $$('.project-card, .achievement-card').forEach(c =>
    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', e.clientX - r.left + 'px');
      c.style.setProperty('--my', e.clientY - r.top + 'px');
    }));

  // Staggered card entrance
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
  }), { threshold: 0.1 });
  $$('.project-card, .achievement-card, .experience-card, .skill-category, .education-card').forEach((c, i) => {
    c.classList.add('reveal');
    c.style.transitionDelay = (i % 3) * 90 + 'ms';
    c.addEventListener('transitionend', () => c.style.transitionDelay = '', { once: true });
    io.observe(c);
  });

  // Highlight current section in nav
  const links = $$('nav a[href^="#"]');
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('section[id]').forEach(s => spy.observe(s));
})();
