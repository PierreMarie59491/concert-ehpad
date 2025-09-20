// URL du backend Render
const API_BASE = "https://concert-ehpad-2.onrender.com";

// --- Charger les avis ---
async function loadTestimonials() {
  const list = document.getElementById("testimonial-list");
  if (!list) return; // éviter innerHTML sur null

  try {
    const res = await fetch(`${API_BASE}/testimonials`);
    if (!res.ok) throw new Error("Erreur de chargement des avis");

    const testimonials = await res.json();
    list.innerHTML = "";

    testimonials.forEach(t => {
      const div = document.createElement("div");
      div.classList.add("testimonial");
      div.innerHTML = `
        <p>"${t.message}"</p>
        <p><strong>${t.structure}</strong> – ${t.date}</p>
      `;
      list.appendChild(div);
    });
  } catch (err) {
    console.error("Erreur fetch testimonials:", err);
    list.innerHTML = "<p>Impossible de charger les avis pour le moment.</p>";
  }
}

// --- Ajouter un avis ---
const testimonialForm = document.getElementById("testimonial-form");
if (testimonialForm) {
  testimonialForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const data = {
      structure: form.structure.value,
      message: form.message.value,
      date: form.date.value,
    };

    try {
      const res = await fetch(`${API_BASE}/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Erreur lors de l'envoi de l'avis");

      form.reset();
      loadTestimonials();
    } catch (err) {
      console.error("Erreur POST testimonial:", err);
      alert("Impossible d'envoyer l'avis pour le moment.");
    }
  });
}

// --- Charger les avis au démarrage ---
window.addEventListener("DOMContentLoaded", loadTestimonials);
