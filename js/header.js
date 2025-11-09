// Drawer móvil (hamburguesa)
const hamb = document.getElementById('hamb');
const drawer = document.getElementById('drawer');

if (hamb && drawer) {
  hamb.addEventListener('click', () => {
    const open = drawer.classList.toggle('open');
    hamb.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  drawer.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => drawer.classList.remove('open'))
  );
}