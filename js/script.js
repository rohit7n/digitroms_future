/* =====================================================
   DIGITROMS — MAIN JAVASCRIPT
   ===================================================== */

"use strict";

/* ─── NAVBAR ─── */
(function initNavbar() {
  const navbar    = document.querySelector(".navbar");
  const hamburger = document.querySelector(".hamburger");
  const navMenu   = document.querySelector(".nav-menu");
  const dropItems = document.querySelectorAll(".nav-item.has-dropdown");

  if (!navbar) return;

  // Scroll: add shadow + scrolled class
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      const open = hamburger.classList.toggle("open");
      navMenu.classList.toggle("mobile-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
  }

  // Dropdown toggle (mobile: tap to open; desktop: hover in CSS)
  dropItems.forEach(item => {
    const link = item.querySelector(".nav-link");
    if (!link) return;
    link.addEventListener("click", e => {
      if (window.innerWidth <= 960) {
        e.preventDefault();
        item.classList.toggle("open");
      }
    });
  });

  // Close menu on outside click
  document.addEventListener("click", e => {
    if (hamburger && navMenu && !navbar.contains(e.target)) {
      hamburger.classList.remove("open");
      navMenu.classList.remove("mobile-open");
      document.body.style.overflow = "";
    }
  });

  // Mark active page
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link[data-page]").forEach(link => {
    if (link.dataset.page === currentPath) link.classList.add("active");
  });
})();

/* ─── SMOOTH SCROLL ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", e => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({ top: target.offsetTop - offset, behavior: "smooth" });
  });
});

/* ─── SCROLL ANIMATIONS ─── */
(function initScrollAnimations() {
  const elements = document.querySelectorAll("[data-animate]");
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  elements.forEach(el => observer.observe(el));
})();

/* ─── COUNTER ANIMATION ─── */
(function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || "";
      const duration = 1800;
      const start  = performance.now();
      observer.unobserve(el);

      function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease     = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * ease) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
})();

/* ─── PROJECT FILTER (projects.html) ─── */
(function initProjectFilter() {
  const filterBtns  = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const categories = card.dataset.category || "";
        const show = filter === "all" || categories.includes(filter);
        card.style.opacity = "0";
        card.style.transform = "scale(0.94)";
        setTimeout(() => {
          card.style.display = show ? "" : "none";
          if (show) {
            requestAnimationFrame(() => {
              card.style.opacity = "1";
              card.style.transform = "scale(1)";
            });
          }
        }, 180);
        card.style.transition = "opacity 0.3s, transform 0.3s";
      });
    });
  });
})();

