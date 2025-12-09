document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  const msgDiv = document.getElementById("form-message"); // Referencia al div que creamos en el HTML

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // 1. UX: Limpiar mensajes previos
    if (msgDiv) {
        msgDiv.style.display = 'none';
        msgDiv.className = ''; 
    }

    const data = {
      email: form.email.value.trim(),
      alias: form.alias.value.trim(),
      comentario: form.comentario.value.trim(),
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // 2. UX: Feedback inmediato de carga
    submitBtn.disabled = true;
    submitBtn.textContent = "Procesando..."; // Más formal que "Enviando..."
    submitBtn.style.opacity = "0.7";

    try {
      // Nota: Usamos la ruta completa para evitar problemas con el .htaccess
      const response = await fetch("/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "No se pudo procesar la solicitud");
      }

      // 3. ÉXITO: Mensaje "Google Safe" y Elegante
      // Usamos el color Sage (#2a3a34) para validar "Wellness" 
      if (msgDiv) {
          msgDiv.style.display = 'block';
          msgDiv.style.backgroundColor = 'rgba(42, 58, 52, 0.9)'; // Sage con transparencia
          msgDiv.style.border = '1px solid #4a6b5d';
          msgDiv.style.color = '#f6f3ee'; // Ivory
          msgDiv.innerHTML = `
            <strong>¡Solicitud Recibida!</strong><br>
            Nuestro Concierge le contactará en breve a su correo.
          `;
      }
      
      form.reset();

    } catch (error) {
      console.error(error);
      
      // 4. ERROR: Mensaje discreto, no alarmista
      if (msgDiv) {
          msgDiv.style.display = 'block';
          msgDiv.style.backgroundColor = 'rgba(60, 20, 20, 0.8)'; // Rojo oscuro muy sutil
          msgDiv.style.border = '1px solid #5c3a3a';
          msgDiv.style.color = '#f6f3ee'; // Ivory
          msgDiv.textContent = "Lo sentimos, hubo un error de conexión. Por favor intente vía WhatsApp.";
      }

    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      submitBtn.style.opacity = "1";
    }
  });
});