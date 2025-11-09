// Año actual
const y = document.getElementById("y");
if (y) y.textContent = new Date().getFullYear();

// Reveal on scroll
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("show");
    });
  },
  { threshold: 0.45 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Form submit (demo)
const form = document.getElementById("form");
const toast = document.getElementById("toast");
if (form && toast) {
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
    setTimeout(() => (toast.style.display = "none"), 2500);
  });
}

// Modales
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
    'a[href]', 'area[href]',
    'button:not([disabled])',
    'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  let lastFocused = null;

  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';

    // Focus trap
    const focusables = modal.querySelectorAll(focusableSel);
    if (focusables.length) focusables[0].focus();

    modal.addEventListener('pointerdown', onBackdrop, true);
    modal.addEventListener('keydown', onKeydown);
    modal.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', () => closeModal(modal)));
  };

  const closeModal = (modal) => {
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    modal.removeEventListener('pointerdown', onBackdrop, true);
    modal.removeEventListener('keydown', onKeydown);
    if (lastFocused && document.body.contains(lastFocused)) lastFocused.focus();
  };

  function onBackdrop(e) {
    const dialog = e.currentTarget.querySelector('.modal__dialog');
    if (dialog && !dialog.contains(e.target)) {
      closeModal(e.currentTarget);
    }
  }
  function onKeydown(e) {
    if (e.key === 'Escape') closeModal(e.currentTarget);
    // focus trap
    if (e.key === 'Tab') {
      const els = e.currentTarget.querySelectorAll(focusableSel);
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        last.focus(); e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus(); e.preventDefault();
      }
    }
  }

  // Wirear triggers
  triggers.forEach(t => {
    const el = document.getElementById(t.id);
    if (el) el.addEventListener('click', () => openModal(t.target));
  });
})();