// js/wa-links.js
// ===== WhatsApp link builder — aplica a cualquier enlace con [data-wa] =====
(() => {
  const DEFAULT_COUNTRY = "52";

  const normalize = (raw, cc = DEFAULT_COUNTRY) => {
    const digits = String(raw || "").replace(/\D+/g, "");
    if (!digits) return null;
    if (digits.startsWith(cc)) return digits;
    if (digits.length === 10) return cc + digits;
    return digits; // fallback si ya trae CC distinto
  };

  const interpolate = (tpl = "", data = {}) =>
    tpl.replace(
      /\{\{\s*([\w-]+)\s*\}\}/g,
      (_, k) => data[k.toLowerCase()] ?? ""
    );

  const build = (root = document) => {
    root.querySelectorAll("[data-wa]").forEach((el) => {
      const phone = normalize(el.dataset.waPhone, el.dataset.waCountry);
      if (!phone) return;

      // variables data-wa-var-*
      const vars = Object.fromEntries(
        Object.entries(el.dataset)
          .filter(([k]) => k.startsWith("waVar"))
          .map(([k, v]) => [k.slice(5).toLowerCase(), v])
      );

      const text = interpolate(el.dataset.waText || "", vars);
      const url = `https://wa.me/${phone}${
        text ? `?text=${encodeURIComponent(text)}` : ""
      }`;
      el.setAttribute("href", url);

      if (el.dataset.waBlank !== "false") {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
      }
    });
  };

  // Construye en DOMContentLoaded
  document.addEventListener("DOMContentLoaded", () => build());

  // Expone utilidad global por si necesitas reconstruir en runtime
  window.buildWhatsAppLinks = build;
})();
