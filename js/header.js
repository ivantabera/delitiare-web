// Drawer móvil (hamburguesa) con cierre al hacer clic fuera
(() => {
  const hamb   = document.getElementById('hamb');
  const drawer = document.getElementById('drawer');
  if (!hamb || !drawer) return;

  const INNER_SELECTOR = '.container'; // el contenedor interno del menú

  const openDrawer = () => {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden'; // bloquear scroll detrás
    // listeners globales
    document.addEventListener('pointerdown', onOutsidePointer, true);
    document.addEventListener('keydown', onKeydown);
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    document.removeEventListener('pointerdown', onOutsidePointer, true);
    document.removeEventListener('keydown', onKeydown);
  };

  const toggleDrawer = () => {
    const open = drawer.classList.toggle('open');
    hamb.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    drawer.setAttribute('aria-hidden', String(!open));
    if (open) {
      document.documentElement.style.overflow = 'hidden';
      document.addEventListener('pointerdown', onOutsidePointer, true);
      document.addEventListener('keydown', onKeydown);
    } else {
      document.documentElement.style.overflow = '';
      document.removeEventListener('pointerdown', onOutsidePointer, true);
      document.removeEventListener('keydown', onKeydown);
    }
  };

  function onOutsidePointer(e) {
    // Si el click NO fue dentro del contenido del drawer y NO fue el botón de hamburguesa, cierra
    const inner = drawer.querySelector(INNER_SELECTOR);
    const clickedInsideDrawer = inner && inner.contains(e.target);
    const clickedHamb = hamb.contains(e.target);
    if (!clickedInsideDrawer && !clickedHamb && drawer.classList.contains('open')) {
      closeDrawer();
    }
  }

  function onKeydown(e) {
    // Cerrar con ESC
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  }

  // Toggle con el botón
  hamb.addEventListener('click', toggleDrawer);

  // Cerrar al navegar en cualquier enlace del menú
  drawer.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', () => closeDrawer());
  });

  // Estado inicial accesible
  drawer.setAttribute('aria-hidden', String(!drawer.classList.contains('open')));
})();