const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const menuButton = document.getElementById("menuButton");
const siteNav = document.getElementById("siteNav");
const scrollProgress = document.getElementById("scrollProgress");
const storedTheme = localStorage.getItem("portfolio-theme");

if (storedTheme) {
  root.dataset.theme = storedTheme;
} else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
  root.dataset.theme = "dark";
}

function toggleTheme() {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("portfolio-theme", nextTheme);
}

themeToggle?.addEventListener("click", toggleTheme);

menuButton?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  document.body.classList.toggle("menu-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

function updateScrollProgress() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -45px 0px" }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = Number(counter.dataset.count || "0");
      const duration = 950;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(progress * target);
        counter.textContent = String(value);
        if (progress < 1) requestAnimationFrame(tick);
        else counter.textContent = String(target);
      }

      requestAnimationFrame(tick);
      counterObserver.unobserve(counter);
    });
  },
  { threshold: 0.45 }
);

document.querySelectorAll("[data-count]").forEach((counter) => counterObserver.observe(counter));

const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      const categories = (card.dataset.category || "").split(" ");
      const show = filter === "all" || categories.includes(filter);
      card.classList.toggle("is-hidden", !show);
    });
  });
});

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".site-nav a[href^='#']")];

function updateActiveNav() {
  const offset = window.scrollY + 120;
  let current = sections[0]?.id;
  sections.forEach((section) => {
    if (section.offsetTop <= offset) current = section.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}

window.addEventListener("scroll", updateActiveNav, { passive: true });
updateActiveNav();

const contactForm = document.getElementById("contactForm");
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("senderName").value.trim();
  const email = document.getElementById("senderEmail").value.trim();
  const message = document.getElementById("senderMessage").value.trim();

  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

  window.location.href = `mailto:BadrBassam567@gmail.com?subject=${subject}&body=${body}`;
});

const copyEmailButton = document.getElementById("copyEmail");
copyEmailButton?.addEventListener("click", async () => {
  const email = "BadrBassam567@gmail.com";
  try {
    await navigator.clipboard.writeText(email);
    copyEmailButton.textContent = "Email Copied";
    setTimeout(() => (copyEmailButton.textContent = "Copy Email"), 1600);
  } catch {
    window.location.href = `mailto:${email}`;
  }
});
