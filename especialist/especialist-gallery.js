// ===== Año actual =====
(() => {
  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();
})();

// ===== Reveal on scroll (opcional si lo quieres aquí común) =====
(() => {
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("show");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();

// ===== GALERÍA: MODAL + CARRUSEL (REUTILIZABLE) =====
(() => {
  const gallery = document.querySelector(".gallery[data-specialist-gallery]");
  const modal = document.getElementById("gallery-modal");
  const modalImage = document.getElementById("gallery-modal-image");
  const counter = document.getElementById("gallery-modal-counter");
  const titleEl = document.getElementById("gallery-modal-title");
  const waLink = document.getElementById("gallery-modal-wa");

  if (!gallery || !modal || !modalImage || !counter) return;

  const specialistName =
    document.body.dataset.specialistName || "la especialista";
  const waHref = document.body.dataset.waHref || "";

  if (titleEl) {
    titleEl.textContent = `Galería de ${specialistName}`;
  }
  if (waLink && waHref) {
    waLink.href = waHref;
    waLink.textContent = `Agendar con ${specialistName}`;
  }

  const figures = gallery.querySelectorAll("figure");
  if (!figures.length) return;

  const total = figures.length;
  const images = Array.from(figures).map((fig) => {
    const img = fig.querySelector("img");
    return {
      src: img?.getAttribute("src") || "",
      alt: img?.getAttribute("alt") || `Foto de ${specialistName}`,
    };
  });

  let currentIndex = 0;

  function updateView() {
    const current = images[currentIndex];
    modalImage.src = current.src;
    modalImage.alt = current.alt;
    counter.textContent = `${currentIndex + 1} / ${total}`;
  }

  function openModal(index) {
    currentIndex = index;
    updateView();
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function go(delta) {
    currentIndex = (currentIndex + delta + total) % total;
    updateView();
  }

  // Click en miniaturas
  figures.forEach((fig, idx) => {
    fig.addEventListener("click", () => openModal(idx));
    fig.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(idx);
      }
    });
  });

  // Delegación en el modal
  modal.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.dataset.close === "true") {
      closeModal();
      return;
    }

    if (target.dataset.dir === "prev") {
      go(-1);
      return;
    }

    if (target.dataset.dir === "next") {
      go(1);
      return;
    }

    // Click en la imagen = siguiente
    if (target.id === "gallery-modal-image") {
      go(1);
      return;
    }
  });

  // ESC para cerrar
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });
})();
