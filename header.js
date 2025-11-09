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

// Carrusel fullscreen
(function () {
  const slides = document.getElementById('slides');
  const dotsEl = document.getElementById('dots');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const carousel = document.getElementById('carousel');
  if (!slides || !dotsEl || !carousel) return;

  const total = slides.children.length;
  let index = 0;

  // Crear dots
  for (let i = 0; i < total; i++) {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Ir a la imagen ' + (i + 1));
    b.addEventListener('click', () => go(i, true));
    dotsEl.appendChild(b);
  }

  function update() {
    slides.style.transform = 'translateX(-' + (index * 100) + '%)';
    [...dotsEl.children].forEach((d, i) =>
      d.setAttribute('aria-current', i === index ? 'true' : 'false')
    );
  }

  function go(i, user = false) {
    index = (i + total) % total;
    update();
    if (user) resetTimer();
  }

  if (prev) prev.addEventListener('click', () => go(index - 1, true));
  if (next) next.addEventListener('click', () => go(index + 1, true));
  update();

  // Auto-advance
  let timer = null;
  function resetTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => go(index + 1, false), 6000);
  }
  resetTimer();

  // Pausa al hover (desktop)
  carousel.addEventListener('mouseenter', () => { if (timer) clearInterval(timer); });
  carousel.addEventListener('mouseleave', resetTimer);

  // Gestos swipe (móvil) — sin pointer capture para no bloquear scroll
  let startX = null;
  let tracking = false;

  carousel.addEventListener('pointerdown', e => {
    if (e.isPrimary) { startX = e.clientX; tracking = true; }
  }, { passive: true });

  carousel.addEventListener('pointerup', e => {
    if (!tracking || startX == null) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 40) { go(index + (dx < 0 ? 1 : -1), true); }
    startX = null; tracking = false;
  }, { passive: true });

  carousel.addEventListener('pointercancel', () => {
    startX = null; tracking = false;
  }, { passive: true });
})();
