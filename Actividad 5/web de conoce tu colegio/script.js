/* ============================================================
   COLEGIO DE CONTADORES PÚBLICOS DE PUNO
   JavaScript — Interactividad institucional
   ============================================================ */

'use strict';

// ─── UTILS ────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

// ─── NAVBAR SCROLL ────────────────────────────────────────────────────
(function initNavbar() {
  const navbar = $('navbar');
  const hamburger = $('hamburger');
  const navLinks = $('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav on link click (mobile)
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close nav on outside click
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();

// ─── ACCORDION ────────────────────────────────────────────────────────
(function initAccordions() {
  const buttons = $$('.accordion-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const item = $(targetId);
      if (!item) return;

      const isActive = item.classList.contains('active');

      // Close all
      $$('.accordion-item').forEach(i => i.classList.remove('active'));

      // Toggle clicked
      if (!isActive) {
        item.classList.add('active');
        // Smooth scroll into view if needed
        setTimeout(() => {
          const rect = item.getBoundingClientRect();
          if (rect.top < 100) {
            item.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 360);
      }
    });
  });
})();

// ─── CURSO MODAL ──────────────────────────────────────────────────────
(function initCursoModal() {
  const addCard   = $('addCursoCard');
  const overlay   = $('modalOverlay');
  const closeBtn  = $('modalClose');
  const cancelBtn = $('btnCancel');
  const form      = $('cursoForm');
  const grid      = $('cursosGrid');

  let cursoCounter = 0;

  function openModal() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('inputNombre').focus(), 100);
  }

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    form.reset();
  }

  addCard.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const nombre     = $('inputNombre').value.trim();
    const institucion = $('inputInstitucion').value.trim();
    const modalidad  = $('inputModalidad').value;
    const horario    = $('inputHorario').value.trim() || 'Por confirmar';
    const beneficio  = $('inputBeneficio').value.trim() || 'Descuento especial';
    const enlace     = $('inputEnlace').value.trim();

    if (!nombre || !institucion) return;

    cursoCounter++;
    const newCard = buildCursoCard({ nombre, institucion, modalidad, horario, beneficio, enlace, id: cursoCounter });
    grid.insertBefore(newCard, addCard.parentElement ? addCard : grid.lastElementChild);

    // Animate entry
    requestAnimationFrame(() => {
      newCard.style.opacity = '0';
      newCard.style.transform = 'translateY(16px)';
      requestAnimationFrame(() => {
        newCard.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        newCard.style.opacity = '1';
        newCard.style.transform = 'translateY(0)';
      });
    });

    closeModal();
    showToast('✅ Curso agregado exitosamente.');
  });

  function buildCursoCard({ nombre, institucion, modalidad, horario, beneficio, enlace, id }) {
    const div = document.createElement('div');
    div.className = 'curso-card';
    div.id = `curso-${id}`;

    const modalidadColors = {
      'Virtual':    { bg: '#E3F2FD', color: '#1565C0' },
      'Presencial': { bg: '#E8F5E9', color: '#2E7D32' },
      'Híbrido':    { bg: '#F3E5F5', color: '#6A1B9A' },
    };
    const mc = modalidadColors[modalidad] || modalidadColors['Virtual'];

    div.innerHTML = `
      <div class="curso-header">
        <div class="curso-badge" style="background:#E8F5E9;color:#2E7D32;">Disponible</div>
        <div class="curso-icon">
          <svg width="28" height="28" fill="none" stroke="#1565C0" stroke-width="2" viewBox="0 0 24 24">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        </div>
      </div>
      <h4 class="curso-nombre">${escapeHtml(nombre)}</h4>
      <div class="curso-info">
        <div class="curso-row">
          <span class="curso-label">Institución</span>
          <span class="curso-valor">${escapeHtml(institucion)}</span>
        </div>
        <div class="curso-row">
          <span class="curso-label">Modalidad</span>
          <span class="curso-valor tag-modalidad" style="background:${mc.bg};color:${mc.color};">${escapeHtml(modalidad)}</span>
        </div>
        <div class="curso-row">
          <span class="curso-label">Horario</span>
          <span class="curso-valor">${escapeHtml(horario)}</span>
        </div>
        <div class="curso-row">
          <span class="curso-label">Beneficio</span>
          <span class="curso-valor tag-descuento">${escapeHtml(beneficio)}</span>
        </div>
      </div>
      ${enlace
        ? `<a href="${escapeHtml(enlace)}" target="_blank" rel="noopener noreferrer" class="btn-curso" style="text-align:center;display:block;">Más información</a>`
        : `<button class="btn-curso">Más información</button>`
      }
    `;

    return div;
  }
})();

// ─── TOAST NOTIFICATION ───────────────────────────────────────────────
function showToast(message, duration = 3000) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%) translateY(80px);
    background: #1e293b;
    color: white;
    padding: 14px 28px;
    border-radius: 50px;
    font-size: 0.875rem;
    font-weight: 600;
    box-shadow: 0 8px 32px rgba(0,0,0,0.25);
    z-index: 9999;
    white-space: nowrap;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
  });

  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(80px)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ─── SCROLL REVEAL ────────────────────────────────────────────────────
(function initScrollReveal() {
  const revealTargets = [
    '.convenio-card',
    '.curso-card',
    '.accordion-item',
    '.mutual-info',
    '.mutual-directiva',
    '.section-header',
  ];

  const elements = [];
  revealTargets.forEach(sel => {
    $$(`${sel}:not(.reveal)`).forEach(el => {
      el.classList.add('reveal');
      elements.push(el);
    });
  });

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay for grid items
        const delay = getStaggerDelay(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px',
  });

  elements.forEach(el => observer.observe(el));

  function getStaggerDelay(el) {
    const parent = el.parentElement;
    if (!parent) return 0;
    const siblings = Array.from(parent.children).filter(c => c.classList.contains('reveal'));
    const idx = siblings.indexOf(el);
    return Math.min(idx * 80, 320);
  }
})();

// ─── ACTIVE NAV LINK (scroll spy) ─────────────────────────────────────
(function initScrollSpy() {
  const sections = $$('section[id], footer[id]');
  const links = $$('.nav-link[href^="#"]');

  function updateActive() {
    let current = '';
    const scrollY = window.scrollY + 100;

    sections.forEach(sec => {
      if (sec.offsetTop <= scrollY) {
        current = sec.id;
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').slice(1);
      if (href === current) link.classList.add('active');
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();

// ─── SMOOTH ANCHOR SCROLL ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─── ESCAPE HTML ──────────────────────────────────────────────────────
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ─── ACTIVE NAV LINK CSS ──────────────────────────────────────────────
const style = document.createElement('style');
style.textContent = `.nav-link.active { color: white !important; background: rgba(255,255,255,0.12) !important; }`;
document.head.appendChild(style);

// ─── LOG ──────────────────────────────────────────────────────────────
console.log('%c CCPP Puno — Convenios y Beneficios ', 'background:#1565C0;color:#fff;font-weight:700;padding:6px 12px;border-radius:4px;');
