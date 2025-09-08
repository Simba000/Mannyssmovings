// Manny's Moving – simple site JS
(function () {
  // Helpers
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---------------------------
  // Footer year
  // ---------------------------
  (function setYear() {
    const footP = $('footer p');
    if (!footP) return;
    footP.innerHTML = footP.innerHTML.replace(/©\s*\d{4}/, `© ${new Date().getFullYear()}`);
  })();

  // ---------------------------
  // Lazy-load images (fallback)
  // ---------------------------
  (function lazyImages() {
    $$("img").forEach(img => {
      if (!img.getAttribute("loading")) img.setAttribute("loading", "lazy");
    });
  })();

  // ---------------------------
  // Phone formatter: (XXX) XXX-XXXX
  // ---------------------------
  function formatPhone(el) {
    if (!el) return;
    el.addEventListener("input", () => {
      const digits = el.value.replace(/\D/g, "").slice(0, 10);
      let out = digits;
      if (digits.length > 6) out = `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
      else if (digits.length > 3) out = `(${digits.slice(0,3)}) ${digits.slice(3)}`;
      else if (digits.length > 0) out = `(${digits}`;
      el.value = out;
    });
  }

  // ---------------------------
  // Card formatters
  // ---------------------------
  function formatCard(el) {
    if (!el) return;
    el.addEventListener("input", () => {
      const digits = el.value.replace(/\D/g, "").slice(0, 19);
      el.value = digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    });
  }
  function formatExp(el) {
    if (!el) return;
    el.addEventListener("input", () => {
      let v = el.value.replace(/\D/g, "").slice(0, 4);
      if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
      el.value = v;
    });
  }
  function formatCVV(el) {
    if (!el) return;
    el.addEventListener("input", () => {
      el.value = el.value.replace(/\D/g, "").slice(0, 4);
    });
  }

  // ---------------------------
  // Show/hide card fields depending on method
  // ---------------------------
  function toggleCardFields(methodSel) {
    if (!methodSel) return;
    const ids = ["card", "exp", "cvv"];
    function setVisible(show) {
      ids.forEach(id => {
        const input = document.getElementById(id);
        if (!input) return;
        const label = input.previousElementSibling;
        [label, input].forEach(el => { if (el) el.style.display = show ? "" : "none"; });
      });
    }
    // Init
    setVisible(methodSel.value === "Credit/Debit Card");
    // On change
    methodSel.addEventListener("change", () => {
      setVisible(methodSel.value === "Credit/Debit Card");
    });
  }

  // ---------------------------
  // LocalStorage helpers
  // ---------------------------
  function saveForm(form, key) {
    if (!form) return;
    const data = {};
    $$("input, select, textarea", form).forEach(f => data[f.name || f.id] = f.value);
    localStorage.setItem(key, JSON.stringify(data));
  }
  function loadForm(form, key) {
    if (!form) return;
    const raw = localStorage.getItem(key);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      $$("input, select, textarea", form).forEach(f => {
        const k = f.name || f.id;
        if (data[k] != null) f.value = data[k];
      });
    } catch {}
  }
  function confirmMessage(container, msg) {
    if (!container) return;
    let note = $(".note", container);
    if (!note) {
      note = document.createElement("p");
      note.className = "note";
      container.appendChild(note);
    }
    note.textContent = msg;
  }

  // ---------------------------
  // Page-specific wiring
  // ---------------------------

  // QUOTE PAGE
  (function quotePage() {
    const form = $("form");
    const card = $(".container-card");
    if (!form || !/quote\.html$/i.test(location.pathname)) return;

    formatPhone($("#phone"));
    loadForm(form, "mm_quote");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      saveForm(form, "mm_quote");
      confirmMessage(card, "✅ Thanks! We got your request. We’ll reach out soon with your free quote.");
      form.reset();
    });
  })();

  // PAYMENT PAGE
  (function paymentPage() {
    const form = $("form");
    const card = $(".container-card");
    if (!form || !/payment\.html$/i.test(location.pathname)) return;

    const method = $("#method");
    toggleCardFields(method);

    formatCard($("#card"));
    formatExp($("#exp"));
    formatCVV($("#cvv"));
    loadForm(form, "mm_payment");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      saveForm(form, "mm_payment");
      // Simple check
      if (method && method.value === "Credit/Debit Card") {
        const c = ($("#card")?.value || "").replace(/\s/g, "");
        if (c.length < 13) {
          confirmMessage(card, "⚠️ Please check your card number.");
          return;
        }
      }
      confirmMessage(card, "✅ Demo payment received. (No real charge.)");
      form.reset();
      toggleCardFields(method); // reset visibility to default
    });
  })();

  // CONTACT PAGE
  (function contactPage() {
    const form = $("form");
    const card = $(".container-card");
    if (!form || !/contact\.html$/i.test(location.pathname)) return;

    loadForm(form, "mm_contact");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      saveForm(form, "mm_contact");
      const name = $("#cname")?.value || "Friend";
      confirmMessage(card, `✅ Thanks, ${name}! We’ll reply to your message soon.`);
      form.reset();
    });
  })();

  // HOME PAGE niceties
  (function homePage() {
    if (!/index\.html$/i.test(location.pathname)) return;
    // Ensure service icons are lazy
    $$(".service-card img").forEach(img => img.setAttribute("loading", "lazy"));
  })();

})();
