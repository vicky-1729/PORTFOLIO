// ========================================
// INITIALIZATION
// ========================================

document.addEventListener("DOMContentLoaded", function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Initialize AOS animations
  AOS.init({
    duration: 300,
    once: true,
    offset: 100,
  });

  // Hide loading screen
  setTimeout(() => {
    document.getElementById("loading-screen").classList.add("hidden");
  }, 1500);

  // Initialize all features
  initNavigation();
  initTypingEffect();
  initCounters();
  initThemeToggle();
  initScrollProgress();
  initBackToTop();
  if (!prefersReducedMotion) {
    initParticles();
  }
  initSkillBars();
  initExpandableDetails();
  initProjectModalActions();
  initCertificationCards();
  initContactInfoCards();
  initInteractiveHighlights();
});

// ========================================
// NAVIGATION
// ========================================

function initNavigation() {
  const navbar = document.getElementById("navbar");
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section, .hero-section");

  let ticking = false;

  const onScroll = () => {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  };

  const requestTick = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      onScroll();
      ticking = false;
    });
  };

  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 992) {
      navMenu.classList.remove("active");
      mobileMenuToggle.classList.remove("active");
      mobileMenuToggle.setAttribute("aria-expanded", "false");
      navMenu.setAttribute("aria-hidden", "false");
    } else {
      navMenu.setAttribute(
        "aria-hidden",
        String(!navMenu.classList.contains("active")),
      );
    }
  });

  if (window.innerWidth > 992) {
    navMenu.setAttribute("aria-hidden", "false");
  }

  onScroll();

  // Mobile menu toggle
  mobileMenuToggle.addEventListener("click", () => {
    mobileMenuToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
    const isExpanded = mobileMenuToggle.classList.contains("active");
    mobileMenuToggle.setAttribute("aria-expanded", String(isExpanded));
    navMenu.setAttribute("aria-hidden", String(!isExpanded));
  });

  // Close mobile menu on link click
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenuToggle.classList.remove("active");
      navMenu.classList.remove("active");
      mobileMenuToggle.setAttribute("aria-expanded", "false");
      navMenu.setAttribute("aria-hidden", "true");
    });
  });
}

// ========================================
// TYPING EFFECT
// ========================================

function initTypingEffect() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const typingText = document.getElementById("typing-text");
    typingText.textContent = "AWS DevOps Engineer";
    return;
  }

  const typingText = document.getElementById("typing-text");
  const texts = [
    "AWS DevOps Engineer",
    "Terraform Specialist",
    "Kubernetes Expert",
    "CI/CD Automation",
    "DevSecOps Practitioner",
    "Cloud Infrastructure Architect",
  ];

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentText = texts[textIndex];

    if (isDeleting) {
      typingText.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingText.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

// ========================================
// ANIMATED COUNTERS
// ========================================

function initCounters() {
  const counters = document.querySelectorAll(".stat-number");
  const speed = 200;

  const observerOptions = {
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseFloat(counter.getAttribute("data-count"));
        const increment = target / speed;
        let count = 0;

        const suffix = counter.getAttribute("data-suffix") || "";
        
        const updateCounter = () => {
          count += increment;
          if (count < target) {
            counter.textContent = Math.ceil(count) + suffix;
            requestAnimationFrame(updateCounter);
          } else {
            const finalValue = target % 1 === 0 ? target : target.toFixed(1);
            counter.textContent = finalValue + suffix;
          }
        };

        updateCounter();
        observer.unobserve(counter);
      }
    });
  }, observerOptions);

  counters.forEach((counter) => observer.observe(counter));
}

// ========================================
// THEME TOGGLE
// ========================================

function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  const html = document.documentElement;

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme") || "light";
  html.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";

    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector("i");
    icon.className = theme === "light" ? "fas fa-moon" : "fas fa-sun";
  }
}

// ========================================
// SCROLL PROGRESS
// ========================================

function initScrollProgress() {
  const scrollProgress = document.getElementById("scroll-progress");
  let ticking = false;

  const updateProgress = () => {
    const windowHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled =
      windowHeight > 0 ? (window.scrollY / windowHeight) * 100 : 0;
    scrollProgress.style.width = scrolled + "%";
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
    },
    { passive: true },
  );

  updateProgress();
}

// ========================================
// BACK TO TOP BUTTON
// ========================================

