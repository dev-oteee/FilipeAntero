(function () {
  'use strict';

  const sidebar       = document.getElementById('sidebar');
  const toggleBtn     = document.getElementById('sidebarToggle');
  const overlay       = document.getElementById('sidebarOverlay');

  function openSidebar() {
    sidebar.classList.add('sidebar-open');
    overlay.classList.add('active');
    toggleBtn.innerHTML = '<i class="bi bi-x"></i>';
  }

  function closeSidebar() {
    sidebar.classList.remove('sidebar-open');
    overlay.classList.remove('active');
    toggleBtn.innerHTML = '<i class="bi bi-list"></i>';
  }

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.contains('sidebar-open') ? closeSidebar() : openSidebar();
  });

  overlay.addEventListener('click', closeSidebar);

  document.querySelectorAll('#navmenu a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeSidebar();
    });
  });

  const typedEl = document.querySelector('.typed');
  if (typedEl && typeof Typed !== 'undefined') {
    const items = typedEl.getAttribute('data-typed-items').split(',');
    new Typed('.typed', {
      strings: items,
      loop: true,
      typeSpeed: 80,
      backSpeed: 40,
      backDelay: 2200,
      startDelay: 400,
    });
  }

  const scrollTopBtn = document.getElementById('scrollTop');

  function toggleScrollTop() {
    if (!scrollTopBtn) return;
    window.scrollY > 300
      ? scrollTopBtn.classList.add('active')
      : scrollTopBtn.classList.remove('active');
  }

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', toggleScrollTop, { passive: true });
  toggleScrollTop();

  const navLinks = document.querySelectorAll('#navmenu a');

  function scrollSpy() {
    const scrollPos = window.scrollY + 120;

    navLinks.forEach(link => {
      if (!link.hash) return;
      const section = document.querySelector(link.hash);
      if (!section) return;

      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });

    updateCarousel();
  }

  window.addEventListener('scroll', scrollSpy, { passive: true });
  window.addEventListener('load', scrollSpy);

  function animateSkills(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.querySelectorAll('.progress-bar').forEach(bar => {
        const value = bar.getAttribute('aria-valuenow');
        bar.style.width = value + '%';
      });

      observer.unobserve(entry.target);
    });
  }

  const skillsSection = document.querySelector('.skills-animation');
  if (skillsSection) {
    const skillObserver = new IntersectionObserver(animateSkills, {
      threshold: 0.2,
    });
    skillObserver.observe(skillsSection);
  }

  const fadeTargets = document.querySelectorAll(
    '.section, .project-card, .service-card, .timeline-item, .cert-item'
  );

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  fadeTargets.forEach(el => {
    el.classList.add('fade-in');
    fadeObserver.observe(el);
  });

  const SECTION_KEY = 'portfolio:active-section';
  const sections    = Array.from(document.querySelectorAll('section[id]'));

  function sectionAtScroll() {
    const line = window.scrollY + 120;
    let current = sections[0];
    sections.forEach(sec => {
      if (sec.offsetTop <= line) current = sec;
    });
    return current;
  }

  let secaoSalva = null;

  function saveActiveSection() {
    const current = sectionAtScroll();
    if (!current) return;

    if (current.id === secaoSalva) return;
    secaoSalva = current.id;

    try { sessionStorage.setItem(SECTION_KEY, current.id); } catch (e) {}

    if (window.location.hash === '#' + current.id) return;

    try { history.replaceState(null, '', '#' + current.id); } catch (e) {}
  }

  function restoreActiveSection() {
    let target = null;

    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) target = hash;

    if (!target) {
      try {
        const saved = sessionStorage.getItem(SECTION_KEY);
        if (saved && document.getElementById(saved)) target = saved;
      } catch (e) {}
    }

    if (!target) return;

    const el = document.getElementById(target);
    window.scrollTo({
      top: el.offsetTop,
      behavior: 'instant',
    });
  }

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  restoreActiveSection();
  document.addEventListener('DOMContentLoaded', restoreActiveSection);

  window.addEventListener('load', () => {
    restoreActiveSection();
    requestAnimationFrame(restoreActiveSection);
    setTimeout(restoreActiveSection, 250);
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(restoreActiveSection);
  }

  let saveFrame = false;
  window.addEventListener('scroll', () => {
    if (saveFrame) return;
    saveFrame = true;
    requestAnimationFrame(() => {
      saveActiveSection();
      saveFrame = false;
    });
  }, { passive: true });

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function avatarPlaceholder(img) {
    img.style.display = 'none';
    const wrap = img.parentElement;
    wrap.style.background = 'var(--surface-2)';
    wrap.innerHTML = '<i class="bi bi-person-fill" style="font-size:48px;color:var(--primary);display:flex;align-items:center;justify-content:center;height:100%;"></i>';
  }

  document.querySelectorAll('img.avatar').forEach(img => {
    img.addEventListener('error', () => avatarPlaceholder(img));

    if (img.complete && img.naturalWidth === 0) avatarPlaceholder(img);
  });

  let barVisivel = false;

  function syncBottomBar() {
    const r = sidebar.getBoundingClientRect();
    const larguraToda = r.width >= document.documentElement.clientWidth - 1.5;
    const coladaNaBase = Math.abs(r.bottom - window.innerHeight) < 1.5;

    barVisivel = larguraToda && coladaNaBase;

    document.documentElement.style.setProperty(
      '--bar-h', (barVisivel ? Math.ceil(r.height) : 0) + 'px'
    );
  }

  syncBottomBar();
  window.addEventListener('resize', syncBottomBar);
  window.addEventListener('orientationchange', syncBottomBar);
  window.addEventListener('load', syncBottomBar);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncBottomBar);
  }

  const navItems = Array.from(document.querySelectorAll('#navmenu li'));
  let carrosselIdx = -1;

  function updateCarousel() {
    const ativo = document.querySelector('#navmenu a.active');
    const idx   = ativo ? navItems.findIndex(li => li.contains(ativo)) : -1;

    if (idx < 0 || idx === carrosselIdx) return;
    carrosselIdx = idx;

    const total       = navItems.length;
    const temVizinhos = total > 2;

    navItems.forEach((li, i) => {
      li.classList.toggle('nav-current', i === idx);
      li.classList.toggle('nav-prev', temVizinhos && i === (idx - 1 + total) % total);
      li.classList.toggle('nav-next', temVizinhos && i === (idx + 1) % total);
    });
  }

  function irParaVizinho(classe) {
    const li = navItems.find(item => item.classList.contains(classe));
    const link = li && li.querySelector('a');
    if (link) link.click();
  }

  let toqueX = 0;
  let toqueY = 0;

  sidebar.addEventListener('touchstart', (e) => {
    const t = e.changedTouches[0];
    toqueX = t.clientX;
    toqueY = t.clientY;
  }, { passive: true });

  sidebar.addEventListener('touchend', (e) => {
    const t  = e.changedTouches[0];
    const dx = t.clientX - toqueX;
    const dy = t.clientY - toqueY;

    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.5) return;

    irParaVizinho(dx < 0 ? 'nav-next' : 'nav-prev');
  }, { passive: true });

  document.addEventListener('keydown', (e) => {
    if (!barVisivel || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;

    e.preventDefault();
    irParaVizinho(e.key === 'ArrowRight' ? 'nav-next' : 'nav-prev');
  });

  updateCarousel();
})();

const style = document.createElement('style');
style.textContent = `
  .fade-in {
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.55s ease, transform 0.55s ease;
  }
  .fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .project-card.fade-in,
  .service-card.fade-in,
  .cert-item.fade-in {
    transition-delay: calc(var(--i, 0) * 60ms);
  }
`;
document.head.appendChild(style);

document.querySelectorAll('.project-card').forEach((el, i) => {
  el.style.setProperty('--i', i);
});
document.querySelectorAll('.service-card').forEach((el, i) => {
  el.style.setProperty('--i', i);
});
document.querySelectorAll('.cert-item').forEach((el, i) => {
  el.style.setProperty('--i', i);
});
