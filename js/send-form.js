// /js/send-form.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = {
      email: form.email.value.trim(),
      alias: form.alias.value.trim(),
      comentario: form.comentario.value.trim(),
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando…";

    try {
      const response = await fetch("/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Error al enviar el mensaje");
      }

      alert("Gracias, tu mensaje fue enviado correctamente.");
      form.reset();
    } catch (error) {
      console.error(error);
      alert("Hubo un error al enviar tu mensaje. Inténtalo más tarde.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
});
