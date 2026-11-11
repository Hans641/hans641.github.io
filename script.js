(() => {
  'use strict';
  document.documentElement.classList.add('has-js');
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const root = document.body;
  const header = $('#site-header');
  const menuButton = $('#menu-toggle');
  const menu = $('#nav-links');
  const themeButton = $('#theme-toggle');
  const progress = $('#scroll-fill');
  const dialog = $('#project-dialog');
  const toast = $('#toast');
  let toastTimer;

  // Theme switcher persists the visitor's preference when storage is available.
  let theme = 'dark';
  try { theme = localStorage.getItem('hans-portfolio-theme') || 'dark'; } catch (_) {}
  const setTheme = next => {
    theme = next === 'light' ? 'light' : 'dark';
    root.dataset.theme = theme;
    themeButton.setAttribute('aria-label', theme === 'dark' ? 'Passer au thème clair' : 'Passer au thème sombre');
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#0a0e16' : '#f4f7f5';
    try { localStorage.setItem('hans-portfolio-theme', theme); } catch (_) {}
  };
  setTheme(theme);
  themeButton.addEventListener('click', () => setTheme(theme === 'dark' ? 'light' : 'dark'));

  const closeMenu = () => {
    menu.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Ouvrir le menu');
  };
  menuButton.addEventListener('click', () => {
    const opened = !menu.classList.contains('is-open');
    menu.classList.toggle('is-open', opened);
    menuButton.setAttribute('aria-expanded', String(opened));
    menuButton.setAttribute('aria-label', opened ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  $$('.nav-links a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', e => { if (!menu.contains(e.target) && !menuButton.contains(e.target)) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  // Progress bar and sticky navigation.
  let ticking = false;
  function updateScroll() {
    header.classList.toggle('scrolled', window.scrollY > 24);
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = maxScroll > 0 ? `${Math.min(100, (window.scrollY / maxScroll) * 100)}%` : '0%';
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateScroll); ticking = true; }
  }, { passive: true });
  updateScroll();

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduced) {
    const revealObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
      }
    }, { rootMargin: '0px 0px -35px 0px', threshold: .09 });
    $$('[data-reveal]').forEach(item => revealObserver.observe(item));
  } else {
    $$('[data-reveal]').forEach(item => item.classList.add('is-visible'));
  }
  if ('IntersectionObserver' in window) {
    const sections = $$('main section[id]');
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        $$('[data-nav]').forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-25% 0px -55% 0px', threshold: 0 });
    sections.forEach(section => navObserver.observe(section));
  }

  // Project filters. Cards are authored in HTML so content works without JavaScript.
  $$('.filter-button').forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    $$('.filter-button').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
    $$('.project-card').forEach(card => {
      const shown = filter === 'tous' || (card.dataset.type || '').split(' ').includes(filter);
      card.hidden = !shown;
    });
  }));

  const projects = {
    agri: {
      eyebrow: '01 / AGRITECH · 2026', title: 'SaaS de gestion agricole',
      description: 'Application SaaS de suivi d’exploitations rizicoles, conçue autour d’un fonctionnement multi-tenant et d’une cartographie des parcelles.',
      features: [
        'Gestion des exploitations, parcelles et campagnes agricoles.',
        'Isolation des données entre exploitations et contrôle des accès.',
        'Dessin et modification des contours de parcelles avec Leaflet.',
        'Tests applicatifs côté Laravel et côté frontend.'
      ], tags: ['PHP', 'Laravel', 'React', 'MySQL', 'Leaflet'], github: null
    },
    commune: {
      eyebrow: '02 / CIVICTECH · 2026', title: 'CommuneDigit',
      description: 'Plateforme de numérisation des services communaux, comprenant un portail web, un backend API et une application mobile.',
      features: [
        'Gestion des citoyens, des actes d’état civil et des demandes administratives.',
        'API backend FastAPI, authentification JWT et rôles utilisateurs.',
        'Frontend React et application React Native pour la saisie mobile.',
        'Synchronisation des saisies hors connexion et gestion des conflits.'
      ], tags: ['FastAPI', 'React', 'PostgreSQL', 'React Native', 'JWT'], github: 'https://github.com/Hans641/CommuneDigit'
    },
    pharma: {
      eyebrow: '03 / HEALTHTECH · 2026', title: 'PharmaGest',
      description: 'Application Django de gestion de pharmacie avec suivi des stocks, du parcours d’achat aux ventes et aux retours.',
      features: [
        'Gestion des médicaments, fournisseurs et clients.',
        'Suivi des lots, des mouvements de stock et des dates de péremption.',
        'Gestion des commandes, ventes, retours et rôles utilisateurs.',
        'Tableau de bord et rapports PDF.'
      ], tags: ['Python', 'Django', 'SQLite', 'Bootstrap 5'], github: 'https://github.com/Hans641/Pharmacie'
    }
  };
  const githubButton = $('#dialog-github');
  function openProject(id) {
    const item = projects[id];
    if (!item) return;
    $('#dialog-eyebrow').textContent = item.eyebrow;
    $('#dialog-title').textContent = item.title;
    $('#dialog-description').textContent = item.description;
    const ul = $('#dialog-features');
    ul.replaceChildren(...item.features.map(feature => { const li = document.createElement('li'); li.textContent = feature; return li; }));
    const tags = $('#dialog-tags');
    tags.replaceChildren(...item.tags.map(tag => { const span = document.createElement('span'); span.textContent = tag; return span; }));
    githubButton.hidden = !item.github;
    if (item.github) githubButton.href = item.github;
    if (!dialog.open) dialog.showModal();
  }
  $$('[data-project]').forEach(button => button.addEventListener('click', () => openProject(button.dataset.project)));
  $('#dialog-close').addEventListener('click', () => dialog.close());
  $('#dialog-secondary-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3300);
  }
  $('#copy-email').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText('hans.nirina@gmail.com'); showToast('Adresse e-mail copiée !'); }
    catch (_) { showToast('Copie non disponible : hans.nirina@gmail.com'); }
  });
  $('#year').textContent = new Date().getFullYear();
})();
