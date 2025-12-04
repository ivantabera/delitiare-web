// js/wa-links.js
(() => {
  const DEFAULT_PHONE = "523342874709"; // puedes cambiarlo si quieres otro por defecto

  function buildWaUrl(phone, text) {
    const cleanPhone = String(phone || "").replace(/\D/g, "");
    const base = cleanPhone ? `https://wa.me/${cleanPhone}` : "https://wa.me/";
    const qs = text ? `?text=${encodeURIComponent(text)}` : "";
    return base + qs;
  }

  document.querySelectorAll("a[data-wa]").forEach((el) => {
    const phone = el.getAttribute("data-wa-phone") || DEFAULT_PHONE;
    let text = el.getAttribute("data-wa-text") || "";

    // Sustituir cualquier {{variable}} usando atributos data-wa-var-*
    // ej: data-wa-var-ritual -> {{ritual}}
    //     data-wa-var-nombre -> {{nombre}}
    Array.from(el.attributes).forEach((attr) => {
      if (attr.name.startsWith("data-wa-var-")) {
        const key = attr.name.replace("data-wa-var-", ""); // ritual / nombre / lo que sea
        const value = attr.value;
        const re = new RegExp(`{{\\s*${key}\\s*}}`, "g");
        text = text.replace(re, value);
      }
    });

    const url = buildWaUrl(phone, text);

    el.setAttribute("href", url);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  });
})();