/* ─── PROJECT MODAL ─── */
(function initProjectModal() {
  const overlay    = document.querySelector(".modal-overlay");
  const modalClose = document.querySelector(".modal-close");
  const projectCards = document.querySelectorAll(".project-card[data-project]");
  if (!overlay) return;

  const projects = {
    ecom: {
      title: "NexCart — E-Commerce Platform",
      emoji: "🛒",
      color: "linear-gradient(135deg,#0f2040,#1a3a6b)",
      tags:  ["Full Stack","React","Node.js"],
      desc:  "A high-performance multi-vendor e-commerce platform built for scalability. Features real-time inventory management, secure payment gateway integration, intelligent recommendation engine, and a powerful seller dashboard with analytics. Processed over 50,000 transactions in beta.",
      tech:  ["React","Node.js","PostgreSQL","Redis","Stripe API","AWS S3","Docker"],
      live:  "#"
    },
    fintech: {
      title: "PayLink — Fintech Dashboard",
      emoji: "💳",
      color: "linear-gradient(135deg,#071a0f,#0d3320)",
      tags:  ["Frontend","React","Charts"],
      desc:  "A sleek financial analytics dashboard providing real-time spending insights, budget tracking, investment portfolio visualization, and automated expense categorization. Features role-based access control and multi-currency support.",
      tech:  ["React","D3.js","Chart.js","Firebase","Material UI","REST APIs"],
      live:  "#"
    },
    sec: {
      title: "ShieldOS — Security Audit Tool",
      emoji: "🔐",
      color: "linear-gradient(135deg,#200a0a,#4a1010)",
      tags:  ["Security","Backend","Python"],
      desc:  "An automated penetration testing and vulnerability assessment tool for web applications. Scans for OWASP Top 10 vulnerabilities, generates detailed security reports, and provides remediation guidance. Used by 20+ enterprises.",
      tech:  ["Python","Nmap","OWASP ZAP","FastAPI","PostgreSQL","Docker","Celery"],
      live:  "#"
    },
    health: {
      title: "MedSync — Healthcare Portal",
      emoji: "🏥",
      color: "linear-gradient(135deg,#071b20,#0e3348)",
      tags:  ["Full Stack","Next.js","HIPAA"],
      desc:  "HIPAA-compliant telemedicine platform enabling virtual consultations, prescription management, lab result tracking, and appointment scheduling. Integrates with major EHR systems and supports real-time video calls.",
      tech:  ["Next.js","TypeScript","Twilio","PostgreSQL","Redis","AWS","Tailwind"],
      live:  "#"
    },
    saas: {
      title: "TaskFlow — SaaS Project Manager",
      emoji: "📋",
      color: "linear-gradient(135deg,#0d0720,#1a1040)",
      tags:  ["SaaS","Full Stack","Real-time"],
      desc:  "A collaborative project management SaaS with Kanban boards, Gantt charts, time tracking, resource allocation, and client-facing portals. Real-time collaboration via WebSockets with 99.9% uptime SLA.",
      tech:  ["Vue.js","Laravel","MySQL","Socket.io","Redis","DigitalOcean","Pusher"],
      live:  "#"
    },
    mobile: {
      title: "DeliverEase — Logistics App",
      emoji: "🚚",
      color: "linear-gradient(135deg,#1a0d05,#3d2508)",
      tags:  ["Mobile","React Native","Maps"],
      desc:  "Cross-platform logistics and delivery management app with real-time GPS tracking, dynamic route optimization, driver management, proof of delivery, and automated customer notifications. Reduced delivery times by 35%.",
      tech:  ["React Native","Google Maps API","Node.js","MongoDB","Firebase","Expo"],
      live:  "#"
    }
  };

  projectCards.forEach(card => {
    card.addEventListener("click", () => {
      const key  = card.dataset.project;
      const data = projects[key];
      if (!data) return;

      overlay.querySelector(".modal-title").textContent = data.title;
      overlay.querySelector(".modal-thumb").style.background = data.color;
      overlay.querySelector(".modal-thumb").textContent = data.emoji;

      const tagsEl = overlay.querySelector(".modal-tags");
      tagsEl.innerHTML = data.tags.map(t =>
        `<span class="badge badge--blue">${t}</span>`
      ).join("");

      overlay.querySelector(".modal-description").textContent = data.desc;

      const techEl = overlay.querySelector(".tech-pills");
      techEl.innerHTML = data.tech.map(t => `<span class="tech-pill">${t}</span>`).join("");

      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  function closeModal() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }
  if (modalClose) modalClose.addEventListener("click", closeModal);
  overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
})();

/* ─── CONTACT FORM VALIDATION ─── */
(function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  function showError(input, msg) {
    input.classList.add("error");
    const err = input.parentElement.querySelector(".form-error");
    if (err) { err.textContent = msg; err.classList.add("show"); }
  }
  function clearError(input) {
    input.classList.remove("error");
    const err = input.parentElement.querySelector(".form-error");
    if (err) err.classList.remove("show");
  }
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    let valid = true;

    const fields = {
      name:    form.querySelector("#contactName"),
      email:   form.querySelector("#contactEmail"),
      subject: form.querySelector("#contactSubject"),
      message: form.querySelector("#contactMessage")
    };

    Object.values(fields).forEach(clearError);

    if (!fields.name || fields.name.value.trim().length < 2) {
      showError(fields.name, "Please enter your full name (min 2 characters)."); valid = false;
    }
    if (!fields.email || !validateEmail(fields.email.value.trim())) {
      showError(fields.email, "Please enter a valid email address."); valid = false;
    }
    if (!fields.subject || fields.subject.value.trim().length < 3) {
      showError(fields.subject, "Please enter a subject."); valid = false;
    }
    if (!fields.message || fields.message.value.trim().length < 20) {
      showError(fields.message, "Message must be at least 20 characters."); valid = false;
    }

    if (valid) {
      const btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = "Sending…";
      setTimeout(() => {
        form.reset();
        btn.disabled = false;
        btn.textContent = "Send Message";
        const success = form.querySelector(".form-success");
        if (success) { success.classList.add("show"); setTimeout(() => success.classList.remove("show"), 5000); }
      }, 1400);
    }
  });

  // Live validation
  form.querySelectorAll(".form-control").forEach(input => {
    input.addEventListener("blur", () => {
      if (input.value.trim()) clearError(input);
    });
  });
})();

