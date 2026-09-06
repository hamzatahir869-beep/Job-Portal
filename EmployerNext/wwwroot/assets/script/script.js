(function () {
  "use strict";

  var animMap = [
    { sel: ".clp-navbar", anim: "fade-down", delay: 0 },
    { sel: ".clp-hero-badge", anim: "fade-down", delay: 0 },
    { sel: ".clp-hero-title", anim: "fade-up", delay: 100 },
    { sel: ".clp-hero-desc", anim: "fade-up", delay: 200 },
    { sel: ".clp-hero-buttons", anim: "fade-up", delay: 300 },
    { sel: ".clp-feature-box", anim: "fade-right", delay: 200 },
    { sel: ".clp-trust-list", anim: "fade-up", delay: 200 },
    { sel: ".clp-companies", anim: "zoom-in", delay: 100 },
    { sel: ".rws-title", anim: "fade-up", delay: 0 },
    { sel: ".rws-subtitle", anim: "fade-up", delay: 100 },
    { sel: ".rws-tabs", anim: "fade-up", delay: 200 },
    { sel: ".rws-card", anim: "flip-up", delay: 0 },
    { sel: ".pkg-heading", anim: "fade-up", delay: 0 },
    { sel: ".pkg-card-wrap", anim: "fade-up", delay: 0 },
    { sel: ".rp-badges", anim: "fade-up", delay: 300 },
    { sel: ".rp-heading", anim: "fade-up", delay: 0 },
    { sel: ".rp-step-col", anim: "fade-up", delay: 0 },
    { sel: ".rp-trust-title", anim: "fade-left", delay: 0 },
    { sel: ".rp-trust-list li", anim: "fade-left", delay: 0 },
    { sel: ".rp-testi-card", anim: "zoom-in", delay: 100 },
    { sel: ".rp-rating-card", anim: "fade-right", delay: 200 },
    { sel: ".clp-faq-heading", anim: "fade-up", delay: 0 },
    { sel: ".clp-faq-item", anim: "slide-reveal", delay: 0 },
    { sel: ".frr-badge", anim: "fade-down", delay: 0 },
    { sel: ".frr-heading", anim: "fade-up", delay: 100 },
    { sel: ".frr-subtext", anim: "fade-up", delay: 200 },
    { sel: ".frr-checklist", anim: "fade-left", delay: 300 },
    { sel: ".frr-illustration", anim: "zoom-in", delay: 400 },
    { sel: ".frr-form-label", anim: "fade-up", delay: 0 },
    { sel: ".frr-upload-zone", anim: "fade-up", delay: 100 },
    // { sel: ".frr-submit-btn", anim: "zoom-in", delay: 200 },
    { sel: ".frr-privacy", anim: "fade-up", delay: 300 },
    {
      sel: ".clf-footer__top .col-12:nth-child(1)",
      anim: "fade-left",
      delay: 0,
    },
    {
      sel: ".clf-footer__top .col-6:nth-child(2)",
      anim: "fade-up",
      delay: 100,
    },
    {
      sel: ".clf-footer__top .col-6:nth-child(3)",
      anim: "fade-up",
      delay: 200,
    },
    {
      sel: ".clf-footer__top .col-6:nth-child(4)",
      anim: "fade-up",
      delay: 300,
    },
    { sel: ".clf-cta-box", anim: "fade-right", delay: 400 },
    { sel: ".clf-footer__bottom", anim: "fade-up", delay: 0 },
  ];

  var staggerSelectors = [
    ".rws-card",
    ".pkg-card-wrap",
    ".rp-step-col",
    ".rp-trust-list li",
    ".clp-faq-item",
  ];

  animMap.forEach(function (entry) {
    var isStagger = staggerSelectors.indexOf(entry.sel) !== -1;
    document.querySelectorAll(entry.sel).forEach(function (el, i) {
      if (el.classList.contains("clp-anim")) return;
      el.classList.add("clp-anim");
      el.setAttribute("data-anim", entry.anim);
      var delay = isStagger ? Math.min(i * 100, 500) : entry.delay;
      if (delay) el.setAttribute("data-delay", String(delay));
    });
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = el.getAttribute("data-delay");
        if (delay) el.style.animationDelay = delay + "ms";
        el.classList.add("clp-anim--visible");
        observer.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  document.querySelectorAll(".clp-anim").forEach(function (el) {
    observer.observe(el);
  });

  document.addEventListener("DOMContentLoaded", function () {
    /* ── Sticky Navbar ── */
    var navbar = document.querySelector(".clp-navbar");
    window.addEventListener("scroll", function () {
      navbar.classList.toggle("clp-navbar--sticky", window.scrollY > 50);
    });

    /* ── Smooth Scroll ── */
    var navScrollMap = {
      Services: "#services",
      "Resume Samples": "#services",
      Pricing: "#pricing",
      "About Us": "#about",
      Resources: "#resources",
      FAQs: "#faqs",
    };

    function smoothScrollTo(id) {
      var target = document.querySelector(id);
      if (!target) return;
      var navHeight = document.querySelector(".clp-navbar").offsetHeight;
      var top =
        target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
      window.scrollTo({ top: top, behavior: "smooth" });
    }

    document.querySelectorAll(".clp-nav-link").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        var selector = navScrollMap[link.textContent.trim()];
        if (selector) smoothScrollTo(selector);
        var mobileMenu = document.querySelector("#clpMobileMenu");
        if (mobileMenu && mobileMenu.classList.contains("show")) {
          bootstrap.Collapse.getInstance(mobileMenu)?.hide();
        }
      });
    });
    document
      .querySelectorAll(".clp-cta-btn, .clp-btn-primary")
      .forEach(function (btn) {
        btn.addEventListener("click", function () {
          smoothScrollTo("#pricing");
        });
      });

    document.querySelectorAll(".clp-btn-secondary").forEach(function (btn) {
      btn.addEventListener("click", function () {
        smoothScrollTo("#free-review");
      });
    });

    /* ── Services Tab Switcher ── */
    document.querySelectorAll(".rws-tab-btn").forEach(function (tab) {
      tab.addEventListener("click", function () {
        var target = tab.getAttribute("data-rws-tab");
        document.querySelectorAll(".rws-tab-btn").forEach(function (t) {
          t.classList.remove("rws-active");
        });
        tab.classList.add("rws-active");
        document.querySelectorAll(".rws-pane").forEach(function (p) {
          p.classList.toggle(
            "rws-pane-active",
            p.getAttribute("data-rws-pane") === target,
          );
        });
      });
    });

    /* ── Process Steps Active State ── */
    window.rpActivate = function (card) {
      document.querySelectorAll(".rp-step-card").forEach(function (c) {
        c.classList.remove("rp-active");
      });
      card.classList.add("rp-active");
    };

    /* ── Testimonial Slider ── */
    var rpTestiCurrent = 0;
    var TESTI_TOTAL = document.querySelectorAll(".rp-testi-slide").length || 3;

    window.rpTestiGo = function (index) {
      document.querySelectorAll(".rp-testi-slide").forEach(function (s) {
        s.style.display = "none";
      });
      document.querySelectorAll(".rp-testi-dot").forEach(function (d) {
        d.classList.remove("rp-dot-active");
      });
      var slides = document.querySelectorAll(".rp-testi-slide");
      var dots = document.querySelectorAll(".rp-testi-dot");
      if (slides[index]) slides[index].style.display = "block";
      if (dots[index]) dots[index].classList.add("rp-dot-active");
      rpTestiCurrent = index;
    };

    setInterval(function () {
      rpTestiGo((rpTestiCurrent + 1) % TESTI_TOTAL);
    }, 4000);

    /* ── FAQ Accordion ── */
    document.querySelectorAll(".clp-faq-trigger").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.closest(".clp-faq-item");
        var isOpen = item.classList.contains("clp-faq-open");
        document
          .querySelectorAll(".clp-faq-item.clp-faq-open")
          .forEach(function (open) {
            open.classList.remove("clp-faq-open");
            open
              .querySelector(".clp-faq-trigger")
              .setAttribute("aria-expanded", "false");
          });
        if (!isOpen) {
          item.classList.add("clp-faq-open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });

    /* ── Resume Upload — Drag & Drop ── */
    var dropZone = document.querySelector(".frr-upload-zone");
    var fileInput = document.getElementById("frrFileInput");

    if (dropZone && fileInput) {
      var uploadText = dropZone.querySelector(".frr-upload-text");

      dropZone.addEventListener("dragover", function (e) {
        e.preventDefault();
        dropZone.style.borderColor = "#2f5bea";
        dropZone.style.background = "#eef3ff";
      });
      dropZone.addEventListener("dragleave", function () {
        dropZone.style.borderColor = "#b8caf5";
        dropZone.style.background = "#f5f8ff";
      });
      dropZone.addEventListener("drop", function (e) {
        e.preventDefault();
        dropZone.style.borderColor = "#b8caf5";
        dropZone.style.background = "#f5f8ff";
        var file = e.dataTransfer.files[0];
        if (file && uploadText) uploadText.textContent = file.name;
      });
      fileInput.addEventListener("change", function () {
        if (fileInput.files[0] && uploadText)
          uploadText.textContent = fileInput.files[0].name;
      });
    }

    /* ── Video Modal ── */
    var playBtn = document.getElementById("clpPlayBtn");
    var modal = document.getElementById("clpVideoModal");
    var closeBtn = document.getElementById("clpModalClose");
    var player = document.getElementById("clpModalPlayer");

    if (playBtn && modal && player) {
      function openModal() {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
        player.play();
      }
      function closeModal() {
        modal.classList.remove("active");
        document.body.style.overflow = "";
        player.pause();
        player.currentTime = 0;
      }

      playBtn.addEventListener("click", openModal);
      closeBtn.addEventListener("click", closeModal);
      modal.addEventListener("click", function (e) {
        if (e.target === modal) closeModal();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && modal.classList.contains("active"))
          closeModal();
      });

    }
  });
})();
