// Año actual
const y = document.getElementById("y");
if (y) y.textContent = new Date().getFullYear();

// ===== Reveal on scroll (desmonta al revelar) =====
(() => {
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("show");
          obs.unobserve(e.target); // deja de observar una vez revelado
        }
      });
    },
    { threshold: 0.45, rootMargin: "0px 0px -10% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();

// ===== Form submit (demo) con toast accesible =====
(() => {
  const form = document.getElementById("form");
  const toast = document.getElementById("toast");
  if (!form || !toast) return;

  // Asegura atributos ARIA para lectores de pantalla
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const email = String(fd.get("email") || "").trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

    toast.textContent = valid
      ? "Gracias. Te contactaremos a la brevedad."
      : "Por favor, ingresa un correo válido.";

    if (valid) form.reset();

    toast.style.display = "block";
    window.clearTimeout(toast._t);
    toast._t = window.setTimeout(() => (toast.style.display = "none"), 2500);
  });
})();

// ===== Modales (privacidad / términos) =====
(() => {
  const ids = {
    privacy: 'modal-privacy',
    terms: 'modal-terms'
  };

  const triggers = [
    { id: 'open-privacy',  target: ids.privacy },
    { id: 'open-privacy-2', target: ids.privacy },
    { id: 'open-privacy-3', target: ids.privacy },
    { id: 'open-terms',   target: ids.terms },
    { id: 'open-terms-2', target: ids.terms },
    { id: 'open-terms-3', target: ids.terms },
  ];

  const focusableSel = [
    'a[href]','area[href]','button:not([disabled])',
    'input:not([disabled])','select:not([disabled])','textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  let lastFocused = null;

  const getFocusables = (modal) => Array.from(modal.querySelectorAll(focusableSel))
    .filter(el => el === document.activeElement || !(el.offsetParent === null && getComputedStyle(el).position !== 'fixed'));

  const controllers = new WeakMap(); // AbortController por instancia para limpiar listeners

  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal) return;

    // Evita reabrir si ya está visible
    if (modal.getAttribute('aria-hidden') === 'false') return;

    lastFocused = document.activeElement;
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';

    // Gestión de listeners con AbortController para evitar fugas al reabrir
    const ctrl = new AbortController();
    controllers.set(modal, ctrl);
    const { signal } = ctrl;

    // Delegación: cerrar por botones [data-close]
    modal.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-close]');
      if (btn) closeModal(modal);
    }, { signal });

    // Cerrar por clic en backdrop (fuera del dialog)
    modal.addEventListener('pointerdown', (e) => {
      const dialog = modal.querySelector('.modal__dialog');
      if (dialog && !dialog.contains(e.target)) closeModal(modal);
    }, { capture: true, signal });

    // Teclado: ESC + trap de tabulación
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal(modal);
        return;
      }
      if (e.key === 'Tab') {
        const els = getFocusables(modal);
        if (!els.length) return;
        const first = els[0], last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }, { signal });

    // Llevar foco al primer elemento interactivo o al dialog
    const focusables = getFocusables(modal);
    (focusables[0] || modal).focus({ preventScroll: true });
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';

    const ctrl = controllers.get(modal);
    if (ctrl) ctrl.abort(); // limpia TODOS los listeners de esta apertura

    if (lastFocused && document.body.contains(lastFocused)) {
      lastFocused.focus({ preventScroll: true });
    }
  };

  // Wirear triggers (una sola vez)
  triggers.forEach(t => {
    const el = document.getElementById(t.id);
    if (el) el.addEventListener('click', () => openModal(t.target));
  });
})();