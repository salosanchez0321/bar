/* ==========================================================
   ARCANA & ELIXIRES · COVEN BAR — main.js
   Módulos: navbar, reveal, contadores, oráculo tarot, formulario
   ========================================================== */
const Arcana = (() => {
  "use strict";

  const Navbar = {
    init() {
      const nav = document.querySelector(".navbar-arcana");
      if (!nav) return;
      const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 12);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });

      const collapse = document.getElementById("mainNav");
      if (collapse) {
        collapse.addEventListener("click", (e) => {
          if (e.target.closest(".nav-link") && collapse.classList.contains("show")) {
            bootstrap.Collapse.getOrCreateInstance(collapse).hide();
          }
        });
      }
    },
  };

  const Reveal = {
    init() {
      const els = document.querySelectorAll(".reveal");
      if (!("IntersectionObserver" in window)) {
        els.forEach(el => el.classList.add("is-visible"));
        return;
      }
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      els.forEach(el => io.observe(el));
    },
  };

  const Counters = {
    init() {
      const counters = document.querySelectorAll("[data-count]");
      if (!counters.length) return;
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || "";
          const dur = 1600;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.unobserve(el);
        });
      }, { threshold: 0.5 });
      counters.forEach(el => io.observe(el));
    },
  };

  /* ---------- Oráculo del Tarot (recomendador de pócimas) ---------- */
  const TarotOracle = {
    init() {
      const cards = document.querySelectorAll("[data-tarot-card]");
      const resultBox = document.getElementById("tarotResult");
      if (!cards.length || !resultBox) return;

      const readings = [
        {
          arcano: "XVIII · La Luna",
          mensaje: "Tu intuición está despierta, pero ocultas algo en las sombras. Necesitas claridad entre la bruma.",
          elixir: "Luna Negra (Mezcal ahumado, violeta y sal negra)"
        },
        {
          arcano: "II · La Suma Sacerdotisa",
          mensaje: "El silencio guarda las respuestas que buscas. Es noche de observar antes de actuar.",
          elixir: "La Sacerdotisa (Vodka infusionado en lavanda y pomelo)"
        },
        {
          arcano: "XIII · La Muerte (Transformación)",
          mensaje: "Un ciclo se cierra esta noche para dar paso a algo irrepetible. Brinda por lo que renace.",
          elixir: "Sangre de Pacto (Frutos oscuros, jamaica y especias)"
        }
      ];

      cards.forEach((btn, index) => {
        btn.addEventListener("click", () => {
          cards.forEach(c => c.classList.remove("is-revealed"));
          btn.classList.add("is-revealed");
          const data = readings[index % readings.length];
          resultBox.innerHTML = `
            <p class="eyebrow mb-1">${data.arcano}</p>
            <p class="mb-2 text-bone">${data.mensaje}</p>
            <p class="small text-gold mb-0"><strong>Elixir asignado por el oráculo:</strong> ${data.elixir}</p>
          `;
          resultBox.classList.remove("d-none");
        });
      });
    }
  };

  const BackToTop = {
    init() {
      const btn = document.getElementById("backToTop");
      if (!btn) return;
      window.addEventListener("scroll", () =>
        btn.classList.toggle("show", window.scrollY > 450), { passive: true });
      btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    },
  };

  const ContactForm = {
    init() {
      const form = document.getElementById("contactForm");
      if (!form) return;
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (form.checkValidity()) {
          const ok = document.getElementById("formSuccess");
          const btn = form.querySelector("button[type=submit]");
          btn.disabled = true;
          btn.textContent = "Sellando pacto…";
          setTimeout(() => {
            form.reset();
            form.classList.remove("was-validated");
            btn.disabled = false;
            btn.innerHTML = 'Enviar invocación <i class="bi bi-send ms-2" aria-hidden="true"></i>';
            ok.classList.remove("d-none");
            ok.focus();
            setTimeout(() => ok.classList.add("d-none"), 6500);
          }, 800);
        } else {
          form.classList.add("was-validated");
        }
      });
    },
  };

  const FooterYear = {
    init() {
      document.querySelectorAll("[data-year]").forEach(el => {
        el.textContent = new Date().getFullYear();
      });
    },
  };

  const init = () => {
    Navbar.init();
    Reveal.init();
    Counters.init();
    TarotOracle.init();
    BackToTop.init();
    ContactForm.init();
    FooterYear.init();
  };

  return { init };
})();

document.addEventListener("DOMContentLoaded", Arcana.init);
