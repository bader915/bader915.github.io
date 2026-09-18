(function () {
  "use strict";

  /* ---------- Spinner ---------- */
  var spinner = document.getElementById("spinner");
  if (spinner) {
    window.addEventListener("load", function () {
      setTimeout(function () { spinner.classList.remove("show"); }, 300);
    });
    // Fallback in case load already fired
    setTimeout(function () { spinner.classList.remove("show"); }, 1200);
  }

  /* ---------- Helpers ---------- */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  /* ---------- Typed effect ---------- */
  function startTyped(strings) {
    var typedOutput = document.querySelector(".typed-text-output");
    if (!typedOutput) return;

    if (!strings.length) {
      typedOutput.textContent = "";
      return;
    }

    var si = 0, ci = 0, deleting = false;
    function tick() {
      var current = strings[si];
      if (!deleting) {
        ci++;
        typedOutput.textContent = current.slice(0, ci);
        if (ci === current.length) {
          deleting = true;
          setTimeout(tick, 1600);
          return;
        }
      } else {
        ci--;
        typedOutput.textContent = current.slice(0, ci);
        if (ci === 0) {
          deleting = false;
          si = (si + 1) % strings.length;
        }
      }
      setTimeout(tick, deleting ? 24 : 90);
    }
    tick();
  }

  /* ---------- Renderers ---------- */
  function renderSkillBar(skill) {
    var wrap = el("div", "skill mb-4");
    var head = el("div", "d-flex justify-content-between");
    head.appendChild(el("p", "mb-2", skill.name));
    head.appendChild(el("p", "mb-2", skill.level + "%"));
    wrap.appendChild(head);

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

    var cols = [el("div", "col-sm-6"), el("div", "col-sm-6")];
    data.skills.forEach(function (skill, i) {
      cols[i < Math.ceil(data.skills.length / 2) ? 0 : 1].appendChild(renderSkillBar(skill));
    });
    mount.appendChild(cols[0]);
    mount.appendChild(cols[1]);

    var notesMount = document.getElementById("skillNotesMount");
    if (notesMount) {
      (data.skillNotes || []).forEach(function (note) {
        notesMount.appendChild(el("p", "mb-2", note));
      });
    }
  }

  function renderTimelineEntry(entry) {
    var item = el("div", "position-relative mb-4");
    var marker = el("span", "timeline-marker bi bi-arrow-right fs-4 text-light position-absolute");
    marker.setAttribute("aria-hidden", "true");
    item.appendChild(marker);

    item.appendChild(el("h5", "mb-1", entry.title));

    var meta = el("p", "mb-2");
    var orgLine = entry.org;
    if (entry.location) orgLine += ", " + entry.location;
    meta.appendChild(document.createTextNode(orgLine + " | "));
    var period = el("small", null, entry.period);
    meta.appendChild(period);
    item.appendChild(meta);

    if (entry.description) {
      item.appendChild(el("p", null, entry.description));
    }
    return item;
  }

  function renderTimeline(entries, mountId) {
    var mount = document.getElementById(mountId);
    if (!mount) return;
    entries.forEach(function (entry) { mount.appendChild(renderTimelineEntry(entry)); });
  }

  function renderLanguages(languages) {
    var mount = document.getElementById("languagesMount");
    if (!mount || !languages.length) return;

    var label = el("span", "fw-medium text-primary", "Languages: ");
    mount.appendChild(label);
    mount.appendChild(document.createTextNode(
      languages.map(function (l) { return l.name + " (" + l.level + ")"; }).join(" · ")
    ));
  }

  function renderProject(project) {
    var mount = document.getElementById("portfolioMount");
    if (!mount) return;

    var col = el("div", "col-md-6 mb-4 portfolio-item " + project.category);

    if (project.image) {
      var frame = el("div", "position-relative overflow-hidden mb-2");
      var img = el("img", "img-fluid w-100");
      img.src = project.image;
      img.alt = project.imageAlt || project.title;
      img.loading = "lazy";
      frame.appendChild(img);

      var caption = el("div", "portfolio-caption");
      caption.appendChild(el("h5", null, project.title));
      if (project.badge) caption.appendChild(el("small", null, project.badge));
      frame.appendChild(caption);

      col.appendChild(frame);
    } else {
      var card = el("div", "bg-secondary p-4 h-100");
      card.appendChild(el("h5", "mb-2", project.title));
      card.appendChild(el("p", "mb-0", project.description));
      if (project.tools) card.appendChild(el("p", "mb-0", project.tools));
      if (project.metrics) card.appendChild(el("p", "mb-0", project.metrics));
      if (project.stack) card.appendChild(el("p", "mb-0 small", project.stack));
      col.appendChild(card);
    }
    mount.appendChild(col);
  }

  function renderCourse(course) {
    var mount = document.getElementById("certsMount");
    if (!mount) return;

    var col = el("div", "col-md-6");
    var link = el("a", "contact-tile");
    link.href = course.href;
    link.target = "_blank";
    link.rel = "noopener";

    var icon = el("span", "contact-icon");
    var iconGlyph = el("i", "fa fa-file-pdf");
    iconGlyph.setAttribute("aria-hidden", "true");
    icon.appendChild(iconGlyph);
    link.appendChild(icon);

    var text = el("span");
    text.appendChild(el("span", "contact-label", course.issuer + " · " + course.date + " · Click to open PDF"));
    text.appendChild(el("span", "contact-value", course.name));
    link.appendChild(text);

    col.appendChild(link);
    mount.appendChild(col);
  }

  function renderPortfolio(data) {
    startTyped(data.roles || []);
    renderSkills(data);
    renderTimeline(data.experience || [], "experienceMount");
    renderTimeline(data.education || [], "educationMount");
    renderLanguages(data.languages || []);
    (data.selectedProjects || []).forEach(renderProject);
    (data.otherProjects || []).forEach(renderProject);
    (data.courses || []).forEach(renderCourse);
    initBars();
    initFilters();
  }

  /* ---------- Skill bars fill when scrolled into view ---------- */
  function initBars() {
    var bars = document.querySelectorAll('.progress[role="progressbar"]');
    if (!bars.length) return;

    function fill(p) {
      var inner = p.querySelector(".progress-bar");
      if (inner) inner.style.width = p.getAttribute("aria-valuenow") + "%";
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
      bars.forEach(function (b) { observer.observe(b); });
    } else {
      bars.forEach(fill);
    }
  }

  /* ---------- Portfolio filter ---------- */
  function initFilters() {
    var filters = document.querySelectorAll("#portfolio-filters button");
    var items = document.querySelectorAll(".portfolio-item");
    filters.forEach(function (f) {
      f.addEventListener("click", function () {
        filters.forEach(function (x) {
          x.classList.remove("active");
          x.setAttribute("aria-pressed", "false");
        });
        f.classList.add("active");
        f.setAttribute("aria-pressed", "true");

        var filter = f.getAttribute("data-filter") || "*";
        var className = filter.charAt(0) === "." ? filter.slice(1) : filter;

        items.forEach(function (item) {
          var show = filter === "*" || item.classList.contains(className);
          item.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* ---------- Data loading ---------- */
  fetch("data.json", { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Unable to load portfolio data: " + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      renderPortfolio(data);
    })
    .catch(function (error) {
      console.error(error);
      document.body.classList.add("data-load-error");
    });

  /* ---------- Smooth scroll for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var hash = a.getAttribute("href");
      if (hash.length > 1) {
        var target = document.querySelector(hash);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  /* ---------- Back to top ---------- */
  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 100) {
        backToTop.style.display = "block";
      } else {
        backToTop.style.display = "none";
      }
    });
    backToTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