/* ─── JOIN FORM VALIDATION ─── */
(function initJoinForm() {
  const form = document.getElementById("joinForm");
  if (!form) return;

  function showError(input, msg) {
    if (!input) return;
    input.classList.add("error");
    const err = input.parentElement.querySelector(".form-error");
    if (err) { err.textContent = msg; err.classList.add("show"); }
  }
  function clearError(input) {
    if (!input) return;
    input.classList.remove("error");
    const err = input.parentElement.querySelector(".form-error");
    if (err) err.classList.remove("show");
  }
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    let valid = true;

    const f = {
      name:       form.querySelector("#joinName"),
      email:      form.querySelector("#joinEmail"),
      phone:      form.querySelector("#joinPhone"),
      role:       form.querySelector("#joinRole"),
      experience: form.querySelector("#joinExperience"),
      portfolio:  form.querySelector("#joinPortfolio"),
      bio:        form.querySelector("#joinBio")
    };

    Object.values(f).forEach(clearError);

    if (!f.name  || f.name.value.trim().length  < 2) { showError(f.name, "Full name required."); valid = false; }
    if (!f.email || !validateEmail(f.email.value)) { showError(f.email, "Valid email required."); valid = false; }
    if (!f.role  || !f.role.value) { showError(f.role, "Please select your primary role."); valid = false; }
    if (!f.bio   || f.bio.value.trim().length < 30) { showError(f.bio, "Please write at least 30 characters about yourself."); valid = false; }

    const skills = form.querySelectorAll('input[name="skills"]:checked');
    if (skills.length === 0) {
      const skillsErr = form.querySelector("#skillsError");
      if (skillsErr) { skillsErr.textContent = "Please select at least one skill."; skillsErr.classList.add("show"); }
      valid = false;
    } else {
      const skillsErr = form.querySelector("#skillsError");
      if (skillsErr) skillsErr.classList.remove("show");
    }

    if (valid) {
      const btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = "Submitting Application…";
      setTimeout(() => {
        form.reset();
        btn.disabled = false;
        btn.textContent = "Submit Application";
        const success = document.getElementById("joinSuccess");
        if (success) {
          success.style.display = "block";
          success.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 1600);
    }
  });
})();

/* ─── LOGIN / SIGNUP TOGGLE ─── */
(function initAuthToggle() {
  const tabBtns   = document.querySelectorAll(".auth-tab-btn");
  const panels    = document.querySelectorAll(".auth-form-panel");
  const headerTitle = document.querySelector(".auth-form-header h2");
  const headerSub   = document.querySelector(".auth-form-header p");

  if (!tabBtns.length) return;

  const titles = {
    login:  { h2: "Welcome back", p: "Sign in to your Digitroms account" },
    signup: { h2: "Create an account", p: "Join thousands of clients and freelancers" }
  };

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const tab = btn.dataset.tab;

      panels.forEach(p => {
        p.classList.toggle("active", p.id === tab + "Panel");
      });

      if (headerTitle && headerSub && titles[tab]) {
        headerTitle.textContent = titles[tab].h2;
        headerSub.textContent   = titles[tab].p;
      }
    });
  });

  // Auth form validation
  ["loginForm","signupForm"].forEach(id => {
    const form = document.getElementById(id);
    if (!form) return;

    form.addEventListener("submit", e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      const original = btn.textContent;
      btn.textContent = "Please wait…";
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = original;
        const msg = id === "loginForm"
          ? "Login functionality coming soon — backend integration required."
          : "Account created! Please verify your email.";
        alert(msg);
      }, 1200);
    });
  });

  // Switch links
  document.querySelectorAll("[data-switch-tab]").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const tab = link.dataset.switchTab;
      document.querySelector(`.auth-tab-btn[data-tab="${tab}"]`)?.click();
    });
  });
})();

/* ─── HERO FLOAT CARD GLOW (home) ─── */
(function initHeroInteraction() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  hero.addEventListener("mousemove", e => {
    const { left, top, width, height } = hero.getBoundingClientRect();
    const x = (e.clientX - left) / width  - 0.5;
    const y = (e.clientY - top)  / height - 0.5;
    const cards = hero.querySelectorAll(".hero-float-card");
    cards.forEach((card, i) => {
      const depth = (i + 1) * 6;
      card.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
    });
  });
  hero.addEventListener("mouseleave", () => {
    hero.querySelectorAll(".hero-float-card").forEach(card => {
      card.style.transform = "";
    });
  });
})();

/* ─── TESTIMONIAL SLIDER (auto-rotate) ─── */
(function initTestimonialHighlight() {
  const cards = document.querySelectorAll(".testimonial-card");
  if (!cards.length) return;
  let current = 0;
  cards[0].style.boxShadow = "var(--shadow-md)";
  setInterval(() => {
    cards[current].style.boxShadow = "";
    current = (current + 1) % cards.length;
    cards[current].style.boxShadow = "0 8px 30px rgba(232,25,44,0.15)";
    cards[current].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, 3500);
})();

/* ─── BACK TO TOP ─── */
(function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.style.opacity = window.scrollY > 500 ? "1" : "0";
    btn.style.pointerEvents = window.scrollY > 500 ? "auto" : "none";
  }, { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();

/* ─── SKILL PROGRESS BARS (about / join) ─── */
(function initSkillBars() {
  const bars = document.querySelectorAll(".progress-fill[data-width]");
  if (!bars.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.width;
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });
  bars.forEach(b => {
    b.style.width = "0";
    b.style.transition = "width 1.2s cubic-bezier(0.4,0,0.2,1)";
    observer.observe(b);
  });
})();

/* ─── NAV ACTIVE STATE (single page sections) ─── */
(function updateNavOnScroll() {
  const sections = document.querySelectorAll("section[id]");
  if (!sections.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        document.querySelectorAll(".nav-link[href='#" + id + "']").forEach(l => l.classList.add("active"));
        document.querySelectorAll(".nav-link:not([href='#" + id + "'])").forEach(l => l.classList.remove("active"));
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();
