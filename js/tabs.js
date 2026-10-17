(() => {
  const secs = [...document.querySelectorAll('section[id]')];
  const ul = document.querySelector('nav ul');
  const home = document.createElement('li');
  home.innerHTML = '<a href="#home">Home</a>';
  ul.prepend(home);
  document.querySelector('.logo').onclick = () => { location.hash = 'home'; };
  document.body.classList.add('tabs');

  function show() {
    let id = location.hash.slice(1);
    if (!secs.some(s => s.id === id)) id = 'hero';
    secs.forEach(s => s.classList.toggle('tab-active', s.id === id));
    document.querySelectorAll('nav a[href^="#"]').forEach(a =>
      a.classList.toggle('active', a.getAttribute('href') === '#' + (id === 'hero' ? 'home' : id)));
    const act = document.getElementById(id);
    const items = [act, ...act.querySelectorAll('.reveal')];
    items.forEach(el => el.classList.remove('is-visible'));
    window.scrollTo(0, 0);
    requestAnimationFrame(() => requestAnimationFrame(() =>
      items.forEach((el, i) => setTimeout(() => el.classList.add('is-visible'), i * 70))));
  }
  addEventListener('hashchange', show);
  show();
})();
