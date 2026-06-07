const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const menuButton = document.getElementById("menuButton");
const siteNav = document.getElementById("siteNav");
const scrollProgress = document.getElementById("scrollProgress");
const backTop = document.getElementById("backTop");
const storedTheme = localStorage.getItem("portfolio-theme");

if (storedTheme) {
  root.dataset.theme = storedTheme;
} else if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
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

function updateScrollState() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = `${progress}%`;
  backTop?.classList.toggle("visible", scrollTop > 650);
}

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

backTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

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
const projectCards = [...document.querySelectorAll(".project-card")];
const projectSearch = document.getElementById("projectSearch");
const projectMatchCount = document.getElementById("projectMatchCount");
const projectEmpty = document.getElementById("projectEmpty");
const resetProjects = document.getElementById("resetProjects");
let activeProjectFilter = "all";

function updateProjectDisplay() {
  const query = (projectSearch?.value || "").trim().toLowerCase();
  let visibleCount = 0;
  projectCards.forEach((card) => {
    const categories = (card.dataset.category || "").split(" ");
    const matchesFilter = activeProjectFilter === "all" || categories.includes(activeProjectFilter);
    const matchesSearch = !query || card.textContent.toLowerCase().includes(query);
    const show = matchesFilter && matchesSearch;
    card.classList.toggle("is-hidden", !show);
    if (show) visibleCount += 1;
  });
  if (projectMatchCount) {
    projectMatchCount.textContent = visibleCount === projectCards.length && !query && activeProjectFilter === "all"
      ? "Showing all projects"
      : `Showing ${visibleCount} of ${projectCards.length} projects`;
  }
  if (projectEmpty) projectEmpty.hidden = visibleCount !== 0;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeProjectFilter = button.dataset.filter || "all";
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    updateProjectDisplay();
  });
});

projectSearch?.addEventListener("input", updateProjectDisplay);
resetProjects?.addEventListener("click", () => {
  activeProjectFilter = "all";
  projectSearch.value = "";
  filterButtons.forEach((item) => item.classList.toggle("active", item.dataset.filter === "all"));
  updateProjectDisplay();
});

updateProjectDisplay();

const modal = document.getElementById("projectModal");
const modalClose = document.getElementById("modalClose");
const modalType = document.getElementById("modalType");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalTags = document.getElementById("modalTags");

function openProjectModal(card) {
  projectCards.forEach((item) => item.classList.remove("selected"));
  card.classList.add("selected");
  modalType.textContent = card.querySelector(".project-type")?.textContent || "Project";
  modalTitle.textContent = card.querySelector("h3")?.textContent || "Project summary";
  modalText.textContent = card.querySelector("p")?.textContent || "";
  modalTags.innerHTML = card.querySelector(".tech-tags")?.innerHTML || "";
  modal.hidden = false;
  modalClose.focus();
}

function closeProjectModal() {
  modal.hidden = true;
  projectCards.forEach((item) => item.classList.remove("selected"));
}

projectCards.forEach((card) => {
  card.setAttribute("tabindex", "0");
  card.addEventListener("click", () => openProjectModal(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProjectModal(card);
    }
  });
});

modalClose?.addEventListener("click", closeProjectModal);
modal?.addEventListener("click", (event) => {
  if (event.target === modal) closeProjectModal();
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal && !modal.hidden) closeProjectModal();
});

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".site-nav a[href^='#']")];

function updateActiveNav() {
  const offset = window.scrollY + 120;
  let current = sections[0]?.id;
  sections.forEach((section) => {
    if (section.offsetTop <= offset) current = section.id;
  });
  navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${current}`));
}

window.addEventListener("scroll", updateActiveNav, { passive: true });
updateActiveNav();

const swotCards = document.querySelectorAll(".swot-card");
const swotInspector = document.getElementById("swotInspector");
swotCards.forEach((card) => {
  card.setAttribute("tabindex", "0");
  const show = () => {
    swotCards.forEach((item) => item.classList.remove("selected"));
    card.classList.add("selected");
    if (swotInspector) {
      swotInspector.querySelector("strong").textContent = card.querySelector("h3")?.textContent || "SWOT note";
      swotInspector.querySelector("p").textContent = card.querySelector("p")?.textContent || "";
    }
  };
  card.addEventListener("click", show);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      show();
    }
  });
});

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
