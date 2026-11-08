/* ---------- COOKIE BANNER ---------- */
(function () {
  const KEY = 'weblab_cookie_choice';
  const banner = document.getElementById('cookieBanner');
  const accept = document.getElementById('cookieAccept');
  const decline = document.getElementById('cookieDecline');
  if (!banner) return;
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (!saved) banner.classList.add('is-visible');

  const save = (v) => {
    try { localStorage.setItem(KEY, v); } catch (e) {}
    banner.classList.remove('is-visible');
  };
  accept && accept.addEventListener('click', () => save('all'));
  decline && decline.addEventListener('click', () => save('necessary'));
})();

/* ---------- MOBILE MENU ---------- */
(function () {
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobileMenu');
  const panel = menu ? menu.querySelector('.mobile-panel') : null;
  const body = document.body;
  if (!burger || !menu) return;

  const openMenu = () => {
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    burger.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Закрыть меню');
    body.classList.add('menu-open');
    if (panel) {
      const firstLink = panel.querySelector('a');
      if (firstLink) firstLink.focus({ preventScroll: true });
    }
  };
  const closeMenu = () => {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Открыть меню');
    body.classList.remove('menu-open');
  };

  burger.addEventListener('click', () => {
    if (menu.classList.contains('is-open')) closeMenu();
    else openMenu();
  });
  menu.addEventListener('click', (e) => { if (e.target === menu) closeMenu(); });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) { closeMenu(); burger.focus(); }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && menu.classList.contains('is-open')) closeMenu();
  });
})();

/* ---------- CASE FILTERS ---------- */
const filters = document.querySelectorAll('.case-filters button');
const caseCards = document.querySelectorAll('.case-card');
filters.forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.filter;
    filters.forEach(b => {
      const active = b === btn;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    caseCards.forEach(card => {
      const show = cat === 'all' || card.dataset.cat === cat;
      card.hidden = !show;
    });
  });
});

/* ---------- ROUTING ---------- */
const pages = {
  '#case-ceramics'   : 'page-case-ceramics',
  '#case-requests-db': 'page-case-requests-db',
  '#case-analytics'  : 'page-case-analytics',
  '#case-corporate'  : 'page-case-corporate',
  '#case-shop-db'    : 'page-case-shop-db',
  '#case-tasks'      : 'page-case-tasks'
};

function showPage() {
  const hash = window.location.hash;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('is-active'));
  if (pages[hash]) {
    const target = document.getElementById(pages[hash]);
    if (target) target.classList.add('is-active');
    window.scrollTo({ top: 0, behavior: 'auto' });
  } else {
    const home = document.getElementById('page-home');
    if (home) home.classList.add('is-active');
  }
}

window.addEventListener('hashchange', () => {
  showPage();
  const hash = window.location.hash;
  if (hash && !pages[hash]) {
    const target = document.querySelector(hash);
    if (target) {
      const headerEl = document.querySelector('.site-header');
      const offset = headerEl ? headerEl.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset + 1;
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  showPage();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const headerEl = document.querySelector('.site-header');
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      if (pages[id]) return;
      const target = document.querySelector(id);
      if (!target) return;
      const home = document.getElementById('page-home');
      if (home && !home.classList.contains('is-active')) {
        e.preventDefault();
        window.location.hash = id;
        return;
      }
      e.preventDefault();
      const offset = headerEl ? headerEl.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset + 1;
      window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    });
  });
});