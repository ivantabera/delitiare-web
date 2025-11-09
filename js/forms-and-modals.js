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
const modalPrivacy = document.getElementById("modal-privacy");
const modalTerms = document.getElementById("modal-terms");
const openPrivacy = () => modalPrivacy?.classList.add("open");
const openTerms = () => modalTerms?.classList.add("open");
const closeAll = () => {
  modalPrivacy?.classList.remove("open");
  modalTerms?.classList.remove("open");
};

document.getElementById("open-privacy")?.addEventListener("click", openPrivacy);
document.getElementById("open-terms")?.addEventListener("click", openTerms);
document
  .getElementById("open-privacy-2")
  ?.addEventListener("click", openPrivacy);
document.getElementById("open-terms-2")?.addEventListener("click", openTerms);
document
  .getElementById("open-privacy-3")
  ?.addEventListener("click", openPrivacy);
document.getElementById("open-terms-3")?.addEventListener("click", openTerms);
document
  .querySelectorAll("[data-close]")
  .forEach((b) => b.addEventListener("click", closeAll));
[modalPrivacy, modalTerms].forEach((m) => {
  m?.addEventListener("click", (e) => {
    if (e.target === m) closeAll();
  });
});