function initBackToTop() {
  const backToTop = document.getElementById("back-to-top");

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 500) {
        backToTop.classList.add("show");
      } else {
        backToTop.classList.remove("show");
      }
    },
    { passive: true },
  );

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ========================================
// EXPERIENCE TOGGLE DETAILS
// ========================================

function toggleDetails(button) {
  const details = button.nextElementSibling;

  button.classList.toggle("active");
  details.classList.toggle("show");
  const isExpanded = details.classList.contains("show");
  button.setAttribute("aria-expanded", String(isExpanded));

  if (isExpanded) {
    button.querySelector("span").textContent = "Hide Details";
  } else {
    button.querySelector("span").textContent = "View Details";
  }
}

function initExpandableDetails() {
  const expandButtons = document.querySelectorAll("[data-expand-details]");
  expandButtons.forEach((button) => {
    button.addEventListener("click", () => toggleDetails(button));
  });
}

// ========================================
// PROJECT MODAL
// ========================================

const projectDetails = {
  project1: {
    title: "Multi-AZ HA/DR Infrastructure",
    description: `Architected a highly available and disaster recovery-ready infrastructure on AWS that serves over 10,000 daily users with 99.9% uptime. The solution spans multiple availability zones and implements comprehensive failover strategies.`,
    features: [
      "Multi-AZ deployment across 3 availability zones",
      "Auto Scaling Groups with predictive scaling policies",
      "Application Load Balancer with health checks",
      "Amazon EKS cluster with multi-AZ node groups",
      "RDS Multi-AZ with automated backups",
      "Route 53 health checks and failover routing",
      "CloudWatch alarms and automated recovery",
      "Defined RTO of 15 minutes and RPO of 5 minutes",
    ],
    technologies: [
      "AWS VPC",
      "EKS",
      "ALB",
      "Auto Scaling",
      "Route 53",
      "RDS Multi-AZ",
      "CloudWatch",
    ],
    impact: [
      "99.9% uptime achievement",
      "Zero data loss during failover tests",
      "RTO met consistently under 10 minutes",
      "Supports 10K+ concurrent users",
    ],
  },
  project2: {
    title: "DevSecOps CI/CD Pipeline",
    description: `Implemented comprehensive security scanning and compliance checks throughout the CI/CD pipeline, embodying shift-left security principles. Successfully remediated over 200 vulnerabilities and reduced security issues by 60%.`,
    features: [
      "SonarQube integration for code quality and security",
      "Veracode SAST/DAST scanning",
      "ECR image vulnerability scanning",
      "Dependabot for dependency updates",
      "Automated security gates in pipeline",
      "OWASP compliance checks",
      "Secret scanning with git-secrets",
      "Compliance reporting and metrics dashboard",
    ],
    technologies: [
      "Jenkins",
      "SonarQube",
      "Veracode",
      "ECR",
      "Dependabot",
      "OWASP ZAP",
    ],
    impact: [
      "200+ vulnerabilities remediated",
      "60% reduction in security issues",
      "50% fewer defects in production",
      "Automated compliance reporting",
    ],
  },
  project3: {
    title: "Terraform IaC Framework",
    description: `Built a comprehensive Infrastructure as Code framework using Terraform with 25+ reusable modules. The framework enables consistent, repeatable deployments and reduced environment setup time by 87%.`,
    features: [
      "25+ reusable Terraform modules",
      "Remote state management with S3 and DynamoDB",
      "Workspace-based environment separation",
      "Automated testing with Terratest",
      "Module versioning and registry",
      "Documentation generation",
      "Cost estimation integration",
      "Compliance policy enforcement with Sentinel",
    ],
    technologies: [
      "Terraform",
      "AWS",
      "S3",
      "DynamoDB",
      "Terratest",
      "Sentinel",
    ],
    impact: [
      "87% faster environment provisioning",
      "Consistent infrastructure across all environments",
      "Reduced human errors to near zero",
      "Improved team productivity",
    ],
  },
  project4: {
    title: "Zero-Downtime EKS Upgrade",
    description: `Successfully upgraded production Amazon EKS clusters from version 1.24 to 1.29 without any service interruption. Used blue-green node group replacement strategy with comprehensive testing.`,
    features: [
      "Rolling node group replacement strategy",
      "Automated pre-upgrade validation",
      "Workload compatibility testing",
      "Pod disruption budgets enforcement",
      "Real-time monitoring during upgrade",
      "Rollback procedures and testing",
      "Documentation of upgrade process",
      "Post-upgrade validation suite",
    ],
    technologies: ["Amazon EKS", "Kubernetes", "AWS", "kubectl", "Helm"],
    impact: [
      "Zero downtime during upgrades",
      "5 major version upgrades completed",
      "No service interruption",
      "Improved cluster security and features",
    ],
  },
  project5: {
    title: "AWS Cost Optimization Initiative",
    description: `Implemented comprehensive FinOps practices resulting in 25% monthly cost reduction. Used rightsizing, Reserved Instances, Spot Instances, and automated shutdown scheduling.`,
    features: [
      "AWS Cost Explorer analysis and recommendations",
      "EC2 rightsizing based on CloudWatch metrics",
      "Reserved Instance and Savings Plans optimization",
      "Spot Instance integration for non-critical workloads",
      "S3 Intelligent-Tiering and lifecycle policies",
      "Lambda-based automated shutdown scheduling",
      "Cost allocation tags and chargeback",
      "Monthly cost optimization reports",
    ],
    technologies: [
      "AWS",
      "Lambda",
      "EventBridge",
      "Cost Explorer",
      "CloudWatch",
      "Python",
    ],
    impact: [
      "25% monthly cost reduction",
      "$50K+ annual savings",
      "Improved resource utilization",
      "Automated cost management",
    ],
  },
  project6: {
    title: "Observability & Monitoring Stack",
    description: `Deployed a comprehensive observability solution using Prometheus, Grafana, and CloudWatch. Reduced Mean Time To Detect (MTTD) from 45 minutes to under 5 minutes through proactive monitoring.`,
    features: [
      "Prometheus for metrics collection",
      "Grafana dashboards with custom visualizations",
      "CloudWatch Logs integration",
      "Alertmanager for alert routing",
      "Jira and ServiceNow integration",
      "Custom exporters for application metrics",
      "Distributed tracing with Jaeger",
      "Log aggregation with ELK stack",
    ],
    technologies: [
      "Prometheus",
      "Grafana",
      "CloudWatch",
      "Alertmanager",
      "ELK",
      "Jaeger",
    ],
    impact: [
      "MTTD reduced from 45 min to 5 min",
      "89% faster incident detection",
      "Proactive issue identification",
      "Improved system reliability",
    ],
  },
  project7: {
    title: "VM to Microservices Migration",
    description: `Led the migration of 8 legacy VM-based monolithic applications to containerized microservices on Amazon EKS. Achieved 60% faster deployments and improved scalability.`,
    features: [
      "Application assessment and decomposition",
      "Containerization with Docker multi-stage builds",
      "EKS cluster design and implementation",
      "Service mesh with Istio",
      "Database migration strategies",
      "CI/CD pipeline modernization",
      "Monitoring and logging setup",
      "Phased migration with minimal downtime",
    ],
    technologies: ["Docker", "Kubernetes", "EKS", "Istio", "Helm", "Jenkins"],
    impact: [
      "60% faster deployments",
      "8 applications migrated successfully",
      "Improved scalability and resilience",
      "Reduced infrastructure costs",
    ],
  },
  project8: {
    title: "GitOps with Argo CD Implementation",
    description: `Implemented GitOps practices using Argo CD for declarative, version-controlled deployments. Enabled 4 engineering teams to deploy faster with better visibility and rollback capabilities.`,
    features: [
      "Argo CD setup and configuration",
      "Git repository structure for GitOps",
      "Helm charts standardization",
      "Multi-environment management",
      "RBAC and access control",
      "Automated sync and health checks",
      "Rollback and deployment history",
      "Integration with existing CI pipelines",
    ],
    technologies: ["Argo CD", "Kubernetes", "Helm", "Git", "GitHub Actions"],
    impact: [
      "40% faster deployments",
      "4 teams enabled with GitOps",
      "Improved deployment visibility",
      "Simplified rollback procedures",
    ],
  },
};

