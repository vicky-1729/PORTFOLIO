document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initTypingEffect();
  initScrollReveal();
  initProgressBars();
  initThemeToggle();
  initContactForm();
});

function initNavigation() {
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const sections = document.querySelectorAll("main section, header");

  const handleScroll = () => {
    if (window.scrollY > 24) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    let current = "home";
    sections.forEach((section) => {
      const top = section.offsetTop;
      const id = section.getAttribute("id");
      if (id && window.scrollY >= top - 140) {
        current = id;
      }
    });

    navLinks.forEach((link) => {
      const match = link.getAttribute("href") === `#${current}`;
      link.classList.toggle("active", match);
    });
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    navMenu.classList.toggle("open");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initTypingEffect() {
  const target = document.getElementById("typing");
  if (!target) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const roles = [
    "DocuSign Administrator",
    "DocuSign Developer",
    "Salesforce Administrator",
  ];

  if (reducedMotion) {
    target.textContent = roles[1];
    return;
  }

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let speed = 90;

  const type = () => {
    const current = roles[roleIndex];

    if (deleting) {
      charIndex -= 1;
    } else {
      charIndex += 1;
    }

    target.textContent = current.slice(0, charIndex);

    if (!deleting && charIndex === current.length) {
      speed = 1500;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = 420;
    } else {
      speed = deleting ? 55 : 90;
    }

    window.setTimeout(type, speed);
  };

  type();
}

function initScrollReveal() {
  const revealItems = document.querySelectorAll(".reveal");
  if (!revealItems.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealItems.forEach((item) => observer.observe(item));
}

function initProgressBars() {
  const bars = document.querySelectorAll(".bar");
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const bar = entry.target;
        const fill = bar.querySelector("i");
        const value = Number(bar.dataset.value || "0");
        fill.style.width = `${Math.max(0, Math.min(100, value))}%`;
        obs.unobserve(bar);
      });
    },
    { threshold: 0.45 },
  );

  bars.forEach((bar) => observer.observe(bar));
}

function initThemeToggle() {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  const saved = localStorage.getItem("theme");
  const initial = saved || "light";
  root.setAttribute("data-theme", initial);
  updateIcon(toggle, initial);

  toggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") || "light";
    const next = current === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateIcon(toggle, next);
  });
}

function updateIcon(toggle, theme) {
  const icon = toggle.querySelector("i");
  if (!icon) return;
  if (theme === "dark") {
    icon.className = "fa-solid fa-sun";
  } else {
    icon.className = "fa-solid fa-moon";
  }
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const fields = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    message: document.getElementById("message"),
  };

  const errors = {
    name: document.getElementById("name-error"),
    email: document.getElementById("email-error"),
    message: document.getElementById("message-error"),
  };

  const status = document.getElementById("form-status");

  const setError = (key, text) => {
    errors[key].textContent = text;
  };

  const clearErrors = () => {
    Object.keys(errors).forEach((key) => {
      errors[key].textContent = "";
    });
    status.textContent = "";
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();

    let valid = true;

    if (!fields.name.value.trim()) {
      setError("name", "Please enter your name.");
      valid = false;
    }

    const emailValue = fields.email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue) {
      setError("email", "Please enter your email.");
      valid = false;
    } else if (!emailRegex.test(emailValue)) {
      setError("email", "Please enter a valid email address.");
      valid = false;
    }

    if (!fields.message.value.trim()) {
      setError("message", "Please enter your message.");
      valid = false;
    }

    if (!valid) {
      status.textContent = "Please fix the highlighted fields.";
      status.style.color = "#b42d2d";
      return;
    }

    status.textContent =
      "Message validated successfully. Connect via email or phone to continue.";
    status.style.color = "#1d6b3a";
    form.reset();
  });
}
