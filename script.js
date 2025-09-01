// Small helpers
document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const form = document.getElementById('quoteForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      const success = document.getElementById('quoteSuccess');
      if (form.action && form.action.includes('FORM_ENDPOINT')) {
        console.warn('Replace FORM_ENDPOINT in quote.html with your Formspree endpoint.');
      }
      e.preventDefault();
      const data = new FormData(form);
      try {
        const r = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (r.ok) {
          if (success) success.classList.remove('hidden');
          form.reset();
        } else {
          alert('There was an issue sending your quote. Please try again or call us.');
        }
      } catch (err) {
        alert('Network error. Please try again or call us.');
      }
    });
  }
});
