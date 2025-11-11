// js/header.js — Drawer móvil accesible con focus management + trap
(() => {
  const hamb   = document.getElementById('hamb');
  const drawer = document.getElementById('drawer');
  if (!hamb || !drawer) return;

  // Estado accesible inicial
  hamb.setAttribute('aria-controls', 'drawer');
  hamb.setAttribute('aria-expanded', 'false');
  drawer.setAttribute('aria-hidden', String(!drawer.classList.contains('open')));

  const INNER_SELECTOR = '.container'; // contenedor interno visual del menú
  const FOCUSABLE = [
    'a[href]','area[href]','button:not([disabled])','input:not([disabled])',
    'select:not([disabled])','textarea:not([disabled])','[tabindex]:not([tabindex="-1"])'
  ].join(',');

  let lastFocus = null;

  const getFocusable = () => Array.from(drawer.querySelectorAll(FOCUSABLE))
    // elementos visibles (o el activo actual)
    .filter(el => el === document.activeElement || !(el.offsetParent === null && getComputedStyle(el).position !== 'fixed'));

  const focusFirst = () => {
    const focusables = getFocusable();
    (focusables[0] || drawer).focus({ preventScroll: true });
  };

  const onOutsidePointer = (e) => {
    const inner = drawer.querySelector(INNER_SELECTOR);
    const clickedInsideDrawer = inner && inner.contains(e.target);
    const clickedHamb = hamb.contains(e.target);
    if (!clickedInsideDrawer && !clickedHamb && drawer.classList.contains('open')) {
      closeDrawer();
    }
  };

  const onKeydown = (e) => {
    if (!drawer.classList.contains('open')) return;

    // Cerrar con ESC
    if (e.key === 'Escape') {
      e.preventDefault();
      closeDrawer();
      return;
    }

    // Trap de tabulación dentro del drawer
    if (e.key === 'Tab') {
      const focusables = getFocusable();
      if (!focusables.length) {
        e.preventDefault();
        drawer.focus();
        return;
      }
      const first = focusables[0];
      const last  = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const openDrawer = () => {
    lastFocus = document.activeElement;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    hamb.setAttribute('aria-expanded', 'true');

    // bloqueo de scroll detrás
    document.documentElement.style.overflow = 'hidden';

    // listeners globales
    document.addEventListener('pointerdown', onOutsidePointer, true);
    document.addEventListener('keydown', onKeydown, true);

    // llevar foco al primer elemento interactivo
    queueMicrotask(focusFirst);
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    hamb.setAttribute('aria-expanded', 'false');

    document.documentElement.style.overflow = '';

    document.removeEventListener('pointerdown', onOutsidePointer, true);
    document.removeEventListener('keydown', onKeydown, true);

    // devolver foco al disparador anterior
    (lastFocus || hamb).focus({ preventScroll: true });
  };

  const toggleDrawer = () => {
    if (drawer.classList.contains('open')) closeDrawer();
    else openDrawer();
  };

  // Toggle con el botón
  hamb.addEventListener('click', toggleDrawer);

  // Cerrar al navegar en cualquier enlace o botón dentro del menú
  drawer.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', () => closeDrawer());
  });
})();