let lastFocusedElement = null;
let previousBodyOverflow = "";

function initProjectModalActions() {
  const learnMoreButtons = document.querySelectorAll(
    ".project-learn-more[data-project-id]",
  );
  const modalCloseButton = document.getElementById("project-modal-close");

  learnMoreButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openProjectModal(button.dataset.projectId);
    });
  });

  if (modalCloseButton) {
    modalCloseButton.addEventListener("click", closeProjectModal);
  }
}

function openProjectModal(projectId) {
  const modal = document.getElementById("project-modal");
  const modalBody = document.getElementById("modal-body");
  const project = projectDetails[projectId];

  if (!project) return;

  modalBody.innerHTML = `
        <h2 id="project-modal-title" class="section-title">${project.title}</h2>
        <p class="section-description">${project.description}</p>

        <h3>Key Features</h3>
        <ul class="responsibilities">
            ${project.features.map((feature) => `<li><i class="fas fa-check"></i><span>${feature}</span></li>`).join("")}
        </ul>

        <h3>Technologies Used</h3>
        <div class="tech-stack">
            ${project.technologies.map((tech) => `<span class="tech-badge">${tech}</span>`).join("")}
        </div>

        <h3>Impact & Results</h3>
        <ul class="responsibilities">
            ${project.impact.map((impact) => `<li><i class="fas fa-chart-line"></i><span>${impact}</span></li>`).join("")}
        </ul>
    `;

  lastFocusedElement = document.activeElement;
  previousBodyOverflow = document.body.style.overflow;

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  const closeButton = modal.querySelector(".modal-close");
  if (closeButton) {
    closeButton.focus();
  }
}

