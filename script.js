// Simple Quote Form Script
document.addEventListener("DOMContentLoaded", function() {
  const form = document.querySelector("form");

  form.addEventListener("submit", function(event) {
    event.preventDefault(); // prevent page reload

    // Grab values
    const name = form.querySelector("input[type='text']").value.trim();
    const phone = form.querySelector("input[type='tel']").value.trim();
    const email = form.querySelector("input[type='email']").value.trim();

    // Basic validation
    if (!name || !phone || !email) {
      alert("⚠️ Please fill out your name, phone, and email before submitting.");
      return;
    }

    // Show thank you message
    alert(`✅ Thank you, ${name}! Your free quote request has been received. We'll contact you shortly.`);
    form.reset();
  });
});
