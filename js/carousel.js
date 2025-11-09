(function () {
  const slides = document.getElementById("slides");
  const dotsEl = document.getElementById("dots");
  const carousel = document.getElementById("carousel");
  if (!slides || !dotsEl || !carousel) return;

  const total = slides.children.length;
  let index = 0;

  // Crear dots solo como indicadores (no interactivos)
  for (let i = 0; i < total; i++) {
    const dot = document.createElement("span");
    dot.setAttribute("data-dot", String(i + 1));
    dotsEl.appendChild(dot);
  }

  function update() {
    slides.style.transform = "translateX(-" + index * 100 + "%)";
    [...dotsEl.children].forEach((d, i) =>
      d.setAttribute("aria-current", i === index ? "true" : "false")
    );
  }

  function go(i, user = false) {
    index = (i + total) % total;
    update();
    if (user) resetTimer();
  }

  update();

  // Auto-advance
  let timer = null;
  function resetTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => go(index + 1, false), 6000);
  }
  resetTimer();

  // Pausa al hover (desktop)
  carousel.addEventListener("mouseenter", () => {
    if (timer) clearInterval(timer);
  });
  carousel.addEventListener("mouseleave", resetTimer);

  // Gestos swipe (móvil)
  let startX = null;
  let tracking = false;

  carousel.addEventListener(
    "pointerdown",
    (e) => {
      if (e.isPrimary) {
        startX = e.clientX;
        tracking = true;
      }
    },
    { passive: true }
  );

  carousel.addEventListener(
    "pointerup",
    (e) => {
      if (!tracking || startX == null) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 40) {
        go(index + (dx < 0 ? 1 : -1), true);
      }
      startX = null;
      tracking = false;
    },
    { passive: true }
  );

  carousel.addEventListener(
    "pointercancel",
    () => {
      startX = null;
      tracking = false;
    },
    { passive: true }
  );
})();