function closeProjectModal() {
  const modal = document.getElementById("project-modal");
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = previousBodyOverflow || "";
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

// Close modal on outside click
document.getElementById("project-modal").addEventListener("click", (e) => {
  if (e.target.id === "project-modal") {
    closeProjectModal();
  }
});

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  const modal = document.getElementById("project-modal");
  if (e.key === "Escape" && modal.classList.contains("show")) {
    closeProjectModal();
  }

  if (e.key === "Tab" && modal.classList.contains("show")) {
    const focusable = modal.querySelectorAll(
      'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

// ========================================
// PARTICLES ANIMATION
// ========================================

function initParticles() {
  const particlesContainer = document.getElementById("particles");
  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";

    const size = Math.random() * 5 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
    particle.style.animationDelay = `${Math.random() * 5}s`;

    particlesContainer.appendChild(particle);
  }
}

// ========================================
// SKILL BARS ANIMATION
// ========================================

function initSkillBars() {
  const skillBars = document.querySelectorAll(".progress-fill");

  const observerOptions = {
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.style.width;
        bar.style.width = "0";
        setTimeout(() => {
          bar.style.width = width;
        }, 100);
        observer.unobserve(bar);
      }
    });
  }, observerOptions);

  skillBars.forEach((bar) => observer.observe(bar));
}

// ========================================
// CERTIFICATION CARD LINKS
// ========================================

function initCertificationCards() {
  const certCards = document.querySelectorAll(".cert-card");

  certCards.forEach((card) => {
    const credentialLink = card.querySelector(".cert-issuer[href]");
    if (!credentialLink) return;

    card.classList.add("is-clickable");
    card.setAttribute("role", "link");
    card.setAttribute("tabindex", "0");

    card.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;
      window.open(credentialLink.href, "_blank", "noopener,noreferrer");
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        window.open(credentialLink.href, "_blank", "noopener,noreferrer");
      }
    });
  });
}

function initContactInfoCards() {
  const infoCards = document.querySelectorAll(".contact-info .info-card");

  infoCards.forEach((card) => {
    const primaryLink = card.querySelector(".info-details a[href]");
    if (!primaryLink) return;

    card.classList.add("is-clickable");
    card.setAttribute("role", "link");
    card.setAttribute("tabindex", "0");

    card.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;
      primaryLink.click();
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        primaryLink.click();
      }
    });
  });
}

// ========================================
// INTERACTIVE HIGHLIGHTS
// ========================================

function initInteractiveHighlights() {
  const interactiveSelectors = [
    ".skills-section .skill-item",
    ".skills-section .skill-tag",
    ".projects-section .tech-badge",
  ];

  const interactiveChips = document.querySelectorAll(
    interactiveSelectors.join(", "),
  );

  interactiveChips.forEach((chip) => {
    chip.classList.add("interactive-chip");
    chip.setAttribute("tabindex", "0");
    chip.setAttribute("role", "button");
    chip.setAttribute("aria-pressed", "false");

    chip.addEventListener("click", () => {
      const group = chip.parentElement;
      if (!group) return;

      const wasActive = chip.classList.contains("is-active");
      group.querySelectorAll(".interactive-chip").forEach((item) => {
        item.classList.remove("is-active");
        item.setAttribute("aria-pressed", "false");
      });

      if (!wasActive) {
        chip.classList.add("is-active");
        chip.setAttribute("aria-pressed", "true");
      }
    });

    chip.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        chip.click();
      }
    });
  });
}

// ========================================
// SMOOTH SCROLL
// ========================================

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});
