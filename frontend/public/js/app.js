const API = window.API_BASE;

// Charger les avis
async function loadTestimonials() {
  try {
    const res = await fetch(`${API}/api/testimonials`);
    const data = await res.json();
    const container = document.getElementById('testimonial-list');
    container.innerHTML = data.map(t => `
      <div class="testimonial">
        <p>"${escapeHtml(t.message)}"</p>
        <small>${escapeHtml(t.structure)} - ${escapeHtml(t.date)}</small>
      </div>`).join('');
  } catch (err) {
    console.error(err);
  }
}

// Publier un nouvel avis
document.getElementById('testimonial-form').addEventListener('submit', async e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const body = Object.fromEntries(fd);
  const res = await fetch(`${API}/api/testimonials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (res.ok) { e.target.reset(); loadTestimonials(); }
  else alert('Erreur lors de l\'ajout de l\'avis');
});

// Envoyer le formulaire contact
document.getElementById('contact-form').addEventListener('submit', async e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const body = Object.fromEntries(fd);
  const res = await fetch(`${API}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (res.ok) { alert('Message envoyé !'); e.target.reset(); }
  else alert('Erreur lors de l\'envoi du message');
});

// Sécuriser le contenu affiché
function escapeHtml(str = '') {
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}

document.addEventListener('DOMContentLoaded', loadTestimonials);
