(function () {
  "use strict";

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function startTyped(strings) {
    var output = document.querySelector(".typed-text-output");
    strings = Array.isArray(strings) ? strings.filter(Boolean) : [];
    if (!output || !strings.length) return;

    var stringIndex = 0;
    var characterIndex = 0;
    var deleting = false;
    function tick() {
      var current = strings[stringIndex];
      characterIndex += deleting ? -1 : 1;
      output.textContent = current.slice(0, characterIndex);
      if (!deleting && characterIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
      if (deleting && characterIndex === 0) {
        deleting = false;
        stringIndex = (stringIndex + 1) % strings.length;
      }
      setTimeout(tick, deleting ? 24 : 90);
    }
    tick();
  }

  function renderSkillBar(skill) {
    var wrap = el("div", "skill mb-4");
    var heading = el("div", "d-flex justify-content-between");
    heading.appendChild(el("p", "mb-2", skill.name));
    heading.appendChild(el("p", "mb-2", String(skill.level) + "%"));
    wrap.appendChild(heading);

    var track = el("div", "progress");
    track.setAttribute("role", "progressbar");
    track.setAttribute("aria-label", skill.name + " skill level");
    track.setAttribute("aria-valuenow", String(skill.level));
    track.setAttribute("aria-valuemin", "0");
    track.setAttribute("aria-valuemax", "100");
    track.appendChild(el("div", "progress-bar bg-primary"));
    wrap.appendChild(track);
    return wrap;
  }

  function renderSkills(data) {
    var mount = document.getElementById("skillsMount");
    if (!mount) return;
    var skills = Array.isArray(data.skills) ? data.skills.filter(function (skill) {
      return skill && skill.name;
    }) : [];
    var columns = [el("div", "col-sm-6"), el("div", "col-sm-6")];
    skills.forEach(function (skill, index) {
      columns[index < Math.ceil(skills.length / 2) ? 0 : 1].appendChild(renderSkillBar(skill));
    });
    columns.forEach(function (column) { mount.appendChild(column); });

    var notes = document.getElementById("skillNotesMount");
    (Array.isArray(data.skillNotes) ? data.skillNotes : []).forEach(function (note) {
      if (notes && note) notes.appendChild(el("p", "mb-2", note));
    });
  }

  function renderTimelineEntry(entry, isEducation) {
    var item = el("div", "position-relative mb-4");
    var marker = el("span", "timeline-marker bi bi-arrow-right fs-4 text-light position-absolute");
    marker.setAttribute("aria-hidden", "true");
    item.appendChild(marker);
    item.appendChild(el("h5", "mb-1", isEducation ? entry.degree : entry.title));

    var meta = el("p", "mb-2");
    var organization = isEducation ? entry.school : entry.org;
    if (!isEducation && entry.location) organization += ", " + entry.location;
    meta.appendChild(document.createTextNode((organization || "") + (organization ? " | " : "")));
    meta.appendChild(el("small", null, entry.period || ""));
    item.appendChild(meta);
    if (entry.description) item.appendChild(el("p", null, entry.description));
    return item;
  }

  function renderTimeline(entries, mountId, isEducation) {
    var mount = document.getElementById(mountId);
    if (!mount) return;
    (Array.isArray(entries) ? entries : []).forEach(function (entry) {
      if (entry && (isEducation ? entry.degree : entry.title)) {
        mount.appendChild(renderTimelineEntry(entry, isEducation));
      }
    });
  }

  function renderLanguages(languages) {
    var mount = document.getElementById("languagesMount");
    if (!mount || !Array.isArray(languages)) return;
    var validLanguages = languages.filter(function (language) {
      return language && language.name && language.level;
    });
    if (!validLanguages.length) return;
    mount.appendChild(el("span", "fw-medium text-primary", "Languages: "));
    mount.appendChild(document.createTextNode(validLanguages.map(function (language) {
      return language.name + " (" + language.level + ")";
    }).join(" · ")));
  }

  function renderProject(project) {
    var mount = document.getElementById("portfolioMount");
    if (!mount || !project || !project.title) return;
    var category = project.category || "software";
    var column = el("div", "col-md-6 mb-4 portfolio-item project-reveal " + category);

    if (project.image) {
      var frame = el("div", "position-relative overflow-hidden mb-2");
      var image = el("img", "img-fluid w-100");
      image.src = project.image;
      image.alt = project.imageAlt || project.title;
      image.loading = "lazy";
      frame.appendChild(image);
      var caption = el("div", "portfolio-caption");
      caption.appendChild(el("h5", null, project.title));
      if (project.badge) caption.appendChild(el("small", null, project.badge));
      frame.appendChild(caption);
      column.appendChild(frame);
    } else {
      var card = el("div", "bg-secondary p-4 h-100");
      card.appendChild(el("h5", "mb-2", project.title));
      [project.description, project.tools, project.metrics].forEach(function (value) {
        if (value) card.appendChild(el("p", "mb-0", value));
      });
      if (project.stack) card.appendChild(el("p", "mb-0 small", project.stack));
      column.appendChild(card);
    }
    mount.appendChild(column);
  }

  function renderCourse(course) {
    var mount = document.getElementById("certsMount");
    if (!mount || !course || !course.name || !course.href) return;
    var column = el("div", "col-md-6");
    var link = el("a", "contact-tile");
    link.href = course.href;
    link.target = "_blank";
    link.rel = "noopener";
    link.setAttribute("aria-label", "Open " + course.name + " certificate PDF");
    var icon = el("span", "contact-icon");
    var glyph = el("i", "fa fa-file-pdf");
    glyph.setAttribute("aria-hidden", "true");
    icon.appendChild(glyph);
    link.appendChild(icon);
    var text = el("span");
    text.appendChild(el("span", "contact-label", (course.issuer || "") + " · " + (course.date || "") + " · Click to open PDF"));
    text.appendChild(el("span", "contact-value", course.name));
    link.appendChild(text);
    column.appendChild(link);
    mount.appendChild(column);
  }

  function initBars() {
    var bars = document.querySelectorAll('.progress[role="progressbar"]');
    function fill(track) {
      var inner = track.querySelector(".progress-bar");
      if (inner) inner.style.width = track.getAttribute("aria-valuenow") + "%";
    }
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            fill(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      bars.forEach(function (bar) { observer.observe(bar); });
    } else {
      bars.forEach(fill);
    }
  }

  function initFilters() {
    var filters = document.querySelectorAll("#portfolio-filters button");
    var items = document.querySelectorAll(".portfolio-item");
    filters.forEach(function (filterButton) {
      filterButton.addEventListener("click", function () {
        filters.forEach(function (button) {
          button.classList.remove("active");
          button.setAttribute("aria-pressed", "false");
        });
        filterButton.classList.add("active");
        filterButton.setAttribute("aria-pressed", "true");
        var filter = filterButton.getAttribute("data-filter") || "*";
        var className = filter.charAt(0) === "." ? filter.slice(1) : filter;
        items.forEach(function (item) {
          item.style.display = filter === "*" || item.classList.contains(className) ? "" : "none";
        });
      });
    });
  }

  function initProjectReveal() {
    var projects = document.querySelectorAll(".project-reveal");
    if (!projects.length) return;

    projects.forEach(function (project, index) {
      project.style.setProperty("--project-delay", (index % 4) * 70 + "ms");
      project.style.setProperty("--project-shift", index % 2 ? "42px" : "-42px");
    });

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      projects.forEach(function (project) { project.classList.add("is-visible"); });
      return;
    }

    if (!("IntersectionObserver" in window)) {
      projects.forEach(function (project) { project.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    projects.forEach(function (project) { observer.observe(project); });
  }

  function renderPortfolio(data) {
    data = data && typeof data === "object" ? data : {};
    startTyped(data.roles);
    renderSkills(data);
    renderTimeline(data.experience, "experienceMount", false);
    renderTimeline(data.education, "educationMount", true);
    renderLanguages(data.languages);
    (Array.isArray(data.selectedProjects) ? data.selectedProjects : []).forEach(renderProject);
    (Array.isArray(data.otherProjects) ? data.otherProjects : []).forEach(renderProject);
    (Array.isArray(data.courses) ? data.courses : []).forEach(renderCourse);
    initBars();
    initFilters();
    initProjectReveal();
  }

  var spinner = document.getElementById("spinner");
  if (spinner) {
    window.addEventListener("load", function () { setTimeout(function () { spinner.classList.remove("show"); }, 300); });
    setTimeout(function () { spinner.classList.remove("show"); }, 1200);
  }

  fetch("data.json", { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) throw new Error("Unable to load portfolio data: " + response.status);
      return response.json();
    })
    .then(function (data) {
      if (!data || typeof data !== "object") throw new Error("Portfolio data must be a JSON object");
      renderPortfolio(data);
    })
    .catch(function (error) {
      console.error(error);
      document.body.classList.add("data-load-error");
    });

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      var hash = anchor.getAttribute("href");
      var target = hash && hash.length > 1 ? document.querySelector(hash) : null;
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", function () { backToTop.style.display = window.scrollY > 100 ? "block" : "none"; });
    backToTop.addEventListener("click", function (event) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
