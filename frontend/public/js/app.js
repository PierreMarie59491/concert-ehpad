// URL du backend Render
const API_BASE = "https://concert-ehpad-2.onrender.com";

// Charger les avis
async function loadTestimonials() {
  try {
    const res = await fetch(`${API_BASE}/testimonials`);
    if (!res.ok) throw new Error("Erreur de chargement des avis");
    const testimonials = await res.json();

    const list = document.getElementById("testimonial-list");
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
    console.error(err);
  }
}

// Ajouter un avis
document.getElementById("testimonial-form")?.addEventListener("submit", async (e) => {
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
    console.error(err);
  }
});

// Charger au démarrage
window.addEventListener("DOMContentLoaded", loadTestimonials);
